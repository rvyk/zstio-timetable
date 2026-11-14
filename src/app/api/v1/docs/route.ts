import { createHash } from "node:crypto";

const SCALAR =
  "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.76.4/dist/browser/standalone.js";
const SCALAR_SRI =
  "sha384-hwB9WroDTpZaI38gr+u9CXA6ksz5gUYgD2GxXazKl/agT1L2GWUiRFWGJYNiFu4Q";
const INIT = `Scalar.createApiReference("#app", { url: "/api/v1/openapi.json" });`;
const INIT_HASH = createHash("sha256").update(INIT).digest("base64");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ZSTiO Timetable API</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="${SCALAR}" integrity="${SCALAR_SRI}" crossorigin="anonymous"></script>
    <script>${INIT}</script>
  </body>
</html>`;

const CSP = [
  "default-src 'self'",
  `script-src 'self' https://cdn.jsdelivr.net 'sha256-${INIT_HASH}'`,
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.scalar.com",
  "font-src 'self' data: https://cdn.jsdelivr.net https://fonts.scalar.com",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
].join("; ");

export const GET = () =>
  new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Content-Security-Policy": CSP,
    },
  });
