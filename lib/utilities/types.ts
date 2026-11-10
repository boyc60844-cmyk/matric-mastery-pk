/**
 * MATRIC MASTERY - REAL-WORLD UTILITY & INTELLIGENCE SYSTEM
 * Shared Type Definitions
 */

export type TimeFormat = "12h" | "24h";

export interface TimeZoneOption {
  id: string;
  label: string;
  iana: string;
  flag: string;
  offsetHours: number;
}

export interface TimeSyncState {
  isSynchronized: boolean;
  provider: string;
  offsetMs: number; // Device clock vs network time (ms)
  lastSyncAttempt: number;
  lastSyncSuccess: number | null;
  syncStatus: "synced" | "syncing" | "failed" | "offline";
  errorMessage?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  category: "exam" | "registration" | "result" | "personal" | "deadline" | "study";
  isOfficial: boolean;
  issuingAuthority?: string;
  sourceUrl?: string;
  sourceName?: string;
  verificationStatus: "officially-confirmed" | "credibly-reported" | "historically-expected" | "unverified-rumor" | "student-custom";
  description?: string;
  priority?: "high" | "medium" | "low";
  completed?: boolean;
}

export interface EventCountdown {
  event: CalendarEvent;
  totalSecondsRemaining: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isToday: boolean;
}

export interface StopwatchLap {
  lapNumber: number;
  lapTimeMs: number;
  totalTimeMs: number;
}

export type PomodoroPhase = "focus" | "shortBreak" | "longBreak";

export interface PomodoroConfig {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface StudySessionRecord {
  id: string;
  subject: string;
  durationMinutes: number;
  timestamp: number; // epoch ms
  notes?: string;
  mode: "pomodoro" | "timer" | "manual";
}

export interface SubjectMarksInput {
  name: string;
  maxMarks: number;
  obtainedMarks: number;
  isPassing?: boolean;
}

export interface WeatherData {
  city: string;
  temperatureC: number;
  feelsLikeC: number;
  humidityPercent: number;
  windSpeedKmH: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  lastUpdated: string;
  provider: string;
  isStale?: boolean;
}

export interface CurrencyRateData {
  base: string;
  date: string;
  timestamp: number;
  rates: Record<string, number>;
  provider: string;
  disclaimer: string;
  isStale?: boolean;
}
