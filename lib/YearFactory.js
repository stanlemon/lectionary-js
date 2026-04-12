/**
 * Factory/cache for Year-like calculators keyed by class type and calendar year.
 */
export class YearFactory {
  /**
   * @type {Map<Function, Map<number, object>>}
   * @private
   */
  static _cache = new Map();

  /**
   * @param {number|string|Date|{year:number|string}} value
   * @param {Function} Type
   * @returns {object}
   */
  static get(value, Type) {
    const year = this.getYear(value);
    if (Number.isNaN(year)) {
      throw new TypeError(`Unable to derive year from value: ${value}`);
    }

    if (!this._cache.has(Type)) {
      this._cache.set(Type, new Map());
    }

    const typeCache = this._cache.get(Type);

    if (!typeCache.has(year)) {
      typeCache.set(year, this.createMemoizedProxy(new Type(year)));
    }

    return typeCache.get(year);
  }

  /**
   * @param {number|string|Date|{year:number|string}} value
   * @returns {number}
   */
  static getYear(value) {
    if (value instanceof Date) {
      return value.getFullYear();
    }

    if (value && typeof value === "object" && "year" in value) {
      return parseInt(value.year, 10);
    }

    return parseInt(value, 10);
  }

  static clear() {
    this._cache.clear();
  }

  /**
   * Wraps an instance in a Proxy that memoizes method calls by method name + args.
   * @param {object} instance
   * @returns {object}
   */
  static createMemoizedProxy(instance) {
    const methodCache = new Map();

    return new Proxy(instance, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);

        if (typeof value !== "function") {
          return value;
        }

        return (...args) => {
          if (!methodCache.has(prop)) {
            methodCache.set(prop, new Map());
          }

          const cacheKey = JSON.stringify(args);
          const propCache = methodCache.get(prop);

          if (propCache.has(cacheKey)) {
            return propCache.get(cacheKey);
          }

          const result = value.apply(target, args);
          propCache.set(cacheKey, result);
          return result;
        };
      },
    });
  }
}
