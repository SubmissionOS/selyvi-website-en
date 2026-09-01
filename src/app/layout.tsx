import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import "./globals.css";
import { CTA_VARIANT, PRODUCT_NAME } from "@/config/brand";
import {
  HOME_TITLE,
  OG_IMAGE,
  SITE_LANG,
  SITE_LOCALE,
  SITE_URL,
  absoluteUrl,
  alternateLanguages,
  routeFor,
} from "@/config/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * IBM Plex Sans in den Gewichten 400 / 500 / 600.
 *
 * next/font/google laedt die Schriftdateien EINMALIG waehrend `next build`
 * herunter und legt sie unter /_next/static/media im eigenen Build ab. Das
 * erzeugte @font-face verweist ausschliesslich auf diesen lokalen Pfad – zur
 * Laufzeit entsteht KEINE Verbindung zu fonts.googleapis.com oder
 * fonts.gstatic.com. Es wird ausserdem kein <link>-Preconnect zu Google
 * gerendert.
 *
 * `display: "swap"` vermeidet unsichtbaren Text waehrend des Ladens.
 * `variable` stellt die Familie als CSS-Variable bereit; globals.css bindet
 * sie ueber --font-sans an alle Tailwind-Utilities.
 */
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

/**
 * Basis-Metadaten für alle Seiten.
 *
 * metadataBase macht relative Angaben (Canonical, Open Graph) absolut. Die
 * Seiten setzen ihre eigenen Werte über pageMetadata() aus src/config/seo.ts.
 *
 * Auch hier zieht alles den Namen aus PRODUCT_NAME – der finale Name bleibt
 * eine Aenderung in src/config/brand.ts.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s – ${PRODUCT_NAME}`,
  },
  description: routeFor("/").description,
  alternates: {
    canonical: absoluteUrl("/"),
    languages: alternateLanguages(routeFor("/")),
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    siteName: PRODUCT_NAME,
    url: absoluteUrl("/"),
    title: HOME_TITLE,
    description: routeFor("/").description,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-cta steuert, welche der beiden CTA-Farben an --cta gebunden wird.
    // Der Wert kommt aus der Konstante CTA_VARIANT in src/config/brand.ts.
    <html lang={SITE_LANG} data-cta={CTA_VARIANT} className={ibmPlexSans.variable}>
      <body className="flex min-h-dvh flex-col bg-surface text-ink">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <SiteHeader />

        {/* tabIndex={-1} ist noetig, damit der Skip-Link den Fokus wirklich
            hierher verschiebt. Ohne das setzt der Browser nur den Hash und
            scrollt; die Tastaturnavigation liefe danach weiter oben in der
            Kopfzeile weiter – der Sprung waere fuer genau die Gruppe wirkungslos,
            fuer die er gedacht ist. Kein Fokusring, weil das Ziel kein
            Bedienelement ist. */}
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
