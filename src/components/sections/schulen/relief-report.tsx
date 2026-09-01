import Link from "next/link";
import { FileDown } from "lucide-react";

import { DATA_SEPARATION_NOTE, IMPACT_LINE_PRINCIPLE } from "@/config/product";

import { SteeringScene } from "@/components/scenes/produkt/steering-scene";
import { SampleDataNote } from "@/components/scenes/sample-data-note";

/**
 * Sektion – Der Entlastungsbericht.
 *
 * Das stärkste Argument dieser Seite, und zwar aus einem bestimmten Grund:
 * Er ist das Dokument, das eine Schulleitung ihrem Schulträger vorlegen kann.
 * Damit haengt eine Verlaengerung nicht allein an der Zufriedenheit einzelner
 * Lehrkraefte.
 *
 * ZWEI EINSCHRAENKUNGEN STEHEN BEWUSST MIT DRIN, obwohl sie das Argument
 * schwaechen:
 *
 *   1. Kein Euro-Betrag. Die Grundlage sind hinterlegte Minutenannahmen; die
 *      sind im Produkt als Schaetzwerte gekennzeichnet. Eine hochgerechnete
 *      Summe waere die Zahl, die in einer Vorlage an den Schultraeger landet –
 *      und dort haelt sie keiner Nachfrage stand.
 *   2. Die Wirkungszeile. „Eingesparte Stunden" ist eine Prozesskennzahl, keine
 *      belegte Wirkung. Der Grundsatz dazu kommt aus IMPACT_LINE_PRINCIPLE
 *      und steht wortgleich auf /research. Er wird hier NICHT eingeleitet:
 *      Die Konstante sagt selbst, wo der Satz im Produkt steht.
 *
 * Beides gehoert auf die Website, weil eine Schulleitung genau hier nachfragt.
 */
const details = [
  "Hours saved, automation rates and cases per process",
  "Last completed month compared with the month before; the current month separately as an interim figure",
  "Use across the staff as a distribution – deliberately no ranking by name",
];

export function ReliefReport() {
  return (
    <section
      aria-labelledby="entlastungsbericht-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2
              id="entlastungsbericht-titel"
              className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
              The workload relief report
            </h2>

            <p className="mt-6 max-w-xl text-lg text-gray-500">
              At the end of the month, the leadership view shows what the application has
              given back to the staff. Exportable as a PDF – the document you put in front
              of your school authority.
            </p>

            <ul className="mt-8 space-y-3">
              {details.map((detail) => (
                <li key={detail} className="flex items-start gap-3">
                  <FileDown
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-brand-600"
                  />
                  <span className="text-ink">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dieselbe Komponente wie der Steuerungs-Block auf /produkt, nur in
              der grossen Ausführung. KEINE Kopie: Zahl, Schätzwert-Hinweis und
              Erhebungs-Zeile dürfen zwischen den beiden Seiten nicht
              auseinanderlaufen. */}
          <div className="lg:pt-4">
            <SteeringScene size="large" />
            <SampleDataNote excerpt />

            {/* Der Bruchteil-Hinweis. Die Seitenleiste der Szene zeigt fuenf
                Leitungsbereiche, erklaert wird hier einer – das gehoert
                gesagt, und zwar als Feststellung, nicht als Anreisser. */}
            <p className="mt-2 text-xs text-gray-500">
              The workload relief report is one of several analyses in the leadership
              view.
            </p>

            {/* Verweis in den gefuehrten Einblick. Bewusst ALLGEMEIN
                formuliert: Dort gibt es heute die drei Lehrkraft-Bereiche,
                keinen Leitungsmodus. Ein „Sehen Sie sich den Leitungsmodus
                selbst an" waere eine Zusage, die die Tour nicht einloest. */}
            <p className="mt-4 text-sm">
              <Link
                href="/preview"
                className="text-brand-600 underline underline-offset-4"
              >
                Try the application for yourself
              </Link>
            </p>
          </div>
        </div>

        {/* Die beiden Einschränkungen standen bis zur Einführung der Szene als
            eigene Karten rechts. Sie bleiben als Fliesstext erhalten, weil die
            Szene aria-hidden ist und ihren Inhalt nur als Bildbeschreibung
            trägt – wer sie hier streicht, streicht sie aus der Seite. */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <p className="text-gray-500">
            <span className="font-medium text-ink">Deliberately without a euro figure.</span>{" "}
            The calculation rests on stored assumptions about minutes. Those are labelled
            as estimates and are not extrapolated into a total that would not survive a
            follow-up question.
          </p>

          <p className="text-gray-500">
            <span className="font-medium text-ink">The impact line.</span>{" "}
            {IMPACT_LINE_PRINCIPLE} Because hours saved are a process metric, not evidence
            of impact.
          </p>
        </div>

        {/* ==================================================================
            UMGEZOGEN AUS DER GELOESCHTEN SEKTION „WER WAS NUTZT"
            ==================================================================
            Dieser Absatz war dort die einzige Aussage, die es auf /for-school-leadership
            sonst nirgends gibt – und ausgerechnet die, nach der ein
            Personalrat als Erstes fragt: Die Schulleitung sieht ausgewertete
            Kennzahlen, keine einzelnen Beobachtungen.

            Er waere mit der Sektion ersatzlos verschwunden. Hier steht er
            inhaltlich richtiger als vorher: direkt neben den Zahlen, die die
            Schulleitung tatsaechlich sieht. */}
        <p className="mt-12 max-w-3xl border-l-2 border-gray-200 pl-6 text-gray-500">
          What school leadership explicitly does not see: individual observations and
          assessments. {DATA_SEPARATION_NOTE} There is no role with an overall view of
          several teachers’ data – not for school leadership either.
        </p>
      </div>
    </section>
  );
}
