import { BankQuestion, ExamSystem, GradeLevel } from "@/lib/mock-tests/types";
import { PUNJAB_SSC_CS_QUESTIONS } from "@/lib/mock-tests/question-bank/bank/punjab-ssc-cs";
import { FBISE_SSC_PHYSICS_QUESTIONS } from "@/lib/mock-tests/question-bank/bank/fbise-ssc-physics";
import { PUNJAB_SSC_STEM_QUESTIONS } from "@/lib/mock-tests/question-bank/bank/punjab-ssc-stem";
import { HSSC_AND_FBISE_EXTRA_QUESTIONS } from "@/lib/mock-tests/question-bank/bank/hssc-verified-bank";
import { validateQuestionIntegrity } from "@/lib/mock-tests/question-bank/validation";
import { filterEligibleQuestions } from "@/lib/mock-tests/question-bank/eligibility";

export const RAW_QUESTION_BANK: BankQuestion[] = [
  ...PUNJAB_SSC_CS_QUESTIONS,
  ...FBISE_SSC_PHYSICS_QUESTIONS,
  ...PUNJAB_SSC_STEM_QUESTIONS,
  ...HSSC_AND_FBISE_EXTRA_QUESTIONS,
];

export interface SubjectPoolInventory {
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  totalRawCount: number;
  verifiedEligibleCount: number;
  excludedByAlpCount: number;
  needsReviewOrRejectedCount: number;
  countsByChapter: Record<string, number>;
  countsByType: Record<string, number>;
}

/**
 * Validated live question bank filtered once with duplicate prompt & ID guard.
 */
export function getValidatedQuestionBank(): BankQuestion[] {
  const seenIds = new Set<string>();
  const seenPrompts = new Set<string>();
  const result: BankQuestion[] = [];

  for (const q of RAW_QUESTION_BANK) {
    if (seenIds.has(q.id)) continue;
    const check = validateQuestionIntegrity(q, seenPrompts);
    if (check.valid) {
      seenIds.add(q.id);
      result.push(q);
    }
  }
  return result;
}

export function getQuestionById(id: string): BankQuestion | undefined {
  return RAW_QUESTION_BANK.find((q) => q.id === id);
}

export function getSubjectPoolInventory(
  system: ExamSystem,
  grade: GradeLevel,
  subjectId: string
): SubjectPoolInventory {
  const rawMatching = RAW_QUESTION_BANK.filter(
    (q) => q.system === system && q.grade === grade && q.subjectId === subjectId
  );

  const eligible = filterEligibleQuestions(rawMatching, { system, grade, subjectId });
  const eligibleIds = new Set(eligible.map((q) => q.id));

  let excludedByAlpCount = 0;
  let needsReviewOrRejectedCount = 0;

  for (const q of rawMatching) {
    if (eligibleIds.has(q.id)) continue;
    if (q.eligibilityStatus === "excluded_by_alp") {
      excludedByAlpCount += 1;
    } else {
      needsReviewOrRejectedCount += 1;
    }
  }

  const countsByChapter: Record<string, number> = {};
  const countsByType: Record<string, number> = {};
  for (const q of eligible) {
    countsByChapter[q.chapterId] = (countsByChapter[q.chapterId] || 0) + 1;
    countsByType[q.type] = (countsByType[q.type] || 0) + 1;
  }

  return {
    system,
    grade,
    subjectId,
    totalRawCount: rawMatching.length,
    verifiedEligibleCount: eligible.length,
    excludedByAlpCount,
    needsReviewOrRejectedCount,
    countsByChapter,
    countsByType,
  };
}
