import { FileSignature, Server } from "lucide-react";

import { PRODUCT_HOSTING_NOTE } from "@/config/product";

/**
 * Hinweis zur Auftragsverarbeitung – GETEILTE Sektion.
 *
 * Wird auf /for-school-leadership und /security eingesetzt. Bewusst EINE
 * Komponente statt zweimal derselbe Text: Die Aussage zum AVV muss auf beiden
 * Seiten wortgleich sein, und zwar auch noch, nachdem jemand sie einmal
 * ueberarbeitet hat. Eine Kopie waere genau die Stelle, an der eine Schule
 * spaeter zwei verschiedene Zusagen nebeneinander findet.
 *
 * „data processing agreement (DPA)“ ist der Begriff aus Art. 28 GDPR in der
 * englischen Fassung; die Abkuerzung wird beim ersten Vorkommen eingefuehrt
 * (docs/glossar-en.md).
 *
 * Der Text verspricht bewusst KEIN fertiges Dokument. Ein AVV ist fuer eine
 * Schule ein Beschaffungs-Kriterium; die Zusage „Entwurf stellen wir bereit“
 * ohne existierendes Dokument waere genau die Art von Aussage, die im
 * Erstgespraech auffliegt. Sobald der Entwurf vorliegt, kann der Satz konkreter
 * werden – siehe README, NACH-LAUNCH-LISTE.
 *
 * Der erste Absatz kommt aus PRODUCT_HOSTING_NOTE und ist damit wortgleich mit
 * dem DSGVO-Block der Startseite und dem Prinzipien-Grid: AVV und Serverumzug
 * sind dasselbe Vorhaben und duerfen nicht an drei Stellen drei Zeitpunkte
 * nennen.
 */
export function DpaBand() {
  return (
    <section
      aria-labelledby="avv-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        {/* ==============================================================
            ZWEI KARTEN STATT EINES ABSATZBLOCKS
            ==============================================================
            Das Band stand als 768 px breiter Textblock in einem 1088 px
            breiten Container – rechts daneben nichts, gemessen im
            Leerraum-Audit. Es enthält aber zwei getrennte Aussagen: den
            Stand der Umsetzung und den Weg dorthin. Als zwei Karten mit
            Symbol tragen sie den Ausschnitt und sind schneller zu erfassen.

            WICHTIG: PRODUCT_HOSTING_NOTE steht in Karte 1 UNGETEILT. Eine
            frühere Fassung hat die Konstante an ihrer Konjunktion
            aufgetrennt, um zwei Karten daraus zu machen – das hätte die
            geteilte Zusage von der Formatierung dieser einen Sektion
            abhängig gemacht. Wer den Satz in product.ts umformuliert, hätte
            hier stillschweigend einen halben Satz bekommen. */}
        <div className="max-w-4xl">
          <h2 id="avv-titel" className="text-2xl font-semibold tracking-tight text-ink">
            Data processing under Article 28 GDPR
          </h2>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Server, text: PRODUCT_HOSTING_NOTE },
              {
                icon: FileSignature,
                text: "We answer every question about it openly in the first conversation.",
              },
            ].map((karte) => (
              <li
                key={karte.text}
                className="rounded-xl border border-gray-200 bg-surface p-6"
              >
                <karte.icon
                  aria-hidden="true"
                  className="size-6 text-brand-600"
                  strokeWidth={1.75}
                />
                <p className="mt-4 text-base text-gray-500">{karte.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
