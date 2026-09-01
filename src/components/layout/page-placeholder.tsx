/**
 * Platzhalter-Rumpf fuer noch nicht ausgearbeitete Routen.
 * Liefert die H1 und viel Weissraum, damit das Grundgeruest sichtbar ist,
 * ohne bereits Inhalte vorwegzunehmen.
 */
export function PagePlaceholder({
  title,
  eyebrow = "Placeholder",
  description = "Content to come.",
}: {
  title: string;
  eyebrow?: string;
  description?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
      <p className="text-sm font-medium text-brand-600">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-gray-500">{description}</p>
    </section>
  );
}
