/**
 * @jest-environment jsdom
 */
import * as React from "react";
import Calendar from "./Calendar";
import { render, screen } from "@testing-library/react";

describe("Calendar", () => {
  it("uses abbreviated day-of-week headers", () => {
    render(<Calendar year={2021} month={12} />);

    expect(screen.getByText("Su")).toBeInTheDocument();
    expect(screen.getByText("Mo")).toBeInTheDocument();
    expect(screen.getByText("Tu")).toBeInTheDocument();
    expect(screen.getByText("We")).toBeInTheDocument();
    expect(screen.getByText("Th")).toBeInTheDocument();
    expect(screen.getByText("Fr")).toBeInTheDocument();
    expect(screen.getByText("Sa")).toBeInTheDocument();

    // Full names should not be present
    expect(screen.queryByText("Sunday")).not.toBeInTheDocument();
    expect(screen.queryByText("Monday")).not.toBeInTheDocument();
  });

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
