import { SOURCE_LABELS, type DemoFormValues, type SourceValue } from "@/lib/demo/schema";

/**
 * Versand der Demo-Anfrage über die Brevo-API (EU-Anbieter).
 *
 * SICHERHEIT – BREVO_API_KEY:
 * Der Schlüssel wird ausschliesslich hier gelesen. Diese Datei wird nur aus
 * einer "use server"-Datei importiert und landet damit nie im Client-Bundle.
 * Der Name traegt bewusst KEIN NEXT_PUBLIC_-Praefix – Next.js inlined nur so
 * praefixierte Variablen in den Browser-Code. Nach jedem Build gegenpruefen:
 *
 *   grep -r "BREVO_API_KEY" .next/static
 *
 * Keine Ausgabe = der Schluessel ist nicht im ausgelieferten JavaScript.
 *
 * Der Schluessel darf ausserdem niemals in eine Fehlermeldung geraten, die den
 * Client erreicht. Fehler werden hier geloggt und nach aussen nur als
 * generischer Status zurueckgegeben.
 */

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export type SendResult =
  { ok: true; dryRun: boolean } | { ok: false; reason: "not-configured" | "send-failed" };

/** Schuetzt vor HTML-Injection in der Benachrichtigungs-Mail. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(values: DemoFormValues, source: SourceValue) {
  const rows: [string, string][] = [
    ["Origin", SOURCE_LABELS[source]],
    ["Name", values.name],
    ["School", values.school],
    ["Email", values.email],
    ["Role", values.role || "– not given –"],
    ["Message", values.message || "– no message –"],
  ];

  return [
    `<h1>New request from selyvi.com: ${escapeHtml(SOURCE_LABELS[source])}</h1>`,
    "<table>",
    ...rows.map(
      ([label, value]) =>
        `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
    ),
    "</table>",
  ].join("");
}

export async function sendDemoRequest(
  values: DemoFormValues,
  source: SourceValue = "demo",
): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const mailTo = process.env.DEMO_MAIL_TO;
  const senderEmail = process.env.DEMO_MAIL_FROM;
  // Nur fuer die lokale Entwicklung: ueberspringt den echten Versand.
  const dryRun = process.env.DEMO_DRY_RUN === "true";

  if (dryRun) {
    console.info(
      "[demo] DEMO_DRY_RUN=true – Anfrage wird NICHT versendet:",
      JSON.stringify({ ...values, source, email: "<gekürzt>" }),
    );
    return { ok: true, dryRun: true };
  }

  // Fail closed: ohne vollstaendige Konfiguration wird nichts versendet und
  // der Nutzerin auch kein Erfolg vorgetaeuscht.
  if (!apiKey || !mailTo || !senderEmail) {
    console.error(
      "[demo] Versand nicht konfiguriert. Fehlend:",
      [
        !apiKey && "BREVO_API_KEY",
        !mailTo && "DEMO_MAIL_TO",
        !senderEmail && "DEMO_MAIL_FROM",
      ]
        .filter(Boolean)
        .join(", "),
    );
    return { ok: false, reason: "not-configured" };
  }

  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: "Website form (EN)" },
        to: [{ email: mailTo }],
        // Antworten gehen direkt an die anfragende Person.
        replyTo: { email: values.email, name: values.name },
        // „(EN)" in der Betreffzeile: Im selben Postfach landen die Anfragen
        // beider Websites. Wer antwortet, muss auf einen Blick sehen, in
        // welcher Sprache erwartet wird – nicht erst nach dem Oeffnen.
        subject: `${SOURCE_LABELS[source]} (EN): ${values.school}`,
        htmlContent: buildHtml(values, source),
      }),
    });

    if (!response.ok) {
      // Bewusst ohne Antwortkoerper im Log-Text: Brevo spiegelt in
      // Fehlerfaellen Teile der Anfrage, und der Schluessel steht im Header.
      console.error("[demo] Brevo antwortete mit Status", response.status);
      return { ok: false, reason: "send-failed" };
    }

    return { ok: true, dryRun: false };
  } catch (error) {
    console.error("[demo] Versand fehlgeschlagen:", error);
    return { ok: false, reason: "send-failed" };
  }
}
