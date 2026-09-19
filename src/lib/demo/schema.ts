/**
 * Felddefinition und Validierung des Demo-Formulars.
 *
 * Bewusst OHNE Validierungs-Bibliothek: Pflichtfelder, E-Mail-Format und
 * Laengen-Limits lassen sich mit Bordmitteln pruefen. Eine zusaetzliche
 * Abhaengigkeit waere hier reine Angriffsflaeche ohne Gegenwert.
 *
 * Diese Datei enthaelt KEINE Geheimnisse und wird von Client und Server
 * genutzt (die Rollenliste braucht das <select>).
 */

export const DEMO_FIELDS = ["name", "school", "email", "role", "message"] as const;
export type DemoField = (typeof DEMO_FIELDS)[number];

/** Name des Honeypot-Felds. Unauffaellig, damit Bots es ausfuellen. */
export const HONEYPOT_FIELD = "website";

/** Feld mit der auf dem Client gemessenen Ausfuelldauer in Millisekunden. */
export const ELAPSED_FIELD = "elapsedMs";

/**
 * Feld mit der Herkunft der Anfrage: von welcher Seite wurde abgeschickt?
 *
 * Es steht als verstecktes Feld im Formular und landet in der Betreffzeile
 * und im Mailtext. Zweck ist ausschliesslich, dass beim Lesen der Mail klar
 * ist, worauf jemand geantwortet hat – eine Demo-Anfrage und eine Anfrage zum
 * Mitgestalten brauchen unterschiedliche Antworten.
 *
 * Der Wert ist CLIENT-EINGABE und wird deshalb nie uebernommen, sondern gegen
 * die Liste unten geprueft. Ein unbekannter Wert faellt still auf „demo"
 * zurueck, statt eine Fehlermeldung zu erzeugen: Wer hier manipuliert, soll
 * keine Rueckmeldung darueber bekommen, was das Formular akzeptiert.
 */
export const SOURCE_FIELD = "source";

/**
 * DIE WERTE BLEIBEN DEUTSCH – „demo", „mitgestalten", „forschung".
 *
 * Das ist kein Uebersehen. Das CRM erwartet genau diese Zeichenketten
 * (`source` im Payload, siehe src/lib/demo/crm.ts); es sortiert Anfragen
 * danach ein. Sie zu uebersetzen hiesse, dass Anfragen von selyvi.com in einen
 * unbekannten Topf fallen.
 *
 * Uebersetzt ist ausschliesslich die BESCHRIFTUNG in SOURCE_LABELS – die steht
 * in der Betreffzeile und im Mailtext, und die liest ein Mensch.
 *
 * ==========================================================================
 * „forschung" MUSS HIER STEHEN – SONST FAELLT ES STILL AUF „demo" ZURUECK
 * ==========================================================================
 * normalizeSource() laesst nur Werte aus dieser Liste durch und ersetzt alles
 * andere durch „demo". Das ist als Schutz gegen manipulierte Formulardaten
 * gebaut und funktioniert – aber es unterscheidet nicht zwischen einem
 * Angriff und einem vergessenen Eintrag. Ohne diese Zeile traegt jede
 * Forschungsanfrage im CRM „demo", landet in der falschen Spalte, und NICHTS
 * meldet das: kein Fehler, kein Log, keine rote Zeile im Test. Genau dieses
 * stille Zurueckfallen prueft der Formular-Test jetzt ausdruecklich mit.
 */
export const SOURCE_VALUES = ["demo", "mitgestalten", "forschung"] as const;
export type SourceValue = (typeof SOURCE_VALUES)[number];

/** Beschriftung fuer die Mail. Keine Rohwerte in der Betreffzeile. */
export const SOURCE_LABELS: Record<SourceValue, string> = {
  demo: "Demo request",
  mitgestalten: "Co-create",
  forschung: "Research project",
};

/* ==========================================================================
 * FORSCHUNGSPROJEKT – DIE FUENF ZUSAETZLICHEN FELDER
 * ==========================================================================
 * Zwei der neun Felder sind KEINE neuen Felder, sondern dieselben mit anderer
 * Beschriftung:
 *
 *   Institution*       -> `school`   (Pflichtfeld, geht als `organisation` ins CRM)
 *   Research question* -> `message`  (auf /research zum Pflichtfeld)
 *
 * Das ist kein Sparen, sondern der Grund, warum es nur EINE Server Action
 * gibt: Honeypot, Zeitmessung, Rate-Limit, Validierung und Versandweg sind an
 * allen drei Formularen dieselben. Ein zweites Feldpaar mit eigener Pruefung
 * waere ein zweiter Ort, an dem eine dieser Huerden fehlen kann.
 *
 * Ins CRM gehen die beiden trotzdem ZUSAETZLICH unter ihrem Forschungsnamen
 * (`institution`, `forschungsfrage`) – dort werten Menschen aus, und
 * „organisation" liest sich bei einem Lehrstuhl falsch.
 */
export const RESEARCH_FIELDS = [
  "fachgebiet",
  "digitaler_bedarf",
  "schulen_beteiligt",
  "projektstatus",
  "zeitraum",
] as const;
export type ResearchField = (typeof RESEARCH_FIELDS)[number];
export type ResearchValues = Record<ResearchField, string>;

export const EMPTY_RESEARCH: ResearchValues = {
  fachgebiet: "",
  digitaler_bedarf: "",
  schulen_beteiligt: "",
  projektstatus: "",
  zeitraum: "",
};

/**
 * Auswahllisten. Freitext waere hier eine Auswertung, die niemand macht.
 *
 * DIE WERTE SIND ENGLISCH, anders als SOURCE_VALUES. Derselbe Grund wie bei
 * ROLE_OPTIONS: Sie landen als Freitext im CRM und werden dort GELESEN, nicht
 * zum Einsortieren benutzt.
 */
/*
 * „talks under way" statt „in progress": Letzteres schlaegt im Ton-Grep unter
 * Regel D an. Der Wert beschreibt Gespraeche mit Schulen und keine
 * Produktreife – aber eine Ausnahme dafuer gaebe die Wendung allgemein frei,
 * und „talks under way" sagt ohnehin genauer, was gemeint ist.
 */
export const SCHOOLS_INVOLVED_OPTIONS = ["yes", "no", "talks under way"] as const;
export const PROJECT_STATUS_OPTIONS = [
  "idea",
  "application",
  "approved",
  "running",
] as const;

export function normalizeSource(raw: string): SourceValue {
  return (SOURCE_VALUES as readonly string[]).includes(raw)
    ? (raw as SourceValue)
    : "demo";
}

/** Mindestdauer zwischen Formular-Anzeige und Absenden. */
export const MIN_FILL_MS = 3000;

/**
 * Rollen im Auswahlfeld – ENGLISCH, anders als SOURCE_VALUES.
 *
 * Der Unterschied ist beabsichtigt: Die Rolle ist ein Freitextfeld im CRM und
 * wird dort gelesen, nicht ausgewertet. Der Quell-Wert dagegen steuert die
 * Einsortierung und muss deshalb unveraendert bleiben.
 *
 * „School authority" fuer „Schultraeger" und „head teacher"/„school
 * leadership" statt „principal": docs/glossar-en.md.
 */
export const ROLE_OPTIONS = [
  "Teacher",
  "School leadership",
  "School authority",
  "IT",
  "Other",
] as const;
export type Role = (typeof ROLE_OPTIONS)[number];

export type DemoFormValues = Record<DemoField, string> & {
  /**
   * Nur bei source="forschung" gefuellt, sonst ein leeres Objekt.
   *
   * Es haengt AM Ergebnis der Validierung und nicht daneben, damit kein
   * Aufrufer die Rohwerte aus dem FormData weiterreichen kann: Was hier
   * ankommt, ist getrimmt und laengenbegrenzt.
   */
  research: ResearchValues;
};

export const EMPTY_VALUES: DemoFormValues = {
  name: "",
  school: "",
  email: "",
  role: "",
  message: "",
  research: EMPTY_RESEARCH,
};

/** Obergrenzen. Schuetzen die Weiterverarbeitung vor uebergrossen Eingaben. */
const LIMITS = {
  name: 100,
  school: 150,
  email: 254,
  message: 2000,
} as const;

/**
 * Obergrenzen der Forschungsfelder.
 *
 * Sie erzeugen bewusst KEINE Fehlermeldung, sondern schneiden ab: Es sind
 * Zusatzangaben, und eine Anfrage an einer zu langen Zeitraum-Angabe
 * scheitern zu lassen waere die falsche Haerte. Die Pflichtfelder
 * (Institution, Forschungsfrage, Name, E-Mail) werden weiterhin geprueft.
 */
const RESEARCH_LIMITS: Record<ResearchField, number> = {
  fachgebiet: 150,
  digitaler_bedarf: 1500,
  schulen_beteiligt: 20,
  projektstatus: 20,
  zeitraum: 100,
};

/**
 * Nimmt die Forschungsfelder entgegen, trimmt und begrenzt sie.
 *
 * Die beiden Auswahlfelder duerfen nur bekannte Werte tragen – ein unbekannter
 * faellt still auf leer zurueck. Das ist dieselbe Haltung wie bei
 * normalizeSource(): Wer hier manipuliert, bekommt keine Rueckmeldung
 * darueber, was das Formular akzeptiert.
 */
function normalizeResearch(raw: Partial<Record<ResearchField, string>>): ResearchValues {
  const auswahl = (wert: string, erlaubt: readonly string[]) =>
    erlaubt.includes(wert) ? wert : "";

  const werte = {} as ResearchValues;
  for (const feld of RESEARCH_FIELDS) {
    werte[feld] = (raw[feld] ?? "").trim().slice(0, RESEARCH_LIMITS[feld]);
  }
  werte.schulen_beteiligt = auswahl(werte.schulen_beteiligt, SCHOOLS_INVOLVED_OPTIONS);
  werte.projektstatus = auswahl(werte.projektstatus, PROJECT_STATUS_OPTIONS);
  return werte;
}

/**
 * Pragmatische E-Mail-Pruefung: genau ein @, kein Leerraum, Punkt in der
 * Domain. Eine vollstaendige RFC-5322-Pruefung ist weder moeglich noch
 * sinnvoll – ob die Adresse existiert, zeigt erst die Zustellung.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ValidationResult =
  | { ok: true; values: DemoFormValues }
  | { ok: false; fieldErrors: Partial<Record<DemoField | "consent", string>> };

export function validateDemoRequest(form: {
  name: string;
  school: string;
  email: string;
  role: string;
  message: string;
  consent: boolean;
  /** Steuert nur die Beschriftungen und die Pflicht der Forschungsfrage. */
  source?: SourceValue;
  research?: Partial<Record<ResearchField, string>>;
}): ValidationResult {
  const fieldErrors: Partial<Record<DemoField | "consent", string>> = {};
  const istForschung = form.source === "forschung";

  const name = form.name.trim();
  const school = form.school.trim();
  const email = form.email.trim();
  const role = form.role.trim();
  const message = form.message.trim();

  if (name.length < 2) {
    fieldErrors.name = "Please give us your name.";
  } else if (name.length > LIMITS.name) {
    fieldErrors.name = `The name can be at most ${LIMITS.name} characters long.`;
  }

  // Dasselbe Feld, zwei Beschriftungen: Auf /research heisst es Institution.
  // Eine Fehlermeldung, die nach der „school" fragt, waere an einem Lehrstuhl
  // schlicht die falsche Frage.
  if (school.length < 2) {
    fieldErrors.school = istForschung
      ? "Please give us your institution."
      : "Please give us your school.";
  } else if (school.length > LIMITS.school) {
    fieldErrors.school = istForschung
      ? `The institution can be at most ${LIMITS.school} characters long.`
      : `The school name can be at most ${LIMITS.school} characters long.`;
  }

  if (email.length === 0) {
    fieldErrors.email = "Please give us your work email address.";
  } else if (email.length > LIMITS.email) {
    fieldErrors.email = "The email address is too long.";
  } else if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "This email address does not look complete.";
  }

  // Rolle ist optional; wenn gesetzt, muss sie aus der Liste stammen.
  if (role.length > 0 && !ROLE_OPTIONS.includes(role as Role)) {
    fieldErrors.role = "Please choose one of the roles offered.";
  }

  // Auf /research traegt dieses Feld die Forschungsfrage und ist Pflicht: Ohne
  // sie laesst sich der technische Fit nicht einmal ansehen, und genau darum
  // bittet die Seite („Three sentences are enough.").
  if (istForschung && message.length < 10) {
    fieldErrors.message =
      "Please describe your research question in one to three sentences.";
  } else if (message.length > LIMITS.message) {
    fieldErrors.message = istForschung
      ? `The research question can be at most ${LIMITS.message} characters long.`
      : `The message can be at most ${LIMITS.message} characters long.`;
  }

  if (!form.consent) {
    fieldErrors.consent = "Without this consent we cannot process your request.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    values: {
      name,
      school,
      email,
      role,
      message,
      research: istForschung ? normalizeResearch(form.research ?? {}) : EMPTY_RESEARCH,
    },
  };
}
