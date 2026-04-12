# Lectionary Calculator & Calendar

JavaScript tools for calculating the Western Christian liturgical calendar and rendering Lutheran lectionary data.

This repository contains:

- an ES module library consumable directly from GitHub
- a React web app built with Vite
- bundled lectionary data files used by the app

The codebase currently supports both major lectionary modes:

- **1-year lectionary** — the historic 57-week cycle with Gesima Sundays and Trinity numbering
- **3-year lectionary** — Series A/B/C with Epiphany 6-8 support and Proper Sundays in Ordinary Time

Source: <https://github.com/stanlemon/lectionary-js>

## Features

- Calculate anchor dates such as Advent, Epiphany, Easter, Pentecost, and Transfiguration
- Determine one-year liturgical week numbers with `Week`
- Determine three-year series and week/proper assignments with `Series` and `ThreeYearWeek`
- Build month grids for calendar UIs with `CalendarBuilder`
- Load and merge lectionary, festival, daily, and commemoration propers in the bundled app

## Install

This package is not currently published to the npm registry. Install it directly from GitHub:

```bash
npm install github:stanlemon/lectionary-js
```

The package name remains `@stanlemon/lectionary`, so imports still look like:

```js
import { Week } from "@stanlemon/lectionary";
```

Node `24.14.1+` is the current supported runtime for this repository.

## Usage

Most calendar classes accept either a JavaScript `Date` or a Luxon `DateTime`.

### One-Year Calendar

```js
import { Week, Year } from "@stanlemon/lectionary";

const date = new Date(2026, 5, 14); // June 14, 2026

const week = new Week(date).getWeek();
const easter = new Year(2026).getEaster().toISODate();

console.log({ week, easter });
```

### Three-Year Calendar

```js
import { Series, Sundays, ThreeYearWeek } from "@stanlemon/lectionary";

const date = new Date(2026, 5, 7); // June 7, 2026

const series = new Series(date).getSeries();
const week = new ThreeYearWeek(date).getWeek();

console.log(series); // "A"
console.log(week === Sundays.PROPER_5); // true
```

## Repository Development

This repository includes the calculator library and a React app for browsing the lectionary.

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run start
```

Build the production app:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Check formatting and linting:

```bash
npm run lint
npm run lint:format
```

## Repository Layout

- `lib/` — core calendar logic and public library exports
- `lib/3year/` — three-year series, week, year, and loader logic
- `app/` — React app, routing, and presentation
- `data/` — bundled lectionary, festival, daily, and commemoration JSON files used by the app

## Contributing

The propers data in this repository has largely been entered and maintained by hand. If you spot an error, open an issue or submit a pull request.

This repository is **not** intended to be an exhaustive catalog of Christian lectionaries. If you want to adapt the code for another tradition, the library is reusable, but that does not imply those lectionaries will be added here.

Functional changes should include a clear description and pass:

- `npm run lint:format`
- `npm run test`

## License

Code in this repository is available under the [MIT](LICENSE) license. Lectionary data belongs to the church at large throughout time.
