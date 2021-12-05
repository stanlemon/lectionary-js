import { DateTime } from "luxon";
import { CalendarBuilder } from "./CalendarBuilder.js";

describe("CalendarBuilder", () => {
  it("works", () => {
    const calendarBuilder = new CalendarBuilder(2021, 1);
    const grid = calendarBuilder.build();

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

  it("first day is first row first column", () => {
    const calendarBuilder = new CalendarBuilder(2021, 8);
    const grid = calendarBuilder.build();

    expect(grid).not.toBeNull();

    // TODO: Add tests
  });
});
