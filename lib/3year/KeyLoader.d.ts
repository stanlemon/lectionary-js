import type { Proper, ProperDatasetMap, SeriesDatasetMap } from "../Loader.js";
type ThreeYearKeyLoaderData = {
    series: SeriesDatasetMap;
    [key: string]: Proper[] | SeriesDatasetMap;
};
/**
 * A KeyLoader for the three-year lectionary. Selects the correct series
 * (A, B, or C) for a given date and merges it with shared datasets
 * (festivals, daily, commemorations) that apply across all series.
 *
 * @implements Loader
 *
 * @example
 * const loader = new ThreeYearKeyLoader({
 *   series: { A: lsb3yrA, B: lsb3yrB, C: lsb3yrC },
 *   festivals: lsbFestivals,
 *   daily: lsbDaily,
 *   commemorations: lsbCommemorations,
 * });
 */
export declare class ThreeYearKeyLoader {
    #private;
    /**
     * @param {{
     *   series: import("../Loader.js").SeriesDatasetMap,
     *   [key: string]: import("../Loader.js").ProperDatasetMap[string] | import("../Loader.js").SeriesDatasetMap,
     * }} data
     *   `series` maps liturgical series letters to their proper datasets.
     *   All other keys are shared datasets applied regardless of series.
     */
    constructor({ series, ...shared }: ThreeYearKeyLoaderData);
    /**
     * Load propers for a given date.
     * The week number is computed internally via ThreeYearWeek so ordinary-time
     * Propers (weeks 58–84) resolve correctly regardless of what the caller passes.
     * @param {Date} date
     * @returns {import("../Loader.js").ProperDatasetMap}
     */
    load(date: Date, _weekOfLectionary?: number | null): ProperDatasetMap;
}
export {};
