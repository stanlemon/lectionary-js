/**
 * Object shape accepted by the factory when the caller passes a Luxon-style
 * date-like value instead of a raw year.
 * @typedef {{ year: number | string }} YearLikeObject
 */

/**
 * Accepted inputs for deriving a calendar year.
 * @typedef {number | string | Date | YearLikeObject} YearLikeValue
 */

/**
 * Constructor shape for Year-like calculators.
 * @template T
 * @typedef {new (year: number) => T} YearType
 */

/**
 * Nested argument-keyed memoization tree used per instance and per method.
 * @typedef {Map<unknown, MemoNode | unknown>} MemoNode
 */

// Shared instances keyed first by calculator class, then by calendar year.
// Example: cache.get(Year).get(2025) -> cached Year-like instance for 2025.
/** @type {Map<YearType<object>, Map<number, object>>} */
const cache = new Map();
// Each source class gets exactly one generated memoizing subclass.
/** @type {WeakMap<YearType<object>, YearType<object>>} */
const cachedTypes = new WeakMap();
const CACHED_VALUE = Symbol("cachedValue");
const METHOD_CACHE = Symbol("methodCache");

/**
 * Collect all callable method names from a Year-like class and its prototypes.
 *
 * @param {YearType<object>} Type
 * @returns {string[]}
 */
function getMethodNames(Type) {
  // Walk the prototype chain so subclasses inherit wrapped versions of both
  // their own methods and Year methods.
  const names = new Set();
  let prototype = Type.prototype;

  while (prototype && prototype !== Object.prototype) {
    for (const [name, descriptor] of Object.entries(
      Object.getOwnPropertyDescriptors(prototype)
    )) {
      if (name === "constructor" || typeof descriptor.value !== "function") {
        continue;
      }

      names.add(name);
    }

    prototype = Object.getPrototypeOf(prototype);
  }

  return [...names];
}

/**
 * Resolve a memoized result for one method invocation on one cached instance.
 *
 * @template T
 * @param {object & { [METHOD_CACHE]: Map<string, MemoNode> }} instance
 * @param {string} methodName
 * @param {unknown[]} args
 * @param {() => T} invoke
 * @returns {T}
 */
function memoizeCall(instance, methodName, args, invoke) {
  // Cache entries are stored as a nested Map tree keyed by argument identity.
  // That lets us distinguish values such as `undefined`, symbols, objects, and
  // numbers without depending on fragile JSON serialization.
  const methodCache = instance[METHOD_CACHE];

  if (!methodCache.has(methodName)) {
    methodCache.set(methodName, new Map());
  }

  let node = methodCache.get(methodName);
  for (const arg of args) {
    if (!node.has(arg)) {
      node.set(arg, new Map());
    }
    node = node.get(arg);
  }

  if (node.has(CACHED_VALUE)) {
    return node.get(CACHED_VALUE);
  }

  const result = invoke();
  node.set(CACHED_VALUE, result);
  return result;
}

/**
 * Build a memoizing wrapper subclass for a Year-like calculator type.
 *
 * @template T
 * @param {YearType<T>} Type
 * @returns {YearType<T>}
 */
function createCachedType(Type) {
  // We generate a subclass instead of using a Proxy so two things keep working:
  // 1. `#private` fields on Year remain accessible.
  // 2. Nested method calls such as getEndOfYear() -> getAdvent() flow back
  //    through the wrapped methods on the instance and benefit from memoization.
  class CachedType extends Type {
    constructor(...args) {
      super(...args);
      // Store per-instance memoized results on a symbol so callers cannot
      // accidentally depend on or mutate the cache shape.
      Object.defineProperty(this, METHOD_CACHE, {
        value: new Map(),
      });
      // Cached instances are shared process-wide, so freeze them after setup to
      // avoid external mutation poisoning later callers.
      Object.freeze(this);
    }
  }

  for (const methodName of getMethodNames(Type)) {
    Object.defineProperty(CachedType.prototype, methodName, {
      configurable: true,
      writable: true,
      value(...args) {
        // Resolve the original method from the source prototype, then memoize
        // the result on this cached instance for this exact argument list.
        return memoizeCall(this, methodName, args, () =>
          Type.prototype[methodName].apply(this, args)
        );
      },
    });
  }

  // Preserve the expected constructor identity for callers and tests:
  // YearFactory.get(2025, Year).constructor === Year
  Object.defineProperty(CachedType.prototype, "constructor", {
    configurable: true,
    writable: true,
    value: Type,
  });

  return CachedType;
}

/**
 * Return the generated memoizing subclass for the given source class.
 *
 * @template T
 * @param {YearType<T>} Type
 * @returns {YearType<T>}
 */
function getCachedType(Type) {
  if (!cachedTypes.has(Type)) {
    // Generating wrapper subclasses repeatedly is unnecessary churn, so hold on
    // to one generated type per source class.
    cachedTypes.set(
      Type,
      /** @type {YearType<object>} */ (createCachedType(Type))
    );
  }

  return /** @type {YearType<T>} */ (cachedTypes.get(Type));
}

/**
 * Factory/cache for Year-like calculators keyed by class type and calendar year.
 */
export const YearFactory = {
  /**
   * Return a cached Year-like calculator for the requested calendar year.
   *
   * `Type` is typically `Year` or `ThreeYear`, but tests also use ad-hoc
   * subclasses to verify memoization behavior. Instances are shared by class and
   * year, so `Year` 2025 and `ThreeYear` 2025 remain distinct cache entries.
   *
   * @template T
   * @param {YearLikeValue} value
   * @param {YearType<T>} Type
   * @returns {T}
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
      const CachedType = getCachedType(Type);
      typeCache.set(year, new CachedType(year));
    }

    return typeCache.get(year);
  },

  /**
   * Normalize the different "year-like" inputs callers pass into the factory.
   * We accept raw years, JS Dates, and Luxon-style objects with a `year`
   * property so Week/Series can pass their existing date values directly.
   *
   * @param {YearLikeValue} value
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
    // Test helper: clear cached instances between assertions.
    cache.clear();
  },
};
