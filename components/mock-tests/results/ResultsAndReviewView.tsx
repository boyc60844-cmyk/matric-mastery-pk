"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookMarked,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Printer,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import {
  EvaluatedQuestionResult,
  ExamAttemptRecord,
  MistakeNotebookEntry,
} from "@/lib/mock-tests/types";
import {
  formatCorrectResponseSummary,
  formatStudentResponseSummary,
} from "@/lib/mock-tests/scoring/answerValidator";
import { FormattedContent } from "@/components/mock-tests/question-types/FormattedContent";

interface ResultsAndReviewViewProps {
  attempt: ExamAttemptRecord;
  mistakeNotebook: MistakeNotebookEntry[];
  onApplySelfReview: (slotId: string, checkedCriterionIds: string[]) => void;
  onRetryIncorrect: (questionIds: string[]) => void;
  onPracticeWeakestTopic: (topicId: string) => void;
  onReturnToSetup: () => void;
}

type ReviewFilter = "all" | "incorrect" | "unanswered" | "pending_review" | "marked";

export function ResultsAndReviewView({
  attempt,
  mistakeNotebook,
  onApplySelfReview,
  onRetryIncorrect,
  onPracticeWeakestTopic,
  onReturnToSetup,
}: ResultsAndReviewViewProps) {
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [draftCriteriaBySlot, setDraftCriteriaBySlot] = useState<Record<string, string[]>>({});

  const scoring = attempt.scoring;

  const mistakeIds = useMemo(
    () => new Set(mistakeNotebook.map((m) => m.questionId)),
    [mistakeNotebook]
  );

  const filteredItems = useMemo(() => {
    if (!scoring) return [];
    return scoring.itemResults.filter((item) => {
      if (filter === "incorrect") return item.status === "incorrect" || item.status === "partial";
      if (filter === "unanswered") return item.status === "unanswered";
      if (filter === "pending_review") return item.status === "pending_review";
      if (filter === "marked") return Boolean(attempt.markedForReview[item.slotId]);
      return true;
    });
  }, [scoring, filter, attempt.markedForReview]);

  if (!scoring) {
    return null;
  }

  const incorrectQuestionIds = scoring.itemResults
    .filter((i) => i.status === "incorrect" || i.status === "partial")
    .map((i) => i.questionId);

  const weakestTopic = [...(scoring.objectiveTopicBreakdown ?? scoring.topicBreakdown)]
    .filter((t) => t.accuracyPercent !== null && t.accuracyPercent < 80)
    .sort((a, b) => (a.accuracyPercent ?? 100) - (b.accuracyPercent ?? 100))[0];

  const handleToggleCriterion = (slotId: string, criterionId: string, existingChecked: string[]) => {
    const current = draftCriteriaBySlot[slotId] ?? existingChecked;
    const next = current.includes(criterionId)
      ? current.filter((c) => c !== criterionId)
      : [...current, criterionId];
    setDraftCriteriaBySlot((prev) => ({ ...prev, [slotId]: next }));
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${String(s).padStart(2, "0")}s`;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 space-y-8 print:text-black print:bg-white">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onReturnToSetup}
          className="min-h-[42px] inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#121215] px-4 py-2 text-xs font-medium text-zinc-200 hover:border-white/30"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Setup Hub
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {incorrectQuestionIds.length > 0 && (
            <button
              type="button"
              onClick={() => onRetryIncorrect(incorrectQuestionIds)}
              className="min-h-[42px] inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#121215] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#FFD60A]/60"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#FFD60A]" />
              Retry Missed ({incorrectQuestionIds.length})
            </button>
          )}
          {weakestTopic && (
            <button
              type="button"
              onClick={() => onPracticeWeakestTopic(weakestTopic.topicId)}
              className="min-h-[42px] inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#121215] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#FFD60A]/60"
            >
              <Target className="h-3.5 w-3.5 text-[#FFD60A]" />
              Practice Weakest Topic
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[42px] inline-flex items-center gap-2 rounded-xl bg-[#FFD60A] px-4 py-2 text-xs font-bold text-black hover:bg-[#FFD60A]/90"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Result Sheet
          </button>
        </div>
      </div>

      {/* Overview Header & Honest Score Separation */}
      <section className="rounded-2xl border border-white/10 bg-[#121215] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-wider text-[#FFD60A]">
              {attempt.paper.system === "punjab" ? "Punjab Boards" : "FBISE Islamabad"} · Class{" "}
              {attempt.paper.grade} · {attempt.paper.mode.replace(/_/g, " ")}
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              {attempt.paper.title}
            </h1>
            <p className="text-xs font-mono text-zinc-400">
              Completed in {formatDuration(scoring.timeSpentSeconds)} · Pass Policy:{" "}
              {scoring.passingPercentage}% (IBCC Standard)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right space-y-1">
              <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                {scoring.hasMixedSelfAssessment
                  ? "Indicative Combined Total"
                  : scoring.pendingSubjectiveMarks > 0
                    ? "Verified So Far"
                    : "Verified Score"}
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-bold text-white tabular-nums">
                {scoring.indicativeCombinedMarks} / {scoring.totalMarks}
              </div>
              <div className="font-mono text-xs text-zinc-400 tabular-nums">
                {scoring.indicativeCombinedPercentage}%{" "}
                {scoring.pendingReviewMarks > 0
                  ? `(${scoring.pendingSubjectiveMarks}m pending self-review)`
                  : scoring.passedByPolicy
                    ? "· Meets Pass Threshold"
                    : "· Below 40% Threshold"}
              </div>
            </div>
          </div>
        </div>

        {/* Strictly Separated Score Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
              1. Auto-Verified Objective Score
            </div>
            <div className="font-mono text-2xl font-bold text-white tabular-nums">
              {scoring.autoVerifiedObtainedMarks} / {scoring.autoVerifiedMaxMarks}
            </div>
            <div className="font-mono text-xs text-emerald-300/90 tabular-nums">
              Accuracy:{" "}
              {scoring.autoVerifiedAccuracy !== null ? `${scoring.autoVerifiedAccuracy}%` : "N/A"} ·
              Synced to Analytics &amp; XP
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300">
              2. Self-Assessed Subjective (Rubric)
            </div>
            <div className="font-mono text-2xl font-bold text-white tabular-nums">
              {scoring.selfAssessedObtainedMarks} / {scoring.selfAssessedMaxMarks}
            </div>
            <div className="font-mono text-xs text-amber-200/80 tabular-nums">
              {scoring.selfAssessedMaxMarks > 0
                ? "Student rubric self-check — never alters objective accuracy"
                : `${scoring.pendingSubjectiveMarks}m awaiting rubric self-check`}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              3. Indicative Combined Summary
            </div>
            <div className="font-mono text-2xl font-bold text-[#FFD60A] tabular-nums">
              {scoring.indicativeCombinedMarks} / {scoring.totalMarks} ({scoring.indicativeCombinedPercentage}%)
            </div>
            <div className="font-mono text-xs text-zinc-400 tabular-nums">
              {scoring.correctCount} correct · {scoring.incorrectCount} wrong ·{" "}
              {scoring.unansweredCount} blank
              {scoring.notCountedChoiceCount > 0
                ? ` · ${scoring.notCountedChoiceCount} choice overflow`
                : ""}
            </div>
          </div>
        </div>

        {scoring.pendingReviewCount > 0 && (
          <div className="rounded-xl border border-[#FFD60A]/35 bg-[#FFD60A]/[0.07] p-4 flex items-start gap-3 text-xs text-zinc-200">
            <ClipboardCheck className="h-4 w-4 text-[#FFD60A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">
                {scoring.pendingReviewCount} descriptive / derivation item(s) ({scoring.pendingReviewMarks} marks)
                await Student Rubric Self-Review below.
              </strong>{" "}
              Subjective answers are never guessed by fake AI scoring — check marking criteria below
              to update your Indicative Combined score. Auto-Verified Objective Accuracy remains strictly isolated.
            </div>
          </div>
        )}
      </section>

      {/* Topic Breakdown & SLO Breakdown */}
      {(scoring.topicBreakdown.length > 0 || scoring.sloBreakdown.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-white/10 bg-[#121215] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-heading text-base font-bold text-white">
                Auto-Verified Objective Topic Breakdown
              </h2>
              <span className="font-mono text-[10px] uppercase text-emerald-400">Objective Only</span>
            </div>
            <div className="space-y-2.5">
              {(scoring.objectiveTopicBreakdown ?? scoring.topicBreakdown).map((t) => (
                <div
                  key={`${t.chapterId}:${t.topicId}`}
                  className="rounded-xl border border-white/10 bg-black/35 p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-white">{t.topicTitle}</span>
                    <span className="font-mono text-zinc-300 tabular-nums">
                      {t.accuracyPercent !== null ? `${t.accuracyPercent}%` : "N/A"} (
                      {t.obtainedMarks}/{t.availableMarks}m)
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {t.chapterTitle} · {t.questionCount} objective item(s)
                  </div>
                </div>
              ))}
              {(scoring.objectiveTopicBreakdown ?? scoring.topicBreakdown).length === 0 && (
                <p className="text-xs text-zinc-400">
                  No auto-verified objective items counted in this paper.
                </p>
              )}
            </div>

            {scoring.selfAssessedTopicBreakdown && scoring.selfAssessedTopicBreakdown.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-amber-300">
                    Self-Assessed Subjective Topics
                  </h3>
                  <span className="font-mono text-[10px] text-zinc-400">Rubric Self-Check</span>
                </div>
                {scoring.selfAssessedTopicBreakdown.map((t) => (
                  <div
                    key={`self-${t.chapterId}:${t.topicId}`}
                    className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-2.5 flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="text-zinc-200">{t.topicTitle}</span>
                    <span className="font-mono text-amber-200 tabular-nums">
                      {t.obtainedMarks}/{t.availableMarks}m ({t.questionCount} item)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {scoring.sloBreakdown.length > 0 && (
            <section className="rounded-2xl border border-white/10 bg-[#121215] p-5 space-y-4">
              <h2 className="font-heading text-base font-bold text-white">
                SLO Performance Breakdown
              </h2>
              <div className="space-y-2.5">
                {scoring.sloBreakdown.map((s) => (
                  <div
                    key={s.sloId}
                    className="rounded-xl border border-white/10 bg-black/35 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="font-bold text-[#FFD60A]">
                        {s.sloCode} · {s.cognitiveLevel}
                      </span>
                      <span className="text-zinc-200 tabular-nums">
                        {s.obtainedMarks}/{s.availableMarks}m ({s.questionCount} Qs)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-snug">{s.statement}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Question-by-Question Review */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-bold text-white">
            Question-by-Question Review
          </h2>

          <div className="flex flex-wrap gap-1.5 print:hidden">
            {[
              { id: "all" as const, label: `All (${scoring.itemResults.length})` },
              {
                id: "incorrect" as const,
                label: `Incorrect/Partial (${scoring.incorrectCount + scoring.partialCount})`,
              },
              { id: "pending_review" as const, label: `Pending Review (${scoring.pendingReviewCount})` },
              { id: "unanswered" as const, label: `Unanswered (${scoring.unansweredCount})` },
              { id: "marked" as const, label: "Marked for Review" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`min-h-[36px] rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                    : "border-white/10 bg-[#121215] text-zinc-300 hover:border-white/25"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.map((item: EvaluatedQuestionResult) => {
            const q = attempt.paper.questionsById[item.questionId];
            if (!q) return null;

            const studentSummary = formatStudentResponseSummary(q, item.studentResponse);
            const correctSummary = formatCorrectResponseSummary(q);
            const existingChecked = item.selfReview?.checkedCriterionIds ?? [];
            const currentDraft = draftCriteriaBySlot[item.slotId] ?? existingChecked;

            const badgeColor =
              item.status === "correct"
                ? "text-emerald-400"
                : item.status === "partial" || item.status === "self_reviewed"
                  ? "text-amber-300"
                  : item.status === "not_counted_choice"
                    ? "text-amber-400"
                    : item.status === "pending_review"
                      ? "text-[#FFD60A]"
                      : item.status === "incorrect"
                        ? "text-red-400"
                        : "text-zinc-400";

            const statusLabel =
              item.status === "not_counted_choice"
                ? "Excluded (Choice Overflow)"
                : item.status.replace(/_/g, " ");

            return (
              <article
                key={item.slotId}
                className="rounded-2xl border border-white/10 bg-[#121215] p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-[#FFD60A]">{item.displayNumber}</span>
                    <span className="text-zinc-500">·</span>
                    <span className={`font-semibold uppercase ${badgeColor}`}>
                      {statusLabel}
                    </span>
                    {mistakeIds.has(q.id) && (
                      <>
                        <span className="text-zinc-500">·</span>
                        <span className="inline-flex items-center gap-1 text-zinc-300">
                          <BookMarked className="h-3 w-3 text-[#FFD60A]" /> Saved in Mistake Notebook
                        </span>
                      </>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-white tabular-nums">
                    {item.awardedMarks === null ? `Pending / ${item.maxMarks}m` : `${item.awardedMarks} / ${item.maxMarks}m`}
                  </span>
                </div>

                <div className="text-sm text-white leading-relaxed">
                  <FormattedContent content={q.prompt} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-black/35 p-3 space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      Your Answer
                    </span>
                    <p className="text-zinc-200 whitespace-pre-wrap">{studentSummary}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                      Verified Answer Key / Model Response
                    </span>
                    <p className="text-zinc-100 whitespace-pre-wrap">{correctSummary}</p>
                  </div>
                </div>

                {/* Numerical Step Solution */}
                {q.type === "numerical" && q.stepByStepSolution.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-1 text-xs">
                    <span className="font-mono text-[10px] uppercase text-zinc-400">
                      Step-by-Step Solution
                    </span>
                    <ol className="list-decimal list-inside space-y-0.5 text-zinc-300 font-mono">
                      {q.stepByStepSolution.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Rubric Self-Review Card for Subjective Items */}
                {q.rubric && (item.status === "pending_review" || item.status === "self_reviewed") && (
                  <div className="rounded-xl border border-[#FFD60A]/30 bg-[#FFD60A]/[0.05] p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading text-xs font-bold text-[#FFD60A]">
                        Student Rubric Self-Review ({item.maxMarks} Marks Max)
                      </span>
                      <span className="font-mono text-xs text-zinc-200 tabular-nums">
                        Selected:{" "}
                        {q.rubric.criteria
                          .filter((c) => currentDraft.includes(c.id))
                          .reduce((sum, c) => sum + c.marks, 0)}{" "}
                        / {q.rubric.maxMarks}m
                      </span>
                    </div>

                    <div className="space-y-2">
                      {q.rubric.criteria.map((crit) => {
                        const checked = currentDraft.includes(crit.id);
                        return (
                          <label
                            key={crit.id}
                            className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-black/40 p-2.5 text-xs cursor-pointer hover:border-white/25"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                handleToggleCriterion(item.slotId, crit.id, existingChecked)
                              }
                              className="mt-0.5 accent-[#FFD60A]"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2 font-semibold text-white">
                                <span>{crit.label}</span>
                                <span className="font-mono text-[#FFD60A] tabular-nums">
                                  +{crit.marks}m
                                </span>
                              </div>
                              <p className="text-zinc-400 mt-0.5">{crit.detail}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => onApplySelfReview(item.slotId, currentDraft)}
                      className="min-h-[38px] inline-flex items-center gap-1.5 rounded-xl bg-[#FFD60A] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#FFD60A]/90"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {item.status === "self_reviewed"
                        ? "Update Self-Review Marks"
                        : "Save Self-Review Marks"}
                    </button>
                  </div>
                )}

                <div className="text-xs text-zinc-400 leading-relaxed pt-1">
                  <span className="font-mono text-zinc-300">Explanation: </span>
                  {q.explanation}
                  {item.feedback && (
                    <span className="block font-mono text-[11px] text-zinc-500 mt-1">
                      Marking Note: {item.feedback}
                    </span>
                  )}
                </div>
              </article>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#121215] p-8 text-center text-xs text-zinc-400">
              No questions match this filter.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
