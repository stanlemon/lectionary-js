import { toInternalDayjs } from "./date.js";
import type Loader from "./Loader.js";
import type { ProperDatasetMap } from "./Loader.js";
import { matchesProperDate } from "./matchesProperDate.js";

/**
 * Filters keyed proper datasets for a specific date in the one-year calendar.
 *
 * Each dataset key such as `lectionary`, `festivals`, or `daily` is filtered
 * independently so callers can apply precedence rules after loading.
 *
 */
export class KeyLoader implements Loader {
  #data: ProperDatasetMap;

  /**
   * @param {import("./Loader.js").ProperDatasetMap} data
   */
  constructor(data: ProperDatasetMap) {
    this.#data = data;
  }

  /**
   * Load the matching propers for each keyed dataset.
   *
   * @param {Date} date
   * @param {number | null} weekOfLectionary
   * @returns {import("./Loader.js").ProperDatasetMap}
   */
  load(date: Date, weekOfLectionary: number | null): ProperDatasetMap {
    const internalDate = toInternalDayjs(date, "KeyLoader.load");

    /** @type {import("./Loader.js").ProperDatasetMap} */
    const data: ProperDatasetMap = {};
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
