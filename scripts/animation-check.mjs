/**
 * ANIMATIONS- UND ZUSTANDS-PRÜFUNG
 *
 * Aufruf (setzt einen laufenden Server voraus):
 *   npm run build && npx --no-install next start -p 3411
 *   node scripts/animation-check.mjs http://127.0.0.1:3411
 *
 * ==========================================================================
 * DIE LÜCKE, DIE DIESES SKRIPT SCHLIESST
 * ==========================================================================
 * scripts/german-check.mjs prüft das AUSGELIEFERTE HTML. Das ist der Zustand
 * einer Seite in der Sekunde null – und genau der ist bei dieser Website der
 * uninteressanteste.
 *
 * Was er NICHT sieht:
 *
 *   1. ANIMATIONSSCHRITTE. Die Szenen laufen als Zeitleiste ab: Ein Text wird
 *      Zeichen für Zeichen getippt, Chips poppen auf, ein Entwurf entsteht,
 *      ein Balken wächst, ein PDF wird exportiert. Der Text der Schritte 2
 *      bis 5 steht zum Ladezeitpunkt NICHT im DOM. Ein deutscher Chip, der
 *      erst nach neun Sekunden erscheint, ist für den HTML-Detektor unsichtbar.
 *
 *   2. BEDIENBARE ZUSTÄNDE. /preview ist die einzige Seite, auf der man
 *      klickt. Zeugnisentwurf, zweite Formulierung, Elternmail in drei
 *      Sprachen, Diktat-Einlauf, Chat-Antworten, Schloss-Hinweise, Sitzplan,
 *      Stundenplan, Timeline – alles entsteht erst durch einen Klick.
 *
 * Beides ist ausgelieferter Text. Beides muss englisch sein. Also wird beides
 * geprüft – nicht angenommen.
 *
 * ==========================================================================
 * DIESELBEN MUSTER WIE DER HTML-DETEKTOR
 * ==========================================================================
 * `findeDeutsch()` kommt aus scripts/lib/deutsch-muster.mjs und ist wortgleich
 * dieselbe Funktion, die scripts/german-check.mjs benutzt. Eine Kopie wäre
 * die Stelle, an der eine ergänzte Wortliste nur in einem der beiden Skripte
 * wirkt – und dann bedeutet die 0 des anderen nichts.
 *
 * ==========================================================================
 * OHNE REDUCED MOTION – DAS IST DER PUNKT
 * ==========================================================================
 * Bei `prefers-reduced-motion: reduce` stehen die Szenen sofort im Endzustand.
 * Das ist bequem und würde genau die Zwischenschritte überspringen, um die es
 * hier geht. Der Lauf lässt die Animationen deshalb ECHT laufen und schaut
 * ihnen beim Ablaufen zu.
 *
 * ==========================================================================
 * OHNE ZUSÄTZLICHE PAKETE
 * ==========================================================================
 * CDP über die eingebauten `fetch` und `WebSocket`, Edge als Browser – gleiche
 * Bauweise wie scripts/formular-test.mjs und scripts/qa-en.mjs.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { findeDeutsch } from "./lib/deutsch-muster.mjs";

const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Aufruf: node scripts/animation-check.mjs <basis-url>");
  process.exit(1);
}

const EDGE =
  process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const CDP_PORT = 9395;

/**
 * Seiten mit Szenen, und wie lange ihre längste Zeitleiste braucht.
 *
 * Die Dauern sind aus den STEPS-Definitionen der Szenen abgeleitet und
 * grosszuegig aufgerundet: Der Lauf soll den Schleifenschluss MITNEHMEN, nicht
 * knapp davor enden. Lieber ein paar Sekunden zu lang als ein Schritt zu wenig.
 */
const SZENEN_SEITEN = [
  ["/", 22000],
  ["/for-teachers", 30000],
  ["/for-school-leadership", 22000],
  ["/security", 20000],
];

/** Abstand zwischen zwei Aufnahmen des DOM-Textes. */
const TAKT_MS = 220;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let probleme = 0;
const fail = (msg) => {
  probleme++;
  console.log("   TREFFER: " + msg);
};

/* ========================================================================= */
/* Browser über CDP                                                          */
/* ========================================================================= */
async function starteBrowser() {
  const kind = spawn(EDGE, [
    `--remote-debugging-port=${CDP_PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${path.join(process.env.TEMP || "/tmp", "selyvi-anim-profil")}`,
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
  // AUSDRUECKLICH KEIN reduced motion: Die Zwischenschritte sind der Zweck.
  await send("Emulation.setEmulatedMedia", { features: [] });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const lies = async (ausdruck) => {
    const antwort = await send("Runtime.evaluate", {
      expression: ausdruck,
      returnByValue: true,
      awaitPromise: true,
    });
    if (antwort?.exceptionDetails) {
      throw new Error("Auswertung fehlgeschlagen: " + antwort.exceptionDetails.text);
    }
    return antwort?.result?.value;
  };

  const gehe = async (pfad, warteMs = 1500) => {
    await send("Page.navigate", { url: base + pfad });
    await sleep(warteMs);
  };

  return { kind, send, lies, gehe };
}

/* ========================================================================= */
/* Textaufnahme im Browser                                                   */
/* ========================================================================= */

/**
 * Sammelt den sichtbaren Text PLUS die vorgelesenen Attribute.
 *
 * Die Szenen liegen als Ganzes unter `aria-hidden` und tragen ihre Aussage im
 * `aria-label` des Rahmens – beides wird hier mitgenommen. `textContent`
 * allein wuerde die Bildbeschreibung uebersehen, und genau die ist der
 * laengste englische Text der ganzen Szene.
 *
 * Fremdsprachige Bloecke (lang != en) fallen heraus – dieselbe Regel wie im
 * HTML-Detektor. Die tuerkischen und arabischen Zeilen der Elternmail SOLLEN
 * nicht englisch sein.
 */
const TEXT_SAMMELN = `(() => {
  const wurzel = document.querySelector('main') || document.body;

  const klon = wurzel.cloneNode(true);
  for (const el of klon.querySelectorAll('[lang]')) {
    const l = el.getAttribute('lang') || '';
    if (!/^en\\b/i.test(l)) el.remove();
  }
  for (const el of klon.querySelectorAll('script, style')) el.remove();

  const attribute = [];
  for (const el of klon.querySelectorAll('[aria-label], [alt], [title], [placeholder]')) {
    for (const name of ['aria-label', 'alt', 'title', 'placeholder']) {
      const v = el.getAttribute(name);
      if (v) attribute.push(v);
    }
  }

  return [klon.textContent || '', ...attribute].join('\\n');
})()`;

/* ========================================================================= */
/* Teil A – Szenen über ihre volle Zeitleiste                                */
/* ========================================================================= */
async function teilA(browser) {
  const { lies, gehe } = browser;
  console.log("=== A) Szenen über alle Animationsschritte ===");
  console.log("    (ohne reduced motion – die Zwischenschritte sind der Zweck)\n");

  let zustaende = 0;

  for (const [pfad, dauerMs] of SZENEN_SEITEN) {
    await gehe(pfad, 1500);

    // Erst durchscrollen: Die Szenen starten ueber einen
    // IntersectionObserver. Eine Szene, die nie im Sichtbereich war, laeuft
    // auch nicht – und wir wuerden ihren Text nie sehen.
    const hoehe = await lies("document.body.scrollHeight");
    for (let y = 0; y < hoehe; y += 700) {
      await lies(`window.scrollTo(0, ${y}); true`);
      await sleep(180);
    }
    await lies("window.scrollTo(0, 0); true");
    await sleep(400);

    const gesehen = new Set();
    const start = Date.now();
    let aufnahmen = 0;

    while (Date.now() - start < dauerMs) {
      // Waehrend der Aufnahme langsam durchscrollen, damit alle Szenen der
      // Seite im Sichtbereich sind und weiterlaufen – eine Szene ausserhalb
      // haelt ihre Schleife an (siehe scene-timeline.tsx).
      const anteil = (Date.now() - start) / dauerMs;
      await lies(`window.scrollTo(0, ${Math.round(hoehe * anteil * 0.9)}); true`);

      const text = await lies(TEXT_SAMMELN);
      aufnahmen++;
      for (const zeile of String(text).split("\n")) {
        const z = zeile.replace(/\s+/g, " ").trim();
        if (z.length > 1) gesehen.add(z);
      }
      await sleep(TAKT_MS);
    }

    zustaende += gesehen.size;

    let treffer = 0;
    for (const zeile of gesehen) {
      for (const t of findeDeutsch(zeile)) {
        treffer++;
        fail(`${pfad} (Animation): ${t.grund} in „${t.text}"`);
      }
    }

    console.log(
      `  ${pfad.padEnd(24)} ${String(Math.round(dauerMs / 1000)).padStart(2)} s · ` +
        `${String(aufnahmen).padStart(3)} Aufnahmen · ` +
        `${String(gesehen.size).padStart(4)} verschiedene Textzeilen · ` +
        `${treffer} Treffer`,
    );
  }

  return zustaende;
}

/* ========================================================================= */
/* Teil B – /preview: jeder bedienbare Zustand                               */
/* ========================================================================= */

/**
 * Ein Klick, dann eine Aufnahme.
 *
 * Der Selektor wird im Browser ausgewertet; `nth` waehlt aus mehreren
 * Treffern. Gibt zurueck, ob wirklich geklickt wurde – ein Schritt, der ins
 * Leere geht, soll auffallen und nicht stillschweigend als geprueft gelten.
 */
function klickAusdruck(selektor, nth = 0) {
  return `(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(selektor)})][${nth}];
    if (!el) return false;
    el.click();
    return true;
  })()`;
}

/** Findet einen Schalter ueber seinen sichtbaren Text oder sein aria-label. */
function klickText(text, tag = "button") {
  return `(() => {
    const ziel = ${JSON.stringify(text)};
    const el = [...document.querySelectorAll(${JSON.stringify(tag)})].find((x) => {
      const t = (x.textContent || '').replace(/\\s+/g, ' ').trim();
      const a = x.getAttribute('aria-label') || '';
      return t === ziel || a === ziel || t.startsWith(ziel);
    });
    if (!el) return false;
    el.click();
    return true;
  })()`;
}

async function teilB(browser) {
  const { lies, gehe } = browser;
  console.log("\n=== B) /preview – jeder bedienbare Zustand ===\n");

  const gesehen = new Set();
  let zustaende = 0;
  let verfehlt = 0;

  const aufnehmen = async (name) => {
    await sleep(320);
    const text = await lies(TEXT_SAMMELN);
    for (const zeile of String(text).split("\n")) {
      const z = zeile.replace(/\s+/g, " ").trim();
      if (z.length > 1) gesehen.add(z);
    }
    zustaende++;
    return name;
  };

  /** Ein Schritt: klicken, aufnehmen, melden wenn das Ziel fehlte. */
  const schritt = async (name, ausdruck) => {
    const ok = await lies(ausdruck);
    if (!ok) {
      verfehlt++;
      console.log(`   ÜBERSPRUNGEN: „${name}" – Ziel nicht gefunden`);
      return false;
    }
    await aufnehmen(name);
    return true;
  };

  await gehe("/preview", 2000);
  await aufnehmen("Startzustand (My classes)");

  /* ---- Die vier offenen Bereiche, einmal jeder für sich ----
     Erst reihum ansteuern, danach folgen die Bereiche noch einmal einzeln
     mit ihren Interaktionen. Der erste Durchgang faengt den LEEREN Zustand
     jedes Bereichs – etwa „First choose an entry under Observations", der
     nur zu sehen ist, solange nichts gewaehlt wurde. */
  const BEREICHE = ["My classes", "Live lesson", "Timeline", "Materials"];
  for (const bereich of BEREICHE) {
    await schritt(`Bereich ${bereich} (Leerzustand)`, klickText(bereich));
  }

  /* ---- Die vier Schlösser ---- */
  const SCHLOESSER = [
    "Today, locked",
    "Review, locked",
    "Support plans, locked",
    "Class analysis, locked",
  ];
  for (const name of SCHLOESSER) {
    await schritt(`Schloss-Hinweis: ${name}`, klickText(name));
  }

  /* ---- Modus-Umschalter (Leitungsmodus-Hinweis) ---- */
  await schritt("Leadership-Hinweis", klickText("Leadership"));

  /* ---- Bereich: Live lesson – Beobachtungen, Diktat, Chat ---- */
  await schritt("Bereich Live lesson", klickText("Live lesson"));

  // Filter-Chips je Kind
  for (let i = 0; i < 3; i++) {
    await schritt(`Filter-Chip ${i + 1}`, klickAusdruck("button[aria-pressed]", i));
  }
  // Filter wieder aus
  await schritt("Filter zurücksetzen", klickAusdruck("button[aria-pressed='true']", 0));

  // Jede der drei vorbereiteten Beobachtungen auswaehlen
  for (let i = 0; i < 3; i++) {
    await schritt(
      `Beobachtung ${i + 1} gewählt`,
      `(() => {
        const liste = [...document.querySelectorAll('ul li button[aria-pressed]')];
        const el = liste.filter((b) => (b.textContent || '').length > 40)[${i}];
        if (!el) return false;
        el.click();
        return true;
      })()`,
    );
  }

  // Die drei Chat-Fragen aufklappen
  for (let i = 0; i < 3; i++) {
    await schritt(`Chat-Antwort ${i + 1}`, klickAusdruck("button[aria-expanded]", i));
  }

  /* ---- Diktat: laeuft Wort fuer Wort ein ---- */
  {
    const ok = await lies(klickText("Dictate an observation"));
    if (!ok) {
      verfehlt++;
      console.log(
        "   ÜBERSPRUNGEN: Diktat-Knopf nicht gefunden (Dictate an observation)",
      );
    } else {
      // Waehrend des Einlaufs wiederholt aufnehmen: Jedes Wort ist ein
      // eigener Zustand, und der Satz steht erst am Ende vollstaendig da.
      for (let i = 0; i < 14; i++) {
        await aufnehmen(`Diktat-Einlauf ${i + 1}`);
        await sleep(160);
      }
    }
  }

  /* ---- Bereich: My classes – Reiter, Schüler-Detail, Zeugnis, Elternpost ---- */
  await schritt("Bereich My classes", klickText("My classes"));
  await schritt("Reiter All classes (gesperrt)", klickText("All classes"));

  for (const reiter of ["Overview", "Timetable", "Documents", "Plan a lesson", "German"]) {
    await schritt(`Reiter ${reiter}`, klickText(reiter));
  }

  // Zurueck auf Overview, dann ein Kind oeffnen
  await schritt("Reiter Overview", klickText("Overview"));
  await schritt(
    "Schüler-Detail Emma K.",
    `(() => {
      const el = [...document.querySelectorAll('button')].find(
        (b) => (b.textContent || '').includes('Emma K.'),
      );
      if (!el) return false;
      el.click();
      return true;
    })()`,
  );

  // Zeugnisbemerkung: erzeugen, zweite Formulierung
  await schritt("Reiter Report comment", klickText("Report comment"));
  await schritt("Entwurf erzeugt", klickText("Generate a draft"));
  await schritt("Zweite Formulierung", klickText("Another wording"));
  await schritt("Dritte Formulierung (zurück auf Variante 1)", klickText("Another wording"));

  // Elternpost: entwerfen, jede Sprache
  await schritt("Reiter Parent email", klickText("Parent email"));
  await schritt("Elternmail entworfen", klickText("Draft a parent email"));
  for (const sprache of ["EN", "TR", "AR"]) {
    await schritt(`Sprachumschalter ${sprache}`, klickText(sprache));
  }

  await schritt("Zurück zur Klassenansicht", klickText("Back to the class view"));

  /* ---- Stundenplan ---- */
  await schritt("Reiter Timetable", klickText("Timetable"));
  for (const fach of ["German", "Maths", "General studies"]) {
    await schritt(`Fach ${fach}`, klickText(fach));
  }
  await schritt("Stunde gesetzt", klickAusdruck("td button", 0));
  await schritt("Stunde entfernt", klickAusdruck("td button", 0));

  /* ---- Sitzplan (Unterricht planen) ---- */
  await schritt("Reiter Plan a lesson", klickText("Plan a lesson"));
  await schritt("Kind aufgenommen", klickText("Seat of EK"));
  await schritt("Auf freien Platz gesetzt", klickText("Free seat"));
  await schritt("Gesperrter Platz angetippt", klickText("Locked seat"));
  await schritt(
    "Platz gesperrt",
    klickAusdruck("button[aria-label^='Lock seat']", 0),
  );
  await schritt(
    "Platz freigegeben",
    klickAusdruck("button[aria-label^='Unlock']", 0),
  );

  /* ---- Timeline ---- */
  await schritt("Bereich Timeline", klickText("Timeline"));
  for (const kind of ["Emma K.", "Yusuf A.", "Lotta B."]) {
    await schritt(`Timeline ${kind}`, klickText(kind));
    for (let i = 0; i < 3; i++) {
      await schritt(`Timeline-Eintrag ${i + 1}`, klickAusdruck("ol li button", i));
    }
  }

  /* ---- Material ---- */
  await schritt("Bereich Materials", klickText("Materials"));
  for (let i = 0; i < 3; i++) {
    await schritt(`Thema ${i + 1}`, klickAusdruck("button[aria-pressed]", i));
  }
  for (let i = 0; i < 3; i++) {
    await schritt(`Fundstelle ${i + 1}`, klickAusdruck("ul li button[aria-pressed]", i));
  }
  await schritt("Material erzeugt", klickText("Generate materials"));

  /* ---- Zurücksetzen ---- */
  await schritt("Zurücksetzen", klickText("Reset"));

  /* ---- Prüfung ---- */
  let treffer = 0;
  for (const zeile of gesehen) {
    for (const t of findeDeutsch(zeile)) {
      treffer++;
      fail(`/preview (Zustand): ${t.grund} in „${t.text}"`);
    }
  }

  console.log(
    `\n  ${zustaende} aufgenommene Zustände, ${gesehen.size} verschiedene Textzeilen, ${treffer} Treffer`,
  );
  if (verfehlt > 0) {
    console.log(`  ${verfehlt} Schritte übersprungen (Ziel nicht gefunden)`);
  }

  return { zustaende, zeilen: gesehen.size, verfehlt };
}

/* ========================================================================= */
/* Lauf                                                                      */
/* ========================================================================= */
console.log("Animations- und Zustands-Prüfung gegen " + base + "\n");

const browser = await starteBrowser();
let bericht = null;

try {
  const animZeilen = await teilA(browser);
  const b = await teilB(browser);
  bericht = { animZeilen, ...b };
} finally {
  browser.kind.kill();
}

console.log("\n==========================================================");
console.log(`Textzeilen aus Animationsschritten: ${bericht.animZeilen}`);
console.log(`Bedienbare Zustände auf /preview:   ${bericht.zustaende}`);
console.log(`Verschiedene Textzeilen /preview:   ${bericht.zeilen}`);
console.log(`DEUTSCHE FUNDSTELLEN:               ${probleme}`);
console.log("==========================================================");

/* Bericht als Datei – die Zahlen gehören ins Protokoll, nicht nur ins Log. */
fs.writeFileSync(
  path.join("screenshots", "animations-pruefung.txt"),
  [
    "Animations- und Zustands-Prüfung der englischen Fassung",
    "",
    "Geprüft wird der Text, der erst durch ZEIT (Animationsschritte) oder",
    "durch KLICKS (/preview) entsteht – also genau das, was scripts/",
    "german-check.mjs im ausgelieferten HTML nicht sehen kann.",
    "",
    "Ohne prefers-reduced-motion: die Zwischenschritte sind der Zweck.",
    "Dieselben Muster wie der HTML-Detektor (scripts/lib/deutsch-muster.mjs).",
    "",
    `Textzeilen aus Animationsschritten: ${bericht.animZeilen}`,
    `Bedienbare Zustände auf /preview:   ${bericht.zustaende}`,
    `Verschiedene Textzeilen /preview:   ${bericht.zeilen}`,
    `Übersprungene Schritte:             ${bericht.verfehlt}`,
    `DEUTSCHE FUNDSTELLEN:               ${probleme}`,
    "",
  ].join("\n"),
  "utf8",
);

console.log(
  probleme === 0
    ? "ANIMATIONS-PRÜFUNG BESTANDEN – 0 Fundstellen."
    : "ANIMATIONS-PRÜFUNG FEHLGESCHLAGEN.",
);
process.exit(probleme === 0 ? 0 : 1);
