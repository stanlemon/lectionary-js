import dayjs from "dayjs";
// This data was generated from the previous PHP version of this library
import { TEST_DAYS, TEST_SUNDAYS } from "../data/tests.json";
import { formatDateKey } from "./date.js";
import Sundays from "./Sundays";
import { Week } from "./Week.js";

describe("Week edge cases", () => {
  it("returns null when Christmas falls on a Sunday", () => {
    // Dec 25, 2022 is a Sunday — the library explicitly cannot calculate this week.
    // Use MM/DD/YYYY format so the Date is parsed in local time, not UTC.
    expect(new Week(new Date("12/25/2022")).getWeek()).toBeNull();
  });

  it("normalizes Date inputs to the start of the local day", () => {
    const sunday = new Week(new Date(2021, 11, 5, 15, 45)).getSunday();

    expect(sunday).toBeInstanceOf(Date);
    expect(formatDateKey(sunday)).toBe("2021-12-05");
    expect(sunday.getHours()).toBe(0);
    expect(sunday.getMinutes()).toBe(0);
  });

  it("rejects Day.js input", () => {
    expect(() => new Week(dayjs(new Date(2021, 11, 5, 15, 45)))).toThrow(
      TypeError
    );
  });

  it("returns a fresh Sunday Date each time", () => {
    const week = new Week(new Date("12/08/2021"));
    const sunday = week.getSunday();

    sunday.setDate(1);

    expect(formatDateKey(week.getSunday())).toBe("2021-12-05");
  });
});

const SUNDAYS_BY_VALUE = {};
Object.entries(Sundays).forEach(([key, value]) => {
  SUNDAYS_BY_VALUE[value] = key;
});

describe("Sundays", () => {
  // Create a test for every week and date combination
  Object.keys(TEST_SUNDAYS).forEach((key) => {
    const expected = Sundays[key];

    // Every Sunday is defined, but if we haven't specified dates to verify we'll skip over them
    if (!Array.isArray(TEST_SUNDAYS[key])) {
      return;
    }

    TEST_SUNDAYS[key].forEach((date) => {
      it(`${SUNDAYS_BY_VALUE[expected]} for ${date}`, () => {
        const week = new Week(new Date(date));
        expect(week.getWeek()).toEqual(expected);
      });
    });
  });
});

describe("Days", () => {
  // Create a test for every week and date combination
  Object.keys(TEST_DAYS).forEach((date) => {
    const expected = Sundays[TEST_DAYS[date]];

    test(`${SUNDAYS_BY_VALUE[expected]} for ${date}`, () => {
      const week = new Week(new Date(date));
      expect(week.getWeek()).toEqual(expected);
    });
  });
});
