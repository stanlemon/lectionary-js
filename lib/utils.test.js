import Sundays from "./Sundays.js";
import {
  festivalHasPrecedence,
  findColor,
  findProperByType,
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
