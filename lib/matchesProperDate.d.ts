import type { Dayjs } from "dayjs";
import type { Proper } from "./Loader.js";
/**
 * Determine whether a given proper should be included when loading propers for
 * a specific calendar date.
 *
 * A proper can match in one of two ways:
 * 1. By liturgical week + weekday for movable propers such as Sundays and Holy
 *    Week observances.
 * 2. By calendar month + day for fixed observances such as festivals.
 *
 * Keeping those rules together avoids duplication between KeyLoader and
 * SimpleLoader. Higher-level precedence decisions are intentionally left to the
 * presentation layer, which can show both observances while still making one of
 * them primary.
 *
 * @param {import("./Loader.js").Proper} proper
 * @param {import("dayjs").Dayjs} date
 * @param {number | null} weekOfLectionary
 * @returns {boolean}
 */
export declare function matchesProperDate(proper: Proper, date: Dayjs, weekOfLectionary: number | null): boolean;
