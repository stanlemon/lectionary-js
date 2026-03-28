import { render, screen } from "@testing-library/react";

import { App } from "./App";

describe("App", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("renders the site header and footer", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Lutheran Lectionary" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Stan Lemon" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Check out the source code." })
    ).toBeInTheDocument();
  });

  it("renders the calendar by default", () => {
    render(<App />);
    // Calendar renders a table with day-of-week column headers
    expect(screen.getByText("Sunday")).toBeInTheDocument();
    expect(screen.getByText("Saturday")).toBeInTheDocument();
  });

  it("routes to a specific month calendar via /:year/:month/", () => {
    window.location.hash = "#/2021/12/";
    render(<App />);
    expect(screen.queryAllByText("December 2021")).toHaveLength(1);
  });

  it("routes to a specific day view via /:year/:month/:day/", () => {
    window.location.hash = "#/2021/12/05/";
    render(<App />);
    expect(
      screen.queryAllByText("December 05, 2021", { selector: "h2" })
    ).toHaveLength(1);
  });

  it("routes to today's day view via /today", () => {
    window.location.hash = "#/today";
    render(<App />);
    // Day view always renders a nav element with prev/next day links
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
