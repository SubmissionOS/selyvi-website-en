"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { mainNav } from "@/config/site";

/**
 * Desktop-Navigation. Der aktive Eintrag wird ueber brand-600 ausgezeichnet.
 *
 * Der Umschaltpunkt ist lg, nicht md – und das ist gemessen. Seit „Research“
 * als fuenfter Eintrag dazugekommen ist, brauchen Wortmarke, fuenf Eintraege
 * und CTA-Button zusammen mehr Platz, als eine Zeile bietet: Bis 860 px bricht
 * die Liste auf zwei Zeilen um, ab 880 px passt sie. md (768 px) liegt darunter,
 * lg (1024 px) darueber.
 *
 * Zwischen 768 und 1023 px uebernimmt deshalb das Burger-Menue. Die Alternative
 * waere gewesen, die Beschriftungen zu kuerzen – aber „For teachers“ und „For
 * school leadership“ sind genau die Ansprache, die im Herz-Update gesetzt
 * wurde. Ein Breakpoint ist billiger als ein Rueckschritt im Ton.
 *
 * ENGLISCH IST HIER LAENGER: „For school leadership“ braucht rund 30 px mehr
 * als „Für Schulleitungen“. Der Umschaltpunkt lg (1024 px) haelt das aus – die
 * Leiste bricht erst unterhalb von 900 px um und ist dort ohnehin schon durch
 * das Burger-Menue ersetzt.
 *
 * mobile-nav.tsx und der CTA in site-header.tsx haengen an derselben Grenze –
 * wer hier etwas aendert, muss dort mitziehen.
 */
export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden lg:block">
      <ul className="flex items-center gap-8">
        {mainNav.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-brand-600" : "text-ink hover:text-brand-600",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
