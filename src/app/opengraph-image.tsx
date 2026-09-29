import { ImageResponse } from "next/og";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site-config";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at top right, rgba(24, 184, 198, 0.18), transparent 42%), linear-gradient(135deg, #070b12 0%, #0d1520 55%, #101c2b 100%)",
          color: "#f4f7fa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "22px",
              background: "#ffffff",
              border: "1px solid #dce3ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", fontSize: "42px", fontWeight: 800 }}>
              <span style={{ color: "#12304a" }}>D</span>
              <span style={{ color: "#0d1b2a" }}>S</span>
            </div>
          </div>
          <div
            style={{
              width: "120px",
              height: "4px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #18b8c6, #3578e5)",
            }}
          />
        </div>

        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "20px",
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            fontSize: "40px",
            fontWeight: 500,
            color: "#cbd5e1",
            lineHeight: 1.2,
            marginBottom: "28px",
            maxWidth: "920px",
          }}
        >
          {SITE_TAGLINE}
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "920px",
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
