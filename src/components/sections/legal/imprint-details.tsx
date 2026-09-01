import type { ReactNode } from "react";

import { PRODUCT_NAME } from "@/config/brand";
import { TRANSLATION_NOTE, imprint, imprintTextSections } from "@/config/legal";

/**
 * Strukturierte Darstellung der Impressumsangaben („Legal notice").
 *
 * DIE PFLICHTANGABEN SIND IDENTISCH MIT DER DEUTSCHEN SEITE – uebersetzt sind
 * die Beschriftungen, nicht die Angaben. Die Paragrafenverweise bleiben
 * deutsch, weil sie deutsche Normen bezeichnen; beim ersten Vorkommen steht
 * die Einordnung in Klammern dabei.
 *
 * Der Uebersetzungshinweis (TRANSLATION_NOTE) steht als erste Zeile der Seite:
 * Es gilt deutsches Recht, und diese Seite ist eine Uebersetzung.
 *
 * Die Werte kommen aus src/config/legal.ts und sind echt. Die Transparenz-Zeile
 * oben nennt den Betreiber, bevor die Felder kommen.
 *
 * Auszeichnung als <dl>: Bezeichnung und Wert gehoeren zusammen, und
 * Screenreader koennen die Paare als solche ausgeben.
 *
 * KEIN Registereintrag: Einzelunternehmen ohne Kaufmannseigenschaft sind nicht
 * eingetragen. Die Rubrik fehlt deshalb ganz, statt leer dazustehen.
 */
/**
 * @param lang Sprache des WERTES, wenn er nicht englisch ist.
 *
 * Anschrift und Firmierung bleiben deutsch – uebersetzt waeren sie nicht mehr
 * auffindbar. Sie bekommen deshalb lang="de": WCAG 3.1.2 (Language of Parts),
 * damit ein Screenreader „Hauptstraße" deutsch ausspricht statt englisch zu
 * buchstabieren. Dasselbe Attribut sagt scripts/german-check.mjs, dass dieser
 * Wert nicht englisch sein soll.
 */
function Row({
  label,
  value,
  lang,
}: {
  label: string;
  value: string;
  lang?: string;
}) {
  if (value.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-6">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-ink sm:col-span-2" lang={lang}>
        {value}
      </dd>
    </div>
  );
}

/**
 * Bewusst ein <div> und keine <section>: Zusaetzliche Landmarks auf einer
 * Seite dieser Laenge wuerden die Landmark-Navigation eher verstopfen als
 * helfen. Die Gliederung traegt die Ueberschriften-Hierarchie.
 */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-gray-200 pt-8">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function ImprintDetails() {
  return (
    <div className="mt-12 max-w-3xl space-y-12">
      {/* Transparenz-Zeile: wer hinter dem Angebot steht, bevor die Felder
          kommen. Die Angabe ist heute richtig; dass sie sich nach einer
          Gruendung aendert, steht als OPERATOR_NOTE im Quelltext von legal.ts
          und im README – nicht auf der Seite. */}
      <div className="rounded-xl border border-gray-200 bg-surface-alt p-6">
        <p className="text-ink">
          {PRODUCT_NAME} is an offering of Rafael Gutmann (GuddiWeb).
        </p>

        {/* Welche Fassung gilt – sichtbar, nicht im Kleingedruckten. */}
        <p className="mt-3 text-sm text-gray-500">{TRANSLATION_NOTE}</p>
      </div>

      <Block title="Information required under § 5 DDG (German Digital Services Act)">
        <dl className="divide-y divide-gray-200">
          <Row label="Provider" value={imprint.companyName} />
          <Row label="Street" value={imprint.street} lang="de" />
          <Row label="Postcode and town" value={imprint.zipCity} lang="de" />
          <Row label="Country" value={imprint.country} />
        </dl>
      </Block>

      <Block title="Contact">
        <dl className="divide-y divide-gray-200">
          <Row label="Telephone" value={imprint.phone} />
          <Row label="Email" value={imprint.email} />
        </dl>
      </Block>

      <Block title="VAT identification number">
        <p className="text-gray-500">
          VAT identification number under § 27 a of the German VAT Act
          (Umsatzsteuergesetz):
        </p>
        <p className="mt-2 text-ink">{imprint.vatId}</p>
      </Block>

      <Block title="Responsible for the content under § 18 (2) MStV (German State Media Treaty)">
        {/* Ladungsfaehige Anschrift – bleibt deutsch, siehe Row(). */}
        <p className="text-ink" lang="de">
          {imprint.contentResponsible}
        </p>
      </Block>

      {imprintTextSections.map((section) => (
        <Block key={section.title} title={section.title}>
          <div className="space-y-4">
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-gray-500">
                {paragraph}
              </p>
            ))}
          </div>
        </Block>
      ))}
    </div>
  );
}
