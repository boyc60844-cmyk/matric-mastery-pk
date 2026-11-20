import {
  BankQuestion,
  BlueprintPoolStatus,
  BlueprintValidationIssue,
  PaperBlueprint,
} from "@/lib/mock-tests/types";
import { validateCurriculumCompatibility } from "@/lib/mock-tests/curriculum/syllabusVersionResolver";
import { filterEligibleQuestions } from "@/lib/mock-tests/question-bank/eligibility";
import { RAW_QUESTION_BANK } from "@/lib/mock-tests/question-bank/questionRegistry";

/**
 * Validates mathematical consistency, choice-group feasibility, curriculum compatibility,
 * chapter quota/exclusion alignment, and genuine question-pool readiness for any PaperBlueprint.
 */
export function validateBlueprintAndPool(
  blueprint: PaperBlueprint,
  bank: BankQuestion[] = RAW_QUESTION_BANK
): BlueprintPoolStatus {
  const issues: BlueprintValidationIssue[] = [];
  const shortfallDetails: string[] = [];

  if (blueprint.durationMinutes <= 0) {
    issues.push({
      code: "INVALID_DURATION",
      severity: "error",
      message: `Paper duration must be positive (received ${blueprint.durationMinutes} min).`,
    });
  }

  // 1. Curriculum version & subject match check
  const currCheck = validateCurriculumCompatibility({
    system: blueprint.system,
    grade: blueprint.grade,
    subjectId: blueprint.subjectId,
    curriculumVersion: blueprint.curriculumVersion,
  });

  if (!currCheck.ok) {
    issues.push({
      code: "CURRICULUM_MISMATCH",
      severity: "error",
      message: currCheck.reason || "Blueprint curriculum check failed.",
    });
  }

  const matchedCurriculum = currCheck.curriculum;

  // 2. Marks reconciliation across sections & choice groups
  let computedObjectiveMarks = 0;
  let computedSubjectiveMarks = 0;
  let totalRequiredItems = 0;

  const seenGroupIds = new Set<string>();

  for (const section of blueprint.sections) {
    for (const group of section.choiceGroups) {
      if (seenGroupIds.has(group.id)) {
        issues.push({
          code: "DUPLICATE_GROUP_ID",
          severity: "error",
          message: `Duplicate choice group ID "${group.id}".`,
          sectionId: section.id,
          choiceGroupId: group.id,
        });
      }
      seenGroupIds.add(group.id);

      if (group.requiredAttemptCount <= 0 || group.totalQuestions <= 0) {
        issues.push({
          code: "INVALID_COUNTS",
          severity: "error",
          message: `Choice group "${group.title}" counts must be > 0.`,
          sectionId: section.id,
          choiceGroupId: group.id,
        });
      }

      if (group.requiredAttemptCount > group.totalQuestions) {
        issues.push({
          code: "INFEASIBLE_ATTEMPT",
          severity: "error",
          message: `Choice group "${group.title}" requires attempting ${group.requiredAttemptCount} of ${group.totalQuestions} questions.`,
          sectionId: section.id,
          choiceGroupId: group.id,
        });
      }

      if (group.marksPerQuestion <= 0) {
        issues.push({
          code: "INVALID_MARKS",
          severity: "error",
          message: `Choice group "${group.title}" has non-positive marksPerQuestion (${group.marksPerQuestion}).`,
          sectionId: section.id,
          choiceGroupId: group.id,
        });
      }

      if (!group.allowedTypes.length) {
        issues.push({
          code: "MISSING_QUESTION_TYPES",
          severity: "error",
          message: `Choice group "${group.title}" defines no allowed question types.`,
          sectionId: section.id,
          choiceGroupId: group.id,
        });
      }

      // Check allowedChapterIds exist & are non-excluded on matched curriculum
      if (matchedCurriculum && group.allowedChapterIds?.length) {
        for (const chId of group.allowedChapterIds) {
          const ch = matchedCurriculum.chapters.find((c) => c.id === chId);
          if (!ch || ch.isFullyExcluded) {
            issues.push({
              code: "INVALID_CHAPTER_FILTER",
              severity: "error",
              message: `Choice group "${group.title}" references missing or ALP-excluded chapter "${chId}".`,
              sectionId: section.id,
              choiceGroupId: group.id,
            });
          }
        }
      }

      // Check chapter quotas do not exceed totalQuestions or point outside allowedChapterIds
      if (group.chapterQuotas?.length) {
        const minSum = group.chapterQuotas.reduce((s, q) => s + q.minCount, 0);
        if (minSum > group.totalQuestions) {
          issues.push({
            code: "INVALID_CHAPTER_QUOTAS",
            severity: "error",
            message: `Chapter minimum quotas (${minSum}) exceed group totalQuestions (${group.totalQuestions}) in "${group.title}".`,
            sectionId: section.id,
            choiceGroupId: group.id,
          });
        }
        for (const quota of group.chapterQuotas) {
          if (group.allowedChapterIds?.length && !group.allowedChapterIds.includes(quota.chapterId)) {
            issues.push({
              code: "QUOTA_OUTSIDE_ALLOWED_CHAPTERS",
              severity: "error",
              message: `Quota chapter "${quota.chapterId}" is absent from allowedChapterIds in "${group.title}".`,
              sectionId: section.id,
              choiceGroupId: group.id,
            });
          }
          if (matchedCurriculum) {
            const ch = matchedCurriculum.chapters.find((c) => c.id === quota.chapterId);
            if (!ch || ch.isFullyExcluded) {
              issues.push({
                code: "EXCLUDED_CHAPTER_QUOTA",
                severity: "error",
                message: `Quota references missing or ALP-excluded chapter "${quota.chapterId}" in "${group.title}".`,
                sectionId: section.id,
                choiceGroupId: group.id,
              });
            }
          }
        }
      }

      const groupAttemptMarks = group.requiredAttemptCount * group.marksPerQuestion;
      if (section.category === "objective") {
        computedObjectiveMarks += groupAttemptMarks;
      } else {
        computedSubjectiveMarks += groupAttemptMarks;
      }

      totalRequiredItems += group.totalQuestions;
    }
  }

  const computedTotalMarks = computedObjectiveMarks + computedSubjectiveMarks;
  if (computedObjectiveMarks !== blueprint.objectiveMarks) {
    issues.push({
      code: "OBJECTIVE_MARKS_MISMATCH",
      severity: "error",
      message: `Section objective marks (${computedObjectiveMarks}) do not equal blueprint objectiveMarks (${blueprint.objectiveMarks}).`,
    });
  }
  if (computedSubjectiveMarks !== blueprint.subjectiveMarks) {
    issues.push({
      code: "SUBJECTIVE_MARKS_MISMATCH",
      severity: "error",
      message: `Section subjective marks (${computedSubjectiveMarks}) do not equal blueprint subjectiveMarks (${blueprint.subjectiveMarks}).`,
    });
  }
  if (computedTotalMarks !== blueprint.totalMarks) {
    issues.push({
      code: "TOTAL_MARKS_MISMATCH",
      severity: "error",
      message: `Reconciled marks (${computedTotalMarks}) do not equal blueprint totalMarks (${blueprint.totalMarks}).`,
    });
  }

  const isValidBlueprint = issues.filter((i) => i.severity === "error").length === 0;

  // 3. Question pool sufficiency verification (with non-reuse allocation check)
  const eligibleBank = filterEligibleQuestions(bank, {
    system: blueprint.system,
    grade: blueprint.grade,
    subjectId: blueprint.subjectId,
  });

  const usedIds = new Set<string>();
  let availableMatchingCount = 0;

  for (const section of blueprint.sections) {
    for (const group of section.choiceGroups) {
      const candidates = eligibleBank.filter((q) => {
        if (usedIds.has(q.id)) return false;
        if (q.marks !== group.marksPerQuestion) return false;
        if (!group.allowedTypes.includes(q.type)) return false;
        if (group.allowedChapterIds?.length && !group.allowedChapterIds.includes(q.chapterId)) {
          return false;
        }
        return true;
      });

      let groupMatched = 0;
      if (group.chapterQuotas?.length) {
        const pickedForGroup = new Set<string>();
        for (const quota of group.chapterQuotas) {
          const chMatches = candidates.filter(
            (q) => q.chapterId === quota.chapterId && !pickedForGroup.has(q.id)
          );
          if (chMatches.length < quota.minCount) {
            shortfallDetails.push(
              `${group.title}: Chapter ${quota.chapterId} has ${chMatches.length}/${quota.minCount} verified ${group.marksPerQuestion}-mark items.`
            );
          }
          const take = Math.min(chMatches.length, quota.maxCount);
          for (let i = 0; i < take; i++) {
            pickedForGroup.add(chMatches[i].id);
            usedIds.add(chMatches[i].id);
          }
        }
        for (const c of candidates) {
          if (pickedForGroup.size >= group.totalQuestions) break;
          if (!pickedForGroup.has(c.id) && !usedIds.has(c.id)) {
            pickedForGroup.add(c.id);
            usedIds.add(c.id);
          }
        }
        groupMatched = Math.min(group.totalQuestions, pickedForGroup.size);
      } else {
        const take = Math.min(group.totalQuestions, candidates.length);
        for (let i = 0; i < take; i++) {
          usedIds.add(candidates[i].id);
        }
        groupMatched = take;
      }

      availableMatchingCount += groupMatched;
      if (groupMatched < group.totalQuestions) {
        shortfallDetails.push(
          `${group.title}: Verified pool ${groupMatched} / ${group.totalQuestions} required (${group.marksPerQuestion}-mark items).`
        );
      }
    }
  }

  const missingQuestionsCount = Math.max(0, totalRequiredItems - availableMatchingCount);
  const isSimulationReady =
    isValidBlueprint && blueprint.verifiedForSimulation && missingQuestionsCount === 0 && shortfallDetails.length === 0;

  return {
    blueprintId: blueprint.id,
    isValidBlueprint,
    isSimulationReady,
    requiredQuestionsCount: totalRequiredItems,
    availableVerifiedCount: availableMatchingCount,
    missingQuestionsCount,
    shortfallDetails,
    issues,
  };
}
