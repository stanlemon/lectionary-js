/**
 * Shared interface for week calculators.
 *
 * Implementations normalize a specific calendar date, expose the Sunday that
 * anchors that date's liturgical week, and compute the corresponding week
 * number for their lectionary system.
 *
 * @interface
 */
export class BaseWeek {
  /**
   * Return the Sunday that anchors the current date's liturgical week.
   *
   * @returns {Date}
   */
  getSunday() {}

  /**
   * Return the liturgical week number for the current date, or `null` when the
   * date requires special caller handling.
   *
   * @returns {number | null}
   */
  getWeek() {}
}
