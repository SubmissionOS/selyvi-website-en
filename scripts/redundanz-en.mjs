/**
 * REDUNDANZ-TABELLE DER ENGLISCHEN FASSUNG
 *
 * Aufruf (setzt einen laufenden Server voraus):
 *   node scripts/redundanz-en.mjs http://127.0.0.1:3401 > docs/redundanz-en.md
 *
 * ==========================================================================
 * WOZU
 * ==========================================================================
 * Die Website macht ein gutes Dutzend Kernaussagen. Manche gehoeren auf
 * mehrere Seiten (die AVV-Zusage, die Praxis-Aussage – sie kommen aus
 * geteilten Konstanten und MUESSEN ueberall gleich lauten). Andere sollen
 * genau einmal je Seite stehen: Wer dieselbe Tatsache viermal auf einer Seite
 * liest, liest sie beim vierten Mal nicht mehr, und die Seite wird laenger,
 * ohne mehr zu sagen.
 *
 * Diese Tabelle zaehlt, WIE OFT jede Aussage je Seite im ausgelieferten Text
 * vorkommt. Sie bewertet nicht – sie zaehlt. Was zu oft dasteht, entscheidet
 * ein Mensch.
 *
 * ==========================================================================
 * GEZAEHLT WIRD IM SICHTBAREN TEXT
 * ==========================================================================
 * Nicht im Quelltext: Eine Konstante, die an drei Stellen eingesetzt wird,
 * steht im Quelltext einmal und auf der Seite dreimal – und die Seite ist,
 * was gelesen wird. Skripte und Style-Bloecke fallen vorher weg.
 *
 * Die RSC-Nutzlast von Next.js steht in <script>-Elementen und wiederholt den
 * gesamten Text ein zweites Mal. Wuerde sie mitgezaehlt, waere jede Zahl
 * doppelt.
 */

const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Aufruf: node scripts/redundanz-en.mjs <basis-url>");
  process.exit(1);
}

const PAGES = [
  ["/", "Start"],
  ["/for-teachers", "Teachers"],
  ["/for-school-leadership", "Leadership"],
  ["/research", "Research"],
  ["/security", "Security"],
  ["/our-story", "Story"],
  ["/preview", "Preview"],
  ["/co-create", "Co-create"],
  ["/meet", "Meet"],
];

/**
 * Die Kernaussagen.
 *
 * `soll` sagt, was erwartet wird – nicht, was erlaubt ist:
 *   "1/Seite"  Eine Tatsache, die je Seite einmal traegt.
 *   "geteilt"  Kommt aus einer geteilten Konstante und MUSS auf mehreren
 *              Seiten stehen. Mehrfach ist hier kein Befund, sondern der Zweck.
 *   "Szene"    Steht in einer nachgebauten Oberflaeche und wiederholt sich
 *              dort naturgemaess (Navigation, Beschriftung).
 */
const AUSSAGEN = [
  ["Report comments", /\breport comments?\b/gi, "1/Seite"],
  ["Parent emails", /\bparent emails?\b/gi, "1/Seite"],
  ["Materials with sources", /\bstates its sources\b|\bsources stated\b|\bwith sources stated\b/gi, "1/Seite"],
  ["Learned writing style", /\bwriting style\b|\bsounds like you\b/gi, "1/Seite"],
  ["Workload relief report", /\bworkload relief report\b/gi, "geteilt"],
  ["Data separation", /\bsees only their own\b|\bstrict data separation\b/gi, "geteilt"],
  ["No parent/pupil portal", /\bno parent (or|and) pupil (portal|access)\b|\bno portal for parents\b/gi, "geteilt"],
  ["Practice claim (across Germany)", /\bacross Germany\b/gi, "geteilt"],
  ["School type answer (years 1 to 4)", /\byears 1 to 4\b|\byears 1–4\b/gi, "geteilt"],
  ["Decision promise", /\bSelyvi suggests\. You decide\./g, "geteilt"],
  ["Impact line", /\bimpact line\b/gi, "geteilt"],
  ["Hosting note (in preparation)", /\bboth are in preparation\b/gi, "geteilt"],
  ["9 target languages", /\b9 (languages|target languages)\b/gi, "1/Seite"],
  ["Sample data marker", /\bsample data\b/gi, "Szene"],
  ["Estimate marker", /\bestimate\b/gi, "1/Seite"],
];

const holen = async (pfad) => {
  const res = await fetch(base + pfad);
  const html = await res.text();
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, " ")
    .replace(/\s+/g, " ");
};

const texte = {};
for (const [pfad] of PAGES) texte[pfad] = await holen(pfad);

const zeilen = [];
for (const [name, muster, soll] of AUSSAGEN) {
  const zellen = PAGES.map(([pfad]) => {
    muster.lastIndex = 0;
    const n = (texte[pfad].match(muster) ?? []).length;
    return n === 0 ? "–" : String(n);
  });
  zeilen.push([name, soll, ...zellen]);
}

const kopf = ["Aussage", "Soll", ...PAGES.map(([, k]) => k)];
const breiten = kopf.map((_, i) =>
  Math.max(kopf[i].length, ...zeilen.map((z) => z[i].length)),
);
const zeile = (felder) =>
  "| " + felder.map((f, i) => f.padEnd(breiten[i])).join(" | ") + " |";
const trenner = "| " + breiten.map((b) => "-".repeat(b)).join(" | ") + " |";

console.log(`# Redundanz-Tabelle – englische Fassung

Gemessen im **ausgelieferten sichtbaren Text**, nicht im Quelltext: Eine
geteilte Konstante steht im Code einmal und auf der Seite so oft, wie sie
eingesetzt wird – und die Seite ist, was gelesen wird.

Erzeugt mit \`node scripts/redundanz-en.mjs <url> > docs/redundanz-en.md\`.
Die Tabelle bewertet nicht, sie zählt. Was zu oft dasteht, entscheidet ein
Mensch.

**Spalte „Soll":**

- **1/Seite** – eine Tatsache, die je Seite einmal trägt. Zwei sind eine
  Wiederholung, drei sind eine Textwand.
- **geteilt** – kommt aus einer geteilten Konstante (\`brand.ts\`,
  \`product.ts\`) und **muss** auf mehreren Seiten stehen. Mehrfach ist hier
  kein Befund, sondern der Zweck: Zwei leicht verschiedene Fassungen derselben
  Zusage wären genau der Widerspruch, den eine Schule im Erstgespräch findet.
- **Szene** – steht in einer nachgebauten Oberfläche und wiederholt sich dort
  naturgemäß.

${zeile(kopf)}
${trenner}
${zeilen.map(zeile).join("\n")}

## Lesart

Die deutsche Fassung hat dieselbe Struktur, also auch dieselben Wiederholungen
– die Tabelle prüft nicht, ob die Übersetzung schlechter ist als das Original,
sondern ob sie beim Übersetzen etwas verdoppelt hat.

Zwei Stellen sind bewusst so gebaut und keine Redundanz:

- **Die Stil-Aussage** („writing style") steht auf der Startseite genau einmal
  – in der Spalte „For teachers" von „What Selyvi gives back". Auf
  /for-teachers steht sie ein zweites Mal, aber als FÄHIGKEIT statt als
  ERGEBNIS (Kopfkommentar in \`learns-with-you.tsx\`).
- **„German teachers"** steht auf der Startseite absichtlich zweimal: in der
  ersten Zahl und in der Quellenzeile. Die drei Prozentwerte wandern einzeln
  in Screenshots, und dann muss jeder für sich tragen
  (\`why-we-exist.tsx\`, docs/glossar-en.md).
`);
