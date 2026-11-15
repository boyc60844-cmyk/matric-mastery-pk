/**
 * MATRIC MASTERY - REAL-WORLD UTILITY & INTELLIGENCE SYSTEM
 * Academic Calendar and PKT (UTC+5) Countdown Engine
 */

import { AwaitingConfirmationItem, CalendarEvent, EventCountdown } from "./types";
import { timeService } from "./timeService";

const STORAGE_KEY = "mm_personal_calendar_events";
const PKT_OFFSET_MS = 5 * 60 * 60 * 1000;
const LAST_VERIFIED_DATE = "15 November 2026";
const DUNYA_PBCC_2027_REPORT_URL =
  "https://dunyanews.tv/en/Pakistan/982883-punjab-announces-schedule-for-2027-matric-annual-examinations";

/**
 * Verified 2026–2027 Punjab Matric Examination & Admission Milestones
 * Note: PBCC's standalone domain (pbcc.edu.pk) does not resolve publicly; circulars are
 * promulgated via member BISEs and reported on 14 November 2026 citing PBCC's 10 November 2026 notice.
 */
export const OFFICIAL_PUNJAB_ACADEMIC_EVENTS: CalendarEvent[] = [
  {
    id: "pbcc-matric-2027-single-fee-deadline",
    title: "Matric Annual 2027 — Single-Fee Admission Deadline",
    date: "2026-12-11",
    time: "23:59",
    category: "deadline",
    isOfficial: true,
    examYear: "Annual 2027",
    classLevel: "Matric (SSC — 2027 Admissions)",
    announcementDate: "10 November 2026",
    lastVerifiedDate: LAST_VERIFIED_DATE,
    issuingAuthority: "Punjab Boards Committee of Chairmen (PBCC)",
    sourceName: "Dunya News — Media Report (citing PBCC 10 Nov 2026 notification)",
    sourceUrl: DUNYA_PBCC_2027_REPORT_URL,
    sourceType: "media-report-citing-official",
    verificationStatus: "officially-confirmed",
    confirmationLabel: "Confirmed",
    description:
      "Single-fee submission window runs 10 November – 11 December 2026 across Punjab BISEs (portal rollout varies by board; verify directly with your district BISE).",
    priority: "high",
  },
  {
    id: "pbcc-matric-2027-double-fee-deadline",
    title: "Matric Annual 2027 — Double-Fee Admission Deadline",
    date: "2026-12-28",
    time: "23:59",
    category: "registration",
    isOfficial: true,
    examYear: "Annual 2027",
    classLevel: "Matric (SSC — 2027 Admissions)",
    announcementDate: "10 November 2026",
    lastVerifiedDate: LAST_VERIFIED_DATE,
    issuingAuthority: "Punjab Boards Committee of Chairmen (PBCC)",
    sourceName: "Dunya News — Media Report (citing PBCC 10 Nov 2026 notification)",
    sourceUrl: DUNYA_PBCC_2027_REPORT_URL,
    sourceType: "media-report-citing-official",
    verificationStatus: "officially-confirmed",
    confirmationLabel: "Confirmed",
    description:
      "Double-fee admission form window for Matric Annual Examination 2027 runs 12 December – 28 December 2026.",
    priority: "medium",
  },
  {
    id: "pbcc-matric-2027-triple-fee-deadline",
    title: "Matric Annual 2027 — Triple-Fee Admission Deadline",
    date: "2027-01-11",
    time: "23:59",
    category: "deadline",
    isOfficial: true,
    examYear: "Annual 2027",
    classLevel: "Matric (SSC — 2027 Admissions)",
    announcementDate: "10 November 2026",
    lastVerifiedDate: LAST_VERIFIED_DATE,
    issuingAuthority: "Punjab Boards Committee of Chairmen (PBCC)",
    sourceName: "Dunya News — Media Report (citing PBCC 10 Nov 2026 notification)",
    sourceUrl: DUNYA_PBCC_2027_REPORT_URL,
    sourceType: "media-report-citing-official",
    verificationStatus: "officially-confirmed",
    confirmationLabel: "Confirmed",
    description:
      "Final triple-fee window runs 29 December 2026 – 11 January 2027 before regular/late admission closes.",
    priority: "high",
  },
  {
    id: "pbcc-class10-exam-2027-start",
    title: "Class 10 / SSC Part-II — First Annual Examination 2027 Start",
    date: "2027-03-16",
    time: "08:30",
    category: "exam",
    isOfficial: true,
    examYear: "Annual 2027",
    classLevel: "Class 10 / SSC Part-II ONLY",
    announcementDate: "10 November 2026",
    lastVerifiedDate: LAST_VERIFIED_DATE,
    issuingAuthority: "Punjab Boards Committee of Chairmen (PBCC)",
    sourceName: "Dunya News — Media Report (citing PBCC 10 Nov 2026 notification)",
    sourceUrl: DUNYA_PBCC_2027_REPORT_URL,
    sourceType: "media-report-citing-official",
    verificationStatus: "officially-confirmed",
    confirmationLabel: "Confirmed",
    description:
      "Confirmed start date for Class 10 / SSC Part-II First Annual Examination 2027 across all 9 Punjab BISE boards. Applies to Class 10 only — Class 9 and Intermediate dates remain unconfirmed.",
    priority: "high",
  },
  {
    id: "pbcc-class10-result-2027",
    title: "Class 10 / SSC Part-II — First Annual 2027 Result Date",
    date: "2027-07-20",
    time: "10:00",
    category: "result",
    isOfficial: true,
    examYear: "Annual 2027",
    classLevel: "Class 10 / SSC Part-II ONLY",
    announcementDate: "10 November 2026",
    lastVerifiedDate: LAST_VERIFIED_DATE,
    issuingAuthority: "Punjab Boards Committee of Chairmen (PBCC)",
    sourceName: "Dunya News — Media Report (citing PBCC 10 Nov 2026 notification)",
    sourceUrl: DUNYA_PBCC_2027_REPORT_URL,
    sourceType: "media-report-citing-official",
    verificationStatus: "officially-confirmed",
    confirmationLabel: "Confirmed",
    description:
      "Confirmed Class 10 / SSC Part-II First Annual Examination 2027 result declaration date across Punjab boards (under IBCC 40% passing & 10-point grading policy).",
    priority: "high",
  },
];

/**
 * Examination Schedules Awaiting Official Confirmation (NO countdowns or estimated dates)
 */
export const AWAITING_CONFIRMATION_EVENTS: AwaitingConfirmationItem[] = [
  {
    id: "awaiting-class9-2027",
    title: "Class 9 / SSC Part-I — Annual Examination 2027",
    examYear: "Annual 2027",
    classLevel: "Class 9 / SSC Part-I",
    status: "Awaiting Official Confirmation",
    description:
      "PBCC's 10 November 2026 announcement specified 16 March 2027 for Class 10 (SSC Part-II) only. No verified Class 9 theory start date has been officially confirmed as of 15 November 2026.",
    lastVerifiedDate: LAST_VERIFIED_DATE,
    officialLinks: [
      { label: "BISE Lahore Notifications", url: "https://www.biselahore.com/notifications" },
      { label: "BISE Multan Portal", url: "https://web.bisemultan.edu.pk/" },
      { label: "PECTAA (ALP & Patterns)", url: "https://pectaa.edu.pk/" },
    ],
  },
  {
    id: "awaiting-inter-2027-exam",
    title: "Intermediate / HSSC — First Annual Examination 2027",
    examYear: "Annual 2027",
    classLevel: "Class 11 & 12 / HSSC Parts I & II",
    status: "Awaiting Official Confirmation",
    description:
      "Official commencement and result dates for Intermediate First Annual Examination 2027 have not yet been announced by PBCC or Punjab BISEs.",
    lastVerifiedDate: LAST_VERIFIED_DATE,
    officialLinks: [
      { label: "BISE Lahore Notifications", url: "https://www.biselahore.com/notifications" },
      { label: "BISE Multan Portal", url: "https://web.bisemultan.edu.pk/" },
      { label: "PECTAA (ALP & Patterns)", url: "https://pectaa.edu.pk/" },
    ],
  },
  {
    id: "awaiting-inter-2027-admissions",
    title: "Intermediate Admission Schedule 2027",
    examYear: "Annual 2027",
    classLevel: "Class 11 & 12 / HSSC Admissions",
    status: "Awaiting Official Confirmation",
    description:
      "Online admission form opening dates and single/double/triple fee schedules for Intermediate Annual Examination 2027 are still awaited across Punjab BISE portals.",
    lastVerifiedDate: LAST_VERIFIED_DATE,
    officialLinks: [
      { label: "BISE Multan Inter Admissions", url: "https://web.bisemultan.edu.pk/admission-inter/" },
      { label: "BISE Lahore Notifications", url: "https://www.biselahore.com/notifications" },
    ],
  },
];

/**
 * Parse a YYYY-MM-DD + optional HH:mm string strictly into a UTC epoch millisecond timestamp
 * anchored in Pakistan Standard Time (PKT, UTC+05:00), independent of device timezone.
 */
export function parsePktDateTimeMs(dateStr: string, timeStr?: string): number | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec((dateStr || "").trim());
  if (!dateMatch) return null;

  const year = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  const day = parseInt(dateMatch[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  // Validate exact Gregorian calendar date without rollover
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }

  let hours = 8;
  let minutes = 30;
  if (timeStr && /^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
    const [rawH, rawM] = timeStr.trim().split(":").map((v) => parseInt(v, 10));
    if (rawH >= 0 && rawH <= 23 && rawM >= 0 && rawM <= 59) {
      hours = rawH;
      minutes = rawM;
    }
  }

  // PKT is permanently UTC+05:00 (no DST in Pakistan)
  return Date.UTC(year, month - 1, day, hours, minutes, 0) - PKT_OFFSET_MS;
}

/**
 * Resolve today's calendar date (year, 0-indexed month, day, YYYY-MM-DD) strictly in PKT (Asia/Karachi).
 */
export function getPktToday(now: Date = timeService.getNow()): {
  year: number;
  month: number;
  day: number;
  dateString: string;
} {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);

    const year = parseInt(parts.find((p) => p.type === "year")?.value || "0", 10);
    const month = parseInt(parts.find((p) => p.type === "month")?.value || "1", 10) - 1;
    const day = parseInt(parts.find((p) => p.type === "day")?.value || "1", 10);
    if (year > 0) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return { year, month, day, dateString };
    }
  } catch {
    // Fallback below uses deterministic UTC+5 math
  }

  const pktShifted = new Date(now.getTime() + PKT_OFFSET_MS);
  const year = pktShifted.getUTCFullYear();
  const month = pktShifted.getUTCMonth();
  const day = pktShifted.getUTCDate();
  return {
    year,
    month,
    day,
    dateString: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

class AcademicCalendarService {
  private personalEvents: CalendarEvent[] = [];
  private subscribers: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.loadPersonalEvents();
    }
  }

  public subscribe(cb: () => void): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  private notify() {
    this.subscribers.forEach((l) => l());
  }

  private loadPersonalEvents() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Ensure only valid user-created personal events are loaded (never stale official clones)
          const seenIds = new Set<string>();
          this.personalEvents = parsed.filter((evt) => {
            if (
              !evt ||
              typeof evt.id !== "string" ||
              typeof evt.title !== "string" ||
              typeof evt.date !== "string" ||
              evt.isOfficial === true ||
              parsePktDateTimeMs(evt.date, evt.time) === null ||
              seenIds.has(evt.id)
            ) {
              return false;
            }
            seenIds.add(evt.id);
            return true;
          });
        }
      }
    } catch {
      this.personalEvents = [];
    }
  }

  private savePersonalEvents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.personalEvents));
    } catch {
      // Ignore storage errors
    }
    this.notify();
  }

  public getPktToday(now?: Date) {
    return getPktToday(now ?? timeService.getNow());
  }

  public getPersonalEvents(): CalendarEvent[] {
    return [...this.personalEvents];
  }

  public getAllEvents(): CalendarEvent[] {
    return [...OFFICIAL_PUNJAB_ACADEMIC_EVENTS, ...this.personalEvents];
  }

  public getAwaitingConfirmationEvents(): AwaitingConfirmationItem[] {
    return [...AWAITING_CONFIRMATION_EVENTS];
  }

  public addPersonalEvent(
    event: Omit<CalendarEvent, "id" | "isOfficial" | "verificationStatus">
  ): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: "personal-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      isOfficial: false,
      sourceType: "personal",
      verificationStatus: "student-custom",
      confirmationLabel: "Personal Goal",
      completed: false,
    };
    this.personalEvents.push(newEvent);
    this.savePersonalEvents();
    return newEvent;
  }

  public updatePersonalEvent(id: string, updates: Partial<CalendarEvent>) {
    this.personalEvents = this.personalEvents.map((evt) =>
      evt.id === id ? { ...evt, ...updates } : evt
    );
    this.savePersonalEvents();
  }

  public deletePersonalEvent(id: string) {
    this.personalEvents = this.personalEvents.filter((evt) => evt.id !== id);
    this.savePersonalEvents();
  }

  public clearPersonalEvents(): void {
    this.personalEvents = [];
    this.savePersonalEvents();
  }

  public reloadPersonalEvents(): void {
    this.loadPersonalEvents();
    this.notify();
  }

  public importPersonalEvents(incoming: unknown[]): boolean {
    if (!Array.isArray(incoming)) return false;
    const valid: CalendarEvent[] = [];

    for (const item of incoming) {
      const rec = item as Record<string, unknown>;
      if (
        rec &&
        typeof rec.title === "string" &&
        rec.title.trim().length > 0 &&
        typeof rec.date === "string" &&
        parsePktDateTimeMs(rec.date, typeof rec.time === "string" ? rec.time : undefined) !== null
      ) {
        const cat = rec.category;
        const validCategory: CalendarEvent["category"] =
          cat === "exam" ||
          cat === "registration" ||
          cat === "result" ||
          cat === "personal" ||
          cat === "deadline" ||
          cat === "study"
            ? cat
            : "deadline";

        valid.push({
          id:
            typeof rec.id === "string"
              ? rec.id
              : "personal-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
          title: rec.title.trim(),
          date: rec.date,
          time: typeof rec.time === "string" ? rec.time : "08:30",
          category: validCategory,
          isOfficial: false,
          sourceType: "personal",
          verificationStatus: "student-custom",
          confirmationLabel: "Personal Goal",
          description: typeof rec.description === "string" ? rec.description : undefined,
          priority: rec.priority === "high" || rec.priority === "low" ? rec.priority : "medium",
          completed: Boolean(rec.completed),
        });
      }
    }

    if (valid.length === 0 && incoming.length > 0) {
      return false;
    }

    this.personalEvents = valid;
    this.savePersonalEvents();
    return true;
  }

  public toggleEventCompleted(id: string) {
    this.personalEvents = this.personalEvents.map((evt) =>
      evt.id === id ? { ...evt, completed: !evt.completed } : evt
    );
    this.savePersonalEvents();
  }

  /**
   * Calculate live countdown for an event strictly in Pakistan Standard Time (PKT, UTC+05:00),
   * never relying on the visitor's local browser timezone.
   */
  public calculateCountdown(
    event: CalendarEvent,
    currentNow: Date = timeService.getNow()
  ): EventCountdown {
    const targetTimeMs = parsePktDateTimeMs(event.date, event.time);
    const nowMs = currentNow.getTime();
    const diffMs = targetTimeMs === null ? 0 : targetTimeMs - nowMs;
    const isExpired = diffMs <= 0;
    const absDiffSec = Math.max(0, Math.floor(diffMs / 1000));

    const days = Math.floor(absDiffSec / 86400);
    const hours = Math.floor((absDiffSec % 86400) / 3600);
    const minutes = Math.floor((absDiffSec % 3600) / 60);
    const seconds = absDiffSec % 60;

    const pktTodayStr = getPktToday(currentNow).dateString;
    const isToday = pktTodayStr === event.date;

    return {
      event,
      totalSecondsRemaining: diffMs > 0 ? absDiffSec : 0,
      days,
      hours,
      minutes,
      seconds,
      isExpired,
      isToday,
    };
  }

  /**
   * Featured Class 10 / SSC Part-II First Annual Examination 2027 countdown (16 March 2027, 08:30 PKT).
   */
  public getPrimaryExamCountdown(currentNow: Date = timeService.getNow()): EventCountdown | null {
    const primary = OFFICIAL_PUNJAB_ACADEMIC_EVENTS.find(
      (evt) => evt.id === "pbcc-class10-exam-2027-start"
    );
    if (!primary) return null;
    return this.calculateCountdown(primary, currentNow);
  }

  /**
   * Sorted upcoming confirmed & personal countdowns in PKT.
   */
  public getUpcomingCountdowns(limit: number = 8): EventCountdown[] {
    const now = timeService.getNow();
    const all = this.getAllEvents();

    const countdowns = all
      .filter((evt) => evt.verificationStatus !== "awaiting-confirmation")
      .map((evt) => this.calculateCountdown(evt, now))
      .filter((c) => !c.isExpired || c.isToday)
      .sort((a, b) => {
        if (a.isToday && !b.isToday) return -1;
        if (!a.isToday && b.isToday) return 1;
        return a.totalSecondsRemaining - b.totalSecondsRemaining;
      });

    return countdowns.slice(0, limit);
  }

  /**
   * Month calendar grid generator using deterministic UTC arithmetic and PKT today highlighting.
   */
  public getMonthDays(
    year: number,
    month: number
  ): {
    year: number;
    month: number;
    day: number;
    dateString: string; // YYYY-MM-DD
    isCurrentMonth: boolean;
    isToday: boolean;
    events: CalendarEvent[];
  }[] {
    const todayStr = getPktToday(timeService.getNow()).dateString;
    const allEvents = this.getAllEvents();

    const firstDayUtc = new Date(Date.UTC(year, month, 1));
    const lastDayUtc = new Date(Date.UTC(year, month + 1, 0));

    const startingDayOfWeek = firstDayUtc.getUTCDay();
    const totalDaysInMonth = lastDayUtc.getUTCDate();
    const prevMonthLastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

    const grid: {
      year: number;
      month: number;
      day: number;
      dateString: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: CalendarEvent[];
    }[] = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = prevMonthLastDay - i;
      const prevDate = new Date(Date.UTC(year, month - 1, prevDay));
      const py = prevDate.getUTCFullYear();
      const pm = prevDate.getUTCMonth();
      const pd = prevDate.getUTCDate();
      const dateString = `${py}-${String(pm + 1).padStart(2, "0")}-${String(pd).padStart(2, "0")}`;
      grid.push({
        year: py,
        month: pm,
        day: pd,
        dateString,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
        events: allEvents.filter((e) => e.date === dateString),
      });
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      grid.push({
        year,
        month,
        day,
        dateString,
        isCurrentMonth: true,
        isToday: dateString === todayStr,
        events: allEvents.filter((e) => e.date === dateString),
      });
    }

    const remainingCells = 42 - grid.length >= 7 ? 35 - grid.length : 42 - grid.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(Date.UTC(year, month + 1, day));
      const ny = nextDate.getUTCFullYear();
      const nm = nextDate.getUTCMonth();
      const nd = nextDate.getUTCDate();
      const dateString = `${ny}-${String(nm + 1).padStart(2, "0")}-${String(nd).padStart(2, "0")}`;
      grid.push({
        year: ny,
        month: nm,
        day: nd,
        dateString,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
        events: allEvents.filter((e) => e.date === dateString),
      });
    }

    return grid;
  }
}

export const academicCalendarService = new AcademicCalendarService();
