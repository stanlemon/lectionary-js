const { DateTime } = require("luxon");
const { Week } = require("./Week");

describe("Week", () => {
  it("works", () => {
    // Right now
    const week = new Week(new Date());
    week.getWeek();
  });
});
