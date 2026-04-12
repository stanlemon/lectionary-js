/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, within } from "@testing-library/react";

import Calendar from "./Calendar";
import { LectionaryProvider } from "./LectionaryContext";

function renderCalendar(props) {
  return render(
    <LectionaryProvider>
      <Calendar {...props} />
    </LectionaryProvider>
  );
}

describe("Calendar", () => {
  it("renders", () => {
    renderCalendar({ year: 2021, month: 12 });

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
    renderCalendar({ year: 2021, month: 12 });
    expect(screen.getByText("« November 2021")).toBeInTheDocument();
  });

  it("shows navigation link to next month", () => {
    renderCalendar({ year: 2021, month: 12 });
    expect(screen.getByText("January 2022 »")).toBeInTheDocument();
  });

  it("wraps year backward when navigating from January", () => {
    renderCalendar({ year: 2021, month: 1 });
    expect(screen.getByText("« December 2020")).toBeInTheDocument();
  });

  it("wraps year forward when navigating from December", () => {
    renderCalendar({ year: 2020, month: 12 });
    expect(screen.getByText("January 2021 »")).toBeInTheDocument();
  });

  it("renders correctly when the month starts on Sunday", () => {
    // August 2021 starts on a Sunday — first day should appear in the first cell
    renderCalendar({ year: 2021, month: 8 });
    expect(screen.queryAllByText("August 2021")).toHaveLength(1);
    const dayOnes = screen.queryAllByText("1", { selector: "h3" });
    expect(dayOnes).toHaveLength(1);
  });

  it("renders responsive day-of-week headers", () => {
    renderCalendar({ year: 2021, month: 12 });

    [
      ["Sunday", "Su"],
      ["Monday", "Mo"],
      ["Tuesday", "Tu"],
      ["Wednesday", "We"],
      ["Thursday", "Th"],
      ["Friday", "Fr"],
      ["Saturday", "Sa"],
    ].forEach(([full, short]) => {
      expect(screen.getByText(full)).toHaveClass("weekday-label-full");
      expect(screen.getByText(short)).toHaveClass("weekday-label-short");
    });
  });

  it("applies bold classes to Sundays and festival weekdays", () => {
    renderCalendar({ year: 2021, month: 12 });

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

    renderCalendar({ year: 2021, month: 12 });

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

  it("keeps lectionary propers primary in the mobile detail panel during festival collisions", () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    });

    renderCalendar({ year: 2027, month: 3 });

    const dayCell = screen.getByText("25", { selector: "h3" }).closest("td");
    fireEvent.click(dayCell);

    const panel = document.querySelector(".day-detail-panel");
    expect(within(panel).getByText("Maundy Thursday")).toBeInTheDocument();
    expect(
      within(panel).getByText("Annunciation of our Lord")
    ).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it("gives festivals precedence in the mobile detail panel during Trinity season collisions", () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    });

    renderCalendar({ year: 2026, month: 11 });

    const dayCell = screen.getByText("1", { selector: "h3" }).closest("td");
    fireEvent.click(dayCell);

    const panel = document.querySelector(".day-detail-panel");
    expect(within(panel).getByText("All Saints Day")).toBeInTheDocument();
    expect(within(panel).getByText("Trinity 22")).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it("uses the secondary readings when the primary festival has no full set", () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    });

    renderCalendar({ year: 2021, month: 1 });

    const dayCell = screen.getByText("24", { selector: "h3" }).closest("td");
    fireEvent.click(dayCell);

    const panel = document.querySelector(".day-detail-panel");
    expect(within(panel).getByText("St. Timothy, Pastor")).toBeInTheDocument();
    expect(within(panel).getByText("Transfiguration")).toBeInTheDocument();
    expect(within(panel).getByText(/Matt\. 17:1-9/)).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });
});
