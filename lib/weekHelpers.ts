import type { Dayjs } from "dayjs";
import {
  getWeekDifference as getDayjsWeekDifference,
  getLectionaryWeekday,
} from "./date.js";

/**
 * Find the Sunday closest to a given date. If that day is already a Sunday, it
 * just returns the original date.
 *
 * @param {import("dayjs").Dayjs} date
 * @returns {import("dayjs").Dayjs}
 */
export function getSunday(date: Dayjs): Dayjs {
  const weekday = getLectionaryWeekday(date);
  return weekday === 0 ? date : date.subtract(weekday, "day");
}

/**
 * Find the difference between two liturgical week anchor dates.
 *
 * @param {import("dayjs").Dayjs} week1
 * @param {import("dayjs").Dayjs} week2
 * @returns {number}
 */
export function getWeekDifference(week1: Dayjs, week2: Dayjs): number {
  return getDayjsWeekDifference(week1, week2);
}
