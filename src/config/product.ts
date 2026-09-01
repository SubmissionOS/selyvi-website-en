/**
 * Produktaussagen, die an mehreren Stellen wortgleich stehen müssen.
 *
 * ==========================================================================
 * QUELLE: docs/produktstand-2026-08.md – und ausschliesslich die.
 * ==========================================================================
 *
 * Die Quelle ist DEUTSCH und bleibt es. Diese Datei uebersetzt sie fuer die
 * englische Website; sie ersetzt sie nicht. Wer hier eine Aussage aendert,
 * prueft zuerst, ob der Produktstand sie deckt – die Uebersetzung darf nichts
 * behaupten, was das deutsche Original nicht hergibt.
 *
 * Regeln aus dem Dokument, die fuer JEDE Aenderung hier gelten:
 *
 *   1. Nur als „Live" markierte Funktionen duerfen als verfuegbar beschrieben
 *      werden.
 *   2. „Rollout offen", „Teilweise" und „Nicht gebaut" duerfen nicht als
 *      verfuegbar erscheinen.
 *   3. Nichts aus dem Abschnitt „Was du im Gespraech nicht versprechen darfst"
 *      darf auf der Website als Zusage stehen.
 *
 * Wer hier etwas aendert, aendert es fuer die ganze Website – das ist der
 * Zweck der Datei. Gleiche Bauweise wie <DpaBand /> und PRACTICE_CLAIM: Eine
 * Kopie waere genau die Stelle, an der eine Schule spaeter zwei leicht
 * verschiedene Fassungen derselben Zusage findet.
 */

/**
 * Zielgruppe in Kurzform, fuer die Trust-Zeile.
 *
 * Selyvi ist fuer die Grundschule gebaut – Kompetenzen, Faecher und
 * Zeugnistexte sind darauf zugeschnitten. Weiter gefasste Formulierungen
 * („for teachers") waren vor dem Abgleich mit dem Produktstand im Umlauf und
 * sind bewusst verschwunden.
 *
 * „primary school", nicht „elementary school": Letzteres ist US-spezifisch,
 * Ersteres versteht man auch dort (docs/glossar-en.md).
 */
export const AUDIENCE_SHORT = "For primary school teachers, years 1–4";

/**
 * Serverstandort und Auftragsverarbeitung – DIE heikelste Aussage der Website.
 *
 * Erscheint auf der Startseite (DSGVO-Block), auf /security (Prinzipien-Grid
 * und FAQ) und in <DpaBand /> auf /for-school-leadership.
 *
 * WARUM SO VORSICHTIG: Gehostet wird das Produkt heute bei Railway und Vercel,
 * nicht in Deutschland. Eine pauschale „servers in the EU"-Zusage fuer das
 * Produkt waere die erste Angabe, die eine Datenschutzbeauftragte prueft – und
 * die erste, die faellt. Das Dokument sagt dazu ausdruecklich: „in
 * Vorbereitung", nicht „erledigt".
 *
 * Davon strikt getrennt: das Hosting DIESER WEBSITE in Frankfurt. Das ist
 * belegt (Region fra1 in vercel.json) und darf so stehen – aber nur als
 * Aussage ueber die Website, nie als Aussage ueber das Produkt.
 *
 * WORTLAUT ENTSCHIEDEN (docs/en-review.md, Punkt 8 – abgehakt):
 * „Before Selyvi is used with real pupil data, …"
 *
 * Das deutsche Original sagt „Vor dem BETRIEB mit echten Schuelerdaten". Die
 * erste Uebersetzung lautete „Before we work with" und war damit weicher als
 * die Vorlage: „we work with" beschreibt, was WIR tun; das Deutsche
 * beschreibt, wann das PRODUKT eingesetzt wird. „Before Selyvi is used with"
 * trifft das – der Zeitpunkt haengt am Einsatz, nicht an unserer Taetigkeit,
 * und genau darauf kommt es einer Datenschutzbeauftragten an.
 *
 * Rechtlich erhebliche Zeile. Wer sie aendert, aendert sie mit Rueckmeldung
 * von CEO und CMO – nicht nach Sprachgefuehl.
 *
 * Der Wortlaut steht ausserdem in der Ausnahmeliste von
 * scripts/smoke-test.mjs (Regel D, „in preparation"). Wer ihn hier aendert,
 * aendert ihn dort mit.
 */
export const PRODUCT_HOSTING_NOTE =
  "Before Selyvi is used with real pupil data, the product servers move to Germany and every school has a data processing agreement in place — both are in preparation.";

/** Hosting DIESER WEBSITE. Belegt durch die Serverregion fra1 in vercel.json. */
export const WEBSITE_HOSTING_NOTE =
  "This website is hosted in Frankfurt am Main, on servers inside the EU.";

/**
 * Datentrennung – eine Positiv-Aussage aus dem echten Produkt.
 *
 * Im internen Dokument steht sie unter „Was du im Gespraech nicht versprechen
 * darfst", weil sie dort als Einschraenkung wirkt: In geteilten Klassen sieht
 * eine Lehrkraft weniger, als sie erwartet, denn eine Klassenlehrer-Rolle mit
 * Gesamtsicht gibt es nicht.
 *
 * Als Datenschutz-Aussage ist derselbe Sachverhalt eine Staerke, und genau so
 * steht er hier. Das ist keine Beschoenigung: Der Satz behauptet nichts, was
 * das Produkt nicht taete – er beschreibt exakt dieselbe Tatsache.
 */
export const DATA_SEPARATION_NOTE =
  "Every teacher sees only their own observations and assessments.";

/**
 * Zielsprachen der Elternmail-Uebersetzung.
 *
 * Die Zahl 9 steht an mehreren Stellen im Fliesstext und kommt ueberall aus
 * `TRANSLATION_LANGUAGES.length` – so kann sie nicht von der Liste abweichen,
 * wenn eine Sprache dazukommt.
 *
 * „English" steht mit in der Liste und bleibt dort: Uebersetzt wird aus dem
 * Deutschen, und Englisch ist eine der neun Zielsprachen. Dass die Website
 * selbst englisch ist, aendert an der Produktfunktion nichts.
 */
export const TRANSLATION_LANGUAGES = [
  "English",
  "Turkish",
  "Arabic",
  "Ukrainian",
  "Russian",
  "French",
  "Polish",
  "Italian",
  "Spanish",
] as const;

export const TRANSLATION_LANGUAGE_COUNT = TRANSLATION_LANGUAGES.length;

/**
 * Die Sprachen als Aufzaehlung fuer den Fliesstext: „A, B and C".
 *
 * Aus der Liste erzeugt statt daneben getippt – sonst weicht die Aufzaehlung
 * beim naechsten Zuwachs von der Zahl ab, und beides steht auf derselben Seite.
 */
export const TRANSLATION_LANGUAGES_SENTENCE = `${TRANSLATION_LANGUAGES.slice(0, -1).join(", ")} and ${TRANSLATION_LANGUAGES[TRANSLATION_LANGUAGES.length - 1]}`;

/**
 * Der Grundsatz hinter der Wirkungszeile – inhaltlich so, wie ihn
 * docs/produktstand-2026-08.md beschreibt („Wirkungszeile — Live").
 *
 * Warum das eine geteilte Konstante ist und keine zwei Formulierungen:
 * Der Satz stand auf /research und auf /for-school-leadership in zwei
 * Fassungen, und die /for-school-leadership-Fassung war ungenauer als die
 * Quelle. Dort hiess es „wir zeigen gemessene Wirkung" – das Produkt zeigt
 * aber gemessene BEFRAGUNGSWERTE. Der Unterschied ist nicht spitzfindig, er
 * ist der ganze Punkt: Genau weil eingesparte Stunden eben KEIN
 * Wirkungsnachweis sind, darf die Zeile, die das klarstellt, nicht selbst
 * Wirkung versprechen.
 *
 * ==========================================================================
 * ZWEIMAL UMFORMULIERT – DIE ZWEITE FASSUNG WAR EHRLICH UND TROTZDEM SCHWACH
 * ==========================================================================
 * Fassung 1 endete auf „Diese Zeile verschwindet nie." – ein Satz, der nur
 * traegt, wenn man vorher weiss, wovon er handelt.
 *
 * Fassung 2 lieferte den Kontext mit, sagte aber „oder im Klartext, warum
 * sich noch nichts sagen laesst". Das ist eine Selbstauskunft ueber
 * Unwissen – ausgerechnet in dem Satz, der unsere Methodenstrenge belegen
 * soll. Er las sich damit wie eine Entschuldigung. Verboten nach CLAUDE.md,
 * Regel B unter TON.
 *
 * Fassung 3 sagt dieselbe Tatsache als Handwerk: Es gibt zwei Sorten Zahlen,
 * beide sind benannt, und die Kennzeichnung ist nicht abschaltbar. Wer
 * „estimate" liest, weiss ohne weiteres Zutun, dass keine Messung
 * dahintersteht – das ist genau die Auskunft, die Fassung 2 umstaendlich
 * herbeigeredet hat.
 *
 * UEBERSETZUNG – OFFENER PUNKT (docs/en-review.md, Punkt 3): Das Deutsche
 * spielt mit „Messwert / Schaetzwert" als SUBSTANTIVEN. Dieses knappe Paar
 * gibt es im Englischen nicht; „labelled as measured" loest es ueber das Verb.
 * Ob das fuer eine Forscherin praezise genug ist oder dort „as a measured
 * value / as an estimate" stehen soll, ist die Frage in en-review.md.
 *
 * VERBOTEN in jeder kuenftigen Fassung: „warum sich noch nichts sagen laesst"
 * und jede Variante davon – im Englischen also auch „why nothing can be said
 * yet".
 *
 * Wer den Wortlaut aendert, aendert ihn auf beiden Seiten gleichzeitig – und
 * sollte vorher im Produktstand nachlesen, was die Zeile wirklich anzeigt.
 */
export const IMPACT_LINE_PRINCIPLE =
  "Every workload relief report carries a note directly beneath the figures: measured values are labelled as measured, estimates as estimates — and neither label can be switched off, not even by us.";

/**
 * Versprechen 1 aus dem Manifest auf /our-story – und zugleich die Ueberschrift
 * des Prinzip-Bands auf /for-teachers.
 *
 * Geteilte Konstante, weil derselbe Satz an zwei Stellen steht und beide
 * gemeint sind: einmal als Produktprinzip ueber den Funktionen, einmal als
 * Selbstverpflichtung im Manifest. Zwei Fassungen desselben Versprechens
 * waeren genau das, was das Manifest bestreitet.
 *
 * „Die KI" ist hier bewusst zu „Selyvi" geworden: Als handelnder Akteur in
 * einer Vertrauensformel loest „the AI" Misstrauen aus, der Produktname nicht.
 * Die Technologie-Kategorie („AI assistant for primary school teachers") bleibt
 * davon unberuehrt – sie sagt, WAS das Produkt ist, und nicht, wer entscheidet.
 *
 * ENGLISCHE FASSUNG GESETZT (docs/en-review.md, Punkt 4): „Selyvi suggests. You
 * decide." Kurz und gleich gebaut wie das Deutsche.
 *
 * Das „Always." gehoert NUR ins Manifest: Dort ist der Satz ein Schwur, ueber
 * den Funktionsbloecken ist er eine Ueberschrift. Deshalb steht die Konstante
 * ohne das Wort, und das Manifest haengt es an.
 */
export const DECISION_PROMISE = "Selyvi suggests. You decide.";

/**
 * Der Satz aus „Why we build this" auf /our-story – steht zusaetzlich ueber
 * dem Kennenlern-Aufruf am Ende der Startseite.
 *
 * Geteilte Konstante, weil er an beiden Stellen dasselbe leisten soll: die
 * Arbeitsteilung benennen, bevor jemand auf einen Knopf drueckt. Zwei
 * Fassungen desselben Satzes waeren an genau der Stelle unglaubwuerdig, an
 * der es um Vertrauen geht.
 *
 * UEBERSETZUNG (docs/en-review.md, Punkt 5): „paedagogisch" ist im Englischen
 * ein Problem – „pedagogical" klingt akademisch, „educational" ist zu weit.
 * „teaching judgement" beschreibt, was gemeint ist.
 */
export const MISSION_PROMISE =
  "We build the assistant that takes on the routine work. The teaching judgement stays with the person.";
