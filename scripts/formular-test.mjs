/**
 * Formular-Pfad im Browser – der Test, den scripts/smoke-test.mjs nicht
 * leisten kann.
 *
 * Aufruf (setzt einen vorhandenen Build voraus):
 *   npm run build
 *   npm run test:formular
 *
 * ==========================================================================
 * WAS HIER BEWIESEN WIRD – VIER KANAL-LAGEN, NICHT ZWEI
 * ==========================================================================
 * Das Formular hat ZWEI Wege: die Mail über Brevo und die Übergabe ans CRM.
 * Seit der Umstellung gilt die Anfrage als angekommen, sobald EINER davon
 * trägt. Also müssen alle vier Kombinationen geprüft werden:
 *
 *   A  beide erreichbar -> Bestätigung, KEIN Teil-Ausfall im Log, und der
 *                          CRM-Endpunkt hat genau eine Anfrage mit dem
 *                          richtigen Header und den erwarteten Feldern.
 *   B  nur CRM trägt    -> Bestätigung. DAS IST DER GEMELDETE FEHLER: Vorher
 *                          entschied allein die Mail, und der Besucher las
 *                          „could not be submitted", während seine Anfrage
 *                          längst im CRM lag.
 *   C  nur Mail trägt   -> Bestätigung, CRM-Fehler im Log.
 *   D  beide tot        -> Fehlermeldung – und NUR dann.
 *
 * Dazu E: Validierungsfehler, stille Bestätigung nach Honeypot, Rate-Limit
 * und Zeitüberschreitung. Und F: das Forschungsformular mit source=forschung.
 *
 * ==========================================================================
 * KEIN DEMO_DRY_RUN MEHR – ER VERSTECKTE DEN INTERESSANTEN FALL
 * ==========================================================================
 * Die Variable ließ den Mailversand IMMER gelingen. Damit war Lage B – ein
 * EINGERICHTETER Versand, der fehlschlägt – unerreichbar, und genau die war
 * der Fehler im Betrieb. An ihre Stelle tritt ein Schein-Brevo auf
 * 127.0.0.1, dessen Antwort der Test bestimmt. brevo.ts nimmt diesen
 * Endpunkt nur an, WEIL er auf dem eigenen Rechner liegt – die Schranke
 * steht dort und ist der Grund, warum eine Umgebungsvariable den Mailversand
 * nicht irgendwohin umlenken kann.
 *
 * ==========================================================================
 * UND DIE SPRACHE DER FEHLERZUSTÄNDE WIRD GEPRÜFT
 * ==========================================================================
 * Fehlermeldung, Validierungshinweise, Rate-Limit-Text: Diese Sätze stehen in
 * KEINEM ausgelieferten HTML. Sie entstehen erst, wenn etwas schiefgeht, und
 * haben sich deshalb vor jedem Detektor versteckt. Jeder erzwungene Zustand
 * läuft hier durch dieselben Muster wie der Deutsch-Detektor.
 *
 * Der Test startet seinen eigenen `next start` auf einem eigenen Port und
 * räumt ihn wieder ab. Ein laufender Entwicklungsserver stört nicht.
 *
 * Keine zusätzlichen Pakete: CDP über die eingebauten `fetch` und `WebSocket`,
 * die Schein-Endpunkte über `node:http`.
 */
import { spawn } from "node:child_process";
import http from "node:http";

import { findeDeutsch } from "./lib/deutsch-muster.mjs";

const EDGE =
  process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const APP_PORT = 3311;
const CRM_PORT = 3312;
const MAIL_PORT = 3313;
const CDP_PORT = 9393;

/** Adresse, an der garantiert nichts lauscht – Port 1 auf dem Loopback. */
const TOTE_ADRESSE = "http://127.0.0.1:1/inbound";
const TOTE_MAIL = "http://127.0.0.1:1/v3/smtp/email";

const TEST_KEY = "test-schluessel-nur-lokal";
const TEST_MAIL_KEY = "test-mailschluessel-nur-lokal";

/**
 * Gesammelte Texte aller erzwungenen Zustände – für die Sprachprüfung.
 *
 * Ein Zustand wird hier abgelegt, sobald er auf dem Bildschirm stand. Am Ende
 * laufen alle durch findeDeutsch(), dieselbe Funktion, die der HTML-Detektor
 * benutzt. Eine Kopie wäre die Stelle, an der eine ergänzte Wortliste nur in
 * einem der beiden Prüfwege wirkt.
 */
const ZUSTAENDE = [];
const merkeZustand = (name, text) => {
  ZUSTAENDE.push({
    name,
    text: String(text || "")
      .replace(/\s+/g, " ")
      .trim(),
  });
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Prozess samt Kindern beenden – und warten, bis der Port wirklich frei ist.
 *
 * WARUM DAS NICHT `kind.kill()` SEIN DARF:
 * Unter Windows startet `spawn(..., { shell: true })` erst eine Shell, die
 * dann `node` startet. `kill()` beendet die Shell; der Server läuft weiter.
 * Beim zweiten Durchlauf hat die Bereitschaftsprüfung dann den ALTEN Server
 * gefunden, der noch auf das erreichbare Schein-CRM zeigte – Durchlauf B hat
 * damit nicht geprüft, was er zu prüfen behauptet. Der Test hat das selbst
 * gemeldet („der Schein-Endpunkt bekam nichts" schlug fehl), und genau dafür
 * ist die Zusatzprüfung da.
 */
async function beende(kind) {
  if (!kind) return;
  if (process.platform === "win32") {
    await new Promise((r) => {
      spawn("taskkill", ["/pid", String(kind.pid), "/T", "/F"], {
        stdio: "ignore",
      }).on("close", r);
    });
  } else {
    kind.kill("SIGTERM");
  }
}

/** Wartet, bis auf dem Port niemand mehr antwortet. */
async function portFrei(port) {
  for (let i = 0; i < 40; i++) {
    try {
      await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(400) });
    } catch {
      return true;
    }
    await sleep(300);
  }
  return false;
}

let probleme = 0;
const pruefe = (bedingung, text) => {
  console.log(`  ${bedingung ? "ok    " : "FEHLER"}  ${text}`);
  if (!bedingung) probleme++;
};

/* ========================================================================= */
/* Schein-CRM                                                                */
/* ========================================================================= */
function starteScheinCrm() {
  const empfangen = [];
  const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", (teil) => (body += teil));
    req.on("end", () => {
      empfangen.push({
        method: req.method,
        key: req.headers["x-website-key"],
        contentType: req.headers["content-type"],
        body: (() => {
          try {
            return JSON.parse(body);
          } catch {
            return null;
          }
        })(),
      });
      res.writeHead(202, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    });
  });
  return new Promise((resolve) => {
    server.listen(CRM_PORT, "127.0.0.1", () => resolve({ server, empfangen }));
  });
}

/**
 * Ein Mailversand, dessen Antwort der Test bestimmt.
 *
 * 202 = angenommen, 401 = Schlüssel abgelehnt. Der zweite Fall ist der
 * gemeldete Fehler: ein EINGERICHTETER Versand, der scheitert. Ohne diesen
 * Schein-Endpunkt ließe er sich nur nachstellen, indem man Brevo wirklich
 * anruft.
 *
 * brevo.ts nimmt ihn nur an, weil er auf 127.0.0.1 liegt.
 */
function starteScheinMail() {
  const empfangen = [];
  let status = 202;
  const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", (teil) => (body += teil));
    req.on("end", () => {
      empfangen.push({
        method: req.method,
        key: req.headers["api-key"],
        body: (() => {
          try {
            return JSON.parse(body);
          } catch {
            return null;
          }
        })(),
      });
      res.writeHead(status, { "content-type": "application/json" });
      res.end(
        status >= 400
          ? JSON.stringify({ message: "Key not found", code: "unauthorized" })
          : JSON.stringify({ messageId: "<test@example.org>" }),
      );
    });
  });
  return new Promise((resolve) => {
    server.listen(MAIL_PORT, "127.0.0.1", () =>
      resolve({
        server,
        empfangen,
        setzeStatus: (neu) => {
          status = neu;
        },
      }),
    );
  });
}

/* ========================================================================= */
/* Anwendung                                                                 */
/* ========================================================================= */
/**
 * Startet die Anwendung mit einer bestimmten KANAL-LAGE.
 *
 * `crmUrl` und `mailUrl` bestimmen, welcher Weg trägt und welcher scheitert.
 * DEMO_DRY_RUN ist bewusst NICHT gesetzt – siehe Kopfkommentar.
 */
async function starteApp({ crmUrl, mailUrl }) {
  const kind = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["--no-install", "next", "start", "-p", String(APP_PORT)],
    {
      env: {
        ...process.env,
        CRM_INBOUND_URL: crmUrl,
        WEBSITE_INBOUND_KEY: TEST_KEY,
        // Der Ersatz-Endpunkt wird von brevo.ts nur angenommen, weil er auf
        // 127.0.0.1 zeigt – siehe die Schranke dort.
        BREVO_ENDPOINT_LOCAL: mailUrl,
        BREVO_API_KEY: TEST_MAIL_KEY,
        DEMO_MAIL_FROM: "test-absender@example.org",
        DEMO_MAIL_TO: "test-empfaenger@example.org",
      },
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    },
  );

  const logs = [];
  kind.stdout.on("data", (d) => logs.push(String(d)));
  kind.stderr.on("data", (d) => logs.push(String(d)));

  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${APP_PORT}/meet`);
      if (res.status === 200) return { kind, logs };
    } catch {}
    await sleep(500);
  }
  throw new Error("Anwendung startet nicht:\n" + logs.join(""));
}

/* ========================================================================= */
/* Browser                                                                   */
/* ========================================================================= */
async function starteBrowser() {
  const kind = spawn(EDGE, [
    "--headless",
    "--disable-gpu",
    "--no-first-run",
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${(process.env.TEMP || "/tmp").split("\\").join("/")}/claude/edge-formular`,
    "about:blank",
  ]);

  let ziel = null;
  for (let i = 0; i < 60; i++) {
    try {
      const liste = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
      ziel = liste.find((x) => x.type === "page");
      if (ziel) break;
    } catch {}
    await sleep(300);
  }
  if (!ziel) throw new Error("Browser startet nicht");

  const ws = new WebSocket(ziel.webSocketDebuggerUrl);
  let id = 0;
  const offen = new Map();
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && offen.has(m.id)) {
      offen.get(m.id)(m.result);
      offen.delete(m.id);
    }
  };
  const send = (methode, params) =>
    new Promise((r) => {
      const i = ++id;
      offen.set(i, r);
      ws.send(JSON.stringify({ id: i, method: methode, params: params || {} }));
    });

  await send("Page.enable");
  await send("Runtime.enable");
  const lies = async (ausdruck) =>
    (await send("Runtime.evaluate", { expression: ausdruck, returnByValue: true })).result
      ?.value;

  return { kind, send, lies };
}

/**
 * Füllt und sendet das Formular.
 *
 * Die Felder sind kontrollierte React-Eingaben: Ein schlichtes `el.value = x`
 * setzt zwar das DOM, aber nicht den Zustand – React überschreibt es beim
 * nächsten Rendern. Der Wert muss deshalb über den nativen Setter gesetzt und
 * mit einem `input`-Ereignis gemeldet werden.
 */
const AUSFUELLEN = `(() => {
  const setzeText = (el, wert) => {
    const proto = el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, wert);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const feld = (name) => document.querySelector('[name="' + name + '"]');

  setzeText(feld('name'), 'Testerin Formularpfad');
  setzeText(feld('school'), 'Musterschule Formularpfad');
  setzeText(feld('email'), 'formularpfad@example.org');
  setzeText(feld('message'), 'Automatischer Test der CRM-Übergabe.');

  const rolle = feld('role');
  Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')
    .set.call(rolle, 'School leadership');
  rolle.dispatchEvent(new Event('change', { bubbles: true }));

  const zustimmung = feld('consent');
  if (!zustimmung.checked) zustimmung.click();
  return true;
})()`;

const ABSENDEN = `(() => {
  const knopf = [...document.querySelectorAll('button[type="submit"]')][0];
  if (!knopf) return 'kein Absende-Knopf';
  knopf.click();
  return 'geklickt';
})()`;

async function durchlauf(browser, name, url, erwarte = "erfolg") {
  const { send, lies } = browser;
  await send("Page.navigate", {
    url: `http://127.0.0.1:${APP_PORT}${url}?utm_source=newsletter&utm_medium=email&utm_campaign=schulleitung-2026`,
  });
  await sleep(2500);

  await lies(AUSFUELLEN);

  // MIN_FILL_MS ist 3000 ms. Wer schneller abschickt, wird als Skript
  // behandelt und bekommt eine stille Erfolgsmeldung OHNE Versand – der Test
  // würde dann grün leuchten, ohne irgendetwas bewiesen zu haben.
  await sleep(3600);

  await lies(ABSENDEN);

  let text = "";
  for (let i = 0; i < 30; i++) {
    await sleep(400);
    text = (await lies("document.querySelector('main').innerText")) || "";
    if (/Thank you for your request|could not be submitted|not set up/.test(text)) break;
  }

  // Der Text landet IMMER in der Sammlung – auch der Fehlerfall, gerade der.
  merkeZustand(name, text);

  const bestaetigt = /Thank you for your request/.test(text);
  if (erwarte === "erfolg") {
    pruefe(bestaetigt, `${name}: Bestätigung „Thank you for your request." sichtbar`);
  } else {
    pruefe(!bestaetigt, `${name}: KEINE Bestätigung – wie erwartet`);
  }
  if (bestaetigt !== (erwarte === "erfolg")) {
    console.log("    Sichtbarer Text war: " + text.replace(/\s+/g, " ").slice(0, 220));
  }
  return { bestaetigt, text };
}

/* ========================================================================= */
/* Ablauf                                                                    */
/* ========================================================================= */
/**
 * Belegte Ports sind ein ABBRUCH, kein Hinweis.
 *
 * Ohne diese Prüfung hängt sich der Test an einen fremden Prozess: Die
 * Bereitschaftsprüfung sieht eine 200 auf dem Port, der eigene `next start`
 * stirbt still an EADDRINUSE, und gemessen wird ein Server mit einer ganz
 * anderen Konfiguration. Genau so ist ein Durchlauf einmal grün geworden, der
 * nichts geprüft hat. Lieber laut abbrechen.
 */
for (const port of [APP_PORT, CRM_PORT, MAIL_PORT, CDP_PORT]) {
  try {
    await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(500) });
    console.error(
      `Port ${port} ist belegt. Der Test würde einen fremden Prozess messen.\n` +
        "Bitte den Prozess auf diesem Port beenden und erneut starten.",
    );
    process.exit(1);
  } catch {
    // Keine Antwort = frei. Genau so soll es sein.
  }
}

console.log("Formular-Pfad: vier Kanal-Lagen, dazu Fehler- und Grenzzustände\n");

const { server, empfangen } = await starteScheinCrm();
const mail = await starteScheinMail();
const CRM_URL = `http://127.0.0.1:${CRM_PORT}/api/inbound/website-lead`;
const MAIL_URL = `http://127.0.0.1:${MAIL_PORT}/v3/smtp/email`;

let app = null;
let browser = null;

try {
  /* --- A: beide Kanäle erreichbar ---------------------------------------- */
  console.log("=== A: beide Kanäle erreichbar ===");
  mail.setzeStatus(202);
  app = await starteApp({ crmUrl: CRM_URL, mailUrl: MAIL_URL });
  browser = await starteBrowser();

  await durchlauf(browser, "A /meet", "/meet");
  await sleep(500);

  pruefe(mail.empfangen.length === 1, `A: genau eine Mail (${mail.empfangen.length})`);
  pruefe(mail.empfangen[0]?.key === TEST_MAIL_KEY, "A: api-key-Header gesetzt");

  pruefe(empfangen.length === 1, `A: genau eine CRM-Anfrage (${empfangen.length})`);
  const anfrage = empfangen[0];
  if (anfrage) {
    pruefe(anfrage.method === "POST", "A: Methode POST");
    pruefe(anfrage.key === TEST_KEY, "A: Header X-Website-Key gesetzt");
    pruefe(
      (anfrage.contentType || "").startsWith("application/json"),
      "A: content-type application/json",
    );
    const b = anfrage.body || {};
    pruefe(b.source === "demo", `A: source = demo (${b.source})`);
    pruefe(b.name === "Testerin Formularpfad", "A: name übergeben");
    pruefe(b.email === "formularpfad@example.org", "A: email übergeben");
    pruefe(b.organisation === "Musterschule Formularpfad", "A: organisation übergeben");
    pruefe(b.role === "School leadership", `A: role übergeben (${b.role})`);
    // Die Rollen sind uebersetzt (ROLE_OPTIONS in schema.ts) – anders als die
    // Quell-Werte, die das CRM zum Einsortieren braucht und die deshalb
    // deutsch bleiben. Genau diese Trennung prueft die Zeile darueber mit.
    pruefe(b.locale === "en", `A: locale = en (${b.locale})`);
    pruefe(typeof b.message === "string" && b.message.length > 0, "A: message übergeben");
    pruefe(b.page_path === "/meet", `A: page_path (${b.page_path})`);
    pruefe(b.utm_source === "newsletter", `A: utm_source (${b.utm_source})`);
    pruefe(b.utm_medium === "email", `A: utm_medium (${b.utm_medium})`);
    pruefe(b.utm_campaign === "schulleitung-2026", `A: utm_campaign (${b.utm_campaign})`);
    pruefe("referrer" in b, "A: Feld referrer vorhanden");
  }

  // Zweite Quelle: /co-create schickt dasselbe Formular mit anderem source.
  await durchlauf(browser, "A /co-create", "/co-create");
  await sleep(500);
  const zweite = empfangen[1];
  pruefe(zweite?.body?.source === "mitgestalten", "A: source = mitgestalten");
  pruefe(zweite?.body?.page_path === "/co-create", "A: page_path = /co-create");

  pruefe(
    !app.logs.join("").includes("Teil-Ausfall"),
    "A: KEIN Teil-Ausfall im Log – beide Wege trugen",
  );

  await beende(browser.kind);
  await beende(app.kind);
  pruefe(await portFrei(APP_PORT), "A: Server wirklich beendet, Port frei");

  /* ======================================================================
   * B: NUR DAS CRM TRÄGT – DER GEMELDETE FEHLER
   * ======================================================================
   * Der Mailversand ist EINGERICHTET und scheitert trotzdem (401, wie bei
   * einem rotierten Schlüssel). Vorher entschied allein die Mail: Der
   * Besucher las „could not be submitted", während seine Anfrage längst im
   * CRM lag, und schickte ein zweites Mal. Diese Lage ist der Grund für den
   * ganzen Umbau.
   */
  console.log("\n=== B: nur das CRM trägt (Mail antwortet 401) ===");
  mail.setzeStatus(401);
  const crmVorB = empfangen.length;
  app = await starteApp({ crmUrl: CRM_URL, mailUrl: MAIL_URL });
  browser = await starteBrowser();

  await durchlauf(browser, "B /meet", "/meet");
  await sleep(700);

  pruefe(empfangen.length === crmVorB + 1, "B: das CRM hat die Anfrage bekommen");
  const logB = app.logs.join("");
  pruefe(
    logB.includes("[formular] Teil-Ausfall: mail=fehlgeschlagen, crm=ok"),
    "B: Teil-Ausfall benannt, Anfrage trotzdem angekommen",
  );
  pruefe(/\[mail\] Versand abgelehnt: Status 401/.test(logB), "B: Status 401 im Log");
  pruefe(/Status 401, \d+ ms/.test(logB), "B: Dauer mitgeloggt");
  pruefe(!logB.includes(TEST_MAIL_KEY), "B: der Mail-Schlüssel steht NICHT im Log");

  await beende(browser.kind);
  await beende(app.kind);

  /* --- C: nur die Mail trägt --------------------------------------------- */
  console.log("\n=== C: nur die Mail trägt (CRM tot) ===");
  mail.setzeStatus(202);
  const crmVorC = empfangen.length;
  const mailVorC = mail.empfangen.length;
  app = await starteApp({ crmUrl: TOTE_ADRESSE, mailUrl: MAIL_URL });
  browser = await starteBrowser();

  await durchlauf(browser, "C /meet", "/meet");
  await sleep(700);

  pruefe(empfangen.length === crmVorC, "C: der Schein-CRM-Endpunkt bekam nichts");
  pruefe(mail.empfangen.length === mailVorC + 1, "C: die Mail ging raus");
  const logC = app.logs.join("");
  pruefe(logC.includes("[crm] Übergabe fehlgeschlagen"), "C: CRM-Fehler wurde geloggt");
  pruefe(
    logC.includes("[formular] Teil-Ausfall: mail=ok, crm=fehlgeschlagen"),
    "C: Teil-Ausfall benannt",
  );
  pruefe(!logC.includes(TEST_KEY), "C: der CRM-Schlüssel steht NICHT im Log");

  await beende(browser.kind);
  await beende(app.kind);

  /* ======================================================================
   * D: BEIDE TOT – NUR HIER DARF EINE FEHLERMELDUNG STEHEN
   * ====================================================================== */
  console.log("\n=== D: beide Kanäle tot ===");
  app = await starteApp({ crmUrl: TOTE_ADRESSE, mailUrl: TOTE_MAIL });
  browser = await starteBrowser();

  const d = await durchlauf(browser, "D /meet", "/meet", "fehler");
  await sleep(500);

  pruefe(
    /Your request could not be submitted just now/.test(d.text),
    "D: die Fehlermeldung erscheint",
  );
  pruefe(
    /selyvi\.app@gmail\.com/.test(d.text),
    "D: die Meldung nennt einen Weg, der nicht über uns läuft",
  );
  const logD = app.logs.join("");
  pruefe(
    logD.includes("[formular] Beide Kanäle gescheitert"),
    "D: beide Kanäle im Log benannt",
  );

  await beende(browser.kind);
  await beende(app.kind);

  /* ======================================================================
   * E: FEHLER- UND GRENZZUSTÄNDE
   * ======================================================================
   * Diese Texte stehen in keinem ausgelieferten HTML. Sie entstehen erst,
   * wenn jemand etwas falsch macht oder zu schnell ist – und sind deshalb
   * nie geprüft worden.
   */
  console.log("\n=== E: Fehler- und Grenzzustände ===");
  mail.setzeStatus(202);
  app = await starteApp({ crmUrl: CRM_URL, mailUrl: MAIL_URL });
  browser = await starteBrowser();

  const crmVorE = empfangen.length;

  // E1 – Validierungsfehler: leeres Formular absenden.
  //
  // Die 3,6 s sind nicht Bequemlichkeit: MIN_FILL_MS ist 3000 ms, und wer
  // schneller absendet, bekommt die STILLE Bestätigung statt der Validierung.
  // Ohne dieses Warten prüft dieser Abschnitt die Zeitschranke und nennt das
  // Ergebnis „Validierung" – der erste Lauf ist genau darüber gestolpert.
  await browser.send("Page.navigate", { url: `http://127.0.0.1:${APP_PORT}/meet` });
  await sleep(2500);
  await sleep(3600);
  await browser.lies(ABSENDEN);
  await sleep(1500);
  const e1 = (await browser.lies("document.querySelector('main').innerText")) || "";
  merkeZustand("E1 Validierungsfehler", e1);
  pruefe(
    /Please give us your name|Please give us your school/.test(e1),
    "E1: Feldfehler sichtbar",
  );
  pruefe(empfangen.length === crmVorE, "E1: nichts ans CRM – Validierung hält");

  // E2 – Honeypot: stille Bestätigung OHNE Versand.
  await browser.send("Page.navigate", { url: `http://127.0.0.1:${APP_PORT}/meet` });
  await sleep(2500);
  await browser.lies(AUSFUELLEN);
  await browser.lies(`(() => {
    const falle = document.querySelector('input[name="website"], input[name="company"], input[tabindex="-1"][autocomplete="off"]');
    if (!falle) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(falle, 'https://spam.example.org');
    falle.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await sleep(3600);
  await browser.lies(ABSENDEN);
  await sleep(1500);
  const e2 = (await browser.lies("document.querySelector('main').innerText")) || "";
  merkeZustand("E2 Honeypot", e2);
  pruefe(/Thank you for your request/.test(e2), "E2: stille Bestätigung nach Honeypot");
  pruefe(empfangen.length === crmVorE, "E2: NICHTS wurde versendet");

  // E3 – zu schnell abgeschickt: dieselbe stille Bestätigung.
  await browser.send("Page.navigate", { url: `http://127.0.0.1:${APP_PORT}/meet` });
  await sleep(2500);
  await browser.lies(AUSFUELLEN);
  await browser.lies(ABSENDEN);
  await sleep(1500);
  const e3 = (await browser.lies("document.querySelector('main').innerText")) || "";
  merkeZustand("E3 zu schnell", e3);
  pruefe(empfangen.length === crmVorE, "E3: zu schnell abgeschickt – kein Versand");

  /* ======================================================================
   * F: DAS FORSCHUNGSFORMULAR
   * ======================================================================
   * Neun Felder, dieselbe Server Action. Geprüft wird, was im CRM ankommt:
   * source=forschung, die Kernspalten gefüllt UND die sieben
   * Forschungsfelder zusätzlich unter ihrem eigenen Namen.
   */
  console.log("\n=== F: Forschungsformular (source=forschung) ===");
  const crmVorF = empfangen.length;

  await browser.send("Page.navigate", { url: `http://127.0.0.1:${APP_PORT}/research` });
  await sleep(2800);
  await browser.lies(AUSFUELLEN);
  await browser.lies(`(() => {
    const setze = (name, wert) => {
      const el = document.querySelector('[name="' + name + '"]');
      if (!el) return false;
      const proto = el.tagName === 'TEXTAREA'
        ? window.HTMLTextAreaElement.prototype
        : el.tagName === 'SELECT'
          ? window.HTMLSelectElement.prototype
          : window.HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, wert);
      el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
      return true;
    };
    setze('message', 'How does structured observation change support planning in years 5 to 7?');
    setze('fachgebiet', 'Chair of Education Research');
    setze('digitaler_bedarf', 'A logging view for support decisions.');
    setze('schulen_beteiligt', 'talks under way');
    setze('projektstatus', 'application');
    setze('zeitraum', 'school year 2027/28');
    return true;
  })()`);
  await sleep(3600);
  await browser.lies(ABSENDEN);
  await sleep(2000);

  const fText = (await browser.lies("document.querySelector('main').innerText")) || "";
  merkeZustand("F Forschungsformular", fText);
  pruefe(/Thank you for your request/.test(fText), "F: Bestätigung sichtbar");
  pruefe(empfangen.length === crmVorF + 1, "F: das CRM hat die Anfrage bekommen");

  const f = empfangen[empfangen.length - 1]?.body || {};
  pruefe(f.source === "forschung", `F: source = forschung (${f.source})`);
  pruefe(f.source_label === "Research project", `F: source_label (${f.source_label})`);
  pruefe(
    f.organisation === "Musterschule Formularpfad",
    "F: Kernspalte organisation gefüllt",
  );
  pruefe(f.institution === "Musterschule Formularpfad", "F: zusätzlich institution");
  pruefe(
    typeof f.forschungsfrage === "string" &&
      f.forschungsfrage.includes("support planning"),
    "F: zusätzlich forschungsfrage",
  );
  pruefe(f.fachgebiet === "Chair of Education Research", "F: fachgebiet");
  pruefe(
    f.digitaler_bedarf === "A logging view for support decisions.",
    "F: digitaler_bedarf",
  );
  pruefe(
    f.schulen_beteiligt === "talks under way",
    `F: schulen_beteiligt (${f.schulen_beteiligt})`,
  );
  pruefe(f.projektstatus === "application", `F: projektstatus (${f.projektstatus})`);
  pruefe(f.zeitraum === "school year 2027/28", "F: zeitraum");
  pruefe(f.page_path === "/research", `F: page_path (${f.page_path})`);

  /* ======================================================================
   * G: ERFUNDENE HERKUNFT FÄLLT STILL AUF „demo" ZURÜCK
   * ======================================================================
   * normalizeSource() ist die Schranke, die SOURCE_VALUES durchsetzt. Sie
   * ist als Schutz gegen manipulierte Formulardaten gebaut – und sie ist
   * zugleich der Grund, warum ein VERGESSENER Eintrag in SOURCE_VALUES
   * niemandem auffällt: Die Anfrage landet einfach unter „demo".
   *
   * Dieser Lauf beweist beides in einem: dass die Schranke greift, und dass
   * sie still greift. Wer „forschung" aus SOURCE_VALUES entfernt, sieht
   * Lauf F scheitern – nicht diesen hier.
   */
  console.log("\n=== G: erfundene Herkunft ===");
  const crmVorG = empfangen.length;

  await browser.send("Page.navigate", { url: `http://127.0.0.1:${APP_PORT}/meet` });
  await sleep(2500);
  await browser.lies(AUSFUELLEN);
  await browser.lies(`(() => {
    const el = document.querySelector('input[name="source"]');
    if (!el) return false;
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
      .set.call(el, 'hochschule-erfunden');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await sleep(3600);
  await browser.lies(ABSENDEN);
  await sleep(1800);

  const gText = (await browser.lies("document.querySelector('main').innerText")) || "";
  merkeZustand("G erfundene Herkunft", gText);
  pruefe(
    /Thank you for your request/.test(gText),
    "G: Bestätigung – keine Fehlermeldung",
  );
  pruefe(empfangen.length === crmVorG + 1, "G: die Anfrage kam an");
  const g = empfangen[empfangen.length - 1]?.body || {};
  pruefe(
    g.source === "demo",
    `G: erfundene Herkunft fiel still auf demo zurück (${g.source})`,
  );
  pruefe(!("institution" in g), "G: KEIN Forschungsblock bei fremder Herkunft");

  await beende(browser.kind);
  await beende(app.kind);
} finally {
  await beende(browser?.kind);
  await beende(app?.kind);
  server.close();
  mail.server.close();
}

/* ========================================================================= */
/* Sprachprüfung der erzwungenen Zustände                                    */
/* ========================================================================= */
console.log("\n=== Sprache der erzwungenen Zustände ===");
let deutsch = 0;
for (const zustand of ZUSTAENDE) {
  for (const treffer of findeDeutsch(zustand.text)) {
    deutsch++;
    pruefe(false, `${zustand.name}: ${treffer.grund} in „${treffer.text}"`);
  }
}
console.log(
  `  ${ZUSTAENDE.length} erzwungene Zustände geprüft, ${deutsch} deutsche Fundstellen`,
);

console.log(
  "\n" + (probleme === 0 ? "FORMULAR-TEST BESTANDEN" : probleme + " PROBLEM(E) GEFUNDEN"),
);
process.exit(probleme === 0 ? 0 : 1);
