import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval, format } from "date-fns";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarNote {
  id: string;
  range: DateRange;
  text: string;
  createdAt: Date;
}

export function getCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function isInRange(day: Date, range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  return isWithinInterval(day, { start: range.start, end: range.end });
}

export function isRangeStart(day: Date, range: DateRange): boolean {
  return !!range.start && isSameDay(day, range.start);
}

export function isRangeEnd(day: Date, range: DateRange): boolean {
  return !!range.end && isSameDay(day, range.end);
}

// US holidays (simplified)
const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "07-04": "Independence Day",
  "10-31": "Halloween",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export function getHoliday(day: Date): string | null {
  const key = format(day, "MM-dd");
  return HOLIDAYS[key] ?? null;
}

export function getRangeLabel(range: DateRange): string {
  if (!range.start) return "No dates selected";
  if (!range.end) return format(range.start, "MMM d, yyyy");
  return `${format(range.start, "MMM d")} – ${format(range.end, "MMM d, yyyy")}`;
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_IMAGES: Record<number, string> = {};
