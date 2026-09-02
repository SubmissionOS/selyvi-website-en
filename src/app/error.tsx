"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Fehlergrenze für unerwartete Ausnahmen.
 *
 * Im UI stehen KEINE technischen Details: kein Stacktrace, keine
 * Fehlermeldung, keine Fehler-ID. Solche Ausgaben helfen Besuchenden nicht und
 * verraten im ungünstigen Fall Interna. Der Fehler geht stattdessen in die
 * Konsole – und gehoert spaeter in ein Monitoring (siehe README, offene
 * Punkte).
 *
 * `reset()` versucht den fehlgeschlagenen Bereich neu zu rendern, ohne die
 * ganze Seite neu zu laden.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Nur serverseitig bzw. in der Browserkonsole, nicht im sichtbaren UI.
    console.error("[unexpected error]", error);
  }, [error]);

  return (
    <section aria-labelledby="error-title">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <p className="text-sm font-medium text-brand-600">Unexpected error</p>

        <h1
          id="error-title"
          className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Something went wrong.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          Reload the page. If it happens again, the request form reaches us directly.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="primary" size="lg" onClick={reset}>
            Try again
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/">Go to the home page</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
