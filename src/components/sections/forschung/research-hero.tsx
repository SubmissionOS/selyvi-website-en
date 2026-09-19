import Link from "next/link";

import { PRODUCT_NAME } from "@/config/brand";
import { Button } from "@/components/ui/button";

/**
 * Sektion 1 – Hero der Forschungsseite, neu ab dem CEO-Auftrag vom 17.09.2026.
 *
 * ==========================================================================
 * DER STRATEGIEWECHSEL IN EINER ZEILE
 * ==========================================================================
 * Vorher hiess die H1 „Impact we want to evidence – not assert." Das war eine
 * Aussage ueber UNS: Selyvi als Gegenstand von Forschung. Die neue Zeile dreht
 * die Richtung – die Forschungsfrage gehoert der Leserin, Selyvi ist das
 * Werkzeug darunter.
 *
 * Der alte Satz ist nicht verschwunden, sondern eine Ebene tiefer gerutscht:
 * Wirkungsmodell und Regeln zu Forschungsdaten stehen weiter auf dieser Seite.
 * Sie sind jetzt der Beleg statt der Ankuendigung.
 *
 * ==========================================================================
 * ANPASSUNG AN REGEL A
 * ==========================================================================
 * Die Fachgebiets-Zeile stand im Auftrag als Aufzaehlung ohne Rahmen. Sie
 * steht hier mit der Vorbemerkung „Projects from:" statt als direkte Anrede –
 * eine Liste, die mit „You research …" eingeleitet waere, schriebe der
 * Leserin zu, wer sie ist. Die Liste selbst ist unveraendert.
 */
const FELDER = [
  "Education research",
  "Classroom research",
  "School development",
  "EdTech",
  "AI in education",
  "Teacher research",
];

export function ResearchHero() {
  return (
    <section aria-labelledby="forschung-hero-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="forschung-hero-titel"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Your research question. {PRODUCT_NAME} as the technical infrastructure.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          {PRODUCT_NAME} can be extended for research projects — with features, data
          collection and digital routines. You bring the research question; together we
          work out how {PRODUCT_NAME} carries it into the school day.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* Primaerer CTA – Anker auf das Formular am Seitenende. Kein
              --cta-Button: Der bleibt dem Kennenlernen vorbehalten, und diese
              Seite fuehrt zu einem Gespraech, nicht zu einer Anfrage. */}
          <Button asChild variant="primary" size="lg">
            <a href="#research-project-form">Talk through a research project</a>
          </Button>

          <Link
            href="/preview"
            className="text-base text-brand-600 underline underline-offset-4"
          >
            Try it yourself
          </Link>
        </div>

        {/* Fachgebiete als Liste, nicht als Fliesstext: Wer prueft, sucht das
            eigene Feld und liest nicht den Satz. */}
        <p className="mt-10 text-sm text-gray-500">
          Projects from:{" "}
          <span className="text-ink">
            {FELDER.map((feld, index) => (
              <span key={feld}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                {feld}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
