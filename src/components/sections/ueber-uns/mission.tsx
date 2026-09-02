import { MISSION_PROMISE } from "@/config/product";

/**
 * Sektion 2 – Mission.
 *
 * Drei Saetze, vollstaendig aus dem bestehenden Material abgeleitet: die
 * Hero-Aussage der Startseite und das
 * Prinzip-Band auf /for-teachers (DECISION_PROMISE).
 * Bewusst nichts Neues – eine Mission, die von den Produktaussagen abweicht,
 * waere entweder falsch oder ein Hinweis darauf, dass die Produktaussagen
 * falsch sind.
 *
 * Ohne Marker: Die Saetze behaupten nichts, was nicht ohnehin schon auf der
 * Website steht.
 */
export function Mission() {
  return (
    <section
      aria-labelledby="mission-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <h2
            id="mission-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Why we build this
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            Teachers spend too much of their time on administration. {MISSION_PROMISE}
          </p>
        </div>
      </div>
    </section>
  );
}
