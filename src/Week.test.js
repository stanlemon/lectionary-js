const Sundays = require("./Sundays");
const { Week } = require("./Week");

describe("Week", () => {
  it("works", () => {
    const date = new Date("October 25, 2020");
    const week = new Week(date);
    expect(week.getWeek()).toEqual(Sundays.TRINITY_20);
  });
});
