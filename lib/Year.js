import { BaseYear } from "./BaseYear.js";
import {
  createLocalDate,
  getLegacyWeekday,
  toInternalDayjs,
  toPublicDate,
} from "./date.js";

/**
 * Calculates important liturgical days for a given calendar year.
 */
export class Year extends BaseYear {
  /** @type {number} */
  #year;

  /**
   * Calculates important liturgical days for a given calendar year.
   * @param {number | string} year Year to calculate dates for.
   */
  constructor(year) {
    super();
    this.#year = parseInt(year, 10);
  }

  getAdvent() {
    const christmas = toInternalDayjs(
      this.getChristmas(),
      "Year.getChristmas()"
    );
    const weekday = getLegacyWeekday(christmas);
    return toPublicDate(christmas.subtract(3, "week").subtract(weekday, "day"));
  }

  getChristmas() {
    return createLocalDate(this.#year, 12, 25);
  }

  getEpiphany() {
    return createLocalDate(this.#year, 1, 6);
  }

  getEpiphanySunday() {
    const epiphany = toInternalDayjs(this.getEpiphany(), "Year.getEpiphany()");
    return toPublicDate(
      epiphany.day() === 0 ? epiphany : epiphany.subtract(epiphany.day(), "day")
    );
  }

  getTransfiguration() {
    const easter = toInternalDayjs(this.getEaster(), "Year.getEaster()");
    return toPublicDate(easter.subtract(10, "week"));
  }

  getAshWednesday() {
    const lent = toInternalDayjs(this.getLent(), "Year.getLent()");
    return toPublicDate(lent.subtract(4, "day"));
  }

  getLent() {
    const easter = toInternalDayjs(this.getEaster(), "Year.getEaster()");
    return toPublicDate(easter.subtract(6, "week"));
  }

  getEaster() {
    const year = this.#year;

    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n = h + l - 7 * m + 114;

    const month = Math.floor(n / 31);
    const day = (n % 31) + 1;

    return createLocalDate(year, month, day);
  }

  getTrinity() {
    const easter = toInternalDayjs(this.getEaster(), "Year.getEaster()");
    return toPublicDate(easter.add(6, "week"));
  }

  getPentecost() {
    const easter = toInternalDayjs(this.getEaster(), "Year.getEaster()");
    return toPublicDate(easter.add(7, "week"));
  }

  getLastSunday() {
    const advent = toInternalDayjs(this.getAdvent(), "Year.getAdvent()");
    return toPublicDate(advent.subtract(1, "week"));
  }

  getEndOfYear() {
    const advent = toInternalDayjs(this.getAdvent(), "Year.getAdvent()");
    return toPublicDate(advent.subtract(3, "week"));
  }
}
