import {
  ExamAttemptRecord,
  GeneratedPaperSnapshot,
  MistakeNotebookEntry,
  StudentResponseValue,
  SubjectiveSelfReviewEntry,
} from "@/lib/mock-tests/types";
import { scoreExamAttempt } from "@/lib/mock-tests/scoring/scoringEngine";
import {
  formatCorrectResponseSummary,
  formatStudentResponseSummary,
} from "@/lib/mock-tests/scoring/answerValidator";

export function startNewAttempt(
  paper: GeneratedPaperSnapshot,
  nowMs: number = Date.now()
): ExamAttemptRecord {
  const deadlineMs =
    paper.isTimed && paper.durationMinutes > 0
      ? nowMs + paper.durationMinutes * 60_000
      : null;

  return {
    attemptId: `att-${paper.paperId}-${nowMs}`,
    status: "in_progress",
    paper,
    startedAtMs: nowMs,
    deadlineMs,
    pausedAtMs: null,
    remainingMsAtPause: null,
    submittedAtMs: null,
    currentSlotIndex: 0,
    activeSectionId: paper.sections[0]?.id ?? "",
    responses: {},
    markedForReview: {},
    selfReviews: {},
  };
}

export function getRemainingSeconds(attempt: ExamAttemptRecord, nowMs: number = Date.now()): number | null {
  if (!attempt.paper.isTimed || attempt.deadlineMs === null) return null;
  if (attempt.status === "paused" && attempt.remainingMsAtPause !== null) {
    return Math.max(0, Math.ceil(attempt.remainingMsAtPause / 1000));
  }
  return Math.max(0, Math.ceil((attempt.deadlineMs - nowMs) / 1000));
}

export function isAttemptTerminal(attempt: ExamAttemptRecord): boolean {
  return (
    attempt.status === "submitted" ||
    attempt.status === "time_expired" ||
    attempt.status === "scoring" ||
    attempt.status === "completed"
  );
}

export function saveAttemptResponse(
  attempt: ExamAttemptRecord,
  slotId: string,
  value: StudentResponseValue
): ExamAttemptRecord {
  if (isAttemptTerminal(attempt) || attempt.status === "paused") return attempt;
  return {
    ...attempt,
    responses: {
      ...attempt.responses,
      [slotId]: value,
    },
  };
}

export function clearAttemptResponse(
  attempt: ExamAttemptRecord,
  slotId: string
): ExamAttemptRecord {
  if (isAttemptTerminal(attempt) || attempt.status === "paused") return attempt;
  const nextResponses = { ...attempt.responses };
  delete nextResponses[slotId];
  return {
    ...attempt,
    responses: nextResponses,
  };
}

export function toggleMarkForReview(
  attempt: ExamAttemptRecord,
  slotId: string
): ExamAttemptRecord {
  if (isAttemptTerminal(attempt)) return attempt;
  return {
    ...attempt,
    markedForReview: {
      ...attempt.markedForReview,
      [slotId]: !attempt.markedForReview[slotId],
    },
  };
}

export function navigateToSlot(
  attempt: ExamAttemptRecord,
  targetIndex: number
): ExamAttemptRecord {
  if (isAttemptTerminal(attempt)) return attempt;
  const clamped = Math.min(Math.max(0, targetIndex), Math.max(0, attempt.paper.slots.length - 1));
  const slot = attempt.paper.slots[clamped];
  return {
    ...attempt,
    currentSlotIndex: clamped,
    activeSectionId: slot ? slot.sectionId : attempt.activeSectionId,
  };
}

export function pauseAttempt(
  attempt: ExamAttemptRecord,
  nowMs: number = Date.now()
): ExamAttemptRecord {
  if (isAttemptTerminal(attempt) || !attempt.paper.allowPause || attempt.status !== "in_progress") {
    return attempt;
  }
  const remainingMs =
    attempt.deadlineMs !== null ? Math.max(0, attempt.deadlineMs - nowMs) : null;
  return {
    ...attempt,
    status: "paused",
    pausedAtMs: nowMs,
    remainingMsAtPause: remainingMs,
  };
}

export function resumeAttempt(
  attempt: ExamAttemptRecord,
  nowMs: number = Date.now()
): ExamAttemptRecord {
  if (isAttemptTerminal(attempt) || attempt.status !== "paused") {
    return attempt;
  }
  const nextDeadlineMs =
    attempt.paper.isTimed && attempt.remainingMsAtPause !== null
      ? nowMs + attempt.remainingMsAtPause
      : attempt.deadlineMs;
  return {
    ...attempt,
    status: "in_progress",
    pausedAtMs: null,
    remainingMsAtPause: null,
    deadlineMs: nextDeadlineMs,
  };
}

/**
 * Transitions attempt safely through submitted / time_expired -> scoring -> completed.
 * Idempotent: calling twice on an already completed attempt returns it untouched without duplicate scoring.
 */
export function submitAttempt(
  attempt: ExamAttemptRecord,
  reason: "manual" | "expired" = "manual",
  nowMs: number = Date.now()
): ExamAttemptRecord {
  if (isAttemptTerminal(attempt) && attempt.scoring) {
    return attempt;
  }

  let timeSpentSeconds = 1;
  if (attempt.paper.isTimed && attempt.paper.durationMinutes > 0 && attempt.deadlineMs !== null) {
    const remainingSec = Math.max(0, Math.floor((attempt.deadlineMs - nowMs) / 1000));
    const totalSec = attempt.paper.durationMinutes * 60;
    timeSpentSeconds = Math.min(totalSec, Math.max(1, totalSec - remainingSec));
  } else {
    timeSpentSeconds = Math.max(1, Math.round((nowMs - attempt.startedAtMs) / 1000));
  }

  const scoring = scoreExamAttempt({
    paper: attempt.paper,
    responses: attempt.responses,
    selfReviews: attempt.selfReviews,
    timeSpentSeconds,
  });

  return {
    ...attempt,
    status: "completed",
    submittedAtMs: reason === "expired" && attempt.deadlineMs ? attempt.deadlineMs : nowMs,
    scoring,
  };
}

export function applySubjectiveSelfReview(
  attempt: ExamAttemptRecord,
  slotId: string,
  checkedCriterionIds: string[],
  nowMs: number = Date.now()
): ExamAttemptRecord {
  if (attempt.status !== "completed" || !attempt.scoring) return attempt;
  const slot = attempt.paper.slots.find((s) => s.slotId === slotId);
  if (!slot) return attempt;
  const question = attempt.paper.questionsById[slot.questionId];
  if (!question?.rubric) return attempt;

  const awardedMarks = question.rubric.criteria
    .filter((c) => checkedCriterionIds.includes(c.id))
    .reduce((sum, c) => sum + c.marks, 0);

  const nextSelfReviews: Record<string, SubjectiveSelfReviewEntry> = {
    ...attempt.selfReviews,
    [slotId]: {
      checkedCriterionIds,
      awardedMarks: Math.min(question.marks, awardedMarks),
      reviewedAtMs: nowMs,
    },
  };

  const nextScoring = scoreExamAttempt({
    paper: attempt.paper,
    responses: attempt.responses,
    selfReviews: nextSelfReviews,
    timeSpentSeconds: attempt.scoring.timeSpentSeconds,
  });

  return {
    ...attempt,
    selfReviews: nextSelfReviews,
    scoring: nextScoring,
  };
}

export function extractMistakesFromAttempt(attempt: ExamAttemptRecord): MistakeNotebookEntry[] {
  if (!attempt.scoring) return [];
  const entries: MistakeNotebookEntry[] = [];
  const recordedAtMs = attempt.submittedAtMs ?? Date.now();

  for (const item of attempt.scoring.itemResults) {
    if (!item.countedInChoiceGroup) continue;
    const isMistake =
      item.status === "incorrect" ||
      item.status === "partial" ||
      (item.status === "self_reviewed" && (item.awardedMarks ?? 0) < item.maxMarks);

    if (!isMistake) continue;

    const question = attempt.paper.questionsById[item.questionId];
    if (!question) continue;

    entries.push({
      id: `mk-${attempt.attemptId}-${item.questionId}`,
      questionId: question.id,
      questionVersion: question.version,
      system: attempt.paper.system,
      grade: attempt.paper.grade,
      subjectId: attempt.paper.subjectId,
      chapterId: question.chapterId,
      topicId: question.topicId,
      promptSnapshot: question.prompt,
      curriculumVersion: question.curriculumVersion,
      sourceReference: question.sourceReference,
      markingNote:
        item.status === "self_reviewed"
          ? `Self-reviewed rubric (${item.awardedMarks ?? 0}/${item.maxMarks}m)`
          : item.feedback,
      studentResponseSummary: formatStudentResponseSummary(question, item.studentResponse),
      correctResponseSummary: formatCorrectResponseSummary(question),
      explanation: question.explanation,
      attemptId: attempt.attemptId,
      recordedAtMs,
      wrongCount: 1,
      status: "unreviewed",
    });
  }

  return entries;
}
