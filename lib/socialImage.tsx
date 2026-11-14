import { ImageResponse } from "next/og";
import { neuralConnections, neuralNodes } from "@/components/neuralCoreGeometry";

export const socialImageSize = { width: 1200, height: 630 };
export const socialImageAlt = "Sergio Carey — Ingeniero en Informática: software, IA aplicada y automatización";

// Núcleo neuronal proyectado (misma geometría del Hero) para la imagen social.
const CX = 905;
const CY = 315;
const SCALE = 190;
const points = neuralNodes.map(({ position: [x, y, z], color, size }) => {
  const depth = 5.1 / (5.1 - z);
  return { x: CX + x * SCALE * depth, y: CY - y * SCALE * depth, r: Math.max(5, size * SCALE * depth * 0.9), color };
});

export function renderSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#04060a",
          color: "#e8eef6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 76% 50%, rgba(34,211,238,0.22), transparent 38%), radial-gradient(circle at 92% 18%, rgba(167,139,250,0.18), transparent 30%), radial-gradient(circle at 10% 100%, rgba(52,211,153,0.12), transparent 40%)",
          }}
        />
        <svg width="1200" height="630" style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={CX} cy={CY} rx="250" ry="92" fill="none" stroke="#67e8f9" strokeOpacity="0.45" transform={`rotate(-18 ${CX} ${CY})`} />
          <ellipse cx={CX} cy={CY} rx="282" ry="120" fill="none" stroke="#c4b5fd" strokeOpacity="0.35" transform={`rotate(24 ${CX} ${CY})`} />
          {neuralConnections.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={points[a].x} y1={points[a].y} x2={points[b].x} y2={points[b].y} stroke="#67e8f9" strokeOpacity="0.4" strokeWidth="2" />
          ))}
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={index === 0 ? 44 : point.r} fill={point.color} fillOpacity={index === 0 ? 0.85 : 0.9} />
          ))}
        </svg>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#a7f3d0", fontSize: 24, letterSpacing: 3, textTransform: "uppercase" }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#34d399" }} />
            Ingeniero en Informática · Arica, Chile
          </div>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Sergio Carey</div>
          <div style={{ fontSize: 40, color: "#a5f3fc", maxWidth: 640, lineHeight: 1.2 }}>Software, IA aplicada y automatización</div>
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            {["Python", "Django", "PostgreSQL", "RAG"].map((item) => (
              <div
                key={item}
                style={{ display: "flex", border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: "8px 16px", fontSize: 24, color: "#b6c2d1" }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
