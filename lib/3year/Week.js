import { DateTime } from "luxon";

import ProperSundays from "../ProperSundays.js";
import { getSunday, getWeekDifference } from "../weekHelpers.js";
import { YearFactory } from "../YearFactory.js";
import { ThreeYear } from "./Year.js";

/** @implements {import("../BaseWeek.js").BaseWeek} */
export class ThreeYearWeek {
  /** @type {import("luxon").DateTime} */
  #date;

  /** @type {ThreeYear} */
  #year;

  /**
   * @param {Date | import("luxon").DateTime} date
   */
  constructor(date) {
    if (!(date instanceof DateTime)) {
      date = DateTime.fromJSDate(date);
    }

    this.#date = date.startOf("day");
    this.#year = YearFactory.get(this.#date, ThreeYear);
  }

  /**
   * Find the Sunday closest to the date we're calculating off. If that day is a Sunday, it just returns that date.
   * @returns {DateTime}
   */
  getSunday() {
    return getSunday(this.#date);
  }

  getWeek() {
    const year = this.#year;
    const advent = year.getAdvent();
    const epiphany = year.getEpiphany();
    const epiphanySunday = year.getEpiphanySunday();
    const transfiguration = year.getTransfiguration();
    const lent = year.getLent();
    // getPentecost() = Easter + 7 weeks (actual Pentecost Sunday).
    // Trinity Sunday is one week later = Easter + 8 weeks.
    const trinitySunday = year.getPentecost().plus({ weeks: 1 });
    const sunday = this.getSunday();

    // Christmas on a Sunday — caller handles this week
    if (sunday.month === 12 && sunday.day === 25) {
      return null;
    }

    // Advent and beyond (into the next liturgical year)
    if (sunday >= advent) {
      return 1 + getWeekDifference(advent, sunday);
    }

    // Before Epiphany (Sunday after Christmas, etc.)
    if (sunday < epiphany) {
      return 6 - getWeekDifference(sunday, epiphanySunday);
    }

    // Epiphany season through Transfiguration Sunday
    if (sunday >= epiphany && sunday <= transfiguration) {
      if (sunday.valueOf() === transfiguration.valueOf()) {
        return 12;
      }
      const n = getWeekDifference(epiphanySunday, sunday);
      // n <= 5: Baptism of Our Lord (7) through Epiphany 5 (11)
      // n > 5: Epiphany 6 (13), Epiphany 7 (14), Epiphany 8 (15)
      return n <= 5 ? 6 + n : 7 + n;
    }

    // Lent through Trinity Sunday (weeks 16–30)
    if (sunday > transfiguration && sunday <= trinitySunday) {
      return 16 + getWeekDifference(lent, sunday);
    }

    // Ordinary Time — ProperSundays calendar-date lookup.
    // Covers the first Sunday after Trinity through Christ the King (Proper 29),
    // which ends Nov 26 — the Sunday after that is always Advent 1.
    const monthDay = `${String(sunday.month).padStart(2, "0")}-${String(sunday.day).padStart(2, "0")}`;
    for (const [week, range] of Object.entries(ProperSundays)) {
      if (monthDay >= range.START && monthDay <= range.END) {
        return Number(week);
      }
    }

    return null;
  }
}
