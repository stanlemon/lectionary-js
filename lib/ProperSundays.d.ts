/**
 * Date ranges for the Proper Sundays of Ordinary Time in the Three-Year Lectionary.
 *
 * Keys are the numeric week constants from Sundays.js, so you can look up by constant:
 *   import Sundays from "./Sundays.js";
 *   import ProperSundays from "./ProperSundays.js";
 *   ProperSundays[Sundays.PROPER_4].START // "05-29"
 *
 * START and END are "MM-DD" strings representing the inclusive calendar range
 * for each Proper. A Sunday falls in Proper N when its month-day falls within
 * [START, END] of that entry.
 *
 * Proper 3 (May 22–28) is included but rarely observed — it requires an
 * unusually early Easter and is skipped in most years.
 */
type ProperSundayRange = {
    START: string;
    END: string;
};
declare const ProperSundays: Record<number, ProperSundayRange>;
export default ProperSundays;
