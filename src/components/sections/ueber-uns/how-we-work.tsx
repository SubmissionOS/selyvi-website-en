import Link from "next/link";
import { ArrowRight, Eye, ShieldCheck, Users } from "lucide-react";

import { PRACTICE_CLAIM } from "@/config/brand";
import { Button } from "@/components/ui/button";

/**
 * Sektion 4 – Arbeitsweise.
 *
 * Alle drei Aussagen sind durch die Website selbst belegbar – besonders die
 * dritte: „What is open we mark visibly“ ist keine Behauptung, sondern auf
 * /security und auf dieser Seite nachpruefbar. Genau deshalb
 * darf sie hier ohne Marker stehen.
 *
 * Die erste Karte nennt die kanonische Praxis-Aussage aus PRACTICE_CLAIM –
 * dieselbe wie auf Startseite, /produkt und /for-school-leadership.
 */
const practices = [
  {
    icon: Users,
    title: "Developed with teachers",
    description: PRACTICE_CLAIM,
  },
  {
    icon: ShieldCheck,
    title: "Data protection by design",
    // Ohne Hosting-Zusatz: Der Serverstandort des Produkts ist noch nicht
    // Deutschland (siehe PRODUCT_HOSTING_NOTE), und diese Karte ist nicht der
    // Ort, an dem das mit einem Halbsatz geklaert werden koennte.
    description:
      "Only what the particular function needs is processed. Every teacher sees only their own data.",
    action: { label: "Security & data protection", href: "/security" },
  },
  {
    icon: Eye,
    title: "Honest about where we stand",
    description:
      "What is open we mark visibly, instead of glossing over it. On this page too.",
  },
];

export function HowWeWork() {
  return (
    <section
      aria-labelledby="arbeitsweise-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="arbeitsweise-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          How we work
        </h2>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {practices.map((practice) => {
            const Icon = practice.icon;

            return (
              <li
                key={practice.title}
                className="flex flex-col rounded-xl border border-gray-200 bg-surface p-6"
              >
                <Icon aria-hidden="true" className="size-6 text-brand-600" />

                <h3 className="mt-5 text-base font-semibold text-ink">
                  {practice.title}
                </h3>

                <p className="mt-3 text-sm text-gray-500">{practice.description}</p>

                {practice.action ? (
                  <div className="mt-6">
                    <Button asChild variant="link" size="sm" className="h-auto px-0">
                      <Link href={practice.action.href}>
                        {practice.action.label}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
