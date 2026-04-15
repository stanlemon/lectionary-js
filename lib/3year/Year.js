import { Year } from "../Year.js";

/**
 * Three-year liturgical year calculator.
 *
 * This reuses the one-year anchor dates except where the three-year calendar
 * shifts Transfiguration to the Sunday before Ash Wednesday.
 */
export class ThreeYear extends Year {
  /**
   * Return Transfiguration Sunday for the three-year lectionary.
   *
   * In the three-year calendar there is no Gesima/pre-Lent season, so
   * Transfiguration lands one week before Ash Wednesday.
   *
   * @returns {import("luxon").DateTime}
   */
  getTransfiguration() {
    // Sunday before Ash Wednesday = Easter − 7 weeks (no pre-Lent season)
    return this.getEaster().minus({ weeks: 7 });
  }
}
