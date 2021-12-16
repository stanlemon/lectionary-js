import * as React from "react";
import { DateTime } from "luxon";
import { Link } from "wouter";

import { Week } from "../lib/Week";
import { KeyLoader } from "../lib/KeyLoader";
import { findProperByType, findColor } from "../lib/utils";

import lectionary from "../data/lsb-1yr.json";
import festivals from "../data/lsb-festivals.json";
import daily from "../data/lsb-daily.json";
import commemorations from "../data/lsb-commemorations.json";

import types from "../data/types.json";

const typesById = {};
types.forEach((type) => {
  typesById[type.type] = type;
});

const loader = new KeyLoader({
  lectionary,
  festivals,
  daily,
  commemorations,
});

/**
 * @typedef {object} Props
 * @prop {number} year
 * @prop {number} month
 * @prop {number} day
 * @extends {Component<Props>}
 */
export default class Day extends React.Component {
  getDate() {
    const { year, month, day } = this.props;
    return DateTime.fromObject({ year, month, day });
  }

  getTitle(day) {
    const festivalTitle = findProperByType(day.propers.festival, 0)?.text;
    const sundayTitle = findProperByType(day.sunday.lectionary, 0)?.text;
    const weekdayTitle =
      day.date.weekday === 7
        ? null
        : `${day.date.weekdayLong} of ${sundayTitle}`;
    return festivalTitle || weekdayTitle || sundayTitle;
  }

  getSectionId(i, type) {
    return `proper_${i}_${typesById[type].name
      .toLowerCase()
      .replace(" ", "_")}`;
  }

  getAccordanceUrl(text) {
    const end = text.indexOf("-") === -1 ? text.length : text.indexOf("-");
    const passage = text.replace(" ", "_").substring(0, end);
    return `accord://read/?#${passage}`;
  }

  scrollToSection(i, type) {
    return () => {
      window.scrollTo({
        top: document.getElementById(this.getSectionId(i, type)).offsetTop - 60,
        behavior: "smooth",
      });
    };
  }

  handleScrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const date = this.getDate();
    const yesterday = this.getDate().minus({ days: 1 });
    const tomorrow = this.getDate().plus({ days: 1 });
    const weekCalculator = new Week(date);
    const week = weekCalculator.getWeek();
    const sunday = weekCalculator.getSunday();

    const day = {
      date,
      week,
      propers: loader.load(date, week),
      sunday: loader.load(sunday, week),
    };

    day.propers.daily = [
      // Find our commemoration and prepend it to the daily lectionary propers
      {
        ...(findProperByType(day.propers.commemorations, 37) ?? {
          text: "Daily Lectionary",
        }),
        type: 0, // Reset commemoration description to title
      },
      // Only include the first two daily readings (week takes precedent over month)
      ...day.propers.daily.slice(0, 2),
    ];

    // If this is a week day and we have no other propers, append Sunday's collect
    if (
      day.propers.lectionary.length === 0 &&
      day.propers.festivals.length === 0
    ) {
      const sundayCollect = findProperByType(day.sunday.lectionary, 20);

      // TODO: Adjust the title
      if (sundayCollect) {
        day.propers.daily.splice(1, 0, sundayCollect);
      }
    }

    const title = this.getTitle(day);
    const color = findColor(
      day.propers.festival,
      day.propers.lectionary,
      day.sunday.lectionary
    )?.toLowerCase();

    document.title = `${title} · Lutheran Lectionary`;

    return (
      <div className="propers">
        <nav>
          <Link to={`/${yesterday.toFormat("y/LL/dd")}/`}>
            &laquo; {yesterday.toFormat("LLLL d, y")}
          </Link>
          <Link className="text-center" to={`/${date.toFormat("y/LL")}/`}>
            {date.toFormat("LLLL")}
          </Link>
          <Link to={`/${tomorrow.toFormat("y/LL/dd")}/`}>
            {tomorrow.toFormat("LLLL d, y")} &raquo;
          </Link>
        </nav>

        <br />

        <h2 className={color}>
          {date.toLocaleString({
            // weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
        </h2>
        <h3 className={color}>{title}</h3>

        <br />

        {[day.propers.lectionary, day.propers.festivals, day.propers.daily]
          .filter((p) => p.length > 0)
          .map((propers, i) => (
            <React.Fragment key={`propers-toc-${i}`}>
              <h4 className={findColor(propers)?.toLowerCase()}>
                {findProperByType(propers, 0)?.text}
              </h4>
              <ol>
                {propers
                  .filter(
                    (proper) => typesById[proper.type]?.is_viewable ?? true
                  )
                  .map((proper, j) => (
                    <li key={`propers-toc-${i}-${j}`}>
                      <button
                        className="link"
                        onClick={this.scrollToSection(i, proper.type)}
                      >
                        {typesById[proper.type].name}
                        {typesById[proper.type].is_reading && (
                          <>: {proper.text}</>
                        )}
                      </button>
                    </li>
                  ))}
              </ol>
            </React.Fragment>
          ))}
        <br />
        {[day.propers.lectionary, day.propers.festivals, day.propers.daily]
          .filter((p) => p.length > 0)
          .map((propers, i) => (
            <React.Fragment key={`propers-${i}`}>
              <h2 className={findColor(propers)?.toLowerCase()}>
                {findProperByType(propers, 0)?.text}
              </h2>
              <hr />
              {propers
                .filter((proper) => typesById[proper.type]?.is_viewable ?? true)
                .map((proper, j) => (
                  <div
                    id={this.getSectionId(i, proper.type)}
                    key={`propers-${i}-${j}`}
                  >
                    <h3>
                      {typesById[proper.type].name}

                      {typesById[proper.type].is_reading && (
                        <>
                          &nbsp;&middot;&nbsp;
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://www.biblegateway.com/passage/?search=${proper.text}&version=ESV`}
                          >
                            {proper.text}
                          </a>
                          &nbsp;
                          <a
                            title="Open this reading using Accordance, if you don't have it check it out at http://accordancebible.com"
                            href={this.getAccordanceUrl(proper.text)}
                          >
                            <i className="accordance-icon" />
                          </a>
                        </>
                      )}
                    </h3>
                    {!typesById[proper.type].is_reading && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: proper.text,
                        }}
                      />
                    )}
                    <div className="text-right">
                      <button className="link" onClick={this.handleScrollToTop}>
                        top
                      </button>
                    </div>
                    <hr />
                  </div>
                ))}
              <br />
            </React.Fragment>
          ))}
      </div>
    );
  }
}
