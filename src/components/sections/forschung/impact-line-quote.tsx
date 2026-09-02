import { IMPACT_LINE_PRINCIPLE } from "@/config/product";

/**
 * Sektion 3 – Der Grundsatz hinter der Wirkungszeile, als Zitat-Band.
 *
 * Die Wirkungszeile ist laut docs/produktstand-2026-08.md Live: Direkt unter
 * dem Entlastungsbericht steht eine Einordnung, die Gemessenes als Messwert
 * und Geschaetztes als Schaetzwert ausweist – und sie verschwindet nie.
 *
 * Warum dieser Satz auf der FORSCHUNGSSEITE steht und nicht nur auf /for-school-leadership:
 * Er ist der einzige Beleg auf dieser Website dafuer, dass die
 * Wirkungsmessung nicht nur als Absicht existiert, sondern im laufenden
 * Produkt eine Aussage BLOCKIEREN kann. Genau das ist die Frage, die eine
 * Forscherin stellt.
 *
 * <blockquote> statt eines gestylten <p>: Der Satz ist ein Zitat aus dem
 * eigenen Produktgrundsatz, und Screenreader kuendigen ihn als solches an.
 */
export function ImpactLineQuote() {
  return (
    <section aria-label="The principle behind the impact line" className="bg-surface-alt">
      {/* ==================================================================
          ANKER STATT TEXTWAND
          ==================================================================
          Das Band stand als 768 px breiter Absatz mit einer 2 px dünnen Kante
          links – aus zwei Metern Entfernung nicht von Fließtext zu
          unterscheiden. Es traegt jetzt drei Anker: ein grosses
          Anfuehrungszeichen, eine kraeftige farbige Kante und eine schmalere
          Zeilenlaenge.

          Das Anfuehrungszeichen ist `aria-hidden` und der Satz behaelt seine
          typografischen Zeichen: Screenreader sollen das Zitat einmal hoeren,
          nicht dreimal ein Anfuehrungszeichen. */}
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="flex max-w-3xl gap-5 border-l-4 border-brand-600 pl-6 sm:gap-7">
          <span
            aria-hidden="true"
            className="-mt-3 text-6xl leading-none font-semibold text-brand-100 select-none sm:-mt-5 sm:text-8xl"
          >
            „
          </span>

          <div>
            <blockquote>
              <p className="text-xl leading-snug font-medium tracking-tight text-ink sm:text-2xl">
                „{IMPACT_LINE_PRINCIPLE}“
              </p>
            </blockquote>

            <p className="mt-6 text-base text-gray-500">
              Without it, “140 hours saved” reads like evidence. It is not, and the line
              says so.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
