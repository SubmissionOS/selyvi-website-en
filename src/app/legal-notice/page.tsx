import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { ImprintDetails } from "@/components/sections/legal/imprint-details";

/**
 * Legal notice – die englische Fassung des Impressums.
 *
 * DIE PFLICHTANGABEN SIND IDENTISCH mit der deutschen Seite: Anbieter,
 * Anschrift, Kontakt, Umsatzsteuer-ID und der Verantwortliche nach § 18 Abs. 2
 * MStV. Uebersetzt sind ausschliesslich die Beschriftungen und die vier
 * Rechtstexte am Ende.
 *
 * TRANSLATION_NOTE steht als erste Zeile der Seite: „German law applies; this
 * is a translation of the German legal notice." Ohne diesen Satz koennte die
 * Seite den Eindruck erwecken, hier gaebe es eine eigene, englischsprachige
 * Rechtslage – die gibt es nicht.
 *
 * Die englische Fassung ist ANWALTLICH NICHT GEPRUEFT. Der Punkt steht in der
 * NACH-LAUNCH-LISTE der README.
 *
 * Die Angaben in src/config/legal.ts sind echt. `IMPRINT_READY` steht deshalb
 * auf true: kein noindex, kein Entwurfs-Balken, wieder in der Sitemap.
 *
 * Offen bleibt allein die Vorläufigkeit der Betreiberangabe – Selyvi wird
 * derzeit als Angebot eines Einzelunternehmens geführt. Der Hinweis dazu steht
 * als Transparenz-Zeile oben auf der Seite, nicht als Balken über allem: Er
 * stellt die Richtigkeit der Angaben nicht infrage, sondern nur ihre Dauer.
 *
 * KEIN Registereintrag – Einzelunternehmen ohne Kaufmannseigenschaft sind
 * nicht eingetragen. Die Rubrik fehlt ganz, statt leer dazustehen.
 */
export const metadata: Metadata = pageMetadata("/legal-notice");

export default function LegalNoticePage() {
  return (
    <section aria-labelledby="legal-notice-title">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="legal-notice-title"
          className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Legal notice
        </h1>

        <ImprintDetails />
      </div>
    </section>
  );
}
