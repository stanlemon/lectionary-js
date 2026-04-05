/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";

import Day from "./Day";
import { LectionaryProvider } from "./LectionaryContext";

function renderDay(props) {
  return render(
    <LectionaryProvider>
      <Day {...props} />
    </LectionaryProvider>
  );
}

describe("Day", () => {
  it("renders a Sunday with the proper Sunday name", () => {
    renderDay({ year: 2021, month: 12, day: 5 });

    expect(
      screen.queryAllByText("December 05, 2021", { selector: "h2" })
    ).toHaveLength(1);
    expect(
      screen.queryAllByText("Populus Zion (Advent 2)", { selector: "h3" })
    ).toHaveLength(1);
  });

  it("shows a parament pill beside the date", () => {
    renderDay({ year: 2021, month: 12, day: 5 });

    const date = screen.getByText("December 05, 2021", { selector: "h2" });
    const pill = screen.getByText("Violet", { selector: ".parament-pill" });

    expect(pill).toHaveClass("parament-pill", "parament-pill-violet");
    expect(date.parentElement).toContainElement(pill);
  });

  it("renders a weekday with a title referencing its Sunday", () => {
    // December 6, 2021 is a Monday in the Advent 2 week
    renderDay({ year: 2021, month: 12, day: 6 });

    expect(
      screen.queryAllByText("December 06, 2021", { selector: "h2" })
    ).toHaveLength(1);
    expect(
      screen.getByText(/Monday of/, { selector: "h3" })
    ).toBeInTheDocument();
  });

  it("shows navigation links to the previous and next day", () => {
    renderDay({ year: 2021, month: 12, day: 5 });

    expect(screen.getByText("« December 4, 2021")).toBeInTheDocument();
    expect(screen.getByText("December 6, 2021 »")).toBeInTheDocument();
  });

  it("renders a feast day with its proper title from the lectionary", () => {
    // December 25, 2021 is a Saturday — without the lectionaryTitle fix it would
    // show "Saturday of Rorate coeli (Advent 4)" instead of the feast name
    renderDay({ year: 2021, month: 12, day: 25 });

    expect(
      screen.queryAllByText("December 25, 2021", { selector: "h2" })
    ).toHaveLength(1);
    expect(
      screen.queryAllByText("The Nativity of Our Lord (Christmas Dawn)", {
        selector: "h3",
      })
    ).toHaveLength(1);
    expect(
      screen.getByText("White", { selector: ".parament-pill" })
    ).toHaveClass("parament-pill-white");
  });

  it("shows a navigation link back to the monthly calendar", () => {
    renderDay({ year: 2021, month: 12, day: 5 });

    expect(screen.getByText("December")).toBeInTheDocument();
  });
});
