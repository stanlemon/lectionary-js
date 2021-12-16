import { DateTime } from "luxon";
import { Week } from "./Week.js";

/**
 * Build a calendar grid for a given month.
 */
export class CalendarBuilder {
  /**
   * @param {int} year
   * @param {int} month
   */
  constructor(year, month) {
    /**
     * @type {int}
     * @private
     */
    this._year = year;
    /**
     * @type {int}
     * @private
     */
    this._month = month;
  }

  /**
   * @param {Loader} loader
   */
  build(loader) {
    const first = DateTime.local(this._year, this._month, 1, 0, 0, 0);
    const last = DateTime.local(
      this._year,
      this._month,
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

    const grid = [];

    let row = 0;
    let sunday = null;

    while (current <= last) {
      for (let col = 0; col <= 6; col++) {
        // Calculate the week of the church year
        const weekCalculator = new Week(current);
        const weekOfLectionary = weekCalculator.getWeek();

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
