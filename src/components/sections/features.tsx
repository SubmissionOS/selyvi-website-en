import { BarChart3, BookOpen, ClipboardList, Mail } from "lucide-react";

import { TRANSLATION_LANGUAGE_COUNT } from "@/config/product";

/**
 * Sektion 5 – „What gets taken off your hands“.
 * Je Karte genau ein Nutzensatz. Keine Adjektivketten, keine Superlative.
 *
 * Die vier Karten sind die vier Bereiche, in die docs/produktstand-2026-08.md
 * den Funktionsumfang gliedert – nicht vier frei gewaehlte Verkaufsargumente.
 * Wer die Reihenfolge aendert, sollte sie dort mitaendern.
 */
const features = [
  {
    icon: ClipboardList,
    title: "Documentation",
    description:
      "Observations are made during the lesson – typed or dictated – and build up a timeline per child, with competencies and support notes.",
  },
  {
    icon: Mail,
    title: "Communication",
    // „in the learned writing style“ ist hier entfallen – siehe value-for-all.tsx:
    // Die Stil-Aussage traegt seit der Straffung die Spalte „For teachers“,
    // und zwar als einzige Stelle der Startseite. Diese Karte beschreibt den
    // BEREICH Kommunikation; dafuer braucht sie das Merkmal nicht.
    description: `Report comments and parent emails come out of your own observations – parent emails in ${TRANSLATION_LANGUAGE_COUNT} languages on request.`,
  },
  {
    icon: BookOpen,
    title: "Teaching",
    description:
      "Teaching materials and lesson drafts come out of a searchable subject corpus. Every generated document states its sources.",
  },
  {
    icon: BarChart3,
    title: "Steering",
    description:
      "In the workload relief report, school leadership sees how many hours that has given back to the staff – month by month, as a PDF.",
  },
];

export function Features() {
  return (
    <section aria-labelledby="abgenommen-titel">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="abgenommen-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          What gets taken off your hands
        </h2>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <li
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-surface p-6"
              >
                <Icon aria-hidden="true" className="size-6 text-brand-600" />
                <h3 className="mt-5 text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm text-gray-500">{feature.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
