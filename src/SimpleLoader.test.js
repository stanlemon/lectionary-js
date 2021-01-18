const { CalendarBuilder } = require("./CalendarBuilder");
const { SimpleLoader } = require("./SimpleLoader");

const oneyear = require("../data/lsb-1yr.json");
const daily = require("../data/lsb-daily.json");

describe("SimpleLoader", () => {
  it("works", () => {
    const loader = new SimpleLoader(oneyear, daily);
    const calendarBuilder = new CalendarBuilder(2021, 1);
    const grid = calendarBuilder.build(loader.load);

    expect(grid).not.toBeNull();

    expect(grid[1][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "Sunday after New Years"
    );
    expect(grid[2][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "The Baptism of Our Lord"
    );
    expect(grid[3][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "Epiphany 2"
    );
    expect(grid[4][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "St. Timothy, Pastor" /* "Transfiguration" */ // St. Tim appears first in the data file
    );
    expect(grid[5][0].propers.filter((p) => p.type === 0)[0].text).toEqual(
      "Septuagesima"
    );
  });
});
