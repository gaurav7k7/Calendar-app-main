import { isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "../lib/utils";
import {type DateRange, getCalendarDays, isInRange, isRangeStart, isRangeEnd, getHoliday, WEEKDAYS } from "@/lib/calendar-utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";

interface CalendarGridProps {
  currentMonth: Date;
  range: DateRange;
  onDayClick: (day: Date) => void;
  onDayHover?: (day: Date) => void;
  hoverDate: Date | null;
}

export function CalendarGrid({ currentMonth, range, onDayClick, onDayHover, hoverDate }: CalendarGridProps) {
  const days = getCalendarDays(currentMonth);

  const getPreviewRange = (): DateRange => {
    if (range.start && !range.end && hoverDate) {
      const start = range.start < hoverDate ? range.start : hoverDate;
      const end = range.start < hoverDate ? hoverDate : range.start;
      return { start, end };
    }
    return range;
  };

  const previewRange = getPreviewRange();

  return (
    <div className="select-none">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-body font-medium tracking-widest uppercase text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const holiday = getHoliday(day);
          const inRange = isInRange(day, previewRange);
          const isStart = isRangeStart(day, previewRange);
          const isEnd = isRangeEnd(day, previewRange);
          const isSelected = isStart || isEnd;
          const isOnlyStart = range.start && !range.end && isSameDay(day, range.start);

          const dayContent = (
            <button
              onClick={() => onDayClick(day)}
              onMouseEnter={() => onDayHover?.(day)}
              className={cn(
                "relative w-full aspect-square flex flex-col items-center justify-center text-sm font-body transition-colors duration-150 cursor-pointer",
                !inMonth && "opacity-25 pointer-events-none",
                inMonth && !isSelected && !inRange && "hover:bg-primary",
                inRange && !isSelected && "bg-range-mid",
                isSelected && "bg-primary text-primary-foreground",
                isStart && !isOnlyStart && "rounded-l-full",
                isEnd && "rounded-r-full",
                isOnlyStart && "rounded-full",
                inRange && !isStart && !isEnd && "rounded-none bg-primary/10",
                today && !isSelected && "font-semibold text-primary",
              )}
            >
              <span className="relative z-10">{day.getDate()}</span>
              {holiday && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );

          if (holiday && inMonth) {
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>{dayContent}</TooltipTrigger>
                <TooltipContent side="top" className="text-xs font-body">
                  {holiday}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={i}>{dayContent}</div>;
        })}
      </div>
    </div>
  );
}
