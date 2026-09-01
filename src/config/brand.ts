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
 * KEIN SCHULARTEN-ZUSATZ MEHR: Bis zum Abgleich mit dem Produktstand endete
 * dieser Satz auf „von der Grundschule bis zum Abitur". Das stimmt fuer die
 * ENTSTEHUNG – so ist das Produkt gewachsen – liest sich an dieser Stelle aber
 * als Aussage ueber die Eignung, und Selyvi ist fuer die Grundschule gebaut,
 * Klassen 1–4. Der Zusatz steht deshalb nur noch dort, wo er die Entstehung
 * erzaehlt: im Fliesstext auf /our-story.
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
 * DREI TEILE, DREI VERSCHIEDENE GELTUNGSBEREICHE – bitte nicht vermischen:
 *
 *   1. „built for primary school today, years 1 to 4" ist eine Tatsachenaussage
 *      und durch docs/produktstand-2026-08.md gedeckt.
 *   2. „developed together with teachers from primary through to upper
 *      secondary" beschreibt die ENTSTEHUNG, nicht die Eignung. Gedeckt durch
 *      PRACTICE_CLAIM. Deshalb steht der Zusatz hier und nur hier – im
 *      Trust-Band und auf /for-school-leadership bleibt PRACTICE_CLAIM ohne ihn.
 *   3. „More school types follow." ist AUSBLICK, keine Funktionszusage. Der
 *      Produktstand sagt dazu nichts; das Wort „follow" macht die Aussage als
 *      Zukunft erkennbar und nennt bewusst weder Schulform noch Zeitpunkt.
 *      Sobald eine zweite Schulform ausgeliefert ist, gehoert hier eine
 *      Tatsache hin – kein Ausblick mehr.
 *
 * ZWEI UEBERSETZUNGSENTSCHEIDUNGEN (docs/glossar-en.md, docs/en-review.md 7):
 *   - „Abitur" hat kein Gegenstueck. „upper secondary" ist der Begriff aus der
 *     OECD- und Eurydice-Statistik; „A-levels" waere britisch und fuer einen
 *     deutschen Abschluss schlicht falsch.
 *   - „years 1 to 4 (grades 1 to 4)": „years" ist die weiter verbreitete
 *     Zaehlung, „grades" steht beim ERSTEN Vorkommen einer Seite in Klammern,
 *     damit US-Leserinnen nicht stolpern. Danach nur noch „years".
 */
export const SCHOOL_TYPE_ANSWER =
  "Selyvi is built for primary school today, years 1 to 4 (grades 1 to 4) – developed together with teachers from primary through to upper secondary. More school types follow.";

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
