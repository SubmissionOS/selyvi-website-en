/**
 * Sichtbarer Hinweis unter Szenen, die KENNZAHLEN zeigen.
 *
 * Warum es ihn gibt: Jede Szene traegt „Alle Daten sind erfunden“ in ihrem
 * aria-label – das hoert aber nur, wer einen Screenreader benutzt. Sehende
 * Besucher sehen einen realistisch nachgebauten Bericht mit einer konkreten
 * Stundenzahl. „Schaetzwert“ steht daneben, das betrifft aber die
 * Rechenmethode und nicht die Herkunft der Zahl.
 *
 * Deshalb NUR unter Szenen mit Kennzahlen und nicht unter allen: Eine Szene,
 * die zeigt, wie eine Beobachtung getippt wird, behauptet kein Ergebnis. Eine
 * Szene mit „138 Std.“ tut es.
 *
 * Die Zeile steht bewusst AUSSERHALB der Szenen-Komponenten. Die Szenen sind
 * gemessen stabil (Hash-Vergleich bei prefers-reduced-motion); ein Eingriff in
 * ihren Code haette diesen Nachweis entwertet.
 *
 * Mit `excerpt` kommt der Zusatz „Ausschnitt aus der Anwendung" dazu. Er
 * steht dort, wo die Szene eine lange Seitenleiste zeigt und die Frage
 * aufwirft, was die anderen Eintraege sind – die Antwort gehoert dann in
 * dieselbe Zeile und nicht in eine zweite darunter.
 *
 * aria-hidden bewusst NICHT: Der Hinweis ist redundant zum aria-label, aber
 * eine doppelte Kennzeichnung schadet niemandem – eine fehlende schon.
 */
export function SampleDataNote({ excerpt = false }: { excerpt?: boolean }) {
  return (
    <p className="mt-3 text-xs text-gray-500">
      {excerpt ? "Sample data · excerpt from the application" : "Sample data"}
    </p>
  );
}
