import { formatDateKey } from "./date.js";
import { Year } from "./Year";

describe("Year", () => {
  it("getAdvent", () => {
    const years = {
      2017: "2017-12-03",
      2019: "2019-12-01",
      2020: "2020-11-29",
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(formatDateKey(calculator.getAdvent())).toBe(years[year]);
    });
  });

  it("getChristmas", () => {
    expect(formatDateKey(new Year(2021).getChristmas())).toBe("2021-12-25");
    expect(formatDateKey(new Year(2022).getChristmas())).toBe("2022-12-25");
  });

  it("getEpiphany", () => {
    expect(formatDateKey(new Year(2021).getEpiphany())).toBe("2021-01-06");
    expect(formatDateKey(new Year(2022).getEpiphany())).toBe("2022-01-06");
  });

  it("getEpiphanySunday", () => {
    // Jan 6, 2021 is a Wednesday — rewinds to the prior Sunday, Jan 3
    expect(formatDateKey(new Year(2021).getEpiphanySunday())).toEqual(
      "2021-01-03"
    );
    // Jan 6, 2019 is already a Sunday — returns Jan 6 itself
    expect(formatDateKey(new Year(2019).getEpiphanySunday())).toEqual(
      "2019-01-06"
    );
  });

  it("getEaster", () => {
    const years = {
      2015: "2015-04-05",
      2016: "2016-03-27",
      2017: "2017-04-16",
      2018: "2018-04-01",
      2019: "2019-04-21",
      2020: "2020-04-12",
      2021: "2021-04-04",
      2022: "2022-04-17",
      2023: "2023-04-09",
      2024: "2024-03-31",
      2025: "2025-04-20",
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(formatDateKey(calculator.getEaster())).toBe(years[year]);
    });
  });

  it("getLent", () => {
    // Easter minus 6 weeks
    expect(formatDateKey(new Year(2021).getLent())).toBe("2021-02-21");
    expect(formatDateKey(new Year(2022).getLent())).toBe("2022-03-06");
  });

  it("getAshWednesday", () => {
    // Lent minus 4 days
    expect(formatDateKey(new Year(2021).getAshWednesday())).toBe("2021-02-17");
    expect(formatDateKey(new Year(2022).getAshWednesday())).toBe("2022-03-02");
  });

  it("getTransfiguration", () => {
    const years = {
      2019: "2019-02-10",
      2021: "2021-01-24",
      2022: "2022-02-06",
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(formatDateKey(calculator.getTransfiguration())).toBe(years[year]);
    });
  });

  it("getTrinity", () => {
    // Easter plus 6 weeks
    expect(formatDateKey(new Year(2021).getTrinity())).toBe("2021-05-16");
    expect(formatDateKey(new Year(2022).getTrinity())).toBe("2022-05-29");
  });

  it("getPentecost", () => {
    // Easter plus 7 weeks
    expect(formatDateKey(new Year(2021).getPentecost())).toBe("2021-05-23");
    expect(formatDateKey(new Year(2022).getPentecost())).toBe("2022-06-05");
  });

  it("getLastSunday", () => {
    // Advent minus 1 week
    expect(formatDateKey(new Year(2021).getLastSunday())).toBe("2021-11-21");
    expect(formatDateKey(new Year(2019).getLastSunday())).toBe("2019-11-24");
  });

  it("getEndOfYear", () => {
    const years = {
      2019: "2019-11-10",
      2020: "2020-11-08",
      2021: "2021-11-07",
    };

    Object.keys(years).forEach((year) => {
      const calculator = new Year(year);
      expect(formatDateKey(calculator.getEndOfYear())).toBe(years[year]);
    });
  });

  it("returns Date instances and fresh copies from its getters", () => {
    const year = new Year(2025);

    [
      year.getAdvent(),
      year.getChristmas(),
      year.getEpiphany(),
      year.getEpiphanySunday(),
      year.getTransfiguration(),
      year.getAshWednesday(),
      year.getLent(),
      year.getEaster(),
      year.getTrinity(),
      year.getPentecost(),
      year.getLastSunday(),
      year.getEndOfYear(),
    ].forEach((value) => {
      expect(value).toBeInstanceOf(Date);
    });

    const easter = year.getEaster();
    easter.setFullYear(1900);

    expect(formatDateKey(year.getEaster())).toBe("2025-04-20");
  });
});
