import Link from "next/link";

/**
 * Fussnotiz am Ende von /for-teachers.
 *
 * Bewusst KLEIN: Eine Lehrkraft, die wissen will, was Selyvi ihr abnimmt, ist
 * hier fertig. Wer nebenbei in der Lehrkraeftebildung oder an einer Hochschule
 * arbeitet, findet den Weg – alle anderen scrollen daran vorbei, ohne dass
 * ihnen etwas fehlt.
 *
 * Das ist zugleich der EINE Forschungs-Verweis dieser Seite (CLAUDE.md,
 * Verweis-Regel). Die Redundanz-Tabelle prueft das.
 *
 * REGEL A: Die Ueberschrift fragt nach der TAETIGKEIT, nicht nach der Person.
 * „Also working in research or teacher education?" laesst die Leserin
 * antworten; „Sie forschen doch auch …" wuerde es ihr zuschreiben.
 */
export function ResearchNote() {
  return (
    <section
      aria-labelledby="lehrkraefte-forschung-titel"
      className="border-t border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <h2
            id="lehrkraefte-forschung-titel"
            className="text-base font-semibold text-ink"
          >
            Also working in research or teacher education?
          </h2>

          <p className="mt-3 text-gray-500">
            Project-specific features are something we build together with universities
            and research groups.{" "}
            <Link
              href="/research"
              className="text-brand-600 underline underline-offset-4"
            >
              For research &amp; universities
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
