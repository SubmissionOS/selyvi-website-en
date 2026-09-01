import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PRACTICE_CLAIM } from "@/config/brand";
import { Button } from "@/components/ui/button";

/**
 * Sektion „From practice“ – zwischen „Try it for yourself.“ und „What gets
 * taken off your hands“.
 *
 * Bewusst ohne Karten-Raster: Die Aussage traegt sich selbst, ein Raster wuerde
 * sie zu einem weiteren Feature-Block machen. Zwei Saetze, viel Weissraum, ein
 * Link.
 *
 * HIER steht der einzige sichtbare Marker zur Praxis-Aussage. Die Aussage
 * selbst erscheint an mehreren Stellen der Website, ist aber EIN offener Punkt –
 * und weil alle Stellen sich PRACTICE_CLAIM teilen, erledigt eine Aenderung
 * an der Konstante sie alle auf einmal. Siehe src/config/brand.ts.
 *
 * Der obere Rand ist noetig, weil die vorangehende Sektion dieselbe Flaeche
 * (surface-alt) nutzt – ohne Trennlinie liefen beide ineinander.
 */
export function FromPractice() {
  return (
    <section
      aria-labelledby="aus-der-praxis-titel"
      className="border-y border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <h2
            id="aus-der-praxis-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            From practice
          </h2>

          <p className="mt-6 text-lg text-gray-500">{PRACTICE_CLAIM}</p>

          <p className="mt-4 text-lg text-gray-500">
            Many features go straight back to remarks from that collaboration.
          </p>

          <div className="mt-8">
            <Button asChild variant="link" size="sm" className="h-auto px-0">
              <Link href="/for-teachers">
                What came out of it
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
