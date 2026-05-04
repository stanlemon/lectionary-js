import { toInternalDayjs } from "./date.js";
import type Loader from "./Loader.js";
import type { Proper } from "./Loader.js";
import { matchesProperDate } from "./matchesProperDate.js";

/**
 * Filters a flat proper list for a specific date in the one-year calendar.
 *
 * This loader is useful when callers do not need to preserve separate dataset
 * buckets such as lectionary versus festival propers.
 *
 */
export class SimpleLoader implements Loader {
  #data: Proper[];

  /**
   * @param {...import("./Loader.js").Proper[]} dataSets
   */
  constructor(...dataSets: Proper[][]) {
    this.#data = dataSets.flat();
  }

  /**
   * Load the matching propers from the flattened datasets.
   *
   * @param {Date} date
   * @param {number | null} weekOfLectionary
   * @returns {import("./Loader.js").Proper[]}
   */
  load(date: Date, weekOfLectionary: number | null): Proper[] {
    const internalDate = toInternalDayjs(date, "SimpleLoader.load");
    return this.#data.filter((proper) =>
      matchesProperDate(proper, internalDate, weekOfLectionary)
    );
  }
}
