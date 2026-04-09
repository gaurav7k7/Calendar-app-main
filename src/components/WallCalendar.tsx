import { useState, useCallback } from "react";
import { addMonths, subMonths, format, isBefore, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { CalendarGrid } from "@/components/CalendarGrid";
import { NotesPanel } from "@/components/NotesPanel";
import type { DateRange, CalendarNote } from "@/lib/calendar-utils";

import month01 from "@/assets/months/month-01.jpg";
import month02 from "@/assets/months/month-02.jpg";
import month03 from "@/assets/months/month-03.jpg";
import month04 from "@/assets/months/month-04.jpg";
import month05 from "@/assets/months/month-05.jpg";
import month06 from "@/assets/months/month-06.jpg";
import month07 from "@/assets/months/month-07.jpg";
import month08 from "@/assets/months/month-08.jpg";
import month09 from "@/assets/months/month-09.jpg";
import month10 from "@/assets/months/month-10.jpg";
import month11 from "@/assets/months/month-11.jpg";
import month12 from "@/assets/months/month-12.jpg";

const MONTH_IMAGES: Record<number, string> = {
  0: month01, 1: month02, 2: month03, 3: month04,
  4: month05, 5: month06, 6: month07, 7: month08,
  8: month09, 9: month10, 10: month11, 11: month12,
};

function loadNotes(): CalendarNote[] {
  try {
    const raw = localStorage.getItem("calendar-notes");
    if (!raw) return [];
    return JSON.parse(raw, (key, value) => {
      if (key === "start" || key === "end" || key === "createdAt") {
        return value ? new Date(value) : null;
      }
      return value;
    });
  } catch { return []; }
}

function saveNotes(notes: CalendarNote[]) {
  localStorage.setItem("calendar-notes", JSON.stringify(notes));
}

export default function WallCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<CalendarNote[]>(loadNotes);
  const [direction, setDirection] = useState(0);
  const { theme, setTheme } = useTheme();

  const handlePrev = () => { setDirection(-1); setCurrentMonth((m) => subMonths(m, 1)); };
  const handleNext = () => { setDirection(1); setCurrentMonth((m) => addMonths(m, 1)); };

  const handleDayClick = useCallback((day: Date) => {
    setRange((prev) => {
      if (!prev.start || prev.end) return { start: day, end: null };
      if (isSameDay(day, prev.start)) return { start: null, end: null };
      const [s, e] = isBefore(day, prev.start) ? [day, prev.start] : [prev.start, day];
      return { start: s, end: e };
    });
  }, []);

  const handleAddNote = useCallback((text: string) => {
    const note: CalendarNote = {
      id: crypto.randomUUID(),
      range: { ...range },
      text,
      createdAt: new Date(),
    };
    setNotes((prev) => {
      const next = [note, ...prev];
      saveNotes(next);
      return next;
    });
  }, [range]);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      saveNotes(next);
      return next;
    });
  }, []);

  const monthYear = format(currentMonth, "MMMM yyyy");
  const monthKey = format(currentMonth, "yyyy-MM");
  const heroImage = MONTH_IMAGES[currentMonth.getMonth()];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4 md:p-8 lg:p-12 bg-background transition-colors duration-300">
      <div className="w-full max-w-4xl">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2.5 rounded-full bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 text-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="w-4 h-4 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2.5 left-2.5 w-4 h-4 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          </button>
        </div>

        {/* Wall Calendar */}
        <div className="relative pt-10">
          {/* Hanging hook/nail */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/40 shadow-md" />
            <div className="w-px h-4 bg-muted-foreground/30 mx-auto" />
          </div>

          {/* Hanging hole in calendar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/20 bg-background shadow-inner" />
          </div>

          {/* Spiral binding — realistic coils */}
          <div className="relative z-10 flex justify-center">
            <div className="flex gap-[14px] md:gap-[18px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="relative w-[10px] h-[20px]">
                  {/* Wire coil — two halves creating a spiral look */}
                  <div className="absolute inset-0 rounded-full border-[1.5px] border-foreground/25 bg-gradient-to-b from-foreground/10 to-transparent" />
                  {/* Highlight on wire */}
                  <div className="absolute top-[2px] left-[2px] w-[4px] h-[4px] rounded-full bg-foreground/5" />
                </div>
              ))}
            </div>
          </div>

          {/* Calendar body with paper shadow */}
          <div
            className="relative bg-card rounded-b-lg overflow-hidden border border-border -mt-[10px]"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.1), 4px 4px 0 0 rgba(0,0,0,0.02)",
            }}
          >
            {/* Hero Image with month overlay */}
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={monthKey + "-img"}
                  src={heroImage}
                  alt={`${monthYear} landscape`}
                  width={1024}
                  height={640}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {/* Year + Month badge — bottom-right like reference */}
              <div className="absolute bottom-0 right-0 p-4 md:p-6">
                <div className="bg-primary/90 backdrop-blur-sm rounded-lg px-4 py-2 md:px-6 md:py-3 text-right">
                  <p className="font-body text-[10px] md:text-xs text-primary-foreground/80 tracking-[0.3em] uppercase">
                    {format(currentMonth, "yyyy")}
                  </p>
                  <h1 className="font-display text-lg md:text-2xl font-bold text-primary-foreground tracking-wide">
                    {format(currentMonth, "MMMM").toUpperCase()}
                  </h1>
                </div>
              </div>
            </div>

            {/* Navigation bar */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card">
              <button
                onClick={handlePrev}
                className="p-2 rounded-md hover:bg-secondary transition-colors text-foreground"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-display text-lg font-semibold text-foreground tracking-wide">
                {monthYear}
              </span>
              <button
                onClick={handleNext}
                className="p-2 rounded-md hover:bg-secondary transition-colors text-foreground"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Grid + Notes */}
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-4 md:p-6 lg:border-r lg:border-border min-w-0">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={monthKey}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <CalendarGrid
                      currentMonth={currentMonth}
                      range={range}
                      onDayClick={handleDayClick}
                      onDayHover={setHoverDate}
                      hoverDate={hoverDate}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="lg:w-72 xl:w-80 p-4 md:p-6 border-t lg:border-t-0 border-border">
                <NotesPanel
                  notes={notes}
                  range={range}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground/50 font-body mt-6">
          Click a date to start a range · Click again to complete · Hover to preview
        </p>
      </div>
    </div>
  );
}
