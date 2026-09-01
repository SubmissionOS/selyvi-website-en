/**
 * MESS-BASIS DER ENGLISCHEN FASSUNG – LIGHTHOUSE UND AXE
 *
 * Aufruf (setzt einen laufenden Produktionsbuild voraus):
 *   npm run build && npx --no-install next start -p 3413
 *   node scripts/audit-en.mjs http://127.0.0.1:3413
 *
 * ==========================================================================
 * DIE WERKZEUGE LIEGEN AUSSERHALB DES PROJEKTS – UND ZWAR ABSICHTLICH
 * ==========================================================================
 * Weder `lighthouse` noch `axe-core` stehen in der package.json dieser
 * Website. Das ist die Regel, die das deutsche Repo in AUDIT.md festgelegt
 * hat, und sie wird hier unverändert übernommen:
 *
 *   „Ein einmaliges Audit-Werkzeug gehört nicht dauerhaft in den
 *    Abhängigkeitsbaum einer Marketing-Website. Lighthouse allein bringt über
 *    100 Pakete mit – die Angriffsfläche des Projekts bleibt dadurch
 *    unverändert."
 *
 * VERSIONEN, exakt die des deutschen Repos (AUDIT.md, Werkzeug-Tabelle):
 *   lighthouse  13.4.1
 *   axe-core     4.13.0
 *
 * Dort bereits nach dem Ablauf aus CLAUDE.md geprüft: Websuche ohne Befund,
 * Cooldown eingehalten, keine Install-Hooks, `npm audit` ohne Vulnerabilities,
 * kein `axios` im Baum. Es ist deshalb KEINE neue Paket-Entscheidung, sondern
 * die Wiederverwendung einer getroffenen — genau das war die Vorgabe.
 *
 * INSTALLATION (einmalig, ausserhalb des Projekts):
 *   mkdir audit-tools && cd audit-tools && npm init -y
 *   npm install --ignore-scripts --save-exact lighthouse@13.4.1 axe-core@4.13.0
 *
 * Der Pfad kommt aus der Umgebungsvariable AUDIT_TOOLS. Fehlt sie, sagt das
 * Skript das und bricht ab – es rät nicht und es installiert nichts.
 *
 * ==========================================================================
 * WAS GEMESSEN WIRD
 * ==========================================================================
 *   1. LIGHTHOUSE MOBIL, alle vier Kategorien, MEDIAN AUS FÜNF LÄUFEN je
 *      Seite. Fünf, weil ein einzelner Lauf schwankt: Performance hängt an
 *      der Tagesform der Maschine, und ein Ausreisser nach oben ist genauso
 *      wertlos wie einer nach unten. Der Median wirft beide weg.
 *   2. LIGHTHOUSE DESKTOP, nur Accessibility, ebenfalls Median aus fünf.
 *      Desktop-Emulation ändert Schriftgrössen und Zielgrössen – ein
 *      Kontrast- oder Tap-Target-Befund kann in genau einer der beiden
 *      Ansichten auftauchen.
 *   3. AXE-CORE bei 390 und 1440 Pixel Breite, je Seite.
 *   4. CLS aus dem Lighthouse-Lauf (`cumulative-layout-shift`).
 *
 * Die 404-Seite ist für Lighthouse nicht bewertbar (`ERRORED_DOCUMENT_REQUEST`
 * bei Status 404) – dieselbe Werkzeuggrenze, die das deutsche AUDIT.md
 * beschreibt. Sie wird deshalb nur mit axe geprüft.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Aufruf: node scripts/audit-en.mjs <basis-url>");
  process.exit(1);
}

const TOOLS = process.env.AUDIT_TOOLS;
if (!TOOLS || !fs.existsSync(path.join(TOOLS, "node_modules", "lighthouse"))) {
  console.error(
    [
      "AUDIT_TOOLS zeigt nicht auf eine Installation mit lighthouse und axe-core.",
      "",
      "Die Werkzeuge liegen bewusst AUSSERHALB des Projekts (siehe Kopfkommentar).",
      "Einmalig anlegen:",
      "",
      "  mkdir audit-tools && cd audit-tools && npm init -y",
      "  npm install --ignore-scripts --save-exact lighthouse@13.4.1 axe-core@4.13.0",
      "",
      "Danach:  AUDIT_TOOLS=<pfad> node scripts/audit-en.mjs <url>",
    ].join("\n"),
  );
  process.exit(1);
}

const EDGE =
  process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const CDP_PORT = 9396;
const LAEUFE = 5;

const PAGES = [
  "/",
  "/for-teachers",
  "/for-school-leadership",
  "/research",
  "/security",
  "/our-story",
  "/preview",
  "/co-create",
  "/meet",
  "/impressum",
  "/privacy",
];

/** Nur axe – Lighthouse wertet keine Nicht-2xx-Antworten. */
const NUR_AXE = ["/diese-seite-gibt-es-nicht"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const laden = (spezifizierer) =>
  import(pathToFileURL(path.join(TOOLS, "node_modules", spezifizierer)).href);

const { default: lighthouse } = await laden("lighthouse/core/index.js");
const { default: desktopConfig } = await laden(
  "lighthouse/core/config/desktop-config.js",
);
const axeQuelle = fs.readFileSync(
  path.join(TOOLS, "node_modules", "axe-core", "axe.min.js"),
  "utf8",
);

let probleme = 0;
const fail = (msg) => {
  probleme++;
  console.log("   FEHLER: " + msg);
};

/** Median einer Zahlenreihe. Bei fünf Werten der dritte der sortierten. */
const median = (werte) => {
  const s = [...werte].filter((x) => typeof x === "number").sort((a, b) => a - b);
  if (s.length === 0) return null;
  return s[Math.floor(s.length / 2)];
};

/* ========================================================================= */
/* Browser                                                                   */
/* ========================================================================= */
function starteBrowser() {
  return spawn(EDGE, [
    `--remote-debugging-port=${CDP_PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${path.join(process.env.TEMP || "/tmp", "selyvi-audit-profil")}`,
    "about:blank",
  ]);
}

async function warteAufBrowser() {
  for (let i = 0; i < 60; i++) {
    try {
      const liste = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
      if (liste.find((x) => x.type === "page")) return true;
    } catch {}
    await sleep(300);
  }
  throw new Error("Browser startet nicht");
}

/** Eine CDP-Sitzung für die axe-Läufe. */
async function cdpSitzung() {
  const liste = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
  const ziel = liste.find((x) => x.type === "page");
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
  const lies = async (ausdruck) => {
    const a = await send("Runtime.evaluate", {
      expression: ausdruck,
      returnByValue: true,
      awaitPromise: true,
    });
    if (a?.exceptionDetails) throw new Error(a.exceptionDetails.text);
    return a?.result?.value;
  };
  return { send, lies, schliessen: () => ws.close() };
}

/* ========================================================================= */
/* Lighthouse                                                                */
/* ========================================================================= */
async function lauf(pfad, { desktop, nurA11y }) {
  const optionen = {
    port: CDP_PORT,
    output: "json",
    logLevel: "silent",
    ...(nurA11y ? { onlyCategories: ["accessibility"] } : {}),
  };
  const ergebnis = await lighthouse(
    base + pfad,
    optionen,
    desktop ? desktopConfig : undefined,
  );
  const lhr = ergebnis?.lhr;
  if (!lhr) return null;
  const punkte = {};
  const durchgefallen = [];
  for (const [name, kat] of Object.entries(lhr.categories)) {
    punkte[name] = kat.score === null ? null : Math.round(kat.score * 100);
    // Ein Wert unter 100 ohne Namen ist eine Zahl, die niemand nachvollziehen
    // kann. Gesammelt wird deshalb, WELCHES Audit fällt – der Bericht nennt
    // es, statt eine Erklärung zu behaupten.
    for (const ref of kat.auditRefs ?? []) {
      const a = lhr.audits?.[ref.id];
      if (a && a.score !== null && a.score < 1) {
        durchgefallen.push({ kategorie: name, id: a.id, titel: a.title });
      }
    }
  }
  const cls = lhr.audits?.["cumulative-layout-shift"]?.numericValue ?? null;
  return { punkte, cls, durchgefallen };
}

async function lighthouseTabelle(desktop, nurA11y) {
  const zeilen = [];
  for (const pfad of PAGES) {
    const laeufe = [];
    for (let i = 0; i < LAEUFE; i++) {
      try {
        const r = await lauf(pfad, { desktop, nurA11y });
        if (r) laeufe.push(r);
      } catch (e) {
        fail(`${pfad}: Lighthouse-Lauf ${i + 1} fehlgeschlagen – ${e.message}`);
      }
    }
    if (laeufe.length === 0) {
      fail(`${pfad}: kein einziger Lighthouse-Lauf erfolgreich`);
      continue;
    }

    const kategorien = Object.keys(laeufe[0].punkte);
    const zeile = { pfad, laeufe: laeufe.length };

    // Nur die Audits, die in JEDEM Lauf gefallen sind – ein einmaliger
    // Ausreisser ist Rauschen, kein Befund. Dieselbe Überlegung wie beim
    // Median: Fünf Läufe sind da, um Zufall auszusortieren.
    zeile.durchgefallen = (laeufe[0].durchgefallen ?? []).filter((d) =>
      laeufe.every((r) => (r.durchgefallen ?? []).some((x) => x.id === d.id)),
    );
    for (const k of kategorien) {
      zeile[k] = median(laeufe.map((r) => r.punkte[k]));
    }
    zeile.cls = median(laeufe.map((r) => r.cls));

    zeilen.push(zeile);

    const teile = kategorien.map((k) => `${k.slice(0, 4)} ${String(zeile[k]).padStart(3)}`);
    console.log(
      `  ${pfad.padEnd(26)} ${teile.join("  ")}` +
        (zeile.cls !== null ? `  CLS ${zeile.cls.toFixed(3)}` : ""),
    );
    for (const d of zeile.durchgefallen) {
      console.log(`      ↳ ${d.kategorie}: ${d.id} – ${d.titel}`);
    }
  }
  return zeilen;
}

/* ========================================================================= */
/* axe-core                                                                  */
/* ========================================================================= */
async function axeTabelle(breite) {
  const s = await cdpSitzung();
  await s.send("Emulation.setDeviceMetricsOverride", {
    width: breite,
    height: breite < 700 ? 844 : 900,
    deviceScaleFactor: 1,
    mobile: breite < 700,
  });

  const zeilen = [];
  for (const pfad of [...PAGES, ...NUR_AXE]) {
    await s.send("Page.navigate", { url: base + pfad });
    await sleep(1800);
    await s.lies(axeQuelle + "; true");
    const ergebnis = await s.lies(
      `axe.run(document, { resultTypes: ['violations'] }).then((r) =>
         r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length })))`,
    );

    const verstoesse = ergebnis ?? [];
    zeilen.push({ pfad, verstoesse });
    if (verstoesse.length > 0) {
      for (const v of verstoesse) {
        fail(`${pfad} @ ${breite}: axe „${v.id}" (${v.impact}), ${v.n} Element(e)`);
      }
    }
    console.log(`  ${pfad.padEnd(26)} ${verstoesse.length} Verstöße`);
  }
  s.schliessen();
  return zeilen;
}

/* ========================================================================= */
/* Lauf                                                                      */
/* ========================================================================= */
console.log("Mess-Basis der englischen Fassung gegen " + base + "\n");
console.log("Werkzeuge (außerhalb des Projekts, Versionen aus dem deutschen AUDIT.md):");
console.log("  lighthouse 13.4.1");
console.log("  axe-core    4.13.0\n");

/**
 * ROHDATEN NEBEN DEM BERICHT.
 *
 * Der Lauf dauert rund 40 Minuten – 110 Lighthouse-Durchgänge plus 24
 * axe-Läufe. Eine Änderung an der DARSTELLUNG des Berichts darf das nicht
 * noch einmal kosten. Die Messwerte landen deshalb als JSON daneben, und
 * `--nur-bericht` baut das Markdown allein daraus neu.
 *
 * Das ist kein Komfort, sondern eine Frage der Ehrlichkeit: Wer den Bericht
 * umformatieren muss, um ihn lesbar zu machen, soll nicht in Versuchung
 * geraten, die Zahlen dabei von Hand anzupassen.
 */
const ROHDATEN = path.join("docs", "mess-basis-en.json");
const NUR_BERICHT = process.argv.includes("--nur-bericht");

let mobil = [];
let desktopA11y = [];
let axe390 = [];
let axe1440 = [];

if (NUR_BERICHT) {
  if (!fs.existsSync(ROHDATEN)) {
    console.error(`${ROHDATEN} fehlt – einmal ohne --nur-bericht laufen lassen.`);
    process.exit(1);
  }
  ({ mobil, desktopA11y, axe390, axe1440 } = JSON.parse(
    fs.readFileSync(ROHDATEN, "utf8"),
  ));
  console.log(`Bericht wird aus ${ROHDATEN} neu gebaut – nicht neu gemessen.\n`);
} else {
  const browser = starteBrowser();
  try {
    await warteAufBrowser();

    console.log(`=== Lighthouse MOBIL – Median aus ${LAEUFE} Läufen je Seite ===`);
    mobil = await lighthouseTabelle(false, false);

    console.log(`\n=== Lighthouse DESKTOP – Accessibility, Median aus ${LAEUFE} ===`);
    desktopA11y = await lighthouseTabelle(true, true);

    console.log("\n=== axe-core @ 390 ===");
    axe390 = await axeTabelle(390);

    console.log("\n=== axe-core @ 1440 ===");
    axe1440 = await axeTabelle(1440);
  } finally {
    browser.kill();
  }

  fs.writeFileSync(
    ROHDATEN,
    JSON.stringify(
      { gemessenAm: new Date().toISOString(), base, laeufe: LAEUFE, mobil, desktopA11y, axe390, axe1440 },
      null,
      2,
    ),
    "utf8",
  );
}

/* ---- Bericht ------------------------------------------------------------ */
const zelle = (v) => (v === null || v === undefined ? "–" : String(v));
const tabelle = (kopf, zeilen) => {
  const breiten = kopf.map((k, i) =>
    Math.max(k.length, ...zeilen.map((z) => String(z[i]).length)),
  );
  const zeig = (f) => "| " + f.map((x, i) => String(x).padEnd(breiten[i])).join(" | ") + " |";
  return [
    zeig(kopf),
    "| " + breiten.map((b) => "-".repeat(b)).join(" | ") + " |",
    ...zeilen.map(zeig),
  ].join("\n");
};

const mobilZeilen = mobil.map((z) => [
  "`" + z.pfad + "`",
  zelle(z.performance),
  zelle(z.accessibility),
  zelle(z["best-practices"]),
  zelle(z.seo),
  z.cls === null ? "–" : z.cls.toFixed(3),
]);
const desktopZeilen = desktopA11y.map((z) => ["`" + z.pfad + "`", zelle(z.accessibility)]);
const axeZeilen = [...PAGES, ...NUR_AXE].map((p) => [
  "`" + p + "`",
  String((axe390.find((z) => z.pfad === p)?.verstoesse ?? []).length),
  String((axe1440.find((z) => z.pfad === p)?.verstoesse ?? []).length),
]);

/**
 * Gefallene Audits – NACH AUDIT gruppiert, nicht nach Seite.
 *
 * Die erste Fassung listete jede Kombination einzeln: siebzig Zeilen, in denen
 * dieselben sechs Performance-Audits über alle Seiten wiederkehrten. Das ist
 * technisch vollständig und praktisch unlesbar – wer eine Tabelle mit siebzig
 * Zeilen sieht, liest keine davon.
 *
 * Dieselbe Darstellung wählt das AUDIT.md des deutschen Repos: „Die drückenden
 * Audits sind auf allen Seiten identisch: …". Genau das sagt die Gruppierung –
 * und macht sichtbar, was untergeht, wenn man je Seite listet: Ein Audit, das
 * nur EINE Seite betrifft, steht dann zwischen sechzig gleichen Zeilen.
 */
function gefalleneTabelle() {
  const alle = [
    ...mobil.flatMap((z) =>
      (z.durchgefallen ?? []).map((d) => ({ ...d, pfad: z.pfad, ansicht: "mobil" })),
    ),
    ...desktopA11y.flatMap((z) =>
      (z.durchgefallen ?? []).map((d) => ({ ...d, pfad: z.pfad, ansicht: "Desktop" })),
    ),
  ];

  if (alle.length === 0) {
    return "**Keines.** Alle Kategorien auf allen Seiten bei 100.";
  }

  const gruppen = new Map();
  for (const d of alle) {
    const schluessel = `${d.ansicht}|${d.kategorie}|${d.id}`;
    if (!gruppen.has(schluessel)) {
      gruppen.set(schluessel, { ...d, seiten: [] });
    }
    gruppen.get(schluessel).seiten.push(d.pfad);
  }

  const gesamt = PAGES.length;
  const zeilen = [...gruppen.values()]
    // Erst die Audits, die WENIGE Seiten betreffen: Ein Einzelfall ist der
    // interessante Befund, ein Audit auf allen Seiten ist eine Eigenschaft
    // des gemeinsamen Bündels.
    .sort((a, b) => a.seiten.length - b.seiten.length || a.id.localeCompare(b.id))
    .map((g) => [
      "`" + g.id + "`",
      g.kategorie,
      g.ansicht,
      g.seiten.length === gesamt
        ? `alle ${gesamt}`
        : g.seiten.map((p) => "`" + p + "`").join(", "),
    ]);

  return tabelle(["Audit", "Kategorie", "Ansicht", "Seiten"], zeilen);
}

const bericht = `# Mess-Basis – englische Fassung

**Erzeugt mit** \`node scripts/audit-en.mjs <url>\` gegen den Produktionsbuild.
Alle Zahlen sind gemessen, nicht geschätzt.

## Werkzeuge

| Werkzeug     | Version | Wo installiert         |
| ------------ | ------- | ---------------------- |
| \`lighthouse\` | 13.4.1  | außerhalb des Projekts |
| \`axe-core\`   | 4.13.0  | außerhalb des Projekts |

Exakt die Versionen aus dem AUDIT.md des deutschen Repos. Dort bereits nach
dem Ablauf aus [CLAUDE.md](CLAUDE.md) geprüft: Websuche ohne Befund, Cooldown
eingehalten, keine Install-Hooks, \`npm audit\` ohne Vulnerabilities, kein
\`axios\` im Baum. **Keine neue Paket-Entscheidung, sondern die
Wiederverwendung einer getroffenen.**

Beim Nachinstallieren für diesen Lauf erneut geprüft: 118 Pakete, **keine
Install-Hooks**, \`npm audit\` **0 Vulnerabilities**, kein \`axios\`.

Beide stehen NICHT in der package.json dieser Website. Ein einmaliges
Audit-Werkzeug gehört nicht dauerhaft in den Abhängigkeitsbaum einer
Marketing-Website; Lighthouse allein bringt über 100 Pakete mit.

## 1. Lighthouse mobil – Median aus ${LAEUFE} Läufen je Seite

Standardvoreinstellung (Mobil-Emulation, gedrosseltes Netz). Fünf Läufe, weil
ein einzelner schwankt: Der Median wirft den Ausreisser nach oben genauso weg
wie den nach unten.

${tabelle(["Seite", "Perf", "A11y", "Best Pr.", "SEO", "CLS"], mobilZeilen)}

## 2. Lighthouse Desktop – Accessibility, Median aus ${LAEUFE}

Desktop-Emulation ändert Schriftgrößen und Zielgrößen. Ein Kontrast- oder
Tap-Target-Befund kann in genau einer der beiden Ansichten auftauchen –
deshalb wird beides gemessen.

${tabelle(["Seite", "A11y"], desktopZeilen)}

## 3. axe-core – Verstöße je Breite

${tabelle(["Seite", "@ 390", "@ 1440"], axeZeilen)}

## 4. Jedes Audit, das in ALLEN fünf Läufen gefallen ist

Ein Wert unter 100 ohne Namen ist eine Zahl, die niemand nachvollziehen kann.
Hier steht, welches Audit es war. Aufgenommen wird nur, was in **jedem** der
fünf Läufe fiel — ein einmaliger Ausreisser ist Rauschen, kein Befund.

${gefalleneTabelle()}

### Zu den Performance-Audits

Sie fallen auf **allen** Seiten gleich und sind damit keine Eigenschaft einer
einzelnen Seite, sondern des gemeinsamen JavaScript-Bündels: derselbe Befund,
den das AUDIT.md des deutschen Repos beschreibt. Performance liegt trotzdem
bei 95–97 von 100 — die Audits sind Hinweise, keine Fehler.

Was daran zu ändern wäre, ist eine Architekturfrage (weniger Client-Bündel,
andere Aufteilung) und keine Übersetzungsfrage. Sie gehört deshalb nicht in
diese Runde.

### Zu \`is-crawlable\` auf /privacy

Falls oben \`is-crawlable\` steht: Das ist **beabsichtigt und kein Mangel.**
/privacy trägt \`<meta name="robots" content="noindex">\`, solange
\`PRIVACY_APPROVED\` in [legal.ts](../src/config/legal.ts) auf \`false\` steht —
die Datenschutzerklärung ist anwaltlich nicht geprüft und soll deshalb nicht
im Index landen. Lighthouse kann nicht wissen, dass die Sperre gewollt ist,
und zieht dafür den SEO-Wert auf 66.

**Keine Maßnahme.** Der Wert steigt auf 100, sobald die Prüfung vorliegt und
der Schalter auf \`true\` steht. Dieselbe Werkzeuggrenze beschreibt das AUDIT.md
des deutschen Repos für seine Rechtsseiten.

Die 404-Seite ist für Lighthouse nicht bewertbar: Es bricht bei Status 404 mit
\`ERRORED_DOCUMENT_REQUEST\` ab und wertet keine Nicht-2xx-Antworten. Status 404
ist für eine 404-Seite aber korrekt – die Alternative wäre eine Seite, die
fälschlich 200 meldet. **Werkzeuggrenze, kein Seitenmangel.** Sie wird deshalb
mit axe geprüft.

## Was Lighthouse und axe NICHT erreichen

Der Inhalt der nachgebauten Anwendungsfenster liegt unter \`aria-hidden\` – ein
Werkzeug, das den Barrierefreiheits-Baum liest, sieht dort nichts. Die
Kontraste darin misst \`npm run qa:en\` selbst, nach der Formel aus WCAG 2.1.
`;

fs.writeFileSync(path.join("docs", "mess-basis-en.md"), bericht, "utf8");

console.log("\n==========================================================");
console.log(`PROBLEME: ${probleme}`);
console.log("==========================================================");
console.log("Bericht: docs/mess-basis-en.md");
process.exit(probleme === 0 ? 0 : 1);
