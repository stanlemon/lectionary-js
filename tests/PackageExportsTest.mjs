import assert from "node:assert/strict";
import { statSync } from "node:fs";
import test from "node:test";
import {
  Series,
  Sundays,
  ThreeYearWeek,
  Week,
  Year,
} from "@stanlemon/lectionary";

test("built package exports retain the public Date calendar contract", () => {
  assert.equal(
    import.meta.resolve("@stanlemon/lectionary"),
    new URL("../dist/lib/index.js", import.meta.url).href
  );
  assert.ok(
    statSync(new URL("../dist/lib/index.d.ts", import.meta.url)).size > 0
  );

  const year = new Year(2024);
  const easter = year.getEaster();
  assert.ok(easter instanceof Date);
  assert.deepEqual(
    [
      easter.getFullYear(),
      easter.getMonth(),
      easter.getDate(),
      easter.getHours(),
    ],
    [2024, 2, 31, 0]
  );
  assert.equal(new Week(easter).getWeek(), Sundays.EASTER);
  assert.equal(new ThreeYearWeek(easter).getWeek(), Sundays.EASTER);
  easter.setFullYear(1900);
  assert.equal(year.getEaster().getFullYear(), 2024);
});

test("built series exports change at Advent rather than January", () => {
  const advent = new Year(2022).getAdvent();
  assert.deepEqual(
    [advent.getFullYear(), advent.getMonth(), advent.getDate()],
    [2022, 10, 27]
  );
  assert.equal(new Series(new Date(2022, 10, 26)).getSeries(), "C");
  assert.equal(new Series(advent).getSeries(), "A");
  assert.equal(new Series(new Date(2023, 0, 1)).getSeries(), "A");
});
