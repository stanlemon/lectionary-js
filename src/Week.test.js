/* eslint-disable max-lines-per-function */
const Sundays = require("./Sundays");
const { Week } = require("./Week");

const dates = {
  [Sundays.ADVENT_1]: ["11/29/2020"],
  [Sundays.ADVENT_2]: ["12/06/2020"],
  [Sundays.ADVENT_3]: ["12/13/2020"],
  [Sundays.ADVENT_4]: ["12/20/2020"],
  [Sundays.SUNDAY_AFTER_CHRISTMAS]: ["12/27/2020"],
  [Sundays.SUNDAY_AFTER_NEW_YEARS]: ["01/03/2021", "01/05/2020"],
  [Sundays.THE_BAPTISM_OF_OUR_LORD]: ["01/10/2021"],
  [Sundays.EPIPHANY_2]: ["01/19/2020"],
  [Sundays.EPIPHANY_3]: ["01/26/2020", "01/23/2011"],
  [Sundays.EPIPHANY_4]: ["01/30/2011"],
  [Sundays.EPIPHANY_5]: ["02/06/2011"],
  [Sundays.TRANSFIGURATION]: ["01/24/2021", "02/02/2020"],
  [Sundays.SEPTUAGESIMA]: ["01/31/2021"],
  [Sundays.SEXAGESIMA]: ["02/07/2021"],
  [Sundays.QUINQUAGESIMA]: ["02/14/2021"],
  [Sundays.LENT_1]: ["02/21/2021"],
  [Sundays.LENT_2]: ["02/28/2021"],
  [Sundays.LENT_3]: ["03/07/2021"],
  [Sundays.LENT_4]: ["03/14/2021"],
  [Sundays.LENT_5]: ["03/21/2021"],
  [Sundays.PALM_SUNDAY]: ["03/28/2021"],
  [Sundays.EASTER]: ["04/04/2021"],
  [Sundays.EASTER_2]: ["04/11/2021"],
  [Sundays.EASTER_3]: ["04/18/2021"],
  [Sundays.EASTER_4]: ["04/25/2021"],
  [Sundays.EASTER_5]: ["05/02/2021"],
  [Sundays.EASTER_6]: ["05/09/2021"],
  [Sundays.SUNDAY_AFTER_THE_ASCENSION]: ["05/16/2021"],
  [Sundays.PENTECOST]: ["05/23/2021"],
  [Sundays.TRINITY_SUNDAY]: ["05/30/2021"],
  [Sundays.TRINITY_1]: ["06/06/2021"],
  [Sundays.TRINITY_2]: ["06/13/2021"],
  [Sundays.TRINITY_3]: ["06/20/2021"],
  [Sundays.TRINITY_4]: ["06/27/2021"],
  [Sundays.TRINITY_5]: ["07/04/2021"],
  [Sundays.TRINITY_6]: ["07/11/2021"],
  [Sundays.TRINITY_7]: ["07/18/2021"],
  [Sundays.TRINITY_8]: ["07/25/2021"],
  [Sundays.TRINITY_9]: ["08/01/2021"],
  [Sundays.TRINITY_10]: ["08/08/2021"],
  [Sundays.TRINITY_11]: ["08/15/2021"],
  [Sundays.TRINITY_12]: ["08/22/2021"],
  [Sundays.TRINITY_13]: ["08/29/2021"],
  [Sundays.TRINITY_14]: ["09/05/2021"],
  [Sundays.TRINITY_15]: ["09/12/2021"],
  [Sundays.TRINITY_16]: ["09/19/2021"],
  [Sundays.TRINITY_17]: ["10/04/2020"],
  [Sundays.TRINITY_18]: ["10/11/2020"],
  [Sundays.TRINITY_19]: ["10/18/2020"],
  [Sundays.TRINITY_20]: ["11/03/2019", "10/25/2020"],
  [Sundays.TRINITY_21]: ["11/01/2020"],
  [Sundays.TRINITY_22]: ["10/31/2021", "10/28/2018"],
  [Sundays.TRINITY_23]: ["11/04/2018", "11/04/2018"],
  [Sundays.TRINITY_24]: ["11/02/2008"],
  [Sundays.THIRD_LAST_SUNDAY]: ["11/08/2020"],
  [Sundays.SECOND_LAST_SUNDAY]: ["11/15/2020"],
  [Sundays.LAST_SUNDAY]: ["11/22/2020"],
};

const SUNDAYS_BY_VALUE = {};
Object.entries(Sundays).forEach(
  ([key, value]) => (SUNDAYS_BY_VALUE[value] = key)
);

// Create a test for every week and date combination
Object.keys(dates).forEach((key) => {
  const expected = parseInt(key, 10);

  // Every Sunday is defined, but if we haven't specified dates to verify we'll skip over them
  if (!Array.isArray(dates[expected])) {
    return;
  }

  dates[expected].forEach((date) => {
    test(`${SUNDAYS_BY_VALUE[expected]} for ${date}`, () => {
      const week = new Week(new Date(date));
      expect(week.getWeek()).toEqual(expected);
    });
  });
});
