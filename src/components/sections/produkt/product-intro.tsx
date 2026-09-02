import { PRODUCT_NAME, SCHOOL_TYPE_ANSWER } from "@/config/brand";

/**
 * Sektion 1 – Intro.
 *
 * Schmaler Einstieg ohne Bild und ohne CTA: Der Handlungsaufruf steht bewusst
 * erst am Seitenende, damit die Seite zuerst erklaert und dann fragt.
 *
 * Die H1 benennt den Kreislauf, um den herum das Produkt gebaut ist: Was
 * waehrend des Unterrichts erfasst wird, wird zum Zeugnistext und zum Material.
 *
 * Der zweite Absatz sagt ausdruecklich, dass hier nur Vorhandenes steht. Das
 * ist keine Floskel, sondern die Zusage, an der die Seite gemessen werden
 * darf. Sie gilt inzwischen fuer die GANZE Seite: Die Sektion „In Arbeit"
 * darunter gibt es nicht mehr (CLAUDE.md, Regel D).
 */
export function ProductIntro() {
  return (
    <section aria-labelledby="produkt-intro-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="produkt-intro-titel"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Your evenings are yours again.
        </h1>

        {/* ZWEI SAETZE, mehr nicht. Die Ueberschrift traegt die Aussage; der
            Text darunter soll sie nicht verduennen.

            Die Sektion „In Arbeit", auf die hier frueher verwiesen wurde, gibt
            es nicht mehr – siehe CLAUDE.md, Regel D. */}
        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          Report season eats weekends. Parent post eats evenings. That is the work
          {PRODUCT_NAME} takes off you — not the decisions.
        </p>

        <p className="mt-4 max-w-2xl text-lg text-gray-500">{SCHOOL_TYPE_ANSWER}</p>
      </div>
    </section>
  );
}
