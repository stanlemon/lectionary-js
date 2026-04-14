/**
 * Shared interface for liturgical year calculators.
 *
 * Implementations calculate the canonical anchor dates used throughout the
 * church year. `YearFactory` only memoizes this prescribed API, which keeps the
 * cache layer simple and leaves subclass-specific helper methods uncached.
 *
 * Subclasses are expected to implement every method below. The default methods
 * throw so incomplete implementations fail fast.
 *
 * @interface
 */
export class BaseYear {
  /**
   * @param {string} methodName
   * @returns {never}
   */
  _notImplemented(methodName) {
    throw new Error(
      `${this.constructor.name}.${methodName}() must be implemented`
    );
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getAdvent() {
    return this._notImplemented("getAdvent");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getChristmas() {
    return this._notImplemented("getChristmas");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getEpiphany() {
    return this._notImplemented("getEpiphany");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getEpiphanySunday() {
    return this._notImplemented("getEpiphanySunday");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getTransfiguration() {
    return this._notImplemented("getTransfiguration");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getAshWednesday() {
    return this._notImplemented("getAshWednesday");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getLent() {
    return this._notImplemented("getLent");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getEaster() {
    return this._notImplemented("getEaster");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getTrinity() {
    return this._notImplemented("getTrinity");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getPentecost() {
    return this._notImplemented("getPentecost");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getLastSunday() {
    return this._notImplemented("getLastSunday");
  }

  /**
   * @returns {import("luxon").DateTime}
   */
  getEndOfYear() {
    return this._notImplemented("getEndOfYear");
  }
}
