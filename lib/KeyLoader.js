import { toInternalDayjs } from "./date.js";
import { matchesProperDate } from "./matchesProperDate.js";

/**
 * Filters keyed proper datasets for a specific date in the one-year calendar.
 *
 * Each dataset key such as `lectionary`, `festivals`, or `daily` is filtered
 * independently so callers can apply precedence rules after loading.
 *
 * @implements {import("./Loader.js").default}
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
   * Load the matching propers for each keyed dataset.
   *
   * @param {Date} date
   * @param {number | null} weekOfLectionary
   * @returns {import("./Loader.js").ProperDatasetMap}
   */
  load(date, weekOfLectionary) {
    const internalDate = toInternalDayjs(date, "KeyLoader.load");

    /** @type {import("./Loader.js").ProperDatasetMap} */
    const data = {};
    for (const [key, value] of Object.entries(this.#data)) {
      data[key] = value
        .filter((proper) =>
          matchesProperDate(proper, internalDate, weekOfLectionary)
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
  }
}
