import type { Dayjs } from "dayjs";
/**
 * @param {unknown} value
 * @returns {value is Dayjs}
 */
export declare function isDayjsValue(value: unknown): value is Dayjs;
/**
 * Validate a public-facing date input.
 *
 * @param {unknown} value
 * @param {string} apiName
 * @returns {Date}
 */
export declare function assertPublicDate(value: unknown, apiName: string): Date;
/**
 * Clone a JavaScript Date so callers cannot mutate shared state.
 *
 * @param {Date} value
 * @returns {Date}
 */
export declare function cloneDate(value: Date): Date;
/**
 * Normalize a supported public date input to an internal Day.js instance.
 *
 * @param {unknown} value
 * @param {string} apiName
 * @returns {Dayjs}
 */
export declare function toInternalDayjs(value: unknown, apiName: string): Dayjs;
/**
 * Convert an internal Day.js value to a fresh public JavaScript Date.
 *
 * @param {Dayjs} value
 * @returns {Date}
 */
export declare function toPublicDate(value: Dayjs): Date;
/**
 * Create a local-midnight JavaScript Date from calendar parts.
 *
 * @param {number | string} year
 * @param {number | string} month
 * @param {number | string} day
 * @returns {Date}
 */
export declare function createLocalDate(year: number | string, month: number | string, day: number | string): Date;
/**
 * Create a local-midnight Day.js value from calendar parts.
 *
 * @param {number | string} year
 * @param {number | string} month
 * @param {number | string} day
 * @returns {Dayjs}
 */
export declare function createLocalDayjs(year: number | string, month: number | string, day: number | string): Dayjs;
/**
 * Format a public Date as YYYY-MM-DD for local-calendar assertions.
 *
 * @param {Date} value
 * @returns {string}
 */
export declare function formatDateKey(value: Date): string;
/**
 * Compare two public Dates as local calendar days.
 *
 * @param {Date} left
 * @param {Date} right
 * @returns {boolean}
 */
export declare function isSameDay(left: Date, right: Date): boolean;
/**
 * Return the weekday number using the lectionary convention.
 *
 * Day.js already uses Sunday = 0, Monday = 1, ..., Saturday = 6.
 *
 * @param {Dayjs} date
 * @returns {number}
 */
export declare function getLectionaryWeekday(date: Dayjs): number;
/**
 * Return the weekday number using the legacy Monday-first convention.
 *
 * Some existing church-year calculations are easier to preserve when Sunday is
 * represented as 7 rather than 0.
 *
 * @param {Dayjs} date
 * @returns {number}
 */
export declare function getLegacyWeekday(date: Dayjs): number;
/**
 * Compare two Day.js values as local calendar dates, ignoring DST shifts.
 *
 * @param {Dayjs} first
 * @param {Dayjs} second
 * @returns {number}
 */
export declare function getDayDifference(first: Dayjs, second: Dayjs): number;
/**
 * Compare two Day.js values as liturgical week anchors.
 *
 * @param {Dayjs} week1
 * @param {Dayjs} week2
 * @returns {number}
 */
export declare function getWeekDifference(week1: Dayjs, week2: Dayjs): number;
