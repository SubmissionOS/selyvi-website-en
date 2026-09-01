import { FlaskConical, MessageSquareQuote, Unlock } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 2 – Was Mitgestalten heisst.
 *
 * ==========================================================================
 * KEINE KOSTENAUSSAGE. DAS IST ABSICHT UND KEIN VERGESSEN.
 * ==========================================================================
 * Vorgesehen war fuer die erste Karte „you use Selyvi free of charge in your
 * class". Die Konditionen des Pilotkreises sind aber nicht bestaetigt, und
 * der Produktstand sagt zu Preisen nur: „Preise werden aktuell mit
 * Pilotschulen festgelegt" – auf Englisch „prices are currently being set with
 * pilot schools". Eine Kostenzusage waere damit die einzige
 * ungedeckte Aussage auf dieser Seite – ausgerechnet auf der Seite, die um
 * Vertrauen bittet.
 *
 * Sie steht deshalb NICHT hier, sondern als offener Punkt in der
 * NACH-LAUNCH-LISTE der README. Sobald das Team die Konditionen bestaetigt
 * hat, gehoert der Satz in die erste Karte – und nicht vorher.
 *
 * Ein sichtbarer [PRÜFEN]-Marker waere die Alternative gewesen. Dagegen
 * spricht die README: Die Website enthaelt aktuell keinen einzigen sichtbaren
 * Platzhalter, und jeder Marker ist dort als Launch-Blocker gefuehrt.
 */
const points = [
  {
    icon: FlaskConical,
    title: "Trying it out in real everyday work",
    description: `${PRODUCT_NAME} runs in your own class, during the school year – not in a test environment, but where it shows whether it holds up.`,
  },
  {
    icon: MessageSquareQuote,
    title: "Being heard",
    /**
     * „Landen beim Team" ist durch den Produktstand gedeckt („Feedback aus
     * dem Feld — Live: Rueckmeldungen aus der App landen gesammelt im
     * Admin-Bereich"). Die Geschwindigkeit ist bewusst auf KLEINE Aenderungen
     * begrenzt – „oft in derselben Woche im Produkt" ohne diese Grenze waere
     * ein Versprechen, das eine groessere Anfrage sofort bricht.
     */
    description:
      "Your feedback does not land in a ticket system but with the team. Small things are often in the product the same week.",
  },
  {
    icon: Unlock,
    title: "Nothing to sell",
    description:
      "Co-creating commits you to nothing: no contract, no pressure to buy. You can stop at any time, without giving a reason.",
  },
];

export function WhatItMeans() {
  return (
    <section aria-labelledby="mitgestalten-heisst-titel" className="bg-surface-alt">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h2
          id="mitgestalten-heisst-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          What co-creating means
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {points.map((point) => (
            <li
              key={point.title}
              className="rounded-xl border border-gray-200 bg-surface p-6"
            >
              <point.icon
                aria-hidden="true"
                className="size-6 text-brand-600"
                strokeWidth={1.75}
              />
              <h3 className="mt-4 text-base font-semibold text-ink">{point.title}</h3>
              <p className="mt-3 text-sm text-gray-500">{point.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
