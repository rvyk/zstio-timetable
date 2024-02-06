// @vitest-environment node

import { convertTextDate } from "@/lib/date";
import { Table } from "@wulkanowy/timetable-parser";
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

describe("Format date", () => {
  const htmlFilename = path.join(__dirname, "1TE-example.html");
  const html = fs.readFileSync(htmlFilename, {
    encoding: "utf8",
  });

  const table = new Table(html);
  it("Cheerio init", (): void => {
    expect((): Table => new Table(html)).not.to.throw();
  });

  it("Check generated date format", () => {
    expect(table.getGeneratedDate()).to.eql("2024-01-13");
    console.log("before: ", table.getGeneratedDate());
    const newDate = convertTextDate(table.getGeneratedDate()!);
    console.log("after: ", newDate);
    expect(newDate).to.eql("2024-01-13");
  });

  it("Check valid date format", () => {
    expect(table.getVersionInfo()).to.eql("15 stycznia 2024r.");
    console.log("before: ", table.getVersionInfo());
    const newDate = convertTextDate(table.getVersionInfo()!);
    console.log("after: ", newDate);
    expect(newDate).to.eql("2024-01-15");
  });
});
