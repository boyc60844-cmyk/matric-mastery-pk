/**
 * MATRIC MASTERY — BOARD WATCH ACADEMIC INTELLIGENCE MODULE
 *
 * Centralized, typed dataset and pure date-driven resolvers for:
 * - Academic Sessions (Punjab BISEs & FBISE strictly separated)
 * - Dynamic Academic Phase Determination
 * - Exam Season Radar Milestones (date-driven Completed / Active / Upcoming transitions)
 * - Next Verified Milestone PKT Countdown
 * - Notification Watchlist
 * - Academic Change Log ("What Changed?")
 * - Honest Source Verification & Freshness Metadata
 *
 * NOTE: Reuses PKT arithmetic from lib/utilities/academicCalendarService.ts.
 * Does NOT invent official dates, does NOT simulate background scraping,
 * and never upgrades reported media dates to officially confirmed status.
 */

import { getPktToday, parsePktDateTimeMs } from "@/lib/utilities/academicCalendarService";

export type EducationSystemId = "punjab" | "fbise";
export type AcademicViewSystem = "all" | EducationSystemId;
export type AcademicViewLevel = "all" | "matric" | "inter";

export interface AcademicViewPreferences {
  system: AcademicViewSystem;
  level: AcademicViewLevel;
}

export const DEFAULT_ACADEMIC_VIEW: AcademicViewPreferences = {
  system: "all",
  level: "all",
};

export const ACADEMIC_VIEW_STORAGE_KEY = "mm_board_watch_academic_view_v1";

// ---------------------------------------------------------------------------
// 1. HONEST VERIFICATION & FRESHNESS METADATA
// Never dynamically overwritten by page-visit time.
// ---------------------------------------------------------------------------
export const INTELLIGENCE_AUDIT_METADATA = {
  lastContentUpdate: "18 November 2026",
  lastSourceVerification: "18 November 2026",
  latestVerifiedNotification:
    "All 9 Punjab BISEs Visit Pakistan Post Foundation Islamabad for 2027 OSM Readiness (BISE Multan 17 Nov Update)",
  latestVerifiedUrl: "https://web.bisemultan.edu.pk/events-gallery/",
  dataFreshnessLabel: "Verified Static Snapshot (Manual Portal Audit)",
  honestDisclosure:
    "Runtime clock and countdown math update every second in Pakistan Standard Time (PKT). Board announcements and statuses come from manually audited static records—no automated background portal scraping runs on this page.",
} as const;

// ---------------------------------------------------------------------------
// 2. CENTRALIZED ACADEMIC SESSION DEFINITIONS (UPDATABLE FOR 2027–2028+)
// ---------------------------------------------------------------------------
export type SessionLifecycleStatus = "Upcoming" | "In Progress" | "Ended";

export interface AcademicSessionDefinition {
  id: string;
  sessionLabel: string;
  system: EducationSystemId;
  systemTitle: string;
  authorityLabel: string;
  /**
   * Optional ISO YYYY-MM-DD dates strictly if officially gazetted for the full session.
   * Leave null when no single uniform official start/end circular exists so no fake
   * percentage progress bar is ever fabricated.
   */
  officialStartDate: string | null;
  officialEndDate: string | null;
  fallbackStatus: SessionLifecycleStatus;
  boundaryNote: string;
  activeCycleSummary: {
    all: string;
    matric: string;
    inter: string;
  };
  officialPortalUrl: string;
  officialPortalLabel: string;
  isCurrent: boolean;
}

export const ACADEMIC_SESSIONS: AcademicSessionDefinition[] = [
  {
    id: "punjab-2026-2027",
    sessionLabel: "2026–2027",
    system: "punjab",
    systemTitle: "Punjab Boards (9 BISEs)",
    authorityLabel: "PBCC & PECTAA",
    officialStartDate: null,
    officialEndDate: null,
    fallbackStatus: "In Progress",
    boundaryNote:
      "Uniform province-wide session end date is not fixed in a single circular; status tracks active 2026–27 curriculum & Annual 2027 exam cycle.",
    activeCycleSummary: {
      all: "Matric Annual 2027 Admissions Open (10 Nov 2026 – 11 Jan 2027) · HSSC 2nd Annual 2026 Concluding",
      matric:
        "Matric Annual 2027 Admission Windows Open (10 Nov 2026 – 11 Jan 2027) · PECTAA ALP No. 1238/1255/1257 Active",
      inter:
        "HSSC 2nd Annual 2026 Session Concluding · PECTAA 2027 Patterns (No. 1239/1258) Active · 2027 Inter Dates Awaited",
    },
    officialPortalUrl: "https://pectaa.edu.pk/",
    officialPortalLabel: "PECTAA Official Portal",
    isCurrent: true,
  },
  {
    id: "fbise-2026-2027",
    sessionLabel: "2026–2027",
    system: "fbise",
    systemTitle: "Federal Board (FBISE)",
    authorityLabel: "FBISE Islamabad",
    officialStartDate: null,
    officialEndDate: null,
    fallbackStatus: "In Progress",
    boundaryNote:
      "Separate federal calendar; full Annual 2027 date sheet boundaries are not included in this static audit snapshot.",
    activeCycleSummary: {
      all: "Annual 2027 SLO Model Papers, 40% Passing Policy & 2027 Sample E-Sheets Active",
      matric: "FBISE SSC 2027 Sample E-Sheets (PCBC) & SLO Assessments Active",
      inter: "FBISE HSSC 2027 Sample E-Sheets (Maths) & SLO Assessments Active",
    },
    officialPortalUrl: "https://www.fbise.edu.pk/",
    officialPortalLabel: "FBISE Official Portal",
    isCurrent: true,
  },
];

export function resolveSessionForView(
  system: AcademicViewSystem,
  now: Date
): {
  session: AcademicSessionDefinition;
  status: SessionLifecycleStatus;
  hasOfficialBounds: boolean;
  secondaryNote?: string;
} {
  const targetSystem: EducationSystemId = system === "fbise" ? "fbise" : "punjab";
  const session =
    ACADEMIC_SESSIONS.find((s) => s.system === targetSystem && s.isCurrent) ?? ACADEMIC_SESSIONS[0];

  const hasOfficialBounds = Boolean(session.officialStartDate && session.officialEndDate);
  let status: SessionLifecycleStatus = session.fallbackStatus;

  if (session.officialStartDate && session.officialEndDate) {
    const startMs = parsePktDateTimeMs(session.officialStartDate, "00:00");
    const endMs = parsePktDateTimeMs(session.officialEndDate, "23:59");
    const nowMs = now.getTime();
    if (startMs !== null && endMs !== null) {
      if (nowMs < startMs) status = "Upcoming";
      else if (nowMs > endMs) status = "Ended";
      else status = "In Progress";
    }
  }

  return {
    session,
    status,
    hasOfficialBounds,
    secondaryNote:
      system === "all"
        ? "FBISE runs a separate federal 2026–2027 session. Select FBISE above to switch view."
        : undefined,
  };
}

// ---------------------------------------------------------------------------
// 3. ACADEMIC PHASE INDICATOR (DATE-DRIVEN RULES)
// ---------------------------------------------------------------------------
export type AcademicPhaseType =
  | "Academic Session Active"
  | "Registration & Admissions"
  | "Examination Preparation"
  | "Annual Examination Period"
  | "Practical Examination Period"
  | "Results & Post-Exam Period"
  | "Vacation / Transition Period";

export interface AcademicPhaseRule {
  id: string;
  system: EducationSystemId;
  level: AcademicViewLevel;
  phase: AcademicPhaseType;
  startDate: string; // YYYY-MM-DD PKT
  endDate: string; // YYYY-MM-DD PKT
  isOfficiallySupported: boolean;
  basisNote: string;
  sourceUrl: string;
}

export const ACADEMIC_PHASE_RULES: AcademicPhaseRule[] = [
  {
    id: "phase-punjab-matric-admissions-2027",
    system: "punjab",
    level: "matric",
    phase: "Registration & Admissions",
    startDate: "2026-11-10",
    endDate: "2027-01-11",
    isOfficiallySupported: true,
    basisNote:
      "PBCC 10 Nov 2026 Matric admission fee schedule active (Single: 10 Nov–11 Dec, Double: 12–28 Dec, Triple: 29 Dec–11 Jan 2027).",
    sourceUrl: "https://web.bisemultan.edu.pk/admission-matric/",
  },
];

export function resolveCurrentAcademicPhase(
  system: AcademicViewSystem,
  level: AcademicViewLevel,
  now: Date
): {
  phase: AcademicPhaseType;
  isDateConfigured: boolean;
  basisNote: string;
  sourceUrl?: string;
} {
  const effectiveSystem: EducationSystemId = system === "fbise" ? "fbise" : "punjab";
  const nowMs = now.getTime();

  // Only match a specific phase rule if its date window is officially supported for that system/level
  const matchedRule = ACADEMIC_PHASE_RULES.find((rule) => {
    if (!rule.isOfficiallySupported) return false;
    if (rule.system !== effectiveSystem) return false;
    if (level !== "all" && rule.level !== "all" && rule.level !== level) return false;
    // In General ("all") view, prefer showing the active verified SSC admission window only if applicable
    const startMs = parsePktDateTimeMs(rule.startDate, "00:00");
    const endMs = parsePktDateTimeMs(rule.endDate, "23:59");
    return startMs !== null && endMs !== null && nowMs >= startMs && nowMs <= endMs;
  });

  if (matchedRule) {
    return {
      phase: matchedRule.phase,
      isDateConfigured: true,
      basisNote:
        level === "all" && system === "all"
          ? `${matchedRule.basisNote} (Applies to Punjab Matric admissions; HSSC & FBISE phase dates await official circulars.)`
          : matchedRule.basisNote,
      sourceUrl: matchedRule.sourceUrl,
    };
  }

  if (effectiveSystem === "fbise") {
    return {
      phase: "Academic Session Active",
      isDateConfigured: false,
      basisNote:
        "Phase dates for FBISE Annual 2027 exams are not configured in this static snapshot. Check fbise.edu.pk for official circulars.",
      sourceUrl: "https://www.fbise.edu.pk/",
    };
  }

  if (level === "inter") {
    return {
      phase: "Academic Session Active",
      isDateConfigured: false,
      basisNote:
        "2027 Punjab Intermediate admission and examination phase dates await official PBCC notification (PECTAA No. 1239 & No. 1258 active for study).",
      sourceUrl: "https://web.bisemultan.edu.pk/admission-inter/",
    };
  }

  return {
    phase: "Academic Session Active",
    isDateConfigured: false,
    basisNote:
      "Verified 2026–27 PECTAA ALPs & 40% passing framework active; awaiting finalized board-wide subject date sheets.",
    sourceUrl: "https://pectaa.edu.pk/",
  };
}

// ---------------------------------------------------------------------------
// 4. CENTRALIZED ACADEMIC MILESTONES & EXAM SEASON RADAR
// ---------------------------------------------------------------------------
export type MilestoneCategory =
  | "admission"
  | "registration"
  | "exam"
  | "practical"
  | "datesheet"
  | "roll-slip"
  | "result"
  | "notification";

export type MilestoneConfidence = "confirmed" | "reported" | "unconfirmed";
export type MilestoneRuntimeStatus = "Completed" | "Active" | "Upcoming" | "Reported" | "Unconfirmed";

export interface AcademicMilestone {
  id: string;
  title: string;
  shortTitle: string;
  category: MilestoneCategory;
  system: EducationSystemId;
  level: "matric" | "inter" | "both";
  classLabel: string;
  boardLabel: string;
  /** Optional ISO YYYY-MM-DD dates in PKT. Only populated for real, known dates. */
  startDate?: string;
  endDate?: string;
  /** Target time of day in HH:mm PKT for single deadlines/exam starts */
  targetTimePkt?: string;
  displayDate: string;
  verificationConfidence: MilestoneConfidence;
  /**
   * Strict safeguard: Countdown widget ONLY triggers for events where
   * isEligibleForCountdown === true AND verificationConfidence === "confirmed".
   */
  isEligibleForCountdown: boolean;
  summary: string;
  sourceLabel: string;
  sourceUrl: string;
  lastVerifiedDate: string;
}

export const ACADEMIC_MILESTONES: AcademicMilestone[] = [
  {
    id: "ms-pectaa-alp-published",
    title: "PECTAA 2026–27 ALPs, Pairing Schemes & Model Papers Issued (No. 1238–1258)",
    shortTitle: "PECTAA ALPs & Patterns Published",
    category: "notification",
    system: "punjab",
    level: "both",
    classLabel: "Classes 9, 10, 11 & 12",
    boardLabel: "PECTAA / All 9 Punjab BISEs",
    startDate: "2026-11-06",
    endDate: "2026-11-14",
    displayDate: "6 – 14 Nov 2026",
    verificationConfidence: "confirmed",
    isEligibleForCountdown: false,
    summary:
      "Official ALP & model paper PDFs issued for Grade 9 (No. 1238/1255), Grade 10 (No. 1257), Grade 11 (No. 1239/1256), and Grade 12 (No. 1258).",
    sourceLabel: "PECTAA Official Downloads",
    sourceUrl: "https://pectaa.edu.pk/downloads-2-2/",
    lastVerifiedDate: "15 November 2026",
  },
  {
    id: "ms-ppf-osm-visit",
    title: "All-Punjab BISEs Chairmen & IT Visit to Pakistan Post Foundation (OSM Readiness)",
    shortTitle: "PPF Islamabad OSM Inspection",
    category: "notification",
    system: "punjab",
    level: "both",
    classLabel: "Classes 9–12 (2027 Prep)",
    boardLabel: "All 9 Punjab BISEs (via BISE Multan)",
    startDate: "2026-11-17",
    endDate: "2026-11-17",
    displayDate: "17 Nov 2026",
    verificationConfidence: "confirmed",
    isEligibleForCountdown: false,
    summary:
      "Printing, scanning, and On-Screen Marking briefing conducted ahead of Annual 2027; subject-wise circulars still pending.",
    sourceLabel: "BISE Multan Events Gallery",
    sourceUrl: "https://web.bisemultan.edu.pk/events-gallery/",
    lastVerifiedDate: "18 November 2026",
  },
  {
    id: "ms-matric-single-fee-close",
    title: "Matric Annual 2027 — Single-Fee Admission Deadline",
    shortTitle: "Matric Single-Fee Close",
    category: "admission",
    system: "punjab",
    level: "matric",
    classLabel: "Matric (SSC Annual 2027)",
    boardLabel: "Punjab BISEs (PBCC Schedule)",
    startDate: "2026-11-10",
    endDate: "2026-12-11",
    targetTimePkt: "23:59",
    displayDate: "10 Nov – 11 Dec 2026",
    verificationConfidence: "confirmed",
    isEligibleForCountdown: true,
    summary:
      "Single-fee submission window for Matric Annual 2027; individual board portal activation varies (check your district BISE).",
    sourceLabel: "BISE Multan / BISE Lahore Admission Notice",
    sourceUrl: "https://web.bisemultan.edu.pk/admission-matric/",
    lastVerifiedDate: "15 November 2026",
  },
  {
    id: "ms-matric-double-fee-close",
    title: "Matric Annual 2027 — Double-Fee Admission Deadline",
    shortTitle: "Matric Double-Fee Close",
    category: "admission",
    system: "punjab",
    level: "matric",
    classLabel: "Matric (SSC Annual 2027)",
    boardLabel: "Punjab BISEs (PBCC Schedule)",
    startDate: "2026-12-12",
    endDate: "2026-12-28",
    targetTimePkt: "23:59",
    displayDate: "12 – 28 Dec 2026",
    verificationConfidence: "confirmed",
    isEligibleForCountdown: true,
    summary: "Double-fee admission submission phase across Punjab BISE portals.",
    sourceLabel: "BISE Lahore 9th Pvt Schedule / PBCC",
    sourceUrl: "https://data.biselahore.com/dt/downloads/notifications/admissions/Pvt_RegSch(1stA27).pdf",
    lastVerifiedDate: "15 November 2026",
  },
  {
    id: "ms-matric-triple-fee-close",
    title: "Matric Annual 2027 — Triple-Fee Final Admission Deadline",
    shortTitle: "Matric Triple-Fee Close",
    category: "registration",
    system: "punjab",
    level: "matric",
    classLabel: "Matric (SSC Annual 2027)",
    boardLabel: "Punjab BISEs (PBCC Schedule)",
    startDate: "2026-12-29",
    endDate: "2027-01-11",
    targetTimePkt: "23:59",
    displayDate: "29 Dec 2026 – 11 Jan 2027",
    verificationConfidence: "confirmed",
    isEligibleForCountdown: true,
    summary: "Final late triple-fee submission deadline before Matric Annual 2027 admission closes.",
    sourceLabel: "BISE Lahore / PBCC Schedule",
    sourceUrl: "https://www.biselahore.com/notifications",
    lastVerifiedDate: "15 November 2026",
  },
  {
    id: "ms-matric-class10-reported-start",
    title: "Class 10 (SSC Part-II) Annual Exam 2027 — Indicated Start",
    shortTitle: "Class 10 Annual Exam (Reported)",
    category: "exam",
    system: "punjab",
    level: "matric",
    classLabel: "Class 10 (SSC Part-II Only)",
    boardLabel: "All 9 Punjab BISEs",
    startDate: "2027-03-16",
    endDate: "2027-03-16",
    targetTimePkt: "08:30",
    displayDate: "Reported: 16 Mar 2027 (Final Date Sheet Awaited)",
    verificationConfidence: "reported",
    isEligibleForCountdown: false,
    summary:
      "Cited in Dunya News & ProPakistani (14 Nov 2026) reporting on PBCC's 10 Nov schedule. Direct signed circular & date sheet awaited.",
    sourceLabel: "Dunya News Report (Citing PBCC)",
    sourceUrl: "https://dunyanews.tv/en/Pakistan/982883-punjab-announces-schedule-for-2027-matric-annual-examinations",
    lastVerifiedDate: "18 November 2026",
  },
  {
    id: "ms-matric-class9-unconfirmed",
    title: "Class 9 (SSC Part-I) Annual Exam 2027 Schedule",
    shortTitle: "Class 9 Exam Start (Awaited)",
    category: "datesheet",
    system: "punjab",
    level: "matric",
    classLabel: "Class 9 (SSC Part-I)",
    boardLabel: "All 9 Punjab BISEs",
    displayDate: "Awaiting Official Confirmation",
    verificationConfidence: "unconfirmed",
    isEligibleForCountdown: false,
    summary:
      "No official Class 9 commencement date has been confirmed. Do not assume Class 9 starts on 16 March 2027.",
    sourceLabel: "PBCC Portal",
    sourceUrl: "https://pbcc.edu.pk",
    lastVerifiedDate: "15 November 2026",
  },
  {
    id: "ms-inter-admissions-unconfirmed",
    title: "Intermediate (HSSC) Annual 2027 Admission Schedule",
    shortTitle: "Inter 2027 Admissions (Awaited)",
    category: "admission",
    system: "punjab",
    level: "inter",
    classLabel: "Class 11 & 12 (HSSC)",
    boardLabel: "All 9 Punjab BISEs",
    displayDate: "Awaiting Official Notification",
    verificationConfidence: "unconfirmed",
    isEligibleForCountdown: false,
    summary:
      "BISE Multan admission portal displayed no active 2027 HSSC schedule as of 15 Nov 2026. Watch your district BISE portal.",
    sourceLabel: "BISE Multan Inter Admissions",
    sourceUrl: "https://web.bisemultan.edu.pk/admission-inter/",
    lastVerifiedDate: "15 November 2026",
  },
  {
    id: "ms-inter-exams-unconfirmed",
    title: "Intermediate (HSSC) Annual Exam 2027 Commencement",
    shortTitle: "Inter 2027 Exams (Awaited)",
    category: "exam",
    system: "punjab",
    level: "inter",
    classLabel: "Class 11 & 12 (HSSC)",
    boardLabel: "All 9 Punjab BISEs",
    displayDate: "Awaiting Official Schedule",
    verificationConfidence: "unconfirmed",
    isEligibleForCountdown: false,
    summary:
      "Official 2027 HSSC exam dates have not been issued. Do not mistake historical 20 May 2026 dates for 2027.",
    sourceLabel: "BISE Lahore Notifications",
    sourceUrl: "https://www.biselahore.com/notifications",
    lastVerifiedDate: "15 November 2026",
  },
  {
    id: "ms-matric-class10-result-reported",
    title: "Class 10 (SSC Part-II) Annual 2027 Result — Indicated Date",
    shortTitle: "Class 10 Result (Reported)",
    category: "result",
    system: "punjab",
    level: "matric",
    classLabel: "Class 10 (SSC Part-II)",
    boardLabel: "All 9 Punjab BISEs",
    startDate: "2027-07-20",
    endDate: "2027-07-20",
    targetTimePkt: "10:00",
    displayDate: "Reported: 20 Jul 2027",
    verificationConfidence: "reported",
    isEligibleForCountdown: false,
    summary:
      "Indicated in 14 Nov 2026 news coverage citing PBCC under IBCC's 40% passing & 10-point grading system.",
    sourceLabel: "ProPakistani Report (Citing PBCC)",
    sourceUrl: "https://propakistani.pk/2026/11/14/punjab-announces-matric-exams-2027-result-date/",
    lastVerifiedDate: "15 November 2026",
  },
  {
    id: "ms-fbise-sample-esheets-2027",
    title: "FBISE 2027 Sample E-Sheets & SLO Model Papers Live",
    shortTitle: "FBISE 2027 Sample E-Sheets Live",
    category: "notification",
    system: "fbise",
    level: "both",
    classLabel: "FBISE SSC & HSSC",
    boardLabel: "FBISE Only",
    startDate: "2026-11-18",
    endDate: "2026-11-18",
    displayDate: "Verified Live 18 Nov 2026",
    verificationConfidence: "confirmed",
    isEligibleForCountdown: false,
    summary:
      "Official 2027 SSC-I PCBC and HSSC-I Maths sample E-Sheets available on fbise.edu.pk/screen_marking.php with strict answer-box boundaries.",
    sourceLabel: "FBISE Screen Marking Portal",
    sourceUrl: "https://www.fbise.edu.pk/screen_marking.php",
    lastVerifiedDate: "18 November 2026",
  },
  {
    id: "ms-fbise-2027-schedule-unconfirmed",
    title: "FBISE SSC & HSSC Annual 2027 Exam & Admission Dates",
    shortTitle: "FBISE 2027 Schedule (Check Portal)",
    category: "datesheet",
    system: "fbise",
    level: "both",
    classLabel: "FBISE SSC & HSSC",
    boardLabel: "FBISE Only",
    displayDate: "Check fbise.edu.pk — Not Added to Dataset",
    verificationConfidence: "unconfirmed",
    isEligibleForCountdown: false,
    summary:
      "Exact 2027 FBISE theory date sheets and fee deadlines are not populated in this static dataset; verify directly on fbise.edu.pk.",
    sourceLabel: "FBISE Official Website",
    sourceUrl: "https://www.fbise.edu.pk/",
    lastVerifiedDate: "18 November 2026",
  },
];

export function resolveMilestoneStatus(
  milestone: AcademicMilestone,
  now: Date
): MilestoneRuntimeStatus {
  if (milestone.verificationConfidence === "reported") return "Reported";
  if (milestone.verificationConfidence === "unconfirmed") return "Unconfirmed";

  // Confirmed milestone with exact dates -> automatic PKT date-driven transition
  const nowMs = now.getTime();
  const startMs = milestone.startDate ? parsePktDateTimeMs(milestone.startDate, "00:00") : null;
  const endMs = milestone.endDate
    ? parsePktDateTimeMs(milestone.endDate, milestone.targetTimePkt || "23:59")
    : startMs;

  if (startMs !== null && endMs !== null) {
    if (nowMs > endMs) return "Completed";
    if (nowMs >= startMs && nowMs <= endMs) return "Active";
    return "Upcoming";
  }

  return "Upcoming";
}

export function matchesAcademicView(
  itemSystem: EducationSystemId | "all",
  itemLevel: "matric" | "inter" | "both",
  prefs: AcademicViewPreferences
): boolean {
  const sysMatch =
    prefs.system === "all" || itemSystem === "all" || itemSystem === prefs.system;
  const lvlMatch =
    prefs.level === "all" || itemLevel === "both" || itemLevel === prefs.level;
  return sysMatch && lvlMatch;
}

export function selectRadarMilestones(
  prefs: AcademicViewPreferences,
  now: Date,
  limit: number = 5
): Array<AcademicMilestone & { runtimeStatus: MilestoneRuntimeStatus; isPrioritized: boolean }> {
  const enriched = ACADEMIC_MILESTONES.map((ms) => ({
    ...ms,
    runtimeStatus: resolveMilestoneStatus(ms, now),
    isPrioritized: matchesAcademicView(ms.system, ms.level, prefs),
  }));

  // Filter strictly to selected system when explicitly chosen (keeping FBISE & Punjab clean),
  // while keeping cross-level or major matches prioritized when filtering by level.
  const systemScoped =
    prefs.system === "all"
      ? enriched.filter((m) => m.system === "punjab" || m.id === "ms-fbise-sample-esheets-2027")
      : enriched.filter((m) => m.system === prefs.system);

  // Ensure a chronological mix: up to 1 most recent Completed, Active items, and nearest Upcoming/Reported/Unconfirmed
  const prioritized = systemScoped.filter((m) => m.isPrioritized);
  const pool = prioritized.length >= 2 ? prioritized : systemScoped;

  const completed = pool.filter((m) => m.runtimeStatus === "Completed").slice(-1);
  const currentAndFuture = pool.filter((m) => m.runtimeStatus !== "Completed");

  return [...completed, ...currentAndFuture].slice(0, limit);
}

export interface RadarTimelineNode {
  milestoneId: string;
  shortTitle: string;
  displayDate: string;
  runtimeStatus: MilestoneRuntimeStatus;
  positionPercent: number;
}

export interface RadarTimelineProgress {
  hasValidRange: boolean;
  timelineStartMs: number | null;
  timelineEndMs: number | null;
  startLabel: string;
  endLabel: string;
  progressPercent: number;
  plottedNodes: RadarTimelineNode[];
  excludedCount: number;
}

function formatPktShortDate(ms: number): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(ms));
  } catch {
    return "";
  }
}

export function computeRadarTimelineProgress(
  milestones: Array<AcademicMilestone & { runtimeStatus?: MilestoneRuntimeStatus }>,
  now: Date
): RadarTimelineProgress {
  const confirmedTimed = milestones
    .filter((ms) => ms.verificationConfidence === "confirmed" && Boolean(ms.startDate))
    .map((ms) => {
      const startMs = parsePktDateTimeMs(ms.startDate || "", "00:00");
      const endMs = parsePktDateTimeMs(
        ms.endDate || ms.startDate || "",
        ms.targetTimePkt || "23:59"
      );
      return { ms, startMs, endMs };
    })
    .filter(
      (item): item is { ms: AcademicMilestone & { runtimeStatus?: MilestoneRuntimeStatus }; startMs: number; endMs: number } =>
        item.startMs !== null && item.endMs !== null && item.endMs >= item.startMs
    );

  if (confirmedTimed.length < 2) {
    return {
      hasValidRange: false,
      timelineStartMs: null,
      timelineEndMs: null,
      startLabel: "",
      endLabel: "",
      progressPercent: 0,
      plottedNodes: [],
      excludedCount: milestones.length,
    };
  }

  const timelineStartMs = Math.min(...confirmedTimed.map((item) => item.startMs));
  const timelineEndMs = Math.max(...confirmedTimed.map((item) => item.endMs));
  const totalSpanMs = timelineEndMs - timelineStartMs;

  // Require a genuine multi-day chronological range (> 24h)
  if (totalSpanMs <= 86_400_000) {
    return {
      hasValidRange: false,
      timelineStartMs: null,
      timelineEndMs: null,
      startLabel: "",
      endLabel: "",
      progressPercent: 0,
      plottedNodes: [],
      excludedCount: milestones.length,
    };
  }

  const rawProgress = ((now.getTime() - timelineStartMs) / totalSpanMs) * 100;
  const progressPercent = Math.min(100, Math.max(0, Number(rawProgress.toFixed(2))));

  const plottedNodes: RadarTimelineNode[] = confirmedTimed
    .map(({ ms, endMs }) => {
      const rawPos = ((endMs - timelineStartMs) / totalSpanMs) * 100;
      const positionPercent = Math.min(100, Math.max(0, Number(rawPos.toFixed(2))));
      const status = ms.runtimeStatus ?? resolveMilestoneStatus(ms, now);
      return {
        milestoneId: ms.id,
        shortTitle: ms.shortTitle,
        displayDate: ms.displayDate,
        runtimeStatus: status,
        positionPercent,
      };
    })
    .sort((a, b) => a.positionPercent - b.positionPercent);

  return {
    hasValidRange: true,
    timelineStartMs,
    timelineEndMs,
    startLabel: formatPktShortDate(timelineStartMs),
    endLabel: formatPktShortDate(timelineEndMs),
    progressPercent,
    plottedNodes,
    excludedCount: Math.max(0, milestones.length - confirmedTimed.length),
  };
}

// ---------------------------------------------------------------------------
// 5. NEXT ACADEMIC MILESTONE COUNTDOWN RESOLVER
// ---------------------------------------------------------------------------
export interface NextCountdownResult {
  milestone: AcademicMilestone;
  targetTimestampMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isTodayPkt: boolean;
}

export function getNextVerifiedCountdown(
  prefs: AcademicViewPreferences,
  now: Date
): NextCountdownResult | null {
  const nowMs = now.getTime();
  const pktToday = getPktToday(now).dateString;

  const candidates = ACADEMIC_MILESTONES.filter((ms) => {
    if (ms.verificationConfidence !== "confirmed" || !ms.isEligibleForCountdown) return false;
    if (!matchesAcademicView(ms.system, ms.level, prefs)) return false;

    const targetDate = ms.endDate || ms.startDate;
    if (!targetDate) return false;
    const targetMs = parsePktDateTimeMs(targetDate, ms.targetTimePkt || "23:59");
    return targetMs !== null && targetMs > nowMs;
  })
    .map((ms) => {
      const targetDate = ms.endDate || ms.startDate || "";
      const targetMs = parsePktDateTimeMs(targetDate, ms.targetTimePkt || "23:59") as number;
      return { ms, targetMs, targetDate };
    })
    .sort((a, b) => a.targetMs - b.targetMs);

  if (candidates.length === 0) return null;

  const nearest = candidates[0];
  const diffSec = Math.max(0, Math.floor((nearest.targetMs - nowMs) / 1000));

  return {
    milestone: nearest.ms,
    targetTimestampMs: nearest.targetMs,
    days: Math.floor(diffSec / 86400),
    hours: Math.floor((diffSec % 86400) / 3600),
    minutes: Math.floor((diffSec % 3600) / 60),
    seconds: diffSec % 60,
    isTodayPkt: pktToday === nearest.targetDate,
  };
}

// ---------------------------------------------------------------------------
// 6. NOTIFICATION WATCHLIST
// ---------------------------------------------------------------------------
export type WatchlistStatus =
  | "Monitoring"
  | "Not Announced"
  | "Officially Confirmed"
  | "Updated"
  | "Reported — Awaiting Confirmation";

export interface WatchlistItem {
  id: string;
  title: string;
  topicTag: string;
  system: EducationSystemId | "all";
  level: "matric" | "inter" | "both";
  boardAndClass: string;
  status: WatchlistStatus;
  lastVerifiedDate?: string;
  note: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export const NOTIFICATION_WATCHLIST: WatchlistItem[] = [
  {
    id: "wl-matric-admission-schedule",
    title: "Matric Annual 2027 Admission Schedule & Portal Forms",
    topicTag: "Admissions",
    system: "punjab",
    level: "matric",
    boardAndClass: "All 9 Punjab BISEs · Classes 9 & 10",
    status: "Officially Confirmed",
    lastVerifiedDate: "15 November 2026",
    note: "Single fee 10 Nov–11 Dec, Double 12–28 Dec, Triple 29 Dec–11 Jan 2027 (portal activation varies by BISE).",
    sourceLabel: "BISE Multan Admissions",
    sourceUrl: "https://web.bisemultan.edu.pk/admission-matric/",
  },
  {
    id: "wl-matric-datesheet-2027",
    title: "Matric (Class 9 & 10) Annual 2027 Subject-Wise Date Sheets",
    topicTag: "Date Sheets",
    system: "punjab",
    level: "matric",
    boardAndClass: "All 9 Punjab BISEs · Class 10 & Class 9",
    status: "Reported — Awaiting Confirmation",
    lastVerifiedDate: "18 November 2026",
    note: "Media reports indicate 16 Mar 2027 for Class 10 only; signed PBCC/BISE date sheets awaited (no Class 9 date yet).",
    sourceLabel: "BISE Lahore Notifications",
    sourceUrl: "https://www.biselahore.com/notifications",
  },
  {
    id: "wl-inter-admissions-datesheet-2027",
    title: "Intermediate (Class 11 & 12) 2027 Admissions & Date Sheets",
    topicTag: "Inter Schedule",
    system: "punjab",
    level: "inter",
    boardAndClass: "All 9 Punjab BISEs · HSSC Parts I & II",
    status: "Not Announced",
    lastVerifiedDate: "15 November 2026",
    note: "No official 2027 HSSC fee schedule or exam start dates published yet.",
    sourceLabel: "BISE Multan Inter Portal",
    sourceUrl: "https://web.bisemultan.edu.pk/admission-inter/",
  },
  {
    id: "wl-roll-number-slips-2027",
    title: "Annual 2027 Roll Number Slips (Matric & Intermediate)",
    topicTag: "Roll Number Slips",
    system: "punjab",
    level: "both",
    boardAndClass: "All 9 Punjab BISEs · Classes 9–12",
    status: "Not Announced",
    lastVerifiedDate: "18 November 2026",
    note: "Issued only after admission confirmation and finalized date sheet release (typically 10–15 days pre-exam).",
    sourceLabel: "PBCC Portal",
    sourceUrl: "https://pbcc.edu.pk",
  },
  {
    id: "wl-pectaa-alp-2027",
    title: "PECTAA Smart Syllabus / ALP & Official Pairing Schemes",
    topicTag: "Smart Syllabus & Patterns",
    system: "punjab",
    level: "both",
    boardAndClass: "Punjab BISEs · Grades 9–12 (Except Tarjama/Ethics)",
    status: "Updated",
    lastVerifiedDate: "15 November 2026",
    note: "Notifications No. 1238, 1255, 1257, 1239, 1256 & 1258 issued; no ALP for Tarjama-tul-Quran & Ethics.",
    sourceLabel: "PECTAA Downloads",
    sourceUrl: "https://pectaa.edu.pk/downloads-2-2/",
  },
  {
    id: "wl-ibcc-40-percent-policy",
    title: "IBCC 40% Minimum Passing & 10-Point Grading Implementation",
    topicTag: "Policy Changes",
    system: "all",
    level: "both",
    boardAndClass: "All Punjab BISEs & FBISE · Classes 9–12",
    status: "Officially Confirmed",
    lastVerifiedDate: "15 November 2026",
    note: "Minimum 40% per subject replaces 33%; Phase 2 extends to Classes 10 & 12 in Annual 2027.",
    sourceLabel: "IBCC Official FAQ",
    sourceUrl: "https://ibcc.edu.pk/faqs/new-grading-system-of-ssc-hssc-faqs/",
  },
  {
    id: "wl-punjab-esheet-4-subjects",
    title: "Punjab 2027 4-Science-Subject E-Sheet & OSM Circulars",
    topicTag: "E-Sheet / OSM",
    system: "punjab",
    level: "both",
    boardAndClass: "All 9 Punjab BISEs · Classes 9–12",
    status: "Reported — Awaiting Confirmation",
    lastVerifiedDate: "18 November 2026",
    note: "17 Nov Pakistan Post Foundation readiness visit confirmed; signed provincial circular naming exact 2027 subjects awaited.",
    sourceLabel: "BISE Multan Events Gallery",
    sourceUrl: "https://web.bisemultan.edu.pk/events-gallery/",
  },
  {
    id: "wl-revised-schedules-2027",
    title: "Revised Examination & Practical Schedule Bulletins",
    topicTag: "Revised Schedules",
    system: "all",
    level: "both",
    boardAndClass: "Punjab BISEs & FBISE · Classes 9–12",
    status: "Monitoring",
    lastVerifiedDate: "18 November 2026",
    note: "Track official board notification pages before exam commencement for any centre or holiday adjustments.",
    sourceLabel: "Punjab SED Notifications",
    sourceUrl: "https://schools.punjab.gov.pk/Notifications",
  },
  {
    id: "wl-class10-result-2027",
    title: "2027 Annual Examination Result Announcements",
    topicTag: "Results",
    system: "punjab",
    level: "both",
    boardAndClass: "Punjab BISEs (Class 10 Indicated 20 Jul 2027)",
    status: "Reported — Awaiting Confirmation",
    lastVerifiedDate: "15 November 2026",
    note: "Press coverage cites 20 Jul 2027 for Class 10; formal gazette confirmation & Inter dates remain pending.",
    sourceLabel: "ProPakistani Report",
    sourceUrl: "https://propakistani.pk/2026/11/14/punjab-announces-matric-exams-2027-result-date/",
  },
  {
    id: "wl-fbise-2027-notices",
    title: "FBISE 2027 Sample E-Sheets, SLO Model Papers & Exam Dates",
    topicTag: "FBISE Updates",
    system: "fbise",
    level: "both",
    boardAndClass: "FBISE Affiliated Schools & Private · SSC & HSSC",
    status: "Updated",
    lastVerifiedDate: "18 November 2026",
    note: "2027 sample E-Sheets & SLO papers live on fbise.edu.pk; check portal directly for 2027 date sheet releases.",
    sourceLabel: "FBISE Screen Marking Portal",
    sourceUrl: "https://www.fbise.edu.pk/screen_marking.php",
  },
];

export function getPrioritizedWatchlist(
  prefs: AcademicViewPreferences
): Array<WatchlistItem & { isPrioritized: boolean }> {
  const mapped = NOTIFICATION_WATCHLIST.map((item) => ({
    ...item,
    isPrioritized: matchesAcademicView(item.system, item.level, prefs),
  }));
  return mapped.sort((a, b) => Number(b.isPrioritized) - Number(a.isPrioritized));
}

// ---------------------------------------------------------------------------
// 7. ACADEMIC CHANGE LOG ("WHAT CHANGED?")
// Focuses strictly on significant policy, syllabus, schedule & E-Sheet shifts.
// ---------------------------------------------------------------------------
export interface AcademicChangeLogEntry {
  id: string;
  date: string;
  summary: string;
  affectedScope: string;
  system: EducationSystemId | "all";
  level: "matric" | "inter" | "both";
  verificationType: "official" | "reported";
  statusLabel: "Officially Confirmed" | "Media Report";
  sourceLabel: string;
  sourceUrl: string;
}

export const ACADEMIC_CHANGE_LOG: AcademicChangeLogEntry[] = [
  {
    id: "chg-17-nov-ppf",
    date: "17 Nov 2026",
    summary:
      "Chairmen & IT teams of all 9 Punjab BISEs inspected Pakistan Post Foundation Islamabad printing presses, scanners & OSM marking workflows for Annual 2027 readiness.",
    affectedScope: "All 9 Punjab BISEs · Classes 9–12",
    system: "punjab",
    level: "both",
    verificationType: "official",
    statusLabel: "Officially Confirmed",
    sourceLabel: "BISE Multan Events Gallery",
    sourceUrl: "https://web.bisemultan.edu.pk/events-gallery/",
  },
  {
    id: "chg-14-nov-pectaa-all",
    date: "14 Nov 2026",
    summary:
      "PECTAA issued Grade 10 (No. 1257), Grade 12 (No. 1258), Grade 9 Further (No. 1255), and Grade 11 Masihi Taleem (No. 1256) ALP & 2027 model papers; clarified no ALP for Tarjama-tul-Quran/Ethics.",
    affectedScope: "Punjab BISEs · Grades 9–12",
    system: "punjab",
    level: "both",
    verificationType: "official",
    statusLabel: "Officially Confirmed",
    sourceLabel: "PECTAA Grade 10 PDF No. 1257",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  {
    id: "chg-14-nov-matric-press",
    date: "14 Nov 2026",
    summary:
      "Press reports cited PBCC's 10 Nov schedule indicating Class 10 First Annual starts 16 March 2027 with results on 20 July 2027 (finalized subject date sheet still awaited).",
    affectedScope: "Punjab BISEs · Class 10 Only",
    system: "punjab",
    level: "matric",
    verificationType: "reported",
    statusLabel: "Media Report",
    sourceLabel: "Dunya News",
    sourceUrl: "https://dunyanews.tv/en/Pakistan/982883-punjab-announces-schedule-for-2027-matric-annual-examinations",
  },
  {
    id: "chg-11-nov-esheet-4sub",
    date: "11 Nov 2026",
    summary:
      "Punjab board chairpersons reported agreement to expand E-Sheets & On-Screen Marking to 4 science subjects in 2027 exams (formal subject list circular still pending).",
    affectedScope: "Punjab BISEs · Classes 9–12",
    system: "punjab",
    level: "both",
    verificationType: "reported",
    statusLabel: "Media Report",
    sourceLabel: "ProPakistani",
    sourceUrl: "https://propakistani.pk/2026/11/11/punjab-to-conduct-exams-for-4-subjects-on-e-sheets/",
  },
  {
    id: "chg-10-nov-admissions",
    date: "10 Nov 2026",
    summary:
      "Matric Annual 2027 admission schedule opened (Single fee until 11 Dec, Double until 28 Dec, Triple until 11 Jan 2027); BISE Lahore posted AnswerBook_CSc.pdf & 9th Pvt schedule.",
    affectedScope: "Punjab BISEs · Classes 9 & 10",
    system: "punjab",
    level: "matric",
    verificationType: "official",
    statusLabel: "Officially Confirmed",
    sourceLabel: "BISE Lahore Official PDF",
    sourceUrl: "https://data.biselahore.com/dt/downloads/notifications/admissions/Pvt_RegSch(1stA27).pdf",
  },
  {
    id: "chg-06-nov-pectaa-main",
    date: "06 Nov 2026",
    summary:
      "PECTAA released core Grade 9 (No. 1238) and Grade 11 (No. 1239) Smart Syllabus / ALP & question-wise paper patterns for Session 2026–27.",
    affectedScope: "Punjab BISEs · Grades 9 & 11",
    system: "punjab",
    level: "both",
    verificationType: "official",
    statusLabel: "Officially Confirmed",
    sourceLabel: "PECTAA Grade 9 PDF No. 1238",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  {
    id: "chg-fbise-2027-esheet",
    date: "Verified 18 Nov 2026",
    summary:
      "FBISE published 2027 sample E-Sheets (PCBC SSC-I & Maths HSSC-I) enforcing strict box-boundary rules where out-of-box answers forfeit marks.",
    affectedScope: "FBISE Only · SSC & HSSC",
    system: "fbise",
    level: "both",
    verificationType: "official",
    statusLabel: "Officially Confirmed",
    sourceLabel: "FBISE Screen Marking Portal",
    sourceUrl: "https://www.fbise.edu.pk/screen_marking.php",
  },
  {
    id: "chg-sep-ibcc-policy",
    date: "Sep 2026 (2027 Rollout)",
    summary:
      "IBCC phased grading reform raises subject passing threshold from 33% to 40% with a 10-point (A++ to U) scale expanding to Grades 10 & 12 in 2027, plus B-Form/CNIC on certificates.",
    affectedScope: "Punjab BISEs & FBISE · Classes 9–12",
    system: "all",
    level: "both",
    verificationType: "official",
    statusLabel: "Officially Confirmed",
    sourceLabel: "IBCC Official FAQ",
    sourceUrl: "https://ibcc.edu.pk/faqs/new-grading-system-of-ssc-hssc-faqs/",
  },
];

export function getPrioritizedChangeLog(
  prefs: AcademicViewPreferences,
  filter: "all" | "official" | "reported"
): Array<AcademicChangeLogEntry & { isPrioritized: boolean }> {
  return ACADEMIC_CHANGE_LOG.filter((item) =>
    filter === "all" ? true : item.verificationType === filter
  )
    .map((item) => ({
      ...item,
      isPrioritized: matchesAcademicView(item.system, item.level, prefs),
    }))
    .sort((a, b) => Number(b.isPrioritized) - Number(a.isPrioritized));
}
