import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request) {
  const origin = new URL(request.url).origin;
  const logo = new URL("/brand/ayodhya-full-logo.jpg", origin).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#241008",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "452px",
            height: "452px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "96px",
            background: "#2f160b",
            border: "3px solid rgba(212,168,75,.35)",
            overflow: "hidden",
            padding: "24px",
          }}
        >
          <img
            src={logo}
            alt="Ayodhya Restaurant"
            width="404"
            height="270"
            style={{
              objectFit: "contain",
              width: "404px",
              height: "270px",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
