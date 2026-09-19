"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ELAPSED_FIELD,
  EMPTY_VALUES,
  HONEYPOT_FIELD,
  SOURCE_FIELD,
  type SourceValue,
  PROJECT_STATUS_OPTIONS,
  ROLE_OPTIONS,
  SCHOOLS_INVOLVED_OPTIONS,
  type DemoField,
  type ResearchField,
} from "@/lib/demo/schema";
import { INITIAL_DEMO_STATE, type DemoFormState } from "@/lib/demo/state";
import { submitDemoRequest } from "@/app/meet/actions";
import { Button } from "@/components/ui/button";
import { OriginFields } from "@/components/sections/demo/origin-fields";

/**
 * Demo-Formular.
 *
 * Barrierefreiheit:
 *  - Jedes Feld hat ein sichtbares <label>. Platzhalter ersetzen kein Label –
 *    sie verschwinden beim Tippen und fehlen dann genau denen, die sie
 *    brauchen.
 *  - Fehlertexte haengen ueber aria-describedby am Feld und setzen
 *    aria-invalid. Nach einem Fehler springt der Fokus auf das erste
 *    betroffene Feld.
 *  - Eine dauerhaft vorhandene Statuszeile (role="status", aria-live="polite")
 *    meldet Erfolg und Fehler. Sie steht ausserhalb des Formulars, damit nicht
 *    jede Neuzeichnung vorgelesen wird.
 *  - `noValidate`: Die Pruefung passiert auf dem Server. So sehen alle
 *    dieselben Meldungen an derselben Stelle, statt teils Browser-Blasen,
 *    teils Serverantwort.
 *
 * Eingaben sind kontrolliert. Dadurch bleibt das Formular nach einem Fehler
 * gefuellt, unabhaengig davon, ob React das DOM-Formular zuruecksetzt.
 */
/**
 * Dasselbe Formular auf /meet und auf /co-create.
 *
 * Bewusst EINE Komponente und EINE Server Action statt zweier Endpunkte: Der
 * Spamschutz (Honeypot, Zeitmessung, Rate-Limit), die Validierung und der
 * Versandweg sind an beiden Stellen dieselben. Ein zweiter Endpunkt waere ein
 * zweiter Ort, an dem eine dieser Huerden fehlen kann.
 *
 * Unterschieden wird nur, WOHER die Anfrage kam – ueber ein verstecktes Feld,
 * das serverseitig gegen eine Liste geprueft wird. Es steht in Betreff und
 * Mailtext, damit beim Lesen klar ist, worauf jemand geantwortet hat.
 */
/**
 * Beschriftung des Absende-Knopfes je Herkunft. „Request a demo" auf einer
 * Seite, die gar keine Demo anbietet, waere die Stelle, an der auffaellt,
 * dass hier ein Formular zweitverwendet wurde.
 *
 * NICHT „Meet Selyvi": Das ist die Beschriftung des Navigations-CTA, der auf
 * diese Seite fuehrt. Derselbe Text auf dem Absende-Knopf laese sich wie ein
 * zweiter Weg zur selben Seite.
 */
const SUBMIT_LABELS: Record<SourceValue, string> = {
  demo: "Request a meeting",
  mitgestalten: "Send request",
  // Kein „Submit a project": Eingereicht wird bei einem Mittelgeber, hier wird
  // erzaehlt. Der Knopf soll die Huerde beschreiben, die er hat.
  forschung: "Tell us about the project",
};

export function DemoForm({ source = "demo" }: { source?: SourceValue }) {
  const [values, setValues] = useState(EMPTY_VALUES);

  /**
   * Auf /research traegt dasselbe Formular fuenf zusaetzliche Felder – und
   * zwei der vorhandenen eine andere Beschriftung:
   *
   *   School  -> Institution
   *   Message -> Research question (dort Pflichtfeld)
   *
   * Eine eigene Komponente waere die naheliegende Loesung und die falsche:
   * Honeypot, Zeitmessung, Rate-Limit und Validierung muessten dort ein
   * zweites Mal stehen. Genau diese vier Huerden sind der Grund, warum das
   * Formular nicht zugespammt wird – sie zu verdoppeln heisst, sie irgendwann
   * auseinanderlaufen zu lassen.
   */
  const istForschung = source === "forschung";
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  /**
   * Zeitpunkt der ersten Anzeige. Die Differenz zum Absenden wandert als
   * Dauer mit – nicht als Zeitstempel, damit abweichende Uhren zwischen
   * Client und Server keine Rolle spielen.
   *
   * Gesetzt wird der Wert im Effekt und nicht beim Rendern: Date.now() ist
   * unrein, und ein Aufruf waehrend des Renderns liefert bei wiederholtem
   * Rendern unterschiedliche Werte.
   */
  const mountedAt = useRef<number | null>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const [state, formAction, isPending] = useActionState(
    async (previous: DemoFormState, formData: FormData) => {
      // Der Effekt oben laeuft direkt nach dem ersten Rendern und damit lange
      // bevor jemand das Formular abschicken kann. Der Fallback greift nur,
      // wenn das Formular gar nicht erst angezeigt wurde.
      const startedAt = mountedAt.current ?? Date.now();
      formData.set(ELAPSED_FIELD, String(Date.now() - startedAt));
      return submitDemoRequest(previous, formData);
    },
    INITIAL_DEMO_STATE,
  );

  const fieldErrors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
      return;
    }
    if (state.status === "error") {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"]',
      );
      firstInvalid?.focus();
    }
  }, [state]);

  const set = (field: DemoField) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const setResearch = (field: ResearchField) => (event: { target: { value: string } }) =>
    setValues((current) => ({
      ...current,
      research: { ...current.research, [field]: event.target.value },
    }));

  const describedBy = (field: DemoField | "consent") =>
    fieldErrors[field] ? `${field}-error` : undefined;

  const inputClass = (field: DemoField | "consent") =>
    cn(
      "w-full rounded-md border bg-surface px-3 py-2.5 text-ink",
      "placeholder:text-gray-500",
      fieldErrors[field] ? "border-brand-600" : "border-gray-200",
    );

  return (
    <div>
      {/* Statuszeile: immer im DOM, damit Screenreader Aenderungen melden. */}
      <div role="status" aria-live="polite" className="sr-only">
        {state.status === "success"
          ? "Your request has been submitted."
          : state.status === "error"
            ? (state.message ?? "The request could not be submitted.")
            : ""}
      </div>

      {state.status === "success" ? (
        <div
          ref={successRef}
          tabIndex={-1}
          className="rounded-xl border border-gray-200 bg-surface-alt p-8"
        >
          <CircleCheck aria-hidden="true" className="size-8 text-brand-600" />

          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
            Thank you for your request.
          </h2>

          <p className="mt-4 text-gray-500">We get back to you on working days.</p>
        </div>
      ) : (
        <form ref={formRef} action={formAction} noValidate className="space-y-6">
          {/* Herkunft der Anfrage. Kein Nutzereingabefeld – der Wert wird
              serverseitig gegen SOURCE_VALUES geprueft und faellt sonst auf
              „demo" zurueck. */}
          <input type="hidden" name={SOURCE_FIELD} value={source} />

          {/* Herkunft der Anfrage: UTM-Parameter, verweisende Seite, eigener
              Pfad. Wird beim Anzeigen aus der bereits geladenen Seite
              abgelesen – kein Cookie, kein Tracking ueber diese Anfrage
              hinaus. Der Server prueft jedes Feld einzeln und verwirft, was
              nicht passt (src/lib/demo/origin.ts). */}
          <OriginFields />

          {state.status === "error" && state.message ? (
            <div
              role="alert"
              className="rounded-md border border-brand-600 bg-surface-alt p-4"
            >
              {/* ==========================================================
                  HIER STAND EIN DEUTSCHER SATZ – EIN JAHR LANG UNBEMERKT
                  ==========================================================
                  „Alternativ erreichen Sie uns unter …" war beim Umbau ins
                  Englische stehengeblieben. Kein Detektor hat ihn gefunden,
                  und das lag nicht an den Detektoren: Dieser Absatz wird NUR
                  im Fehlerzustand gerendert. Im ausgelieferten HTML steht er
                  nie, und bis zu dieser Runde hat niemand den Fehlerzustand
                  erzwungen.

                  Gefunden hat ihn die Sprachprüfung der erzwungenen Zustände
                  in scripts/formular-test.mjs – die Lehre daraus ist
                  allgemeiner als dieser Satz: Was nur bei einem Fehler
                  erscheint, wird nur geprüft, wenn der Fehler erzwungen wird.

                  Der Ausweg steht jetzt IN der Meldung selbst (actions.ts).
                  Zwei Absätze, die dieselbe Adresse nennen, waren ohnehin
                  einer zu viel. */}
              <p className="text-ink">{state.message}</p>
            </div>
          ) : null}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink">
              Name <span aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              aria-required="true"
              aria-invalid={fieldErrors.name ? true : undefined}
              aria-describedby={describedBy("name")}
              value={values.name}
              onChange={set("name")}
              className={cn("mt-2", inputClass("name"))}
            />
            {fieldErrors.name ? (
              <p id="name-error" className="mt-2 text-sm text-brand-600">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="school" className="block text-sm font-medium text-ink">
              {istForschung ? "Institution" : "School"} <span aria-hidden="true">*</span>
            </label>
            <input
              id="school"
              name="school"
              type="text"
              autoComplete="organization"
              aria-required="true"
              aria-invalid={fieldErrors.school ? true : undefined}
              aria-describedby={describedBy("school")}
              value={values.school}
              onChange={set("school")}
              className={cn("mt-2", inputClass("school"))}
            />
            {fieldErrors.school ? (
              <p id="school-error" className="mt-2 text-sm text-brand-600">
                {fieldErrors.school}
              </p>
            ) : null}
          </div>

          {istForschung ? (
            <div>
              <label htmlFor="fachgebiet" className="block text-sm font-medium text-ink">
                Field or chair{" "}
                <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input
                id="fachgebiet"
                name="fachgebiet"
                type="text"
                autoComplete="off"
                value={values.research.fachgebiet}
                onChange={setResearch("fachgebiet")}
                className={cn("mt-2", inputClass("school"), "border-gray-200")}
              />
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Work email <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-required="true"
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              value={values.email}
              onChange={set("email")}
              className={cn("mt-2", inputClass("email"))}
            />
            {fieldErrors.email ? (
              <p id="email-error" className="mt-2 text-sm text-brand-600">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          {/* Die Rolle ist auf /research ohne Bedeutung – „Teacher, School
              leadership, IT" passt auf keinen Lehrstuhl. Das Feld bleibt im
              DOM und ist ausgeblendet statt entfernt: Es ist optional, traegt
              einen leeren Wert und macht so den Rest des Formulars nicht von
              einer Verzweigung abhaengig. */}
          <div className={istForschung ? "hidden" : undefined}>
            <label htmlFor="role" className="block text-sm font-medium text-ink">
              Role
            </label>
            <select
              id="role"
              name="role"
              aria-invalid={fieldErrors.role ? true : undefined}
              aria-describedby={describedBy("role")}
              value={values.role}
              onChange={set("role")}
              className={cn("mt-2 appearance-none", inputClass("role"))}
            >
              <option value="">Please choose</option>
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {fieldErrors.role ? (
              <p id="role-error" className="mt-2 text-sm text-brand-600">
                {fieldErrors.role}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink">
              {istForschung ? (
                <>
                  Research question <span aria-hidden="true">*</span>
                </>
              ) : (
                <>
                  Message <span className="font-normal text-gray-500">(optional)</span>
                </>
              )}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              aria-required={istForschung ? true : undefined}
              aria-invalid={fieldErrors.message ? true : undefined}
              aria-describedby={describedBy("message")}
              value={values.message}
              onChange={set("message")}
              placeholder={
                istForschung
                  ? "For example: how does structured observation change support planning in years 5 to 7?"
                  : undefined
              }
              className={cn("mt-2 resize-y", inputClass("message"))}
            />
            {fieldErrors.message ? (
              <p id="message-error" className="mt-2 text-sm text-brand-600">
                {fieldErrors.message}
              </p>
            ) : null}
          </div>

          {/* ================= Projektangaben, nur auf /research ===========
              Vier Zusatzangaben. Alle optional: Wer schreibt, hat oft noch
              keinen Zeitraum und keinen Status – ein Pflichtfeld waere hier
              die Stelle, an der ein Projekt in der Ideenphase abbricht. Und
              genau die wollen wir lesen. */}
          {istForschung ? (
            <>
              <div>
                <label
                  htmlFor="digitaler_bedarf"
                  className="block text-sm font-medium text-ink"
                >
                  What would need to be built digitally?{" "}
                  <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <textarea
                  id="digitaler_bedarf"
                  name="digitaler_bedarf"
                  rows={3}
                  value={values.research.digitaler_bedarf}
                  onChange={setResearch("digitaler_bedarf")}
                  className={cn(
                    "mt-2 resize-y",
                    inputClass("message"),
                    "border-gray-200",
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="schulen_beteiligt"
                    className="block text-sm font-medium text-ink"
                  >
                    Are schools already involved?{" "}
                    <span className="font-normal text-gray-500">(optional)</span>
                  </label>
                  <select
                    id="schulen_beteiligt"
                    name="schulen_beteiligt"
                    value={values.research.schulen_beteiligt}
                    onChange={setResearch("schulen_beteiligt")}
                    className={cn(
                      "mt-2 appearance-none",
                      inputClass("role"),
                      "border-gray-200",
                    )}
                  >
                    <option value="">Please choose</option>
                    {SCHOOLS_INVOLVED_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="projektstatus"
                    className="block text-sm font-medium text-ink"
                  >
                    Project stage{" "}
                    <span className="font-normal text-gray-500">(optional)</span>
                  </label>
                  <select
                    id="projektstatus"
                    name="projektstatus"
                    value={values.research.projektstatus}
                    onChange={setResearch("projektstatus")}
                    className={cn(
                      "mt-2 appearance-none",
                      inputClass("role"),
                      "border-gray-200",
                    )}
                  >
                    <option value="">Please choose</option>
                    {PROJECT_STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="zeitraum" className="block text-sm font-medium text-ink">
                  Timeframe <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <input
                  id="zeitraum"
                  name="zeitraum"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. school year 2027/28"
                  value={values.research.zeitraum}
                  onChange={setResearch("zeitraum")}
                  className={cn("mt-2", inputClass("school"), "border-gray-200")}
                />
              </div>
            </>
          ) : null}

          {/* Honeypot: fuer Menschen unsichtbar und nicht fokussierbar, fuer
              Formular-Bots aber im DOM vorhanden. Bewusst kein display:none –
              manche Bots ueberspringen komplett ausgeblendete Felder. */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          >
            <label htmlFor={HONEYPOT_FIELD}>Website (please leave blank)</label>
            <input
              id={HONEYPOT_FIELD}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <div>
            <div className="flex gap-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                aria-required="true"
                aria-invalid={fieldErrors.consent ? true : undefined}
                aria-describedby={describedBy("consent")}
                className="mt-1 size-4 shrink-0 accent-brand-600"
              />
              <label htmlFor="consent" className="text-sm text-gray-500">
                I agree that my details may be processed in order to handle my request.
                Details in the{" "}
                <Link href="/privacy" className="text-brand-600 underline">
                  privacy policy
                </Link>
                . <span aria-hidden="true">*</span>
              </label>
            </div>
            {fieldErrors.consent ? (
              <p id="consent-error" className="mt-2 text-sm text-brand-600">
                {fieldErrors.consent}
              </p>
            ) : null}
          </div>

          <div className="pt-2">
            {/* Primaerer CTA – einzige Verwendung von --cta auf dieser Seite. */}
            <Button type="submit" variant="cta" size="lg" disabled={isPending}>
              {isPending ? "Sending …" : SUBMIT_LABELS[source]}
            </Button>

            <p className="mt-4 text-sm text-gray-500">
              <span aria-hidden="true">*</span> Required field. We use your details solely
              to handle this request – no newsletter, no advertising. We store your
              request in our own customer system (servers in the EU) in order to process
              it.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
