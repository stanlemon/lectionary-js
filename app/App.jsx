import { createRoot } from "react-dom/client";
import { DateTime } from "luxon";
import { Router, Switch, Route } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Calendar from "./Calendar";
import Day from "./Day";
import "./App.css";

function App() {
  return (
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
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
