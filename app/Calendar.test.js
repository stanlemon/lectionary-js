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

  it("applies festival-day class to Sunday date numbers", () => {
    render(<Calendar year={2021} month={12} />);

    // Dec 5 2021 is a Sunday (Advent 2)
    const sundayNumber = screen.getByText("5", { selector: "h3" });
    expect(sundayNumber).toHaveClass("festival-day");

    // Dec 1 2021 is a Wednesday — should not be bold
    const weekdayNumber = screen.getByText("1", { selector: "h3" });
    expect(weekdayNumber).not.toHaveClass("festival-day");

    // Dec 27 2021 is a Monday with St. John the Apostle festival propers — should also be bold
    const festivalWeekdayNumber = screen.getByText("27", { selector: "h3" });
    expect(festivalWeekdayNumber).toHaveClass("festival-day");
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
