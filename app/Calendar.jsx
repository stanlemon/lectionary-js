import * as React from "react";
import { DateTime } from "luxon";
import classNames from "classnames";
import { CalendarBuilder } from "../src/CalendarBuilder";
import { KeyLoader } from "../src/KeyLoader";

import lectionary from "../data/lsb-1yr.json";
import festivals from "../data/lsb-festivals.json";
import daily from "../data/lsb-daily.json";
import commemorations from "../data/lsb-commemorations.json";

const loader = new KeyLoader({ lectionary, festivals, daily, commemorations });

export default class Calendar extends React.Component {
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

  getYearAndMonthLabel({ year, month }) {
    return DateTime.fromObject({ year, month, day: 1 }).toFormat("MMMM y");
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

    window.document.title = `${this.getYearAndMonthLabel({
      year: this.state.year,
      month: this.state.month,
    })} · Sanctus.org`;

    this.setState({
      grid: builder.build(loader.load),
    });
  }

  /** MOVE TO UTILITIES */
  findProperByType(propers, type) {
    return !Array.isArray(propers)
      ? ""
      : propers.filter((p) => p.type === type).shift();
  }

  /** MOVE TO UTILITIES */
  hasReadings(propers) {
    return (
      this.findProperByType(propers, 19) &&
      this.findProperByType(propers, 2) &&
      this.findProperByType(propers, 1)
    );
  }

  /** MOVE TO UTILITIES */
  findColor(day) {
    const festivalColor = this.findProperByType(day?.propers.festivals, 25)
      ?.text;
    const dayColor = this.findProperByType(day?.propers.lectionary, 25)?.text;
    const sundayColor = this.findProperByType(
      day?.sunday?.propers.lectionary,
      25
    )?.text;
    return dayColor || festivalColor || sundayColor;
  }

  renderDay(day, weekDay) {
    const color = this.findColor(day)?.toLowerCase() ?? "none";
    const classes = classNames({
      [`highlight-${color}`]: color,
      today: day && day.date && DateTime.local().hasSame(day.date, "day"),
    });

    return (
      <td className={classes} key={weekDay}>
        {day && day.date && (
          <div>
            <h3>{day.date.day}</h3>
            {[day.propers.lectionary, day.propers.festivals]
              .filter((p) => p.length > 0 && this.hasReadings(p))
              .map((propers, i) => (
                <div key={i}>
                  <h4>{this.findProperByType(propers, 0)?.text}</h4>
                  <div>
                    Old Test: {this.findProperByType(propers, 19)?.text}
                  </div>
                  <div>Epistle: {this.findProperByType(propers, 1)?.text}</div>
                  <div>Gospel: {this.findProperByType(propers, 2)?.text}</div>
                  <br />
                </div>
              ))}
            {this.findProperByType(day.propers.commemorations, 37) && (
              <h5>
                {this.findProperByType(day.propers.commemorations, 37)?.text}
              </h5>
            )}
            <div>{this.findProperByType(day.propers.daily, 38)?.text}</div>
            <div>{this.findProperByType(day.propers.daily, 39)?.text}</div>
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
            &laquo; {this.getYearAndMonthLabel(this.getLastMonth())}
          </a>
          <h2>
            {this.getYearAndMonthLabel({
              year: this.state.year,
              month: this.state.month,
            })}
          </h2>
          <a href={`#/${Object.values(this.getNextMonth()).join("/")}/`}>
            {this.getYearAndMonthLabel(this.getNextMonth())} &raquo;
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
