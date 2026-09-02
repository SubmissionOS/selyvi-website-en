"use client";

import { useRef, useState } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

import { cn } from "@/lib/utils";

/**
 * Sektion 2 – Das Erhebungsmodell.
 *
 * ==========================================================================
 * ALLES HIER IST DURCH docs/produktstand-2026-08.md GEDECKT.
 * ==========================================================================
 * Der Produktstand fuehrt unter „Positionierung“ ein vollstaendiges
 * Erhebungsmodell nach PHINEO-Wirkungstreppe auf: Befragung ueber drei Wellen,
 * zweckgranulare Einwilligung, Codebuch, Mindestfallzahlen. Der
 * „Wirkungsbericht je Schule“ ist als Live gefuehrt.
 *
 * Was hier NICHT steht, obwohl es naheliegen wuerde: irgendein Ergebnis. Die
 * Seite beschreibt, WIE gemessen wird, nicht WAS herauskam – Zahlen gibt es
 * erst, wenn die Wellen durch sind.
 *
 * „impact staircase“ fuer „Wirkungstreppe“ – PHINEO nennt sie in eigenen
 * englischsprachigen Veroeffentlichungen selbst so (docs/glossar-en.md).
 *
 * Die Treppe ist bewusst keine Grafik-Datei und keine Animation:
 *   - Sie besteht aus echtem Text in einer geordneten Liste. Eine SVG-Treppe
 *     mit Beschriftung waere fuer Screenreader eine einzige alt-Zeile; hier
 *     liest jede Stufe sich einzeln vor, in der richtigen Reihenfolge.
 *
 * ==========================================================================
 * VON VIER SAEULEN ZU VIER ZEILEN – UND WARUM DAS BESSER IST
 * ==========================================================================
 * Bis zum Leerraum-Audit stand die Treppe als vier Saeulen mit aufsteigenden
 * Hoehen ueber die volle Seitenbreite, UNTER zwei Absaetzen Text. Auf 1440
 * war der erste Bildschirm dieser Seite dadurch reine Textwand.
 *
 * Jetzt steht der Text links und die Treppe rechts daneben. In einer
 * 7/12-Spalte (rund 600 px) waeren vier Saeulen je 138 px breit – dort passt
 * keine Stufenbeschreibung mehr hinein, ohne die feste Hoehe zu sprengen.
 *
 * Die Treppe steigt deshalb jetzt in der BREITE statt in der Hoehe: vier
 * Zeilen, jede mit einem Balken, der laenger ist als der darueber. Das ist
 * derselbe Sachverhalt in derselben Reihenfolge – und hat zwei Vorteile, die
 * nichts mit dem Platz zu tun haben:
 *   - Es gibt die Treppe jetzt auf JEDER Breite. Die Saeulen entstanden erst
 *     ab sm; auf 390 px stapelten sich vier gleich aussehende Kaesten, und
 *     die Aussage „aufsteigend“ fiel dort ersatzlos aus.
 *   - Die Beschreibungen duerfen unterschiedlich lang sein, ohne dass eine
 *     Stufe aus ihrer Hoehe laeuft.
 *
 * Der Balken waechst ueber `scaleX` aus `origin-left` – Transform, kein
 * Layout. CLS bleibt 0, so wie vorher bei `scaleY`.
 */
const stages = [
  {
    name: "Input",
    description:
      "What goes in: development work, the subject corpus, the rollout at a school.",
    /** Aufsteigende Balkenlaengen – die Treppe entsteht hier und nirgends sonst. */
    width: "w-[40%]",
  },
  {
    name: "Output",
    description:
      "What measurably comes out: observations, report comments, parent emails, materials.",
    width: "w-[60%]",
  },
  {
    name: "Outcome",
    description:
      "What changes for the people involved: time spent, perceived workload, what parents hear back.",
    width: "w-[80%]",
  },
  {
    name: "Impact",
    description:
      "What is left after all that. Three survey waves cannot reach this stage on their own — this is where research partners come in.",
    width: "w-full",
  },
];

export function ImpactModel() {
  const hostRef = useRef<HTMLOListElement | null>(null);

  /**
   * Startwert `true`: Serverrender und der Fall ohne JavaScript zeigen die
   * fertige Treppe. Erst der Effekt nimmt sie zurueck – und nur dann, wenn
   * wirklich animiert werden soll.
   */
  const [gebaut, setGebaut] = useState(true);
  const [animiert, setAnimiert] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setGebaut(false);
    setAnimiert(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setGebaut(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="wirkungsmodell-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="wirkungsmodell-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          How we measure
        </h2>

        {/* Text links, Treppe rechts. Mobil stapelt das Grid in
            DOM-Reihenfolge: erst der Text, dann das Bild. */}
        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-4 text-lg text-gray-500 lg:col-span-5">
            <p>
              The survey model follows the PHINEO impact staircase: input, output, outcome,
              impact. We collect across three waves rather than once. A single snapshot
              cannot tell relief apart from people simply getting used to a tool.
            </p>

            <p>
              Consent is granular by purpose: not to “research” in general, but to each
              purpose on its own. The analysis follows a codebook written in advance. And
              a value only appears above a defined minimum case count — below it the field
              stays empty rather than showing a number that carries nobody.
            </p>
          </div>

          <ol ref={hostRef} className="flex flex-col gap-5 lg:col-span-7">
            {stages.map((stage, index) => (
              <li key={stage.name}>
                {/* Der Balken. Er waechst nach rechts – `origin-left` ist der
                    Grund, warum er waechst statt zu rutschen. Die Zeile
                    darunter steht von Anfang an, deshalb verschiebt nichts. */}
                <span
                  aria-hidden="true"
                  style={animiert ? { transitionDelay: `${index * 110}ms` } : undefined}
                  className={cn(
                    "block h-2 origin-left rounded-full bg-brand-100",
                    stage.width,
                    animiert && "transition-transform duration-[520ms] ease-out",
                    animiert && !gebaut && "scale-x-0",
                    animiert && gebaut && "scale-x-100",
                  )}
                />

                <p className="mt-3 text-xs font-medium tracking-wide text-brand-600 uppercase">
                  Stage {index + 1}
                </p>
                <p className="mt-1 text-base font-semibold text-ink">{stage.name}</p>
                <p className="mt-1 text-sm text-gray-500">{stage.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
