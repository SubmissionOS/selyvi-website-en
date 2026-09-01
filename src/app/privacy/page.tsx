import type { Metadata } from "next";

import { PRODUCT_NAME } from "@/config/brand";
import { PRIVACY_APPROVED, PRIVACY_TRANSLATION_NOTE, imprint } from "@/config/legal";
import { pageMetadata } from "@/config/seo";

/**
 * Privacy policy – ENGLISCHE FASSUNG.
 *
 * ==========================================================================
 * ANWALTSPRUEFUNG AUSSTEHEND
 * ==========================================================================
 * Dieser Text ist die UEBERSETZUNG der vorlaeufigen deutschen
 * Datenschutzerklaerung von selyvi.de. Weder das deutsche Original noch diese
 * Uebersetzung sind anwaltlich geprueft. `PRIVACY_APPROVED` steht deshalb auf
 * false: noindex, kein Sitemap-Eintrag, sichtbare Pruefungs-Zeile.
 *
 * Massgeblich ist die deutsche Fassung – das sagt PRIVACY_TRANSLATION_NOTE
 * oben auf der Seite, und zwar sichtbar und nicht im Kleingedruckten.
 *
 * Der Punkt steht in der NACH-LAUNCH-LISTE der README: „EN-Rechtstexte vom
 * Anwalt pruefen lassen." Ohne diese Pruefung geht selyvi.com nicht live.
 *
 * ==========================================================================
 * STRENGER SCOPE: Hier steht ausschliesslich, was DIESE WEBSITE tut.
 * ==========================================================================
 *
 * Jede Aussage ist im Repository belegbar:
 *   - Formularfelder: src/lib/demo/schema.ts (DEMO_FIELDS)
 *   - Versand ueber Brevo: src/lib/demo/brevo.ts
 *   - Schriften lokal: src/app/layout.tsx (next/font)
 *   - keine Cookies/Analyse: kein entsprechender Code im Projekt
 *
 * NICHTS ueber das Produkt Selyvi, nichts ueber KI-Verarbeitung, nichts ueber
 * Schuelerdaten, nichts ueber kuenftige Funktionen. Diese Website verarbeitet
 * davon nichts – eine Datenschutzerklaerung, die mehr beschreibt als
 * stattfindet, dokumentiert einen Verstoss statt ihn zu vermeiden.
 *
 * Der Verantwortliche wird aus src/config/legal.ts gelesen – eine Quelle mit
 * dem Legal notice, damit beide nicht auseinanderlaufen koennen.
 *
 * ==========================================================================
 * DEUTSCHE EIGENNAMEN TRAGEN lang="de"
 * ==========================================================================
 * Anschriften, Firmierungen und der Name der Aufsichtsbehoerde bleiben
 * DEUTSCH – uebersetzt waeren sie nicht mehr auffindbar, und eine
 * Aufsichtsbehoerde muss man anschreiben koennen. Sie stehen deshalb in
 * <span lang="de">. Das ist WCAG 3.1.2 (Language of Parts): Ein Screenreader
 * schaltet dort auf deutsche Aussprache um, statt „Köpenicker" englisch zu
 * buchstabieren.
 *
 * Dasselbe Attribut ist die Marke, an der scripts/german-check.mjs erkennt,
 * dass dieser Text nicht englisch sein soll. Wer eine deutsche Zeile ohne
 * lang="de" einfuegt, laesst den Deutsch-Detektor ausschlagen – und das ist
 * die Absicht.
 */
export const metadata: Metadata = pageMetadata("/privacy");

/** Stand der Erklärung. Bei jeder inhaltlichen Änderung mitziehen. */
const LAST_UPDATED = "20 August 2026";

export default function PrivacyPage() {
  return (
    <section aria-labelledby="privacy-title">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="privacy-title"
          className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Privacy policy
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          This policy describes which data is processed when you visit this website. It
          applies to the website – not to the {PRODUCT_NAME} application.
        </p>

        {/* Der Uebersetzungshinweis steht VOR der Pruefungs-Zeile: Welche
            Fassung gilt, ist die erste Frage; ob sie geprueft ist, die
            zweite. */}
        <p className="mt-6 max-w-2xl border-l-2 border-gray-200 pl-4 text-sm text-gray-500">
          {PRIVACY_TRANSLATION_NOTE}
        </p>

        {!PRIVACY_APPROVED ? (
          <p className="mt-4 max-w-2xl border-l-2 border-brand-600 pl-4 text-sm text-gray-500">
            This policy is undergoing legal review.
          </p>
        ) : null}

        <div className="mt-14 max-w-3xl space-y-12">
          {/* 1 */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-ink">1. Controller</h2>
            <p className="mt-4 text-gray-500">
              The controller for the data processing on this website is:
            </p>
            <p className="mt-4 text-ink">
              {imprint.companyName}
              <br />
              <span lang="de">{imprint.street}</span>
              <br />
              <span lang="de">{imprint.zipCity}</span>
              <br />
              {imprint.country}
            </p>
            <p className="mt-4 text-gray-500">
              Telephone: {imprint.phone}
              <br />
              Email: {imprint.email}
            </p>
          </div>

          {/* 2 */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-ink">2. Hosting</h2>
            <p className="mt-4 text-gray-500">
              This website is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
              91789, USA. Frankfurt am Main (fra1) is selected as the server region; page
              content is delivered from that region.
            </p>
            <p className="mt-4 text-gray-500">
              Vercel is a provider based in the USA. Even with a European server region,
              access from a third country cannot be ruled out in every case. The
              processing takes place on the basis of the EU standard contractual clauses
              within Vercel’s data processing agreement.
            </p>
          </div>

          {/* 3 */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-ink">3. Server log files</h2>
            <p className="mt-4 text-gray-500">
              When this website is accessed, access data transmitted by your browser is
              processed automatically. This includes in particular the address requested,
              the date and time of access, the browser type and version, the operating
              system, the volume of data transferred and the IP address.
            </p>
            <p className="mt-4 text-gray-500">
              This processing is technically necessary in order to deliver the website and
              to keep it running securely. The legal basis is Article 6(1)(f) GDPR; our
              legitimate interest lies in the stable and secure operation of the website.
              This data is not combined with other data sources.
            </p>
          </div>

          {/* 4 */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-ink">
              4. Request and contact form
            </h2>
            <p className="mt-4 text-gray-500">
              When you submit the request form – on “Meet Selyvi” or on “Co-create” – we
              process the data you enter in order to handle your request and to get in
              touch with you.
            </p>
            <p className="mt-4 text-gray-500">The following is processed:</p>
            <ul className="mt-3 space-y-2 text-gray-500">
              <li>Name (required)</li>
              <li>School (required)</li>
              <li>Work email address (required)</li>
              <li>Role (optional)</li>
              <li>Message (optional)</li>
              <li>Your consent to the processing of this information</li>
              <li>
                Origin information for the request: the page you were on, the referring
                page and – where present in the address bar – campaign parameters
                (utm_source, utm_medium, utm_campaign)
              </li>
            </ul>
            <p className="mt-4 text-gray-500">
              We read the origin information once, when the form is displayed, from the
              page already loaded. It is transmitted only together with a submitted
              request. No cookie is set for this, no identifier is issued and nothing is
              stored beyond this one request; from the referring page we keep only the
              address and path, not its search parameters.
            </p>
            <p className="mt-4 text-gray-500">
              The form message is sent to us via{" "}
              <span lang="de">
                Sendinblue GmbH (brand: Brevo), Köpenicker Straße 126, 10179 Berlin,
                Germany
              </span>
              , as a processor on the basis of a data processing agreement under Article
              28 GDPR.
            </p>
            <p className="mt-4 text-gray-500">
              The legal basis is Article 6(1)(b) GDPR where the request is directed at
              entering into or performing a contract, and otherwise Article 6(1)(f) GDPR
              on the basis of our legitimate interest in answering enquiries.
            </p>
            <p className="mt-4 text-gray-500">
              We additionally store your request in our own customer system, in order to
              process it and to be able to follow what happens next. The servers used for
              this are located in the European Union. There is no use for advertising
              purposes, and no newsletter is connected to it.
            </p>
            <p className="mt-4 text-gray-500">
              We keep your request for as long as is necessary to deal with it, and delete
              it afterwards.
            </p>
          </div>

          {/* 5 */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-ink">
              5. No cookies, no tracking
            </h2>
            <p className="mt-4 text-gray-500">
              This website sets no cookies. There is no reach measurement, no web analytics
              and no tracking. No analytics, advertising or social media services are
              embedded.
            </p>
            <p className="mt-4 text-gray-500">
              The fonts used are delivered with the website and loaded locally. Opening the
              page therefore creates no connection to Google servers or other font
              providers.
            </p>
            <p className="mt-4 text-gray-500">
              The origin information accompanying a submitted form request (section 4) is
              unaffected by this: it arises solely on submission, without a cookie and
              without an identifier, and allows no recognition on a later visit.
            </p>
            <p className="mt-4 text-gray-500">
              That is also why no cookie banner appears on this website: there is nothing
              for which we would have to obtain your consent.
            </p>
          </div>

          {/* 6 */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-ink">
              6. Your rights as a data subject
            </h2>
            <p className="mt-4 text-gray-500">
              You have the following rights in relation to the controller:
            </p>
            <ul className="mt-3 space-y-2 text-gray-500">
              <li>Access to the data processed (Article 15 GDPR)</li>
              <li>Rectification of inaccurate data (Article 16 GDPR)</li>
              <li>Erasure (Article 17 GDPR)</li>
              <li>Restriction of processing (Article 18 GDPR)</li>
              <li>Data portability (Article 20 GDPR)</li>
              <li>Objection to the processing (Article 21 GDPR)</li>
            </ul>
            <p className="mt-4 text-gray-500">
              A message to {imprint.email} is enough to exercise them. If you have given
              consent, you can withdraw it at any time with effect for the future.
            </p>
          </div>

          {/* 7 */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-ink">
              7. Right to lodge a complaint with a supervisory authority
            </h2>
            <p className="mt-4 text-gray-500">
              You have the right to lodge a complaint with a data protection supervisory
              authority about the processing of your personal data. The authority
              responsible for the controller’s registered seat is the State Commissioner
              for Data Protection and Freedom of Information of{" "}
              <span lang="de">Baden-Württemberg</span>:
            </p>
            {/* Name und Anschrift der Behoerde bleiben deutsch: Wer sich
                beschweren will, muss sie so anschreiben koennen. */}
            <p className="mt-4 text-ink" lang="de">
              Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Baden-Württemberg
              <br />
              Lautenschlagerstraße 20
              <br />
              70173 Stuttgart
            </p>
          </div>

          {/* 8 */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-ink">8. Status of this policy</h2>
            <p className="mt-4 text-gray-500">Last updated: {LAST_UPDATED}</p>
            <p className="mt-4 text-gray-500">
              This policy is undergoing legal review. {PRIVACY_TRANSLATION_NOTE}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
