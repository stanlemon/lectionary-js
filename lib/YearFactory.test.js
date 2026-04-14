import { DateTime, Settings } from "luxon";
import { afterEach, describe, expect, it } from "vitest";

import { ThreeYear } from "./3year/Year.js";
import { Year } from "./Year.js";
import { YearFactory } from "./YearFactory.js";

describe("YearFactory", () => {
  afterEach(() => {
    Settings.defaultZone = "system";
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
    let calls = 0;

    class CountingYear extends Year {
      getAdvent() {
        calls += 1;
        return super.getAdvent();
      }
    }

    const year = YearFactory.get(2025, CountingYear);

    const advent1 = year.getAdvent();
    const advent2 = year.getAdvent();

    expect(advent1).toEqual(advent2);
    expect(calls).toBe(1);
  });

  it("memoizes nested method composition across wrapped methods", () => {
    let easterCalls = 0;

    class CountingYear extends Year {
      getEaster() {
        easterCalls += 1;
        return super.getEaster();
      }
    }

    const year = YearFactory.get(2025, CountingYear);

    year.getLent();
    year.getTransfiguration();

    expect(easterCalls).toBe(1);
  });

  it("does not collide memoization keys for non-JSON-serializable args", () => {
    let calls = 0;

    class KeySensitiveYear extends Year {
      getByValue(value) {
        calls += 1;
        return calls;
      }
    }

    const year = YearFactory.get(2025, KeySensitiveYear);
    const symbolArg = Symbol("token");

    const undefinedResult = year.getByValue(undefined);
    const symbolResult = year.getByValue(symbolArg);

    expect(undefinedResult).not.toBe(symbolResult);
    expect(calls).toBe(2);
  });

  it("does not expose the calendar year as a public mutable field", () => {
    const year = YearFactory.get(2025, Year);

    expect("year" in year).toBe(false);
    expect(Object.isFrozen(year)).toBe(true);
  });

  it("recreates DateTime results using the current Luxon zone", () => {
    Settings.defaultZone = "UTC";
    const year = YearFactory.get(2025, Year);
    const christmasInUtc = year.getChristmas();

    Settings.defaultZone = "America/New_York";
    const christmasInNewYork = year.getChristmas();

    expect(christmasInUtc.zoneName).toBe("UTC");
    expect(christmasInNewYork.zoneName).toBe("America/New_York");
    expect(christmasInUtc.toISODate()).toBe(christmasInNewYork.toISODate());
  });

  it("transparently memoizes Year and ThreeYear methods from the factory", () => {
    const year = YearFactory.get(2025, Year);
    const threeYear = YearFactory.get(2025, ThreeYear);

    expect(year.getEaster()).toEqual(year.getEaster());
    expect(threeYear.getTransfiguration()).toEqual(
      threeYear.getTransfiguration()
    );
  });

  it("allows types to override their cache key and constructor input", () => {
    class ShiftedYear extends Year {
      constructor(year) {
        super(year + 1);
      }
    }

    YearFactory.registerType(ShiftedYear, {
      getInstanceKey(value) {
        return `shifted:${value.inputYear}`;
      },
      getConstructorArg(value) {
        return value.baseYear;
      },
    });

    const first = YearFactory.get(
      { inputYear: 2025, baseYear: 2024 },
      ShiftedYear
    );
    const second = YearFactory.get(
      { inputYear: 2025, baseYear: 1900 },
      ShiftedYear
    );

    expect(first).toBe(second);
    expect(first.getChristmas()).toEqual(DateTime.local(2025, 12, 25));
  });

  it("preserves constructor property semantics on cached instances", () => {
    const year = YearFactory.get(2025, Year);

    expect(year.constructor).toBe(Year);
    expect(year.constructor.name).toBe("Year");
  });
});
