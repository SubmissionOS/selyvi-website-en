/**
 * Sektion 3 – Auftragsverarbeiter.
 *
 * Die Tabelle stand hier mit Kopfzeile, aber ohne Zeilen – eine Struktur, die
 * eine Liste verspricht, die es noch nicht gibt. Sie ist durch einen Satz
 * ersetzt, der genau das sagt, was stimmt: dass die Liste kommt.
 *
 * KEINE Namen eintragen, bevor die Liste bestaetigt ist – auch keine
 * „wahrscheinlichen“. Eine Subprozessoren-Liste ist eine Rechtsauskunft nach
 * Art. 28 Abs. 2 DSGVO (Article 28(2) GDPR); ein falscher Eintrag ist
 * schlimmer als ein fehlender,
 * weil Schulen ihre eigenen Verzeichnisse darauf aufbauen.
 *
 * Sobald die Liste steht, gehoert hier wieder eine Tabelle her – siehe README,
 * NACH-LAUNCH-LISTE.
 */
export function SubprocessorsTable() {
  return (
    <section
      aria-labelledby="dienstleister-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="dienstleister-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Our service providers (processors)
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          We use service providers that process personal data on our behalf. We publish
          the full list of our processors here.
        </p>
      </div>
    </section>
  );
}
