import { Reveal } from "@/components/motion/reveal";
import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { CoCreateIntro } from "@/components/sections/mitgestalten/co-create-intro";
import { WhatItMeans } from "@/components/sections/mitgestalten/what-it-means";
import { WhoFor } from "@/components/sections/mitgestalten/who-for";
import { CoCreateForm } from "@/components/sections/mitgestalten/co-create-form";

export const metadata: Metadata = pageMetadata("/co-create");

/**
 * Seite für Lehrkräfte, die früh mitbauen wollen.
 *
 * ==========================================================================
 * BEWUSST OHNE NAVIGATIONSPUNKT
 * ==========================================================================
 * Die Hauptnavigation bleibt bei fuenf Eintraegen. Sie bricht seit dem
 * fuenften ohnehin unterhalb von 880 px um (siehe main-nav.tsx) – ein
 * sechster waere der Punkt, an dem die Kopfzeile anfaengt, gegen sich selbst
 * zu arbeiten.
 *
 * Diese Seite ist trotzdem kein Geheimnis. Sie ist an drei Stellen verlinkt,
 * und zwar an genau den drei Stellen, an denen jemand den Gedanken haben
 * koennte:
 *   - Fusszeile, Spalte „Unternehmen"
 *   - Einladungs-Band am Ende von /for-teachers
 *   - „So geht es weiter" auf /meet
 * Sie steht ausserdem in der Sitemap und ist indexierbar.
 *
 * Die Reihenfolge der Sektionen ist die Argumentation: Einladung, was es
 * konkret heisst, fuer wen es gilt – und erst dann das Formular. Wer bis
 * dorthin gelesen hat, weiss, worauf er sich einlaesst.
 */
export default function MitgestaltenPage() {
  return (
    <>
      <CoCreateIntro />
      <Reveal>
        <WhatItMeans />
      </Reveal>
      <Reveal>
        <WhoFor />
      </Reveal>
      <Reveal>
        <CoCreateForm />
      </Reveal>
    </>
  );
}
