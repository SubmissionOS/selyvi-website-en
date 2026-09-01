/**
 * DEUTSCH-DETEKTOR
 *
 * Aufruf:
 *   node scripts/german-check.mjs http://localhost:3000
 *   node scripts/german-check.mjs https://selyvi.com
 *
 * ==========================================================================
 * WOFÜR ER DA IST
 * ==========================================================================
 * Diese Website ist die eigenstaendige englische Fassung von selyvi.de. Sie
 * ist durch UEBERSETZUNG entstanden, nicht durch Neuschreiben – und bei einer
 * Uebersetzung von rund 130 Dateien bleibt erfahrungsgemaess irgendwo ein
 * deutscher Satz stehen. Genau den findet dieses Skript.
 *
 * Er prueft das GERENDERTE HTML aller Seiten, nicht den Quelltext. Das ist
 * der Unterschied, auf den es ankommt: Kommentare im Code duerfen deutsch
 * bleiben (die Wahrheitsquelle docs/produktstand-2026-08.md ist deutsch, und
 * CLAUDE.md auch), ausgeliefert werden darf nur Englisch.
 *
 * ==========================================================================
 * WAS GEPRUEFT WIRD
 * ==========================================================================
 *   1. der sichtbare Text jeder Seite
 *   2. alle aria-label und aria-description
 *   3. alt, title und placeholder
 *   4. <title> und die Meta-Beschreibung
 *   5. og:title, og:description, og:image:alt
 *
 * NICHT geprueft werden Adressen: href, src und canonical. Eine URL ist keine
 * Sprache – der Link auf die deutsche Projektseite des Schulbarometers und
 * das hreflang auf selyvi.de sollen deutsch sein und bleiben.
 *
 * ==========================================================================
 * WIE „DEUTSCH" ERKANNT WIRD
 * ==========================================================================
 * Zwei Netze, weil eines allein zu grob waere:
 *
 *   A) UMLAUTE UND ESZETT: ä ö ü Ä Ö Ü ß. Ein sicheres Signal – im Englischen
 *      kommen sie in keinem Wort vor.
 *
 *   B) HAEUFIGE DEUTSCHE WOERTER als ganze Woerter. Faengt die Saetze, die
 *      keine Umlaute enthalten („Das ist der Grund"). Die Liste ist bewusst
 *      auf Funktionswoerter und Schulvokabular beschraenkt: Wer sie
 *      erweitert, riskiert Fehlalarme auf englischen Woertern.
 *
 * ==========================================================================
 * AUSNAHMEN – ABSCHLIESSEND, NUR EIGENNAMEN
 * ==========================================================================
 * Drei Namen. Mehr nicht:
 *   - Selyvi              (Produktname)
 *   - Waldstetten         (Ort im Legal notice)
 *   - Robert Bosch Stiftung (Herausgeberin der Schulbarometer-Zahlen)
 *
 * Alles andere, was deutsch bleiben MUSS, traegt statt einer Ausnahme ein
 * lang-Attribut – und das ist der bessere Weg, weil es nicht nur diesem
 * Skript hilft:
 *
 *   <span lang="de">Hauptstraße 33</span>
 *   <div lang="tr">…</div>
 *
 * Elemente mit einem lang, das nicht mit „en" beginnt, werden samt Inhalt aus
 * der Pruefung geschnitten. Das ist WCAG 3.1.2 (Language of Parts): Ein
 * Screenreader spricht die deutsche Anschrift dann deutsch aus, statt sie
 * englisch zu buchstabieren. Der Bericht zaehlt diese Stellen mit, damit sie
 * sichtbar bleiben und nicht als Schlupfloch dienen.
 *
 * ==========================================================================
 * ERGEBNIS
 * ==========================================================================
 * Der Bericht nennt IMMER eine Zahl – auch die 0. „Keine Ausgabe" und „nichts
 * gefunden" sind zwei verschiedene Dinge, und nur eine genannte Null beweist,
 * dass geprueft wurde. Ein Treffer laesst das Skript mit Status 1 enden.
 */

import { EIGENNAMEN, findeDeutsch } from "./lib/deutsch-muster.mjs";

const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Aufruf: node scripts/german-check.mjs <basis-url>");
  process.exit(1);
}

/** Dieselbe Reihenfolge wie in scripts/smoke-test.mjs. */
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
  // Die 404-Seite wird ueber einen Pfad geprueft, den es nicht gibt.
  "/diese-seite-gibt-es-nicht",
];

/**
 * ==========================================================================
 * SEITEN, DIE DEUTSCH SEIN SOLLEN – ABSCHLIESSEND
 * ==========================================================================
 * Genau eine: /impressum.
 *
 * Die Pflichtangaben nach § 5 DDG und § 18 Abs. 2 MStV sind die Angaben eines
 * deutschen Unternehmens und gelten im deutschen Wortlaut. Eine englische
 * Fassung daneben waere im besten Fall ueberfluessig und im schlechtesten die
 * Version, auf die sich im Zweifel jemand beruft. Begruendung in
 * src/config/legal.ts und src/app/impressum/page.tsx.
 *
 * DAS IST EINE SEITEN-AUSNAHME, KEINE WORT-AUSNAHME, und der Unterschied ist
 * der ganze Punkt: Eine Seite, die deutsch sein SOLL, mit einer wachsenden
 * Liste erlaubter Woerter durchzuwinken, waere die Bauweise, bei der
 * irgendwann versehentlich auch anderswo Deutsch durchrutscht. Die Liste der
 * Eigennamen unten bleibt deshalb bei drei Eintraegen.
 *
 * Geprueft wird die Seite trotzdem – nur umgekehrt: Der EINE englische Satz
 * muss dastehen. Eine deutsche Seite ohne Sprachhinweis ist auf einer
 * englischen Website ein Fehler, und dieser Fehler faellt sonst niemandem auf.
 */
const DEUTSCHE_SEITEN = new Map([
  [
    "/impressum",
    "This legal notice is provided in German, as required by German law.",
  ],
]);

/*
 * Eigennamen, Wortliste und Muster stehen in scripts/lib/deutsch-muster.mjs
 * – EINE Quelle fuer diesen Detektor UND fuer scripts/animation-check.mjs.
 * Eine Kopie waere die Stelle, an der eine ergaenzte Wortliste nur in einem
 * der beiden Skripte wirkt, und dann bedeutet die 0 des anderen nichts.
 */

let probleme = 0;
let langBloecke = 0;
let ausnahmeSeiten = 0;
const fail = (msg) => {
  probleme++;
  console.log("   TREFFER: " + msg);
};

const get = async (path) => {
  const res = await fetch(base + path, { redirect: "manual" });
  return { res, body: await res.text() };
};

/**
 * Schneidet alle Elemente heraus, deren lang-Attribut nicht mit „en" beginnt.
 *
 * Bewusst eine flache Klammerzaehlung statt eines HTML-Parsers: Das Skript
 * soll ohne zusaetzliche Pakete laufen (dieselbe Regel wie beim Smoke-Test,
 * und bei einer Website mit Rechtsbezug ist jede Abhaengigkeit weniger eine
 * Angriffsflaeche weniger).
 *
 * Verschachtelte gleichnamige Tags werden mitgezaehlt, damit ein <div
 * lang="de"> mit <div> darin nicht zu frueh endet.
 */
function schneideFremdsprachiges(html) {
  const muster = /<([a-zA-Z][\w-]*)\b[^>]*\blang\s*=\s*["']([^"']*)["'][^>]*>/g;
  let ergebnis = "";
  let zuletzt = 0;
  let treffer;

  while ((treffer = muster.exec(html)) !== null) {
    const [voll, tag, lang] = treffer;
    if (/^en\b/i.test(lang)) continue;
    // Selbstschliessend oder leeres Element: nur das Tag entfernen.
    if (voll.endsWith("/>") || /^(br|img|input|meta|hr)$/i.test(tag)) continue;

    const start = treffer.index;
    const suche = new RegExp(`</?${tag}\\b`, "gi");
    suche.lastIndex = start + voll.length;
    let tiefe = 1;
    let ende = html.length;
    let m;
    while ((m = suche.exec(html)) !== null) {
      tiefe += m[0][1] === "/" ? -1 : 1;
      if (tiefe === 0) {
        ende = m.index + m[0].length;
        break;
      }
    }

    ergebnis += html.slice(zuletzt, start);
    zuletzt = ende;
    muster.lastIndex = ende;
    langBloecke++;
  }

  return ergebnis + html.slice(zuletzt);
}

/** Sichtbarer Text plus die Attribute, die vorgelesen werden. */
function pruefbarerText(html) {
  const ohneFremd = schneideFremdsprachiges(html);

  const attribute = [
    ...ohneFremd.matchAll(
      /\b(?:aria-label|aria-description|aria-placeholder|alt|title|placeholder)\s*=\s*"([^"]*)"/g,
    ),
  ].map((m) => m[1]);

  const meta = [
    ...ohneFremd.matchAll(
      /<meta[^>]+(?:name|property)="(?:description|og:title|og:description|og:image:alt|twitter:title|twitter:description)"[^>]+content="([^"]*)"/g,
    ),
  ].map((m) => m[1]);

  const titel = ohneFremd.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";

  const sichtbar = ohneFremd
    // Skripte, Stile und JSON-LD tragen keinen gelesenen Text.
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    // Alle Tags samt Attributen weg – Adressen und Klassennamen sind keine
    // Sprache und wuerden nur Fehlalarme erzeugen.
    .replace(/<[^>]+>/g, " ");

  return [sichtbar, titel, ...attribute, ...meta]
    .join("  \n  ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&(?:quot|#34);/g, '"')
    .replace(/&(?:apos|#39);/g, "'")
    .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, " ");
}

console.log("Deutsch-Detektor gegen " + base + "\n");
console.log("Erlaubte Eigennamen: " + EIGENNAMEN.join(", "));
console.log(
  "Deutsche Seiten (Ausnahme, dokumentiert): " +
    [...DEUTSCHE_SEITEN.keys()].join(", "),
);
console.log("Fremdsprachige Bloecke (lang != en) werden uebersprungen.\n");

for (const path of PAGES) {
  const { res, body } = await get(path);

  // Die 404-Seite antwortet erwartungsgemaess mit 404; alles andere mit 200.
  const erwartet = path === "/diese-seite-gibt-es-nicht" ? 404 : 200;
  if (res.status !== erwartet) {
    fail(`${path}: Status ${res.status} statt ${erwartet} – Seite nicht geprueft`);
    continue;
  }

  /**
   * Dokumentierte Seiten-Ausnahme: Diese Seite SOLL deutsch sein.
   *
   * Sie wird nicht uebersprungen, sondern umgekehrt geprueft – der eine
   * englische Sprachhinweis muss dastehen. Eine deutsche Seite ohne ihn ist
   * auf einer englischen Website ein Fehler.
   */
  if (DEUTSCHE_SEITEN.has(path)) {
    const satz = DEUTSCHE_SEITEN.get(path);
    // Gegen den ROHEN Body, nicht gegen pruefbarerText(): Die Seite traegt
    // lang="de" auf der Sektion, und der Sprachhinweis darin sein eigenes
    // lang="en". schneideFremdsprachiges() nimmt die ganze deutsche Sektion
    // heraus – samt des englischen Satzes, den wir hier gerade suchen.
    if (!body.includes(satz)) {
      fail(`${path}: deutsche Seite OHNE englischen Sprachhinweis („${satz}")`);
      continue;
    }
    ausnahmeSeiten++;
    console.log(`  ${path.padEnd(26)} deutsch (Ausnahme), Sprachhinweis vorhanden`);
    continue;
  }

  // Zeilenweise melden, nicht seitenweise: Eine Meldung „auf / steht Deutsch"
  // hilft niemandem beim Suchen. findeDeutsch() nennt die Fundstelle – und es
  // ist dieselbe Funktion, die scripts/animation-check.mjs benutzt.
  const treffer = findeDeutsch(pruefbarerText(body));

  if (treffer.length === 0) {
    console.log(`  ${path.padEnd(26)} sauber`);
    continue;
  }

  console.log(`  ${path.padEnd(26)} ${treffer.length} Fundstelle(n)`);
  for (const t of treffer) fail(`${path}: ${t.grund} in „${t.text}"`);
}

console.log("\n==========================================================");
console.log(`DEUTSCHE FUNDSTELLEN: ${probleme}`);
console.log(`Uebersprungene fremdsprachige Bloecke (lang != en): ${langBloecke}`);
console.log(
  `Deutsche Seiten (Ausnahme, Sprachhinweis geprueft): ${ausnahmeSeiten} von ${DEUTSCHE_SEITEN.size}`,
);
console.log("==========================================================");
console.log(
  probleme === 0
    ? "DEUTSCH-DETEKTOR BESTANDEN – 0 Fundstellen."
    : "DEUTSCH-DETEKTOR FEHLGESCHLAGEN.",
);

process.exit(probleme === 0 ? 0 : 1);
