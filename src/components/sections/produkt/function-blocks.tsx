import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { PRODUCT_NAME } from "@/config/brand";
import {
  TRANSLATION_LANGUAGE_COUNT,
  TRANSLATION_LANGUAGES_SENTENCE,
} from "@/config/product";
import { Button } from "@/components/ui/button";
import { DocumentationScene } from "@/components/scenes/produkt/documentation-scene";
import { CommunicationScene } from "@/components/scenes/produkt/communication-scene";
import { TeachingScene } from "@/components/scenes/produkt/teaching-scene";
import { SteeringScene } from "@/components/scenes/produkt/steering-scene";
import { SampleDataNote } from "@/components/scenes/sample-data-note";

type FunctionBlock = {
  id: string;
  /**
   * Bereichsname aus docs/produktstand-2026-08.md.
   *
   * Steht als kleine Zeile ueber der Ueberschrift. Die Ueberschrift selbst
   * benennt seit dem Ton-Wechsel die LAST, die wegfaellt – ohne diese Zeile
   * ginge die Gliederung nach der Wahrheitsquelle verloren, und niemand
   * koennte die Seite mehr gegen das Dokument gegenlesen.
   */
  area: string;
  title: string;
  paragraphs: string[];
  bullets: string[];
  scene: ReactNode;
  /**
   * Zeigt die Szene Kennzahlen? Dann steht darunter ein sichtbarer
   * „Beispieldaten“-Hinweis – siehe sample-data-note.tsx.
   */
  sceneHasFigures?: boolean;
  action?: { label: string; href: string };
};

/**
 * Die vier Bereiche aus docs/produktstand-2026-08.md, in dessen Reihenfolge:
 * Dokumentation, Kommunikation, Unterricht, Steuerung.
 *
 * ==========================================================================
 * NUR „LIVE“-FUNKTIONEN. Was im Dokument „Rollout offen“, „Teilweise“ oder
 * „Nicht gebaut“ traegt, steht hier NICHT – auch nicht abgeschwaecht.
 * ==========================================================================
 *
 * Konkret nicht auf dieser Seite, obwohl es naheliegend waere:
 *   - Uebernahme von Original-Arbeitsblaettern aus dem Korpus („Rollout offen“)
 *     – auf Englisch waere das „original worksheets from the corpus“
 *   - Stilprofil per Upload eigener Texte („Teilweise“). Es steht nirgends
 *     mehr auf der Website: Was es nicht gibt, wird nicht angekuendigt,
 *     sondern weggelassen (CLAUDE.md, Regel D).
 *   - Der KI-Vorschlag zum Sitzplan – der Sitzplan selbst ist live, der
 *     Vorschlag ist Prototyp. Der Stichpunkt nennt deshalb nur den Sitzplan.
 *
 * „leadership view“ fuer „Leitungsmodus“ (docs/glossar-en.md): „Mode“ klingt
 * nach Schalter, es ist aber eine eigene Ansicht.
 *
 * Zwei Stichpunkte benennen ausdruecklich eine GRENZE statt eine Faehigkeit:
 * der Versand ueber das eigene Mailprogramm und die nie automatische Zuordnung
 * im Massenupload. Beides faellt in einer Demo ohnehin auf; wer es vorher
 * gelesen hat, erlebt es als Haltung statt als Luecke.
 */
const blocks: FunctionBlock[] = [
  {
    id: "dokumentation",
    area: "Documentation",
    title: "Report season loses its terror.",
    paragraphs: [
      "Whatever you notice during a lesson, you record on the spot – typed or dictated. The free text becomes a structured observation with subject, category, priority and support note.",
      "For the lesson itself there is a live lesson mode in which you record for several children at once. For in between, a short form.",
      `${PRODUCT_NAME} deliberately does not derive competencies automatically from marks: a mark in German does not tell you whether a child reads fluently.`,
    ],
    bullets: [
      "Observations by keyboard or dictation",
      "Competencies across 43 subjects, tied to the year group",
      "A chronological timeline per child, with support recommendations",
      "Free questions to your own data – the context stays limited to it on the server",
    ],
    scene: <DocumentationScene />,
  },
  {
    id: "kommunikation",
    area: "Communication",
    title: "Parent post without an evening shift.",
    paragraphs: [
      "Report comments come out of your own observations, marks and competency assessments – in the writing style the application has learned from your texts. Observations by colleagues deliberately do not feed in.",
      `Parent emails are written in German and translated in a second step: ${TRANSLATION_LANGUAGES_SENTENCE}. Names and signature stay untouched.`,
      `The email is sent from your own mail program. ${PRODUCT_NAME} writes it – it does not send it.`,
    ],
    bullets: [
      "Report comments out of your own observations",
      `${TRANSLATION_LANGUAGE_COUNT} target languages for parent emails, at no extra cost`,
      "No parent or pupil portal – sending stays with you",
    ],
    scene: <CommunicationScene />,
  },
  {
    id: "unterricht",
    area: "Teaching",
    title: "Preparation that fits your class – not off the shelf.",
    paragraphs: [
      "Materials come not from the memory of a language model but from a searchable subject corpus – combined with what you have documented about your class. Every generated document states its sources.",
      "Which sources feed in is something you can select yourself, instead of letting them be pulled automatically.",
      "When scans are uploaded in bulk, the application proposes an assignment based on the file name. Nothing is ever assigned automatically: where two children share a first name, there is deliberately no proposal at all.",
    ],
    bullets: [
      "Lesson drafts including differentiated variants of the same lesson",
      "Seating plan with locked seats, by drag and drop",
      "Class timetable with no editorial step and no approval",
      "Reading out scans as a tick box, switched off by default",
    ],
    scene: <TeachingScene />,
  },
  {
    id: "steuerung",
    area: "Steering",
    title: "Your work becomes visible – as relief, never as monitoring.",
    paragraphs: [
      "School leadership switches to the leadership view in the header of the application. The entry point there is the workload relief report: hours saved, automation rates and cases per process, for the last completed month compared with the month before.",
      "The report deliberately names no euro figure. It rests on stored assumptions about minutes, and those are labelled as estimates.",
    ],
    bullets: [
      "Workload relief report as a PDF, month by month",
      "Use across the staff as a distribution – deliberately no ranking by name",
      "Individual observations and assessments stay with the teacher",
    ],
    scene: <SteeringScene />,
    sceneHasFigures: true,
    action: {
      label: "For school leadership",
      href: "/for-school-leadership",
    },
  },
];

/**
 * Sektion 3 – Vier Funktionsblöcke, abwechselnd Text links und rechts.
 */
export function FunctionBlocks() {
  return (
    <section aria-label="Features in detail">
      {blocks.map((block, index) => {
        // Ungerade Bloecke spiegeln: Text rechts, Szene links.
        const reversed = index % 2 === 1;

        return (
          <div
            key={block.id}
            className={cn(
              "border-b border-gray-200",
              reversed ? "bg-surface-alt" : "bg-surface",
            )}
          >
            <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
              <div className={reversed ? "lg:order-2" : undefined}>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  {block.area}
                </p>

                <h2
                  id={block.id}
                  className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
                >
                  {block.title}
                </h2>

                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-5 max-w-xl text-lg text-gray-500">
                    {paragraph}
                  </p>
                ))}

                <ul className="mt-8 space-y-3">
                  {block.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <Check
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0 text-brand-600"
                      />
                      <span className="text-ink">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {block.action ? (
                  <div className="mt-10">
                    <Button asChild variant="outline" size="lg">
                      <Link href={block.action.href}>{block.action.label}</Link>
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className={reversed ? "lg:order-1" : undefined}>
                {block.scene}
                {block.sceneHasFigures ? <SampleDataNote /> : null}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
