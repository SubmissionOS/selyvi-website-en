import { CircleCheck, Network } from "lucide-react";

/**
 * Sektion 6 – was heute geht, und was an der Zahl der Schulen hängt.
 *
 * ==========================================================================
 * DIE RECHTE SPALTE IST EINE REGEL-D-AUSNAHME – UND ZWAR EINE ENGE
 * ==========================================================================
 * „In future" beschreibt hier KEINE Produktreife, sondern den Ausbau eines
 * NETZWERKS. Der Unterschied ist die Fussnote darunter: Diese vier haengen an
 * der Zahl der beteiligten Schulen, nicht an Technik. Wer sie als
 * Funktionsversprechen liest, liest an der Fussnote vorbei – deshalb steht sie
 * dort und nicht im Kleingedruckten.
 *
 * CLAUDE.md fuehrt das als benannte Ausnahme: „in future" ist erlaubt, wenn es
 * an etwas haengt, das NICHT in unserer Hand liegt. „Support for X is coming
 * in future" bleibt verboten und wird vom Smoke-Test weiter gefangen.
 */
const HEUTE = [
  "Provide research and test environments",
  "Build features for projects",
  "Model impact measurement technically",
  "Integrate data collection instruments",
  "Prepare study designs together",
];

const SPAETER = [
  "Data collection across schools",
  "Longitudinal studies",
  "Comparisons across school types and regions",
  "Larger research and practice projects",
];

export function ResearchToday() {
  return (
    <section
      aria-labelledby="forschung-heute-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="forschung-heute-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          What works today — and what hangs on the network
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-surface p-8">
            <CircleCheck aria-hidden="true" className="size-6 text-brand-600" />

            <h3 className="mt-4 text-xl font-semibold text-ink">Today</h3>

            <ul className="mt-6 space-y-4">
              {HEUTE.map((punkt) => (
                <li key={punkt} className="flex gap-3 text-gray-500">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-600"
                  />
                  {punkt}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-surface p-8">
            <Network aria-hidden="true" className="size-6 text-brand-600" />

            <h3 className="mt-4 text-xl font-semibold text-ink">
              In future — with a growing school network
            </h3>

            <ul className="mt-6 space-y-4">
              {SPAETER.map((punkt) => (
                <li key={punkt} className="flex gap-3 text-gray-500">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-600"
                  />
                  {punkt}
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-500">
              These four hang on the number of schools taking part, not on technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
