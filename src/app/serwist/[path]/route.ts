import { createSerwistRoute } from "@serwist/turbopack";
import { spawnSync } from "node:child_process";

const { stdout } = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf-8",
});
const revision = stdout ? stdout.trim() : crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
    swSrc: "src/app/sw.ts",
    useNativeEsbuild: true,
  });
