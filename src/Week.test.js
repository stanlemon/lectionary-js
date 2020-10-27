const Sundays = require("./Sundays");
const { Week } = require("./Week");

test("Week", () => {
  const dates = {
    [Sundays.TRINITY_20]: ["11/02/2019", "10/25/2020"],
    [Sundays.TRINITY_23]: ["11/04/2018"],
  };

  Object.keys(dates).forEach((key) => {
    const expected = parseInt(key, 10);

    dates[expected].forEach((date) => {
      const week = new Week(new Date(date));
      expect(week.getWeek()).toEqual(expected);
    });
  });
});
