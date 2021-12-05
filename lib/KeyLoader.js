export class KeyLoader {
  #data = {};

  constructor(data) {
    this.#data = data;
  }

  /**
   * Load specific propers
   * @param {*} date
   * @param {*} weekOfLectionary
   */
  load = (date, weekOfLectionary) => {
    // Luxon makes Sunday as '7', but it's the first day of our week
    const weekday = date.weekday === 7 ? 0 : date.weekday;

    const data = {};

    for (const [key, value] of Object.entries(this.#data)) {
      data[key] = value
        .filter(
          (proper) =>
            // Temporarily increment by 1, this is an issue with the data source that needs to get fixed
            (proper.week === weekOfLectionary && proper.day === weekday) ||
            (proper.month === date.month && proper.day === date.day)
        )
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
  };
}
