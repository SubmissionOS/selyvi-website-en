/**
 * DIE DEUTSCH-MUSTER – EINE QUELLE FÜR ALLE PRÜFUNGEN.
 *
 * ==========================================================================
 * WARUM DAS EIN EIGENES MODUL IST
 * ==========================================================================
 * Zwei Skripte prüfen auf Deutsch:
 *
 *   scripts/german-check.mjs     das ausgelieferte HTML jeder Seite
 *   scripts/animation-check.mjs  die Zustände, die erst durch Zeit oder
 *                                Klicks entstehen – Animationsschritte und
 *                                der bedienbare Einblick auf /preview
 *
 * Beide müssen DIESELBEN Muster verwenden. Eine Kopie wäre genau die Stelle,
 * an der eine ergänzte Wortliste im einen Skript wirkt und im anderen nicht –
 * und dann meldet eines der beiden 0, ohne dass die 0 etwas bedeutet.
 *
 * Dieselbe Überlegung steht in scripts/smoke-test.mjs über RULES: Eine
 * Prüfung, deren Muster sich unbemerkt auseinanderentwickeln, prüft nichts.
 */

/**
 * Eigennamen. ABSCHLIESSEND – wer hier etwas ergaenzt, begruendet es hier.
 * Alles andere, was deutsch bleiben MUSS, gehoert in ein lang-Attribut.
 *
 *   - Selyvi                  Produktname
 *   - Waldstetten             Ort im Impressum
 *   - Robert Bosch Stiftung   Herausgeberin der Schulbarometer-Zahlen
 */
export const EIGENNAMEN = ["Selyvi", "Waldstetten", "Robert Bosch Stiftung"];

/**
 * Haeufige deutsche Woerter. Als GANZE Woerter geprueft (\b…\b), damit „die"
 * nicht in „diet" anschlaegt.
 *
 * Bewusst NICHT in der Liste, obwohl deutsch: „in", „so", „was", „man", „an",
 * „am", „um", „bin", „hat", „will", „fast", „gift", „hell", „rot" – das sind
 * alles englische Woerter oder Wortteile.
 */
export const WOERTER = [
  "der","die","das","dem","den","des","ein","eine","einen","einem","einer","eines",
  "und","oder","aber","nicht","kein","keine","keinen","keiner","nichts",
  "ist","sind","waren","wird","werden","wurde","wurden","haben","hatte","hatten",
  "sein","seine","ihre","ihren","ihrem","unser","unsere","unseren",
  "mit","von","vom","aus","auf","bei","beim","zum","zur","nach","vor","ueber","unter",
  "durch","gegen","ohne","seit","bis","zwischen",
  "sich","sie","ihnen","wir","uns","euch","dich",
  "auch","noch","schon","nur","sehr","mehr","immer","wieder","dann","wenn","weil",
  "damit","dass","als","wie","wo","warum","wer","welche","welcher",
  "jede","jeder","jedes","alle","allen","viele","wenig","genau","bereits","statt",
  "Lehrkraft","Lehrkraefte","Schule","Schulen","Schulleitung","Kollegium","Klasse",
  "Unterricht","Beobachtung","Beobachtungen","Zeugnis","Zeugnisse","Eltern",
  "Elternmail","Stunden","Woche","Monat","Jahr","Kinder","Schueler",
  "Datenschutz","Sicherheit","Anfrage","Kennenlernen","Einblick","Mitgestalten",
  "Impressum","Datenschutzerklaerung","Startseite","Seite","Bericht","Entwurf",
  "Sprache","Quelle","Quellen","Thema","Fach","Faecher","Vorschlag",
  "Antwort","Frage","Fragen","Hinweis","Beispiel","Beispieldaten","Ausschnitt",
  "gesperrt","offen","erfunden","gespeichert","abgesendet","Pflichtfeld",
  // Oberflaechen-Beschriftungen der nachgebauten Anwendung. Sie tragen keine
  // Umlaute und wuerden sonst durchrutschen – genau hier ist im ersten
  // Durchlauf „Alle Klassen" haengen geblieben.
  "Meine","Alle","Neu","Klassen","Dokumente","Stundenplan","Sitzplan",
  "Bearbeiten","Speichern","Heute","Leitung","Betreff","Suchen","Weiter",
  "Zeit","Stunde","Fach","Uebersicht","Entwicklung","Elternpost",
  // Szenen-Beschriftungen und Zeit-Kicker. Sie erscheinen erst im Lauf einer
  // Animation, standen deshalb lange in keiner Pruefung – und genau dafuer
  // gibt es scripts/animation-check.mjs.
  "Diktat","Diktieren","Uebernommen","Erzeugen","Auswaehlen","Vormonat",
  "Monatsende","Vorbereitung","Tafel","Fundstellen","Fachkorpus","Zielsprachen",
  "Mikrofon","Gruessen","Anrede","Signatur","Woerter","Verteilung","Rangliste",
];

/*
 * ==========================================================================
 * BEWUSST NICHT IN DER LISTE, obwohl deutsch
 * ==========================================================================
 * „war"       – zugleich ein englisches Wort. Ein Fehlalarm auf einer
 *               Pruefung, die 0 melden MUSS, kostet mehr als der eine Fall,
 *               den es faengt. „waren" steht dafuer drin.
 * „Material"  – in beiden Sprachen dasselbe Wort. Es kann per Bauart nichts
 *               unterscheiden und waere reines Fehlalarm-Risiko: Die Seite
 *               sagt „teaching materials", und ein Satz mit dem Singular
 *               haette den Lauf grundlos rot gemacht. Der Bereich heisst auf
 *               der Oberflaeche ohnehin „Materials" – ein deutsches
 *               „Material" dort faellt ueber die Nachbarwoerter auf.
 */

export const WORT_MUSTER = new RegExp(`\\b(${WOERTER.join("|")})\\b`, "i");
export const UMLAUT_MUSTER = /[äöüÄÖÜß]/;

/** Entfernt die erlaubten Eigennamen, bevor die Muster laufen. */
export function ohneEigennamen(text) {
  let rest = text;
  for (const name of EIGENNAMEN) rest = rest.split(name).join(" ");
  return rest;
}

/**
 * Prüft einen Text und gibt die Fundstellen zurück.
 *
 * Zeilenweise, nicht am Stück: Eine Meldung „hier steht Deutsch" hilft
 * niemandem beim Suchen. Der Bericht nennt die Fundstelle.
 *
 * @param {string} text  bereits von Tags befreiter Text
 * @returns {{grund: string, text: string}[]}
 */
export function findeDeutsch(text) {
  const sauber = ohneEigennamen(text);

  const zeilen = sauber
    .split(/\n|(?<=[.!?])\s{2,}/)
    .map((z) => z.replace(/\s+/g, " ").trim())
    .filter((z) => z.length > 0);

  const treffer = [];
  for (const zeile of zeilen) {
    const umlaut = zeile.match(UMLAUT_MUSTER);
    const wort = zeile.match(WORT_MUSTER);
    if (!umlaut && !wort) continue;

    treffer.push({
      grund: umlaut ? `Umlaut/ß „${umlaut[0]}"` : `deutsches Wort „${wort[0]}"`,
      text: zeile.length > 120 ? zeile.slice(0, 117) + "…" : zeile,
    });
  }
  return treffer;
}
