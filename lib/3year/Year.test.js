import { describe, expect, it } from "vitest";
import { Year } from "../Year.js";
import { ThreeYear } from "./Year.js";

describe("ThreeYear.getTransfiguration", () => {
  it("is Easter minus 7 weeks", () => {
    const year = new ThreeYear(2026);
    const easter = year.getEaster();
    expect(year.getTransfiguration().toISODate()).toBe(
      easter.minus({ weeks: 7 }).toISODate()
    );
  });

  it("differs from the 1-year Transfiguration (Easter minus 10 weeks)", () => {
    const year3 = new ThreeYear(2025);
    const year1 = new Year(2025);
    expect(year3.getTransfiguration().toISODate()).not.toBe(
      year1.getTransfiguration().toISODate()
    );
  });

  it("returns correct date for 2025 (Easter Apr 20)", () => {
    // Easter 2025 = Apr 20; Apr 20 − 7 weeks = Mar 2
    const year = new ThreeYear(2025);
    expect(year.getTransfiguration().toISODate()).toBe("2025-03-02");
  });

  it("returns correct date for 2024 (Easter Mar 31)", () => {
    // Easter 2024 = Mar 31; − 7 weeks = Feb 11
    const year = new ThreeYear(2024);
    expect(year.getTransfiguration().toISODate()).toBe("2024-02-11");
  });

  it("returns correct date for 2026 (Easter Apr 5)", () => {
    // Easter 2026 = Apr 5; − 7 weeks = Feb 15
    const year = new ThreeYear(2026);
    expect(year.getTransfiguration().toISODate()).toBe("2026-02-15");
  });
});

describe("ThreeYear inherits Year methods unchanged", () => {
  it("getAdvent matches Year.getAdvent", () => {
    const year3 = new ThreeYear(2025);
    const year1 = new Year(2025);
    expect(year3.getAdvent().toISODate()).toBe(year1.getAdvent().toISODate());
  });

  it("getEaster matches Year.getEaster", () => {
    const year3 = new ThreeYear(2024);
    const year1 = new Year(2024);
    expect(year3.getEaster().toISODate()).toBe(year1.getEaster().toISODate());
  });

  it("getLent matches Year.getLent", () => {
    const year3 = new ThreeYear(2026);
    const year1 = new Year(2026);
    expect(year3.getLent().toISODate()).toBe(year1.getLent().toISODate());
  });
});
