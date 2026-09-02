/**
 * Demo-Daten für die UI-Szenen.
 *
 * ==========================================================================
 * ROTER FADEN – ALLE SZENEN ERZÄHLEN DENSELBEN SCHULTAG.
 * ÄNDERUNGEN HIER ÄNDERN DIE GESCHICHTE ÜBERALL.
 * --------------------------------------------------------------------------
 * Dieselbe Klasse (3b), dieselben sechs Kinder, dieselbe Lehrkraft
 * (A. Weber) – vom Hero über die kleinen Szenen und /for-teachers bis
 * /for-school-leadership. Wer hier einen Namen austauscht, tauscht ihn auf
 * allen fünf Bühnen aus, und genau das ist der Zweck: Zehn Szenen mit zehn
 * erfundenen Klassen wären zehn Beispiele, eine durchgehende Besetzung ist
 * ein Tag.
 *
 * DIE BESETZUNG BLEIBT IN DER ENGLISCHEN FASSUNG UNVERAENDERT: Emma K.,
 * Yusuf A., Lotta B., Milan P., Frida S., Jonas T. und die Klasse 3b. Namen
 * sind keine Uebersetzung, und der Cast ist ueber alle Szenen und ueber beide
 * Sprachfassungen derselbe.
 *
 * Die Zeit-Kicker über den Fenstern (08:15 → 16:30 → 17:10 → Monatsende)
 * stehen in den Szenen selbst, nicht hier – sie sind Erzählung, nicht Daten.
 * ==========================================================================
 *
 * ==========================================================================
 * ALLE DATEN SIND FREI ERFUNDEN.
 *
 * Keine realen Personen, keine reale Klasse, keine reale Schule. Die
 * Kindernamen sind erfunden und stehen mit abgekürztem Nachnamen, damit sie
 * auch als Erfindung erkennbar bleiben. Die Beobachtungs- und Zeugnistexte
 * sind fachlich plausibel formuliert, aber ebenfalls erfunden.
 *
 * WER HIER ETWAS ÄNDERT: niemals echte Daten einsetzen – auch nicht
 * „anonymisierte". Eine Marketingseite, die echte Schülerbeobachtungen zeigt,
 * ist ein Datenschutzvorfall, kein Screenshot.
 * ==========================================================================
 *
 * ==========================================================================
 * DIE OBERFLAECHE IST ENGLISCH – DAS IST EINE ENTSCHEIDUNG, KEINE UEBERSETZUNG
 * --------------------------------------------------------------------------
 * docs/en-review.md, Punkt 9: Die echte Anwendung ist heute deutsch. Auf
 * selyvi.com zeigen wir eine englische Oberflaeche, die es so noch nicht gibt.
 * Gewaehlt wurde bewusst Weg 1 (uebersetzen), weil eine englische Seite mit
 * deutscher Oberflaeche unfertig wirkt.
 *
 * DAS GEHOERT INS VERKAUFSGESPRAECH: Wer nach dieser Seite eine Demo sieht,
 * sieht eine deutsche Anwendung. Der Satz dazu steht in en-review.md.
 * ==========================================================================
 *
 * Die Inhalte müssen zum Produktstand passen (docs/produktstand-2026-08.md):
 * Grundschule, Klassen 1–4, Kompetenzen statt Notendurchschnitt. Die Quelle
 * ist deutsch; diese Datei uebersetzt sie, sie erweitert sie nicht.
 */

/** Fiktive Klasse, auf die sich alle Szenen beziehen. */
export const DEMO_CLASS = "3b";

/**
 * Fiktive Lehrkraft. Sie signiert die Elternmail und ist die Person, deren
 * Bildschirm alle Szenen zeigen.
 */
export const DEMO_TEACHER = "A. Weber";

/**
 * Das Fach, das die Beispiel-Lehrkraft in dieser Klasse unterrichtet.
 *
 * Steht in der Klassenansicht unter „My subjects" und als Fach-Tab.
 *
 * „German", nicht „English": Das Fach ist der Deutschunterricht einer
 * deutschen Grundschule. Es zum Englischunterricht zu machen, weil die
 * Website englisch ist, waere eine Aussage ueber ein Schulsystem, in dem das
 * Produkt nicht laeuft.
 */
export const DEMO_SUBJECT = "German";

/**
 * KEINE NEGATIVEN INHALTE ÜBER KINDER – auch nicht über erfundene.
 *
 * Alle Beobachtungen unten beschreiben etwas, das gelingt. Keine schlechten
 * Noten, keine Defizitzuschreibungen, kein Förderdrama. Das ist keine
 * Beschönigung des Produkts: Es kann selbstverständlich auch Schwierigkeiten
 * dokumentieren. Aber eine öffentliche Marketingseite ist nicht der Ort, an
 * dem ein – wenn auch erfundenes – Kind vorgeführt wird, und ein Screenshot
 * mit „needs more practice" wandert erfahrungsgemäß durch Präsentationen.
 *
 * Eine frühere Beobachtung mit dem Marker „Förderbedarf" ist aus diesem Grund
 * ersatzlos entfallen.
 */

/**
 * Navigation der Anwendung, wie sie in der Seitenleiste jeder Szene steht.
 *
 * Reihenfolge und Beschriftung sind überall gleich – eine Navigation, die je
 * Szene anders aussähe, wäre kein Produkt, sondern eine Sammlung Illustrationen.
 *
 * BIBLIOTHEK IST IN KEINER SZENE AKTIV. Sie existiert laut Produktstand und
 * darf deshalb in der Navigation stehen. Aber keine Szene zeigt sie, also
 * behauptet auch keine etwas über sie. Ein Eintrag in einer Seitenleiste sagt
 * „es gibt das"; eine aufgeklappte Ansicht sagt „so sieht es aus", und das
 * wäre hier ungedeckt.
 */
/* ==========================================================================
   NAVIGATION DER LEHRKRAFT – ABGESCHRIEBEN, NICHT HERGELEITET
   --------------------------------------------------------------------------
   Quelle ist docs/app-referenz/Material-generator.png und Stundenplan.png:
   die echte Seitenleiste, in dieser Reihenfolge, mit diesen Beschriftungen.

   VORHER STAND HIER ETWAS ANDERES, und das war der Fehler: eine elfstellige
   Liste, die aus den als „Live" gefuehrten Funktionen des Produktstands
   ABGELEITET war – plus eine Zeile „+ weitere". Die Herleitung war sauber
   begruendet und trotzdem falsch: Die echte Anwendung ordnet ihre Funktionen
   anders. Ein Funktionsverzeichnis ist keine Navigation.

   Damit entfaellt auch „+ weitere": Diese acht Punkte SIND die Navigation,
   nicht ein Ausschnitt davon.

   DIE UEBERSETZUNG IST FESTGELEGT (docs/en-review.md, Punkt 9):
     Heute → Today · Meine Klassen → My classes · Live-Unterricht → Live lesson
     · Timeline → Timeline · Überprüfung → Review · Förderpläne → Support plans
     · Material → Materials · Klassenanalyse → Class analysis
   Wer eine dieser Beschriftungen aendert, aendert sie in en-review.md mit –
   sonst heisst derselbe Menuepunkt im Gespraech anders als auf der Seite.
   ========================================================================== */
export const DEMO_NAV_TEACHER = [
  { key: "heute", label: "Today" },
  { key: "meine-klassen", label: "My classes" },
  { key: "live-unterricht", label: "Live lesson" },
  { key: "timeline", label: "Timeline" },
  { key: "ueberpruefung", label: "Review" },
  { key: "foerderplaene", label: "Support plans" },
  { key: "material", label: "Materials" },
  { key: "klassenanalyse", label: "Class analysis" },
] as const;

/**
 * Leitungsmodus – UNVERAENDERT HERGELEITET, ABSICHTLICH.
 *
 * Von dieser Ansicht liegt KEIN Screenshot vor. Die Liste bleibt deshalb
 * genau so, wie sie aus dem Produktstand hergeleitet wurde – auch wenn die
 * Lehrkraft-Navigation daneben inzwischen abgeschrieben ist. Sie jetzt „im
 * gleichen Stil" umzubauen hiesse, eine Vermutung wie eine Ablesung
 * aussehen zu lassen. Sobald ein Leitungsmodus-Screenshot vorliegt, gehoert
 * sie ersetzt.
 *
 * Der Produktstand fuehrt unter „Bereich 2 – Für die Schulleitung" genau
 * diese fuenf Bereiche als Live: Entlastungsbericht, Lehrer & Klassen,
 * Nutzung im Kollegium, Schulentwicklung, Aufmerksamkeit.
 *
 * Diese Liste ist VOLLSTAENDIG – deshalb traegt sie im Gegensatz zur
 * Lehrkraft-Liste KEINE „+ weitere"-Zeile. Eine Andeutung von mehr waere hier
 * eine Behauptung.
 *
 * „staff", nicht „faculty": Letzteres ist US-Hochschulsprache
 * (docs/glossar-en.md).
 */
export const DEMO_NAV_LEADERSHIP = [
  { key: "entlastungsbericht", label: "Workload relief report" },
  { key: "lehrer-klassen", label: "Teachers & classes" },
  { key: "nutzung", label: "Use across the staff" },
  { key: "schulentwicklung", label: "School development" },
  { key: "aufmerksamkeit", label: "Attention" },
] as const;

export type DemoNavKey =
  (typeof DEMO_NAV_TEACHER)[number]["key"] | (typeof DEMO_NAV_LEADERSHIP)[number]["key"];

export type DemoChild = {
  /** Vorname plus abgekürzter Nachname. */
  name: string;
  /** Initialen für die Kachel – bewusst hinterlegt statt aus dem Namen
      geparst, damit ein Name mit Bindestrich nichts kaputt macht. */
  initials: string;
};

/** Fiktive Kinder der Klasse 3b. Sechs, weil das Kachelraster 3 × 2 ist. */
export const DEMO_CHILDREN: DemoChild[] = [
  { name: "Emma K.", initials: "EK" },
  { name: "Yusuf A.", initials: "YA" },
  { name: "Lotta B.", initials: "LB" },
  { name: "Milan P.", initials: "MP" },
  { name: "Frida S.", initials: "FS" },
  { name: "Jonas T.", initials: "JT" },
];

export type DemoObservation = {
  /** Kind, auf das sich die Beobachtung bezieht. */
  child: string;
  /** Freitext, wie ihn eine Lehrkraft tippt oder diktiert. */
  input: string;
  /**
   * Struktur, die die Anwendung daraus ableitet: Fach, Art, Bewertung.
   * Entspricht dem, was der Produktstand als „Fach, Kategorie, Priorität und
   * Förderhinweis" beschreibt – hier auf drei sichtbare Marker gekürzt.
   */
  chips: string[];
  /** Zwei Sätze im Zeugnis-Register, erkennbar aus dem Freitext abgeleitet. */
  reportDraft: string;
};

/**
 * Szene 1 (Hero): Leseflüssigkeit.
 *
 * Der Zeugnistext greift beide Aussagen der Beobachtung auf – das flüssige
 * Vorlesen und das gewachsene Zutrauen. Das ist der Punkt der Szene: Der
 * Entwurf kommt aus der eigenen Beobachtung, nicht aus dem Modellgedächtnis.
 */
export const DEMO_READING: DemoObservation = {
  child: "Emma K.",
  input: "Emma read to the class fluently today, first time — and she is trusting herself more.",
  chips: ["German · Reading", "Observation", "Strength"],
  reportDraft:
    "Emma reads to the class with growing fluency and assurance. She trusts herself more as she does, and she joins in German lessons of her own accord more and more often.",
};

/* ==========================================================================
   Daten der vier Szenen auf /for-teachers.
   ========================================================================== */

/**
 * Szene A – Live-Unterricht-Modus: zwei Kinder in einer Stunde.
 *
 * Bewusst sehr kurze Notizen. Der Punkt der Szene ist nicht, was dasteht,
 * sondern dass es NEBENBEI entsteht – ein ausformulierter Satz würde das
 * Gegenteil suggerieren.
 */
export const DEMO_LIVE_NOTES = [
  { child: "Emma K.", note: "reads aloud fluently", chip: "German" },
  { child: "Yusuf A.", note: "secure with numbers to 100", chip: "Maths" },
] as const;

/**
 * Szene B – Elternmail.
 *
 * Anrede und Signatur sind ECHTER TEXT und bleiben beim Sprachwechsel
 * unverändert stehen; nur die Inhaltszeilen bauen sich um. Genau das ist die
 * Aussage der Szene, und sie entspricht dem Produktstand: „Namen und Signatur
 * bleiben unangetastet."
 *
 * Die Inhaltszeilen selbst sind stilisierte Balken, kein türkischer Text –
 * eine Übersetzung auf der Website müsste jemand gegenlesen, und ein Fehler
 * darin fiele ausgerechnet der Zielgruppe auf.
 */
export const DEMO_PARENT_MAIL = {
  greeting: "Dear Mrs Kaya,",
  closing: "Kind regards",
  // Aus der Konstante, damit die Lehrkraft in allen Szenen dieselbe ist.
  signature: DEMO_TEACHER,
  stableNote: "Names & signature stay untouched",
  /** Angedeutete Sprachliste im Auswahlfeld. */
  dropdown: ["English", "Turkish", "Arabic", "Ukrainian"],
} as const;

/**
 * Szene C – Material aus dem Fachkorpus.
 *
 * Drei Fundstellen, von denen die Lehrkraft ZWEI auswählt. Die dritte bleibt
 * bewusst leer: Der Produktstand sagt ausdrücklich, dass die Fundstellen auch
 * selbst gewählt werden können, statt sie automatisch ziehen zu lassen.
 */
export const DEMO_MATERIAL = {
  /** Fach-Filter über den Fundstellen. Der erste Eintrag wird gewählt. */
  subjects: ["German", "Maths", "General studies"],
  topic: "Word classes, year 3",
  sources: [
    "Identifying word classes – worksheet",
    "Nouns, verbs, adjectives (year 3)",
    "Word classes workshop, part 2",
  ],
  documentTitle: "Worksheet: word classes",
  sourceNote: "Sources: [1], [2]",
} as const;

/**
 * Szene D – Entlastungsbericht der Schulleitung.
 *
 * WORTWAHL: „time gained" und „relief" sind zulässig. Das Wort „impact" kommt
 * in der ganzen Szene NICHT als Behauptung vor – nur die Erhebungs-Zeile
 * spricht über Befragungswerte, und sie weist die Zahl darüber ausdrücklich
 * als Schätzwert aus. Eingesparte Stunden sind eine Prozesskennzahl, kein
 * Wirkungsnachweis (docs/produktstand-2026-08.md).
 *
 * Kein Euro-Betrag: Die Grundlage sind hinterlegte Minutenannahmen, deshalb
 * steht `note` dauerhaft neben der Zahl.
 */
export const DEMO_RELIEF_REPORT = {
  month: "July 2026",
  previousMonth: "June",
  hours: 138,
  /** Automatisierungsquote in Prozent – laut Produktstand Teil des Berichts. */
  automationRate: 68,
  note: "Estimate",
  surveyLine: "Survey values: collection under way. The figure above is an estimate.",
  /** Balkenhöhen als Faktor für scaleY: laufender Monat und Vormonat. */
  currentBars: [0.68, 1, 0.44],
  previousBars: [0.5, 0.74, 0.3],
} as const;

/* ==========================================================================
   Kurzfassungen für die kleinen Szenen.
   --------------------------------------------------------------------------
   Dort ist die Bühne nur gut 110 px hoch. Die Texte sind deshalb deutlich
   kürzer als in der Hero-Szene – ein Gedanke je Szene, mehr passt nicht und
   mehr soll auch nicht.
   ========================================================================== */

/** Szene 1: eine Beobachtung, wie sie zwischen Tür und Angel entsteht. */
export const DEMO_QUICK_NOTE = {
  input: "Yusuf works confidently with numbers to 100 today.",
  chip: "Maths",
} as const;

/**
 * Szene 3: gewonnene Zeit im Entlastungsbericht.
 *
 * WORTWAHL IST HIER KEINE GESCHMACKSFRAGE. „Time gained" und „relief" sind
 * zulässig, „impact" NICHT: Eingesparte Stunden sind eine Prozesskennzahl,
 * kein Wirkungsnachweis. Die Trennung stammt aus
 * docs/produktstand-2026-08.md und gilt auch in Grafiken – gerade dort, weil
 * eine Zahl in einem Diagramm schneller als Beleg gelesen wird als ein Satz.
 *
 * `note` steht in der Szene dauerhaft neben der Zahl, nicht als Fussnote:
 * Die Grundlage sind hinterlegte Minutenannahmen, und die sind Schätzwerte.
 */
export const DEMO_RELIEF_MONTH = {
  hours: 14.5,
  unit: "hrs",
  note: "Estimate",
} as const;

/* ==========================================================================
 * SZENE „SITZPLAN"
 * ==========================================================================
 * Sechs Plaetze, besetzt mit demselben Cast wie ueberall. Ein Platz ist
 * gesperrt und bleibt leer – das ist die Funktion, die der Produktstand
 * ausdruecklich nennt („gesperrte Plaetze").
 *
 * Bewegt wird Lotta B. – NICHT Emma K. und nicht Yusuf A.: Die beiden tragen
 * schon die Beobachtungs- und die Chat-Szene. Wenn immer dasselbe Kind
 * angefasst wird, wirkt der Cast wie eine Person mit sechs Namen.
 *
 * KEIN Grund fuer den Umzug, weder im Bild noch im Label. Ein „sitzt jetzt
 * neben ..." waere eine paedagogische Aussage ueber ein Kind, und der
 * KI-Sitzplanvorschlag ist laut Produktstand ohnehin nur Prototyp.
 * ========================================================================== */
export const DEMO_SEATING = {
  /**
   * Raster 3 x 2, von links oben nach rechts unten.
   *   s3 ist GESPERRT – bleibt leer und traegt ein Schloss.
   *   s5 ist frei – dorthin wird gezogen.
   *   s4 sitzt Lotta B., das Kind, das umzieht.
   */
  seats: [
    { id: "s1", initials: "EK", locked: false },
    { id: "s2", initials: "YA", locked: false },
    { id: "s3", initials: null, locked: true },
    { id: "s4", initials: "LB", locked: false },
    { id: "s5", initials: null, locked: false },
    { id: "s6", initials: "FS", locked: false },
  ],
  /** Wer zieht um, von wo nach wo. */
  move: { initials: "LB", from: "s4", to: "s5" },
} as const;

/* ==========================================================================
 * TAKE A LOOK (/preview) – VORBEREITETE DATEN FÜR SIEBEN BEDIENBARE BEREICHE
 * ==========================================================================
 * Es gibt kein Backend. JEDER Text hier steht fertig; ein Klick waehlt aus,
 * er erzeugt nichts. Genau das sagt das Banner ueber dem Fenster.
 *
 * KEINE NEGATIVEN INHALTE ÜBER KINDER – die Regel aus dem Kopf dieser Datei
 * gilt hier besonders, weil ein Besucher jeden Eintrag einzeln aufklappt.
 * Alle Timeline-Eintraege beschreiben Gelingendes.
 *
 * Der Cast bleibt die 3b aus DEMO_CHILDREN.
 *
 * DATUMSFORMAT: „12 May", nicht „12.05." – docs/glossar-en.md, Abschnitt
 * „Sprache und Zahlen".
 * ========================================================================== */

/**
 * Drei vorbereitete Beobachtungen. Je Kind ein Zeugnistext UND eine zweite
 * Formulierung, dazu die Elternmail in drei Sprachen und eine Timeline.
 *
 * Produktstand-Deckung je Feld:
 *   note      -> „Beobachtungen strukturieren — Live"
 *   chips     -> ebenda (Fach, Kategorie)
 *   report    -> „Zeugnisbemerkungen — Live … im gelernten Schreibstil"
 *   report2   -> dieselbe Funktion, ein zweites Mal aufgerufen. Der
 *                Produktstand kennt keinen Knopf „andere Formulierung"; er
 *                kennt das Erzeugen von Texten. Die Karte beschriftet ihn
 *                deshalb als zweiten Entwurf, nicht als eigenes Feature.
 *   mail      -> „Elternmails, auf Wunsch übersetzt — Live … Namen und
 *                Signatur bleiben unangetastet"
 *   timeline  -> „Förderempfehlungen, Timeline, Klassenanalyse — Live"
 *
 * ==========================================================================
 * WARUM DIE AUSGANGSSPRACHE HIER ENGLISCH IST
 * --------------------------------------------------------------------------
 * Die deutsche Fassung zeigt vier Sprachen: DE (Original), EN, TR, AR. Auf
 * selyvi.com ist die gezeigte Oberflaeche englisch (en-review.md, Punkt 9) –
 * also ist die Ausgangssprache der Elternmail hier EN, und uebrig bleiben drei
 * Sprachen statt vier.
 *
 * KEINE VIERTE SPRACHE ERFUNDEN: Eine ukrainische oder polnische Zeile
 * muesste jemand gegenlesen, und ein Fehler darin faellt ausgerechnet der
 * Zielgruppe auf. Drei belegte Sprachen sind mehr wert als vier, von denen
 * eine ungeprueft ist. Die Auswahlliste im Produkt nennt weiterhin neun
 * Zielsprachen (TRANSLATION_LANGUAGES in src/config/product.ts).
 *
 * Die fremdsprachigen Zeilen bekommen in der Anzeige ein `lang`-Attribut.
 * Das ist WCAG 3.1.2 (Language of Parts) – und zugleich das, woran
 * scripts/german-check.mjs erkennt, dass diese Zeilen nicht englisch sein
 * sollen und deshalb nicht mitgeprueft werden.
 * ==========================================================================
 */
export const DEMO_TOUR_OBSERVATIONS = [
  {
    id: "emma",
    child: "Emma K.",
    initials: "EK",
    note: "Emma read to the class fluently today, first time — and she is trusting herself more.",
    chips: ["German · Reading", "Observation"],
    report:
      "Emma now reads to the class fluently and with assurance, and she trusts herself more as she does. Since May she has joined in German lessons of her own accord more and more often.",
    report2:
      "Emma reads to the class confidently and in a steady voice. She puts her hand up often in German lessons and brings her own thoughts into the discussion.",
    mail: {
      subject: "Emma in German lessons",
      lines: {
        en: [
          "Today Emma read aloud to the class fluently for the first time.",
          "She is visibly gaining confidence and joins in more often.",
        ],
        tr: [
          "Emma bugün ilk kez sınıfın önünde akıcı bir şekilde okudu.",
          "Kendine güveni görünür şekilde artıyor ve derse daha sık katılıyor.",
        ],
        ar: [
          "قرأت إيما اليوم أمام الصف بطلاقة لأول مرة.",
          "تزداد ثقتها بنفسها بوضوح وتشارك في الدرس بشكل أكبر.",
        ],
      },
    },
    timeline: [
      {
        date: "12 May",
        title: "Reads along in the reading circle",
        text: "Emma reads a passage aloud in the reading circle, and takes her time over it.",
      },
      {
        date: "3 Jul",
        title: "Reads aloud to the class",
        text: "Fluently, in front of the whole class, for the first time. She is trusting herself more.",
      },
      {
        date: "18 Sep",
        title: "Speaks up of her own accord",
        text: "Brings her own thoughts into the lesson discussion without being asked.",
      },
    ],
  },
  {
    id: "yusuf",
    child: "Yusuf A.",
    initials: "YA",
    note: "Yusuf works confidently with numbers to 100 and talks his method through with the girl next to him.",
    chips: ["Maths · Number range", "Observation"],
    report:
      "Yusuf works confidently with numbers up to 100. He explains his method in his own words, and that carries other children along with him.",
    report2:
      "Yusuf works reliably with numbers up to 100 and describes his solution clearly. That is how he helps the children sitting next to him.",
    mail: {
      subject: "Yusuf in maths lessons",
      lines: {
        en: [
          "Yusuf works confidently with numbers up to 100.",
          "He explains his approach and helps other children along the way.",
        ],
        tr: [
          "Yusuf 100'e kadar olan sayılarla güvenle işlem yapıyor.",
          "Çözüm yolunu anlatıyor ve böylece diğer çocuklara da yardımcı oluyor.",
        ],
        ar: [
          "يتعامل يوسف بثقة مع الأعداد حتى ١٠٠.",
          "يشرح طريقة حله ويساعد بذلك الأطفال الآخرين.",
        ],
      },
    },
    timeline: [
      {
        date: "22 Apr",
        title: "Breaks numbers down securely",
        text: "Yusuf breaks two-digit numbers down and talks the steps through out loud.",
      },
      {
        date: "9 Jun",
        title: "Helps at the next table",
        text: "Explains his method to another child, without giving the answer away.",
      },
      {
        date: "1 Oct",
        title: "Secure up to 100",
        text: "Works reliably with numbers up to 100, including across the tens boundary.",
      },
    ],
  },
  {
    id: "lotta",
    child: "Lotta B.",
    initials: "LB",
    note: "Lotta took charge of dividing up the tasks in group work, entirely off her own bat.",
    chips: ["Social behaviour", "Observation"],
    report:
      "Lotta takes charge in group work of her own accord and divides up the tasks thoughtfully. She makes a point of keeping every child involved.",
    report2:
      "Lotta organises group work on her own and keeps the whole group in view while she does. She sees to it that every child gets a task.",
    mail: {
      subject: "Lotta in group work",
      lines: {
        en: [
          "Lotta took charge of dividing up the tasks in group work.",
          "She makes sure that every child is involved.",
        ],
        tr: [
          "Lotta grup çalışmasında görev dağılımını üstlendi.",
          "Bütün çocukların katılmasına özen gösteriyor.",
        ],
        ar: [
          "تولّت لوتا توزيع المهام في العمل الجماعي.",
          "وتحرص على مشاركة جميع الأطفال.",
        ],
      },
    },
    timeline: [
      {
        date: "5 May",
        title: "Divides up the tasks",
        text: "Lotta hands the tasks out in the group, asking each child first.",
      },
      {
        date: "17 Jun",
        title: "Brings a quiet child in",
        text: "Brings in a child who usually holds back, and gives them a role.",
      },
      {
        date: "24 Sep",
        title: "Leads a group on her own",
        text: "Runs a piece of group work from start to finish without support.",
      },
    ],
  },
] as const;

export type DemoTourObservation = (typeof DEMO_TOUR_OBSERVATIONS)[number];

/**
 * Diktat. Produktstand: „Beobachtungen strukturieren — Live … Die
 * Spracheingabe laeuft ueber Whisper."
 *
 * Der Text laeuft Wort fuer Wort ein. Er steht hier fertig – es wird nichts
 * aufgenommen und nichts gesendet; der Browser fragt auch nicht nach dem
 * Mikrofon.
 */
export const DEMO_DICTATION =
  "Frida set her experiment up herself in general studies and talked us through it.";

/**
 * Sprachen des Umschalters in der Elternpost.
 *
 * Drei von neun – siehe die Begruendung ueber DEMO_TOUR_OBSERVATIONS. Die Zahl
 * neun steht als Badge daneben und kommt aus TRANSLATION_LANGUAGE_COUNT.
 * Arabisch laeuft von rechts nach links; die Anzeige setzt dafuer dir="rtl".
 *
 * `lang` traegt den BCP-47-Code fuer das ausgegebene Element: WCAG 3.1.2, und
 * die Marke, an der scripts/german-check.mjs fremdsprachige Zeilen ueberspringt.
 */
export const DEMO_MAIL_LANGS = [
  { key: "en", label: "EN", lang: "en", rtl: false },
  { key: "tr", label: "TR", lang: "tr", rtl: false },
  { key: "ar", label: "AR", lang: "ar", rtl: true },
] as const;

export type DemoMailLang = (typeof DEMO_MAIL_LANGS)[number]["key"];

/**
 * Material. Produktstand: „Unterrichtsmaterial aus echtem Fachwissen — Live
 * … Die Lehrkraft kann die Fundstellen auch selbst auswaehlen statt sie
 * automatisch ziehen zu lassen. Jedes erzeugte Material weist seine Quellen
 * aus."
 *
 * Genau diese beiden Saetze sind die zwei Interaktionen: Fundstellen
 * anhaken, und die Marker im Ergebnis aendern sich mit.
 */
export const DEMO_MATERIAL_TOPICS = [
  { id: "wortarten", label: "Identifying word classes", subject: "German" },
  { id: "zahlenraum", label: "Numbers to 100", subject: "Maths" },
  { id: "wasser", label: "The water cycle", subject: "General studies" },
] as const;

export const DEMO_MATERIAL_SOURCES = [
  { id: "q1", label: "Word classes worksheet", note: "Year 3, subject corpus" },
  { id: "q2", label: "Nouns and verbs reference sheet", note: "Year 3, subject corpus" },
  { id: "q3", label: "Word classes card box", note: "Year 4, subject corpus" },
] as const;

/** Der Ergebnis-Text. Die Marker verweisen auf die angehakten Fundstellen. */
export const DEMO_MATERIAL_RESULT = [
  "Task 1: Underline every noun in the text in blue.",
  "Task 2: Write the base form next to each verb.",
  "Task 3: Find three adjectives and compare them.",
] as const;

/**
 * Stundenplan. Produktstand: „Klassenstundenplan ohne Pflegeaufwand — Live …
 * eingetragen ueber einen Wochenplaner zum Anklicken und Ziehen. Wer bei
 * seinem Fach Zeiten hinterlegt, steht im Plan."
 *
 * Nur Anklicken, kein Ziehen: Ein Drag-and-drop braucht eine eigene
 * Touch-Behandlung, und ein Klick funktioniert auf jedem Geraet gleich.
 *
 * „timetable", nicht „schedule": „Schedule" ist US und mehrdeutig
 * (docs/glossar-en.md).
 *
 * SLOT-BESCHRIFTUNG KURZ GEHALTEN: „P1" statt „Period 1". Die Beschriftung
 * steht in der Kopfspalte eines 5-Spalten-Rasters; bei 390 px Breite bleiben
 * dafuer rund 40 px. „Period 1" bricht dort um und schiebt die Zeilenhoehe
 * auseinander. Die Langform steht als aria-label an der Zelle, damit sie
 * vorgelesen wird.
 */
export const DEMO_TIMETABLE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export const DEMO_TIMETABLE_SLOTS = ["P1", "P2", "P3", "P4"] as const;

/** Faecher, die die Lehrkraft setzen kann. */
export const DEMO_TIMETABLE_SUBJECTS = ["German", "Maths", "General studies"] as const;

/** Vorbelegung: Was schon im Plan steht, bevor jemand klickt. */
export const DEMO_TIMETABLE_PRESET: Record<string, string> = {
  "Mon-P1": "German",
  "Tue-P2": "Maths",
  "Wed-P1": "General studies",
  "Thu-P3": "German",
};

/**
 * Chat ueber die eigenen Daten. Produktstand: „Freie Fragen an die eigenen
 * Daten — Live … der Kontext wird serverseitig auf die eigenen Daten
 * begrenzt."
 *
 * Drei vorbereitete Fragen mit je einer Antwort und den Beobachtungen, auf
 * die sie sich stuetzt. Die Verweis-Chips sind der Punkt: Sie zeigen, DASS
 * die Antwort auf Eintraegen beruht.
 */
export const DEMO_CHAT = {
  questions: [
    {
      id: "lesen",
      text: "How has Emma come on in reading?",
      answer:
        "Emma now reads to the class fluently and with assurance, and she trusts herself more as she does. Since May she has joined in German lessons of her own accord more and more often.",
      references: ["Observation, 12 May", "Observation, 3 Jul"],
    },
    {
      id: "mathe",
      text: "Who likes explaining things to other children in maths?",
      answer:
        "Yusuf passes his method on regularly, most recently at the next table. He gives pointers rather than saying the answer out loud.",
      references: ["Observation, 22 Apr", "Observation, 9 Jun"],
    },
    {
      id: "gruppen",
      text: "Who takes on responsibility in group work?",
      answer:
        "Lotta divides the tasks up in group work of her own accord and makes sure everyone is involved. Most recently she ran a group on her own.",
      references: ["Observation, 5 May", "Observation, 24 Sep"],
    },
  ],
} as const;
