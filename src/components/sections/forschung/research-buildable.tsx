import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Columns2,
  Database,
  FileSpreadsheet,
  FlaskConical,
  GitCompareArrows,
  LayoutDashboard,
  Puzzle,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 3 – was wir für ein Forschungsprojekt bauen können.
 *
 * ==========================================================================
 * DIESE KARTEN SIND DIENSTLEISTUNGSZUSAGEN, KEINE PRODUKTFUNKTIONEN
 * ==========================================================================
 * Das ist der Unterschied, an dem diese Sektion steht oder faellt. Keine Karte
 * behauptet, dass es eine Funktion GIBT – jede sagt, was wir fuer ein Projekt
 * UMSETZEN. CLAUDE.md, Abschnitt „Dienstleistungszusagen": erlaubt, solange es
 * Arbeit beschreibt und als gemeinsames Projekt formuliert ist.
 *
 * Deshalb lautet die Ueberschrift „What we can build for your research
 * project" und nicht „What Selyvi can do". Ein einziges „Selyvi offers" in
 * einer dieser Karten waere eine ungedeckte Produktaussage.
 *
 * ==========================================================================
 * DIE ZEHNTE KARTE IST ANDERS – UND ZWAR ABSICHTLICH
 * ==========================================================================
 * „Export of defined research data" ist die einzige Karte, die einen
 * Datenzugang beruehrt. Der ist NICHT zugesagt: Er haengt an drei Bedingungen,
 * die weiter unten auf dieser Seite stehen. Deshalb traegt sie den Zusatz
 * „under our published rules" mit Anker dorthin.
 *
 * CLAUDE.md macht daraus eine Regel: Der Forschungsdaten-Export wird nur mit
 * Verweis auf die drei Bedingungen genannt. Der Smoke-Test prueft die Kopplung
 * – eine Seite, die „export" sagt und die Bedingungen nicht fuehrt, faellt
 * durch.
 *
 * ==========================================================================
 * RASTER-WAISEN-REGEL
 * ==========================================================================
 * Zehn Karten in einem Dreier-Raster liessen eine allein in der letzten Reihe.
 * Statt eine Karte zu streichen oder eine elfte zu erfinden, nimmt die
 * Export-Karte die ganze Breite ein: neun im Raster, eine ueber die volle
 * Zeile. Das loest die Waise UND gibt der einzigen bedingten Zusage das
 * Gewicht, das sie braucht.
 */
type Leistung = { icon: LucideIcon; title: string };

const LEISTUNGEN: Leistung[] = [
  { icon: ClipboardList, title: "Instruments that run inside the school day" },
  { icon: FileSpreadsheet, title: "Project-specific questionnaires and survey waves" },
  { icon: Puzzle, title: "New features and digital interventions" },
  { icon: Database, title: "Logging of defined usage and process data" },
  { icon: GitCompareArrows, title: "A/B and comparison variants" },
  { icon: Workflow, title: "Digital support for teaching and support concepts" },
  { icon: LayoutDashboard, title: "Project-specific dashboards and analyses" },
  { icon: Sparkles, title: "New teaching and learning materials, built out" },
  { icon: FlaskConical, title: "Research and test environments" },
];

export function ResearchBuildable() {
  return (
    <section aria-labelledby="forschung-bauen-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        {/* Anker fuer die Leerraum-Regel: Der Ausschnitt mit der Ueberschrift
            liegt vor dem Karten-Raster und waere sonst reiner Text. Gemessen
            mit qa-en.mjs, nicht vermutet. */}
        <Wrench aria-hidden="true" className="size-8 text-brand-600" />

        <h2
          id="forschung-bauen-titel"
          className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          What we can build for your research project
        </h2>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LEISTUNGEN.map((leistung) => (
            <li
              key={leistung.title}
              className="rounded-xl border border-gray-200 bg-surface p-6"
            >
              <leistung.icon aria-hidden="true" className="size-5 text-brand-600" />
              <p className="mt-4 text-base font-semibold text-ink">{leistung.title}</p>
            </li>
          ))}
        </ul>

        {/* Die bedingte Zusage, über die volle Breite. */}
        <div className="mt-6 rounded-xl border border-brand-600 bg-surface-alt p-6">
          <div className="flex gap-4">
            <Columns2 aria-hidden="true" className="size-5 shrink-0 text-brand-600" />

            <div>
              <p className="text-base font-semibold text-ink">
                Export of defined research data – under our published rules
              </p>

              <p className="mt-3 text-gray-500">
                We release data under three conditions only: verified consent, aggregation
                with minimum case numbers instead of raw data, and a documented data
                collection model.{" "}
                <a
                  href="#forschungszugang-titel"
                  className="text-brand-600 underline underline-offset-4"
                >
                  The rules in full
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-3xl text-lg text-ink">
          {PRODUCT_NAME} is deliberately malleable. If your project needs a feature that
          does not exist today, that can be exactly where the work together starts.
        </p>
      </div>
    </section>
  );
}
