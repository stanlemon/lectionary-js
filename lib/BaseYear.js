/**
 * Shared interface for liturgical year calculators.
 *
 * Implementations calculate the canonical anchor dates used throughout the
 * church year. `YearFactory` relies on this common zero-argument API when
 * constructing Year-like helpers from "year-like" inputs.
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
  #notImplemented(methodName) {
    throw new Error(
      `${this.constructor.name}.${methodName}() must be implemented`
    );
  }

  /**
   * @returns {Date}
   */
  getAdvent() {
    return this.#notImplemented("getAdvent");
  }

  /**
   * @returns {Date}
   */
  getChristmas() {
    return this.#notImplemented("getChristmas");
  }

  /**
   * @returns {Date}
   */
  getEpiphany() {
    return this.#notImplemented("getEpiphany");
  }

  /**
   * @returns {Date}
   */
  getEpiphanySunday() {
    return this.#notImplemented("getEpiphanySunday");
  }

  /**
   * @returns {Date}
   */
  getTransfiguration() {
    return this.#notImplemented("getTransfiguration");
  }

  /**
   * @returns {Date}
   */
  getAshWednesday() {
    return this.#notImplemented("getAshWednesday");
  }

  /**
   * @returns {Date}
   */
  getLent() {
    return this.#notImplemented("getLent");
  }

  /**
   * @returns {Date}
   */
  getEaster() {
    return this.#notImplemented("getEaster");
  }

  /**
   * @returns {Date}
   */
  getTrinity() {
    return this.#notImplemented("getTrinity");
  }

  /**
   * @returns {Date}
   */
  getPentecost() {
    return this.#notImplemented("getPentecost");
  }

  /**
   * @returns {Date}
   */
  getLastSunday() {
    return this.#notImplemented("getLastSunday");
  }

  /**
   * @returns {Date}
   */
  getEndOfYear() {
    return this.#notImplemented("getEndOfYear");
  }
}
