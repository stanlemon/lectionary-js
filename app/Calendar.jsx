import { DateTime } from "luxon";
import * as React from "react";
import { Link } from "wouter";

import lectionary from "../data/lsb-1yr.json";
import commemorations from "../data/lsb-commemorations.json";
import daily from "../data/lsb-daily.json";
import festivals from "../data/lsb-festivals.json";
import { CalendarBuilder } from "../lib/CalendarBuilder";
import { KeyLoader } from "../lib/KeyLoader";
import { findColor, findProperByType, hasReadings } from "../lib/utils";

const loader = new KeyLoader({ lectionary, festivals, daily, commemorations });

/**
 * @typedef {object} Props
 * @prop {number} year
 * @prop {number} month
 * @extends {Component<Props>}
 */
export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedDay: null };
  }

  componentDidMount() {
    this.build();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.year !== this.props.year ||
      prevProps.month !== this.props.month
    ) {
      this.setState({ selectedDay: null });
    }
  }

  getYearAndMonthLabel({ year, month }) {
    return DateTime.fromObject({ year, month, day: 1 }).toFormat("MMMM y");
  }

  getYearAndMonth() {
    return {
      year: parseInt(this.props.year),
      month: parseInt(this.props.month),
    };
  }

  getNextMonth() {
    const { year, month } = this.getYearAndMonth();

    if (month === 12) {
      return { year: year + 1, month: "01" };
    } else {
      return { year, month: this.padNumber(month + 1) };
    }
  }

  getLastMonth() {
    const { year, month } = this.getYearAndMonth();

    if (month === 1) {
      return { year: year - 1, month: 12 };
    } else {
      return { year, month: this.padNumber(month - 1) };
    }
  }

  padNumber(v) {
    if (v < 10) {
      return `0${v}`;
    } else {
      return `${v}`;
    }
  }

  build() {
    const { year, month } = this.getYearAndMonth();

    window.document.title = `${this.getYearAndMonthLabel({
      year,
      month,
    })} · Lutheran Lectionary`;

    const builder = new CalendarBuilder(year, month);
    return builder.build(loader);
  }

  goToDay(day) {
    return () => {
      window.location.hash = this.makeUrlToDay(day);
    };
  }

  selectDay(day) {
    if (window.innerWidth <= 480) {
      this.setState({ selectedDay: day });
    } else {
      this.goToDay(day.date.day)();
    }
  }

  makeUrlToDay(day) {
    const { year, month } = this.getYearAndMonth();
    return `/${year}/${month}/${day}/`;
  }

  renderDay(day, weekDay) {
    const color =
      findColor(
        // Don't let festivals trump Sundays
        day?.date.weekday === 7 ? null : day?.propers.festivals,
        day?.propers.lectionary,
        day?.sunday?.propers.lectionary
      )?.toLowerCase() ?? "none";
    const isToday =
      day && day.date && DateTime.local().hasSame(day.date, "day");
    const isSelected =
      this.state.selectedDay &&
      day?.date &&
      this.state.selectedDay.date.hasSame(day.date, "day");
    const className =
      `highlight-${color}` +
      (isToday ? " today" : "") +
      (isSelected ? " selected" : "");

    if (!day || !day.date) {
      return <td className={className} key={weekDay} />;
    }

    const isFestivalDay =
      day.date.weekday === 7 ||
      (day.propers.festivals.length > 0 && hasReadings(day.propers.festivals));

    return (
      <td
        className={className}
        onClick={() => this.selectDay(day)}
        key={weekDay}
      >
        <div>
          <h3 className={isFestivalDay ? "festival-day" : undefined}>
            {day.date.day}
          </h3>
          <div className="day-readings">
            {[day.propers.lectionary, day.propers.festivals]
              .filter((p) => p.length > 0 && hasReadings(p))
              .map((propers, i) => (
                <div key={i}>
                  <h4>{findProperByType(propers, 0)?.text}</h4>
                  <div>Old Test: {findProperByType(propers, 19)?.text}</div>
                  <div>Epistle: {findProperByType(propers, 1)?.text}</div>
                  <div>Gospel: {findProperByType(propers, 2)?.text}</div>
                  <br />
                </div>
              ))}
            {findProperByType(day.propers.commemorations, 37) && (
              <h5>{findProperByType(day.propers.commemorations, 37)?.text}</h5>
            )}
            <div>{findProperByType(day.propers.daily, 38)?.text}</div>
            <div>{findProperByType(day.propers.daily, 39)?.text}</div>
          </div>
        </div>
      </td>
    );
  }

  renderDetailPanel() {
    const { selectedDay } = this.state;
    if (!selectedDay) return null;

    const { year, month } = this.getYearAndMonth();
    const { date, propers, sunday } = selectedDay;

    const title =
      findProperByType(propers.festivals, 0)?.text ||
      findProperByType(propers.lectionary, 0)?.text ||
      findProperByType(sunday?.propers.lectionary, 0)?.text;

    const hasLectionary = propers.lectionary.length > 0;
    const hasFestivals =
      propers.festivals.length > 0 && hasReadings(propers.festivals);
    const readingPropers = hasFestivals
      ? propers.festivals
      : hasLectionary
        ? propers.lectionary
        : propers.daily.length > 0
          ? propers.daily
          : (sunday?.propers.lectionary ?? []);

    const ot = findProperByType(readingPropers, 19)?.text;
    const epistle = findProperByType(readingPropers, 1)?.text;
    const gospel = findProperByType(readingPropers, 2)?.text;
    const daily1 = findProperByType(readingPropers, 38)?.text;
    const daily2 = findProperByType(readingPropers, 39)?.text;

    const dateLabel = date.toLocaleString({
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return (
      <div className="day-detail-panel">
        <div className="day-detail-date">{dateLabel}</div>
        <div className="day-detail-title">{title}</div>
        <div className="day-detail-readings">
          {ot && <div>Old Test: {ot}</div>}
          {epistle && <div>Epistle: {epistle}</div>}
          {gospel && <div>Gospel: {gospel}</div>}
          {daily1 && <div>{daily1}</div>}
          {daily2 && <div>{daily2}</div>}
        </div>
        <Link className="day-detail-link" to={`/${year}/${month}/${date.day}/`}>
          View full readings →
        </Link>
      </div>
    );
  }

  render() {
    const { year, month } = this.getYearAndMonth();
    const grid = this.build();

    if (!grid) {
      return <div />;
    }

    return (
      <div id="calendar">
        <nav>
          <Link to={`/${Object.values(this.getLastMonth()).join("/")}/`}>
            &laquo; {this.getYearAndMonthLabel(this.getLastMonth())}
          </Link>
          <h2>
            {this.getYearAndMonthLabel({
              year,
              month,
            })}
          </h2>
          <Link to={`/${Object.values(this.getNextMonth()).join("/")}/`}>
            {this.getYearAndMonthLabel(this.getNextMonth())} &raquo;
          </Link>
        </nav>
        <table>
          <thead>
            <tr>
              <th>Su</th>
              <th>Mo</th>
              <th>Tu</th>
              <th>We</th>
              <th>Th</th>
              <th>Fr</th>
              <th>Sa</th>
            </tr>
          </thead>
          <tbody>
            {grid.map((week) => {
              const firstDay = week.find((d) => d?.date);
              return (
                <tr key={firstDay ? firstDay.date.toISODate() : "empty"}>
                  {week.map((day, weekDay) => this.renderDay(day, weekDay))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.renderDetailPanel()}
      </div>
    );
  }
}
