import Link from "next/link";

import { imprint } from "@/config/legal";
import { Button } from "@/components/ui/button";

/**
 * Sektion 7 – Kontakt. Schliesst die Seite ab.
 *
 * Bewusst NICHT <FinalCta />, obwohl die Komponente vorhanden ist und auf drei
 * anderen Seiten steht: Deren Aufruf richtet sich an
 * jemanden, der eine Kaufentscheidung vorbereitet. Diese Seite bittet um
 * fachliche Gegenrede – der Weg dorthin ist eine E-Mail, nicht ein
 * Terminformular.
 *
 * Das Kennenlernen bleibt als ZWEITER Weg stehen – als schlichter Link, nicht
 * als --cta-Button. Die E-Mail ist hier der primaere Weg: Wer beruflich
 * Forschungsanfragen schreibt, formuliert lieber aus, als ein Formular
 * auszufuellen. Wer schneller sprechen will, nimmt den Link.
 *
 * Die Adresse kommt aus src/config/legal.ts – eine Quelle mit Impressum und
 * Fusszeile, damit nicht drei verschiedene Kontaktadressen entstehen.
 */
export function ResearchContact() {
  return (
    <section aria-labelledby="forschung-kontakt-titel" className="bg-surface-alt">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2
            id="forschung-kontakt-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            We are looking for research partners.
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            For questions about schools, teaching and the work of teachers. Write to us –
            we answer ourselves.
          </p>

          {/* Gegenwart, und produktstand-gedeckt: Konten legt die Schulleitung
              an, eine Selbstregistrierung gibt es bewusst nicht. „Richten wir
              ein" sagt genau das – WIR tun es, nach einem Gespräch. Der Satz
              verspricht keinen Datenexport; der ist nicht gebaut und steht
              deshalb nirgends. */}
          <p className="mt-4 text-lg text-ink">
            Access for your research we set up after we have met.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button asChild variant="outline" size="lg">
              <a href={`mailto:${imprint.email}`}>{imprint.email}</a>
            </Button>

            <Link
              href="/meet"
              className="text-base text-brand-600 underline underline-offset-4"
            >
              Or arrange to meet
            </Link>

            <Link
              href="/preview"
              className="text-base text-brand-600 underline underline-offset-4"
            >
              Try it yourself
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
