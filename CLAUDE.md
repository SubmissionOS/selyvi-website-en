# CLAUDE.md – selyvi-website-en (selyvi.com)

## FORK – DAS WICHTIGSTE ZUERST
**Eigenständige englische Seite, kopiert von `SubmissionOS/selyvi-website` bei Commit `382f107`. Änderungen der deutschen Seite werden hier bewusst nachgezogen, nicht automatisch.**

Es gibt keinen Merge und keine gemeinsame Sprachschicht. Wer auf selyvi.de einen Satz ändert, ändert ihn hier von Hand — oder er ändert sich hier nicht.

**AUSGELIEFERT WIRD ENGLISCH, GEARBEITET WIRD DEUTSCH.** Jede Zeichenkette, die im Browser landet, ist englisch. Kommentare, `docs/` und diese Datei bleiben deutsch: Die Wahrheitsquelle `docs/produktstand-2026-08.md` ist deutsch, und wer eine Produktaussage prüft, liest beides nebeneinander.

**Verbindlich für jede Formulierung: `docs/glossar-en.md`.** Wer einen Begriff anders übersetzt, ändert ihn dort mit Begründung. Die bereits getroffenen Entscheidungen stehen in `docs/en-review.md` — sie werden angewendet, nicht neu verhandelt.

**Der Deutsch-Detektor muss 0 melden:** `npm run check:german <url>`. Er prüft das gerenderte HTML aller Seiten. Ausnahmen sind abschließend drei Eigennamen (Selyvi, Waldstetten, Robert Bosch Stiftung); alles andere, was deutsch bleiben muss, trägt `lang="de"` — das ist zugleich WCAG 3.1.2.

## Projekt
Marketing-Website für eine B2B-SaaS-Plattform für Schulen (Zielgruppen: Lehrkräfte, Schulleitungen & Forschende, **Sprache der Auslieferung: Englisch**). Seiten: /, /for-teachers, /for-school-leadership, /research, /security, /our-story, /preview, /co-create, /meet, /legal-notice, /privacy. Die deutschen Pfade von selyvi.de leiten alle permanent (308) auf ihr englisches Ziel um — die Liste steht in `next.config.ts` und wortgleich in `scripts/smoke-test.mjs`.

## SICHERHEIT – PFLICHT VOR JEDER PAKET-INSTALLATION (keine Ausnahme)
1. WEBSUCHE nach "<paketname> compromised / supply chain / malware" – npm-Lieferketten-Angriffe (TanStack-Hack, Shai-Hulud, keyv/cacheable, node-gyp) sind Standard-Bedrohung, nicht Ausnahme. Bei irgendeinem Treffer: STOPP und nachfragen.
2. PAKET-INSPEKTION vor der Installation: Tarball prüfen (npm pack --dry-run bzw. Registry-Ansicht) auf install-Hooks (pre/postinstall), obfuskierten Code, unerwartete Netzwerk-Calls.
3. COOLDOWN: Keine Version installieren, die jünger als ~14 Tage ist – nimm die letzte ältere Stable.
4. Installation NUR mit npm install --ignore-scripts, exakt gepinnt (die .npmrc erzwingt das – niemals aushebeln). Kein --force. Kein npx mit Remote-Download (nur npx --no-install).
5. Nach jeder Installation: npm audit dokumentieren.

## DESIGN-TOKENS (einzige erlaubte Farbquelle)
brand-100 #c7ecff · brand-400 #1e9cd7 (NIE für Text <24px, Kontrast nur 3,0:1) · brand-600 #0074bd · brand-800 #015b97 · ink #0e1b26 (Fließtext) · surface #ffffff · surface-alt #f6fafd · --cta (Variante A #2c40ff / B #0074bd via Config).
REGELN: --cta ausschließlich für den primären CTA-Button. Keine Farben außerhalb der Tokens. Alle Kontraste WCAG 2.1 AA.

### Nachgebaute Anwendungsoberflächen
INNERHALB der UiWindow-Szenen und auf /einblick gelten stattdessen die Werte aus `src/config/app-reference.ts` — mit der Pipette aus `docs/app-referenz/*.png` gemessen, jeder Wert mit Herkunft im Kommentar. Sie liegen als CSS-Variablen auf dem Fenster und existieren außerhalb davon nicht; die Website behält ihre eigenen Tokens.

Das ist keine Aufweichung, sondern die Bedingung: Was das Produkt zeigt, soll aussehen wie das Produkt. Das Fenster-Chrome (Punkte, Kontext-Chips) bleibt Website — es ist der Rahmen, nicht die Anwendung.

Die Schrift im Fenster ist der system-ui-Stack (lokal vorhanden, keine Lizenzfrage), Website-Text bleibt IBM Plex. Der Unterschied trennt sichtbar, was wir SAGEN, von dem, was wir ZEIGEN.

**WCAG 2.1 AA gilt auch dort.** Zwei Referenz-Werte sind deshalb abgedunkelt (Schrift des aktiven Navigationseintrags, Donut-Bogen); beide Abweichungen stehen in app-reference.ts mit Messwert. Geprüft wird mit `app-kontrast.js` — axe erreicht die Szenen nicht, weil ihr Inhalt unter aria-hidden liegt.

**Die Navigation ist abgeschrieben, nicht hergeleitet.** Acht Einträge in der Reihenfolge des Screenshots — mit ÜBERSETZTEN Beschriftungen (docs/en-review.md, Punkt 9: Today, My classes, Live lesson, Timeline, Review, Support plans, Materials, Class analysis). Die echte Anwendung ist heute deutsch; dass eine Demo danach Deutsch zeigt, gehört ins Verkaufsgespräch. Die Liste steht zweimal — `DEMO_NAV_TEACHER` in demo-data.ts und `ENTRIES` in tour-sidebar.tsx —, wer eine ändert, ändert beide. Wer sie ändert, hat einen neuen Screenshot — oder lässt es. Der Leitungsmodus bleibt hergeleitet, bis ein Bild davon vorliegt.

## DSGVO (nicht verhandelbar)
Zur Laufzeit KEINE Requests an Drittserver (Fonts lokal via next/font – nach jedem Font-Change im Network-Log verifizieren). Kein Google Analytics, keine externen Embeds ohne Zwei-Klick-Lösung. Formulare nur über EU-Dienste (Brevo).

## TON
Jede Sektion beantwortet zuerst, welche Last sie nimmt oder was sie zurückgibt — dann erst, wie. Verkaufssprache ("Jetzt sichern", "Vorteile nutzen", "Tester") ist verboten. Wir sprechen mit Menschen in einem sozialen Beruf, nicht mit Käufern.

### Regel A — Niemandem sagen, wer er ist
Keine Formulierung, die dem Leser zuschreibt, wer er ist, was er tut oder warum. Verboten sind Muster wie "Sie sind X geworden, um…", "Sie wollen doch…", "Als Lehrkraft wissen Sie…", "Ihnen fehlt…", "Sie prüfen…?", "Sie forschen zu…?". Wir sagen, was WIR tun — gern frech, nie belehrend.

ERLAUBT bleibt die Zusage an den Leser ("Selyvi schlägt vor. **Sie entscheiden.**", "Was Sie sehen wollen, bestimmen Sie") — sie räumt ihm Macht ein, statt ihn zu definieren. Erlaubt bleibt ebenso die Selbstauswahl in der ersten Person ("Ich unterrichte", "Ich leite eine Schule"): Dort wählt der Leser, wir schreiben ihm nichts zu.

### Regel B — Kein Selbstzweifel
Keine Formulierung, die klingt, als wüssten wir nicht, was unser Produkt kann oder bewirkt: "warum sich noch nichts sagen lässt", "das behaupten wir nicht", "können wir noch nicht sagen", "ob das ankommt, wissen wir nicht", "die Oberfläche fehlt noch", "steht noch nicht fest".

Ehrlichkeit bleibt Pflicht — sie wird positiv formuliert:
- Gemessenes heißt **Messwert**, Geschätztes heißt **Schätzwert**.
- Offenes wird **gekennzeichnet** ("in Arbeit", "in Vorbereitung", "geplant", "offener Punkt", Badge "In Entwicklung") — nie mit "noch nicht" als Selbstauskunft.
- Nichts wird behauptet, was `docs/produktstand-2026-08.md` nicht deckt. Weglassen ist erlaubt, Behaupten nicht.

Eine definitive Aussage über eine bewusste Produktgrenze ist KEIN Selbstzweifel und bleibt: "Ein Elternportal gibt es nicht", "Eine Einzelansicht gibt es nicht – auch nicht für die Schulleitung", "Offene Punkte kennzeichnen wir, statt sie zu überspielen". Der Unterschied ist Haltung gegen Unwissen.

### Regel C — Kein Reifegrad-Geständnis
Wir nennen freiwillig keine Reifegrad-Defizite: fehlende Piloten, fehlende Referenzschulen, fehlende Zertifikate, Teamgröße, Alter der Firma, Anzahl der Kundinnen. Wir treten auf, als seien wir dort, wo wir hinwollen — ohne eine einzige ungedeckte Behauptung. Verboten sind Muster wie "noch keine Pilotschule", "bisher keine Referenzen", "erst seit", "kleines Team", "Preise werden aktuell mit Pilotschulen festgelegt".

Eine Antwort, die ein solches Defizit einräumt, wird ENTFERNT (samt Frage) oder beschreibt, WIE etwas läuft, statt DASS es fehlt. "Gibt es Referenzschulen?" entfällt; "Wie läuft ein Pilot?" beschreibt den Ablauf.

GRENZE DER REGEL — sie zielt auf UNTERNEHMENS-Reife, nicht auf Rechts- und Produktangaben. Diese bleiben und werden nur positiv formuliert:
- Produktgrenzen, die Verkaufsargumente sind: kein Elternportal, keine Gesamtsicht-Rolle, keine namentliche Rangliste.
- Rechtlich erhebliche Angaben, die eine Datenschutzbeauftragte sehen muss: Serverstandort, Auftragsverarbeitung, Löschfristen. Sie als "in Vorbereitung" zu kennzeichnen ist Pflicht (siehe Regel B); sie zu verschweigen erzeugt genau den Widerspruch, den wir abgeschafft haben.
- Methodische Offenheit gegenüber Forschenden ("offene Methodenlücken sind dokumentiert") — das ist wissenschaftliche Strenge, kein Geständnis.

### Layout-Regel — Kein Bildschirm nur Text
Auf Desktop (1440, Viewport ~900) enthält jeder Viewport-Ausschnitt einer Inhaltsseite etwas Bildliches: Szene, Illustration, Diagramm, Stationen-Linie oder ein Karten-Raster MIT Icons. Kein Textblock breiter als ~60 % mit leerer Nachbarspalte. Kein Zustand, in dem drei Scroll-Ticks nur Text zeigen und das Bild erst darunter kommt.

Drei Lösungsmuster, in dieser Reihenfolge zu prüfen:
- **(a) Zwei Spalten mit dem BESTEHENDEN Bild daneben statt darunter.** Begleitet das Bild einen längeren Text, klebt es (`lg:sticky lg:top-24` — 24 wegen der 64 px hohen, ebenfalls klebenden Kopfzeile).
- **(b) Langer Absatz → 2–3 Karten mit Icon.** Ein Karten-Raster OHNE Icons zählt nicht als bildlich.
- **(c) Zitat-Band schmaler, mit visuellem Anker** (großes Anführungszeichen, kräftige farbige Kante) statt Textwand.

Keine neuen aufwendigen Szenen dafür. Die vorhandenen Visuals reichen — sie stehen nur am falschen Ort.

MOBIL GILT DAS NICHT: Dort bleibt die Reihenfolge Text, dann Bild. Ein Grid ohne `lg:`-Spalten stapelt in DOM-Reihenfolge, `sticky` greift unterhalb von `lg` nicht — deshalb ist die Desktop-Lösung mobil automatisch richtig herum. Niemals `order-*` dafür einsetzen: Das entkoppelt Lese- von Vorlesereihenfolge (WCAG 1.3.2).

Gemessen wird mit `leerraum.js`: Es geht die Seite in 900-px-Schritten durch und meldet jeden Ausschnitt ohne bildliches Element.

### Regel D — Keine Zukunftsform über die Produktreife
Kein "geplant", "in Arbeit", "in Entwicklung", "entsteht gerade", "folgt", "vor dem Produktstart", "Rollout steht aus", "im Aufbau", "bald", "demnächst", "in Vorbereitung". **Was es nicht gibt, wird nicht angekündigt, sondern weggelassen.** Jede Produktaussage steht im Präsens und beschreibt Vorhandenes.

DREI AUSNAHMEN, abschließend:
- `PRODUCT_HOSTING_NOTE` — der Serverstandort. Die einzige erlaubte Einschränkung, unverändert im Wortlaut.
- `SCHOOL_TYPE_ANSWER` — "Weitere Schulformen folgen." Das ist Ausbau, keine Reife; von CEO und CMO so gewollt.
- Rechtstexte (/impressum, /datenschutz). Wortlaut nach Vorlage, nicht nach Marketing-Ton.

"Pilot" und "Pilotkreis" bleiben: Sie beschreiben den Einstieg, nicht die Reife. Ein temporales "folgt" ist verboten, ein logisches nicht ("aus einer Deutschnote folgt nicht, ob ein Kind flüssig liest").

DIESE REGEL HAT DIE FRÜHERE LEITPLANKE "Zukunfts-Szenen" ERSETZT. Jene erlaubte Szenen zu Funktionen mit Status "Rollout offen" oder "Teilweise", sofern sie dauerhaft ein Badge "In Entwicklung" trugen. Beide Szenen (Originalarbeitsblätter, Stilprofil-Upload), die Sektion "In Arbeit" und der Badge-Code im UiWindow sind entfallen. Eine Szene zu einer Funktion, die es nicht gibt, ist jetzt schlicht keine Option mehr.

Die Wahrheitsquelle bleibt unberührt: Nichts behaupten, was `docs/produktstand-2026-08.md` nicht deckt. Regel D verschärft nur die Richtung — weglassen statt ankündigen.

### DIE REGELN A BIS D IN ENGLISCHER FASSUNG
Die Regeln oben sind in deutschen Formulierungen gedacht. Sie gelten hier unverändert — aber die verbotenen Muster sind ANDERE, weil eine Übersetzung sie nicht mitbringt. Was auf Deutsch „noch nicht" heißt, heißt auf Englisch „not yet", und wer nur das deutsche Muster prüft, prüft nichts.

**Regel A — niemandem sagen, wer er ist.** Verboten: "you became a teacher to…", "you went into teaching to…", "as a teacher you know…", "you didn't become a teacher for…", "you surely want…", "you lack…", und jede Frage der Form "Do you teach/lead/research…?".
ERLAUBT bleibt die Zusage an den Leser ("Selyvi suggests. **You decide.**", "What you want to see is up to you") und die Selbstauswahl in der ersten Person ("I teach", "I lead a school", "I do research").

**Regel B — kein Selbstzweifel.** Verboten: "not yet", "nothing yet", "no … yet", "we cannot say", "we don't know whether", "nothing can be said", "we do not claim", "is still undecided/unclear", "has not been decided", "still missing", "remains to be seen".
ERLAUBT und PFLICHT bleibt das Kennzeichnen: Gemessenes heißt **measured value**, Geschätztes heißt **estimate**. "What is open we mark visibly" ist genau die geforderte Haltung, keine Verletzung — der Smoke-Test hat das im ersten Lauf falsch gemeldet, das Muster ist seither enger (Begründung dort im Quelltext).
Eine definitive Aussage über eine gewollte Produktgrenze bleibt: "There is deliberately no parent or pupil portal", "There is no role with an overall view — not for school leadership either".

**Regel C — kein Reifegrad-Geständnis.** Verboten: "no pilot schools", "no references", "we have been … only since", "small team", "young company", "early-stage", "not yet certified", "prices are being set with pilot schools".

**Regel D — keine Zukunftsform über die Produktreife.** Verboten: "is planned", "planned feature", "in progress", "in development", "being built", "coming soon", "shortly", "in the near future", "in preparation", "before launch", "rollout pending", "prototype", "follows later/soon", "is pending", "will soon be".
**DREI AUSNAHMEN, abschließend** — dieselben wie im Deutschen:
- `PRODUCT_HOSTING_NOTE` — enthält "in preparation". Unverändert im Wortlaut.
- `SCHOOL_TYPE_ANSWER` — "More school types follow."
- Rechtstexte (/legal-notice, /privacy).
Beide Sätze stehen wortgleich in der Ausnahmeliste von `scripts/smoke-test.mjs`. Wer sie in `product.ts` bzw. `brand.ts` ändert, ändert sie dort mit.
Ein temporales "follows" ist verboten, ein logisches nicht ("the analysis follows a codebook", "a mark in German does not tell you whether a child reads fluently"). "Selyvi is being built in the middle of everyday school life" auf /research beschreibt die ENTSTEHUNG und ist ausgenommen.

### VERKAUFSSPRACHE – ENGLISCHE LISTE (docs/glossar-en.md)
Nicht verwenden: **unlock, supercharge, game-changer, revolutionise, seamless, effortless, cutting-edge, best-in-class, free trial, sign up now, boost, empower, leverage, delight.**

Der Grund ist derselbe wie im Deutschen: Wir sprechen mit Menschen in einem sozialen Beruf, nicht mit Käufern.

**Dazu vier US-Begriffe, die das Glossar ausschließt** — kein Ton-Verstoß, sondern ein Übersetzungsfehler, aber der Smoke-Test fängt sie an derselben Stelle: *elementary school* (→ primary school), *principal* (→ head teacher), *faculty* (→ staff), *report card comment* (→ report comment).

Alle Ton-Regeln werden bei jedem Deployment gegen das ausgelieferte HTML geprüft: `npm run smoke <url>`, Abschnitt "Ton-Regeln A bis D". Ein Treffer lässt den Smoke-Test fehlschlagen.

**UND DIE MUSTER WERDEN SELBST GEPRÜFT:** `npm run smoke -- --gegenprobe`. Zu jedem Muster steht ein Satz, den es fangen MUSS, dazu fünf erlaubte Sätze, die es NICHT auslösen dürfen. Ein Ton-Test mit 0 Treffern beweist sonst nur, dass er lief — nicht, dass er etwas kann. Die Gegenprobe hat im ersten Lauf eine tote Regel gefunden.

## STIL (Anti-KI-Slop)
Englisch im Ausgelieferten (internationales Englisch, britische Rechtschreibung — siehe docs/glossar-en.md), präzise, keine Emojis im UI, keine Gradients, keine Superlative im Copy, viel Weißraum. Messlatte: behördentauglich. Icons: lucide-react (Brand-Icons: lokale SVGs in brand-icons.tsx).

## ARBEITSWEISE
Ein Prompt = ein abgeschlossener Schritt. Jeder Schritt endet mit fehlerfreiem npm run build UND — sobald Text berührt wurde — mit `npm run check:german <url>` auf 0. UI-Änderungen enden mit Screenshot. Bestehende Tokens/Komponenten wiederverwenden statt neu erfinden. Nichts bauen, was nicht beauftragt wurde.
