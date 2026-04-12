import { matchesProperDate } from "./matchesProperDate.js";

/**
 * @implements Loader
 */
export class KeyLoader {
  /** @type {import("./Loader.js").ProperDatasetMap} */
  #data;

  /**
   * @param {import("./Loader.js").ProperDatasetMap} data
   */
  constructor(data) {
    this.#data = data;
  }

  /**
   * Load specific propers
   * @param {import("luxon").DateTime} date
   * @param {number | null} weekOfLectionary
   * @returns {import("./Loader.js").ProperDatasetMap}
   */
  load(date, weekOfLectionary) {
    /** @type {import("./Loader.js").ProperDatasetMap} */
    const data = {};
    for (const [key, value] of Object.entries(this.#data)) {
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
