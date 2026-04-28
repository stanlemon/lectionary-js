function padNumber(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatLongDateNoPadding(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatMonthName(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
  }).format(date);
}

export function formatWeekdayName(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
  }).format(date);
}

export function formatMonthPath(date: Date): string {
  return `${date.getFullYear()}/${padNumber(date.getMonth() + 1)}`;
}

export function formatDatePath(date: Date): string {
  return `${formatMonthPath(date)}/${padNumber(date.getDate())}`;
}

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}
