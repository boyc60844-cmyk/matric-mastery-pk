"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  Calendar,
  Flame,
  Calculator,
  CloudSun,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
} from "lucide-react";
import { timeService } from "@/lib/utilities/timeService";
import { academicCalendarService } from "@/lib/utilities/academicCalendarService";
import { studySessionTracker } from "@/lib/utilities/productivityTimerService";
import { CalendarEvent, EventCountdown } from "@/lib/utilities/types";

interface StudentDashboardProps {
  onSwitchTab?: (
    tab: "dashboard" | "clock" | "calendar" | "timers" | "calculators" | "liveinfo"
  ) => void;
}

export default function StudentDashboardWidget({
  onSwitchTab,
}: StudentDashboardProps) {
  const [clockData, setClockData] = useState(
    timeService.formatTimeForZone("Asia/Karachi", "12h")
  );
  const [todayMinutes, setTodayMinutes] = useState<number>(
    studySessionTracker.getTodayMinutes()
  );
  const [weeklyGoal, setWeeklyGoal] = useState<number>(
    studySessionTracker.getWeeklyGoal()
  );
  const [personalCount, setPersonalCount] = useState<number>(
    academicCalendarService.getPersonalEvents().length
  );
  const [countdowns, setCountdowns] = useState<EventCountdown[]>(
    academicCalendarService.getUpcomingCountdowns(1)
  );

  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Time & Milestone subscriptions
  useEffect(() => {
    const unsubTime = timeService.subscribe(() => {
      setClockData(timeService.formatTimeForZone("Asia/Karachi", "12h"));
    });

    const unsubCal = academicCalendarService.subscribe(() => {
      setPersonalCount(academicCalendarService.getPersonalEvents().length);
      setCountdowns(academicCalendarService.getUpcomingCountdowns(1));
    });

    const unsubTracker = studySessionTracker.subscribe(() => {
      setTodayMinutes(studySessionTracker.getTodayMinutes());
      setWeeklyGoal(studySessionTracker.getWeeklyGoal());
    });

    return () => {
      unsubTime();
      unsubCal();
      unsubTracker();
    };
  }, []);

  // Export full student bundle
  const handleExportFullBundle = () => {
    const bundle = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      studyLogs: studySessionTracker.getSessions(),
      weeklyGoalHours: studySessionTracker.getWeeklyGoal(),
      personalEvents: academicCalendarService.getPersonalEvents(),
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matric_mastery_student_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import full student bundle
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || typeof text !== "string") {
          throw new Error("Empty file content");
        }
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid JSON object");
        }

        // Backward-compatible extraction across legacy and standard keys
        const rawSessions =
          parsed.studyLogs ??
          parsed.studySessions ??
          parsed.sessions ??
          parsed.mm_study_sessions ??
          parsed.mm_study_session_records;
        const rawEvents =
          parsed.personalEvents ??
          parsed.personalCalendarEvents ??
          parsed.events ??
          parsed.mm_personal_academic_events ??
          parsed.mm_personal_calendar_events;
        const rawWeeklyGoal = parsed.weeklyGoalHours ?? parsed.weeklyGoal;

        let restoredSessions = false;
        let restoredEvents = false;
        let anyAttempted = false;

        if (rawSessions !== undefined) {
          anyAttempted = true;
          restoredSessions = studySessionTracker.importSessions(rawSessions);
        }

        if (rawEvents !== undefined) {
          anyAttempted = true;
          restoredEvents = academicCalendarService.importPersonalEvents(rawEvents);
        }

        if (rawWeeklyGoal !== undefined && !isNaN(Number(rawWeeklyGoal))) {
          const numGoal = Math.max(1, Math.min(100, Number(rawWeeklyGoal)));
          studySessionTracker.setWeeklyGoal(numGoal);
        }

        // Clean up legacy keys if present
        try {
          localStorage.removeItem("mm_study_session_records");
          localStorage.removeItem("mm_personal_calendar_events");
        } catch {
          // Ignore
        }

        // Never display successful restoration if any provided record collection failed
        if (
          !anyAttempted ||
          (rawSessions !== undefined && !restoredSessions) ||
          (rawEvents !== undefined && !restoredEvents)
        ) {
          setImportStatus("Import failed: Backup file contained invalid or corrupted records.");
          setTimeout(() => setImportStatus(null), 4000);
          return;
        }

        // Refresh UI state directly from authoritative service singletons
        setTodayMinutes(studySessionTracker.getTodayMinutes());
        setWeeklyGoal(studySessionTracker.getWeeklyGoal());
        setPersonalCount(academicCalendarService.getPersonalEvents().length);
        setCountdowns(academicCalendarService.getUpcomingCountdowns(1));

        setImportStatus("Import successful! All study data and deadlines restored.");
        setTimeout(() => setImportStatus(null), 3500);
      } catch {
        setImportStatus("Invalid backup file. Please upload a valid Matric Mastery JSON export.");
        setTimeout(() => setImportStatus(null), 3500);
      } finally {
        // Reset input element value so the same file can be re-selected if desired
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "Are you sure you want to clear your local study logs and personal deadlines? This cannot be undone unless you have an exported JSON backup."
      )
    ) {
      // Clear actual storage records and in-memory states
      studySessionTracker.clearAllSessions();
      academicCalendarService.clearPersonalEvents();

      // Clean up both active and legacy keys
      try {
        localStorage.removeItem("mm_study_sessions");
        localStorage.removeItem("mm_personal_academic_events");
        localStorage.removeItem("mm_study_session_records");
        localStorage.removeItem("mm_personal_calendar_events");
      } catch {
        // Ignore
      }

      // Refresh component local state
      setTodayMinutes(0);
      setPersonalCount(0);
      setCountdowns(academicCalendarService.getUpcomingCountdowns(1));
      setImportStatus("Local study sessions and personal deadlines have been reset.");
      setTimeout(() => setImportStatus(null), 3500);
    }
  };

  const dailyGoalMinutes = Math.round((weeklyGoal * 60) / 7);
  const goalPercent = Math.min(100, Math.round((todayMinutes / Math.max(1, dailyGoalMinutes)) * 100));
  const nextCountdown = countdowns[0];

  return (
    <div className="w-full space-y-6">
      {/* Hero Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: PKT Time */}
        <div
          onClick={() => onSwitchTab?.("clock")}
          className="group cursor-pointer rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-lg hover:border-accent/40 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Pakistan Time (PKT)
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-accent group-hover:scale-110 transition-transform">
              <Clock size={16} />
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
            {clockData.timeString || "--:--:--"}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>NTP Precision Synchronized</span>
          </div>
        </div>

        {/* Metric 2: Next PBCC Milestone */}
        <div
          onClick={() => onSwitchTab?.("calendar")}
          className="group cursor-pointer rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-lg hover:border-accent/40 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Next Academic Milestone
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar size={16} />
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl sm:text-3xl font-black text-accent tracking-tight tabular-nums">
            {nextCountdown ? `${nextCountdown.days}d ${nextCountdown.hours}h` : "Scheduled"}
          </div>
          <div className="mt-1 text-xs text-neutral-300 truncate">
            {nextCountdown?.event.title || "PBCC Examination Phase"}
          </div>
        </div>

        {/* Metric 3: Today's Focus Minutes */}
        <div
          onClick={() => onSwitchTab?.("timers")}
          className="group cursor-pointer rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-lg hover:border-accent/40 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Today&apos;s Focus Study
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-accent group-hover:scale-110 transition-transform">
              <Flame size={16} />
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
            {todayMinutes}m{" "}
            <span className="text-base text-neutral-500 font-normal">
              / {dailyGoalMinutes}m
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Personal Deadlines */}
        <div
          onClick={() => onSwitchTab?.("calendar")}
          className="group cursor-pointer rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-lg hover:border-accent/40 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Personal Deadlines
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <BookOpen size={16} />
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
            {personalCount}{" "}
            <span className="text-base text-neutral-500 font-normal">
              Active
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-cyan-400 font-medium">
            <span>Manage Custom Milestones</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>

      {/* Tool Launch Grid */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              Quick Study Utilities Launcher
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Access precision tools engineered for Punjab Matriculation
              candidates.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Card 1 */}
          <button
            type="button"
            onClick={() => onSwitchTab?.("timers")}
            className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-[#141418] p-4 text-left hover:border-accent/40 hover:bg-[#181820] active:scale-[0.98] transition-all group"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-accent group-hover:scale-110 transition-transform">
              <Flame size={20} />
            </span>
            <div>
              <div className="font-heading font-bold text-sm text-white group-hover:text-accent transition-colors">
                Pomodoro &amp; Study Tracker
              </div>
              <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                25m/5m focus cycles with completion chimes and persistent study
                session logger.
              </p>
            </div>
          </button>

          {/* Card 2 */}
          <button
            type="button"
            onClick={() => onSwitchTab?.("calculators")}
            className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-[#141418] p-4 text-left hover:border-accent/40 hover:bg-[#181820] active:scale-[0.98] transition-all group"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Calculator size={20} />
            </span>
            <div>
              <div className="font-heading font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                Punjab Board Aggregate &amp; Marks
              </div>
              <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                Calculate total matric score, letter grades, and 40% PBCC passing
                criteria.
              </p>
            </div>
          </button>

          {/* Card 3 */}
          <button
            type="button"
            onClick={() => onSwitchTab?.("calendar")}
            className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-[#141418] p-4 text-left hover:border-accent/40 hover:bg-[#181820] active:scale-[0.98] transition-all group"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </span>
            <div>
              <div className="font-heading font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                Academic Calendar &amp; Countdowns
              </div>
              <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                Official PBCC verified examination schedule and personal
                deadline tracker.
              </p>
            </div>
          </button>

          {/* Card 4 */}
          <button
            type="button"
            onClick={() => onSwitchTab?.("clock")}
            className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-[#141418] p-4 text-left hover:border-accent/40 hover:bg-[#181820] active:scale-[0.98] transition-all group"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </span>
            <div>
              <div className="font-heading font-bold text-sm text-white group-hover:text-purple-400 transition-colors">
                Precision Clock &amp; Timezone Sync
              </div>
              <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                Dual analog &amp; digital clock with WorldTimeAPI network NTP
                synchronization.
              </p>
            </div>
          </button>

          {/* Card 5 */}
          <button
            type="button"
            onClick={() => onSwitchTab?.("liveinfo")}
            className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-[#141418] p-4 text-left hover:border-accent/40 hover:bg-[#181820] active:scale-[0.98] transition-all group"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-accent group-hover:scale-110 transition-transform">
              <CloudSun size={20} />
            </span>
            <div>
              <div className="font-heading font-bold text-sm text-white group-hover:text-accent transition-colors">
                Punjab Exam Cities Weather &amp; Forex
              </div>
              <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                Live atmospheric conditions for Multan, Lahore, Rawalpindi +
                forex rate converter.
              </p>
            </div>
          </button>

          {/* Card 6 */}
          <button
            type="button"
            onClick={() => onSwitchTab?.("calculators")}
            className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-[#141418] p-4 text-left hover:border-accent/40 hover:bg-[#181820] active:scale-[0.98] transition-all group"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
              <Calculator size={20} />
            </span>
            <div>
              <div className="font-heading font-bold text-sm text-white group-hover:text-pink-400 transition-colors">
                Physics &amp; Chemistry Unit Converter
              </div>
              <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                Pressure (atm/Pa/mmHg), Energy (J/cal/eV), and mass conversions
                for numericals.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Local Data Storage & Privacy Center */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-heading font-bold text-white text-sm">
                Student Data Privacy &amp; Local Backup
              </h3>
              <p className="text-xs text-neutral-400">
                100% private to your device. No telemetry, third-party tracking,
                or server upload.
              </p>
            </div>
          </div>

          {importStatus && (
            <span className="text-xs font-semibold text-emerald-400">
              {importStatus}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportFullBundle}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#16161A] px-3.5 py-2 text-xs font-medium text-white hover:border-accent hover:text-accent active:scale-95 transition-all"
          >
            <Download size={14} />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#16161A] px-3.5 py-2 text-xs font-medium text-white hover:border-accent hover:text-accent active:scale-95 transition-all cursor-pointer">
            <Upload size={14} />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleClearData}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-950/20 px-3.5 py-2 text-xs font-medium text-red-300 hover:bg-red-900/30 active:scale-95 transition-all ml-auto"
          >
            <Trash2 size={14} />
            <span>Reset Local Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
