import Link from "next/link";
import { FlaskConical } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";
import { Button } from "@/components/ui/button";

/**
 * Forschungsblock der Startseite – kompakt, ein Verweis.
 *
 * ==========================================================================
 * EIN VERWEIS JE SEITE, AUSSERHALB VON /research
 * ==========================================================================
 * Die Regel steht in CLAUDE.md und wird von der Redundanz-Tabelle geprueft:
 * Jede Seite ausserhalb von /research fuehrt HOECHSTENS EINEN
 * Forschungs-Verweis. Auf der Startseite ist das dieser Block – die
 * Zielgruppen-Weiche weiter oben nennt Forschung deshalb, ohne ein zweites
 * Mal dorthin zu verlinken.
 *
 * Der Grund ist nicht Sparsamkeit: Eine Startseite, die dreimal auf dieselbe
 * Unterseite zeigt, liest sich wie eine Seite, die ihr eigenes Thema nicht
 * findet.
 *
 * KEIN --cta-BUTTON. Der bleibt dem Kennenlernen vorbehalten (CLAUDE.md,
 * Design-Tokens). „outline" ist die richtige Stufe: ein Weg, kein Ruf.
 */
export function ResearchBand() {
  return (
    <section
      aria-labelledby="startseite-forschung-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-12">
          <FlaskConical aria-hidden="true" className="size-10 shrink-0 text-brand-600" />

          <div className="max-w-3xl">
            <h2
              id="startseite-forschung-titel"
              className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
              And for research?
            </h2>

            <p className="mt-6 text-lg text-gray-500">
              A platform that bends to a research question.
            </p>

            <p className="mt-4 text-lg text-ink">
              {PRODUCT_NAME} does not only have to be the object of research. Features,
              data collection and digital interventions are things we build together with
              research projects and trial in a controlled environment.
            </p>

            <div className="mt-10">
              <Button asChild variant="outline" size="lg">
                <Link href="/research">Research with {PRODUCT_NAME}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
