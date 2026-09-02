import { SeatingScene } from "@/components/scenes/produkt/seating-scene";

/**
 * Sektion – „And the everyday around it“.
 *
 * ==========================================================================
 * WARUM EIGENE SEKTION UND NICHT INS PRINZIP-BAND
 * ==========================================================================
 * Das Prinzip-Band ist eine Haltungsaussage in zwei Saetzen („Selyvi suggests.
 * You decide.“). Eine Szene daneben wuerde dort zwei Dinge
 * gleichzeitig behaupten und die Aussage schwaechen – das Band lebt davon,
 * dass es nichts zeigt.
 *
 * Nach den vier Bloecken passt sie dagegen genau: Die vier Bereiche sind die
 * grossen Zusagen, das hier ist der Rest des Schultags.
 *
 * Schmal gehalten (max-w-4xl statt max-w-6xl) und ohne Stichpunktliste: Die
 * drei Funktionen sind bereits im Block „Teaching“ aufgezaehlt. Diese
 * Sektion wiederholt sie nicht, sie ZEIGT eine davon – das ist der einzige
 * Grund, warum es sie gibt.
 */
export function EverydayExtras() {
  return (
    <section aria-labelledby="alltag-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
        <h2
          id="alltag-titel"
          className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
        >
          And the everyday around it
        </h2>

        <p className="mt-5 max-w-2xl text-lg text-gray-500">
          Not every job in the school year is writing. The seating plan counts too, and
          the timetable, and filing pupils’ work — the small things that should never
          cost an hour.
        </p>

        <div className="mt-10">
          <SeatingScene />
        </div>
      </div>
    </section>
  );
}
