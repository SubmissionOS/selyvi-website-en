/**
 * Zentrale Marken-Konfiguration.
 *
 * Der Produktname wird an genau EINER Stelle gepflegt (hier) und von
 * <Wordmark /> sowie den Metadaten gelesen.
 *
 * SPRACHE: Alle exportierten Zeichenketten dieser Datei sind ENGLISCH – sie
 * werden ausgeliefert. Die Kommentare bleiben deutsch, weil die Wahrheitsquelle
 * (docs/produktstand-2026-08.md) und CLAUDE.md deutsch sind und beide beim
 * Lesen danebenliegen.
 */

/**
 * Produktname.
 *
 * Wird an JEDER Stelle verwendet, an der der Name auftaucht: Wortmarke,
 * Seitentitel und Metadaten, Fliesstext in den Sektionen, FAQ.
 * Eine Namensaenderung ist damit eine Aenderung in dieser einen Zeile –
 * nirgends im Projekt steht der Name als Literal.
 */
export const PRODUCT_NAME = "Selyvi";

/**
 * Kanonische Praxis-Aussage.
 *
 * DIESE FORMULIERUNG STEHT NUR HIER. Sie erscheint auf der Startseite, auf
 * /for-teachers, /for-school-leadership und /our-story – ueberall aus dieser
 * Konstante, nach dem Muster von <DpaBand />. Eine Kopie waere genau die
 * Stelle, an der eine Schule spaeter zwei leicht verschiedene Versionen
 * derselben Aussage findet.
 *
 * Sie ist eine Tatsachenbehauptung ueber die Entstehung des Produkts. Wer sie
 * aendert, aendert sie fuer die ganze Website.
 *
 * „ACROSS GERMANY" IST PFLICHT (docs/en-review.md, Punkt 6): Ohne die
 * Laenderangabe liest eine internationale Leserin den Satz als „mit
 * Lehrkraeften weltweit" – und das waere eine ungedeckte Behauptung. Die
 * deutsche Fassung sagt „aus ganz Deutschland"; „from all over Germany" klingt
 * nach Werbetext, deshalb „across Germany" (docs/glossar-en.md).
 *
 * EINE AUSNAHME: Der Erzaehltext in
 * src/components/sections/ueber-uns/why-it-exists.tsx enthaelt dieselbe Aussage
 * als Nebensatz im Fliesstext. Dort laesst sie sich nicht einsetzen, ohne den
 * Satzbau zu zerstoeren – dieser Absatz muss bei einer Aenderung von Hand
 * nachgezogen werden.
 *
 * KEIN SCHULARTEN-ZUSATZ – DER GRUND HAT SICH GEAENDERT (2.9.2026):
 * Bis zum Abgleich mit dem Produktstand endete dieser Satz auf „von der
 * Grundschule bis zum Abitur". Er wurde gekuerzt, weil er sich damals als
 * Aussage ueber die EIGNUNG las, waehrend das Produkt fuer die Grundschule
 * gebaut war. Diese Begrenzung gibt es seit der CMO-Direktive nicht mehr.
 *
 * Der Zusatz bleibt trotzdem draussen, jetzt aus einem anderen Grund: Die
 * Spanne steht in SCHOOL_TYPE_ANSWER und in AUDIENCE_SHORT. Hier waere sie
 * die dritte Stelle – und PRACTICE_CLAIM ist ein Satz ueber die ENTSTEHUNG,
 * nicht ueber die Zielgruppe. Der Fliesstext auf /our-story nennt die Spanne
 * weiterhin dort, wo er die Entstehung erzaehlt.
 */
export const PRACTICE_CLAIM = "Built together with teachers across Germany.";

/**
 * Kurzform fuer die Trust-Zeile, wo nur eine Zeile Platz ist.
 *
 * Bewusst hier und nicht dort formuliert: So bleibt die Aussage auch in der
 * gekuerzten Fassung an eine Datei gebunden. Wer PRACTICE_CLAIM anpasst, sieht
 * die Kurzform direkt daneben und vergisst sie nicht.
 */
export const PRACTICE_CLAIM_SHORT = "Built with teachers across Germany";

/**
 * Antwort auf die Schulform-Frage – EINE Formulierung für die ganze Website.
 *
 * Sie steht in der FAQ der Startseite und auf /for-teachers. Dieselbe Bauweise
 * wie PRACTICE_CLAIM und <DpaBand />: Die Frage „fuer welche Schulform?" ist
 * die erste, die eine Lehrkraft stellt, und zwei leicht verschiedene Antworten
 * darauf waeren genau die Art Widerspruch, die im Erstgespraech auffaellt.
 *
 * ======================================================================
 * GEAENDERT AM 2.9.2026 – CMO-DIREKTIVE, ALLE SCHULARTEN
 * ======================================================================
 * Bis dahin stand hier „built for primary school today, years 1 to 4 …
 * More school types follow." Die Zielgruppe ist seither nicht mehr auf die
 * Grundschule begrenzt: docs/produktstand-2026-08.md, Abschnitt „Zielgruppe ·
 * Aktualisierung vom 2. September 2026".
 *
 * Der Ausblick „More school types follow." ist ERSATZLOS entfallen. Er
 * beschrieb eine Einschraenkung, die es nicht mehr gibt – und war zugleich
 * eine der drei Ausnahmen von Regel D (keine Zukunftsform ueber die
 * Produktreife). Diese Ausnahme ist damit weg, nicht ersetzt: Wer sie in
 * CLAUDE.md oder scripts/smoke-test.mjs wieder auftauchen sieht, hat einen
 * Rueckschritt vor sich.
 *
 * ======================================================================
 * WORTLAUT-SPERRE – „is guided by", NIEMALS „follows the curricula"
 * ======================================================================
 * Der zweite Satz sagt, WONACH Selyvi gebaut ist, und behauptet keinen
 * ZUGRIFF auf die Lehrplaene. Das ist kein Stilfrage, sondern die Lizenzlage:
 * Die Lehrplaene aller 16 Bundeslaender liegen erhoben vor, sind aber
 * BEWUSST NICHT ANGEBUNDEN (Produktstand, „Der Fachkorpus ist noch duenn").
 *
 * Die CMO-Direktive schlug „It follows the education plans and curricula of
 * the German states." vor. „follows" liest sich als Anbindung und ist
 * deshalb zu „is guided by" geworden – dieselbe Aussage, dieselbe
 * Formulierung wie in der Hero-Subline, deren Sperre denselben Grund hat.
 * Wer das zurueckdreht, liest vorher beide genannten Abschnitte.
 *
 * UEBERSETZUNGSENTSCHEIDUNG (docs/glossar-en.md, docs/en-review.md 7):
 *   „Abitur" hat kein Gegenstueck. „upper secondary" ist der Begriff aus der
 *   OECD- und Eurydice-Statistik; „A-levels" waere britisch und fuer einen
 *   deutschen Abschluss schlicht falsch.
 *
 *   „year 1" statt „grade 1": Die Klammerform „(grades 1 to 4)" ist mit der
 *   Jahrgangsspanne entfallen – es gibt keine Spanne mehr zu erklaeren.
 */
export const SCHOOL_TYPE_ANSWER =
  "Selyvi is built for all school types and forms – from year 1 to upper secondary. We are guided by the education and framework plans of the German states.";

/**
 * CTA-Farbvariante.
 *
 * "a" = #2c40ff (kontrastierendes Blau-Violett)
 * "b" = #0074bd (markeneigenes Blau, identisch mit brand-600)
 *
 * Diese Konstante ist der einzige Schalter. Sie wird in src/app/layout.tsx als
 * `data-cta`-Attribut auf <html> gesetzt; globals.css bindet daraufhin die
 * passende Farbe an die Variable --cta.
 *
 * Zum Umschalten: den Wert unten auf "b" aendern – sonst nichts.
 */
export type CtaVariant = "a" | "b";

export const CTA_VARIANT: CtaVariant = "a";
