import { SOURCE_LABELS, type DemoFormValues, type SourceValue } from "@/lib/demo/schema";
import type { OriginValues } from "@/lib/demo/origin";

/**
 * Übergabe einer Formular-Anfrage an das eigene CRM.
 *
 * ==========================================================================
 * DIE MAIL IST DER VERLASS. DIESER WEG IST DIE ZUGABE.
 * ==========================================================================
 * Das ist die wichtigste Regel dieser Datei, und sie ist keine Vorsichts-
 * maßnahme, sondern die Bauweise: Ein Fehler hier darf eine Anfrage NIE
 * scheitern lassen. Wenn das CRM gerade nicht erreichbar ist, hat jemand
 * trotzdem ein Formular ausgefüllt und wartet auf Antwort – und die Brevo-
 * Mail liegt bereits im Postfach.
 *
 * Deshalb:
 *   - Die Funktion wirft nie. Jeder Fehler wird gefangen und als Ergebnis
 *     zurückgegeben.
 *   - Der Aufrufer wertet dieses Ergebnis nur fürs Log aus, nie für die
 *     Antwort an die Nutzerin.
 *   - Fünf Sekunden Zeitgrenze. Ein hängendes CRM darf das Formular nicht
 *     blockieren; die Server Action wartet ohnehin auf beide Wege.
 *
 * ==========================================================================
 * SICHERHEIT – WEBSITE_INBOUND_KEY
 * ==========================================================================
 * Der Schlüssel wird ausschliesslich hier gelesen. Diese Datei wird nur aus
 * einer "use server"-Datei importiert und landet damit nie im Client-Bundle.
 * Kein NEXT_PUBLIC_-Präfix – nur so präfixierte Variablen inlined Next.js in
 * den Browser-Code. Nach jedem Build gegenprüfen:
 *
 *   grep -r "WEBSITE_INBOUND_KEY" .next/static
 *
 * Keine Ausgabe = der Schlüssel ist nicht im ausgelieferten JavaScript.
 *
 * Das Log nennt AUSSCHLIESSLICH Status und Dauer. Nicht den Schlüssel, nicht
 * den Antwortkörper (Inbound-Endpunkte spiegeln in Fehlerfällen gern die
 * Anfrage), nicht die Zieladresse und nichts aus dem Formular – eine
 * E-Mail-Adresse im Server-Log ist eine Verarbeitung, der niemand zugestimmt
 * hat.
 *
 * ==========================================================================
 * OHNE KONFIGURATION: STILL ÜBERSPRINGEN
 * ==========================================================================
 * Fehlt eine der beiden Variablen, passiert schlicht nichts. Anders als beim
 * Mailversand ist das hier KEIN Fehlerfall: Lokal und in Vorschau-
 * Deployments gibt es kein CRM, und ein Fehler-Log bei jedem Formular wäre
 * Lärm, der irgendwann echte Fehler übertönt.
 */

const TIMEOUT_MS = 5000;

export type CrmResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

export type CrmLead = {
  values: DemoFormValues;
  source: SourceValue;
  origin: OriginValues;
};

export async function sendLeadToCrm({
  values,
  source,
  origin,
}: CrmLead): Promise<CrmResult> {
  const url = process.env.CRM_INBOUND_URL;
  const key = process.env.WEBSITE_INBOUND_KEY;

  if (!url || !key) {
    return { ok: false, reason: "not-configured" };
  }

  // Feldnamen in der Schreibweise des CRM-Endpunkts. „organisation" statt
  // „school": Das Formular fragt nach der Schule, das CRM kennt auch andere
  // Träger – die Umbenennung gehört an genau diese eine Stelle.
  const body = {
    source,
    source_label: SOURCE_LABELS[source],
    // Sprache der Website, von der die Anfrage kommt. Ein ZUSAETZLICHES Feld –
    // die Pflichtfelder des Endpunkts sind unveraendert, das Schema bricht
    // dadurch nicht. Wer antwortet, sieht ohne Umweg, in welcher Sprache.
    //
    // Fest verdrahtet und nicht aus einer Konfiguration gelesen: Dieses Repo
    // IST die englische Seite. Eine Variable waere die Moeglichkeit, sie falsch
    // zu setzen.
    locale: "en",
    name: values.name,
    email: values.email,
    organisation: values.school,
    role: values.role,
    message: values.message,
    page_path: origin.page_path,
    referrer: origin.referrer,
    utm_source: origin.utm_source,
    utm_medium: origin.utm_medium,
    utm_campaign: origin.utm_campaign,
  };

  const begonnen = Date.now();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Website-Key": key,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const dauer = Date.now() - begonnen;

    if (!response.ok) {
      console.error(`[crm] Übergabe abgelehnt: Status ${response.status}, ${dauer} ms`);
      return { ok: false, reason: "failed" };
    }

    console.info(`[crm] Übergabe angenommen: Status ${response.status}, ${dauer} ms`);
    return { ok: true };
  } catch (error) {
    const dauer = Date.now() - begonnen;
    // Nur der Fehlertyp, nicht die Meldung: Netzwerkfehler von fetch nennen
    // im Text die Zieladresse.
    const art = error instanceof Error ? error.name : "unbekannt";
    console.error(`[crm] Übergabe fehlgeschlagen: ${art} nach ${dauer} ms`);
    return { ok: false, reason: "failed" };
  }
}
