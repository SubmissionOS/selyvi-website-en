/**
 * Sektion 5 – Der Datenschutz-Grundsatz. Vertrauens-Kern dieser Seite.
 *
 * ==========================================================================
 * ABWEICHUNG VOM PROMPT – BEWUSST UND GEPRUEFT.
 * ==========================================================================
 * Vorgegeben war der Satz „Zwei davon sind gebaut, die Prüfung läuft.“
 * Der Prompt hat ausdruecklich um Gegenpruefung gebeten. Sie faellt negativ
 * aus – „zwei gebaut“ ist durch docs/produktstand-2026-08.md nicht gedeckt:
 *
 *   1. Erhebungsmodell dokumentiert    -> GEDECKT. Der Produktstand fuehrt ein
 *      vollstaendiges Erhebungsmodell samt Codebuch und Mindestfallzahlen auf;
 *      der „Wirkungsbericht je Schule“ mit Modellversion, Annahmeketten und
 *      offenen Methodenluecken ist als Live gefuehrt.
 *   2. Aggregation statt Rohdaten      -> NICHT GEDECKT als gebaute Funktion.
 *      Die Mindestfallzahl ist als REGEL im Modell festgelegt, und die
 *      Wirkungszeile wendet sie im Produkt an. Der „Forschungsdaten-Export mit
 *      k-Anonymitaet“ – also die Mechanik, die Forschenden aggregierte Daten
 *      herausgeben wuerde – steht dort woertlich als „Nicht gebaut“.
 *   3. Gepruefte Einwilligungen      -> AUSDRUECKLICH NICHT. Der Produktstand
 *      sagt: „solange die Einwilligungstexte nicht juristisch geprueft sind“.
 *
 * Es steht also EINES von drei Dingen, nicht zwei. Der Text unten sagt das –
 * und benennt zusaetzlich, dass die Sperre technisch ist und nicht nur eine
 * fehlende Funktion. Fuer die Zielgruppe dieser Seite ist die schwaechere
 * Aussage die glaubwuerdigere: Wer beruflich Forschungsantraege schreibt,
 * prueft genau solche Saetze nach.
 */
export function ResearchAccessBand() {
  return (
    <section
      aria-labelledby="forschungszugang-titel"
      className="border-b border-gray-200 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <h2
            id="forschungszugang-titel"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            How we handle research data
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            We only release data once three things are in place: legally reviewed consent
            from those involved, granular by purpose – aggregation with minimum case
            counts instead of raw data – and a documented survey model.
          </p>

          <p className="mt-4 text-lg text-gray-500">
            The survey model is documented, the minimum case counts are laid down in it,
            and the impact line in the product already works to them.
          </p>

          <p className="mt-6 text-lg text-ink">
            This order is slower. It is also the reason you can do research with us with
            a clear conscience.
          </p>
        </div>
      </div>
    </section>
  );
}
