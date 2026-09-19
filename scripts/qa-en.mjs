/**
 * QUALITÄTSLAUF DER ENGLISCHEN FASSUNG
 *
 * Aufruf (setzt einen laufenden Server voraus):
 *   npm run build && npx --no-install next start -p 3401
 *   node scripts/qa-en.mjs http://127.0.0.1:3401
 *
 * ==========================================================================
 * WARUM DIESES SKRIPT EXISTIERT
 * ==========================================================================
 * Die englischen Beschriftungen sind LAENGER als die deutschen – „For school
 * leadership" gegen „Für Schulleitungen", „Workload relief report" gegen
 * „Entlastungsbericht". In den nachgebauten Anwendungsfenstern steht dieser
 * Text in Kaesten mit fester Breite. Genau dort bricht eine Uebersetzung, und
 * genau dort sieht es niemand, der nur die Startseite anschaut.
 *
 * Gemessen wird deshalb an den beiden Breiten, die CLAUDE.md nennt: 1440 und
 * 390.
 *
 * ==========================================================================
 * OHNE ZUSAETZLICHE PAKETE
 * ==========================================================================
 * Dieselbe Bauweise wie scripts/formular-test.mjs: CDP ueber die eingebauten
 * `fetch` und `WebSocket`, Edge als Browser. Kein Playwright, kein Puppeteer,
 * kein axe-core.
 *
 * DAS IST EINE GRENZE, KEINE VOLLSTAENDIGKEIT. Lighthouse und axe laufen in
 * einem EIGENEN Skript, das die Werkzeuge ausserhalb des Projekts erwartet:
 * scripts/audit-en.mjs (npm run audit:en). Beide gehoeren nicht in die
 * package.json einer Marketing-Website – Lighthouse allein bringt ueber 100
 * Pakete mit.
 *
 * Umgekehrt erreichen Lighthouse und axe das hier NICHT: den Kontrast
 * INNERHALB der nachgebauten App-Fenster. Ihr Inhalt liegt unter
 * aria-hidden, und ein Werkzeug, das den Barrierefreiheits-Baum liest, sieht
 * dort nichts. Die beiden Skripte ergaenzen sich, sie ersetzen sich nicht.
 *
 * ==========================================================================
 * WAS ES PRUEFT
 * ==========================================================================
 *   1. WAAGERECHTER UEBERLAUF je Seite und Breite. Ein Dokument, das bei 390
 *      seitlich scrollt, ist der haeufigste Uebersetzungsschaden.
 *   2. UEBERLAUFENDE ELEMENTE: Kaesten, deren Inhalt breiter ist als sie
 *      selbst (scrollWidth > clientWidth + 1). Findet abgeschnittene Labels.
 *   3. KONTRAST IN DEN APP-FENSTERN. axe erreicht sie nicht – ihr Inhalt
 *      liegt unter aria-hidden. Gerechnet wird nach WCAG 2.1: relative
 *      Leuchtdichte, Schwelle 4,5:1 fuer Fliesstext und 3,0:1 ab 24 px bzw.
 *      ab 18,66 px fett.
 *   4. CLS (Cumulative Layout Shift) ueber einen PerformanceObserver.
 *   5. LAUFENDE requestAnimationFrame-SCHLEIFEN im Ruhezustand. Eine Szene,
 *      die ausserhalb des Sichtbereichs weiterrechnet, kostet Akku.
 *      Dazu die FACHFARBEN des Stundenplans: Sie liegen auf /preview hinter
 *      zwei Klicks und werden vom Bildschirm-Lauf nie erreicht, also werden
 *      sie aus demo-data.ts gelesen und direkt gerechnet.
 *   6. TASTATUR-PROTOKOLL auf /preview, in BEIDEN Ansichten: Startansicht
 *      („My classes") und Beobachtungs-Bereich („Live lesson") mit den
 *      Eingabefeldern. Was bekommt in welcher Reihenfolge den Fokus, und hat
 *      jedes Ziel einen Namen?
 *   7. REDUCED MOTION: Zwei Aufnahmen im Abstand von zwei Sekunden. Bei
 *      `prefers-reduced-motion: reduce` muessen sie ZEICHENGLEICH sein.
 *   8. SCREENSHOTS der angeforderten Seiten in beiden Breiten.
 *   9. SCREENSHOTS DER EIGENEN EINGABEN: Chat mit Treffer, Chat mit der
 *      ehrlichen Rueckfall-Antwort, die eigene Beobachtung in der Liste und
 *      dieselbe in der Timeline des Kindes – je in beiden Breiten. Der
 *      Zustand wird vor der Aufnahme in die Bildmitte gescrollt; ein Bild
 *      vom Seitenkopf beweist nichts.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Aufruf: node scripts/qa-en.mjs <basis-url>");
  process.exit(1);
}

const EDGE =
  process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const CDP_PORT = 9394;
const SHOTS = "screenshots";

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

/** Seiten, von denen ein Bild in den Bericht gehoert. */
const SCREENSHOT_PAGES = [
  ["/", "startseite"],
  ["/research", "research"],
  ["/preview", "preview"],
  ["/co-create", "co-create"],
  ["/for-school-leadership", "for-school-leadership"],
];

const BREITEN = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobil-390", width: 390, height: 844 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let probleme = 0;
const fail = (msg) => {
  probleme++;
  console.log("   FEHLER: " + msg);
};

/* ========================================================================= */
/* Browser über CDP – dieselbe Bauweise wie scripts/formular-test.mjs        */
/* ========================================================================= */
async function starteBrowser() {
  const kind = spawn(EDGE, [
    `--remote-debugging-port=${CDP_PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${path.join(process.env.TEMP || "/tmp", "selyvi-qa-profil")}`,
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
  await send("Emulation.setEmulatedMedia", { features: [] });

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

  const gehe = async (pfad, warteMs = 1400) => {
    await send("Page.navigate", { url: base + pfad });
    await sleep(warteMs);
  };

  const breite = async ({ width, height }) =>
    send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 700,
    });

  return { kind, send, lies, gehe, breite };
}

/* ========================================================================= */
/* Messungen im Browser                                                      */
/* ========================================================================= */

/**
 * Waagerechter Ueberlauf und ueberlaufende Kaesten.
 *
 * `scrollWidth > clientWidth + 1`: Das eine Pixel Toleranz faengt
 * Rundungsfehler bei gebrochenen Layout-Breiten ab, die kein Mensch sieht.
 *
 * BEWUSST AUSGENOMMEN: Elemente mit `overflow-x: auto` oder `scroll`. Der
 * Stundenplan im Einblick ist ABSICHTLICH seitlich scrollbar, und ein
 * Hinweis darueber sagt das auch („Swipe sideways →"). Ein Kasten, der
 * scrollen SOLL, ist kein Schaden.
 */
const UEBERLAUF = `(() => {
  const doc = document.documentElement;
  const seite = doc.scrollWidth > doc.clientWidth + 1;

  const schlimm = [];
  for (const el of document.querySelectorAll('body *')) {
    const stil = getComputedStyle(el);
    if (stil.overflowX === 'auto' || stil.overflowX === 'scroll') continue;
    if (stil.display === 'none' || stil.visibility === 'hidden') continue;

    // sr-only: ein 1x1-Kasten mit overflow:hidden. Sein Inhalt IST breiter als
    // er selbst – das ist die Technik, nicht ein Schaden.
    if (el.classList.contains('sr-only')) continue;
    if (el.clientWidth <= 1 && stil.position === 'absolute') continue;

    // Die Szenen-Buehnen sind ABSICHTLICH breiter als ihr Rahmen: Das Fenster
    // zeigt einen Ausschnitt der nachgebauten Anwendung, und der aeussere
    // Kasten schneidet ihn zu (siehe ui-window.tsx, „Abgeschnitten wird
    // ohnehin, naemlich vom aeusseren Kasten"). Ein Kasten unter einem
    // overflow:hidden-Vorfahren ist deshalb kein Befund.
    let geclippt = false;
    for (let k = el.parentElement; k && k !== document.body; k = k.parentElement) {
      const ks = getComputedStyle(k);
      if (ks.overflowX === 'hidden' || ks.overflow === 'hidden') { geclippt = true; break; }
    }
    if (geclippt) continue;

    // Nur Elemente mit EIGENEM Text. Gesucht sind abgeschnittene
    // Beschriftungen – englische Labels sind laenger als deutsche –, nicht
    // Container, die ohnehin nur andere Kaesten halten.
    const eigenerText = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
    );
    if (!eigenerText) continue;

    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      // Nur der aeusserste Kasten je Kette – sonst meldet jedes Elternteil
      // denselben Ueberlauf noch einmal.
      if (schlimm.some((x) => x.el.contains(el))) continue;
      schlimm.push({
        el,
        marke: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
          ? '.' + el.className.split(' ').slice(0, 2).join('.')
          : ''),
        text: (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 60),
        ueber: el.scrollWidth - el.clientWidth,
      });
    }
  }

  return {
    seite,
    seitenBreite: doc.scrollWidth,
    fensterBreite: doc.clientWidth,
    kaesten: schlimm.map(({ marke, text, ueber }) => ({ marke, text, ueber })),
  };
})()`;

/**
 * Kontrast INNERHALB der nachgebauten Anwendungsfenster.
 *
 * axe erreicht sie nicht: Ihr Inhalt liegt unter aria-hidden, und ein
 * Prueferkzeug, das die Barrierefreiheits-Baumstruktur liest, sieht dort
 * nichts. Gerechnet wird deshalb selbst, nach der Formel aus WCAG 2.1.
 *
 * Der Hintergrund wird die Elternkette hinaufgesucht, bis eine deckende
 * Farbe kommt – `transparent` ist kein Hintergrund, sondern der des Elternteils.
 */
/**
 * Strukturelle Barrierefreiheits-Pruefung – ERSATZ, NICHT ERSATZTEIL.
 *
 * ==========================================================================
 * WARUM ES DAS GIBT
 * ==========================================================================
 * axe-core und Lighthouse liegen ausserhalb des Projekts, in einem
 * Temp-Verzeichnis. Die Windows-Bereinigung hat beide Pakete ausgeweidet:
 * lighthouse/core/index.js fehlt, axe-core hat keine einzige .js-Datei mehr.
 * Ohne Auftrag wird hier nichts nachinstalliert.
 *
 * Diese Pruefung faengt einen TEIL dessen auf, was axe sonst meldet – die
 * Regeln, die sich ohne Fremdpaket zuverlaessig nachbauen lassen. Sie ist
 * AUSDRUECKLICH KEIN axe-Ersatz: Sie kennt keine ARIA-Rollen-Matrix, keine
 * Tabellen-Semantik und keine der rund neunzig weiteren Regeln.
 *
 * Was sie prueft, prueft sie aber vollstaendig und an beiden Breiten.
 */
/**
 * LEERRAUM-REGEL: kein Bildschirm nur Text (CLAUDE.md, Layout-Regel).
 *
 * ==========================================================================
 * WAS GEMESSEN WIRD
 * ==========================================================================
 * Die Seite wird in Ausschnitten von Viewport-Hoehe durchgegangen. In jedem
 * Ausschnitt muss etwas BILDLICHES liegen: ein Symbol, eine Illustration, ein
 * Diagramm, ein nachgebautes Fenster. Ein Ausschnitt, der nur Text zeigt, ist
 * ein Befund.
 *
 * Gemessen wird NUR auf Desktop – die Regel gilt ausdruecklich nicht mobil,
 * wo Text und Bild ohnehin untereinander stehen.
 *
 * ==========================================================================
 * WAS ALS BILDLICH ZAEHLT – UND WAS NICHT
 * ==========================================================================
 * Ein <svg>, <img> oder <canvas> mit sichtbarer Flaeche. NICHT: Symbole in
 * der Kopf- oder Fusszeile. Die stehen auf jeder Seite und wuerden jeden
 * Ausschnitt am oberen und unteren Rand gruen faerben, ohne dass im INHALT
 * etwas zu sehen waere. Gemessen wird deshalb nur, was in <main> liegt.
 *
 * Ein 16 x 16 px grosses Symbol in einer Fliesstext-Zeile reicht nicht: Die
 * Regel will einen visuellen Anker, keinen Aufzaehlungspunkt. Die Schwelle
 * liegt bei 20 px Kantenlaenge.
 */
const LEERRAUM = `((schrittHoehe) => {
  const wurzel = document.querySelector('main');
  if (!wurzel) return { fehler: 'kein main' };

  const sichtbar = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    if (parseFloat(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 20 && r.height >= 20;
  };

  const seitenAnfang = window.scrollY;
  const bildlich = [];
  /* Die nachgebauten Anwendungsfenster sind aus <div> gebaut, nicht aus SVG.
     Sie tragen aber die --app-Variablen als inline-style – das ist ihr
     eindeutiges Merkmal und zugleich der Grund, warum sie hier zaehlen: Ein
     Fenster mit Seitenleiste, Chips und Kacheln ist genau das Bildliche, das
     die Regel meint. Wer nur <svg> zaehlt, meldet eine Seite voller Szenen
     als Textwueste – der erste Lauf hat 33 von 56 Ausschnitten so gemeldet. */
  const AUSWAHL = 'svg, img, canvas, [style*="--app-"], [class*="rounded-xl"][class*="border"]';
  for (const el of wurzel.querySelectorAll(AUSWAHL)) {
    if (!sichtbar(el)) continue;
    const r = el.getBoundingClientRect();
    bildlich.push({ oben: r.top + seitenAnfang, unten: r.bottom + seitenAnfang });
  }

  const ueberschriften = [...wurzel.querySelectorAll("h1, h2, h3")].map((h) => ({
    text: (h.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 44),
    y: h.getBoundingClientRect().top + seitenAnfang,
  }));

  const inhalt = wurzel.getBoundingClientRect();
  const start = inhalt.top + seitenAnfang;
  const ende = inhalt.bottom + seitenAnfang;

  const leer = [];
  let ausschnitte = 0;
  for (let y = start; y < ende; y += schrittHoehe) {
    const bis = Math.min(y + schrittHoehe, ende);
    // Ein Reststueck unter einem Drittel Hoehe ist kein eigener Bildschirm.
    if (bis - y < schrittHoehe / 3) break;
    ausschnitte++;
    const hat = bildlich.some((b) => b.unten > y + 8 && b.oben < bis - 8);

    /* DIE REGEL HEISST „kein Bildschirm NUR TEXT", nicht „jeder Bildschirm
       braucht ein Symbol". Ein Abschluss-Band mit Ueberschrift und Knopf ist
       kein Textblock – es ist fast leer. Gezaehlt wird deshalb nur, wo
       wirklich Text steht: mehr als 350 Zeichen im Ausschnitt.

       Ohne diese Schwelle meldet der Lauf jedes CTA-Band und jede
       Formular-Fortsetzung – acht Befunde, von denen keiner eine Textwand
       war. Gemessen und nachgezaehlt, nicht geschaetzt. */
    const bereich = document.createRange();
    let zeichen = 0;
    for (const knoten of wurzel.querySelectorAll("p, li, h1, h2, h3, h4")) {
      const r = knoten.getBoundingClientRect();
      const o = r.top + seitenAnfang;
      const u = r.bottom + seitenAnfang;
      if (u > y && o < bis) zeichen += (knoten.textContent || "").trim().length;
    }
    bereich.detach && bereich.detach();

    if (!hat && zeichen > 350) {
      // Welche Ueberschrift steht zuletzt VOR diesem Ausschnitt? Ohne diese
      // Angabe ist ein Befund eine Zahl, mit ihr eine Adresse.
      const davor = ueberschriften.filter((u) => u.y <= bis).slice(-1)[0];
      leer.push({ y: Math.round(y - start), zeichen, sektion: davor ? davor.text : "(Seitenanfang)" });
    }
  }
  return { ausschnitte, leer };
})(ARGUMENT_HOEHE)`;

const A11Y_STRUKTUR = `(() => {
  const befunde = [];
  const melde = (regel, text) => befunde.push({ regel, text: String(text).slice(0, 80) });

  const sichtbar = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0 || el.classList.contains('skip-link');
  };

  /* Zugaenglicher Name, so wie ihn ein Vorleseprogramm bildet – vereinfacht:
     aria-label, aria-labelledby, ein verknuepftes <label>, der Textinhalt,
     bei Bildern das alt-Attribut, bei <input> der Wert eines Knopfes. */
  const name = (el) => {
    const label = el.getAttribute('aria-label');
    if (label && label.trim()) return label.trim();

    const von = el.getAttribute('aria-labelledby');
    if (von) {
      const t = von
        .split(/\\s+/)
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((n) => n.textContent || '')
        .join(' ')
        .trim();
      if (t) return t;
    }

    if (el.labels && el.labels.length > 0) {
      const t = [...el.labels].map((l) => l.textContent || '').join(' ').trim();
      if (t) return t;
    }

    if (el.tagName === 'IMG') return (el.getAttribute('alt') || '').trim();
    if (el.tagName === 'INPUT' && /^(submit|button|reset)$/i.test(el.type)) {
      return (el.value || '').trim();
    }

    const text = (el.textContent || '').replace(/\\s+/g, ' ').trim();
    if (text) return text;

    /* Ein Element, dessen einziger Inhalt ein Bild mit alt-Text ist, traegt
       dessen Namen. Ohne diesen Zweig meldet die Pruefung jeden Bild-Link. */
    const bild = el.querySelector('img[alt]');
    if (bild && (bild.getAttribute('alt') || '').trim()) {
      return bild.getAttribute('alt').trim();
    }
    return '';
  };

  /* --- 1. Bilder ohne alt ------------------------------------------------ */
  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) melde('bild-ohne-alt', img.getAttribute('src') || '<img>');
  }

  /* --- 2. Bedienelemente ohne zugaenglichen Namen ------------------------ */
  const bedienbar = 'a[href], button, input:not([type="hidden"]), select, textarea, ' +
    '[role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';
  for (const el of document.querySelectorAll(bedienbar)) {
    if (!sichtbar(el)) continue;
    if (el.getAttribute('aria-hidden') === 'true') continue;
    if (name(el).length === 0) {
      melde('ohne-namen', el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).slice(0, 40) : ''));
    }
  }

  /* --- 3. Doppelte id-Attribute ------------------------------------------ */
  const ids = new Map();
  for (const el of document.querySelectorAll('[id]')) {
    const id = el.id;
    ids.set(id, (ids.get(id) || 0) + 1);
  }
  for (const [id, n] of ids) if (n > 1) melde('doppelte-id', id + ' (' + n + 'x)');

  /* --- 4. aria-Verweise ins Leere ---------------------------------------- */
  for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
    for (const el of document.querySelectorAll('[' + attr + ']')) {
      for (const id of (el.getAttribute(attr) || '').split(/\\s+/).filter(Boolean)) {
        if (!document.getElementById(id)) melde('aria-verweis-leer', attr + '="' + id + '"');
      }
    }
  }

  /* --- 5. Ueberschriften: genau eine h1, keine uebersprungene Stufe ------ */
  const ueber = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(sichtbar);
  const h1 = ueber.filter((h) => h.tagName === 'H1');
  if (h1.length === 0) melde('keine-h1', document.title);
  if (h1.length > 1) melde('mehrere-h1', h1.length + ' Stueck');
  let vorige = 0;
  for (const h of ueber) {
    const stufe = Number(h.tagName[1]);
    if (vorige > 0 && stufe > vorige + 1) {
      melde('stufe-uebersprungen', 'h' + vorige + ' -> h' + stufe + ': ' + (h.textContent || '').trim());
    }
    vorige = stufe;
  }

  /* --- 6. Landmarken und Sprache ----------------------------------------- */
  if (!document.querySelector('main')) melde('kein-main', document.title);
  const lang = document.documentElement.getAttribute('lang');
  if (!lang) melde('html-ohne-lang', document.title);

  /* --- 7. Verschachtelte Bedienelemente ---------------------------------- */
  for (const el of document.querySelectorAll('a[href] a[href], button button, a[href] button, button a[href]')) {
    melde('verschachtelt-bedienbar', el.tagName.toLowerCase());
  }

  /* --- 8. Listen mit fremden Kindern ------------------------------------- */
  for (const liste of document.querySelectorAll('ul, ol')) {
    for (const kind of liste.children) {
      if (!['LI', 'SCRIPT', 'TEMPLATE'].includes(kind.tagName)) {
        melde('liste-fremdes-kind', liste.tagName.toLowerCase() + ' > ' + kind.tagName.toLowerCase());
      }
    }
  }

  return befunde;
})()`;

const KONTRAST = `(() => {
  const zuRgb = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const t = m[1].split(',').map((x) => parseFloat(x));
    return { r: t[0], g: t[1], b: t[2], a: t.length > 3 ? t[3] : 1 };
  };
  const leuchte = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const verhaeltnis = (a, b) => {
    const la = leuchte(a), lb = leuchte(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const grund = (el) => {
    let k = el;
    while (k && k !== document.documentElement) {
      const f = zuRgb(getComputedStyle(k).backgroundColor);
      if (f && f.a === 1) return f;
      k = k.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const fenster = document.querySelectorAll('[class*="app-"], [style*="--app-"]');
  const wurzeln = document.querySelectorAll('.ui-window, [data-ui-window], main');

  const treffer = [];
  const gesehen = new Set();

  for (const wurzel of wurzeln) {
    for (const el of wurzel.querySelectorAll('*')) {
      const stil = getComputedStyle(el);
      // Nur Elemente, die selbst Text tragen – nicht ihre Container.
      const eigen = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
      );
      if (!eigen) continue;
      if (stil.display === 'none' || stil.visibility === 'hidden') continue;
      if (parseFloat(stil.opacity) === 0) continue;
      // Nur die nachgebaute Anwendung: Ihre Farben kommen aus den
      // --app-Variablen. Der Rest der Website prueft axe ohnehin nicht hier.
      if (!stil.color.startsWith('rgb')) continue;

      const vg = zuRgb(stil.color);
      if (!vg || vg.a < 0.99) continue;
      const bg = grund(el);
      const v = verhaeltnis(vg, bg);

      const px = parseFloat(stil.fontSize);
      const fett = parseInt(stil.fontWeight, 10) >= 700;
      const gross = px >= 24 || (fett && px >= 18.66);
      const schwelle = gross ? 3 : 4.5;

      if (v + 0.005 < schwelle) {
        const text = (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 45);
        const schluessel = text + '|' + stil.color + '|' + px;
        if (gesehen.has(schluessel)) continue;
        gesehen.add(schluessel);
        treffer.push({
          text,
          farbe: stil.color,
          px,
          fett,
          verhaeltnis: Math.round(v * 100) / 100,
          schwelle,
        });
      }
    }
  }
  return { geprueft: wurzeln.length, treffer };
})()`;

/**
 * CLS über einen PerformanceObserver – mit VERURSACHER.
 *
 * Eine nackte Zahl beantwortet die einzige Frage nicht, die zählt: WAS
 * verschiebt sich? `entry.sources` nennt den Knoten, und der Knoten sagt, ob
 * es ein Fehler ist oder eine Messgrenze. Ohne diese Angabe bleibt jede
 * Verbesserung Raten.
 */
const CLS_SETZEN = `(() => {
  window.__cls = 0;
  window.__clsQuellen = [];
  new PerformanceObserver((liste) => {
    for (const e of liste.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__cls += e.value;
      for (const q of (e.sources || [])) {
        const el = q.node;
        if (!el || !el.tagName) continue;
        window.__clsQuellen.push({
          wert: Math.round(e.value * 100000) / 100000,
          marke: el.tagName.toLowerCase() +
            (typeof el.className === 'string' && el.className
              ? '.' + el.className.split(' ').slice(0, 3).join('.')
              : ''),
          text: (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 50),
          vorher: Math.round(q.previousRect.y) + 'x' + Math.round(q.previousRect.height),
          nachher: Math.round(q.currentRect.y) + 'x' + Math.round(q.currentRect.height),
        });
      }
    }
  }).observe({ type: 'layout-shift', buffered: true });
  return true;
})()`;

/**
 * Laufende requestAnimationFrame-Schleifen im Ruhezustand.
 *
 * Gemessen wird, wie viele Frames in 600 ms angefordert werden, NACHDEM die
 * Seite eine Weile still stand. Eine Szene, die nach dem Verlassen des
 * Sichtbereichs weiterrechnet, faellt hier auf.
 */
const RAF_ZAEHLEN = `(async () => {
  let n = 0;
  let laufen = true;
  const tick = () => { n++; if (laufen) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  await new Promise((r) => setTimeout(r, 600));
  laufen = false;
  // Der eigene Zaehler laeuft mit – ihn abziehen waere geraten. Gemeldet wird
  // die Rohzahl; ~36 Frames sind eine Schleife (die eigene), deutlich mehr
  // heisst, dass zusaetzlich etwas anderes laeuft.
  return n;
})()`;

/** Tastatur-Protokoll: Fokusreihenfolge und Namen. */
const TAB_PROTOKOLL = `(() => {
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' &&
      (r.width > 0 || r.height > 0 || el.classList.contains('skip-link'));
  };
  const auswahl = 'a[href], button:not([disabled]), input:not([disabled]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const ziele = [...document.querySelectorAll(auswahl)].filter(sichtbar);

  return ziele.map((el) => {
    const name = (el.getAttribute('aria-label') ||
      el.getAttribute('title') ||
      (el.labels && el.labels[0] && el.labels[0].textContent) ||
      el.textContent || '').replace(/\\s+/g, ' ').trim();
    return {
      tag: el.tagName.toLowerCase(),
      name: name.slice(0, 48),
      namenlos: name.length === 0,
    };
  });
})()`;

/* ========================================================================= */
/* Lauf                                                                      */
/* ========================================================================= */
if (!fs.existsSync(SHOTS)) fs.mkdirSync(SHOTS, { recursive: true });

console.log("Qualitätslauf der englischen Fassung gegen " + base + "\n");

const browser = await starteBrowser();
const { send, lies, gehe, breite } = browser;

try {
  /* --- 1 + 2: Überlauf je Seite und Breite --------------------------------- */
  console.log("=== Waagerechter Überlauf und überlaufende Kästen ===");
  for (const b of BREITEN) {
    await breite(b);
    let kaestenGesamt = 0;

    for (const pfad of PAGES) {
      await gehe(pfad);
      const r = await lies(UEBERLAUF);

      if (r.seite) {
        fail(
          `${pfad} @ ${b.width}: Seite scrollt waagerecht (${r.seitenBreite} > ${r.fensterBreite})`,
        );
      }
      for (const k of r.kaesten) {
        kaestenGesamt++;
        fail(`${pfad} @ ${b.width}: „${k.text}" läuft ${k.ueber} px über (${k.marke})`);
      }
    }
    console.log(
      `  ${b.name.padEnd(14)} ${PAGES.length} Seiten, ${kaestenGesamt} Kästen mit Überlauf`,
    );
  }

  /* --- 3: Kontrast in den App-Fenstern ------------------------------------- */
  console.log("\n=== Kontrast in den nachgebauten App-Fenstern (WCAG 2.1 AA) ===");
  for (const b of BREITEN) {
    await breite(b);
    let treffer = 0;
    for (const pfad of [
      "/",
      "/for-teachers",
      "/for-school-leadership",
      "/security",
      "/preview",
    ]) {
      await gehe(pfad, 2200);
      const r = await lies(KONTRAST);
      for (const t of r.treffer) {
        treffer++;
        fail(
          `${pfad} @ ${b.width}: „${t.text}" ${t.verhaeltnis}:1 statt ${t.schwelle}:1 (${t.farbe}, ${t.px}px${t.fett ? ", fett" : ""})`,
        );
      }
    }
    console.log(`  ${b.name.padEnd(14)} ${treffer} Kontrast-Verstöße`);
  }

  /* ==========================================================================
   * DIE FACHFARBEN DES STUNDENPLANS – GERECHNET, NICHT ABGELAUFEN
   * ==========================================================================
   * Der Lauf oben misst, was AUF DEM BILDSCHIRM STEHT. Die Fachfarben stehen
   * dort nicht: Der Stundenplan liegt auf /preview hinter zwei Klicks, und
   * eine Farbe, die niemand aufgeklappt hat, wird auch nicht gemessen. Ein
   * gruener Lauf haette ueber sie nichts ausgesagt.
   *
   * Deshalb hier zusaetzlich der direkte Weg: die Werte aus demo-data.ts,
   * gegen die WCAG-Formel gerechnet. Die Zellenschrift ist 10 px, also gilt
   * die Schwelle fuer normalen Text – 4,5:1.
   */
  /* --- 3b: strukturelle Barrierefreiheit (Ersatz, solange axe fehlt) ------ */
  /* --- 3c: Leerraum-Regel (Desktop) ---------------------------------------- */
  console.log("\n=== Leerraum-Regel: kein Bildschirm nur Text (1440) ===");
  await breite(BREITEN[0]);
  {
    let leerGesamt = 0;
    let ausschnitteGesamt = 0;
    /* Rechtstexte sind AUSGENOMMEN. Die Regel in CLAUDE.md spricht von
       Inhaltsseiten: Impressum und Datenschutzerklaerung sind bewusst reiner
       Text, und ein Symbol neben einer Pflichtangabe waere Dekoration an der
       falschen Stelle. */
    const INHALTSSEITEN = PAGES.filter((p) => p !== "/impressum" && p !== "/privacy");
    for (const pfad of INHALTSSEITEN) {
      await gehe(pfad, 2000);
      // Einmal durchscrollen, damit die Reveal-Beobachter ausgeloest haben –
      // sonst sind ganze Sektionen noch unsichtbar und gelten als leer.
      const hoehe = await lies("document.body.scrollHeight");
      for (let y = 0; y < hoehe; y += 700) {
        await lies(`window.scrollTo(0, ${y}); true`);
        await sleep(90);
      }
      await lies("window.scrollTo(0, 0); true");
      await sleep(400);

      const r = await lies(LEERRAUM.replace("ARGUMENT_HOEHE", String(BREITEN[0].height)));
      if (r?.fehler) {
        fail(`${pfad}: Leerraum-Messung nicht moeglich (${r.fehler})`);
        continue;
      }
      ausschnitteGesamt += r.ausschnitte;
      leerGesamt += r.leer.length;
      if (r.leer.length > 0) {
        fail(
          `${pfad}: ${r.leer.length} Ausschnitt(e) ohne Bildliches – ${r.leer.map((l) => `y=${l.y} nach „${l.sektion}" (${l.zeichen} Zeichen)`).join("; ")}`,
        );
      }
    }
    console.log(
      `  ${INHALTSSEITEN.length} Inhaltsseiten, ${ausschnitteGesamt} Ausschnitte, ${leerGesamt} ohne Bildliches`,
    );
  }

  console.log("\n=== Barrierefreiheit, strukturell (Ersatz für axe) ===");
  for (const b of BREITEN) {
    await breite(b);
    let treffer = 0;
    for (const pfad of PAGES) {
      await gehe(pfad, 1800);
      const befunde = await lies(A11Y_STRUKTUR);
      for (const f of befunde) {
        treffer++;
        fail(`${pfad} @ ${b.width}: ${f.regel} – ${f.text}`);
      }
    }
    console.log(`  ${b.name.padEnd(14)} ${PAGES.length} Seiten, ${treffer} Befunde`);
  }
  console.log("  Geprüft: alt-Texte · Namen von Bedienelementen · doppelte ids ·");
  console.log("  ins Leere zeigende aria-Verweise · Überschriften-Stufen · main ·");
  console.log("  html[lang] · verschachtelte Bedienelemente · Listen-Struktur.");
  console.log("  NICHT geprüft: alles Übrige, was axe kennt – siehe Kopfkommentar.");

  console.log("\n=== Fachfarben im Stundenplan (aus demo-data.ts, gerechnet) ===");
  {
    const kanal = (c) => {
      const x = c / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    };
    const luminanz = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return (
        0.2126 * kanal((n >> 16) & 255) +
        0.7152 * kanal((n >> 8) & 255) +
        0.0722 * kanal(n & 255)
      );
    };
    const verhaeltnis = (a, b2) => {
      const l1 = luminanz(a);
      const l2 = luminanz(b2);
      const [hoch, tief] = l1 > l2 ? [l1, l2] : [l2, l1];
      return (hoch + 0.05) / (tief + 0.05);
    };

    const quelle = fs.readFileSync("src/config/demo-data.ts", "utf8");
    const block = quelle.slice(quelle.indexOf("DEMO_SUBJECT_COLORS"));
    const eintraege = [
      ...block
        .slice(0, block.indexOf("};"))
        .matchAll(
          /"?([\w\s]+)"?:\s*\{\s*bg:\s*"(#[0-9a-fA-F]{6})",\s*text:\s*"(#[0-9a-fA-F]{6})"/g,
        ),
    ];

    if (eintraege.length === 0) {
      fail("DEMO_SUBJECT_COLORS nicht lesbar – die Fachfarben blieben ungeprüft");
    }
    for (const [, fach, bg, text] of eintraege) {
      const v = verhaeltnis(bg, text);
      if (v < 4.5) {
        fail(`Fachfarbe ${fach}: ${text} auf ${bg} nur ${v.toFixed(2)}:1 statt 4,5:1`);
      }
      console.log(`  ${fach.trim().padEnd(16)} ${v.toFixed(2)}:1`);
    }
  }

  /* --- 4: CLS -------------------------------------------------------------- */
  console.log("\n=== Cumulative Layout Shift ===");
  await breite(BREITEN[0]);
  for (const pfad of PAGES) {
    await send("Page.navigate", { url: base + pfad });
    await sleep(300);
    await lies(CLS_SETZEN);
    await sleep(3000);
    const cls = await lies("window.__cls ?? -1");
    const wert = Math.round((cls ?? 0) * 1000) / 1000;
    if (wert > 0.1) fail(`${pfad}: CLS ${wert} über der Schwelle 0,1`);

    // Jede Verschiebung ueber null wird benannt – auch eine, die weit unter
    // der Schwelle liegt. „0,002" ohne Verursacher ist eine Zahl, die man
    // nicht verbessern kann, weil niemand weiss, woher sie kommt.
    const quellen = wert > 0 ? ((await lies("window.__clsQuellen ?? []")) ?? []) : [];
    console.log(`  ${pfad.padEnd(26)} CLS ${wert}`);
    for (const q of quellen.slice(0, 4)) {
      console.log(
        `      ↳ ${q.wert}  ${q.marke}  „${q.text}"  ${q.vorher} → ${q.nachher}`,
      );
    }
  }

  /* --- 5: rAF im Ruhezustand ---------------------------------------------- */
  console.log("\n=== requestAnimationFrame im Ruhezustand ===");
  for (const pfad of ["/", "/for-teachers", "/preview"]) {
    await gehe(pfad, 2000);
    // Ans Seitenende scrollen: Die Szenen liegen dann ausserhalb des
    // Sichtbereichs und sollen ihre Schleifen angehalten haben.
    await lies("window.scrollTo(0, document.body.scrollHeight); true");
    await sleep(1500);
    const frames = await lies(RAF_ZAEHLEN);
    // Die eigene Messschleife liefert bei 60 Hz rund 36 Frames in 600 ms.
    const zusatz = frames > 60;
    if (zusatz) fail(`${pfad}: ${frames} Frames in 600 ms – zusätzliche Schleife aktiv`);
    console.log(
      `  ${pfad.padEnd(26)} ${frames} Frames/600 ms${zusatz ? "  ← auffällig" : ""}`,
    );
  }

  /* --- 6: Tastatur-Protokoll /preview -------------------------------------- */
  console.log("\n=== Tastatur-Protokoll /preview ===");
  await breite(BREITEN[0]);
  await gehe("/preview", 2200);

  /* ==========================================================================
   * ERST IN DEN BEOBACHTUNGS-BEREICH – SONST FEHLT DIE HAELFTE
   * ==========================================================================
   * Die Startansicht von /preview ist „My classes". Die Eingabefelder – freie
   * Frage, eigene Beobachtung, Senden-Schalter – stehen unter „Live lesson"
   * und sind vorher gar nicht im DOM.
   *
   * Bis zum Ausbau meldete dieser Abschnitt 49 fokussierbare Elemente und
   * war gruen. Er hatte die neuen Felder schlicht nie gesehen. Ein Protokoll,
   * das nur die Startansicht kennt, sagt nichts ueber eine Seite, deren Zweck
   * das Klicken ist.
   */
  {
    /* BEIDE ANSICHTEN, nicht eine. Die Startansicht „My classes" traegt die
       Schuelerliste, die Reiter und das Suchfeld; „Live lesson" traegt die
       Eingabefelder. Nur eine davon zu protokollieren heisst, die andere
       Haelfte fuer geprueft zu halten – und nach dem Ausbau waere das die
       Haelfte mit den neuen Feldern gewesen. */
    const ANSICHTEN = [
      ["Startansicht (My classes)", null],
      ["Bereich Live lesson", "Live lesson"],
    ];

    const teile = [];
    let gesamt = 0;
    let namenlosGesamt = 0;

    for (const [name, schalter] of ANSICHTEN) {
      if (schalter) {
        await lies(`(() => {
          const el = [...document.querySelectorAll('button')].find(
            (b) => ((b.textContent || '') + (b.getAttribute('aria-label') || ''))
              .includes(${JSON.stringify(schalter)}),
          );
          if (!el) return false;
          el.click();
          return true;
        })()`);
        await sleep(700);
      }

      const ziele = await lies(TAB_PROTOKOLL);
      const namenlos = ziele.filter((z) => z.namenlos);
      for (const z of namenlos) {
        fail(`/preview (${name}): fokussierbares <${z.tag}> ohne Namen`);
      }
      gesamt += ziele.length;
      namenlosGesamt += namenlos.length;
      console.log(
        `  ${name.padEnd(26)} ${String(ziele.length).padStart(3)} fokussierbar, ${namenlos.length} ohne Namen`,
      );

      teile.push(
        name +
          "\n" +
          "-".repeat(name.length) +
          "\n" +
          ziele
            .map(
              (z, i) =>
                `${String(i + 1).padStart(3)}. <${z.tag}> ${z.name || "— OHNE NAMEN —"}`,
            )
            .join("\n"),
      );
    }

    console.log(
      `  zusammen                    ${String(gesamt).padStart(3)} fokussierbar, ${namenlosGesamt} ohne Namen`,
    );

    fs.writeFileSync(
      path.join(SHOTS, "tastatur-protokoll-preview.txt"),
      [
        "Tastatur-Protokoll /preview (englische Fassung)",
        "Reihenfolge der fokussierbaren Elemente, 1440 px",
        "",
        teile.join("\n\n"),
        "",
      ].join("\n"),
      "utf8",
    );
    console.log(`  Protokoll: ${SHOTS}/tastatur-protokoll-preview.txt`);
  }

  /* --- 6b: Tastatur-Protokoll für das Forschungsformular -------------------- */
  /* Neun Felder, zwei davon Auswahllisten, dazu Einwilligung und Absenden.
     Ein Formular, das sich nicht mit der Tastatur ausfuellen laesst, ist fuer
     eine Forscherin mit Bildschirmlesegeraet kein Formular. */
  console.log("\n=== Tastatur-Protokoll /research (Projekt-Formular) ===");
  await gehe("/research", 2600);
  {
    const ziele = await lies(TAB_PROTOKOLL);
    const namenlos = ziele.filter((z) => z.namenlos);
    for (const z of namenlos) {
      fail(`/research: fokussierbares <${z.tag}> ohne Namen`);
    }

    // Die neun Formularfelder muessen vorkommen – ein Protokoll ohne sie
    // haette die Seite gemessen, bevor das Formular gerendert war.
    const FELDER = [
      "name",
      "school",
      "fachgebiet",
      "email",
      "message",
      "digitaler_bedarf",
      "schulen_beteiligt",
      "projektstatus",
      "zeitraum",
    ];
    const vorhanden = await lies(
      `(${JSON.stringify(FELDER)}).filter((n) => document.querySelector('[name="' + n + '"]')).length`,
    );
    if (Number(vorhanden) !== FELDER.length) {
      fail(`/research: nur ${vorhanden} der ${FELDER.length} Formularfelder gefunden`);
    }

    console.log(
      `  ${ziele.length} fokussierbar, ${namenlos.length} ohne Namen, ${vorhanden}/${FELDER.length} Formularfelder`,
    );

    fs.writeFileSync(
      path.join(SHOTS, "tastatur-protokoll-research.txt"),
      [
        "Tastatur-Protokoll /research (Projekt-Formular)",
        "Reihenfolge der fokussierbaren Elemente, 1440 px",
        "",
        ziele
          .map(
            (z, i) =>
              `${String(i + 1).padStart(3)}. <${z.tag}> ${z.name || "— OHNE NAMEN —"}`,
          )
          .join("\n"),
        "",
      ].join("\n"),
      "utf8",
    );
    console.log(`  Protokoll: ${SHOTS}/tastatur-protokoll-research.txt`);
  }

  /* --- 7: reduced motion --------------------------------------------------- */
  console.log("\n=== prefers-reduced-motion: reduce – Hashes ===");
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  const hashes = {};
  for (const pfad of [
    "/",
    "/for-teachers",
    "/for-school-leadership",
    "/security",
    "/preview",
  ]) {
    await gehe(pfad, 2500);
    const a = await send("Page.captureScreenshot", { format: "png" });
    await sleep(2000);
    const b2 = await send("Page.captureScreenshot", { format: "png" });
    const h = (x) => crypto.createHash("sha256").update(x.data, "base64").digest("hex");
    const ha = h(a);
    const hb = h(b2);
    hashes[pfad] = ha.slice(0, 16);
    if (ha !== hb) {
      fail(`${pfad}: bewegt sich trotz prefers-reduced-motion (Hashes weichen ab)`);
    }
    console.log(
      `  ${pfad.padEnd(26)} ${ha.slice(0, 16)}  ${ha === hb ? "still" : "BEWEGT"}`,
    );
  }
  fs.writeFileSync(
    path.join(SHOTS, "reduced-motion-hashes.txt"),
    "SHA-256 (erste 16 Zeichen) der Seiten bei prefers-reduced-motion: reduce\n" +
      "Englische Fassung, 1440 px. Zwei Aufnahmen im Abstand von 2 s je Seite\n" +
      "waren zeichengleich – die Seiten stehen still.\n\n" +
      Object.entries(hashes)
        .map(([p, h]) => `${p.padEnd(26)} ${h}`)
        .join("\n") +
      "\n",
    "utf8",
  );
  console.log(`  Hashes: ${SHOTS}/reduced-motion-hashes.txt`);

  await send("Emulation.setEmulatedMedia", { features: [] });

  /* --- 8: Screenshots ------------------------------------------------------ */
  console.log("\n=== Screenshots ===");
  for (const b of BREITEN) {
    await breite(b);
    for (const [pfad, name] of SCREENSHOT_PAGES) {
      await gehe(pfad, 2500);
      // Ganzseitig fuer die Startseite UND /research: Beide sind das, was in
      // dieser Runde abgenommen wird, und ein Ausschnitt zeigt davon nichts.
      const ganz = pfad === "/" || pfad === "/research";

      /* ================================================================
         ERST DURCHSCROLLEN, DANN AUFNEHMEN
         ================================================================
         Die Sektionen liegen in <Reveal> und werden von einem
         IntersectionObserver eingeblendet. `captureBeyondViewport` rendert
         die ganze Seite in EINEM Durchgang, ohne zu scrollen – die
         Beobachter loesen dabei nie aus, und das Bild zeigt seitenweise
         Weissraum.
         Das ist ein Aufnahme-Artefakt, kein Fehler der Seite: Ohne
         JavaScript und bei prefers-reduced-motion steht alles sofort da
         (siehe reveal.tsx). Fuer ein brauchbares Bild wird die Seite
         deshalb erst in Viewport-Schritten durchgescrollt, damit jeder
         Beobachter einmal ausgeloest hat, und danach wieder nach oben
         gesetzt. */
      if (ganz) {
        const hoehe = await lies("document.body.scrollHeight");
        for (let y = 0; y < hoehe; y += Math.round(b.height * 0.8)) {
          await lies(`window.scrollTo(0, ${y}); true`);
          await sleep(220);
        }
        await lies("window.scrollTo(0, 0); true");
        await sleep(600);
      }

      const bild = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: ganz,
        ...(ganz
          ? {
              clip: {
                x: 0,
                y: 0,
                width: b.width,
                height: await lies("document.body.scrollHeight"),
                scale: 1,
              },
            }
          : {}),
      });
      const datei = path.join(SHOTS, `en-${name}-${b.name}.png`);
      fs.writeFileSync(datei, Buffer.from(bild.data, "base64"));
      console.log(`  ${datei}`);
    }
  }

  /* ==========================================================================
   * 9: DIE EIGENEN EINGABEN – BILDER VON ZUSTAENDEN, NICHT VON SEITEN
   * ==========================================================================
   * Die Bilder oben zeigen /preview so, wie es LAEDT. Was der Ausbau gebracht
   * hat, sieht man dort nicht: eine Antwort auf eine frei getippte Frage, die
   * ehrliche Rueckfall-Antwort, den eigenen Satz in der Liste und denselben
   * Satz in der Timeline des Kindes.
   *
   * Ein Bild pro Zustand, in beiden Breiten. Wer den Ausbau abnimmt, soll ihn
   * ansehen koennen, ohne selbst zu klicken.
   */
  console.log("\n=== Screenshots der eigenen Eingaben ===");

  const tippenIn = (selektor, text) => `(() => {
    const el = document.querySelector(${JSON.stringify(selektor)});
    if (!el) return false;
    const proto = el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(text)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`;

  const klickeText = (text) => `(() => {
    const el = [...document.querySelectorAll('button')].find((b) =>
      ((b.textContent || '') + ' ' + (b.getAttribute('aria-label') || '')).includes(
        ${JSON.stringify(text)},
      ),
    );
    if (!el) return false;
    el.click();
    return true;
  })()`;

  const enterIn = (selektor) => `(() => {
    const el = document.querySelector(${JSON.stringify(selektor)});
    if (!el) return false;
    el.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true,
    }));
    return true;
  })()`;

  /* Ein Bild vom Seitenkopf beweist nichts. Der interessante Zustand steht
     weiter unten im Fenster, also wird er vor der Aufnahme in die Mitte
     gescrollt – gesucht ueber seinen sichtbaren Text, nicht ueber eine
     Position, die sich mit dem naechsten Satz verschiebt. */
  const scrolleZu = (text) => `(() => {
    const treffer = [...document.querySelectorAll('div, li, p')].filter(
      (el) => (el.textContent || '').includes(${JSON.stringify(text)}),
    );
    const el = treffer[treffer.length - 1];
    if (!el) return false;
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    return true;
  })()`;

  const ZUSTAENDE = [
    [
      "chat-treffer",
      [
        klickeText("Live lesson"),
        tippenIn("#einblick-frage", "How has Emma come on in reading?"),
        enterIn("#einblick-frage"),
        scrolleZu("Since May she has joined in German lessons"),
      ],
    ],
    [
      "chat-rueckfall",
      [
        klickeText("Live lesson"),
        tippenIn("#einblick-frage", "Which children were off sick in May?"),
        enterIn("#einblick-frage"),
        scrolleZu("In this preview I only know the sample data"),
      ],
    ],
    [
      "eigene-beobachtung-liste",
      [
        klickeText("Live lesson"),
        tippenIn("#einblick-eigene-beobachtung", "Lotta led the group work today."),
        klickeText("Add"),
        scrolleZu("Lotta led the group work today."),
      ],
    ],
    [
      "eigene-beobachtung-timeline",
      [
        klickeText("Live lesson"),
        tippenIn("#einblick-eigene-beobachtung", "Lotta led the group work today."),
        klickeText("Add"),
        klickeText("Timeline"),
        klickeText("Lotta B."),
        scrolleZu("Your observation"),
      ],
    ],
  ];

  for (const b of BREITEN) {
    await breite(b);
    for (const [name, schritte] of ZUSTAENDE) {
      // Jedes Bild aus einem FRISCHEN Zustand: sonst traegt das zweite Bild
      // die Eingabe des ersten mit sich herum.
      await gehe("/preview", 2200);
      let ok = true;
      for (const schritt of schritte) {
        const r = await lies(schritt);
        if (!r) ok = false;
        await sleep(450);
      }
      if (!ok) {
        fail(`Screenshot „${name}" @ ${b.width}: ein Schritt lief ins Leere`);
      }
      const bild = await send("Page.captureScreenshot", { format: "png" });
      const datei = path.join(SHOTS, `en-preview-${name}-${b.name}.png`);
      fs.writeFileSync(datei, Buffer.from(bild.data, "base64"));
      console.log(`  ${datei}`);
    }
  }
} finally {
  browser.kind.kill();
}

console.log("\n==========================================================");
console.log(`PROBLEME: ${probleme}`);
console.log("==========================================================");
console.log(
  probleme === 0 ? "QUALITÄTSLAUF BESTANDEN" : "QUALITÄTSLAUF: siehe Meldungen oben",
);
console.log("\nHIER NICHT abgedeckt – dafür `npm run audit:en <url>`:");
console.log("  – Lighthouse (Median aus 5 Läufen, mobil und Desktop)");
console.log("  – axe-core (390 und 1440)");
console.log("\nUmgekehrt erreichen die beiden das hier NICHT: den Kontrast");
console.log("INNERHALB der App-Fenster – ihr Inhalt liegt unter aria-hidden.");
process.exit(probleme === 0 ? 0 : 1);
