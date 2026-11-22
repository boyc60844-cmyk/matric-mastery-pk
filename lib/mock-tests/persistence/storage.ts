import {
  ExamAttemptRecord,
  MistakeNotebookEntry,
  PersistedMockTestStoreV2,
} from "@/lib/mock-tests/types";

export const MOCK_ENGINE_STORAGE_KEY = "mm_mock_engine_v2";
const MAX_HISTORY_RECORDS = 60;
const MAX_MISTAKE_RECORDS = 200;

export function createEmptyStore(): PersistedMockTestStoreV2 {
  return {
    schemaVersion: 2,
    activeAttempt: null,
    attemptHistory: [],
    mistakeNotebook: [],
  };
}

/**
 * Loads persisted store safely with schema validation & corruption cleanup.
 * Uses pure in-memory fallback when running outside browser (e.g. Node unit tests).
 */
export function loadMockEngineStore(): PersistedMockTestStoreV2 {
  if (typeof window === "undefined") {
    return createEmptyStore();
  }
  try {
    const raw = window.localStorage.getItem(MOCK_ENGINE_STORAGE_KEY);
    if (!raw) return createEmptyStore();
    const parsed = JSON.parse(raw) as Partial<PersistedMockTestStoreV2>;
    if (!parsed || parsed.schemaVersion !== 2) {
      // Safe reset if incompatible version or corrupt structure
      return createEmptyStore();
    }

    const activeAttempt =
      parsed.activeAttempt &&
      parsed.activeAttempt.attemptId &&
      parsed.activeAttempt.paper &&
      Array.isArray(parsed.activeAttempt.paper.slots)
        ? parsed.activeAttempt
        : null;

    const attemptHistory = Array.isArray(parsed.attemptHistory)
      ? parsed.attemptHistory.filter((a) => a && a.attemptId && a.paper && a.scoring)
      : [];

    const mistakeNotebook = Array.isArray(parsed.mistakeNotebook)
      ? parsed.mistakeNotebook.filter((m) => m && m.id && m.questionId)
      : [];

    return {
      schemaVersion: 2,
      activeAttempt,
      attemptHistory: attemptHistory.slice(0, MAX_HISTORY_RECORDS),
      mistakeNotebook: mistakeNotebook.slice(0, MAX_MISTAKE_RECORDS),
    };
  } catch {
    return createEmptyStore();
  }
}

export function saveMockEngineStore(store: PersistedMockTestStoreV2): boolean {
  if (typeof window === "undefined") return false;
  const bounded: PersistedMockTestStoreV2 = {
    schemaVersion: 2,
    activeAttempt: store.activeAttempt,
    attemptHistory: store.attemptHistory.slice(0, MAX_HISTORY_RECORDS),
    mistakeNotebook: store.mistakeNotebook.slice(0, MAX_MISTAKE_RECORDS),
  };

  try {
    window.localStorage.setItem(MOCK_ENGINE_STORAGE_KEY, JSON.stringify(bounded));
    return true;
  } catch {
    // Quota trim retry: keep newest 20 attempts and 80 mistakes
    try {
      const trimmed: PersistedMockTestStoreV2 = {
        schemaVersion: 2,
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

export function saveActiveAttemptToStore(attempt: ExamAttemptRecord | null): PersistedMockTestStoreV2 {
  const store = loadMockEngineStore();
  const next: PersistedMockTestStoreV2 = {
    ...store,
    activeAttempt: attempt,
  };
  saveMockEngineStore(next);
  return next;
}

export function archiveCompletedAttempt(attempt: ExamAttemptRecord): PersistedMockTestStoreV2 {
  const store = loadMockEngineStore();
  const alreadySaved = store.attemptHistory.some((a) => a.attemptId === attempt.attemptId);
  const nextHistory = alreadySaved
    ? store.attemptHistory.map((a) => (a.attemptId === attempt.attemptId ? attempt : a))
    : [attempt, ...store.attemptHistory];

  const next: PersistedMockTestStoreV2 = {
    ...store,
    activeAttempt:
      store.activeAttempt?.attemptId === attempt.attemptId ? null : store.activeAttempt,
    attemptHistory: nextHistory.slice(0, MAX_HISTORY_RECORDS),
  };
  saveMockEngineStore(next);
  return next;
}

export function upsertMistakeEntries(entries: MistakeNotebookEntry[]): PersistedMockTestStoreV2 {
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

  const next: PersistedMockTestStoreV2 = {
    ...store,
    mistakeNotebook: nextList,
  };
  saveMockEngineStore(next);
  return next;
}
