import { DateTime } from "luxon";
import * as React from "react";
import { Link } from "wouter";

import lectionary from "../data/lsb-1yr.json";
import commemorations from "../data/lsb-commemorations.json";
import daily from "../data/lsb-daily.json";
import festivals from "../data/lsb-festivals.json";
import types from "../data/types.json";
import { KeyLoader } from "../lib/KeyLoader";
import { findColor, findProperByType } from "../lib/utils";
import { Week } from "../lib/Week";

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
    const festivalTitle = findProperByType(day.propers.festivals, 0)?.text;
    const lectionaryTitle = findProperByType(day.propers.lectionary, 0)?.text;
    const sundayTitle = findProperByType(day.sunday.lectionary, 0)?.text;
    const weekdayTitle =
      day.date.weekday === 7
        ? null
        : `${day.date.weekdayLong} of ${sundayTitle}`;
    return festivalTitle || lectionaryTitle || weekdayTitle || sundayTitle;
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
      day.propers.festivals,
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

        {[
          { propers: day.propers.lectionary, id: "lectionary" },
          { propers: day.propers.festivals, id: "festivals" },
          { propers: day.propers.daily, id: "daily" },
        ]
          .filter(({ propers: p }) => p.length > 0)
          .map(({ propers, id }, i) => (
            <React.Fragment key={`propers-toc-${id}`}>
              <h4 className={findColor(propers)?.toLowerCase()}>
                {findProperByType(propers, 0)?.text}
              </h4>
              <ol>
                {propers
                  .filter(
                    (proper) => typesById[proper.type]?.is_viewable ?? true
                  )
                  .map((proper) => (
                    <li key={`propers-toc-${id}-${proper.type}`}>
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
        {[
          { propers: day.propers.lectionary, id: "lectionary" },
          { propers: day.propers.festivals, id: "festivals" },
          { propers: day.propers.daily, id: "daily" },
        ]
          .filter(({ propers: p }) => p.length > 0)
          .map(({ propers, id }, i) => (
            <React.Fragment key={`propers-${id}`}>
              <h2 className={findColor(propers)?.toLowerCase()}>
                {findProperByType(propers, 0)?.text}
              </h2>
              <hr />
              {propers
                .filter((proper) => typesById[proper.type]?.is_viewable ?? true)
                .map((proper) => (
                  <div
                    id={this.getSectionId(i, proper.type)}
                    key={`propers-${id}-${proper.type}`}
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
                      // proper.text contains HTML markup (e.g. <i>, <b>, <br />,
                      // &nbsp;) used to format liturgical texts such as introits,
                      // graduals, and collects. This content comes exclusively from
                      // static JSON files bundled with the app at build time — there
                      // is no user input or external data source involved, so there
                      // is no XSS risk here.
                      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
                      <div dangerouslySetInnerHTML={{ __html: proper.text }} />
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
