function padNumber(value) {
  return String(value).padStart(2, "0");
}

export function formatMonthYear(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatLongDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatLongDateNoPadding(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatMonthName(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
  }).format(date);
}

export function formatWeekdayName(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
  }).format(date);
}

export function formatMonthPath(date) {
  return `${date.getFullYear()}/${padNumber(date.getMonth() + 1)}`;
}

export function formatDatePath(date) {
  return `${formatMonthPath(date)}/${padNumber(date.getDate())}`;
}

export function formatDateKey(date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

export function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}
