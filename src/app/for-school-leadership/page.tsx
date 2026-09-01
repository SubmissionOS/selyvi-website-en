import { Reveal } from "@/components/motion/reveal";
import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { SchoolIntro } from "@/components/sections/schulen/school-intro";
import { ReliefReport } from "@/components/sections/schulen/relief-report";
import { TeachingQuality } from "@/components/sections/schulen/teaching-quality";
import { RolloutTimeline } from "@/components/sections/schulen/rollout-timeline";
import { DpaBand } from "@/components/sections/dpa-band";
import { LeadershipFaq } from "@/components/sections/schulen/leadership-faq";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata("/for-school-leadership");

/**
 * Seite für Schulleitung und Schulträger.
 *
 * Reine Komposition. <FinalCta /> ist unveraendert dieselbe Komponente wie auf
 * Startseite und /produkt.
 */
export default function SchulenPage() {
  return (
    <>
      <SchoolIntro />
      <Reveal>
        <ReliefReport />
      </Reveal>
      <Reveal>
        <TeachingQuality />
      </Reveal>
      <Reveal>
        <RolloutTimeline />
      </Reveal>
      <Reveal>
        <DpaBand />
      </Reveal>
      <Reveal>
        <LeadershipFaq />
      </Reveal>
      <FinalCta />
    </>
  );
}
