import type { BaseWeek } from "./BaseWeek.js";
/**
 * Calculates the historic one-year lectionary week number for a date.
 */
export declare class Week implements BaseWeek {
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
     * Return the one-year lectionary week number for the date, or `null` when
     * Christmas falls on a Sunday and must be handled separately by the caller.
     *
     * @returns {number | null}
     */
    getWeek(): number | null;
}
