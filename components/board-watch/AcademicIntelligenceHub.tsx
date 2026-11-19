"use client";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  ExternalLink,
  Filter,
  GitCommitHorizontal,
  Info,
  ListChecks,
  Radio,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  BW_EASE,
  BW_TWEEN_INTERACTIVE,
  CollapsiblePanel,
  ScrollRevealDiv,
  TabSwitchPanel,
} from "@/components/board-watch/BoardWatchMotion";
import {
  ACADEMIC_VIEW_STORAGE_KEY,
  AcademicMilestone,
  AcademicViewLevel,
  AcademicViewPreferences,
  AcademicViewSystem,
  DEFAULT_ACADEMIC_VIEW,
  INTELLIGENCE_AUDIT_METADATA,
  MilestoneRuntimeStatus,
  RadarTimelineProgress,
  WatchlistStatus,
  computeRadarTimelineProgress,
  getNextVerifiedCountdown,
  getPrioritizedChangeLog,
  getPrioritizedWatchlist,
  resolveCurrentAcademicPhase,
  resolveSessionForView,
  selectRadarMilestones,
} from "@/lib/boardWatchIntelligenceData";
import {
  formatTimezoneOffsetBadge,
  timeService,
} from "@/lib/utilities/timeService";

interface AcademicIntelligenceHubProps {
  totalStories: number;
  confirmedStories: number;
  academicView: AcademicViewPreferences;
  onAcademicViewChange: (next: AcademicViewPreferences) => void;
  onJumpToBoardPortals: () => void;
  onFilterStreamBySystem?: (system: AcademicViewSystem, level: AcademicViewLevel) => void;
}

type TrayTab = "radar" | "watchlist" | "changelog";

function getRadarStatusStyle(status: MilestoneRuntimeStatus): {
  text: string;
  border: string;
  label: string;
} {
  switch (status) {
    case "Completed":
      return {
        text: "text-zinc-400",
        border: "border-zinc-700/70 bg-zinc-900/50",
        label: "Completed",
      };
    case "Active":
      return {
        text: "text-emerald-300",
        border: "border-emerald-500/35 bg-emerald-500/[0.06]",
        label: "Active Now",
      };
    case "Upcoming":
      return {
        text: "text-sky-300",
        border: "border-sky-500/30 bg-sky-500/[0.05]",
        label: "Upcoming Confirmed",
      };
    case "Reported":
      return {
        text: "text-amber-300",
        border: "border-amber-500/30 bg-amber-500/[0.05]",
        label: "Reported (Not Final)",
      };
    case "Unconfirmed":
    default:
      return {
        text: "text-zinc-300",
        border: "border-white/10 bg-[#141417]",
        label: "Awaiting Notice",
      };
  }
}

function getWatchlistStatusTone(status: WatchlistStatus): string {
  switch (status) {
    case "Officially Confirmed":
      return "text-emerald-300";
    case "Updated":
      return "text-accent";
    case "Reported — Awaiting Confirmation":
      return "text-amber-300";
    case "Monitoring":
      return "text-sky-300";
    case "Not Announced":
    default:
      return "text-zinc-400";
  }
}

type EnrichedRadarMilestone = AcademicMilestone & {
  runtimeStatus: MilestoneRuntimeStatus;
  isPrioritized: boolean;
};

/**
 * Milestone marker dot.
 * Strictly ONLY Active milestones animate (1 -> 1.10 -> 1 over ~2.6s easeInOut with
 * soft electric-yellow breathing halo); all other statuses and reduced-motion remain static.
 */
function RadarStatusMarker({
  status,
  prefersReducedMotion,
  size = "sm",
  title,
}: {
  status: MilestoneRuntimeStatus;
  prefersReducedMotion: boolean;
  size?: "sm" | "rail";
  title?: string;
}) {
  const isActive = status === "Active";
  const boxSize = size === "rail" ? "h-3 w-3" : "h-2.5 w-2.5";
  const coreSize = size === "rail" ? "h-2 w-2" : "h-1.5 w-1.5";

  if (isActive && !prefersReducedMotion) {
    return (
      <span
        title={title}
        data-milestone-marker="active-pulsing"
        data-milestone-status={status}
        className={`relative inline-flex ${boxSize} items-center justify-center shrink-0`}
      >
        <motion.span
          aria-hidden="true"
          animate={{ scale: [1, 1.7, 1], opacity: [0.55, 0.12, 0.55] }}
          transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-[#FFD60A]/45 pointer-events-none"
        />
        <motion.span
          aria-hidden="true"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
          className={`relative rounded-full ${coreSize} bg-[#FFD60A]`}
        />
      </span>
    );
  }

  let dotClass = "bg-zinc-500";
  if (isActive) {
    dotClass = "bg-[#FFD60A] ring-2 ring-[#FFD60A]/30";
  } else if (status === "Completed") {
    dotClass = "bg-zinc-400";
  } else if (status === "Upcoming") {
    dotClass = "bg-sky-400";
  } else if (status === "Reported") {
    dotClass = "border border-amber-400 bg-[#121215]";
  } else {
    dotClass = "border border-zinc-500 bg-[#121215]";
  }

  return (
    <span
      title={title}
      data-milestone-marker="static"
      data-milestone-status={status}
      className={`relative inline-flex ${boxSize} items-center justify-center shrink-0`}
    >
      <span aria-hidden="true" className={`rounded-full ${coreSize} ${dotClass}`} />
    </span>
  );
}

interface ExamSeasonRadarPanelProps {
  milestones: EnrichedRadarMilestone[];
  timelineProgress: RadarTimelineProgress;
  prefersReducedMotion: boolean;
  animateRailEntrance: boolean;
  onRailEntranceComplete: () => void;
}

const ExamSeasonRadarPanel = memo(function ExamSeasonRadarPanel({
  milestones,
  timelineProgress,
  prefersReducedMotion,
  animateRailEntrance,
  onRailEntranceComplete,
}: ExamSeasonRadarPanelProps) {
  const progressRatio = Math.min(1, Math.max(0, timelineProgress.progressPercent / 100));

  return (
    <div className="exam-season-radar space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <Activity size={13} className="text-accent" />
          <span>
            Date-driven milestone sequence (Completed · Active · Upcoming Confirmed · Reported / Awaiting Notice)
          </span>
        </span>
        <span className="font-mono text-zinc-500">
          Reported dates never convert to Confirmed automatically
        </span>
      </div>

      {/* DATE-AWARE CHRONOLOGICAL PROGRESS RAIL */}
      <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 space-y-1.5">
        {timelineProgress.hasValidRange ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center justify-between sm:contents">
                <span className="tabular-nums">{timelineProgress.startLabel}</span>
                <span className="tabular-nums sm:order-3">{timelineProgress.endLabel}</span>
              </div>
              <span className="text-zinc-300 tabular-nums text-center sm:order-2">
                Elapsed Window (PKT):{" "}
                <strong className="text-[#FFD60A] font-semibold">
                  {timelineProgress.progressPercent.toFixed(1)}%
                </strong>
              </span>
            </div>

            <div className="relative mx-3 h-7 flex items-center">
              {/* Neutral base track */}
              <div className="relative h-1 w-full rounded-full bg-white/10 overflow-hidden">
                {prefersReducedMotion ? (
                  <div
                    data-radar-progress-fill="true"
                    data-progress-percent={timelineProgress.progressPercent}
                    style={{ width: `${timelineProgress.progressPercent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-[#FFD60A]/55 via-[#FFD60A]/85 to-[#FFD60A]"
                  />
                ) : (
                  <motion.div
                    data-radar-progress-fill="true"
                    data-progress-percent={timelineProgress.progressPercent}
                    initial={animateRailEntrance ? { scaleX: 0 } : false}
                    animate={{ scaleX: progressRatio }}
                    transition={
                      animateRailEntrance
                        ? { duration: 0.95, ease: BW_EASE }
                        : { duration: 0.35, ease: BW_EASE }
                    }
                    onAnimationComplete={() => {
                      if (animateRailEntrance) onRailEntranceComplete();
                    }}
                    className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#FFD60A]/55 via-[#FFD60A]/85 to-[#FFD60A]"
                  />
                )}
              </div>

              {/* Confirmed dated milestone markers aligned chronologically */}
              {timelineProgress.plottedNodes.map((node) => (
                <div
                  key={node.milestoneId}
                  style={{ left: `${node.positionPercent}%` }}
                  className="absolute top-1/2 -ml-1.5 -mt-1.5 z-10 flex items-center justify-center"
                >
                  <RadarStatusMarker
                    status={node.runtimeStatus}
                    prefersReducedMotion={prefersReducedMotion}
                    size="rail"
                    title={`${node.shortTitle} (${node.displayDate})`}
                  />
                </div>
              ))}

              {/* Today marker anchored to current PKT progress endpoint */}
              {prefersReducedMotion ? (
                <div
                  data-radar-today-marker="true"
                  style={{ left: `${timelineProgress.progressPercent}%` }}
                  title={`Current PKT Date (${timelineProgress.progressPercent.toFixed(1)}% of confirmed range)`}
                  className="pointer-events-none absolute top-0 bottom-0 w-10 -ml-5 z-20 flex flex-col items-center justify-between"
                >
                  <span className="text-[9px] font-mono leading-none text-white/90 whitespace-nowrap select-none">
                    Today
                  </span>
                  <span className="h-2.5 w-0.5 rounded-full bg-white/90" />
                </div>
              ) : (
                <motion.div
                  data-radar-today-marker="true"
                  style={{ left: `${timelineProgress.progressPercent}%` }}
                  initial={animateRailEntrance ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: animateRailEntrance ? 0.3 : 0,
                    duration: 0.4,
                    ease: BW_EASE,
                  }}
                  title={`Current PKT Date (${timelineProgress.progressPercent.toFixed(1)}% of confirmed range)`}
                  className="pointer-events-none absolute top-0 bottom-0 w-10 -ml-5 z-20 flex flex-col items-center justify-between"
                >
                  <span className="text-[9px] font-mono leading-none text-white/90 whitespace-nowrap select-none">
                    Today
                  </span>
                  <span className="h-2.5 w-0.5 rounded-full bg-white/90" />
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-1.5 py-0.5">
            <div className="h-1 w-full rounded-full bg-white/10" />
            <p className="text-[10px] font-mono text-zinc-500">
              No confirmed multi-date chronological span for this selection — neutral rail retained (no estimated progress).
            </p>
          </div>
        )}
      </div>

      {/* MILESTONE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {milestones.map((ms) => {
          const tone = getRadarStatusStyle(ms.runtimeStatus);
          return (
            <div
              key={ms.id}
              className={`rounded-xl border p-3 flex flex-col justify-between gap-2 transition-colors duration-200 ${tone.border}`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                  <span className={`inline-flex items-center gap-1.5 font-bold ${tone.text}`}>
                    <RadarStatusMarker
                      status={ms.runtimeStatus}
                      prefersReducedMotion={prefersReducedMotion}
                      size="sm"
                    />
                    <span>{tone.label}</span>
                  </span>
                  <span className="text-zinc-500">{ms.system === "fbise" ? "FBISE" : "Punjab"}</span>
                </div>

                <h4 className="font-heading text-xs font-bold text-white leading-snug">
                  {ms.shortTitle}
                </h4>

                <p className="text-[11px] font-mono text-zinc-300 tabular-nums">
                  {ms.displayDate}
                </p>

                <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                  {ms.classLabel}
                </p>
              </div>

              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-2 text-[10px]">
                <span className="text-zinc-500 truncate">{ms.boardLabel}</span>
                <a
                  href={ms.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-mono text-accent hover:underline shrink-0"
                >
                  <span>Source</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default function AcademicIntelligenceHub({
  totalStories,
  confirmedStories,
  academicView,
  onAcademicViewChange,
  onJumpToBoardPortals,
  onFilterStreamBySystem,
}: AcademicIntelligenceHubProps) {
  const prefersReducedMotion = useReducedMotion();

  // Live PKT clock backed strictly by existing timeService (no duplicate timer API)
  const [now, setNow] = useState<Date>(() => timeService.getNow());
  const [activeTray, setActiveTray] = useState<TrayTab>("radar");
  const [trayExpanded, setTrayExpanded] = useState<boolean>(true);
  const [changeFilter, setChangeFilter] = useState<"all" | "official" | "reported">("all");
  const [watchlistShowAll, setWatchlistShowAll] = useState<boolean>(false);
  const hasPlayedRadarRailEntranceRef = useRef<boolean>(false);

  useEffect(() => {
    setNow(timeService.getNow());
    const unsub = timeService.subscribe(() => {
      setNow(timeService.getNow());
    });
    return unsub;
  }, []);

  // Load saved lightweight personalization from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ACADEMIC_VIEW_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const sys: AcademicViewSystem =
        parsed?.system === "punjab" || parsed?.system === "fbise" ? parsed.system : "all";
      const lvl: AcademicViewLevel =
        parsed?.level === "matric" || parsed?.level === "inter" ? parsed.level : "all";
      if (sys !== academicView.system || lvl !== academicView.level) {
        onAcademicViewChange({ system: sys, level: lvl });
      }
    } catch {
      // Ignore storage read errors cleanly
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateView = (next: AcademicViewPreferences) => {
    onAcademicViewChange(next);
    try {
      localStorage.setItem(ACADEMIC_VIEW_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage write errors cleanly
    }
  };

  // PKT Formatted Time & Date (Asia/Karachi) via timeService
  const pktClock = useMemo(() => {
    // Re-evaluates cleanly each second as `now` updates
    void now;
    const formatted = timeService.formatTimeForZone("Asia/Karachi", "12h", true);
    const offsetBadge = formatTimezoneOffsetBadge("Asia/Karachi", now);
    return { ...formatted, offsetBadge };
  }, [now]);

  // Resolved Session, Phase, Countdown, Radar, Watchlist & Change Log
  const sessionState = useMemo(
    () => resolveSessionForView(academicView.system, now),
    [academicView.system, now]
  );

  const phaseState = useMemo(
    () => resolveCurrentAcademicPhase(academicView.system, academicView.level, now),
    [academicView.system, academicView.level, now]
  );

  const nextCountdown = useMemo(
    () => getNextVerifiedCountdown(academicView, now),
    [academicView, now]
  );

  // Quantize Radar chronological progress & milestone status checks to 1-minute buckets
  // so 1s clock updates never trigger unnecessary Radar re-renders.
  const minuteBucket = Math.floor(now.getTime() / 60000);

  const radarMilestones = useMemo(
    () => selectRadarMilestones(academicView, new Date(minuteBucket * 60000), 5),
    [academicView, minuteBucket]
  );

  const radarTimelineProgress = useMemo(
    () => computeRadarTimelineProgress(radarMilestones, new Date(minuteBucket * 60000)),
    [radarMilestones, minuteBucket]
  );

  const handleRailEntranceComplete = useMemo(
    () => () => {
      hasPlayedRadarRailEntranceRef.current = true;
    },
    []
  );

  // Also mark entrance complete if user leaves the Radar tab mid-animation
  useEffect(() => {
    if (activeTray === "radar" && radarTimelineProgress.hasValidRange) {
      return () => {
        hasPlayedRadarRailEntranceRef.current = true;
      };
    }
  }, [activeTray, radarTimelineProgress.hasValidRange]);

  const watchlistItems = useMemo(
    () => getPrioritizedWatchlist(academicView),
    [academicView]
  );

  const changeLogItems = useMemo(
    () => getPrioritizedChangeLog(academicView, changeFilter),
    [academicView, changeFilter]
  );

  const visibleWatchlist = watchlistShowAll ? watchlistItems : watchlistItems.slice(0, 6);
  const isCustomViewActive =
    academicView.system !== "all" || academicView.level !== "all";

  return (
    <section
      aria-label="Academic Intelligence Overview"
      className="space-y-3"
    >
      {/* ROW 1: PERSONALIZATION BAR + LIVE PKT ACADEMIC CLOCK */}
      <ScrollRevealDiv
        duration={0.38}
        y={8}
        className="rounded-2xl border border-white/10 bg-[#121215] px-3.5 py-2.5 sm:px-4 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5"
      >
        {/* My Academic View — Lightweight Local Personalization */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 shrink-0">
            <Compass size={13} className="text-accent shrink-0" />
            <span className="font-semibold text-zinc-200 whitespace-nowrap">My Academic View</span>
          </div>

          {/* Education System Selector */}
          <div
            role="group"
            aria-label="Select education system"
            className="inline-flex items-center rounded-lg border border-white/10 bg-black/50 p-0.5"
          >
            {(
              [
                { id: "all" as const, label: "All Boards" },
                { id: "punjab" as const, label: "Punjab BISEs" },
                { id: "fbise" as const, label: "FBISE" },
              ]
            ).map((sys) => {
              const active = academicView.system === sys.id;
              return (
                <button
                  key={sys.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => updateView({ ...academicView, system: sys.id })}
                  className={`relative rounded-md px-2.5 py-1 text-[11px] font-heading font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
                    active ? "text-black font-bold" : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bw-intel-system-pill"
                      transition={prefersReducedMotion ? { duration: 0 } : BW_TWEEN_INTERACTIVE}
                      className="pointer-events-none absolute inset-0 rounded-md bg-accent"
                    />
                  )}
                  <span className="relative z-10">{sys.label}</span>
                </button>
              );
            })}
          </div>

          {/* Class Level Selector */}
          <div
            role="group"
            aria-label="Select class level"
            className="inline-flex items-center rounded-lg border border-white/10 bg-black/50 p-0.5"
          >
            {(
              [
                { id: "all" as const, label: "Classes 9–12" },
                { id: "matric" as const, label: "Matric (9–10)" },
                { id: "inter" as const, label: "Inter (11–12)" },
              ]
            ).map((lvl) => {
              const active = academicView.level === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => updateView({ ...academicView, level: lvl.id })}
                  className={`relative rounded-md px-2.5 py-1 text-[11px] font-heading font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
                    active ? "text-white font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bw-intel-level-pill"
                      transition={prefersReducedMotion ? { duration: 0 } : BW_TWEEN_INTERACTIVE}
                      className="pointer-events-none absolute inset-0 rounded-md bg-white/15 border border-white/15"
                    />
                  )}
                  <span className="relative z-10">{lvl.label}</span>
                </button>
              );
            })}
          </div>

          {isCustomViewActive && (
            <div className="flex items-center gap-2">
              {onFilterStreamBySystem && (
                <button
                  type="button"
                  onClick={() => onFilterStreamBySystem(academicView.system, academicView.level)}
                  className="text-[11px] font-mono text-accent hover:underline cursor-pointer whitespace-nowrap"
                >
                  Apply to News Feed
                </button>
              )}
              <button
                type="button"
                onClick={() => updateView(DEFAULT_ACADEMIC_VIEW)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer whitespace-nowrap"
                title="Reset My Academic View"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>

        {/* Live PKT Academic Clock */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono border-t border-white/10 pt-2 xl:border-t-0 xl:pt-0 xl:border-l xl:pl-3.5 shrink-0">
          <Clock size={13} className="text-accent shrink-0" />
          <span className="text-white font-bold tabular-nums tracking-tight whitespace-nowrap">
            {pktClock.timeString}
            {pktClock.period ? ` ${pktClock.period}` : ""}
          </span>
          <span className="text-zinc-400 text-[11px] whitespace-nowrap">
            PKT ({pktClock.offsetBadge})
          </span>
          <span aria-hidden="true" className="text-zinc-600">
            ·
          </span>
          <span className="text-zinc-300 text-[11px] tabular-nums whitespace-nowrap">
            {pktClock.dateString}
          </span>
          <span aria-hidden="true" className="text-zinc-600 hidden sm:inline">
            ·
          </span>
          <span className="text-accent/90 text-[11px] hidden sm:inline whitespace-nowrap">
            Session {sessionState.session.sessionLabel}
          </span>
        </div>
      </ScrollRevealDiv>

      {/* ROW 2: 3-COLUMN COMPACT INTELLIGENCE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* CARD 1: LIVE ACADEMIC SESSION + DYNAMIC ACADEMIC PHASE */}
        <ScrollRevealDiv
          delay={0.04}
          duration={0.4}
          y={10}
          className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#141416] p-4 flex flex-col justify-between gap-3"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-zinc-400">Academic Session · {sessionState.session.authorityLabel}</span>
              <span className="text-emerald-300 font-semibold">{sessionState.status}</span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-heading text-base sm:text-lg font-extrabold text-white tracking-tight">
                {sessionState.session.systemTitle} — {sessionState.session.sessionLabel}
              </h2>
            </div>

            {/* Dynamic Academic Phase Indicator */}
            <div className="pt-1 border-t border-white/10 space-y-1">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-mono text-zinc-400">Current Phase</span>
                <span
                  className={`font-heading font-bold ${
                    phaseState.isDateConfigured ? "text-accent" : "text-zinc-200"
                  }`}
                >
                  {phaseState.phase}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{phaseState.basisNote}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[11px] space-y-1">
            <p className="text-zinc-300 leading-relaxed">
              <span className="text-zinc-400 font-mono">Cycle: </span>
              {sessionState.session.activeCycleSummary[academicView.level]}
            </p>
            {!sessionState.hasOfficialBounds && (
              <p className="text-[10px] text-zinc-500 leading-snug">
                {sessionState.session.boundaryNote}
                {sessionState.secondaryNote ? ` ${sessionState.secondaryNote}` : ""}
              </p>
            )}
          </div>
        </ScrollRevealDiv>

        {/* CARD 2: NEXT VERIFIED MILESTONE — LIVE PKT COUNTDOWN */}
        <ScrollRevealDiv
          delay={0.08}
          duration={0.4}
          y={10}
          className="lg:col-span-4 rounded-2xl border border-accent/25 bg-[#141416] p-4 flex flex-col justify-between gap-3"
        >
          {nextCountdown ? (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1.5 text-accent font-semibold">
                    <CalendarClock size={13} />
                    <span>Next Confirmed Milestone</span>
                  </span>
                  <span className="text-emerald-300">Verified PKT</span>
                </div>

                <h3 className="font-heading text-sm sm:text-base font-bold text-white leading-snug">
                  {nextCountdown.milestone.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-mono text-zinc-400">
                  <span>{nextCountdown.milestone.classLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{nextCountdown.milestone.boardLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-200">{nextCountdown.milestone.displayDate}</span>
                </div>
              </div>

              {/* Live Ticking Countdown Digits (Tabular Numerals, Hairline Divided) */}
              <div className="grid grid-cols-4 divide-x divide-white/10 border-y border-white/10 py-2">
                {[
                  { label: "Days", value: String(nextCountdown.days).padStart(2, "0") },
                  { label: "Hours", value: String(nextCountdown.hours).padStart(2, "0") },
                  { label: "Min", value: String(nextCountdown.minutes).padStart(2, "0") },
                  { label: "Sec", value: String(nextCountdown.seconds).padStart(2, "0") },
                ].map((unit) => (
                  <div key={unit.label} className="px-1 text-center">
                    <span className="block font-mono text-lg sm:text-xl font-black text-accent tabular-nums leading-none">
                      {unit.value}
                    </span>
                    <span className="block mt-1 text-[10px] font-mono text-zinc-400">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 text-[11px]">
                <span className="text-zinc-400 truncate">
                  {nextCountdown.isTodayPkt
                    ? "Closes tonight at 11:59 PM PKT"
                    : "Note: 16 Mar 2027 exam start is Reported only"}
                </span>
                <a
                  href={nextCountdown.milestone.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-accent hover:underline shrink-0"
                >
                  <span>Source</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-between h-full gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1.5 text-zinc-300 font-semibold">
                    <CalendarClock size={13} className="text-zinc-400" />
                    <span>Next Confirmed Milestone</span>
                  </span>
                  <span className="text-amber-300">No Confirmed Date</span>
                </div>

                <h3 className="font-heading text-sm sm:text-base font-bold text-white">
                  {academicView.system === "fbise"
                    ? "No Verified 2027 FBISE Deadline Dates in Dataset"
                    : "Intermediate 2027 Confirmed Dates Awaited"}
                </h3>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {academicView.system === "fbise"
                    ? "Countdown timers only activate for verified upcoming dates. Check fbise.edu.pk directly for Federal Board 2027 admission and date sheet circulars."
                    : "Official 2027 Intermediate (HSSC) admission windows and exam start dates have not been notified by PBCC or Punjab BISEs yet."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px]">
                <a
                  href={sessionState.session.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-accent hover:underline"
                >
                  <span>{sessionState.session.officialPortalLabel}</span>
                  <ExternalLink size={11} />
                </a>
                <button
                  type="button"
                  onClick={onJumpToBoardPortals}
                  className="font-mono text-zinc-300 hover:text-white cursor-pointer"
                >
                  View Board Portals
                </button>
              </div>
            </div>
          )}
        </ScrollRevealDiv>

        {/* CARD 3: BOARD ACTIVITY / SOURCE VERIFICATION TRANSPARENCY */}
        <ScrollRevealDiv
          delay={0.12}
          duration={0.4}
          y={10}
          className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#141416] p-4 flex flex-col justify-between gap-3"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1.5 text-zinc-200 font-semibold whitespace-nowrap">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>Board Activity</span>
              </span>
              <span className="text-zinc-400 tabular-nums whitespace-nowrap">
                {totalStories} stories · {confirmedStories} confirmed
              </span>
            </div>

            {/* Distinct, honest timestamp separation */}
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] pt-1 border-t border-white/10">
              <div>
                <dt className="font-mono text-zinc-500">Last Content Update</dt>
                <dd className="text-white font-semibold tabular-nums">
                  {INTELLIGENCE_AUDIT_METADATA.lastContentUpdate}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-zinc-500">Last Source Audit</dt>
                <dd className="text-emerald-300 font-semibold tabular-nums">
                  {INTELLIGENCE_AUDIT_METADATA.lastSourceVerification}
                </dd>
              </div>
              <div className="col-span-2 pt-0.5">
                <dt className="font-mono text-zinc-500">Data Model</dt>
                <dd className="text-zinc-300">{INTELLIGENCE_AUDIT_METADATA.dataFreshnessLabel}</dd>
              </div>
            </dl>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-zinc-300 leading-snug line-clamp-2">
                <strong className="text-white font-semibold">Latest verified: </strong>
                {INTELLIGENCE_AUDIT_METADATA.latestVerifiedNotification}
              </span>
              <a
                href={INTELLIGENCE_AUDIT_METADATA.latestVerifiedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline shrink-0 mt-0.5"
                title="Open BISE Multan Events Gallery"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </ScrollRevealDiv>
      </div>

      {/* ROW 3: COMPACT INTERACTIVE INTELLIGENCE TRAY (RADAR · WATCHLIST · WHAT CHANGED?) */}
      <ScrollRevealDiv
        delay={0.14}
        duration={0.4}
        y={10}
        className="rounded-2xl border border-white/10 bg-[#121215]"
      >
        <div className="px-3.5 py-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {(
              [
                {
                  id: "radar" as const,
                  label: `Exam Season Radar (${radarMilestones.length})`,
                  icon: <Radio size={13} />,
                },
                {
                  id: "watchlist" as const,
                  label: `Notification Watchlist (${watchlistItems.length})`,
                  icon: <ListChecks size={13} />,
                },
                {
                  id: "changelog" as const,
                  label: "What Changed?",
                  icon: <GitCommitHorizontal size={13} />,
                },
              ]
            ).map((tab) => {
              const active = activeTray === tab.id && trayExpanded;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setActiveTray(tab.id);
                    if (!trayExpanded) setTrayExpanded(true);
                  }}
                  className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-heading font-bold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
                    active ? "text-black" : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bw-intel-tray-tab"
                      transition={prefersReducedMotion ? { duration: 0 } : BW_TWEEN_INTERACTIVE}
                      className="pointer-events-none absolute inset-0 rounded-lg bg-accent"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setTrayExpanded((v) => !v)}
            aria-expanded={trayExpanded}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer shrink-0 py-1 px-2"
          >
            <span>{trayExpanded ? "Minimize" : "Expand"}</span>
            {trayExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        <CollapsiblePanel isOpen={trayExpanded}>
          <div className="p-3.5 sm:p-4">
            <TabSwitchPanel panelKey={activeTray}>
              {/* TRAY 1: EXAM SEASON RADAR */}
              {activeTray === "radar" && (
                <ExamSeasonRadarPanel
                  milestones={radarMilestones}
                  timelineProgress={radarTimelineProgress}
                  prefersReducedMotion={Boolean(prefersReducedMotion)}
                  animateRailEntrance={!hasPlayedRadarRailEntranceRef.current}
                  onRailEntranceComplete={handleRailEntranceComplete}
                />
              )}

              {/* TRAY 2: NOTIFICATION WATCHLIST */}
              {activeTray === "watchlist" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
                    <span>
                      Static verification checklist tracking key 2026–2027 student notices (no automated push alerts).
                    </span>
                    {watchlistItems.length > 6 && (
                      <button
                        type="button"
                        onClick={() => setWatchlistShowAll((v) => !v)}
                        className="font-mono text-accent hover:underline cursor-pointer"
                      >
                        {watchlistShowAll
                          ? "Show compact (6)"
                          : `Show all ${watchlistItems.length} tracked notices`}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {visibleWatchlist.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-3 flex flex-col justify-between gap-1.5 ${
                          item.isPrioritized && isCustomViewActive
                            ? "border-accent/30 bg-accent/[0.03]"
                            : "border-white/10 bg-[#141417]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                              <span>{item.topicTag}</span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">{item.boardAndClass}</span>
                            </div>
                            <h4 className="font-heading text-xs font-bold text-white mt-0.5 leading-snug">
                              {item.title}
                            </h4>
                          </div>

                          <span
                            className={`text-[10px] font-mono font-bold shrink-0 text-right ${getWatchlistStatusTone(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed">{item.note}</p>

                        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
                          <span>
                            {item.lastVerifiedDate
                              ? `Audited ${item.lastVerifiedDate}`
                              : "Audit date pending"}
                          </span>
                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-accent hover:underline"
                            >
                              <span>{item.sourceLabel || "Official Portal"}</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TRAY 3: ACADEMIC CHANGE LOG ("WHAT CHANGED?") */}
              {activeTray === "changelog" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400 inline-flex items-center gap-1.5">
                      <Filter size={12} className="text-accent" />
                      <span>Significant syllabus, schedule, passing-policy &amp; E-Sheet shifts</span>
                    </span>

                    <div className="inline-flex items-center rounded-lg border border-white/10 bg-black/50 p-0.5 text-[11px]">
                      {(
                        [
                          { id: "all" as const, label: "All Changes" },
                          { id: "official" as const, label: "Official Confirmed" },
                          { id: "reported" as const, label: "Media Reports" },
                        ]
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setChangeFilter(opt.id)}
                          className={`rounded-md px-2.5 py-1 font-heading font-semibold transition-colors cursor-pointer ${
                            changeFilter === opt.id
                              ? "bg-white/15 text-white"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-[#141417]">
                    {changeLogItems.map((chg) => (
                      <div
                        key={chg.id}
                        className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                            <span className="text-white font-semibold tabular-nums">{chg.date}</span>
                            <span aria-hidden="true" className="text-zinc-600">
                              ·
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 font-bold ${
                                chg.verificationType === "official"
                                  ? "text-emerald-300"
                                  : "text-amber-300"
                              }`}
                            >
                              {chg.verificationType === "official" ? (
                                <CheckCircle2 size={11} />
                              ) : (
                                <Info size={11} />
                              )}
                              <span>{chg.statusLabel}</span>
                            </span>
                            <span aria-hidden="true" className="text-zinc-600">
                              ·
                            </span>
                            <span className="text-zinc-400">{chg.affectedScope}</span>
                          </div>
                          <p className="text-zinc-200 leading-relaxed">{chg.summary}</p>
                        </div>

                        <a
                          href={chg.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline shrink-0"
                        >
                          <span>{chg.sourceLabel}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabSwitchPanel>
          </div>
        </CollapsiblePanel>
      </ScrollRevealDiv>
    </section>
  );
}
