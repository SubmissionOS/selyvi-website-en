# Interne Produktübersicht · Stand 21. August 2026

> **Diese Datei ist die einzige Wahrheitsquelle für Produktaussagen auf der Website.**
>
> Regeln für jede Textänderung an der Website:
>
> 1. Nur als **Live** markierte Funktionen dürfen als verfügbar beschrieben werden.
> 2. **Rollout offen**, **Teilweise** und **Nicht gebaut** dürfen nicht als verfügbar erscheinen.
> 3. Nichts aus dem Abschnitt „Was du im Gespräch nicht versprechen darfst" darf auf
>    der Website als Zusage stehen.
>
> Erstellt aus dem tatsächlichen Stand des Production-Branches – nicht aus
> Planungsdokumenten. Jede als „Live" markierte Funktion ist im ausgelieferten Code
> vorhanden.

## Zielgruppe · Aktualisierung vom 2. September 2026 (CMO-Direktive)

> **Diese Aktualisierung ändert die Zielgruppen-Definition, nicht den
> Funktionsstand.** Sie ist eine Festlegung der Geschäftsleitung, kein Befund aus
> dem Production-Branch. Alle Funktions-Markierungen weiter unten (Live, Rollout
> offen, Teilweise, Nicht gebaut) gelten unverändert.

**Selyvi ist für alle Schularten und Schulformen – von Klasse 1 bis zum Abitur.**
Gebaut entlang der deutschen Bildungs- und Rahmenpläne, angelegt darauf, mit den
Vorgaben weiterer Länder mitzuwachsen, Land für Land.

Die frühere Fassung lautete „KI-Assistenz für Grundschullehrkräfte, Klassen 1–4“
und ist damit überholt. Die Grundschule bleibt die HERKUNFT und darf als solche
erzählt werden („Wir haben Selyvi zuerst für Grundschulen gebaut“); sie ist keine
Begrenzung der Zielgruppe mehr. Formulierungen wie „weitere Schulformen folgen“
entfallen ersatzlos – sie beschrieben eine Einschränkung, die es nicht mehr gibt.

### Was diese Aktualisierung ausdrücklich NICHT ändert

**Die Lehrpläne bleiben aus Lizenzgründen nicht angebunden.** Der Abschnitt „Der
Fachkorpus ist noch dünn“ gilt unverändert. Die Website darf sagen, dass Selyvi
sich an Bildungs- und Rahmenplänen ORIENTIERT – niemals, dass es auf sie
ZUGREIFT. Die Wortlaut-Sperre in src/components/sections/hero.tsx bleibt in
Kraft: „is guided by“ ist die zulässige Formulierung, „follows the curricula of
the German states“ wäre eine Zugriffszusage und ist deshalb ausgeschlossen.

**Die Kennzahl „16 Bundesländer“ gehört weiterhin nicht auf die Website.** Sie
beschreibt die erhobene Datenlage, nicht den ausgelieferten Funktionsumfang.

**Der Fachkorpus deckt 43 Fächer ab.** Diese Zahl ist unverändert und trägt keine
Aussage über Schulformen jenseits der Grundschule. Wer eine Fächerabdeckung für
die Sekundarstufe behaupten will, braucht dafür einen neuen Eintrag hier.

---

Selyvi ist die KI-Assistenz für Lehrkräfte aller Schularten und Schulformen, von
Klasse 1 bis zum Abitur. Selyvi strukturiert
Beobachtungen, schreibt Zeugnisbemerkungen und Elternmails im Schreibstil der Lehrkraft,
erzeugt Unterrichtsmaterial aus einem Fachkorpus und zeigt der Schulleitung, wie viel Zeit
das der Schule zurückgibt.

| Kennzahl          | Wert                       |
| ----------------- | -------------------------- |
| Produktreife      | Live, Production im Einsatz |
| Funktionsumfang   | 114 API-Endpunkte          |
| Fächerabdeckung   | 43 Fächer, 16 Bundesländer |
| Elternkommunikation | 9 Zielsprachen           |
| Testabdeckung     | 774 Backend-Tests          |

> **Achtung bei der Kennzahl „16 Bundesländer":** Sie beschreibt die *erhobene*
> Datenlage, nicht den ausgelieferten Funktionsumfang. Die Lehrpläne sind aus
> Lizenzgründen bewusst **nicht angebunden** (siehe „Der Fachkorpus ist noch dünn").
> Die Zahl gehört deshalb nicht auf die Website.

## Kurzfassung

### Was Selyvi in einem Satz macht

Eine Grundschullehrkraft dokumentiert den ganzen Tag über Kinder – und schreibt am
Schuljahresende Texte, für die sie diese Dokumentation eigentlich bräuchte. Selyvi
verbindet beides: Was während des Unterrichts nebenbei erfasst wird, ist am Zeugnistag die
Grundlage des Textes. Und derselbe Bestand erzeugt Material, das zu genau dieser Klasse
passt.

### Der Satz für ein Erstgespräch

„Selyvi nimmt Ihre Beobachtungen aus dem Unterricht auf – getippt oder gesprochen – und
macht daraus die Texte, die Sie ohnehin schreiben müssen: Zeugnisbemerkungen, Elternmails,
Förderhinweise. In Ihrer Sprache, nicht in KI-Sprache. Und Ihre Schulleitung sieht am
Monatsende, wie viele Stunden das dem Kollegium zurückgegeben hat."

Der Funktionsumfang deckt heute vier Bereiche ab:

1. **Dokumentation** – Beobachtungen, Noten, Kompetenzen, Timeline
2. **Kommunikation** – Zeugnis, Elternmail, Übersetzung
3. **Unterricht** – Material, Entwürfe, Sitzplan, Stundenplan, Dokumentenablage
4. **Steuerung** – Leitungsmodus, Entlastungsbericht, Wirkungsmessung

## Bereich 1 – Für die Lehrkraft

Der tägliche Arbeitsbereich. Alles hier ist in Production verfügbar, sofern nicht anders
vermerkt.

### Beobachtungen strukturieren — **Live**

Freitext oder Diktat wird zu einer strukturierten Beobachtung mit Fach, Kategorie,
Priorität und Förderhinweis. Die Spracheingabe läuft über Whisper. Es gibt eine Kurzform
für zwischendurch und einen Live-Unterricht-Modus, in dem während der Stunde für mehrere
Kinder gleichzeitig erfasst wird.

### Zeugnisbemerkungen — **Live**

Erzeugt aus den eigenen Beobachtungen, Noten und Kompetenzeinschätzungen eines Kindes – im
gelernten Schreibstil der Lehrkraft. Fremde Beobachtungen von Kolleginnen fließen bewusst
nicht ein.

### Elternmails, auf Wunsch übersetzt — **Live**

Die Mail entsteht auf Deutsch und wird in einem zweiten Schritt übersetzt – Englisch,
Türkisch, Arabisch, Ukrainisch, Russisch, Französisch, Polnisch, Italienisch, Spanisch.
Namen und Signatur bleiben unangetastet. Marktstandard bei Sdui und SchoolFox, bei uns ohne
Aufpreis.

### Unterrichtsmaterial aus echtem Fachwissen — **Live**

Material entsteht nicht aus dem Modellgedächtnis, sondern aus einem durchsuchbaren
Fachkorpus (hybride Vektor- und Volltextsuche) plus dem Stilprofil der Lehrkraft. Die
Lehrkraft kann die Fundstellen auch selbst auswählen statt sie automatisch ziehen zu
lassen. Jedes erzeugte Material weist seine Quellen aus.

### Originalarbeitsblätter übernehmen statt neu erfinden — **Rollout offen**

Passt ein vorhandenes Arbeitsblatt aus dem Korpus hoch-konfident zum Thema, bietet Selyvi
es zur direkten Übernahme an: Das Original-PDF bleibt formatgetreu und bekommt nur eine
KI-geschriebene Rahmungsseite vorangestellt.

### Unterrichtsentwürfe und Varianten — **Live**

Vollständige Stundenentwürfe mit Fachkontext und Lehrstil, inklusive
Differenzierungsvarianten derselben Stunde.

### Sitzpläne — **Live**

Grafischer Sitzplan mit gesperrten Plätzen und Drag-and-drop. Ein KI-Vorschlag
berücksichtigt Beobachtungen und Förderbedarfe – dieser Teil ist noch Prototyp, der
Sitzplan selbst nicht.

### Klassenstundenplan ohne Pflegeaufwand — **Live**

Es gibt keinen Redaktionsschritt und keine Freigabe: Wer bei seinem Fach Zeiten hinterlegt,
steht im Plan. Seit August minutengenau mit variabler Stundenlänge, eingetragen über einen
Wochenplaner zum Anklicken und Ziehen. Der Plan der Klasse zeigt alle Lehrkräfte – er
enthält keine Schülerdaten.

### Fachverlauf und Stundenprotokoll — **Live**

Je eigenem Fach ein Reiter mit Klassenentwicklung über Monate und einer Timeline der
gehaltenen Stunden. Thema, Mitarbeit und Lernfortschritt einer Stunde fasst die KI auf
Wunsch aus den Beobachtungen und Noten desselben Tages zusammen; der Text bleibt danach
frei editierbar.

### Dokumentenablage für Schülerarbeiten — **Live**

Aufgabenblätter liegen an der Klasse, Abgaben am Kind – mit Kategorie (Übungsaufgabe,
Hausaufgabe, Klassenarbeit), Datum und optionaler Note. Ein Massenupload nimmt einen ganzen
Stapel Scans entgegen und schlägt die Zuordnung anhand des Dateinamens vor. Zugeordnet wird
nie automatisch: Bei zwei Kindern gleichen Vornamens gibt es bewusst gar keinen Vorschlag.

### Daten aus Scans auslesen — **Live**

Aus fotografierten oder gescannten Unterlagen liest Selyvi Noten und Beobachtungen heraus
und legt sie nach Bestätigung an. Das Auslesen ist ein Häkchen mit Voreinstellung Aus – es
kostet je Datei einen KI-Aufruf, und die Ablage funktioniert auch dann, wenn ein Scan
unleserlich ist.

### Kompetenzen statt Notendurchschnitt — **Live**

Einschätzungen entlang echter Kompetenzen – 43 Fächer, zusammengefasst zu 18
Fachfamilien, mit Jahrgangsbezug. Bewusst ohne automatischen Vorschlag aus der Note: Aus
einer Deutschnote folgt nicht, ob ein Kind flüssig liest.

### Förderempfehlungen, Timeline, Klassenanalyse — **Live**

Je Kind eine chronologische Timeline, ein Profilradar und KI-gestützte Förderempfehlungen.
Auf Klassenebene Notendurchschnitte, Auffälligkeiten und eine Gesamtanalyse.

### Freie Fragen an die eigenen Daten — **Live**

Ein Chat beantwortet Freitextfragen zu einem Kind oder einer Klasse – der Kontext wird
serverseitig auf die eigenen Daten begrenzt.

### Bibliothek — **Live**

Der geteilte Fachkorpus und das eigene erzeugte Material an einem Ort, mit Vorschau und
Download der Originaldateien.

### Schreibstil lernen — **Teilweise**

Die Lehrkraft lädt eigene Texte hoch, daraus entsteht ein Stilprofil, das in jede
Textgenerierung einfließt. Das Backend steht vollständig, die Upload-Oberfläche fehlt noch
– heute entsteht das Profil aus den in der App geschriebenen Texten.

## Bereich 2 – Für die Schulleitung

Ein eigener Modus, kein Reiter – die Schulleitung schaltet im Kopf der App zwischen
„Lehrer" und „Leitung" um. Der Zuschnitt folgt einer bewussten Haltung: Der Einstieg zeigt,
was gewonnen wurde, nicht was brennt.

### Entlastungsbericht als Einstieg — **Live**

Eingesparte Stunden, Automatisierungsquoten und Vorgänge je Prozess – für den letzten
abgeschlossenen Monat im Vergleich zum Vormonat, der laufende Monat separat als
Zwischenstand. Als PDF exportierbar. Bewusst ohne Euro-Betrag: Die Grundlage sind
hinterlegte Minutenannahmen, und die sind im UI als Schätzwerte gekennzeichnet.

### Wirkungszeile — **Live**

Direkt unter dem Entlastungsbericht steht ein Satz, der entweder tatsächlich gemessene
Befragungswerte nennt oder in Klartext sagt, warum sich noch nichts sagen lässt. Er
verschwindet nie – er ist das Gegengewicht dazu, dass „140 Stunden gespart" sonst als
belegte Wirkung gelesen wird.

### Lehrer & Klassen — **Live**

Kollegium, Klassen und Fächer in drei Ansichten. Die Schulleitung legt Klassen und
Lehrkräfte an und setzt Passwörter zurück (was laufende Sitzungen sofort entwertet). Fächer
weist sie nicht mehr zu – das machen die Lehrkräfte selbst; sie sieht stattdessen, welche
Klasse sich noch niemand belegt hat.

### Nutzung im Kollegium — **Live**

Wie viele Beobachtungen, Elternbriefe und Materialien im Kollegium entstehen – als
Verteilung, nicht als Rangliste. Die Entscheidung ist Produktpolitik: Eine namentliche
Rangliste des Kollegiums wäre in einer Schule ein Personalinstrument.

### Schulentwicklung — **Live**

Trends über echte Monatsintervalle. Der laufende, strukturell unvollständige Monat ist in
den Charts als „läuft" markiert statt als Trend lesbar zu sein.

### Aufmerksamkeit — **Live**

Klassen mit Beobachtungsbedarf, offene Aufgaben, Hinweise. Auffälligkeit ist ein Vergleich
mit dem Schnitt der eigenen Schule, keine feste Zahl – sonst leuchtet an einer Schule mit
hohem Förderbedarf jede Klasse rot, und die Anzeige sagt nichts mehr.

**Verkaufsargument dahinter:** Der Entlastungsbericht ist das Dokument, das eine
Schulleitung ihrem Schulträger vorlegen kann. Er ist der Grund, warum die Verlängerung
nicht allein an der Zufriedenheit einzelner Lehrkräfte hängt.

## Positionierung – was uns von fobizz und Co. unterscheidet

Drei Punkte, die kein Wettbewerber in dieser Kombination hat. Die ersten beiden sind
Produkt, der dritte ist Vertrieb.

- **Stil – es klingt nach ihr, nicht nach KI.** Selyvi lernt den persönlichen Schreibstil
  der Lehrkraft und erzeugt Texte darin. Genau daran scheitert generische KI im Zeugnis:
  Der Text ist korrekt und trotzdem unbrauchbar, weil ihn niemand als seinen erkennt.
- **Kreislauf – Beobachtung wird Material.** Was in der Klasse dokumentiert wird, bestimmt,
  welches Material erzeugt wird. Wettbewerber generieren Material ohne Kenntnis der Klasse
  – bei uns ist die Dokumentationsarbeit die Voraussetzung dafür, dass das Material passt.
- **Beleg – Wirkung wird gemessen, nicht behauptet.** Ein vollständiges Erhebungsmodell
  nach PHINEO-Wirkungstreppe: Befragung über drei Wellen, zweckgranulare Einwilligung,
  Codebuch, Mindestfallzahlen.

## Bereich 3 – Für den Vertrieb

Interner Bereich. Nichts davon gehört auf die öffentliche Website.

### CRM-Schnittstelle: `GET /export/school-usage` — **Live**

Eine Zeile je Schule und Monat: Bestand (Lehrkräfte, Klassen, Schüler), aktive Lehrkräfte
im Monat, Vorgänge je Prozess, geschätzte eingesparte Stunden, letzte Aktivität. JSON und
CSV mit identischen Feldern, Zugang über einen festen API-Schlüssel statt eines
ablaufenden Logins. Das ist Account-Health, nicht Wirkung. Bewusst enthalten sind
ausschließlich Summen und Schulnamen – keine Lehrer-, Schüler- oder Klassennamen, keine
Befragungsantworten. Testdatenschulen sind herausgefiltert.

### Wirkungsbericht je Schule — **Live**

Die vollständige Wirkungstreppe mit Modellversion, Annahmeketten und offenen
Methodenlücken – heute im Admin-Bereich.

### Feedback aus dem Feld — **Live**

Rückmeldungen aus der App landen gesammelt im Admin-Bereich und überleben sowohl
Konto-Löschung als auch Testdaten-Resets.

### Forschungsdaten-Export mit k-Anonymität — **Nicht gebaut**

Der Export der Wirkungsindikatoren für Forschungspartner ist noch nicht gebaut. Die
Forschungszwecke sind zusätzlich technisch gesperrt, solange die Einwilligungstexte nicht
juristisch geprüft sind.

## Was du im Gespräch nicht versprechen darfst

Der ehrliche Teil. Diese Punkte sind bekannt und dokumentiert – kein Versäumnis, aber im
Verkaufsgespräch heikel, weil sie zu Nachfragen von IT-Verantwortlichen und
Datenschutzbeauftragten führen.

**Nichts davon darf auf der Website als Zusage stehen.**

- **Der Serverstandort ist noch nicht Deutschland.** Gehostet wird derzeit bei Railway und
  Vercel. Vor echtem Schulbetrieb mit echten Kinderdaten steht die Migration nach
  Deutschland plus Auftragsverarbeitungsvertrag an. Bei DSGVO-Fragen: „in Vorbereitung",
  nicht „erledigt".
- **Es gibt keine Selbstregistrierung.** Lehrkräfte-Konten legt ausschließlich die
  Schulleitung an. Ein Pilot beginnt also immer mit einem Gespräch, nicht mit einem
  Anmeldelink.
- **Keine Schnittstelle zu Schulverwaltungssoftware.** Klassen und Kinder werden angelegt,
  nicht importiert. Für eine Schule mit 300 Kindern ist das ein spürbarer Startaufwand –
  das gehört ins Angebot, nicht in die Überraschung.
- **Kein Elternportal, keine Elternkommunikation im Produkt.** Selyvi schreibt die
  Elternmail; versendet wird sie über das Mailprogramm der Lehrkraft. Das unterscheidet uns
  von Sdui, das genau darauf zielt.
- **Keine mobile App, kein Offline-Modus.** Browser, online. Der Live-Unterricht-Modus
  funktioniert am Tablet, braucht aber Verbindung. Spracheingabe ist in Safari und Firefox
  eingeschränkt.
- **Jede Lehrkraft sieht nur ihre eigenen Daten.** Noten, Beobachtungen, Timeline und
  Förderhinweise sind pro Lehrkraft isoliert. In geteilten Klassen sieht man also weniger
  als erwartet – es gibt bislang keine Klassenlehrer-Rolle mit Gesamtsicht. Das ist
  Datenschutz, wirkt im Gespräch aber leicht wie eine Lücke.
- **Keine teilbaren Links.** Die App hat fast keine adressierbaren URLs – man kann keinem
  Kollegen „schau dir mal diese Ansicht an" schicken. Fällt in Demos auf.
- **Kein Onboarding im Produkt.** Es gibt keine Einführungstour. Ein Pilot braucht heute
  eine Einweisung durch uns.
- **Der Fachkorpus ist noch dünn.** Die Materialgenerierung funktioniert, ihre Qualität
  hängt aber am Umfang des hinterlegten Fachwissens. Der Aufbau läuft; die Lehrpläne aller
  16 Bundesländer liegen erhoben vor, sind aus Lizenzgründen aber bewusst nicht
  angebunden.
- **Rückmeldung einer Testerin:** Generiertes Material wirkt „zu trocken" – mehrkanalige,
  spielerischere Aufgabenformate fehlen.

## Zum Namen

Im Produkt heißt heute noch alles „Mira". Die Umbenennung zu Selyvi ist entschieden, aber
noch nicht umgesetzt: Oberfläche, Login, PDF-Export des Entlastungsberichts, Domains und
der CSV-Dateiname aus der CRM-Schnittstelle tragen weiterhin den alten Namen.

Für Website-Texte, Pitchdeck und Schulgespräch gilt: von Selyvi sprechen – aber damit
rechnen, dass ein Interessent im Screenshot oder in der Demo „Mira" liest.

---

Erstellt am 21. August 2026 aus dem tatsächlichen Stand des Production-Branches – nicht aus
Planungsdokumenten. Fragen zu einzelnen Punkten: Tobias.
