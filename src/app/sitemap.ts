import type { MetadataRoute } from "next";

import { absoluteUrl, indexableRoutes } from "@/config/seo";

/**
 * sitemap.xml.
 *
 * Speist sich aus derselben Routenliste wie die Seitentitel
 * (src/config/seo.ts). Neue Seiten tauchen damit automatisch auf, sobald sie
 * dort eingetragen sind – und nur dann.
 *
 * Rechtsseiten haengen an eigenen Freigabeschaltern (IMPRINT_READY,
 * PRIVACY_APPROVED in src/config/legal.ts). Derzeit fehlt nur /privacy.
 *
 * Nicht indexierte Seiten bleiben in der robots.txt trotzdem erlaubt: Nur wenn
 * Crawler sie abrufen duerfen, sehen sie das noindex im HTML. Ein Disallow
 * wuerde das Gegenteil bewirken.
 *
 * Kein `lastModified`: Ein Datum, das bei jedem Build neu gesetzt wird, sagt
 * nichts über den Inhalt aus. Lieber keine Angabe als eine erfundene.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((route) => ({
    // Dieselbe Hilfsfunktion wie Canonical und og:url – sonst weichen die
    // Adressen in Details wie dem abschliessenden Schrägstrich voneinander ab.
    url: absoluteUrl(route.path),
    priority: route.priority,
  }));
}
