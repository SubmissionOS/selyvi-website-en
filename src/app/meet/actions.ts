"use server";

import { headers } from "next/headers";

import {
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  normalizeSource,
  SOURCE_FIELD,
  validateDemoRequest,
} from "@/lib/demo/schema";
import type { DemoFormState } from "@/lib/demo/state";
import { checkRateLimit } from "@/lib/demo/rate-limit";
import { sendDemoRequest } from "@/lib/demo/brevo";
import { sendLeadToCrm } from "@/lib/demo/crm";
import { ORIGIN_FIELDS, sanitizeOrigin } from "@/lib/demo/origin";

/**
 * Server Action für das Demo-Formular.
 *
 * Läuft ausschliesslich auf dem Server. Alles, was mit Zugangsdaten zu tun hat,
 * bleibt hinter dieser Grenze – der Client sieht nur den Rueckgabewert.
 *
 * Reihenfolge der Pruefungen ist Absicht: Erst die billigen Abwehrmassnahmen
 * (Honeypot, Zeit, Rate-Limit), dann die Validierung, dann der Versand.
 *
 * WICHTIG: Diese Datei darf ausser async-Funktionen NICHTS exportieren – weder
 * Konstanten noch Objekte. Typ und Startwert des Zustands liegen deshalb in
 * src/lib/demo/state.ts.
 */

/**
 * Bots, die das Formular blind absenden, bekommen dieselbe Antwort wie eine
 * erfolgreiche Anfrage. Ein ehrliches „abgelehnt“ waere eine Rueckmeldung, mit
 * der sich die Erkennung austesten laesst.
 */
const SILENT_SUCCESS: DemoFormState = {
  status: "success",
};

function clientIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    // Erster Eintrag ist die urspruengliche Client-IP.
    return forwarded.split(",")[0]!.trim();
  }
  return headerList.get("x-real-ip")?.trim() || "unknown";
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitDemoRequest(
  _previousState: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  // 1. Honeypot – fuer Menschen unsichtbar, fuer Formular-Bots verlockend.
  if (readString(formData, HONEYPOT_FIELD).trim().length > 0) {
    console.warn("[demo] Anfrage verworfen: Honeypot ausgefüllt.");
    return SILENT_SUCCESS;
  }

  // 2. Zeitcheck. Die Dauer wird auf dem Client zwischen Anzeige und Absenden
  //    gemessen; dadurch entstehen keine Probleme durch abweichende Uhren.
  //    Der Wert ist manipulierbar – das ist eine Huerde gegen einfache
  //    Skripte, keine Sicherheitsmassnahme.
  const elapsed = Number.parseInt(readString(formData, ELAPSED_FIELD), 10);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    console.warn("[demo] Anfrage verworfen: zu schnell abgesendet.", elapsed);
    return SILENT_SUCCESS;
  }

  // 3. Rate-Limit pro IP.
  const headerList = await headers();
  const limit = checkRateLimit(clientIp(headerList));
  if (!limit.allowed) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterMs / 60000));
    return {
      status: "error",
      message: `Several requests have already come in from this connection. Please try again in ${minutes} minutes.`,
    };
  }

  // 4. Inhaltliche Validierung.
  const result = validateDemoRequest({
    name: readString(formData, "name"),
    school: readString(formData, "school"),
    email: readString(formData, "email"),
    role: readString(formData, "role"),
    message: readString(formData, "message"),
    consent: formData.get("consent") === "on",
  });

  if (!result.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: result.fieldErrors,
    };
  }

  // 5. Herkunft der Anfrage. Alles hier ist Client-Eingabe aus versteckten
  //    Feldern: normalizeSource() laesst nur bekannte Werte durch und faellt
  //    sonst still auf „demo" zurueck, sanitizeOrigin() prueft Laengen und
  //    Zeichen jedes Feldes einzeln und verwirft, was nicht passt.
  const source = normalizeSource(readString(formData, SOURCE_FIELD));
  const origin = sanitizeOrigin({
    utm_source: readString(formData, ORIGIN_FIELDS.utmSource),
    utm_medium: readString(formData, ORIGIN_FIELDS.utmMedium),
    utm_campaign: readString(formData, ORIGIN_FIELDS.utmCampaign),
    referrer: readString(formData, ORIGIN_FIELDS.referrer),
    page_path: readString(formData, ORIGIN_FIELDS.pagePath),
  });

  // 6. Zwei Wege, gleichzeitig.
  //
  //    ==================================================================
  //    DIE MAIL ENTSCHEIDET, DAS CRM NICHT
  //    ==================================================================
  //    Nur das Ergebnis von Brevo bestimmt, was die anfragende Person zu
  //    sehen bekommt. Ein Fehler bei der CRM-Uebergabe wird geloggt und
  //    sonst nichts – die Mail liegt dann bereits im Postfach, die Anfrage
  //    ist also angekommen. Sie deswegen als gescheitert zu melden waere
  //    schlicht falsch, und die Person wuerde ein zweites Mal absenden.
  //
  //    `allSettled` statt `all`: `all` bricht beim ERSTEN abgelehnten
  //    Versprechen ab und liesse den anderen Weg unbeachtet weiterlaufen.
  //    sendLeadToCrm() faengt zwar selbst alles ab – aber diese Zusage darf
  //    nicht die einzige Absicherung sein.
  const [mailErgebnis, crmErgebnis] = await Promise.allSettled([
    sendDemoRequest(result.values, source),
    sendLeadToCrm({ values: result.values, source, origin }),
  ]);

  if (crmErgebnis.status === "rejected") {
    // Sollte unerreichbar sein – sendLeadToCrm() wirft nicht. Wenn diese
    // Zeile doch einmal laeuft, ist die Zusage dort gebrochen.
    console.error("[crm] Übergabe warf unerwartet.");
  }

  const sent =
    mailErgebnis.status === "fulfilled"
      ? mailErgebnis.value
      : ({ ok: false, reason: "send-failed" } as const);

  if (mailErgebnis.status === "rejected") {
    console.error("[demo] Versand warf unerwartet.");
  }

  if (!sent.ok) {
    return {
      status: "error",
      message:
        sent.reason === "not-configured"
          ? "Sending is not set up at the moment. Your request was not submitted."
          : "Your request could not be submitted just now. Please try again.",
    };
  }

  return { status: "success" };
}
