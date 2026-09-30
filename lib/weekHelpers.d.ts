import type { Dayjs } from "dayjs";
/**
 * Find the Sunday closest to a given date. If that day is already a Sunday, it
 * just returns the original date.
 *
 * @param {import("dayjs").Dayjs} date
 * @returns {import("dayjs").Dayjs}
 */
export declare function getSunday(date: Dayjs): Dayjs;
/**
 * Find the difference between two liturgical week anchor dates.
 *
 * @param {import("dayjs").Dayjs} week1
 * @param {import("dayjs").Dayjs} week2
 * @returns {number}
 */
export declare function getWeekDifference(week1: Dayjs, week2: Dayjs): number;
