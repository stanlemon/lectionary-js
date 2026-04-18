import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { ThreeYear } from "./3year/Year.js";
import { BaseYear } from "./BaseYear.js";
import { Year } from "./Year.js";
import { YearFactory } from "./YearFactory.js";

describe("YearFactory", () => {
  it("constructs a fresh instance for repeated requests", () => {
    const year1 = YearFactory.get(2025, Year);
    const year2 = YearFactory.get("2025", Year);

    expect(year1).not.toBe(year2);
    expect(year1.getEaster()).toEqual(year2.getEaster());
  });

  it("creates the requested Year type", () => {
    const year = YearFactory.get(2025, Year);
    const threeYear = YearFactory.get(2025, ThreeYear);

    expect(year).toBeInstanceOf(BaseYear);
    expect(year).toBeInstanceOf(Year);
    expect(threeYear).toBeInstanceOf(BaseYear);
    expect(threeYear).toBeInstanceOf(ThreeYear);
    expect(year).not.toBe(threeYear);
  });

  it("normalizes date-like input by year", () => {
    const byDateTime = YearFactory.get(DateTime.local(2025, 10, 31), Year);
    const byDate = YearFactory.get(new Date("10/31/2025"), Year);
    const byObject = YearFactory.get({ year: "2025" }, Year);
    const expectedEaster = new Year(2025).getEaster();

    expect(byDateTime.getEaster()).toEqual(expectedEaster);
    expect(byDate.getEaster()).toEqual(expectedEaster);
    expect(byObject.getEaster()).toEqual(expectedEaster);
  });

  it("keeps the normalized year private", () => {
    const year = YearFactory.get(2025, Year);

    expect(year.year).toBeUndefined();
    expect(Object.hasOwn(year, "year")).toBe(false);
    expect(year.constructor).toBe(Year);
    expect(year.constructor.name).toBe("Year");
  });

  it("throws for invalid input", () => {
    expect(() => YearFactory.get("not-a-year", Year)).toThrow(TypeError);
  });
});
