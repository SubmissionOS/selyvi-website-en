import { Reveal } from "@/components/motion/reveal";
import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { ProductIntro } from "@/components/sections/produkt/product-intro";
import { LearnsWithYou } from "@/components/sections/produkt/learns-with-you";
import { PrincipleBand } from "@/components/sections/produkt/principle-band";
import { FunctionBlocks } from "@/components/sections/produkt/function-blocks";
import { ExcerptNote } from "@/components/sections/produkt/excerpt-note";
import { EverydayExtras } from "@/components/sections/produkt/everyday-extras";
import { CoCreateBand } from "@/components/sections/produkt/co-create-band";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata("/for-teachers");

/**
 * Produktseite.
 *
 * Reine Komposition. <FinalCta /> ist dieselbe Komponente wie auf der
 * Startseite – Text und CTA-Farbe bleiben damit automatisch synchron.
 */
export default function ProduktPage() {
  return (
    <>
      <ProductIntro />
      <Reveal>
        <LearnsWithYou />
      </Reveal>
      <Reveal>
        <PrincipleBand />
      </Reveal>
      <Reveal>
        <FunctionBlocks />
      </Reveal>
      <Reveal>
        <ExcerptNote />
      </Reveal>
      <Reveal>
        <EverydayExtras />
      </Reveal>
      <Reveal>
        <CoCreateBand />
      </Reveal>
      <FinalCta />
    </>
  );
}
