import { fail } from "@/lib/api";

export const GET = () =>
  fail(404, "unknown_endpoint", "No such endpoint, see /api/v1");
