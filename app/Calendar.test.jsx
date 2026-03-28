/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";

import Calendar from "./Calendar";

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

  it("shows navigation link to previous month", () => {
    render(<Calendar year={2021} month={12} />);
    expect(screen.getByText("« November 2021")).toBeInTheDocument();
  });

  it("shows navigation link to next month", () => {
    render(<Calendar year={2021} month={12} />);
    expect(screen.getByText("January 2022 »")).toBeInTheDocument();
  });

  it("wraps year backward when navigating from January", () => {
    render(<Calendar year={2021} month={1} />);
    expect(screen.getByText("« December 2020")).toBeInTheDocument();
  });

  it("wraps year forward when navigating from December", () => {
    render(<Calendar year={2020} month={12} />);
    expect(screen.getByText("January 2021 »")).toBeInTheDocument();
  });

  it("renders correctly when the month starts on Sunday", () => {
    // August 2021 starts on a Sunday — first day should appear in the first cell
    render(<Calendar year={2021} month={8} />);
    expect(screen.queryAllByText("August 2021")).toHaveLength(1);
    const dayOnes = screen.queryAllByText("1", { selector: "h3" });
    expect(dayOnes).toHaveLength(1);
  });
});
