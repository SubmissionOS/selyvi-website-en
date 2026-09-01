/**
 * Zentrale Ablage der rechtlichen Angaben.
 *
 * ==========================================================================
 * FREIGABE IST GETEILT: Legal notice und Privacy policy haben getrennte
 * Schalter, weil sie unterschiedlich weit sind.
 * ==========================================================================
 *
 * ANWALTSPRUEFUNG DER ENGLISCHEN FASSUNG STEHT AUS.
 *
 * Diese Datei traegt die UEBERSETZUNG der deutschen Rechtstexte. Die
 * Pflichtangaben nach § 5 DDG und § 18 Abs. 2 MStV sind unveraendert dieselben
 * – Anschrift, Vertretung, Umsatzsteuer-ID, Verantwortlicher. Uebersetzt sind
 * die Beschriftungen und der Fliesstext, nicht der Inhalt.
 *
 * Massgeblich bleibt die deutsche Fassung auf selyvi.de. Genau das sagt
 * TRANSLATION_NOTE unten auf der Seite, und genau deshalb steht es dort und
 * nicht nur hier im Kommentar: Wer die englische Seite liest, muss wissen,
 * welche Fassung im Streitfall gilt.
 *
 * Siehe README, NACH-LAUNCH-LISTE: „EN-Rechtstexte vom Anwalt pruefen lassen".
 */

/**
 * Legal notice freigegeben.
 *
 * true, seit die Angaben echt sind: Entwurfs-Balken und noindex entfallen auf
 * /legal-notice, die Seite steht wieder in der Sitemap.
 *
 * Offen bleibt der Betreiber-Hinweis (siehe OPERATOR_NOTE unten) – der betrifft
 * aber nicht die Richtigkeit der Angaben, sondern ihre Vorläufigkeit.
 */
export const IMPRINT_READY = true;

/**
 * Privacy policy freigegeben.
 *
 * false: Die Erklärung ist inhaltlich vollständig für das, was diese Website
 * tut, aber weder in der deutschen noch in der englischen Fassung anwaltlich
 * geprüft. Solange false:
 *   - /privacy zeigt eine dezente Prüfungs-Zeile (keinen Entwurfs-Balken,
 *     weil der Text kein Gerüst mehr ist, sondern belastbar formuliert)
 *   - /privacy trägt weiterhin noindex
 *   - /privacy bleibt aus der Sitemap
 *
 * Auf true erst nach anwaltlicher Prüfung – und fuer diese Website erst nach
 * Prüfung der ENGLISCHEN Fassung.
 */
export const PRIVACY_APPROVED = false;

/**
 * Hinweis auf die Uebersetzung – steht auf /legal-notice und /privacy.
 *
 * Eine englische Rechtsseite ohne diesen Satz erweckt den Eindruck, hier gaebe
 * es eine eigene, englischsprachige Rechtslage. Die gibt es nicht: Betreiber,
 * Sitz und anwendbares Recht sind deutsch, und die Pflichtangaben stehen hier,
 * weil § 5 DDG sie verlangt – nicht, weil eine andere Rechtsordnung sie kennt.
 *
 * Der Satz ist bewusst kurz und steht nicht im Kleingedruckten.
 */
export const TRANSLATION_NOTE =
  "German law applies; this is a translation of the German legal notice.";

/** Dieselbe Feststellung fuer die Privacy policy. */
export const PRIVACY_TRANSLATION_NOTE =
  "German law applies; this is a translation of the German privacy policy.";

/**
 * Offener Punkt zur Betreiberangabe.
 *
 * Selyvi wird derzeit als Angebot eines Einzelunternehmens geführt. Sobald eine
 * Betreibergesellschaft gegründet ist, ändern sich Firmierung, Rechtsform,
 * Vertretung und Registereintrag – und damit sowohl das Legal notice als auch
 * der Verantwortliche in der Privacy policy.
 */
/*
 * OPERATOR_NOTE (bewusst keine exportierte Konstante, damit nichts sie rendert):
 *   Vorläufige Betreiberangabe – nach Gründung auf die
 *   Selyvi-Betreibergesellschaft umstellen und anwaltlich prüfen.
 * Steht auch im README unter NACH-LAUNCH-LISTE.
 */

export type Imprint = {
  /** Firmierung bzw. Name des Einzelunternehmers. */
  companyName: string;
  street: string;
  zipCity: string;
  /** Land, englisch geschrieben – die Anschrift selbst bleibt unveraendert. */
  country: string;
  email: string;
  phone: string;
  /**
   * Umsatzsteuer-Identifikationsnummer nach § 27 a UStG.
   * Leerer String blendet die Zeile aus.
   */
  vatId: string;
  /** Verantwortlich nach § 18 Abs. 2 MStV: Name UND ladungsfähige Anschrift. */
  contentResponsible: string;
};

/**
 * ANGABEN NACH § 5 DDG.
 *
 * IDENTISCH MIT DER DEUTSCHEN SEITE. Uebersetzt ist ausschliesslich das Wort
 * „Deutschland" im Feld `country` – Strasse, Ort und Postleitzahl sind eine
 * deutsche Anschrift und werden nicht uebersetzt, sonst findet sie niemand.
 *
 * KEIN REGISTEREINTRAG: Rafael Gutmann betreibt Selyvi als Einzelunternehmen.
 * Einzelunternehmen ohne Kaufmannseigenschaft sind nicht im Handelsregister
 * eingetragen; `registerCourt` und `registerNumber` gibt es hier deshalb nicht
 * als Felder. Die Sektion „Register entry" wird auf der Seite ausgeblendet
 * statt leer angezeigt – eine leere Rubrik sieht nach einer fehlenden Angabe
 * aus, obwohl schlicht keine existiert.
 *
 * Nach Gründung einer Gesellschaft (siehe OPERATOR_NOTE oben) kommen Rechtsform,
 * Vertretung und Registereintrag hinzu.
 */
export const imprint: Imprint = {
  companyName: "Rafael Gutmann",
  street: "Hauptstraße 33",
  zipCity: "73550 Waldstetten",
  country: "Germany",
  // Übergangsadresse. Nach dem Domainkauf auf kontakt@selyvi.com umstellen –
  // eine Adresse auf der eigenen Domain wirkt in der Beschaffung seriöser.
  // Siehe README, NACH-LAUNCH-LISTE.
  //
  // Diese eine Zeile speist Legal notice, Privacy policy (Verantwortlicher und
  // Betroffenenrechte), Footer-Kontaktspalte und die Fallback-Zeile im
  // Fehlerfall des Anfrageformulars.
  email: "selyvi.app@gmail.com",
  phone: "+49 (0)176 30136988",
  vatId: "DE455168590",
  contentResponsible: "Rafael Gutmann, Hauptstraße 33, 73550 Waldstetten, Germany",
};

/**
 * Rechtstexte des Legal notice.
 *
 * UEBERSETZUNG DER VORLAGE, nicht Neuformulierung. Diese Abschnitte sind
 * juristische Standardtexte, deren Formulierung Bedeutung hat – wer sie
 * anpasst, sollte das nicht nach Sprachgefühl tun, sondern nach Rücksprache.
 *
 * Die Paragrafenverweise bleiben deutsch (§ 5 DDG), weil sie deutsche Normen
 * bezeichnen. Ein Verweis, den man nicht nachschlagen kann, weil er uebersetzt
 * wurde, ist wertlos. Beim ersten Vorkommen steht die Einordnung dabei:
 * „German Digital Services Act".
 *
 * Alle vier Abschnitte sind gefüllt. Kommt ein weiterer dazu, gehört der
 * Wortlaut gleich mit hinein – ein Abschnitt mit leerem `body` würde nur eine
 * leere Überschrift rendern.
 */
export type LegalTextSection = {
  title: string;
  /** Wortlaut aus der Vorlage. Leer = noch nicht übernommen. */
  body: string[];
};

export const imprintTextSections: LegalTextSection[] = [
  {
    title: "Liability for content",
    body: [
      "As a service provider we are responsible for our own content on these pages under the general laws, in accordance with § 5 DDG (German Digital Services Act). We are not, however, obliged to monitor transmitted or stored third-party information, or to investigate circumstances that indicate unlawful activity. Where we become aware of such infringements, we will remove the content concerned without delay.",
    ],
  },
  {
    title: "Liability for links",
    body: [
      "Our website contains links to external third-party websites over whose content we have no influence. For that reason we cannot accept any liability for this third-party content. Where we become aware of legal infringements, we will remove such links without delay.",
    ],
  },
  {
    title: "Copyright",
    body: [
      "The content and works created by the site operators on these pages are subject to German copyright law. Downloads and copies of this site are permitted for private, non-commercial use only.",
    ],
  },
  {
    title: "Consumer dispute resolution / universal arbitration board",
    body: [
      "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.",
    ],
  },
];
