import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion 1 – Intro.
 *
 * GILT FUER DIE GANZE SEITE: Hier steht nur, was heute stimmt. Wo eine Zusage
 * noch nicht gedeckt ist, steht entweder die abgeschwaechte Tatsache oder eine
 * Ankuendigung mit Zeitpunkt. Was noch aussteht, steht im README unter
 * NACH-LAUNCH-LISTE – nicht auf der Seite.
 *
 * Der zweite Absatz benennt den Zustand der Seite ausdruecklich. Das ist
 * Absicht: Eine offen ausgewiesene Luecke kostet weniger Vertrauen als eine
 * Zusage, die im Pruefgespraech nicht haelt.
 */
export function SecurityIntro() {
  return (
    <section
      aria-labelledby="sicherheit-intro-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h1
          id="sicherheit-intro-titel"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Security and data protection at {PRODUCT_NAME}.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-500">
          We process personal data only as far as the particular function requires, and
          only for the purpose your school entrusted it to us for: providing the service.
          No processing beyond that – no analysis for our own purposes, no passing on for
          advertising.
        </p>

        <p className="mt-4 max-w-2xl text-lg text-gray-500">
          What stands here is secured contractually and technically.
        </p>
      </div>
    </section>
  );
}
