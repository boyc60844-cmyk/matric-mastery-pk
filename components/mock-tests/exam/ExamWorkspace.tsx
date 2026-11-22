"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eraser,
  Flag,
  LayoutGrid,
  Pause,
  Play,
  Send,
  X,
} from "lucide-react";
import {
  ExamAttemptRecord,
  PaperItemSlot,
  StudentResponseValue,
} from "@/lib/mock-tests/types";
import { getRemainingSeconds } from "@/lib/mock-tests/attempts/attemptMachine";
import { isResponseEmpty } from "@/lib/mock-tests/scoring/answerValidator";
import { FormattedContent } from "@/components/mock-tests/question-types/FormattedContent";
import { QuestionInputRenderer } from "@/components/mock-tests/question-types/QuestionInputRenderer";

interface ExamWorkspaceProps {
  attempt: ExamAttemptRecord;
  onSaveResponse: (slotId: string, value: StudentResponseValue) => void;
  onClearResponse: (slotId: string) => void;
  onToggleReview: (slotId: string) => void;
  onNavigate: (slotIndex: number) => void;
  onPause: () => void;
  onResume: () => void;
  onSubmit: (reason: "manual" | "expired") => void;
  onExitToSetup: () => void;
}

function formatClock(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExamWorkspace({
  attempt,
  onSaveResponse,
  onClearResponse,
  onToggleReview,
  onNavigate,
  onPause,
  onResume,
  onSubmit,
  onExitToSetup,
}: ExamWorkspaceProps) {
  const { paper } = attempt;
  const currentIndex = Math.min(
    Math.max(0, attempt.currentSlotIndex),
    Math.max(0, paper.slots.length - 1)
  );
  const currentSlot: PaperItemSlot | undefined = paper.slots[currentIndex];
  const currentQuestion = currentSlot ? paper.questionsById[currentSlot.questionId] : undefined;

  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(() =>
    getRemainingSeconds(attempt, Date.now())
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  // Deadline-synced countdown timer with visibility recovery & exact auto-submit at 0
  useEffect(() => {
    const tick = () => {
      const rem = getRemainingSeconds(attempt, Date.now());
      setRemainingSeconds(rem);
      if (paper.isTimed && attempt.status === "in_progress" && rem !== null && rem <= 0) {
        onSubmit("expired");
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [attempt, paper.isTimed, onSubmit]);

  const slotStatusMap = useMemo(() => {
    const map: Record<
      string,
      "current" | "answered_marked" | "marked" | "answered" | "unanswered"
    > = {};
    paper.slots.forEach((s, idx) => {
      const answered = !isResponseEmpty(attempt.responses[s.slotId]);
      const marked = Boolean(attempt.markedForReview[s.slotId]);
      if (idx === currentIndex) {
        map[s.slotId] = "current";
      } else if (answered && marked) {
        map[s.slotId] = "answered_marked";
      } else if (marked) {
        map[s.slotId] = "marked";
      } else if (answered) {
        map[s.slotId] = "answered";
      } else {
        map[s.slotId] = "unanswered";
      }
    });
    return map;
  }, [paper.slots, attempt.responses, attempt.markedForReview, currentIndex]);

  const summaryCounts = useMemo(() => {
    let answered = 0;
    let marked = 0;
    paper.slots.forEach((s) => {
      if (!isResponseEmpty(attempt.responses[s.slotId])) answered += 1;
      if (attempt.markedForReview[s.slotId]) marked += 1;
    });
    return {
      total: paper.slots.length,
      answered,
      unanswered: paper.slots.length - answered,
      marked,
    };
  }, [paper.slots, attempt.responses, attempt.markedForReview]);

  const currentSection = paper.sections.find((sec) => sec.id === currentSlot?.sectionId);
  const currentGroup = currentSection?.choiceGroups.find(
    (g) => g.id === currentSlot?.choiceGroupId
  );

  const currentGroupAnsweredCount = useMemo(() => {
    if (!currentGroup) return 0;
    return currentGroup.slotIds.filter(
      (id) => !isResponseEmpty(attempt.responses[id])
    ).length;
  }, [currentGroup, attempt.responses]);

  const groupLimitExceeded =
    Boolean(currentGroup) &&
    currentGroupAnsweredCount > (currentGroup?.requiredAttemptCount ?? 0);

  const isCriticalTime =
    remainingSeconds !== null && remainingSeconds > 0 && remainingSeconds <= 300;

  if (!currentSlot || !currentQuestion) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <p className="text-sm text-zinc-300">Unable to load current exam question slot.</p>
        <button
          type="button"
          onClick={onExitToSetup}
          className="rounded-xl bg-[#FFD60A] px-4 py-2 text-xs font-bold text-black"
        >
          Return to Setup
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Compact Sticky Exam Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F0F12]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#FFD60A] whitespace-nowrap">
                {paper.system === "punjab" ? "Punjab" : "FBISE"} · Class {paper.grade}
              </span>
              <span className="text-zinc-600 hidden sm:inline">·</span>
              <span className="font-mono text-xs text-zinc-400 truncate hidden sm:inline">
                {paper.subjectName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 tabular-nums mt-0.5">
              <span className="font-bold text-white">
                Q {currentIndex + 1} / {paper.slots.length}
              </span>
              <span className="text-zinc-500">·</span>
              <span>{summaryCounts.answered} Answered</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Timer Display */}
            {paper.isTimed && remainingSeconds !== null ? (
              <div
                aria-live="polite"
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs font-bold tabular-nums whitespace-nowrap ${
                  isCriticalTime
                    ? "border-red-500/60 bg-red-500/15 text-red-300"
                    : "border-white/15 bg-black/50 text-white"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{formatClock(remainingSeconds)}</span>
                {isCriticalTime && <span className="hidden sm:inline text-[10px]">LOW</span>}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-zinc-400 whitespace-nowrap">
                Untimed
              </div>
            )}

            {/* Pause strictly only if mode permits */}
            {paper.allowPause && (
              <button
                type="button"
                onClick={attempt.status === "paused" ? onResume : onPause}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#16161A] px-3 py-2 text-xs font-medium text-zinc-200 whitespace-nowrap hover:border-white/30"
              >
                {attempt.status === "paused" ? (
                  <>
                    <Play className="h-3.5 w-3.5 text-[#FFD60A]" />
                    <span className="hidden sm:inline">Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                )}
              </button>
            )}

            {/* Mobile Palette Trigger */}
            <button
              type="button"
              onClick={() => setMobilePaletteOpen(true)}
              aria-label="Open Question Palette"
              className="lg:hidden min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#16161A] px-3 py-2 text-xs font-medium text-zinc-200 whitespace-nowrap"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Map</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl bg-[#FFD60A] px-3.5 py-2 text-xs font-bold text-black whitespace-nowrap hover:bg-[#FFD60A]/90"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Pause Overlay (strictly blocks editing while timer paused in practice) */}
      {attempt.status === "paused" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="max-w-md w-full rounded-2xl border border-white/15 bg-[#121215] p-6 text-center space-y-4">
            <Pause className="h-8 w-8 text-[#FFD60A] mx-auto" />
            <h2 className="font-heading text-xl font-bold text-white">Practice Session Paused</h2>
            <p className="text-xs text-zinc-400">
              Your timer and responses are safely preserved. Resume whenever you are ready to continue.
            </p>
            <button
              type="button"
              onClick={onResume}
              className="min-h-[46px] w-full rounded-xl bg-[#FFD60A] px-4 py-2.5 text-sm font-bold text-black"
            >
              Resume Practice
            </button>
          </div>
        </div>
      )}

      {/* Main Split Workspace */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 pb-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Question Panel */}
          <div className="lg:col-span-8 space-y-4">
            {/* Section & Choice Group Context Bar */}
            {currentSection && currentGroup && (
              <div className="rounded-xl border border-white/10 bg-[#121215] p-3.5 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-heading font-bold text-white">
                    {currentSection.code} · {currentGroup.title}
                  </span>
                  <span
                    className={`font-mono tabular-nums ${
                      groupLimitExceeded ? "text-amber-400 font-bold" : "text-zinc-400"
                    }`}
                  >
                    Attempted in group: {currentGroupAnsweredCount} /{" "}
                    {currentGroup.requiredAttemptCount} required ({currentGroup.totalQuestions}{" "}
                    total)
                  </span>
                </div>
                {groupLimitExceeded && (
                  <p className="text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Extra responses beyond {currentGroup.requiredAttemptCount} in this choice group
                    will be marked &ldquo;Not Counted&rdquo; per board choice rules.
                  </p>
                )}
              </div>
            )}

            {/* Question Surface */}
            <article className="rounded-2xl border border-white/10 bg-[#121215] p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="font-bold text-[#FFD60A]">{currentSlot.displayNumber}</span>
                  <span>·</span>
                  <span className="capitalize">{currentQuestion.type.replace(/_/g, " ")}</span>
                  <span>·</span>
                  <span>{currentQuestion.difficulty}</span>
                </div>
                <span className="font-mono text-xs font-bold text-white tabular-nums">
                  {currentSlot.marks} {currentSlot.marks === 1 ? "Mark" : "Marks"}
                </span>
              </div>

              <div className="text-base sm:text-[17px] text-white leading-relaxed font-medium">
                <FormattedContent content={currentQuestion.prompt} />
              </div>

              <QuestionInputRenderer
                question={currentQuestion}
                slot={currentSlot}
                value={attempt.responses[currentSlot.slotId]}
                onChange={(val) => onSaveResponse(currentSlot.slotId, val)}
                disabled={attempt.status !== "in_progress"}
              />

              {/* Question Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleReview(currentSlot.slotId)}
                    className={`min-h-[42px] inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                      attempt.markedForReview[currentSlot.slotId]
                        ? "border-purple-400 bg-purple-500/15 text-purple-200"
                        : "border-white/10 bg-black/40 text-zinc-300 hover:border-white/25"
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {attempt.markedForReview[currentSlot.slotId]
                      ? "Marked for Review"
                      : "Mark for Review"}
                  </button>

                  {!isResponseEmpty(attempt.responses[currentSlot.slotId]) && (
                    <button
                      type="button"
                      onClick={() => onClearResponse(currentSlot.slotId)}
                      className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-medium text-zinc-300 whitespace-nowrap hover:border-white/25"
                    >
                      <Eraser className="h-3.5 w-3.5" />
                      Clear Response
                    </button>
                  )}
                </div>

                {/* Desktop Prev / Next */}
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentIndex <= 0}
                    onClick={() => onNavigate(currentIndex - 1)}
                    className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-xs font-medium text-zinc-200 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentIndex >= paper.slots.length - 1}
                    onClick={() => onNavigate(currentIndex + 1)}
                    className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-black disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Desktop Question Navigator Palette */}
          <aside className="hidden lg:block lg:col-span-4 rounded-2xl border border-white/10 bg-[#121215] p-5 space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading text-sm font-bold text-white">Question Navigator</h2>
              <span className="font-mono text-xs text-zinc-400 tabular-nums">
                {summaryCounts.answered}/{summaryCounts.total}
              </span>
            </div>

            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              {paper.sections.map((sec) => (
                <div key={sec.id} className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    {sec.code} ({sec.maxSectionMarks}m)
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {sec.choiceGroups.flatMap((g) => g.slotIds).map((slotId) => {
                      const idx = paper.slots.findIndex((s) => s.slotId === slotId);
                      const status = slotStatusMap[slotId];
                      const style =
                        status === "current"
                          ? "border-[#FFD60A] bg-[#FFD60A] text-black font-bold"
                          : status === "answered_marked"
                            ? "border-purple-400 bg-emerald-500/20 text-purple-200"
                            : status === "marked"
                              ? "border-purple-400/70 bg-purple-500/15 text-purple-200"
                              : status === "answered"
                                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                                : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/25";
                      return (
                        <button
                          key={slotId}
                          type="button"
                          onClick={() => onNavigate(idx)}
                          className={`h-9 rounded-lg border font-mono text-xs tabular-nums transition-colors ${style}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Palette Legend */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#FFD60A]" /> Current
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400/70" /> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-purple-400/80" /> Review
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm border border-white/25 bg-black/40" />{" "}
                Unanswered
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Compact Bottom Navigation Bar */}
      <footer className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-[#0F0F12]/95 backdrop-blur-md px-3 py-2 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={currentIndex <= 0}
          onClick={() => onNavigate(currentIndex - 1)}
          className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-[#16161A] text-xs font-semibold text-white disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <button
          type="button"
          onClick={() => setMobilePaletteOpen(true)}
          className="min-h-[44px] px-3 rounded-xl border border-white/10 bg-black/40 font-mono text-xs text-zinc-300 tabular-nums"
        >
          {currentIndex + 1}/{paper.slots.length}
        </button>
        <button
          type="button"
          disabled={currentIndex >= paper.slots.length - 1}
          onClick={() => onNavigate(currentIndex + 1)}
          className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-xs font-bold text-black disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </footer>

      {/* Mobile Question Palette Drawer */}
      {mobilePaletteOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end bg-black/75 backdrop-blur-sm">
          <div className="w-full max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-white/15 bg-[#121215] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-white">Question Navigator</h3>
              <button
                type="button"
                onClick={() => setMobilePaletteOpen(false)}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg border border-white/10 text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {paper.slots.map((slot, idx) => {
                const status = slotStatusMap[slot.slotId];
                const style =
                  status === "current"
                    ? "border-[#FFD60A] bg-[#FFD60A] text-black font-bold"
                    : status === "answered_marked" || status === "marked"
                      ? "border-purple-400 bg-purple-500/15 text-purple-200"
                      : status === "answered"
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                        : "border-white/10 bg-black/40 text-zinc-400";
                return (
                  <button
                    key={slot.slotId}
                    type="button"
                    onClick={() => {
                      onNavigate(idx);
                      setMobilePaletteOpen(false);
                    }}
                    className={`h-11 rounded-lg border font-mono text-xs tabular-nums ${style}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#121215] p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 id="submit-confirm-title" className="font-heading text-lg font-bold text-white">
                  Submit Paper for Marking?
                </h2>
                <p className="text-xs text-zinc-400">{paper.title}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[#FFD60A] shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                <div className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                  {summaryCounts.answered}
                </div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase">Answered</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                <div className="font-mono text-lg font-bold text-zinc-300 tabular-nums">
                  {summaryCounts.unanswered}
                </div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase">Unanswered</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                <div className="font-mono text-lg font-bold text-purple-300 tabular-nums">
                  {summaryCounts.marked}
                </div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase">Marked</div>
              </div>
            </div>

            {summaryCounts.unanswered > 0 && (
              <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                You still have {summaryCounts.unanswered} unanswered question(s). Submitting will
                score your responses and finalize this attempt.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="min-h-[42px] rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-xs font-medium text-zinc-200 hover:border-white/30"
              >
                Continue Solving
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  onSubmit("manual");
                }}
                className="min-h-[42px] rounded-xl bg-[#FFD60A] px-5 py-2 text-xs font-bold text-black hover:bg-[#FFD60A]/90"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
