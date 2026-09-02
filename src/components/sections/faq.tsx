import { PRODUCT_NAME, SCHOOL_TYPE_ANSWER } from "@/config/brand";
import { DATA_SEPARATION_NOTE } from "@/config/product";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";

/**
 * Sektion 8 – FAQ (Startseite, Zielgruppe Lehrkraft).
 *
 * Jede Antwort sagt nur, was heute stimmt. Keine erfundenen Zahlen,
 * Schulformen, Preise oder Fristen – und keine Frage, deren Antwort nur eine
 * Ankuendigung waere.
 */
const faqItems: FaqItem[] = [
  {
    question: `What is ${PRODUCT_NAME}?`,
    answer: `${PRODUCT_NAME} is the AI assistant for teachers. You record what you notice in the lesson, typed or dictated. It turns those notes into report comments, parent emails and teaching materials.`,
  },
  {
    // Diese Frage war eine Zeit lang entfernt, weil die Antwort nicht
    // feststand. Sie steht fest – seit dem 2.9.2026 weiter gefasst: alle
    // Schularten und Schulformen, von Klasse 1 bis zum Abitur.
    question: "Which school types is it meant for?",
    // Geteilte Formulierung – Quelle ist src/config/brand.ts.
    answer: SCHOOL_TYPE_ANSWER,
  },
  {
    // Fruehere Antwort: „Über das Rollen- und Rechtekonzept entscheiden wir
    // gerade." Das Modell steht – und zwar restriktiver, als Interessierte
    // erwarten. Genau deshalb gehoert es hierher und nicht ins Kleingedruckte.
    question: "Who sees my class's data?",
    answer: `${DATA_SEPARATION_NOTE} No role has an overall view across several teachers. School leadership sees figures on usage, never a single observation.`,
  },
  {
    question: "Do parents or children need an account?",
    answer: `No. ${PRODUCT_NAME} is a tool for teachers and school leadership. There is deliberately no parent or pupil portal.`,
  },
  {
    // Regel C: „prices are currently being set with pilot schools" sagt in
    // sieben Wörtern, dass es weder Preisliste noch Kundschaft gibt. Der Satz
    // beschreibt jetzt, WIE der Preis zustande kommt.
    // Weiterhin gedeckt: Der Produktstand nennt keinen Preis, und dieser Satz
    // nennt auch keinen – er nennt den Weg zu ihm.
    question: "What does it cost?",
    answer:
      "We settle the price in the first conversation, together with the scope your school needs.",
  },
  {
    question: `Does ${PRODUCT_NAME} replace my assessment?`,
    answer: `No. A suggestion stays a suggestion; the decision stays with the teacher. ${PRODUCT_NAME} deliberately never derives competencies from marks — a mark in German does not tell you whether a child reads fluently.`,
  },
  {
    question: "How do I start?",
    answer:
      "It starts with a conversation. The pilot phase, the data processing agreement, introducing it to your staff — we go through all of that there.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-titel" className="border-t border-gray-200">
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
                id="faq-titel"
                className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Common questions
              </h2>
            </div>
          </div>

          <div className="lg:col-span-8">
            <FaqAccordion items={faqItems} idPrefix="faq" />
          </div>
        </div>
      </div>
    </section>
  );
}
