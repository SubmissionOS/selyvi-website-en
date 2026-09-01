import Link from "next/link";

import { PRODUCT_NAME } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";

/**
 * Sektion 6 – FAQ für Forschende.
 *
 * Dieselbe Darstellung wie auf Startseite und /for-school-leadership (FaqAccordion), andere
 * Fragen: Es sind die vier, die in Anfragen aus Hochschulen tatsaechlich
 * kommen – und die dritte ist die, an der eine unehrliche Antwort die ganze
 * Seite entwerten wuerde.
 *
 * Zwei Dinge werden hier bewusst NICHT zugesagt, obwohl beide naheliegen und
 * beide gefragt werden:
 *   - kein Datum fuer den Forschungszugang. Die juristische Pruefung laeuft;
 *     ein genanntes Quartal waere geraten.
 *   - keine Zusage zu Ko-Autorenschaft, Publikationsrechten oder exklusivem
 *     Datenzugang. Darueber entscheidet niemand vor dem ersten Gespraech.
 *
 * Die zweite Antwort nennt bewusst KEINE feste Liste von drei Formen mehr.
 * Drei Kaestchen laden dazu ein, sich in keinem wiederzufinden – und die
 * Formen haengen ohnehin an der Fragestellung. Statt der Aufzaehlung steht
 * dort jetzt der naechste Schritt.
 */
const faqItems: FaqItem[] = [
  {
    question: `Welchen Bezug hat ${PRODUCT_NAME} zu meiner Forschung?`,
    answer: `${PRODUCT_NAME} wird im laufenden Schulalltag benutzt – nicht in einer Erhebungssituation. Wenn Sie zu Unterricht, Vorbereitungspraxis oder der Arbeitsbelastung von Lehrkräften forschen, ist das ein Feldzugang, den es sonst selten gibt. Was sich daraus erheben lässt, legen wir gemeinsam fest – und genau darüber würden wir mit Ihnen sprechen wollen.`,
  },
  {
    question: "What can a collaboration look like?",
    answer:
      "From accompanying a pilot through co-designing the survey instruments to joint analyses once released – the forms are as varied as the questions. A short conversation settles it fastest. Publications, authorship and access we agree there together – in writing, before any data flows.",
  },
  {
    question: "Which impact model do you work with?",
    answer:
      "With a survey model along the PHINEO impact staircase: input, output, outcome, impact. Data is collected across three survey waves, consent is granular by purpose, the analysis follows a codebook fixed in advance, and values are only reported above a minimum case count. Model version, chains of assumptions and open methodological gaps are documented – the gaps included.",
  },
];

export function ResearchFaq() {
  return (
    <section aria-labelledby="forschung-faq-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        {/* Zweispaltig ab lg: Überschrift links, Antworten rechts.
            Vorher stand hier ein 672 px breiter Fragenstapel in einem
            1088 px breiten Container – die halbe Bildschirmbreite blieb
            leer. Die Überschrift klebt beim Scrollen, damit auch weit
            unten in der Liste noch dasteht, welche Fragen das sind. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h2
                id="forschung-faq-titel"
                className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Questions from research
              </h2>
            </div>
          </div>

          <div className="lg:col-span-8">
            <FaqAccordion items={faqItems} idPrefix="forschung-faq" />
          </div>
        </div>

        {/* Der naechste Schritt steht ausserhalb des Accordions: Wer die
            Antwort zur Zusammenarbeit gelesen hat, hat sie wieder zugeklappt,
            bevor er handelt. Als Link und nicht als --cta-Knopf – die Farbe
            gehoert dem Kopfzeilen-Aufruf. */}
        <div className="mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/meet">Arrange to meet</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
