# Freigabe der englischen Fassung

**An Rafael und Christian.** Diese Liste enthält die Sätze, bei denen die
Übersetzung eine **inhaltliche Entscheidung** getroffen hat — nicht die, die
sich von selbst ergeben. Bitte je Zeile: übernehmen, ändern oder streichen.

**selyvi.com geht erst live, wenn diese Liste abgehakt ist.** Solange bleibt
das zweite Vercel-Projekt ohne Domain.

---

## Stand

**Die Seite ist vollständig übersetzt.** Es gibt keine Sprachschicht mehr und
keinen deutschen Rest: Der Deutsch-Detektor (`npm run check:german <url>`)
meldet über alle elf Seiten plus 404 **0 Fundstellen**. Gemessen gegen den
Produktionsbuild, nicht gegen den Quelltext.

Die frühere Migrationsliste („290 Fundstellen in 54 Dateien") ist damit
erledigt und unten gestrichen.

| Prüfung                                   | Ergebnis                                       |
| ----------------------------------------- | ---------------------------------------------- |
| Deutsch-Detektor                          | **0** Fundstellen, 8 übersprungene `lang`-Blöcke |
| Smoke-Test (Ton A–D, Verkaufssprache)     | **0** Treffer, 61 Muster × 9 Seiten            |
| Gegenprobe der Muster                     | **0** tote Regeln, **0** Fehlalarme            |
| Überlaufende Kästen (1440 und 390)        | **0**                                          |
| Kontrast in den App-Fenstern (WCAG 2.1 AA) | **0** Verstöße                                 |
| CLS                                       | 0,002 auf `/`, sonst 0                         |
| reduced motion                            | alle geprüften Seiten stehen still             |
| Tastatur `/preview`                       | 49 Ziele, **0** ohne Namen                     |

Offen bleibt die **Anwaltsprüfung der englischen Rechtstexte** — ohne sie geht
selyvi.com nicht live (README, NACH-LAUNCH-LISTE, Punkt E1).

---

## Erledigt — die gesetzten Entscheidungen sind angewendet

- [x] **1 · H1 der Startseite** → „Paperwork just got an assistant."
      Variante A, wie hier festgelegt. Steht in `hero.tsx`, die Begründung
      (samt der beiden verworfenen Varianten) im Kopfkommentar dort.
- [x] **2 · Primärer Handlungsaufruf** → „Meet Selyvi".
      In `primaryCta` (site.ts), also an jeder Stelle gleichzeitig. Der
      Seitentitel von /meet lautet „Meet us", damit `fullTitle()` nicht
      „Meet Selyvi – Selyvi" erzeugt. Der Absende-Knopf des Formulars heißt
      „Request a meeting" — derselbe Text auf Knopf und Navigation läse sich
      wie ein zweiter Weg zur selben Seite.
- [x] **4 · Das Versprechen** → „Selyvi suggests. You decide."
      In `DECISION_PROMISE`. Das Manifest auf /our-story hängt „Always." an,
      das Prinzip-Band auf /for-teachers nicht — dort ist der Satz eine
      Überschrift, hier ein Schwur.
- [x] **5 · Die Mission** → „We build the assistant that takes on the routine
      work. The teaching judgement stays with the person." In
      `MISSION_PROMISE`.
- [x] **6 · Die Praxis-Aussage** → „Built together with teachers across
      Germany." „across Germany" steht drin und ist im Quelltext als Pflicht
      markiert.
- [x] **7 · Die Schulform-Antwort** → „from primary through to upper
      secondary". „upper secondary" wie festgelegt; „years 1 to 4 (grades 1 to
      4)" beim ersten Vorkommen einer Seite, danach nur „years".
- [x] **9 · Navigation der nachgebauten Anwendung** → Weg 1, übersetzt.
      Today · My classes · Live lesson · Timeline · Review · Support plans ·
      Materials · Class analysis. Die Liste steht an zwei Stellen
      (`DEMO_NAV_TEACHER`, `ENTRIES` in tour-sidebar.tsx); beide Kommentare
      verweisen auf diesen Punkt.
      **Der Satz fürs Verkaufsgespräch fehlt noch** — er steht als E4 in der
      NACH-LAUNCH-LISTE, nicht auf der Website.
- [x] **10 · Schulbarometer-Band** → übersetzt, mit „German teachers"
      **zweimal**: in der ersten Aussage („83% of German teachers enjoy doing
      their job.") und in der Quellenzeile („surveys of German teachers, 2022
      and 2026"). Zweimal, weil die drei Zahlen einzeln in Screenshots und
      Präsentationen wandern und dann jede für sich tragen muss.
      Der Studienname steht englisch als „German School Barometer" — so nennt
      ihn die Robert Bosch Stiftung in eigenen englischen Veröffentlichungen.
      Der Link zeigt unverändert auf die deutsche Projektseite.
- [x] **11 · Rechtstexte** → gebaut. /legal-notice und /privacy stehen,
      Pflichtangaben identisch, `noindex` und Prüfungs-Zeile auf /privacy
      unverändert. Beide tragen sichtbar „German law applies; this is a
      translation of the German legal notice / privacy policy."
      **Die anwaltliche Prüfung steht aus** (E1).

---

## Offen — bitte entscheiden

### 3 · Die Wirkungszeile

**Deutsch:** „Jeder Entlastungsbericht trägt direkt unter den Zahlen eine
Einordnung: Gemessenes steht als Messwert, Geschätztes als Schätzwert – und
keine dieser Kennzeichnungen lässt sich ausblenden, auch von uns nicht."

|                    | Fassung                                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vorschlag (im Code)** | „Every workload relief report carries a note directly beneath the figures: **measured values are labelled as measured, estimates as estimates** — and neither label can be switched off, not even by us."       |
| Alternative        | „… **measured values are labelled as a measured value, estimates as an estimate** — …"                                                                                                                              |

Das Deutsche spielt mit „Messwert / Schätzwert" als **Substantiven**. Dieses
knappe Paar gibt es im Englischen nicht; der Vorschlag löst es über das Verb.
**Die Frage ist, ob das für eine Forscherin präzise genug ist.** Die
Alternative ist eindeutiger und schwerfälliger.

Der Satz steht in `IMPACT_LINE_PRINCIPLE` und erscheint auf /research (als
Zitat-Band) und /for-school-leadership — eine Änderung wirkt auf beiden Seiten
gleichzeitig.

### 8 · Der Serverstandort

**Im Code steht die Fassung aus der letzten Runde, unverändert:**

> „Before we work with real pupil data, the product servers move to Germany and
> every school has a data processing agreement in place — both are in
> preparation."

**Alternative:** „**Before we operate with** real pupil data, …"

Das Deutsche sagt „Vor dem **Betrieb** mit echten Schülerdaten". „work with"
ist weicher als „operate with". **Rechtlich erhebliche Zeile** — sie wurde
bewusst NICHT eigenmächtig geändert, weil sie hier zur Freigabe vorliegt.

Sie ist die einzige erlaubte Einschränkung der ganzen Website und steht
wortgleich in der Ausnahmeliste des Smoke-Tests (Regel D, „in preparation").
Wer den Wortlaut ändert, ändert ihn in `product.ts` **und** in
`scripts/smoke-test.mjs`.

### N1 · Die Manifest-Schwüre (/our-story)

Fünf Sätze, untereinander, ohne Karten und ohne Icons. Der erste kommt aus
`DECISION_PROMISE` und ist gesetzt (Punkt 4); die übrigen vier sind neu
übersetzt.

| Deutsch                                                                                                | **Vorschlag (im Code)**                                                                                       | Alternative                                                                                     |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| „Selyvi schlägt vor. Sie entscheiden. **Immer.**"                                                      | „Selyvi suggests. You decide. **Always.**"                                                                    | — (gesetzt)                                                                                     |
| „Nutzung zeigen wir als Verteilung – nie als Rangliste. **Niemand wird vorgeführt.**"                   | „We show usage as a distribution – never as a ranking. **Nobody is put on the spot.**"                        | „… **Nobody is singled out.**" — kühler, dafür eindeutiger                                      |
| „Offene Punkte **kennzeichnen** wir, statt sie zu überspielen."                                        | „Open points we **mark**, instead of glossing over them."                                                     | „We **flag** open points instead of glossing over them." — flüssiger, verliert die Voranstellung |
| „**Beispieldaten heißen bei uns Beispieldaten.**"                                                      | „**Sample data is called sample data here.**"                                                                 | „**We call sample data what it is: sample data.**" — deutlicher, länger                          |
| „Kein Kind wird **bloßgestellt** – nicht in der Software, nicht in unserem Marketing, auch kein erfundenes." | „No child is **exposed** – not in the software, not in our marketing, not even an invented one."         | „No child is **held up as an example** – …" — näher am Deutschen, sperriger                     |

**Empfehlung: Vorschlagsspalte.** Sie hält die Kürze, von der die Sektion lebt
— fünf Sätze ohne Gestaltung tragen nur, wenn jeder einzeln steht.

### N2 · Die drei Erzähl-Zeilen (Startseite)

Der empfindlichste Text der Website: kursiv, mittig, zwischen den Sektionen.
Sie behaupten nichts und nennen keine Funktion — sie leben von Rhythmus.

| # | Deutsch                                                                                                                                            | **Vorschlag (im Code)**                                                                                                                       | Alternative                                                                    |
| - | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1 | „Wir kennen diese Abende nicht aus einem Marktreport. Wir kennen sie vom Küchentisch – von einer angehenden Grundschullehrerin, die uns gezeigt hat, wo die Zeit wirklich bleibt." | „We do not know those evenings from a market report. We know them from the kitchen table – from a trainee primary school teacher who showed us where the time actually goes." | „… **where the time really goes.**" — wärmer, minimal weniger präzise           |
| 2 | „Alles hier drin geht auf einen Hinweis aus einem echten Lehrerzimmer zurück. Manches haben wir gebaut, weil eine einzige Lehrkraft nicht lockergelassen hat." | „Everything in here goes back to a remark from a real staffroom. Some of it we built because one single teacher would not let it go."          | „… **because one teacher kept asking.**" — freundlicher, verliert die Hartnäckigkeit |
| 3 | „Wir waren selbst lange genug Schüler. Jetzt bauen wir für die Menschen, die damals für uns dageblieben sind."                                      | „We were pupils ourselves for long enough. Now we build for the people who **stayed late** for us back then."                                  | „… who **stayed behind** for us back then." — wörtlicher, im Englischen mehrdeutig |

**Zu Zeile 3:** „dageblieben" meint die Lehrkraft, die nach der Stunde noch da
war. „stayed behind" heißt im Englischen auch „zurückgeblieben" — deshalb
„stayed late". Das ist die einzige der drei Zeilen, bei der die wörtliche
Übersetzung schadet.

**Empfehlung: Vorschlagsspalte.**

### N3 · Die Elternpost zeigt drei Sprachen statt vier

Die deutsche Fassung schaltet zwischen **DE, EN, TR, AR**. Auf selyvi.com ist
die gezeigte Oberfläche englisch (Punkt 9) — die Ausgangssprache der Mail ist
damit EN, und übrig bleiben **EN, TR, AR**.

**Vorschlag: bei drei bleiben.** Eine ukrainische oder polnische Zeile müsste
jemand gegenlesen, und ein Fehler darin fiele ausgerechnet der Zielgruppe auf.
Drei belegte Sprachen sind mehr wert als vier, von denen eine ungeprüft ist.

**Alternative:** eine vierte Sprache ergänzen, sobald jemand sie gegenliest
(steht als E6 in der NACH-LAUNCH-LISTE).

Die Auswahlliste im Produkt nennt weiterhin **neun** Zielsprachen; die Zahl
kommt aus `TRANSLATION_LANGUAGE_COUNT` und nicht aus dieser Anzeige.

### N4 · „Sachunterricht" heißt „General studies"

Kein deutsches Schulfach hat eine saubere englische Entsprechung.
„General studies" ist die neutrale Beschreibung; „science and social studies"
wäre genauer und passt in keine Karte.

**Vorschlag: General studies.** **Alternative:** „Science & society".
Betrifft die Demo-Daten, nicht den Fließtext — der Begriff steht nur in den
nachgebauten Fenstern.

### N5 · „Deutsch" als Unterrichtsfach bleibt „German"

`DEMO_SUBJECT = "German"`. Das Fach ist der Deutschunterricht einer deutschen
Grundschule. Es zum Englischunterricht zu machen, weil die Website englisch
ist, wäre eine Aussage über ein Schulsystem, in dem das Produkt nicht läuft.

**Keine Alternative vorgesehen** — hier steht nur, dass die Entscheidung
bewusst getroffen wurde.

---

## Was nebenbei aufgefallen ist

**Die deutsche Seite sagt an einer Stelle „Drei Bereiche sind offen", an zwei
anderen „vier".** Offen sind vier (`workspace.tsx`: My classes, Live lesson,
Materials, Timeline). Die englische Fassung sagt durchgehend vier; auf
selyvi.de gehört `take-a-look.tsx` nachgezogen (E7).

---

## Übersetzungsentscheidungen, die keine Freigabe brauchen

Sie stehen hier, damit niemand sie für Zufall hält:

- **og:locale = `en_GB`**, nicht `en_US`. Open Graph kennt kein neutrales
  Englisch; von den beiden verfügbaren Codes liegt en_GB näher an dem, was auf
  der Seite steht (britische Rechtschreibung, und das Glossar verbietet genau
  die US-Begriffe). Begründung im Quelltext von `seo.ts`.
- **Die Quell-Werte des Formulars bleiben deutsch** (`demo`, `mitgestalten`).
  Das CRM sortiert danach ein. Übersetzt ist nur die Beschriftung in der
  Betreffzeile („Demo request", „Co-create"), und die liest ein Mensch.
- **Der CRM-Payload trägt zusätzlich `locale: "en"`.** Ein zusätzliches Feld,
  die Pflichtfelder sind unverändert.
- **Die Betreffzeile trägt „(EN)".** Beide Websites schreiben in dasselbe
  Postfach; wer antwortet, muss die Sprache vor dem Öffnen sehen.
- **Deutsche Anschriften tragen `lang="de"`** — Hauptstraße 33, die
  Brevo-Anschrift, der Name der Aufsichtsbehörde. Übersetzt wären sie nicht
  mehr auffindbar, und eine Aufsichtsbehörde muss man anschreiben können. Das
  ist WCAG 3.1.2 und zugleich die Marke, an der der Deutsch-Detektor sie
  überspringt.
- **Datumsformat `12 May`**, Prozent ohne Leerzeichen (`83%`) — Glossar,
  Abschnitt „Sprache und Zahlen".
- **Stundenplan-Spalten heißen `P1` bis `P4`, nicht `Period 1`.** In der
  Kopfspalte eines Fünf-Spalten-Rasters bleiben bei 390 px rund 40 px; die
  Langform bricht dort um. Die Langform steht im `aria-label` der Zelle.
