import type { LucideIcon } from "lucide-react";
import { Building2, GraduationCap, Microscope } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 5 – was beide Seiten davon haben.
 *
 * ==========================================================================
 * DER SCHULZUGANG STEHT NUR IN DER VORSICHTIGEN FASSUNG
 * ==========================================================================
 * Die Fussnote in der mittleren Spalte ist die heikelste Zeile dieser
 * Sektion. Ein Satz wie „wir bringen Ihr Projekt mit Schulen zusammen" waere
 * eine Zusage ueber Dritte: Ob eine Schule mitmacht, entscheidet die Schule –
 * das steht drei Zeilen darueber und gilt auch hier.
 *
 * Deshalb: „we would like to", „where it fits", „growing". Alle drei
 * Einschraenkungen zusammen machen aus der Zusage eine Absicht. CLAUDE.md
 * definiert „perspektivisch/in future" genau dafuer eng – erlaubt fuer den
 * Ausbau des Netzwerks, nicht fuer Produktreife.
 */
type Spalte = {
  icon: LucideIcon;
  title: string;
  points: string[];
  note?: string;
};

const SPALTEN: Spalte[] = [
  {
    icon: Microscope,
    title: "For research",
    points: [
      "Infrastructure without having to build it yourself",
      "Features cut to the project",
      "Closeness to the real school day, not to the survey situation",
      "Impact measurement that can be defined up front",
      "Long-term studies inside the same system",
    ],
  },
  {
    icon: GraduationCap,
    title: "For schools",
    points: [
      "New answers early — where they are needed",
      "Taking part stays the school's decision",
    ],
    note: `Where it fits academically and legally, we would like in future to bring projects together with schools from our growing practice network.`,
  },
  {
    icon: Building2,
    title: `For ${PRODUCT_NAME}`,
    points: [
      "Academic input instead of gut feeling",
      "Features that grow out of real research questions",
      "Cleaner data collection models than we would build alone",
    ],
  },
];

export function ResearchMutual() {
  return (
    <section
      aria-labelledby="forschung-nutzen-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="forschung-nutzen-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          What both sides get out of it
        </h2>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {SPALTEN.map((spalte) => (
            <li
              key={spalte.title}
              className="flex flex-col rounded-xl border border-gray-200 bg-surface p-6"
            >
              <spalte.icon aria-hidden="true" className="size-5 text-brand-600" />

              <h3 className="mt-4 text-lg font-semibold text-ink">{spalte.title}</h3>

              <ul className="mt-4 space-y-3">
                {spalte.points.map((punkt) => (
                  <li key={punkt} className="flex gap-3 text-gray-500">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-600"
                    />
                    {punkt}
                  </li>
                ))}
              </ul>

              {spalte.note ? (
                <p className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-500">
                  {spalte.note}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
