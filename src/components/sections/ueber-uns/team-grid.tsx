import { team } from "@/config/team";

/**
 * Sektion 3 – Team.
 *
 * Avatare sind Initialen auf brand-100, KEINE Stockfotos. Ein Stockfoto an
 * einer Stelle, an der eine reale Person steht, ist eine kleine Luege – und
 * ausgerechnet auf der Seite, die Vertrauen herstellen soll.
 *
 * Der Kreis ist dekorativ (aria-hidden): Der Name steht direkt daneben, eine
 * Vorlesung der Initialen waere reine Wiederholung.
 *
 * Die Personendaten liegen in src/config/team.ts. Alle drei Freigaben liegen
 * vor; offen ist je Person nur noch der Beschreibungssatz.
 */
export function TeamGrid() {
  return (
    <section aria-labelledby="team-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="team-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          The team
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          What you see here are initials, not stock photos.
        </p>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <li
              key={member.name}
              className="rounded-xl border border-gray-200 bg-surface p-6"
            >
              <span
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-800"
              >
                {member.initials}
              </span>

              <h3 className="mt-5 text-base font-semibold text-ink">{member.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{member.role}</p>

              {member.description ? (
                <p className="mt-4 text-sm text-gray-500">{member.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
