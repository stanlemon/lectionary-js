import { matchesProperDate } from "./matchesProperDate.js";

/**
 * Filters a flat proper list for a specific date in the one-year calendar.
 *
 * This loader is useful when callers do not need to preserve separate dataset
 * buckets such as lectionary versus festival propers.
 *
 * @implements {import("./Loader.js").default}
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
   * Load the matching propers from the flattened datasets.
   *
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
