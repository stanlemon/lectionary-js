import { DateTime } from "luxon";
import { Year } from "./Year.js";
export class Week {
  constructor(date) {
    // If we're not receiving a luxon DateTime, assume a JSDate and convert
    if (!(date instanceof DateTime)) {
      date = DateTime.fromJSDate(date);
    }

    /**
     * @type {DateTime}
     * @private
     */
    this._date = date.startOf("day");
    /**
     * @type {Year}
     * @private
     */
    this._year = new Year(this._date);
  }

  /**
   * Find the Sunday closest to the date we're calculating off. If that day is a Sunday, it just returns that date.
   * @returns {DateTime}
   */
  getSunday() {
    return this._date.weekday === 7
      ? this._date
      : this._date.minus({ days: this._date.weekday });
  }

  /**
   * Find the difference between two weeks.
   * @param {DateTime} week1
   * @param {DateTime} week2
   * @private
   */
  getWeekDifference(week1, week2) {
    const { weeks } = week2.diff(week1, ["weeks"]).toObject();
    return weeks;
  }

  getWeek() {
    const advent = this._year.getAdvent();
    const epiphany = this._year.getEpiphany();
    const epiphanySunday = this._year.getEpiphanySunday();
    const transfiguration = this._year.getTransfiguration();
    const endOfYear = this._year.getEndOfYear();
    const lastSunday = this._year.getLastSunday();
    const sunday = this.getSunday();

    // If Christmas is a Sunday you need to handle this yourself
    if (sunday.month === 12 && sunday.day === 25) {
      return null;
    } else if (sunday >= advent) {
      // After Advent
      return 1 + this.getWeekDifference(advent, sunday);
    } else if (sunday >= epiphany && sunday < transfiguration) {
      // After Epiphany, Before Transfiguration
      return 6 + this.getWeekDifference(epiphanySunday, sunday);
    } else if (sunday < epiphany) {
      // Before Epiphany
      return 6 - this.getWeekDifference(sunday, epiphanySunday);
    } else if (sunday >= transfiguration && sunday <= endOfYear) {
      // After Transfiguration and before the end of the year (Pentecost)
      return 12 + this.getWeekDifference(transfiguration, sunday);
    } else {
      // The end of the Church Year to Last Sunday (eq. Third Last)
      return 57 - this.getWeekDifference(sunday, lastSunday);
    }
  }
}
