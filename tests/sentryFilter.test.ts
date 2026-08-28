import assert from "node:assert/strict";
import test from "node:test";
import { isOurError } from "../src/lib/sentryFilter.ts";

test("odrzuca błędy z wstrzykniętych skryptów", () => {
  assert.equal(isOurError(["app:///executors/200.js"]), false);
  assert.equal(isOurError(["chrome-extension://abc/content.js"]), false);
});

test("przepuszcza błędy z naszego kodu i bez stack trace'u", () => {
  assert.equal(isOurError(["src/components/timetable/Board.tsx"]), true);
  assert.equal(isOurError(["app:///_next/static/chunks/main.js"]), true);
  assert.equal(
    isOurError(["ext://x", "node_modules/next/dist/client.js"]),
    true,
  );
  assert.equal(isOurError([]), true);
});
