import * as React from "react";
import * as ReactDOM from "react-dom";
import { DateTime } from "luxon";
import { CalendarBuilder } from "../src/CalendarBuilder";
import { SimpleLoader } from "../src/SimpleLoader";

import oneyear from "../data/lsb-1yr.json";
import daily from "../data/lsb-daily.json";

const loader = new SimpleLoader(oneyear, daily);

class Example extends React.Component {
  constructor(props) {
    super(props);

    const { year, month } = this.getYearAndMonth();

    this.state = {
      year: year ?? DateTime.local().year,
      month: month ?? DateTime.local().month,
      grid: [],
    };
  }

  componentDidMount() {
    this.build();

    window.onhashchange = () => {
      const { year, month } = this.getYearAndMonth();
      this.setState({ year, month });
      this.build();
    };
  }

  getYearAndMonth() {
    const [year, month] = window.location.hash
      .trim()
      .substring(2, window.location.hash.length - 1)
      .split("/")
      .map((v) => parseInt(v, 0.1));
    return { year, month };
  }

  getNextMonth() {
    const { year, month } = this.state;

    if (month === 12) {
      return { year: year + 1, month: 1 };
    } else {
      return { year, month: month + 1 };
    }
  }

  getLastMonth() {
    const { year, month } = this.state;

    if (month === 1) {
      return { year: year - 1, month: 12 };
    } else {
      return { year, month: month - 1 };
    }
  }

  build() {
    const builder = new CalendarBuilder(this.state.year, this.state.month);
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
        <h1>
          {this.state.year}-{this.state.month}
        </h1>
        <a href={`#/${Object.values(this.getLastMonth()).join("/")}/`}>
          Last Month
        </a>
        <a href={`#/${Object.values(this.getNextMonth()).join("/")}/`}>
          Next Month
        </a>
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
