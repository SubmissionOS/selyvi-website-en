import { Check } from "lucide-react";

import { PRACTICE_CLAIM_SHORT } from "@/config/brand";
import { AUDIENCE_SHORT } from "@/config/product";

/**
 * Sektion 2 – Trust-Zeile.
 *
 * Schmale Leiste ohne eigene Ueberschrift: aria-label haelt die Sektion fuer
 * Screenreader benannt, ohne eine ueberfluessige Ebene in die
 * Ueberschriften-Hierarchie einzuziehen.
 */
/**
 * Drei Merkmale: Passung, Herkunft, Datenschutz.
 *
 * „Server in der EU" stand hier bis zum Abgleich mit dem Produktstand. Die
 * Zusage ist fuer das Produkt nicht gedeckt (siehe PRODUCT_HOSTING_NOTE) und
 * war in einer Trust-Zeile besonders heikel: eine ungedeckte Zusage genau
 * dort, wo Leserinnen und Leser sie ungeprueft mitnehmen.
 *
 * An ihrer Stelle steht die Datenschutz-Aussage, die heute traegt – „no sharing
 * of pupil data" ist durch den Produktstand gedeckt und ohne Fussnote wahr.
 *
 * „pupil data", nicht „student data": „Student" heisst ausserhalb der USA
 * meist Studierende (docs/glossar-en.md).
 */
const trustPoints = [
  // Zielgruppe – Quelle ist src/config/product.ts.
  AUDIENCE_SHORT,
  // Kurzform der kanonischen Praxis-Aussage – Quelle ist src/config/brand.ts.
  PRACTICE_CLAIM_SHORT,
  "No sharing of pupil data",
];

export function TrustBar() {
  return (
    <section
      aria-label="Key facts"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-5 lg:px-8">
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-2">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-2.5">
              <Check aria-hidden="true" className="size-4 shrink-0 text-brand-600" />
              <span className="text-sm text-ink">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
