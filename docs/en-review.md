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
- [x] **11 · Rechtstexte** → gebaut, aber ANDERS als hier vorgeschlagen.

      Der Vorschlag lautete „Impressum → Legal notice, nur die Beschriftungen
      englisch". Genau das stand eine Runde lang so da und ist
      **zurückgenommen**: Das Impressum ist wieder deutsch, wortgleich mit
      selyvi.de, unter /impressum. /legal-notice leitet mit 308 dorthin.

      Der Grund ist nicht Bequemlichkeit. Die Pflichtangaben nach § 5 DDG und
      § 18 Abs. 2 MStV sind die Angaben eines deutschen Unternehmens und
      gelten im deutschen Wortlaut. Eine englische Haftungsklausel daneben ist
      keine Serviceleistung, sondern eine zweite Fassung derselben Aussage —
      und im Zweifel die, auf die sich jemand beruft.

      Übrig bleibt genau EIN englischer Satz, ganz oben:
      „This legal notice is provided in German, as required by German law."

      **/privacy bleibt englisch**, mit `noindex` und Prüfungs-Zeile. Sie
      beschreibt, was diese Website mit den Daten ihrer Besucherinnen tut —
      eine Auskunft an die Leserin, keine Pflichtangabe gegenüber einer
      Behörde. **Die anwaltliche Prüfung steht aus** (E1).

---

## Entschieden in dieser Runde

Alle vier offenen Sprachfragen sind beantwortet. Die Entscheidungen sind im
Code, nicht nur hier.

- [x] **3 · Die Wirkungszeile** → der gesetzte Vorschlag bleibt:
      „… **measured values are labelled as measured, estimates as estimates**
      — and neither label can be switched off, not even by us."
      Die Alternative („as a measured value / as an estimate") ist damit
      verworfen: eindeutiger, aber schwerfälliger, und der Satz muss sich laut
      lesen lassen. Steht in `IMPACT_LINE_PRINCIPLE` und wirkt dadurch auf
      /research und /for-school-leadership gleichzeitig.

- [x] **8 · Der Serverstandort** → **geändert**, als einzige der vier:

      | | |
      | --- | --- |
      | vorher | „**Before we work with** real pupil data, …" |
      | **jetzt** | „**Before Selyvi is used with** real pupil data, …" |

      Das deutsche Original sagt „Vor dem **Betrieb** mit echten
      Schülerdaten". „we work with" beschrieb, was WIR tun; das Deutsche
      beschreibt, wann das PRODUKT eingesetzt wird. Genau darauf kommt es
      einer Datenschutzbeauftragten an — der Zeitpunkt hängt am Einsatz, nicht
      an unserer Tätigkeit.

      Der Wortlaut steht in `PRODUCT_HOSTING_NOTE` **und** in der
      Ausnahmeliste von `scripts/smoke-test.mjs` (Regel D, „in preparation").
      Beide sind mitgezogen.

- [x] **N1 · Die Manifest-Schwüre** → Vorschlagsspalte, alle fünf. Sie hält
      die Kürze, von der die Sektion lebt: Fünf Sätze ohne Gestaltung tragen
      nur, wenn jeder einzeln steht.

- [x] **N2 · Die drei Erzähl-Zeilen** → Vorschlagsspalte, alle drei.
      Insbesondere Zeile 3: „who **stayed late** for us back then", nicht
      „stayed behind" — Letzteres heißt im Englischen auch
      „zurückgeblieben".

- [x] **N3 · Elternpost mit drei Sprachen** (EN, TR, AR) statt vier. Eine
      vierte kommt zurück, sobald jemand sie gegenliest (E6).

- [x] **N4 · „Sachunterricht" → „General studies".**

- [x] **N5 · „Deutsch" als Unterrichtsfach bleibt „German".**

---

## Was jetzt noch offen ist

Genau ein Punkt, und er ist kein Sprachthema:

### E1 · Anwaltsprüfung der englischen Datenschutzerklärung

/privacy ist die Übersetzung der vorläufigen deutschen Erklärung. Weder das
Original noch die Übersetzung sind anwaltlich geprüft. `PRIVACY_APPROVED`
steht deshalb auf `false`: noindex, kein Sitemap-Eintrag, sichtbare
Prüfungs-Zeile.

**Vorschlag:** Die englische Fassung zusammen mit der deutschen prüfen lassen —
es ist derselbe Sachverhalt, und zwei getrennte Mandate kosten doppelt.
**Alternative:** erst die deutsche freigeben, die englische danach; dann geht
selyvi.de früher live und selyvi.com später.

**/impressum braucht diese Prüfung nicht mehr** — es ist seit dieser Runde
wieder deutsch und wortgleich mit selyvi.de.

Zwei weitere Punkte hängen nicht an einer Entscheidung, sondern an einer
Handlung, und stehen als E2 und E4 in der NACH-LAUNCH-LISTE der README:
das hreflang der Gegenrichtung auf selyvi.de, und der Satz fürs
Verkaufsgespräch zur englischen Oberfläche.


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
