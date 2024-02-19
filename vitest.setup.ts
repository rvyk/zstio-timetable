import { loadEnvConfig } from "@next/env";
import { beforeAll, vi } from "vitest";

beforeAll(() => {
  if (typeof window !== "undefined") {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }
  loadEnvConfig(process.cwd());
  vi.mock("next/navigation", () => require("next-router-mock"));
});
