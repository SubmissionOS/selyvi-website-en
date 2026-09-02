# Redundanz-Tabelle – englische Fassung

Gemessen im **ausgelieferten sichtbaren Text**, nicht im Quelltext: Eine
geteilte Konstante steht im Code einmal und auf der Seite so oft, wie sie
eingesetzt wird – und die Seite ist, was gelesen wird.

Erzeugt mit `node scripts/redundanz-en.mjs <url> > docs/redundanz-en.md`.
Die Tabelle bewertet nicht, sie zählt. Was zu oft dasteht, entscheidet ein
Mensch.

**Spalte „Soll":**

- **1/Seite** – eine Tatsache, die je Seite einmal trägt. Zwei sind eine
  Wiederholung, drei sind eine Textwand.
- **geteilt** – kommt aus einer geteilten Konstante (`brand.ts`,
  `product.ts`) und **muss** auf mehreren Seiten stehen. Mehrfach ist hier
  kein Befund, sondern der Zweck: Zwei leicht verschiedene Fassungen derselben
  Zusage wären genau der Widerspruch, den eine Schule im Erstgespräch findet.
- **Szene** – steht in einer nachgebauten Oberfläche und wiederholt sich dort
  naturgemäß.

| Aussage                           | Soll    | Start | Teachers | Leadership | Research | Security | Story | Preview | Co-create | Meet |
| --------------------------------- | ------- | ----- | -------- | ---------- | -------- | -------- | ----- | ------- | --------- | ---- |
| Report comments                   | 1/Seite | 2     | 2        | –          | 1        | –        | –     | –       | –         | –    |
| Parent emails                     | 1/Seite | 3     | 3        | –          | 1        | –        | –     | –       | –         | –    |
| Materials with sources            | 1/Seite | 1     | 2        | –          | –        | –        | –     | –       | –         | –    |
| Learned writing style             | 1/Seite | 1     | 2        | –          | –        | –        | –     | –       | –         | –    |
| Workload relief report            | geteilt | 3     | 4        | 5          | 1        | –        | –     | –       | –         | –    |
| Data separation                   | geteilt | 2     | –        | 1          | –        | 3        | 1     | –       | –         | 2    |
| No parent/pupil portal            | geteilt | 2     | 1        | –          | –        | 1        | –     | –       | –         | 1    |
| Practice claim (across Germany)   | geteilt | 2     | 1        | –          | –        | –        | 3     | –       | 1         | –    |
| School type answer (years 1 to 4) | geteilt | 1     | 1        | –          | –        | –        | –     | –       | 1         | –    |
| Decision promise                  | geteilt | –     | 1        | –          | –        | –        | 1     | –       | –         | –    |
| Impact line                       | geteilt | 1     | –        | 1          | 1        | –        | –     | –       | –         | –    |
| Hosting note (in preparation)     | geteilt | 1     | –        | 1          | –        | 2        | –     | –       | –         | –    |
| 9 target languages                | 1/Seite | 2     | 1        | –          | –        | –        | –     | –       | –         | –    |
| Sample data marker                | Szene   | 1     | 1        | 1          | –        | 1        | 2     | 1       | –         | –    |
| Estimate marker                   | 1/Seite | 2     | 2        | 2          | –        | 1        | –     | –       | –         | –    |

## Lesart

Die deutsche Fassung hat dieselbe Struktur, also auch dieselben Wiederholungen
– die Tabelle prüft nicht, ob die Übersetzung schlechter ist als das Original,
sondern ob sie beim Übersetzen etwas verdoppelt hat.

Zwei Stellen sind bewusst so gebaut und keine Redundanz:

- **Die Stil-Aussage** („writing style") steht auf der Startseite genau einmal
  – in der Spalte „For teachers" von „What Selyvi gives back". Auf
  /for-teachers steht sie ein zweites Mal, aber als FÄHIGKEIT statt als
  ERGEBNIS (Kopfkommentar in `learns-with-you.tsx`).
- **„German teachers"** steht auf der Startseite absichtlich zweimal: in der
  ersten Zahl und in der Quellenzeile. Die drei Prozentwerte wandern einzeln
  in Screenshots, und dann muss jeder für sich tragen
  (`why-we-exist.tsx`, docs/glossar-en.md).

