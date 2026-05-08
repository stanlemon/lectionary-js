import type { Dayjs } from "dayjs";
import type { BaseWeek } from "./BaseWeek.js";
import { toInternalDayjs, toPublicDate } from "./date.js";
import { getSunday, getWeekDifference } from "./weekHelpers.js";
import { Year } from "./Year.js";
import { YearFactory } from "./YearFactory.js";

/**
 * Calculates the historic one-year lectionary week number for a date.
 */
export class Week implements BaseWeek {
  #date: Dayjs;

  #year: Year;

  /**
   * @param {Date} date
   */
  constructor(date: Date) {
    this.#date = toInternalDayjs(date, "Week");
    this.#year = YearFactory.get(this.#date.year(), Year);
  }

  /**
   * Find the Sunday closest to the date we're calculating off. If that day is a Sunday, it just returns that date.
   * @returns {Date}
   */
  getSunday(): Date {
    return toPublicDate(getSunday(this.#date));
  }

  /**
   * Return the one-year lectionary week number for the date, or `null` when
   * Christmas falls on a Sunday and must be handled separately by the caller.
   *
   * @returns {number | null}
   */
  getWeek(): number | null {
    const advent = toInternalDayjs(this.#year.getAdvent(), "Year.getAdvent()");
    const epiphany = toInternalDayjs(
      this.#year.getEpiphany(),
      "Year.getEpiphany()"
    );
    const epiphanySunday = toInternalDayjs(
      this.#year.getEpiphanySunday(),
      "Year.getEpiphanySunday()"
    );
    const transfiguration = toInternalDayjs(
      this.#year.getTransfiguration(),
      "Year.getTransfiguration()"
    );
    const endOfYear = toInternalDayjs(
      this.#year.getEndOfYear(),
      "Year.getEndOfYear()"
    );
    const lastSunday = toInternalDayjs(
      this.#year.getLastSunday(),
      "Year.getLastSunday()"
    );
    const sunday = getSunday(this.#date);

    // If Christmas is a Sunday you need to handle this yourself
    if (sunday.month() === 11 && sunday.date() === 25) {
      return null;
    } else if (sunday.valueOf() >= advent.valueOf()) {
      // After Advent
      return 1 + getWeekDifference(advent, sunday);
    } else if (
      sunday.valueOf() >= epiphany.valueOf() &&
      sunday.valueOf() < transfiguration.valueOf()
    ) {
      // After Epiphany, Before Transfiguration
      return 6 + getWeekDifference(epiphanySunday, sunday);
    } else if (sunday.valueOf() < epiphany.valueOf()) {
      // Before Epiphany
      return 6 - getWeekDifference(sunday, epiphanySunday);
    } else if (
      sunday.valueOf() >= transfiguration.valueOf() &&
      sunday.valueOf() < endOfYear.valueOf()
    ) {
      // After Transfiguration and before the final three Sundays of the Church Year
      return 12 + getWeekDifference(transfiguration, sunday);
    } else {
      // The end of the Church Year to Last Sunday (eq. Third Last)
      return 57 - getWeekDifference(sunday, lastSunday);
    }
  }
}
