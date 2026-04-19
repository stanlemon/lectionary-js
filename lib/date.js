import dayjs from "dayjs";

/** @typedef {import("dayjs").Dayjs} Dayjs */

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * @param {unknown} value
 * @returns {value is Dayjs}
 */
export function isDayjsValue(value) {
  return dayjs.isDayjs(value);
}

/**
 * Validate a public-facing date input.
 *
 * @param {unknown} value
 * @param {string} apiName
 * @returns {Date}
 */
export function assertPublicDate(value, apiName) {
  if (isDayjsValue(value)) {
    throw new TypeError(
      `${apiName} expects a JavaScript Date, not a Day.js value`
    );
  }

  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError(`${apiName} expects a valid JavaScript Date`);
  }

  return value;
}

/**
 * Clone a JavaScript Date so callers cannot mutate shared state.
 *
 * @param {Date} value
 * @returns {Date}
 */
export function cloneDate(value) {
  return new Date(value.getTime());
}

/**
 * Normalize a supported public date input to an internal Day.js instance.
 *
 * @param {unknown} value
 * @param {string} apiName
 * @returns {Dayjs}
 */
export function toInternalDayjs(value, apiName) {
  return dayjs(cloneDate(assertPublicDate(value, apiName))).startOf("day");
}

/**
 * Convert an internal Day.js value to a fresh public JavaScript Date.
 *
 * @param {Dayjs} value
 * @returns {Date}
 */
export function toPublicDate(value) {
  return createLocalDate(value.year(), value.month() + 1, value.date());
}

/**
 * Create a local-midnight JavaScript Date from calendar parts.
 *
 * @param {number | string} year
 * @param {number | string} month
 * @param {number | string} day
 * @returns {Date}
 */
export function createLocalDate(year, month, day) {
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Create a local-midnight Day.js value from calendar parts.
 *
 * @param {number | string} year
 * @param {number | string} month
 * @param {number | string} day
 * @returns {Dayjs}
 */
export function createLocalDayjs(year, month, day) {
  return dayjs(createLocalDate(year, month, day)).startOf("day");
}

/**
 * Format a public Date as YYYY-MM-DD for local-calendar assertions.
 *
 * @param {Date} value
 * @returns {string}
 */
export function formatDateKey(value) {
  const date = assertPublicDate(value, "formatDateKey");
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * Compare two public Dates as local calendar days.
 *
 * @param {Date} left
 * @param {Date} right
 * @returns {boolean}
 */
export function isSameDay(left, right) {
  const first = assertPublicDate(left, "isSameDay");
  const second = assertPublicDate(right, "isSameDay");

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

/**
 * Return the weekday number using the lectionary convention.
 *
 * Day.js already uses Sunday = 0, Monday = 1, ..., Saturday = 6.
 *
 * @param {Dayjs} date
 * @returns {number}
 */
export function getLectionaryWeekday(date) {
  return date.day();
}

/**
 * Return the weekday number using the legacy Monday-first convention.
 *
 * Some existing church-year calculations are easier to preserve when Sunday is
 * represented as 7 rather than 0.
 *
 * @param {Dayjs} date
 * @returns {number}
 */
export function getLegacyWeekday(date) {
  const weekday = getLectionaryWeekday(date);
  return weekday === 0 ? 7 : weekday;
}

/**
 * Compare two Day.js values as local calendar dates, ignoring DST shifts.
 *
 * @param {Dayjs} first
 * @param {Dayjs} second
 * @returns {number}
 */
export function getDayDifference(first, second) {
  const firstUtc = Date.UTC(first.year(), first.month(), first.date());
  const secondUtc = Date.UTC(second.year(), second.month(), second.date());
  return (secondUtc - firstUtc) / DAY_IN_MS;
}

/**
 * Compare two Day.js values as liturgical week anchors.
 *
 * @param {Dayjs} week1
 * @param {Dayjs} week2
 * @returns {number}
 */
export function getWeekDifference(week1, week2) {
  return getDayDifference(week1, week2) / 7;
}
