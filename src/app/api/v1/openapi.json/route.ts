import { ok } from "@/lib/api";
import { openApiSpec } from "@/lib/openapi";

export const GET = (request: Request) => ok(request, openApiSpec());
