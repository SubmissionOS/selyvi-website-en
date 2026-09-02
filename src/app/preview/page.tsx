import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/config/seo";
import { primaryCta } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Workspace } from "@/components/einblick/workspace";

export const metadata: Metadata = pageMetadata("/preview");

/**
 * Take a look (/preview) – die einzige bedienbare Seite der Website.
 *
 * Sie ersetzt die frühere Sektion „So funktioniert's" auf der Startseite:
 * Erklären war der Umweg, klicken ist der kurze Weg.
 *
 * Vier von acht Bereichen sind offen. Die Zahl acht ist keine Auswahl, sondern
 * die echte Navigation der Anwendung (docs/app-referenz/). Die Sperren sind
 * kein Mangel, sondern die Botschaft – wer alles sieht, hat keinen Grund mehr
 * für ein Gespräch.
 *
 * KEIN Navigationspunkt: Die Kopfzeile bleibt bei fünf. Erreichbar über die
 * Sektion „Try it for yourself." auf der Startseite und über die Fusszeile.
 *
 * SEITENTITEL „Take a look": docs/glossar-en.md – es gibt kein englisches
 * Substantiv, das so leicht klingt wie „Einblick". Die Einladung zaehlt hier
 * mehr als die woertliche Entsprechung.
 */
export default function EinblickPage() {
  return (
    <>
      <section aria-labelledby="preview-title" className="border-b border-gray-200">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <h1
            id="preview-title"
            className="max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Have a click through.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-gray-500">
            Four areas are open. Click through them in any order — what you select stays
            when you switch.
          </p>

          <div className="mt-10">
            <Workspace />
          </div>
        </div>
      </section>

      {/* Abschluss. Bewusst ruhig: Wer bis hierher geklickt hat, braucht keinen
          Anschub mehr, sondern nur den nächsten Schritt. */}
      <section aria-labelledby="preview-closing" className="bg-surface-alt">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2
              id="preview-closing"
              className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              That was four areas out of eight.
            </h2>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Button asChild variant="cta" size="lg">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>

              <Link
                href="/co-create"
                className="text-base text-brand-600 underline underline-offset-4"
              >
                Or go straight to co-creating
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
