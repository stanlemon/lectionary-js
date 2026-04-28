import { toInternalDayjs, toPublicDate } from "../date.js";
import ProperSundays from "../ProperSundays.js";
import { getSunday, getWeekDifference } from "../weekHelpers.js";
import { YearFactory } from "../YearFactory.js";
import { ThreeYear } from "./Year.js";

/**
 * Calculates the three-year lectionary week or Proper number for a date.
 */
/** @implements {import("../BaseWeek.js").BaseWeek} */
export class ThreeYearWeek {
  /** @type {import("dayjs").Dayjs} */
  #date;

  /** @type {ThreeYear} */
  #year;

  /**
   * @param {Date} date
   */
  constructor(date) {
    this.#date = toInternalDayjs(date, "ThreeYearWeek");
    this.#year = YearFactory.get(this.#date.year(), ThreeYear);
  }

  /**
   * Find the Sunday closest to the date we're calculating off. If that day is a Sunday, it just returns that date.
   * @returns {Date}
   */
  getSunday() {
    return toPublicDate(getSunday(this.#date));
  }

  /**
   * Return the three-year lectionary week number for the date, including
   * Proper 3-29 during Ordinary Time, or `null` for dates the caller must
   * handle specially such as Christmas on a Sunday.
   *
   * @returns {number | null}
   */
  getWeek() {
    const year = this.#year;
    const advent = toInternalDayjs(year.getAdvent(), "ThreeYear.getAdvent()");
    const epiphany = toInternalDayjs(
      year.getEpiphany(),
      "ThreeYear.getEpiphany()"
    );
    const epiphanySunday = toInternalDayjs(
      year.getEpiphanySunday(),
      "ThreeYear.getEpiphanySunday()"
    );
    const transfiguration = toInternalDayjs(
      year.getTransfiguration(),
      "ThreeYear.getTransfiguration()"
    );
    const lent = toInternalDayjs(year.getLent(), "ThreeYear.getLent()");
    // getPentecost() = Easter + 7 weeks (actual Pentecost Sunday).
    // Trinity Sunday is one week later = Easter + 8 weeks.
    const trinitySunday = toInternalDayjs(
      year.getPentecost(),
      "ThreeYear.getPentecost()"
    ).add(1, "week");
    const sunday = getSunday(this.#date);

    // Christmas on a Sunday — caller handles this week
    if (sunday.month() === 11 && sunday.date() === 25) {
      return null;
    }

    // Advent and beyond (into the next liturgical year)
    if (sunday.valueOf() >= advent.valueOf()) {
      return 1 + getWeekDifference(advent, sunday);
    }

    // Before Epiphany (Sunday after Christmas, etc.)
    if (sunday.valueOf() < epiphany.valueOf()) {
      return 6 - getWeekDifference(sunday, epiphanySunday);
    }

    // Epiphany season through Transfiguration Sunday
    if (
      sunday.valueOf() >= epiphany.valueOf() &&
      sunday.valueOf() <= transfiguration.valueOf()
    ) {
      if (sunday.valueOf() === transfiguration.valueOf()) {
        return 12;
      }
      const n = getWeekDifference(epiphanySunday, sunday);
      // n <= 5: Baptism of Our Lord (7) through Epiphany 5 (11)
      // n > 5: Epiphany 6 (13), Epiphany 7 (14), Epiphany 8 (15)
      return n <= 5 ? 6 + n : 7 + n;
    }

    // Lent through Trinity Sunday (weeks 16–30)
    if (
      sunday.valueOf() > transfiguration.valueOf() &&
      sunday.valueOf() <= trinitySunday.valueOf()
    ) {
      return 16 + getWeekDifference(lent, sunday);
    }

    // Ordinary Time — ProperSundays calendar-date lookup.
    // Covers the first Sunday after Trinity through Christ the King (Proper 29),
    // which ends Nov 26 — the Sunday after that is always Advent 1.
    const monthDay = sunday.format("MM-DD");
    for (const [week, range] of Object.entries(ProperSundays)) {
      if (monthDay >= range.START && monthDay <= range.END) {
        return Number(week);
      }
    }

    return null;
  }
}
