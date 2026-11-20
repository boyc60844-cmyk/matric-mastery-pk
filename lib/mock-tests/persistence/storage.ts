import {
  AttemptScoringSummary,
  ExamAttemptRecord,
  MistakeNotebookEntry,
  PersistedMockTestStoreV3,
} from "@/lib/mock-tests/types";
import { isResponseEmpty } from "@/lib/mock-tests/scoring/answerValidator";

export const MOCK_ENGINE_STORAGE_KEY = "mm_mock_engine_v2";
const CURRENT_SCHEMA_VERSION = 3 as const;
const MAX_HISTORY_RECORDS = 60;
const MAX_MISTAKE_RECORDS = 200;

export function createEmptyStore(): PersistedMockTestStoreV3 {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeAttempt: null,
    attemptHistory: [],
    mistakeNotebook: [],
  };
}

/**
 * Normalizes v2 AttemptScoringSummary records cleanly onto v3 separated metrics
 * so legacy persisted history remains readable without inflated stats.
 */
function normalizeScoringSummary(scoring: AttemptScoringSummary): AttemptScoringSummary {
  if (typeof scoring.autoVerifiedObtainedMarks === "number" && Array.isArray(scoring.objectiveTopicBreakdown)) {
    return scoring;
  }

  let autoVerifiedObtainedMarks = 0;
  let autoVerifiedMaxMarks = 0;
  let selfAssessedObtainedMarks = 0;
  let selfAssessedMaxMarks = 0;

  for (const item of scoring.itemResults ?? []) {
    if (!item.countedInChoiceGroup) continue;
    if (item.status === "self_reviewed") {
      selfAssessedObtainedMarks += item.effectiveMarks;
      selfAssessedMaxMarks += item.maxMarks;
    } else if (
      item.status !== "pending_review" &&
      !(
        item.status === "unanswered" &&
        (item.type === "short_answer" ||
          item.type === "extended_response" ||
          item.type === "proof_derivation")
      )
    ) {
      autoVerifiedObtainedMarks += item.effectiveMarks;
      autoVerifiedMaxMarks += item.maxMarks;
    }
  }

  const autoAcc =
    autoVerifiedMaxMarks > 0
      ? Math.round((autoVerifiedObtainedMarks / autoVerifiedMaxMarks) * 100)
      : null;

  return {
    ...scoring,
    selfReviewedMaxMarks: selfAssessedMaxMarks,
    autoVerifiedObtainedMarks: Number(autoVerifiedObtainedMarks.toFixed(2)),
    autoVerifiedMaxMarks,
    autoVerifiedAccuracy: autoAcc,
    selfAssessedObtainedMarks: Number(selfAssessedObtainedMarks.toFixed(2)),
    selfAssessedMaxMarks,
    pendingSubjectiveMarks: scoring.pendingReviewMarks ?? 0,
    indicativeCombinedMarks: scoring.obtainedMarks,
    indicativeCombinedPercentage: scoring.percentage,
    hasMixedSelfAssessment: selfAssessedMaxMarks > 0,
    objectiveTopicBreakdown: scoring.objectiveTopicBreakdown ?? scoring.topicBreakdown ?? [],
    selfAssessedTopicBreakdown: scoring.selfAssessedTopicBreakdown ?? [],
  };
}

/**
 * Migrates raw JSON store string cleanly from v2 -> v3, or returns clean empty store
 * upon incompatible/corrupted data without throwing exceptions.
 */
export function parseAndMigrateStoreJson(raw: string | null): {
  store: PersistedMockTestStoreV3;
  migratedOrReset: boolean;
} {
  if (!raw) return { store: createEmptyStore(), migratedOrReset: false };

  try {
    const parsed = JSON.parse(raw) as {
      schemaVersion?: number;
      activeAttempt?: ExamAttemptRecord | null;
      attemptHistory?: ExamAttemptRecord[];
      mistakeNotebook?: MistakeNotebookEntry[];
    };

    if (!parsed || (parsed.schemaVersion !== 2 && parsed.schemaVersion !== 3)) {
      return { store: createEmptyStore(), migratedOrReset: true };
    }

    const activeAttempt =
      parsed.activeAttempt &&
      parsed.activeAttempt.attemptId &&
      parsed.activeAttempt.paper &&
      Array.isArray(parsed.activeAttempt.paper.slots)
        ? parsed.activeAttempt
        : null;

    const attemptHistory = Array.isArray(parsed.attemptHistory)
      ? parsed.attemptHistory
          .filter((a) => a && a.attemptId && a.paper && a.scoring)
          .map((a) => ({
            ...a,
            scoring: a.scoring ? normalizeScoringSummary(a.scoring) : undefined,
          }))
      : [];

    const mistakeNotebook = Array.isArray(parsed.mistakeNotebook)
      ? parsed.mistakeNotebook
          .filter((m) => m && m.id && m.questionId)
          .map((m) => ({
            ...m,
            promptSnapshot: m.promptSnapshot || undefined,
            curriculumVersion: m.curriculumVersion || undefined,
          }))
      : [];

    return {
      store: {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        activeAttempt,
        attemptHistory: attemptHistory.slice(0, MAX_HISTORY_RECORDS),
        mistakeNotebook: mistakeNotebook.slice(0, MAX_MISTAKE_RECORDS),
      },
      migratedOrReset: parsed.schemaVersion !== CURRENT_SCHEMA_VERSION,
    };
  } catch {
    return { store: createEmptyStore(), migratedOrReset: true };
  }
}

export function loadMockEngineStore(): PersistedMockTestStoreV3 {
  if (typeof window === "undefined") {
    return createEmptyStore();
  }
  try {
    const raw = window.localStorage.getItem(MOCK_ENGINE_STORAGE_KEY);
    const { store, migratedOrReset } = parseAndMigrateStoreJson(raw);
    if (migratedOrReset && raw) {
      saveMockEngineStore(store);
    }
    return store;
  } catch {
    return createEmptyStore();
  }
}

export function saveMockEngineStore(store: PersistedMockTestStoreV3): boolean {
  if (typeof window === "undefined") return false;
  const bounded: PersistedMockTestStoreV3 = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeAttempt: store.activeAttempt,
    attemptHistory: store.attemptHistory.slice(0, MAX_HISTORY_RECORDS),
    mistakeNotebook: store.mistakeNotebook.slice(0, MAX_MISTAKE_RECORDS),
  };

  try {
    window.localStorage.setItem(MOCK_ENGINE_STORAGE_KEY, JSON.stringify(bounded));
    return true;
  } catch {
    try {
      const trimmed: PersistedMockTestStoreV3 = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        activeAttempt: bounded.activeAttempt,
        attemptHistory: bounded.attemptHistory.slice(0, 20),
        mistakeNotebook: bounded.mistakeNotebook.slice(0, 80),
      };
      window.localStorage.setItem(MOCK_ENGINE_STORAGE_KEY, JSON.stringify(trimmed));
      return true;
    } catch {
      return false;
    }
  }
}

export function saveActiveAttemptToStore(attempt: ExamAttemptRecord | null): PersistedMockTestStoreV3 {
  const store = loadMockEngineStore();
  const next: PersistedMockTestStoreV3 = {
    ...store,
    activeAttempt: attempt,
  };
  saveMockEngineStore(next);
  return next;
}

export function archiveCompletedAttempt(attempt: ExamAttemptRecord): PersistedMockTestStoreV3 {
  const store = loadMockEngineStore();
  const alreadySaved = store.attemptHistory.some((a) => a.attemptId === attempt.attemptId);
  const nextHistory = alreadySaved
    ? store.attemptHistory.map((a) => (a.attemptId === attempt.attemptId ? attempt : a))
    : [attempt, ...store.attemptHistory];

  const next: PersistedMockTestStoreV3 = {
    ...store,
    activeAttempt:
      store.activeAttempt?.attemptId === attempt.attemptId ? null : store.activeAttempt,
    attemptHistory: nextHistory.slice(0, MAX_HISTORY_RECORDS),
  };
  saveMockEngineStore(next);
  return next;
}

export function upsertMistakeEntries(entries: MistakeNotebookEntry[]): PersistedMockTestStoreV3 {
  const store = loadMockEngineStore();
  const byQuestionKey = new Map<string, MistakeNotebookEntry>();

  for (const existing of store.mistakeNotebook) {
    byQuestionKey.set(`${existing.questionId}@${existing.questionVersion}`, existing);
  }

  for (const incoming of entries) {
    const key = `${incoming.questionId}@${incoming.questionVersion}`;
    const prev = byQuestionKey.get(key);
    if (prev) {
      byQuestionKey.set(key, {
        ...incoming,
        id: prev.id,
        wrongCount: prev.wrongCount + 1,
        status: "unreviewed",
      });
    } else {
      byQuestionKey.set(key, incoming);
    }
  }

  const nextList = Array.from(byQuestionKey.values())
    .sort((a, b) => b.recordedAtMs - a.recordedAtMs)
    .slice(0, MAX_MISTAKE_RECORDS);

  const next: PersistedMockTestStoreV3 = {
    ...store,
    mistakeNotebook: nextList,
  };
  saveMockEngineStore(next);
  return next;
}

// Re-export helper so callers checking empty responses have single entry point
export { isResponseEmpty };
