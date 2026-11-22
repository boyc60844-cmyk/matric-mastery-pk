import {
  ExamAttemptRecord,
  ExamSystem,
  GradeLevel,
  MistakeNotebookEntry,
} from "@/lib/mock-tests/types";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";

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
}

export interface SubjectAnalyticsSummary {
  key: string;
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  attemptCount: number;
  averagePercentage: number;
  bestPercentage: number;
  latestPercentage: number;
  trendDelta: number | null; // latest minus previous
}

export interface AnalyticsOverview {
  hasSufficientHistory: boolean;
  totalAttempts: number;
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
    obtainedMarks: number;
    totalMarks: number;
    pendingReviewCount: number;
    dateMs: number;
  }[];
  subjectSummaries: SubjectAnalyticsSummary[];
  weakTopics: TopicAnalyticsSummary[];
  strongTopics: TopicAnalyticsSummary[];
  weakQuestionIds: string[];
}

/**
 * Computes real student analytics purely from saved completed attempts and mistake history.
 * Never fabricates trend lines or weak topics from insufficient single ambiguous errors.
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
      averagePercentage: 0,
      totalTimeSpentSeconds: 0,
      recentAttempts: [],
      subjectSummaries: [],
      weakTopics: [],
      strongTopics: [],
      weakQuestionIds: [],
    };
  }

  const ordered = [...filtered].sort(
    (a, b) => (b.submittedAtMs ?? b.startedAtMs) - (a.submittedAtMs ?? a.startedAtMs)
  );

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
        bestPercentage: best,
        latestPercentage: latest,
        trendDelta: typeof prev === "number" ? latest - prev : null,
      };
    }
  );

  // Topic aggregation across graded/reviewed items
  const topicAgg = new Map<string, TopicAnalyticsSummary & { seenAttempts: Set<string> }>();
  const questionWrongFreq = new Map<string, number>();

  for (const att of ordered) {
    if (!att.scoring) continue;
    const curriculum = getCurriculumByKey(att.paper.system, att.paper.grade, att.paper.subjectId);

    for (const item of att.scoring.itemResults) {
      if (!item.countedInChoiceGroup || item.status === "pending_review") continue;
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

  const finalizedTopics: TopicAnalyticsSummary[] = Array.from(topicAgg.values()).map((t) => ({
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
    accuracyPercent:
      t.availableMarks > 0 ? Math.round((t.obtainedMarks / t.availableMarks) * 100) : 0,
  }));

  // Guard against declaring a topic weak from a single accidental miss
  const weakTopics = finalizedTopics
    .filter((t) => t.totalQuestions >= 2 && (t.incorrectCount >= 2 || t.accuracyPercent < 65))
    .sort((a, b) => a.accuracyPercent - b.accuracyPercent)
    .slice(0, 6);

  const strongTopics = finalizedTopics
    .filter((t) => t.totalQuestions >= 2 && t.accuracyPercent >= 80)
    .sort((a, b) => b.accuracyPercent - a.accuracyPercent)
    .slice(0, 6);

  // Merge repeated wrong questions from history + unreviewed mistakes
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
      obtainedMarks: a.scoring?.obtainedMarks ?? 0,
      totalMarks: a.paper.totalMarks,
      pendingReviewCount: a.scoring?.pendingReviewCount ?? 0,
      dateMs: a.submittedAtMs ?? a.startedAtMs,
    })),
    subjectSummaries,
    weakTopics,
    strongTopics,
    weakQuestionIds,
  };
}
