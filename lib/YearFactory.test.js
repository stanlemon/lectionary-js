import { DateTime } from "luxon";
import { afterEach, describe, expect, it } from "vitest";

import { ThreeYear } from "./3year/Year.js";
import { Year } from "./Year.js";
import { YearFactory } from "./YearFactory.js";

describe("YearFactory", () => {
  afterEach(() => {
    YearFactory.clear();
  });

  it("reuses cached instances for the same year and type", () => {
    const year1 = YearFactory.get(2025, Year);
    const year2 = YearFactory.get("2025", Year);
    expect(year1).toBe(year2);
  });

  it("creates separate instances for different years", () => {
    const year2025 = YearFactory.get(2025, Year);
    const year2026 = YearFactory.get(2026, Year);
    expect(year2025).not.toBe(year2026);
  });

  it("creates separate caches per Year type", () => {
    const year = YearFactory.get(2025, Year);
    const threeYear = YearFactory.get(2025, ThreeYear);

    expect(year).toBeInstanceOf(Year);
    expect(threeYear).toBeInstanceOf(ThreeYear);
    expect(year).not.toBe(threeYear);
  });

  it("normalizes date-like input by year", () => {
    const byDate = YearFactory.get(DateTime.local(2025, 10, 31), Year);
    const byYear = YearFactory.get(2025, Year);
    expect(byDate).toBe(byYear);
  });

  it("memoizes method calls on proxied instances", () => {
    class CountingYear extends Year {
      constructor(year) {
        super(year);
        this.calls = 0;
      }

      getAdvent() {
        this.calls += 1;
        return super.getAdvent();
      }
    }

    const year = YearFactory.get(2025, CountingYear);

    const advent1 = year.getAdvent();
    const advent2 = year.getAdvent();

    expect(advent1).toBe(advent2);
    expect(year.calls).toBe(1);
  });

  it("does not collide memoization keys for non-JSON-serializable args", () => {
    class KeySensitiveYear extends Year {
      constructor(year) {
        super(year);
        this.calls = 0;
      }

      getByValue(value) {
        this.calls += 1;
        return this.calls;
      }
    }

    const year = YearFactory.get(2025, KeySensitiveYear);
    const symbolArg = Symbol("token");

    const undefinedResult = year.getByValue(undefined);
    const symbolResult = year.getByValue(symbolArg);

    expect(undefinedResult).not.toBe(symbolResult);
    expect(year.calls).toBe(2);
  });

  it("preserves constructor property semantics on proxied instances", () => {
    const year = YearFactory.get(2025, Year);

    expect(year.constructor).toBe(Year);
    expect(year.constructor.name).toBe("Year");
  });

  it("transparently memoizes Year and ThreeYear methods from the factory", () => {
    const year = YearFactory.get(2025, Year);
    const threeYear = YearFactory.get(2025, ThreeYear);

    expect(year.getEaster()).toBe(year.getEaster());
    expect(threeYear.getTransfiguration()).toBe(threeYear.getTransfiguration());
  });
});
