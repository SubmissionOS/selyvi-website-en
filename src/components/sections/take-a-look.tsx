import Link from "next/link";

import { PRODUCT_NAME } from "@/config/brand";
import { ReportScene } from "@/components/scenes/how-it-works-scenes";
import { SampleDataNote } from "@/components/scenes/sample-data-note";
import { Button } from "@/components/ui/button";

/**
 * Sektion – „Try it for yourself."
 *
 * ZAHL KORRIGIERT: Die deutsche Fassung sagt hier „Drei Bereiche sind offen",
 * /preview und die Meta-Beschreibung sagen VIER. Offen sind vier
 * (workspace.tsx: meine-klassen, live-unterricht, material, timeline). Die
 * englische Fassung nennt vier; der Widerspruch gehoert auf der deutschen
 * Seite nachgezogen.
 *
 * Ersetzt „So funktioniert's". Dort erklärten drei Mini-Szenen den Kreislauf;
 * jetzt führt ein Knopf in den geführten Einblick, wo man ihn selbst anklickt.
 * Erklären war der Umweg.
 *
 * Die frühere Sprungmarke `so-funktionierts` ist entfallen: Der
 * Sekundär-Button im Hero zeigt jetzt direkt auf /preview statt auf einen
 * Anker weiter unten. Ein Sprung innerhalb der Seite war der Umweg zum Umweg.
 *
 * ==========================================================================
 * WARUM EINE DER DREI MINI-SZENEN ÜBERLEBT
 * ==========================================================================
 * <ReportScene /> zeigt, was die Schulleitung am Monatsende sieht. Ohne sie
 * verlöre die Startseite die Leitungs-Perspektive vollständig – die anderen
 * beiden Minis (Beobachten, Texte erzeugen) sagen dagegen dasselbe wie der
 * Hero und „What gets taken off your hands". Sie sind deshalb entfallen, diese
 * nicht.
 *
 * Der Knopf ist bewusst NICHT --cta: Die Farbe gehört dem „Meet Selyvi". Zwei
 * gleich starke Aufrufe auf einer Seite heben sich gegenseitig auf.
 */
export function TakeALook() {
  return (
    <section
      aria-labelledby="einen-blick-titel"
      className="border-y border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <h2
            id="einen-blick-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Try it for yourself.
          </h2>

          <p className="mt-6 max-w-xl text-lg text-gray-500">
            The quickest way to understand {PRODUCT_NAME} is to click through it. Four
            areas are open; the rest we show you in person.
          </p>

          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/preview">Take a look</Link>
            </Button>
          </div>
        </div>

        <div>
          <ReportScene />
          <SampleDataNote />
        </div>
      </div>
    </section>
  );
}
