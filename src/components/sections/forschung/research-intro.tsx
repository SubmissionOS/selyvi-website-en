import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 1 – Intro der Forschungsseite.
 *
 * Gleiche Bauweise wie die Intros auf /for-teachers und /for-school-leadership: schmal,
 * ohne Bild, ohne CTA. Der Handlungsaufruf steht am Seitenende.
 *
 * Der Ton unterscheidet sich bewusst von beiden: Diese Seite wirbt niemanden
 * an. Sie richtet sich an Menschen, die beruflich pruefen, bevor sie glauben –
 * und fuer die eine Marketingseite mit Wirkungsversprechen ein Ausschlusskri-
 * terium waere. Deshalb steht in der H1 die Grenze und nicht das Versprechen.
 */
export function ResearchIntro() {
  return (
    <section aria-labelledby="forschung-intro-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="forschung-intro-titel"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Impact is something we want to evidence – not assert.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          {PRODUCT_NAME} is being built in the middle of everyday school life. That raises
          the question we care about most: what actually takes the load off?
        </p>

        <p className="mt-4 max-w-2xl text-lg text-gray-500">
          So we build the measurement in from the start — and look for research partners
          willing to look harder than we can on our own.
        </p>
      </div>
    </section>
  );
}
