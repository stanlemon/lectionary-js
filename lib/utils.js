import Sundays from "./Sundays.js";

export function findProperByType(propers, type) {
  if (!Array.isArray(propers)) {
    return null;
  }
  const propersByType = propers.filter((p) => p.type === type);
  return propersByType.length === 0 ? null : propersByType.shift();
}

export function hasReadings(propers) {
  return (
    findProperByType(propers, 19) &&
    findProperByType(propers, 2) &&
    findProperByType(propers, 1)
  );
}

/**
 * Festivals outrank the regular Sunday/week propers during the Epiphany and
 * Trinity/Pentecost portions of the church year. In Advent/Christmas, Lent,
 * Holy Week, and Easter, the seasonal lectionary remains primary instead.
 *
 * This rule only affects presentation precedence; both sets of propers are
 * still loaded so callers can show the secondary observance when desired.
 *
 * @param {number | null | undefined} week
 * @returns {boolean}
 */
export function festivalHasPrecedence(week) {
  if (week === null || week === undefined) {
    return false;
  }

  const isEpiphanySeason =
    week >= Sundays.THE_BAPTISM_OF_OUR_LORD && week <= Sundays.TRANSFIGURATION;
  const isPentecostSeason = week >= Sundays.TRINITY_SUNDAY;

  return isEpiphanySeason || isPentecostSeason;
}

/**
 * Return the primary and secondary propers collections for a date where both
 * the ordinary lectionary and a festival may be present.
 *
 * @param {{ week?: number | null, lectionary?: any[], festivals?: any[] }} day
 */
export function getPrecedence(day) {
  const lectionary = day?.lectionary ?? [];
  const festivals = day?.festivals ?? [];
  const festivalFirst = festivalHasPrecedence(day?.week);

  if (lectionary.length === 0) {
    return {
      primary: festivals,
      secondary: [],
    };
  }

  if (festivals.length === 0) {
    return {
      primary: lectionary,
      secondary: [],
    };
  }

  return {
    primary: festivalFirst ? festivals : lectionary,
    secondary: festivalFirst ? lectionary : festivals,
  };
}

/**
 * Return the first collection with a color proper.
 * @param  {...any} allPropers
 */
export function findColor(...allPropers) {
  return allPropers.reduce((prev, current) => {
    return prev ?? findProperByType(current, 25);
  }, null)?.text;
}
