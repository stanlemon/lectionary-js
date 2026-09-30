import type Loader from "./Loader.js";
import type { Proper } from "./Loader.js";
/**
 * Filters a flat proper list for a specific date in the one-year calendar.
 *
 * This loader is useful when callers do not need to preserve separate dataset
 * buckets such as lectionary versus festival propers.
 *
 */
export declare class SimpleLoader implements Loader {
    #private;
    /**
     * @param {...import("./Loader.js").Proper[]} dataSets
     */
    constructor(...dataSets: Proper[][]);
    /**
     * Load the matching propers from the flattened datasets.
     *
     * @param {Date} date
     * @param {number | null} weekOfLectionary
     * @returns {import("./Loader.js").Proper[]}
     */
    load(date: Date, weekOfLectionary: number | null): Proper[];
}
