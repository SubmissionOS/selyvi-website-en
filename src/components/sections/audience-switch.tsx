import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 3 – Zielgruppen-Weiche.
 *
 * Steht direkt nach der Trust-Zeile und vor „What changes day to day“. Die
 * Position ist der ganze Zweck: Wer mit einer klaren Rolle im Kopf kommt –
 * Schulleitung, Forschende – soll seinen Weg finden, bevor die Seite anfaengt,
 * einen Schultag zu erzaehlen. Wer weiterscrollt, bekommt die Geschichte
 * unveraendert.
 *
 * Bewusste Entscheidungen:
 *   - KEINE --cta-Farbe. Die gehoert exklusiv dem Demo-Button; drei bunte
 *     Karten direkt unter dem Hero wuerden ihn entwerten.
 *   - Keine Ueberschrift. Eine H2 „Where would you like to go?“ waere eine Frage an
 *     Leserinnen, die gerade erst angekommen sind. Die Sektion traegt
 *     stattdessen ein aria-label – dieselbe Loesung wie in <TrustBar />.
 *   - Die Kartentitel sind <span>, keine Ueberschriften: Es sind drei Wege,
 *     keine drei Inhaltsabschnitte. Eine Ueberschriftenebene hier wuerde die
 *     Gliederung der Startseite verwaessern – und weil der Hero die einzige H1
 *     traegt, muesste sie H2 sein und stuende dann gleichrangig neben
 *     „What changes day to day“.
 *   - Die Selbstauswahl in der ERSTEN PERSON („I teach“, „I lead a school“) ist
 *     nach Regel A ausdruecklich erlaubt: Dort waehlt der Leser, wir schreiben
 *     ihm nichts zu.
 *   - Alle drei sind gleich gross und gleich gestaltet. Sobald eine Karte
 *     hervorgehoben waere, waere es keine Weiche mehr, sondern eine Empfehlung.
 */
const audiences = [
  {
    title: "I teach",
    description: `What ${PRODUCT_NAME} takes off your hands on an ordinary Tuesday.`,
    href: "/for-teachers",
  },
  {
    title: "I lead a school",
    description:
      "What lightens the load for your staff — and what you can put in front of your school authority.",
    href: "/for-school-leadership",
  },
  {
    title: "I do research",
    description: "What we want to find out together: which parts of the job actually get lighter.",
    href: "/research",
  },
];

export function AudienceSwitch() {
  return (
    <section aria-label="Paths by audience" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <ul className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {audiences.map((audience) => (
            <li key={audience.href}>
              {/* Die ganze Karte ist der Link – nicht nur der Titel. Ein
                  Ziel von 6 rem Hoehe trifft man auch am Tablet zuverlaessig.
                  Der Fokusring kommt aus globals.css und gilt fuer :focus-visible,
                  erscheint also bei Tastaturbedienung und nicht beim Klick. */}
              <Link
                href={audience.href}
                className="flex h-full flex-col rounded-xl border border-gray-200 bg-surface p-6 transition-colors hover:border-brand-600"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="text-base font-semibold text-ink">
                    {audience.title}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-brand-600"
                  />
                </span>

                <span className="mt-2 text-sm text-gray-500">{audience.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
