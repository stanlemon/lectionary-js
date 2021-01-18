import * as React from "react";
import * as ReactDOM from "react-dom";
import { CalendarBuilder } from "../src/CalendarBuilder";
import { SimpleLoader } from "../src/SimpleLoader";

import oneyear from "../data/lsb-1yr.json";
import daily from "../data/lsb-daily.json";

const loader = new SimpleLoader(oneyear, daily);

/**
 * Example <Counter/> wrapped in PouchDB documents three different ways.
 */
class Example extends React.Component {
  state = {
    grid: [],
  };

  componentDidMount() {
    const builder = new CalendarBuilder(2021, 1);
    this.setState({
      grid: builder.build(loader.load),
    });
  }

  findProperByType(propers, type) {
    return !Array.isArray(propers)
      ? ""
      : propers.filter((p) => p.type === type).shift();
  }

  renderDay(day, weekDay) {
    return (
      <td key={weekDay}>
        {day && day.date && (
          <div>
            <h2>{day.date.day}</h2>
            {day.date.weekday === 7 && (
              <div>
                <h3>{this.findProperByType(day.propers, 0).text}</h3>
                <div>
                  Old Test: {this.findProperByType(day.propers, 19).text}
                </div>
                <div>Epistle: {this.findProperByType(day.propers, 1).text}</div>
                <div>Gospel: {this.findProperByType(day.propers, 2).text}</div>
                <br />
              </div>
            )}
            <div>{this.findProperByType(day.propers, 38).text}</div>
            <div>{this.findProperByType(day.propers, 39).text}</div>
          </div>
        )}
      </td>
    );
  }

  render() {
    return (
      <div>
        <h1>Lectionary</h1>
        <table width="100%" border="1">
          <tbody>
            {this.state.grid.map((week, row) => (
              <tr key={row}>
                {week.map((day, weekDay) => this.renderDay(day, weekDay))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<Example />, document.getElementById("root"));
