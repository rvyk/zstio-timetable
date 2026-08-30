import assert from "node:assert/strict";
import test from "node:test";
import { resolveRedirectPath } from "../src/lib/lastVisited.ts";

test("domyślny plan ma pierwszeństwo przed ostatnio odwiedzonym", () => {
  assert.equal(resolveRedirectPath("/teacher/7", "/class/3"), "/teacher/7");
  assert.equal(resolveRedirectPath(undefined, "/class/3"), "/class/3");
  assert.equal(resolveRedirectPath("/evil", "/room/2"), "/room/2");
  assert.equal(resolveRedirectPath(), "/class/1");
});
