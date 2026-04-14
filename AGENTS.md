# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

`@stanlemon/lectionary` is a JavaScript library for calculating the Western Christian liturgical calendar (church year) and displaying the appointed weekly readings and prayers in the Lutheran tradition. It ships as both an npm package (the core library) and a React web app deployed to GitHub Pages.

The codebase now supports two lectionary modes:

- **1-year lectionary** — the historic 57-week flow with Gesima Sundays and Trinity numbering.
- **3-year lectionary** — Series A/B/C with Epiphany 6-8 support, Proper Sundays in Ordinary Time, and shared festival/daily/commemoration datasets.

## Commands

```bash
npm run start        # Vite dev server
npm run build        # Production build
npm run test         # Run Vitest tests
npm run lint         # Biome check
npm run lint:format  # Biome check with --write
```

**After every code change you MUST:**
1. Run `npm run lint:format` to auto-format with Biome
2. Run `npm run test` to verify all tests pass

Run a single test file:
```bash
npm run test -- Year.test.js
```

Watch mode:
```bash
npm run test -- --watch
```

Coverage report:
```bash
npm run test -- --coverage
```

## Code Quality

- Prefer JSDoc for public APIs, shared library helpers, and non-trivial internal functions so the JavaScript code remains easier to understand and safer to refactor.
- Add useful explanatory comments when the logic is domain-specific, subtle, or performance-motivated. Avoid comments that only restate the code literally.

## Architecture

### Core Library (`/lib`)

The library is the primary artifact. Key pieces:

- **`BaseYear.js` / `BaseWeek.js`** — Shared runtime contracts for year and week calculators.
- **`Year.js` / `Week.js` / `CalendarBuilder.js`** — One-year calendar calculations and month grid generation.
- **`YearFactory.js`** — Memoized factory/cache for `Year`-like calculators. `Week` and `Series` use this to avoid recomputing anchor dates.
- **`lib/3year/Year.js` / `lib/3year/Week.js` / `lib/3year/Series.js` / `ProperSundays.js`** — Three-year logic: Advent-based Series A/B/C, the Transfiguration-before-Lent rule, and Proper 3-29 mapping for Ordinary Time.
- **`Loader.js` / `SimpleLoader.js` / `KeyLoader.js` / `lib/3year/KeyLoader.js` / `matchesProperDate.js`** — Proper-loading pipeline. One-year loading keys off `Week`; three-year loading keys off `Series` plus `ThreeYearWeek`.
- **`Sundays.js`** — Shared week constants for both modes. Three-year mode reuses the historic Gesima slots for Epiphany 6-8 and adds `PROPER_3`-`PROPER_29` as `58`-`84`.
- **`utils.js`** — Lookup helpers plus precedence rules (`getPrecedence`, `getDisplayPropers`) for lectionary-versus-festival collisions.
- **`index.js`** — Public exports for both one-year and three-year APIs.

### React App (`/app`)

- **`App.jsx`** — Root router (wouter, hash-based). Routes: `/`, `/:year/:month/`, `/:year/:month/:day/`, `/today`.
- **`LectionaryContext.jsx`** — Owns the active lectionary type, persists it in `localStorage`, and provides the active loader through React context.
- **`Calendar.jsx`** — Monthly grid view built from `CalendarBuilder` and the active loader.
- **`Day.jsx`** — Single-day detail view showing full readings text, including precedence-aware primary, secondary, and daily sections.

### Data (`/data`)

JSON files for propers (appointed readings). Entries use either liturgical keys (`week` + lectionary `day`) or fixed-date keys (`month` + calendar `day`), plus `type` and `text`.

- `types.json` — Maps integer type IDs (0–39) to categories. Notable: `0` = title, `1` = Epistle, `2` = Gospel, `19` = Old Testament, `20` = Collect, `23` = Antiphon, `25` = liturgical color.
- `lsb-1yr.json` — Primary 1-year lectionary.
- `lsb-3yr-a.json`, `lsb-3yr-b.json`, `lsb-3yr-c.json` — Series-specific three-year lectionary datasets.
- `lsb-festivals.json`, `lsb-daily.json`, `lsb-commemorations.json` — Shared supplemental propers used by both lectionary modes.
- `tlh.json` — Alternative TLH lectionary.
- `tests.json` — Reference data used in test assertions.

### Build & Config

Build tooling uses Vite (`vite.config.js`). Tests run via Vitest with jsdom. Biome is configured in `biome.json`.

## Testing

Tests live alongside source files (`*.test.js` / `*.test.jsx`).

### Structure

- `lib/` — Unit tests for the one-year core. `Week.test.js` is data-driven from `data/tests.json` and covers 10,000+ date/week combinations from the original PHP implementation.
- `lib/3year/` — Unit tests for `Series`, `ThreeYear`, `ThreeYearWeek`, and `ThreeYearKeyLoader`.
- `app/` — React tests for routing, calendar/day rendering, and lectionary toggle behavior.

### Key pitfalls

**Date string format matters.** `new Date("2022-12-25")` parses as **UTC midnight**, which in US timezones resolves to Dec 24 locally. Always use `MM/DD/YYYY` format (`new Date("12/25/2022")`) when constructing dates for `Week` in tests — this matches the format used throughout `data/tests.json`.

**Luxon Sunday is weekday 7, not 0.** The codebase normalizes Sunday to `0` in loader and week logic, but Luxon's `.weekday` returns `7` for Sunday. Tests that verify Sunday matching should account for this.

**Three-year series rolls over at Advent, not January 1.** `Series` is anchored to the liturgical year, so dates before Advent belong to the previous series even if the calendar year has changed.

**Three-year Ordinary Time is date-ranged Propers, not Trinity week math.** For three-year work, use `ThreeYearWeek`/`ThreeYearKeyLoader` rather than assuming the one-year `Week` numbering can be reused after Pentecost.

**`App.jsx` is importable in tests** because the `createRoot` mount is guarded by `if (container)`. Import the named `App` export, not the default side-effect module.

## Styling & Dark Mode

All styles live in `app/App.css`. The app supports `prefers-color-scheme: dark` and must remain fully legible in both light and dark mode across two layout breakpoints:

- **Desktop (≥ 481px)** — full calendar grid with readings inside cells; day detail navigated via route change.
- **Mobile (≤ 480px)** — compact grid (date number only); selected day shown in a `.day-detail-panel` below the table; footer is fixed to the bottom of the viewport.

### Dark mode rules

When adding or changing any color, background, border, or outline:

1. **Always provide a dark mode counterpart.** If a style sets a hardcoded light color (e.g. `color: #000`, `background: #fff`), add an override inside the appropriate `@media (prefers-color-scheme: dark)` block.
2. **Mobile-specific overrides go in their own block.** Styles scoped to `max-width: 480px` (e.g. `.day-detail-panel` text colors, the fixed footer background, `td.today`/`td.selected` outlines) require a combined `@media only screen and (prefers-color-scheme: dark) and (max-width: 480px)` block — the general dark mode block does not cover them.
3. **Liturgical color classes need both modes.** Classes like `.white` (used on headings and the parament pill) are set to `color: black` for light mode legibility. Dark mode must invert these (e.g. `color: #fff`). The `.parament-pill-white` similarly inverts to a black background with a white border and white text in dark mode.
4. **Never rely on inheritance alone.** The `#calendar { color: #000 }` dark mode rule keeps calendar cell text dark (cells have colored backgrounds). Elements outside or overlapping that scope (detail panel, footer, propers view) do not inherit this and must be styled explicitly.

## Key Domain Notes

- The one-year calendar uses ~57 named liturgical weeks starting with Advent 1. The three-year calendar keeps the same Advent-through-Easter shape, then switches post-Pentecost Sundays to Proper 3-29.
- Dates use **Luxon** (`DateTime`); Luxon treats Sunday as weekday `7`, which the codebase adjusts to `0` in some places.
- The one-year lectionary uses the historic 57-week cycle. The three-year lectionary uses Series A/B/C, removes the pre-Lent Gesima season, and maps post-Pentecost Sundays to Proper 3-29 (`58`-`84`).
- Propers can be week-based or fixed-date. Two dates in the same liturgical week share movable propers; festivals and commemorations can also match directly by month/day.
- Liturgical color is stored as a proper entry (type 25) alongside readings.

## Caching Notes

- Keep caching **outside** `Year` and `ThreeYear`. The year implementations should stay focused on liturgical business logic.
- `YearFactory` only memoizes the prescribed **`BaseYear` zero-argument API**. If a method is not on `BaseYear`, it is intentionally not cached.
- `BaseYear` methods are expected to be **pure** and **zero-argument**. If that changes, revisit `YearFactory`.
- `ThreeYear` participates through inheritance (`ThreeYear -> Year -> BaseYear`). Do not build a separate 3-year cache path.
- Cached Luxon `DateTime`s are rehydrated from plain object data instead of stored raw so ambient Luxon settings like zone do not leak between callers.
- Prefer small, explicit cache rules over generalized cache frameworks unless the rest of the repo actually needs broader abstraction.
