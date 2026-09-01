import { Reveal } from "@/components/motion/reveal";
import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { ResearchIntro } from "@/components/sections/forschung/research-intro";
import { ImpactModel } from "@/components/sections/forschung/impact-model";
import { ImpactLineQuote } from "@/components/sections/forschung/impact-line-quote";
import { ResearchFields } from "@/components/sections/forschung/research-fields";
import { ResearchAccessBand } from "@/components/sections/forschung/research-access-band";
import { ResearchFaq } from "@/components/sections/forschung/research-faq";
import { ResearchContact } from "@/components/sections/forschung/research-contact";

export const metadata: Metadata = pageMetadata("/research");

/**
 * Seite für Forschende – die dritte Zielgruppe neben Lehrkräften und
 * Schulleitungen.
 *
 * Reine Komposition. Die Reihenfolge ist die Argumentation:
 *   1. Was wir vorhaben (Intro)
 *   2. Wie gemessen wird (Erhebungsmodell)
 *   3. Der Grundsatz, der es glaubwuerdig macht (Wirkungszeile)
 *   4. Woran gemeinsam geforscht werden koennte (Felder)
 *   5. Warum es heute trotzdem keinen Datenzugang gibt (Zugangs-Band)
 *   6. Die vier realen Rueckfragen (FAQ)
 *   7. Die Einladung (Kontakt)
 *
 * Punkt 5 steht bewusst NACH den Forschungsfeldern und nicht davor: Wer bis
 * dahin gelesen hat, soll die Absage nicht als Abwehr lesen, sondern als
 * Bedingung. Umgekehrt haette die Seite mit einer Einschraenkung begonnen.
 *
 * Diese Seite hat keine Szene und keine Animation. Das ist kein Versaeumnis:
 * Sie richtet sich an Leserinnen und Leser, die pruefen – bewegte Oberflaechen
 * wirken hier wie Ablenkung von der Sache.
 */
export default function ForschungPage() {
  return (
    <>
      <ResearchIntro />
      <Reveal>
        <ImpactModel />
      </Reveal>
      <Reveal>
        <ImpactLineQuote />
      </Reveal>
      <Reveal>
        <ResearchFields />
      </Reveal>
      <Reveal>
        <ResearchAccessBand />
      </Reveal>
      <Reveal>
        <ResearchFaq />
      </Reveal>
      <Reveal>
        <ResearchContact />
      </Reveal>
    </>
  );
}
