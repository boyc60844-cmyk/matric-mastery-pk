import {
  BankQuestion,
  ChapterDefinition,
  SubjectCurriculum,
  SubtopicDefinition,
  TopicDefinition,
} from "@/lib/mock-tests/types";
import { validateCurriculumCompatibility } from "@/lib/mock-tests/curriculum/syllabusVersionResolver";

export interface EligibilityDecision {
  eligible: boolean;
  reason?: string;
  reference?: string;
  chapter?: ChapterDefinition;
  topic?: TopicDefinition;
  subtopic?: SubtopicDefinition;
}

/**
 * Granular syllabus eligibility resolver:
 * - Verifies system, grade, subject, and curriculum version match cleanly.
 * - Supports chapter, topic, subtopic, and exercise-level ALP exclusions without
 *   falsely dropping whole chapters when only part of a chapter is excluded.
 */
export function resolveCurriculumNodeEligibility(
  curriculum: SubjectCurriculum,
  chapterId: string,
  topicId: string,
  subtopicId?: string
): EligibilityDecision {
  if (curriculum.verificationStatus === "unavailable") {
    return {
      eligible: false,
      reason: `Subject curriculum is currently unavailable: ${curriculum.verificationNote}`,
    };
  }

  const chapter = curriculum.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) {
    return {
      eligible: false,
      reason: `Chapter "${chapterId}" does not belong to ${curriculum.subjectName} (${curriculum.curriculumVersion}).`,
    };
  }

  if (chapter.isFullyExcluded) {
    return {
      eligible: false,
      chapter,
      reason: chapter.exclusionReason || `Entire chapter "${chapter.title}" is excluded from current syllabus.`,
    };
  }

  const topic = chapter.topics.find((t) => t.id === topicId);
  if (!topic) {
    return {
      eligible: false,
      chapter,
      reason: `Topic "${topicId}" does not exist inside "${chapter.title}".`,
    };
  }

  if (topic.isExcluded) {
    return {
      eligible: false,
      chapter,
      topic,
      reason: topic.exclusionReason || `Topic "${topic.title}" is excluded under ${curriculum.curriculumVersion}.`,
      reference: topic.exclusionReference,
    };
  }

  if (subtopicId) {
    const subtopic = topic.subtopics?.find((s) => s.id === subtopicId);
    if (!subtopic) {
      return {
        eligible: false,
        chapter,
        topic,
        reason: `Subtopic "${subtopicId}" does not exist under "${topic.title}".`,
      };
    }
    if (subtopic.isExcluded) {
      return {
        eligible: false,
        chapter,
        topic,
        subtopic,
        reason:
          subtopic.exclusionReason ||
          `Subtopic "${subtopic.title}" is excluded under ${curriculum.curriculumVersion}.`,
        reference: subtopic.exclusionReference,
      };
    }
    return { eligible: true, chapter, topic, subtopic };
  }

  return { eligible: true, chapter, topic };
}

/**
 * Checks whether a question is eligible for the active board/session curriculum.
 */
export function resolveQuestionSyllabusEligibility(
  question: BankQuestion
): EligibilityDecision {
  if (question.eligibilityStatus === "excluded_by_alp") {
    return {
      eligible: false,
      reason: "Question is explicitly tagged as excluded_by_alp.",
    };
  }

  const versionCheck = validateCurriculumCompatibility({
    system: question.system,
    grade: question.grade,
    subjectId: question.subjectId,
    curriculumVersion: question.curriculumVersion,
  });

  if (!versionCheck.ok || !versionCheck.curriculum) {
    return {
      eligible: false,
      reason: versionCheck.reason || "Curriculum version compatibility failed.",
    };
  }

  return resolveCurriculumNodeEligibility(
    versionCheck.curriculum,
    question.chapterId,
    question.topicId,
    question.subtopicId
  );
}

/**
 * Returns chapters that contain at least one eligible (non-excluded) topic.
 * Never drops an entire chapter just because one subtopic or topic inside it is excluded.
 */
export function getEligibleChapters(curriculum: SubjectCurriculum): ChapterDefinition[] {
  return curriculum.chapters.filter((ch) => {
    if (ch.isFullyExcluded) return false;
    return ch.topics.some((t) => !t.isExcluded);
  });
}

export function getEligibleTopicsForChapter(chapter: ChapterDefinition): TopicDefinition[] {
  if (chapter.isFullyExcluded) return [];
  return chapter.topics.filter((t) => !t.isExcluded);
}
