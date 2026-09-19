"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { Check, Lock, Mic, Send, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  CHAT_FALLBACK,
  DEMO_CHAT,
  DEMO_CHAT_KEYWORDS,
  DEMO_DICTATION,
  DEMO_MAIL_LANGS,
  DEMO_MATERIAL_RESULT,
  DEMO_MATERIAL_SOURCES,
  DEMO_MATERIAL_TOPICS,
  DEMO_PARENTS,
  DEMO_SUBJECT_COLORS,
  DEMO_SUBJECT_KEYWORDS,
  DEMO_TEACHER,
  DEMO_TIMETABLE_DAYS,
  DEMO_TIMETABLE_SLOTS,
  DEMO_TIMETABLE_SUBJECTS,
  DEMO_TOUR_OBSERVATIONS,
  type DemoMailLang,
} from "@/config/demo-data";
import { PRODUCT_NAME } from "@/config/brand";
import { TRANSLATION_LANGUAGE_COUNT } from "@/config/product";
import { Button } from "@/components/ui/button";

/**
 * Die sieben bedienbaren Bereiche des Einblicks.
 *
 * ==========================================================================
 * JEDE INTERAKTION BILDET EINE LIVE-FUNKTION AB
 * ==========================================================================
 * Die Fundstelle im Produktstand steht jeweils direkt am Bereich. Was dort
 * „Rollout offen", „Teilweise", „Nicht gebaut" oder „Prototyp" traegt, ist
 * hier nicht bedienbar – der KI-Sitzplanvorschlag zum Beispiel fehlt
 * bewusst, obwohl er die Szene aufwerten wuerde.
 *
 * ==========================================================================
 * ES WIRD NICHTS GESPEICHERT – AUCH NICHT IM WORTLAUT
 * ==========================================================================
 * Keine Bestaetigung sagt „Gespeichert". Das Banner ueber dem Fenster sagt
 * das Gegenteil, und zwei widersprechende Aussagen auf einem Bildschirm sind
 * schlimmer als gar keine Bestaetigung. Der Wortlaut ist „Added · example" –
 * nie „Saved".
 *
 * Er hiess bis zum Ausbau „Taken over · example", eine Wort-fuer-Wort-Fassung
 * von „Uebernommen". Auf Englisch heisst „to take over" etwas an sich reissen.
 * Das war ein Uebersetzungsrest, kein Wortlaut.
 *
 * ==========================================================================
 * WAS DIE LEHRKRAFT SELBST EINGIBT, BLEIBT IM BROWSER
 * ==========================================================================
 * Frei getippte Frage, eigene Beobachtung, eigenes Materialthema: alles lebt
 * im React-Zustand dieser Komponente. Kein fetch, kein localStorage, keine
 * Server Action. Das Banner ueber dem Fenster sagt „nothing is saved" – und
 * diese Bauweise ist der Grund, warum das stimmt.
 *
 * ==========================================================================
 * UND ES WIRD NICHTS ERFUNDEN
 * ==========================================================================
 * Aus einer eigenen Beobachtung baut die Vorschau KEINE Zeugnisbemerkung und
 * kein Arbeitsblatt. Ein Baukastensatz aus dem Browser wuerde das Versprechen
 * vom gelernten Schreibstil in dem Moment widerlegen, in dem es gegeben wird.
 * Stattdessen steht dort die ehrliche Zeile und der Weg zum vollen Erlebnis.
 */

export type Seat = { id: string; initials: string | null; locked: boolean };

/**
 * Eine selbst getippte Beobachtung.
 *
 * Sie lebt ausschliesslich im React-Zustand – siehe Kopfkommentar. `child`
 * ist das erkannte Kind oder null, wenn keiner der drei Namen vorkam.
 */
export type OwnNote = {
  text: string;
  chips: string[];
  child: string | null;
};

export type TourState = {
  chosen: string | null;
  filter: string | null;
  dictated: string | null;
  /** Laeuft das Diktat gerade? Steuert den Timer ueber einen Effekt. */
  dictating: boolean;
  chatOpen: string | null;
  /** Frei getippte Frage an die eigenen Daten. */
  chatInput: string;
  /**
   * Antwort auf die frei getippte Frage.
   *   { question: "lesen" }  -> vorbereitete Antwort mit Verweis-Chips
   *   { question: null }     -> die ehrliche Rueckfall-Antwort
   */
  chatFree: { question: string | null } | null;
  /** Eigene Beobachtung, waehrend des Tippens. */
  ownDraft: string;
  /** Eigene Beobachtung, nachdem sie uebernommen wurde. */
  ownNote: OwnNote | null;
  /** Empfaenger-Kind der Elternmail. */
  mailChild: string;
  /** Frei eingetipptes Materialthema. */
  topicInput: string;
  topicFree: string | null;
  /** Platz, an dem gerade der Haken steht. */
  seated: string | null;
  reportVariant: 0 | 1 | null;
  reportText: string;
  mailCreated: boolean;
  mailLang: DemoMailLang;
  topic: string | null;
  sources: string[];
  materialCreated: boolean;
  seats: Seat[];
  picked: string | null;
  refused: string | null;
  timetable: Record<string, string | null>;
  timelineChild: string;
  openEntries: string[];
};

export type TourActions = {
  set: Dispatch<SetStateAction<TourState>>;
  notify: (text: string) => void;
  reduced: boolean;
};

const LABEL = "text-xs font-medium tracking-wide text-[var(--app-text-muted)] uppercase";

/**
 * Klassen fuer Bedienelemente, die getroffen werden muessen.
 *
 * Zwei Masse, nicht eines:
 *   - 24 px ist das PFLICHTMASS (WCAG 2.5.8 Target Size, Minimum, AA).
 *     Es gilt fuer jeden Zeiger, also auch fuer die Maus am Schreibtisch.
 *   - 44 px ist das EMPFOHLENE Mass (2.5.5). Es gilt hier auf dem Telefon,
 *     wo mit dem Daumen gezielt wird.
 *
 * Die Chips waren mit `py-0.5` rund 20 px hoch – auf dem Bildschirm huebsch,
 * mit dem Daumen ein Gluecksspiel. NICHT `sm:min-h-0` schreiben: Damit standen
 * sie auf dem Desktop bei 23,5 px und rissen das Pflichtmass knapp. Knapp
 * daneben ist auch daneben.
 */
const TIPPZIEL = "min-h-11 sm:min-h-6";

/**
 * Eingabefelder: 16 px auf dem Telefon, kleiner erst ab sm.
 *
 * Safari auf iOS zoomt in ein Feld hinein, sobald dessen Schrift kleiner als
 * 16 px ist – und zoomt danach NICHT von selbst zurueck. Die Seite steht dann
 * schief, und niemand weiss warum. Der einzige Weg dagegen ist die
 * Schriftgroesse selbst.
 */
const EINGABE_SCHRIFT = "text-[16px] sm:text-[13px]";

/**
 * Klein geschrieben, ohne Satzzeichen – und in WORTE zerlegt.
 *
 * ==========================================================================
 * WORTGRENZEN, NICHT TEILZEICHENKETTEN – DER UNTERSCHIED ZUR DEUTSCHEN FASSUNG
 * ==========================================================================
 * Die deutsche Schwester-Website vergleicht mit includes() auf der ganzen
 * Zeichenkette. Im Englischen ist das messbar falsch:
 *
 *   „read"  steckt in „al-read-y"
 *   „team"  steckt in „s-team"
 *   „task"  steckt in „multi-task-ing"
 *
 * „Has Yusuf already improved?" haette damit die LESE-Antwort gezogen statt
 * der Mathe-Antwort. Von dreizehn Probefragen entscheidet die naive Bauweise
 * in dreien anders – und in allen dreien falsch.
 *
 * Deshalb: Ein Listeneintrag ohne Leerzeichen muss als ganzes WORT vorkommen,
 * ein Eintrag mit Leerzeichen als Wortfolge. Fuer die Wortfolge ist der Text
 * vorne und hinten mit einem Leerzeichen gepolstert, damit sie auch am Rand
 * greift.
 */
function normalisiere(text: string): { gepolstert: string; worte: string[] } {
  const worte = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  return { gepolstert: ` ${worte.join(" ")} `, worte };
}

/** Trifft ein Eintrag der Wortliste? Siehe normalisiere() fuer das Warum. */
function trifft(worte: string[], gepolstert: string, liste: string[]): boolean {
  return liste.some((eintrag) =>
    eintrag.includes(" ") ? gepolstert.includes(` ${eintrag} `) : worte.includes(eintrag),
  );
}

/**
 * Welche vorbereitete Antwort passt zu dieser Frage?
 *
 * Ein Vergleich mit Wortlisten, mehr nicht – siehe DEMO_CHAT_KEYWORDS. Kein
 * Treffer ist ein GUELTIGES Ergebnis und fuehrt zur ehrlichen Rueckfall-
 * Antwort, nicht zu einer erfundenen. Wer in einer Vorschau eine Antwort
 * bekommt, die es im Produkt so nicht gaebe, glaubt danach keiner anderen mehr.
 */
function findeAntwort(frage: string): string | null {
  const { gepolstert, worte } = normalisiere(frage);
  if (worte.length === 0) return null;
  for (const [id, liste] of Object.entries(DEMO_CHAT_KEYWORDS)) {
    if (trifft(worte, gepolstert, liste)) return id;
  }
  return null;
}

/**
 * Chips fuer eine selbst getippte Beobachtung: Kind, Fach, sonst „Observation".
 *
 * Das Produkt macht daraus laut Produktstand Fach, Kategorie, Prioritaet und
 * Foerderhinweis. Die Vorschau zeigt davon, was sichtbar ist – und erfindet
 * die Kategorie nicht dazu.
 */
function erkenneChips(eingabe: string): OwnNote {
  const { gepolstert, worte } = normalisiere(eingabe);
  const chips: string[] = [];

  const kind =
    DEMO_TOUR_OBSERVATIONS.find((e) =>
      worte.includes(e.child.split(" ")[0].toLowerCase()),
    ) ?? null;
  if (kind) chips.push(kind.child);

  const fach = Object.entries(DEMO_SUBJECT_KEYWORDS).find(([, liste]) =>
    trifft(worte, gepolstert, liste),
  );
  if (fach) chips.push(fach[0]);

  if (chips.length === 0) chips.push("Observation");

  return { text: eingabe.trim(), chips, child: kind?.id ?? null };
}

/* ==========================================================================
 * 1) Beobachtungen
 * Produktstand: „Beobachtungen strukturieren — Live … Freitext oder Diktat
 * wird zu einer strukturierten Beobachtung mit Fach, Kategorie, Prioritaet
 * und Foerderhinweis. Die Spracheingabe laeuft ueber Whisper."
 * Dazu „Freie Fragen an die eigenen Daten — Live".
 * ========================================================================== */
export function AreaObservations({
  state,
  actions,
}: {
  state: TourState;
  actions: TourActions;
}) {
  const { set, notify } = actions;
  const sichtbar = state.filter
    ? DEMO_TOUR_OBSERVATIONS.filter((e) => e.initials === state.filter)
    : DEMO_TOUR_OBSERVATIONS;

  return (
    <section aria-labelledby="bereich-beobachtungen">
      <h2 id="bereich-beobachtungen" className={LABEL}>
        Observations
      </h2>

      {/* Filter nach Kind. Der Produktstand fuehrt die Timeline und die
          Erfassung je Kind – die Liste danach einzugrenzen ist die
          Bedienung dieser Struktur, keine eigene Zusage. */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-[var(--app-text-muted)]">Filter:</span>
        {DEMO_TOUR_OBSERVATIONS.map((e) => (
          <button
            key={e.initials}
            type="button"
            aria-pressed={state.filter === e.initials}
            onClick={() =>
              set((s) => ({ ...s, filter: s.filter === e.initials ? null : e.initials }))
            }
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]",
              TIPPZIEL,
              state.filter === e.initials
                ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-blue)]",
            )}
          >
            {e.child}
          </button>
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {sichtbar.map((entry) => {
          const gewaehlt = state.chosen === entry.id;
          return (
            <li key={entry.id}>
              <button
                type="button"
                aria-pressed={gewaehlt}
                onClick={() => {
                  set((s) => ({
                    ...s,
                    chosen: entry.id,
                    reportVariant: null,
                    reportText: "",
                    mailCreated: false,
                  }));
                  notify("Observation selected");
                }}
                className={cn(
                  "w-full rounded-[var(--app-radius-card)] border p-3 text-left",
                  gewaehlt
                    ? "border-[var(--app-blue)] bg-[var(--app-surface-muted)]"
                    : "border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-blue)]",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--app-blue-soft)] text-[10px] font-semibold text-[var(--app-blue-on-soft)]">
                    {entry.initials}
                  </span>
                  <span className="text-[13px] text-[var(--app-text)]">{entry.note}</span>
                </span>

                {gewaehlt ? (
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {entry.chips.map((chip) => (
                      <span
                        key={chip}
                        className={cn(
                          "rounded-full border border-[var(--app-blue)] bg-[var(--app-blue-soft)] px-2 py-0.5 text-[10px] text-[var(--app-blue-on-soft)]",
                          actions.reduced ? "" : "animate-chip-pop",
                        )}
                      >
                        {chip}
                      </span>
                    ))}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}

        {/* Die selbst getippte Beobachtung steht in DERSELBEN Liste wie die
            Beispiele, ist waehlbar und filterbar. Genau das ist der Punkt:
            Wer den eigenen Satz gleich darauf in der Timeline des Kindes
            wiederfindet, hat verstanden, was „part of the record" heisst. */}
        {state.ownNote &&
        (!state.filter ||
          state.filter ===
            DEMO_TOUR_OBSERVATIONS.find((e) => e.id === state.ownNote?.child)
              ?.initials) ? (
          <li>
            <button
              type="button"
              aria-pressed={state.chosen === "eigen"}
              onClick={() => {
                set((s) => ({
                  ...s,
                  chosen: "eigen",
                  reportVariant: null,
                  reportText: "",
                  mailCreated: false,
                }));
                notify("Observation selected");
              }}
              className={cn(
                "w-full rounded-[var(--app-radius-card)] border p-3 text-left",
                state.chosen === "eigen"
                  ? "border-[var(--app-blue)] bg-[var(--app-surface-muted)]"
                  : "border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-blue)]",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--app-blue-soft)] text-[10px] font-semibold text-[var(--app-blue-on-soft)]">
                  ✎
                </span>
                {/* Als TEXT-Knoten, nicht als HTML: Was hier steht, hat jemand
                    getippt. React setzt es als Text ein, und
                    dangerouslySetInnerHTML kommt in dieser Datei nicht vor. */}
                <span className="text-[13px] text-[var(--app-text)]">
                  {state.ownNote.text}
                </span>
              </span>

              <span className="mt-2 flex flex-wrap gap-1.5">
                {state.ownNote.chips.map((chip) => (
                  <span
                    key={chip}
                    className={cn(
                      "rounded-full border border-[var(--app-blue)] bg-[var(--app-blue-soft)] px-2 py-0.5 text-[10px] text-[var(--app-blue-on-soft)]",
                      actions.reduced ? "" : "animate-chip-pop",
                    )}
                  >
                    {chip}
                  </span>
                ))}
              </span>
            </button>
          </li>
        ) : null}

        {/* Die diktierte Beobachtung landet in derselben Liste – nur so
            erklaert sich der Zaehler in der Seitenleiste. */}
        {state.dictated ? (
          <li>
            <div className="rounded-[var(--app-radius-card)] border border-[var(--app-blue)] bg-[var(--app-surface-muted)] p-3">
              <span className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--app-blue-soft)] text-[10px] font-semibold text-[var(--app-blue-on-soft)]">
                  FS
                </span>
                <span className="text-[13px] text-[var(--app-text)]">
                  {state.dictated}
                </span>
              </span>
            </div>
          </li>
        ) : null}
      </ul>

      <div className="mt-4 flex flex-wrap gap-3">
        <DictationButton state={state} actions={actions} />
      </div>

      <OwnNoteField state={state} actions={actions} />

      {/* Chat ueber die eigenen Daten. */}
      <div className="mt-6 border-t border-[var(--app-border)] pt-4">
        <p className={LABEL}>Question to your own data</p>

        <ul className="mt-3 flex flex-col gap-1.5">
          {DEMO_CHAT.questions.map((frage) => (
            <li key={frage.id}>
              <button
                type="button"
                aria-expanded={state.chatOpen === frage.id}
                onClick={() =>
                  set((s) => ({
                    ...s,
                    chatOpen: s.chatOpen === frage.id ? null : frage.id,
                    // Die freie Antwort schliesst mit: zwei offene Antworten
                    // untereinander waeren zwei Antworten auf zwei Fragen.
                    chatFree: null,
                  }))
                }
                className={cn(
                  "flex w-full items-center rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-left text-[12px] text-[var(--app-text)] hover:border-[var(--app-blue)]",
                  TIPPZIEL,
                )}
              >
                {frage.text}
              </button>

              {state.chatOpen === frage.id ? (
                <div className="mt-2 rounded-[var(--app-radius-control)] bg-[var(--app-surface-muted)] p-3">
                  <p className="text-[12px] leading-relaxed text-[var(--app-text)]">
                    {frage.answer}
                  </p>
                  <p className="mt-2 flex flex-wrap gap-1.5">
                    {frage.references.map((r) => (
                      <span
                        key={r}
                        className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-0.5 text-[10px] text-[var(--app-text-muted)]"
                      >
                        {r}
                      </span>
                    ))}
                  </p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        <ChatField state={state} actions={actions} />

        <p className="mt-3 text-[11px] text-[var(--app-text-muted)]">
          Answers only from your own entries
        </p>
      </div>
    </section>
  );
}

/* ==========================================================================
 * Eigene Beobachtung tippen
 * ========================================================================== */
function OwnNoteField({ state, actions }: { state: TourState; actions: TourActions }) {
  const { set, notify } = actions;
  const feld = useRef<HTMLTextAreaElement | null>(null);
  const leer = state.ownDraft.trim().length === 0;

  function uebernehmen() {
    // Doppelklick-Schutz: Ist der Entwurf leer, passiert nichts. Nach dem
    // Uebernehmen IST er leer – der zweite Klick laeuft also ins Leere statt
    // in einen zweiten Eintrag.
    if (leer) return;
    const notiz = erkenneChips(state.ownDraft);
    set((s) => ({ ...s, ownNote: notiz, ownDraft: "" }));
    notify("Added · stays in your browser");
    // Der Fokus bleibt im Feld: Wer eine zweite Beobachtung tippen will, kann
    // sofort weiterschreiben, ohne erneut zu zielen.
    feld.current?.focus();
  }

  return (
    <div className="mt-4 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
      <label
        htmlFor="einblick-eigene-beobachtung"
        className="block text-[11px] text-[var(--app-text-muted)]"
      >
        Write your own observation
      </label>

      <textarea
        id="einblick-eigene-beobachtung"
        ref={feld}
        value={state.ownDraft}
        maxLength={280}
        rows={2}
        onChange={(e) => set((s) => ({ ...s, ownDraft: e.target.value }))}
        placeholder="For example: Lotta led the group work today."
        className={cn(
          "mt-1.5 w-full rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] p-2.5 leading-relaxed text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]",
          EINGABE_SCHRIFT,
        )}
      />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="md" disabled={leer} onClick={uebernehmen}>
          Add
        </Button>
        <span className="text-[11px] text-[var(--app-text-muted)]">
          {state.ownDraft.length}/280 · stays in your browser
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
 * Freie Frage an die eigenen Daten
 * ========================================================================== */
function ChatField({ state, actions }: { state: TourState; actions: TourActions }) {
  const { set } = actions;
  const leer = state.chatInput.trim().length === 0;
  const treffer = state.chatFree?.question
    ? DEMO_CHAT.questions.find((f) => f.id === state.chatFree?.question)
    : null;

  function senden() {
    if (leer) return;
    const id = findeAntwort(state.chatInput);
    // Die vorbereitete Liste klappt zu: Zwei offene Antworten untereinander
    // waeren zwei Antworten auf zwei Fragen.
    set((s) => ({ ...s, chatFree: { question: id }, chatOpen: null, chatInput: "" }));
  }

  return (
    <div className="mt-3">
      <label htmlFor="einblick-frage" className="sr-only">
        Your own question about the sample data
      </label>

      <div className="flex items-center gap-2 rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] px-3 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600">
        <input
          id="einblick-frage"
          value={state.chatInput}
          maxLength={160}
          onChange={(e) => set((s) => ({ ...s, chatInput: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              senden();
            }
          }}
          placeholder="Ask your own question …"
          className={cn(
            "w-full bg-transparent py-2.5 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]",
            EINGABE_SCHRIFT,
          )}
        />
        <button
          type="button"
          onClick={senden}
          disabled={leer}
          aria-label="Send question"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[var(--app-radius-control)] px-2 text-[var(--app-blue)] disabled:text-[var(--app-text-muted)]",
            TIPPZIEL,
          )}
        >
          <Send aria-hidden="true" className="size-4" />
        </button>
      </div>

      {/* Die Antwort erscheint hier. role="status" statt eines eigenen
          aria-live-Bereichs: Der Kasten steht nur da, wenn es etwas zu sagen
          gibt, und role="status" meldet ihn beim Erscheinen. */}
      {state.chatFree ? (
        <div
          role="status"
          className="mt-2 rounded-[var(--app-radius-control)] bg-[var(--app-surface-muted)] p-3"
        >
          <p className="text-[12px] leading-relaxed text-[var(--app-text)]">
            {treffer ? treffer.answer : CHAT_FALLBACK}
          </p>

          {treffer ? (
            <p className="mt-2 flex flex-wrap gap-1.5">
              {treffer.references.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-0.5 text-[10px] text-[var(--app-text-muted)]"
                >
                  {r}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Das Diktat. Es laeuft Wort fuer Wort ein – und zwar ueber setTimeout, NICHT
 * ueber requestAnimationFrame: Der Text soll in Wortschritten erscheinen,
 * nicht in Frames, und im Ruhezustand darf die Seite keine Schleife halten.
 * Nach dem letzten Wort ist Schluss.
 */
// Aus der geteilten Konstante, nicht daneben getippt: Der Satz stand hier
// frueher ein zweites Mal als Literal und waere bei einer Aenderung von
// DEMO_DICTATION stehen geblieben.
const DIKTAT_WORTE = DEMO_DICTATION.split(" ");

function DictationButton({ state, actions }: { state: TourState; actions: TourActions }) {
  const { set, notify, reduced } = actions;

  /* ==========================================================================
   * DER TIMER HAENGT AN EINEM EFFEKT, NICHT AN EINER KETTE
   * ==========================================================================
   * Vorher rief der Klick eine Funktion, die sich per setTimeout selbst wieder
   * aufrief. Diese Kette liess sich nicht anhalten: Wer waehrend des Diktats
   * den Bereich wechselte oder auf „Reset" drueckte, sah den Text danach Wort
   * fuer Wort ZURUECKKOMMEN – die Kette schrieb weiter in einen Zustand, den
   * es so nicht mehr gab.
   *
   * Jetzt steuert `dictating` den Effekt. Wird der Zustand zurueckgesetzt, ist
   * `dictating` false, der Effekt raeumt seinen Timer ab, und es passiert
   * nichts mehr. Beim Ausbau der Komponente ebenso.
   *
   * Das setState steht IM setTimeout, nicht synchron im Effekt – sonst
   * beanstandet die React-Compiler-Regel `set-state-in-effect`.
   */
  useEffect(() => {
    if (!state.dictating) return;

    const gesagt = state.dictated ?? "";
    const i = gesagt.length === 0 ? 0 : gesagt.split(" ").length;

    const timer = window.setTimeout(() => {
      const naechste = DIKTAT_WORTE.slice(0, i + 1).join(" ");
      const fertig = i + 1 >= DIKTAT_WORTE.length;
      set((s) => (s.dictating ? { ...s, dictated: naechste, dictating: !fertig } : s));
      if (fertig) notify("Added · example");
    }, 130);

    return () => window.clearTimeout(timer);
  }, [state.dictating, state.dictated, set, notify]);

  return (
    <button
      type="button"
      disabled={state.dictated !== null}
      onClick={() => {
        if (reduced) {
          set((s) => ({ ...s, dictated: DIKTAT_WORTE.join(" "), dictating: false }));
          notify("Added · example");
          return;
        }
        // Nur den Startschuss geben. Das Weiterlaufen macht der Effekt.
        set((s) => (s.dictated === null ? { ...s, dictated: "", dictating: true } : s));
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-[12px] text-[var(--app-text)]",
        TIPPZIEL,
        state.dictated === null && "hover:border-[var(--app-blue)]",
        state.dictated !== null && "text-[var(--app-text-muted)]",
      )}
    >
      <Mic
        aria-hidden="true"
        className={cn(
          "size-3.5 text-[var(--app-blue)]",
          state.dictating && !reduced && "animate-soft-pulse",
        )}
      />
      {state.dictated === null ? "Dictate an observation" : "Dictation added"}
    </button>
  );
}

/* ==========================================================================
 * 2) Zeugnisse
 * Produktstand: „Zeugnisbemerkungen — Live … im gelernten Schreibstil der
 * Lehrkraft." Editierbar laut „Fachverlauf und Stundenprotokoll — Live":
 * „der Text bleibt danach frei editierbar."
 * ========================================================================== */
export function AreaReports({
  state,
  actions,
}: {
  state: TourState;
  actions: TourActions;
}) {
  const { set, notify } = actions;
  const beobachtung = DEMO_TOUR_OBSERVATIONS.find((e) => e.id === state.chosen);

  /* ==========================================================================
   * KEIN ERFUNDENER ENTWURF AUS EINER EIGENEN BEOBACHTUNG
   * ==========================================================================
   * Naheliegend waere eine Schablone: Name einsetzen, Satz drumherum, fertig.
   * Sie waere die teuerste Zeile der ganzen Seite. Das Versprechen lautet „in
   * your writing style" – ein Baukastensatz aus dem Browser klingt garantiert
   * nicht danach und wuerde genau dieses Versprechen in dem Moment
   * widerlegen, in dem es gegeben wird.
   *
   * Die ehrliche Zeile ist staerker: Sie sagt, was das Produkt tut, und was
   * die Vorschau stattdessen zeigt. Kein Fehlerton, kein Bedauern – und ein
   * Weg weiter im selben Satz.
   */
  if (state.chosen === "eigen" && state.ownNote) {
    return (
      <section aria-labelledby="bereich-zeugnisse">
        <h2 id="bereich-zeugnisse" className={LABEL}>
          Reports
        </h2>

        <p className="mt-3 text-sm text-[var(--app-text)]">
          Based on your own observation
        </p>

        <div className="mt-3 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3 text-[13px] text-[var(--app-text-muted)]">
          {state.ownNote.text}
        </div>

        <p className="mt-4 rounded-[var(--app-radius-control)] border border-[var(--app-blue)] bg-[var(--app-surface)] p-3 text-[13px] leading-relaxed text-[var(--app-text)]">
          From your own observation, {PRODUCT_NAME} would now draft a comment in your
          writing style. In this preview, drafts come from the three samples — pick one to
          see it.
        </p>
      </section>
    );
  }

  if (!beobachtung) {
    return (
      <section aria-labelledby="bereich-zeugnisse">
        <h2 id="bereich-zeugnisse" className={LABEL}>
          Reports
        </h2>
        <p className="mt-3 text-sm text-[var(--app-text)]">
          First choose an entry under “Observations”.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="bereich-zeugnisse">
      <h2 id="bereich-zeugnisse" className={LABEL}>
        Reports
      </h2>

      <p className="mt-3 text-sm text-[var(--app-text)]">
        Based on: your observation about {beobachtung.child}
      </p>

      <div className="mt-3 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3 text-[13px] text-[var(--app-text-muted)]">
        {beobachtung.note}
      </div>

      {state.reportVariant === null ? (
        <div className="mt-5">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              set((s) => ({ ...s, reportVariant: 0, reportText: beobachtung.report }));
              notify("Draft generated · example");
            }}
          >
            Generate a draft
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--app-blue-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--app-blue-on-soft)]">
            <Sparkles aria-hidden="true" className="size-3" />
            In your writing style
          </span>

          {/* Frei editierbar – der Produktstand sagt das ausdruecklich. Ein
              <textarea> statt contenteditable: Es ist von Haus aus
              tastaturbedienbar und traegt ein Label. */}
          <label
            htmlFor="preview-draft"
            className="mt-3 block text-[11px] text-[var(--app-text-muted)]"
          >
            Draft – you can change it here
          </label>
          <textarea
            id="preview-draft"
            value={state.reportText}
            onChange={(e) => set((s) => ({ ...s, reportText: e.target.value }))}
            rows={4}
            className="mt-1.5 w-full rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] p-3 text-[13px] leading-relaxed text-[var(--app-text)]"
          />

          <div className="mt-3 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                const naechste = state.reportVariant === 0 ? 1 : 0;
                set((s) => ({
                  ...s,
                  reportVariant: naechste,
                  reportText: naechste === 0 ? beobachtung.report : beobachtung.report2,
                }));
                notify("Second draft · example");
              }}
            >
              Another wording
            </Button>
          </div>

          <p className="mt-3 text-[11px] text-[var(--app-text-muted)]">
            Prepared example
          </p>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
 * 3) Elternpost
 * Produktstand: „Elternmails, auf Wunsch uebersetzt — Live … Die Mail
 * entsteht auf Deutsch und wird in einem zweiten Schritt uebersetzt …
 * Namen und Signatur bleiben unangetastet."
 * ========================================================================== */
export function AreaMail({ state, actions }: { state: TourState; actions: TourActions }) {
  const { set, notify } = actions;

  /* ==========================================================================
   * DER EMPFAENGER IST JETZT HIER WAEHLBAR
   * ==========================================================================
   * Vorher hing die Mail an der Beobachtung, die im ANDEREN Bereich
   * ausgewaehlt war – wer direkt hierher kam, sah nur „First choose an entry
   * under Observations". Ein Bereich, der ohne einen anderen nichts zeigt,
   * ist eine Sackgasse.
   *
   * Die Anrede wechselt mit dem Kind (DEMO_PARENTS) und bleibt beim
   * Sprachwechsel danach stehen. Das ist der Punkt, den der Produktstand
   * macht: „Namen und Signatur bleiben unangetastet."
   */
  const beobachtung =
    DEMO_TOUR_OBSERVATIONS.find((e) => e.id === state.mailChild) ??
    DEMO_TOUR_OBSERVATIONS[0];

  const sprache = DEMO_MAIL_LANGS.find((l) => l.key === state.mailLang);
  const zeilen = beobachtung.mail.lines[state.mailLang];

  return (
    <section aria-labelledby="bereich-elternpost">
      <h2 id="bereich-elternpost" className={LABEL}>
        Parent post
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-[var(--app-text-muted)]">Recipient:</span>
        {DEMO_TOUR_OBSERVATIONS.map((e) => (
          <button
            key={e.id}
            type="button"
            aria-pressed={state.mailChild === e.id}
            onClick={() => {
              // Die Sprache faellt auf Englisch zurueck: Eine tuerkische
              // Fassung stehen zu lassen, waehrend der Name daneben wechselt,
              // waere ein Zustand, den niemand angefordert hat.
              set((s) => ({ ...s, mailChild: e.id, mailLang: "en" }));
              notify("Recipient changed");
            }}
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px]",
              TIPPZIEL,
              state.mailChild === e.id
                ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-blue)]",
            )}
          >
            {e.child}
          </button>
        ))}
      </div>

      {!state.mailCreated ? (
        <>
          <p className="mt-3 text-sm text-[var(--app-text)]">
            Your observation about {beobachtung.child} becomes a parent email.
          </p>
          <div className="mt-5">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                set((s) => ({ ...s, mailCreated: true }));
                notify("Email drafted · example");
              }}
            >
              Draft a parent email
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {DEMO_MAIL_LANGS.map((l) => (
              <button
                key={l.key}
                type="button"
                aria-pressed={state.mailLang === l.key}
                onClick={() => {
                  set((s) => ({ ...s, mailLang: l.key }));
                  notify("Translated · example");
                }}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  state.mailLang === l.key
                    ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                    : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-blue)]",
                )}
              >
                {l.label}
              </button>
            ))}
            {/* Die Zahl kommt aus der Liste in product.ts, nicht daneben
                getippt – sonst weicht sie beim naechsten Zuwachs ab. */}
            <span className="ml-1 rounded-full bg-[var(--app-blue-soft)] px-2 py-0.5 text-[10px] text-[var(--app-blue-on-soft)]">
              {TRANSLATION_LANGUAGE_COUNT} languages
            </span>
          </div>

          <div className="mt-4 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
            {/* Anrede und Signatur bleiben stehen – das ist die Zusage aus
                dem Produktstand, und sie ist hier sichtbar: Nur die beiden
                Inhaltszeilen wechseln die Sprache. */}
            <p className="text-[12px] text-[var(--app-text-muted)]">
              Subject: {beobachtung.mail.subject}
            </p>
            {/* Die Anrede kommt aus DEMO_PARENTS und wechselt mit dem
                Empfaenger. Sie bleibt beim Sprachwechsel stehen – genau
                das ist die Aussage: „Namen und Signatur bleiben
                unangetastet." */}
            <p className="mt-3 text-[13px] text-[var(--app-text)]">
              {DEMO_PARENTS[beobachtung.id]}
            </p>

            {/* `lang` UND `dir`: Die Inhaltszeilen wechseln die Sprache, und
                genau das ist die Aussage dieser Ansicht. Ohne lang liest ein
                Screenreader den tuerkischen Satz englisch vor – WCAG 3.1.2.
                Dasselbe Attribut sagt scripts/german-check.mjs, dass diese
                Zeilen nicht englisch sein sollen. */}
            <div
              lang={sprache?.lang}
              dir={sprache?.rtl ? "rtl" : "ltr"}
              className="mt-2 flex flex-col gap-1.5"
            >
              {zeilen.map((zeile) => (
                <p
                  key={zeile}
                  className="text-[13px] leading-relaxed text-[var(--app-text)]"
                >
                  {zeile}
                </p>
              ))}
            </div>

            <p className="mt-3 text-[13px] text-[var(--app-text)]">
              Kind regards
              <br />
              {DEMO_TEACHER}
            </p>
          </div>

          <p className="mt-3 text-[11px] text-[var(--app-text-muted)]">
            Greeting and signature stay untouched · prepared example
          </p>
        </>
      )}
    </section>
  );
}

/* ==========================================================================
 * 4) Material
 * Produktstand: „Unterrichtsmaterial aus echtem Fachwissen — Live … Die
 * Lehrkraft kann die Fundstellen auch selbst auswaehlen … Jedes erzeugte
 * Material weist seine Quellen aus."
 * ========================================================================== */
export function AreaMaterial({
  state,
  actions,
}: {
  state: TourState;
  actions: TourActions;
}) {
  const { set, notify } = actions;

  return (
    <section aria-labelledby="bereich-material">
      <h2 id="bereich-material" className={LABEL}>
        Materials
      </h2>

      <p className="mt-3 text-sm text-[var(--app-text)]">Choose a topic:</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {DEMO_MATERIAL_TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={state.topic === t.id}
            onClick={() =>
              set((s) => ({
                ...s,
                topic: t.id,
                topicFree: null,
                materialCreated: false,
              }))
            }
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px]",
              TIPPZIEL,
              state.topic === t.id
                ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-blue)]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Freies Thema. Es fuehrt bewusst NICHT zu einem erfundenen
          Arbeitsblatt: Die Vorschau hat drei vorbereitete Themen, und was
          daraus entsteht, ist das volle Erlebnis mit Quellen. Ein frei
          getipptes Thema bekommt die ehrliche Auskunft. */}
      <div className="mt-3 flex items-center gap-2 rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] px-3 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600">
        <label htmlFor="einblick-thema" className="sr-only">
          Type your own topic
        </label>
        <input
          id="einblick-thema"
          value={state.topicInput}
          maxLength={80}
          onChange={(e) => set((s) => ({ ...s, topicInput: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (state.topicInput.trim().length === 0) return;
            set((s) => ({
              ...s,
              topicFree: s.topicInput.trim(),
              topic: null,
              materialCreated: false,
              topicInput: "",
            }));
          }}
          placeholder="… or type your own topic"
          className={cn(
            "w-full bg-transparent py-2.5 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]",
            EINGABE_SCHRIFT,
          )}
        />
        <button
          type="button"
          aria-label="Use this topic"
          disabled={state.topicInput.trim().length === 0}
          onClick={() =>
            set((s) => ({
              ...s,
              topicFree: s.topicInput.trim(),
              topic: null,
              materialCreated: false,
              topicInput: "",
            }))
          }
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[var(--app-radius-control)] px-2 text-[var(--app-blue)] disabled:text-[var(--app-text-muted)]",
            TIPPZIEL,
          )}
        >
          <Send aria-hidden="true" className="size-4" />
        </button>
      </div>

      {state.topicFree ? (
        <p
          role="status"
          className="mt-3 rounded-[var(--app-radius-control)] border border-[var(--app-blue)] bg-[var(--app-surface)] p-3 text-[13px] leading-relaxed text-[var(--app-text)]"
        >
          In this preview, materials are ready for the three sample topics. In{" "}
          {PRODUCT_NAME}, yours is built from the subject corpus, with its sources.
        </p>
      ) : null}

      <p className="mt-5 text-sm text-[var(--app-text)]">
        Sources from the subject corpus:
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {DEMO_MATERIAL_SOURCES.map((q, i) => {
          const an = state.sources.includes(q.id);
          return (
            <li key={q.id}>
              <button
                type="button"
                aria-pressed={an}
                onClick={() =>
                  set((s) => ({
                    ...s,
                    sources: an
                      ? s.sources.filter((x) => x !== q.id)
                      : [...s.sources, q.id],
                  }))
                }
                className={cn(
                  "flex w-full items-center gap-2 rounded-[var(--app-radius-control)] border px-3 py-2 text-left",
                  an
                    ? "border-[var(--app-blue)] bg-[var(--app-surface-muted)]"
                    : "border-[var(--app-border)] bg-[var(--app-surface)]",
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    an
                      ? "border-[var(--app-blue)] bg-[var(--app-blue)]"
                      : "border-[var(--app-border)]",
                  )}
                >
                  {an ? (
                    <Check aria-hidden="true" className="size-3 text-surface" />
                  ) : null}
                </span>
                <span className="text-[12px] text-[var(--app-text)]">
                  [{i + 1}] {q.label}
                </span>
                <span className="ml-auto text-[10px] text-[var(--app-text-muted)]">
                  {q.note}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5">
        <Button
          variant="outline"
          size="md"
          disabled={!state.topic || state.sources.length === 0}
          onClick={() => {
            set((s) => ({ ...s, materialCreated: true }));
            notify("Materials generated · example");
          }}
        >
          Generate materials
        </Button>
      </div>

      {state.materialCreated ? (
        <div className="mt-4 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
          <p className="text-[11px] text-[var(--app-text-muted)]">
            {DEMO_MATERIAL_TOPICS.find((t) => t.id === state.topic)?.label}
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {DEMO_MATERIAL_RESULT.map((zeile, i) => (
              <li key={zeile} className="text-[13px] text-[var(--app-text)]">
                {zeile}{" "}
                {/* Ein Marker je Aufgabe, reihum aus den angehakten
                    Fundstellen. Wer eine abwaehlt, sieht die Marker sofort
                    wechseln – genau das meint „states its sources". */}
                <span className="text-[11px] text-[var(--app-blue)]">
                  [
                  {DEMO_MATERIAL_SOURCES.findIndex(
                    (q) => q.id === state.sources[i % state.sources.length],
                  ) + 1}
                  ]
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-[var(--app-text-muted)]">
            Sources:{" "}
            {state.sources
              .map((id) => DEMO_MATERIAL_SOURCES.find((q) => q.id === id)?.label)
              .join(" · ")}
          </p>
        </div>
      ) : null}
    </section>
  );
}

/* ==========================================================================
 * 5) Sitzplan
 * Produktstand: „Sitzplaene — Live … Grafischer Sitzplan mit gesperrten
 * Plaetzen und Drag-and-drop."
 *
 * KEIN KI-Vorschlag: Derselbe Absatz nennt ihn ausdruecklich als Prototyp,
 * und Prototyp ist laut CLAUDE.md tabu.
 * ========================================================================== */
export function AreaSeating({
  state,
  actions,
}: {
  state: TourState;
  actions: TourActions;
}) {
  const { set, notify, reduced } = actions;

  function waehle(id: string) {
    const platz = state.seats.find((s) => s.id === id);
    if (!platz) return;

    if (platz.locked) {
      set((s) => ({ ...s, refused: id }));
      window.setTimeout(() => set((s) => ({ ...s, refused: null })), 400);
      return;
    }

    if (state.picked === null) {
      if (platz.initials === null) return;
      set((s) => ({ ...s, picked: id }));
      return;
    }
    if (state.picked === id) {
      set((s) => ({ ...s, picked: null }));
      return;
    }

    set((s) => {
      const von = s.seats.find((x) => x.id === s.picked);
      const nach = s.seats.find((x) => x.id === id);
      if (!von || !nach) return s;
      return {
        ...s,
        picked: null,
        seats: s.seats.map((x) =>
          x.id === s.picked
            ? { ...x, initials: nach.initials }
            : x.id === id
              ? { ...x, initials: von.initials }
              : x,
        ),
      };
    });
    // Kurzer Haken am Zielplatz: die Rueckmeldung, dass der Tausch wirklich
    // passiert ist. Der Timer haengt am Effekt unten, damit er beim
    // Bereichswechsel und beim Zuruecksetzen mit abgeraeumt wird.
    set((s) => ({ ...s, seated: id }));
    notify("Added · example");
  }

  /* Derselbe Grund wie beim Diktat: kein freilaufender setTimeout. Wer den
     Bereich wechselt, waehrend der Haken steht, hinterlaesst sonst einen
     Timer, der in einen abgebauten Zustand schreibt. */
  useEffect(() => {
    if (!state.seated) return;
    const timer = window.setTimeout(() => set((s) => ({ ...s, seated: null })), 1400);
    return () => window.clearTimeout(timer);
  }, [state.seated, set]);

  return (
    <section aria-labelledby="bereich-sitzplan">
      <h2 id="bereich-sitzplan" className={LABEL}>
        Seating plan
      </h2>

      <p className="mt-3 text-sm text-[var(--app-text)]">
        Tap a child, then the new seat – the two swap. The padlock locks a seat.
      </p>

      <p className="mt-3 rounded-[var(--app-radius-control)] bg-[var(--app-surface-muted)] py-1 text-center text-[10px] tracking-wide text-[var(--app-text-muted)] uppercase">
        Board
      </p>

      <ul className="mt-3 grid grid-cols-3 gap-2">
        {state.seats.map((platz) => {
          const aufgenommen = state.picked === platz.id;
          const abgelehnt = state.refused === platz.id;
          const name = platz.locked
            ? "Locked seat"
            : platz.initials
              ? `Seat of ${platz.initials}`
              : "Free seat";

          return (
            <li key={platz.id} className="relative">
              <button
                type="button"
                aria-pressed={aufgenommen}
                aria-label={name}
                onClick={() => waehle(platz.id)}
                className={cn(
                  "flex h-16 w-full items-center justify-center rounded-[var(--app-radius-card)] border text-[11px] font-medium",
                  !reduced && "transition-transform",
                  platz.locked
                    ? "border-[var(--app-border)] bg-[var(--app-surface-muted)] text-[var(--app-text-muted)]"
                    : aufgenommen
                      ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                      : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-blue)]",
                  abgelehnt && !reduced && "animate-seat-refuse",
                )}
              >
                {platz.locked ? (
                  <Lock aria-hidden="true" className="size-3.5" />
                ) : platz.initials ? (
                  <span className="relative flex size-7 items-center justify-center rounded-full bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]">
                    {platz.initials}
                    {state.seated === platz.id ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -right-1.5 -bottom-1.5 flex size-4 items-center justify-center rounded-full bg-[var(--app-blue)]",
                          !reduced && "animate-chip-pop",
                        )}
                      >
                        <Check className="size-2.5 text-white" />
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </button>

              {/* Sperren und entsperren. Eigener Schalter, damit der Tausch
                  nicht versehentlich zur Sperre wird. */}
              <button
                type="button"
                aria-label={platz.locked ? `Unlock ${name}` : `Lock seat ${platz.id}`}
                aria-pressed={platz.locked}
                onClick={() => {
                  set((s) => ({
                    ...s,
                    seats: s.seats.map((x) =>
                      x.id === platz.id ? { ...x, locked: !x.locked } : x,
                    ),
                  }));
                  notify(platz.locked ? "Seat released" : "Seat locked");
                }}
                /* Das Schloss war 16 x 16 px gross – unter dem Pflichtmass von
                   24 px (WCAG 2.5.8). Das Zeichen bleibt klein, die Flaeche
                   darum waechst auf 28 px. NICHT auf 44: Der Schalter liegt IN
                   der Sitzplatz-Kachel, und 44 px wuerden dort den Tausch
                   verdecken – ein groesseres Ziel, das ein wichtigeres frisst,
                   ist keine Verbesserung. */
                className="absolute top-0.5 right-0.5 flex items-center justify-center rounded p-2 text-[var(--app-text-muted)] hover:text-[var(--app-blue)]"
              >
                <Lock aria-hidden="true" className="size-3" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ==========================================================================
 * 6) Stundenplan
 * Produktstand: „Klassenstundenplan ohne Pflegeaufwand — Live … Wer bei
 * seinem Fach Zeiten hinterlegt, steht im Plan … eingetragen ueber einen
 * Wochenplaner zum Anklicken und Ziehen."
 * ========================================================================== */
export function AreaTimetable({
  state,
  actions,
}: {
  state: TourState;
  actions: TourActions;
}) {
  const { set, notify } = actions;
  const [fach, setzeFach] = [
    state.timetable.__fach ?? DEMO_TIMETABLE_SUBJECTS[0],
    (f: string) => set((s) => ({ ...s, timetable: { ...s.timetable, __fach: f } })),
  ];

  return (
    <section aria-labelledby="bereich-stundenplan">
      <h2 id="bereich-stundenplan" className={LABEL}>
        Timetable
      </h2>

      <p className="mt-3 text-sm text-[var(--app-text)]">
        Choose your subject, then tap a free period. Tapping again removes it.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {DEMO_TIMETABLE_SUBJECTS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={fach === f}
            onClick={() => setzeFach(f)}
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px]",
              /* Die Fach-Chips massen 23,5 px – knapp unter dem Pflichtmass.
                 Knapp daneben ist auch daneben. */
              TIPPZIEL,
              fach === f
                ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-blue)]",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Auf schmalen Displays scrollt die Tabelle waagerecht. Der Hinweis
          steht sichtbar darueber – eine Scrollflaeche ohne Ansage ist auf
          dem Handy unsichtbar. */}
      <p className="mt-4 text-[11px] text-[var(--app-text-muted)] sm:hidden">
        Swipe sideways →
      </p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[26rem] table-fixed border-collapse text-[11px]">
          <caption className="sr-only">
            Weekly timetable for the class. Every cell is a button.
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="w-12 p-1 text-left font-medium text-[var(--app-text-muted)]"
              >
                Period
              </th>
              {DEMO_TIMETABLE_DAYS.map((t) => (
                <th
                  key={t}
                  scope="col"
                  className="p-1 font-medium text-[var(--app-text-muted)]"
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEMO_TIMETABLE_SLOTS.map((slot) => (
              <tr key={slot}>
                <th
                  scope="row"
                  className="p-1 text-left font-normal text-[var(--app-text-muted)]"
                >
                  {slot}
                </th>
                {DEMO_TIMETABLE_DAYS.map((tag) => {
                  const id = `${tag}-${slot}`;
                  const belegt = state.timetable[id] ?? null;

                  return (
                    <td key={id} className="p-1">
                      <button
                        type="button"
                        aria-label={
                          belegt ? `${tag}, ${slot}: ${belegt}` : `${tag}, ${slot}: free`
                        }
                        onClick={() => {
                          set((s) => ({
                            ...s,
                            timetable: {
                              ...s.timetable,
                              [id]: s.timetable[id] ? null : fach,
                            },
                          }));
                          notify(belegt ? "Period removed" : "Added · example");
                        }}
                        /* Eine Farbe je Fach. Die Werte stehen in
                           demo-data.ts und halten alle AA – geprueft vom
                           Kontrast-Teil in scripts/qa-en.mjs, der bis in die
                           App-Fenster reicht. Ohne sie sieht eine volle Woche
                           aus wie eine leere. */
                        style={
                          belegt && DEMO_SUBJECT_COLORS[belegt]
                            ? {
                                backgroundColor: DEMO_SUBJECT_COLORS[belegt].bg,
                                color: DEMO_SUBJECT_COLORS[belegt].text,
                                borderColor: DEMO_SUBJECT_COLORS[belegt].text,
                              }
                            : undefined
                        }
                        className={cn(
                          "h-11 w-full rounded border text-[10px] sm:h-9",
                          !belegt &&
                            "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] hover:border-[var(--app-blue)]",
                        )}
                      >
                        {belegt ?? "+"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-[var(--app-text-muted)]">
        No editorial step, no approval – whoever stores times is in the plan.
      </p>
    </section>
  );
}

/* ==========================================================================
 * 7) Entwicklung
 * Produktstand: „Foerderempfehlungen, Timeline, Klassenanalyse — Live … Je
 * Kind eine chronologische Timeline."
 * ========================================================================== */
export function AreaDevelopment({
  state,
  actions,
}: {
  state: TourState;
  actions: TourActions;
}) {
  const { set } = actions;
  const kind =
    DEMO_TOUR_OBSERVATIONS.find((e) => e.id === state.timelineChild) ??
    DEMO_TOUR_OBSERVATIONS[0];

  return (
    <section aria-labelledby="bereich-entwicklung">
      <h2 id="bereich-entwicklung" className={LABEL}>
        Development
      </h2>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {DEMO_TOUR_OBSERVATIONS.map((e) => (
          <button
            key={e.id}
            type="button"
            aria-pressed={kind.id === e.id}
            onClick={() => set((s) => ({ ...s, timelineChild: e.id, openEntries: [] }))}
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px]",
              TIPPZIEL,
              kind.id === e.id
                ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-blue)]",
            )}
          >
            {e.child}
          </button>
        ))}
      </div>

      {/* Die eigene Beobachtung haengt HINTEN an – als neuester Eintrag,
          weil die Timeline aufsteigend laeuft. Das ist der Moment, um den es
          geht: Der eben getippte Satz steht jetzt in der Akte des Kindes. */}
      <ol className="mt-4 flex flex-col gap-2">
        {[
          ...kind.timeline,
          ...(state.ownNote && state.ownNote.child === kind.id
            ? [
                {
                  date: "today",
                  title: "Your observation",
                  text: state.ownNote.text,
                  eigen: true,
                },
              ]
            : []),
        ].map((eintrag) => {
          const id = `${kind.id}-${eintrag.date}`;
          const offen = state.openEntries.includes(id);

          return (
            <li
              key={id}
              className={cn(
                "rounded-[var(--app-radius-card)] border bg-[var(--app-surface)]",
                "eigen" in eintrag
                  ? "border-[var(--app-blue)]"
                  : "border-[var(--app-border)]",
              )}
            >
              <button
                type="button"
                aria-expanded={offen}
                onClick={() =>
                  set((s) => ({
                    ...s,
                    openEntries: offen
                      ? s.openEntries.filter((x) => x !== id)
                      : [...s.openEntries, id],
                  }))
                }
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span className="shrink-0 text-[11px] text-[var(--app-text-muted)]">
                  {eintrag.date}
                </span>
                <span className="text-[13px] text-[var(--app-text)]">
                  {eintrag.title}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto text-[11px] text-[var(--app-text-muted)]"
                >
                  {offen ? "−" : "+"}
                </span>
              </button>

              {offen ? (
                <p className="border-t border-[var(--app-border)] p-3 text-[12px] leading-relaxed text-[var(--app-text-muted)]">
                  {eintrag.text}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="mt-3 text-[11px] text-[var(--app-text-muted)]">
        A chronological timeline per child · prepared example
      </p>
    </section>
  );
}
