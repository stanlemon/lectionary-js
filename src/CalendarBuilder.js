const { DateTime } = require("luxon");
const { Week } = require("./Week");

/**
 * Build a calendar grid for a given month.
 */
class CalendarBuilder {
  /**
   * @type {int}
   */
  #month;
  /**
   * @type {int}
   */
  #year;

  /**
   *
   * @param {int} year
   * @param {int} month
   */
  constructor(year, month) {
    this.#year = year;
    this.#month = month;
  }

  /**
   *
   * @param {*} loader
   */
  build(loader = (/* date, weekOfLectionary */) => []) {
    const first = DateTime.local(this.#year, this.#month, 1, 0, 0, 0);
    const last = DateTime.local(
      this.#year,
      this.#month,
      first.daysInMonth,
      0,
      0,
      0
    );
    const grid = [];

    let current = first;
    let row = 0;
    let started = false; // Track when we've started the month (there can be non-month blocks at the start of the grid).

    while (current <= last) {
      for (let col = 0; col <= 6; col++) {
        if (!grid[row]) {
          grid[row] = new Array(7).fill(null, 0, 7);
        }

        // Luxon makes Sunday as '7', but it's the first day of our week
        const weekday = current.weekday === 7 ? 0 : current.weekday;

        if (started === false && col === weekday) {
          started = true;
        }

        if (started && current <= last) {
          // Calculate the week of the church year
          const weekCalculator = new Week(current);
          const weekOfLectionary = weekCalculator.getWeek();

          grid[row][col] = {
            date: current,
            day: col + 1,
            week: weekOfLectionary,
            propers: loader(current, weekOfLectionary),
          };

          current = current.plus({ days: 1 });
        }
      }

      row++;
    }

    return grid;
  }
}

module.exports = {
  CalendarBuilder,
};
