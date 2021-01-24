import * as React from "react";
import * as ReactDOM from "react-dom";
import { DateTime } from "luxon";
import classNames from "classnames";
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
      .map((v) => {
        return v.trim() === "" ? null : parseInt(v, 0.1);
      });
    return { year, month };
  }

  getNextMonth() {
    const { year, month } = this.state;

    if (month === 12) {
      return { year: year + 1, month: "01" };
    } else {
      return { year, month: this.paddNumber(month + 1) };
    }
  }

  getLastMonth() {
    const { year, month } = this.state;

    if (month === 1) {
      return { year: year - 1, month: 12 };
    } else {
      return { year, month: this.paddNumber(month - 1) };
    }
  }

  paddNumber(v) {
    if (v < 10) {
      return `0${v}`;
    } else {
      return `${v}`;
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
    const color = this.findProperByType(day?.propers, 25)?.text;
    const classes = classNames(
      color ? `highlight-${color.toLowerCase()}` : false
    );

    return (
      <td className={classes} key={weekDay}>
        {day && day.date && (
          <div>
            <h3>{day.date.day}</h3>
            {day.date.weekday === 7 && (
              <div>
                <h4>{this.findProperByType(day.propers, 0).text}</h4>
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
      <div id="calendar">
        <nav>
          <a href={`#/${Object.values(this.getLastMonth()).join("/")}/`}>
            Last Month
          </a>
          <h2>
            {this.state.year}-{this.paddNumber(this.state.month)}
          </h2>
          <a href={`#/${Object.values(this.getNextMonth()).join("/")}/`}>
            Next Month
          </a>
        </nav>
        <table>
          <thead>
            <tr>
              <th>Sunday</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>
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
