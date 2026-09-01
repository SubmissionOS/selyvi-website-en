import Link from "next/link";

import { primaryCta } from "@/config/site";
import { PRODUCT_NAME } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/layout/wordmark";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

/** Sticky Kopfbereich: weisse Flaeche, dezente Trennlinie nach unten. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6 lg:px-8">
        <Link href="/" aria-label={`${PRODUCT_NAME} – to the home page`}>
          <Wordmark />
        </Link>

        <MainNav />

        <div className="flex items-center gap-2">
          {/* Primaerer CTA – einzige Verwendung von --cta im Header.
              Ab sm in voller Groesse. */}
          <Button asChild variant="cta" size="md" className="hidden sm:inline-flex">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>

          {/* Der Umschaltpunkt ist sm, nicht mehr md: Seit die Hauptnavigation
              erst ab lg erscheint (siehe main-nav.tsx), ist die Kopfzeile
              zwischen 640 und 1023 px nur noch Wortmarke, CTA und Burger – dort
              passt der Button in voller Groesse. */}
          {/* Darunter dieselbe Aktion kompakt neben dem Burger-Icon: das
              Conversion-Element bleibt auf jeder Viewport-Breite sichtbar,
              ohne die Kopfzeile zu ueberladen. Im Burger-Menue steht der CTA
              zusaetzlich in voller Breite. */}
          <Button asChild variant="cta" size="sm" className="sm:hidden">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
