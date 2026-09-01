/**
 * Erzaehl-Zeile – die Uebergaenge, die den roten Faden sichtbar machen.
 *
 * Drei Stellen auf der Startseite, jeweils zwischen zwei Sektionen: ein
 * kurzer Satz, in dem jemand innehaelt und sagt, woher das hier kommt.
 *
 * Bauweise und ihre Gruende:
 *   - KEIN <section> und keine Ueberschrift. Diese Zeilen sind Uebergaenge,
 *     keine Abschnitte. Eine H2 wuerde die Gliederung der Seite zerreissen,
 *     und ein zweiter Landmark waere fuer Screenreader nur Rauschen.
 *   - Kursiv, schmal, mittig – die einzigen drei Stellen der Seite, an denen
 *     Text zentriert steht. Genau deshalb liest man sie als andere Stimme.
 *   - text-ink, nicht text-gray-500. Zentrierter Kursivtext in Grau waere
 *     zweifach abgesetzt und faenge an, nach Dekoration auszusehen.
 *   - Kein eigener Hintergrund: Die Zeile uebernimmt den der Seite und wirkt
 *     wie eine Atempause zwischen zwei Baendern, nicht wie ein viertes Band.
 *
 * TON: Diese Saetze sind der empfindlichste Text der ganzen Website – und in
 * der Uebersetzung erst recht: Sie leben von Rhythmus, nicht von Information.
 * Die drei englischen Fassungen stehen in docs/en-review.md zur Freigabe. Sie
 * duerfen nichts behaupten, nichts anpreisen und keine Funktion nennen – wer
 * hier eine Produktaussage unterbringt, macht aus einer Erinnerung eine
 * Anzeige. Massstab beim Ueberarbeiten: Der Satz muss laut vorgelesen von
 * einem Menschen stammen koennen.
 */
export function StoryLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface">
      <p className="mx-auto w-full max-w-2xl px-6 py-16 text-center text-lg text-ink italic lg:px-8 lg:py-20">
        {children}
      </p>
    </div>
  );
}
