/**
 * Abstraktes Interface-Skelett im Browser-Rahmen.
 *
 * BEWUSST OHNE INHALT: keine erfundenen Texte, Zahlen, Namen oder Diagramme.
 * Gezeigt wird ausschliesslich die Anordnung von Flaechen – echte Screenshots
 * ersetzen diese Komponente, sobald das Produkt vorzeigbar ist.
 *
 * Als Ganzes ein Bild: role="img" plus aria-label liefern die Textalternative,
 * die Einzelbalken bleiben fuer Screenreader unsichtbar.
 */
export function InterfaceSkeleton() {
  return (
    <div
      role="img"
      aria-label="Schematic view of the application interface: sidebar with navigation, header area and content area with list entries. Without real content."
      className="overflow-hidden rounded-xl border border-gray-200 bg-surface"
    >
      {/* Browser-Leiste */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-surface-alt px-4 py-3">
        <span className="size-2.5 rounded-full bg-gray-200" />
        <span className="size-2.5 rounded-full bg-gray-200" />
        <span className="size-2.5 rounded-full bg-gray-200" />
        <div className="ml-3 h-5 flex-1 rounded-md border border-gray-200 bg-surface" />
      </div>

      <div className="flex min-h-80">
        {/* Seitenleiste */}
        <div className="hidden w-40 shrink-0 border-r border-gray-200 bg-surface-alt p-4 sm:block">
          <div className="h-3 w-20 rounded bg-brand-100" />
          <div className="mt-6 space-y-3">
            <div className="h-2.5 w-24 rounded bg-gray-200" />
            <div className="h-2.5 w-20 rounded bg-gray-200" />
            <div className="h-2.5 w-24 rounded bg-brand-100" />
            <div className="h-2.5 w-16 rounded bg-gray-200" />
            <div className="h-2.5 w-20 rounded bg-gray-200" />
          </div>
        </div>

        {/* Inhaltsbereich */}
        <div className="flex-1 p-6">
          <div className="h-3.5 w-40 rounded bg-gray-200" />
          <div className="mt-3 h-2.5 w-56 rounded bg-surface-alt" />

          <div className="mt-8 space-y-3">
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                className="flex items-center gap-4 rounded-lg border border-gray-200 p-3"
              >
                <div className="size-8 shrink-0 rounded-md bg-brand-100" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-2.5 w-2/3 rounded bg-gray-200" />
                  <div className="h-2.5 w-1/3 rounded bg-surface-alt" />
                </div>
                <div className="hidden h-6 w-16 shrink-0 rounded-md bg-surface-alt sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
