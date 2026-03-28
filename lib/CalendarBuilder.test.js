import { DateTime } from "luxon";

import { CalendarBuilder } from "./CalendarBuilder.js";

describe("CalendarBuilder", () => {
  const mockLoader = { load: () => {} };

  it("works", () => {
    const calendarBuilder = new CalendarBuilder(2021, 1);
    const grid = calendarBuilder.build(mockLoader);

    expect(grid).not.toBeNull();

    // First of the month is in the right grid position
    expect(DateTime.local(2021, 1, 1).hasSame(grid[0][5].date, "day")).toBe(
      true
    );
    // Last of the month is in the right grid position
    expect(DateTime.local(2021, 1, 31).hasSame(grid[5][0].date, "day")).toBe(
      true
    );

    expect(grid[0][0]).toBe(null);
    expect(grid[0][1]).toBe(null);
    expect(grid[0][2]).toBe(null);
    expect(grid[0][3]).toBe(null);
    expect(grid[0][4]).toBe(null);
    expect(grid[0][5].day).toBe(6); // First day of the month
    expect(grid[0][5].week).toBe(5);
    expect(grid[0][6].day).toBe(7);
    expect(grid[0][6].week).toBe(5);

    expect(grid[1][0].day).toBe(1);
    expect(grid[1][0].week).toBe(6);
    expect(grid[1][1].day).toBe(2);
    expect(grid[1][1].week).toBe(6);
    expect(grid[1][2].day).toBe(3);
    expect(grid[1][2].week).toBe(6);
    expect(grid[1][3].day).toBe(4);
    expect(grid[1][3].week).toBe(6);
    expect(grid[1][4].day).toBe(5);
    expect(grid[1][4].week).toBe(6);
    expect(grid[1][5].day).toBe(6);
    expect(grid[1][5].week).toBe(6);
    expect(grid[1][6].day).toBe(7);
    expect(grid[1][6].week).toBe(6);

    expect(grid[5][0].day).toBe(1);
    expect(grid[5][0].week).toBe(13); // Septuagesima
    expect(grid[5][1]).toBe(null);
    expect(grid[5][2]).toBe(null);
    expect(grid[5][3]).toBe(null);
    expect(grid[5][4]).toBe(null);
    expect(grid[5][5]).toBe(null);
    expect(grid[5][6]).toBe(null);
  });

  it("month starting on Sunday places first day in first column", () => {
    // August 2021 starts on a Sunday (Luxon weekday 7)
    const calendarBuilder = new CalendarBuilder(2021, 8);
    const grid = calendarBuilder.build(mockLoader);

    expect(grid).not.toBeNull();

    // August 1 should be in column 0 (Sunday) of the first row — no rewind needed
    expect(DateTime.local(2021, 8, 1).hasSame(grid[0][0].date, "day")).toBe(true);

    // August 31 (Tuesday) should be in column 2 of the fifth row
    expect(DateTime.local(2021, 8, 31).hasSame(grid[4][2].date, "day")).toBe(true);

    // Trailing cells after the 31st should be null
    expect(grid[4][3]).toBe(null);
    expect(grid[4][4]).toBe(null);
    expect(grid[4][5]).toBe(null);
    expect(grid[4][6]).toBe(null);

    // Only 5 rows for this month
    expect(grid[5]).toBeUndefined();
  });
});
