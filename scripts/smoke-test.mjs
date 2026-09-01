/**
 * Smoke-Test gegen ein Deployment der ENGLISCHEN Website.
 *
 * Aufruf:
 *   node scripts/smoke-test.mjs https://selyvi.com
 *   node scripts/smoke-test.mjs --gegenprobe      (ohne Deployment, s. u.)
 *
 * Prüft ohne Browser und ohne zusätzliche Pakete:
 *   1. Alle Seiten antworten mit 200 (404-Seite mit 404)
 *   2. Sicherheits-Header auf jeder Antwort
 *   3. Keine Verweise auf Google-Font-Server im ausgelieferten HTML/CSS
 *   4. noindex ausschließlich auf /privacy
 *   5. Sitemap und robots.txt erreichbar und konsistent
 *   6. Kein alter Produktname, keine Secret-Muster in der Ausgabe
 *   7. Ton-Regeln A bis D aus CLAUDE.md – in ENGLISCHER Fassung
 *   8. Verkaufssprache aus docs/glossar-en.md
 *   9. Die 308-Umleitungen von den deutschen Pfaden
 *  10. hreflang beidseitig: en, de, x-default
 *  11. <html lang> und og:locale
 *
 * Die Formular-Pfade lassen sich so nicht prüfen – Server Actions brauchen
 * einen Browser. Dafür gibt es scripts/formular-test.mjs (npm run
 * test:formular). Ob noch Deutsch ausgeliefert wird, prüft
 * scripts/german-check.mjs (npm run check:german).
 */

const arg = process.argv[2] || "";
const GEGENPROBE = arg === "--gegenprobe";
const base = GEGENPROBE ? "" : arg.replace(/\/$/, "");

if (!GEGENPROBE && !base) {
  console.error("Aufruf: node scripts/smoke-test.mjs <basis-url> | --gegenprobe");
  process.exit(1);
}

const PAGES = [
  "/",
  "/for-teachers",
  "/for-school-leadership",
  "/research",
  "/security",
  "/our-story",
  "/preview",
  "/co-create",
  "/meet",
  "/impressum",
  "/privacy",
];

/**
 * Die deutschen Pfade von selyvi.de und ihre englischen Ziele.
 *
 * Wortgleich mit der Liste in next.config.ts. Wer dort einen Pfad ergaenzt,
 * ergaenzt ihn hier – sonst faellt eine fehlende Umleitung erst auf, wenn
 * jemand einen alten Link aus einer Praesentation anklickt.
 */
const REDIRECTS = [
  ["/fuer-lehrkraefte", "/for-teachers"],
  ["/produkt", "/for-teachers"],
  ["/schulen", "/for-school-leadership"],
  ["/forschung", "/research"],
  ["/datenschutz-sicherheit", "/security"],
  ["/ueber-uns", "/our-story"],
  ["/demo", "/meet"],
  ["/mitgestalten", "/co-create"],
  ["/einblick", "/preview"],
  // Umgekehrte Richtung als in der ersten Runde: /impressum IST die Seite,
  // /legal-notice leitet dorthin.
  ["/legal-notice", "/impressum"],
  ["/datenschutz", "/privacy"],
];

const REQUIRED_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "x-frame-options": "DENY",
};

let problems = 0;
const fail = (msg) => {
  problems++;
  console.log("   FEHLER: " + msg);
};

const get = async (path) => {
  const res = await fetch(base + path, { redirect: "manual" });
  return { res, body: await res.text() };
};

/* ==========================================================================
 * TON-REGELN A BIS D UND VERKAUFSSPRACHE – ENGLISCHE FASSUNG
 * ==========================================================================
 * Die Regeln stehen in CLAUDE.md, die Wortliste in docs/glossar-en.md.
 *
 * Die deutschen Muster der Schwester-Website liessen sich nicht uebersetzen,
 * sie mussten NEU GEBAUT werden: „noch nicht" faengt im Deutschen die
 * Selbstauskunft ueber Unwissen; das englische „not yet" faengt sie ebenso,
 * aber „yet" allein kommt auch harmlos vor. Die Muster sind deshalb enger
 * gefasst als ihre deutschen Vorbilder.
 *
 * Geprueft wird der SICHTBARE TEXT plus alle aria-labels und die
 * Meta-Description – also genau das, was ein Mensch liest oder vorgelesen
 * bekommt. Skripte, Style-Bloecke und Klassennamen fallen vorher weg, sonst
 * meldet ein Tailwind-Utility wie „not-sr-only" falschen Alarm.
 *
 * Die Muster sind bewusst eng. Eine definitive Aussage ueber eine gewollte
 * Produktgrenze („There is deliberately no parent portal") ist erlaubt und
 * darf hier nicht haengenbleiben; verboten ist die Selbstauskunft ueber
 * Unwissen.
 *
 * Die Liste steht auf MODULEBENE, damit die Gegenprobe weiter unten dieselben
 * Muster prueft und keine Kopie davon. Eine Kopie waere genau die Stelle, an
 * der eine geaenderte Regel unbemerkt ungeprueft bliebe.
 *
 * Jeder Eintrag: [Muster, Regel, Beschreibung, Beispielsatz]. Der
 * Beispielsatz MUSS vom Muster gefangen werden – genau das prueft
 * `--gegenprobe`.
 * ========================================================================== */
const RULES = [
  /* ---- A – dem Leser zuschreiben, wer er ist, was er tut oder warum ---- */
  [
    /\byou became a teacher\b/i,
    "A",
    "„you became a teacher …“",
    "You became a teacher to teach, not to do admin.",
  ],
  [
    /\byou went into teaching (to|because)\b/i,
    "A",
    "„you went into teaching to …“",
    "You went into teaching to be with children.",
  ],
  [
    /\bas a (teacher|head teacher|researcher)[^.?!]{0,20}\byou (know|knows)\b/i,
    "A",
    "„as a teacher you know …“",
    "As a teacher you know how long report day takes.",
  ],
  [
    /\byou didn['’]?t become\b/i,
    "A",
    "„you didn’t become …“",
    "You didn’t become a teacher for the paperwork.",
  ],
  [
    /\byou surely want\b|\byou do want\b/i,
    "A",
    "„you surely want …“",
    "You surely want your evenings back.",
  ],
  [
    /\byou (lack|are missing|are short of)\b/i,
    "A",
    "„you lack …“",
    "You lack the time to document properly.",
  ],
  [
    /\bdo you (teach|lead|research|check|need|want|struggle)\b[^.?!]{0,60}\?/i,
    "A",
    "Frage, die dem Leser sein Tun zuschreibt",
    "Do you teach a primary class and lose your evenings?",
  ],

  /* ---- B – klingen, als wuessten wir nicht, was das Produkt kann ---- */
  [/\bnot yet\b/i, "B", "„not yet“", "The interface is not yet finished."],
  [/\bnothing yet\b/i, "B", "„nothing yet“", "We can show nothing yet."],
  [/\bno .{0,20}\byet\b/i, "B", "„no … yet“", "There are no results yet."],
  [
    /\bwe (can['’]?t|cannot) say\b/i,
    "B",
    "„we cannot say“",
    "We cannot say whether it helps.",
  ],
  [
    /\bwe don['’]?t know (whether|if|yet)\b/i,
    "B",
    "„we don’t know whether …“",
    "We don’t know whether that lands.",
  ],
  [
    /\bnothing can be said\b/i,
    "B",
    "„nothing can be said“",
    "So far nothing can be said about impact.",
  ],
  [
    /\bwe (do not|don['’]?t) claim\b/i,
    "B",
    "„we do not claim“",
    "We do not claim that this works.",
  ],

  /* ====================================================================
   * ZWEI MUSTER SIND ENGER, ALS SIE ANFANGS AUSSAHEN – BEIDES GEMESSEN
   * ====================================================================
   * Die erste Fassung lautete /\bis (still )?(open|undecided|unclear)\b/
   * und /\bstill missing\b|\bis missing\b/. Beide haben auf Saetzen
   * angeschlagen, die CLAUDE.md unter Regel B AUSDRUECKLICH ERLAUBT –
   * gefunden im ersten Lauf gegen den echten Build, nicht am Schreibtisch:
   *
   *   „What is open we mark visibly"  -> /our-story. Regel B sagt:
   *      „Offenes wird GEKENNZEICHNET" ist Pflicht, nicht verboten.
   *      Untersagt ist die Selbstauskunft ueber Unwissen, nicht das
   *      Kennzeichnen eines offenen Punktes.
   *   „Tell us what is missing."      -> /for-teachers. Das ist eine
   *      Einladung an die Leserin, keine Aussage ueber unser Produkt.
   *
   * Gefangen wird deshalb nur noch die Selbstauskunft: etwas von UNS ist
   * ungeklaert oder fehlt noch. Die deutschen Vorbilder sind „steht noch
   * nicht fest" und „fehlt noch" – nicht „offener Punkt".
   * ==================================================================== */
  [
    /\b(is|are) still (undecided|unclear|being decided)\b/i,
    "B",
    "„is still undecided“",
    "The pricing is still undecided.",
  ],
  [
    /\b(has|have|is|are) not (yet )?been decided\b/i,
    "B",
    "„has not been decided“",
    "The rollout date has not been decided.",
  ],
  [/\bstill missing\b/i, "B", "„still missing“", "The interface is still missing."],
  [
    /\b(the|our) [a-z ]{0,24}(is|are) missing\b/i,
    "B",
    "„our … is missing“",
    "Our subject corpus is missing several years.",
  ],
  [
    /\bremains to be seen\b/i,
    "B",
    "„remains to be seen“",
    "Whether it helps remains to be seen.",
  ],

  /* ---- C – Reifegrad-Defizite, die niemand von uns verlangt hat ---- */
  [
    /\bno (pilot|reference) schools?\b/i,
    "C",
    "„no pilot / reference schools“",
    "There are no pilot schools so far.",
  ],
  [
    /\bnot? (yet )?(any )?references?\b/i,
    "C",
    "„no references“",
    "We have no references to show.",
  ],
  [
    // Die erste Fassung verlangte „we have been ONLY since" unmittelbar
    // hintereinander und hat ihren eigenen Beispielsatz nicht gefangen –
    // gefunden von der Gegenprobe unten, nicht von einem Menschen. Zwischen
    // „we have been" und „only since" steht in echten Saetzen fast immer noch
    // ein Wort. Genau dafuer gibt es die Gegenprobe.
    /\bwe (are|have been)\b[^.?!]{0,30}\bonly (since|for)\b/i,
    "C",
    "„we have been … only since …“",
    "We have been building only since last year.",
  ],
  [
    /\bonly (since|founded in)\b/i,
    "C",
    "„only since …“",
    "Selyvi exists only since 2025.",
  ],
  [/\bsmall team\b/i, "C", "„small team“", "We are a small team from Stuttgart."],
  [
    /\b(young|new) (company|start-?up)\b/i,
    "C",
    "„young company“",
    "As a young company we move fast.",
  ],
  [/\bearly[- ]stage\b/i, "C", "„early-stage“", "This is an early-stage product."],
  // Nur die VERNEINUNG faengt das Muster. „ISO 27001 certified" waere eine
  // Zusage und faellt unter die Wahrheitsquelle, nicht unter den Ton.
  [
    /\b(not|without|no)\b[^.!?]{0,30}\bcertifi/i,
    "C",
    "Zertifikats-Geständnis",
    "We are not yet ISO 27001 certified.",
  ],
  [
    /\bprices are (currently )?being set with\b/i,
    "C",
    "„prices are being set with pilot schools“",
    "Prices are currently being set with pilot schools.",
  ],
  [
    /\bmore schools than\b/i,
    "C",
    "Anzahl der Schulen als Mangel",
    "We do not have more schools than you would expect.",
  ],

  /* ---- D – Zukunftsform ueber die Produktreife ----
   *
   * Zwei Muster sind bewusst ENG gefasst, weil das Wort auch harmlos
   * vorkommt:
   *   „follow(s)"   – temporal verboten, logisch erlaubt („the analysis
   *                   follows a codebook"). Gefangen wird nur das temporale
   *                   „follows later / soon / shortly".
   *   „being built" – „Selyvi is being built in the middle of everyday school
   *                   life" auf /research beschreibt die ENTSTEHUNG, nicht
   *                   eine fehlende Funktion. Der negative Lookahead nimmt
   *                   genau diesen Satz aus.
   */
  [/\bis planned\b|\bare planned\b/i, "D", "„is planned“", "An export is planned."],
  [
    /\bplanned (feature|interface|integration|expansion)/i,
    "D",
    "„planned feature“",
    "A planned feature is the parent portal.",
  ],
  [/\bin progress\b/i, "D", "„in progress“", "The rollout is in progress."],
  [
    /\b(in|under) development\b/i,
    "D",
    "„in development“",
    "The leadership view is in development.",
  ],
  [
    /\bbeing built\b(?! in the middle)/i,
    "D",
    "„being built“",
    "The export is being built right now.",
  ],
  [/\bcoming soon\b/i, "D", "„coming soon“", "More school types coming soon."],
  [
    /\bshortly\b|\bin the near future\b/i,
    "D",
    "„shortly / in the near future“",
    "We will publish the list shortly.",
  ],
  [
    /\bin preparation\b/i,
    "D",
    "„in preparation“",
    "The subprocessor list is in preparation.",
  ],
  [
    /\bbefore (the )?(product )?launch\b/i,
    "D",
    "„before launch“",
    "That happens before the product launch.",
  ],
  [
    /\broll-?out (is (still )?)?(pending|open|outstanding)\b/i,
    "D",
    "„rollout pending“",
    "The rollout is still pending.",
  ],
  [/\bprototype\b/i, "D", "„prototype“", "The seating suggestion is a prototype."],
  [
    /\bfollows? (later|soon|shortly|afterwards|at a later)/i,
    "D",
    "temporales „follows later“",
    "The documentation follows later.",
  ],
  [
    /\b(is|are) (still )?(pending|outstanding)\b/i,
    "D",
    "„is pending“",
    "The legal review is still pending.",
  ],
  [
    /\bwill (soon|shortly) (be|have)\b/i,
    "D",
    "„will soon be“",
    "The servers will soon be in Germany.",
  ],

  /* ---- V – Verkaufssprache (docs/glossar-en.md) ----
   *
   * Dieselbe Disziplin wie im Deutschen, nur mit anderen Woertern. Der Grund
   * ist unveraendert: Wir sprechen mit Menschen in einem sozialen Beruf,
   * nicht mit Kaeufern.
   */
  [/\bunlock\b/i, "V", "„unlock“", "Unlock your evenings."],
  [/\bsupercharge\b/i, "V", "„supercharge“", "Supercharge your reporting."],
  [/\bgame[- ]changer\b/i, "V", "„game-changer“", "A real game-changer for schools."],
  [
    /\brevolutionis|revolutioniz/i,
    "V",
    "„revolutionise“",
    "We revolutionise the school day.",
  ],
  [/\bseamless\b/i, "V", "„seamless“", "A seamless workflow."],
  [/\beffortless\b/i, "V", "„effortless“", "Effortless documentation."],
  [/\bcutting[- ]edge\b/i, "V", "„cutting-edge“", "Cutting-edge AI for schools."],
  [/\bbest[- ]in[- ]class\b/i, "V", "„best-in-class“", "Best-in-class support."],
  [/\bfree trial\b/i, "V", "„free trial“", "Start your free trial today."],
  [/\bsign up now\b/i, "V", "„sign up now“", "Sign up now and save time."],
  [/\bboost\b/i, "V", "„boost“", "Boost your teaching quality."],
  [/\bempower\b/i, "V", "„empower“", "We empower teachers."],
  [/\bleverage\b/i, "V", "„leverage“", "Leverage your own observations."],
  [/\bdelight\b/i, "V", "„delight“", "A tool that will delight your staff."],

  /* ---- G – US-Begriffe, die docs/glossar-en.md ausschliesst ----
   *
   * Kein Ton-Verstoss, sondern ein Uebersetzungsfehler – aber genau hier
   * faellt er auf, weil das Skript ohnehin ueber jeden Satz laeuft.
   */
  [
    /\belementary school\b/i,
    "G",
    "US-Begriff „elementary school“ statt „primary school“",
    "Selyvi is built for elementary school.",
  ],
  [
    /\bprincipal\b/i,
    "G",
    "US-Begriff „principal“ statt „head teacher“",
    "The principal signs the agreement.",
  ],
  [
    /\bfaculty\b/i,
    "G",
    "US-Hochschulsprache „faculty“ statt „staff“",
    "The whole faculty uses it.",
  ],
  [
    /\breport card comment\b/i,
    "G",
    "US-Begriff „report card comment“ statt „report comment“",
    "A report card comment in your style.",
  ],
];

/**
 * Ausnahmen von Regel D, abschliessend (CLAUDE.md):
 *   - PRODUCT_HOSTING_NOTE: der Serverstandort, die einzige erlaubte
 *     Einschraenkung. Enthaelt „in preparation".
 *   - SCHOOL_TYPE_ANSWER: „More school types follow." Ausbau, keine Reife –
 *     von CEO und CMO so gewollt.
 * Beide werden vor der Pruefung aus dem Text geschnitten. Wer den Wortlaut in
 * src/config/product.ts bzw. src/config/brand.ts aendert, aendert ihn hier mit.
 */
const AUSNAHMEN = [
  "Before we work with real pupil data, the product servers move to Germany and every school has a data processing agreement in place — both are in preparation.",
  "More school types follow.",
];

/* ==========================================================================
 * GEGENPROBE – BEWEIST, DASS DIE MUSTER LEBEN
 * ==========================================================================
 * Ein Ton-Test, der 0 Treffer meldet, kann zweierlei bedeuten: Der Text ist
 * sauber, ODER die Muster greifen nicht mehr. Nach dem Umbau ins Englische
 * ist die zweite Moeglichkeit real – neu geschriebene regulaere Ausdruecke
 * sind ebenso viele Gelegenheiten fuer einen Tippfehler, der still durchgeht.
 *
 * Die Gegenprobe schliesst diese Luecke von beiden Seiten:
 *
 *   1. Zu JEDER Regel steht ein Satz, den sie fangen MUSS. Faengt sie ihn
 *      nicht, ist die Regel tot und der Lauf schlaegt fehl.
 *   2. Fuenf Saetze, die von dieser Website stammen und ausdruecklich ERLAUBT
 *      sind, duerfen KEINE Regel ausloesen. Das ist die Richtung, aus der die
 *      beiden Regel-B-Muster oben eingelaufen sind.
 *
 * Aufruf ohne Deployment: node scripts/smoke-test.mjs --gegenprobe
 * ========================================================================== */
const ERLAUBTE_SAETZE = [
  // Regel B erlaubt das Kennzeichnen offener Punkte ausdruecklich.
  "What is open we mark visibly, instead of glossing over it.",
  // Eine Einladung an die Leserin, keine Selbstauskunft.
  "Tell us what is missing.",
  // Eine definitive Aussage ueber eine gewollte Produktgrenze.
  "There is deliberately no parent or pupil portal.",
  // Logisches „follows", kein temporales.
  "The analysis follows a codebook fixed in advance.",
  // Die Entstehungs-Aussage auf /research – deshalb der Lookahead im D-Muster.
  "Selyvi is being built in the middle of everyday school life.",
];

if (GEGENPROBE) {
  console.log("Gegenprobe der Ton-Regeln – ohne Deployment\n");

  let tot = 0;
  console.log("=== Jede Regel muss ihren Beispielsatz fangen ===");
  for (const [pattern, rule, name, beispiel] of RULES) {
    if (beispiel === undefined) {
      tot++;
      console.log(`   FEHLER: Regel ${rule} „${name}" hat keinen Beispielsatz`);
      continue;
    }
    if (!pattern.test(beispiel)) {
      tot++;
      console.log(`   FEHLER: Regel ${rule} „${name}" fängt „${beispiel}" NICHT`);
    }
  }
  console.log(`  ${RULES.length} Regeln geprüft, ${tot} tot`);

  let falsch = 0;
  console.log("\n=== Erlaubte Sätze dürfen KEINE Regel auslösen ===");
  for (const satz of ERLAUBTE_SAETZE) {
    for (const [pattern, rule, name] of RULES) {
      if (pattern.test(satz)) {
        falsch++;
        console.log(`   FEHLER: „${satz}" löst Regel ${rule} („${name}") aus`);
      }
    }
  }
  console.log(`  ${ERLAUBTE_SAETZE.length} erlaubte Sätze geprüft, ${falsch} Fehlalarme`);

  console.log("\n==========================================================");
  console.log(`Tote Regeln:  ${tot}`);
  console.log(`Fehlalarme:   ${falsch}`);
  console.log("==========================================================");
  console.log(tot + falsch === 0 ? "GEGENPROBE BESTANDEN" : "GEGENPROBE FEHLGESCHLAGEN");
  process.exit(tot + falsch === 0 ? 0 : 1);
}

console.log("Smoke-Test gegen " + base + "\n");

// --- 1 + 2 + 4: Seiten, Header, noindex ---
console.log("=== Seiten, Header, noindex ===");
for (const path of PAGES) {
  const { res, body } = await get(path);

  if (res.status !== 200) fail(`${path} antwortet mit ${res.status}`);

  const missing = Object.entries(REQUIRED_HEADERS).filter(
    ([key, value]) => res.headers.get(key) !== value,
  );
  if (missing.length) {
    fail(`${path}: Header falsch oder fehlend – ${missing.map(([k]) => k).join(", ")}`);
  }

  const robots = body.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? null;
  const shouldNoindex = path === "/privacy";
  if (shouldNoindex && robots !== "noindex") {
    fail(`${path} sollte noindex tragen, hat aber: ${robots ?? "kein robots-Meta"}`);
  }
  if (!shouldNoindex && robots !== null) {
    fail(`${path} trägt unerwartet robots="${robots}"`);
  }

  console.log(`  ${path.padEnd(26)} ${res.status}  Header ok  robots=${robots ?? "–"}`);
}

// --- 11: Sprachauszeichnung des Dokuments ---
console.log("\n=== <html lang> und og:locale ===");
{
  const { body } = await get("/");
  const lang = body.match(/<html[^>]+lang="([^"]*)"/)?.[1] ?? null;
  if (lang !== "en") fail(`<html lang> ist „${lang ?? "nicht gesetzt"}" statt „en"`);

  const locale = body.match(/<meta property="og:locale" content="([^"]*)"/)?.[1] ?? null;
  if (locale !== "en_GB") {
    fail(`og:locale ist „${locale ?? "nicht gesetzt"}" statt „en_GB"`);
  }
  console.log(`  <html lang>: ${lang}`);
  console.log(`  og:locale:   ${locale}`);
}

// --- 10: hreflang beidseitig ---
//
// Vollstaendig heisst DREI Angaben je Seite: en (sie selbst), de (die deutsche
// Entsprechung auf selyvi.de) und x-default. Fehlt eine, wertet Google die
// Auszeichnung als unvollstaendig und ignoriert sie – dann konkurrieren
// selyvi.com und selyvi.de um dieselbe Suchanfrage, statt sich zu ergaenzen.
//
// /impressum ist ausgenommen und traegt bewusst KEINE Alternates: Die Seite ist
// deutsch (siehe src/config/legal.ts), und hreflang="en" auf einer deutschen
// Seite waere eine Falschangabe. Geprueft wird stattdessen, dass dort wirklich
// keine stehen.
console.log("\n=== hreflang ===");
const HREFLANG_PAGES = PAGES.filter((p) => p !== "/impressum");
{
  const { body } = await get("/impressum");
  if (/<link rel="alternate" hrefLang=/i.test(body)) {
    fail("/impressum trägt hreflang, obwohl die Seite deutsch ist");
  }
}
for (const path of HREFLANG_PAGES) {
  const { body } = await get(path);
  const alternates = Object.fromEntries(
    [...body.matchAll(/<link rel="alternate" hrefLang="([^"]*)" href="([^"]*)"/gi)].map(
      (m) => [m[1].toLowerCase(), m[2]],
    ),
  );

  const fehlend = ["en", "de", "x-default"].filter((k) => !alternates[k]);
  if (fehlend.length) {
    fail(`${path}: hreflang unvollständig – fehlt ${fehlend.join(", ")}`);
    continue;
  }

  if (!alternates.en.startsWith("https://selyvi.com")) {
    fail(`${path}: hreflang en zeigt nicht auf selyvi.com – ${alternates.en}`);
  }
  if (!alternates.de.startsWith("https://selyvi.de")) {
    fail(`${path}: hreflang de zeigt nicht auf selyvi.de – ${alternates.de}`);
  }
  if (alternates["x-default"] !== alternates.en) {
    fail(`${path}: x-default weicht von en ab`);
  }
}
console.log(
  `  ${HREFLANG_PAGES.length} Seiten geprüft: en, de und x-default vorhanden`,
);
console.log("  /impressum: bewusst ohne hreflang (deutsche Seite)");

// --- 9: Umleitungen der deutschen Pfade ---
console.log("\n=== Umleitungen der deutschen Pfade ===");
for (const [von, nach] of REDIRECTS) {
  const { res } = await get(von);
  if (res.status !== 308) {
    fail(`${von} antwortet mit ${res.status} statt 308`);
    continue;
  }
  const ziel = res.headers.get("location") ?? "";
  const pfad = ziel.startsWith("http") ? new URL(ziel).pathname : ziel;
  if (pfad !== nach) fail(`${von} zeigt auf „${pfad}" statt „${nach}"`);
}
console.log(`  ${REDIRECTS.length} deutsche Pfade, alle 308 auf ihr englisches Ziel`);

// --- 404 ---
console.log("\n=== 404-Seite ===");
{
  const { res } = await get("/diese-seite-gibt-es-nicht");
  if (res.status !== 404) fail(`404-Seite antwortet mit ${res.status} statt 404`);
  console.log(`  /diese-seite-gibt-es-nicht  ${res.status}`);
}

// --- 3: keine Google-Fonts ---
console.log("\n=== Schriften ===");
{
  const { body } = await get("/");
  const cssHrefs = [...body.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
  let googleHits = 0;
  const sources = [body];
  for (const href of cssHrefs) {
    const { body: css } = await get(href.startsWith("http") ? href : href);
    sources.push(css);
  }
  for (const src of sources) {
    googleHits += (src.match(/fonts\.(gstatic|googleapis)\.com/g) ?? []).length;
  }
  if (googleHits > 0) fail(`${googleHits} Verweise auf Google-Font-Server gefunden`);
  const local = (sources.join("").match(/\/_next\/static\/media\/[^"')]+\.woff2/g) ?? [])
    .length;
  console.log(`  Google-Font-Verweise: ${googleHits}`);
  console.log(`  Lokale woff2-Verweise: ${local}`);
  if (local === 0) fail("keine lokal ausgelieferten Schriftdateien gefunden");
}

// --- 5: Sitemap und robots.txt ---
console.log("\n=== Sitemap und robots.txt ===");
{
  const { res: sRes, body: sitemap } = await get("/sitemap.xml");
  if (sRes.status !== 200) fail(`sitemap.xml antwortet mit ${sRes.status}`);
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = locs.map((u) => new URL(u).pathname);
  console.log("  Sitemap: " + paths.join(", "));
  if (paths.includes("/privacy")) fail("/privacy steht in der Sitemap");
  if (!paths.includes("/impressum")) fail("/impressum fehlt in der Sitemap");
  // Kein deutscher Pfad darf in die Sitemap geraten – sie sind Umleitungen,
  // keine Seiten.
  const deutsche = paths.filter((p) => REDIRECTS.some(([von]) => von === p));
  if (deutsche.length) fail(`deutsche Pfade in der Sitemap: ${deutsche.join(", ")}`);

  // Jede Adresse muss auf selyvi.com zeigen, nicht auf das Vorschau-Deployment:
  // Eine Sitemap mit *.vercel.app-Adressen laedt Suchmaschinen ein, die
  // Vorschau zu indexieren.
  const fremde = locs.filter((u) => !u.startsWith("https://selyvi.com"));
  if (fremde.length) fail(`Sitemap-Adressen ausserhalb selyvi.com: ${fremde.length}`);

  const { res: rRes, body: robots } = await get("/robots.txt");
  if (rRes.status !== 200) fail(`robots.txt antwortet mit ${rRes.status}`);
  if (!robots.includes("Sitemap:")) fail("robots.txt ohne Sitemap-Verweis");
  if (/Disallow:\s*\//.test(robots)) fail("robots.txt enthält ein Disallow");
  console.log("  robots.txt: Sitemap-Verweis vorhanden, kein Disallow");
}

// --- 6: keine Altlasten, keine Secrets in der Ausgabe ---
console.log("\n=== Ausgabe-Hygiene ===");
{
  let stale = 0;
  let secrets = 0;
  for (const path of PAGES) {
    const { body } = await get(path);
    stale += (body.match(/Produktname|PRODUKTNAME/g) ?? []).length;
    secrets += (body.match(/xkeysib-|BREVO_API_KEY|WEBSITE_INBOUND_KEY/g) ?? []).length;
  }
  if (stale > 0) fail(`alter Produktname erscheint ${stale}× im HTML`);
  if (secrets > 0) fail(`Secret-Muster erscheint ${secrets}× im HTML`);
  console.log(`  Alter Produktname: ${stale}`);
  console.log(`  Secret-Muster:     ${secrets}`);
}

// --- 7 + 8: Ton-Regeln und Verkaufssprache ---
console.log("\n=== Ton-Regeln A bis D (englisch) ===");
{
  // Die Rechtstexte sind Vorlagentexte nach § 5 DDG und Art. 13 DSGVO und
  // werden nicht nach Marketing-Ton umgeschrieben. /impressum ist ausserdem
  // deutsch – die englischen Muster haetten dort ohnehin nichts zu suchen.
  const TON_PAGES = PAGES.filter((p) => p !== "/privacy" && p !== "/impressum");

  let hits = 0;
  for (const path of TON_PAGES) {
    const { body } = await get(path);

    const labels = [...body.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]);
    const description =
      body.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    const visible = body
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ");

    let text = [visible, ...labels, description]
      .join(" ")
      .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, " ");

    // Die beiden erlaubten Saetze herausschneiden, bevor die Muster laufen.
    for (const satz of AUSNAHMEN) text = text.split(satz).join(" ");

    for (const [pattern, rule, name] of RULES) {
      if (pattern.test(text)) {
        hits++;
        fail(`${path}: Regel ${rule} verletzt – ${name}`);
      }
    }
  }
  console.log(`  ${TON_PAGES.length} Seiten geprüft, ${RULES.length} Muster je Seite`);
  console.log(`  Treffer: ${hits}`);
}

console.log(
  "\n" + (problems === 0 ? "SMOKE-TEST BESTANDEN" : problems + " PROBLEM(E) GEFUNDEN"),
);
console.log("Nicht abgedeckt:");
console.log("  – die Formular-Pfade   -> npm run test:formular (Browser)");
console.log("  – verbliebenes Deutsch -> npm run check:german <url>");
console.log("  – ob die Muster leben  -> npm run smoke -- --gegenprobe");
process.exit(problems === 0 ? 0 : 1);
