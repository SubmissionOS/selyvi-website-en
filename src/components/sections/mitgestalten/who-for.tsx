import Link from "next/link";

import { PRACTICE_CLAIM, PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 3 – Für wen.
 *
 * Die Reihenfolge ist die Wahrheit aus docs/produktstand-2026-08.md: gebaut
 * fuer die Grundschule, Klassen 1–4. Andere Schulformen sind ausdruecklich
 * willkommen – aber fuer die WEITERENTWICKLUNG, nicht als heutige Zielgruppe.
 * Genau diese Unterscheidung ist der Grund, warum die Sektion existiert; ohne
 * sie liest eine Gymnasiallehrkraft die Einladung als Zusage.
 *
 * Der zweite Absatz ist durch PRACTICE_CLAIM gedeckt: An der Entwicklung
 * waren Lehrkraefte von der Grundschule bis zum Abitur beteiligt. Das ist
 * belegte Vergangenheit, keine Ankuendigung.
 *
 * Forschende bekommen keinen eigenen Absatz, sondern einen Verweis: Fuer sie
 * gibt es eine eigene Seite, und die sagt deutlich mehr, als hier hinpasst.
 */
export function WhoFor() {
  return (
    <section aria-labelledby="mitgestalten-fuer-wen-titel">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <h2
            id="mitgestalten-fuer-wen-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Who this is for
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            First for primary school teachers, years 1 to 4 (grades 1 to 4) – that is
            what {PRODUCT_NAME} is built for today. Anyone teaching there works with the
            tool in exactly the form it is meant to take.
          </p>

          <p className="mt-4 text-lg text-gray-500">
            Teachers from other school types are expressly welcome – for the further
            development. {PRACTICE_CLAIM} What the application can do today is, however,
            tailored to primary school; that belongs said beforehand and not afterwards.
          </p>

          <p className="mt-4 text-lg text-gray-500">
            For research on schools and teaching there is{" "}
            <Link
              href="/research"
              className="text-brand-600 underline underline-offset-4"
            >
              a page of its own
            </Link>{" "}
            – with our questions and the survey model behind them.
          </p>
        </div>
      </div>
    </section>
  );
}
