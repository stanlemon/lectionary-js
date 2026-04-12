import Sundays from "./Sundays.js";
import {
  festivalHasPrecedence,
  findColor,
  findProperByType,
  findPropersByType,
  getDisplayPropers,
  getPrecedence,
  hasReadings,
} from "./utils.js";

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

describe("findPropersByType", () => {
  it("returns only the requested first matches", () => {
    const propers = [
      { type: 0, text: "Holy Cross Day" },
      { type: 19, text: "Num. 21:4-9" },
      { type: 1, text: "1 Cor. 1:18-25" },
      { type: 2, text: "John 12:20-33" },
      { type: 1, text: "Should not win" },
    ];

    expect(findPropersByType(propers, [0, 1, 2])).toEqual({
      0: { type: 0, text: "Holy Cross Day" },
      1: { type: 1, text: "1 Cor. 1:18-25" },
      2: { type: 2, text: "John 12:20-33" },
    });
  });

  it("returns an empty object for invalid inputs", () => {
    expect(findPropersByType(null, [0, 1])).toEqual({});
    expect(findPropersByType([], null)).toEqual({});
  });
});

describe("hasReadings", () => {
  const ot = { type: 19, text: "Isaiah 40:1-11" };
  const epistle = { type: 1, text: "Romans 8:1-11" };
  const gospel = { type: 2, text: "John 3:16" };

  it("returns truthy when Epistle and Gospel are present", () => {
    expect(hasReadings([ot, epistle, gospel])).toBeTruthy();
  });

  it("keeps OT optional", () => {
    expect(hasReadings([epistle, gospel])).toBeTruthy();
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

describe("getDisplayPropers", () => {
  const lectionary = [
    { type: 0, text: "Transfiguration" },
    { type: 19, text: "Ex. 34:29-35" },
    { type: 1, text: "2 Pet. 1:16-21" },
    { type: 2, text: "Matt. 17:1-9" },
    { type: 25, text: "White" },
  ];

  it("keeps a festival section when OT is missing but Epistle and Gospel are present", () => {
    const festivals = [
      { type: 0, text: "St. Timothy, Pastor" },
      { type: 1, text: "1 Tim. 6:11-16" },
      { type: 2, text: "Matt. 24:42-47" },
      { type: 25, text: "Red" },
    ];

    expect(
      getDisplayPropers({
        week: Sundays.EPIPHANY_3,
        lectionary,
        festivals,
      })
    ).toEqual([festivals, lectionary]);
  });

  it("drops non-renderable primary propers so rendering and color stay aligned", () => {
    const festivals = [
      { type: 0, text: "Example Festival" },
      { type: 1, text: "Rom. 8:1-11" },
      { type: 25, text: "Red" },
    ];

    expect(
      getDisplayPropers({
        week: Sundays.TRINITY_22,
        lectionary,
        festivals,
      })
    ).toEqual([lectionary]);
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

describe("festivalHasPrecedence", () => {
  it("returns false for the Sunday after New Years", () => {
    expect(festivalHasPrecedence(Sundays.SUNDAY_AFTER_NEW_YEARS)).toBe(false);
  });

  it("returns true during the Epiphany portion of the year", () => {
    expect(festivalHasPrecedence(Sundays.EPIPHANY_2)).toBe(true);
  });

  it("returns false during Holy Week", () => {
    expect(festivalHasPrecedence(Sundays.PALM_SUNDAY)).toBe(false);
  });

  it("returns true during Trinity/Pentecost", () => {
    expect(festivalHasPrecedence(Sundays.TRINITY_22)).toBe(true);
  });

  it("returns false during Christmas", () => {
    expect(festivalHasPrecedence(Sundays.SUNDAY_AFTER_CHRISTMAS)).toBe(false);
  });
});

describe("getPrecedence", () => {
  const lectionary = [{ type: 0, text: "Trinity 22" }];
  const festivals = [{ type: 0, text: "All Saints Day" }];

  it("prefers festivals during the Trinity/Pentecost portion of the year", () => {
    expect(
      getPrecedence({ week: Sundays.TRINITY_22, lectionary, festivals })
    ).toEqual({
      primary: festivals,
      secondary: lectionary,
    });
  });

  it("prefers the lectionary during Holy Week", () => {
    expect(
      getPrecedence({
        week: Sundays.PALM_SUNDAY,
        lectionary: [{ type: 0, text: "Maundy Thursday" }],
        festivals,
      })
    ).toEqual({
      primary: [{ type: 0, text: "Maundy Thursday" }],
      secondary: festivals,
    });
  });

  it("returns the only available collection as primary", () => {
    expect(
      getPrecedence({ week: Sundays.TRINITY_22, lectionary: [], festivals })
    ).toEqual({
      primary: festivals,
      secondary: [],
    });
  });
});
