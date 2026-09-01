import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { PRODUCT_NAME } from "@/config/brand";
import { DemoForm } from "@/components/sections/demo/demo-form";
import { NextSteps } from "@/components/sections/demo/next-steps";

export const metadata: Metadata = pageMetadata("/meet");

/**
 * /meet – die einzige Conversion-Seite der Website.
 *
 * Bewusst OHNE <FinalCta />: Die Seite IST der Call-to-Action. Ein zweiter
 * Aufruf am Seitenende waere eine Aufforderung, das zu tun, was die Nutzerin
 * gerade tut.
 *
 * Im Header ist kein Navigationspunkt aktiv – /meet ist der Button, kein
 * Menuepunkt.
 *
 * Der Versand laeuft ueber eine Server Action (src/app/meet/actions.ts). Der
 * Brevo-Schluessel wird ausschliesslich serverseitig gelesen; siehe README,
 * Abschnitt „ENV-Variablen“.
 */
export default function DemoPage() {
  return (
    <section aria-labelledby="meet-title">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h1
            id="meet-title"
            className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            Meet {PRODUCT_NAME}.
          </h1>

          <p className="mt-6 text-lg text-gray-500">
            In 20 minutes we show you the real interface – no video, no slides.
          </p>

          <p className="mt-4 text-lg text-gray-500">
            Your questions come first. What you want to see is up to you.
          </p>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <h2 className="sr-only">Request form</h2>
            <DemoForm />
          </div>

          <aside className="lg:col-span-2">
            <NextSteps />
          </aside>
        </div>
      </div>
    </section>
  );
}
