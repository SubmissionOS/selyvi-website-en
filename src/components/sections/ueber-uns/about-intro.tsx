import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 1 – Intro.
 *
 * Die Herkunftsbeschreibung des Teams ist markiert: „aus Produkt, Technik und
 * Bildungspraxis“ ist eine Aussage ueber reale Personen und ihre Qualifikation.
 * Sie sollte so formuliert sein, wie das Team sie selbst vertritt.
 */
export function AboutIntro() {
  return (
    <section aria-labelledby="ueber-uns-intro-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="ueber-uns-intro-titel"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Who stands behind {PRODUCT_NAME}.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          Behind {PRODUCT_NAME} is a team from product, engineering and classroom
          practice.
        </p>

        <p className="mt-4 max-w-2xl text-lg text-gray-500">
          We want to take administrative work off teachers – not the responsibility.
        </p>
      </div>
    </section>
  );
}
