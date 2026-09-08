import { toInternalDayjs } from "./date.js";
import { matchesProperDate } from "./matchesProperDate.js";
/**
 * Filters a flat proper list for a specific date in the one-year calendar.
 *
 * This loader is useful when callers do not need to preserve separate dataset
 * buckets such as lectionary versus festival propers.
 *
 */
export class SimpleLoader {
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
     * @param {Date} date
     * @param {number | null} weekOfLectionary
     * @returns {import("./Loader.js").Proper[]}
     */
    load(date, weekOfLectionary) {
        const internalDate = toInternalDayjs(date, "SimpleLoader.load");
        return this.#data.filter((proper) => matchesProperDate(proper, internalDate, weekOfLectionary));
    }
}
//# sourceMappingURL=SimpleLoader.js.map