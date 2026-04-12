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
export default {
  58: { START: "05-24", END: "05-28" }, // Proper 3
  59: { START: "05-29", END: "06-04" }, // Proper 4
  60: { START: "06-05", END: "06-11" }, // Proper 5
  61: { START: "06-12", END: "06-18" }, // Proper 6
  62: { START: "06-19", END: "06-25" }, // Proper 7
  63: { START: "06-26", END: "07-02" }, // Proper 8
  64: { START: "07-03", END: "07-09" }, // Proper 9
  65: { START: "07-10", END: "07-16" }, // Proper 10
  66: { START: "07-17", END: "07-23" }, // Proper 11
  67: { START: "07-24", END: "07-30" }, // Proper 12
  68: { START: "07-31", END: "08-06" }, // Proper 13
  69: { START: "08-07", END: "08-13" }, // Proper 14
  70: { START: "08-14", END: "08-20" }, // Proper 15
  71: { START: "08-21", END: "08-27" }, // Proper 16
  72: { START: "08-28", END: "09-03" }, // Proper 17
  73: { START: "09-04", END: "09-10" }, // Proper 18
  74: { START: "09-11", END: "09-17" }, // Proper 19
  75: { START: "09-18", END: "09-24" }, // Proper 20
  76: { START: "09-25", END: "10-01" }, // Proper 21
  77: { START: "10-02", END: "10-08" }, // Proper 22
  78: { START: "10-09", END: "10-15" }, // Proper 23
  79: { START: "10-16", END: "10-22" }, // Proper 24
  80: { START: "10-23", END: "10-29" }, // Proper 25
  81: { START: "10-30", END: "11-05" }, // Proper 26
  82: { START: "11-06", END: "11-12" }, // Proper 27
  83: { START: "11-13", END: "11-19" }, // Proper 28
  84: { START: "11-20", END: "11-26" }, // Proper 29
};
