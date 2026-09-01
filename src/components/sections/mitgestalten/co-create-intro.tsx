import Link from "next/link";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 1 – Intro von /co-create.
 *
 * Gleiche Bauweise wie die Intros der anderen Seiten: schmal, ohne Bild, ohne
 * CTA. Der Handlungsaufruf ist hier das Formular weiter unten.
 *
 * Der zweite Satz ist der eigentliche Punkt der Seite: Wer frueh dabei ist,
 * praegt, was gebaut wird. Das ist keine Verkaufsaussage, sondern eine
 * Beschreibung des Zustands – das Produkt ist an drei aktiven Schulen und
 * jede Rueckmeldung wiegt entsprechend schwer.
 */
export function CoCreateIntro() {
  return (
    <section
      aria-labelledby="mitgestalten-intro-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="mitgestalten-intro-titel"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Help build the tool that was missing.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          {PRODUCT_NAME} was built with teachers and only grows that way.
        </p>

        <p className="mt-4 max-w-2xl text-lg text-gray-500">
          Whoever is there early shapes what gets built – as plainly as this website is
          written.
        </p>

        <p className="mt-6 max-w-2xl text-lg">
          <Link href="/preview" className="text-brand-600 underline underline-offset-4">
            Try it for yourself first
          </Link>
        </p>
      </div>
    </section>
  );
}
