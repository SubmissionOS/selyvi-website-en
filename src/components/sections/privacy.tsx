import Link from "next/link";
import { Ban, FileText, Lock, ScanLine, Server, UserX } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";
import {
  DATA_SEPARATION_NOTE,
  PRODUCT_HOSTING_NOTE,
  WEBSITE_HOSTING_NOTE,
} from "@/config/product";
import { Button } from "@/components/ui/button";

/**
 * Sektion 6 – DSGVO-Block.
 *
 * Vollbreite Flaeche in brand-800. Die Klasse `on-dark` schaltet den
 * Fokus-Ring aus globals.css auf brand-100 um, damit er auf der dunklen
 * Flaeche sichtbar bleibt.
 *
 * ZWEI GETRENNTE HOSTING-AUSSAGEN, und das ist der Kern dieser Sektion:
 * Die erste Karte spricht ueber DIESE WEBSITE (Frankfurt – belegt), die zweite
 * ueber DIE ANWENDUNG (Umzug nach Deutschland und AVV – in Vorbereitung). Bis
 * zum Abgleich mit docs/produktstand-2026-08.md stand hier eine einzige Karte
 * „EU-Hosting", die beides vermischte und damit fuer das Produkt eine Zusage
 * gab, die es nicht gibt: Gehostet wird das Produkt heute bei Railway und
 * Vercel.
 *
 * Die Karten drei bis sechs sind Tatsachen aus dem ausgelieferten Produkt und
 * brauchen keine Einschraenkung.
 */
const facts = [
  {
    icon: Server,
    title: "This website",
    description: WEBSITE_HOSTING_NOTE,
  },
  {
    icon: FileText,
    title: "The application",
    description: PRODUCT_HOSTING_NOTE,
  },
  {
    icon: Lock,
    title: "Strict data separation",
    description: DATA_SEPARATION_NOTE,
  },
  {
    icon: ScanLine,
    title: "Data minimisation as a principle",
    description: "What is collected is what the particular function needs – no more.",
  },
  {
    icon: Ban,
    title: "No sharing of pupil data",
    description: "No passing on to third parties, no use for advertising purposes.",
  },
  {
    icon: UserX,
    title: "No parent or pupil access",
    description: `${PRODUCT_NAME} is a tool for teachers and school leadership. There is deliberately no portal for parents or children.`,
  },
];

export function Privacy() {
  return (
    <section
      aria-labelledby="datenschutz-titel"
      className="on-dark bg-brand-800 text-surface"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="datenschutz-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-surface sm:text-4xl"
        >
          Your data stays your data.
        </h2>

        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {facts.map((fact) => {
            const Icon = fact.icon;

            return (
              <li key={fact.title} className="flex gap-4">
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-brand-100"
                />
                <div>
                  <h3 className="text-base font-semibold text-surface">{fact.title}</h3>
                  <p className="mt-2 text-sm text-brand-100">{fact.description}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-14">
          <Button asChild variant="outlineInverse" size="lg">
            <Link href="/security">More on security &amp; data protection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
