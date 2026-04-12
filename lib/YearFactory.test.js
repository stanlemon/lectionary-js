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
    const year1 = Year.get(2025);
    const year2 = Year.get("2025");
    expect(year1).toBe(year2);
  });

  it("creates separate instances for different years", () => {
    const year2025 = Year.get(2025);
    const year2026 = Year.get(2026);
    expect(year2025).not.toBe(year2026);
  });

  it("creates separate caches per Year type", () => {
    const year = Year.get(2025);
    const threeYear = ThreeYear.get(2025);

    expect(year).toBeInstanceOf(Year);
    expect(threeYear).toBeInstanceOf(ThreeYear);
    expect(year).not.toBe(threeYear);
  });

  it("normalizes date-like input by year", () => {
    const byDate = Year.get(DateTime.local(2025, 10, 31));
    const byYear = Year.get(2025);
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

  it("transparently memoizes Year and ThreeYear methods from the factory", () => {
    const year = Year.get(2025);
    const threeYear = ThreeYear.get(2025);

    expect(year.getEaster()).toBe(year.getEaster());
    expect(threeYear.getTransfiguration()).toBe(threeYear.getTransfiguration());
  });
});
