import { matchesProperDate } from "./matchesProperDate.js";

/**
 * @implements Loader
 */
export class SimpleLoader {
  constructor(...dataSets) {
    /**
     * @private
     */
    this._data = dataSets.flat();
  }

  /**
   * Load specific propers
   * @param {DateTime} date
   * @param {number} weekOfLectionary
   */
  load(date, weekOfLectionary) {
    return this._data.filter((proper) =>
      matchesProperDate(proper, date, weekOfLectionary)
    );
  }
}
