import { cloneDate, createLocalDayjs, toPublicDate } from "./date.js";
import { Week } from "./Week.js";

function createSundaySnapshot(day) {
  return {
    ...day,
    date: cloneDate(day.date),
    sunday: null,
  };
}

function cloneSundaySnapshot(day) {
  return {
    ...day,
    date: cloneDate(day.date),
    sunday: null,
  };
}

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
   * @param {{ load(date: Date, weekOfLectionary: number | null): TPropers }} loader
   * @returns {Array<Array<{
   *   date: Date,
   *   day: number,
   *   week: number | null,
   *   propers: TPropers,
   *   sunday: object | null,
   * } | null>>}
   */
  build(loader) {
    const first = createLocalDayjs(this.#year, this.#month, 1);
    const last = createLocalDayjs(this.#year, this.#month, first.daysInMonth());

    let current = first;

    // Rewind to the first column of the first row
    if (first.day() !== 0) {
      current = current.subtract(first.day(), "day");
    }

    /** @type {Array<Array<{
     *   date: Date,
     *   day: number,
     *   week: number | null,
     *   propers: TPropers,
     *   sunday: object | null,
     * } | null>>} */
    const grid = [];

    let row = 0;
    while (current.valueOf() <= last.valueOf()) {
      // Each row spans a single Sunday-through-Saturday liturgical week.
      const weekOfLectionary = new Week(toPublicDate(current)).getWeek();
      let sunday = null;

      for (let col = 0; col <= 6; col++) {
        const publicDate = toPublicDate(current);
        const day = {
          date: cloneDate(publicDate),
          day: col + 1,
          week: weekOfLectionary,
          propers: loader.load(cloneDate(publicDate), weekOfLectionary),
          sunday: sunday ? cloneSundaySnapshot(sunday) : null,
        };

        if (!grid[row]) {
          grid[row] = new Array(7).fill(null, 0, 7);
          sunday = createSundaySnapshot(day);
        }

        if (
          current.valueOf() >= first.valueOf() &&
          current.valueOf() <= last.valueOf()
        ) {
          grid[row][col] = day;
        }

        current = current.add(1, "day");
      }

      row++;
    }

    return grid;
  }
}
