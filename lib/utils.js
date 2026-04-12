import Sundays from "./Sundays.js";

export function findProperByType(propers, type) {
  if (!Array.isArray(propers)) {
    return null;
  }
  return propers.find((proper) => proper.type === type) ?? null;
}

export function findPropersByType(propers, types) {
  const matches = {};

  if (!Array.isArray(propers) || !Array.isArray(types)) {
    return matches;
  }

  const remainingTypes = new Set(types);

  for (const proper of propers) {
    if (!remainingTypes.has(proper.type)) {
      continue;
    }

    matches[proper.type] = proper;
    remainingTypes.delete(proper.type);

    if (remainingTypes.size === 0) {
      break;
    }
  }

  return matches;
}

export function hasReadings(propers) {
  const matches = findPropersByType(propers, [1, 2]);
  return matches[1] && matches[2];
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
 * Return the propers collections that should actually render in calendar views.
 * Rendering follows precedence order, but only keeps collections with enough
 * readings to display. OT is optional; Epistle and Gospel are required.
 *
 * @param {{ week?: number | null, lectionary?: any[], festivals?: any[] }} day
 * @returns {any[][]}
 */
export function getDisplayPropers(day) {
  const { primary, secondary } = getPrecedence(day);
  return [primary, secondary].filter(hasReadings);
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
