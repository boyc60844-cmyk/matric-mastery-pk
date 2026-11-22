"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  FileCheck2,
  Layers,
  Play,
  RotateCcw,
  ShieldCheck,
  Sliders,
  Target,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import {
  DifficultyLevel,
  ExamAttemptRecord,
  ExamSystem,
  GeneratedPaperSnapshot,
  GradeLevel,
  QuestionType,
  SubjectCurriculum,
  TestMode,
} from "@/lib/mock-tests/types";
import {
  getCurriculaForSystemAndGrade,
  getCurriculumByKey,
} from "@/lib/mock-tests/curriculum/curriculumRegistry";
import {
  getEligibleChapters,
  getEligibleTopicsForChapter,
} from "@/lib/mock-tests/curriculum/eligibilityResolver";
import { ACTIVE_VERSION_BY_SYSTEM } from "@/lib/mock-tests/curriculum/syllabusVersionResolver";
import { getSubjectReadinessProfile } from "@/lib/mock-tests/curriculum/readinessResolver";
import { getBlueprintForSubject } from "@/lib/mock-tests/blueprint/blueprintRegistry";
import { validateBlueprintAndPool } from "@/lib/mock-tests/blueprint/blueprintValidator";
import {
  generateBoardSimulationPaper,
  generatePracticePaper,
} from "@/lib/mock-tests/blueprint/paperGenerator";
import {
  getSubjectPoolInventory,
  RAW_QUESTION_BANK,
} from "@/lib/mock-tests/question-bank/questionRegistry";
import { getRemainingSeconds } from "@/lib/mock-tests/attempts/attemptMachine";
import { computeAnalyticsOverview } from "@/lib/mock-tests/analytics/analyticsEngine";
import { MistakeNotebookEntry } from "@/lib/mock-tests/types";

export type SetupHubTab = "configure" | "analytics" | "mistakes";

interface MockTestSetupHubProps {
  activeTab: SetupHubTab;
  onTabChange: (tab: SetupHubTab) => void;
  activeAttempt: ExamAttemptRecord | null;
  attemptHistory: ExamAttemptRecord[];
  mistakeNotebook: MistakeNotebookEntry[];
  onResumeActiveAttempt: () => void;
  onDiscardActiveAttempt: () => void;
  onStartGeneratedPaper: (paper: GeneratedPaperSnapshot) => void;
  analyticsSlot?: React.ReactNode;
  mistakesSlot?: React.ReactNode;
}

const TEST_MODES: {
  id: TestMode;
  label: string;
  subtitle: string;
  timedLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "board_simulation",
    label: "Board Simulation",
    subtitle: "Exact official marks, sections, choice groups & board deadline",
    timedLabel: "Timed · No Pause",
    icon: ShieldCheck,
  },
  {
    id: "chapter_test",
    label: "Chapter Test",
    subtitle: "Focused practice across one or more eligible chapters",
    timedLabel: "Timed or Untimed",
    icon: BookOpen,
  },
  {
    id: "quick_test",
    label: "Quick Test",
    subtitle: "Crisp 5, 10, or 15-minute sprint drills",
    timedLabel: "5 / 10 / 15 min",
    icon: Zap,
  },
  {
    id: "weak_areas",
    label: "Weak Areas",
    subtitle: "Targets questions & topics from your real mistake history",
    timedLabel: "Targeted Drill",
    icon: Target,
  },
  {
    id: "custom_test",
    label: "Custom Test",
    subtitle: "Pick topics, question formats, difficulty & item count",
    timedLabel: "Custom Scope",
    icon: Sliders,
  },
  {
    id: "slo_practice",
    label: "SLO / Concept Practice",
    subtitle: "Practice mapped Learning Outcomes & cognitive levels",
    timedLabel: "SLO Aligned",
    icon: Compass,
  },
];

const QUESTION_TYPE_LABELS: { id: QuestionType; label: string }[] = [
  { id: "single_mcq", label: "Single MCQ" },
  { id: "multi_select", label: "Multi-Select" },
  { id: "true_false", label: "True / False" },
  { id: "fill_blank", label: "Fill in Blank" },
  { id: "matching", label: "Matching" },
  { id: "classification", label: "Classification" },
  { id: "numerical", label: "Numerical" },
  { id: "short_answer", label: "Short Answer" },
  { id: "structured_multi_part", label: "Structured Multi-Part" },
  { id: "proof_derivation", label: "Proof / Derivation" },
  { id: "diagram_labeling", label: "Diagram Labeling" },
  { id: "extended_response", label: "Extended Response" },
];

export function MockTestSetupHub({
  activeTab,
  onTabChange,
  activeAttempt,
  attemptHistory,
  mistakeNotebook,
  onResumeActiveAttempt,
  onDiscardActiveAttempt,
  onStartGeneratedPaper,
  analyticsSlot,
  mistakesSlot,
}: MockTestSetupHubProps) {
  const [system, setSystem] = useState<ExamSystem>("punjab");
  const [grade, setGrade] = useState<GradeLevel>(10);
  const [subjectId, setSubjectId] = useState<string>("computer-science");
  const [selectedMode, setSelectedMode] = useState<TestMode>("board_simulation");
  const [inspectSyllabus, setInspectSyllabus] = useState<boolean>(false);

  // Mode-specific controls
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedSloId, setSelectedSloId] = useState<string>("");
  const [quickMinutes, setQuickMinutes] = useState<5 | 10 | 15>(10);
  const [customCount, setCustomCount] = useState<number>(8);
  const [customTimed, setCustomTimed] = useState<boolean>(true);
  const [customMinutes, setCustomMinutes] = useState<number>(20);
  const [customDifficulty, setCustomDifficulty] = useState<DifficultyLevel | "All">("All");
  const [customTypes, setCustomTypes] = useState<QuestionType[]>([]);
  const [launchError, setLaunchError] = useState<string | null>(null);

  const curriculaForGrade = useMemo(
    () => getCurriculaForSystemAndGrade(system, grade),
    [system, grade]
  );

  // Keep subjectId synchronized cleanly whenever system or grade switches
  const activeCurriculum: SubjectCurriculum | undefined = useMemo(() => {
    const match = getCurriculumByKey(system, grade, subjectId);
    if (match) return match;
    return curriculaForGrade[0];
  }, [system, grade, subjectId, curriculaForGrade]);

  const effectiveSubjectId = activeCurriculum?.subjectId ?? subjectId;

  const inventory = useMemo(
    () => getSubjectPoolInventory(system, grade, effectiveSubjectId),
    [system, grade, effectiveSubjectId]
  );

  const blueprint = useMemo(
    () => getBlueprintForSubject(system, grade, effectiveSubjectId),
    [system, grade, effectiveSubjectId]
  );

  const blueprintStatus = useMemo(
    () => (blueprint ? validateBlueprintAndPool(blueprint, RAW_QUESTION_BANK) : null),
    [blueprint]
  );

  const activeReadiness = useMemo(
    () => (activeCurriculum ? getSubjectReadinessProfile(activeCurriculum, RAW_QUESTION_BANK) : null),
    [activeCurriculum]
  );

  const eligibleChapters = useMemo(
    () => (activeCurriculum ? getEligibleChapters(activeCurriculum) : []),
    [activeCurriculum]
  );

  const analyticsForSubject = useMemo(
    () =>
      computeAnalyticsOverview(attemptHistory, mistakeNotebook, {
        system,
        grade,
        subjectId: effectiveSubjectId,
      }),
    [attemptHistory, mistakeNotebook, system, grade, effectiveSubjectId]
  );

  const activeRemainingSec = activeAttempt ? getRemainingSeconds(activeAttempt) : null;

  const handleSystemSwitch = (nextSys: ExamSystem) => {
    setSystem(nextSys);
    setLaunchError(null);
    setSelectedChapterIds([]);
    setSelectedTopicIds([]);
    setSelectedSloId("");
    const nextList = getCurriculaForSystemAndGrade(nextSys, grade);
    if (nextList.length > 0) {
      setSubjectId(nextList[0].subjectId);
    } else {
      const fallbackGrade: GradeLevel = 9;
      setGrade(fallbackGrade);
      const fallbackList = getCurriculaForSystemAndGrade(nextSys, fallbackGrade);
      if (fallbackList.length > 0) setSubjectId(fallbackList[0].subjectId);
    }
  };

  const handleGradeSwitch = (nextGrade: GradeLevel) => {
    setGrade(nextGrade);
    setLaunchError(null);
    setSelectedChapterIds([]);
    setSelectedTopicIds([]);
    setSelectedSloId("");
    const nextList = getCurriculaForSystemAndGrade(system, nextGrade);
    if (nextList.length > 0) {
      const preferred =
        nextList.find((c) => getSubjectReadinessProfile(c, RAW_QUESTION_BANK).practiceAvailable) ??
        nextList[0];
      setSubjectId(preferred.subjectId);
    }
  };

  const handleSubjectSwitch = (nextSubjectId: string) => {
    setSubjectId(nextSubjectId);
    setLaunchError(null);
    setSelectedChapterIds([]);
    setSelectedTopicIds([]);
    setSelectedSloId("");
  };

  const toggleChapter = (chId: string) => {
    setLaunchError(null);
    setSelectedChapterIds((prev) =>
      prev.includes(chId) ? prev.filter((id) => id !== chId) : [...prev, chId]
    );
  };

  const toggleTopic = (tId: string) => {
    setLaunchError(null);
    setSelectedTopicIds((prev) =>
      prev.includes(tId) ? prev.filter((id) => id !== tId) : [...prev, tId]
    );
  };

  const toggleQuestionType = (t: QuestionType) => {
    setLaunchError(null);
    setCustomTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleLaunch = (overrideMode?: TestMode) => {
    setLaunchError(null);
    if (!activeCurriculum || !activeReadiness) {
      setLaunchError("No subject curriculum is available for this selection.");
      return;
    }
    if (!activeReadiness.practiceAvailable) {
      setLaunchError(
        `${activeCurriculum.subjectName} (Class ${activeCurriculum.grade}): ${activeReadiness.statusDetail}`
      );
      return;
    }

    const modeToRun = overrideMode ?? selectedMode;

    if (modeToRun === "board_simulation") {
      const res = generateBoardSimulationPaper({
        system,
        grade,
        subjectId: effectiveSubjectId,
      });
      if (!res.ok) {
        setLaunchError(`${res.reason}: ${res.details.join(" ")}`);
        return;
      }
      onStartGeneratedPaper(res.paper);
      return;
    }

    if (modeToRun === "weak_areas") {
      const weakIds = analyticsForSubject.weakQuestionIds;
      const weakTopics = analyticsForSubject.weakTopics.map((t) => t.topicId);
      if (weakIds.length === 0 && weakTopics.length === 0) {
        setLaunchError(
          "No recorded mistakes or weak topics yet for this subject. Complete a Chapter Test or Simulation first so Weak Areas builds a genuine targeted drill."
        );
        return;
      }
      const res = generatePracticePaper({
        mode: "weak_areas",
        system,
        grade,
        subjectId: effectiveSubjectId,
        topicIds: weakTopics.length > 0 && weakIds.length < 3 ? weakTopics : undefined,
        prioritizedQuestionIds: weakIds,
        requestedCount: Math.min(Math.max(4, weakIds.length + 2), 12),
        isTimed: true,
        durationMinutes: 15,
      });
      if (!res.ok) {
        setLaunchError(`${res.reason}: ${res.details.join(" ")}`);
        return;
      }
      onStartGeneratedPaper(res.paper);
      return;
    }

    if (modeToRun === "quick_test") {
      const requestedCount = quickMinutes === 5 ? 5 : quickMinutes === 10 ? 8 : 12;
      const res = generatePracticePaper({
        mode: "quick_test",
        system,
        grade,
        subjectId: effectiveSubjectId,
        allowedTypes: ["single_mcq", "multi_select", "true_false", "fill_blank", "classification", "matching"],
        requestedCount,
        isTimed: true,
        durationMinutes: quickMinutes,
      });
      if (!res.ok) {
        // Retry across all eligible question types if objective pool is smaller
        const fallback = generatePracticePaper({
          mode: "quick_test",
          system,
          grade,
          subjectId: effectiveSubjectId,
          requestedCount,
          isTimed: true,
          durationMinutes: quickMinutes,
        });
        if (!fallback.ok) {
          setLaunchError(`${fallback.reason}: ${fallback.details.join(" ")}`);
          return;
        }
        onStartGeneratedPaper(fallback.paper);
        return;
      }
      onStartGeneratedPaper(res.paper);
      return;
    }

    if (modeToRun === "chapter_test") {
      const chaptersToUse =
        selectedChapterIds.length > 0
          ? selectedChapterIds
          : eligibleChapters[0]
            ? [eligibleChapters[0].id]
            : [];
      const res = generatePracticePaper({
        mode: "chapter_test",
        system,
        grade,
        subjectId: effectiveSubjectId,
        chapterIds: chaptersToUse,
        requestedCount: Math.min(customCount, Math.max(4, inventory.verifiedEligibleCount)),
        isTimed: customTimed,
        durationMinutes: customTimed ? customMinutes : 0,
      });
      if (!res.ok) {
        setLaunchError(`${res.reason}: ${res.details.join(" ")}`);
        return;
      }
      onStartGeneratedPaper(res.paper);
      return;
    }

    if (modeToRun === "slo_practice") {
      const res = generatePracticePaper({
        mode: "slo_practice",
        system,
        grade,
        subjectId: effectiveSubjectId,
        sloId: selectedSloId || undefined,
        requestedCount: 8,
        isTimed: false,
        durationMinutes: 0,
      });
      if (!res.ok) {
        setLaunchError(`${res.reason}: ${res.details.join(" ")}`);
        return;
      }
      onStartGeneratedPaper(res.paper);
      return;
    }

    // custom_test
    const res = generatePracticePaper({
      mode: "custom_test",
      system,
      grade,
      subjectId: effectiveSubjectId,
      chapterIds: selectedChapterIds.length > 0 ? selectedChapterIds : undefined,
      topicIds: selectedTopicIds.length > 0 ? selectedTopicIds : undefined,
      allowedTypes: customTypes.length > 0 ? customTypes : undefined,
      difficulty: customDifficulty,
      requestedCount: customCount,
      isTimed: customTimed,
      durationMinutes: customTimed ? customMinutes : 0,
    });
    if (!res.ok) {
      setLaunchError(`${res.reason}: ${res.details.join(" ")}`);
      return;
    }
    onStartGeneratedPaper(res.paper);
  };

  const systemMeta = ACTIVE_VERSION_BY_SYSTEM[system];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 space-y-8">
      {/* Header & Top Navigation Tabs */}
      <header className="space-y-5 border-b border-white/10 pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#FFD60A]">
              Classes 9–12 · Examination Assessment Engine
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Mock Test &amp; Paper Simulation Center
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Curriculum-verified assessment across{" "}
              <span className="text-zinc-200 font-medium">Punjab Boards (PECTAA 2026–27 ALP)</span>{" "}
              and{" "}
              <span className="text-zinc-200 font-medium">
                FBISE Islamabad (Inclusive Scheme 2024)
              </span>
              . Attempts, analytics, and your Mistake Notebook save locally in this browser.
            </p>
          </div>

          <nav
            aria-label="Mock test workspace sections"
            className="flex flex-wrap items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={() => onTabChange("configure")}
              className={`min-h-[42px] inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeTab === "configure"
                  ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                  : "border-white/10 bg-[#121215] text-zinc-300 hover:border-white/25 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              Configure Test
            </button>
            <button
              type="button"
              onClick={() => onTabChange("analytics")}
              className={`min-h-[42px] inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeTab === "analytics"
                  ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                  : "border-white/10 bg-[#121215] text-zinc-300 hover:border-white/25 hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics ({attemptHistory.length})</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange("mistakes")}
              className={`min-h-[42px] inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeTab === "mistakes"
                  ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                  : "border-white/10 bg-[#121215] text-zinc-300 hover:border-white/25 hover:text-white"
              }`}
            >
              <BookMarked className="h-4 w-4" />
              <span>Mistake Notebook ({mistakeNotebook.length})</span>
            </button>
          </nav>
        </div>

        {/* Active Attempt Recovery Banner */}
        {activeAttempt && (
          <div className="rounded-2xl border border-[#FFD60A]/40 bg-[#FFD60A]/[0.07] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FFD60A]">
                <Clock className="h-4 w-4" />
                <span>SAVED IN-PROGRESS EXAM DETECTED</span>
              </div>
              <p className="text-sm font-semibold text-white">{activeAttempt.paper.title}</p>
              <p className="text-xs font-mono text-zinc-300 tabular-nums">
                {Object.keys(activeAttempt.responses).length} / {activeAttempt.paper.slots.length}{" "}
                answered
                {activeRemainingSec !== null
                  ? ` · ${Math.floor(activeRemainingSec / 60)}m ${String(activeRemainingSec % 60).padStart(2, "0")}s left`
                  : " · Untimed practice"}
                {activeAttempt.status === "paused" ? " · Paused" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onResumeActiveAttempt}
                className="min-h-[42px] inline-flex items-center gap-2 rounded-xl bg-[#FFD60A] px-4 py-2 text-xs font-bold text-black whitespace-nowrap hover:bg-[#FFD60A]/90"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Resume Attempt
              </button>
              <button
                type="button"
                onClick={onDiscardActiveAttempt}
                className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-xs font-medium text-zinc-300 whitespace-nowrap hover:border-red-400/50 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Discard
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Secondary Views */}
      {activeTab === "analytics" && analyticsSlot}
      {activeTab === "mistakes" && mistakesSlot}

      {/* Main Configure Test Workspace */}
      {activeTab === "configure" && (
        <div className="space-y-7">
          {/* Step 1: Examination System + Class + Subject */}
          <section className="rounded-2xl border border-white/10 bg-[#121215] p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* System Selector */}
              <div className="lg:col-span-5 space-y-2.5">
                <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400">
                  1. Examination System (Strict Separation)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: "punjab" as const,
                      title: "Punjab Boards",
                      detail: "PECTAA 2026–27 ALP",
                    },
                    {
                      id: "fbise" as const,
                      title: "FBISE Islamabad",
                      detail: "Inclusive Scheme 2024 (SLO)",
                    },
                  ].map((item) => {
                    const active = system === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSystemSwitch(item.id)}
                        className={`min-h-[58px] rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                          active
                            ? "border-[#FFD60A] bg-[#FFD60A]/12 text-white"
                            : "border-white/10 bg-black/35 text-zinc-300 hover:border-white/25"
                        }`}
                      >
                        <div className="font-heading text-sm font-bold">{item.title}</div>
                        <div className="font-mono text-[11px] text-zinc-400 mt-0.5">
                          {item.detail}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-mono text-zinc-400">
                  Active cycle: {systemMeta.sessionLabel} · {systemMeta.authorityLabel}
                </p>
                {system === "fbise" && activeCurriculum?.fbiseSchemeMeta && (
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1 text-[11px] text-zinc-300">
                    <div className="font-mono text-[#FFD60A] font-semibold">
                      {activeCurriculum.fbiseSchemeMeta.schemeName} (
                      {activeCurriculum.fbiseSchemeMeta.totalSchemeMarks} Marks)
                    </div>
                    <p className="text-zinc-400">
                      {activeCurriculum.fbiseSchemeMeta.phasedRolloutLabel}. Legacy{" "}
                      {activeCurriculum.fbiseSchemeMeta.legacyExcludedScheme}.
                    </p>
                    <p
                      className={`font-mono ${
                        activeCurriculum.fbiseSchemeMeta.bilingualPolicy.applies
                          ? "text-emerald-300"
                          : "text-zinc-400"
                      }`}
                    >
                      Bilingual Rule (No. 1-1/FBISE/RES/2026/370):{" "}
                      {activeCurriculum.fbiseSchemeMeta.bilingualPolicy.applies
                        ? `Applies (${activeCurriculum.fbiseSchemeMeta.bilingualPolicy.effectiveExam})`
                        : activeCurriculum.fbiseSchemeMeta.bilingualPolicy.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Class Selector */}
              <div className="lg:col-span-7 space-y-2.5">
                <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400">
                  2. Class / Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {([9, 10, 11, 12] as GradeLevel[]).map((g) => {
                    const active = grade === g;
                    const subLabel =
                      g === 9
                        ? "SSC Part I"
                        : g === 10
                          ? "SSC Part II"
                          : g === 11
                            ? "HSSC Part I"
                            : "HSSC Part II";
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleGradeSwitch(g)}
                        className={`min-h-[58px] rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          active
                            ? "border-[#FFD60A] bg-[#FFD60A]/12 text-white"
                            : "border-white/10 bg-black/35 text-zinc-300 hover:border-white/25"
                        }`}
                      >
                        <div className="font-heading text-sm font-bold">Class {g}</div>
                        <div className="font-mono text-[11px] text-zinc-400 mt-0.5">{subLabel}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Subject Selection */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  3. Select Subject ({curriculaForGrade.length} catalogued for{" "}
                  {system === "punjab" ? "Punjab" : "FBISE"} Class {grade})
                </label>
                {activeCurriculum && (
                  <button
                    type="button"
                    onClick={() => setInspectSyllabus((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FFD60A] hover:underline"
                  >
                    {inspectSyllabus ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                    {inspectSyllabus ? "Hide Curriculum & ALP Scope" : "Inspect Curriculum & ALP Scope"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {curriculaForGrade.map((cur) => {
                  const profile = getSubjectReadinessProfile(cur, RAW_QUESTION_BANK);
                  const bp = getBlueprintForSubject(cur.system, cur.grade, cur.subjectId);
                  const isSelected = cur.subjectId === effectiveSubjectId;
                  const policyShort =
                    cur.syllabusPolicy === "full_syllabus_no_alp"
                      ? "Full syllabus (No ALP)"
                      : cur.syllabusPolicy === "slo_national_curriculum"
                        ? "SLO Scheme"
                        : "ALP filtered";

                  return (
                    <button
                      key={cur.id}
                      type="button"
                      onClick={() => handleSubjectSwitch(cur.subjectId)}
                      className={`rounded-xl border p-3.5 text-left transition-colors flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? "border-[#FFD60A] bg-[#FFD60A]/10"
                          : "border-white/10 bg-black/35 hover:border-white/25"
                      } ${!profile.practiceAvailable ? "opacity-85" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-heading text-sm font-bold text-white leading-snug">
                          {cur.subjectName}
                        </div>
                        {profile.boardSimulationReady ? (
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#FFD60A]">
                            Full Sim Ready
                          </span>
                        ) : profile.practiceAvailable ? (
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                            Practice Open
                          </span>
                        ) : cur.curriculumStatus === "verified" ? (
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-sky-300">
                            Curriculum Ready
                          </span>
                        ) : (
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-zinc-400 leading-relaxed tabular-nums">
                        {profile.practiceAvailable ? (
                          <span>
                            {profile.verifiedEligibleCount} verified Qs
                            {bp ? ` · ${bp.totalMarks}m board spec` : ""}
                            {` · ${policyShort}`}
                          </span>
                        ) : (
                          <span>
                            {policyShort} · 0 verified Qs
                            {profile.outdatedCount > 0 ? ` (${profile.outdatedCount} legacy quarantined)` : ""}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Expandable Syllabus & ALP Inspector */}
              {inspectSyllabus && activeCurriculum && (
                <div className="rounded-xl border border-white/10 bg-black/45 p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-heading text-sm font-bold text-white">
                        {activeCurriculum.subjectName} — Verified Curriculum Scope
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {activeCurriculum.verificationNote}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                      {activeCurriculum.curriculumVersion}
                    </span>
                  </div>

                  {activeCurriculum.notificationRefs.length > 0 && (
                    <div className="text-xs text-zinc-300 space-y-1">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                        Official Source Notification:
                      </span>
                      {activeCurriculum.notificationRefs.map((ref) => (
                        <div key={ref.code} className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-white">{ref.code}</span>
                          <span className="text-zinc-500">·</span>
                          <span className="text-zinc-400">{ref.date}</span>
                          <span className="text-zinc-500">·</span>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#FFD60A] hover:underline"
                          >
                            {ref.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeCurriculum.chapters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeCurriculum.chapters.map((ch) => (
                        <div
                          key={ch.id}
                          className="rounded-lg border border-white/10 bg-[#121215] p-3 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-xs font-bold text-white">
                              Ch {ch.number}: {ch.title}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-400">
                              {ch.isFullyExcluded ? "Excluded" : "Active"}
                            </span>
                          </div>
                          <ul className="space-y-1 text-[11px]">
                            {ch.topics.map((t) => (
                              <li
                                key={t.id}
                                className={`flex items-start justify-between gap-2 ${
                                  t.isExcluded ? "text-zinc-500 line-through" : "text-zinc-300"
                                }`}
                              >
                                <span>{t.title}</span>
                                <span className="font-mono text-[10px] shrink-0 no-underline">
                                  {t.isExcluded ? "Deleted (ALP)" : "Included"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-zinc-400">
                      Chapter breakdown will be populated once source verification for this syllabus completes.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Step 2: Select Test Mode + Live Blueprint Readiness */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Mode Selection & Controls */}
            <section className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#121215] p-5 sm:p-6 space-y-5">
              <div className="space-y-1">
                <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400">
                  4. Select Assessment Mode
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TEST_MODES.map((m) => {
                  const Icon = m.icon;
                  const active = selectedMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMode(m.id);
                        setLaunchError(null);
                      }}
                      className={`rounded-xl border p-3.5 text-left transition-colors space-y-1.5 ${
                        active
                          ? "border-[#FFD60A] bg-[#FFD60A]/12"
                          : "border-white/10 bg-black/35 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 font-heading text-sm font-bold text-white">
                          <Icon className={`h-4 w-4 ${active ? "text-[#FFD60A]" : "text-zinc-400"}`} />
                          {m.label}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400 whitespace-nowrap">
                          {m.timedLabel}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-snug">{m.subtitle}</p>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Mode Configuration */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-4">
                {selectedMode === "board_simulation" && (
                  <div className="space-y-2">
                    <h3 className="font-heading text-sm font-bold text-white">
                      Strict Official Board Simulation Rules
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Locks exact paper duration, total marks, section structure, and internal
                      choice limits (attempting extra questions in a choice group is flagged and
                      not counted toward marks). Pause is disabled during official simulation.
                    </p>
                    {blueprint && (
                      <div className="text-xs font-mono text-zinc-400 pt-1 space-y-1">
                        <div>
                          Paper Spec: {blueprint.sourceDocumentRef} · {blueprint.totalMarks} Marks ·{" "}
                          {blueprint.durationMinutes} min
                          {typeof blueprint.objectiveTimeMinutes === "number" &&
                          typeof blueprint.subjectiveTimeMinutes === "number"
                            ? ` (${blueprint.objectiveTimeMinutes}m Objective + ${blueprint.subjectiveTimeMinutes}m Subjective)`
                            : ""}{" "}
                          · Pass {blueprint.passingPercentage}% (IBCC rule)
                        </div>
                        {blueprint.timingBreakdownNote && (
                          <div className="text-[11px] text-zinc-500">
                            {blueprint.timingBreakdownNote}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {selectedMode === "quick_test" && (
                  <div className="space-y-3">
                    <label className="block font-mono text-xs text-zinc-300">
                      Select Quick Sprint Duration:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {([5, 10, 15] as const).map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setQuickMinutes(mins)}
                          className={`min-h-[40px] rounded-xl border px-4 py-2 font-mono text-xs font-bold transition-colors ${
                            quickMinutes === mins
                              ? "border-[#FFD60A] bg-[#FFD60A] text-black"
                              : "border-white/10 bg-[#16161A] text-zinc-300 hover:border-white/25"
                          }`}
                        >
                          {mins} Minutes ({mins === 5 ? 5 : mins === 10 ? 8 : 12} Qs max)
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMode === "chapter_test" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-mono text-xs text-zinc-300">
                        Choose Eligible Chapters (leave unselected to start Chapter 1):
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {eligibleChapters.map((ch) => {
                        const active = selectedChapterIds.includes(ch.id);
                        const chCount = inventory.countsByChapter[ch.id] || 0;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => toggleChapter(ch.id)}
                            className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                              active
                                ? "border-[#FFD60A] bg-[#FFD60A]/15 text-[#FFD60A]"
                                : "border-white/10 bg-[#16161A] text-zinc-300 hover:border-white/25"
                            }`}
                          >
                            Ch {ch.number}: {ch.title} ({chCount})
                          </button>
                        );
                      })}
                      {eligibleChapters.length === 0 && (
                        <p className="text-xs text-zinc-500 font-mono">
                          No eligible chapters verified for this subject yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedMode === "weak_areas" && (
                  <div className="space-y-2">
                    <h3 className="font-heading text-sm font-bold text-white">
                      Personalized Weak-Area Recovery
                    </h3>
                    {analyticsForSubject.weakQuestionIds.length > 0 ||
                    analyticsForSubject.weakTopics.length > 0 ? (
                      <p className="text-xs text-emerald-400 font-mono">
                        Detected {analyticsForSubject.weakQuestionIds.length} weak/missed item(s) across{" "}
                        {analyticsForSubject.weakTopics.length} topic(s) from your completed history.
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-400">
                        Complete at least one Chapter Test or Simulation in this subject to populate
                        verified weak-area items without guesswork.
                      </p>
                    )}
                  </div>
                )}

                {selectedMode === "slo_practice" && (
                  <div className="space-y-3">
                    <label className="block font-mono text-xs text-zinc-300">
                      Select Verified Learning Outcome (SLO):
                    </label>
                    {activeCurriculum && activeCurriculum.slos.length > 0 ? (
                      <select
                        value={selectedSloId}
                        onChange={(e) => setSelectedSloId(e.target.value)}
                        className="w-full min-h-[44px] rounded-xl border border-white/15 bg-[#16161A] px-3 py-2 text-xs text-white focus:border-[#FFD60A] focus:outline-none"
                      >
                        <option value="">All Mapped SLOs ({activeCurriculum.slos.length})</option>
                        {activeCurriculum.slos.map((s) => (
                          <option key={s.id} value={s.id}>
                            [{s.code} · {s.cognitiveLevel}] {s.statement}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-zinc-400">
                        {system === "punjab"
                          ? "Punjab Boards use PECTAA ALP topic pairing; switch to FBISE Physics Class 9 to practice formal FBISE SLO statements, or run Chapter Test."
                          : "No formal SLO statements loaded for this subject yet."}
                      </p>
                    )}
                  </div>
                )}

                {selectedMode === "custom_test" && (
                  <div className="space-y-4">
                    {/* Chapters & Topics */}
                    {eligibleChapters.length > 0 && (
                      <div className="space-y-2">
                        <label className="block font-mono text-xs text-zinc-400">
                          Filter Chapters (Optional):
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {eligibleChapters.map((ch) => {
                            const active = selectedChapterIds.includes(ch.id);
                            return (
                              <button
                                key={ch.id}
                                type="button"
                                onClick={() => toggleChapter(ch.id)}
                                className={`rounded-lg border px-2.5 py-1 text-xs ${
                                  active
                                    ? "border-[#FFD60A] bg-[#FFD60A]/15 text-[#FFD60A]"
                                    : "border-white/10 bg-[#16161A] text-zinc-300"
                                }`}
                              >
                                Ch {ch.number} ({inventory.countsByChapter[ch.id] || 0})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Topic pills if chapter selected */}
                    {selectedChapterIds.length > 0 && (
                      <div className="space-y-2">
                        <label className="block font-mono text-xs text-zinc-400">
                          Included Syllabus Topics:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {eligibleChapters
                            .filter((ch) => selectedChapterIds.includes(ch.id))
                            .flatMap((ch) => getEligibleTopicsForChapter(ch))
                            .map((t) => {
                              const active = selectedTopicIds.includes(t.id);
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => toggleTopic(t.id)}
                                  className={`rounded-lg border px-2.5 py-1 text-[11px] ${
                                    active
                                      ? "border-[#FFD60A] bg-[#FFD60A]/15 text-[#FFD60A]"
                                      : "border-white/10 bg-[#16161A] text-zinc-300"
                                  }`}
                                >
                                  {t.title}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Question Types */}
                    <div className="space-y-2">
                      <label className="block font-mono text-xs text-zinc-400">
                        Question Types (Only verified formats in this subject will appear):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {QUESTION_TYPE_LABELS.filter(
                          (qt) => (inventory.countsByType[qt.id] || 0) > 0
                        ).map((qt) => {
                          const active = customTypes.includes(qt.id);
                          return (
                            <button
                              key={qt.id}
                              type="button"
                              onClick={() => toggleQuestionType(qt.id)}
                              className={`rounded-lg border px-2.5 py-1 text-[11px] font-mono ${
                                active
                                  ? "border-[#FFD60A] bg-[#FFD60A]/15 text-[#FFD60A]"
                                  : "border-white/10 bg-[#16161A] text-zinc-300"
                              }`}
                            >
                              {qt.label} ({inventory.countsByType[qt.id]})
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Difficulty, Count, Timing */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                          Difficulty
                        </label>
                        <select
                          value={customDifficulty}
                          onChange={(e) =>
                            setCustomDifficulty(e.target.value as DifficultyLevel | "All")
                          }
                          className="w-full min-h-[40px] rounded-lg border border-white/15 bg-[#16161A] px-2.5 text-xs text-white"
                        >
                          <option value="All">All Levels</option>
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Challenging">Challenging</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                          Max Questions (Pool: {inventory.verifiedEligibleCount})
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={Math.max(1, inventory.verifiedEligibleCount)}
                          value={customCount}
                          onChange={(e) =>
                            setCustomCount(Math.max(1, Number(e.target.value) || 1))
                          }
                          className="w-full min-h-[40px] rounded-lg border border-white/15 bg-[#16161A] px-2.5 font-mono text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                          Timer Mode
                        </label>
                        <select
                          value={customTimed ? String(customMinutes) : "untimed"}
                          onChange={(e) => {
                            if (e.target.value === "untimed") {
                              setCustomTimed(false);
                            } else {
                              setCustomTimed(true);
                              setCustomMinutes(Number(e.target.value));
                            }
                          }}
                          className="w-full min-h-[40px] rounded-lg border border-white/15 bg-[#16161A] px-2.5 text-xs text-white"
                        >
                          <option value="untimed">Untimed Practice</option>
                          <option value="10">10 Minutes</option>
                          <option value="20">20 Minutes</option>
                          <option value="30">30 Minutes</option>
                          <option value="45">45 Minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {launchError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-200 flex items-start gap-2.5"
                >
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{launchError}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={
                    !activeReadiness?.practiceAvailable ||
                    (selectedMode === "board_simulation" &&
                      Boolean(blueprintStatus && !blueprintStatus.isSimulationReady))
                  }
                  onClick={() => handleLaunch()}
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD60A] px-6 py-3 font-heading text-sm font-bold text-black whitespace-nowrap hover:bg-[#FFD60A]/90 disabled:cursor-not-allowed disabled:opacity-45 transition-opacity"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {selectedMode === "board_simulation"
                    ? "Start Official Simulation"
                    : "Generate & Start Practice Test"}
                </button>

                {selectedMode === "board_simulation" &&
                  blueprintStatus &&
                  !blueprintStatus.isSimulationReady &&
                  inventory.verifiedEligibleCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMode("chapter_test");
                        handleLaunch("chapter_test");
                      }}
                      className="min-h-[48px] inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-xs font-semibold text-white hover:border-[#FFD60A]/60"
                    >
                      Launch Available Practice ({inventory.verifiedEligibleCount} Qs)
                    </button>
                  )}
              </div>
            </section>

            {/* Right: Honest Pool Inventory & Official Blueprint Readiness Card */}
            <aside className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#121215] p-5 sm:p-6 space-y-5">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Readiness &amp; Bank Integrity Audit
                  </p>
                  <h2 className="font-heading text-lg font-bold text-white mt-0.5">
                    {activeCurriculum?.subjectName ?? "Select Subject"} · Class {grade}
                  </h2>
                  {activeReadiness && (
                    <p className="font-mono text-[11px] text-[#FFD60A] mt-1">
                      {activeReadiness.summaryBadge}
                    </p>
                  )}
                </div>
                {!activeReadiness?.practiceAvailable ? (
                  <XCircle className="h-5 w-5 text-zinc-400 shrink-0" />
                ) : blueprintStatus?.isSimulationReady ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : (
                  <FileCheck2 className="h-5 w-5 text-[#FFD60A] shrink-0" />
                )}
              </div>

              {activeCurriculum && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-1 text-[11px]">
                  <div className="font-mono text-zinc-300">
                    Syllabus Policy:{" "}
                    <span className="text-white">
                      {activeCurriculum.syllabusPolicy === "full_syllabus_no_alp"
                        ? "Full Syllabus (No ALP Exclusions)"
                        : activeCurriculum.syllabusPolicy === "slo_national_curriculum"
                          ? "FBISE National Curriculum SLO"
                          : "PECTAA 2026–27 Reduced ALP"}
                    </span>
                  </div>
                  <div className="font-mono text-zinc-400">
                    Textbook: {activeCurriculum.textbookRef}
                  </div>
                  {activeCurriculum.alpExclusionsSummary && (
                    <div className="font-mono text-zinc-400">
                      Exclusions: {activeCurriculum.alpExclusionsSummary}
                    </div>
                  )}
                  {(activeReadiness?.outdatedCount ?? 0) > 0 && (
                    <div className="font-mono text-amber-300">
                      Legacy Quarantine: {activeReadiness?.outdatedCount} outdated legacy items isolated from live testing.
                    </div>
                  )}
                </div>
              )}

              {/* Honest Pool Metrics */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <div className="font-mono text-lg font-bold text-white tabular-nums">
                    {inventory.verifiedEligibleCount}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">
                    Verified Ready
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <div className="font-mono text-lg font-bold text-zinc-300 tabular-nums">
                    {inventory.excludedByAlpCount}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">
                    ALP Filtered
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <div className="font-mono text-lg font-bold text-zinc-300 tabular-nums">
                    {blueprint ? blueprint.totalMarks : "—"}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">
                    Board Marks
                  </div>
                </div>
              </div>

              {/* Blueprint Simulation Status Details */}
              {blueprint && blueprintStatus ? (
                <div className="space-y-3">
                  <div
                    className={`rounded-xl border p-3.5 text-xs ${
                      blueprintStatus.isSimulationReady
                        ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200"
                        : "border-amber-500/35 bg-amber-500/10 text-amber-200"
                    }`}
                  >
                    {blueprintStatus.isSimulationReady ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-emerald-300">
                          Ready: Full Official {blueprint.totalMarks}-Mark Simulation Verified
                        </p>
                        <p className="text-[11px] font-mono text-emerald-200/80 tabular-nums">
                          {blueprintStatus.availableVerifiedCount} /{" "}
                          {blueprintStatus.requiredQuestionsCount} blueprint slots populated with
                          non-duplicate verified questions.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <p className="font-semibold text-amber-300">
                          Board Simulation Unavailable — Limited Question Pool
                        </p>
                        <p className="text-[11px] font-mono tabular-nums">
                          Validated pool: {blueprintStatus.availableVerifiedCount} /{" "}
                          {blueprintStatus.requiredQuestionsCount} required questions. We never pad
                          official simulations with unverified or repeated filler.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Section Breakdown */}
                  <div className="space-y-2">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                      Official Blueprint Structure ({blueprint.durationMinutes} min)
                    </p>
                    <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-black/30">
                      {blueprint.sections.map((sec) => (
                        <div key={sec.id} className="p-3 space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-white">
                            <span>
                              {sec.code}: {sec.title}
                            </span>
                            <span className="font-mono text-[#FFD60A] tabular-nums">
                              {sec.choiceGroups.reduce(
                                (s, g) => s + g.requiredAttemptCount * g.marksPerQuestion,
                                0
                              )}
                              m
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">{sec.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-black/35 p-4 text-xs text-zinc-400 leading-relaxed">
                  {!activeReadiness?.practiceAvailable ? (
                    <p>
                      <strong className="text-zinc-200">{activeReadiness?.summaryBadge ?? "Testing Pending"}:</strong>{" "}
                      {activeReadiness?.statusDetail ?? activeCurriculum?.verificationNote}
                    </p>
                  ) : (
                    <p>
                      No official board blueprint is locked yet for this subject. You can run{" "}
                      <strong className="text-zinc-200">Chapter Test</strong>,{" "}
                      <strong className="text-zinc-200">Quick Test</strong>, or{" "}
                      <strong className="text-zinc-200">Custom Test</strong> using the{" "}
                      {inventory.verifiedEligibleCount} verified questions in this bank.
                    </p>
                  )}
                </div>
              )}

              {/* Ready Simulations Callout */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1.5 text-[11px] text-zinc-400">
                <p className="font-mono uppercase tracking-wider text-zinc-300">
                  Live Assessment Availability Audit:
                </p>
                <ul className="space-y-1 text-zinc-300">
                  <li>
                    • <strong className="text-emerald-300">Full Board Sim Ready:</strong> FBISE
                    Islamabad · Class 9 · Physics SLO Model Paper (65 Marks, 3h · 31 verified items)
                  </li>
                  <li>
                    • <strong className="text-[#FFD60A]">Practice Open (2027 Book):</strong> Punjab
                    Boards · Class 9 &amp; 10 CS &amp; Entrepreneurship (Python/OS/AI pool; legacy C
                    bank quarantined)
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
