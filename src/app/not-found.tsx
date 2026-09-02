import Link from "next/link";

import { primaryCta } from "@/config/site";
import { Button } from "@/components/ui/button";

/**
 * 404-Seite.
 *
 * Rendert innerhalb des Root-Layouts, hat also Kopf- und Fusszeile. Kein
 * Wortspiel, kein Maskottchen: Wer hier landet, sucht etwas und will weiter –
 * ein Scherz kostet an dieser Stelle nur Zeit.
 *
 * Zwei Wege hinaus: Startseite fuer Orientierung, /meet als die Handlung, die
 * ohnehin das Ziel der Website ist.
 *
 * Die deutschen Pfade von selyvi.de landen NICHT hier: next.config.ts leitet
 * sie mit 308 auf die englischen Routen um. Wer hier ankommt, hat eine Adresse
 * erwischt, die es auf keiner der beiden Seiten gibt.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <p className="text-sm font-medium text-brand-600">Error 404</p>

        <h1
          id="not-found-title"
          className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          There is nothing at this address.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          The page may have moved, or the link has grown old.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="primary" size="lg">
            <Link href="/">Go to the home page</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
