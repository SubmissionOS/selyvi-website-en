import { CountUpOnView } from "@/components/motion/count-up-on-view";
import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 4 – Warum es uns gibt („Why we exist").
 *
 * Steht zwischen der Zielgruppen-Weiche und „Was sich im Alltag ändert“: Die
 * Seite sagt erst, wen sie meint, dann WARUM es sie gibt – und erst danach,
 * was sie tut.
 *
 * ==========================================================================
 * DIESES BAND NENNT KEINE EINZIGE PRODUKTFUNKTION. DAS IST DIE REGEL.
 * ==========================================================================
 * Es begründet, es verkauft nicht. Sobald hier ein Stichwort wie
 * „report comment“ oder „parent email“ auftaucht, wird aus einer Begründung
 * eine Überleitung zum Angebot – und die Zahlen unten wirken wie Verkaufs-
 * material statt wie der Grund, aus dem jemand angefangen hat zu bauen.
 *
 * ==========================================================================
 * ZU DEN ZAHLEN – WELCHE STAMMT WOHER
 * ==========================================================================
 * Alle drei sind PARAPHRASIERT, nicht woertlich zitiert, und stammen aus dem
 * Deutschen Schulbarometer der Robert Bosch Stiftung. Sie kommen aus ZWEI
 * verschiedenen Befragungen – deshalb nennt die Quellenzeile beide Jahre:
 *
 *   83 % ueben ihren Beruf gern aus          -> Befragung 2026
 *   84 % fuehlen sich stark belastet         -> 4. Befragung 2022
 *   ueber 75 % Wochenendarbeit als Regel     -> 4. Befragung 2022
 *
 * ==========================================================================
 * „GERMAN TEACHERS" IST PFLICHT – NICHT WEGLASSEN
 * ==========================================================================
 * docs/glossar-en.md und docs/en-review.md, Punkt 10: Die Werte stammen aus
 * einer Befragung DEUTSCHER Lehrkraefte. Ohne die Angabe liest eine
 * internationale Leserin sie als internationale Zahlen – und das waere eine
 * Behauptung, die keine Quelle deckt.
 *
 * Sie steht deshalb ZWEIMAL: in der ersten Aussage („of German teachers") und
 * in der Quellenzeile („surveys of German teachers"). Zweimal, weil die drei
 * Zahlen einzeln aus dem Zusammenhang gerissen werden – in einem Screenshot,
 * in einer Praesentation –, und dann traegt jede fuer sich.
 *
 * Der Studienname steht englisch als „German School Barometer"; so nennt ihn
 * die Robert Bosch Stiftung in ihren englischsprachigen Veroeffentlichungen
 * selbst. Der Link zeigt unveraendert auf die deutsche Projektseite.
 *
 * ZAHLENFORMAT: „83%" ohne Leerzeichen (docs/glossar-en.md). Im Deutschen
 * stand dort ein schmales Leerzeichen; das ist eine deutsche Satzregel.
 *
 * Die Jahreszahlen gehoeren in die Quellenzeile und nicht nur hierher: Ein
 * Wert ohne Welle ist bei einer Reihenuntersuchung nicht nachpruefbar.
 *
 * Offen bleibt eine Kleinigkeit, siehe README, Punkt 19a: Vor dem Livegang
 * einmal gegen die Original-Reports lesen. Die Uebersichtsseite der Stiftung
 * fuehrt die Einzelwerte nicht; sie stehen in den Berichten der jeweiligen
 * Welle.
 */
const findings = [
  {
    /** Die Saetze setzen die Zahl grammatisch fort – ein Screenreader liest
        „83% of German teachers enjoy doing their job." am Stueck vor.

        Praefix und Wert stehen getrennt, weil die ZAHL hochzaehlt und das
        Wort davor stehen bleibt: „Over 75%" soll nicht „Over 0%" durch-
        laufen. */
    prefix: "",
    value: 83,
    statement: "of German teachers enjoy doing their job.",
  },
  {
    prefix: "Over ",
    value: 75,
    statement: "say weekend work is the rule, not the exception.",
  },
  {
    prefix: "",
    value: 84,
    statement: "feel heavily or very heavily burdened.",
  },
];

/**
 * Geprueft am 27.08.2026: Der im Auftrag genannte Pfad
 * bosch-stiftung.de/schulbarometer antwortet mit 404. Diese Adresse ist die
 * funktionierende – ueber drei Weiterleitungen erreichbar, Endstatus 200.
 */
const SOURCE_URL = "https://bosch-stiftung.de/projekt/das-deutsche-schulbarometer";

export function WhyWeExist() {
  return (
    <section
      aria-labelledby="warum-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h2
          id="warum-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Why we exist
        </h2>

        <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {findings.map((finding) => (
            <li key={finding.statement}>
              <p className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {finding.prefix}
                <CountUpOnView value={finding.value} suffix="%" />
              </p>
              <p className="mt-3 text-base text-gray-500">{finding.statement}</p>
            </li>
          ))}
        </ul>

        {/* Die Pointe. Sie ist der Grund, warum die drei Zahlen nebeneinander
            stehen: Der erste Wert widerspricht den beiden anderen nur
            scheinbar. */}
        <p className="mt-14 max-w-3xl text-lg text-ink sm:text-xl">
          It is not the teaching that wears people out. It is everything around it. That
          is exactly where {PRODUCT_NAME} starts.
        </p>

        <p className="mt-8 text-xs text-gray-500">
          Figures paraphrased from the{" "}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-brand-600 underline underline-offset-4"
          >
            German School Barometer
          </a>{" "}
          of the Robert Bosch Stiftung – surveys of German teachers, 2022 and 2026.
        </p>
      </div>
    </section>
  );
}
