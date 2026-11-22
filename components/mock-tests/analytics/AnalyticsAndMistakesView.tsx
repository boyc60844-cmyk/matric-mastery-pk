"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart3,
  BookMarked,
  CheckCircle2,
  Eye,
  Play,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  ExamAttemptRecord,
  ExamSystem,
  GradeLevel,
  MistakeNotebookEntry,
  MistakeReviewStatus,
} from "@/lib/mock-tests/types";
import { computeAnalyticsOverview } from "@/lib/mock-tests/analytics/analyticsEngine";

interface AnalyticsViewProps {
  history: ExamAttemptRecord[];
  mistakes: MistakeNotebookEntry[];
  onOpenAttemptReview: (attemptId: string) => void;
  onPracticeWeakTopic: (system: ExamSystem, grade: GradeLevel, subjectId: string, topicId: string) => void;
}

export function AnalyticsOverviewPanel({
  history,
  mistakes,
  onOpenAttemptReview,
  onPracticeWeakTopic,
}: AnalyticsViewProps) {
  const overview = useMemo(
    () => computeAnalyticsOverview(history, mistakes),
    [history, mistakes]
  );

  if (!overview.hasSufficientHistory) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#121215] p-8 text-center space-y-3">
        <BarChart3 className="h-8 w-8 text-zinc-500 mx-auto" />
        <h2 className="font-heading text-lg font-bold text-white">
          Complete a few tests to unlock your performance insights.
        </h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          We never display artificial trend lines or guesswork. Once you complete your first mock
          test or chapter drill, real accuracy, score trends, and verified weak topics appear here.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Real Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-4">
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {overview.totalAttempts}
          </div>
          <div className="font-mono text-[11px] uppercase text-zinc-400 mt-1">
            Completed Tests
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-4">
          <div className="font-mono text-2xl font-bold text-[#FFD60A] tabular-nums">
            {overview.averagePercentage}%
          </div>
          <div className="font-mono text-[11px] uppercase text-zinc-400 mt-1">
            Mean Score
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-4">
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {Math.round(overview.totalTimeSpentSeconds / 60)}m
          </div>
          <div className="font-mono text-[11px] uppercase text-zinc-400 mt-1">
            Total Exam Time
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-4">
          <div className="font-mono text-2xl font-bold text-zinc-200 tabular-nums">
            {mistakes.filter((m) => m.status !== "mastered").length}
          </div>
          <div className="font-mono text-[11px] uppercase text-zinc-400 mt-1">
            Active Mistakes
          </div>
        </div>
      </div>

      {/* Subject Performance & Weak/Strong Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#121215] p-5 space-y-4">
          <h2 className="font-heading text-base font-bold text-white">Subject Performance</h2>
          <div className="space-y-2.5">
            {overview.subjectSummaries.map((sub) => (
              <div
                key={sub.key}
                className="rounded-xl border border-white/10 bg-black/35 p-3.5 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-heading text-sm font-bold text-white">
                    {sub.subjectName} · Class {sub.grade}
                  </div>
                  <div className="font-mono text-[11px] text-zinc-400">
                    {sub.system.toUpperCase()} · {sub.attemptCount} attempt(s) · Best{" "}
                    {sub.bestPercentage}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-white tabular-nums">
                    {sub.averagePercentage}% avg
                  </div>
                  {sub.trendDelta !== null && (
                    <div
                      className={`inline-flex items-center gap-1 font-mono text-[11px] ${
                        sub.trendDelta >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {sub.trendDelta >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {sub.trendDelta >= 0 ? `+${sub.trendDelta}%` : `${sub.trendDelta}%`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#121215] p-5 space-y-4">
          <h2 className="font-heading text-base font-bold text-white">
            Verified Weak &amp; Strong Topics
          </h2>
          {overview.weakTopics.length === 0 && overview.strongTopics.length === 0 ? (
            <p className="text-xs text-zinc-400">
              Complete at least 2 questions within a topic across your attempts before weakness or
              mastery classifications are assigned.
            </p>
          ) : (
            <div className="space-y-3">
              {overview.weakTopics.map((wt) => (
                <div
                  key={`${wt.subjectId}:${wt.topicId}`}
                  className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{wt.topicTitle}</div>
                    <div className="font-mono text-[11px] text-amber-300 tabular-nums">
                      {wt.accuracyPercent}% accuracy · {wt.totalQuestions} graded Qs
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onPracticeWeakTopic(wt.system, wt.grade, wt.subjectId, wt.topicId)
                    }
                    className="min-h-[36px] inline-flex items-center gap-1.5 rounded-lg bg-[#FFD60A] px-3 py-1.5 text-xs font-bold text-black whitespace-nowrap"
                  >
                    <Target className="h-3.5 w-3.5" />
                    Drill Topic
                  </button>
                </div>
              ))}
              {overview.strongTopics.map((st) => (
                <div
                  key={`${st.subjectId}:${st.topicId}`}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{st.topicTitle}</div>
                    <div className="font-mono text-[11px] text-emerald-400 tabular-nums">
                      {st.accuracyPercent}% accuracy · {st.totalQuestions} graded Qs
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-emerald-400">Strong</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Recent Attempts History */}
      <section className="rounded-2xl border border-white/10 bg-[#121215] p-5 space-y-4">
        <h2 className="font-heading text-base font-bold text-white">Recent Attempts</h2>
        <div className="divide-y divide-white/10">
          {overview.recentAttempts.map((att) => (
            <div
              key={att.attemptId}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              <div>
                <div className="text-sm font-semibold text-white">{att.title}</div>
                <div className="font-mono text-[11px] text-zinc-400">
                  {att.system.toUpperCase()} · Class {att.grade} ·{" "}
                  {new Date(att.dateMs).toLocaleDateString()}
                  {att.pendingReviewCount > 0
                    ? ` · ${att.pendingReviewCount} pending self-review`
                    : ""}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  {att.obtainedMarks}/{att.totalMarks} ({att.percentage}%)
                </span>
                <button
                  type="button"
                  onClick={() => onOpenAttemptReview(att.attemptId)}
                  className="min-h-[38px] inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-[#FFD60A]/60"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

interface MistakeNotebookPanelProps {
  mistakes: MistakeNotebookEntry[];
  onUpdateStatus: (entryId: string, status: MistakeReviewStatus) => void;
  onDeleteEntry: (entryId: string) => void;
  onRetryMistakes: (system: ExamSystem, grade: GradeLevel, subjectId: string, qIds: string[]) => void;
}

export function MistakeNotebookPanel({
  mistakes,
  onUpdateStatus,
  onDeleteEntry,
  onRetryMistakes,
}: MistakeNotebookPanelProps) {
  const [statusFilter, setStatusFilter] = useState<MistakeReviewStatus | "all">("all");

  const visible = useMemo(
    () => mistakes.filter((m) => statusFilter === "all" || m.status === statusFilter),
    [mistakes, statusFilter]
  );

  // Group retry CTA by first available active mistake subject
  const activeMistakeGroup = useMemo(() => {
    const active = mistakes.filter((m) => m.status !== "mastered");
    if (active.length === 0) return null;
    const first = active[0];
    const matchingIds = active
      .filter((m) => m.system === first.system && m.grade === first.grade && m.subjectId === first.subjectId)
      .map((m) => m.questionId);
    return {
      system: first.system,
      grade: first.grade,
      subjectId: first.subjectId,
      questionIds: matchingIds,
    };
  }, [mistakes]);

  if (mistakes.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#121215] p-8 text-center space-y-3">
        <BookMarked className="h-8 w-8 text-zinc-500 mx-auto" />
        <h2 className="font-heading text-lg font-bold text-white">
          Your Mistake Notebook is Empty
        </h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          Incorrect or partial answers from completed tests are automatically indexed here by
          question version so you can review explanations and re-drill them anytime.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "unreviewed", "reviewed", "mastered"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`min-h-[36px] rounded-xl border px-3 py-1.5 text-xs font-medium capitalize ${
                statusFilter === st
                  ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                  : "border-white/10 bg-[#121215] text-zinc-300"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {activeMistakeGroup && (
          <button
            type="button"
            onClick={() =>
              onRetryMistakes(
                activeMistakeGroup.system,
                activeMistakeGroup.grade,
                activeMistakeGroup.subjectId,
                activeMistakeGroup.questionIds
              )
            }
            className="min-h-[40px] inline-flex items-center gap-2 rounded-xl bg-[#FFD60A] px-4 py-2 text-xs font-bold text-black"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Practice Active Mistakes ({activeMistakeGroup.questionIds.length})
          </button>
        )}
      </div>

      <div className="space-y-3">
        {visible.map((m) => (
          <article
            key={m.id}
            className="rounded-2xl border border-white/10 bg-[#121215] p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="text-zinc-400">
                <span className="text-[#FFD60A] font-bold">{m.questionId}</span> ·{" "}
                {m.system.toUpperCase()} Class {m.grade} · {m.subjectId} · Missed {m.wrongCount}x
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Mistake review status"
                  value={m.status}
                  onChange={(e) => onUpdateStatus(m.id, e.target.value as MistakeReviewStatus)}
                  className="rounded-lg border border-white/15 bg-black/50 px-2.5 py-1 text-xs text-white"
                >
                  <option value="unreviewed">Unreviewed</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="mastered">Mastered</option>
                </select>
                <button
                  type="button"
                  aria-label="Remove mistake entry"
                  onClick={() => onDeleteEntry(m.id)}
                  className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3">
                <span className="font-mono text-[10px] uppercase text-red-400 block mb-1">
                  Your Recorded Answer
                </span>
                <p className="text-zinc-200">{m.studentResponseSummary}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
                <span className="font-mono text-[10px] uppercase text-emerald-400 block mb-1">
                  Verified Answer
                </span>
                <p className="text-zinc-100">{m.correctResponseSummary}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              <span className="font-mono text-zinc-400">Explanation: </span>
              {m.explanation}
            </p>
          </article>
        ))}

        {visible.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> No entries match this status filter.
          </div>
        )}
      </div>
    </div>
  );
}
