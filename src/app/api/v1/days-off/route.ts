import { CACHE_SHORT, fail, ok } from "@/lib/api";
import { isoDay, parseIsoDay } from "@/lib/apiShape";
import { warsawToday } from "@/lib/dates";
import { schoolDaysOff } from "@/lib/schoolYear";

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const rawFrom = searchParams.get("from");
  const rawWeeks = searchParams.get("weeks") ?? "4";
  const rawWeekends = searchParams.get("weekends") ?? "false";
  const from = rawFrom ? parseIsoDay(rawFrom) : warsawToday();
  const weeks = Number(rawWeeks);

  if (!from) return fail(400, "invalid_from", "from must be a YYYY-MM-DD date");
  if (!/^\d+$/.test(rawWeeks) || weeks < 1 || weeks > 53) {
    return fail(
      400,
      "invalid_weeks",
      "weeks must be an integer between 1 and 53",
    );
  }
  if (rawWeekends !== "true" && rawWeekends !== "false") {
    return fail(400, "invalid_weekends", "weekends must be true or false");
  }
  const weekends = rawWeekends === "true";

  const days = schoolDaysOff(from, weeks)
    .filter(
      (day) => weekends || (day.getUTCDay() !== 0 && day.getUTCDay() !== 6),
    )
    .map(isoDay);

  return ok(
    request,
    { from: isoDay(from), weeks, weekends, count: days.length, days },
    rawFrom ? undefined : CACHE_SHORT,
  );
};
