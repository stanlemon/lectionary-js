import { describe, expect, it } from "vitest";
import { formatDateKey } from "../date.js";
import { Year } from "../Year.js";
import { ThreeYear } from "./Year.js";

describe("ThreeYear.getTransfiguration", () => {
  it("is Easter minus 7 weeks", () => {
    const year = new ThreeYear(2026);
    const easter = year.getEaster();
    const expected = new Date(
      easter.getFullYear(),
      easter.getMonth(),
      easter.getDate() - 49
    );

    expect(formatDateKey(year.getTransfiguration())).toBe(
      formatDateKey(expected)
    );
  });

  it("differs from the 1-year Transfiguration (Easter minus 10 weeks)", () => {
    const year3 = new ThreeYear(2025);
    const year1 = new Year(2025);
    expect(formatDateKey(year3.getTransfiguration())).not.toBe(
      formatDateKey(year1.getTransfiguration())
    );
  });

  it("returns correct date for 2025 (Easter Apr 20)", () => {
    // Easter 2025 = Apr 20; Apr 20 − 7 weeks = Mar 2
    const year = new ThreeYear(2025);
    expect(formatDateKey(year.getTransfiguration())).toBe("2025-03-02");
  });

  it("returns correct date for 2024 (Easter Mar 31)", () => {
    // Easter 2024 = Mar 31; − 7 weeks = Feb 11
    const year = new ThreeYear(2024);
    expect(formatDateKey(year.getTransfiguration())).toBe("2024-02-11");
  });

  it("returns correct date for 2026 (Easter Apr 5)", () => {
    // Easter 2026 = Apr 5; − 7 weeks = Feb 15
    const year = new ThreeYear(2026);
    expect(formatDateKey(year.getTransfiguration())).toBe("2026-02-15");
  });
});

describe("ThreeYear inherits Year methods unchanged", () => {
  it("getAdvent matches Year.getAdvent", () => {
    const year3 = new ThreeYear(2025);
    const year1 = new Year(2025);
    expect(formatDateKey(year3.getAdvent())).toBe(
      formatDateKey(year1.getAdvent())
    );
  });

  it("getEaster matches Year.getEaster", () => {
    const year3 = new ThreeYear(2024);
    const year1 = new Year(2024);
    expect(formatDateKey(year3.getEaster())).toBe(
      formatDateKey(year1.getEaster())
    );
  });

  it("getLent matches Year.getLent", () => {
    const year3 = new ThreeYear(2026);
    const year1 = new Year(2026);
    expect(formatDateKey(year3.getLent())).toBe(formatDateKey(year1.getLent()));
  });

  it("returns Date instances from inherited and overridden getters", () => {
    const year = new ThreeYear(2026);

    [
      year.getAdvent(),
      year.getEaster(),
      year.getLent(),
      year.getTransfiguration(),
    ].forEach((value) => {
      expect(value).toBeInstanceOf(Date);
    });
  });
});
