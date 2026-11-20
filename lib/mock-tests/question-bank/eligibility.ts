import { BankQuestion, ExamSystem, GradeLevel, QuestionType } from "@/lib/mock-tests/types";
import { validateQuestionIntegrity } from "@/lib/mock-tests/question-bank/validation";

export interface QuestionFilterCriteria {
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  chapterIds?: string[];
  topicIds?: string[];
  sloId?: string;
  allowedTypes?: QuestionType[];
  difficulty?: "Easy" | "Moderate" | "Challenging" | "All";
}

export function isQuestionLiveEligible(question: BankQuestion): boolean {
  return validateQuestionIntegrity(question).valid;
}

export function filterEligibleQuestions(
  pool: BankQuestion[],
  criteria: QuestionFilterCriteria
): BankQuestion[] {
  const seenIds = new Set<string>();
  return pool.filter((q) => {
    if (seenIds.has(q.id)) return false;
    if (q.system !== criteria.system) return false;
    if (q.grade !== criteria.grade) return false;
    if (q.subjectId !== criteria.subjectId) return false;
    if (criteria.chapterIds && criteria.chapterIds.length > 0 && !criteria.chapterIds.includes(q.chapterId)) {
      return false;
    }
    if (criteria.topicIds && criteria.topicIds.length > 0 && !criteria.topicIds.includes(q.topicId)) {
      return false;
    }
    if (criteria.sloId && q.sloId !== criteria.sloId) {
      return false;
    }
    if (criteria.allowedTypes && criteria.allowedTypes.length > 0 && !criteria.allowedTypes.includes(q.type)) {
      return false;
    }
    if (criteria.difficulty && criteria.difficulty !== "All" && q.difficulty !== criteria.difficulty) {
      return false;
    }

    const valid = isQuestionLiveEligible(q);
    if (valid) {
      seenIds.add(q.id);
    }
    return valid;
  });
}
