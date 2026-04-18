/**
 * Object shape accepted by the factory when the caller passes a Luxon-style
 * date-like value instead of a raw year.
 * @typedef {{ year: number | string }} YearLikeObject
 */

/**
 * Accepted inputs for deriving a calendar year.
 * @typedef {number | string | Date | YearLikeObject} YearLikeValue
 */

/**
 * Constructor shape for Year-like calculators.
 * @template T
 * @typedef {new (year: number) => T} YearType
 */

/**
 * Normalize the different "year-like" inputs callers pass into the factory.
 * We accept raw years, JS Dates, and Luxon-style objects with a `year`
 * property so Week/Series can pass their existing date values directly.
 *
 * This helper stays file-local so the public factory surface only exposes the
 * behavior consumers are expected to call.
 *
 * @param {YearLikeValue} value
 * @returns {number}
 */
function getYear(value) {
  if (value instanceof Date) {
    return value.getFullYear();
  }

  if (value && typeof value === "object" && "year" in value) {
    return parseInt(value.year, 10);
  }

  return parseInt(value, 10);
}

/**
 * Factory for Year-like calculators keyed by a normalized calendar year.
 *
 * This base implementation does not cache. It exists so callers can normalize
 * their inputs in one place and so the caching branch can change only factory
 * behavior rather than every call site.
 */
export const YearFactory = {
  /**
   * Return a Year-like calculator for the requested calendar year.
   *
   * `Type` is typically `Year` or `ThreeYear`, but tests also use ad-hoc
   * subclasses to verify normalization behavior.
   *
   * @template T
   * @param {YearLikeValue} value
   * @param {YearType<T>} Type
   * @returns {T}
   */
  get(value, Type) {
    const year = getYear(value);
    if (Number.isNaN(year)) {
      throw new TypeError(`Unable to derive year from value: ${value}`);
    }

    return new Type(year);
  },
};
