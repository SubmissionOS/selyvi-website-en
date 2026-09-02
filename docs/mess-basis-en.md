# Mess-Basis – englische Fassung

**Erzeugt mit** `node scripts/audit-en.mjs <url>` gegen den Produktionsbuild.
Alle Zahlen sind gemessen, nicht geschätzt.

## Werkzeuge

| Werkzeug     | Version | Wo installiert         |
| ------------ | ------- | ---------------------- |
| `lighthouse` | 13.4.1  | außerhalb des Projekts |
| `axe-core`   | 4.13.0  | außerhalb des Projekts |

Exakt die Versionen aus dem AUDIT.md des deutschen Repos. Dort bereits nach
dem Ablauf aus [CLAUDE.md](CLAUDE.md) geprüft: Websuche ohne Befund, Cooldown
eingehalten, keine Install-Hooks, `npm audit` ohne Vulnerabilities, kein
`axios` im Baum. **Keine neue Paket-Entscheidung, sondern die
Wiederverwendung einer getroffenen.**

Beim Nachinstallieren für diesen Lauf erneut geprüft: 118 Pakete, **keine
Install-Hooks**, `npm audit` **0 Vulnerabilities**, kein `axios`.

Beide stehen NICHT in der package.json dieser Website. Ein einmaliges
Audit-Werkzeug gehört nicht dauerhaft in den Abhängigkeitsbaum einer
Marketing-Website; Lighthouse allein bringt über 100 Pakete mit.

## 1. Lighthouse mobil – Median aus 5 Läufen je Seite

Standardvoreinstellung (Mobil-Emulation, gedrosseltes Netz). Fünf Läufe, weil
ein einzelner schwankt: Der Median wirft den Ausreisser nach oben genauso weg
wie den nach unten.

| Seite                    | Perf | A11y | Best Pr. | SEO | CLS   |
| ------------------------ | ---- | ---- | -------- | --- | ----- |
| `/`                      | 95   | 100  | 100      | 100 | 0.000 |
| `/for-teachers`          | 95   | 100  | 100      | 100 | 0.000 |
| `/for-school-leadership` | 96   | 100  | 100      | 100 | 0.000 |
| `/research`              | 96   | 100  | 100      | 100 | 0.000 |
| `/security`              | 96   | 100  | 100      | 100 | 0.000 |
| `/our-story`             | 96   | 100  | 100      | 100 | 0.000 |
| `/preview`               | 96   | 100  | 100      | 100 | 0.000 |
| `/co-create`             | 96   | 100  | 100      | 100 | 0.000 |
| `/meet`                  | 96   | 100  | 100      | 100 | 0.000 |
| `/impressum`             | 97   | 100  | 100      | 100 | 0.000 |
| `/privacy`               | 97   | 100  | 100      | 66  | 0.000 |

## 2. Lighthouse Desktop – Accessibility, Median aus 5

Desktop-Emulation ändert Schriftgrößen und Zielgrößen. Ein Kontrast- oder
Tap-Target-Befund kann in genau einer der beiden Ansichten auftauchen –
deshalb wird beides gemessen.

| Seite                    | A11y |
| ------------------------ | ---- |
| `/`                      | 100  |
| `/for-teachers`          | 100  |
| `/for-school-leadership` | 100  |
| `/research`              | 100  |
| `/security`              | 100  |
| `/our-story`             | 100  |
| `/preview`               | 100  |
| `/co-create`             | 100  |
| `/meet`                  | 100  |
| `/impressum`             | 100  |
| `/privacy`               | 100  |

## 3. axe-core – Verstöße je Breite

| Seite                        | @ 390 | @ 1440 |
| ---------------------------- | ----- | ------ |
| `/`                          | 0     | 0      |
| `/for-teachers`              | 0     | 0      |
| `/for-school-leadership`     | 0     | 0      |
| `/research`                  | 0     | 0      |
| `/security`                  | 0     | 0      |
| `/our-story`                 | 0     | 0      |
| `/preview`                   | 0     | 0      |
| `/co-create`                 | 0     | 0      |
| `/meet`                      | 0     | 0      |
| `/impressum`                 | 0     | 0      |
| `/privacy`                   | 0     | 0      |
| `/diese-seite-gibt-es-nicht` | 0     | 0      |

## 4. Jedes Audit, das in ALLEN fünf Läufen gefallen ist

Ein Wert unter 100 ohne Namen ist eine Zahl, die niemand nachvollziehen kann.
Hier steht, welches Audit es war. Aufgenommen wird nur, was in **jedem** der
fünf Läufe fiel — ein einmaliger Ausreisser ist Rauschen, kein Befund.

| Audit                             | Kategorie   | Ansicht | Seiten     |
| --------------------------------- | ----------- | ------- | ---------- |
| `is-crawlable`                    | seo         | mobil   | `/privacy` |
| `interactive`                     | performance | mobil   | alle 11    |
| `largest-contentful-paint`        | performance | mobil   | alle 11    |
| `legacy-javascript-insight`       | performance | mobil   | alle 11    |
| `network-dependency-tree-insight` | performance | mobil   | alle 11    |
| `render-blocking-insight`         | performance | mobil   | alle 11    |
| `unused-javascript`               | performance | mobil   | alle 11    |

### Zu den Performance-Audits

Sie fallen auf **allen** Seiten gleich und sind damit keine Eigenschaft einer
einzelnen Seite, sondern des gemeinsamen JavaScript-Bündels: derselbe Befund,
den das AUDIT.md des deutschen Repos beschreibt. Performance liegt trotzdem
bei 95–97 von 100 — die Audits sind Hinweise, keine Fehler.

Was daran zu ändern wäre, ist eine Architekturfrage (weniger Client-Bündel,
andere Aufteilung) und keine Übersetzungsfrage. Sie gehört deshalb nicht in
diese Runde.

### Zu `is-crawlable` auf /privacy

Falls oben `is-crawlable` steht: Das ist **beabsichtigt und kein Mangel.**
/privacy trägt `<meta name="robots" content="noindex">`, solange
`PRIVACY_APPROVED` in [legal.ts](../src/config/legal.ts) auf `false` steht —
die Datenschutzerklärung ist anwaltlich nicht geprüft und soll deshalb nicht
im Index landen. Lighthouse kann nicht wissen, dass die Sperre gewollt ist,
und zieht dafür den SEO-Wert auf 66.

**Keine Maßnahme.** Der Wert steigt auf 100, sobald die Prüfung vorliegt und
der Schalter auf `true` steht. Dieselbe Werkzeuggrenze beschreibt das AUDIT.md
des deutschen Repos für seine Rechtsseiten.

Die 404-Seite ist für Lighthouse nicht bewertbar: Es bricht bei Status 404 mit
`ERRORED_DOCUMENT_REQUEST` ab und wertet keine Nicht-2xx-Antworten. Status 404
ist für eine 404-Seite aber korrekt – die Alternative wäre eine Seite, die
fälschlich 200 meldet. **Werkzeuggrenze, kein Seitenmangel.** Sie wird deshalb
mit axe geprüft.

## Was Lighthouse und axe NICHT erreichen

Der Inhalt der nachgebauten Anwendungsfenster liegt unter `aria-hidden` – ein
Werkzeug, das den Barrierefreiheits-Baum liest, sieht dort nichts. Die
Kontraste darin misst `npm run qa:en` selbst, nach der Formel aus WCAG 2.1.
