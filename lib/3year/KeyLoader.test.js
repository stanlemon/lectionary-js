import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import lsb3yrA from "../../data/lsb-3yr-a.json";
import lsb3yrB from "../../data/lsb-3yr-b.json";
import lsb3yrC from "../../data/lsb-3yr-c.json";
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
    // Nov 27, 2022 = Advent 1, Series A (Christmas 2022 = Sunday → Advent 1 = Nov 27)
    const loader = new ThreeYearKeyLoader({ series: seriesData, festivals });
    const result = loader.load(DateTime.local(2022, 11, 27), 1);
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
    // Nov 27, 2022 is a Sunday (Luxon weekday 7), Advent 1, series A, week 1
    const proper = { week: 1, day: 0, month: null, type: 1, text: "Epistle" };
    const loader = new ThreeYearKeyLoader({
      series: { A: [proper], B: [], C: [] },
      festivals: [],
    });
    const result = loader.load(DateTime.local(2022, 11, 27));
    expect(result.lectionary).toContainEqual(proper);
  });

  it("sorts week-based propers before month/day propers", () => {
    const weekProper = { week: 1, day: 0, month: null, type: 1, text: "Week" };
    const monthProper = {
      week: null,
      month: 11,
      day: 27,
      type: 1,
      text: "Month",
    };
    const loader = new ThreeYearKeyLoader({
      series: { A: [monthProper, weekProper], B: [], C: [] },
      festivals: [],
    });
    const result = loader.load(DateTime.local(2022, 11, 27));
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

// Easter 2026 = April 5 (Sunday). Trinity Sunday = May 31. Series A (adventYear 2025, 2025 % 3 = 0).
describe("ThreeYearKeyLoader — Series A ordinary time 2026", () => {
  const loader = new ThreeYearKeyLoader({
    series: { A: lsb3yrA, B: lsb3yrB, C: lsb3yrC },
    festivals: [],
    daily: [],
    commemorations: [],
  });

  function proper(result, type) {
    return result.lectionary.find((p) => p.type === type)?.text;
  }

  it("returns Proper 5 for June 7, 2026 (first Sunday after Trinity)", () => {
    const result = loader.load(DateTime.local(2026, 6, 7), 0);
    expect(proper(result, 0)).toBe("Proper 5 (June 5\u201311)");
    expect(proper(result, 19)).toBe("Hos. 5:15\u20136:6");
    expect(proper(result, 1)).toBe("Rom. 4:13-18");
    expect(proper(result, 2)).toBe("Matt. 9:9-13");
  });

  it("returns Proper 15 for August 16, 2026", () => {
    const result = loader.load(DateTime.local(2026, 8, 16), 0);
    expect(proper(result, 0)).toBe("Proper 15 (Aug. 14\u201320)");
    expect(proper(result, 19)).toBe("Isaiah 56:1, 6-8");
    expect(proper(result, 1)).toBe("Rom. 11:1-2a, 13-15, 28-32");
    expect(proper(result, 2)).toBe("Matt. 15:21-28");
  });
});
