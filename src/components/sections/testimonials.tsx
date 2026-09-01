import { SHOW_TESTIMONIALS } from "@/config/features";

/**
 * Sektion 7 – Testimonials.
 *
 * ABGESCHALTET. Zwei Bedingungen muessen erfuellt sein, damit die Sektion
 * erscheint:
 *   1. SHOW_TESTIMONIALS in src/config/features.ts steht auf true, UND
 *   2. in `testimonials` steht mindestens eine echte, freigegebene Stimme.
 *
 * Die Liste ist absichtlich leer. Erfundene Zitate gehoeren nicht auf eine
 * Seite, die Vertrauen von Schulen einwerben soll – ein erfundenes Zitat waere
 * zudem eine unzulaessige Werbeaussage. Ausfuellen erst, wenn eine Pilotschule
 * Name, Funktion und Wortlaut schriftlich freigegeben hat.
 */
type Testimonial = {
  /** Wortlaut exakt wie freigegeben, ohne redaktionelle Glaettung. */
  quote: string;
  name: string;
  /** Funktion, z. B. "Maths teacher" oder "Head teacher". */
  role: string;
  school: string;
};

const testimonials: Testimonial[] = [];

export function Testimonials() {
  if (!SHOW_TESTIMONIALS || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="stimmen-titel"
      className="border-y border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="stimmen-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Voices from the pilot
        </h2>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li
              key={`${testimonial.name}-${testimonial.school}`}
              className="rounded-xl border border-gray-200 bg-surface p-6"
            >
              <figure>
                <blockquote className="text-base text-ink">
                  <p>„{testimonial.quote}“</p>
                </blockquote>
                <figcaption className="mt-5 text-sm text-gray-500">
                  <span className="font-medium text-ink">{testimonial.name}</span>
                  {" – "}
                  {testimonial.role}, {testimonial.school}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
