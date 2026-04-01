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

  it("getChristmas", () => {
    expect(new Year(2021).getChristmas()).toEqual(DateTime.local(2021, 12, 25));
    expect(new Year(2022).getChristmas()).toEqual(DateTime.local(2022, 12, 25));
  });

  it("getEpiphany", () => {
    expect(new Year(2021).getEpiphany()).toEqual(DateTime.local(2021, 1, 6));
    expect(new Year(2022).getEpiphany()).toEqual(DateTime.local(2022, 1, 6));
  });

  it("getEpiphanySunday", () => {
    // Jan 6, 2021 is a Wednesday — rewinds to the prior Sunday, Jan 3
    expect(new Year(2021).getEpiphanySunday().toISODate()).toEqual(
      "2021-01-03"
    );
    // Jan 6, 2019 is already a Sunday — returns Jan 6 itself
    expect(new Year(2019).getEpiphanySunday().toISODate()).toEqual(
      "2019-01-06"
    );
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

  it("getLent", () => {
    // Easter minus 6 weeks
    expect(new Year(2021).getLent()).toEqual(DateTime.local(2021, 2, 21));
    expect(new Year(2022).getLent()).toEqual(DateTime.local(2022, 3, 6));
  });

  it("getAshWednesday", () => {
    // Lent minus 4 days
    expect(new Year(2021).getAshWednesday()).toEqual(
      DateTime.local(2021, 2, 17)
    );
    expect(new Year(2022).getAshWednesday()).toEqual(
      DateTime.local(2022, 3, 2)
    );
  });

  it("getTransfiguration", () => {
    const years = {
      2019: DateTime.local(2019, 2, 10),
      2021: DateTime.local(2021, 1, 24),
      2022: DateTime.local(2022, 2, 6),
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(calculator.getTransfiguration()).toEqual(years[year]);
    });
  });

  it("getTrinity", () => {
    // Easter plus 6 weeks
    expect(new Year(2021).getTrinity()).toEqual(DateTime.local(2021, 5, 16));
    expect(new Year(2022).getTrinity()).toEqual(DateTime.local(2022, 5, 29));
  });

  it("getPentecost", () => {
    // Easter plus 7 weeks
    expect(new Year(2021).getPentecost()).toEqual(DateTime.local(2021, 5, 23));
    expect(new Year(2022).getPentecost()).toEqual(DateTime.local(2022, 6, 5));
  });

  it("getLastSunday", () => {
    // Advent minus 1 week
    expect(new Year(2021).getLastSunday()).toEqual(
      DateTime.local(2021, 11, 21)
    );
    expect(new Year(2019).getLastSunday()).toEqual(
      DateTime.local(2019, 11, 24)
    );
  });

  it("getEndOfYear", () => {
    const years = {
      2019: DateTime.local(2019, 11, 10),
      2020: DateTime.local(2020, 11, 8),
      2021: DateTime.local(2021, 11, 7),
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(calculator.getEndOfYear()).toEqual(years[year]);
    });
  });
});
