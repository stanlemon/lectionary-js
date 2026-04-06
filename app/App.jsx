import "./App.css";

import { DateTime } from "luxon";
import { createRoot } from "react-dom/client";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import Calendar from "./Calendar";
import Day from "./Day";
import {
  LECTIONARY_1YR,
  LectionaryProvider,
  useLectionary,
} from "./LectionaryContext";

function LectionaryToggle() {
  const { lectionaryType, toggleLectionary } = useLectionary();
  const label = lectionaryType === LECTIONARY_1YR ? "1 Year" : "3 Year";
  return (
    <button
      type="button"
      className="lectionary-toggle"
      onClick={toggleLectionary}
      aria-label={`Switch lectionary: currently ${label}`}
    >
      {label}
    </button>
  );
}

export function App() {
  return (
    <LectionaryProvider>
      <header className="title-bar">
        <h1>Lutheran Lectionary</h1>
        <LectionaryToggle />
      </header>
      <Router hook={useHashLocation}>
        <Switch>
          <Route exact path="/:year/:month/">
            {({ month, year }) => <Calendar year={year} month={month} />}
          </Route>
          <Route exact path="/:year/:month/:day/">
            {({ month, year, day }) => (
              <Day year={year} month={month} day={day} />
            )}
          </Route>
          <Route exact path="/today">
            <Day
              year={DateTime.local().year}
              month={DateTime.local().month}
              day={DateTime.local().day}
            />
          </Route>
          <Route>
            <Calendar
              year={DateTime.local().year}
              month={DateTime.local().month}
            />
          </Route>
        </Switch>
      </Router>
      <footer>
        Copyright &copy;{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://stanlemon.com"
        >
          Stan Lemon
        </a>
        .{" "}
        <a href="https://github.com/stanlemon/lectionary-js">
          Check out the source code.
        </a>
      </footer>
    </LectionaryProvider>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
