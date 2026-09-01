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
 *   6. TASTATUR-PROTOKOLL auf /preview: Was bekommt in welcher Reihenfolge
 *      den Fokus, und hat jedes Ziel einen Namen?
 *   7. REDUCED MOTION: Zwei Aufnahmen im Abstand von zwei Sekunden. Bei
 *      `prefers-reduced-motion: reduce` muessen sie ZEICHENGLEICH sein.
 *   8. SCREENSHOTS der angeforderten Seiten in beiden Breiten.
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
  ["/preview", "preview"],
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
      throw new Error(
        "Auswertung fehlgeschlagen: " + antwort.exceptionDetails.text,
      );
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
    console.log(`  ${b.name.padEnd(14)} ${PAGES.length} Seiten, ${kaestenGesamt} Kästen mit Überlauf`);
  }

  /* --- 3: Kontrast in den App-Fenstern ------------------------------------- */
  console.log("\n=== Kontrast in den nachgebauten App-Fenstern (WCAG 2.1 AA) ===");
  for (const b of BREITEN) {
    await breite(b);
    let treffer = 0;
    for (const pfad of ["/", "/for-teachers", "/for-school-leadership", "/security", "/preview"]) {
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
    console.log(`  ${pfad.padEnd(26)} ${frames} Frames/600 ms${zusatz ? "  ← auffällig" : ""}`);
  }

  /* --- 6: Tastatur-Protokoll /preview -------------------------------------- */
  console.log("\n=== Tastatur-Protokoll /preview ===");
  await breite(BREITEN[0]);
  await gehe("/preview", 2200);
  {
    const ziele = await lies(TAB_PROTOKOLL);
    const namenlos = ziele.filter((z) => z.namenlos);
    for (const z of namenlos) fail(`/preview: fokussierbares <${z.tag}> ohne Namen`);
    console.log(`  ${ziele.length} fokussierbare Elemente, ${namenlos.length} ohne Namen`);

    const protokoll = ziele
      .map((z, i) => `${String(i + 1).padStart(3)}. <${z.tag}> ${z.name || "— OHNE NAMEN —"}`)
      .join("\n");
    fs.writeFileSync(
      path.join(SHOTS, "tastatur-protokoll-preview.txt"),
      "Tastatur-Protokoll /preview (englische Fassung)\n" +
        "Reihenfolge der fokussierbaren Elemente, 1440 px\n\n" +
        protokoll +
        "\n",
      "utf8",
    );
    console.log(`  Protokoll: ${SHOTS}/tastatur-protokoll-preview.txt`);
  }

  /* --- 7: reduced motion --------------------------------------------------- */
  console.log("\n=== prefers-reduced-motion: reduce – Hashes ===");
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  const hashes = {};
  for (const pfad of ["/", "/for-teachers", "/for-school-leadership", "/security", "/preview"]) {
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
    console.log(`  ${pfad.padEnd(26)} ${ha.slice(0, 16)}  ${ha === hb ? "still" : "BEWEGT"}`);
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
      const ganz = pfad === "/";

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
