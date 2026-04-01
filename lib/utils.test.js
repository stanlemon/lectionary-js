import { findColor, findProperByType, hasReadings } from "./utils.js";

describe("findProperByType", () => {
  it("returns null when propers is not an array", () => {
    expect(findProperByType(null, 1)).toBeNull();
    expect(findProperByType(undefined, 1)).toBeNull();
    expect(findProperByType({}, 1)).toBeNull();
  });

  it("returns null for an empty array", () => {
    expect(findProperByType([], 1)).toBeNull();
  });

  it("returns null when no proper matches the type", () => {
    expect(findProperByType([{ type: 2, text: "John 3:16" }], 1)).toBeNull();
  });

  it("returns the first matching proper", () => {
    const propers = [
      { type: 1, text: "Romans 8:1-11" },
      { type: 2, text: "John 3:16" },
      { type: 1, text: "Romans 8:12-17" },
    ];
    expect(findProperByType(propers, 1)).toEqual({
      type: 1,
      text: "Romans 8:1-11",
    });
  });
});

describe("hasReadings", () => {
  const ot = { type: 19, text: "Isaiah 40:1-11" };
  const epistle = { type: 1, text: "Romans 8:1-11" };
  const gospel = { type: 2, text: "John 3:16" };

  it("returns truthy when OT, Epistle, and Gospel are all present", () => {
    expect(hasReadings([ot, epistle, gospel])).toBeTruthy();
  });

  it("returns falsy when OT is missing", () => {
    expect(hasReadings([epistle, gospel])).toBeFalsy();
  });

  it("returns falsy when Epistle is missing", () => {
    expect(hasReadings([ot, gospel])).toBeFalsy();
  });

  it("returns falsy when Gospel is missing", () => {
    expect(hasReadings([ot, epistle])).toBeFalsy();
  });

  it("returns falsy for an empty array", () => {
    expect(hasReadings([])).toBeFalsy();
  });
});

describe("findColor", () => {
  it("findColor", () => {
    expect(findColor([], [{ type: 25, text: "green" }])).toEqual("green");

    expect(
      findColor([{ type: 25, text: "purple" }], [{ type: 25, text: "green" }])
    ).toEqual("purple");

    expect(
      findColor(
        [{ type: 25, text: "purple" }],
        [],
        [{ type: 25, text: "green" }]
      )
    ).toEqual("purple");
  });
});
