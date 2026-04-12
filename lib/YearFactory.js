const cache = new Map();
const CACHED_VALUE = Symbol("cachedValue");

/**
 * Factory/cache for Year-like calculators keyed by class type and calendar year.
 */
export const YearFactory = {
  /**
   * @param {number|string|Date|{year:number|string}} value
   * @param {Function} Type
   * @returns {object}
   */
  get(value, Type) {
    const year = YearFactory.getYear(value);
    if (Number.isNaN(year)) {
      throw new TypeError(`Unable to derive year from value: ${value}`);
    }

    if (!cache.has(Type)) {
      cache.set(Type, new Map());
    }

    const typeCache = cache.get(Type);

    if (!typeCache.has(year)) {
      typeCache.set(year, YearFactory.createMemoizedProxy(new Type(year)));
    }

    return typeCache.get(year);
  },

  /**
   * @param {number|string|Date|{year:number|string}} value
   * @returns {number}
   */
  getYear(value) {
    if (value instanceof Date) {
      return value.getFullYear();
    }

    if (value && typeof value === "object" && "year" in value) {
      return parseInt(value.year, 10);
    }

    return parseInt(value, 10);
  },

  clear() {
    cache.clear();
  },

  /**
   * Wraps an instance in a Proxy that memoizes method calls by method name + args.
   * @param {object} instance
   * @returns {object}
   */
  createMemoizedProxy(instance) {
    const methodCache = new Map();
    const wrapperCache = new Map();

    return new Proxy(instance, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);

        if (prop === "constructor" || typeof value !== "function") {
          return value;
        }

        if (wrapperCache.has(prop)) {
          return wrapperCache.get(prop);
        }

        const wrapped = (...args) => {
          if (!methodCache.has(prop)) {
            methodCache.set(prop, new Map());
          }

          let node = methodCache.get(prop);
          for (const arg of args) {
            if (!node.has(arg)) {
              node.set(arg, new Map());
            }
            node = node.get(arg);
          }

          if (node.has(CACHED_VALUE)) {
            return node.get(CACHED_VALUE);
          }

          const result = value.apply(target, args);
          node.set(CACHED_VALUE, result);
          return result;
        };

        wrapperCache.set(prop, wrapped);
        return wrapped;
      },
    });
  },
};
