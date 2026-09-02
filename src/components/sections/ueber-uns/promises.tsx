import { DECISION_PROMISE } from "@/config/product";

/**
 * Sektion – Unser Versprechen.
 *
 * ==========================================================================
 * KEINE KARTEN, KEINE ICONS. DAS IST DIE GESTALTUNG, NICHT IHR FEHLEN.
 * ==========================================================================
 * Fuenf Saetze, untereinander, mit einer duennen Linie dazwischen. Sobald
 * daraus ein Karten-Raster mit Symbolen wird, liest es sich wie ein
 * Funktionsvergleich – und ein Schwur, der wie ein Feature-Grid aussieht, ist
 * keiner mehr. Die Zurueckhaltung ist hier das Argument.
 *
 * ==========================================================================
 * JEDES VERSPRECHEN IST ANDERSWO EINGELOEST – SONST GEHOERT ES GESTRICHEN
 * ==========================================================================
 * Das ist die Bedingung, unter der die Sektion ueberhaupt tragfaehig ist. Die
 * Abschlusszeile fordert ausdruecklich zum Nachpruefen auf; ein Versprechen
 * ohne Fundstelle waere damit eine Einladung, uns zu widerlegen.
 *
 * DAS ANGEHAENGTE „Always." ist die englische Fassung des „Immer." – es
 * gehoert NUR hierher. Ueber den Funktionsbloecken ist DECISION_PROMISE eine
 * Ueberschrift, hier ist er ein Schwur. Deshalb steht die Konstante ohne das
 * Wort und das Manifest haengt es an.
 *
 *   1. Entscheidung  -> Prinzip-Band auf /for-teachers. WORTGLEICH ueber
 *                       die geteilte Konstante DECISION_PROMISE – wer den
 *                       Wortlaut aendert, aendert beide Stellen zugleich.
 *   2. Verteilung    -> /for-school-leadership, „Nutzung im Kollegium als Verteilung –
 *                       bewusst keine namentliche Rangliste"; im Produktstand
 *                       als Produktpolitik begruendet.
 *   3. Offene Punkte -> „In Arbeit" auf /for-teachers, der Zugangs-Absatz
 *                       auf /research, die offenen Punkte auf
 *                       /security.
 *   4. Beispieldaten -> die sichtbare Zeile unter allen vier Szenen mit
 *                       Kennzahlen (sample-data-note.tsx).
 *   5. Kein Kind     -> der Kopf von demo-data.ts, der negative Inhalte ueber
 *                       Kinder auch in erfundenen Daten untersagt.
 */
const promises = [
  `${DECISION_PROMISE} Always.`,
  "We show usage as a distribution, never as a ranking. Nobody is put on the spot.",
  "Open points get marked, not glossed over — on this website and in the product.",
  "Sample data is called sample data here.",
  "No child is put on display: not in the software, not in our marketing, not even an invented one.",
];

export function Promises() {
  return (
    <section aria-labelledby="versprechen-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="versprechen-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Our promise
        </h2>

        <ul className="mt-12 max-w-3xl divide-y divide-gray-200 border-t border-gray-200">
          {promises.map((promise) => (
            <li key={promise} className="py-6 text-lg text-ink">
              {promise}
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-3xl text-lg text-gray-500">
          These are not marketing lines. They are the rules this website was built by.
          Hold us to them.
        </p>
      </div>
    </section>
  );
}
