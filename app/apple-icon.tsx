import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b111a, #04060a)",
          color: "#e8eef6",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -2,
          border: "6px solid #22d3ee",
        }}
      >
        SC
      </div>
    ),
    size,
  );
}
