/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";

import Day from "./Day";

describe("Day", () => {
  it("renders a Sunday with the proper Sunday name", () => {
    render(<Day year={2021} month={12} day={5} />);

    expect(
      screen.queryAllByText("December 05, 2021", { selector: "h2" })
    ).toHaveLength(1);
    expect(
      screen.queryAllByText("Populus Zion (Advent 2)", { selector: "h3" })
    ).toHaveLength(1);
  });

  it("renders a weekday with a title referencing its Sunday", () => {
    // December 6, 2021 is a Monday in the Advent 2 week
    render(<Day year={2021} month={12} day={6} />);

    expect(
      screen.queryAllByText("December 06, 2021", { selector: "h2" })
    ).toHaveLength(1);
    expect(
      screen.getByText(/Monday of/, { selector: "h3" })
    ).toBeInTheDocument();
  });

  it("shows navigation links to the previous and next day", () => {
    render(<Day year={2021} month={12} day={5} />);

    expect(screen.getByText("« December 4, 2021")).toBeInTheDocument();
    expect(screen.getByText("December 6, 2021 »")).toBeInTheDocument();
  });

  it("renders a feast day with Christmas readings", () => {
    // December 25, 2021 — The Nativity of Our Lord (Christmas)
    render(<Day year={2021} month={12} day={25} />);

    expect(
      screen.queryAllByText("December 25, 2021", { selector: "h2" })
    ).toHaveLength(1);
    // Christmas lectionary readings should appear
    expect(screen.getByText("Luke 2:15-20")).toBeInTheDocument();
  });

  it("shows a navigation link back to the monthly calendar", () => {
    render(<Day year={2021} month={12} day={5} />);

    expect(screen.getByText("December")).toBeInTheDocument();
  });
});
