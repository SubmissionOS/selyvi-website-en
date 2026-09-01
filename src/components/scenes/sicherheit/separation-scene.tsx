"use client";

import { cn } from "@/lib/utils";
import { DEMO_CLASS, DEMO_TEACHER, DEMO_TOUR_OBSERVATIONS } from "@/config/demo-data";
import { FakeCursor } from "@/components/scenes/fake-cursor";
import { SceneTimeline, type SceneStep } from "@/components/scenes/scene-timeline";
import { UiWindow } from "@/components/scenes/ui-window";

/**
 * Datentrennung, sichtbar gemacht.
 *
 * ==========================================================================
 * DIE SZENE ZEIGT EINE GRENZE, NICHT EINE FUNKTION
 * ==========================================================================
 * Links die Lehrkraft mit ihren eigenen Beobachtungen, rechts der
 * Leitungsmodus mit ausschliesslich Summen. Der Zeiger versucht rechts, eine
 * einzelne Beobachtung zu oeffnen – und findet dort keine. Das ist die
 * ganze Aussage.
 *
 * Produktstand-Deckung:
 *   „Jede Lehrkraft sieht nur ihre eigenen Daten … Noten, Beobachtungen,
 *   Timeline und Foerderhinweise sind pro Lehrkraft isoliert."
 *   „Nutzung im Kollegium — Live … als Verteilung, nicht als Rangliste."
 *
 * Kein erfundener Fehlerdialog: Die Anwendung verweigert nichts, sie hat den
 * Eintrag schlicht nicht. Der eingeblendete Satz sagt genau das.
 *
 * ==========================================================================
 * WARUM DER ENDZUSTAND DIE EINBLENDUNG IST
 * ==========================================================================
 * `staticStepId="hinweis"`: Bei prefers-reduced-motion und im Serverrender
 * steht der erklaerende Satz da – nicht der Ausgangszustand, in dem nichts
 * passiert ist. Wer die Bewegung nicht sieht, soll trotzdem die Aussage
 * lesen.
 */
const STEPS: SceneStep[] = [
  { id: "ruhe", duration: 900 },
  { id: "zeiger", duration: 900 },
  { id: "klick", duration: 400 },
  { id: "hinweis", duration: 2200 },
];

/** Zeigerposition in Prozent der Buehne – rechte Haelfte, auf Hoehe der Summen. */
const CURSOR_START = { x: 26, y: 78 };
const CURSOR_ZIEL = { x: 74, y: 46 };

export function SeparationScene() {
  const links = DEMO_TOUR_OBSERVATIONS.slice(0, 2);

  return (
    <SceneTimeline
      steps={STEPS}
      loopPauseMs={2200}
      staticStepId="hinweis"
      label={`Animated comparison of two views of the same class ${DEMO_CLASS}: on the left the teacher sees her own observations with names, on the right the leadership view shows totals only. On the right a pointer tries to open a single observation; there is none there. A line appears stating that individual observations are seen only by the teacher. All data is invented.`}
    >
      {(scene) => {
        const moving = !scene.isStatic;
        const zeigt = scene.reached("zeiger");
        const klickt = scene.at("klick");
        const hinweis = scene.reached("hinweis");

        return (
          <UiWindow variant="app" navSlot={<></>} className="h-[22rem] sm:h-[19rem]">
            <div className="grid h-full grid-cols-2 gap-3">
              {/* ---------- Links: die Lehrkraft ---------- */}
              <div className="flex flex-col rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
                <p className="text-[10px] font-medium tracking-wide text-[var(--app-text-muted)] uppercase">
                  Teacher {DEMO_TEACHER}
                </p>

                <ul className="mt-3 flex flex-col gap-1.5">
                  {links.map((eintrag) => (
                    <li
                      key={eintrag.id}
                      className="rounded-[var(--app-radius-control)] bg-[var(--app-surface-muted)] px-2 py-1.5 text-[11px] text-[var(--app-text)]"
                    >
                      <span className="font-medium">{eintrag.initials}</span>{" "}
                      {eintrag.chips[0]}
                    </li>
                  ))}
                </ul>

                <p className="mt-auto text-[10px] text-[var(--app-text-muted)]">
                  Own observations, with names
                </p>
              </div>

              {/* ---------- Rechts: der Leitungsmodus ---------- */}
              <div className="flex flex-col rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
                <p className="text-[10px] font-medium tracking-wide text-[var(--app-text-muted)] uppercase">
                  Leitungsmodus
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  <div className="rounded-[var(--app-radius-control)] bg-[var(--app-surface-muted)] px-2 py-1.5">
                    <p className="text-[15px] font-semibold text-[var(--app-text)]">
                      138 Std.
                    </p>
                    <p className="text-[10px] text-[var(--app-text-muted)]">
                      time gained · Estimate
                    </p>
                  </div>
                  <div className="rounded-[var(--app-radius-control)] bg-[var(--app-surface-muted)] px-2 py-1.5">
                    <p className="text-[15px] font-semibold text-[var(--app-text)]">
                      68 %
                    </p>
                    <p className="text-[10px] text-[var(--app-text-muted)]">
                      Automatisierungsquote
                    </p>
                  </div>
                </div>

                <p className="mt-auto text-[10px] text-[var(--app-text-muted)]">
                  Totals only
                </p>
              </div>
            </div>

            {/* Die Einblendung. Feste Hoehe im Fluss waere hier falsch – sie
                liegt ueber der Buehne und verschiebt deshalb nichts. */}
            <p
              className={cn(
                "pointer-events-none absolute inset-x-4 bottom-4 rounded-[var(--app-radius-control)] border border-[var(--app-blue)] bg-[var(--app-surface)] px-3 py-2 text-center text-[11px] text-[var(--app-text)] transition-opacity",
                hinweis ? "opacity-100" : "opacity-0",
              )}
            >
              Individual observations are seen only by the teacher.
            </p>

            <FakeCursor
              x={zeigt ? CURSOR_ZIEL.x : CURSOR_START.x}
              y={zeigt ? CURSOR_ZIEL.y : CURSOR_START.y}
              visible={zeigt && !hinweis}
              clicking={klickt}
              animate={moving}
              compact
            />
          </UiWindow>
        );
      }}
    </SceneTimeline>
  );
}
