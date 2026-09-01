/**
 * Herkunft einer Formular-Anfrage: Kampagnen-Parameter, verweisende Seite,
 * Pfad der Seite, auf der abgeschickt wurde.
 *
 * ==========================================================================
 * DIE DSGVO-LINIE DIESER SEITE BLEIBT UNVERÄNDERT
 * ==========================================================================
 * Diese Werte werden EINMAL beim Anzeigen des Formulars aus der bereits
 * geladenen Seite abgelesen und mit dem Formular verschickt. Kein Cookie,
 * kein localStorage, keine Kennung, kein Abgleich über mehrere Aufrufe. Was
 * hier entsteht, existiert nur als Teil DIESER einen Anfrage – genau wie der
 * Name, den jemand ins Formular tippt.
 *
 * /privacy, Abschnitt 5 („Keine Cookies, kein Tracking") bleibt damit
 * wahr. Wer das ändert, ändert diesen Abschnitt mit – oder lässt es.
 *
 * ==========================================================================
 * ALLES HIER IST CLIENT-EINGABE
 * ==========================================================================
 * Die Werte stehen in versteckten Feldern und sind damit so vertrauenswürdig
 * wie jedes andere Formularfeld: gar nicht. Der Server übernimmt keinen
 * Rohwert, sondern lässt jeden einzeln durch die Prüfungen unten laufen. Was
 * nicht passt, wird still verworfen – ein leerer Wert ist harmlos, ein
 * durchgereichter nicht.
 *
 * Warum still und nicht als Fehlermeldung: Diese Felder füllt niemand von
 * Hand aus. Eine Fehlermeldung darüber wäre für die anfragende Person
 * unverständlich und für ein Skript eine Rückmeldung darüber, was durchkommt.
 *
 * Die Datei enthält KEINE Geheimnisse und wird von Client und Server genutzt.
 */

export const ORIGIN_FIELDS = {
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  referrer: "referrer",
  pagePath: "page_path",
} as const;

export type OriginField = (typeof ORIGIN_FIELDS)[keyof typeof ORIGIN_FIELDS];

/** Alle Feldnamen als Liste – für die versteckten Felder im Formular. */
export const ORIGIN_FIELD_NAMES = Object.values(ORIGIN_FIELDS);

export type OriginValues = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  page_path: string;
};

export const EMPTY_ORIGIN: OriginValues = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  referrer: "",
  page_path: "",
};

/**
 * Obergrenzen. Sie sind großzügiger als jede echte Kampagne und trotzdem eng
 * genug, dass niemand über ein verstecktes Feld ein Kilobyte in unser CRM
 * schreibt.
 */
const LIMITS = {
  utm: 64,
  referrer: 512,
  path: 128,
} as const;

/**
 * Kampagnen-Parameter: Buchstaben, Ziffern und die Trennzeichen, die in
 * UTM-Werten üblich sind. Kein Prozentzeichen – der Wert kommt bereits
 * dekodiert aus URLSearchParams, ein danach noch enthaltenes „%" wäre ein
 * Zeichen, das dort nichts zu suchen hat.
 */
const UTM_PATTERN = /^[A-Za-z0-9._+ -]+$/;

/** Pfade dieser Website. Keine Query, kein Fragment, kein Doppelpunkt. */
const PATH_PATTERN = /^\/[A-Za-z0-9\-._~/]*$/;

export function sanitizeUtm(raw: string): string {
  const value = raw.trim();
  if (value.length === 0 || value.length > LIMITS.utm) return "";
  return UTM_PATTERN.test(value) ? value : "";
}

export function sanitizePagePath(raw: string): string {
  const value = raw.trim();
  if (value.length === 0 || value.length > LIMITS.path) return "";
  return PATH_PATTERN.test(value) ? value : "";
}

/**
 * Verweisende Seite.
 *
 * Behalten wird ausschliesslich Herkunft und Pfad. Query und Fragment fallen
 * WEG – und das ist keine Kosmetik: In einem Referrer stehen regelmäßig
 * Suchbegriffe, Sitzungskennungen oder E-Mail-Adressen aus fremden Systemen.
 * Sie hätten in unserem CRM nichts verloren, wir hätten sie nie angefordert,
 * und niemand hätte ihnen zugestimmt.
 *
 * Nur http und https. Ein „javascript:"- oder „data:"-Wert kommt hier nie
 * durch, auch wenn ihn jemand von Hand in das versteckte Feld schreibt.
 */
export function sanitizeReferrer(raw: string): string {
  const value = raw.trim();
  if (value.length === 0 || value.length > LIMITS.referrer) return "";

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "";
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return "";

  const gekuerzt = `${url.origin}${url.pathname}`;
  return gekuerzt.length > LIMITS.referrer ? "" : gekuerzt;
}

/** Wendet auf jedes Feld die passende Prüfung an. */
export function sanitizeOrigin(raw: Record<OriginField, string>): OriginValues {
  return {
    utm_source: sanitizeUtm(raw.utm_source),
    utm_medium: sanitizeUtm(raw.utm_medium),
    utm_campaign: sanitizeUtm(raw.utm_campaign),
    referrer: sanitizeReferrer(raw.referrer),
    page_path: sanitizePagePath(raw.page_path),
  };
}
