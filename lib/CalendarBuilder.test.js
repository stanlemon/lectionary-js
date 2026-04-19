import { CalendarBuilder } from "./CalendarBuilder.js";
import { formatDateKey } from "./date.js";

describe("CalendarBuilder", () => {
  const mockLoader = { load: () => {} };

  it("works", () => {
    const calendarBuilder = new CalendarBuilder(2021, 1);
    const grid = calendarBuilder.build(mockLoader);

    expect(grid).not.toBeNull();

    // First of the month is in the right grid position
    expect(grid[0][5].date).toBeInstanceOf(Date);
    expect(formatDateKey(grid[0][5].date)).toBe("2021-01-01");
    // Last of the month is in the right grid position
    expect(formatDateKey(grid[5][0].date)).toBe("2021-01-31");

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

  it("month with 28 days starting on Sunday fills exactly 4 rows with no nulls", () => {
    // February 2015: starts on Sunday, ends on Saturday — perfect 4-row grid
    const calendarBuilder = new CalendarBuilder(2015, 2);
    const grid = calendarBuilder.build(mockLoader);

    expect(grid).toHaveLength(4);

    // First cell is Feb 1, no leading nulls
    expect(formatDateKey(grid[0][0].date)).toBe("2015-02-01");

    // Last cell is Feb 28, no trailing nulls
    expect(formatDateKey(grid[3][6].date)).toBe("2015-02-28");

    // Every cell in the grid is populated
    grid.forEach((week) => {
      week.forEach((day) => {
        expect(day).not.toBeNull();
      });
    });
  });

  it("month starting on Sunday places first day in first column", () => {
    const calendarBuilder = new CalendarBuilder(2021, 8);
    const grid = calendarBuilder.build(mockLoader);

    expect(grid).not.toBeNull();

    // August 1 should be in column 0 (Sunday) of the first row — no rewind needed
    expect(formatDateKey(grid[0][0].date)).toBe("2021-08-01");

    // August 31 (Tuesday) should be in column 2 of the fifth row
    expect(formatDateKey(grid[4][2].date)).toBe("2021-08-31");

    // Trailing cells after the 31st should be null
    expect(grid[4][3]).toBe(null);
    expect(grid[4][4]).toBe(null);
    expect(grid[4][5]).toBe(null);
    expect(grid[4][6]).toBe(null);

    // Only 5 rows for this month
    expect(grid[5]).toBeUndefined();
  });

  it("stores local-midnight Date values in the grid", () => {
    const calendarBuilder = new CalendarBuilder(2021, 12);
    const grid = calendarBuilder.build(mockLoader);
    const date = grid[1][0].date;

    expect(date).toBeInstanceOf(Date);
    expect(formatDateKey(date)).toBe("2021-12-05");
    expect(date.getHours()).toBe(0);
    expect(date.getMinutes()).toBe(0);
  });

  it("clones dates passed to the loader", () => {
    const loader = {
      load(date) {
        date.setDate(1);
        return [];
      },
    };
    const calendarBuilder = new CalendarBuilder(2021, 12);
    const grid = calendarBuilder.build(loader);

    expect(formatDateKey(grid[0][3].date)).toBe("2021-12-01");
    expect(formatDateKey(grid[1][0].date)).toBe("2021-12-05");
  });

  it("returns fresh Date instances for grid cells across builds", () => {
    const calendarBuilder = new CalendarBuilder(2021, 12);
    const firstGrid = calendarBuilder.build(mockLoader);
    const secondGrid = calendarBuilder.build(mockLoader);

    firstGrid[1][0].date.setDate(1);

    expect(formatDateKey(firstGrid[1][1].date)).toBe("2021-12-06");
    expect(formatDateKey(secondGrid[1][0].date)).toBe("2021-12-05");
  });

  it("clones Sunday snapshots for each cell", () => {
    const calendarBuilder = new CalendarBuilder(2021, 12);
    const grid = calendarBuilder.build(mockLoader);

    grid[1][2].sunday.date.setDate(1);

    expect(formatDateKey(grid[1][3].sunday.date)).toBe("2021-12-05");
    expect(grid[1][0].sunday).toBeNull();
  });
});
