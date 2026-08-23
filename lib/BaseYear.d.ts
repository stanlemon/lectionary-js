/**
 * Shared interface for liturgical year calculators.
 *
 * Implementations calculate the canonical anchor dates used throughout the
 * church year. `YearFactory` relies on this common zero-argument API when
 * constructing Year-like helpers from "year-like" inputs.
 *
 * Subclasses are expected to implement every method below. The default methods
 * throw so incomplete implementations fail fast.
 *
 * @interface
 */
export declare class BaseYear {
    #private;
    /**
     * @returns {Date}
     */
    getAdvent(): Date;
    /**
     * @returns {Date}
     */
    getChristmas(): Date;
    /**
     * @returns {Date}
     */
    getEpiphany(): Date;
    /**
     * @returns {Date}
     */
    getEpiphanySunday(): Date;
    /**
     * @returns {Date}
     */
    getTransfiguration(): Date;
    /**
     * @returns {Date}
     */
    getAshWednesday(): Date;
    /**
     * @returns {Date}
     */
    getLent(): Date;
    /**
     * @returns {Date}
     */
    getEaster(): Date;
    /**
     * @returns {Date}
     */
    getTrinity(): Date;
    /**
     * @returns {Date}
     */
    getPentecost(): Date;
    /**
     * @returns {Date}
     */
    getLastSunday(): Date;
    /**
     * @returns {Date}
     */
    getEndOfYear(): Date;
}
