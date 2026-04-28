import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { Year } from "../Year.js";
import { Series } from "./Series.js";

describe("Series.getSeries", () => {
  it("returns A for dates in the Advent 2022 liturgical year", () => {
    // Advent 2022 starts Dec 4 2022; runs through Advent 2023 eve
    expect(new Series(new Date("12/04/2022")).getSeries()).toBe("A");
    expect(new Series(new Date("06/15/2023")).getSeries()).toBe("A");
  });

  it("returns B for dates in the Advent 2023 liturgical year", () => {
    // Advent 2023 starts Dec 3 2023
    expect(new Series(new Date("12/03/2023")).getSeries()).toBe("B");
    expect(new Series(new Date("06/15/2024")).getSeries()).toBe("B");
  });

  it("returns C for dates in the Advent 2024 liturgical year", () => {
    // Advent 2024 starts Dec 1 2024; year runs through Nov 29 2025
    expect(new Series(new Date("12/01/2024")).getSeries()).toBe("C");
    expect(new Series(new Date("06/15/2025")).getSeries()).toBe("C");
  });

  it("returns A for dates in the Advent 2025 liturgical year", () => {
    // Advent 2025 starts Nov 30 2025
    expect(new Series(new Date("11/30/2025")).getSeries()).toBe("A");
    expect(new Series(new Date("04/04/2026")).getSeries()).toBe("A");
  });

  it("transitions at Advent boundary", () => {
    // The day before Advent 2023 (Dec 2 2023) is still Series A
    const year = new Year(2023);
    const advent = year.getAdvent();
    const dayBefore = new Date(
      advent.getFullYear(),
      advent.getMonth(),
      advent.getDate() - 1
    );
    expect(new Series(dayBefore).getSeries()).toBe("A");
    // Advent 2023 itself is Series B
    expect(new Series(advent).getSeries()).toBe("B");
  });

  it("rejects Day.js input", () => {
    expect(() => new Series(dayjs(new Date(2023, 11, 3)))).toThrow(TypeError);
  });
});
