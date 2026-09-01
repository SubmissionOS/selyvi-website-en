import { cn } from "@/lib/utils";
import { MISSION_PROMISE } from "@/config/product";
import Link from "next/link";

import { PRODUCT_NAME } from "@/config/brand";
import { primaryCta } from "@/config/site";
import { Button } from "@/components/ui/button";

/**
 * Sektion 9 – Abschluss-CTA.
 */
/**
 * @param withMission Stellt MISSION_PROMISE ueber die Ueberschrift.
 *
 * Nur die Startseite setzt das. Die Komponente steht auch auf
 * /for-teachers und /for-school-leadership; dort haben die Leserinnen bereits eine ganze
 * Seite Argumente hinter sich und brauchen keine Grundsatzaussage mehr. Auf
 * der Startseite ist es der letzte Satz vor der Entscheidung – und der
 * benennt die Arbeitsteilung, bevor jemand auf einen Knopf drueckt.
 */
export function FinalCta({ withMission = false }: { withMission?: boolean }) {
  return (
    <section
      aria-labelledby="final-cta-titel"
      className="border-t border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        {withMission ? (
          <p className="max-w-2xl text-lg text-gray-500">{MISSION_PROMISE}</p>
        ) : null}

        <h2
          id="final-cta-titel"
          className={cn(
            "max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl",
            withMission && "mt-4",
          )}
        >
          Twenty minutes, and you will know whether {PRODUCT_NAME} helps you.
        </h2>

        <div className="mt-10">
          {/* Primaerer CTA – einzige Verwendung von --cta in dieser Sektion. */}
          <Button asChild variant="cta" size="lg">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
