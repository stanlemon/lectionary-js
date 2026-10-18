import type { SeriesKey } from "../Loader.js";
/**
 * Calculates the three-year lectionary series letter for a date.
 */
export declare class Series {
    #private;
    /**
     * @param {Date} date
     */
    constructor(date: Date);
    /**
     * Returns the liturgical series ("A", "B", or "C") for the date.
     *
     * The series is determined by the calendar year in which Advent begins for
     * that liturgical year. adventYear % 3: 0 → A, 1 → B, 2 → C (anchored to
     * Advent 2022 = A).
     *
     * @returns {"A"|"B"|"C"}
     */
    getSeries(): SeriesKey;
}
