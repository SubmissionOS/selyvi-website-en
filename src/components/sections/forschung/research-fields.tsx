import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  CalendarClock,
  ClipboardList,
  Compass,
  FileStack,
  Map,
  Microscope,
  Sprout,
  Timer,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 4 – Forschungsfelder als PERSPEKTIVEN, nicht als Angebot.
 *
 * ==========================================================================
 * KEINE DIESER FRAGEN LAESST SICH HEUTE AUS DEM PRODUKT BEANTWORTEN.
 * ==========================================================================
 * Der Forschungsdaten-Export ist laut docs/produktstand-2026-08.md „Nicht
 * gebaut“, und die Forschungszwecke sind zusaetzlich technisch gesperrt,
 * solange die Einwilligungstexte nicht juristisch geprueft sind.
 *
 * Der Vorspann sagt das weiterhin – aber als EINLADUNG statt als Defizit.
 * Die frueheren Saetze („none of them can be answered from Selyvi today – the
 * survey instruments for that do not exist yet“) waren wahr und
 * trotzdem falsch platziert: Sie erklaerten einer Leserin als Erstes, was
 * nicht geht. Der Inhalt ist unveraendert – es gibt heute nichts abzurufen –,
 * die Blickrichtung ist neu: Die Instrumente entstehen gerade, und wer jetzt
 * einsteigt, gestaltet sie mit. Das ist kein Schoenreden, sondern der
 * tatsaechliche Grund, warum diese Seite existiert.
 *
 * Zwei Vorkehrungen bleiben:
 *   1. Der Vorspann steht VOR den Karten, nicht darunter.
 *   2. Jede Karte ist im Wir-Modus und im Futur/Konjunktiv formuliert. Kein
 *      Satz behauptet einen vorhandenen Datenbestand.
 *
 * ==========================================================================
 * TEXTLAENGE: ALLE KARTEN AUF EIN MASS
 * ==========================================================================
 * Richtwert ist „Regional differences“ – die Karte, die im Layout am besten
 * sass. Englischer Text laeuft hier rund 5 bis 10 Prozent laenger als der
 * deutsche; die Spanne liegt entsprechend bei rund 175 bis 215 Zeichen. Zwei Saetze je
 * Karte: Der erste nennt die Frage, der zweite sagt, warum wir sie nicht
 * allein beantworten koennen.
 *
 * Wer eine Karte ergaenzt, prueft die Laenge mit – ungleich lange Texte
 * lassen ein Raster aus neun Karten unruhig wirken, und genau daran ist die
 * Vorgaenger-Fassung aufgefallen.
 *
 * Die Themen stammen aus docs/selyvi-kompakt.md, Abschnitt
 * „Wissenschaftliches Potenzial“ (wissenschaftliches Potenzial). Dort stehen
 * sie als Potenzial – hier
 * duerfen sie deshalb nur als Vorhaben stehen.
 */
type ResearchField = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const fields: ResearchField[] = [
  {
    icon: Compass,
    title: "Evidence-based teaching approaches",
    description:
      "Which teaching approaches actually hold up day to day and which only work on paper. A question that could be examined together, instead of continuing to guess at it.",
  },
  {
    icon: Microscope,
    title: "How lessons actually run",
    description:
      "How a lesson really unfolds – between the plan, the interruption and the improvisation. We would like to measure that gap between draft and reality with you.",
  },
  {
    icon: Blocks,
    title: "Differences in teaching styles",
    description:
      "Where teaching styles differ day to day and what that does in the classroom. A field in which we would welcome research that sees more than a single school.",
  },
  {
    icon: FileStack,
    title: "New teaching and learning materials",
    description:
      "What materials would have to look like if they built on the documented observations of one particular class. We would like to design them together and then have them examined.",
  },
  {
    icon: ClipboardList,
    title: "Evaluating digital support",
    description: `Whether digital tools really deliver in everyday school life what they promise. For us the most uncomfortable question – and the reason ${PRODUCT_NAME} should not answer it alone.`,
  },
  {
    icon: Timer,
    title: "Administrative workload of teachers",
    description:
      "What share of working time goes on documentation, communication and administration – and which of those tasks is experienced as a burden at all, and which is not.",
  },
  {
    icon: Map,
    title: "Regional differences",
    /** Die Referenzkarte fuer die Textlaenge – rund 200 Zeichen. */
    description:
      "Whether workload and preparation practice differ systematically between federal states, school sizes and catchment areas. A question only a consortium across state borders can answer.",
  },
  {
    icon: Sprout,
    title: "New approaches to learning support",
    description:
      "What support looks like when it builds on continuous observation instead of a single snapshot. That needs expert counter-argument, not just software.",
  },
  {
    icon: CalendarClock,
    title: "Long-term impact analyses",
    description:
      "What is actually left of school measures after years. A question for which three survey waves are not enough – here we need partners with staying power.",
  },
];

export function ResearchFields() {
  return (
    <section
      aria-labelledby="forschungsfelder-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="forschungsfelder-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          What there is to research with {PRODUCT_NAME}
        </h2>

        {/* Diese beiden Saetze sind die Absicherung der ganzen Sektion – und
            zugleich die Einladung. Ohne sie liest sich die Kartenliste wie ein
            Datenkatalog. */}
        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          Nine questions we keep returning to. The impact model already runs in survey
          waves; the instruments for these questions we design with the people who will
          use them.
        </p>

        <p className="mt-4 max-w-2xl text-lg text-gray-500">
          We would rather not design them alone. Whoever works in one of these fields
          should have a say in what gets collected — and in what had better not be.
        </p>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field, position) => (
            <li
              key={field.title}
              /* Neun Karten in ZWEI Spalten ergeben 2+2+2+2+1 – die letzte
                 steht allein und liest sich wie vergessen. Sie nimmt dort
                 deshalb beide Spalten ein. Bei drei Spalten (ab lg) geht die
                 Rechnung ohnehin auf, da gilt wieder eine Spalte. */
              className={cn(
                "rounded-xl border border-gray-200 bg-surface p-6",
                position === fields.length - 1 && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <field.icon
                aria-hidden="true"
                className="size-6 text-brand-600"
                strokeWidth={1.75}
              />
              <h3 className="mt-4 text-base font-semibold text-ink">{field.title}</h3>
              <p className="mt-3 text-sm text-gray-500">{field.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
