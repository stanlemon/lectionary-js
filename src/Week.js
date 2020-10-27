const { Year } = require("./Year");
const { DateTime } = require("luxon");

class Week {
  constructor(date) {
    // If we're not a luxon DateTime, assume a JSDate and convert
    if (!(date instanceof DateTime)) {
      date = DateTime.fromJSDate(date);
    }

    /**
     * @type {DateTime}
     */
    this.date = date;
    /**
     * @type {Year}
     */
    this.year = new Year(date);
  }

  getSunday() {
    const days = this.date.weekday;
    const sunday = this.date.minus({ days }).startOf("day");
    return sunday;
  }

  getWeek() {
    const advent = this.year.getAdvent();
    const epiphany = this.year.getEpiphany();
    const transfiguration = this.year.getTransfiguration();
    const endOfYear = this.year.getEndOfYear();
    const lastSunday = this.year.getLastSunday();

    const sunday = this.getSunday();

    // If Christmas is a Sunday
    if (sunday.month === 12 && sunday.day === 25) {
      return null;
    } else if (sunday >= advent) {
      // After Advent
      return this.getWeekDifference(advent, sunday);
    } else if (sunday >= epiphany && sunday < transfiguration) {
      // After Epiphany, Before Transfiguration
      return 5 + this.getWeekDifference(epiphany, sunday);
    } else if (sunday < epiphany) {
      // Before Epiphany (but after Transfiguration)
      return 8 - this.getWeekDifference(sunday, epiphany);
    } else if (sunday >= transfiguration && sunday <= endOfYear) {
      // After Transfiguration and before the end of the year (Pentecost)
      return 11 + this.getWeekDifference(transfiguration, sunday);
    } else {
      // The end of the Church Year to Last Sunday (eq. Third Last)
      return 58 - this.getWeekDifference(sunday, lastSunday);
    }
  }

  getWeekDifference(week1, week2) {
    const { weeks } = week2.diff(week1, ["weeks"]).toObject();
    console.log(weeks);
    return weeks;
  }
}

module.exports = {
  Week,
};
