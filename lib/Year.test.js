import { DateTime } from "luxon";
import { Year } from "./Year";

describe("Year", () => {
  it("getAdvent", () => {
    const years = {
      2017: DateTime.local(2017, 12, 3),
      2019: DateTime.local(2019, 12, 1),
      2020: DateTime.local(2020, 11, 29),
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(calculator.getAdvent()).toEqual(years[year]);
    });
  });

  it("getEaster", () => {
    const years = {
      2015: DateTime.local(2015, 4, 5),
      2016: DateTime.local(2016, 3, 27),
      2017: DateTime.local(2017, 4, 16),
      2018: DateTime.local(2018, 4, 1),
      2019: DateTime.local(2019, 4, 21),
      2020: DateTime.local(2020, 4, 12),
      2021: DateTime.local(2021, 4, 4),
      2022: DateTime.local(2022, 4, 17),
      2023: DateTime.local(2023, 4, 9),
      2024: DateTime.local(2024, 3, 31),
      2025: DateTime.local(2025, 4, 20),
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(calculator.getEaster()).toEqual(years[year]);
    });
  });

  it("getTransfiguration", () => {
    const years = {
      2021: DateTime.local(2021, 1, 24),
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(calculator.getTransfiguration()).toEqual(years[year]);
    });
  });

  it("getEndOfYear", () => {
    const years = {
      2020: DateTime.local(2020, 11, 8),
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(calculator.getEndOfYear()).toEqual(years[year]);
    });
  });
});
