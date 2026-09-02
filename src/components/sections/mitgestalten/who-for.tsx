import Link from "next/link";

import { PRACTICE_CLAIM, PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 3 – Für wen.
 *
 * GEAENDERT AM 2.9.2026 – CMO-DIREKTIVE, ALLE SCHULARTEN.
 * Diese Sektion existierte, um eine Grenze zu ziehen: gebaut fuer die
 * Grundschule, andere Schulformen willkommen fuer die WEITERENTWICKLUNG,
 * nicht als heutige Zielgruppe. Diese Grenze gibt es nicht mehr
 * (docs/produktstand-2026-08.md, „Zielgruppe · Aktualisierung vom 2.
 * September 2026"). Der Absatz nennt jetzt die Spanne – Klasse 1 bis Abitur –
 * und keine Einschraenkung.
 *
 * Die Herkunft bleibt und wird erzaehlt: „We built Selyvi for primary schools
 * first." Das ist Geschichte, keine Positionierung – und es ist der Satz, der
 * verhindert, dass die Weitung wie eine nachtraegliche Behauptung wirkt.
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
            For teachers, from year 1 to upper secondary. We are guided by the education
            and framework plans of the German states, and {PRODUCT_NAME} grows with the
            class in front of you.
          </p>

          <p className="mt-4 text-lg text-gray-500">
            {PRACTICE_CLAIM} We built {PRODUCT_NAME} for primary schools first — that is
            where it comes from, and it belongs said beforehand rather than afterwards.
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
