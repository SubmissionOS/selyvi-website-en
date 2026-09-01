import { StoryStations } from "@/components/sections/ueber-uns/story-stations";
import { PRODUCT_NAME } from "@/config/brand";

/**
 * Sektion „Warum es … gibt“ – zwischen Intro und Mission.
 *
 * Sprungziel des Herkunfts-Links im Hero der Startseite (id="why").
 *
 * Bewusst ruhiger Lesetext, keine Karten: Das hier ist der einzige Abschnitt
 * der Website, der erzaehlt statt aufzuzaehlen. `max-w-[34rem]` haelt die
 * Zeilenlaenge bei rund 65 Zeichen – die Spanne, in der laengerer Fliesstext
 * noch gut lesbar bleibt.
 *
 * ACHTUNG, KOPPLUNG ZU PRACTICE_CLAIM:
 * Der zweite Absatz enthaelt die Praxis-Aussage ein zweites Mal – als Nebensatz
 * im Fliesstext („together with teachers across Germany – from primary through
 * to upper secondary“). Sie laesst sich hier nicht durch die
 * Konstante ersetzen, weil PRACTICE_CLAIM ein eigenstaendiger Satz ist und der
 * Erzaehlfluss sonst bricht.
 *
 * Wer PRACTICE_CLAIM in src/config/brand.ts aendert – etwa auf konkrete Zahlen –
 * MUSS diesen Absatz mit anpassen. Es ist die einzige Stelle der Website, an
 * der die Aussage nicht aus der Konstante kommt.
 *
 * NENNUNG VON PERSONEN:
 *
 * Die angehende Grundschullehrerin bleibt anonym – der Text nennt sie nur als
 * Person im engsten Umfeld des Teams. Das war ihre Entscheidung; ein Name
 * gehoert nur auf diese Seite, wenn die Person ihn selbst freigibt.
 *
 * Christian, Tobi und Rafael werden beim Vornamen genannt. Alle drei stehen in
 * src/config/team.ts auf `approved: true`, und die Zustimmung schliesst diesen
 * Text ein.
 */
export function WhyItExists() {
  return (
    <section
      id="why"
      aria-labelledby="warum-titel"
      className="border-b border-gray-200"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <h2
          id="warum-titel"
          className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Why {PRODUCT_NAME} exists
        </h2>

        {/* ==================================================================
            ZWEI SPALTEN – DIE STATIONEN BEGLEITEN DEN TEXT, STATT IHM ZU
            FOLGEN
            ==================================================================
            Vorher stand hier ein 544 px breiter Erzähltext in einem 1088 px
            breiten Container, und die Stationen-Linie kam darunter. Auf 1440
            waren das gemessen ZWEI Bildschirmhöhen reine Textwand mit leerer
            rechter Hälfte, bevor überhaupt etwas Bildliches auftauchte.

            Der frühere Kommentar an dieser Stelle argumentierte, eine Linie
            neben einer Textwand konkurriere mit ihr. Das stimmt für eine
            waagerechte Linie – die läuft quer zum Lesefluss. Die senkrechte
            Variante läuft PARALLEL dazu: Sie ordnet, was daneben erzählt
            wird, statt darum zu kämpfen.

            `lg:sticky lg:top-24`: Die Linie bleibt stehen, während der Text
            an ihr vorbeizieht – deshalb begleitet sie ihn wirklich, statt nur
            neben seinem Anfang zu stehen. top-24 = 96 px hält Abstand zur
            64 px hohen, ebenfalls klebenden Kopfzeile.

            MOBIL UNVERÄNDERT: Ein Grid ohne lg-Spalten stapelt in
            DOM-Reihenfolge – erst der Text, dann die Stationen. Sticky greift
            unterhalb von lg nicht. */}
        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-6 text-lg text-gray-500 lg:col-span-7">
            <p>
              This did not start with a business plan. It started at the kitchen table. In
              our team’s closest circle there is a trainee primary school teacher – and we
              watched from up close how many evenings go not into teaching but into
              documentation, report texts and parent post. So we started building her
              tools. Small ones first, then better ones. At some point it was clear: this
              is not one person’s problem – it is a whole profession’s problem.
            </p>

            <p>
              Those evenings turned into a system. We developed it further together with
              teachers across Germany – from primary through to upper secondary – and
              learned more from that than any textbook offers: what really helps day to
              day is decided day to day. We built {PRODUCT_NAME} for primary school first.
              The three of us – Christian, Tobi and Rafael – became a team with one simple
              test: would this really give an evening back to a teacher we know? If not,
              we do not build it.
            </p>

            <p>
              And perhaps this as well: the three of us sat in those classrooms ourselves
              for long enough. We are building this for the teachers we had back then, too.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <StoryStations variant="schmal" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
