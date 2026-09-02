import { PRODUCT_NAME } from "@/config/brand";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";

/**
 * Sektion 6 – FAQ für Schulleitungen.
 *
 * Andere Fragen als auf der Startseite, gleiche Darstellung (FaqAccordion).
 * Die Preisantwort ist wortgleich mit der Startseite – zwei unterschiedliche
 * Formulierungen zur selben Frage laden zu Missverstaendnissen ein.
 */
const faqItems: FaqItem[] = [
  {
    question: `What does ${PRODUCT_NAME} cost for our school?`,
    // Wortgleich mit der Startseiten-FAQ – siehe dort die Begründung.
    answer:
      "We discuss the price in the first conversation – together with the scope your school needs.",
  },
  {
    question: "Do the staff council and the data protection officer need to be involved?",
    answer:
      "We recommend it. Software that processes personal data of teachers and pupils touches the remit of both, and it is easier to involve them early than to explain it later.",
  },
];

export function LeadershipFaq() {
  return (
    <section
      aria-labelledby="schulleitung-faq-titel"
      className="border-b border-gray-200"
    >
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
                id="schulleitung-faq-titel"
                className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Questions from school leadership
              </h2>
            </div>
          </div>

          <div className="lg:col-span-8">
            <FaqAccordion items={faqItems} idPrefix="schulleitung-faq" />
          </div>
        </div>
      </div>
    </section>
  );
}
