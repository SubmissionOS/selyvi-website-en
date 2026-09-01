/**
 * Formular-Pfad im Browser – der Test, den scripts/smoke-test.mjs nicht
 * leisten kann.
 *
 * Aufruf (setzt einen vorhandenen Build voraus):
 *   npm run build
 *   npm run test:formular
 *
 * ==========================================================================
 * WAS HIER BEWIESEN WIRD
 * ==========================================================================
 * Zwei Durchläufe, beide müssen dieselbe Bestätigung zeigen:
 *
 *   A  CRM erreichbar   -> „Thank you for your request." UND der Endpunkt hat
 *                          genau eine Anfrage mit dem richtigen Header und
 *                          den erwarteten Feldern bekommen.
 *   B  CRM tot           -> „Thank you for your request." trotzdem.
 *
 * Durchlauf B ist der eigentliche Punkt: Die Mail ist der Verlass, die
 * CRM-Übergabe die Zugabe. Wenn B fehlschlägt, ist genau die Regel gebrochen,
 * für die src/lib/demo/crm.ts existiert.
 *
 * ==========================================================================
 * WARUM DEMO_DRY_RUN=true
 * ==========================================================================
 * Der Test darf keine echte Mail verschicken. `DEMO_DRY_RUN=true` schreibt
 * die Anfrage stattdessen ins Server-Log und meldet Erfolg. Die CRM-Übergabe
 * ist davon absichtlich NICHT betroffen – sonst wäre hier nichts zu messen.
 *
 * Der Test startet seinen eigenen `next start` auf einem eigenen Port und
 * räumt ihn wieder ab. Ein laufender Entwicklungsserver stört nicht.
 *
 * Keine zusätzlichen Pakete: CDP über die eingebauten `fetch` und `WebSocket`,
 * der Schein-Endpunkt über `node:http`.
 */
import { spawn } from "node:child_process";
import http from "node:http";

const EDGE =
  process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const APP_PORT = 3311;
const CRM_PORT = 3312;
const CDP_PORT = 9393;

/** Adresse, an der garantiert nichts lauscht – Port 1 auf dem Loopback. */
const TOTE_ADRESSE = "http://127.0.0.1:1/inbound";

const TEST_KEY = "test-schluessel-nur-lokal";

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

/* ========================================================================= */
/* Anwendung                                                                 */
/* ========================================================================= */
async function starteApp(crmUrl) {
  const kind = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["--no-install", "next", "start", "-p", String(APP_PORT)],
    {
      env: {
        ...process.env,
        DEMO_DRY_RUN: "true",
        CRM_INBOUND_URL: crmUrl,
        WEBSITE_INBOUND_KEY: TEST_KEY,
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

async function durchlauf(browser, name, url) {
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
    if (/Thank you for your request/.test(text)) break;
  }

  const bestaetigt = /Thank you for your request/.test(text);
  pruefe(bestaetigt, `${name}: Bestätigung „Thank you for your request." sichtbar`);
  if (!bestaetigt) {
    console.log("    Sichtbarer Text war: " + text.replace(/\s+/g, " ").slice(0, 200));
  }
  return bestaetigt;
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
for (const port of [APP_PORT, CRM_PORT, CDP_PORT]) {
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

console.log("Formular-Pfad: CRM erreichbar und CRM tot\n");

const { server, empfangen } = await starteScheinCrm();
let app = null;
let browser = null;

try {
  /* --- A: CRM erreichbar ------------------------------------------------ */
  console.log("=== A: CRM erreichbar ===");
  app = await starteApp(`http://127.0.0.1:${CRM_PORT}/api/inbound/website-lead`);
  browser = await starteBrowser();

  await durchlauf(browser, "A /meet", "/meet");
  await sleep(500);

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

  await beende(browser.kind);
  await beende(app.kind);
  pruefe(await portFrei(APP_PORT), "A: Server wirklich beendet, Port frei");

  /* --- B: CRM tot -------------------------------------------------------- */
  console.log("\n=== B: CRM nicht erreichbar ===");
  const vorher = empfangen.length;
  app = await starteApp(TOTE_ADRESSE);
  browser = await starteBrowser();

  await durchlauf(browser, "B /meet", "/meet");
  await sleep(500);

  pruefe(empfangen.length === vorher, "B: der Schein-Endpunkt bekam nichts");
  pruefe(
    app.logs.join("").includes("[crm] Übergabe fehlgeschlagen"),
    "B: Fehler wurde geloggt",
  );
  const logtext = app.logs.join("");
  pruefe(!logtext.includes(TEST_KEY), "B: der Schlüssel steht NICHT im Log");
} finally {
  await beende(browser?.kind);
  await beende(app?.kind);
  server.close();
}

console.log(
  "\n" + (probleme === 0 ? "FORMULAR-TEST BESTANDEN" : probleme + " PROBLEM(E) GEFUNDEN"),
);
process.exit(probleme === 0 ? 0 : 1);
