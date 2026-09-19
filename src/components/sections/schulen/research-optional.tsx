import { FlaskConical } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Karte auf /for-school-leadership – Forschung als Option, nicht als Erwartung.
 *
 * ==========================================================================
 * BEWUSST OHNE LINK
 * ==========================================================================
 * Diese Karte fuehrt NICHT auf /research. Eine Schulleitung, die eine
 * Software prueft, soll hier nicht in eine Forschungsseite abbiegen – sie
 * soll wissen, dass Forschung existiert und sie nichts angeht, solange sie
 * es nicht will. Ein Link waere eine Einladung, und eine Einladung ist hier
 * eine Erwartung.
 *
 * Der letzte Satz ist der wichtigste der Karte: „Productive school data does
 * not become research data by itself." Er beantwortet die Frage, die eine
 * Schulleitung wirklich hat, bevor sie gestellt wird.
 */
export function ResearchOptional() {
  return (
    <section
      aria-labelledby="schulen-forschung-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-3xl rounded-xl border border-gray-200 bg-surface p-6 lg:p-8">
          <div className="flex gap-4">
            <FlaskConical aria-hidden="true" className="size-6 shrink-0 text-brand-600" />

            <div>
              <h2 id="schulen-forschung-titel" className="text-lg font-semibold text-ink">
                Research – only if your school wants it
              </h2>

              <p className="mt-3 text-gray-500">
                {PRODUCT_NAME} can support research and practice projects. Taking part
                happens only under a separately agreed arrangement.
              </p>

              <p className="mt-3 text-ink">
                Productive school data does not become research data by itself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
