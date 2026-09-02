import { ImageResponse } from "next/og";

import { PRODUCT_NAME } from "@/config/brand";

/**
 * Open-Graph-Bild, 1200×630.
 *
 * Liegt in der Wurzel von src/app und gilt damit für ALLE Seiten – ein
 * statisches Template, wie abgestimmt. Die seitenspezifischen Texte stehen in
 * og:title und og:description; das Bild selbst bleibt gleich.
 *
 * KEIN Foto und kein nachgebauter Screenshot. Ein Vorschaubild, das eine
 * Oberfläche zeigt, die es so nicht gibt, ist dieselbe Sorte Behauptung wie
 * ein erfundenes Testimonial – nur prominenter, weil es in jedem geteilten
 * Link auftaucht.
 *
 * Schrift: Der Renderer nutzt eine System-Sans, nicht IBM Plex. Für ein
 * Platzhalter-Bild vertretbar; beim Austausch gegen ein gestaltetes Motiv
 * erübrigt sich der Punkt.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${PRODUCT_NAME} – the AI assistant for teachers`;

// Tokens als Literale: ImageResponse rendert ausserhalb des Dokuments und
// kennt die CSS-Variablen aus globals.css nicht.
const BRAND_800 = "#015b97";
const BRAND_100 = "#c7ecff";
const SURFACE = "#ffffff";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BRAND_800,
        padding: "80px",
        position: "relative",
      }}
    >
      {/* Dezente Akzentflächen, angeschnitten – keine Verläufe. */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          backgroundColor: BRAND_100,
          opacity: 0.14,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-160px",
          right: "180px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: BRAND_100,
          opacity: 0.1,
        }}
      />

      <div style={{ display: "flex", fontSize: 34, color: BRAND_100, letterSpacing: 1 }}>
        {PRODUCT_NAME}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 600,
            color: SURFACE,
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          Less admin. More teaching.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: 32,
            color: BRAND_100,
            maxWidth: "820px",
          }}
        >
          The AI assistant for teachers, from year 1 to upper secondary.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          height: "8px",
          width: "160px",
          backgroundColor: BRAND_100,
        }}
      />
    </div>,
    size,
  );
}
