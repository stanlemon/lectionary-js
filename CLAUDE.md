# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@stanlemon/lectionary` is a JavaScript library for calculating the Western Christian liturgical calendar (church year) and displaying the appointed weekly readings and prayers in the Lutheran tradition. It ships as both an npm package (the core library) and a React web app deployed to GitHub Pages.

## Commands

```bash
npm run start        # Webpack dev server
npm run build        # Production build (NODE_ENV=production)
npm run test         # Run Jest tests
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

Components are class-based React (legacy style).

### Data (`/data`)

JSON files for propers (appointed readings). Each entry: `{ type, week, month, day, text }`.

- `types.json` — Maps integer type IDs (0–39) to categories. Notable: `0` = title, `1` = Epistle, `2` = Gospel, `19` = Old Testament, `20` = Collect, `23` = Antiphon, `25` = liturgical color.
- `lsb-1yr.json` — Primary 1-year lectionary.
- `lsb-festivals.json`, `lsb-daily.json`, `lsb-commemorations.json` — Supplemental propers.
- `tlh.json` — Alternative TLH lectionary.
- `tests.json` — Reference data used in test assertions.

### Build & Config

Build, Jest, and ESLint configs are thin wrappers that re-export from `@stanlemon/webdev` and `@stanlemon/eslint-config`. App entry points come from `.env` (`WEBDEV_ENTRY`, `WEBDEV_HTML`).

## Key Domain Notes

- The church year runs ~57 weeks starting with Advent 1 (4th Sunday before Christmas).
- Dates use **Luxon** (`DateTime`); Luxon treats Sunday as weekday `7`, which the codebase adjusts to `0` in some places.
- Propers are week-based, not date-based—two dates in the same liturgical week share the same propers.
- Liturgical color is stored as a proper entry (type 25) alongside readings.
