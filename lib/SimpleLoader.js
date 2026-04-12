import { matchesProperDate } from "./matchesProperDate.js";

/**
 * @implements Loader
 */
export class SimpleLoader {
  /** @type {import("./Loader.js").Proper[]} */
  #data;

  /**
   * @param {...import("./Loader.js").Proper[]} dataSets
   */
  constructor(...dataSets) {
    this.#data = dataSets.flat();
  }

  /**
   * Load specific propers
   * @param {import("luxon").DateTime} date
   * @param {number | null} weekOfLectionary
   * @returns {import("./Loader.js").Proper[]}
   */
  load(date, weekOfLectionary) {
    return this.#data.filter((proper) =>
      matchesProperDate(proper, date, weekOfLectionary)
    );
  }
}
