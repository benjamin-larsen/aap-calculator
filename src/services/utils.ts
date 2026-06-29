import BigNumber from "bignumber.js";
import { Day } from "./types";

export function fromPercentage(value: string): BigNumber {
  if (!/\d{1,3}(?:\.\d+)?%/.test(value)) throw Error("Invalid percentange");

  const num = new BigNumber(value.slice(0, -1));

  return num.dividedBy(100);
}

export function filterWeekdays(startingDay: Day, days: number) {
  /*
    Count days manually until we get to next week (Monday)
    Remove from days used in rest of calculaton and increment firstWeek manually if it's a weekday.
  */

  let firstWeek = 0;

  for (var i = 0; days > 0; i++) {
    const day: Day = (i + startingDay) % 7;

    if (day === Day.Monday) break;
    if (day !== Day.Saturday && day !== Day.Sunday) firstWeek++;

    days--;
  }

  // Calculate from first Monday

  const daysBig = new BigNumber(days);

  const weeks = daysBig.dividedToIntegerBy(7);
  const lastWeek = daysBig.modulo(7);

  return weeks.multipliedBy(5).plus(firstWeek).plus(BigNumber.min(lastWeek, 5));
}

// Filters a string with only numbers and removes leading zeros.
export function formatNumber(value: string): string {
  return (value.replace(/[^\d]/g, "").replace(/^0+/, "") || "0");
}

export function seperateNumber(value: string): string {
  return value.replace(/(\d)(?=(?:\d{3})+\b)/gm, "$1 ");
}

export function formatMoney(value: string) {
  return seperateNumber(formatNumber(value)) + " kr";
}

function normalizeDate(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

export type DateRange = [Date, Date];

// Returns it so that the first is lowest.
function normalizeDateRange(range: DateRange): DateRange {
  const first = normalizeDate(range[0]);
  const second = normalizeDate(range[1]);

  if (first.valueOf() <= second.valueOf()) {
    return [first, second];
  } else {
    return [second, first];
  }
}

export function rangeWithinOther(range: DateRange, other: DateRange) {
  const [rangeStart, rangeEnd] = normalizeDateRange(range);
  const [otherStart, otherEnd] = normalizeDateRange(other);

  if (rangeStart.valueOf() < otherStart.valueOf()) return false;
  if (rangeEnd.valueOf() > otherEnd.valueOf()) return false;

  return true;
}

export function rangeOverlapsRange(range: DateRange, other: DateRange) {
  const [rangeStart, rangeEnd] = normalizeDateRange(range);
  const [otherStart, otherEnd] = normalizeDateRange(other);

  if (rangeStart.valueOf() > otherEnd.valueOf()) return false;
  if (otherStart.valueOf() > rangeEnd.valueOf()) return false;

  return true;
}

export function isDateRange(arr: unknown[]): arr is DateRange {
  if (arr.length !== 2) return false;

  return arr.every(i => i instanceof Date);
}

const monthNames = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember"
];

export function formatDate(date: Date) {
  return `${date.getDate()}. ${monthNames[date.getMonth()]}, ${date.getFullYear()}`
}

export function formatDateRange(range: DateRange) {
  const [start, end] = normalizeDateRange(range);

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate()} - ${end.getDate()}. ${monthNames[end.getMonth()]}, ${end.getFullYear()}`
  } else if (sameYear) {
    return `${start.getDate()}. ${monthNames[start.getMonth()]} - ${end.getDate()}. ${monthNames[end.getMonth()]}, ${end.getFullYear()}`
  } else {
    return `${formatDate(start)} - ${formatDate(end)}`
  }
}

const DAY_MS = 1000 * 60 * 60 * 24;

export function diffDays(start: Date, end: Date) {
  const startingDay = (start.getDay() + 6) % 7;
  const days = Math.floor(Math.abs(normalizeDate(end).valueOf() - normalizeDate(start).valueOf()) / DAY_MS) + 1;

  return {
    startingDay,
    days
  };
}