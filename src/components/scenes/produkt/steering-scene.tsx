"use client";

import { Check, FileDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEMO_RELIEF_REPORT } from "@/config/demo-data";
import { CountUp } from "@/components/scenes/count-up";
import { FakeCursor } from "@/components/scenes/fake-cursor";
import { SceneTimeline, type SceneStep } from "@/components/scenes/scene-timeline";
import { TypingText } from "@/components/scenes/typing-text";
import { SceneLabel } from "@/components/scenes/produkt/scene-panel";
import { UiWindow } from "@/components/scenes/ui-window";

/**
 * Szene D – Steuerung, „Entlastungsbericht".
 *
 * ==========================================================================
 * WORTLAUT-SPERRE
 * --------------------------------------------------------------------------
 * Das Wort „Wirkung" kommt in dieser Szene NICHT als Behauptung vor. Was hier
 * gezählt wird, sind eingesparte Stunden – eine Prozesskennzahl. Sie heisst
 * deshalb überall „gewonnene Zeit" beziehungsweise „Entlastung".
 *
 * Über Wirkung spricht nur die Erhebungs-Zeile unten, und die sagt
 * ausdrücklich, dass sich noch nichts sagen lässt. Genau so steht sie im
 * Produkt: Sie verschwindet nie, weil „138 Stunden gespart" sonst als belegte
 * Wirkung gelesen wird.
 *
 * Aus demselben Grund steht „Schätzwert" dauerhaft neben der Zahl und nicht
 * als Fussnote: Grundlage sind hinterlegte Minutenannahmen.
 * ==========================================================================
 *
 * Grösser angelegt als die Mini-Szene der Startseite: Hier ist Platz für den
 * Vergleich mit dem Vormonat, die Erhebungs-Zeile und den PDF-Export.
 */
const STEPS: SceneStep[] = [
  { id: "kopf", duration: 500 },
  { id: "zahl", duration: 1500 },
  { id: "balken", duration: 900, delay: 200 },
  { id: "erhebung", duration: 1900, delay: 200 },
  { id: "zeiger", duration: 600, delay: 200 },
  { id: "klick", duration: 350 },
  { id: "haken", duration: 700 },
  { id: "ruhe", duration: 600 },
];

/**
 * Zwei Grössen, EINE Szene.
 *
 * Auf /produkt steht sie als einer von vier Funktionsblöcken in einer halben
 * Spalte, auf /for-school-leadership trägt sie die Sektion „Der Entlastungsbericht" und darf
 * deutlich mehr Raum nehmen. Das ist der einzige Unterschied – Ablauf, Texte
 * und Wortlaut-Sperren sind identisch, weil es dieselbe Komponente ist.
 *
 * Eine Kopie hätte hier besonders geschadet: Beide Fassungen zeigen dieselbe
 * Zahl mit demselben „Schätzwert"-Hinweis und derselben Erhebungs-Zeile. Zwei
 * Dateien wären zwei Gelegenheiten, genau das auseinanderlaufen zu lassen.
 *
 * Die Zeigerpositionen sind Prozentwerte der Bühne und deshalb je Grösse
 * eigens ausgemessen – bei anderer Höhe sitzt der Export-Knopf woanders.
 */
export type SteeringSceneSize = "default" | "large";

const SIZES: Record<
  SteeringSceneSize,
  {
    panel: string;
    kicker: string;
    number: string;
    barBox: string;
    bar: string;
    survey: string;
    cursorRest: { x: number; y: number };
    cursorExport: { x: number; y: number };
  }
> = {
  default: {
    panel: "h-[24rem] sm:h-[19rem]",
    kicker: "End of month · report for leadership",
    number: "text-3xl",
    barBox: "h-16",
    bar: "w-3",
    survey: "mt-5 min-h-12 text-[11px] sm:min-h-9",
    cursorRest: { x: 51, y: 21 },
    cursorExport: { x: 44, y: 79 },
  },
  large: {
    panel: "h-[27rem] sm:h-[22.5rem]",
    // Auf /for-school-leadership traegt die Sektion bereits die Ueberschrift
    // "Der Entlastungsbericht" – der Kicker nennt deshalb nur die Zeit.
    kicker: "End of month",
    number: "text-4xl",
    barBox: "h-24",
    bar: "w-4",
    survey: "mt-6 min-h-14 text-xs sm:min-h-11",
    cursorRest: { x: 50, y: 19 },
    cursorExport: { x: 44, y: 78 },
  },
};

/** Eine Balkengruppe: drei Balken plus Monatsbeschriftung darunter. */
function BarGroup({
  heights,
  grown,
  animate,
  label,
  muted,
  boxClass,
  barClass,
}: {
  heights: readonly number[];
  grown: boolean;
  animate: boolean;
  label: string;
  muted?: boolean;
  boxClass: string;
  barClass: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn("flex items-end gap-1", boxClass)}>
        {heights.map((height, position) => (
          <span
            key={position}
            className={cn(
              "h-full origin-bottom rounded-t",
              barClass,
              muted ? "bg-[var(--app-border)]" : "bg-[var(--app-blue-soft)]",
              animate && "transition-transform duration-700 ease-out",
            )}
            style={{
              // Wachsen über scaleY mit Ursprung unten – keine Höhenanimation,
              // die Layout auslösen würde.
              transform: `scaleY(${grown ? height : 0.06})`,
              transitionDelay: animate ? `${position * 110}ms` : undefined,
            }}
          />
        ))}
      </div>
      <span className="text-[9px] text-[var(--app-text-muted)]">{label}</span>
    </div>
  );
}

export function SteeringScene({ size = "default" }: { size?: SteeringSceneSize }) {
  const layout = SIZES[size];

  return (
    <SceneTimeline
      steps={STEPS}
      loopPauseMs={2000}
      kicker={layout.kicker}
      label={`Animated view of the workload relief report: for ${DEMO_RELIEF_REPORT.month} the display counts up to ${DEMO_RELIEF_REPORT.hours} hours of time gained, expressly labelled as an estimate, with the comparison to the previous month beside it. Below it states that the impact survey is under way and that the figure above is an estimate. Finally the report is exported as a PDF. All data is invented.`}
    >
      {(scene) => {
        const moving = !scene.isStatic;
        const paused = !scene.running;

        const counting = scene.reached("zahl");
        const grown = scene.reached("balken");
        const surveying = scene.reached("erhebung");
        const exported = scene.reached("haken");
        const cursor = scene.reached("zeiger") ? layout.cursorExport : layout.cursorRest;

        return (
          <UiWindow
            variant="app"
            navSet="leitung"
            active="entlastungsbericht"
            chips={[DEMO_RELIEF_REPORT.month]}
            className={layout.panel}
          >
            <div className="flex items-center justify-between gap-3">
              <SceneLabel>Workload relief report</SceneLabel>
              <span className="text-[10px] text-[var(--app-text-muted)]">
                {DEMO_RELIEF_REPORT.month}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div
                  className={cn(
                    "leading-none font-semibold text-[var(--app-text)]",
                    layout.number,
                  )}
                >
                  {counting ? (
                    <CountUp
                      key={`stunden-${scene.cycle}`}
                      value={DEMO_RELIEF_REPORT.hours}
                      durationMs={STEPS[1].duration}
                      animate={moving}
                      paused={paused}
                      suffix=" hrs"
                    />
                  ) : (
                    <span className="tabular-nums">0 hrs</span>
                  )}
                </div>

                <div className="mt-1.5 text-[10px] text-[var(--app-text-muted)]">
                  time gained · {DEMO_RELIEF_REPORT.note}
                </div>
              </div>

              <div className="flex shrink-0 items-end gap-3">
                <BarGroup
                  heights={DEMO_RELIEF_REPORT.currentBars}
                  grown={grown}
                  animate={moving}
                  label={DEMO_RELIEF_REPORT.month.split(" ")[0]}
                  boxClass={layout.barBox}
                  barClass={layout.bar}
                />
                <BarGroup
                  heights={DEMO_RELIEF_REPORT.previousBars}
                  grown={grown}
                  animate={moving}
                  label={DEMO_RELIEF_REPORT.previousMonth}
                  muted
                  boxClass={layout.barBox}
                  barClass={layout.bar}
                />
              </div>
            </div>

            {/* Erhebungs-Zeile. Feste Mindesthöhe für den fertigen Satz,
                damit der Export-Knopf darunter beim Tippen nicht wandert. */}
            <p
              className={cn(
                "border-l-2 border-[var(--app-border)] pl-3 leading-relaxed text-[var(--app-text-muted)]",
                layout.survey,
              )}
            >
              {surveying ? (
                <TypingText
                  key={`erhebung-${scene.cycle}`}
                  text={DEMO_RELIEF_REPORT.surveyLine}
                  durationMs={STEPS[3].duration}
                  animate={moving}
                  paused={paused}
                />
              ) : null}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--app-radius-control)] border border-[var(--app-border)] px-2.5 py-1.5 text-[10px] font-medium text-[var(--app-text)]">
                <FileDown className="size-3" />
                Export as PDF
              </span>

              {/* Feste Breite, damit das Häkchen nichts verschiebt. */}
              <span className="flex size-4 items-center justify-center">
                {exported ? (
                  <Check
                    key={`haken-${scene.cycle}`}
                    className={cn(
                      "size-4 text-[var(--app-blue)]",
                      moving && "animate-chip-pop",
                    )}
                  />
                ) : null}
              </span>
            </div>

            <FakeCursor
              key={`zeiger-${scene.cycle}`}
              x={cursor.x}
              y={cursor.y}
              visible={moving}
              clicking={scene.at("klick")}
              animate={moving}
            />
          </UiWindow>
        );
      }}
    </SceneTimeline>
  );
}
