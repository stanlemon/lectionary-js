import { DateTime } from "luxon";

import lectionary from "../data/lsb-1yr.json";
import festivals from "../data/lsb-festivals.json";
import { CalendarBuilder } from "./CalendarBuilder.js";
import { KeyLoader } from "./KeyLoader.js";

describe("KeyLoader", () => {
  it("works", () => {
    const loader = new KeyLoader({ lectionary, festivals });
    const calendarBuilder = new CalendarBuilder(2021, 1);
    const grid = calendarBuilder.build(loader);

    expect(grid).not.toBeNull();

    expect(
      grid[1][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("Sunday after New Years");
    expect(
      grid[2][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("The Baptism of Our Lord");
    expect(
      grid[3][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("Epiphany 2");
    expect(
      grid[4][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("Transfiguration");
    expect(
      grid[4][0].propers.festivals.filter((p) => p.type === 0)[0].text
    ).toEqual("St. Timothy, Pastor");
    expect(
      grid[5][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("Septuagesima");
  });

  it("returns empty arrays for keys with no matching propers", () => {
    const loader = new KeyLoader({ lectionary: [], festivals: [] });
    const result = loader.load(DateTime.local(2021, 6, 15), 30);
    expect(result.lectionary).toEqual([]);
    expect(result.festivals).toEqual([]);
  });

  it("matches propers by month and day for calendar feast days", () => {
    const proper = {
      week: null,
      month: 1,
      day: 6,
      type: 0,
      text: "The Epiphany",
    };
    const loader = new KeyLoader({ lectionary: [proper] });
    // Week number doesn't matter — feast is matched by month+day
    const result = loader.load(DateTime.local(2021, 1, 6), 99);
    expect(result.lectionary).toContainEqual(proper);
  });

  it("normalizes Sunday from Luxon weekday 7 to 0 when matching propers", () => {
    // Propers for Sundays are stored with day=0; Luxon represents Sunday as weekday 7
    const proper = {
      week: 6,
      month: null,
      day: 0,
      type: 1,
      text: "Romans 8:1-11",
    };
    const loader = new KeyLoader({ lectionary: [proper] });
    // Jan 10, 2021 is a Sunday (Luxon weekday 7)
    const result = loader.load(DateTime.local(2021, 1, 10), 6);
    expect(result.lectionary).toContainEqual(proper);
  });

  it("sorts week-based propers before month/day propers", () => {
    const weekProper = {
      week: 6,
      month: null,
      day: 0,
      type: 1,
      text: "Week-based",
    };
    const monthProper = {
      week: null,
      month: 1,
      day: 10,
      type: 1,
      text: "Month-based",
    };
    // Supply month-based first to confirm sort overrides insertion order
    const loader = new KeyLoader({ lectionary: [monthProper, weekProper] });
    // Jan 10, 2021 is a Sunday matching both week=6/day=0 and month=1/day=10
    const result = loader.load(DateTime.local(2021, 1, 10), 6);
    expect(result.lectionary[0]).toEqual(weekProper);
    expect(result.lectionary[1]).toEqual(monthProper);
  });

  it("keeps fixed-date festivals on their date even when they collide", () => {
    const loader = new KeyLoader({ festivals });

    const result = loader.load(DateTime.local(2027, 3, 25), 21);
    expect(result.festivals).toContainEqual(
      expect.objectContaining({
        type: 0,
        text: "Annunciation of our Lord",
      })
    );
  });
});
