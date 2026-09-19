import { Reveal } from "@/components/motion/reveal";
import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { ResearchHero } from "@/components/sections/forschung/research-hero";
import { ResearchPositioning } from "@/components/sections/forschung/research-positioning";
import { ResearchBuildable } from "@/components/sections/forschung/research-buildable";
import { ResearchProcess } from "@/components/sections/forschung/research-process";
import { ResearchMutual } from "@/components/sections/forschung/research-mutual";
import { ResearchToday } from "@/components/sections/forschung/research-today";
import { ImpactModel } from "@/components/sections/forschung/impact-model";
import { ImpactLineQuote } from "@/components/sections/forschung/impact-line-quote";
import { ResearchFields } from "@/components/sections/forschung/research-fields";
import { ResearchAccessBand } from "@/components/sections/forschung/research-access-band";
import { ResearchFaq } from "@/components/sections/forschung/research-faq";
import { ResearchFunding } from "@/components/sections/forschung/research-funding";
import { ResearchForm } from "@/components/sections/forschung/research-form";

export const metadata: Metadata = pageMetadata("/research");

/**
 * Seite für Forschung und Hochschulen.
 *
 * ==========================================================================
 * DIE REIHENFOLGE IST DER STRATEGIEWECHSEL (CEO-Auftrag, 17.09.2026)
 * ==========================================================================
 * Vorher begann die Seite bei UNS: „Impact we want to evidence" – Selyvi als
 * Gegenstand von Forschung. Jetzt beginnt sie bei der Leserin: ihre Frage,
 * Selyvi als Infrastruktur darunter.
 *
 * Nichts von der alten Seite ist verschwunden. Das Wirkungsmodell, die neun
 * Forschungsfelder und die Regeln zu Forschungsdaten stehen unveraendert
 * drin – nur eine Ebene tiefer. Aus der Ankuendigung ist der Beleg geworden:
 *
 *    1. Hero               Ihre Forschungsfrage, unsere Infrastruktur
 *    2. Positionierung     Selyvi muss nicht Ihre Forschungsfrage sein
 *    3. Was wir bauen      zehn Leistungen, eine davon bedingt
 *    4. Ablauf             sechs Schritte, wie auf /for-school-leadership
 *    5. Nutzen             fuer Forschung, fuer Schulen, fuer uns
 *    6. Heute / spaeter    was geht, und was an der Zahl der Schulen haengt
 *    ------------------------------------------------------------------
 *    7. Wirkungsmodell     UNVERAENDERT – der Beleg, dass wir das ernst meinen
 *    8. Wirkungszeile      UNVERAENDERT
 *    9. Forschungsfelder   UNVERAENDERT – neun Fragen, die uns interessieren
 *   10. Regeln             UNVERAENDERT – die drei Bedingungen fuer Daten
 *   11. FAQ                UNVERAENDERT
 *    ------------------------------------------------------------------
 *   12. Drittmittel        vor dem Antrag ist der beste Zeitpunkt
 *   13. Formular           ersetzt das reine Kontaktband
 *
 * Die Regeln-Sektion (10) steht weiterhin NACH den Forschungsfeldern und nicht
 * davor: Wer bis dahin gelesen hat, liest die Bedingungen nicht als Abwehr,
 * sondern als Haltung. Sie ist ausserdem das Ziel des Ankers aus der
 * Export-Karte in Sektion 3 – die einzige Leistung, die nicht zugesagt,
 * sondern an Bedingungen geknuepft ist.
 *
 * Diese Seite hat weiterhin keine Szene und keine Animation. Wer prueft,
 * liest – bewegte Oberflaechen wirken hier wie Ablenkung von der Sache.
 */
export default function ForschungPage() {
  return (
    <>
      <ResearchHero />
      <Reveal>
        <ResearchPositioning />
      </Reveal>
      <Reveal>
        <ResearchBuildable />
      </Reveal>
      <Reveal>
        <ResearchProcess />
      </Reveal>
      <Reveal>
        <ResearchMutual />
      </Reveal>
      <Reveal>
        <ResearchToday />
      </Reveal>
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
        <ResearchFunding />
      </Reveal>
      <Reveal>
        <ResearchForm />
      </Reveal>
    </>
  );
}
