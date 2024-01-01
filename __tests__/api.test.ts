import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import axios from "axios";

describe("TIMETABLE", () => {
  it("getTimetable", async () => {
    console.log(process.env.NEXT_PUBLIC_HOST + "/api/timetable/getTimetable");
    const response = await axios.get(
      process.env.NEXT_PUBLIC_HOST + "/api/timetable/getTimetable",
    );
    expect(response.status).toBe(200);
  }, 20000);
});
