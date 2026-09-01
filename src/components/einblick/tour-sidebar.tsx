"use client";

import {
  BookOpen,
  Clipboard,
  Clock,
  Heart,
  Home,
  Lock,
  Mic,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { PRODUCT_NAME } from "@/config/brand";

/**
 * Die Seitenleiste des Einblicks – bedienbar, im Gegensatz zu der in den
 * Szenen.
 *
 * ==========================================================================
 * DIE EINTRÄGE SIND ABGESCHRIEBEN, NICHT HERGELEITET
 * ==========================================================================
 * Acht Punkte, in dieser Reihenfolge, mit diesen Beschriftungen – so steht
 * die Navigation in docs/app-referenz/Material-generator.png und
 * Stundenplan.png. Vorher standen hier elf Punkte, die aus den als „Live"
 * geführten Funktionen des Produktstands abgeleitet waren. Die Herleitung war
 * sauber begründet und trotzdem falsch: Ein Funktionsverzeichnis ist keine
 * Navigation.
 *
 * VIER SIND OFFEN, VIER TRAGEN EIN SCHLOSS. Offen ist, wofür wir eine
 * Vorstellung haben, die dem Original entspricht. Geschlossen sind „Today",
 * „Review", „Support plans" und „Class analysis" – von diesen Ansichten liegt
 * kein Screenshot vor, und etwas zu erfinden wäre genau das, was diese Seite
 * nicht tut.
 *
 * Das Aktiv-Bild folgt dem Original: hellblaue Fläche, blauer Balken links,
 * blaue Schrift. Die Schriftfarbe ist um eine Stufe dunkler als im Original –
 * siehe app-reference.ts, es geht um Kontrast.
 */
export type TourArea = "meine-klassen" | "live-unterricht" | "timeline" | "material";

type Entry = {
  key: string;
  label: string;
  icon: LucideIcon;
  area?: TourArea;
};

/**
 * DIE BESCHRIFTUNGEN SIND DIESELBEN WIE IN DEN SZENEN.
 *
 * Sie stehen als DEMO_NAV_TEACHER in src/config/demo-data.ts – dort auch die
 * Begruendung, warum die gezeigte Oberflaeche englisch ist (en-review.md,
 * Punkt 9). Hier stehen sie ein zweites Mal, weil diese Leiste zusaetzlich
 * Symbole und die Zuordnung zu den bedienbaren Bereichen traegt.
 *
 * Wer eine Beschriftung aendert, aendert sie an BEIDEN Stellen – sonst heisst
 * derselbe Menuepunkt in der Szene anders als im Einblick.
 */
const ENTRIES: Entry[] = [
  { key: "heute", label: "Today", icon: Home },
  { key: "meine-klassen", label: "My classes", icon: Users, area: "meine-klassen" },
  {
    key: "live-unterricht",
    label: "Live lesson",
    icon: Mic,
    area: "live-unterricht",
  },
  { key: "timeline", label: "Timeline", icon: Clock, area: "timeline" },
  { key: "ueberpruefung", label: "Review", icon: Clipboard },
  { key: "foerderplaene", label: "Support plans", icon: Heart },
  { key: "material", label: "Materials", icon: BookOpen, area: "material" },
  { key: "klassenanalyse", label: "Class analysis", icon: TrendingUp },
];

export const LOCKED_HINT = "We show you this area in person, when we meet.";

/** Wie viele Einträge tragen ein Schloss? Für den Satz unter dem Fenster. */
export const LOCKED_COUNT = ENTRIES.filter((entry) => !entry.area).length;

type Props = {
  current: TourArea;
  onSelect: (area: TourArea) => void;
  openLock: string | null;
  onLock: (key: string | null) => void;
  observationCount: number;
  suggested: TourArea | null;
};

export function TourSidebar({
  current,
  onSelect,
  openLock,
  onLock,
  observationCount,
  suggested,
}: Props) {
  return (
    <div className="flex w-14 shrink-0 flex-col border-r border-[var(--app-border)] bg-[var(--app-surface)] p-1.5 sm:w-44 sm:p-2">
      <span className="mb-2 hidden shrink-0 px-2 text-base font-bold text-[var(--app-blue)] sm:block">
        {PRODUCT_NAME}
      </span>

      <ul className="flex flex-col gap-0.5">
        {ENTRIES.map((entry) => {
          const Icon = entry.icon;
          const isActive = entry.area === current;
          const isLocked = !entry.area;
          const isSuggested = !isActive && entry.area != null && entry.area === suggested;
          const hintId = `einblick-schloss-${entry.key}`;

          return (
            <li key={entry.key} className="relative">
              <button
                type="button"
                onClick={() => (entry.area ? onSelect(entry.area) : onLock(entry.key))}
                onFocus={() => (isLocked ? onLock(entry.key) : onLock(null))}
                onBlur={() => isLocked && onLock(null)}
                aria-current={isActive ? "true" : undefined}
                aria-describedby={isLocked ? hintId : undefined}
                /* Der Name steht im aria-label, nicht nur im sichtbaren
                   <span>: Unter 640 px ist der ausgeblendet, und das Symbol
                   ist aria-hidden – ohne dieses Attribut waere der Schalter
                   dort namenlos. Gemessen, nicht vermutet: Lighthouse prueft
                   in Mobilbreite und hat genau das gemeldet. */
                aria-label={isLocked ? `${entry.label}, locked` : entry.label}
                className={cn(
                  "relative flex w-full items-center justify-center gap-2 rounded-[var(--app-radius-nav)] px-2 py-1.5 text-left sm:justify-start",
                  isActive &&
                    "bg-[var(--app-blue-soft)] font-semibold text-[var(--app-blue-on-soft)]",
                  !isActive &&
                    !isLocked &&
                    "text-[var(--app-text)] hover:bg-[var(--app-blue-soft)]",
                  isLocked && "text-[var(--app-text-muted)]",
                  // Der Vorschlag leuchtet nur auf – er erzwingt nichts.
                  isSuggested && "ring-1 ring-[var(--app-blue)] ring-inset",
                )}
              >
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px] rounded-r bg-[var(--app-blue)]"
                  />
                ) : null}

                <Icon
                  aria-hidden="true"
                  className={cn(
                    "size-3.5 shrink-0",
                    isActive && "text-[var(--app-blue)]",
                  )}
                />
                <span className="hidden truncate text-[11px] sm:inline">
                  {entry.label}
                </span>

                {entry.key === "live-unterricht" ? (
                  <span className="ml-auto hidden rounded-full bg-[var(--app-surface-muted)] px-1.5 text-[10px] text-[var(--app-text-muted)] sm:inline">
                    {observationCount}
                  </span>
                ) : null}

                {isLocked ? (
                  <Lock
                    aria-hidden="true"
                    className="ml-auto hidden size-3 shrink-0 sm:block"
                  />
                ) : null}
              </button>

              {/* Der Hinweis steht IMMER im DOM, wenn er offen ist – nicht nur
                  optisch: aria-describedby verweist darauf, und der Fokus
                  oeffnet ihn genauso wie der Klick. */}
              {isLocked && openLock === entry.key ? (
                <p
                  id={hintId}
                  role="status"
                  className="absolute top-full left-0 z-10 mt-1 w-52 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-2.5 text-[11px] text-[var(--app-text)] shadow-sm"
                >
                  {LOCKED_HINT}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
