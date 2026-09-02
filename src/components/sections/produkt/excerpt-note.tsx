import Link from "next/link";

/**
 * Hinweis unter der Vier-Block-Serie auf /for-teachers.
 *
 * Die Seitenleiste in den Szenen zeigt seit dem Abgleich mit
 * docs/app-referenz/ die echte Navigation der Anwendung: acht Bereiche –
 * erklärt werden auf dieser Seite vier. Diese Zeile beantwortet die Frage,
 * die dadurch entsteht, statt sie offenzulassen.
 *
 * TON: Einladung, kein Anreissen. „There is so much more!" wäre genau die
 * Verkaufssprache, die CLAUDE.md untersagt – und sie würde die vier Bereiche
 * abwerten, die hier gerade ausführlich erklärt wurden. Der Satz sagt
 * stattdessen schlicht, was der Fall ist: Das hier ist der Kern, den Rest
 * zeigen wir im Gespräch.
 *
 * Bewusst dieselbe Typo-Klasse wie die Beispieldaten-Zeile unter den Szenen
 * (text-xs, gray-500): Es ist derselbe Hinweistyp – eine Randbemerkung zur
 * Darstellung, keine eigene Sektion.
 */
export function ExcerptNote() {
  return (
    <div className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-8">
        <p className="max-w-2xl text-xs text-gray-500">
          These four areas are the core; the sidebar shows what else belongs to it. Much
          of it you can{" "}
          <Link href="/preview" className="text-brand-600 underline underline-offset-4">
            try for yourself
          </Link>
          ; the rest we show you when we{" "}
          <Link href="/meet" className="text-brand-600 underline underline-offset-4">
            meet
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
