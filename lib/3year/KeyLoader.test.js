import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { ThreeYearKeyLoader } from "./KeyLoader.js";

// Advent 2022 = Series A, Advent 2023 = Series B, Advent 2024 = Series C

const seriesData = {
  A: [{ week: 1, day: 0, month: null, type: 0, text: "Advent 1 (A)" }],
  B: [{ week: 1, day: 0, month: null, type: 0, text: "Advent 1 (B)" }],
  C: [{ week: 1, day: 0, month: null, type: 0, text: "Advent 1 (C)" }],
};

const festivals = [
  { week: null, month: 1, day: 6, type: 0, text: "The Epiphany" },
];

describe("ThreeYearKeyLoader", () => {
  it("returns series A lectionary for a Series A date", () => {
    // Dec 4, 2022 = Advent 1, Series A
    const loader = new ThreeYearKeyLoader({ series: seriesData, festivals });
    const result = loader.load(DateTime.local(2022, 12, 4), 1);
    expect(result.lectionary).toHaveLength(1);
    expect(result.lectionary[0].text).toBe("Advent 1 (A)");
  });

  it("returns series B lectionary for a Series B date", () => {
    // Dec 3, 2023 = Advent 1, Series B
    const loader = new ThreeYearKeyLoader({ series: seriesData, festivals });
    const result = loader.load(DateTime.local(2023, 12, 3), 1);
    expect(result.lectionary[0].text).toBe("Advent 1 (B)");
  });

  it("returns series C lectionary for a Series C date", () => {
    // Dec 1, 2024 = Advent 1, Series C
    const loader = new ThreeYearKeyLoader({ series: seriesData, festivals });
    const result = loader.load(DateTime.local(2024, 12, 1), 1);
    expect(result.lectionary[0].text).toBe("Advent 1 (C)");
  });

  it("returns shared datasets regardless of series", () => {
    const loader = new ThreeYearKeyLoader({ series: seriesData, festivals });
    // Jan 6 = Epiphany feast, matched by month+day
    const result = loader.load(DateTime.local(2024, 1, 6), 99);
    expect(result.festivals).toHaveLength(1);
    expect(result.festivals[0].text).toBe("The Epiphany");
  });

  it("returns empty lectionary when series data has no match", () => {
    const loader = new ThreeYearKeyLoader({
      series: { A: [], B: [], C: [] },
      festivals: [],
    });
    const result = loader.load(DateTime.local(2022, 12, 4), 1);
    expect(result.lectionary).toEqual([]);
    expect(result.festivals).toEqual([]);
  });

  it("normalizes Sunday weekday 7 to 0 when matching propers", () => {
    // Dec 4, 2022 is a Sunday (Luxon weekday 7), series A, week 1
    const proper = { week: 1, day: 0, month: null, type: 1, text: "Epistle" };
    const loader = new ThreeYearKeyLoader({
      series: { A: [proper], B: [], C: [] },
      festivals: [],
    });
    const result = loader.load(DateTime.local(2022, 12, 4), 1);
    expect(result.lectionary).toContainEqual(proper);
  });

  it("sorts week-based propers before month/day propers", () => {
    const weekProper = { week: 1, day: 0, month: null, type: 1, text: "Week" };
    const monthProper = {
      week: null,
      month: 12,
      day: 4,
      type: 1,
      text: "Month",
    };
    const loader = new ThreeYearKeyLoader({
      series: { A: [monthProper, weekProper], B: [], C: [] },
      festivals: [],
    });
    const result = loader.load(DateTime.local(2022, 12, 4), 1);
    expect(result.lectionary[0]).toEqual(weekProper);
    expect(result.lectionary[1]).toEqual(monthProper);
  });

  it("includes all shared keys in the returned object", () => {
    const loader = new ThreeYearKeyLoader({
      series: seriesData,
      festivals: [],
      daily: [],
      commemorations: [],
    });
    const result = loader.load(DateTime.local(2022, 12, 4), 1);
    expect(result).toHaveProperty("lectionary");
    expect(result).toHaveProperty("festivals");
    expect(result).toHaveProperty("daily");
    expect(result).toHaveProperty("commemorations");
  });
});
