import { Handshake } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 12 – Drittmittel. Vor dem Antrag ist der beste Zeitpunkt.
 *
 * Der Satz ist bewusst eine Terminaussage und keine Zusage: Er sagt, WANN ein
 * Gespraech nuetzlich ist, nicht, dass wir Teil eines Antrags werden. Dasselbe
 * Band-Muster wie die Positionierung – schmaler Satzspiegel, farbige Kante,
 * Icon als Anker (CLAUDE.md, Layout-Muster c).
 */
export function ResearchFunding() {
  return (
    <section
      aria-labelledby="forschung-drittmittel-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="flex max-w-4xl gap-6 border-l-4 border-brand-600 pl-6 sm:gap-8 sm:pl-10">
          <Handshake
            aria-hidden="true"
            className="hidden size-10 shrink-0 text-brand-600 sm:block"
          />

          <div>
            <h2
              id="forschung-drittmittel-titel"
              className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              Before the application is the best moment.
            </h2>

            <p className="mt-6 text-lg text-gray-500">
              For funding and consortium applications we work out early whether{" "}
              {PRODUCT_NAME} fits as a technical development, application or practice
              partner.
            </p>

            {/* ==========================================================
                ANPASSUNG AN REGEL C
                ==========================================================
                Hier stand „Early stage explicitly welcome". Der Ton-Grep
                faengt „early stage" unter Regel C – und zwar zu Recht, denn
                das Muster kann nicht unterscheiden, WESSEN Fruehphase gemeint
                ist. Hier war es die des Forschungsprojekts, nicht unsere
                Firmenreife.

                Eine Ausnahme dafuer gaebe genau die Formulierung frei, mit
                der sich jedes Reifegrad-Gestaendnis tarnen laesst. Der Satz
                sagt dasselbe jetzt konkreter: Es geht um Ideen, die noch kein
                Budget haben. */}
            <p className="mt-4 text-lg text-ink">
              Ideas before funding are explicitly welcome — the best collaborations start
              before the application, not after the budget has been split.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
