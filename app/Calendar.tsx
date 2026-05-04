import { type KeyboardEvent, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

import {
  CalendarBuilder,
  type CalendarDay as CalendarDayData,
} from "../lib/CalendarBuilder";
import { createLocalDate, isSameDay } from "../lib/date";
import type { Proper, ProperDatasetMap } from "../lib/Loader.js";
import {
  findColor,
  findPropersByType,
  getDisplayPropers,
  getPrecedence,
  hasReadings,
} from "../lib/utils";
import {
  formatDateKey,
  formatLongDateNoPadding,
  formatMonthYear,
} from "./dateFormatting";
import { useLectionary } from "./LectionaryContext";

type MonthLink = {
  year: number;
  month: number | string;
};

type CalendarDayWithPropers = CalendarDayData<ProperDatasetMap>;

type SelectedDayState = {
  monthKey: string;
  dayNumber: number;
};

const weekdayHeaders = [
  { full: "Sunday", short: "Su" },
  { full: "Monday", short: "Mo" },
  { full: "Tuesday", short: "Tu" },
  { full: "Wednesday", short: "We" },
  { full: "Thursday", short: "Th" },
  { full: "Friday", short: "Fr" },
  { full: "Saturday", short: "Sa" },
];

function getYearAndMonthLabel({ year, month }: MonthLink): string {
  return formatMonthYear(createLocalDate(year, month, 1));
}

function padNumber(v: number): string {
  if (v < 10) {
    return `0${v}`;
  } else {
    return `${v}`;
  }
}

function getNextMonth(year: number, month: number): MonthLink {
  if (month === 12) {
    return { year: year + 1, month: "01" };
  } else {
    return { year, month: padNumber(month + 1) };
  }
}

function getLastMonth(year: number, month: number): MonthLink {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  } else {
    return { year, month: padNumber(month - 1) };
  }
}

function getMonthKey(year: number, month: number): string {
  return `${year}-${padNumber(month)}`;
}

function getDayClassName({
  color,
  isToday,
  isSelected,
}: {
  color: string;
  isToday: boolean;
  isSelected: boolean;
}): string {
  return (
    `highlight-${color}` +
    (isToday ? " today" : "") +
    (isSelected ? " selected" : "")
  );
}

function getDayNumberClassName({
  isSunday,
  hasDisplayedPropers,
}: {
  isSunday: boolean;
  hasDisplayedPropers: boolean;
}): string | undefined {
  return (
    [
      isSunday ? "sunday-day" : null,
      hasDisplayedPropers ? "festival-day" : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

function getReadingSection(
  propers: Proper[],
  festivalsPropers: Proper[]
): {
  propers: Proper[];
  id: "festivals" | "lectionary";
} | null {
  if (propers.length === 0) {
    return null;
  }

  return {
    propers,
    id: propers === festivalsPropers ? "festivals" : "lectionary",
  };
}

function CalendarDay({
  day,
  selectedDay,
  onSelectDay,
}: {
  day: CalendarDayWithPropers | null;
  selectedDay: CalendarDayWithPropers | null;
  onSelectDay: (day: CalendarDayWithPropers) => void;
}) {
  const isToday = day?.date
    ? isSameDay(
        createLocalDate(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate()
        ),
        day.date
      )
    : false;
  const isSelected =
    selectedDay?.date && day?.date
      ? isSameDay(selectedDay.date, day.date)
      : false;

  if (!day) {
    return (
      <td
        className={getDayClassName({
          color: "none",
          isToday,
          isSelected,
        })}
      />
    );
  }

  const activeDay = day;
  const displayPropers = getDisplayPropers({
    week: activeDay.week,
    lectionary: activeDay.propers.lectionary,
    festivals: activeDay.propers.festivals,
  });
  const color =
    findColor(
      ...displayPropers,
      activeDay.sunday?.propers.lectionary
    )?.toLowerCase() ?? "none";
  const className = getDayClassName({ color, isToday, isSelected });
  const isSunday = activeDay.date.getDay() === 0;
  const dayNumberClassName = getDayNumberClassName({
    isSunday,
    hasDisplayedPropers: !isSunday && displayPropers.length > 0,
  });
  const readingSections = displayPropers
    .map((propers) => {
      const section = getReadingSection(propers, activeDay.propers.festivals);
      return section
        ? {
            ...section,
            summary: findPropersByType(propers, [0, 19, 1, 2]),
          }
        : null;
    })
    .filter((section) => section !== null);
  const commemorationTitle = findPropersByType(
    activeDay.propers.commemorations,
    [37]
  )[37]?.text;
  const dailyPropers = findPropersByType(activeDay.propers.daily, [38, 39]);

  function handleKeyDown(event: KeyboardEvent<HTMLTableCellElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectDay(activeDay);
    }
  }

  return (
    <td
      className={className}
      onClick={() => onSelectDay(activeDay)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div>
        <h3 className={dayNumberClassName}>{activeDay.date.getDate()}</h3>
        <div className="day-readings">
          {readingSections.map(({ id, summary }) => {
            return (
              <div key={id}>
                <h4>{summary[0]?.text}</h4>
                {summary[19]?.text && <div>Old Test: {summary[19].text}</div>}
                {summary[1]?.text && <div>Epistle: {summary[1].text}</div>}
                {summary[2]?.text && <div>Gospel: {summary[2].text}</div>}
                <br />
              </div>
            );
          })}
          {commemorationTitle && <h5>{commemorationTitle}</h5>}
          <div>{dailyPropers[38]?.text}</div>
          <div>{dailyPropers[39]?.text}</div>
        </div>
      </div>
    </td>
  );
}

function DayDetailPanel({
  selectedDay,
  year,
  month,
}: {
  selectedDay: CalendarDayWithPropers | null;
  year: number;
  month: number;
}) {
  if (!selectedDay) {
    return <div className="day-detail-panel" />;
  }

  const { date, propers, sunday } = selectedDay;
  const { primary, secondary } = getPrecedence({
    week: selectedDay.week,
    lectionary: propers.lectionary,
    festivals: propers.festivals,
  });
  const primaryTitle = findPropersByType(primary, [0])[0]?.text;
  const sundayTitle = findPropersByType(sunday?.propers.lectionary, [0])[0]
    ?.text;
  const title = primaryTitle || sundayTitle;

  const detailSections: {
    key: string;
    label: string | null | undefined;
    propers: Proper[];
  }[] = [];
  const secondarySummary = findPropersByType(secondary, [0, 19, 38]);
  const secondaryTitle =
    typeof secondarySummary[0]?.text === "string"
      ? secondarySummary[0].text
      : undefined;
  const primarySummary = findPropersByType(primary, [0, 19, 38]);

  if (hasReadings(primary)) {
    detailSections.push({
      key: String(
        primarySummary[0]?.text ||
          primarySummary[19]?.text ||
          primarySummary[38]?.text ||
          "primary"
      ),
      label: null,
      propers: primary,
    });
  }

  if (hasReadings(secondary)) {
    detailSections.push({
      key: String(
        secondaryTitle ||
          secondarySummary[19]?.text ||
          secondarySummary[38]?.text ||
          "secondary"
      ),
      label: secondaryTitle,
      propers: secondary,
    });
  }

  if (detailSections.length === 0) {
    const fallbackPropers =
      propers.daily.length > 0
        ? propers.daily
        : (sunday?.propers.lectionary ?? []);
    const fallbackSummary = findPropersByType(fallbackPropers, [38, 19]);
    detailSections.push({
      key: String(
        fallbackSummary[38]?.text || fallbackSummary[19]?.text || "fallback"
      ),
      label: null,
      propers: fallbackPropers,
    });
  }

  const dateLabel = formatLongDateNoPadding(date);

  return (
    <div className="day-detail-panel">
      <div className="day-detail-date">{dateLabel}</div>
      <div className="day-detail-title">{title}</div>
      <div className="day-detail-readings">
        {detailSections.map(({ key, label, propers: section }, index) => {
          const sectionPropers = findPropersByType(section, [19, 1, 2, 38, 39]);
          const ot = sectionPropers[19]?.text;
          const epistle = sectionPropers[1]?.text;
          const gospel = sectionPropers[2]?.text;
          const daily1 = sectionPropers[38]?.text;
          const daily2 = sectionPropers[39]?.text;

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
      <Link
        className="day-detail-link"
        to={`/${year}/${month}/${date.getDate()}/`}
      >
        View full readings →
      </Link>
    </div>
  );
}

export default function Calendar({
  year: yearProp,
  month: monthProp,
}: {
  year: number | string;
  month: number | string;
}) {
  const year = parseInt(String(yearProp), 10);
  const month = parseInt(String(monthProp), 10);
  const monthKey = getMonthKey(year, month);
  const [selectedDayState, setSelectedDayState] =
    useState<SelectedDayState | null>(null);
  const { loader } = useLectionary();

  const grid = useMemo(() => {
    const builder = new CalendarBuilder(year, month);
    return builder.build(loader);
  }, [year, month, loader]);

  const selectedDay =
    selectedDayState?.monthKey === monthKey
      ? (grid
          .flat()
          .find((d) => d?.date?.getDate() === selectedDayState.dayNumber) ??
        null)
      : null;
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

  function selectDay(day: CalendarDayWithPropers) {
    if (window.innerWidth <= 480) {
      setSelectedDayState({ monthKey, dayNumber: day.date.getDate() });
    } else {
      window.location.hash = `/${year}/${month}/${day.date.getDate()}/`;
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
              <tr key={firstDay ? formatDateKey(firstDay.date) : "empty"}>
                {week.map((day, weekDay) => (
                  <CalendarDay
                    day={day}
                    key={
                      day?.date ? formatDateKey(day.date) : `empty-${weekDay}`
                    }
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
