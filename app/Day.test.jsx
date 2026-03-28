/**
 * @jest-environment jsdom
 */
import * as React from "react";
import Day from "./Day";
import { render, screen } from "@testing-library/react";

describe("Day", () => {
  it("renders", () => {
    render(<Day year={2021} month={12} day={5} />);

    expect(
      screen.queryAllByText("December 05, 2021", { selector: "h2" })
    ).toHaveLength(1);
    expect(
      screen.queryAllByText("Populus Zion (Advent 2)", { selector: "h3" })
    ).toHaveLength(1);
  });
});
