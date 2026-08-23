import type { ProperDatasetMap } from "./Loader.js";
export type CalendarDay<TPropers = ProperDatasetMap> = {
    date: Date;
    day: number;
    week: number | null;
    propers: TPropers;
    sunday: CalendarDay<TPropers> | null;
};
type CalendarCell<TPropers = ProperDatasetMap> = CalendarDay<TPropers> | null;
type CalendarLoader<TPropers> = {
    load(date: Date, weekOfLectionary: number | null): TPropers;
};
/**
 * Build a calendar grid for a given month.
 */
export declare class CalendarBuilder {
    #private;
    /**
     * @param {number} year
     * @param {number} month
     */
    constructor(year: number, month: number);
    /**
     * @template TPropers
     * @param {{ load(date: Date, weekOfLectionary: number | null): TPropers }} loader
     * @returns {Array<Array<{
     *   date: Date,
     *   day: number,
     *   week: number | null,
     *   propers: TPropers,
     *   sunday: object | null,
     * } | null>>}
     */
    build<TPropers>(loader: CalendarLoader<TPropers>): CalendarCell<TPropers>[][];
}
export {};
