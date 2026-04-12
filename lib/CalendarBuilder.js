import { DateTime } from "luxon";

import { Week } from "./Week.js";

/**
 * Build a calendar grid for a given month.
 */
export class CalendarBuilder {
  /** @type {number} */
  #year;

  /** @type {number} */
  #month;

  /**
   * @param {number} year
   * @param {number} month
   */
  constructor(year, month) {
    this.#year = year;
    this.#month = month;
  }

  /**
   * @template TPropers
   * @param {{ load(date: import("luxon").DateTime, weekOfLectionary: number | null): TPropers }} loader
   * @returns {Array<Array<{
   *   date: import("luxon").DateTime,
   *   day: number,
   *   week: number | null,
   *   propers: TPropers,
   *   sunday: object | null,
   * } | null>>}
   */
  build(loader) {
    const first = DateTime.local(this.#year, this.#month, 1, 0, 0, 0);
    const last = DateTime.local(
      this.#year,
      this.#month,
      first.daysInMonth,
      0,
      0,
      0
    );

    let current = first;

    // Rewind to the first column of the first row
    if (first.weekday !== 7) {
      current = current.minus({ days: first.weekday });
    }

    /** @type {Array<Array<{
     *   date: import("luxon").DateTime,
     *   day: number,
     *   week: number | null,
     *   propers: TPropers,
     *   sunday: object | null,
     * } | null>>} */
    const grid = [];

    let row = 0;
    let sunday = null;

    while (current <= last) {
      // Each row spans a single Sunday-through-Saturday liturgical week.
      const weekOfLectionary = new Week(current).getWeek();

      for (let col = 0; col <= 6; col++) {
        const day = {
          date: current,
          day: col + 1,
          week: weekOfLectionary,
          propers: loader.load(current, weekOfLectionary),
          sunday,
        };

        if (!grid[row]) {
          grid[row] = new Array(7).fill(null, 0, 7);
          sunday = day;
        }

        if (current >= first && current <= last) {
          grid[row][col] = day;
        }

        current = current.plus({ days: 1 });
      }

      row++;
    }

    return grid;
  }
}
