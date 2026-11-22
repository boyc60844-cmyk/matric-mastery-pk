"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ExamAttemptRecord,
  ExamSystem,
  GeneratedPaperSnapshot,
  GradeLevel,
  MistakeReviewStatus,
  PersistedMockTestStoreV2,
  StudentResponseValue,
} from "@/lib/mock-tests/types";
import {
  createEmptyStore,
  loadMockEngineStore,
  saveActiveAttemptToStore,
  archiveCompletedAttempt,
  upsertMistakeEntries,
  saveMockEngineStore,
} from "@/lib/mock-tests/persistence/storage";
import {
  applySubjectiveSelfReview,
  clearAttemptResponse,
  extractMistakesFromAttempt,
  getRemainingSeconds,
  navigateToSlot,
  pauseAttempt,
  resumeAttempt,
  saveAttemptResponse,
  startNewAttempt,
  submitAttempt,
  toggleMarkForReview,
} from "@/lib/mock-tests/attempts/attemptMachine";
import { generatePracticePaper } from "@/lib/mock-tests/blueprint/paperGenerator";
import { recordMockTestResult } from "@/lib/progress";
import {
  MockTestSetupHub,
  SetupHubTab,
} from "@/components/mock-tests/setup/MockTestSetupHub";
import { ExamWorkspace } from "@/components/mock-tests/exam/ExamWorkspace";
import { ResultsAndReviewView } from "@/components/mock-tests/results/ResultsAndReviewView";
import {
  AnalyticsOverviewPanel,
  MistakeNotebookPanel,
} from "@/components/mock-tests/analytics/AnalyticsAndMistakesView";

type PageStage = "setup" | "exam" | "results";

export default function MockTestsPage() {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<PersistedMockTestStoreV2>(() => createEmptyStore());
  const [stage, setStage] = useState<PageStage>("setup");
  const [setupTab, setSetupTab] = useState<SetupHubTab>("configure");
  const [viewedResultAttempt, setViewedResultAttempt] = useState<ExamAttemptRecord | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Clean load from localStorage on mount & recover expired timed exams transparently
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("mm_active_mock_exam_session_v1");
      }
    } catch {
      // Ignore storage guard errors
    }

    const loaded = loadMockEngineStore();
    if (loaded.activeAttempt) {
      const rem = getRemainingSeconds(loaded.activeAttempt, Date.now());
      if (
        loaded.activeAttempt.paper.isTimed &&
        loaded.activeAttempt.status === "in_progress" &&
        rem !== null &&
        rem <= 0
      ) {
        // Deadline passed while browser tab was closed — auto-finalize honestly
        const completed = submitAttempt(loaded.activeAttempt, "expired", Date.now());
        const afterArchive = archiveCompletedAttempt(completed);
        const mistakes = extractMistakesFromAttempt(completed);
        const afterMistakes = mistakes.length > 0 ? upsertMistakeEntries(mistakes) : afterArchive;
        setStore(afterMistakes);
        setViewedResultAttempt(completed);
        setStage("results");
        setHydrated(true);
        return;
      }
    }

    setStore(loaded);
    setHydrated(true);
  }, []);

  const syncCompletedAttemptToGlobalProgress = useCallback((completed: ExamAttemptRecord) => {
    if (!completed.scoring) return;
    const sc = completed.scoring;
    const classLabel = `Class ${completed.paper.grade}` as
      | "Class 9"
      | "Class 10"
      | "Class 11"
      | "Class 12";
    recordMockTestResult({
      id: completed.attemptId,
      system: completed.paper.system,
      className: classLabel,
      subject: completed.paper.subjectName,
      chapter: completed.paper.mode.replace(/_/g, " "),
      totalMarks: sc.totalMarks,
      score: sc.obtainedMarks,
      percentage: sc.percentage,
      correctCount: sc.correctCount,
      incorrectCount: sc.incorrectCount,
      unansweredCount: sc.unansweredCount,
      accuracy: sc.autoGradedAccuracy ?? sc.percentage,
      timeUsedSeconds: sc.timeSpentSeconds,
      averageSecondsPerQuestion:
        completed.paper.slots.length > 0
          ? Math.round(sc.timeSpentSeconds / completed.paper.slots.length)
          : 0,
      date: new Date(completed.submittedAtMs ?? Date.now()).toISOString(),
      topicBreakdown: sc.topicBreakdown.map((t) => ({
        topic: t.topicTitle,
        correct: Math.max(0, t.questionCount - t.incorrectCount - t.pendingReviewCount),
        total: t.questionCount,
      })),
      improvementSuggestions:
        sc.pendingReviewCount > 0
          ? [`Complete Rubric Self-Review for ${sc.pendingReviewCount} subjective response(s).`]
          : [],
    });
  }, []);

  const handleStartGeneratedPaper = useCallback((paper: GeneratedPaperSnapshot) => {
    const attempt = startNewAttempt(paper, Date.now());
    const nextStore = saveActiveAttemptToStore(attempt);
    setStore(nextStore);
    setViewedResultAttempt(null);
    setStage("exam");
    setActionToast(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleResumeActiveAttempt = useCallback(() => {
    if (!store.activeAttempt) return;
    if (store.activeAttempt.status === "paused") {
      const resumed = resumeAttempt(store.activeAttempt, Date.now());
      const nextStore = saveActiveAttemptToStore(resumed);
      setStore(nextStore);
    }
    setStage("exam");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [store.activeAttempt]);

  const handleDiscardActiveAttempt = useCallback(() => {
    const nextStore = saveActiveAttemptToStore(null);
    setStore(nextStore);
    setActionToast(null);
  }, []);

  const updateActiveAttempt = useCallback((updater: (prev: ExamAttemptRecord) => ExamAttemptRecord) => {
    setStore((prevStore) => {
      if (!prevStore.activeAttempt) return prevStore;
      const updated = updater(prevStore.activeAttempt);
      const nextStore: PersistedMockTestStoreV2 = {
        ...prevStore,
        activeAttempt: updated,
      };
      saveMockEngineStore(nextStore);
      return nextStore;
    });
  }, []);

  const handleSaveResponse = useCallback(
    (slotId: string, value: StudentResponseValue) => {
      updateActiveAttempt((prev) => saveAttemptResponse(prev, slotId, value));
    },
    [updateActiveAttempt]
  );

  const handleClearResponse = useCallback(
    (slotId: string) => {
      updateActiveAttempt((prev) => clearAttemptResponse(prev, slotId));
    },
    [updateActiveAttempt]
  );

  const handleToggleReview = useCallback(
    (slotId: string) => {
      updateActiveAttempt((prev) => toggleMarkForReview(prev, slotId));
    },
    [updateActiveAttempt]
  );

  const handleNavigateSlot = useCallback(
    (slotIndex: number) => {
      updateActiveAttempt((prev) => navigateToSlot(prev, slotIndex));
    },
    [updateActiveAttempt]
  );

  const handlePauseAttempt = useCallback(() => {
    updateActiveAttempt((prev) => pauseAttempt(prev, Date.now()));
  }, [updateActiveAttempt]);

  const handleResumeInExam = useCallback(() => {
    updateActiveAttempt((prev) => resumeAttempt(prev, Date.now()));
  }, [updateActiveAttempt]);

  const handleSubmitAttempt = useCallback(
    (reason: "manual" | "expired") => {
      const current = store.activeAttempt;
      if (!current) return;

      const completed = submitAttempt(current, reason, Date.now());
      archiveCompletedAttempt(completed);
      const mistakes = extractMistakesFromAttempt(completed);
      const updatedStore =
        mistakes.length > 0 ? upsertMistakeEntries(mistakes) : loadMockEngineStore();

      syncCompletedAttemptToGlobalProgress(completed);
      setStore(updatedStore);
      setViewedResultAttempt(completed);
      setStage("results");
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [store.activeAttempt, syncCompletedAttemptToGlobalProgress]
  );

  const handleApplySelfReview = useCallback(
    (slotId: string, checkedCriterionIds: string[]) => {
      if (!viewedResultAttempt) return;
      const updated = applySubjectiveSelfReview(
        viewedResultAttempt,
        slotId,
        checkedCriterionIds,
        Date.now()
      );
      const nextStore = archiveCompletedAttempt(updated);
      const newMistakes = extractMistakesFromAttempt(updated);
      const finalStore =
        newMistakes.length > 0 ? upsertMistakeEntries(newMistakes) : nextStore;
      setStore(finalStore);
      setViewedResultAttempt(updated);
    },
    [viewedResultAttempt]
  );

  const launchTargetedPractice = useCallback(
    (params: {
      system: ExamSystem;
      grade: GradeLevel;
      subjectId: string;
      mode: "weak_areas" | "chapter_test";
      prioritizedQuestionIds?: string[];
      topicIds?: string[];
    }) => {
      const res = generatePracticePaper({
        mode: params.mode,
        system: params.system,
        grade: params.grade,
        subjectId: params.subjectId,
        prioritizedQuestionIds: params.prioritizedQuestionIds,
        topicIds: params.topicIds,
        requestedCount: Math.min(Math.max(3, params.prioritizedQuestionIds?.length ?? 6), 10),
        isTimed: true,
        durationMinutes: 15,
      });
      if (!res.ok) {
        setActionToast(`${res.reason}: ${res.details.join(" ")}`);
        return;
      }
      handleStartGeneratedPaper(res.paper);
    },
    [handleStartGeneratedPaper]
  );

  const handleUpdateMistakeStatus = useCallback((entryId: string, status: MistakeReviewStatus) => {
    setStore((prev) => {
      const nextStore: PersistedMockTestStoreV2 = {
        ...prev,
        mistakeNotebook: prev.mistakeNotebook.map((m) =>
          m.id === entryId ? { ...m, status } : m
        ),
      };
      saveMockEngineStore(nextStore);
      return nextStore;
    });
  }, []);

  const handleDeleteMistakeEntry = useCallback((entryId: string) => {
    setStore((prev) => {
      const nextStore: PersistedMockTestStoreV2 = {
        ...prev,
        mistakeNotebook: prev.mistakeNotebook.filter((m) => m.id !== entryId),
      };
      saveMockEngineStore(nextStore);
      return nextStore;
    });
  }, []);

  const handleOpenAttemptReview = useCallback(
    (attemptId: string) => {
      const found = store.attemptHistory.find((a) => a.attemptId === attemptId);
      if (!found) return;
      setViewedResultAttempt(found);
      setStage("results");
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [store.attemptHistory]
  );

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-6 animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-white/10" />
        <div className="h-48 w-full rounded-2xl bg-white/[0.05] border border-white/10" />
      </div>
    );
  }

  if (stage === "exam" && store.activeAttempt) {
    return (
      <ExamWorkspace
        attempt={store.activeAttempt}
        onSaveResponse={handleSaveResponse}
        onClearResponse={handleClearResponse}
        onToggleReview={handleToggleReview}
        onNavigate={handleNavigateSlot}
        onPause={handlePauseAttempt}
        onResume={handleResumeInExam}
        onSubmit={handleSubmitAttempt}
        onExitToSetup={() => setStage("setup")}
      />
    );
  }

  if (stage === "results" && viewedResultAttempt) {
    return (
      <ResultsAndReviewView
        attempt={viewedResultAttempt}
        mistakeNotebook={store.mistakeNotebook}
        onApplySelfReview={handleApplySelfReview}
        onRetryIncorrect={(qIds) =>
          launchTargetedPractice({
            system: viewedResultAttempt.paper.system,
            grade: viewedResultAttempt.paper.grade,
            subjectId: viewedResultAttempt.paper.subjectId,
            mode: "weak_areas",
            prioritizedQuestionIds: qIds,
          })
        }
        onPracticeWeakestTopic={(topicId) =>
          launchTargetedPractice({
            system: viewedResultAttempt.paper.system,
            grade: viewedResultAttempt.paper.grade,
            subjectId: viewedResultAttempt.paper.subjectId,
            mode: "chapter_test",
            topicIds: [topicId],
          })
        }
        onReturnToSetup={() => {
          setStage("setup");
          window.scrollTo({ top: 0, behavior: "auto" });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {actionToast && (
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 flex items-center justify-between gap-2">
            <span>{actionToast}</span>
            <button
              type="button"
              onClick={() => setActionToast(null)}
              className="font-mono text-xs underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <MockTestSetupHub
        activeTab={setupTab}
        onTabChange={(tab) => {
          setSetupTab(tab);
          setActionToast(null);
        }}
        activeAttempt={store.activeAttempt}
        attemptHistory={store.attemptHistory}
        mistakeNotebook={store.mistakeNotebook}
        onResumeActiveAttempt={handleResumeActiveAttempt}
        onDiscardActiveAttempt={handleDiscardActiveAttempt}
        onStartGeneratedPaper={handleStartGeneratedPaper}
        analyticsSlot={
          <AnalyticsOverviewPanel
            history={store.attemptHistory}
            mistakes={store.mistakeNotebook}
            onOpenAttemptReview={handleOpenAttemptReview}
            onPracticeWeakTopic={(system, grade, subjectId, topicId) =>
              launchTargetedPractice({
                system,
                grade,
                subjectId,
                mode: "chapter_test",
                topicIds: [topicId],
              })
            }
          />
        }
        mistakesSlot={
          <MistakeNotebookPanel
            mistakes={store.mistakeNotebook}
            onUpdateStatus={handleUpdateMistakeStatus}
            onDeleteEntry={handleDeleteMistakeEntry}
            onRetryMistakes={(system, grade, subjectId, qIds) =>
              launchTargetedPractice({
                system,
                grade,
                subjectId,
                mode: "weak_areas",
                prioritizedQuestionIds: qIds,
              })
            }
          />
        }
      />
    </div>
  );
}
