import { DECISION_PROMISE } from "@/config/product";
import { PRACTICE_CLAIM } from "@/config/brand";

/**
 * Sektion 2 – Prinzip-Band.
 *
 * Das wichtigste Differenzierungs-Statement der Seite. Wirkung entsteht hier
 * ueber Typografie und Weissraum, nicht ueber Farbe oder Dekoration: grosse
 * ruhige Schrift, abgesetzte Flaeche, sonst nichts. Kein Rahmen, kein Icon,
 * kein Akzentbalken – jede Zutat mehr wuerde die Aussage schwaechen.
 */
export function PrincipleBand() {
  return (
    <section
      aria-labelledby="prinzip-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <h2
            id="prinzip-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {DECISION_PROMISE}
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            Every suggestion is transparent, editable, and never takes effect without the
            teacher.
          </p>

          <p className="mt-4 text-lg text-gray-500">{PRACTICE_CLAIM}</p>
        </div>
      </div>
    </section>
  );
}
