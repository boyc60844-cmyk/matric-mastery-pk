/**
 * MATRIC MASTERY - REAL-WORLD UTILITY & INTELLIGENCE SYSTEM
 * Live Clock and Time Intelligence Service
 */

import { TimeFormat, TimeZoneOption, TimeSyncState } from "./types";

export const WORLD_TIMEZONES: TimeZoneOption[] = [
  { id: "pkt", label: "Pakistan (PKT - Default)", iana: "Asia/Karachi", flag: "🇵🇰", offsetHours: 5 },
  { id: "uae", label: "UAE / Gulf (GST)", iana: "Asia/Dubai", flag: "🇦🇪", offsetHours: 4 },
  { id: "ksa", label: "Saudi Arabia (AST)", iana: "Asia/Riyadh", flag: "🇸🇦", offsetHours: 3 },
  { id: "gmt", label: "United Kingdom (GMT/BST)", iana: "Europe/London", flag: "🇬🇧", offsetHours: 0 },
  { id: "est", label: "US East (EST/EDT)", iana: "America/New_York", flag: "🇺🇸", offsetHours: -5 },
  { id: "tor", label: "Canada (Toronto)", iana: "America/Toronto", flag: "🇨🇦", offsetHours: -5 },
  { id: "syd", label: "Australia (Sydney)", iana: "Australia/Sydney", flag: "🇦🇺", offsetHours: 11 },
];

const STORAGE_KEYS = {
  FORMAT: "mm_clock_format",
  TIMEZONE: "mm_clock_timezone",
  WORLD_CLOCKS: "mm_clock_world_list",
  SYNC_STATE: "mm_clock_sync_state",
};

class TimeService {
  private syncOffsetMs: number = 0;
  private isSynchronized: boolean = false;
  private syncProvider: string = "Device Local Clock";
  private lastSyncTime: number | null = null;
  private syncStatus: "synced" | "syncing" | "failed" | "offline" = "offline";
  private syncError?: string;

  private subscribers: Set<() => void> = new Set();
  private timerId: number | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSavedState();
      this.startHeartbeat();
      // Perform initial network synchronization after mount
      setTimeout(() => this.syncWithNetworkTime(), 1200);
    }
  }

  private loadSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYNC_STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.offsetMs === "number" && Date.now() - parsed.lastSyncSuccess < 1000 * 60 * 60 * 6) {
          this.syncOffsetMs = parsed.offsetMs;
          this.isSynchronized = parsed.isSynchronized;
          this.syncProvider = parsed.provider;
          this.lastSyncTime = parsed.lastSyncSuccess;
          this.syncStatus = parsed.isSynchronized ? "synced" : "failed";
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  private startHeartbeat() {
    if (this.timerId !== null) return;
    this.timerId = window.setInterval(() => {
      this.notifySubscribers();
    }, 1000);
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error("TimeService subscriber error:", err);
      }
    });
  }

  /**
   * Returns current high-precision Date adjusted by network synchronization offset if active.
   */
  public getNow(): Date {
    return new Date(Date.now() + this.syncOffsetMs);
  }

  public getSyncState(): TimeSyncState {
    return {
      isSynchronized: this.isSynchronized,
      provider: this.syncProvider,
      offsetMs: this.syncOffsetMs,
      lastSyncAttempt: Date.now(),
      lastSyncSuccess: this.lastSyncTime,
      syncStatus: this.syncStatus,
      errorMessage: this.syncError,
    };
  }

  /**
   * Attempt network time synchronization using WorldTimeAPI with roundtrip latency calculation.
   * Fails gracefully without stopping the local clock.
   */
  public async syncWithNetworkTime(): Promise<boolean> {
    if (typeof window === "undefined" || !navigator.onLine) {
      this.syncStatus = "offline";
      this.notifySubscribers();
      return false;
    }

    this.syncStatus = "syncing";
    this.notifySubscribers();

    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      // Sourced from authoritative public NTP-bridged time API
      const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Karachi", {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const endTime = performance.now();
      const roundTripLatencyMs = Math.round((endTime - startTime) / 2);

      // Parse server UTC timestamp
      const serverTimestamp = new Date(data.utc_datetime).getTime();
      const clientEstimatedTimestamp = serverTimestamp + roundTripLatencyMs;
      const deviceClockNow = Date.now();

      this.syncOffsetMs = clientEstimatedTimestamp - deviceClockNow;
      this.isSynchronized = true;
      this.syncProvider = "WorldTimeAPI (Asia/Karachi NTP Relay)";
      this.lastSyncTime = Date.now();
      this.syncStatus = "synced";
      this.syncError = undefined;

      // Save state to localStorage for offline cache continuity
      try {
        localStorage.setItem(
          STORAGE_KEYS.SYNC_STATE,
          JSON.stringify({
            offsetMs: this.syncOffsetMs,
            isSynchronized: true,
            provider: this.syncProvider,
            lastSyncSuccess: this.lastSyncTime,
          })
        );
      } catch {
        // Ignore
      }

      this.notifySubscribers();
      return true;
    } catch (err: any) {
      this.isSynchronized = false;
      this.syncStatus = "failed";
      this.syncError = err?.message || "Time server unreachable";
      this.notifySubscribers();
      return false;
    }
  }

  /**
   * Format time for a specific IANA timezone.
   */
  public formatTimeForZone(
    ianaZone: string = "Asia/Karachi",
    format: TimeFormat = "12h",
    includeSeconds: boolean = true
  ): {
    timeString: string;
    period?: string;
    dateString: string;
    dayName: string;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const now = this.getNow();

    try {
      // Formatter with requested timezone
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaZone,
        hour: format === "12h" ? "numeric" : "2-digit",
        minute: "2-digit",
        second: includeSeconds ? "2-digit" : undefined,
        hour12: format === "12h",
      });

      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaZone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const dayFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaZone,
        weekday: "long",
      });

      // Extract parts for analog clock & detail cards
      const partsFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });

      const parts = partsFormatter.formatToParts(now);
      const hours = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
      const minutes = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
      const seconds = parseInt(parts.find((p) => p.type === "second")?.value || "0", 10);

      const formattedTime = timeFormatter.format(now);
      let timeString = formattedTime;
      let period = undefined;

      if (format === "12h") {
        const match = formattedTime.match(/^(.*?)\s*(AM|PM)$/i);
        if (match) {
          timeString = match[1];
          period = match[2].toUpperCase();
        }
      }

      return {
        timeString,
        period,
        dateString: dateFormatter.format(now),
        dayName: dayFormatter.format(now),
        hours,
        minutes,
        seconds,
      };
    } catch {
      // Fallback to UTC if timezone invalid
      return {
        timeString: now.toLocaleTimeString(),
        dateString: now.toLocaleDateString(),
        dayName: "Today",
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      };
    }
  }

  /**
   * Convert an arbitrary time from one timezone to another.
   */
  public convertTime(
    sourceTimeString: string, // "14:30" or "02:30 PM"
    sourceZone: string,
    targetZone: string
  ): { targetTimeString: string; targetDateOffset: string } {
    try {
      const now = this.getNow();
      const [hStr, mStr] = sourceTimeString.split(":");
      const hours = parseInt(hStr || "0", 10);
      const minutes = parseInt(mStr || "0", 10);

      const tempDate = new Date(now);
      tempDate.setHours(hours, minutes, 0, 0);

      const targetFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: targetZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const targetDateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: targetZone,
        day: "numeric",
      });

      const sourceDateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: sourceZone,
        day: "numeric",
      });

      const targetDay = targetDateFormatter.format(tempDate);
      const sourceDay = sourceDateFormatter.format(tempDate);

      let offsetLabel = "Same day";
      if (parseInt(targetDay, 10) > parseInt(sourceDay, 10)) {
        offsetLabel = "+1 day ahead";
      } else if (parseInt(targetDay, 10) < parseInt(sourceDay, 10)) {
        offsetLabel = "-1 day behind";
      }

      return {
        targetTimeString: targetFormatter.format(tempDate),
        targetDateOffset: offsetLabel,
      };
    } catch {
      return {
        targetTimeString: "--:--",
        targetDateOffset: "Invalid time conversion",
      };
    }
  }
}

export const timeService = new TimeService();
