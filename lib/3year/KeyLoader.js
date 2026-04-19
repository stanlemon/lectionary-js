import { getLectionaryWeekday, toInternalDayjs } from "../date.js";
import { Series } from "./Series.js";
import { ThreeYearWeek } from "./Week.js";

/**
 * A KeyLoader for the three-year lectionary. Selects the correct series
 * (A, B, or C) for a given date and merges it with shared datasets
 * (festivals, daily, commemorations) that apply across all series.
 *
 * @implements Loader
 *
 * @example
 * const loader = new ThreeYearKeyLoader({
 *   series: { A: lsb3yrA, B: lsb3yrB, C: lsb3yrC },
 *   festivals: lsbFestivals,
 *   daily: lsbDaily,
 *   commemorations: lsbCommemorations,
 * });
 */
export class ThreeYearKeyLoader {
  /** @type {import("../Loader.js").SeriesDatasetMap} */
  #series;

  /** @type {import("../Loader.js").ProperDatasetMap} */
  #shared;

  /**
   * @param {{
   *   series: import("../Loader.js").SeriesDatasetMap,
   *   [key: string]: import("../Loader.js").ProperDatasetMap[string] | import("../Loader.js").SeriesDatasetMap,
   * }} data
   *   `series` maps liturgical series letters to their proper datasets.
   *   All other keys are shared datasets applied regardless of series.
   */
  constructor({ series, ...shared }) {
    this.#series = series;
    this.#shared = shared;
  }

  /**
   * Load propers for a given date.
   * The week number is computed internally via ThreeYearWeek so ordinary-time
   * Propers (weeks 58–84) resolve correctly regardless of what the caller passes.
   * @param {Date} date
   * @returns {import("../Loader.js").ProperDatasetMap}
   */
  load(date) {
    const internalDate = toInternalDayjs(date, "ThreeYearKeyLoader.load");
    const weekOfLectionary = new ThreeYearWeek(date).getWeek();
    const weekday = getLectionaryWeekday(internalDate);

    /**
     * @param {import("../Loader.js").Proper[]} entries
     * @returns {import("../Loader.js").Proper[]}
     */
    const filter = (entries) =>
      entries
        .filter(
          (proper) =>
            (proper.week === weekOfLectionary && proper.day === weekday) ||
            (proper.month === internalDate.month() + 1 &&
              proper.day === internalDate.date())
        )
        .sort((a, b) => {
          if (a.week && !b.week) return -1;
          if (!a.week && b.week) return 1;
          return 0;
        });

    const seriesKey = new Series(date).getSeries();
    const lectionary = this.#series[seriesKey] ?? [];

    /** @type {import("../Loader.js").ProperDatasetMap} */
    const result = { lectionary: filter(lectionary) };
    for (const [key, value] of Object.entries(this.#shared)) {
      result[key] = filter(value);
    }
    return result;
  }
}
