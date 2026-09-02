import type { Metadata } from "next";

import { PRODUCT_NAME } from "@/config/brand";
import { IMPRINT_READY, PRIVACY_APPROVED } from "@/config/legal";

/**
 * Zentrale SEO-Konfiguration der ENGLISCHEN Website.
 *
 * Eine Quelle für Titel, Beschreibungen, Canonical-URLs, Open Graph, hreflang
 * und Sitemap. Seiten holen ihre Metadaten hier ab, statt sie selbst zu
 * formulieren – so koennen Seitentitel und Sitemap nicht auseinanderlaufen.
 */

/**
 * Basis-URL dieser Website.
 *
 * Fest auf selyvi.com. Das ist kein Platzhalter mehr: Die englische Fassung
 * hat eine eigene Domain und ein eigenes Deployment, die deutsche Fassung
 * liegt unveraendert auf selyvi.de.
 */
export const SITE_URL = "https://selyvi.com";

/** Basis-URL der deutschen Schwester-Website – gebraucht fuer hreflang. */
export const SITE_URL_DE = "https://selyvi.de";

/**
 * og:locale.
 *
 * "en_GB", nicht "en_US" – und das ist eine Entscheidung, keine Gewohnheit.
 *
 * docs/glossar-en.md legt internationales Englisch fest, ausdruecklich weder
 * US- noch UK-spezifisch. Open Graph kennt aber kein neutrales Englisch: Das
 * Feld verlangt einen Sprach-Land-Code. Von den beiden verfuegbaren liegt
 * en_GB naeher an dem, was auf der Seite tatsaechlich steht.
 *
 * Zwei Gruende:
 *   1. Die Rechtschreibung folgt der britischen Konvention – "labelled",
 *      "organisation", "recognise". Sie steht so im Glossar und im Text.
 *   2. Das Glossar verbietet die US-Begriffe an genau den Stellen, an denen
 *      sich beide Varianten unterscheiden: "elementary school", "principal",
 *      "faculty", "grades" als Leitbegriff. Ein en_US-Signal wuerde eine
 *      Wortwahl ankuendigen, die die Seite bewusst nicht verwendet.
 *
 * Fuer Leserinnen ausserhalb Grossbritanniens aendert der Wert nichts:
 * og:locale zeichnet die Sprache der Vorschau aus, es steuert keine
 * Auslieferung.
 */
export const SITE_LOCALE = "en_GB";

/** BCP-47-Code fuer <html lang> und hreflang. */
export const SITE_LANG = "en";

/**
 * Absolute URL zu einem Pfad.
 *
 * Canonical, og:url und Sitemap gehen alle hierdurch. Sonst entstehen
 * Abweichungen, die niemand bemerkt – etwa die Startseite einmal mit und
 * einmal ohne abschliessenden Schrägstrich.
 */
export function absoluteUrl(path: string, base: string = SITE_URL): string {
  const url = new URL(path, base).toString();

  // Next.js gibt Canonical-URLs ohne abschliessenden Schrägstrich aus und
  // normalisiert dabei auch die Startseite. Damit Canonical, og:url und
  // Sitemap zeichengleich sind, wird hier genauso normalisiert – sonst nennt
  // die Sitemap "…selyvi.com/" und das Canonical "…selyvi.com".
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Vorschaubild für alle Seiten (src/app/opengraph-image.tsx).
 *
 * Wird bewusst EXPLIZIT gesetzt und nicht der Vererbung überlassen: Sobald
 * eine Seite ein eigenes `openGraph`-Objekt exportiert, ersetzt das die
 * Zuweisung aus dem Layout – samt des automatisch eingehängten Bildes. Ohne
 * diesen Eintrag hätten alle Unterseiten kein og:image.
 */
export const OG_IMAGE = {
  // Das ?v= dient dem Cache-Busting: Soziale Netzwerke merken sich
  // Vorschaubilder lange. Nach einem Austausch des Motivs die Zahl erhoehen,
  // dann holen die Plattformen es neu.
  // v=4 seit der englischen Fassung: Motiv und Untertitel sind englisch, und
  // soziale Netzwerke wuerden sonst das deutsche Bild weiterzeigen.
  url: "/opengraph-image?v=4",
  width: 1200,
  height: 630,
  alt: `${PRODUCT_NAME} – the AI assistant for teachers`,
};

/** Titel der Startseite. Alle anderen Seiten: "Seitentitel – <Produktname>". */
export const HOME_TITLE = `${PRODUCT_NAME} – the AI assistant for teachers`;

export type RouteMeta = {
  path: string;
  /**
   * Deutscher Pfad derselben Seite auf selyvi.de.
   *
   * Zwei Aufgaben: Er speist das hreflang-Paar, und er ist dieselbe Zuordnung,
   * aus der next.config.ts die 308-Umleitungen erzeugt. Wer hier einen Pfad
   * aendert, muss dort mitziehen.
   */
  germanPath: string;
  /** Ohne Namenszusatz. Leer bei der Startseite, die HOME_TITLE traegt. */
  title: string;
  /**
   * Ein bis zwei Saetze, abgeleitet aus den Intro-Texten der jeweiligen Seite.
   * Bewusst nichts Neues: Was in der Suchergebnisliste steht, muss die Seite
   * auch einloesen.
   */
  description: string;
  /**
   * Rechtsseite mit eigenem Freigabeschalter.
   * "imprint"  -> IMPRINT_READY
   * "privacy"  -> PRIVACY_APPROVED
   * Nicht freigegeben bedeutet: noindex und kein Sitemap-Eintrag.
   */
  legalGate?: "imprint" | "privacy";
  /**
   * Keine hreflang-Auszeichnung fuer diese Route.
   *
   * NUR /impressum. Der Grund ist nicht Bequemlichkeit, sondern Bedeutung:
   * hreflang sagt „dieselbe Seite in einer ANDEREN Sprache". Das Impressum
   * auf selyvi.com ist aber deutsch – es waere dieselbe Seite in DERSELBEN
   * Sprache, und ein `hreflang="en"` auf einer deutschen Seite ist schlicht
   * eine Falschangabe.
   *
   * Beide Domains muessen ihr eigenes Impressum tragen (§ 5 DDG verlangt es
   * auf dem Dienst selbst), ein Canonical von der einen auf die andere
   * scheidet also aus. Uebrig bleibt: Selbst-Canonical, keine Alternates.
   */
  noAlternates?: boolean;
  priority: number;
};

export const routes: RouteMeta[] = [
  {
    path: "/",
    germanPath: "/",
    title: "",
    // Beginnt wortgleich mit der H1: Wer den Teilen-Vorschau-Text liest und
    // danach die Seite oeffnet, findet denselben Satz wieder.
    description: `Paperwork just got an assistant. ${PRODUCT_NAME} is the AI assistant for teachers that keeps learning – observations from the lesson turn into report comments, parent emails and matching materials. In your words, not in AI words.`,
    priority: 1,
  },
  {
    path: "/for-teachers",
    germanPath: "/fuer-lehrkraefte",
    title: "For teachers",
    description:
      "Four areas: documentation, communication, teaching and steering. What you capture in passing during a lesson becomes the basis of the text on report day – and decides which materials fit the class.",
    priority: 0.9,
  },
  {
    path: "/for-school-leadership",
    germanPath: "/schulen",
    title: "For school leadership",
    description: `${PRODUCT_NAME} takes the writing off your staff on report day and before parents' evenings. The workload relief report shows the hours saved per month – as a PDF for your school authority.`,
    priority: 0.9,
  },
  {
    path: "/research",
    germanPath: "/forschung",
    title: "Research & impact",
    description:
      "Impact is something we want to evidence, not assert: a survey model along the PHINEO impact staircase, three survey waves, consent granular by purpose. We are looking for research partners who want to look closely.",
    priority: 0.7,
  },
  {
    path: "/security",
    germanPath: "/datenschutz-sicherheit",
    title: "Data protection & security",
    description:
      "Strict data separation within the teaching staff, no parent or pupil portal, no sharing of pupil data. Principles, data processing and open points at a glance.",
    priority: 0.8,
  },
  {
    path: "/our-story",
    germanPath: "/ueber-uns",
    title: "Our story",
    description: `It started at the kitchen table of a trainee primary school teacher: behind ${PRODUCT_NAME} stands a team from product, engineering and classroom practice. We want to take administrative work off teachers – not the responsibility.`,
    priority: 0.6,
  },
  {
    path: "/preview",
    germanPath: "/einblick",
    title: "Take a look",
    description:
      "A guided look with sample data: record an observation, watch a report text grow out of it, rearrange the seating plan. Four of eight areas are open.",
    priority: 0.8,
  },
  {
    path: "/co-create",
    germanPath: "/mitgestalten",
    // Nicht „Co-create Selyvi": fullTitle() haengt den Produktnamen an, und
    // „Co-create Selyvi – Selyvi" nennt ihn zweimal.
    title: "Co-create",
    description: `${PRODUCT_NAME} was built with teachers and only grows that way. Whoever is there early shapes what gets built – no contract, no pressure to buy.`,
    priority: 0.7,
  },
  {
    path: "/meet",
    germanPath: "/demo",
    // Nicht „Meet Selyvi": fullTitle() haengt den Produktnamen an, und
    // „Meet Selyvi – Selyvi" nennt ihn zweimal. Der Knopf heisst weiterhin
    // „Meet Selyvi" – nur der Seitentitel weicht aus.
    title: "Meet us",
    description:
      "In 20 minutes we show you the real interface – no video, no slides. Your questions come first.",
    priority: 0.9,
  },
  {
    // DEUTSCH, auch hier. Die Pflichtangaben nach § 5 DDG sind die Angaben
    // eines deutschen Unternehmens und gelten im deutschen Wortlaut – siehe
    // src/config/legal.ts. /legal-notice leitet mit 308 hierher.
    //
    // Titel und Beschreibung sind deshalb ebenfalls deutsch: Was in der
    // Suchergebnisliste steht, muss die Seite einloesen, und die Seite ist
    // deutsch. Ein englischer Titel ueber einer deutschen Seite waere genau
    // die Irrefuehrung, die der Sprachhinweis oben auf der Seite vermeidet.
    path: "/impressum",
    germanPath: "/impressum",
    noAlternates: true,
    title: "Impressum",
    description: `Angaben gemäß § 5 DDG zu ${PRODUCT_NAME}. Diese Seite ist deutsch, wie es das deutsche Recht verlangt.`,
    legalGate: "imprint",
    priority: 0.1,
  },
  {
    path: "/privacy",
    germanPath: "/datenschutz",
    title: "Privacy policy",
    description: `Privacy policy for ${PRODUCT_NAME} under Article 13 GDPR.`,
    legalGate: "privacy",
    priority: 0.1,
  },
];

export function routeFor(path: string): RouteMeta {
  const route = routes.find((entry) => entry.path === path);
  if (!route) {
    // Faellt beim Build auf, nicht erst im Betrieb.
    throw new Error(`Keine SEO-Konfiguration für die Route "${path}" hinterlegt.`);
  }
  return route;
}

/** Vollstaendiger Seitentitel inklusive Namenszusatz. */
export function fullTitle(route: RouteMeta): string {
  return route.path === "/" ? HOME_TITLE : `${route.title} – ${PRODUCT_NAME}`;
}

/**
 * hreflang-Paar fuer eine Route.
 *
 * BEIDSEITIG UND VOLLSTAENDIG: Jede Seite nennt sich selbst (en), ihre
 * deutsche Entsprechung (de) und das Ziel fuer alle uebrigen Sprachen
 * (x-default). Fehlt eine der drei Angaben, wertet Google die Auszeichnung als
 * unvollstaendig und ignoriert sie – dann konkurrieren selyvi.com und
 * selyvi.de um dieselbe Suchanfrage, statt sich zu ergaenzen.
 *
 * x-default zeigt auf die englische Seite: Wer weder Deutsch noch eine
 * bekannte Sprache signalisiert, ist eher international als deutsch.
 *
 * WICHTIG – DIE DEUTSCHE SEITE MUSS DASSELBE PAAR ZURUECKGEBEN. hreflang wirkt
 * nur, wenn beide Seiten aufeinander zeigen. Auf selyvi.de gehoert deshalb
 * dieselbe Zuordnung hinterlegt, mit vertauschten Rollen. Solange das dort
 * fehlt, ist die Auszeichnung hier einseitig und bleibt wirkungslos – der
 * Punkt steht in der NACH-LAUNCH-LISTE der README.
 */
export function alternateLanguages(route: RouteMeta): Record<string, string> {
  return {
    en: absoluteUrl(route.path),
    de: absoluteUrl(route.germanPath, SITE_URL_DE),
    "x-default": absoluteUrl(route.path),
  };
}

/**
 * Ist eine Route indexierbar?
 *
 * Rechtsseiten haengen an ihrem eigenen Schalter. Genau diese Funktion steuert
 * sowohl das noindex im HTML als auch den Sitemap-Eintrag – beide koennen
 * dadurch nicht auseinanderlaufen.
 */
export function isIndexable(route: RouteMeta): boolean {
  if (route.legalGate === "imprint") return IMPRINT_READY;
  if (route.legalGate === "privacy") return PRIVACY_APPROVED;
  return true;
}

/** Routen, die in die Sitemap gehoeren. */
export function indexableRoutes(): RouteMeta[] {
  return routes.filter(isIndexable);
}

/**
 * Metadaten für eine Seite.
 *
 * Setzt Titel, Beschreibung, Canonical, hreflang und Open Graph aus einer
 * Quelle. Rechtsseiten bekommen automatisch noindex, solange ihr
 * Freigabeschalter false ist. isIndexable() steuert noindex und Sitemap
 * gemeinsam.
 */
export function pageMetadata(path: string): Metadata {
  const route = routeFor(path);
  const title = fullTitle(route);
  const noindex = !isIndexable(route);

  return {
    // absolute: umgeht die Titel-Vorlage aus dem Root-Layout, damit der
    // Namenszusatz nicht doppelt erscheint.
    title: { absolute: title },
    description: route.description,
    alternates: {
      canonical: absoluteUrl(route.path),
      // /impressum bekommt keine – es ist deutsch, siehe noAlternates.
      ...(route.noAlternates ? {} : { languages: alternateLanguages(route) }),
    },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      siteName: PRODUCT_NAME,
      url: absoluteUrl(route.path),
      title,
      description: route.description,
      images: [OG_IMAGE],
    },
    ...(noindex ? { robots: "noindex" } : {}),
  };
}
