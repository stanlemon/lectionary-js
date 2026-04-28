import { Fragment, useEffect } from "react";
import { Link } from "wouter";

import types from "../data/types.json";
import { createLocalDate } from "../lib/date";
import type { Proper, ProperDatasetMap } from "../lib/Loader.js";
import { findColor, findProperByType, getPrecedence } from "../lib/utils";
import { Week } from "../lib/Week";
import {
  addDays,
  formatDatePath,
  formatLongDate,
  formatLongDateNoPadding,
  formatMonthName,
  formatMonthPath,
  formatWeekdayName,
} from "./dateFormatting";
import { useLectionary } from "./LectionaryContext";

type ProperType = {
  type: number;
  name: string;
  is_reading: boolean;
  is_viewable?: boolean;
};

type DayPropers = ProperDatasetMap & {
  lectionary: Proper[];
  festivals: Proper[];
  daily: Proper[];
  commemorations: Proper[];
};

type LoadedDay = {
  date: Date;
  week: number | null;
  propers: DayPropers;
  sunday: DayPropers;
};

type ProperSection = {
  propers: Proper[];
  id: string;
};

const typesById: Record<number, ProperType> = {};
types.forEach((type) => {
  typesById[type.type] = type as ProperType;
});

function getSectionId(i: number, type: number): string {
  return `proper_${i}_${typesById[type].name.toLowerCase().replace(" ", "_")}`;
}

function getAccordanceUrl(text: string): string {
  const end = text.indexOf("-") === -1 ? text.length : text.indexOf("-");
  const passage = text.replace(" ", "_").substring(0, end);
  return `accord://read/?#${passage}`;
}

function handleScrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function StaticProperText({ html }: { html: string }) {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: bundled static liturgical text includes safe markup.
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function getTitle(day: LoadedDay): string | undefined {
  const { primary } = getPrecedence({
    week: day.week,
    lectionary: day.propers.lectionary,
    festivals: day.propers.festivals,
  });
  const rawPrimaryTitle = findProperByType(primary, 0)?.text;
  const rawSundayTitle = findProperByType(day.sunday.lectionary, 0)?.text;
  const primaryTitle =
    typeof rawPrimaryTitle === "string" ? rawPrimaryTitle : undefined;
  const sundayTitle =
    typeof rawSundayTitle === "string" ? rawSundayTitle : undefined;
  const weekdayTitle =
    day.date.getDay() === 0
      ? null
      : `${formatWeekdayName(day.date)} of ${sundayTitle}`;
  return primaryTitle || weekdayTitle || sundayTitle;
}

function scrollToSection(i: number, type: number) {
  return () => {
    const section = document.getElementById(getSectionId(i, type));
    if (!section) {
      return;
    }
    window.scrollTo({
      top: section.offsetTop - 60,
      behavior: "smooth",
    });
  };
}

function getSection(
  propers: Proper[],
  festivalsPropers: Proper[]
): ProperSection | null {
  if (propers.length === 0) {
    return null;
  }

  return {
    propers,
    id: propers === festivalsPropers ? "festivals" : "lectionary",
  };
}

function isProperSection(
  section: ProperSection | null
): section is ProperSection {
  return section !== null;
}

export default function Day({
  year,
  month,
  day: dayProp,
}: {
  year: number | string;
  month: number | string;
  day: number | string;
}) {
  const { loader } = useLectionary();
  const date = createLocalDate(year, month, dayProp);
  const yesterday = addDays(date, -1);
  const tomorrow = addDays(date, 1);
  const weekCalculator = new Week(date);
  const week = weekCalculator.getWeek();
  const sunday = weekCalculator.getSunday();

  const day: LoadedDay = {
    date,
    week,
    propers: loader.load(date, week) as DayPropers,
    sunday: loader.load(sunday, week) as DayPropers,
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

  const title = getTitle(day);
  const { primary, secondary } = getPrecedence({
    week,
    lectionary: day.propers.lectionary,
    festivals: day.propers.festivals,
  });
  const colorName = findColor(primary, secondary, day.sunday.lectionary);
  const colorClassName = colorName?.toLowerCase();

  useEffect(() => {
    document.title = `${title} · Lutheran Lectionary`;
  }, [title]);

  const propersSections = [
    getSection(primary, day.propers.festivals),
    getSection(secondary, day.propers.festivals),
    { propers: day.propers.daily, id: "daily" },
  ]
    .filter(isProperSection)
    .filter((section) => section.propers.length > 0);

  return (
    <div className="propers">
      <nav>
        <Link to={`/${formatDatePath(yesterday)}/`}>
          &laquo; {formatLongDateNoPadding(yesterday)}
        </Link>
        <Link className="text-center" to={`/${formatMonthPath(date)}/`}>
          {formatMonthName(date)}
        </Link>
        <Link to={`/${formatDatePath(tomorrow)}/`}>
          {formatLongDateNoPadding(tomorrow)} &raquo;
        </Link>
      </nav>

      <br />

      <div className="day-date-row">
        <h2 className={colorClassName}>{formatLongDate(date)}</h2>
        {colorName && (
          <span className={`parament-pill parament-pill-${colorClassName}`}>
            {colorName}
          </span>
        )}
      </div>
      <h3 className={colorClassName}>{title}</h3>

      <br />

      {propersSections.map(({ propers, id }, i) => (
        <Fragment key={`propers-toc-${id}`}>
          <h4 className={findColor(propers)?.toLowerCase()}>
            {findProperByType(propers, 0)?.text}
          </h4>
          <ol>
            {propers
              .filter((proper) => typesById[proper.type]?.is_viewable ?? true)
              .map((proper) => (
                <li key={`propers-toc-${id}-${proper.type}`}>
                  <button
                    type="button"
                    className="link"
                    onClick={scrollToSection(i, proper.type)}
                  >
                    {typesById[proper.type].name}
                    {typesById[proper.type].is_reading && <>: {proper.text}</>}
                  </button>
                </li>
              ))}
          </ol>
        </Fragment>
      ))}
      <br />
      {propersSections.map(({ propers, id }, i) => (
        <Fragment key={`propers-${id}`}>
          <h2 className={findColor(propers)?.toLowerCase()}>
            {findProperByType(propers, 0)?.text}
          </h2>
          <hr />
          {propers
            .filter((proper) => typesById[proper.type]?.is_viewable ?? true)
            .map((proper) => (
              <div
                id={getSectionId(i, proper.type)}
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
                        href={getAccordanceUrl(String(proper.text))}
                      >
                        <i className="accordance-icon" />
                      </a>
                    </>
                  )}
                </h3>
                {!typesById[proper.type].is_reading && (
                  // proper.text contains HTML markup (e.g. <i>, <b>, <br />)
                  // from bundled static JSON files, not user input.
                  <StaticProperText html={String(proper.text)} />
                )}
                <div className="text-right">
                  <button
                    type="button"
                    className="link"
                    onClick={handleScrollToTop}
                  >
                    top
                  </button>
                </div>
                <hr />
              </div>
            ))}
          <br />
        </Fragment>
      ))}
    </div>
  );
}
