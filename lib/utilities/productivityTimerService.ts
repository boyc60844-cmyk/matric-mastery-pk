/**
 * MATRIC MASTERY - REAL-WORLD UTILITY & INTELLIGENCE SYSTEM
 * Productivity Timer Engine (Absolute Timestamp Architecture)
 */

import { StopwatchLap, PomodoroPhase, PomodoroConfig, StudySessionRecord } from "./types";

const STORAGE_KEYS = {
  TIMER: "mm_timer_engine_state",
  POMODORO: "mm_pomodoro_engine_state",
  SESSIONS: "mm_study_session_records",
  STUDY_GOAL: "mm_study_weekly_goal_hours",
};

/**
 * Web Audio API Synth Chime - 100% self-contained, no external MP3 dependencies
 */
function playCompletionChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic bell chime: 587.33Hz (D5) -> 880Hz (A5)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1174.66, now + 0.1);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.1);
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);
  } catch {
    // Audio context may be blocked by autoplay policies
  }
}

/**
 * Trigger browser notification if explicitly permitted
 */
function sendBrowserNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
      });
    } catch {
      // Ignore
    }
  }
}

// ---------------------------------------------------------------------------
// 1. COUNTDOWN TIMER CONTROLLER (ABSOLUTE TIMESTAMP ENGINE)
// ---------------------------------------------------------------------------
export class CountdownTimer {
  public targetTimestamp: number | null = null;
  public totalDurationMs: number = 25 * 60 * 1000;
  public remainingMs: number = 25 * 60 * 1000;
  public isRunning: boolean = false;
  public isCompleted: boolean = false;

  private intervalId: number | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.restoreState();
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private restoreState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMER);
      if (saved) {
        const data = JSON.parse(saved);
        this.totalDurationMs = data.totalDurationMs || 25 * 60 * 1000;
        if (data.isRunning && data.targetTimestamp) {
          const now = Date.now();
          if (now >= data.targetTimestamp) {
            this.remainingMs = 0;
            this.isRunning = false;
            this.isCompleted = true;
          } else {
            this.targetTimestamp = data.targetTimestamp;
            this.remainingMs = data.targetTimestamp - now;
            this.isRunning = true;
            this.startTicker();
          }
        } else {
          this.remainingMs = data.remainingMs || this.totalDurationMs;
          this.isRunning = false;
          this.isCompleted = false;
        }
      }
    } catch {
      // Ignore
    }
  }

  private saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.TIMER,
        JSON.stringify({
          targetTimestamp: this.targetTimestamp,
          totalDurationMs: this.totalDurationMs,
          remainingMs: this.remainingMs,
          isRunning: this.isRunning,
        })
      );
    } catch {
      // Ignore
    }
  }

  private startTicker() {
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      if (!this.isRunning || !this.targetTimestamp) return;

      const now = Date.now();
      const remaining = Math.max(0, this.targetTimestamp - now);
      this.remainingMs = remaining;

      if (remaining === 0) {
        this.isRunning = false;
        this.isCompleted = true;
        this.targetTimestamp = null;
        if (this.intervalId !== null) clearInterval(this.intervalId);
        this.saveState();
        playCompletionChime();
        sendBrowserNotification("Matric Mastery Timer Complete", "Your study countdown has finished!");
      }
      this.notify();
    }, 200);
  }

  public setDuration(hours: number, minutes: number, seconds: number) {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    this.totalDurationMs = Math.max(1000, totalMs);
    this.remainingMs = this.totalDurationMs;
    this.isRunning = false;
    this.isCompleted = false;
    this.targetTimestamp = null;
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.saveState();
    this.notify();
  }

  public start() {
    if (this.remainingMs <= 0) {
      this.remainingMs = this.totalDurationMs;
    }
    this.targetTimestamp = Date.now() + this.remainingMs;
    this.isRunning = true;
    this.isCompleted = false;
    this.startTicker();
    this.saveState();
    this.notify();
  }

  public pause() {
    if (!this.isRunning) return;
    if (this.targetTimestamp) {
      this.remainingMs = Math.max(0, this.targetTimestamp - Date.now());
    }
    this.isRunning = false;
    this.targetTimestamp = null;
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.saveState();
    this.notify();
  }

  public reset() {
    this.isRunning = false;
    this.isCompleted = false;
    this.targetTimestamp = null;
    this.remainingMs = this.totalDurationMs;
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.saveState();
    this.notify();
  }
}

// ---------------------------------------------------------------------------
// 2. STOPWATCH CONTROLLER (HIGH-PRECISION LAP RECORDER)
// ---------------------------------------------------------------------------
export class Stopwatch {
  public elapsedMs: number = 0;
  public isRunning: boolean = false;
  public laps: StopwatchLap[] = [];

  private startTimeEpoch: number = 0;
  private accumulatedMs: number = 0;
  private intervalId: number | null = null;
  private listeners: Set<() => void> = new Set();

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTimeEpoch = Date.now();
    this.intervalId = window.setInterval(() => {
      this.elapsedMs = this.accumulatedMs + (Date.now() - this.startTimeEpoch);
      this.notify();
    }, 50);
    this.notify();
  }

  public pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.accumulatedMs += Date.now() - this.startTimeEpoch;
    this.elapsedMs = this.accumulatedMs;
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.notify();
  }

  public reset() {
    this.isRunning = false;
    this.accumulatedMs = 0;
    this.elapsedMs = 0;
    this.laps = [];
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.notify();
  }

  public recordLap() {
    if (!this.isRunning && this.elapsedMs === 0) return;
    const currentTotal = this.elapsedMs;
    const previousLapTotal = this.laps.length > 0 ? this.laps[0].totalTimeMs : 0;
    const lapTime = currentTotal - previousLapTotal;

    this.laps.unshift({
      lapNumber: this.laps.length + 1,
      lapTimeMs: lapTime,
      totalTimeMs: currentTotal,
    });
    this.notify();
  }
}

// ---------------------------------------------------------------------------
// 3. POMODORO FOCUS TIMER (WITH CYCLE CONTINUITY)
// ---------------------------------------------------------------------------
export class PomodoroEngine {
  public phase: PomodoroPhase = "focus";
  public cycleCount: number = 0; // Completed focus sessions
  public targetTimestamp: number | null = null;
  public remainingMs: number = 25 * 60 * 1000;
  public isRunning: boolean = false;

  public config: PomodoroConfig = {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
    soundEnabled: true,
    notificationsEnabled: false,
  };

  private intervalId: number | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.restoreState();
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private getPhaseDurationMs(phase: PomodoroPhase): number {
    switch (phase) {
      case "focus":
        return this.config.focusMinutes * 60 * 1000;
      case "shortBreak":
        return this.config.shortBreakMinutes * 60 * 1000;
      case "longBreak":
        return this.config.longBreakMinutes * 60 * 1000;
    }
  }

  private restoreState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POMODORO);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.config) this.config = { ...this.config, ...data.config };
        this.phase = data.phase || "focus";
        this.cycleCount = data.cycleCount || 0;

        if (data.isRunning && data.targetTimestamp) {
          const now = Date.now();
          if (now >= data.targetTimestamp) {
            this.handlePhaseCompletion();
          } else {
            this.targetTimestamp = data.targetTimestamp;
            this.remainingMs = data.targetTimestamp - now;
            this.isRunning = true;
            this.startTicker();
          }
        } else {
          this.remainingMs = data.remainingMs || this.getPhaseDurationMs(this.phase);
          this.isRunning = false;
        }
      }
    } catch {
      // Ignore
    }
  }

  private saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.POMODORO,
        JSON.stringify({
          config: this.config,
          phase: this.phase,
          cycleCount: this.cycleCount,
          targetTimestamp: this.targetTimestamp,
          remainingMs: this.remainingMs,
          isRunning: this.isRunning,
        })
      );
    } catch {
      // Ignore
    }
  }

  private handlePhaseCompletion() {
    if (this.config.soundEnabled) playCompletionChime();

    if (this.phase === "focus") {
      this.cycleCount += 1;
      const nextPhase: PomodoroPhase =
        this.cycleCount % this.config.cyclesBeforeLongBreak === 0 ? "longBreak" : "shortBreak";
      this.phase = nextPhase;
      this.remainingMs = this.getPhaseDurationMs(nextPhase);
      sendBrowserNotification(
        "Pomodoro Focus Session Finished!",
        nextPhase === "longBreak"
          ? "Great job! Take a well-earned 15-minute long break."
          : "Focus sprint complete! Take a 5-minute break."
      );
    } else {
      this.phase = "focus";
      this.remainingMs = this.getPhaseDurationMs("focus");
      sendBrowserNotification("Break Time Finished!", "Ready for your next study sprint? Let's focus!");
    }

    this.isRunning = false;
    this.targetTimestamp = null;
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.saveState();
    this.notify();
  }

  private startTicker() {
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      if (!this.isRunning || !this.targetTimestamp) return;

      const now = Date.now();
      const remaining = Math.max(0, this.targetTimestamp - now);
      this.remainingMs = remaining;

      if (remaining === 0) {
        this.handlePhaseCompletion();
      }
      this.notify();
    }, 250);
  }

  public start() {
    if (this.remainingMs <= 0) {
      this.remainingMs = this.getPhaseDurationMs(this.phase);
    }
    this.targetTimestamp = Date.now() + this.remainingMs;
    this.isRunning = true;
    this.startTicker();
    this.saveState();
    this.notify();
  }

  public pause() {
    if (!this.isRunning) return;
    if (this.targetTimestamp) {
      this.remainingMs = Math.max(0, this.targetTimestamp - Date.now());
    }
    this.isRunning = false;
    this.targetTimestamp = null;
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.saveState();
    this.notify();
  }

  public switchPhase(newPhase: PomodoroPhase) {
    this.pause();
    this.phase = newPhase;
    this.remainingMs = this.getPhaseDurationMs(newPhase);
    this.saveState();
    this.notify();
  }

  public resetCurrentPhase() {
    this.pause();
    this.remainingMs = this.getPhaseDurationMs(this.phase);
    this.saveState();
    this.notify();
  }

  public updateConfig(newConfig: Partial<PomodoroConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (!this.isRunning) {
      this.remainingMs = this.getPhaseDurationMs(this.phase);
    }
    this.saveState();
    this.notify();
  }
}

// ---------------------------------------------------------------------------
// 4. STUDY SESSION TRACKER (LOCAL PERSISTENCE & ANALYTICS)
// ---------------------------------------------------------------------------
export class StudySessionTracker {
  private sessions: StudySessionRecord[] = [];
  private weeklyGoalHours: number = 15;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.load();
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private load() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) this.sessions = JSON.parse(data);
      const goal = localStorage.getItem(STORAGE_KEYS.STUDY_GOAL);
      if (goal) this.weeklyGoalHours = parseFloat(goal) || 15;
    } catch {
      // Ignore
    }
  }

  private save(): boolean {
    // Bound study sessions to maximum 300 records (retaining newest)
    if (this.sessions.length > 300) {
      this.sessions = this.sessions.slice(0, 300);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(this.sessions));
      localStorage.setItem(STORAGE_KEYS.STUDY_GOAL, this.weeklyGoalHours.toString());
      this.notify();
      return true;
    } catch (err) {
      console.warn("Storage quota or write error in studySessionTracker:", err);
      // Attempt quota recovery by truncating to latest 100 sessions
      try {
        if (this.sessions.length > 100) {
          this.sessions = this.sessions.slice(0, 100);
          localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(this.sessions));
          this.notify();
          return true;
        }
      } catch {
        // Recovery failed
      }
      this.notify();
      return false;
    }
  }

  public logSession(subject: string, durationMinutes: number, mode: "pomodoro" | "timer" | "manual", notes?: string) {
    if (durationMinutes <= 0) return;
    const newSession: StudySessionRecord = {
      id: "sess-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      subject,
      durationMinutes,
      timestamp: Date.now(),
      notes,
      mode,
    };
    this.sessions.unshift(newSession);
    this.save();
  }

  public deleteSession(id: string) {
    this.sessions = this.sessions.filter((s) => s.id !== id);
    this.save();
  }

  public clearAllSessions() {
    this.sessions = [];
    this.save();
  }

  public reload(): void {
    this.load();
    this.notify();
  }

  public importSessions(incoming: any[]): boolean {
    if (!Array.isArray(incoming)) return false;
    const valid: StudySessionRecord[] = [];

    for (const item of incoming) {
      if (
        item &&
        typeof item.subject === "string" &&
        typeof item.durationMinutes === "number" &&
        item.durationMinutes > 0 &&
        typeof item.timestamp === "number"
      ) {
        valid.push({
          id: typeof item.id === "string" ? item.id : "sess-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
          subject: item.subject.trim() || "General Study",
          durationMinutes: Math.min(1440, Math.round(item.durationMinutes)),
          timestamp: item.timestamp,
          notes: typeof item.notes === "string" ? item.notes : undefined,
          mode: item.mode === "pomodoro" || item.mode === "timer" ? item.mode : "manual",
        });
      }
    }

    if (valid.length === 0 && incoming.length > 0) {
      return false;
    }

    // Sort descending by timestamp and cap at 300
    valid.sort((a, b) => b.timestamp - a.timestamp);
    this.sessions = valid.slice(0, 300);
    return this.save();
  }

  public setWeeklyGoal(hours: number) {
    this.weeklyGoalHours = Math.max(1, hours);
    this.save();
  }

  public getWeeklyGoal(): number {
    return this.weeklyGoalHours;
  }

  public getSessions(): StudySessionRecord[] {
    return [...this.sessions];
  }

  public getTodayMinutes(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();

    return this.sessions
      .filter((s) => s.timestamp >= startOfDay)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }

  public getThisWeekMinutes(): number {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    return this.sessions
      .filter((s) => s.timestamp >= startOfWeek.getTime())
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }

  public exportDataJson(): string {
    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        weeklyGoalHours: this.weeklyGoalHours,
        sessions: this.sessions,
      },
      null,
      2
    );
  }
}

// Singletons
export const countdownTimer = new CountdownTimer();
export const stopwatch = new Stopwatch();
export const pomodoroEngine = new PomodoroEngine();
export const studySessionTracker = new StudySessionTracker();
