import Link from "next/link";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion – Unterrichtsqualität.
 *
 * Steht direkt nach dem Entlastungsbericht und beantwortet die Frage, die er
 * aufwirft: Wofür eigentlich? Eingesparte Stunden sind kein Zweck, sie sind
 * ein Mittel.
 *
 * ==========================================================================
 * DREI WORTLAUT-SPERREN – NICHT AUFWEICHEN
 * ==========================================================================
 *   1. Kein „demonstrably" oder „measurably increased". Gemessene
 *      Qualitaetssteigerungen gibt es NICHT. Der Produktstand fuehrt die
 *      Wirkungsmessung als Erhebungsmodell, nicht als Ergebnis – und die
 *      Wirkungszeile im Produkt weist jede Zahl als Messwert oder als
 *      Schaetzwert aus.
 *   2. Kein „school quality rises" als Tatsachenbehauptung. Der Text sagt,
 *      dass wir MESSEN – er nennt kein Ergebnis. Frueher stand hier „behaupten
 *      wir nicht"; das war eine Selbstauskunft ueber Unwissen und faellt unter
 *      CLAUDE.md, Regel B.
 *   3. Kein „accesses the curricula". Die Lehrplaene liegen erhoben vor,
 *      sind aus Lizenzgruenden aber bewusst nicht angebunden. „Guided by" ist
 *      das staerkste zulaessige Verb – dieselbe Sperre wie im Hero und in
 *      „Selyvi keeps learning."
 *
 * BEWUSST OHNE SZENE UND OHNE KENNZAHL. Die Seite sollte in derselben Runde
 * kuerzer werden; eine Sektion, die genau das unterlaeuft, waere ein
 * Eigentor. Der Abschluss ist ein Textlink, kein Knopf: Wer wissen will, wie
 * gemessen wird, liest weiter – wer nicht, scrollt.
 */
export function TeachingQuality() {
  return (
    <section
      aria-labelledby="unterrichtsqualitaet-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <h2
            id="unterrichtsqualitaet-titel"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Relief is not the point. Teaching is.
          </h2>

          <p className="mt-5 text-lg text-gray-500">
            An evening not spent on admin is energy left for the lesson next morning. And
            {PRODUCT_NAME} stays guided by current education standards, so that the time
            you win back goes into teaching that holds up.
          </p>

          <p className="mt-4 text-lg text-ink">
            Whether that reaches the classroom, we measure — from the start, with our
            impact model.
          </p>

          <p className="mt-6">
            <Link
              href="/research"
              className="text-base text-brand-600 underline underline-offset-4"
            >
              How we measure impact
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
