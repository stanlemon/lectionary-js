import * as React from "react";
import * as ReactDOM from "react-dom";
import { DateTime } from "luxon";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Calendar from "./Calendar";
import Day from "./Day";

function App() {
  // eslint-disable-next-line no-undef
  const basename = PUBLIC_PATH; // Supplied by webpack at build time
  return (
    <Router basename={basename}>
      <Switch>
        <Redirect
          exact
          push
          from="/"
          to={{
            pathname: `/${DateTime.local().year}/${DateTime.local().month}/`,
          }}
        />
        <Route exact path="/:year/:month/" component={Calendar} />
        <Route exact path="/:year/:month/:day/" component={Day} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
