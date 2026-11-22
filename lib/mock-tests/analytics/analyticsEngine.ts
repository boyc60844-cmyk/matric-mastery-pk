import {
  ExamAttemptRecord,
  ExamSystem,
  GradeLevel,
  MistakeNotebookEntry,
} from "@/lib/mock-tests/types";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";

export type AnalyticsConfidenceTier =
  | "Not enough attempts yet"
  | "Early signal — needs more data"
  | "Repeated difficulty observed"
  | "Reliable strength observed";

export interface TopicAnalyticsSummary {
  topicId: string;
  topicTitle: string;
  subjectId: string;
  system: ExamSystem;
  grade: GradeLevel;
  attemptsCount: number;
  totalQuestions: number;
  incorrectCount: number;
  obtainedMarks: number;
  availableMarks: number;
  accuracyPercent: number;
  confidenceTier: AnalyticsConfidenceTier;
}

export interface SubjectAnalyticsSummary {
  key: string;
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  attemptCount: number;
  averagePercentage: number;
  objectiveAveragePercentage: number | null;
  bestPercentage: number;
  latestPercentage: number;
  trendDelta: number | null;
}

export interface AnalyticsOverview {
  hasSufficientHistory: boolean;
  totalAttempts: number;
  /** Strictly reflects auto-verified objective performance across attempts when available */
  objectiveAveragePercentage: number | null;
  /** Combined/indicative average kept separate for historical attempt records */
  averagePercentage: number;
  totalTimeSpentSeconds: number;
  recentAttempts: {
    attemptId: string;
    title: string;
    system: ExamSystem;
    grade: GradeLevel;
    subjectId: string;
    subjectName: string;
    mode: string;
    percentage: number;
    autoVerifiedAccuracy: number | null;
    hasMixedSelfAssessment: boolean;
    obtainedMarks: number;
    totalMarks: number;
    pendingReviewCount: number;
    dateMs: number;
  }[];
  subjectSummaries: SubjectAnalyticsSummary[];
  weakTopics: TopicAnalyticsSummary[];
  earlySignalTopics: TopicAnalyticsSummary[];
  strongTopics: TopicAnalyticsSummary[];
  weakQuestionIds: string[];
}

function classifyConfidenceTier(params: {
  totalQuestions: number;
  incorrectCount: number;
  accuracyPercent: number;
}): AnalyticsConfidenceTier {
  if (params.totalQuestions === 0) return "Not enough attempts yet";
  if (params.totalQuestions < 3) return "Early signal — needs more data";
  if (params.accuracyPercent < 65 || params.incorrectCount >= 2) {
    return "Repeated difficulty observed";
  }
  return "Reliable strength observed";
}

/**
 * Computes real student analytics purely from saved completed attempts and mistake history.
 * Strictly isolates auto-verified objective performance from subjective self-review marks
 * so self-assessed marks never inflate objective accuracy or distort weak-topic classification.
 */
export function computeAnalyticsOverview(
  history: ExamAttemptRecord[],
  mistakes: MistakeNotebookEntry[],
  filter?: { system?: ExamSystem; grade?: GradeLevel; subjectId?: string }
): AnalyticsOverview {
  const filtered = history.filter((a) => {
    if (!a.scoring) return false;
    if (filter?.system && a.paper.system !== filter.system) return false;
    if (filter?.grade && a.paper.grade !== filter.grade) return false;
    if (filter?.subjectId && a.paper.subjectId !== filter.subjectId) return false;
    return true;
  });

  if (filtered.length === 0) {
    return {
      hasSufficientHistory: false,
      totalAttempts: 0,
      objectiveAveragePercentage: null,
      averagePercentage: 0,
      totalTimeSpentSeconds: 0,
      recentAttempts: [],
      subjectSummaries: [],
      weakTopics: [],
      earlySignalTopics: [],
      strongTopics: [],
      weakQuestionIds: [],
    };
  }

  const ordered = [...filtered].sort(
    (a, b) => (b.submittedAtMs ?? b.startedAtMs) - (a.submittedAtMs ?? a.startedAtMs)
  );

  // Strictly objective weighted accuracy
  let totalObjObtained = 0;
  let totalObjMax = 0;
  for (const att of ordered) {
    if (!att.scoring) continue;
    totalObjObtained += att.scoring.autoVerifiedObtainedMarks;
    totalObjMax += att.scoring.autoVerifiedMaxMarks;
  }

  const objectiveAveragePercentage =
    totalObjMax > 0 ? Math.round((totalObjObtained / totalObjMax) * 100) : null;

  const avgPct = Math.round(
    ordered.reduce((sum, a) => sum + (a.scoring?.percentage ?? 0), 0) / ordered.length
  );
  const totalTime = ordered.reduce(
    (sum, a) => sum + (a.scoring?.timeSpentSeconds ?? 0),
    0
  );

  // Subject grouping
  const subjMap = new Map<string, ExamAttemptRecord[]>();
  for (const att of ordered) {
    const k = `${att.paper.system}:${att.paper.grade}:${att.paper.subjectId}`;
    const list = subjMap.get(k) ?? [];
    list.push(att);
    subjMap.set(k, list);
  }

  const subjectSummaries: SubjectAnalyticsSummary[] = Array.from(subjMap.entries()).map(
    ([key, list]) => {
      let sObjObt = 0;
      let sObjMax = 0;
      for (const a of list) {
        if (!a.scoring) continue;
        sObjObt += a.scoring.autoVerifiedObtainedMarks;
        sObjMax += a.scoring.autoVerifiedMaxMarks;
      }
      const avg = Math.round(
        list.reduce((s, a) => s + (a.scoring?.percentage ?? 0), 0) / list.length
      );
      const best = Math.max(...list.map((a) => a.scoring?.percentage ?? 0));
      const latest = list[0]?.scoring?.percentage ?? 0;
      const prev = list[1]?.scoring?.percentage;
      return {
        key,
        system: list[0].paper.system,
        grade: list[0].paper.grade,
        subjectId: list[0].paper.subjectId,
        subjectName: list[0].paper.subjectName,
        attemptCount: list.length,
        averagePercentage: avg,
        objectiveAveragePercentage: sObjMax > 0 ? Math.round((sObjObt / sObjMax) * 100) : null,
        bestPercentage: best,
        latestPercentage: latest,
        trendDelta: typeof prev === "number" ? latest - prev : null,
      };
    }
  );

  // Strict auto-verified objective topic aggregation ONLY (excludes pending_review & self_reviewed)
  const topicAgg = new Map<
    string,
    Omit<TopicAnalyticsSummary, "confidenceTier"> & { seenAttempts: Set<string> }
  >();
  const questionWrongFreq = new Map<string, number>();

  for (const att of ordered) {
    if (!att.scoring) continue;
    const curriculum = getCurriculumByKey(att.paper.system, att.paper.grade, att.paper.subjectId);

    for (const item of att.scoring.itemResults) {
      if (!item.countedInChoiceGroup) continue;
      if (item.status === "pending_review" || item.status === "self_reviewed") continue;
      if (
        item.status === "unanswered" &&
        (item.type === "short_answer" ||
          item.type === "extended_response" ||
          item.type === "proof_derivation")
      ) {
        continue;
      }

      const isWrong = item.status === "incorrect" || item.status === "unanswered";
      if (isWrong || item.status === "partial") {
        questionWrongFreq.set(item.questionId, (questionWrongFreq.get(item.questionId) || 0) + 1);
      }

      const key = `${att.paper.system}:${att.paper.grade}:${att.paper.subjectId}:${item.topicId}`;
      const chap = curriculum?.chapters.find((c) => c.id === item.chapterId);
      const topic = chap?.topics.find((t) => t.id === item.topicId);

      const cur = topicAgg.get(key) ?? {
        topicId: item.topicId,
        topicTitle: topic?.title || item.topicId,
        subjectId: att.paper.subjectId,
        system: att.paper.system,
        grade: att.paper.grade,
        attemptsCount: 0,
        totalQuestions: 0,
        incorrectCount: 0,
        obtainedMarks: 0,
        availableMarks: 0,
        accuracyPercent: 0,
        seenAttempts: new Set<string>(),
      };

      cur.seenAttempts.add(att.attemptId);
      cur.attemptsCount = cur.seenAttempts.size;
      cur.totalQuestions += 1;
      if (isWrong) cur.incorrectCount += 1;
      cur.obtainedMarks += item.effectiveMarks;
      cur.availableMarks += item.maxMarks;
      topicAgg.set(key, cur);
    }
  }

  const finalizedTopics: TopicAnalyticsSummary[] = Array.from(topicAgg.values()).map((t) => {
    const accuracyPercent =
      t.availableMarks > 0 ? Math.round((t.obtainedMarks / t.availableMarks) * 100) : 0;
    return {
      topicId: t.topicId,
      topicTitle: t.topicTitle,
      subjectId: t.subjectId,
      system: t.system,
      grade: t.grade,
      attemptsCount: t.attemptsCount,
      totalQuestions: t.totalQuestions,
      incorrectCount: t.incorrectCount,
      obtainedMarks: Number(t.obtainedMarks.toFixed(2)),
      availableMarks: t.availableMarks,
      accuracyPercent,
      confidenceTier: classifyConfidenceTier({
        totalQuestions: t.totalQuestions,
        incorrectCount: t.incorrectCount,
        accuracyPercent,
      }),
    };
  });

  // Require >= 3 objective items to trigger confirmed "Repeated difficulty observed" weak topic
  const weakTopics = finalizedTopics
    .filter((t) => t.confidenceTier === "Repeated difficulty observed")
    .sort((a, b) => a.accuracyPercent - b.accuracyPercent)
    .slice(0, 6);

  const earlySignalTopics = finalizedTopics
    .filter((t) => t.confidenceTier === "Early signal — needs more data" && t.incorrectCount >= 1)
    .sort((a, b) => a.accuracyPercent - b.accuracyPercent)
    .slice(0, 6);

  const strongTopics = finalizedTopics
    .filter((t) => t.totalQuestions >= 3 && t.accuracyPercent >= 80)
    .sort((a, b) => b.accuracyPercent - a.accuracyPercent)
    .slice(0, 6);

  for (const m of mistakes) {
    if (filter?.system && m.system !== filter.system) continue;
    if (filter?.grade && m.grade !== filter.grade) continue;
    if (filter?.subjectId && m.subjectId !== filter.subjectId) continue;
    if (m.status !== "mastered") {
      questionWrongFreq.set(m.questionId, (questionWrongFreq.get(m.questionId) || 0) + m.wrongCount);
    }
  }

  const weakQuestionIds = Array.from(questionWrongFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  return {
    hasSufficientHistory: ordered.length >= 1,
    totalAttempts: ordered.length,
    objectiveAveragePercentage,
    averagePercentage: avgPct,
    totalTimeSpentSeconds: totalTime,
    recentAttempts: ordered.slice(0, 12).map((a) => ({
      attemptId: a.attemptId,
      title: a.paper.title,
      system: a.paper.system,
      grade: a.paper.grade,
      subjectId: a.paper.subjectId,
      subjectName: a.paper.subjectName,
      mode: a.paper.mode,
      percentage: a.scoring?.percentage ?? 0,
      autoVerifiedAccuracy: a.scoring?.autoVerifiedAccuracy ?? null,
      hasMixedSelfAssessment: a.scoring?.hasMixedSelfAssessment ?? false,
      obtainedMarks: a.scoring?.obtainedMarks ?? 0,
      totalMarks: a.paper.totalMarks,
      pendingReviewCount: a.scoring?.pendingReviewCount ?? 0,
      dateMs: a.submittedAtMs ?? a.startedAtMs,
    })),
    subjectSummaries,
    weakTopics,
    earlySignalTopics,
    strongTopics,
    weakQuestionIds,
  };
}
