import { DateTime } from "luxon";
import { BaseYear } from "./BaseYear.js";

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

/** @typedef {{ kind: "raw", value: unknown } | { kind: "datetime", value: ReturnType<DateTime["toObject"]> }} CachedResult */

// Shared instances keyed first by calculator class, then by calendar year.
// Example: cache.get(Year).get(2025) -> cached Year-like instance for 2025.
/** @type {Map<YearType<object>, Map<number, object>>} */
const cache = new Map();
// Each source class gets exactly one generated memoizing subclass.
/** @type {WeakMap<YearType<object>, YearType<object>>} */
const cachedTypes = new WeakMap();
const METHOD_CACHE = Symbol("methodCache");
const UNCACHEABLE = Symbol("uncacheable");
// Memoization intentionally covers only the canonical BaseYear API. These
// methods are expected to be pure and zero-argument; helper methods with
// parameters stay outside the cache layer on purpose.
const MEMOIZED_METHODS = Object.getOwnPropertyNames(BaseYear.prototype).filter(
  (name) => name !== "constructor" && !name.startsWith("_")
);

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isPrimitive(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value !== "object" && typeof value !== "function")
  );
}

/**
 * @param {unknown} value
 * @returns {CachedResult | typeof UNCACHEABLE}
 */
function freezeResult(value) {
  if (DateTime.isDateTime(value)) {
    return {
      kind: "datetime",
      value: value.toObject(),
    };
  }

  if (isPrimitive(value)) {
    return { kind: "raw", value };
  }

  return UNCACHEABLE;
}

/**
 * @param {CachedResult} entry
 * @returns {unknown}
 */
function thawResult(entry) {
  if (entry.kind === "datetime") {
    return DateTime.fromObject(entry.value);
  }

  return entry.value;
}

/**
 * Resolve a memoized result for one prescribed BaseYear method on one cached
 * instance. Callers must only use this for pure, zero-argument methods.
 *
 * @template T
 * @param {object & { [METHOD_CACHE]: Map<string, CachedResult> }} instance
 * @param {string} methodName
 * @param {() => T} invoke
 * @returns {T}
 */
function memoizeCall(instance, methodName, invoke) {
  const methodCache = instance[METHOD_CACHE];

  if (methodCache.has(methodName)) {
    return thawResult(methodCache.get(methodName));
  }

  const result = invoke();
  const frozen = freezeResult(result);

  if (frozen === UNCACHEABLE) {
    return result;
  }

  methodCache.set(methodName, frozen);
  return thawResult(frozen);
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

  // Only memoize the canonical BaseYear API. Subclass-specific helper methods
  // and any parameterized behavior stay untouched so the cache layer remains
  // small and easy to reason about.
  for (const methodName of MEMOIZED_METHODS) {
    Object.defineProperty(CachedType.prototype, methodName, {
      configurable: true,
      writable: true,
      value() {
        // Resolve the original method from the source prototype, then memoize
        // the result on this cached instance.
        return memoizeCall(this, methodName, () =>
          Type.prototype[methodName].apply(this)
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
