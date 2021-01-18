class FileLoader {
  #data = [];

  constructor(files = []) {
    files.forEach((file) => {
      this.#data = [...this.#data, ...require(file)];
    });
  }

  /**
   * Load specific propers
   * @param {*} date
   * @param {*} weekOfLectionary
   */
  load = (date, weekOfLectionary) =>
    this.#data.filter(
      (proper) =>
        (proper.week === weekOfLectionary && proper.day === date.weekday) ||
        (proper.month === date.month && proper.day === date.weekday)
    );
}

module.exports = {
  FileLoader,
};
