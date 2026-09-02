/**
 * Sektion – Einführungs-Ablauf als Timeline.
 *
 * KEINE Zeitangaben. Weder Wochen noch Monate noch „typischerweise“ – der
 * Prozess wird gerade erst mit den ersten Pilotschulen gestaltet.
 *
 * Der Ablauf ist so konkret, wie er heute wirklich ist, und das heisst an drei
 * Stellen: unbequemer, als eine Marketingseite ihn beschreiben wuerde.
 *
 *   - Schritt 2: Es gibt keine Selbstregistrierung. Konten legt ausschliesslich
 *     die Schulleitung an.
 *   - Schritt 3: Klassen und Kinder werden ANGELEGT, nicht importiert. Fuer
 *     eine grosse Schule ist das ein spuerbarer Startaufwand. Wer das erst in
 *     der Einfuehrungswoche erfaehrt, erlebt es als Wortbruch.
 *   - Schritt 4: Es gibt keine Einfuehrungstour im Produkt. Den Einstieg
 *     begleiten wir persoenlich – nicht als Serviceversprechen, sondern weil
 *     es ohne nicht ginge.
 */
const steps = [
  {
    title: "First conversation and demo",
    description:
      "We show you the real interface and work out what your school needs. Then you decide whether a pilot makes sense.",
  },
  {
    title: "School leadership sets up the accounts",
    description:
      "There is deliberately no self-registration. School leadership creates the accounts and can reset passwords at any time — so a pilot begins with a conversation, never with a sign-up link.",
  },
  {
    title: "Setting up the classes together",
    description: "We set up classes and children together with you.",
  },
  {
    title: "A personal walkthrough",
    description:
      "There is no onboarding tour inside the product. We walk through the start in person, with the teachers who are beginning.",
  },
  {
    title: "Roll-out across the staff",
    description:
      "After the pilot, Selyvi goes to the whole teaching staff.",
  },
];

export function RolloutTimeline() {
  return (
    <section
      aria-labelledby="ablauf-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="ablauf-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          How a rollout actually runs
        </h2>

        <ol className="mt-14 max-w-3xl">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-6 pb-12 last:pb-0">
              {/* Verbindungslinie zwischen den Schritten, rein dekorativ. */}
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-9 bottom-0 left-[1.125rem] w-px -translate-x-1/2 bg-gray-200"
                />
              ) : null}

              <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                {index + 1}
              </span>

              <div className="pt-1">
                <h3 className="text-lg font-semibold text-ink">{step.title}</h3>

                <p className="mt-3 text-gray-500">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
