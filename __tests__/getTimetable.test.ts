import { describe, expect, test } from "@jest/globals";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import getTimetable from "../src/pages/api/timetable/getTimetable";

describe("getTimetable handler", () => {
  test("should return 200", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        id: "o1",
      },
    });

    await getTimetable(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(expect.objectContaining({ success: true }));
  });

  test("should return 404 if no data found with the provided id", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        id: "invalid_id",
      },
    });

    await getTimetable(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getData()).toEqual(expect.objectContaining({ success: false }));
  });
});
