import type { Proper } from "./Loader.js";
type ProperBuckets = {
    week?: number | null;
    lectionary?: Proper[];
    festivals?: Proper[];
};
/**
 * @param {Proper[] | undefined | null} propers
 * @param {number} type
 * @returns {Proper | null}
 */
export declare function findProperByType(propers: Proper[] | undefined | null, type: number): Proper | null;
/**
 * @param {Proper[] | undefined | null} propers
 * @param {number[]} types
 * @returns {Partial<Record<number, Proper>>}
 */
export declare function findPropersByType(propers: Proper[] | undefined | null, types: number[]): Partial<Record<number, Proper>>;
/**
 * @param {Proper[] | undefined | null} propers
 * @returns {boolean}
 */
export declare function hasReadings(propers: Proper[] | undefined | null): boolean;
/**
 * Festivals outrank the regular Sunday/week propers during the Epiphany and
 * Trinity/Pentecost portions of the church year. In Advent/Christmas, Lent,
 * Holy Week, and Easter, the seasonal lectionary remains primary instead.
 *
 * This rule only affects presentation precedence; both sets of propers are
 * still loaded so callers can show the secondary observance when desired.
 *
 * @param {number | null | undefined} week
 * @returns {boolean}
 */
export declare function festivalHasPrecedence(week: number | null | undefined): boolean;
/**
 * Return the primary and secondary propers collections for a date where both
 * the ordinary lectionary and a festival may be present.
 *
 * @param {{ week?: number | null, lectionary?: Proper[], festivals?: Proper[] }} day
 * @returns {{ primary: Proper[], secondary: Proper[] }}
 */
export declare function getPrecedence(day: ProperBuckets): {
    primary: Proper[];
    secondary: Proper[];
};
/**
 * Return the propers collections that should actually render in calendar views.
 * Rendering follows precedence order, but only keeps collections with enough
 * readings to display. OT is optional; Epistle and Gospel are required.
 *
 * @param {{ week?: number | null, lectionary?: Proper[], festivals?: Proper[] }} day
 * @returns {Proper[][]}
 */
export declare function getDisplayPropers(day: ProperBuckets): Proper[][];
/**
 * Return the first collection with a color proper.
 * @param  {...(Proper[] | undefined | null)} allPropers
 * @returns {string | undefined}
 */
export declare function findColor(...allPropers: (Proper[] | undefined | null)[]): string | undefined;
export {};
