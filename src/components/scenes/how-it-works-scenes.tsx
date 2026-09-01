"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { DEMO_RELIEF_MONTH } from "@/config/demo-data";
import { CountUp } from "@/components/scenes/count-up";
import { SceneTimeline, type SceneStep } from "@/components/scenes/scene-timeline";

/**
 * Die Entlastungs-Mini-Szene.
 *
 * Von urspruenglich drei Mini-Szenen der frueheren Sektion ist sie die
 * einzige geblieben. Die Sektion selbst ist durch die Sektion
 * „Probieren Sie es selbst aus.“ ersetzt – erklaeren war der Umweg, der
 * gefuehrte Einblick ist der kurze Weg.
 *
 * Warum ausgerechnet diese ueberlebt: Sie zeigt, was die SCHULLEITUNG am
 * Monatsende sieht. Ohne sie verloere die Startseite die
 * Leitungs-Perspektive vollstaendig. Die beiden anderen sagten dasselbe wie
 * der Hero und die Sektion „Was Ihnen abgenommen wird“ – die wurden
 * geloescht, diese nicht.
 *
 * ==========================================================================
 * BEWUSST SPARSAMER ALS DIE HERO-SZENE
 * ==========================================================================
 * EIN Gedanke, eine 112 px hohe Buehne ohne Fensterchrome. Sie steht neben
 * einem Textblock und darf ihm die Aufmerksamkeit nicht wegnehmen.
 */

/** Gemeinsame Bühne. `relative` ist Voraussetzung für <FakeCursor />. */
function MiniStage({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-28 overflow-hidden rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3">
      {children}
    </div>
  );
}

/** Endhöhen der beiden Balken, als Faktor für scaleY. */
const BAR_HEIGHTS = [0.55, 1];

const REPORT_STEPS: SceneStep[] = [
  { id: "zahl", duration: 1600 },
  { id: "balken", duration: 1000, delay: 150 },
  { id: "ruhe", duration: 1300 },
];

export function ReportScene({ startDelayMs = 0 }: { startDelayMs?: number }) {
  return (
    <SceneTimeline
      steps={REPORT_STEPS}
      startDelayMs={startDelayMs}
      loopPauseMs={2000}
      kicker="End of month"
      label={`Small animation: the workload relief report for school leadership counts up to ${DEMO_RELIEF_MONTH.hours} hours of time gained in the month, expressly labelled as an estimate.`}
    >
      {(scene) => {
        const moving = !scene.isStatic;
        const grown = scene.reached("balken");

        return (
          <MiniStage>
            <div className="flex h-full flex-col justify-between">
              <span className="text-[9px] font-medium tracking-wide text-[var(--app-text-muted)] uppercase">
                Workload relief report
              </span>

              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xl leading-none font-semibold text-[var(--app-text)]">
                    <CountUp
                      key={`stunden-${scene.cycle}`}
                      value={DEMO_RELIEF_MONTH.hours}
                      decimals={1}
                      durationMs={REPORT_STEPS[0].duration}
                      animate={moving}
                      paused={!scene.running}
                      suffix={` ${DEMO_RELIEF_MONTH.unit}`}
                    />
                  </div>

                  {/* „Time gained", nicht „impact" – und der Schätzwert
                      steht dauerhaft dabei, nicht als Fussnote. Beides folgt
                      docs/produktstand-2026-08.md. */}
                  <div className="mt-1 truncate text-[9px] text-[var(--app-text-muted)]">
                    time gained · {DEMO_RELIEF_MONTH.note}
                  </div>
                </div>

                {/* Balken wachsen über scaleY mit Ursprung unten – keine
                    Höhenanimation, die Layout auslösen würde. */}
                <div className="flex h-14 shrink-0 items-end gap-1.5">
                  {BAR_HEIGHTS.map((height, position) => (
                    <span
                      key={position}
                      className={cn(
                        "h-full w-3.5 origin-bottom rounded-t",
                        position === BAR_HEIGHTS.length - 1
                          ? "bg-[var(--app-blue-soft)]"
                          : "bg-[var(--app-border)]",
                        moving && "transition-transform duration-700 ease-out",
                      )}
                      style={{
                        transform: `scaleY(${grown ? height : 0.08})`,
                        transitionDelay: moving ? `${position * 120}ms` : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </MiniStage>
        );
      }}
    </SceneTimeline>
  );
}
