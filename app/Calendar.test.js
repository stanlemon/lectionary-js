/**
 * @jest-environment jsdom
 */
import * as React from "react";
import Calendar from "./Calendar";
import { render, screen, fireEvent, within } from "@testing-library/react";

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

  it("applies bold classes to Sundays and festival weekdays", () => {
    render(<Calendar year={2021} month={12} />);

    // Dec 5 2021 is a Sunday — gets sunday-day class
    const sundayNumber = screen.getByText("5", { selector: "h3" });
    expect(sundayNumber).toHaveClass("sunday-day");
    expect(sundayNumber).not.toHaveClass("festival-day");

    // Dec 1 2021 is a plain Wednesday — no bold classes
    const weekdayNumber = screen.getByText("1", { selector: "h3" });
    expect(weekdayNumber).not.toHaveClass("sunday-day");
    expect(weekdayNumber).not.toHaveClass("festival-day");

    // Dec 27 2021 is a Monday with St. John the Apostle festival propers — gets festival-day class
    const festivalWeekdayNumber = screen.getByText("27", { selector: "h3" });
    expect(festivalWeekdayNumber).toHaveClass("festival-day");
    expect(festivalWeekdayNumber).not.toHaveClass("sunday-day");
  });

  it("shows a detail panel below the calendar when a date is tapped on mobile", () => {
    const originalInnerWidth = window.innerWidth;
    // Simulate mobile viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    });

    render(<Calendar year={2021} month={12} />);

    // Tap Dec 5 (Sunday — Advent 2 "Populus Zion")
    const dayCell = screen.getByText("5", { selector: "h3" }).closest("td");
    fireEvent.click(dayCell);

    const panel = document.querySelector(".day-detail-panel");
    expect(
      within(panel).getByText("Populus Zion (Advent 2)")
    ).toBeInTheDocument();
    expect(
      within(panel).getByRole("link", { name: /view full readings/i })
    ).toBeInTheDocument();

    // Tap Dec 1 (Wednesday — no Sunday lectionary of its own)
    const day1Cell = screen.getByText("1", { selector: "h3" }).closest("td");
    fireEvent.click(day1Cell);

    // Panel should update — Advent 1 Sunday's name
    const panel2 = document.querySelector(".day-detail-panel");
    expect(
      within(panel2).getByText("Ad Te Levavi (Advent 1)")
    ).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
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
