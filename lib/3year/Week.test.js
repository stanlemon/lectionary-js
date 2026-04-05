import { describe, it, expect } from "vitest";
import { ThreeYearWeek } from "./Week.js";
import Sundays from "../Sundays.js";

// NOTE: Use MM/DD/YYYY date strings to avoid UTC-midnight timezone issues.
// See CLAUDE.md: new Date("2022-12-25") parses as UTC midnight → Dec 24 locally.

function week(dateStr) {
  return new ThreeYearWeek(new Date(dateStr)).getWeek();
}

describe("ThreeYearWeek — Advent", () => {
  // Advent 2025 starts Nov 30
  it("Advent 1 2025 (Nov 30)", () => expect(week("11/30/2025")).toBe(Sundays.ADVENT_1));
  it("Advent 2 2025 (Dec 7)", () => expect(week("12/07/2025")).toBe(Sundays.ADVENT_2));
  it("Advent 4 2025 (Dec 21)", () => expect(week("12/21/2025")).toBe(Sundays.ADVENT_4));
});

describe("ThreeYearWeek — Christmas null", () => {
  it("Dec 25 on Sunday returns null (2022)", () => expect(week("12/25/2022")).toBeNull());
});

describe("ThreeYearWeek — Before Epiphany", () => {
  // Sunday after Christmas 2025 = Dec 28
  it("Sunday after Christmas 2025 (Dec 28)", () =>
    expect(week("12/28/2025")).toBe(Sundays.SUNDAY_AFTER_CHRISTMAS));
});

describe("ThreeYearWeek — Epiphany season", () => {
  // 2026: Epiphany = Jan 6 (Tue), epiphanySunday = Jan 4
  // Baptism of Our Lord (n=1): Jan 11
  it("Baptism of Our Lord 2026 (Jan 11)", () =>
    expect(week("01/11/2026")).toBe(Sundays.THE_BAPTISM_OF_OUR_LORD));
  it("Epiphany 2 2026 (Jan 18)", () => expect(week("01/18/2026")).toBe(Sundays.EPIPHANY_2));
  it("Epiphany 3 2026 (Jan 25)", () => expect(week("01/25/2026")).toBe(Sundays.EPIPHANY_3));
  it("Epiphany 4 2026 (Feb 1)", () => expect(week("02/01/2026")).toBe(Sundays.EPIPHANY_4));
  it("Epiphany 5 2026 (Feb 8)", () => expect(week("02/08/2026")).toBe(Sundays.EPIPHANY_5));

  // Transfiguration 2026 = Feb 15 (Easter Apr 5 − 7 weeks)
  it("Transfiguration 2026 (Feb 15)", () =>
    expect(week("02/15/2026")).toBe(Sundays.TRANSFIGURATION));
});

describe("ThreeYearWeek — Epiphany 6/7/8 in a late-Easter year", () => {
  // 2019: Easter Apr 21. Transfiguration = Apr 21 − 7 weeks = Mar 3.
  // Jan 6 2019 is a Sunday, so epiphanySunday = Jan 6.
  // n=6 → Feb 17 (Ep 6, week 13), n=7 → Feb 24 (Ep 7, week 14)
  // Mar 3 = Transfiguration → week 12
  it("Epiphany 6 in 2019 (Feb 17)", () =>
    expect(week("02/17/2019")).toBe(Sundays.EPIPHANY_6));
  it("Epiphany 7 in 2019 (Feb 24)", () =>
    expect(week("02/24/2019")).toBe(Sundays.EPIPHANY_7));
  it("Transfiguration 2019 (Mar 3)", () =>
    expect(week("03/03/2019")).toBe(Sundays.TRANSFIGURATION));
});

describe("ThreeYearWeek — Lent through Trinity Sunday", () => {
  // 2026: Easter Apr 5, Lent 1 = Feb 22 (Easter − 6 weeks)
  it("Lent 1 2026 (Feb 22)", () => expect(week("02/22/2026")).toBe(Sundays.LENT_1));
  it("Lent 2 2026 (Mar 1)", () => expect(week("03/01/2026")).toBe(Sundays.LENT_2));
  it("Lent 5 2026 (Mar 22)", () => expect(week("03/22/2026")).toBe(Sundays.LENT_5));
  it("Palm Sunday 2026 (Mar 29)", () => expect(week("03/29/2026")).toBe(Sundays.PALM_SUNDAY));
  it("Easter 2026 (Apr 5)", () => expect(week("04/05/2026")).toBe(Sundays.EASTER));
  it("Easter 2 2026 (Apr 12)", () => expect(week("04/12/2026")).toBe(Sundays.EASTER_2));
  // Pentecost 2026 = May 24 (Easter + 7 weeks)
  it("Pentecost 2026 (May 24)", () => expect(week("05/24/2026")).toBe(Sundays.PENTECOST));
  // Trinity Sunday 2026 = May 31 (Easter + 8 weeks)
  it("Trinity Sunday 2026 (May 31)", () =>
    expect(week("05/31/2026")).toBe(Sundays.TRINITY_SUNDAY));
});

describe("ThreeYearWeek — Ordinary Time (Propers)", () => {
  // After Trinity Sunday 2026 (May 31), first Ordinary Time Sunday = June 7
  // "06-07" → Proper 5 (06-05 to 06-11) → week 60
  it("Proper 5 2026 (Jun 7)", () => expect(week("06/07/2026")).toBe(Sundays.PROPER_5));
  it("Proper 6 2026 (Jun 14)", () => expect(week("06/14/2026")).toBe(Sundays.PROPER_6));
  it("Proper 10 2026 (Jul 12)", () => expect(week("07/12/2026")).toBe(Sundays.PROPER_10));
  it("Proper 20 2026 (Sep 20)", () => expect(week("09/20/2026")).toBe(Sundays.PROPER_20));

  // Proper 29 (Christ the King): Nov 20-26. Proper 29 = week 84.
  it("Proper 29 2026 (Nov 22)", () => expect(week("11/22/2026")).toBe(Sundays.PROPER_29));

  // Early-Easter year: Easter Mar 27 2016, Trinity = May 22
  // First Ordinary Time Sunday = May 29 → Proper 4 (05-29 to 06-04) → week 59
  it("Proper 4 2016 (May 29)", () => expect(week("05/29/2016")).toBe(Sundays.PROPER_4));

  // Very early Easter: Easter Mar 23 2008, Trinity = May 18
  // First Ordinary Time Sunday = May 25 → Proper 3 (05-24 to 05-28) → week 58
  it("Proper 3 2008 (May 25)", () => expect(week("05/25/2008")).toBe(Sundays.PROPER_3));
});
