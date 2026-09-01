"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEMO_CLASS, DEMO_PARENT_MAIL } from "@/config/demo-data";
import { TRANSLATION_LANGUAGE_COUNT } from "@/config/product";
import { FakeCursor } from "@/components/scenes/fake-cursor";
import { MorphLine } from "@/components/scenes/morph-line";
import { SceneTimeline, type SceneStep } from "@/components/scenes/scene-timeline";
import { SceneLabel } from "@/components/scenes/produkt/scene-panel";
import { UiWindow } from "@/components/scenes/ui-window";

/**
 * Szene B – Kommunikation, „Elternmail in neun Sprachen".
 *
 * ==========================================================================
 * DIE POINTE IST, WAS SICH NICHT ÄNDERT
 * --------------------------------------------------------------------------
 * Anrede und Signatur sind echter, lesbarer Text und bleiben beim
 * Sprachwechsel unangetastet stehen. Nur die beiden Inhaltszeilen bauen sich
 * um. Damit das niemand übersieht, leuchtet im Moment der Übersetzung ein
 * dezenter Rahmen um genau diese beiden stabilen Stellen auf.
 *
 * Das ist keine Dekoration: „Namen und Signatur bleiben unangetastet" ist die
 * Zusage aus dem Produktstand, und eine Elternmail, in der der Name der Mutter
 * mitübersetzt wird, wäre der peinlichste denkbare Fehler.
 * ==========================================================================
 */
const STEPS: SceneStep[] = [
  { id: "karte", duration: 900 },
  { id: "zeiger", duration: 700, delay: 250 },
  { id: "dropdown", duration: 1100 },
  { id: "klick", duration: 450 },
  { id: "uebersetzen", duration: 1400 },
  { id: "ruhe", duration: 1200 },
];

/** Zeigerpositionen in Prozent der Bühne, am Bildschirm ausgemessen. */
const CURSOR_REST = { x: 51, y: 67 };
const CURSOR_TOGGLE = { x: 91, y: 22 };

/** Rahmen, der um eine stabile Textstelle aufleuchtet. */
function StableFrame({ show, animate }: { show: boolean; animate: boolean }) {
  if (!show || !animate) return null;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-1 rounded border border-[var(--app-blue)] animate-frame-pulse"
    />
  );
}

export function CommunicationScene() {
  return (
    <SceneTimeline
      steps={STEPS}
      loopPauseMs={2000}
      kicker="17:10 · Parent post"
      label={`Animated view of a parent email: a select field switches the language from English to Turkish. Only the body lines change; the greeting and signature stay exactly as they were. ${TRANSLATION_LANGUAGE_COUNT} target languages are available in total. All data is invented.`}
    >
      {(scene) => {
        const moving = !scene.isStatic;
        const built = scene.reached("karte");
        const dropdownOpen = scene.at("dropdown");
        const translated = scene.reached("uebersetzen");
        const cursor = scene.reached("zeiger") ? CURSOR_TOGGLE : CURSOR_REST;

        return (
          <UiWindow
            variant="app"
            // ORT IM ORIGINAL UNBESTAETIGT: In der Referenz gibt es keinen
            // Navigationspunkt „Elternpost". Die Mail entsteht zu einem Kind,
            // und Kinder haengen unter „Meine Klassen" – deshalb vorlaeufig
            // hier. Mapping folgt nach Screenshot.
            active="meine-klassen"
            chips={[`Class ${DEMO_CLASS}`]}
            className="h-[23rem] sm:h-[19rem]"
          >
            <div className="flex items-start justify-between gap-3">
              <SceneLabel>Parent email</SceneLabel>

              <div className="relative shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center rounded-[var(--app-radius-control)] border px-2 py-1 text-[10px] font-medium",
                    translated
                      ? "border-[var(--app-blue)] bg-[var(--app-blue)] text-surface"
                      : "border-[var(--app-border)] text-[var(--app-text-muted)]",
                  )}
                >
                  DE → TR
                </span>

                {/* Angedeutete Sprachliste. Absolut positioniert, damit das
                    Aufklappen die Karte darunter nicht verschiebt. Die
                    Restliste ist bewusst angeschnitten – sie deutet an, dass
                    es mehr sind, ohne alle aufzuzählen. */}
                {dropdownOpen && moving ? (
                  <div className="absolute top-full right-0 z-10 mt-1 max-h-20 w-36 overflow-hidden rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] p-1 animate-panel-rise">
                    {DEMO_PARENT_MAIL.dropdown.map((language, position) => (
                      <div
                        key={language}
                        className={cn(
                          "flex items-center justify-between rounded px-1.5 py-1 text-[10px]",
                          position === 1
                            ? "bg-[var(--app-blue-soft)] text-[var(--app-blue-on-soft)]"
                            : "text-[var(--app-text-muted)]",
                        )}
                      >
                        {language}
                        {position === 0 ? <Check className="size-2.5" /> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Mailkarte */}
            <div
              key={`mail-${scene.cycle}`}
              className={cn(
                "mt-3 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4",
                moving && built && "animate-panel-rise",
                !built && "opacity-0",
              )}
            >
              <span className="relative inline-block">
                <span className="text-sm text-[var(--app-text)]">
                  {DEMO_PARENT_MAIL.greeting}
                </span>
                <StableFrame show={translated} animate={moving} />
              </span>

              {/* NUR diese beiden Zeilen bauen sich um. */}
              <div className="mt-3 space-y-2">
                <MorphLine
                  before={[1, 0.85, 0.6]}
                  after={[0.7, 1, 0.88]}
                  translated={translated}
                  animate={moving}
                />
                <MorphLine
                  before={[0.75, 1, 0.45]}
                  after={[1, 0.6, 0.8]}
                  translated={translated}
                  animate={moving}
                />
              </div>

              <div className="mt-4">
                <div className="text-sm text-[var(--app-text-muted)]">
                  {DEMO_PARENT_MAIL.closing}
                </div>
                <span className="relative mt-1.5 inline-block">
                  <span className="text-sm font-medium text-[var(--app-text)]">
                    {DEMO_PARENT_MAIL.signature}
                  </span>
                  <StableFrame show={translated} animate={moving} />
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-[var(--app-blue-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--app-blue-on-soft)]">
                {DEMO_PARENT_MAIL.stableNote}
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
