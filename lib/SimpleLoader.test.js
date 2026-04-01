import { DateTime } from "luxon";

import oneyear from "../data/lsb-1yr.json";
import daily from "../data/lsb-daily.json";
import { CalendarBuilder } from "./CalendarBuilder.js";
import { SimpleLoader } from "./SimpleLoader.js";

describe("SimpleLoader", () => {
  it("works", () => {
    const loader = new SimpleLoader(oneyear, daily);
    const calendarBuilder = new CalendarBuilder(2021, 1);
    const grid = calendarBuilder.build(loader);

    expect(grid).not.toBeNull();

    expect(grid[1][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "Sunday after New Years"
    );
    expect(grid[2][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "The Baptism of Our Lord"
    );
    expect(grid[3][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "Epiphany 2"
    );
    expect(grid[4][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "Transfiguration"
    );
    expect(grid[5][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "Septuagesima"
    );
  });

  it("returns an empty array when no data is provided", () => {
    const loader = new SimpleLoader();
    const result = loader.load(DateTime.local(2021, 6, 15), 30);
    expect(result).toEqual([]);
  });

  it("matches propers by month and day for calendar feast days", () => {
    const proper = {
      week: null,
      month: 12,
      day: 25,
      type: 0,
      text: "The Nativity of Our Lord",
    };
    const loader = new SimpleLoader([proper]);
    const result = loader.load(DateTime.local(2021, 12, 25), 99);
    expect(result).toContainEqual(proper);
  });

  it("normalizes Sunday from Luxon weekday 7 to 0 when matching propers", () => {
    const proper = {
      week: 6,
      month: null,
      day: 0,
      type: 1,
      text: "Romans 8:1-11",
    };
    const loader = new SimpleLoader([proper]);
    // Jan 10, 2021 is a Sunday (Luxon weekday 7)
    const result = loader.load(DateTime.local(2021, 1, 10), 6);
    expect(result).toContainEqual(proper);
  });
});
