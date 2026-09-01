"use client";

import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEMO_CLASS, DEMO_SEATING } from "@/config/demo-data";
import { FakeCursor } from "@/components/scenes/fake-cursor";
import { SceneTimeline, type SceneStep } from "@/components/scenes/scene-timeline";
import { SceneLabel } from "@/components/scenes/produkt/scene-panel";
import { UiWindow } from "@/components/scenes/ui-window";

/**
 * Szene „Sitzplan".
 *
 * Laut docs/produktstand-2026-08.md **Live**: „Grafischer Sitzplan mit
 * gesperrten Plätzen und Drag-and-drop."
 *
 * ==========================================================================
 * WAS DIESE SZENE BEWUSST NICHT ZEIGT
 * ==========================================================================
 * Den KI-Vorschlag. Derselbe Absatz im Produktstand sagt: „Ein KI-Vorschlag
 * berücksichtigt Beobachtungen und Förderbedarfe – dieser Teil ist noch
 * Prototyp, der Sitzplan selbst nicht."
 *
 * Prototyp ist nach der Leitplanke in CLAUDE.md tabu – auch mit Badge. Die
 * Szene zeigt deshalb ausschliesslich, was eine Lehrkraft selbst tut: ziehen
 * und sperren. Kein Vorschlag, kein Grund, keine Begruendung fuer den Umzug.
 *
 * Der gesperrte Platz ist nicht Beiwerk: Er ist die halbe Funktion. Ein
 * Sitzplan ohne Sperren ist ein Zeichenprogramm.
 */
const STEPS: SceneStep[] = [
  { id: "raster", duration: 700 },
  { id: "greifen", duration: 600 },
  { id: "ziehen", duration: 1100 },
  { id: "einrasten", duration: 450 },
  { id: "ruhe", duration: 1000 },
];

/**
 * Zeigerpositionen in Prozent der Buehne, am Bildschirm ausgemessen.
 * Ausgangsplatz ist die erste Kachel der unteren Reihe, Ziel die zweite.
 */
const CURSOR_FROM = { x: 22, y: 66 };
const CURSOR_TO = { x: 52, y: 66 };

export function SeatingScene() {
  return (
    <SceneTimeline
      steps={STEPS}
      loopPauseMs={2200}
      kicker="07:50 · Before the first lesson"
      label={`Animated view of the seating plan for class ${DEMO_CLASS}: in a grid of six seats, a child tile is picked up with the pointer, dragged to a free seat and snaps into place there. Another seat is locked, carries a padlock icon and stays empty. All data is invented.`}
    >
      {(scene) => {
        const moving = !scene.isStatic;

        const grabbed = scene.reached("greifen");
        const dragging = scene.reached("ziehen");
        const landed = scene.reached("einrasten");

        return (
          <UiWindow
            variant="app"
            active="meine-klassen"
            chips={[`Class ${DEMO_CLASS}`]}
            className="h-[19rem] sm:h-[17rem]"
          >
            <SceneLabel>Seating plan</SceneLabel>

            {/* Tafel-Kante: gibt dem Raster oben eine Richtung, damit es als
                Klassenzimmer lesbar ist und nicht als Tabelle. */}
            <p className="mt-3 rounded-[var(--app-radius-control)] bg-[var(--app-surface-muted)] py-1 text-center text-[10px] tracking-wide text-[var(--app-text-muted)] uppercase">
              Board
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {DEMO_SEATING.seats.map((seat) => {
                const isSource = seat.id === DEMO_SEATING.move.from;
                const isTarget = seat.id === DEMO_SEATING.move.to;

                /* Die ziehende Kachel verlaesst ihren Platz optisch, sobald
                   gegriffen wurde – der Quellplatz wird leer, der Zielplatz
                   fuellt sich erst beim Einrasten. */
                const showsChild =
                  (seat.initials !== null && !(isSource && grabbed)) ||
                  (isTarget && landed);
                const initials =
                  isTarget && landed ? DEMO_SEATING.move.initials : seat.initials;

                return (
                  <div
                    key={seat.id}
                    className={cn(
                      "flex h-14 items-center justify-center rounded-[var(--app-radius-card)] border text-[11px] font-medium transition-colors sm:h-12",
                      seat.locked
                        ? "border-[var(--app-border)] bg-[var(--app-surface-muted)] text-[var(--app-text-muted)]"
                        : isTarget && dragging && !landed
                          ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                          : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)]",
                    )}
                  >
                    {seat.locked ? (
                      <Lock aria-hidden="true" className="size-3.5" />
                    ) : showsChild ? (
                      <span className="flex size-7 items-center justify-center rounded-full bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]">
                        {initials}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-[var(--app-text-muted)]">
              Seats can be locked – locked stays locked.
            </p>

            {/* Die gezogene Kachel haengt am Zeiger. Nur transform/opacity –
                deshalb kostet die Bewegung keinen Layout-Durchgang. */}
            <FakeCursor
              x={dragging ? CURSOR_TO.x : CURSOR_FROM.x}
              y={CURSOR_FROM.y}
              visible={grabbed && !landed}
              clicking={grabbed}
              animate={moving}
              compact
            />
          </UiWindow>
        );
      }}
    </SceneTimeline>
  );
}
