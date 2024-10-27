import Sundays from "./Sundays";
import { Week } from "./Week.js";
// This data was generated from the previous PHP version of this library
import { TEST_SUNDAYS, TEST_DAYS } from "../data/tests.json";

const SUNDAYS_BY_VALUE = {};
Object.entries(Sundays).forEach(
  ([key, value]) => (SUNDAYS_BY_VALUE[value] = key)
);

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
