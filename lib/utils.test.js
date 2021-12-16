import { findColor } from "./utils.js";

describe("utils", () => {
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
