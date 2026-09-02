import Link from "next/link";

import { PRODUCT_NAME } from "@/config/brand";
import { primaryCta } from "@/config/site";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/scenes/hero-scene";

/**
 * Sektion 1 – Hero.
 * Traegt die einzige H1 der Seite.
 *
 * Rechts stand bis zur Einfuehrung der Szenen ein statisches
 * <InterfaceSkeleton />. Ersetzt durch <HeroScene />, die denselben Vorgang
 * zeigt, den die Subline beschreibt: Beobachtung wird Zeugnistext.
 *
 * Die Szene ist eine Client-Komponente; der Rest der Sektion bleibt eine
 * Server-Komponente. Nur die Szene selbst landet damit im Browser-Buendel.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-titel" className="border-b border-gray-200">
      <div className="mx-auto grid w-full max-w-6xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-28">
        <div>
          {/* ==================================================================
              H1 – SAGT, WAS WIR TUN. NICHT, WER DER LESER IST.
              ==================================================================
              Die Vorgängerfassung („Sie sind Lehrkraft geworden, um zu
              unterrichten. Nicht, um zu verwalten.") schrieb dem Leser sein
              Berufsmotiv zu. Das ist der erste Satz der Website – und damit
              die schlechteste denkbare Stelle, um jemandem zu erklären, warum
              er tut, was er tut. Siehe CLAUDE.md, Regel A unter TON.

              Jetzt steht dort eine Tatsache über UNS: Es gibt jetzt eine
              Assistenz für den Papierkram. Frech, ohne den Leser zu
              definieren.

              ENGLISCHE FASSUNG GESETZT (docs/en-review.md, Punkt 1):
              „Paperwork just got an assistant." Sie behaelt Frechheit UND
              Grammatik – der Papierkram ist Subjekt, nicht die Leserin – und
              „just got" traegt dasselbe beilaeufige „jetzt". Verworfen:
              „Paperwork now has an assistant." (flacher, klingt nach
              Produktdatenblatt) und „The paperwork finally has help."
              („finally" schiebt der Leserin ein Gefuehl unter, Regel A
              grenzwertig).

              KEINE block-Spans. `text-wrap: balance` aus globals.css teilt den
              Satz auf 390 px in zwei etwa gleich lange Zeilen, ohne dass eine
              davon auf einem Funktionswort endet. Handumbrüche wären hier nur
              eine Fessel.

              Der unbestimmte Artikel ist die Brücke zur Subline: „an
              assistant" oben, „the assistant that keeps learning" darunter –
              erst die Behauptung, dann ihr Name. */}
          <h1
            id="hero-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            Paperwork just got an assistant.
          </h1>

          {/* ==================================================================
              SUBLINE – POSITIONIERUNG „MITLERNEND"
              ==================================================================
              Jede Teilaussage ist einzeln gegen docs/produktstand-2026-08.md
              geprueft:

                „learns your style"       -> Zeugnisbemerkungen entstehen „im
                                             gelernten Schreibstil der
                                             Lehrkraft" (Live).
                „grows with your class"   -> Timeline je Kind, Fachverlauf und
                                             Klassenentwicklung ueber Monate
                                             (beides Live).
                „is guided by current
                 education standards"     -> Kompetenzmodell mit Jahrgangsbezug,
                                             43 Faecher (Live).

              ==================================================================
              WORTLAUT-SPERRE – NICHT AUFWEICHEN
              ==================================================================
              Niemals „accesses the curricula", „uses the state syllabuses"
              oder irgendeine Formulierung, die einen ZUGRIFF behauptet. Der
              Produktstand ist da eindeutig: Die Lehrplaene aller 16
              Bundeslaender liegen erhoben vor, sind aus Lizenzgruenden aber
              BEWUSST NICHT ANGEBUNDEN. „Is guided by" beschreibt, wonach das
              Kompetenzmodell gebaut ist – und behauptet keine Anbindung. Wer
              diesen Satz umformuliert, liest vorher den Abschnitt „Der
              Fachkorpus ist noch duenn" im Produktstand.

              „competencies", nicht „skills" (docs/glossar-en.md): Es geht um
              das Kompetenzmodell des Lehrplans, nicht um Fertigkeiten. */}
          <p className="mt-6 max-w-xl text-lg text-gray-500">
            {PRODUCT_NAME} is built for teachers, and it keeps learning. It picks up how
            you write. It grows with your class. And it stays guided by current education
            standards — from the note you make mid-lesson to the comment on the report.
          </p>

          {/* Der Satz bleibt: Er ist das Unterscheidungsmerkmal, an dem
              generische KI im Zeugnis scheitert. */}
          <p className="mt-4 max-w-xl text-lg text-gray-500">
            In your words, not in AI words.
          </p>

          {/* Herkunftszeile. Nennt bewusst keinen Namen – die Person bleibt
              anonym, so wie im Erzaehltext auf /our-story. */}
          <p className="mt-6 max-w-xl text-sm text-gray-500">
            It started at a trainee primary teacher’s kitchen table{" "}
            <span aria-hidden="true">→</span>{" "}
            <Link
              href="/our-story#why"
              className="text-brand-600 underline underline-offset-4"
            >
              Our story
            </Link>
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Primaerer CTA – einzige Verwendung von --cta in dieser Sektion. */}
            <Button asChild variant="cta" size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>

            {/* Fuehrt direkt in den gefuehrten Einblick. Vorher sprang der
                Knopf zu einer Sektion weiter unten, die ihrerseits dorthin
                verwies – ein Umweg ueber einen Anker. */}
            <Button asChild variant="ghost" size="lg">
              <Link href="/preview">Try it yourself</Link>
            </Button>
          </div>
        </div>

        <HeroScene />
      </div>
    </section>
  );
}
