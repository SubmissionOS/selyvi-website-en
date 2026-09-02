import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 1 – Intro.
 *
 * Gleiche Bauweise wie das Intro auf /produkt: schmal, ohne Bild, ohne CTA.
 * Der Ton wechselt hier von „mein Alltag“ zu „meine Organisation“ – adressiert
 * werden Schulleitung und Schulträger, nicht die einzelne Lehrkraft.
 */
export function SchoolIntro() {
  return (
    <section aria-labelledby="schulen-intro-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="schulen-intro-titel"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Bringing {PRODUCT_NAME} into your school.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          {PRODUCT_NAME} takes the writing off your staff — the pile that builds up before
          report day and before parents’ evenings. At the end of the month it shows you
          how many hours that was.
        </p>
      </div>
    </section>
  );
}
