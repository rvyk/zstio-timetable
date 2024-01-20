// @vitest-environment node

import { Table, Timetable } from "@wulkanowy/timetable-parser";
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

// ORIGINAL: https://github.com/wulkanowy/timetable-parser-js/blob/7ba09ec99f35a572c921eed491198715c9d55ace/test/test.ts

describe("Timetable test", (): void => {
  const htmlFilename = path.join(__dirname, "1TE-example.html");
  const html = fs.readFileSync(htmlFilename, {
    encoding: "utf8",
  });

  it("Cheerio init", (): void => {
    expect((): Timetable => new Timetable(html)).not.to.throw();
  });

  const timetable = new Timetable(html);

  it("Title check", (): void => {
    console.log(timetable.getTitle());
    expect(timetable.getTitle()).to.equal("Plan lekcji oddziału - 1TE");
  });
});

describe("Table test", (): void => {
  describe("Branch table", (): void => {
    const htmlFilename = path.join(__dirname, "1TE-example.html");
    const html = fs.readFileSync(htmlFilename, {
      encoding: "utf8",
    });

    const table = new Table(html);
    it("Cheerio init", (): void => {
      expect((): Table => new Table(html)).not.to.throw();
    });

    it("Day names return value check", (): void => {
      const dayNames = table.getDayNames();
      expect(dayNames).to.eql([
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
      ]);
    });

    it("Table hours return check", (): void => {
      const tableHours = table.getHours();
      expect(tableHours).to.eql({
        1: {
          number: 1,
          timeFrom: "8:00",
          timeTo: "8:45",
        },
        2: {
          number: 2,
          timeFrom: "8:50",
          timeTo: "9:35",
        },
        3: {
          number: 3,
          timeFrom: "9:40",
          timeTo: "10:25",
        },
        4: {
          number: 4,
          timeFrom: "10:40",
          timeTo: "11:25",
        },
        5: {
          number: 5,
          timeFrom: "11:30",
          timeTo: "12:15",
        },
        6: {
          number: 6,
          timeFrom: "12:20",
          timeTo: "13:05",
        },
        7: {
          number: 7,
          timeFrom: "13:10",
          timeTo: "13:55",
        },
        8: {
          number: 8,
          timeFrom: "14:00",
          timeTo: "14:45",
        },
      });
    });

    it("Table title", (): void => {
      const title = table.getTitle();
      expect(title).to.eql("1TE");
    });

    it("Table version info", (): void => {
      const versionInfo = table.getVersionInfo();
      expect(versionInfo).to.eql("15 stycznia 2024r.");
    });

    it("Table generated date", (): void => {
      const generatedDate = table.getGeneratedDate();
      expect(generatedDate).to.eql("2024-01-13");
    });
  });
});
