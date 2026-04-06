# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@stanlemon/lectionary` is a JavaScript library for calculating the Western Christian liturgical calendar (church year) and displaying the appointed weekly readings and prayers in the Lutheran tradition. It ships as both an npm package (the core library) and a React web app deployed to GitHub Pages.

## Commands

```bash
npm run start        # Vite dev server
npm run build        # Production build
npm run test         # Run Vitest tests
npm run lint         # ESLint check
npm run lint:format  # ESLint with --fix
```

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

## Architecture

### Core Library (`/lib`)

The library is the primary artifact. Key classes:

- **`Year.js`** — Calculates liturgical year anchor dates (Easter, Advent start, Pentecost, etc.) using the Computus algorithm. All other calculations derive from this.
- **`Week.js`** — Given a date, returns which of the 57 liturgical weeks it falls in (1–57).
- **`Sundays.js`** — Constant mapping of week numbers to named Sundays (e.g., `ADVENT_1`, `TRINITY_5`).
- **`CalendarBuilder.js`** — Builds a month grid (array of week arrays of day objects), each day annotated with its liturgical week info.
- **`Loader.js` / `SimpleLoader.js` / `KeyLoader.js`** — Strategy pattern for supplying propers (readings/prayers) data. `KeyLoader` is the primary one used in the app; it accepts an object with keys `lectionary`, `festivals`, `daily`, `commemorations`.
- **`utils.js`** — `findProperByType`, `hasReadings`, `findColor`.
- **`index.js`** — Public library exports.

Data flow: `Date → Week → CalendarBuilder → Loader provides propers for each day`

### React App (`/app`)

- **`App.jsx`** — Root router (wouter, hash-based). Routes: `/`, `/:year/:month/`, `/:year/:month/:day/`, `/today`.
- **`Calendar.jsx`** — Monthly calendar grid view; uses `CalendarBuilder` + `KeyLoader` with `lsb-1yr.json`, `lsb-festivals.json`, `lsb-daily.json`, `lsb-commemorations.json`.
- **`Day.jsx`** — Single-day detail view showing full readings text.

Components are functional React with hooks.

### Data (`/data`)

JSON files for propers (appointed readings). Each entry: `{ type, week, month, day, text }`.

- `types.json` — Maps integer type IDs (0–39) to categories. Notable: `0` = title, `1` = Epistle, `2` = Gospel, `19` = Old Testament, `20` = Collect, `23` = Antiphon, `25` = liturgical color.
- `lsb-1yr.json` — Primary 1-year lectionary.
- `lsb-festivals.json`, `lsb-daily.json`, `lsb-commemorations.json` — Supplemental propers.
- `tlh.json` — Alternative TLH lectionary.
- `tests.json` — Reference data used in test assertions.

### Build & Config

Build tooling uses Vite (`vite.config.js`). Tests run via Vitest with jsdom. Biome is configured in `biome.json`.

## Testing

Tests live alongside source files (`*.test.js` / `*.test.jsx`). Coverage runs at ~95% statements.

### Structure

- `lib/` — Unit tests for all core classes. `Week.test.js` is data-driven from `data/tests.json`, which was generated from the original PHP implementation and covers 10,000+ date/week combinations.
- `app/` — Component tests using `@testing-library/react`. `App.test.jsx` covers routing via hash location.

### Key pitfalls

**Date string format matters.** `new Date("2022-12-25")` parses as **UTC midnight**, which in US timezones resolves to Dec 24 locally. Always use `MM/DD/YYYY` format (`new Date("12/25/2022")`) when constructing dates for `Week` in tests — this matches the format used throughout `data/tests.json`.

**Luxon Sunday is weekday 7, not 0.** The codebase normalizes Sunday to `0` in loader and week logic, but Luxon's `.weekday` returns `7` for Sunday. Tests that verify Sunday matching should account for this.

**`App.jsx` is importable in tests** because the `createRoot` mount is guarded by `if (container)`. Import the named `App` export, not the default module side-effect.

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

- The church year runs ~57 weeks starting with Advent 1 (4th Sunday before Christmas).
- Dates use **Luxon** (`DateTime`); Luxon treats Sunday as weekday `7`, which the codebase adjusts to `0` in some places.
- Propers are week-based, not date-based—two dates in the same liturgical week share the same propers.
- Liturgical color is stored as a proper entry (type 25) alongside readings.
