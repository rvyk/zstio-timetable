import assert from "node:assert/strict";
import test from "node:test";
import {
  isTimetablePath,
  resolveRedirectPath,
} from "../src/lib/lastVisited.ts";

test("domyślny plan ma pierwszeństwo przed ostatnio odwiedzonym", () => {
  assert.equal(resolveRedirectPath("/teacher/7", "/class/3"), "/teacher/7");
  assert.equal(resolveRedirectPath(undefined, "/class/3"), "/class/3");
  assert.equal(resolveRedirectPath("/evil", "/room/2"), "/room/2");
  assert.equal(resolveRedirectPath(), "/class/1");
});

test("rozpoznaje tylko ścieżki planów", () => {
  assert.equal(isTimetablePath("/class/12"), true);
  assert.equal(isTimetablePath("/room/3"), true);
  assert.equal(isTimetablePath("/free-rooms"), false);
  assert.equal(isTimetablePath("https://evil.example/class/1"), false);
  assert.equal(isTimetablePath(null), false);
});
