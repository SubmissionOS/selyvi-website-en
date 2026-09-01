"use client";

import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SceneVisibilityContext } from "@/components/scenes/scene-group";

/**
 * Deklarative Schrittfolge für eine UI-Szene.
 *
 * ==========================================================================
 * DREI ZUSTÄNDE, DIE DIESE KOMPONENTE GARANTIERT
 * --------------------------------------------------------------------------
 * 1. AUSSERHALB DES VIEWPORTS läuft nichts. Kein rAF, kein Timer, keine
 *    Zustandsänderung. Der IntersectionObserver stoppt die Schleife, und der
 *    Fortschritt bleibt stehen, statt zurückgesetzt zu werden.
 *
 * 2. BEI prefers-reduced-motion rendert die Szene STATISCH ihren Endzustand.
 *    Kein Autoplay, nichts blinkt, keine Schleife. Endzustand ist der letzte
 *    Schritt – deshalb muss der letzte Schritt der vollständige Zustand sein,
 *    nicht ein Zwischenbild. Szenen, die zu ihrem Anfang zurückkehren, geben
 *    stattdessen `staticStepId` an.
 *
 * 3. OHNE JAVASCRIPT sieht man ebenfalls den Endzustand. Das ist kein
 *    Zufall: `isStatic` startet auf `true`, der Server rendert damit den
 *    Endzustand, und erst der Client schaltet auf Schritt 0 um. Die
 *    Umschaltung passiert in einem Layout-Effekt, also VOR dem ersten Paint –
 *    ein Aufblitzen des Endzustands gibt es dadurch nicht.
 * ==========================================================================
 */
export type SceneStep = {
  /** Kennung, über die Bausteine ihren Schritt abfragen. */
  id: string;
  /** Dauer des Schritts in Millisekunden. */
  duration: number;
  /** Wartezeit vor dem Schritt in Millisekunden. */
  delay?: number;
};

export type SceneState = {
  /** Index des aktiven Schritts. */
  index: number;
  /** Kennung des aktiven Schritts. */
  id: string;
  /** Statischer Endzustand – reduced motion, Serverrender oder ohne JS. */
  isStatic: boolean;
  /**
   * Läuft die Zeitleiste gerade wirklich?
   *
   * false, sobald die Szene den Sichtbereich verlässt – und dann MUSS jeder
   * Baustein mit eigener Schleife ebenfalls anhalten. Die Zeitleiste selbst
   * anzuhalten genügt nicht: <TypingText /> und <CountUp /> haben ihre eigene
   * requestAnimationFrame-Schleife und tippten sonst ausserhalb des Bildes zu
   * Ende. Genau das war messbar der Fall, bevor dieses Feld eingeführt wurde
   * (rund 165 rAF-Aufrufe in drei Sekunden bei weggescrollter Szene).
   *
   * In den Bausteinen entspricht das dem `paused`-Feld.
   */
  running: boolean;
  /**
   * Zählt bei jedem Schleifendurchlauf hoch.
   *
   * Gehört als `key` an jeden Baustein, der sich pro Durchlauf neu aufbauen
   * soll (TypingText, ChipPop). React montiert ihn dadurch neu, und die
   * Animation beginnt von vorn – ohne dass die Bausteine selbst etwas von der
   * Schleife wissen müssen.
   */
  cycle: number;
  /** Ist genau dieser Schritt gerade aktiv? */
  at: (id: string) => boolean;
  /** Ist dieser Schritt erreicht (aktiv oder bereits vorbei)? */
  reached: (id: string) => boolean;
};

type Props = {
  steps: SceneStep[];
  /**
   * Textalternative der gesamten Szene. Beschreibt den Ablauf in einem Satz –
   * die Szene trägt role="img", alles darin ist aria-hidden.
   */
  label: string;
  /** Atempause am Ende, bevor die Schleife neu beginnt. */
  loopPauseMs?: number;
  /**
   * Verzögerter Start, nachdem die Szene sichtbar geworden ist.
   *
   * Für Kaskaden gedacht: Liegen mehrere Szenen nebeneinander in einer
   * <SceneGroup />, starten sie sonst im selben Bild und drei Dinge bewegen
   * sich gleichzeitig. Ein Versatz von wenigen hundert Millisekunden je Szene
   * macht daraus eine Abfolge, der das Auge folgen kann.
   *
   * Wirkt nur beim ERSTEN Sichtbarwerden. Wer zurückscrollt, soll nicht jedes
   * Mal erneut warten.
   */
  startDelayMs?: number;
  /**
   * Welcher Schritt gilt als Endzustand?
   *
   * Ohne Angabe der LETZTE – das passt für Szenen, die auf ihr Ergebnis
   * zulaufen. Es passt NICHT für Szenen, die am Ende wieder dorthin
   * zurückkehren, wo sie angefangen haben: Der Leitungsmodus auf /for-school-leadership
   * schaltet um, zeigt die Leitungsansicht und schaltet zurück. Sein letzter
   * Schritt ist die Lehrkraft-Ansicht – und genau die ist NICHT die Aussage
   * der Szene.
   *
   * Bei prefers-reduced-motion und im Serverrender würde sonst ausgerechnet
   * das Bild stehen bleiben, das nichts zeigt.
   */
  staticStepId?: string;
  /**
   * Zeit-Kicker über dem Fenster, z. B. „08:15 · Deutschstunde in der 3b".
   *
   * ==========================================================================
   * ER STEHT AUSSERHALB DES aria-hidden-BEREICHS – ABSICHTLICH.
   * --------------------------------------------------------------------------
   * Die Szene selbst ist ein Bild: role="img", Inhalt verborgen, Aussage im
   * aria-label. Der Kicker gehört NICHT dazu. Er trägt Bedeutung, die es ohne
   * ihn nicht gäbe – er ordnet die Szene in den Tagesablauf ein, den alle
   * Szenen gemeinsam erzählen. Läge er unter aria-hidden, ginge genau diese
   * Ordnung für Screenreader verloren, und der rote Faden wäre nur noch
   * optisch vorhanden.
   *
   * Konsequenz: normaler Text, volle Deckkraft, gray-500. Abgedunkelt ginge
   * hier ohnehin nicht – die Kontrastregel gilt hier wie überall.
   * ==========================================================================
   *
   * Kicker sind ERZÄHLUNG, keine Produktzusage. Formulierungen ohne
   * Funktionsbehauptung: „17:10 · Elternpost" beschreibt eine Tageszeit, nicht
   * eine Funktion.
   */
  kicker?: string;
  className?: string;
  children: (scene: SceneState) => ReactNode;
};

/**
 * useLayoutEffect gibt es serverseitig nicht; React warnt dort. Beim Rendern
 * auf dem Server wird deshalb auf useEffect ausgewichen – der läuft dort
 * ohnehin nie.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Ein einzelner Frame darf höchstens so viel Zeit vorspulen.
 *
 * Notwendig, weil der Browser requestAnimationFrame in Hintergrund-Tabs
 * anhält. Ohne die Deckelung wäre der erste Frame nach der Rückkehr um die
 * gesamte Abwesenheit „gealtert" und die Szene spränge mitten in einen
 * späteren Schritt.
 */
const MAX_FRAME_DELTA_MS = 100;

export function SceneTimeline({
  steps,
  label,
  loopPauseMs = 2000,
  startDelayMs = 0,
  staticStepId,
  kicker,
  className,
  children,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const lastIndex = steps.length - 1;

  /**
   * Index des Endzustands. Ohne `staticStepId` der letzte Schritt.
   *
   * Eine unbekannte Kennung fällt bewusst auf den letzten Schritt zurück,
   * statt zu werfen: Ein Tippfehler soll die Seite nicht lahmlegen.
   */
  const staticIndex = (() => {
    if (!staticStepId) return lastIndex;
    const found = steps.findIndex((step) => step.id === staticStepId);
    return found === -1 ? lastIndex : found;
  })();

  /**
   * Sichtbarkeit aus einer <SceneGroup />, falls die Szene in einer liegt.
   * `null` heisst: keine Gruppe, also eigener Beobachter weiter unten.
   */
  const groupVisible = useContext(SceneVisibilityContext);

  // Startwert bewusst der Endzustand – siehe Zustand 3 im Kopfkommentar.
  const [isStatic, setIsStatic] = useState(true);
  const [ownVisible, setOwnVisible] = useState(false);
  const [delayPassed, setDelayPassed] = useState(startDelayMs === 0);
  const [index, setIndex] = useState(staticIndex);
  const [cycle, setCycle] = useState(0);

  const visible = groupVisible ?? ownVisible;

  const elapsedRef = useRef(0);
  const indexRef = useRef(staticIndex);

  /**
   * Start- und Endzeitpunkt jedes Schritts, aufsummiert.
   *
   * Bewusst eine einfache Schleife statt `map` mit einem Zähler von aussen:
   * Eine Variable, die eine Callback-Funktion beschreibt, hält der
   * React-Compiler zu Recht für unsauber (`react-hooks/immutability`).
   */
  const bounds = useMemo(() => {
    const result: { start: number; end: number }[] = [];
    let time = 0;

    for (const step of steps) {
      const start = time + (step.delay ?? 0);
      const end = start + step.duration;
      result.push({ start, end });
      time = end;
    }

    return result;
  }, [steps]);

  const cycleMs = (bounds[bounds.length - 1]?.end ?? 0) + loopPauseMs;

  // Bewegung erlaubt? Entscheidet sich erst im Browser, vor dem ersten Paint.
  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const reduce = query.matches;
      const start = reduce ? staticIndex : 0;

      elapsedRef.current = 0;
      indexRef.current = start;
      setIsStatic(reduce);
      setIndex(start);
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [staticIndex]);

  // Sichtbarkeit. Erst im Viewport läuft überhaupt etwas.
  //
  // Ohne IntersectionObserver bleibt `visible` auf false und die Szene zeigt
  // dauerhaft ihren Endzustand. Das ist gewollt: dieselbe Abstufung wie ohne
  // JavaScript, und ein bewusster Verzicht auf eine Ersatzlösung, die im
  // Hintergrund Rechenzeit verbrauchen würde.
  useEffect(() => {
    // Liegt die Szene in einer <SceneGroup />, beobachtet die für uns mit –
    // dann braucht es hier keinen zweiten Beobachter.
    if (groupVisible !== null) return;

    const host = hostRef.current;
    if (!host) return;

    // Schwellwert 0 mit `isIntersecting` – bewusst kein höherer Wert.
    //
    // Ein Schwellwert von etwa 0,15 klingt sinnvoll („erst ab einem Sechstel
    // sichtbar starten"), führt hier aber zu einem Fehler: Der Rückruf feuert
    // nur BEIM ÜBERSCHREITEN der genannten Schwelle. Scrollt die Szene wieder
    // hinaus, meldet der letzte Rückruf `isIntersecting: true` – sie ist ja
    // noch zu 14 % zu sehen –, und danach kommt keiner mehr. Die Szene liefe
    // dann ausserhalb des Bildschirms weiter, also genau das, was hier
    // verhindert werden soll.
    const observer = new IntersectionObserver((entries) =>
      setOwnVisible(entries[0]?.isIntersecting ?? false),
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [groupVisible]);

  // Versetzter Start für Kaskaden. Der Timer läuft erst, wenn die Szene
  // sichtbar ist, und genau einmal – danach bleibt `delayPassed` true.
  useEffect(() => {
    if (delayPassed || !visible || isStatic) return;

    const timer = setTimeout(() => setDelayPassed(true), startDelayMs);
    return () => clearTimeout(timer);
  }, [delayPassed, visible, isStatic, startDelayMs]);

  // Die Schleife. Läuft ausschliesslich, wenn die Szene sichtbar ist UND
  // Bewegung erlaubt ist – sonst wird der Effekt gar nicht erst aufgesetzt.
  useEffect(() => {
    if (isStatic || !visible || !delayPassed || cycleMs <= 0) return;

    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      elapsedRef.current += Math.min(now - previous, MAX_FRAME_DELTA_MS);
      previous = now;

      if (elapsedRef.current >= cycleMs) {
        elapsedRef.current -= cycleMs;
        setCycle((value) => value + 1);
      }

      const time = elapsedRef.current;
      let next = bounds.findIndex((bound) => time < bound.end);
      // -1 heisst: in der Atempause. Der letzte Schritt bleibt stehen.
      if (next === -1) next = lastIndex;

      // Zustand nur bei echtem Schrittwechsel setzen. Ohne diesen Vergleich
      // liefe pro Bild ein React-Render durch die ganze Szene.
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isStatic, visible, delayPassed, bounds, cycleMs, lastIndex]);

  const scene: SceneState = useMemo(() => {
    const order = new Map(steps.map((step, position) => [step.id, position]));

    return {
      index,
      id: steps[index]?.id ?? "",
      isStatic,
      running: !isStatic && visible && delayPassed,
      cycle,
      at: (id) => order.get(id) === index,
      reached: (id) => {
        const position = order.get(id);
        // Auch im statischen Fall gilt schlicht „bis zum aktuellen Schritt".
        // Der steht dort auf `staticIndex` – bei Szenen, die zu ihrem Anfang
        // zurückkehren, ist das NICHT der letzte Schritt, und dann darf hier
        // auch nicht alles als erreicht gelten.
        return position !== undefined && position <= index;
      },
    };
  }, [steps, index, isStatic, visible, delayPassed, cycle]);

  return (
    <div className={className}>
      {/* Der Kicker liegt VOR dem role="img"-Kasten und damit ausserhalb des
          aria-hidden-Bereichs. Siehe die Begründung an der Prop. */}
      {kicker ? (
        <p className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
          {kicker}
        </p>
      ) : null}

      <div ref={hostRef} role="img" aria-label={label}>
        {/* Alles innerhalb der Szene ist für Screenreader unsichtbar – die
            Aussage steht vollständig im aria-label. Gleiches Muster wie bei den
            statischen Skeletten. */}
        <div aria-hidden="true">{children(scene)}</div>
      </div>
    </div>
  );
}
