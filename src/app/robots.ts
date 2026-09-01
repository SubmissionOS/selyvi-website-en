import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/seo";

/**
 * robots.txt.
 *
 * Erlaubt alles und verweist auf die Sitemap.
 *
 * Absichtlich KEIN Disallow für /legal-notice und /privacy: Diese Seiten
 * tragen bereits <meta name="robots" content="noindex">. Ein Disallow würde
 * Crawler daran hindern, die Seiten überhaupt abzurufen – sie könnten das
 * noindex dann nicht lesen und die Seiten unter Umständen trotzdem
 * indexieren. Ausschluss aus dem Index läuft über das Meta-Tag, nicht über
 * robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
