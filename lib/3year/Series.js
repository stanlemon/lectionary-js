import { toInternalDayjs } from "../date.js";
import { Year } from "../Year.js";
import { YearFactory } from "../YearFactory.js";

/**
 * Calculates the three-year lectionary series letter for a date.
 */
export class Series {
  /** @type {import("dayjs").Dayjs} */
  #date;

  /**
   * @param {Date} date
   */
  constructor(date) {
    this.#date = toInternalDayjs(date, "Series");
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
    const advent = toInternalDayjs(
      YearFactory.get(this.#date.year(), Year).getAdvent(),
      "Year.getAdvent()"
    );
    const adventYear =
      this.#date.valueOf() >= advent.valueOf()
        ? this.#date.year()
        : this.#date.year() - 1;
    return ["A", "B", "C"][adventYear % 3];
  }
}
