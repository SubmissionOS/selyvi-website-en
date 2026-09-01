"use client";

import { useState } from "react";
import { ChevronDown, Clock, Search, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEMO_CHILDREN, DEMO_CLASS, DEMO_SUBJECT } from "@/config/demo-data";
import {
  AreaMail,
  AreaReports,
  AreaSeating,
  AreaTimetable,
  type TourActions,
  type TourState,
} from "@/components/einblick/areas";
import { LOCKED_HINT } from "@/components/einblick/tour-sidebar";

/**
 * „Meine Klassen" – der Startbereich, nach docs/app-referenz/meine-klassen.png
 * und Stundenplan.png.
 *
 * ==========================================================================
 * WAS AUS DEM SCREENSHOT KOMMT
 * ==========================================================================
 *   - Zwei Ebenen Tabs: oben „Meine Klassen | Alle Klassen" als gefüllter
 *     blauer Reiter in einem gerahmten Kasten, rechts „Übersicht |
 *     Stundenplan | Dokumente | Unterricht planen | [Fach]" als Text mit
 *     blauem Unterstrich.
 *   - Linke Spalte: Klassen-Auswahl, Namenssuche, blauer Knopf „Schüler
 *     hinzufügen", darunter die Liste mit Name und Status.
 *   - Rechts die Karten „Klassenansicht", „Notenschnitt",
 *     „Klassenübersicht" (grüne Förderblick-Chips) und „Klassen-Puls"
 *     (Donut).
 *
 * ==========================================================================
 * WAS NICHT AUS DEM SCREENSHOT KOMMT – UND DESHALB GEKENNZEICHNET IST
 * ==========================================================================
 *   - DIE NAMEN. Der Screenshot zeigt einen anderen Datensatz; übernommen
 *     wird davon nichts. Hier steht unser Cast (Klasse 3b, Emma K. …), so
 *     wie in jeder anderen Szene auch.
 *   - „Förderblick" und „Klassen-Puls" stehen so im Bild, aber NICHT in
 *     docs/produktstand-2026-08.md. Die Beschriftungen sind deshalb wörtlich
 *     übernommen und werden nirgends auf der Website erklärt oder als
 *     Fähigkeit behauptet – ein Bild zeigen ist etwas anderes als eine
 *     Zusage geben.
 *   - Der Tab „Unterricht planen" trägt hier den Sitzplan. ORT IM ORIGINAL
 *     UNBESTÄTIGT: Im Screenshot ist der Tab vorhanden, sein Inhalt aber
 *     nicht zu sehen. Sobald ein Screenshot davon vorliegt, gehört der
 *     Sitzplan dorthin, wo er wirklich sitzt.
 *   - „Dokumente" und der Fach-Tab tragen ein Schloss, weil von ihnen kein
 *     Bild vorliegt.
 *   - Zeugnisbemerkung und Elternmail hängen am Schüler-Detail. MAPPING
 *     FOLGT NACH SCREENSHOT: In der Referenz gibt es dafür keinen
 *     Navigationspunkt; ein Kind ist der nächstliegende Ort, weil beides zu
 *     einem Kind entsteht.
 */

type Props = { state: TourState; actions: TourActions };

type Tab = "uebersicht" | "stundenplan" | "dokumente" | "planen" | "fach";

const TABS: { key: Tab; label: string; gesperrt?: boolean }[] = [
  { key: "uebersicht", label: "Overview" },
  { key: "stundenplan", label: "Timetable" },
  { key: "dokumente", label: "Documents", gesperrt: true },
  { key: "planen", label: "Plan a lesson" },
  { key: "fach", label: DEMO_SUBJECT, gesperrt: true },
];

/**
 * Der Klassen-Puls im Original zeigt 30 %. Hier steht ein anderer Wert, damit
 * niemand die Zahl für eine Messung hält – Beispieldaten, wie alles in diesem
 * Fenster. Der Bogen ist gegenüber der Referenz abgedunkelt (Kontrast, siehe
 * app-reference.ts).
 */
const PULS = 42;

export function AreaMyClasses({ state, actions }: Props) {
  const [tab, setTab] = useState<Tab>("uebersicht");
  const [suche, setSuche] = useState("");
  const [kind, setKind] = useState<string | null>(null);
  const [hinweis, setHinweis] = useState<string | null>(null);

  const gefiltert = DEMO_CHILDREN.filter((k) =>
    k.name.toLowerCase().includes(suche.trim().toLowerCase()),
  );

  const gewaehlt = DEMO_CHILDREN.find((k) => k.name === kind) ?? null;

  return (
    <div>
      {/* Der Bereichsname für Screenreader.

          UNSICHTBAR, WEIL DAS ORIGINAL IHN NICHT ZEIGT: Die anderen Bereiche
          tragen eine sichtbare Kleinschrift-Überschrift, diese Ansicht im
          Original nicht – sie beginnt direkt mit den Reitern. Ohne
          Überschrift sprang die Gliederung hier aber von h1 auf h3, und axe
          hat das gemeldet (heading-order). Ein sr-only-h2 gibt die Stufe
          zurück, ohne dem Bild etwas hinzuzufügen. */}
      <h2 id="bereich-meine-klassen" className="sr-only">
        My classes
      </h2>

      {/* Kartenueberschrift ueber den Reitern. Im Original sitzt der ganze
          Block (Ueberschrift, Reiter, Inhalt) in einer Karte – genau wie auf
          der Material-Seite, wo ueber den Reitern „Material" steht. */}
      <p className="mb-3 text-base font-bold text-[var(--app-text)]">Classes</p>

      {/* ---------- Obere Tab-Ebene: gefüllter Reiter im Rahmen ---------- */}
      <div className="flex items-center gap-1 rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] p-1">
        <span className="rounded-[var(--app-radius-control)] bg-[var(--app-blue)] px-3 py-1.5 text-[11px] font-semibold text-white">
          My classes
        </span>
        <button
          type="button"
          onClick={() => setHinweis("alle-klassen")}
          onFocus={() => setHinweis("alle-klassen")}
          onBlur={() => setHinweis(null)}
          aria-describedby={
            hinweis === "alle-klassen" ? "einblick-alle-klassen" : undefined
          }
          className="rounded-[var(--app-radius-control)] px-3 py-1.5 text-[11px] text-[var(--app-text-muted)] hover:text-[var(--app-blue)]"
        >
          All classes
        </button>
      </div>

      {hinweis === "alle-klassen" ? (
        <p
          id="einblick-alle-klassen"
          role="status"
          className="mt-2 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-2.5 text-[11px] text-[var(--app-text)]"
        >
          {LOCKED_HINT}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[15rem_1fr]">
        {/* ================= Linke Spalte: Klasse und Schüler ============= */}
        <div className="rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
          <span className="flex items-center justify-between rounded-[var(--app-radius-control)] border border-[var(--app-border)] px-2.5 py-2 text-[12px] text-[var(--app-text)]">
            Class {DEMO_CLASS}
            <ChevronDown aria-hidden="true" className="size-3.5 opacity-60" />
          </span>

          {/* Der Fokusring gehoert an das Feld, nicht weg: Ein frueher hier
              gesetztes `outline-none` hat die globale :focus-visible-Regel
              ausgehebelt – gemessen im Tastatur-Protokoll, das genau dafuer
              da ist. Der Ring liegt jetzt am umschliessenden Label, damit er
              die ganze Suchzeile umfasst statt nur den Text. */}
          <label className="mt-2 flex items-center gap-2 rounded-[var(--app-radius-control)] border border-[var(--app-border)] px-2.5 py-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600">
            <Search aria-hidden="true" className="size-3.5 opacity-60" />
            <span className="sr-only">Search for a name</span>
            <input
              value={suche}
              onChange={(event) => setSuche(event.target.value)}
              placeholder="Search for a name…"
              className="w-full bg-transparent text-[12px] text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
              /* outline-none nur, weil der Ring am Label sitzt – siehe oben. */
            />
          </label>

          <button
            type="button"
            onClick={() => actions.notify("Example – nothing is created")}
            className="mt-2 w-full rounded-[var(--app-radius-control)] bg-[var(--app-blue)] px-3 py-2 text-[12px] font-semibold text-white"
          >
            Add a pupil
          </button>

          <ul className="mt-2">
            {gefiltert.map((k) => (
              <li
                key={k.name}
                className="border-b border-[var(--app-border)] last:border-0"
              >
                <button
                  type="button"
                  onClick={() => setKind(kind === k.name ? null : k.name)}
                  aria-pressed={kind === k.name}
                  className={cn(
                    "w-full px-1 py-2 text-left",
                    kind === k.name && "bg-[var(--app-blue-soft)]",
                  )}
                >
                  <span className="block text-[12px] font-semibold text-[var(--app-text)]">
                    {k.name}
                  </span>
                  <span className="block text-[11px] text-[var(--app-text-muted)]">
                    New
                  </span>
                </button>
              </li>
            ))}

            {gefiltert.length === 0 ? (
              <li className="py-3 text-[11px] text-[var(--app-text-muted)]">
                No name found.
              </li>
            ) : null}
          </ul>
        </div>

        {/* ================= Rechte Spalte: Tabs und Inhalt =============== */}
        <div className="min-w-0">
          <div
            role="tablist"
            aria-label="View of the class"
            className="flex flex-wrap items-center gap-4 border-b border-[var(--app-border)]"
          >
            {TABS.map((eintrag) => {
              const aktiv = tab === eintrag.key;
              return (
                <button
                  key={eintrag.key}
                  type="button"
                  role="tab"
                  aria-selected={aktiv}
                  onClick={() =>
                    eintrag.gesperrt ? setHinweis(eintrag.key) : setTab(eintrag.key)
                  }
                  className={cn(
                    "-mb-px border-b-2 px-1 pb-2 text-[12px]",
                    aktiv
                      ? "border-[var(--app-blue)] font-semibold text-[var(--app-blue)]"
                      : "border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-blue)]",
                  )}
                >
                  {eintrag.label}
                </button>
              );
            })}
          </div>

          {hinweis && hinweis !== "alle-klassen" ? (
            <p
              role="status"
              className="mt-3 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-2.5 text-[11px] text-[var(--app-text)]"
            >
              {LOCKED_HINT}
            </p>
          ) : null}

          <div className="mt-4">
            {gewaehlt ? (
              <SchuelerDetail
                name={gewaehlt.name}
                onClose={() => setKind(null)}
                state={state}
                actions={actions}
              />
            ) : tab === "uebersicht" ? (
              <Uebersicht />
            ) : tab === "stundenplan" ? (
              <AreaTimetable state={state} actions={actions} />
            ) : tab === "planen" ? (
              <AreaSeating state={state} actions={actions} />
            ) : (
              <Uebersicht />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* Overview: die vier Karten aus der Referenz                                */
/* ========================================================================= */
function Uebersicht() {
  const umfang = 2 * Math.PI * 34;

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
        <h3 className="text-base font-bold text-[var(--app-text)]">
          Class view {DEMO_CLASS}
        </h3>
        <p className="mt-1 text-[11px] text-[var(--app-text-muted)]">
          {DEMO_CHILDREN.length} pupils · subjects, mark average and administration
        </p>

        <p className="mt-4 text-[12px] font-semibold text-[var(--app-text)]">
          My subjects
        </p>

        <div className="mt-2 flex items-center justify-between gap-3 rounded-[var(--app-radius-control)] bg-[var(--app-surface-muted)] px-3 py-2.5">
          <span>
            <span className="block text-[12px] font-semibold text-[var(--app-text)]">
              {DEMO_SUBJECT}
            </span>
            <span className="block text-[11px] text-[var(--app-text-muted)]">
              Mon P2 · Wed P2 · Fri P2
            </span>
          </span>

          <span className="flex items-center gap-2">
            {/* Weisse Fuellung, nicht durchsichtig: Auf der grauen Fachzeile
                kaeme das Blau sonst auf 4,44:1 – gemessen, knapp unter den
                4,5:1 fuer Fliesstext. Im Original ist der Knopf ebenfalls
                weiss gefuellt. */}
            <span className="inline-flex items-center gap-1.5 rounded-[var(--app-radius-control)] border border-[var(--app-blue)] bg-[var(--app-surface)] px-2.5 py-1 text-[11px] text-[var(--app-blue)]">
              <Clock aria-hidden="true" className="size-3" />
              Edit
            </span>
            <Trash2
              aria-hidden="true"
              className="size-3.5 text-[var(--app-text-muted)]"
            />
          </span>
        </div>

        <span className="mt-3 block rounded-[var(--app-radius-control)] border border-[var(--app-blue)] px-3 py-2 text-center text-[12px] text-[var(--app-blue)]">
          Add a subject
        </span>
      </div>

      <div className="rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
        <h3 className="text-base font-bold text-[var(--app-text)]">Mark average</h3>
        <p className="mt-3 flex items-center justify-between text-[12px] text-[var(--app-text)]">
          <span className="font-semibold">{DEMO_SUBJECT}</span>
          <span className="font-semibold">No marks</span>
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_13rem]">
        <div className="rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
          <h3 className="text-base font-bold text-[var(--app-text)]">Class overview</h3>
          {/* „support overview“ fuer „Förderblick“ – Beschriftung aus der
              Anwendung; die Bedeutung ist im Produktstand nicht dokumentiert
              (docs/glossar-en.md, docs/en-review.md). */}
          <p className="mt-1 text-[11px] text-[var(--app-text-muted)]">
            Support overview of all pupils in the selected class.
          </p>

          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DEMO_CHILDREN.map((k) => (
              <li
                key={k.name}
                className="rounded-[var(--app-radius-control)] bg-[var(--app-chip-green-bg)] px-2.5 py-2 text-[11px] font-semibold text-[var(--app-chip-green-text)]"
              >
                {k.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
          <h3 className="text-base font-bold text-[var(--app-text)]">Class pulse</h3>
          <p className="mt-1 text-[11px] text-[var(--app-text-muted)]">
            Average support overview of the class currently selected.
          </p>

          {/* Feste Maße, kein Nachladen: Der Donut ist SVG im Fluss und
              verschiebt nichts. */}
          <div className="mt-4 flex justify-center">
            <svg
              viewBox="0 0 80 80"
              className="size-24"
              role="img"
              aria-label={`Class pulse: ${PULS} per cent, sample data`}
            >
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="var(--app-donut-track)"
                strokeWidth="9"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="var(--app-donut-arc)"
                strokeWidth="9"
                strokeLinecap="butt"
                strokeDasharray={`${(umfang * PULS) / 100} ${umfang}`}
                transform="rotate(-90 40 40)"
              />
              <text
                x="40"
                y="45"
                textAnchor="middle"
                className="fill-[var(--app-text)] text-[15px] font-bold"
              >
                {PULS}%
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* Schueler-Detail: der vorlaeufige Ort fuer Zeugnis und Elternpost          */
/* ========================================================================= */
function SchuelerDetail({
  name,
  onClose,
  state,
  actions,
}: {
  name: string;
  onClose: () => void;
  state: TourState;
  actions: TourActions;
}) {
  const [tat, setTat] = useState<"zeugnis" | "mail">("zeugnis");

  return (
    <div className="rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[var(--app-text)]">{name}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] text-[var(--app-blue)] underline underline-offset-4"
        >
          Back to the class view
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Actions for this child"
        className="mt-3 flex items-center gap-4 border-b border-[var(--app-border)]"
      >
        {(
          [
            ["zeugnis", "Report comment"],
            ["mail", "Parent email"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tat === key}
            onClick={() => setTat(key)}
            className={cn(
              "-mb-px border-b-2 px-1 pb-2 text-[12px]",
              tat === key
                ? "border-[var(--app-blue)] font-semibold text-[var(--app-blue)]"
                : "border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-blue)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tat === "zeugnis" ? (
          <AreaReports state={state} actions={actions} />
        ) : (
          <AreaMail state={state} actions={actions} />
        )}
      </div>
    </div>
  );
}
