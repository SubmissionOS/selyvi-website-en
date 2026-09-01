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
 * DIE WERTE BLEIBEN DEUTSCH – „demo" und „mitgestalten".
 *
 * Das ist kein Uebersehen. Das CRM erwartet genau diese beiden Zeichenketten
 * (`source` im Payload, siehe src/lib/demo/crm.ts); es sortiert Anfragen
 * danach ein. Sie zu uebersetzen hiesse, dass Anfragen von selyvi.com in einen
 * unbekannten Topf fallen.
 *
 * Uebersetzt ist ausschliesslich die BESCHRIFTUNG in SOURCE_LABELS – die steht
 * in der Betreffzeile und im Mailtext, und die liest ein Mensch.
 */
export const SOURCE_VALUES = ["demo", "mitgestalten"] as const;
export type SourceValue = (typeof SOURCE_VALUES)[number];

/** Beschriftung fuer die Mail. Keine Rohwerte in der Betreffzeile. */
export const SOURCE_LABELS: Record<SourceValue, string> = {
  demo: "Demo request",
  mitgestalten: "Co-create",
};

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

export type DemoFormValues = Record<DemoField, string>;

export const EMPTY_VALUES: DemoFormValues = {
  name: "",
  school: "",
  email: "",
  role: "",
  message: "",
};

/** Obergrenzen. Schuetzen die Weiterverarbeitung vor uebergrossen Eingaben. */
const LIMITS = {
  name: 100,
  school: 150,
  email: 254,
  message: 2000,
} as const;

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
}): ValidationResult {
  const fieldErrors: Partial<Record<DemoField | "consent", string>> = {};

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

  if (school.length < 2) {
    fieldErrors.school = "Please give us your school.";
  } else if (school.length > LIMITS.school) {
    fieldErrors.school = `The school name can be at most ${LIMITS.school} characters long.`;
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

  if (message.length > LIMITS.message) {
    fieldErrors.message = `The message can be at most ${LIMITS.message} characters long.`;
  }

  if (!form.consent) {
    fieldErrors.consent =
      "Without this consent we cannot process your request.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, values: { name, school, email, role, message } };
}
