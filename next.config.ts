import type { NextConfig } from "next";

/**
 * Sicherheits-Header für alle Antworten.
 *
 * ZUR CONTENT-SECURITY-POLICY: bewusst NICHT gesetzt, siehe README,
 * „Offener Punkt: Content-Security-Policy“. Next.js liefert Hydrations-Daten
 * über inline <script>-Elemente aus. Eine CSP ohne 'unsafe-inline' braucht
 * deshalb Nonces, und Nonces erzwingen dynamisches Rendern – alle neun Routen
 * dieser Website sind derzeit statisch vorgerendert. Eine CSP MIT
 * 'unsafe-inline' wiederum schuetzt gegen genau das nicht, wogegen eine CSP
 * schuetzen soll. Statt einer Alibi-Zeile steht der Punkt offen im README.
 */
const securityHeaders = [
  {
    // Verhindert, dass Browser den Content-Type erraten und eine Datei als
    // etwas anderes ausfuehren, als der Server angibt.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Beim Wechsel auf fremde Domains nur die Herkunft senden, nicht den
    // vollen Pfad – auf einer Website mit Formular ist der Pfad eine Spur.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Die Website braucht keine dieser Schnittstellen. Leere Liste = niemand
    // darf, auch eingebettete Inhalte nicht.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Kein Einbetten in fremde Frames – schuetzt vor Clickjacking.
    key: "X-Frame-Options",
    value: "DENY",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  /**
   * Umleitungen der deutschen Pfade auf die englischen Routen.
   *
   * Diese Website ist die eigenstaendige englische Fassung (siehe README-Kopf).
   * Ihre Routen tragen englische Namen, weil eine englische Seite mit deutschen
   * Adressen an genau der Stelle stolpert, an der jemand den Link vorliest oder
   * in eine Mail kopiert.
   *
   * Die deutschen Pfade bleiben trotzdem erreichbar: Sie standen in
   * Praesentationen, Mails und Pitchdecks, bevor dieses Repo entstand, und eine
   * Marketing-Adresse ist nach dem Versenden nicht mehr in unserer Hand.
   *
   * PERMANENT, nicht temporaer: Die deutschen Adressen kommen auf selyvi.com
   * nicht zurueck. Suchmaschinen uebertragen damit die Bewertung der alten
   * Adresse auf die neue. Next.js sendet bei `permanent: true` den Status 308,
   * nicht 301 – die HTTP-Methode bleibt dabei erhalten, ein POST wird also
   * nicht stillschweigend zu einem GET.
   *
   * `/produkt` steht weiter in der Liste: Die Route hiess so, solange die Seite
   * nach dem Produkt benannt war. Sie zeigt direkt auf das englische Ziel,
   * damit kein Umweg ueber zwei Weiterleitungen entsteht.
   */
  async redirects() {
    const germanPaths: Array<[string, string]> = [
      ["/fuer-lehrkraefte", "/for-teachers"],
      ["/produkt", "/for-teachers"],
      ["/schulen", "/for-school-leadership"],
      ["/forschung", "/research"],
      ["/datenschutz-sicherheit", "/security"],
      ["/ueber-uns", "/our-story"],
      ["/demo", "/meet"],
      ["/mitgestalten", "/co-create"],
      ["/einblick", "/preview"],
      // /impressum ist KEINE Umleitung mehr, sondern die Seite selbst: Das
      // Impressum ist deutsch geblieben (src/config/legal.ts). Umgekehrt
      // leitet jetzt die englische Adresse dorthin – sie stand eine Runde lang
      // in der Sitemap und darf nicht ins Leere laufen.
      ["/legal-notice", "/impressum"],
      ["/datenschutz", "/privacy"],
    ];

    return germanPaths.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
