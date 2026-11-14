import { hoursFor, ok, schoolGrid, sourceUnavailable } from "@/lib/api";

export const GET = async (request: Request) => {
  const grid = await schoolGrid("class");
  if (!grid) return sourceUnavailable();

  const { hours, error } = hoursFor(
    grid.hours,
    new URL(request.url).searchParams,
  );
  if (error) return error;

  return ok(request, { count: hours.length, hours });
};
