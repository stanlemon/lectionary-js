import { Series } from "./Series.js";

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
  /**
   * @param {{ series: { A: object[], B: object[], C: object[] }, [key: string]: object[] }} data
   *   `series` maps liturgical series letters to their proper datasets.
   *   All other keys are shared datasets applied regardless of series.
   */
  constructor({ series, ...shared }) {
    this._series = series;
    this._shared = shared;
  }

  /**
   * Load propers for a given date and week of the lectionary.
   * @param {DateTime} date
   * @param {number} weekOfLectionary
   */
  load(date, weekOfLectionary) {
    // Luxon represents Sunday as weekday 7; normalize to 0
    const weekday = date.weekday === 7 ? 0 : date.weekday;

    const filter = (entries) =>
      entries
        .filter(
          (proper) =>
            (proper.week === weekOfLectionary && proper.day === weekday) ||
            (proper.month === date.month && proper.day === date.day)
        )
        .sort((a, b) => {
          if (a.week && !b.week) return -1;
          if (!a.week && b.week) return 1;
          return 0;
        });

    const seriesKey = new Series(date.toJSDate()).getSeries();
    const lectionary = this._series[seriesKey] ?? [];

    const result = { lectionary: filter(lectionary) };
    for (const [key, value] of Object.entries(this._shared)) {
      result[key] = filter(value);
    }
    return result;
  }
}
