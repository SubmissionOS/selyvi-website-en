"use client";

import { Mic, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEMO_CLASS, DEMO_READING } from "@/config/demo-data";
import { ChipPop } from "@/components/scenes/chip-pop";
import { FakeCursor } from "@/components/scenes/fake-cursor";
import { ProgressPulse } from "@/components/scenes/progress-pulse";
import { SceneTimeline, type SceneStep } from "@/components/scenes/scene-timeline";
import { TypingText } from "@/components/scenes/typing-text";
import { UiWindow } from "@/components/scenes/ui-window";

/**
 * Hero-Szene: „Beobachtung wird Zeugnistext".
 *
 * Ersetzt das statische <InterfaceSkeleton />. Sie zeigt in einem Durchlauf
 * genau die Aussage der Hero-Subline: Was im Unterricht nebenbei erfasst wird,
 * ist am Zeugnistag die Grundlage des Textes.
 *
 * ==========================================================================
 * KEINE LAYOUT-SPRÜNGE
 * --------------------------------------------------------------------------
 * Alle Bereiche sind von Anfang an im DOM und belegen ihren Platz – auch der
 * Zeugnis-Entwurf, der erst spät sichtbar wird. Er ist bis dahin nur
 * durchsichtig.
 *
 * Der Grund ist messbar: Würden die Bereiche nachträglich eingehängt, wüchse
 * das Fenster mitten im Durchlauf, und der Cumulative Layout Shift der
 * Startseite stiege von 0 auf einen sichtbaren Wert. Aus demselben Grund haben
 * alle Textkästen eine Mindesthöhe, die den fertigen Text fasst: Sonst schöbe
 * jede neue Zeile beim Tippen den Rest der Seite nach unten.
 * ==========================================================================
 *
 * Die Daten stehen in src/config/demo-data.ts und sind frei erfunden.
 */

/**
 * Der Ablauf.
 *
 * „zeiger" und „klick" sind getrennt, weil der Ring erst aufblitzen darf, wenn
 * der Zeiger angekommen ist – die Gleitbewegung dauert 700 ms (Transition in
 * <FakeCursor />), der Schritt gibt ihr 800 ms.
 *
 * Der letzte Schritt ist der vollständige Zustand. Das ist Bedingung, nicht
 * Zufall: <SceneTimeline /> rendert bei prefers-reduced-motion genau ihn.
 */
const HERO_STEPS: SceneStep[] = [
  { id: "beobachten", duration: 3200 },
  { id: "zeiger", duration: 800, delay: 350 },
  { id: "klick", duration: 1200 },
  { id: "zeugnistext", duration: 4000, delay: 250 },
  { id: "endzustand", duration: 1500 },
];

/**
 * Zeigerpositionen, in Prozent der Breite und Höhe des Fensterinhalts.
 *
 * Am Bildschirm ausgemessen, nicht geschätzt: Die Ruheposition liegt links
 * unterhalb des Eingabefelds, das Ziel auf der Schaltfläche „Speichern".
 *
 * Die Prozentwerte verschieben sich leicht, wenn sich das Seitenverhältnis des
 * Fensters ändert (Mobil ist es schmaler und höher). Das ist hinnehmbar –
 * einen Zeiger, der ein paar Pixel neben der Mitte der Schaltfläche landet,
 * bemerkt niemand. Eine an das Element gebundene Messung wäre dafür der
 * falsche Aufwand: Sie müsste bei jeder Größenänderung neu rechnen.
 */
const CURSOR_REST = { x: 35, y: 78 };

/** Schaltfläche „Save". */
const CURSOR_BUTTON = { x: 89, y: 43 };

const SCENE_LABEL =
  "Animated view of the application interface: an observation typed during the lesson is structured into subject and category markers, and out of it grows a draft report comment in the teacher's writing style. All data shown is invented.";

export function HeroScene() {
  return (
    <SceneTimeline
      steps={HERO_STEPS}
      label={SCENE_LABEL}
      loopPauseMs={2000}
      kicker={`08:15 · German lesson in ${DEMO_CLASS}`}
    >
      {(scene) => {
        const moving = !scene.isStatic;
        // Verlässt die Szene den Sichtbereich, halten auch die Bausteine mit
        // eigener Schleife an – sonst tippen sie ausserhalb des Bildes zu Ende.
        const paused = !scene.running;
        const cursor = scene.at("beobachten") ? CURSOR_REST : CURSOR_BUTTON;
        const structured = scene.reached("klick");
        const drafting = scene.reached("zeugnistext");

        return (
          <UiWindow
            variant="app"
            active="live-unterricht"
            chips={[`Class ${DEMO_CLASS}`, "German"]}
          >
            <div className="space-y-4">
              {/* ---------- Bereich 1: Beobachtung ---------- */}
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium tracking-wide text-[var(--app-text-muted)] uppercase">
                    Observation
                  </span>

                  {/* Der Puls läuft nur, solange getippt wird – danach hätte
                      ein dauerhaft pulsierendes Mikrofon keine Aussage mehr.
                      `scene.running` schaltet ihn zusätzlich ab, sobald die
                      Szene den Sichtbereich verlässt: eine unendliche
                      CSS-Animation, die niemand sieht, ist trotzdem Arbeit. */}
                  <ProgressPulse active={scene.running && scene.at("beobachten")}>
                    <Mic className="size-4" />
                  </ProgressPulse>
                </div>

                <div className="mt-2 min-h-24 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3 text-sm leading-relaxed text-[var(--app-text)] sm:min-h-20">
                  <TypingText
                    key={`beobachtung-${scene.cycle}`}
                    text={DEMO_READING.input}
                    durationMs={HERO_STEPS[0].duration}
                    animate={moving}
                    paused={paused}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-[var(--app-text-muted)]">
                    Typed or dictated
                  </span>

                  {/* Klickziel des Zeigers. Kein echter Button und deshalb
                      auch kein <button>: Die Szene ist als Ganzes ein Bild. */}
                  <span className="rounded-[var(--app-radius-control)] bg-[var(--app-blue)] px-3 py-1.5 text-xs font-medium text-surface">
                    Save
                  </span>
                </div>

                {/* Feste Mindesthöhe: Die Chips dürfen den Rest nicht
                    verschieben, wenn sie erscheinen. */}
                <div className="mt-3 flex min-h-8 flex-wrap items-center gap-2">
                  {structured
                    ? DEMO_READING.chips.map((chip, position) => (
                        <ChipPop
                          key={`${chip}-${scene.cycle}`}
                          delayMs={position * 110}
                          animate={moving}
                        >
                          {chip}
                        </ChipPop>
                      ))
                    : null}
                </div>
              </div>

              {/* ---------- Bereich 2: Zeugnisbemerkung ---------- */}
              {/* Die STRUKTUR steht von Anfang an da – erst der TEXT entsteht.

                  Vorher war der ganze Bereich unsichtbar. Das reservierte zwar
                  korrekt seinen Platz, liess das Fenster in den ersten Sekunden
                  aber halb leer wirken: ein grosser weisser Block ohne
                  erkennbaren Zweck. Die sichtbare Überschrift sagt dagegen von
                  der ersten Sekunde an, was dort gleich passiert.

                  KEINE ABGEDUNKELTE SCHRIFT, und das ist gemessen:
                  Die Überschrift stand zwischenzeitlich bei 40 % Opazität. Das
                  ergibt gegen Weiss einen Kontrast von 1,69:1 (Badge: 1,81:1)
                  statt der geforderten 4,5:1 – Lighthouse fiel dadurch von 100
                  auf 96 Accessibility-Punkte. gray-500 hat auf Weiss nur rund
                  4,8:1 und damit praktisch keinen Spielraum nach unten: JEDE
                  Abdunklung dieser Schrift verletzt AA.

                  Das Badge erscheint stattdessen zusammen mit dem Text. Das ist
                  auch inhaltlich richtiger – „In your writing style" ist eine
                  Aussage ÜBER den Entwurf und sollte nicht dastehen, solange es
                  keinen Entwurf gibt.

                  `min-h-7` hält die Kopfzeile auf konstanter Höhe, damit das
                  auftauchende Badge den Text darunter nicht verschiebt. */}
              <div className="border-t border-[var(--app-border)] pt-5">
                <div className="flex min-h-7 flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium tracking-wide text-[var(--app-text-muted)] uppercase">
                    Report comment (draft)
                  </span>

                  {drafting ? (
                    <span
                      key={`stil-${scene.cycle}`}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full bg-[var(--app-blue-soft)] px-2.5 py-1 text-xs font-medium text-[var(--app-blue-on-soft)]",
                        moving && "animate-chip-pop",
                      )}
                    >
                      <Sparkles className="size-3" />
                      In your writing style
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 min-h-28 text-sm leading-relaxed text-[var(--app-text)] sm:min-h-20">
                  {drafting ? (
                    <TypingText
                      key={`entwurf-${scene.cycle}`}
                      text={DEMO_READING.reportDraft}
                      durationMs={HERO_STEPS[3].duration}
                      animate={moving}
                      paused={paused}
                    />
                  ) : null}
                </p>
              </div>

              {/* ---------- Zeiger ---------- */}
              {/* Im statischen Fall ausgeblendet: Ein Zeiger, der nichts tut,
                  ist nur ein Punkt im Bild. */}
              {/* Der key enthält NUR den Durchlauf, nicht den Schritt. Mit dem
                  Schritt im key würde React den Zeiger bei jedem Wechsel neu
                  montieren – er stünde dann sofort am Ziel, statt dorthin zu
                  gleiten. Der Klick-Ring braucht trotzdem keinen eigenen key:
                  Er wird erst eingehängt, wenn `clicking` umspringt, und
                  startet damit von selbst. */}
              <FakeCursor
                key={`zeiger-${scene.cycle}`}
                x={cursor.x}
                y={cursor.y}
                visible={moving}
                clicking={scene.at("klick")}
                animate={moving}
              />
            </div>
          </UiWindow>
        );
      }}
    </SceneTimeline>
  );
}
