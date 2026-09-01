/**
 * Team-Daten für /our-story.
 *
 * WICHTIG – Personenfreigabe:
 * Namen, Funktionen und Fotos realer Personen auf einer oeffentlichen Website
 * duerfen erst erscheinen, wenn die jeweilige Person der Nennung zugestimmt
 * hat. Das ist keine Formalie: Es geht um personenbezogene Daten, und eine
 * Website, die auf ihrer eigenen Datenschutzseite Sorgfalt verspricht, kann
 * schlecht ungefragt Mitarbeitende auflisten.
 *
 * STAND: Alle drei Personen haben der Nennung zugestimmt (`approved: true`).
 * Die Zustimmung deckt auch die Erwaehnung beim Vornamen im Erzaehltext auf
 * /our-story ab.
 *
 * `description` ist je Person leer und wird schlicht nicht gerendert. Sobald
 * eine Person einen Satz ueber sich freigibt, hier eintragen – erfundene
 * Beschreibungen kommen nicht hinein. Siehe README, NACH-LAUNCH-LISTE.
 *
 * Fotos fehlen weiterhin; darauf weist die Sektion im Fliesstext hin, dafuer
 * braucht es keinen Marker.
 *
 * Ergaenzungen sind bewusst trivial: eine weitere Zeile in diesem Array.
 */
export type TeamMember = {
  name: string;
  /** Funktion in Klartext, englisch – z. B. "Managing director (CEO)". */
  role: string;
  /** Initialen fuer den Platzhalter-Avatar, ein bis drei Zeichen. */
  initials: string;
  /**
   * Ein Satz zur Person. Bleibt leer, bis die Person ihn selbst freigegeben
   * hat – erfundene Beschreibungen kommen hier nicht hinein.
   */
  description: string;
  /** Liegt die Freigabe der Person fuer Nennung und Beschreibung vor? */
  approved: boolean;
};

export const team: TeamMember[] = [
  {
    name: "Christian Karl Lange",
    role: "Managing director (CEO)",
    initials: "CL",
    description: "",
    approved: true,
  },
  {
    name: "Tobias Haaga",
    role: "Engineering (CTO)",
    initials: "TH",
    description: "",
    approved: true,
  },
  {
    // Voller Name auf eigenen Wunsch. Die Initialen bleiben „RG": Sie stehen
    // fuer Vor- und Nachnamen, der Mittelname zaehlt dafuer nicht mit.
    name: "Rafael René Gutmann",
    role: "Marketing (CMO)",
    initials: "RG",
    description: "",
    approved: true,
  },
];
