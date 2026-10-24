import type Loader from "./Loader.js";
import type { ProperDatasetMap } from "./Loader.js";
/**
 * Filters keyed proper datasets for a specific date in the one-year calendar.
 *
 * Each dataset key such as `lectionary`, `festivals`, or `daily` is filtered
 * independently so callers can apply precedence rules after loading.
 *
 */
export declare class KeyLoader implements Loader {
    #private;
    /**
     * @param {import("./Loader.js").ProperDatasetMap} data
     */
    constructor(data: ProperDatasetMap);
    /**
     * Load the matching propers for each keyed dataset.
     *
     * @param {Date} date
     * @param {number | null} weekOfLectionary
     * @returns {import("./Loader.js").ProperDatasetMap}
     */
    load(date: Date, weekOfLectionary: number | null): ProperDatasetMap;
}
