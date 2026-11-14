import { API_VERSION, appUrl, ok } from "@/lib/api";
import { openApiSpec } from "@/lib/openapi";

export const GET = (request: Request) => {
  const spec = openApiSpec();

  return ok(request, {
    name: spec.info.title,
    version: API_VERSION,
    docs: appUrl("/api/v1/docs"),
    openapi: appUrl("/api/v1/openapi.json"),
    endpoints: Object.entries(spec.paths).map(([path, { get }]) => ({
      method: "GET",
      path,
      summary: get.summary,
    })),
  });
};
