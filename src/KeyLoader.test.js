const { CalendarBuilder } = require("./CalendarBuilder");
const { KeyLoader } = require("./KeyLoader");

const lectionary = require("../data/lsb-1yr.json");
const festivals = require("../data/lsb-festivals.json");

describe("KeyLoader", () => {
  it("works", () => {
    const loader = new KeyLoader({ lectionary, festivals });
    const calendarBuilder = new CalendarBuilder(2021, 1);
    const grid = calendarBuilder.build(loader.load);

    expect(grid).not.toBeNull();

    expect(
      grid[1][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("Sunday after New Years");
    expect(
      grid[2][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("The Baptism of Our Lord");
    expect(
      grid[3][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("Epiphany 2");
    expect(
      grid[4][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("Transfiguration");
    expect(
      grid[4][0].propers.festivals.filter((p) => p.type === 0)[0].text
    ).toEqual("St. Timothy, Pastor");
    expect(
      grid[5][0].propers.lectionary.filter((p) => p.type === 0)[0].text
    ).toEqual("Septuagesima");
  });
});
