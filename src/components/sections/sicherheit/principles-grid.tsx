import {
  Accessibility,
  Ban,
  Cpu,
  FileText,
  KeyRound,
  Lock,
  Server,
  Trash2,
  UserX,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { PRODUCT_NAME } from "@/config/brand";
import {
  DATA_SEPARATION_NOTE,
  PRODUCT_HOSTING_NOTE,
  WEBSITE_HOSTING_NOTE,
} from "@/config/product";

/**
 * Sektion 2 – Prinzipien-Grid.
 *
 * Jede Karte sagt nur, was HEUTE stimmt. Wo eine Zusage noch nicht gedeckt war,
 * steht jetzt entweder die abgeschwächte Tatsache oder eine Ankündigung mit
 * Zeitpunkt – keine Zusicherung ohne Grundlage.
 *
 * Besonders die Karte „AI processing“: Dort steht ABSICHTLICH keine Zusage,
 * dass Daten nicht fuer Training verwendet werden. Solche Zusicherungen haengen
 * an den Vertraegen mit den Modell-Anbietern. Eine Aussage dazu darf hier erst
 * stehen, wenn sie vertraglich belegt ist – genau danach fragt jede
 * Datenschutzbeauftragte zuerst, und eine ungedeckte Zusage an dieser Stelle
 * beendet die Pruefung.
 *
 * Was noch aussteht, steht im README unter NACH-LAUNCH-LISTE, nicht auf der
 * Seite.
 */
const principles = [
  {
    icon: Server,
    title: "Hosting of this website",
    // Belegt: die Serverregion fra1 steht in vercel.json.
    description: WEBSITE_HOSTING_NOTE,
  },
  {
    icon: FileText,
    title: "Hosting of the application",
    // GETRENNT von der Karte darueber, und das ist der Punkt: Die Anwendung
    // laeuft heute NICHT in Deutschland. Eine gemeinsame Karte „EU-Hosting"
    // stand hier bis zum Abgleich mit dem Produktstand und gab damit fuer das
    // Produkt eine Zusage, die es nicht gibt.
    description: PRODUCT_HOSTING_NOTE,
  },
  {
    icon: Lock,
    title: "Encryption",
    // Auf die belegbare Aussage gekuerzt: TLS ist gesetzt. Zur Verschluesselung
    // ruhender Daten wird bewusst nichts behauptet.
    description: "Transmission is encrypted throughout (TLS).",
  },
  {
    icon: KeyRound,
    title: "Strict data separation",
    // Ersetzt die fruehere Ankuendigungs-Karte „Rollen & Rechte". Das Modell
    // steht – und zwar restriktiver, als eine Schule erwartet.
    description: `${DATA_SEPARATION_NOTE} There is no role with an overall view of several teachers' data.`,
  },
  {
    icon: Ban,
    /**
     * Titel ohne „Keine". Das Wort waere schlicht falsch: Selyvi gibt sehr
     * wohl Daten weiter – an Auftragsverarbeiter, an das Mailprogramm der
     * Lehrkraft. Tabu ist der Verkauf und die Werbenutzung von SCHUELERdaten,
     * und genau das sagt der Kartentext.
     *
     * Die Verneinung traegt stattdessen das durchgestrichene Symbol – und
     * weil es damit Bedeutung traegt, ist es hier NICHT aria-hidden, sondern
     * bekommt ein eigenes Label. Ein Symbol, das etwas aussagt und fuer
     * Screenreader unsichtbar ist, sagt es nur der Haelfte der Leute.
     */
    iconLabel: "no selling of pupil data",
    title: "Sharing of data",
    description:
      "Pupil data is not sold and is not processed for advertising purposes.",
  },
  {
    icon: UserX,
    title: "No parent or pupil access",
    description: `${PRODUCT_NAME} is a tool for teachers and school leadership. There are deliberately no accounts for parents or children.`,
  },
  {
    icon: Cpu,
    title: "AI processing",
    description: `${PRODUCT_NAME} uses AI models to generate texts and teaching materials from a teacher's observations. We publish the precise processing details of our AI components at this point.`,
  },
  {
    icon: Accessibility,
    title: "Accessibility as practice",
    /**
     * BEWUSST OHNE ZERTIFIKATS-BEHAUPTUNG.
     *
     * Der Satz sagt, WIE gebaut wird – nicht, dass ein Prüfsiegel vorliegt.
     * „WCAG 2.1 AA" bezieht sich hier ausdruecklich auf die Kontraste, und
     * die sind gemessen: axe meldet ueber alle Seiten null Verstoesse, und
     * jeder neue Textton wird gegen den tatsaechlich gerenderten Hintergrund
     * nachgerechnet.
     *
     * Eine formale Erklaerung nach BFSG bzw. BITV ist etwas anderes und steht
     * als Punkt 18 in der NACH-LAUNCH-LISTE der README. Wer diesen Text
     * spaeter verschaerfen moechte, braucht vorher diese Erklaerung.
     */
    description:
      "Keyboard operation, screen reader structure, contrasts to WCAG 2.1 AA and respected motion reduction are build standards here, not retrofits.",
  },
  {
    icon: Trash2,
    title: "Deletion policy",
    description: "We publish retention and deletion periods at this point.",
  },
];

export function PrinciplesGrid() {
  return (
    <section aria-labelledby="prinzipien-titel" className="border-b border-gray-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <h2
          id="prinzipien-titel"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Our principles
        </h2>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, position) => {
            const Icon = principle.icon;

            return (
              <li
                key={principle.title}
                /* Neun Karten in ZWEI Spalten ergeben 2+2+2+2+1 – die letzte
                 steht allein und liest sich wie vergessen. Sie nimmt dort
                 deshalb beide Spalten ein. Bei drei Spalten (ab lg) geht die
                 Rechnung ohnehin auf, da gilt wieder eine Spalte. */
                className={cn(
                  "rounded-xl border border-gray-200 bg-surface p-6",
                  position === principles.length - 1 && "md:col-span-2 lg:col-span-1",
                )}
              >
                {/* Die Symbole sind sonst reine Dekoration und deshalb
                    aria-hidden. Genau eines traegt Bedeutung – das
                    durchgestrichene bei „Sharing of data", weil dort die
                    Verneinung im Symbol steckt und nicht mehr im Titel.
                    Dieses eine bekommt ein Label. */}
                {principle.iconLabel ? (
                  <Icon
                    role="img"
                    aria-label={principle.iconLabel}
                    className="size-6 text-brand-600"
                  />
                ) : (
                  <Icon aria-hidden="true" className="size-6 text-brand-600" />
                )}

                <h3 className="mt-5 text-base font-semibold text-ink">
                  {principle.title}
                </h3>

                <p className="mt-3 text-sm text-gray-500">{principle.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
