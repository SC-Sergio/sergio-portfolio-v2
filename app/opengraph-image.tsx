import { ImageResponse } from "next/og";

export const alt = "Sergio Carey - Ingeniero Informático";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#04070d",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.28), transparent 34%), radial-gradient(circle at 80% 22%, rgba(139, 92, 246, 0.22), transparent 30%), radial-gradient(circle at 72% 78%, rgba(16, 185, 129, 0.24), transparent 34%), linear-gradient(135deg, #020617 0%, #07111f 48%, #030712 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 54,
            right: 54,
            bottom: 54,
            left: 54,
            border: "1px solid rgba(148, 163, 184, 0.28)",
            borderRadius: 34,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 118,
            top: 104,
            width: 280,
            height: 280,
            borderRadius: 999,
            border: "1px solid rgba(34, 211, 238, 0.38)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 172,
            top: 156,
            width: 176,
            height: 176,
            borderRadius: 999,
            border: "1px solid rgba(16, 185, 129, 0.36)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 92px",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#67e8f9",
              fontSize: 28,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#34d399",
              }}
            />
            Portafolio profesional
          </div>
          <div
            style={{
              maxWidth: 780,
              fontSize: 94,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: 0,
            }}
          >
            Sergio Carey
          </div>
          <div
            style={{
              color: "#d1fae5",
              fontSize: 38,
              fontWeight: 600,
            }}
          >
            Ingeniero Informático
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              border: "1px solid rgba(34, 211, 238, 0.34)",
              borderRadius: 999,
              padding: "16px 24px",
              color: "#cffafe",
              fontSize: 29,
              background: "rgba(2, 6, 23, 0.62)",
            }}
          >
            Python · Django · IA · Automatización
          </div>
        </div>
      </div>
    ),
    size,
  );
}
