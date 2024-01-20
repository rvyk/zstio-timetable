// @vitest-environment node

import fetchAllClasses from "@/lib/fetchers/fetchAllClasses";
import fetchEmptyClasses from "@/lib/fetchers/fetchEmptyClasses";
import fetchSubstitutions from "@/lib/fetchers/fetchSubstitutions";
import fetchTimetable from "@/lib/fetchers/fetchTimetable";
import fetchTimetableList from "@/lib/fetchers/fetchTimetableList";
import { describe, expect, it } from "vitest";

describe("Fetchers", () => {
  it("Should fetch substitutions", async () => {
    const data = await fetchSubstitutions();
    console.log(data);
    expect(data.status).toBeTruthy();
  });

  it("Should fetch timetable list", async () => {
    const data = await fetchTimetableList();
    console.log(data);
    expect(data.ok).toBeTruthy();
  });

  it("Should fetch timetable", async () => {
    const data = await fetchTimetable({ params: { all: ["class", "1"] } });
    console.log(data);
    expect(data.timeTable).toBeDefined();
    expect(data.timeTable.status).toBeTruthy();
  });

  it("Should fetch all classes", async () => {
    const data = await fetchAllClasses();
    console.log(data);
    expect(data.success).toBeTruthy();
  });

  it("Should fetch empty classes", async () => {
    const data = await fetchEmptyClasses(0, 0);
    console.log(data);
    expect(data.success).toBeTruthy();
  });
});
