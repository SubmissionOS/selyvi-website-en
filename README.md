# selyvi-website-en — die englische Website (selyvi.com)

> **Eigenständige englische Seite, kopiert von `SubmissionOS/selyvi-website`
> bei Commit `382f107`. Änderungen der deutschen Seite werden hier bewusst
> nachgezogen, nicht automatisch.**
>
> Es gibt keinen Merge, keinen Cherry-Pick-Automatismus und keine gemeinsame
> Sprachschicht. Wer auf selyvi.de einen Satz ändert, ändert ihn hier von Hand
> — oder er ändert sich hier nicht. Das ist die Entscheidung hinter dem Fork:
> Eine geteilte Codebasis hätte jede deutsche Änderung zu einer halben
> englischen gemacht, und eine halb übersetzte Seite ist schlechter als eine
> ganz deutsche.
>
> **Was hier anders ist als in der deutschen Fassung:**
>
> | | selyvi.de | selyvi.com |
> | --- | --- | --- |
> | Domain | `SITE_URL = https://selyvi.de` | `SITE_URL = https://selyvi.com` |
> | `<html lang>` | `de` | `en` |
> | `og:locale` | `de_DE` | `en_GB` (Begründung in [seo.ts](src/config/seo.ts)) |
> | Routen | `/fuer-lehrkraefte` … | `/for-teachers` … (deutsche Pfade → 308) |
> | Ausgelieferter Text | deutsch | englisch |
> | Kommentare, `docs/`, CLAUDE.md | deutsch | **weiterhin deutsch** |
>
> Die Kommentare bleiben deutsch, weil die Wahrheitsquelle
> [docs/produktstand-2026-08.md](docs/produktstand-2026-08.md) deutsch ist. Wer
> eine Produktaussage prüft, liest beides nebeneinander; zwei Sprachen in
> dieser Kette wären eine Fehlerquelle mehr.
>
> Verbindlich für jede Formulierung: [docs/glossar-en.md](docs/glossar-en.md).
> Die bereits getroffenen Übersetzungsentscheidungen stehen in
> [docs/en-review.md](docs/en-review.md).

Fundament der Marketing-Website (B2B-SaaS für Schulen).
Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · shadcn/ui · IBM Plex Sans.

Der Produktname steht an genau einer Stelle: `PRODUCT_NAME` in
[src/config/brand.ts](src/config/brand.ts).

## Befehle

```bash
npm run dev           # Entwicklungsserver
npm run build         # Produktionsbuild
npm start             # Produktionsserver
npm run typecheck     # nur Typprüfung
npm run lint          # ESLint
npm run lint:fix      # ESLint mit Autofix
npm run format        # Prettier schreibt
npm run format:check  # Prettier prüft nur
npm run check         # lint + build (Torwächter vor jedem Commit)
npm run smoke <url>   # Smoke-Test gegen ein Deployment
npm run smoke -- --gegenprobe   # beweist, dass die Ton-Muster leben
npm run check:german <url>      # Deutsch-Detektor: muss 0 melden
npm run qa:en <url>             # Überlauf, Kontrast, CLS, rAF, Tastatur, Screenshots
```

**Drei dieser Befehle gibt es nur hier.** Sie sichern genau das ab, was beim
Übersetzen kaputtgeht:

- `check:german` prüft das **gerenderte HTML** aller Seiten auf Umlaute, ß und
  häufige deutsche Wörter. Ausnahmen sind abschließend drei Eigennamen
  (Selyvi, Waldstetten, Robert Bosch Stiftung); alles andere, was deutsch
  bleiben muss, trägt `lang="de"` und wird übersprungen — das ist zugleich
  WCAG 3.1.2. **Der Bericht muss 0 melden.**
- `smoke -- --gegenprobe` prüft die Ton-Regeln gegen sich selbst: Zu jedem
  Muster steht ein Satz, den es fangen muss, und fünf erlaubte Sätze, die es
  nicht auslösen dürfen. Ein Ton-Test mit 0 Treffern beweist sonst nichts.
- `qa:en` misst, was englische Beschriftungen kaputt machen: überlaufende
  Kästen bei 390 und 1440, Kontrast **innerhalb** der nachgebauten
  App-Fenster (dorthin kommt axe nicht, siehe CLAUDE.md), CLS, laufende
  rAF-Schleifen im Ruhezustand, das Tastatur-Protokoll auf /preview und die
  reduced-motion-Hashes.

Verbindliche Arbeitsregeln stehen in [CLAUDE.md](CLAUDE.md).

## Wahrheitsquelle für Produktaussagen

**[docs/produktstand-2026-08.md](docs/produktstand-2026-08.md) ist die einzige
Quelle für das, was die Website über das Produkt behauptet.** Sie ist aus dem
Stand des Production-Branches erstellt, nicht aus Planungsdokumenten.

Drei Regeln, die für jede Textänderung gelten:

1. Nur als **Live** markierte Funktionen dürfen als verfügbar beschrieben
   werden.
2. **Rollout offen**, **Teilweise** und **Nicht gebaut** dürfen nicht als
   verfügbar erscheinen – auch nicht abgeschwächt. Sie haben auf der Website
   **gar keinen Platz mehr**: Was es nicht gibt, wird nicht angekündigt,
   sondern weggelassen (CLAUDE.md, Regel D). Die frühere Sektion „In Arbeit"
   und die beiden Ausblick-Szenen sind entfallen.
3. Nichts aus dem Abschnitt „Was du im Gespräch nicht versprechen darfst" darf
   als Zusage auf der Website stehen.

Die Datei steht in `.prettierignore`, damit ihre Tabellen und Umbrüche so
bleiben, wie sie abgestimmt wurden.

Aussagen, die auf mehreren Seiten wortgleich stehen müssen, liegen in
[src/config/product.ts](src/config/product.ts) – nach demselben Muster wie
`PRACTICE_CLAIM` und `<DpaBand />`. Am wichtigsten dort:
`PRODUCT_HOSTING_NOTE`. Der Serverstandort des Produkts ist **noch nicht**
Deutschland; eine pauschale „Server in der EU“-Zusage für das Produkt darf
nirgends zurückkommen. Getrennt davon steht `WEBSITE_HOSTING_NOTE` – das
Hosting **dieser Website** in Frankfurt ist belegt (Region `fra1` in
`vercel.json`) und gilt nur für die Website.

## Wo was geändert wird

| Aufgabe                          | Datei                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------- |
| Produktaussagen prüfen           | `docs/produktstand-2026-08.md`, geteilte Sätze in `src/config/product.ts`     |
| Produktname / Wortmarke ersetzen | `src/config/brand.ts` (Text) bzw. `src/components/layout/wordmark.tsx` (Logo) |
| CTA-Farbvariante umschalten      | `src/config/brand.ts` → `CTA_VARIANT`                                         |
| Navigation & Footer-Links        | `src/config/site.ts`                                                          |
| Farben / Design-Tokens           | `src/app/globals.css`                                                         |

## CTA-Variante umschalten

In `src/config/brand.ts`:

```ts
export const CTA_VARIANT: CtaVariant = "a"; // "a" = #2c40ff | "b" = #0074bd
```

Der Wert wird in `src/app/layout.tsx` als `data-cta` auf `<html>` gesetzt;
`globals.css` bindet daraufhin die passende Farbe an `--cta`. Es ist der
einzige Schalter – sonst muss nichts angepasst werden.

## Design-Tokens

Alle Farben liegen als CSS-Variablen in `src/app/globals.css` und sind über
`@theme inline` als Tailwind-Utilities verfügbar (`bg-brand-800`, `text-ink`,
`border-gray-200`, …).

| Token           | Wert         | Verwendung                             |
| --------------- | ------------ | -------------------------------------- |
| `--brand-100`   | `#c7ecff`    | Flächen, Footer-Links                  |
| `--brand-400`   | `#1e9cd7`    | Akzente, **kein Text unter 24 px**     |
| `--brand-600`   | `#0074bd`    | interaktive Elemente, Fokus-Ring       |
| `--brand-800`   | `#015b97`    | Wortmarke, Footer-Fläche               |
| `--ink`         | `#0e1b26`    | Fließtext                              |
| `--surface`     | `#ffffff`    | Basis-Hintergrund                      |
| `--surface-alt` | `#f6fafd`    | abgesetzte Sektionen                   |
| `--gray-200`    | `#e2e8ef`    | Rahmen, Trennlinien                    |
| `--gray-500`    | `#64748b`    | Sekundärtext                           |
| `--cta`         | Variante A/B | **ausschließlich** primärer CTA-Button |

### Verbindliche Regeln

1. **`brand-400` nie für Text unter 24 px.** Der Kontrast auf Weiß liegt bei
   ca. 3,0:1 und reicht nur für großen Text (WCAG „large text“). Für Fließ-
   und UI-Text: `--ink`, `--gray-500` oder `brand-600`.
2. **`--cta` ausschließlich für den primären Call-to-Action-Button.** Nicht für
   Links, Überschriften, Icons, Badges, Rahmen oder sekundäre Buttons.
   Umgesetzt über `<Button variant="cta">` – die einzige Stelle im Projekt,
   die `bg-cta` verwendet.
3. **Keine Farbverläufe**, keine Hex-Werte im Markup, keine Tailwind-
   Standardfarben. Farbe kommt immer über die Tokens.

## Schriften

IBM Plex Sans (400/500/600) wird über `next/font/google` eingebunden. Die
Schriftdateien werden einmalig während `next build` heruntergeladen und unter
`/_next/static/media` mit ausgeliefert – **zur Laufzeit besteht keine
Verbindung zu Google-Servern**.

Nachprüfen:

```bash
npm run build
grep -rIl "fonts.gstatic.com\|fonts.googleapis.com" .next/static .next/server/app
# keine Ausgabe = keine Referenz in ausgelieferten Dateien
```

## Sicherheitsvorgaben

`.npmrc` erzwingt projektweit:

- `ignore-scripts=true` – keine `pre-/postinstall`-Hooks aus Abhängigkeiten.
  Praktisch alle aktuellen npm-Supply-Chain-Angriffe liefern ihre Payload über
  genau diese Hooks aus.
- `save-exact=true` – Versionen werden exakt gepinnt, keine `^`/`~`-Ranges.

Für neue Pakete gilt der Ablauf in [CLAUDE.md](CLAUDE.md): Websuche nach
Kompromittierungen, Tarball-Inspektion, Cooldown von ~14 Tagen, Installation nur
mit `npm install --ignore-scripts` und exaktem Pin, danach `npm audit`.
Kein `--force`, kein `npx` mit Remote-Download.

### Prüfprotokoll Linting-Werkzeuge (20.08.2026)

| Paket                    | Version | Alter   | Install-Hooks | Ergebnis                      |
| ------------------------ | ------- | ------- | ------------- | ----------------------------- |
| `eslint`                 | 9.39.5  | 40 Tage | keine         | installiert                   |
| `prettier`               | 3.9.6   | 30 Tage | keine         | installiert                   |
| `eslint-config-next`     | 16.3.0  | 16 Tage | keine         | installiert                   |
| `eslint-config-prettier` | –       | –       | keine         | **bewusst nicht aufgenommen** |

`npm audit` nach der Installation: 0 Vulnerabilities (688 Pakete im Lockfile).

**`eslint-config-prettier` wurde ausgeschlossen.** Das Paket wurde im Juli 2025
kompromittiert (CVE-2025-54313): Nach einem Phishing-Angriff auf den Maintainer
enthielten die Versionen 8.10.1, 9.1.1, 10.1.6 und 10.1.7 ein `postinstall`,
das per `rundll32` eine mitgelieferte `node-gyp.dll` (Scavenger-RAT) nachlud –
gezielt gegen Windows. Es wird nicht benötigt: ESLint 9 hat keine
Formatierungsregeln mehr aktiv und `eslint-config-next` aktiviert ebenfalls
keine, es gibt also keine Konflikte abzuschalten. Prettier formatiert, ESLint
prüft Regeln – die Zuständigkeiten überschneiden sich nicht.

**ESLint bleibt auf 9.x.** ESLint 10 ist installierbar, aber
`eslint-plugin-react` (Abhängigkeit von `eslint-config-next`) nutzt eine dort
entfernte API und bricht sofort ab
(`contextOrFilename.getFilename is not a function`).
`eslint-config-next@16.3.0` deklariert `eslint: ">=9.0.0"`; getestet wird gegen
9.x. Upgrade erst, wenn `eslint-plugin-react` ESLint 10 unterstützt.

### Offener Restpunkt: `unrs-resolver`

Der Abhängigkeitsbaum enthält genau ein Paket mit `postinstall`-Hook:

```
eslint-config-next → eslint-import-resolver-typescript → unrs-resolver@1.12.2
```

Alleiniger Maintainer ist `jounqin` – dasselbe Konto, das im Vorfall oben
gephisht wurde; seine Abhängigkeit `napi-postinstall` war damals eines der fünf
kompromittierten Pakete. Die installierten Versionen sind sauber (nach dem
Vorfall veröffentlicht, nicht deprecated, 93 bzw. 320 Tage alt), und der Hook
**läuft durch `ignore-scripts=true` ohnehin nicht** – ESLint funktioniert ohne
ihn nachweislich. Der Punkt steht hier, weil er zeigt, warum
`ignore-scripts` nicht verhandelbar ist: Der Ausschluss eines Pakets per Hand
hält verwandten Code nicht aus dem Baum, wenn er transitiv nachkommt.

## Sicherheits-Header

Gesetzt in [next.config.ts](next.config.ts) fuer alle Antworten:

| Header                   | Wert                                       |
| ------------------------ | ------------------------------------------ |
| `X-Content-Type-Options` | `nosniff`                                  |
| `Referrer-Policy`        | `strict-origin-when-cross-origin`          |
| `Permissions-Policy`     | `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options`        | `DENY`                                     |

Nachpruefen:

```bash
curl -s -D - -o /dev/null http://localhost:3000/ | grep -iE "x-content-type|referrer-policy|permissions-policy|x-frame"
```

### Offener Punkt: Content-Security-Policy

**Es ist bewusst keine CSP gesetzt.** Begruendung, gemessen statt vermutet:
Das gerenderte HTML enthaelt 5 (`/`) bzw. 3 (`/demo`) Inline-`<script>`-
Elemente – Next.js liefert die Hydrations-Daten so aus.

- Eine CSP **ohne** `unsafe-inline` braucht deshalb Nonces.
- Nonces erzwingen dynamisches Rendern. Alle Routen sind derzeit statisch
  vorgerendert; das waere ein spuerbarer Preis.
- Eine CSP **mit** `unsafe-inline` schuetzt genau gegen das nicht, wogegen eine
  CSP schuetzen soll – sie waere eine Alibi-Zeile im Header.

Empfohlener Weg, wenn die CSP kommen soll: Middleware mit Nonce-Vergabe, dann
gezielt entscheiden, welche Routen dynamisch werden duerfen. Bis dahin steht
der Punkt offen in [AUDIT.md](AUDIT.md).

## Fehlerseiten

| Datei                                          | Zweck                                |
| ---------------------------------------------- | ------------------------------------ |
| [src/app/not-found.tsx](src/app/not-found.tsx) | 404, liefert korrekt HTTP 404        |
| [src/app/error.tsx](src/app/error.tsx)         | unerwartete Ausnahmen, mit `reset()` |

Die Fehlerseite zeigt **keine technischen Details** – kein Stacktrace, keine
Fehler-ID. Der Fehler geht in die Konsole. Ein echtes Fehler-Monitoring fehlt
noch und steht als offener Punkt in [AUDIT.md](AUDIT.md).

## Audit

Der vollstaendige Abschluss-Bericht mit allen Messwerten steht in
[AUDIT.md](AUDIT.md): Lighthouse je Seite, axe-core, Link-Crawl,
Tastatur-Durchlauf, Konsistenz-Pruefungen, Formular-Regression, Bundle-Groessen
sowie die offenen Punkte mit Zustaendigkeit.

## Bekannte Abweichung

`lucide-react` hat mit Version 1.0 **alle Brand-Icons entfernt** (kein
`Linkedin`, `Instagram`, `Github`, … mehr). Die beiden Social-Icons im Footer
liegen deshalb als lokale SVG-Komponenten in
`src/components/icons/brand-icons.tsx` – mit den ursprünglichen Lucide-Pfaden
und identischen Darstellungsattributen. Alle übrigen Icons kommen weiterhin
aus `lucide-react`.

## shadcn/ui

`components.json` ist eingerichtet, `shadcn` ist als gepinnte devDependency
installiert. Weitere Komponenten hinzufügen:

```bash
npx --no-install shadcn add <komponente>
```

`--no-install` stellt sicher, dass die lokal gepinnte CLI läuft und nicht
ungeprüft eine Version aus dem Netz nachgeladen wird. Neu hinzugefügte
Komponenten bringen shadcn-Standardfarben mit (`bg-primary`, `bg-background`, …)
und müssen auf die Projekt-Tokens umgestellt werden.

## UI-Szenen

Animierte Oberflächen-Ausschnitte unter `src/components/scenes/`. **Ohne
Zusatzpakete** – CSS-Keyframes, React-Zustand und `requestAnimationFrame`
reichen; eine Animationsbibliothek ist weder nötig noch erwünscht.

| Baustein        | Zweck                                                                                                   | Technik                        |
| --------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `SceneTimeline` | Schrittfolge, Schleife, Pause, reduced motion                                                           | rAF + IntersectionObserver     |
| `SceneGroup`    | EIN Beobachter für mehrere Szenen nebeneinander                                                         | IntersectionObserver + Context |
| `UiWindow`      | Fensterrahmen: `variant="app"` mit Seitenleiste und Kontext-Chips, `variant="browser"` als alte Fassung | reines Markup                  |
| `TypingText`    | Text erscheint zeichenweise, Rhythmus unregelmäßig                                                      | rAF                            |
| `ChipPop`       | Tags ploppen gestaffelt ein                                                                             | CSS-Keyframes                  |
| `CountUp`       | Zahl zählt hoch                                                                                         | rAF                            |
| `FakeCursor`    | Weicher Zeiger, der gleitet und „klickt"                                                                | CSS-Transition                 |
| `ProgressPulse` | Ruhiger Puls, z. B. Mikrofon                                                                            | CSS-Keyframes                  |
| `MorphLine`     | Textzeile, die sich beim Sprachwechsel umbaut                                                           | CSS-Transition (`scaleX`)      |

### Ein Cast, ein Tag

Alle Szenen erzählen **denselben Schultag**: dieselbe Klasse 3b, dieselben
sechs Kinder, dieselbe Lehrkraft A. Weber. Die Besetzung steht an einer Stelle
in [demo-data.ts](src/config/demo-data.ts) – wer dort einen Namen austauscht,
tauscht ihn auf allen Bühnen aus.

Über jedem Fenster steht ein **Zeit-Kicker** (`kicker`-Prop an
`SceneTimeline`), der die Szene in den Tag einordnet: 08:15 im Unterricht →
16:30 Vorbereitung → 17:10 Elternpost → Monatsende. Der Kicker liegt bewusst
**ausserhalb** des `aria-hidden`-Bereichs: Er trägt Bedeutung, die es sonst
nur optisch gäbe.

Eine Reihenfolge-Eigenheit, bewusst so belassen: Auf /produkt folgen die
Blöcke den vier Bereichen des Produktstands (Dokumentation, Kommunikation,
Unterricht, Steuerung). Die Uhrzeiten laufen dadurch nicht monoton – 17:10
steht vor 16:30. Die Gliederung nach dem Produktstand wiegt schwerer als eine
saubere Uhr.

Zwei Szenen haben je **einen** Filter-Moment, mehr nicht: Szene A setzt den
Kontext-Chip „Klasse 3b", Szene C wählt das Fach „Deutsch". Szene F hat ihren
Umschalter. Alle anderen Szenen zeigen Seitenleiste und Chips als stillen
Kontext, ohne zusätzliche Interaktion.

### Wo Szenen laufen

| Ort                                  | Bühne                                                       |
| ------------------------------------ | ----------------------------------------------------------- |
| Hero: „Beobachtung wird Zeugnistext" | `scenes/hero-scene.tsx` – grosse Bühne im `UiWindow`, ~13 s |
| „So funktioniert's", drei Karten     | `scenes/how-it-works-scenes.tsx` – 112-px-Bühnen, je ~6–7 s |
| /produkt, vier Funktionsblöcke       | `scenes/produkt/` – vier Bühnen fester Höhe, je ~8–10 s     |
| /schulen, Entlastungsbericht         | `scenes/produkt/steering-scene.tsx` mit `size="large"`      |
| /schulen, Rollen-Block               | `scenes/schulen/leadership-mode-scene.tsx` – Umschalter     |

**Der Entlastungsbericht ist EINE Komponente für zwei Seiten.** Auf /produkt
läuft sie als `size="default"`, auf /schulen als `size="large"`. Beide zeigen
dieselbe Zahl mit demselben Schätzwert-Hinweis und derselben Erhebungs-Zeile –
eine Kopie wären zwei Gelegenheiten, genau das auseinanderlaufen zu lassen.

**Auf /produkt hat jede Szene ihren EIGENEN Beobachter** – dort ist die
`SceneGroup` bewusst NICHT im Einsatz. Die vier Blöcke liegen über die ganze
Seite verteilt; eine gemeinsame Gruppe würde alle vier starten, sobald der
erste zu sehen ist, und drei davon liefen dann unbemerkt weiter. Die Gruppe
ist nur für Szenen gedacht, die nebeneinander in einem Blickfeld liegen.

Die drei kleinen Szenen liegen gemeinsam in einer `SceneGroup`: **ein**
IntersectionObserver für die ganze Sektion statt drei einzelner. Sie starten
dadurch zusammen, sobald die Sektion zu sehen ist, und über `startDelayMs`
gestaffelt (300 ms je Szene). Ohne Staffelung bewegen sich drei Karten
gleichzeitig und keine bekommt Aufmerksamkeit; ohne gemeinsamen Beobachter
springt jede an, wann es der Scrollverlauf gerade ergibt.

Sie sind bewusst sparsamer als der Hero: ein Gedanke je Szene, kein
Fensterchrome, kürzerer Durchlauf. Die Bühnenhöhe entspricht exakt der der
früheren statischen Skelette – die Kartengrösse der Sektion ist unverändert.

Demo-Daten liegen zentral in [demo-data.ts](src/config/demo-data.ts) und sind
**frei erfunden** – keine realen Personen, keine reale Klasse. Wer dort etwas
ändert, setzt niemals echte Schülerdaten ein.

### Drei Regeln, die das Fundament durchsetzt

1. **Nur `transform` und `opacity` werden animiert.** Keine Layout-Eigenschaften
   (`width`, `height`, `top`/`left`, `margin`). Die Keyframes stehen gesammelt
   in `globals.css`, jede mit dieser Begründung im Kommentar. `will-change`
   trägt genau ein Element: der Zeiger, weil er sich als einziges dauerhaft
   bewegt.
2. **Ausserhalb des Sichtbereichs läuft nichts.** Der IntersectionObserver
   hält die Zeitleiste an – und über `scene.running` auch die Bausteine mit
   eigener Schleife. Das ist kein Detail: Ohne diese Weitergabe tippte
   `TypingText` ausserhalb des Bildes zu Ende, messbar rund 165
   rAF-Aufrufe in drei Sekunden. Siehe [AUDIT.md](AUDIT.md), Abschnitt 8.
3. **Bei `prefers-reduced-motion` rendert die Szene statisch ihren
   Endzustand.** Deshalb muss der LETZTE Schritt der vollständige Zustand
   sein, nie ein Zwischenbild. Szenen, die am Ende wieder an ihren Anfang
   zurückkehren, geben stattdessen `staticStepId` an – sonst friert
   ausgerechnet das Bild ein, das nichts zeigt.
4. **Schrift wird nie abgedunkelt.** Ein Element mit Text darf keinen
   Ruhezustand bei reduzierter Opazität haben. `gray-500` erreicht auf Weiss
   nur rund 4,8:1 und hat damit keinen Spielraum: Bei 40 % sind es 1,69:1, und
   Lighthouse fällt von 100 auf 96 Accessibility-Punkte. Elemente, die später
   dazukommen, blenden von 0 auf 1 ein – nicht von 0,4 auf 1. Siehe
   [AUDIT.md](AUDIT.md), Abschnitt 9.

### Kein Layout-Sprung

Alle Bereiche einer Szene stehen von Anfang an im DOM und belegen ihren Platz;
was noch nicht dran ist, ist nur durchsichtig. Textkästen haben eine
Mindesthöhe, die den fertigen Text fasst. Ohne beides wüchse das Fenster
mitten im Durchlauf und der CLS der Startseite stiege von 0 an.

### Eine neue Szene bauen

Schritte deklarieren, `SceneTimeline` mit einem `label` versehen (die Szene
trägt `role="img"`, alles darin ist `aria-hidden`), Bausteine über den
`scene`-Parameter schalten. `key={...scene.cycle}` an jeden Baustein, der pro
Durchlauf neu beginnen soll, und `paused={!scene.running}` an jeden mit eigener
Schleife.

## Startseite

Neun Sektionen, jede als eigene Komponente unter `src/components/sections/`.
[page.tsx](src/app/page.tsx) ist reine Komposition.

| #   | Sektion                                 | Komponente                           |
| --- | --------------------------------------- | ------------------------------------ |
| 1   | Hero (einzige H1)                       | `hero.tsx` + `scenes/hero-scene.tsx` |
| 2   | Trust-Zeile                             | `trust-bar.tsx`                      |
| 3   | Problem → Lösung                        | `problem-solution.tsx`               |
| 4   | So funktioniert’s (`#so-funktionierts`) | `how-it-works.tsx`                   |
| 5   | Kernfunktionen                          | `features.tsx`                       |
| 6   | DSGVO-Block                             | `privacy.tsx`                        |
| 7   | Testimonials (abgeschaltet)             | `testimonials.tsx`                   |
| 8   | FAQ                                     | `faq.tsx`                            |
| 9   | Abschluss-CTA                           | `final-cta.tsx`                      |

## Produktseite (/produkt)

Fünf Sektionen unter `src/components/sections/produkt/`; der Abschluss-CTA ist
dieselbe Komponente wie auf der Startseite.

| #   | Sektion                          | Komponente                                       |
| --- | -------------------------------- | ------------------------------------------------ |
| 1   | Intro (einzige H1, kein CTA)     | `product-intro.tsx`                              |
| 2   | Prinzip-Band                     | `principle-band.tsx`                             |
| 3   | Vier Funktionsblöcke (wechselnd) | `function-blocks.tsx` + `function-skeletons.tsx` |
| 4   | Abschluss-CTA (wiederverwendet)  | `../final-cta.tsx`                               |

## Für Schulen (/schulen)

Zielgruppe sind Schulleitung und Schulträger, nicht die einzelne Lehrkraft.
Acht Sektionen unter `src/components/sections/schulen/`.

| #   | Sektion                       | Komponente                  |
| --- | ----------------------------- | --------------------------- |
| 1   | Intro (einzige H1, kein CTA)  | `school-intro.tsx`          |
| 2   | Drei Organisations-Argumente  | `organisation-benefits.tsx` |
| 3   | Der Entlastungsbericht        | `relief-report.tsx`         |
| 4   | Einführungs-Ablauf (Timeline) | `rollout-timeline.tsx`      |
| 5   | Rollen-Block                  | `roles-split.tsx`           |
| 6   | AVV-Hinweis-Band              | `../dpa-band.tsx` (geteilt) |
| 7   | FAQ Schulleitung              | `leadership-faq.tsx`        |
| 8   | Abschluss-CTA (unverändert)   | `../final-cta.tsx`          |

Die Seite enthält bewusst keine Zeitangaben zum Einführungsprozess – weder
Wochen noch Monate noch „typischerweise“. Der Ablauf wird gerade erst mit den
ersten Pilotschulen gestaltet.

Der Ablauf benennt seit dem Abgleich mit dem Produktstand drei Dinge, die eine
Marketingseite normalerweise verschweigt: Es gibt keine Selbstregistrierung,
Klassen werden **angelegt statt importiert**, und eine Einführungstour im
Produkt existiert nicht. Alle drei fallen spätestens in der Einführungswoche
auf – vorher gelesen sind sie eine Haltung, nachher ein Wortbruch.

## Datenschutz & Sicherheit (/datenschutz-sicherheit)

Diese Seite lesen Schulleitungen und Datenschutzbeauftragte **vor** der
Beschaffung. Sieben Sektionen unter `src/components/sections/sicherheit/`.

| #   | Sektion                                 | Komponente                  |
| --- | --------------------------------------- | --------------------------- |
| 1   | Intro (einzige H1)                      | `security-intro.tsx`        |
| 2   | Prinzipien-Grid (6 Karten)              | `principles-grid.tsx`       |
| 3   | Transparenz-Tabelle Auftragsverarbeiter | `subprocessors-table.tsx`   |
| 4   | AVV-Sektion                             | `../dpa-band.tsx` (geteilt) |
| 5   | Für Datenschutzbeauftragte              | `for-dpos.tsx`              |
| 6   | FAQ aus der Prüfung                     | `security-faq.tsx`          |
| 7   | Abschluss-CTA (unverändert)             | `../final-cta.tsx`          |

> **Diese Seite darf nicht mit offenen `[PRÜFEN]`-Markern live gehen.**
> Jeder Marker hier ist ein Launch-Blocker – siehe Tabelle unten. Entweder die
> Angabe ist belegt, oder die Seite geht nicht live.

Zwei Stellen verdienen besondere Aufmerksamkeit:

- **KI-Verarbeitung.** Die Karte sagt ausdrücklich **nicht** zu, dass Daten
  nicht für Training verwendet werden. Diese Zusicherung hängt an den Verträgen
  mit den Modell-Anbietern. Sie darf erst hier stehen, wenn sie vertraglich
  belegt ist – es ist die Frage, die in jeder Prüfung zuerst gestellt wird.
- **Subprozessoren-Liste.** Kopfzeile ja, Firmennamen nein. Eine Liste nach
  Art. 28 Abs. 2 DSGVO ist eine Rechtsauskunft; Schulen bauen ihre eigenen
  Verzeichnisse darauf auf. Ein falscher Eintrag ist schlimmer als ein
  fehlender.

## Über uns (/ueber-uns)

Fünf Sektionen unter `src/components/sections/ueber-uns/`. Personendaten liegen
in [src/config/team.ts](src/config/team.ts).

| #   | Sektion                     | Komponente         |
| --- | --------------------------- | ------------------ |
| 1   | Intro (einzige H1)          | `about-intro.tsx`  |
| 2   | Mission                     | `mission.tsx`      |
| 3   | Team (Initialen-Avatare)    | `team-grid.tsx`    |
| 4   | Arbeitsweise                | `how-we-work.tsx`  |
| 5   | Kontakt-Band (primärer CTA) | `contact-band.tsx` |

Diese Seite nutzt bewusst **keine** `FinalCta` – das Kontakt-Band übernimmt die
Rolle des Abschluss-CTA. Zwei CTA-Sektionen untereinander wären eine Dopplung.

**Personenfreigabe – erledigt.** Alle drei Personen haben der Nennung
zugestimmt (`approved: true` in [team.ts](src/config/team.ts)). Die Zustimmung
deckt auch die Erwähnung beim Vornamen im Erzähltext des Abschnitts „Warum es …
gibt“ ab.

**Offen je Person: der Beschreibungssatz.** Solange `description` leer ist,
zeigt die Karte einen kleineren Marker. Den Satz gibt die Person selbst vor –
erfundene Beschreibungen kommen nicht hinein. Beide Marker hängen an je einem
Feld und verschwinden von allein, sobald es gefüllt ist.

Avatare sind Initialen auf brand-100 – **keine Stockfotos**: ein Stockfoto an
der Stelle einer realen Person ist eine kleine Lüge, und das ausgerechnet auf
der Seite, die Vertrauen herstellen soll. Dass Fotos noch fehlen, steht als
Fließtext in der Sektion; dafür braucht es keinen Marker.

**Weiterhin offen** ist die Nennung einer weiteren, nicht öffentlichen Person:
Der Platzhalter `[PERSON]` im Erzähltext und die Herkunftszeile im Hero der
Startseite tragen dazu je einen Marker.

## Demo (/demo)

Die einzige Conversion-Seite. Kein `FinalCta` – die Seite **ist** der CTA. Im
Header ist kein Navigationspunkt aktiv, weil /demo der Button ist.

| Baustein              | Datei                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Seite                 | [src/app/demo/page.tsx](src/app/demo/page.tsx)                                             |
| Formular (Client)     | [src/components/sections/demo/demo-form.tsx](src/components/sections/demo/demo-form.tsx)   |
| Rechte Spalte         | [src/components/sections/demo/next-steps.tsx](src/components/sections/demo/next-steps.tsx) |
| Server Action         | [src/app/demo/actions.ts](src/app/demo/actions.ts)                                         |
| Validierung           | [src/lib/demo/schema.ts](src/lib/demo/schema.ts)                                           |
| Rate-Limit            | [src/lib/demo/rate-limit.ts](src/lib/demo/rate-limit.ts)                                   |
| Versand (Brevo)       | [src/lib/demo/brevo.ts](src/lib/demo/brevo.ts)                                             |
| Zustand (Typ + Start) | [src/lib/demo/state.ts](src/lib/demo/state.ts)                                             |

### ENV-Variablen

Vorlage: [.env.example](.env.example) nach `.env.local` kopieren und ausfüllen.
`.env.local` ist über `.gitignore` ausgeschlossen.

| Variable         | Zweck                                      | Pflicht               |
| ---------------- | ------------------------------------------ | --------------------- |
| `BREVO_API_KEY`  | API-Schlüssel für den Versand              | ja                    |
| `DEMO_MAIL_TO`   | Zieladresse der Anfragen                   | ja                    |
| `DEMO_MAIL_FROM` | Absender, muss in Brevo verifiziert sein   | ja                    |
| `DEMO_DRY_RUN`   | überspringt den Versand, loggt stattdessen | nein, nur Entwicklung |

**Keine dieser Variablen trägt ein `NEXT_PUBLIC_`-Präfix.** Next.js setzt nur
so präfixierte Werte in das Browser-Bundle ein. `BREVO_API_KEY` wird
ausschließlich in `src/lib/demo/brevo.ts` gelesen, und diese Datei wird nur aus
einer `"use server"`-Datei importiert.

Nach jedem Build gegenprüfen:

```bash
npm run build
grep -rl "BREVO_API_KEY\|DEMO_MAIL_TO\|api.brevo.com" .next/static/
# keine Ausgabe = nichts davon im ausgelieferten JavaScript
```

**`DEMO_DRY_RUN=true` niemals in Produktion.** Das Formular meldet dann Erfolg,
obwohl keine E-Mail verschickt wurde. Ohne vollständige Konfiguration
verweigert der Versand bewusst den Dienst („fail closed“), statt einen Erfolg
vorzutäuschen.

### Spamschutz ohne Captcha

Drei Stufen, alle ohne Drittanbieter und ohne zusätzliche Datenverarbeitung:

1. **Honeypot** – ein für Menschen unsichtbares, nicht fokussierbares Feld.
   Ausgefüllt → Anfrage verworfen.
2. **Zeitcheck** – zwischen Anzeige und Absenden müssen mindestens 3 Sekunden
   liegen. Gemessen wird die _Dauer_ auf dem Client, nicht ein Zeitstempel, damit
   abweichende Uhren keine Rolle spielen.
3. **Rate-Limit** – höchstens 5 Anfragen pro IP in 10 Minuten.

Abgewiesene Anfragen aus Stufe 1 und 2 bekommen dieselbe Erfolgsmeldung wie
echte. Ein sichtbares „abgelehnt“ wäre eine Rückmeldung, mit der sich die
Erkennung austesten ließe.

Zwei ehrliche Grenzen: Der gemessene Zeitwert kommt vom Client und ist
fälschbar – das ist eine Hürde gegen einfache Skripte, keine
Sicherheitsmaßnahme. Und das Rate-Limit liegt im Arbeitsspeicher des Prozesses:
Bei mehreren Instanzen oder in serverlosen Umgebungen zählt jede für sich.
Für mehr bräuchte es geteilten Speicher oder das Rate-Limit der Plattform.

## Rechtliches

Zentrale Ablage: [src/config/legal.ts](src/config/legal.ts). Die Freigabe ist
**getrennt**, weil Impressum und Datenschutzerklärung unterschiedlich weit sind:

| Schalter           | Wert    | Wirkung                                                     |
| ------------------ | ------- | ----------------------------------------------------------- |
| `IMPRINT_READY`    | `true`  | /impressum: kein noindex, kein Balken, in der Sitemap       |
| `PRIVACY_APPROVED` | `false` | /datenschutz: noindex, nicht in der Sitemap, Prüfungs-Zeile |

`isIndexable()` in [seo.ts](src/config/seo.ts) steuert noindex und
Sitemap-Eintrag gemeinsam – beide können nicht auseinanderlaufen.

### Impressum

Die Angaben sind echt (Rafael Gutmann, Einzelunternehmen). **Kein
Registereintrag**: Einzelunternehmen ohne Kaufmannseigenschaft sind nicht
eingetragen; die Rubrik fehlt ganz, statt leer dazustehen.

Fünf offene Punkte:

| Punkt                                                                                        | Zuständigkeit |
| -------------------------------------------------------------------------------------------- | ------------- |
| Betreiberangabe ist vorläufig – nach Gründung auf die Selyvi-Betreibergesellschaft umstellen | Recht         |
| Wortlaut „Haftung für Inhalte“                                                               | Vorlage fehlt |
| Wortlaut „Haftung für Links“                                                                 | Vorlage fehlt |
| Wortlaut „Urheberrecht“                                                                      | Vorlage fehlt |
| Wortlaut „Verbraucherstreitbeilegung / Universalschlichtungsstelle“                          | Vorlage fehlt |

Die vier Textabschnitte sind **strukturell angelegt, aber leer**. Der
Vorlagentext lag der Anweisung nicht bei. Es sind juristische Standardtexte,
deren Wortlaut Bedeutung hat – eine selbst formulierte Fassung wäre genau die
Sorte Text, die im Streitfall nicht trägt. Zum Ausfüllen: `body` je Abschnitt in
`imprintTextSections` füllen, dann verschwindet der Marker automatisch.

### Datenschutzerklärung

Inhaltlich vollständig für das, was die **Website** tut – jede Aussage ist im
Repository belegbar:

| Aussage                      | Beleg                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| Formularfelder               | [schema.ts](src/lib/demo/schema.ts)                            |
| Versand über Brevo           | [brevo.ts](src/lib/demo/brevo.ts)                              |
| Schriften lokal              | [layout.tsx](src/app/layout.tsx), `next/font`                  |
| keine Cookies, kein Tracking | kein entsprechender Code im Projekt                            |
| Verantwortlicher             | [legal.ts](src/config/legal.ts), eine Quelle mit dem Impressum |

**Strenger Scope.** Nichts über das Produkt Selyvi, nichts über KI-Verarbeitung,
nichts über Schülerdaten, nichts über künftige Funktionen. Die Website
verarbeitet davon nichts. Was die Anwendung später verarbeitet, gehört in eine
eigene Erklärung für die Anwendung.

Zwei offene Punkte:

| Punkt                                                         | Zuständigkeit |
| ------------------------------------------------------------- | ------------- |
| AVV und Standardvertragsklauseln mit Vercel bestätigen lassen | Anwalt        |
| Konkrete Löschfrist für Formularanfragen festlegen            | Recht         |

Danach `PRIVACY_APPROVED` auf `true` – das entfernt noindex, die Prüfungs-Zeile
und den Sitemap-Ausschluss in einem Schritt.

### Zwei fehlende Seiten

Im Footer standen unter „Rechtliches“ die Einträge **AGB** und
**Barrierefreiheit** – beide verlinkten auf `/impressum` und sind deshalb
entfernt. Vor dem Launch klären, ob die Seiten gebraucht werden (AGB je nach
Vertragsmodell, Barrierefreiheitserklärung je nach Anwendbarkeit des BFSG).

### Footer-Kontaktdaten

Die Kontaktspalte im Footer speist sich aus [legal.ts](src/config/legal.ts) und
ist bewusst reduziert: **nur die E-Mail-Adresse**, kein Telefon, keine
Anschrift. Die vollständigen Angaben stehen im Impressum – eine private
Mobilnummer auf jeder einzelnen Seite auszugeben, ist etwas anderes, als sie im
Impressum bereitzuhalten.

Damit nennt die Website an keiner Stelle zwei verschiedene Kontaktadressen.

## SEO-Grundausstattung

Eine Quelle für Titel, Beschreibungen, Canonical-URLs, Open Graph und Sitemap:
[src/config/seo.ts](src/config/seo.ts). Seiten holen ihre Metadaten über
`pageMetadata("/pfad")` ab, statt sie selbst zu formulieren – so können
Seitentitel und Sitemap nicht auseinanderlaufen.

| Baustein             | Datei                                                            |
| -------------------- | ---------------------------------------------------------------- |
| Zentrale Config      | [src/config/seo.ts](src/config/seo.ts)                           |
| Basis-Metadaten      | [src/app/layout.tsx](src/app/layout.tsx)                         |
| OG-Bild (1200×630)   | [src/app/opengraph-image.tsx](src/app/opengraph-image.tsx)       |
| Favicon              | [src/app/icon.tsx](src/app/icon.tsx)                             |
| Apple-Touch-Icon     | [src/app/apple-icon.tsx](src/app/apple-icon.tsx)                 |
| Sitemap              | [src/app/sitemap.ts](src/app/sitemap.ts)                         |
| robots.txt           | [src/app/robots.ts](src/app/robots.ts)                           |
| JSON-LD (Startseite) | [src/components/seo/json-ld.tsx](src/components/seo/json-ld.tsx) |

**Titelmuster:** `Seitentitel – Produktname`, Startseite
`Produktname – Die KI-Assistenz für Lehrkräfte`. Alle Beschreibungen sind aus
den Intro-Texten der jeweiligen Seite abgeleitet – was in der Trefferliste
steht, muss die Seite auch einlösen.

**Sitemap und robots.txt.** Die Sitemap speist sich aus derselben Routenliste
wie die Seitentitel. `/impressum` und `/datenschutz` fehlen darin, solange
`LEGAL_APPROVED` false ist. In der robots.txt sind sie trotzdem **erlaubt**:
Nur wenn Crawler die Seiten abrufen dürfen, sehen sie das `noindex` im HTML.
Ein `Disallow` würde das Gegenteil bewirken.

**JSON-LD.** `Organization` und `SoftwareApplication` mit genau den Angaben,
die belegbar sind. Bewusst **ohne** `aggregateRating`, `review`, `offers` oder
Preise – das wäre Schema.org-Spam, ein Abstrafungsrisiko und bei einer Website,
die Schulen Vertrauen abverlangt, das falsche Signal. Der Verifikationslauf
prüft aktiv, dass diese Felder nicht auftauchen.

**OG-Bild und Icons austauschen.** Alle drei sind Platzhalter aus Code. Zum
Ersetzen die jeweilige `.tsx`-Datei löschen und eine Bilddatei mit demselben
Namen nach `src/app/` legen (`opengraph-image.png`, `icon.png` oder
`favicon.ico`, `apple-icon.png` in 180×180). Next erkennt beide Konventionen,
es ist kein Code nötig. Nach einem Austausch des OG-Motivs die Zahl in
`OG_IMAGE.url` (`?v=1`) erhöhen, damit soziale Netzwerke das Bild neu holen.

Hinweis: Das OG-Bild rendert mit einer System-Sans, nicht mit IBM Plex –
`ImageResponse` läuft außerhalb des Dokuments und kennt die Webfont-Einbindung
nicht. Für ein Platzhalter-Motiv vertretbar; beim Austausch gegen ein
gestaltetes Bild erübrigt sich der Punkt.

## Deployment

### Repository

Das Repository ist **privat** und enthält den Next.js-Projektordner als Wurzel –
in Vercel ist deshalb **kein** „Root Directory" zu setzen.

Nicht im Repository: `node_modules/`, `.next/`, jede `.env*` außer
[.env.example](.env.example) (reine Platzhalter). Versioniert bleibt
`screenshots/`, weil [AUDIT.md](AUDIT.md) darauf verweist.

### Region: fra1

Die Function-Region steht in [vercel.json](vercel.json):

```json
{ "regions": ["fra1"] }
```

**Bewusst als Datei statt nur als UI-Einstellung.** Eine reine UI-Einstellung
ist nirgends nachlesbar und fällt bei einem Reimport des Projekts still auf die
Standardregion `iad1` (USA) zurück. Für die Datenschutzerklärung ist Frankfurt
aber eine zugesagte Tatsache – die Server Action des Demo-Formulars verarbeitet
dort personenbezogene Daten. Nach dem ersten Deploy in der Vercel-UI unter
Settings → Functions gegenprüfen, dass `fra1` aktiv ist.

### ENV-Variablen in Vercel (Production)

| Variable         | Wert                                          |
| ---------------- | --------------------------------------------- |
| `BREVO_API_KEY`  | direkt in der Vercel-UI eintragen             |
| `DEMO_MAIL_TO`   | Zieladresse für Anfragen                      |
| `DEMO_MAIL_FROM` | in Brevo bereits verifizierte Absenderadresse |
| `DEMO_DRY_RUN`   | **nicht setzen**                              |

Der Schlüssel gehört ausschließlich in die Vercel-UI – nie in Code, nie in
einen Chat, nie in ein Log. `DEMO_DRY_RUN` in Produktion nicht setzen: Das
Formular meldete sonst Erfolg, ohne eine Mail zu verschicken.

`DEMO_MAIL_FROM` ist vorerst die bestehende verifizierte Adresse.
**[PRÜFEN]** Nach dem Domainkauf auf einen `@selyvi.de`-Absender umstellen.

Ohne vollständige Konfiguration verweigert der Versand den Dienst und meldet
das ehrlich, statt einen Erfolg vorzutäuschen („fail closed").

### Smoke-Test

Gegen jede Deployment-URL ausführbar:

```bash
npm run smoke https://selyvi-website-xxxx.vercel.app
```

Geprüft werden: alle 8 Seiten mit Status 200, die 404-Seite mit Status 404, die
vier Sicherheits-Header auf jeder Antwort, keine Verweise auf Google-Font-Server,
`noindex` ausschließlich auf `/datenschutz`, Sitemap und robots.txt, sowie das
Fehlen von altem Produktnamen und Secret-Mustern in der Ausgabe.

**Nicht abgedeckt: die vier Formular-Pfade.** Server Actions brauchen einen
Browser. Diese vier von Hand auf der Preview-URL prüfen:

| Pfad                          | Erwartung                                                   |
| ----------------------------- | ----------------------------------------------------------- |
| Formular leer absenden        | vier Feldfehler, Fokus springt auf „Name"                   |
| Sofort absenden (unter 3 s)   | Erfolgsansicht, aber **keine** Mail – Zeitcheck greift      |
| Honeypot füllen               | Erfolgsansicht, aber **keine** Mail (Feld nur via DevTools) |
| Korrekt ausfüllen, 4 s warten | Erfolgsansicht **und** Mail an `DEMO_MAIL_TO`               |

Die beiden Abwehr-Pfade sind absichtlich nicht von einer echten Anfrage zu
unterscheiden – sichtbar wird der Unterschied nur im Function-Log von Vercel
(`Anfrage verworfen: …`) und daran, dass keine Mail ankommt.

## NACH-LAUNCH-LISTE

Die Website enthält **keine sichtbaren Platzhalter mehr**. Jede Aussage auf der
Seite ist heute wahr; alles, was noch offen war, wurde entweder auf die
belegbare Tatsache gekürzt, in eine Ankündigung mit Zeitpunkt umformuliert oder
ersatzlos entfernt.

Die offenen Punkte gehen dabei nicht verloren – sie stehen hier. Regel für jeden
Punkt: Wer ihn auflöst, ergänzt den Inhalt **an der genannten Stelle** und
streicht die Zeile aus dieser Liste.

### Blockiert nichts, aber sollte kommen

| #   | Punkt                                                                                                                                                                                      | Wo einzutragen                                                                                   | Zuständigkeit     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ----------------- |
| 1   | Beschreibungssatz je Person (3×)                                                                                                                                                           | `description` in [team.ts](src/config/team.ts)                                                   | die Person selbst |
| 2   | Fotos statt Initialen-Avatare                                                                                                                                                              | `team-grid.tsx`, Hinweistext dort mit anpassen                                                   | Team              |
| 3   | Konkrete Zahlen zur Praxis-Aussage (X Lehrkräfte, Schularten)                                                                                                                              | `PRACTICE_CLAIM` in [brand.ts](src/config/brand.ts) **und** der Nebensatz in `why-it-exists.tsx` | Team              |
| 4   | Praxis-Beispiele je Funktionsblock (welcher Lehrkraft-Hinweis prägte die Funktion?)                                                                                                        | `function-blocks.tsx`, als neue Mikrozeile                                                       | Team              |
| 5   | Dauer und Umfang der Pilotphase, Schulungsformat                                                                                                                                           | `rollout-timeline.tsx`                                                                           | Produkt           |
| 6   | Einführungsaufwand als FAQ-Frage aufnehmen (der Ablauf selbst steht seit 21.08.2026 in `rollout-timeline.tsx`)                                                                             | `leadership-faq.tsx`                                                                             | Produkt           |
| 7   | Unterlagen-Paket für Personalrat und Datenschutzbeauftragte                                                                                                                                | `leadership-faq.tsx`, Antwort ergänzen                                                           | Produkt + Recht   |
| 8   | Dediziertes Postfach für Datenschutzanfragen                                                                                                                                               | `for-dpos.tsx`, danach `legal.ts`                                                                | Betrieb           |
| 9   | Stilprofil per Upload und Übernahme von Original-Arbeitsblättern: sobald sie **ausgeliefert** sind, gehören sie in die Funktionsblöcke. Vorher steht dazu nichts auf der Website – Regel D | `function-blocks.tsx`                                                                            | Produkt           |
| 10  | Mehrkanalige, spielerischere Aufgabenformate (Rückmeldung einer Testerin: Material wirkt „zu trocken“)                                                                                     | erst Produkt, dann `function-blocks.tsx`                                                         | Produkt           |

### Nur die englische Fassung (selyvi.com)

Diese Punkte gibt es auf selyvi.de nicht. Sie entstehen daraus, dass diese
Seite eine **Übersetzung** ist — und eine Übersetzung erbt die Prüfungen des
Originals nicht.

| #    | Punkt                                                                                                                                                                                                                                                                                                        | Wo einzutragen                                                | Zuständigkeit |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------- |
| E1   | **EN-Rechtstexte vom Anwalt prüfen lassen.** /legal-notice und /privacy sind Übersetzungen der deutschen Vorlagen. Die Pflichtangaben sind identisch, der Fließtext ist übersetzt — geprüft ist er nicht. Beide Seiten tragen den Satz „German law applies; this is a translation…"; das ersetzt keine Prüfung | [legal.ts](src/config/legal.ts), danach `PRIVACY_APPROVED`     | Anwalt        |
| E2   | **hreflang von selyvi.de zurück auf selyvi.com setzen.** hreflang wirkt nur beidseitig. Diese Seite zeigt vollständig auf die deutsche (en, de, x-default); solange die deutsche nicht zurückzeigt, ist die Auszeichnung einseitig und wirkungslos                                                            | selyvi.de, `src/config/seo.ts` dort                           | SEO           |
| E3   | **Freigabe der offenen Punkte in [docs/en-review.md](docs/en-review.md).** Wirkungszeile, Serverstandort-Wortlaut, Manifest-Schwüre und die drei Erzähl-Zeilen liegen dort mit Vorschlag und Alternative                                                                                                       | docs/en-review.md, danach der jeweilige Quellort               | CEO + CMO     |
| E4   | **Der Satz fürs Verkaufsgespräch.** Die gezeigte Oberfläche ist englisch, die echte Anwendung ist deutsch (en-review.md, Punkt 9). Wer nach dieser Seite eine Demo zeigt, sagt das — sonst sagt es die Demo                                                                                                    | Verkaufsleitfaden, nicht die Website                          | Vertrieb      |
| E5   | **Lighthouse und axe für die englische Fassung.** Beide brauchen neue Pakete (`lighthouse`, `axe-core`), und CLAUDE.md verlangt davor Websuche, Paket-Inspektion und 14 Tage Cooldown. `npm run qa:en` deckt Überlauf, Kontrast in den App-Fenstern, CLS, rAF, Tastatur und reduced motion bereits ab      | nach der Sicherheitsprüfung als `npm run a11y`                | Technik       |
| E6   | **Vierte Sprache in der Elternpost.** Die deutsche Fassung zeigt vier Sprachen (DE, EN, TR, AR), die englische drei (EN, TR, AR) — eine ukrainische oder polnische Zeile müsste jemand gegenlesen. Sobald jemand das tut, kommt sie zurück                                                                     | `DEMO_TOUR_OBSERVATIONS` in [demo-data.ts](src/config/demo-data.ts) | Team          |
| E7   | **„Drei Bereiche sind offen" auf der deutschen Seite korrigieren.** Offen sind VIER (workspace.tsx). Die englische Fassung sagt vier; auf selyvi.de steht in `take-a-look.tsx` noch drei                                                                                                                      | selyvi.de, `take-a-look.tsx`                                  | Inhalt        |

### Rechtlich / vertraglich

| #   | Punkt                                                                                                                                                                                                                                                                                                                                            | Wo einzutragen                                                              | Zuständigkeit   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | --------------- |
| 11  | Verschlüsselung ruhender Daten (Umfang bestätigen)                                                                                                                                                                                                                                                                                               | `principles-grid.tsx`, Karte „Verschlüsselung"                              | Technik         |
| 12  | KI-Verarbeitung: Modell-Anbieter, Verarbeitungsort, Zusicherung zur Nicht-Nutzung für Training                                                                                                                                                                                                                                                   | `principles-grid.tsx`, `security-faq.tsx`                                   | Vertrag + Recht |
| 13  | Aufbewahrungs- und Löschfristen – **einschließlich der Frist für Formular-Anfragen im CRM.** Die Datenschutzerklärung nennt heute den Zweck (Bearbeitung) und den Ort (eigenes Kundensystem, Server in der EU), aber keine Frist                                                                                                                 | `principles-grid.tsx`, `security-faq.tsx`, `/datenschutz` Abschnitt 4       | Recht           |
| 14  | Vollständige Subprozessoren-Liste (mind. Hosting, E-Mail-Versand, KI-Anbieter)                                                                                                                                                                                                                                                                   | `subprocessors-table.tsx`, Tabelle wieder aufbauen                          | Vertrag + Recht |
| 15  | AVV-Entwurf zum Bereitstellen                                                                                                                                                                                                                                                                                                                    | `dpa-band.tsx`, Satz konkreter fassen                                       | Recht           |
| 16  | Betreiberangabe: nach Gründung auf die Selyvi-Betreibergesellschaft umstellen und anwaltlich prüfen                                                                                                                                                                                                                                              | `legal.ts` (dort als `OPERATOR_NOTE` im Quelltext)                          | Recht           |
| 17  | Datenschutzerklärung anwaltlich prüfen, danach `PRIVACY_APPROVED = true`                                                                                                                                                                                                                                                                         | [legal.ts](src/config/legal.ts)                                             | Anwalt          |
| 18  | AGB- und Barrierefreiheitsseite: klären, ob nötig. Die Karte „Barrierefreiheit als Praxis" auf /datenschutz-sicherheit beschreibt bewusst nur die Bauweise und behauptet kein Prüfsiegel – eine förmliche Erklärung nach BFSG/BITV ist genau dieser Punkt                                                                                        | neue Routen, danach Footer                                                  | Recht           |
| 19  | Lizenzlage der Lehrpläne klären. Die Lehrpläne aller 16 Bundesländer liegen erhoben vor, sind aber aus Lizenzgründen **nicht angebunden** – bis das geklärt ist, darf die Abdeckung nirgends beworben werden                                                                                                                                     | Fachkorpus, danach `function-blocks.tsx`                                    | Produkt + Recht |
| 19a | ~~Schulbarometer-Zahlen belegen.~~ **Erledigt:** Die Werte sind zugeordnet – 83 % aus der Befragung 2026, 84 % und die Wochenendarbeit aus der 4. Befragung 2022. Die Quellenzeile nennt jetzt beide Jahre. Rest-Hinweis: vor dem Livegang einmal gegen die Original-Reports lesen, die Übersichtsseite der Stiftung führt die Einzelwerte nicht | [why-we-exist.tsx](src/components/sections/why-we-exist.tsx)                | Inhalt          |
| 19b | **Konditionen des Pilotkreises bestätigen.** Die Karte „Ausprobieren im echten Alltag" auf /mitgestalten nennt bewusst KEINE Kosten – der Produktstand sagt zu Preisen nur, sie würden mit Pilotschulen festgelegt. Sobald das Team die Konditionen bestätigt hat, gehört der Satz in die erste Karte (siehe Kopfkommentar dort)                 | [what-it-means.tsx](src/components/sections/mitgestalten/what-it-means.tsx) | Team + Vertrieb |

### Technisch

| #   | Punkt                                                                                                                                                                                                                                                                                                                                    | Wo                                         | Zuständigkeit   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------- |
| 20  | Domain kaufen, danach `SITE_URL` und `DEMO_MAIL_FROM` setzen                                                                                                                                                                                                                                                                             | siehe „Launch-Restschritte"                | Betrieb         |
| 21  | Content-Security-Policy                                                                                                                                                                                                                                                                                                                  | `next.config.ts`                           | Technik         |
| 22  | Fehler-Monitoring statt Konsolen-Log                                                                                                                                                                                                                                                                                                     | `error.tsx`                                | Technik         |
| 23  | Routenweise Code-Aufteilung (173 kB auf jeder Route)                                                                                                                                                                                                                                                                                     | siehe [AUDIT.md](AUDIT.md)                 | Technik         |
| 24  | Kontaktadresse auf `kontakt@selyvi.de` umstellen (Gmail ist Übergang)                                                                                                                                                                                                                                                                    | `email` in [legal.ts](src/config/legal.ts) | Betrieb         |
| 25  | Serverumzug nach Deutschland und AVV abschließen, danach `PRODUCT_HOSTING_NOTE` neu formulieren – es ist die letzte Einschränkung auf der ganzen Website                                                                                                                                                                                 | [product.ts](src/config/product.ts)        | Technik + Recht |
| 26  | Produkt-Umbenennung Mira → Selyvi (Oberfläche, Login, PDF-Export des Entlastungsberichts, Domains, CSV-Dateiname der CRM-Schnittstelle)                                                                                                                                                                                                  | Produkt, nicht diese Website               | Produkt         |
| 27  | **CRM-Übergabe scharf schalten:** `CRM_INBOUND_URL` = `https://www.mira-crm.de/api/inbound/website-lead` und `WEBSITE_INBOUND_KEY` in der Vercel-Oberfläche setzen (beide ohne `NEXT_PUBLIC_`, nur Production + Preview nach Bedarf). Solange eine der beiden fehlt, wird der Weg still übersprungen – die Brevo-Mail geht trotzdem raus | Vercel-Projekteinstellungen                | Betrieb         |

Zu Punkt 25: Bis der Umzug durch ist, ist der Serverstandort die erste Angabe,
nach der eine Datenschutzbeauftragte fragt. Die Website sagt dazu heute an vier
Stellen dasselbe – alle vier speisen sich aus `PRODUCT_HOSTING_NOTE`.

Zu Punkt 26: Betrifft nicht diese Website, aber jedes Verkaufsgespräch. Die
Website spricht durchgehend von Selyvi; wer eine Demo sieht, liest dort
weiterhin „Mira". Das gehört vor dem Termin angesprochen, nicht währenddessen
erklärt.

Zu Punkt 24: Eine Adresse auf der eigenen Domain wirkt auf Schulleitungen
seriöser als eine Gmail-Adresse, und sie kommt mit dem Domainkauf ohnehin. Es
ist eine Zeile – `email` in `legal.ts` speist Impressum, Datenschutzerklärung,
Footer und die Fallback-Zeile des Demo-Formulars gemeinsam.

### Was bewusst auf der Seite bleibt

Seit Regel D (CLAUDE.md) ist diese Liste kurz geworden. **Ankündigungen gibt
es nicht mehr** – was es nicht gibt, steht nicht auf der Seite. Übrig bleiben:

- **`PRODUCT_HOSTING_NOTE`** – der Serverstandort. Die einzige erlaubte
  Einschränkung der ganzen Website, unverändert im Wortlaut, an vier Stellen
  aus derselben Konstante.
- **`SCHOOL_TYPE_ANSWER`** – „Weitere Schulformen folgen." Ausbau, keine
  Reife; von CEO und CMO so gewollt.
- Einführungs-Schritte auf /schulen, die eine **Grenze** benennen statt eines
  Vorhabens: keine Selbstregistrierung, Anlage statt Import, keine
  Einführungstour im Produkt. Alle im Präsens.
- Die Zeile „Diese Erklärung befindet sich in laufender juristischer Prüfung."
  auf /datenschutz – Rechtstext, von Regel D ausgenommen.

Entfallen sind: die Sektion „In Arbeit" auf /fuer-lehrkraefte samt beider
Ausblick-Szenen, alle Sätze über eine geplante Schulverwaltungs-Schnittstelle,
„vor dem Produktstart" in drei Fassungen und „Fotos folgen." auf /ueber-uns.

Der Rollen-Block auf /schulen und die Prinzipien-Karte „Rollen & Rechte" standen
hier bis zum 21.08.2026 ebenfalls als Ankündigung. Beide sind jetzt beantwortet:
Jede Lehrkraft sieht ausschließlich ihre eigenen Daten, eine Rolle mit
Gesamtsicht gibt es nicht.

Ebenso bleibt `PRIVACY_APPROVED = false`: Das ist kein sichtbarer Platzhalter,
sondern Schutz – `/datenschutz` trägt dadurch weiterhin `noindex` und fehlt in
der Sitemap, bis die Prüfung durch ist.

## Launch-Restschritte

Erst **nach** dem Domainkauf. Vorher bleibt die Website auf der
Vercel-Preview-URL, und `SITE_URL` bleibt auf dem `.example`-Platzhalter.

| #   | Schritt                                                              | Wo                                                 |
| --- | -------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | `selyvi.de` als Primary Domain verbinden                             | Vercel → Settings → Domains                        |
| 2   | `selyvi.com` und `www.selyvi.de` als Redirect auf die Primary Domain | Vercel → Settings → Domains                        |
| 3   | `SITE_URL` auf `https://selyvi.de` umstellen                         | [src/config/seo.ts](src/config/seo.ts)             |
| 4   | Brevo-Absender-Domain verifizieren (SPF, DKIM, DMARC)                | Brevo                                              |
| 5   | `DEMO_MAIL_FROM` auf die neue `@selyvi.de`-Adresse umstellen         | Vercel → Environment Variables                     |
| 6   | OG-Vorschau prüfen und Cache leeren lassen                           | LinkedIn Post Inspector, Facebook Sharing Debugger |
| 7   | Property anlegen, Sitemap einreichen                                 | Google Search Console, Bing Webmaster Tools        |
| 8   | `npm run smoke https://selyvi.de` erneut ausführen                   | lokal                                              |
| 9   | Vercel-Region verifizieren (schon nach dem ersten Deploy möglich)    | Vercel → Settings → Functions                      |

Zu Schritt 3: Canonical, `og:url`, Sitemap und robots.txt leiten sich alle aus
`SITE_URL` ab – es ist genau **eine** Zeile.

Zu Schritt 6: Das OG-Bild trägt `?v=2`. Falls das Motiv später ausgetauscht
wird, die Zahl in `OG_IMAGE.url` erhöhen, damit die Netzwerke es neu holen.

Zu Schritt 9: [vercel.json](vercel.json) fordert `"regions": ["fra1"]` – also
Frankfurt. Erwartet wird genau das. Auf dieser Angabe steht die Aussage
„Diese Website wird in Frankfurt am Main gehostet" auf
[/datenschutz-sicherheit](src/components/sections/sicherheit/principles-grid.tsx);
solange sie nicht einmal am laufenden Deployment nachgesehen wurde, ist sie
angenommen und nicht geprüft.

Das Ergebnis gehört als Kommentar hierher, nicht in `vercel.json` – die Datei
muss gültiges JSON bleiben und verträgt keine Kommentare. Also nach der
Prüfung diesen Absatz ergänzen, zum Beispiel:
`<!-- Geprüft am TT.MM.JJJJ: Region fra1 bestätigt. -->`

**Nicht vergessen, unabhängig vom Domainkauf:** `PRIVACY_APPROVED` steht auf
`false`. Solange trägt `/datenschutz` ein `noindex` und fehlt in der Sitemap.
Nach der anwaltlichen Prüfung auf `true` setzen.

## Geteilte Bausteine

- [`components/faq-accordion.tsx`](src/components/faq-accordion.tsx) – FAQ-Darstellung
  für Startseite, /schulen und /datenschutz-sicherheit. Inhalte bleiben in der
  jeweiligen Sektion, damit die Blöcke optisch nicht auseinanderlaufen.
- [`components/ui/review-marker.tsx`](src/components/ui/review-marker.tsx) –
  `[PRÜFEN]` bzw. `[PRÜFEN: <Notiz>]`.
- [`components/sections/dpa-band.tsx`](src/components/sections/dpa-band.tsx) –
  AVV-Aussage für /schulen und /datenschutz-sicherheit. Bewusst eine Komponente
  statt zweimal derselbe Text: Die Aussage muss auf beiden Seiten wortgleich
  bleiben, auch nachdem jemand sie überarbeitet hat.
- [`components/sections/final-cta.tsx`](src/components/sections/final-cta.tsx) –
  unverändert auf allen vier Seiten.

### Offene Platzhalter vor dem Livegang

**Keine mehr.** Die Website enthält keinen sichtbaren Marker und keinen
Platzhalter-Text. Nachprüfen gegen ein laufendes Deployment:

```bash
npm run smoke <url>
```

Alle ehemals markierten Punkte stehen in der [NACH-LAUNCH-LISTE](#nach-launch-liste).

## Formular-Pfad testen

`npm run smoke <url>` prüft ein Deployment ohne Browser und kann deshalb die
Server Actions der Formulare nicht auslösen. Dafür gibt es einen zweiten Test:

```
npm run build
npm run test:formular
```

Er startet einen eigenen `next start` (Port 3311), einen Schein-CRM-Endpunkt
(Port 3312) und einen kopflosen Browser und schickt beide Formulare ab –
einmal mit erreichbarem und einmal mit totem CRM. **Beide Male muss dieselbe
Bestätigung erscheinen.** Der zweite Fall ist der eigentliche Punkt: Die
Brevo-Mail ist der Verlass, die CRM-Übergabe die Zugabe.

Der Test setzt `DEMO_DRY_RUN=true` und verschickt deshalb keine echte Mail.
Belegte Ports brechen ihn ab, statt einen fremden Prozess zu messen. Ein
anderer Browser lässt sich über `EDGE_PATH` angeben.

## Screenshots erzeugen

Unter Windows erzwingt das Betriebssystem eine Mindestfensterbreite von rund
500 px. `msedge --headless --window-size=390,844 --screenshot` rendert deshalb
ein breiteres Layout und schneidet das Bild anschließend auf 390 px zu – das
sieht aus wie ein horizontaler Überlauf, ist aber ein Artefakt des Werkzeugs.

Für Viewports unter ~500 px daher echte Geräte-Emulation über das
DevTools-Protokoll verwenden (`Emulation.setDeviceMetricsOverride` +
`Page.captureScreenshot`) statt `--window-size`.
