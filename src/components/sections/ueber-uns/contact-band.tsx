import Link from "next/link";

import { primaryCta } from "@/config/site";
import { Button } from "@/components/ui/button";

/**
 * Sektion 5 – Kontakt-Band.
 *
 * Ersetzt auf dieser Seite die <FinalCta />. Zwei CTA-Sektionen untereinander
 * waeren eine Dopplung, und die Regel „ein primaerer CTA pro Ansichtsbereich“
 * gilt weiterhin: Dieser Button ist der primaere CTA der Seite und damit die
 * einzige Stelle hier, an der --cta zum Einsatz kommt.
 *
 * Beschriftung und Ziel kommen aus primaryCta, damit sie mit Header und den
 * uebrigen Seiten synchron bleiben.
 */
export function ContactBand() {
  return (
    <section aria-labelledby="kontakt-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2
            id="kontakt-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            We take the time for a conversation.
          </h2>

          <div className="mt-10">
            {/* Primaerer CTA – einzige Verwendung von --cta auf dieser Seite. */}
            <Button asChild variant="cta" size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
