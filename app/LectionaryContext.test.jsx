import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { vi } from "vitest";

import { App } from "./App";
import {
  LECTIONARY_1YR,
  LECTIONARY_3YR,
  LectionaryProvider,
  useLectionary,
} from "./LectionaryContext";

function wrapper({ children }) {
  return <LectionaryProvider>{children}</LectionaryProvider>;
}

describe("LectionaryContext", () => {
  it("defaults to the 1-year lectionary", () => {
    const { result } = renderHook(() => useLectionary(), { wrapper });
    expect(result.current.lectionaryType).toBe(LECTIONARY_1YR);
  });

  it("provides a loader on initial render", () => {
    const { result } = renderHook(() => useLectionary(), { wrapper });
    expect(result.current.loader).toBeDefined();
    expect(typeof result.current.loader.load).toBe("function");
  });

  it("toggles from 1-year to 3-year", () => {
    const { result } = renderHook(() => useLectionary(), { wrapper });
    act(() => result.current.toggleLectionary());
    expect(result.current.lectionaryType).toBe(LECTIONARY_3YR);
  });

  it("toggles back to 1-year after two presses", () => {
    const { result } = renderHook(() => useLectionary(), { wrapper });
    act(() => result.current.toggleLectionary());
    act(() => result.current.toggleLectionary());
    expect(result.current.lectionaryType).toBe(LECTIONARY_1YR);
  });

  it("swaps the loader instance when the lectionary type changes", () => {
    const { result } = renderHook(() => useLectionary(), { wrapper });
    const initialLoader = result.current.loader;
    act(() => result.current.toggleLectionary());
    expect(result.current.loader).not.toBe(initialLoader);
  });

  it("throws when used outside a LectionaryProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useLectionary())).toThrow(
      "useLectionary must be used within a LectionaryProvider"
    );
    spy.mockRestore();
  });
});

describe("LectionaryToggle", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("renders the toggle button showing '1 Year' by default", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /1 Year/i })).toBeInTheDocument();
  });

  it("switches to '3 Year' when the toggle is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /1 Year/i }));
    expect(screen.getByRole("button", { name: /3 Year/i })).toBeInTheDocument();
  });

  it("switches back to '1 Year' after two clicks", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /1 Year/i }));
    fireEvent.click(screen.getByRole("button", { name: /3 Year/i }));
    expect(screen.getByRole("button", { name: /1 Year/i })).toBeInTheDocument();
  });
});
