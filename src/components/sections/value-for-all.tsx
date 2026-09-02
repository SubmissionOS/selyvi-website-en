import { Building2, ClipboardPen, LineChart, type LucideIcon } from "lucide-react";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 8 – „What Selyvi gives back“.
 *
 * Steht zwischen „What gets taken off your hands“ und dem DSGVO-Block. Die
 * Reihenfolge ist Absicht: erst die Funktionen, dann – fuer wen sich das
 * lohnt. Vorher gelesen waere die Spalte „For school authorities“ eine Behauptung ohne
 * Grundlage.
 *
 * ==========================================================================
 * JEDER EINZELNE STICHPUNKT IST DURCH docs/produktstand-2026-08.md GEDECKT.
 * ==========================================================================
 * Die Gliederung nach Zielgruppen stammt aus docs/selyvi-kompakt.md – aber
 * jenes Dokument ist Zielbild, keine Quelle fuer Aussagen. Die dort genannten
 * Mehrwerte („bessere Planbarkeit“, „evidenzbasierte Entscheidungen“,
 * „langfristige Qualitaetsentwicklung“) sind Absichtserklaerungen und stehen
 * deshalb hier NICHT. Was steht, ist je Punkt eine als Live gefuehrte Funktion.
 *
 * Zwei Praezisierungen gegenueber dem Zielbild-Dokument:
 *   - Der Schultraeger hat KEINEN eigenen Zugang. Der Produktstand sagt: Der
 *     Entlastungsbericht ist das Dokument, das eine SCHULLEITUNG ihrem
 *     Traeger vorlegen kann. Die Spalte ist entsprechend formuliert – sonst
 *     erwartet ein Traeger im Erstgespraech einen Login, den es nicht gibt.
 *   - Die CRM-Schnittstelle (GET /export/school-usage) taucht nirgends auf.
 *     Der Produktstand fuehrt sie unter „Fuer den Vertrieb – nichts davon
 *     gehoert auf die oeffentliche Website“.
 *
 *
 * ==========================================================================
 * WARUM DIE SPALTE „FOR TEACHERS“ ANDERS GEBAUT IST ALS DIE ANDEREN BEIDEN
 * ==========================================================================
 * Sie nannte urspruenglich Zeugnistext, Elternmail und Material – also genau
 * die drei Tatsachen, die auf der Startseite ohnehin schon im Hero, in „Was
 * sich im Alltag ändert“, in „What gets taken off your hands“ und in der FAQ
 * stehen. Gemessen ueber die Quelldateien waren das fuenf Sektionen fuer
 * dieselben drei Aussagen; diese hier war die fuenfte und hat nichts
 * hinzugefuegt.
 *
 * Jetzt traegt sie drei Merkmale, die sonst NIRGENDS auf der Startseite
 * stehen – nachgezaehlt vor der Aenderung, jeweils 0 Treffer ueber alle
 * Startseiten-Sektionen und die beiden Szenen-Dateien:
 *
 *   1. Gelernter Schreibstil.  Produktstand: „Zeugnisbemerkungen — Live …
 *      im gelernten Schreibstil der Lehrkraft.“
 *      ACHTUNG BEIM UEBERARBEITEN: „Schreibstil lernen“ steht separat als
 *      „Teilweise“ – gemeint ist dort der UPLOAD eigener Texte, dessen
 *      Oberflaeche fehlt. Heute entsteht das Profil aus den in der Anwendung
 *      geschriebenen Texten. Der Stichpunkt sagt deshalb, DASS der Stil
 *      gelernt wird, und nicht, dass man Texte hochlaedt. Wer das aendert,
 *      macht aus einer gedeckten Aussage eine ungedeckte.
 *   2. Keine Automatik bei Kompetenzen.  Produktstand: „Kompetenzen statt
 *      Notendurchschnitt — Live … Bewusst ohne automatischen Vorschlag aus
 *      der Note.“
 *   3. Fundstellen selbst waehlbar.  Produktstand: „Unterrichtsmaterial aus
 *      echtem Fachwissen — Live … Die Lehrkraft kann die Fundstellen auch
 *      selbst auswaehlen statt sie automatisch ziehen zu lassen.“
 *
 * Der dritte Punkt vermeidet bewusst das Wort „materials“: Die Aussage
 * „materials that fit the class“ steht schon vier Mal auf der Seite. Hier geht
 * es um etwas anderes – wer die Quellen auswaehlt.
 *
 * „school authority“ fuer „Schultraeger“ (docs/glossar-en.md): Ein deutsches
 * Konstrukt ohne Entsprechung. Der Begriff beschreibt die Funktion, ohne ein
 * falsches Land-Modell zu behaupten.
 *
 * Alle drei passen unter dieselbe Ueberschrift: Es sind die Stellen, an denen
 * die Entscheidung ausdruecklich bei der Lehrkraft bleibt.
 *
 * Und es gibt bewusst KEINE vierte Spalte fuer Schuelerinnen und Schueler.
 * Es gibt kein Schuelerportal; eine eigene Spalte wuerde einen Zugang
 * suggerieren, den das Produkt nicht hat und nicht haben will. Der eine
 * Abschlusssatz sagt das Wesentliche, ohne etwas zu versprechen.
 */
type ValueColumn = {
  icon: LucideIcon;
  audience: string;
  headline: string;
  points: string[];
};

const columns: ValueColumn[] = [
  {
    icon: ClipboardPen,
    audience: "For teachers",
    headline: "The writing, not the judgement.",
    points: [
      "Record several children at once while the lesson runs, instead of from memory that evening",
      "No automatic step from marks to competencies. A mark in German does not tell you whether a child reads fluently — what gets assessed is what you saw",
      "You pick which sources from the subject corpus feed in, rather than letting them be pulled automatically",
    ],
  },
  {
    icon: LineChart,
    audience: "For school leadership",
    headline: "An overview that puts nobody on the spot.",
    points: [
      "The workload relief report shows the time gained, month by month",
      "Use across the staff as a distribution – never as a ranking by name",
      "Trends across real months, with the current one marked as still running",
    ],
  },
  {
    icon: Building2,
    audience: "For school authorities",
    headline: "Something to put on the table instead of a gut feeling.",
    points: [
      "School leadership can hand the workload relief report over as a PDF",
      "Estimated figures are labelled as estimates, not as measured values",
      "The impact line places every figure: measured value or estimate",
    ],
  },
];

export function ValueForAll() {
  return (
    <section
      aria-labelledby="zurueckgibt-titel"
      className="border-t border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="zurueckgibt-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          What {PRODUCT_NAME} gives back
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {columns.map((column) => (
            <div key={column.audience}>
              <column.icon
                aria-hidden="true"
                className="size-7 text-brand-600"
                strokeWidth={1.5}
              />

              <p className="mt-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                {column.audience}
              </p>

              <h3 className="mt-2 text-lg font-semibold text-ink">{column.headline}</h3>

              <ul className="mt-5 space-y-3">
                {column.points.map((point) => (
                  <li
                    key={point}
                    className="border-l-2 border-gray-200 pl-4 text-base text-gray-500"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Abschlusszeile ueber die volle Breite – bewusst KEINE vierte Spalte.
            Siehe Kopfkommentar: ein Schuelerportal gibt es nicht. */}
        <p className="mt-14 border-t border-gray-200 pt-10 text-lg text-ink">
          And the children? They gain indirectly — from a teacher who has time for them
          again.
        </p>
      </div>
    </section>
  );
}
