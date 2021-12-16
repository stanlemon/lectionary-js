/**
 * @implements Loader
 */
export class SimpleLoader {
  constructor() {
    /**
     * @private
     */
    this._data = [];
    [...arguments].forEach((data) => (this._data = [...this._data, ...data]));
  }

  /**
   * Load specific propers
   * @param {DateTime} date
   * @param {number} weekOfLectionary
   */
  load(date, weekOfLectionary) {
    // Luxon makes Sunday as '7', but it's the first day of our week
    const weekday = date.weekday === 7 ? 0 : date.weekday;
    return this._data.filter(
      (proper) =>
        // Temporarily increment by 1, this is an issue with the data source that needs to get fixed
        (proper.week === weekOfLectionary && proper.day === weekday) ||
        (proper.month === date.month && proper.day === date.day)
    );
  }
}
