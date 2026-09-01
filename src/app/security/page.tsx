import { Reveal } from "@/components/motion/reveal";
import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { SecurityIntro } from "@/components/sections/sicherheit/security-intro";
import { SeparationBand } from "@/components/sections/sicherheit/separation-band";
import { PrinciplesGrid } from "@/components/sections/sicherheit/principles-grid";
import { SubprocessorsTable } from "@/components/sections/sicherheit/subprocessors-table";
import { DpaBand } from "@/components/sections/dpa-band";
import { ForDpos } from "@/components/sections/sicherheit/for-dpos";
import { SecurityFaq } from "@/components/sections/sicherheit/security-faq";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata("/security");

/**
 * Seite für Schulleitungen und Datenschutzbeauftragte.
 *
 * Auf dieser Seite steht ausschliesslich, was heute stimmt. Wo eine Zusage nicht
 * gedeckt war, steht jetzt die abgeschwaechte Tatsache oder eine Ankuendigung
 * mit Zeitpunkt. Was noch aussteht, steht im README unter NACH-LAUNCH-LISTE –
 * nicht auf der Seite.
 *
 * <Reveal>   <DpaBand /> </Reveal> ist dieselbe Komponente wie auf /for-school-leadership – die AVV-Aussage
 * bleibt dadurch auf beiden Seiten zwingend wortgleich.
 */
export default function DatenschutzSicherheitPage() {
  return (
    <>
      <SecurityIntro />
      <Reveal>
        <PrinciplesGrid />
      </Reveal>
      <Reveal>
        <SeparationBand />
      </Reveal>
      <Reveal>
        <SubprocessorsTable />
      </Reveal>
      <Reveal>
        <DpaBand />
      </Reveal>
      <Reveal>
        <ForDpos />
      </Reveal>
      <Reveal>
        <SecurityFaq />
      </Reveal>
      <FinalCta />
    </>
  );
}
