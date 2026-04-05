import { DateTime } from "luxon";

import { Year } from "../Year.js";

export class Series {
  constructor(date) {
    if (!(date instanceof DateTime)) {
      date = DateTime.fromJSDate(date);
    }
    this._date = date.startOf("day");
  }

  /**
   * Returns the liturgical series ("A", "B", or "C") for the date.
   *
   * The series is determined by the calendar year in which Advent begins for
   * that liturgical year. adventYear % 3: 0 → A, 1 → B, 2 → C (anchored to
   * Advent 2022 = A).
   *
   * @returns {"A"|"B"|"C"}
   */
  getSeries() {
    const advent = new Year(this._date.year).getAdvent();
    const adventYear = this._date >= advent ? this._date.year : this._date.year - 1;
    return ["A", "B", "C"][adventYear % 3];
  }
}
