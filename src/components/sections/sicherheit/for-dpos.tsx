import Link from "next/link";

import { PRODUCT_NAME } from "@/config/brand";
import { Button } from "@/components/ui/button";

/**
 * Sektion 5 – Ansprache an Datenschutzbeauftragte.
 *

 * Der Button ist bewusst `outline` und nicht `cta`: --cta bleibt dem primaeren
 * Call-to-Action vorbehalten, und der steht am Seitenende. Eine Datenschutz-
 * pruefung ist ausserdem kein Verkaufsgespraech.
 */
export function ForDpos() {
  return (
    <section aria-labelledby="dsb-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2
            id="dsb-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            For data protection officers
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            Questions from a data protection review of {PRODUCT_NAME} we answer directly
            and without a sales conversation. Write to us through the request form – we
            will get back to you.
          </p>

          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/meet">Put your questions to us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
