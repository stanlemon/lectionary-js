/**
 * A single lectionary/festival/daily proper entry.
 * `week` + `day` identify movable propers, while `month` + `day` identify
 * fixed-date observances.
 *
 * @typedef {{
 *   type: number,
 *   text: string,
 *   week?: number | null,
 *   month?: number | null,
 *   day?: number | null,
 * }} Proper
 */

/**
 * Mapping of dataset keys such as `lectionary`, `festivals`, or `daily` to
 * their filtered proper arrays.
 *
 * @typedef {Record<string, Proper[]>} ProperDatasetMap
 */

/**
 * Liturgical series key used by the three-year lectionary.
 * @typedef {"A" | "B" | "C"} SeriesKey
 */

/**
 * Per-series three-year lectionary data.
 * @typedef {Record<SeriesKey, Proper[]>} SeriesDatasetMap
 */

/**
 * @interface
 */
export default class Loader {
  /**
   * Load specific propers
   * @param {Date} date
   * @param {number | null} weekOfLectionary
   * @returns {Proper[] | ProperDatasetMap}
   */
  load(date, weekOfLectionary) {}
}
