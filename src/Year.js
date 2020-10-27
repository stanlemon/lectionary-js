const { DateTime } = require("luxon");

/**
 * Calculates important liturgical days for a given calendar year.
 */
class Year {
  /**
   * Calculates important liturgical days for a given calendar year.
   * @param {int} year Year to calculate dates for.
   */
  constructor(year) {
    this.year = parseInt(year);
  }

  getAdvent() {
    const christmas = this.getChristmas();
    const weekday = christmas.get("weekday");
    const advent = christmas.minus({ weeks: 3 }).minus({ days: weekday });
    return advent;
  }

  getChristmas() {
    return DateTime.local(this.year, 12, 25, 0, 0, 0);
  }

  getEpiphany() {
    return DateTime.local(this.year, 1, 6, 0, 0, 0);
  }

  getTransfiguration() {
    const easter = this.getEaster();
    const transfiguration = easter.minus({ weeks: 10 });
    return transfiguration;
  }

  getAshWednesday() {
    const lent = this.getLent();
    const ashWednesday = lent.minus({ days: 4 });
    return ashWednesday;
  }

  getLent() {
    const easter = this.getEaster();
    const lent = easter.minus({ weeks: 6 });
    return lent;
  }

  getEaster() {
    const year = this.year;

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

    return DateTime.local(year, month, day, 0, 0, 0);
  }

  getTrinity() {
    const easter = this.getEaster();
    const trinity = easter.plus({ weeks: 6 });
    return trinity;
  }

  getPentecost() {
    const easter = this.getEaster();
    const pentecost = easter.plus({ weeks: 7 });
    return pentecost;
  }

  getLastSunday() {
    const advent = this.getAdvent();
    const lastSunday = advent.minus({ weeks: 1 });
    return lastSunday;
  }

  getEndOfYear() {
    const advent = this.getAdvent();
    const endOfYear = advent.minus({ weeks: 3 });
    return endOfYear;
  }
}

module.exports = {
  Year,
};
