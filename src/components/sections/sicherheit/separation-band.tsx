import { DATA_SEPARATION_NOTE } from "@/config/product";
import { SeparationScene } from "@/components/scenes/sicherheit/separation-scene";
import { SampleDataNote } from "@/components/scenes/sample-data-note";

/**
 * Datentrennung – als Bild statt als Behauptung.
 *
 * Steht direkt nach dem Prinzipien-Grid, in dem die Karte „Strikte
 * Datentrennung" die Zusage in einem Satz macht. Diese Sektion zeigt sie:
 * Zwei Ansichten derselben Klasse, und der Versuch, rechts eine einzelne
 * Beobachtung zu öffnen, läuft ins Leere.
 *
 * Für Datenschutzbeauftragte ist genau das die Frage, die eine Zusage nicht
 * beantwortet – ein Satz kann man behaupten, eine Ansicht nicht.
 */
export function SeparationBand() {
  return (
    <section
      aria-labelledby="datentrennung-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2
              id="datentrennung-titel"
              className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              What school leadership sees – and what it does not
            </h2>

            <p className="mt-5 text-lg text-gray-500">{DATA_SEPARATION_NOTE}</p>

            <p className="mt-4 text-lg text-gray-500">
              The leadership view shows figures, not entries. Single observations and
              assessments are not hidden there. They are not there at all.
            </p>
          </div>

          <div>
            <SeparationScene />
            <SampleDataNote />
          </div>
        </div>
      </div>
    </section>
  );
}
