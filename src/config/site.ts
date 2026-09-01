import { imprint } from "@/config/legal";

/**
 * Navigations- und Footer-Struktur.
 *
 * Kontaktangaben kommen aus src/config/legal.ts, damit Footer, Impressum und
 * Privacy policy nicht auseinanderlaufen.
 */

export type NavItem = {
  label: string;
  href: string;
  /**
   * Sprache der BESCHRIFTUNG, wenn sie nicht englisch ist.
   *
   * Genau ein Eintrag braucht das: „Impressum" in der Fusszeile. Das Ziel ist
   * eine deutsche Seite (siehe src/config/legal.ts), und ein Link, der
   * „Legal notice" verspricht und „Impressum" liefert, waere eine
   * Irrefuehrung – also bleibt die Beschriftung deutsch.
   *
   * Damit ist sie ein deutsches Wort auf einer englischen Seite, und genau
   * dafuer gibt es lang: WCAG 3.1.2 (Language of Parts). Ein Screenreader
   * spricht es deutsch aus, statt es englisch zu buchstabieren. Dasselbe
   * Attribut sagt scripts/german-check.mjs, dass dieses Wort nicht englisch
   * sein soll – ohne dass die Liste erlaubter Woerter dort waechst.
   */
  lang?: string;
};

/** Hauptnavigation im Header (Desktop und Burger-Menue nutzen dieselbe Liste). */
export const mainNav: NavItem[] = [
  { label: "For teachers", href: "/for-teachers" },
  { label: "For school leadership", href: "/for-school-leadership" },
  { label: "Research", href: "/research" },
  { label: "Security", href: "/security" },
  { label: "Our story", href: "/our-story" },
];

/** Primaerer Call-to-Action – die einzige Stelle, an der --cta zum Einsatz kommt. */
export const primaryCta: NavItem = {
  /**
   * „Meet Selyvi" statt „Book a demo".
   *
   * Auf /meet wird nichts gebucht – es wird ein Erstgespraech angefragt, auf
   * das wir uns melden. „Book" versprach einen Kalender, den es nicht gibt,
   * und setzte die Huerde hoeher als noetig: Wer nur schauen will, bucht
   * nichts.
   *
   * „Book a demo" waere ausserdem genau die Verkaufssprache, die die deutsche
   * Seite bewusst vermeidet (docs/en-review.md, Punkt 2). „Meet Selyvi" haelt
   * die Einladung. Die woertlichere Alternative „Get to know Selyvi" ist
   * korrekt, aber sperrig fuer einen Knopf.
   *
   * Der Knopf bleibt an allen bisherigen Stellen stehen – die staendige
   * Erreichbarkeit oben rechts ist Absicht, nicht Zufall.
   */
  label: "Meet Selyvi",
  href: "/meet",
};

export type FooterColumn = {
  title: string;
  items: NavItem[];
};

/** Vier Footer-Spalten. */
export const footerColumns: FooterColumn[] = [
  {
    title: "Selyvi",
    items: [
      { label: "Take a look", href: "/preview" },
      { label: "For teachers", href: "/for-teachers" },
      { label: "For school leadership", href: "/for-school-leadership" },
      { label: "Research & impact", href: "/research" },
      { label: "Data protection & security", href: "/security" },
      { label: "Meet Selyvi", href: "/meet" },
    ],
  },
  {
    title: "Company",
    /**
     * „Careers", „Press" und „Blog" standen hier als Platzhalter und zeigten
     * alle auf /our-story. Ein Link, der etwas anderes verspricht als das Ziel
     * liefert, kostet mehr Vertrauen, als eine kurze Spalte kostet – deshalb
     * ersatzlos entfernt.
     *
     * Sie kommen zurück, sobald die Seiten wirklich existieren: dann je einen
     * Eintrag mit eigener Route ergänzen.
     */
    items: [
      { label: "Our story", href: "/our-story" },
      { label: "Co-create", href: "/co-create" },
      // Als gewöhnlicher Link, nicht als Button: Der primäre CTA steht bereits
      // in der Kopfzeile, und --cta bleibt genau ihm vorbehalten.
      { label: "Meet Selyvi", href: "/meet" },
    ],
  },
  {
    title: "Legal",
    items: [
      // Beschriftung DEUTSCH, weil das Ziel deutsch ist. „Legal notice" auf
      // einem Link, hinter dem „Impressum" steht, waere ein Versprechen, das
      // die Seite nicht einloest. lang="de" siehe NavItem oben.
      { label: "Impressum", href: "/impressum", lang: "de" },
      { label: "Privacy policy", href: "/privacy" },
      // "Terms" und "Accessibility" standen hier als Platzhalter und zeigten
      // beide auf /impressum. Ein Link, der etwas anderes verspricht als das
      // Ziel liefert, ist auf einer Seite mit Rechtsbezug besonders unguenstig
      // – deshalb entfernt, bis die Seiten existieren. Siehe README,
      // "Rechtliches – Launch-Blocker".
    ],
  },
  {
    title: "Contact",
    /**
     * Bewusst reduziert: nur die E-Mail-Adresse, kein Telefon, keine Anschrift.
     *
     * Die vollständigen Angaben stehen im Impressum – dort gehören sie hin,
     * und dorthin führt der Link in der Spalte „Legal". Eine private
     * Mobilnummer auf jeder einzelnen Seite auszugeben, ist etwas anderes als
     * sie im Impressum bereitzuhalten.
     *
     * Die Adresse kommt aus src/config/legal.ts – eine Quelle mit Impressum
     * und Privacy policy. Sonst stehen auf derselben Website zwei verschiedene
     * Kontaktadressen.
     */
    items: [
      { label: imprint.email, href: `mailto:${imprint.email}` },
      { label: "Meet Selyvi", href: "/meet" },
    ],
  },
];

/** Social-Profile in der Fusszeile. */
export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" as const },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" as const },
];
