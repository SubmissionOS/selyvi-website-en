import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Einladungs-Band am Ende von /for-teachers.
 *
 * Es steht kurz vor dem Final-CTA: Wer die ganze Seite gelesen hat und
 * trotzdem weiterliest, ist die Person, die gemeint ist.
 *
 * Der Knopf traegt NICHT die --cta-Farbe. Die gehoert dem „Meet Selyvi", und
 * zwei gleich starke Aufrufe direkt untereinander heben sich gegenseitig auf.
 */
export function CoCreateBand() {
  return (
    <section
      aria-labelledby="mitgestalten-band-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2
            id="mitgestalten-band-titel"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Tell us what is missing.
          </h2>

          <p className="mt-5 text-lg text-gray-500">
            That is the most useful sentence anyone can send us. Part of what stands
            above exists because a teacher said exactly that.
          </p>

          <div className="mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/co-create">Co-create</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
