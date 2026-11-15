"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  X,
} from "lucide-react";
import { academicCalendarService } from "@/lib/utilities/academicCalendarService";
import { timeService } from "@/lib/utilities/timeService";
import {
  AwaitingConfirmationItem,
  CalendarEvent,
  EventCountdown,
} from "@/lib/utilities/types";
import { motion, AnimatePresence } from "framer-motion";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatPktTimeLabel(timeStr?: string): string {
  const raw = timeStr && /^\d{1,2}:\d{2}$/.test(timeStr.trim()) ? timeStr.trim() : "08:30";
  const [hStr, mStr] = raw.split(":");
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${mStr} ${period} PKT`;
}

export default function AcademicCalendarWidget() {
  const initialPktToday = academicCalendarService.getPktToday();
  const [currentYear, setCurrentYear] = useState<number>(initialPktToday.year);
  const [currentMonth, setCurrentMonth] = useState<number>(initialPktToday.month);
  const [selectedDateString, setSelectedDateString] = useState<string>(
    initialPktToday.dateString
  );
  const [pktTodayString, setPktTodayString] = useState<string>(initialPktToday.dateString);

  const [allEvents, setAllEvents] = useState<CalendarEvent[]>(() =>
    academicCalendarService.getAllEvents()
  );
  const [countdowns, setCountdowns] = useState<EventCountdown[]>(() =>
    academicCalendarService.getUpcomingCountdowns(8)
  );
  const [primaryExamCountdown, setPrimaryExamCountdown] =
    useState<EventCountdown | null>(() =>
      academicCalendarService.getPrimaryExamCountdown()
    );
  const [awaitingItems] = useState<AwaitingConfirmationItem[]>(() =>
    academicCalendarService.getAwaitingConfirmationEvents()
  );
  const [filterType, setFilterType] = useState<"all" | "official" | "personal">("all");

  // Personal event modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(initialPktToday.dateString);
  const [newCategory, setNewCategory] = useState<CalendarEvent["category"]>("deadline");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [newDescription, setNewDescription] = useState("");

  // Re-fetch calendar events and update PKT countdowns on service updates & every 1 sec
  useEffect(() => {
    const update = () => {
      setAllEvents(academicCalendarService.getAllEvents());
      setCountdowns(academicCalendarService.getUpcomingCountdowns(8));
      setPrimaryExamCountdown(academicCalendarService.getPrimaryExamCountdown());
      setPktTodayString(academicCalendarService.getPktToday().dateString);
    };

    update();
    const interval = setInterval(update, 1000);
    const unsubCal = academicCalendarService.subscribe(update);
    const unsubTime = timeService.subscribe(update);

    return () => {
      clearInterval(interval);
      unsubCal();
      unsubTime();
    };
  }, []);

  // Handle ESC key for modal
  useEffect(() => {
    if (!isAddModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAddModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddModalOpen]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const pktNow = academicCalendarService.getPktToday();
    setCurrentYear(pktNow.year);
    setCurrentMonth(pktNow.month);
    setSelectedDateString(pktNow.dateString);
    setPktTodayString(pktNow.dateString);
  };

  const handleCreatePersonalEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    academicCalendarService.addPersonalEvent({
      title: newTitle.trim(),
      date: newDate,
      time: "08:30",
      category: newCategory,
      priority: newPriority,
      description: newDescription.trim() || undefined,
    });

    setNewTitle("");
    setNewDescription("");
    setIsAddModalOpen(false);
  };

  const monthCells = academicCalendarService.getMonthDays(currentYear, currentMonth);

  // Filtered countdowns
  const displayedCountdowns = countdowns.filter((c) => {
    if (filterType === "official") return c.event.isOfficial;
    if (filterType === "personal") return !c.event.isOfficial;
    return true;
  });

  // Events on the currently selected date
  const selectedDateEvents = allEvents.filter((evt) => evt.date === selectedDateString);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Verification Protocol Notice */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                Verified · PKT (UTC+5)
              </span>
              <span className="text-white/20">·</span>
              <span className="font-mono text-xs text-white/60">
                PBCC &amp; All 9 Punjab BISE Boards · Last Verified: 15 November 2026
              </span>
            </div>
            <h2 className="mt-1 font-heading text-xl sm:text-2xl font-black text-white">
              Academic Calendar &amp; Examination Countdowns
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setNewDate(selectedDateString);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFD60A] px-3.5 py-2 text-xs font-heading font-black text-black hover:bg-amber-300 transition-colors shadow-glow cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Personal Deadline</span>
            </button>
          </div>
        </div>

        {/* Verification Status Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono text-white/70">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <strong className="text-white font-bold">Confirmed:</strong> PBCC 10 Nov 2026 Notice (via Media &amp; BISE Updates)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <strong className="text-white font-bold">Awaiting Official Confirmation:</strong> No Countdown Shown
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <strong className="text-white font-bold">Personal Goal:</strong> Custom Student Deadline (PKT)
          </span>
        </div>
      </div>

      {/* Featured Verified Board Exam Countdown (Class 10 / SSC Part-II ONLY) */}
      {primaryExamCountdown && (
        <div className="rounded-2xl border border-[#FFD60A]/30 bg-gradient-to-br from-[#FFD60A]/[0.07] via-[#0E0E12] to-[#0E0E12] p-5 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-bold text-emerald-400 uppercase">
                  <ShieldCheck size={11} />
                  Confirmed · Class 10 / SSC Part-II ONLY
                </span>
                <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-white/70">
                  16 March 2027 · 08:30 AM PKT (UTC+5)
                </span>
              </div>

              <h3 className="font-heading text-lg sm:text-xl font-black text-white">
                {primaryExamCountdown.event.title}
              </h3>

              <p className="text-xs text-white/75 leading-relaxed">
                {primaryExamCountdown.event.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[10px] font-mono text-white/55">
                <span>
                  Announcement Date:{" "}
                  <strong className="text-white/80">
                    {primaryExamCountdown.event.announcementDate}
                  </strong>
                </span>
                <span>
                  Last Verified:{" "}
                  <strong className="text-white/80">
                    {primaryExamCountdown.event.lastVerifiedDate}
                  </strong>
                </span>
                {primaryExamCountdown.event.sourceUrl && (
                  <a
                    href={primaryExamCountdown.event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#FFD60A] hover:underline font-bold"
                  >
                    <span>{primaryExamCountdown.event.sourceName}</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>

            {/* Live PKT Ticker for Class 10 Board Exam */}
            <div className="shrink-0">
              {primaryExamCountdown.isExpired ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center font-mono text-xs font-bold text-emerald-300 uppercase">
                  {primaryExamCountdown.isToday
                    ? "Examination Day Today (PKT)"
                    : "Examination Commenced"}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 min-w-[64px]">
                    <span className="block text-xl sm:text-2xl font-black text-white tabular-nums">
                      {primaryExamCountdown.days}
                    </span>
                    <span className="block text-[9px] text-white/50 uppercase">Days</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 min-w-[64px]">
                    <span className="block text-xl sm:text-2xl font-black text-[#FFD60A] tabular-nums">
                      {String(primaryExamCountdown.hours).padStart(2, "0")}
                    </span>
                    <span className="block text-[9px] text-white/50 uppercase">Hrs</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 min-w-[64px]">
                    <span className="block text-xl sm:text-2xl font-black text-white tabular-nums">
                      {String(primaryExamCountdown.minutes).padStart(2, "0")}
                    </span>
                    <span className="block text-[9px] text-white/50 uppercase">Min</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 min-w-[64px]">
                    <span className="block text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                      {String(primaryExamCountdown.seconds).padStart(2, "0")}
                    </span>
                    <span className="block text-[9px] text-white/50 uppercase">Sec</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Monthly Calendar Grid & Selected Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid (8 cols on desktop) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-xl">
          {/* Calendar Navigation Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-[#FFD60A]" />
              <h3 className="font-heading text-base sm:text-lg font-black text-white">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleJumpToToday}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-white/80 hover:text-white cursor-pointer"
                title="Jump to current PKT date"
              >
                Today (PKT)
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                title="Previous Month"
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                title="Next Month"
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs text-white/50 mb-2 font-bold uppercase">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid with Smooth Month Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentYear}-${currentMonth}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2"
            >
              {monthCells.map((cell, idx) => {
                const isSelected = cell.dateString === selectedDateString;
                const hasEvents = cell.events.length > 0;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDateString(cell.dateString)}
                    className={`min-h-[44px] min-[380px]:min-h-[52px] sm:min-h-[64px] p-1 sm:p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all active:scale-[0.98] cursor-pointer ${
                      isSelected
                        ? "border-[#FFD60A] bg-[#FFD60A]/15 shadow-[0_0_12px_rgba(255,214,10,0.2)]"
                        : cell.isToday
                        ? "border-emerald-500/60 bg-emerald-500/10"
                        : cell.isCurrentMonth
                        ? "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                        : "border-transparent bg-transparent opacity-25"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-[11px] sm:text-xs font-mono font-bold tabular-nums ${
                          cell.isToday
                            ? "text-emerald-400"
                            : isSelected
                            ? "text-[#FFD60A]"
                            : cell.isCurrentMonth
                            ? "text-white"
                            : "text-white/40"
                        }`}
                      >
                        {cell.day}
                      </span>
                      {cell.isToday && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </div>

                    {/* Event indicators */}
                    {hasEvents && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cell.events.slice(0, 2).map((e) => (
                          <span
                            key={e.id}
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              e.isOfficial ? "bg-emerald-400" : "bg-sky-400"
                            }`}
                            title={e.title}
                          />
                        ))}
                        {cell.events.length > 2 && (
                          <span className="text-[8px] sm:text-[9px] font-mono text-white/60 font-bold leading-none">
                            +{cell.events.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Selected Date Inspector (4 cols on desktop) */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase font-bold">
                Selected Date (PKT)
                {selectedDateString === pktTodayString ? " · Today" : ""}
              </span>
              <h4 className="font-heading text-sm sm:text-base font-bold text-white mt-0.5">
                {selectedDateString}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setNewDate(selectedDateString);
                setIsAddModalOpen(true);
              }}
              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:text-white cursor-pointer"
              title="Add event for this date"
            >
              <Plus size={14} />
            </button>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-white/50">
              No verified milestones scheduled for this date.
              <br />
              <button
                type="button"
                onClick={() => {
                  setNewDate(selectedDateString);
                  setIsAddModalOpen(true);
                }}
                className="mt-3 inline-flex items-center gap-1 text-[#FFD60A] font-bold hover:underline cursor-pointer"
              >
                + Add student task or deadline
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {selectedDateEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-3 rounded-xl border ${
                    evt.isOfficial
                      ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                      : "border-sky-500/30 bg-sky-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold uppercase rounded px-1.5 py-0.5 ${
                        evt.isOfficial
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-sky-400/20 text-sky-300"
                      }`}
                    >
                      {evt.isOfficial ? "Confirmed" : "Personal Goal"}
                    </span>
                    {!evt.isOfficial ? (
                      <button
                        type="button"
                        onClick={() => academicCalendarService.deletePersonalEvent(evt.id)}
                        className="text-white/40 hover:text-rose-400 cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 size={12} />
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-white/55">
                        {formatPktTimeLabel(evt.time)}
                      </span>
                    )}
                  </div>

                  <h5 className="font-heading text-xs font-bold text-white mt-1.5">
                    {evt.title}
                  </h5>

                  {evt.classLevel && (
                    <div className="mt-1 text-[10px] font-mono text-[#FFD60A]">
                      {evt.classLevel}
                    </div>
                  )}

                  {evt.description && (
                    <p className="text-[11px] text-white/70 mt-1 leading-snug">
                      {evt.description}
                    </p>
                  )}

                  {evt.isOfficial && (
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-1 text-[10px] font-mono text-white/55">
                      {evt.issuingAuthority && (
                        <div>Authority: {evt.issuingAuthority}</div>
                      )}
                      {evt.announcementDate && (
                        <div>Announced: {evt.announcementDate}</div>
                      )}
                      {evt.sourceUrl && (
                        <a
                          href={evt.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#FFD60A] hover:underline"
                        >
                          <span>{evt.sourceName || "Verified Source"}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Real-Time Upcoming Academic Countdowns */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#FFD60A]" />
            <div>
              <h3 className="font-heading text-base font-black text-white">
                Confirmed Examination &amp; Admission Countdowns (PKT)
              </h3>
              <p className="text-[11px] font-mono text-white/50">
                All countdowns lock strictly to Pakistan Standard Time (UTC+05:00)
              </p>
            </div>
          </div>

          {/* Filter: All / Official / Personal */}
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5 text-xs font-mono self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`rounded px-2.5 py-1 cursor-pointer ${
                filterType === "all"
                  ? "bg-[#FFD60A] text-black font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType("official")}
              className={`rounded px-2.5 py-1 cursor-pointer ${
                filterType === "official"
                  ? "bg-[#FFD60A] text-black font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Verified Matric
            </button>
            <button
              type="button"
              onClick={() => setFilterType("personal")}
              className={`rounded px-2.5 py-1 cursor-pointer ${
                filterType === "personal"
                  ? "bg-[#FFD60A] text-black font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Personal
            </button>
          </div>
        </div>

        {displayedCountdowns.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-white/50">
            No upcoming confirmed events match the current filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCountdowns.map(({ event, days, hours, minutes, seconds, isExpired, isToday }) => (
              <div
                key={event.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between hover:border-[#FFD60A]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-2">
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded uppercase ${
                        event.isOfficial
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-sky-400/20 text-sky-300 border border-sky-400/30"
                      }`}
                    >
                      {event.isOfficial ? "Confirmed" : "Personal Goal"}
                    </span>
                    <span className="text-white/60 text-right">
                      {event.date} · {formatPktTimeLabel(event.time)}
                    </span>
                  </div>

                  {(event.examYear || event.classLevel) && (
                    <div className="text-[10px] font-mono text-[#FFD60A]/90 mb-1">
                      {[event.examYear, event.classLevel].filter(Boolean).join(" · ")}
                    </div>
                  )}

                  <h4 className="font-heading text-sm font-bold text-white line-clamp-2">
                    {event.title}
                  </h4>

                  {event.description && (
                    <p className="mt-1.5 text-xs text-white/70 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Countdown Time Grid */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  {isExpired ? (
                    <div className="text-center py-2 text-xs font-mono font-bold text-emerald-300/80 uppercase">
                      {isToday ? "Scheduled Today (PKT)" : "Concluded / Expired"}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1 text-center font-mono">
                      <div className="rounded bg-black/40 p-1.5 border border-white/5">
                        <span className="block text-base font-black text-white tabular-nums">
                          {days}
                        </span>
                        <span className="block text-[9px] text-white/50 uppercase">Days</span>
                      </div>
                      <div className="rounded bg-black/40 p-1.5 border border-white/5">
                        <span className="block text-base font-black text-[#FFD60A] tabular-nums">
                          {String(hours).padStart(2, "0")}
                        </span>
                        <span className="block text-[9px] text-white/50 uppercase">Hrs</span>
                      </div>
                      <div className="rounded bg-black/40 p-1.5 border border-white/5">
                        <span className="block text-base font-black text-white tabular-nums">
                          {String(minutes).padStart(2, "0")}
                        </span>
                        <span className="block text-[9px] text-white/50 uppercase">Min</span>
                      </div>
                      <div className="rounded bg-black/40 p-1.5 border border-white/5">
                        <span className="block text-base font-black text-emerald-400 tabular-nums">
                          {String(seconds).padStart(2, "0")}
                        </span>
                        <span className="block text-[9px] text-white/50 uppercase">Sec</span>
                      </div>
                    </div>
                  )}

                  {/* Sourcing Transparency & Verification Metadata */}
                  {event.isOfficial && (
                    <div className="mt-3 space-y-1 text-[10px] font-mono text-white/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          Announced: {event.announcementDate || "10 Nov 2026"}
                        </span>
                        <span className="shrink-0">
                          Verified: {event.lastVerifiedDate || "15 Nov 2026"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span className="truncate text-white/40">
                          {event.sourceName || event.issuingAuthority || "PBCC Authority"}
                        </span>
                        {event.sourceUrl && (
                          <a
                            href={event.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[#FFD60A] hover:underline shrink-0"
                          >
                            <span>Source</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Examination Schedules Awaiting Official Confirmation (No Countdowns) */}
      <div className="rounded-2xl border border-amber-500/20 bg-[#0E0E12] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <div>
              <h3 className="font-heading text-base font-black text-white">
                Examination Schedules Awaiting Official Confirmation
              </h3>
              <p className="text-[11px] font-mono text-white/55">
                No countdown timers or estimated dates are shown until official PBCC / BISE notifications are issued.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto rounded bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[10px] font-mono font-bold text-amber-300 uppercase">
            Last Verified: 15 November 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {awaitingItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-2">
                  <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 font-bold text-amber-300 uppercase">
                    {item.status}
                  </span>
                  <span className="text-white/45">{item.examYear}</span>
                </div>

                <div className="text-[10px] font-mono text-[#FFD60A]/85 mb-1">
                  {item.classLevel}
                </div>

                <h4 className="font-heading text-sm font-bold text-white">
                  {item.title}
                </h4>

                <p className="mt-1.5 text-xs text-white/65 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-1.5">
                <div className="text-[10px] font-mono text-white/45">
                  Official Portals to Monitor:
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.officialLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-white/80 hover:border-[#FFD60A]/50 hover:text-[#FFD60A] transition-colors"
                    >
                      <span>{link.label}</span>
                      <ExternalLink size={9} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Add Personal Deadline Modal with AnimatePresence */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Add Personal Academic Deadline"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-[#121216] p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="font-heading text-base font-black text-white">
                  Add Personal Academic Deadline
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-white/50 hover:text-white cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreatePersonalEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">
                    Deadline Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics Ch 1-4 Past Paper Revision"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono text-white placeholder-white/40 focus:border-[#FFD60A] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      Date (PKT) *
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono text-white focus:border-[#FFD60A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(e.target.value as CalendarEvent["category"])
                      }
                      className="w-full rounded-xl border border-white/15 bg-[#121216] px-3 py-2 text-xs font-mono text-white focus:border-[#FFD60A] focus:outline-none"
                    >
                      <option value="exam">Exam Prep</option>
                      <option value="deadline">Submission / Fee</option>
                      <option value="study">Study Sprint</option>
                      <option value="personal">Personal Goal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) =>
                      setNewPriority(e.target.value as "high" | "medium" | "low")
                    }
                    className="w-full rounded-xl border border-white/15 bg-[#121216] px-3 py-2 text-xs font-mono text-white focus:border-[#FFD60A] focus:outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">
                    Notes / Specific Chapters
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Optional reminder notes..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono text-white placeholder-white/40 focus:border-[#FFD60A] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-heading font-medium text-white/70 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FFD60A] px-4 py-2 text-xs font-heading font-black text-black hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    Save Deadline
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
