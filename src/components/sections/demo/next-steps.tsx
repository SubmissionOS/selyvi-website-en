import Link from "next/link";
import { Check } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Rechte Spalte der Demo-Seite.
 *
 * Die drei Datenschutz-Punkte sind wortgleich aus den bestehenden Komponenten
 * uebernommen (Trust-Zeile der Startseite, DSGVO-Block, /security).
 * Eine vierte Formulierung derselben Zusagen waere genau die Stelle, an der
 * eine Datenschutzbeauftragte Widersprueche findet.
 */
const steps = [
  {
    title: "Your request",
    description:
      "You describe briefly what it is about. We get in touch to arrange a time.",
  },
  {
    title: "A personal demo",
    description:
      "20 minutes on the real interface. Your questions decide what we show.",
  },
  {
    title: "Pilot conversation",
    description:
      "If it fits, we talk about a pilot phase at your school. With no obligation.",
  },
];

const privacyPoints = [
  // „Server in der EU" stand hier bis zum Abgleich mit dem Produktstand und war
  // fuer das Produkt nicht gedeckt. An dieser Stelle – kurz vor dem Absenden
  // eines Formulars – waere eine ungedeckte Zusage besonders unglücklich.
  "Strict data separation: every teacher sees only their own data",
  "No parent or pupil portal",
  "No sharing of pupil data",
];

export function NextSteps() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold text-ink">What happens next</h2>

        <ol className="mt-6 space-y-6">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                {index + 1}
              </span>
              <div>
                <h3 className="text-base font-medium text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Dritter Einstieg zu /co-create – die Seite hat bewusst keinen
          Navigationspunkt. Sie steht hier, weil manche gar keine Demo wollen,
          sondern mitbauen: Der Hinweis gehoert neben den Ablauf und nicht
          hinter das abgeschickte Formular. */}
      <div className="rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-ink">Rather build along right away?</h2>

        <p className="mt-3 text-sm text-gray-500">
          If you want not just to see {PRODUCT_NAME} but to help develop it, this route
          takes you there more directly.
        </p>

        <Link
          href="/co-create"
          className="mt-4 inline-block text-sm text-brand-600 underline underline-offset-4"
        >
          Co-create {PRODUCT_NAME}
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-surface-alt p-6">
        <h2 className="text-sm font-semibold text-ink">Data protection</h2>

        <ul className="mt-4 space-y-3">
          {privacyPoints.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-brand-600"
              />
              <span className="text-sm text-gray-500">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
