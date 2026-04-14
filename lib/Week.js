import { DateTime } from "luxon";
import { getSunday, getWeekDifference } from "./weekHelpers.js";
import { Year } from "./Year.js";

/** @implements {import("./BaseWeek.js").BaseWeek} */
export class Week {
  /** @type {import("luxon").DateTime} */
  #date;

  /** @type {Year} */
  #year;
  constructor(date) {
    // If we're not receiving a luxon DateTime, assume a JSDate and convert
    if (!(date instanceof DateTime)) {
      date = DateTime.fromJSDate(date);
    }

    this.#date = date.startOf("day");
    this.#year = new Year(this.#date.year);
  }

  /**
   * Find the Sunday closest to the date we're calculating off. If that day is a Sunday, it just returns that date.
   * @returns {DateTime}
   */
  getSunday() {
    return getSunday(this.#date);
  }

  getWeek() {
    const advent = this.#year.getAdvent();
    const epiphany = this.#year.getEpiphany();
    const epiphanySunday = this.#year.getEpiphanySunday();
    const transfiguration = this.#year.getTransfiguration();
    const endOfYear = this.#year.getEndOfYear();
    const lastSunday = this.#year.getLastSunday();
    const sunday = this.getSunday();

    // If Christmas is a Sunday you need to handle this yourself
    if (sunday.month === 12 && sunday.day === 25) {
      return null;
    } else if (sunday >= advent) {
      // After Advent
      return 1 + getWeekDifference(advent, sunday);
    } else if (sunday >= epiphany && sunday < transfiguration) {
      // After Epiphany, Before Transfiguration
      return 6 + getWeekDifference(epiphanySunday, sunday);
    } else if (sunday < epiphany) {
      // Before Epiphany
      return 6 - getWeekDifference(sunday, epiphanySunday);
    } else if (sunday >= transfiguration && sunday <= endOfYear) {
      // After Transfiguration and before the end of the year (Pentecost)
      return 12 + getWeekDifference(transfiguration, sunday);
    } else {
      // The end of the Church Year to Last Sunday (eq. Third Last)
      return 57 - getWeekDifference(sunday, lastSunday);
    }
  }
}
