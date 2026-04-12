import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link } from "wouter";

import lectionary from "../data/lsb-1yr.json";
import commemorations from "../data/lsb-commemorations.json";
import daily from "../data/lsb-daily.json";
import festivals from "../data/lsb-festivals.json";
import { CalendarBuilder } from "../lib/CalendarBuilder";
import { KeyLoader } from "../lib/KeyLoader";
import {
  findColor,
  findProperByType,
  getPrecedence,
  hasReadings,
} from "../lib/utils";

const loader = new KeyLoader({ lectionary, festivals, daily, commemorations });
const weekdayHeaders = [
  { full: "Sunday", short: "Su" },
  { full: "Monday", short: "Mo" },
  { full: "Tuesday", short: "Tu" },
  { full: "Wednesday", short: "We" },
  { full: "Thursday", short: "Th" },
  { full: "Friday", short: "Fr" },
  { full: "Saturday", short: "Sa" },
];

function getYearAndMonthLabel({ year, month }) {
  return DateTime.fromObject({ year, month, day: 1 }).toFormat("MMMM y");
}

function padNumber(v) {
  if (v < 10) {
    return `0${v}`;
  } else {
    return `${v}`;
  }
}

function getNextMonth(year, month) {
  if (month === 12) {
    return { year: year + 1, month: "01" };
  } else {
    return { year, month: padNumber(month + 1) };
  }
}

function getLastMonth(year, month) {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  } else {
    return { year, month: padNumber(month - 1) };
  }
}

function getMonthKey(year, month) {
  return `${year}-${padNumber(month)}`;
}

function getDayClassName(day, selectedDay) {
  const { primary, secondary } = getPrecedence({
    week: day?.week,
    lectionary: day?.propers.lectionary,
    festivals: day?.propers.festivals,
  });
  const color =
    findColor(
      primary,
      secondary,
      day?.sunday?.propers.lectionary
    )?.toLowerCase() ?? "none";
  const isToday = day?.date ? DateTime.local().hasSame(day.date, "day") : false;
  const isSelected =
    selectedDay?.date && day?.date
      ? selectedDay.date.hasSame(day.date, "day")
      : false;

  return (
    `highlight-${color}` +
    (isToday ? " today" : "") +
    (isSelected ? " selected" : "")
  );
}

function getDayNumberClassName(day) {
  const isSunday = day.date.weekday === 7;
  const hasFestivalPropers =
    day.propers.festivals.length > 0 ||
    (!isSunday && day.propers.lectionary.length > 0);

  return (
    [isSunday ? "sunday-day" : null, hasFestivalPropers ? "festival-day" : null]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

function getReadingSection(propers, festivalsPropers) {
  if (propers.length === 0) {
    return null;
  }

  return {
    propers,
    id: propers === festivalsPropers ? "festivals" : "lectionary",
  };
}

function CalendarDay({ day, selectedDay, onSelectDay }) {
  const className = getDayClassName(day, selectedDay);

  if (!day?.date) {
    return <td className={className} />;
  }

  const { primary, secondary } = getPrecedence({
    week: day.week,
    lectionary: day.propers.lectionary,
    festivals: day.propers.festivals,
  });
  const readingSections = [
    getReadingSection(primary, day.propers.festivals),
    getReadingSection(secondary, day.propers.festivals),
  ].filter((section) => section && hasReadings(section.propers));

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectDay(day);
    }
  }

  return (
    <td
      className={className}
      onClick={() => onSelectDay(day)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div>
        <h3 className={getDayNumberClassName(day)}>{day.date.day}</h3>
        <div className="day-readings">
          {readingSections.map(({ propers, id }) => (
            <div key={id}>
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

function DayDetailPanel({ selectedDay, year, month }) {
  if (!selectedDay) {
    return <div className="day-detail-panel" />;
  }

  const { date, propers, sunday } = selectedDay;
  const { primary, secondary } = getPrecedence({
    week: selectedDay.week,
    lectionary: propers.lectionary,
    festivals: propers.festivals,
  });
  const title =
    findProperByType(primary, 0)?.text ||
    findProperByType(sunday?.propers.lectionary, 0)?.text;

  const detailSections = [];
  const secondaryTitle = findProperByType(secondary, 0)?.text;

  if (hasReadings(primary)) {
    detailSections.push({
      key:
        findProperByType(primary, 0)?.text ||
        findProperByType(primary, 19)?.text ||
        findProperByType(primary, 38)?.text,
      label: null,
      propers: primary,
    });
  }

  if (hasReadings(secondary)) {
    detailSections.push({
      key:
        secondaryTitle ||
        findProperByType(secondary, 19)?.text ||
        findProperByType(secondary, 38)?.text,
      label: secondaryTitle,
      propers: secondary,
    });
  }

  if (detailSections.length === 0) {
    const fallbackPropers =
      propers.daily.length > 0
        ? propers.daily
        : (sunday?.propers.lectionary ?? []);
    detailSections.push({
      key:
        findProperByType(fallbackPropers, 38)?.text ||
        findProperByType(fallbackPropers, 19)?.text ||
        "fallback",
      label: null,
      propers: fallbackPropers,
    });
  }

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
        {detailSections.map(({ key, label, propers: section }, index) => {
          const ot = findProperByType(section, 19)?.text;
          const epistle = findProperByType(section, 1)?.text;
          const gospel = findProperByType(section, 2)?.text;
          const daily1 = findProperByType(section, 38)?.text;
          const daily2 = findProperByType(section, 39)?.text;

          return (
            <div key={key}>
              {index > 0 && <br />}
              {label && <div className="day-detail-title">{label}</div>}
              {ot && <div>Old Test: {ot}</div>}
              {epistle && <div>Epistle: {epistle}</div>}
              {gospel && <div>Gospel: {gospel}</div>}
              {daily1 && <div>{daily1}</div>}
              {daily2 && <div>{daily2}</div>}
            </div>
          );
        })}
      </div>
      <Link className="day-detail-link" to={`/${year}/${month}/${date.day}/`}>
        View full readings →
      </Link>
    </div>
  );
}

export default function Calendar({ year: yearProp, month: monthProp }) {
  const year = parseInt(yearProp, 10);
  const month = parseInt(monthProp, 10);
  const monthKey = getMonthKey(year, month);
  const [selectedDayState, setSelectedDayState] = useState(null);

  const selectedDay =
    selectedDayState?.monthKey === monthKey ? selectedDayState.day : null;
  const builder = new CalendarBuilder(year, month);
  const grid = builder.build(loader);
  const previousMonth = getLastMonth(year, month);
  const nextMonth = getNextMonth(year, month);

  useEffect(() => {
    document.title = `${getYearAndMonthLabel({ year, month })} · Lutheran Lectionary`;
  }, [year, month]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 480) {
        setSelectedDayState(null);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function selectDay(day) {
    if (window.innerWidth <= 480) {
      setSelectedDayState({ monthKey, day });
    } else {
      window.location.hash = `/${year}/${month}/${day.date.day}/`;
    }
  }

  if (!grid) {
    return <div />;
  }

  return (
    <div id="calendar">
      <nav>
        <Link to={`/${Object.values(previousMonth).join("/")}/`}>
          &laquo; {getYearAndMonthLabel(previousMonth)}
        </Link>
        <h2>{getYearAndMonthLabel({ year, month })}</h2>
        <Link to={`/${Object.values(nextMonth).join("/")}/`}>
          {getYearAndMonthLabel(nextMonth)} &raquo;
        </Link>
      </nav>
      <table>
        <thead>
          <tr>
            {weekdayHeaders.map(({ full, short }) => (
              <th key={full}>
                <span className="weekday-label-full">{full}</span>
                <span className="weekday-label-short">{short}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((week) => {
            const firstDay = week.find((d) => d?.date);
            return (
              <tr key={firstDay ? firstDay.date.toISODate() : "empty"}>
                {week.map((day, weekDay) => (
                  <CalendarDay
                    day={day}
                    key={day?.date?.toISODate() ?? `empty-${weekDay}`}
                    onSelectDay={selectDay}
                    selectedDay={selectedDay}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <DayDetailPanel month={month} selectedDay={selectedDay} year={year} />
    </div>
  );
}
