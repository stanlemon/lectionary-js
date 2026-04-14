/**
 * Find the Sunday closest to a given date. If that day is already a Sunday, it
 * just returns the original date.
 *
 * @param {import("luxon").DateTime} date
 * @returns {import("luxon").DateTime}
 */
export function getSunday(date) {
  return date.weekday === 7 ? date : date.minus({ days: date.weekday });
}

/**
 * Find the difference between two liturgical week anchor dates.
 *
 * @param {import("luxon").DateTime} week1
 * @param {import("luxon").DateTime} week2
 * @returns {number}
 */
export function getWeekDifference(week1, week2) {
  const { weeks } = week2.diff(week1, ["weeks"]).toObject();
  return weeks;
}
