"use client";

import { useRef, useState } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

import { cn } from "@/lib/utils";

/**
 * „From the kitchen table to today" – fünf Stationen, die sich beim Scrollen
 * nacheinander zeigen und verbinden.
 *
 * ==========================================================================
 * NUR BELEGTE STATIONEN – KEINE JAHRESZAHLEN
 * ==========================================================================
 * Jede der fünf steht so im Erzähltext daneben. Es ist BEWUSST keine
 * Zeitleiste: Zeitleisten wollen Daten, und die haben wir nicht. „2023" oder
 * „Sommer 2024" wären erfunden – hier steht deshalb nur die Abfolge, nicht
 * ihr Kalender.
 *
 * ==========================================================================
 * DIE LINIE IST DEKORATION, DIE STATIONEN SIND INHALT
 * ==========================================================================
 * Die Stationen stehen in einer <ol> – für Screenreader eine nummerierte
 * Liste in der richtigen Reihenfolge, ganz ohne Grafik. Das SVG darüber ist
 * aria-hidden: Es trägt keine Bedeutung, die nicht schon im Text steht.
 *
 * ==========================================================================
 * BEWEGUNG
 * ==========================================================================
 * Ein IntersectionObserver, EINMALIG, danach trennt er sich. Die Linie
 * zeichnet sich über `stroke-dashoffset`, die Punkte staffeln sich über
 * `transition-delay` – beides CSS, kein requestAnimationFrame, keine
 * Schleife.
 *
 * Bei prefers-reduced-motion steht alles sofort da: Linie gezogen, Punkte
 * gesetzt. Kein „schneller", sondern gar keine Bewegung.
 */
const STATIONS = [
  {
    title: "The kitchen table",
    text: "A trainee primary school teacher in our closest circle – and the evenings that did not go into teaching.",
  },
  {
    title: "The staffroom",
    text: "The first responses from teachers who knew the same thing.",
  },
  {
    title: "Three founders",
    text: "Those evenings turned into a system – and the three of us into a team with one simple test.",
  },
  {
    title: "Teachers across Germany",
    text: "Developed further with teachers from primary through to upper secondary.",
  },
  {
    title: "Measuring impact instead of asserting it",
    text: "A survey model from the start – so that it is not us who says whether it helps.",
  },
];

/** Abstand der Punkte auf der Linie, in Prozent der Länge. */
const SCHRITT = 100 / (STATIONS.length - 1);

/**
 * „breit"  – waagerecht ab lg, darunter senkrecht. Für die volle Seitenbreite.
 * „schmal" – IMMER senkrecht. Für die schmale Spalte neben dem Erzähltext.
 *
 * Die zweite Variante ist entstanden, als die Stationen von UNTER den Text
 * NEBEN ihn gewandert sind (Leerraum-Audit): In einer 5/12-Spalte bekämen
 * fünf waagerechte Stationen je rund 90 px – dort passt kein einziger
 * Stationsname mehr in eine Zeile. Senkrecht ist in dieser Spalte nicht die
 * Notlösung, sondern die richtige Form: Die Linie läuft dann parallel zum
 * Erzähltext daneben und begleitet ihn.
 */
type StationsVariant = "breit" | "schmal";

export function StoryStations({ variant = "breit" }: { variant?: StationsVariant }) {
  const schmal = variant === "schmal";
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [gezogen, setGezogen] = useState(true);
  const [animiert, setAnimiert] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setGezogen(false);
    setAnimiert(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setGezogen(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef}>
      <h3 className="text-lg font-semibold text-ink">From the kitchen table to today</h3>

      <div className="relative mt-8">
        {/* Die Linie. Waagerecht ab lg, darunter senkrecht – zwei getrennte
            SVGs sind hier ehrlicher als ein gedrehtes: Ein gedrehtes SVG
            bringt auf 390 px die Strichstärke durcheinander. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
          /* Die Linie endet AM LETZTEN PUNKT, nicht am Containerrand: Die
             Punkte sitzen am Anfang ihrer Spalte, der letzte also bei 80 %.
             Eine Linie, die danach ins Leere weiterlaeuft, sieht aus wie ein
             abgeschnittener sechster Halt. */
          style={{
            width: `calc(${((STATIONS.length - 1) / STATIONS.length) * 100}% + 13px)`,
          }}
          className={cn("absolute top-[13px] left-0 hidden h-0.5", !schmal && "lg:block")}
        >
          <line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(
              "text-brand-100",
              animiert && "transition-[stroke-dashoffset] duration-[1200ms] ease-out",
            )}
            style={{
              strokeDasharray: 100,
              strokeDashoffset: gezogen ? 0 : 100,
            }}
          />
        </svg>

        <svg
          aria-hidden="true"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          className={cn(
            "absolute top-0 left-[13px] h-full w-0.5",
            !schmal && "lg:hidden",
          )}
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(
              "text-brand-100",
              animiert && "transition-[stroke-dashoffset] duration-[1200ms] ease-out",
            )}
            style={{
              strokeDasharray: 100,
              strokeDashoffset: gezogen ? 0 : 100,
            }}
          />
        </svg>

        <ol
          className={cn(
            "relative flex flex-col gap-8",
            !schmal && "lg:flex-row lg:gap-6",
          )}
        >
          {STATIONS.map((station, position) => (
            <li
              key={station.title}
              className={cn("flex gap-4", !schmal && "lg:flex-1 lg:flex-col lg:gap-0")}
            >
              {/* Der Punkt. Er ploppt, sobald die Linie bei ihm angekommen
                  ist – die Verzögerung leitet sich aus seiner Position ab. */}
              <span
                aria-hidden="true"
                style={
                  animiert
                    ? { transitionDelay: `${Math.round(position * SCHRITT * 11)}ms` }
                    : undefined
                }
                className={cn(
                  "mt-1 block size-[26px] shrink-0 rounded-full border-2 border-brand-600 bg-surface",
                  animiert && "transition-transform duration-300 ease-out",
                  animiert && !gezogen && "scale-0",
                  animiert && gezogen && "scale-100",
                )}
              />

              <div className={cn(!schmal && "lg:mt-4 lg:pr-4")}>
                <p className="text-sm font-semibold text-ink">{station.title}</p>
                <p className="mt-1.5 text-sm text-gray-500">{station.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
