"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEMO_CLASS, DEMO_MATERIAL } from "@/config/demo-data";
import { ChipPop } from "@/components/scenes/chip-pop";
import { FakeCursor } from "@/components/scenes/fake-cursor";
import { SceneTimeline, type SceneStep } from "@/components/scenes/scene-timeline";
import { TypingText } from "@/components/scenes/typing-text";
import { SceneLabel } from "@/components/scenes/produkt/scene-panel";
import { UiWindow } from "@/components/scenes/ui-window";

/**
 * Szene C – Unterricht, „Material mit Quellen".
 *
 * ZWEI AUSSAGEN, EINE DAVON DURCH WEGLASSEN:
 *
 *   1. Das Material entsteht aus benannten Fundstellen, und die stehen am
 *      Ende im Dokument – die Marker [1] und [2] und die Quellenzeile unten.
 *   2. Die dritte Fundstelle bleibt ABSICHTLICH ungehakt. Der Produktstand
 *      sagt, dass die Lehrkraft die Fundstellen auch selbst auswählen kann,
 *      statt sie automatisch ziehen zu lassen. Würden alle drei anspringen,
 *      zeigte die Szene das Gegenteil.
 *
 * Das Raster bleibt auf allen Breiten zweispaltig. Ein Umbruch auf eine Spalte
 * würde die Fundstellen auf Mobilgeräten weit nach oben schieben – und die
 * Zeigerpositionen sind Prozentwerte der Bühne, die dann nicht mehr passen.
 */
/*
 * DER EINE FILTER-MOMENT DIESER SZENE: Der Zeiger waehlt das Fach "Deutsch",
 * BEVOR die Fundstellen erscheinen. Damit ist sichtbar, dass der Fachkorpus
 * durchsucht wird und nicht irgendein Modellgedaechtnis abgefragt.
 */
const STEPS: SceneStep[] = [
  { id: "thema", duration: 1500 },
  { id: "fach-zeiger", duration: 550, delay: 200 },
  { id: "fach-klick", duration: 400 },
  { id: "fundstellen", duration: 800, delay: 150 },
  { id: "zeiger-1", duration: 550 },
  { id: "haken-1", duration: 380 },
  { id: "zeiger-2", duration: 550 },
  { id: "haken-2", duration: 380 },
  { id: "material", duration: 1500, delay: 200 },
  { id: "ruhe", duration: 900 },
];

/** Zeigerpositionen in Prozent der Bühne, am Bildschirm ausgemessen. */
const CURSOR_REST = { x: 47, y: 24 };
const CURSOR_SUBJECT = { x: 36, y: 42 };
const CURSOR_SOURCES = [
  { x: 34, y: 66 },
  { x: 34, y: 78 },
];

export function TeachingScene() {
  return (
    <SceneTimeline
      steps={STEPS}
      loopPauseMs={2000}
      kicker="16:30 · Preparing for tomorrow"
      label="Animated view of materials being generated: a topic is entered, three sources appear from the subject corpus, and two of them are selected. On the right a worksheet grows out of that, in which the sources used are stated as markers and in a source line. All data is invented."
    >
      {(scene) => {
        const moving = !scene.isStatic;
        const paused = !scene.running;

        const chosen = scene.reached("fach-klick");
        const listed = scene.reached("fundstellen");
        const checked = [scene.reached("haken-1"), scene.reached("haken-2"), false];
        const building = scene.reached("material");

        const cursor = scene.reached("zeiger-2")
          ? CURSOR_SOURCES[1]
          : scene.reached("zeiger-1")
            ? CURSOR_SOURCES[0]
            : scene.reached("fach-zeiger")
              ? CURSOR_SUBJECT
              : CURSOR_REST;

        return (
          <UiWindow
            variant="app"
            active="material"
            chips={[`Class ${DEMO_CLASS}`]}
            className="h-[29rem] sm:h-[27rem]"
          >
            <div className="flex h-full flex-col">
              <div className="grid min-h-0 flex-1 grid-cols-[1.1fr_1fr] gap-3">
                {/* ---------- links: Thema und Fundstellen ---------- */}
                <div className="flex min-w-0 flex-col">
                  <SceneLabel>Topic</SceneLabel>

                  <div className="mt-1.5 min-h-9 rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-2.5 py-2 text-[11px] leading-relaxed text-[var(--app-text)]">
                    <TypingText
                      key={`thema-${scene.cycle}`}
                      text={DEMO_MATERIAL.topic}
                      durationMs={STEPS[0].duration}
                      animate={moving}
                      paused={paused}
                    />
                  </div>

                  {/* Fach-Filter. Die Auswahl steht VOR den Fundstellen –
                      erst das Fach, dann die Treffer. */}
                  <div className="mt-3">
                    <SceneLabel>Subject</SceneLabel>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {DEMO_MATERIAL.subjects.map((subject, position) => (
                        <span
                          key={subject}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[9px] font-medium",
                            chosen && position === 0
                              ? "border-[var(--app-blue)] bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                              : "border-[var(--app-border)] text-[var(--app-text-muted)]",
                          )}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <SceneLabel>Sources in the subject corpus</SceneLabel>
                  </div>

                  <ul className="mt-2 space-y-1.5">
                    {DEMO_MATERIAL.sources.map((source, position) => (
                      <li
                        key={source}
                        className={cn(
                          "flex items-start gap-2 rounded-[var(--app-radius-control)] border bg-[var(--app-surface)] p-1.5",
                          checked[position]
                            ? "border-[var(--app-blue)]"
                            : "border-[var(--app-border)]",
                          moving && listed && "animate-panel-rise",
                          !listed && "opacity-0",
                        )}
                        style={
                          moving && listed
                            ? { animationDelay: `${position * 120}ms` }
                            : undefined
                        }
                      >
                        <span
                          className={cn(
                            "mt-px flex size-3.5 shrink-0 items-center justify-center rounded-sm border",
                            checked[position]
                              ? "border-[var(--app-blue)] bg-[var(--app-blue)] text-surface"
                              : "border-[var(--app-border)]",
                          )}
                        >
                          {checked[position] ? <Check className="size-2.5" /> : null}
                        </span>

                        <span className="min-w-0 text-[10px] leading-snug text-[var(--app-text-muted)]">
                          {source}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ---------- rechts: erzeugtes Material ---------- */}
                {/* Der Rahmen des Dokuments und sein Titel stehen von Anfang
                    an da – nur der INHALT entsteht.

                    Vorher war die ganze Karte durchsichtig. Sie belegte damit
                    zwar korrekt ihren Platz, aber die rechte Hälfte der Bühne
                    blieb zwei Drittel des Durchlaufs leer, auf Mobilgeräten
                    besonders auffällig. Dieselbe Lehre wie im Hero.

                    Der Titel steht bei VOLLER Deckkraft. Abgedunkelte Schrift
                    ist im Szenen-Fundament gesperrt: gray-500 und ink haben auf
                    hellem Grund keinen Kontrast-Spielraum nach unten. */}
                <div className="flex min-w-0 flex-col rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-2.5">
                  <span className="truncate text-[10px] font-medium text-[var(--app-text)]">
                    {DEMO_MATERIAL.documentTitle}
                  </span>

                  <div
                    key={`dokument-${scene.cycle}`}
                    className={cn(
                      "mt-2.5 space-y-2",
                      moving && building && "animate-panel-rise",
                      !building && "opacity-0",
                    )}
                  >
                    <div className="h-1.5 w-full rounded bg-[var(--app-border)]" />

                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded bg-[var(--app-border)]" />
                      {building ? (
                        <ChipPop
                          key={`marker-1-${scene.cycle}`}
                          delayMs={500}
                          animate={moving}
                          className="rounded px-1 py-0 text-[8px] leading-4"
                        >
                          [1]
                        </ChipPop>
                      ) : null}
                    </div>

                    <div className="h-1.5 w-5/6 rounded bg-[var(--app-border)]" />

                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded bg-[var(--app-border)]" />
                      {building ? (
                        <ChipPop
                          key={`marker-2-${scene.cycle}`}
                          delayMs={900}
                          animate={moving}
                          className="rounded px-1 py-0 text-[8px] leading-4"
                        >
                          [2]
                        </ChipPop>
                      ) : null}
                    </div>

                    <div className="h-1.5 w-2/3 rounded bg-[var(--app-border)]" />
                  </div>

                  {/* Die Quellenzeile gehört zum Inhalt und erscheint mit ihm.
                      Unsichtbar (opacity-0) ist unproblematisch – anders als
                      eine abgedunkelte Schrift, die den Kontrast verletzt. */}
                  <div
                    className={cn(
                      "mt-auto border-t border-[var(--app-border)] pt-2 text-[9px] text-[var(--app-text-muted)]",
                      !building && "opacity-0",
                    )}
                  >
                    {DEMO_MATERIAL.sourceNote}
                  </div>
                </div>
              </div>

              <div className="mt-3 shrink-0">
                <span className="inline-flex items-center rounded-full bg-[var(--app-blue-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--app-blue-on-soft)]">
                  Sources stated
                </span>
              </div>
            </div>

            <FakeCursor
              key={`zeiger-${scene.cycle}`}
              x={cursor.x}
              y={cursor.y}
              visible={moving}
              clicking={
                scene.at("fach-klick") || scene.at("haken-1") || scene.at("haken-2")
              }
              animate={moving}
            />
          </UiWindow>
        );
      }}
    </SceneTimeline>
  );
}
