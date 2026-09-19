import { Compass } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 2 – das Positionierungs-Band. Der wichtigste Absatz der Seite.
 *
 * ==========================================================================
 * WAS HIER PASSIERT
 * ==========================================================================
 * Die Seite gibt hier ihren eigenen Anspruch ab. „Selyvi does not have to be
 * your research question" ist fuer eine Produktseite ein ungewoehnlicher Satz –
 * und genau deshalb wirkt er. Wer Forschungsantraege schreibt, hat den
 * umgekehrten Satz oft gelesen und danach abgeschaltet.
 *
 * ==========================================================================
 * ANPASSUNG AN REGEL A
 * ==========================================================================
 * Im Auftrag stand „Vielleicht untersuchen Sie Lehrkräftebelastung …". Das ist
 * eine Zuschreibung im Konjunktiv und faellt damit unter Regel A – „Sie wollen
 * doch …" ist derselbe Satzbau. Die deutsche Endfassung hat daraus
 * „Vielleicht geht es um …" gemacht; die englische folgt dieser HALTUNG, nicht
 * dem Papier-Original: „Maybe it is about teacher workload …" nennt dieselben
 * fuenf Felder, ohne zu behaupten, woran jemand arbeitet.
 *
 * ==========================================================================
 * LAYOUT-REGEL
 * ==========================================================================
 * Ein Band aus reinem Text waere auf 1440 ein Bildschirm ohne Bildliches.
 * Muster (c) aus CLAUDE.md: schmaler Satzspiegel, kraeftige farbige Kante und
 * ein Icon als Anker. Keine neue Szene – die waere hier Dekoration.
 */
export function ResearchPositioning() {
  return (
    <section
      aria-labelledby="forschung-positionierung-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="flex max-w-4xl gap-6 border-l-4 border-brand-600 pl-6 sm:gap-8 sm:pl-10">
          <Compass
            aria-hidden="true"
            className="hidden size-10 shrink-0 text-brand-600 sm:block"
          />

          <div>
            <h2
              id="forschung-positionierung-titel"
              className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
              {PRODUCT_NAME} does not have to be your research question.
            </h2>

            <p className="mt-6 text-lg text-gray-500">
              Maybe it is about teacher workload, lesson planning, feedback, AI literacy
              or support processes.
            </p>

            <p className="mt-4 text-lg text-ink">
              If the study needs a digital feature or environment inside the school day,
              we work out whether {PRODUCT_NAME} can provide it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
