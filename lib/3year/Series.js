import { DateTime } from "luxon";

import { Year } from "../Year.js";

export class Series {
  /** @type {import("luxon").DateTime} */
  #date;

  /**
   * @param {Date | import("luxon").DateTime} date
   */
  constructor(date) {
    if (!(date instanceof DateTime)) {
      date = DateTime.fromJSDate(date);
    }
    this.#date = date.startOf("day");
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
    const advent = new Year(this.#date.year).getAdvent();
    const adventYear =
      this.#date >= advent ? this.#date.year : this.#date.year - 1;
    return ["A", "B", "C"][adventYear % 3];
  }
}
