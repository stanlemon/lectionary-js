/**
 * @jest-environment jsdom
 */
import * as React from "react";
import Calendar from "./Calendar";
import { render, screen } from "@testing-library/react";

describe("Calendar", () => {
  it("renders", () => {
    render(<Calendar year={2021} month={12} />);

    expect(screen.queryAllByText("December 2021")).toHaveLength(1);

    expect(screen.queryAllByText("1", { selector: "h3" })).toHaveLength(1);
    expect(screen.queryAllByText("Is. 7:10-8:8")).toHaveLength(1);
    expect(screen.queryAllByText("1 Pt. 3:1-22")).toHaveLength(1);

    expect(screen.queryAllByText("31", { selector: "h3" })).toHaveLength(1);
    expect(
      screen.queryAllByText("Christmastide VII", { selector: "h5" })
    ).toHaveLength(1);
    expect(screen.queryAllByText("Is. 60:1-22")).toHaveLength(1);
    expect(screen.queryAllByText("Luke 1:39-56")).toHaveLength(1);
  });
});
