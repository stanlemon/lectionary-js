import { matchesProperDate } from "./matchesProperDate.js";

/**
 * @implements Loader
 */
export class KeyLoader {
  constructor(data) {
    /**
     * @private
     */
    this._data = data;
  }

  /**
   * Load specific propers
   * @param {DateTime} date
   * @param {number} weekOfLectionary
   */
  load(date, weekOfLectionary) {
    const data = {};
    for (const [key, value] of Object.entries(this._data)) {
      data[key] = value
        .filter((proper) => matchesProperDate(proper, date, weekOfLectionary))
        .sort((first, second) => {
          if (first.week && !second.week) {
            return -1;
          }
          if (!first.week && second.week) {
            return 1;
          }
          return 0;
        });
    }

    return data;
  }
}
