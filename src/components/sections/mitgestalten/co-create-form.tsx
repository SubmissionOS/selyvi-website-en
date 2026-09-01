import { DemoForm } from "@/components/sections/demo/demo-form";

/**
 * Sektion 4 – Das Formular.
 *
 * Bewusst DIESELBE Komponente und DIESELBE Server Action wie auf /meet, nur
 * mit `source="mitgestalten"`. Ein eigener Endpunkt waere ein zweiter Ort,
 * an dem Honeypot, Zeitmessung, Rate-Limit oder Validierung fehlen koennen –
 * und genau diese vier Huerden sind der Grund, warum das Formular bisher
 * nicht zugespammt wird.
 *
 * Die Herkunft steht als verstecktes Feld im Formular, wird serverseitig
 * gegen eine Liste geprueft und landet in Betreff und Mailtext. Damit ist
 * beim Lesen klar, worauf jemand geantwortet hat: Eine Demo-Anfrage und eine
 * Anfrage zum Mitgestalten brauchen unterschiedliche Antworten.
 *
 * Die Ueberschrift ist hier SICHTBAR statt sr-only wie auf /meet: Dort steht
 * das Formular neben einem Ablaufplan und braucht keine eigene Ansage, hier
 * ist es der Abschluss der Seite.
 */
export function CoCreateForm() {
  return (
    <section
      aria-labelledby="mitgestalten-formular-titel"
      className="border-t border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2
            id="mitgestalten-formular-titel"
            className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            I would like to co-create
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            Write to us briefly about what you teach and what you are hoping for. We
            reply on working days – and say plainly whether it fits right now.
          </p>

          <div className="mt-12">
            <DemoForm source="mitgestalten" />
          </div>
        </div>
      </div>
    </section>
  );
}
