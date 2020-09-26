const { Year } = require("./Year");

describe("Year", () => {
  it("getAdvent", () => {
    const years = {
      2017: new Date("2017-12-03T05:00:00.000Z"),
      2019: new Date("2019-12-01T05:00:00.000Z"),
      2020: new Date("2020-11-29T05:00:00.000Z"),
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);

      expect(calculator.getAdvent().toJSDate()).toEqual(years[year]);
    });
  });

  it("getEaster", () => {
    const years = {
      2015: new Date("2015-04-05T04:00:00.000Z"),
      2016: new Date("2016-03-27T04:00:00.000Z"),
      2017: new Date("2017-04-16T04:00:00.000Z"),
      2018: new Date("2018-04-01T04:00:00.000Z"),
      2019: new Date("2019-04-21T04:00:00.000Z"),
      2020: new Date("2020-04-12T04:00:00.000Z"),
      2021: new Date("2021-04-04T04:00:00.000Z"),
      2022: new Date("2022-04-17T04:00:00.000Z"),
      2023: new Date("2023-04-09T04:00:00.000Z"),
      2024: new Date("2024-03-31T04:00:00.000Z"),
      2025: new Date("2025-04-20T04:00:00.000Z"),
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);

      expect(calculator.getEaster().toJSDate()).toEqual(years[year]);
    });
  });
});
