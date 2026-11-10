"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Coffee,
  BookOpen,
  Award,
  Trash2,
  Download,
  Timer as TimerIcon,
  Clock,
  ListOrdered,
} from "lucide-react";
import {
  countdownTimer,
  stopwatch,
  pomodoroEngine,
  studySessionTracker,
} from "@/lib/utilities/productivityTimerService";
import {
  StopwatchLap,
  PomodoroPhase,
  StudySessionRecord,
} from "@/lib/utilities/types";
import { motion, AnimatePresence } from "framer-motion";

type ActiveTab = "countdown" | "pomodoro" | "stopwatch" | "logger";

const PRESET_DURATIONS = [
  { label: "15m", h: 0, m: 15, s: 0 },
  { label: "25m", h: 0, m: 25, s: 0 },
  { label: "45m", h: 0, m: 45, s: 0 },
  { label: "60m", h: 1, m: 0, s: 0 },
  { label: "90m", h: 1, m: 30, s: 0 },
];

const MATRIC_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Computer Science",
  "English",
  "Urdu",
  "Islamiyat",
  "Pakistan Studies",
  "General / Revision",
];

export default function ProductivityTimerWidget() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("pomodoro");
  const [soundEnabled, setSoundEnabled] = useState(pomodoroEngine.config.soundEnabled);

  // Countdown state
  const [, setCountdownTick] = useState(0);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);

  // Stopwatch state
  const [, setStopwatchTick] = useState(0);

  // Pomodoro state
  const [, setPomodoroTick] = useState(0);

  // Study logger state
  const [, setTrackerTick] = useState(0);
  const [logSubject, setLogSubject] = useState(MATRIC_SUBJECTS[0]);
  const [logMinutes, setLogMinutes] = useState(30);
  const [logNotes, setLogNotes] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);

  // Sync subscriptions
  useEffect(() => {
    const unsubCd = countdownTimer.subscribe(() => setCountdownTick((v) => v + 1));
    const unsubSw = stopwatch.subscribe(() => setStopwatchTick((v) => v + 1));
    const unsubPm = pomodoroEngine.subscribe(() => setPomodoroTick((v) => v + 1));
    const unsubTr = studySessionTracker.subscribe(() => setTrackerTick((v) => v + 1));

    return () => {
      unsubCd();
      unsubSw();
      unsubPm();
      unsubTr();
    };
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    pomodoroEngine.config.soundEnabled = next;
  };

  // Format ms to HH:MM:SS or MM:SS
  const formatMs = (ms: number, showHoursAlways = false): string => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0 || showHoursAlways) {
      return `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Format stopwatch ms to MM:SS.CC (centiseconds)
  const formatStopwatchMs = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
  };

  // Countdown preset handle
  const handleSelectPreset = (h: number, m: number, s: number) => {
    countdownTimer.setDuration(h, m, s);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customHours > 0 || customMinutes > 0 || customSeconds > 0) {
      countdownTimer.setDuration(customHours, customMinutes, customSeconds);
    }
  };

  // Study log handle
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (logMinutes <= 0) return;
    studySessionTracker.logSession(logSubject, logMinutes, "manual", logNotes);
    setLogNotes("");
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2500);
  };

  const handleDeleteSession = (id: string) => {
    studySessionTracker.deleteSession(id);
  };

  const handleExportSessions = () => {
    const json = studySessionTracker.exportDataJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matric_mastery_study_logs_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateWeeklyGoal = (hours: number) => {
    studySessionTracker.setWeeklyGoal(hours);
  };

  // Calculations
  const countdownPercent =
    countdownTimer.totalDurationMs > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((countdownTimer.totalDurationMs - countdownTimer.remainingMs) /
              countdownTimer.totalDurationMs) *
              100
          )
        )
      : 0;

  const pomodoroPhaseDurationMs =
    pomodoroEngine.phase === "focus"
      ? pomodoroEngine.config.focusMinutes * 60 * 1000
      : pomodoroEngine.phase === "shortBreak"
      ? pomodoroEngine.config.shortBreakMinutes * 60 * 1000
      : pomodoroEngine.config.longBreakMinutes * 60 * 1000;

  const pomodoroPercent =
    pomodoroPhaseDurationMs > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((pomodoroPhaseDurationMs - pomodoroEngine.remainingMs) /
              pomodoroPhaseDurationMs) *
              100
          )
        )
      : 0;

  const todayMinutes = studySessionTracker.getTodayMinutes();
  const weeklyGoalHours = studySessionTracker.getWeeklyGoal();
  const dailyGoalMinutes = Math.round((weeklyGoalHours * 60) / 7);
  const goalPercent = Math.min(100, Math.round((todayMinutes / Math.max(1, dailyGoalMinutes)) * 100));
  const sessions = studySessionTracker.getSessions();

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0E0E12] p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-accent border border-amber-500/30">
              <TimerIcon size={16} />
            </span>
            <h2 className="text-lg font-heading font-bold text-white tracking-wide">
              Productivity Timers &amp; Study Tracker
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Absolute-target timestamp timers that never drift during background tab
            sleep.
          </p>
        </div>

        {/* Global Sound Toggle */}
        <button
          type="button"
          onClick={handleToggleSound}
          className={`flex items-center gap-1.5 self-start sm:self-auto rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors ${
            soundEnabled
              ? "bg-amber-500/10 border-amber-500/30 text-accent"
              : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
          }`}
          title={soundEnabled ? "Mute completion chime" : "Enable completion chime"}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{soundEnabled ? "Audio On" : "Muted"}</span>
        </button>
      </div>

      {/* Segmented Tab Bar */}
      <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#141418] p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("pomodoro")}
          className={`flex flex-1 min-w-[100px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
            activeTab === "pomodoro"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Flame size={14} />
          <span>Pomodoro</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("countdown")}
          className={`flex flex-1 min-w-[100px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
            activeTab === "countdown"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Clock size={14} />
          <span>Countdown</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("stopwatch")}
          className={`flex flex-1 min-w-[100px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
            activeTab === "stopwatch"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <ListOrdered size={14} />
          <span>Stopwatch</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("logger")}
          className={`flex flex-1 min-w-[100px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
            activeTab === "logger"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <BookOpen size={14} />
          <span>Study Log ({todayMinutes}m)</span>
        </button>
      </div>

      {/* TAB CONTENT: POMODORO */}
      {activeTab === "pomodoro" && (
        <div className="mt-6 flex flex-col items-center">
          {/* Phase Switcher */}
          <div className="flex items-center gap-2 rounded-xl bg-black/40 p-1 border border-white/5">
            <button
              type="button"
              onClick={() => pomodoroEngine.switchPhase("focus")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                pomodoroEngine.phase === "focus"
                  ? "bg-accent text-black font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Flame size={13} />
              <span>Focus (25m)</span>
            </button>
            <button
              type="button"
              onClick={() => pomodoroEngine.switchPhase("shortBreak")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                pomodoroEngine.phase === "shortBreak"
                  ? "bg-emerald-400 text-black font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Coffee size={13} />
              <span>Short Break (5m)</span>
            </button>
            <button
              type="button"
              onClick={() => pomodoroEngine.switchPhase("longBreak")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                pomodoroEngine.phase === "longBreak"
                  ? "bg-cyan-400 text-black font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Coffee size={13} />
              <span>Long Break (15m)</span>
            </button>
          </div>

          {/* Large Time Display with SVG Circular Accent */}
          <div className="relative mt-8 flex flex-col items-center justify-center">
            <div className="relative flex h-56 w-56 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-white/10"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className={
                    pomodoroEngine.phase === "focus"
                      ? "stroke-accent"
                      : pomodoroEngine.phase === "shortBreak"
                      ? "stroke-emerald-400"
                      : "stroke-cyan-400"
                  }
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={276.46}
                  strokeDashoffset={
                    276.46 - (276.46 * pomodoroPercent) / 100
                  }
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums">
                  {formatMs(pomodoroEngine.remainingMs)}
                </span>
                <span className="mt-1 text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                  {pomodoroEngine.phase === "focus"
                    ? "Study Focus"
                    : pomodoroEngine.phase === "shortBreak"
                    ? "Short Rest"
                    : "Long Rest"}
                </span>
                <span className="mt-1 text-[11px] font-mono text-neutral-500">
                  Cycle {(pomodoroEngine.cycleCount % 4) + 1} / 4
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-3">
            {pomodoroEngine.isRunning ? (
              <button
                type="button"
                onClick={() => pomodoroEngine.pause()}
                className="flex h-12 w-28 items-center justify-center gap-2 rounded-xl bg-amber-500 text-black font-heading font-bold shadow-lg hover:bg-amber-400 active:scale-95 transition-all"
              >
                <Pause size={18} />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => pomodoroEngine.start()}
                className="flex h-12 w-28 items-center justify-center gap-2 rounded-xl bg-accent text-black font-heading font-bold shadow-lg hover:bg-amber-400 active:scale-95 transition-all"
              >
                <Play size={18} fill="currentColor" />
                <span>Start</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => pomodoroEngine.resetCurrentPhase()}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#16161A] text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset Pomodoro"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Completed Cycles Badges */}
          <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400">
            <span>Completed Sessions:</span>
            <span className="font-mono text-accent font-bold">
              {pomodoroEngine.cycleCount} focus rounds
            </span>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COUNTDOWN */}
      {activeTab === "countdown" && (
        <div className="mt-6">
          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PRESET_DURATIONS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset.h, preset.m, preset.s)}
                className="rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all border bg-[#141418] border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Time Display */}
          <div className="mt-6 flex flex-col items-center">
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 px-8 py-6 w-full max-w-sm">
              <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white tabular-nums">
                {formatMs(countdownTimer.remainingMs, true)}
              </span>
              <span className="mt-2 text-xs text-neutral-400 uppercase tracking-widest font-semibold">
                {countdownTimer.isRunning
                  ? "Timer Running"
                  : countdownTimer.remainingMs === 0
                  ? "Completed!"
                  : "Paused / Ready"}
              </span>

              {/* Linear Progress */}
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${countdownPercent}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center gap-3">
              {countdownTimer.isRunning ? (
                <button
                  type="button"
                  onClick={() => countdownTimer.pause()}
                  className="flex h-12 w-28 items-center justify-center gap-2 rounded-xl bg-amber-500 text-black font-heading font-bold shadow-lg hover:bg-amber-400 active:scale-95 transition-all"
                >
                  <Pause size={18} />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => countdownTimer.start()}
                  className="flex h-12 w-28 items-center justify-center gap-2 rounded-xl bg-accent text-black font-heading font-bold shadow-lg hover:bg-amber-400 active:scale-95 transition-all"
                >
                  <Play size={18} fill="currentColor" />
                  <span>Start</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => countdownTimer.reset()}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#16161A] text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* Custom Time Form */}
            <form
              onSubmit={handleApplyCustom}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#121216] p-3 text-xs"
            >
              <span className="text-neutral-400 font-semibold mr-1">
                Custom Duration:
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={customHours}
                  onChange={(e) => setCustomHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-12 rounded border border-white/10 bg-black/50 px-2 py-1 text-center font-mono text-white focus:border-accent focus:outline-none"
                />
                <span className="text-neutral-500">h</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-12 rounded border border-white/10 bg-black/50 px-2 py-1 text-center font-mono text-white focus:border-accent focus:outline-none"
                />
                <span className="text-neutral-500">m</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-12 rounded border border-white/10 bg-black/50 px-2 py-1 text-center font-mono text-white focus:border-accent focus:outline-none"
                />
                <span className="text-neutral-500">s</span>
              </div>
              <button
                type="submit"
                className="rounded bg-white/10 px-3 py-1 font-semibold text-white hover:bg-accent hover:text-black transition-colors"
              >
                Set
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STOPWATCH */}
      {activeTab === "stopwatch" && (
        <div className="mt-6 flex flex-col items-center">
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 px-8 py-6 w-full max-w-sm">
            <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white tabular-nums">
              {formatStopwatchMs(stopwatch.elapsedMs)}
            </span>
            <span className="mt-2 text-xs text-neutral-400 uppercase tracking-widest font-semibold">
              {stopwatch.isRunning ? "Stopwatch Active" : "Stopped"}
            </span>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-3">
            {stopwatch.isRunning ? (
              <button
                type="button"
                onClick={() => stopwatch.pause()}
                className="flex h-12 w-28 items-center justify-center gap-2 rounded-xl bg-amber-500 text-black font-heading font-bold shadow-lg hover:bg-amber-400 active:scale-95 transition-all cursor-pointer"
              >
                <Pause size={18} />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => stopwatch.start()}
                className="flex h-12 w-28 items-center justify-center gap-2 rounded-xl bg-accent text-black font-heading font-bold shadow-lg hover:bg-amber-400 active:scale-95 transition-all cursor-pointer"
              >
                <Play size={18} fill="currentColor" />
                <span>Start</span>
              </button>
            )}

            <button
              type="button"
              disabled={!stopwatch.isRunning}
              onClick={() => stopwatch.recordLap()}
              className="flex h-12 px-4 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#16161A] text-xs font-semibold text-white hover:bg-white/10 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
            >
              <span>Lap</span>
            </button>

            <button
              type="button"
              onClick={() => stopwatch.reset()}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#16161A] text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              title="Reset Stopwatch"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Laps List */}
          {stopwatch.laps.length > 0 && (() => {
            const lapTimes = stopwatch.laps.map((l: StopwatchLap) => l.lapTimeMs);
            const minLapTime = lapTimes.length > 1 ? Math.min(...lapTimes) : null;
            const maxLapTime = lapTimes.length > 1 ? Math.max(...lapTimes) : null;

            return (
              <div className="mt-6 w-full max-w-md rounded-xl border border-white/10 bg-[#121216] p-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-semibold text-neutral-400">
                  <span>Lap #</span>
                  <span>Split</span>
                  <span>Total</span>
                </div>
                <div className="mt-2 max-h-48 overflow-y-auto divide-y divide-white/5 pr-1 font-mono text-xs">
                  {stopwatch.laps.map((lap: StopwatchLap) => (
                    <div
                      key={lap.lapNumber}
                      className="flex items-center justify-between py-1.5 text-neutral-300"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-500 font-bold tabular-nums">
                          Lap {lap.lapNumber.toString().padStart(2, "0")}
                        </span>
                        {minLapTime !== null && lap.lapTimeMs === minLapTime && (
                          <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-400">
                            Fastest
                          </span>
                        )}
                        {maxLapTime !== null && lap.lapTimeMs === maxLapTime && (
                          <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-bold text-amber-400">
                            Slowest
                          </span>
                        )}
                      </div>
                      <span className="text-amber-400 tabular-nums">
                        +{formatStopwatchMs(lap.lapTimeMs)}
                      </span>
                      <span className="text-white tabular-nums">
                        {formatStopwatchMs(lap.totalTimeMs)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB CONTENT: STUDY LOGGER */}
      {activeTab === "logger" && (
        <div className="mt-6 space-y-6">
          {/* Goal Banner */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Daily Study Progress
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-black text-white">
                    {todayMinutes}
                  </span>
                  <span className="text-xs text-neutral-400">
                    / {dailyGoalMinutes} minutes daily benchmark ({weeklyGoalHours}h weekly goal)
                  </span>
                  <span className="text-xs font-bold text-amber-400 ml-2">
                    ({goalPercent}%)
                  </span>
                </div>
              </div>

              {/* Weekly Target Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400">Weekly Target:</span>
                {[10, 15, 20, 25].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => handleUpdateWeeklyGoal(hours)}
                    className={`rounded px-2 py-1 font-mono text-xs font-bold transition-colors ${
                      weeklyGoalHours === hours
                        ? "bg-accent text-black"
                        : "bg-white/5 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Progress Bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>

          {/* New Session Log Form */}
          <form
            onSubmit={handleAddLog}
            className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-white text-sm">
                Log Study Session
              </span>
              {logSuccess && (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 size={13} /> Saved to Local Storage!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  Subject
                </label>
                <select
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-white focus:border-accent focus:outline-none"
                >
                  {MATRIC_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={logMinutes}
                  onChange={(e) =>
                    setLogMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-white focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  Topic / Chapter Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ch 10 Numericals"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-white focus:border-accent focus:outline-none placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 font-heading font-bold text-black hover:bg-amber-400 transition-colors shadow-md"
              >
                <Plus size={14} />
                <span>Save Session</span>
              </button>
            </div>
          </form>

          {/* Session History Table */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-heading font-bold text-white text-xs">
                Recent Sessions ({sessions.length})
              </span>
              {sessions.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportSessions}
                  className="flex items-center gap-1 text-[11px] text-accent hover:underline font-medium"
                >
                  <Download size={12} />
                  <span>Export JSON</span>
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <p className="py-6 text-center text-xs text-neutral-500">
                No study sessions logged yet. Complete a Pomodoro or enter study
                time above to track your daily progress.
              </p>
            ) : (
              <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-white/5 pr-1 font-mono text-xs">
                {sessions.map((s: StudySessionRecord) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-2 text-neutral-300"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-white">
                          {s.subject}
                        </span>
                        <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent font-mono font-bold">
                          {s.durationMinutes} min
                        </span>
                        <span className="text-[10px] text-neutral-500 font-sans capitalize">
                          ({s.mode})
                        </span>
                      </div>
                      {s.notes && (
                        <p className="mt-0.5 text-[11px] font-sans text-neutral-400">
                          {s.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-neutral-500">
                        {new Date(s.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSession(s.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
