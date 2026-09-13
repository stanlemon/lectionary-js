/**
 * Accepted inputs for deriving a calendar year.
 */
export type YearLikeValue = number | string | Date;
/**
 * Constructor shape for Year-like calculators.
 * @template T
 */
export type YearType<T> = new (year: number) => T;
/**
 * Factory for Year-like calculators keyed by a normalized calendar year.
 *
 * This base implementation does not cache. It exists so callers can normalize
 * their inputs in one place and so the caching branch can change only factory
 * behavior rather than every call site.
 */
export declare const YearFactory: {
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
    get<T>(value: YearLikeValue, Type: YearType<T>): T;
};
