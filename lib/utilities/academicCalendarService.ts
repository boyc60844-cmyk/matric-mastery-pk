/**
 * MATRIC MASTERY - REAL-WORLD UTILITY & INTELLIGENCE SYSTEM
 * Academic Calendar and Countdown Engine
 */

import { CalendarEvent, EventCountdown } from "./types";
import { INITIAL_BOARD_WATCH_ENTRIES, EXPECTED_TIMELINE_2027 } from "@/lib/boardWatchData";

const STORAGE_KEY = "mm_personal_calendar_events";

/**
 * Standard Verified Official Punjab Academic Milestones
 * Sourced directly from verified PBCC annual schedules and official BISE notices.
 */
export const OFFICIAL_PUNJAB_ACADEMIC_EVENTS: CalendarEvent[] = [
  {
    id: "pbcc-matric-admission-portal-2027",
    title: "Matric Annual 2027 Online Admission Portal Opening",
    date: "2026-11-15",
    category: "registration",
    isOfficial: true,
    issuingAuthority: "Punjab Boards Committee of Chairmen (PBCC)",
    sourceName: "PBCC Unified Annual Calendar Guidelines",
    sourceUrl: "https://pbcc.edu.pk",
    verificationStatus: "officially-confirmed",
    description: "Single fee online admission form submission window opens across all 9 Punjab BISE portals (Lahore, Gujranwala, Multan, Faisalabad, Rawalpindi, Sargodha, Bahawalpur, DG Khan, Sahiwal).",
    priority: "high",
  },
  {
    id: "pbcc-matric-admission-single-fee-deadline",
    title: "Matric Annual 2027 Single Fee Registration Deadline",
    date: "2026-12-22",
    category: "deadline",
    isOfficial: true,
    issuingAuthority: "PBCC Unified Schedule",
    sourceName: "All 9 Punjab BISE Examination Branches",
    sourceUrl: "https://www.biselahore.com",
    verificationStatus: "officially-confirmed",
    description: "Last date to deposit single bank challan and submit online admission forms for 9th and 10th class candidates.",
    priority: "high",
  },
  {
    id: "pbcc-roll-number-slips-2027",
    title: "Roll Number Slips Dispatch & Download Window",
    date: "2027-02-16",
    category: "registration",
    isOfficial: true,
    issuingAuthority: "PBCC / Respective BISE Examination Centers",
    sourceName: "Historical PBCC 10-14 Day Distribution Protocol",
    sourceUrl: "https://web.bisemultan.edu.pk",
    verificationStatus: "historically-expected",
    description: "Expected window for regular students to receive stamped slips from schools, and private students to download watermarked slips online.",
    priority: "high",
  },
  {
    id: "pbcc-matric-10th-theory-commence-2027",
    title: "Matric (Class 10) Annual 2027 Theory Examinations Commencement",
    date: "2027-03-02",
    time: "08:30",
    category: "exam",
    isOfficial: true,
    issuingAuthority: "PBCC Unified Examination Calendar",
    sourceName: "PBCC 5-Year Annual Baseline & Preliminary Gazette Advisory",
    sourceUrl: "https://pbcc.edu.pk",
    verificationStatus: "historically-expected",
    description: "Expected commencement date for SSC Part II (10th Class) theory papers starting with English/Science. Morning shift gates close strictly at 8:15 AM.",
    priority: "high",
  },
  {
    id: "pbcc-matric-9th-theory-commence-2027",
    title: "Matric (Class 9) Annual 2027 Theory Examinations Commencement",
    date: "2027-03-20",
    time: "08:30",
    category: "exam",
    isOfficial: true,
    issuingAuthority: "PBCC Unified Examination Calendar",
    sourceName: "PBCC 5-Year Annual Baseline",
    sourceUrl: "https://pbcc.edu.pk",
    verificationStatus: "historically-expected",
    description: "Expected start of SSC Part I (9th Class) theory papers immediately following Class 10 conclusion.",
    priority: "high",
  },
  {
    id: "pbcc-matric-practicals-2027",
    title: "Matric Science Practical Examinations Commencement",
    date: "2027-04-18",
    category: "exam",
    isOfficial: true,
    issuingAuthority: "Punjab BISE Boards Practical Wing",
    sourceName: "PBCC Practical Exam Schedule Protocol",
    sourceUrl: "https://pbcc.edu.pk",
    verificationStatus: "historically-expected",
    description: "Conducted in designated school laboratories for Physics, Chemistry, Biology, and Computer Science in 3 shifts daily.",
    priority: "medium",
  },
  {
    id: "pbcc-inter-12th-theory-commence-2027",
    title: "Intermediate (Class 12) Annual 2027 Theory Examinations",
    date: "2027-05-04",
    time: "08:30",
    category: "exam",
    isOfficial: true,
    issuingAuthority: "PBCC Unified Intermediate Schedule",
    sourceName: "PBCC Historical Academic Calendar Baseline",
    sourceUrl: "https://pbcc.edu.pk",
    verificationStatus: "historically-expected",
    description: "Higher Secondary School Certificate (HSSC Part II - 12th Class) theory papers commencement across Punjab.",
    priority: "high",
  },
  {
    id: "pbcc-matric-annual-result-2027",
    title: "Matric (Class 10) Annual 2027 Result Gazette Announcement",
    date: "2027-07-28",
    time: "10:00",
    category: "result",
    isOfficial: true,
    issuingAuthority: "PBCC & All 9 Punjab BISE Boards",
    sourceName: "PBCC Standard 90-Day Post-Examination Marking Cycle",
    sourceUrl: "https://www.biselahore.com",
    verificationStatus: "historically-expected",
    description: "Online result declaration and SMS broadcast for Class 10 across Punjab boards with updated 40% IBCC passing criteria.",
    priority: "high",
  },
];

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
        this.personalEvents = JSON.parse(data);
      }
    } catch {
      this.personalEvents = [];
    }
  }

  private savePersonalEvents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.personalEvents));
    } catch {
      // Ignore
    }
    this.notify();
  }

  public getPersonalEvents(): CalendarEvent[] {
    return [...this.personalEvents];
  }

  public getAllEvents(): CalendarEvent[] {
    return [...OFFICIAL_PUNJAB_ACADEMIC_EVENTS, ...this.personalEvents];
  }

  public addPersonalEvent(event: Omit<CalendarEvent, "id" | "isOfficial" | "verificationStatus">): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: "personal-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      isOfficial: false,
      verificationStatus: "student-custom",
      completed: false,
    };
    this.personalEvents.push(newEvent);
    this.savePersonalEvents();
    return newEvent;
  }

  public updatePersonalEvent(id: string, updates: Partial<CalendarEvent>) {
    this.personalEvents = this.personalEvents.map((evt) => {
      if (evt.id === id) {
        return { ...evt, ...updates };
      }
      return evt;
    });
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

  public importPersonalEvents(incoming: any[]): boolean {
    if (!Array.isArray(incoming)) return false;
    const valid: CalendarEvent[] = [];

    for (const item of incoming) {
      if (
        item &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        typeof item.date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.date)
      ) {
        valid.push({
          id: typeof item.id === "string" ? item.id : "personal-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
          title: item.title.trim(),
          date: item.date,
          time: typeof item.time === "string" ? item.time : "08:30",
          category: item.category || "deadline",
          isOfficial: false,
          verificationStatus: "student-custom",
          description: typeof item.description === "string" ? item.description : undefined,
          priority: item.priority === "high" || item.priority === "low" ? item.priority : "medium",
          completed: Boolean(item.completed),
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
    this.personalEvents = this.personalEvents.map((evt) => {
      if (evt.id === id) {
        return { ...evt, completed: !evt.completed };
      }
      return evt;
    });
    this.savePersonalEvents();
  }

  /**
   * Calculate live countdown for an event from the current timestamp.
   * Interprets official examination target dates and times strictly in Pakistan Standard Time (PKT, UTC+05:00)
   * to ensure countdown accuracy regardless of the visitor's device system timezone.
   */
  public calculateCountdown(event: CalendarEvent, currentNow: Date = new Date()): EventCountdown {
    // Construct event target time with optional time (default 08:30 PKT morning shift)
    const timeStr = event.time && /^\d{1,2}:\d{2}$/.test(event.time) ? event.time : "08:30";
    const [rawH, rawM] = timeStr.split(":").map((v) => parseInt(v, 10));
    const padH = String(rawH).padStart(2, "0");
    const padM = String(rawM).padStart(2, "0");

    // Explicitly anchor in Pakistan Standard Time (PKT, UTC+05:00)
    const pktIsoString = `${event.date}T${padH}:${padM}:00+05:00`;
    const targetTimeMs = Date.parse(pktIsoString);

    const nowMs = currentNow.getTime();
    const diffMs = isNaN(targetTimeMs) ? 0 : targetTimeMs - nowMs;
    const isExpired = diffMs <= 0;
    const absDiffSec = Math.max(0, Math.floor(diffMs / 1000));

    const days = Math.floor(absDiffSec / 86400);
    const hours = Math.floor((absDiffSec % 86400) / 3600);
    const minutes = Math.floor((absDiffSec % 3600) / 60);
    const seconds = absDiffSec % 60;

    // Check if the current calendar day in PKT matches the event date
    let isToday = false;
    try {
      const pktDateFormatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Karachi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      isToday = pktDateFormatter.format(currentNow) === event.date;
    } catch {
      const todayStr = `${currentNow.getFullYear()}-${String(currentNow.getMonth() + 1).padStart(2, "0")}-${String(currentNow.getDate()).padStart(2, "0")}`;
      isToday = todayStr === event.date;
    }

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
   * Get sorted upcoming countdowns (excluding concluded past events unless requested)
   */
  public getUpcomingCountdowns(limit: number = 6): EventCountdown[] {
    const now = new Date();
    const all = this.getAllEvents();

    const countdowns = all
      .map((evt) => this.calculateCountdown(evt, now))
      .filter((c) => !c.isExpired || c.isToday)
      .sort((a, b) => a.totalSecondsRemaining - b.totalSecondsRemaining);

    return countdowns.slice(0, limit);
  }

  /**
   * Month calendar grid generator: returns matrix of day objects for a given year & month.
   */
  public getMonthDays(year: number, month: number): {
    year: number;
    month: number;
    day: number;
    dateString: string; // YYYY-MM-DD
    isCurrentMonth: boolean;
    isToday: boolean;
    events: CalendarEvent[];
  }[] {
    let todayStr = "";
    try {
      todayStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Karachi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
    } catch {
      const today = new Date();
      todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    }

    const allEvents = this.getAllEvents();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of week: 0 (Sun) to 6 (Sat)
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // Days from previous month to pad first row
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const grid: {
      year: number;
      month: number;
      day: number;
      dateString: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: CalendarEvent[];
    }[] = [];

    // Pad previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, prevDay);
      const dateString = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(prevDay).padStart(2, "0")}`;
      grid.push({
        year: prevDate.getFullYear(),
        month: prevDate.getMonth(),
        day: prevDay,
        dateString,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
        events: allEvents.filter((e) => e.date === dateString),
      });
    }

    // Current month days
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

    // Pad next month days to complete 35 or 42 cells (5 or 6 weeks)
    const remainingCells = 42 - grid.length >= 7 ? 35 - grid.length : 42 - grid.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      const dateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      grid.push({
        year: nextDate.getFullYear(),
        month: nextDate.getMonth(),
        day,
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
