/* eslint-disable max-lines-per-function */
const Sundays = require("./Sundays");
const { Week } = require("./Week");

// This data was generated from the previous PHP version of this library
const dates = require("../test-data.json");

const SUNDAYS_BY_VALUE = {};
Object.entries(Sundays).forEach(
  ([key, value]) => (SUNDAYS_BY_VALUE[value] = key)
);

// Create a test for every week and date combination
Object.keys(dates).forEach((key) => {
  const expected = Sundays[key];

  // Every Sunday is defined, but if we haven't specified dates to verify we'll skip over them
  if (!Array.isArray(dates[key])) {
    return;
  }

  dates[key].forEach((date) => {
    test(`${SUNDAYS_BY_VALUE[expected]} for ${date}`, () => {
      const week = new Week(new Date(date));
      expect(expected).toEqual(week.getWeek());
    });
  });
});
