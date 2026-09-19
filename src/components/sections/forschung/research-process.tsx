import { Route } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 4 – wie eine Kooperation abläuft.
 *
 * Dieselbe Bauweise wie die Stationen-Linie auf /for-school-leadership: eine
 * nummerierte Liste mit durchgehender Linie. Das ist Absicht – wer beide
 * Seiten liest, soll denselben Ablauf-Typ wiedererkennen.
 *
 * SCHRITT 2 ENDET AUSDRUECKLICH AUCH MIT EINEM NEIN. Dieser Halbsatz ist der
 * Grund, warum die uebrigen fuenf Schritte glaubwuerdig sind: Ein Ablauf, der
 * nur ein Ergebnis kennt, ist kein Ablauf, sondern ein Verkaufstrichter.
 */
const SCHRITTE = [
  {
    title: "Research question",
    description:
      "You describe what you want to investigate. We listen before we propose anything — a question pressed into an existing tool is a different question afterwards.",
  },
  {
    title: "Technical fit",
    description: `Together we work out what ${PRODUCT_NAME} carries today, what can be extended, and what is better built elsewhere. This assessment can end in a no, and says so.`,
  },
  {
    title: "Research design",
    description:
      "Data collection, roles and data protection are settled per project. What gets collected is fixed before the project starts — not at the end, once the data is already there.",
  },
  {
    title: "Build in a research and test environment",
    description:
      "The work happens in its own environment, separate from day-to-day operation. There you can try, discard and build again differently without a single school noticing.",
  },
  {
    title: "Practice",
    description:
      "The trial runs with practice partners — existing ones, or ones brought in for the project. Whether a school takes part is the school's decision.",
  },
  {
    title: "Analysis",
    description:
      "What gets analysed is the data agreed in the design, in the form agreed there. What was not agreed is not analysed either.",
  },
];

export function ResearchProcess() {
  return (
    <section
      aria-labelledby="forschung-ablauf-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        {/* Anker fuer die Leerraum-Regel: Die Stationen-Linie besteht aus
            nummerierten Kreisen – das sind Textknoten, kein Bildliches. Die
            Messung in qa-en.mjs hat diesen Ausschnitt gemeldet. */}
        <Route aria-hidden="true" className="size-8 text-brand-600" />

        <h2
          id="forschung-ablauf-titel"
          className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          How a collaboration runs
        </h2>

        <ol className="mt-14 max-w-3xl">
          {SCHRITTE.map((schritt, index) => (
            <li key={schritt.title} className="relative flex gap-6 pb-12 last:pb-0">
              {index < SCHRITTE.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-9 bottom-0 left-[17px] w-px bg-gray-200"
                />
              ) : null}

              <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                {index + 1}
              </span>

              <div className="pt-1">
                <h3 className="text-lg font-semibold text-ink">{schritt.title}</h3>
                <p className="mt-3 text-gray-500">{schritt.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
