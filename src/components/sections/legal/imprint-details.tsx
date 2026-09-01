import type { ReactNode } from "react";

import { PRODUCT_NAME } from "@/config/brand";
import { IMPRINT_LANGUAGE_NOTE, imprint, imprintTextSections } from "@/config/legal";

/**
 * Strukturierte Darstellung der Impressumsangaben – DEUTSCH.
 *
 * ==========================================================================
 * BESCHRIFTUNGEN UND FLIESSTEXT SIND DEUTSCH, UND ZWAR ABSICHTLICH
 * ==========================================================================
 * Diese Komponente war zwischenzeitlich uebersetzt („Provider", „Street",
 * „Liability for content"). Das ist zurueckgenommen: Die Angaben nach § 5 DDG
 * und § 18 Abs. 2 MStV sind die Pflichtangaben eines deutschen Unternehmens
 * und gelten im deutschen Wortlaut. Zwei Sprachfassungen derselben
 * Haftungsklausel sind zwei Klauseln.
 *
 * Der EINE englische Satz steht ganz oben (IMPRINT_LANGUAGE_NOTE) und traegt
 * `lang="en"` – er ist die Ausnahme in einer deutschen Seite, nicht umgekehrt.
 * Die umschliessende Sektion in page.tsx traegt `lang="de"`.
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
function Row({ label, value }: { label: string; value: string }) {
  if (value.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-6">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-ink sm:col-span-2">{value}</dd>
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
      {/* ==================================================================
          DER EINE ENGLISCHE SATZ – ganz oben, vor allem anderen.
          ==================================================================
          Wer auf einer englischen Website eine deutsche Seite oeffnet, soll
          den Grund lesen, bevor er sich fragt, ob er falsch abgebogen ist.

          `lang="en"` ist hier keine Formalie: Die umschliessende Sektion ist
          als deutsch ausgezeichnet, ein Screenreader spraeche diesen Satz
          sonst mit deutscher Aussprache. */}
      <p
        lang="en"
        className="border-l-2 border-brand-600 pl-4 text-sm text-gray-500"
      >
        {IMPRINT_LANGUAGE_NOTE}
      </p>

      {/* Transparenz-Zeile: wer hinter dem Angebot steht, bevor die Felder
          kommen. Die Angabe ist heute richtig; dass sie sich nach einer
          Gruendung aendert, steht als OPERATOR_NOTE im Quelltext von legal.ts
          und im README – nicht auf der Seite. */}
      <div className="rounded-xl border border-gray-200 bg-surface-alt p-6">
        <p className="text-ink">
          {PRODUCT_NAME} ist ein Angebot von Rafael Gutmann (GuddiWeb).
        </p>
      </div>

      <Block title="Angaben gemäß § 5 DDG">
        <dl className="divide-y divide-gray-200">
          <Row label="Anbieter" value={imprint.companyName} />
          <Row label="Straße" value={imprint.street} />
          <Row label="PLZ und Ort" value={imprint.zipCity} />
          <Row label="Land" value={imprint.country} />
        </dl>
      </Block>

      <Block title="Kontakt">
        <dl className="divide-y divide-gray-200">
          <Row label="Telefon" value={imprint.phone} />
          <Row label="E-Mail" value={imprint.email} />
        </dl>
      </Block>

      <Block title="Umsatzsteuer-ID">
        <p className="text-gray-500">
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        </p>
        <p className="mt-2 text-ink">{imprint.vatId}</p>
      </Block>

      <Block title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p className="text-ink">{imprint.contentResponsible}</p>
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
