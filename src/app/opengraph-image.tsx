import { ImageResponse } from "next/og";

export const alt = "WebDev Path: a free 24-week route from first HTML tag to first developer job";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const lines = ["#E4572E", "#E9A800", "#139A98", "#3A57E8", "#7B2CBF", "#0F9D58"];

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#F6F7FB", color: "#14213D" }}>
        <div style={{ fontSize: 30, fontWeight: 700 }}>WebDev Path</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Your route from first tag to first developer job.</div>
          <div style={{ fontSize: 32, marginTop: 20, color: "#5B6475" }}>Free course: 24 weeks, 6 portfolio projects</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {lines.map((c) => <div key={c} style={{ flex: 1, height: 14, borderRadius: 7, background: c }} />)}
        </div>
      </div>
    ),
    size,
  );
}
