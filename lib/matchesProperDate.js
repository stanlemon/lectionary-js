/**
 * Centralized date-matching rules for propers.
 *
 * The loaders need to answer one basic question repeatedly:
 * "Does this proper belong on this calendar date?"
 *
 * Keeping the rule here prevents KeyLoader and SimpleLoader from drifting apart
 * or duplicating the same weekday-normalization logic.
 *
 * This helper intentionally stays narrow:
 * - movable propers match by liturgical week + weekday
 * - fixed propers match by month + day
 *
 * Precedence between colliding propers is handled by the UI layer, where we can
 * decide which collection is primary while still showing the secondary one.
 */
/**
 * Normalize Luxon's weekday numbering to the convention used by the lectionary
 * JSON files.
 *
 * Luxon:
 * - Monday = 1
 * - ...
 * - Sunday = 7
 *
 * Our data:
 * - Sunday = 0
 * - Monday = 1
 * - ...
 * - Saturday = 6
 *
 * Week-based propers depend on this mapping, so we keep the translation in one
 * place rather than repeating it inside each loader.
 *
 * @param {DateTime} date
 * @returns {number}
 */
function getWeekday(date) {
  return date.weekday === 7 ? 0 : date.weekday;
}

/**
 * Determine whether a given proper should be included when loading propers for
 * a specific calendar date.
 *
 * A proper can match in one of two ways:
 * 1. By liturgical week + weekday for movable propers such as Sundays and Holy
 *    Week observances.
 * 2. By calendar month + day for fixed observances such as festivals.
 *
 * Keeping those rules together avoids duplication between KeyLoader and
 * SimpleLoader. Higher-level precedence decisions are intentionally left to the
 * presentation layer, which can show both observances while still making one of
 * them primary.
 *
 * @param {import("./Loader.js").Proper} proper
 * @param {import("luxon").DateTime} date
 * @param {number | null} weekOfLectionary
 * @returns {boolean}
 */
export function matchesProperDate(proper, date, weekOfLectionary) {
  const weekday = getWeekday(date);

  // Movable propers are keyed by liturgical week and weekday, so if those line
  // up we can accept the proper immediately.
  if (proper.week === weekOfLectionary && proper.day === weekday) {
    return true;
  }

  // If there is no month/day metadata, there is no fixed-date rule to check.
  if (
    proper.month === null ||
    proper.month === undefined ||
    proper.day === null ||
    proper.day === undefined
  ) {
    return false;
  }

  // Fixed-date propers are anchored directly to the stored month/day values.
  return proper.month === date.month && proper.day === date.day;
}
