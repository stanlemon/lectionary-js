import type { BaseWeek } from "../BaseWeek.js";
/**
 * Calculates the three-year lectionary week or Proper number for a date.
 */
/** @implements {import("../BaseWeek.js").BaseWeek} */
export declare class ThreeYearWeek implements BaseWeek {
    #private;
    /**
     * @param {Date} date
     */
    constructor(date: Date);
    /**
     * Find the Sunday closest to the date we're calculating off. If that day is a Sunday, it just returns that date.
     * @returns {Date}
     */
    getSunday(): Date;
    /**
     * Return the three-year lectionary week number for the date, including
     * Proper 3-29 during Ordinary Time, or `null` for dates the caller must
     * handle specially such as Christmas on a Sunday.
     *
     * @returns {number | null}
     */
    getWeek(): number | null;
}
