/**
 * Zentrale Ablage der rechtlichen Angaben.
 *
 * ==========================================================================
 * ZWEI SEITEN, ZWEI SPRACHEN – UND ZWAR MIT ABSICHT.
 * ==========================================================================
 * /impressum IST DEUTSCH, wortgleich mit selyvi.de. Die Pflichtangaben
 * nach § 5 DDG und § 18 Abs. 2 MStV sind die Angaben eines deutschen
 * Unternehmens und gelten im deutschen Wortlaut. Eine englische Fassung
 * daneben waere im besten Fall ueberfluessig und im schlechtesten die
 * Version, auf die sich im Zweifel jemand beruft.
 *
 * Es gab zwischenzeitlich ein uebersetztes /legal-notice. Das ist
 * zurueckgenommen; die Route leitet mit 308 auf /impressum um. Uebrig bleibt
 * genau EIN englischer Satz – IMPRINT_LANGUAGE_NOTE. Er sagt einer englischen
 * Leserin, warum die Seite darunter deutsch ist, und beansprucht selbst keine
 * Rechtswirkung.
 *
 * /privacy IST ENGLISCH. Sie beschreibt, was DIESE Website mit den Daten
 * ihrer Besucherinnen tut – das ist eine Auskunft an die Leserin, und die
 * liest hier englisch. Anwaltlich geprueft ist sie nicht.
 *
 * ==========================================================================
 * FREIGABE IST GETEILT: Impressum und Privacy policy haben getrennte
 * Schalter, weil sie unterschiedlich weit sind.
 * ==========================================================================
 */

/**
 * Impressum freigegeben.
 *
 * true, seit die Angaben echt sind: Entwurfs-Balken und noindex entfallen auf
 * /impressum, die Seite steht wieder in der Sitemap.
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
 * Der EINE englische Satz auf /impressum.
 *
 * Er steht ueber den Pflichtangaben, nicht darunter: Wer die Seite auf einer
 * englischen Website oeffnet und Deutsch vorfindet, soll den Grund lesen,
 * bevor er sich fragt, ob er falsch abgebogen ist.
 *
 * Mehr Englisch gibt es auf dieser Seite nicht. Jeder weitere Satz waere der
 * Anfang einer zweiten Fassung.
 */
export const IMPRINT_LANGUAGE_NOTE =
  "This legal notice is provided in German, as required by German law.";

/**
 * Hinweis auf die Uebersetzung – steht auf /privacy.
 *
 * Eine englische Rechtsseite ohne diesen Satz erweckt den Eindruck, hier gaebe
 * es eine eigene, englischsprachige Rechtslage. Die gibt es nicht: Betreiber,
 * Sitz und anwendbares Recht sind deutsch.
 */
export const PRIVACY_TRANSLATION_NOTE =
  "German law applies; this is a translation of the German privacy policy.";

/**
 * Offener Punkt zur Betreiberangabe.
 *
 * Selyvi wird derzeit als Angebot eines Einzelunternehmens geführt. Sobald eine
 * Betreibergesellschaft gegründet ist, ändern sich Firmierung, Rechtsform,
 * Vertretung und Registereintrag – und damit sowohl das Impressum als auch der
 * Verantwortliche in der Privacy policy.
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
 * IDENTISCH MIT DER DEUTSCHEN SEITE – Feld für Feld, auch `country`.
 *
 * KEIN REGISTEREINTRAG: Rafael Gutmann betreibt Selyvi als Einzelunternehmen.
 * Einzelunternehmen ohne Kaufmannseigenschaft sind nicht im Handelsregister
 * eingetragen; `registerCourt` und `registerNumber` gibt es hier deshalb nicht
 * als Felder. Die Sektion „Registereintrag" wird auf der Seite ausgeblendet
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
  country: "Deutschland",
  // Übergangsadresse. Nach dem Domainkauf auf kontakt@selyvi.com umstellen –
  // eine Adresse auf der eigenen Domain wirkt in der Beschaffung seriöser.
  // Siehe README, NACH-LAUNCH-LISTE.
  //
  // Diese eine Zeile speist Impressum, Privacy policy (Verantwortlicher und
  // Betroffenenrechte), Footer-Kontaktspalte und die Fallback-Zeile im
  // Fehlerfall des Anfrageformulars.
  email: "selyvi.app@gmail.com",
  phone: "+49 (0)176 30136988",
  vatId: "DE455168590",
  contentResponsible: "Rafael Gutmann, Hauptstraße 33, 73550 Waldstetten, Deutschland",
};

/**
 * Rechtstexte des Impressums.
 *
 * DER WORTLAUT IST UNVERÄNDERT AUS DER VORLAGE ÜBERNOMMEN und deutsch. Diese
 * Abschnitte sind juristische Standardtexte, deren Formulierung Bedeutung hat –
 * wer sie anpasst, sollte das nicht nach Sprachgefühl tun, sondern nach
 * Rücksprache.
 *
 * Sie standen zwischenzeitlich übersetzt hier. Das ist zurückgenommen: Eine
 * englische Haftungsklausel neben einer deutschen Rechtslage ist keine
 * Serviceleistung, sondern eine zweite Fassung derselben Aussage.
 *
 * Alle vier Abschnitte sind gefüllt. Kommt ein weiterer dazu, gehört der
 * Wortlaut gleich mit hinein – ein Abschnitt mit leerem `body` würde nur eine
 * leere Überschrift rendern.
 */
export type LegalTextSection = {
  title: string;
  /** Wortlaut aus der Vorlage, deutsch. Leer = noch nicht übernommen. */
  body: string[];
};

export const imprintTextSections: LegalTextSection[] = [
  {
    title: "Haftung für Inhalte",
    body: [
      "Als Diensteanbieter sind wir gemäß § 5 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.",
    ],
  },
  {
    title: "Haftung für Links",
    body: [
      "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.",
    ],
  },
  {
    title: "Urheberrecht",
    body: [
      "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.",
    ],
  },
  {
    title: "Verbraucherstreitbeilegung / Universalschlichtungsstelle",
    body: [
      "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
    ],
  },
];
