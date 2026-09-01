import type { Metadata } from "next";

import { pageMetadata } from "@/config/seo";
import { ImprintDetails } from "@/components/sections/legal/imprint-details";

/**
 * Impressum – DEUTSCH, auch auf der englischen Website.
 *
 * ==========================================================================
 * WARUM DIESE SEITE NICHT ÜBERSETZT IST
 * ==========================================================================
 * Sie hiess zwischenzeitlich /legal-notice und war uebersetzt. Das ist
 * zurueckgenommen.
 *
 * Die Pflichtangaben nach § 5 DDG und § 18 Abs. 2 MStV sind die Angaben eines
 * deutschen Unternehmens. Sie gelten im deutschen Wortlaut – eine englische
 * Fassung daneben ist im besten Fall ueberfluessig und im schlechtesten die
 * Version, auf die sich im Zweifel jemand beruft. Eine Haftungsklausel, die in
 * zwei Sprachen existiert, existiert zweimal.
 *
 * Uebrig bleibt genau EIN englischer Satz: IMPRINT_LANGUAGE_NOTE, ganz oben.
 * Er erklaert einer englischen Leserin, warum die Seite darunter deutsch ist,
 * und beansprucht selbst keine Rechtswirkung.
 *
 * /legal-notice leitet mit 308 hierher (next.config.ts).
 *
 * DER DEUTSCH-DETEKTOR ÜBERSPRINGT DIESE SEITE VOLLSTAENDIG. Das ist keine
 * Wortausnahme, sondern eine Seitenausnahme, und sie steht als solche in
 * scripts/german-check.mjs. Eine Seite, die deutsch sein SOLL, mit einer
 * wachsenden Liste erlaubter Woerter durchzuwinken, waere die Bauweise, bei
 * der irgendwann versehentlich auch anderswo Deutsch durchrutscht.
 *
 * /privacy bleibt englisch – sie ist eine Auskunft an die Leserin, nicht eine
 * Pflichtangabe gegenueber einer Behoerde.
 *
 * ==========================================================================
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
export const metadata: Metadata = pageMetadata("/impressum");

export default function ImpressumPage() {
  return (
    // lang="de" auf der Sektion: Die ganze Seite ist deutsch, und ein
    // Screenreader soll sie deutsch aussprechen statt „Umsatzsteuer-
    // Identifikationsnummer" englisch zu buchstabieren. WCAG 3.1.2.
    // Der eine englische Satz darin traegt sein eigenes lang="en".
    <section aria-labelledby="impressum-titel" lang="de">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="impressum-titel"
          className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Impressum
        </h1>

        <ImprintDetails />
      </div>
    </section>
  );
}
