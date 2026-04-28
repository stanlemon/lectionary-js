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
  #notImplemented(methodName: string): never {
    throw new Error(
      `${this.constructor.name}.${methodName}() must be implemented`
    );
  }

  /**
   * @returns {Date}
   */
  getAdvent(): Date {
    return this.#notImplemented("getAdvent");
  }

  /**
   * @returns {Date}
   */
  getChristmas(): Date {
    return this.#notImplemented("getChristmas");
  }

  /**
   * @returns {Date}
   */
  getEpiphany(): Date {
    return this.#notImplemented("getEpiphany");
  }

  /**
   * @returns {Date}
   */
  getEpiphanySunday(): Date {
    return this.#notImplemented("getEpiphanySunday");
  }

  /**
   * @returns {Date}
   */
  getTransfiguration(): Date {
    return this.#notImplemented("getTransfiguration");
  }

  /**
   * @returns {Date}
   */
  getAshWednesday(): Date {
    return this.#notImplemented("getAshWednesday");
  }

  /**
   * @returns {Date}
   */
  getLent(): Date {
    return this.#notImplemented("getLent");
  }

  /**
   * @returns {Date}
   */
  getEaster(): Date {
    return this.#notImplemented("getEaster");
  }

  /**
   * @returns {Date}
   */
  getTrinity(): Date {
    return this.#notImplemented("getTrinity");
  }

  /**
   * @returns {Date}
   */
  getPentecost(): Date {
    return this.#notImplemented("getPentecost");
  }

  /**
   * @returns {Date}
   */
  getLastSunday(): Date {
    return this.#notImplemented("getLastSunday");
  }

  /**
   * @returns {Date}
   */
  getEndOfYear(): Date {
    return this.#notImplemented("getEndOfYear");
  }
}
