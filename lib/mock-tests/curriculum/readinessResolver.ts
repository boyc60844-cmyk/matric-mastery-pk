import {
  BankQuestion,
  BlueprintReadinessStatus,
  QuestionBankReadinessStatus,
  SubjectCurriculum,
  SubjectReadinessProfile,
} from "@/lib/mock-tests/types";
import { getBlueprintForSubject } from "@/lib/mock-tests/blueprint/blueprintRegistry";
import { validateBlueprintAndPool } from "@/lib/mock-tests/blueprint/blueprintValidator";
import { filterEligibleQuestions } from "@/lib/mock-tests/question-bank/eligibility";
import { RAW_QUESTION_BANK } from "@/lib/mock-tests/question-bank/questionRegistry";

/**
 * Decouples official curriculum authority status from blueprint existence
 * and verified question-bank stock so subjects like Biology-10 or
 * Tarjama-tul-Quran-9 report truthful multidimensional readiness.
 */
export function getSubjectReadinessProfile(
  curriculum: SubjectCurriculum,
  bank: BankQuestion[] = RAW_QUESTION_BANK
): SubjectReadinessProfile {
  const rawMatching = bank.filter(
    (q) =>
      q.system === curriculum.system &&
      q.grade === curriculum.grade &&
      q.subjectId === curriculum.subjectId
  );

  const eligible = filterEligibleQuestions(rawMatching, {
    system: curriculum.system,
    grade: curriculum.grade,
    subjectId: curriculum.subjectId,
  });
  const eligibleIds = new Set(eligible.map((q) => q.id));

  let excludedByAlpCount = 0;
  let outdatedCount = 0;
  let provisionalCount = 0;
  let needsReviewCount = 0;

  for (const q of rawMatching) {
    if (eligibleIds.has(q.id)) continue;
    if (q.eligibilityStatus === "excluded_by_alp" || q.validationStatus === "Excluded") {
      excludedByAlpCount += 1;
    } else if (q.validationStatus === "Outdated") {
      outdatedCount += 1;
    } else if (q.validationStatus === "Provisional") {
      provisionalCount += 1;
    } else {
      needsReviewCount += 1;
    }
  }

  const blueprint = getBlueprintForSubject(
    curriculum.system,
    curriculum.grade,
    curriculum.subjectId
  );

  const blueprintStatus: BlueprintReadinessStatus = blueprint ? "verified" : "unavailable";
  const bpStatus = blueprint ? validateBlueprintAndPool(blueprint, bank) : null;

  const boardSimulationReady = Boolean(
    curriculum.curriculumStatus === "verified" && bpStatus?.isSimulationReady
  );
  const practiceAvailable = curriculum.curriculumStatus === "verified" && eligible.length > 0;

  let bankStatus: QuestionBankReadinessStatus = "empty";
  if (boardSimulationReady) {
    bankStatus = "simulation_ready";
  } else if (eligible.length > 0) {
    bankStatus = "partial";
  }

  let summaryBadge = "Pending Verification";
  let statusDetail = curriculum.verificationNote;

  if (curriculum.curriculumStatus !== "verified") {
    summaryBadge = "Curriculum Pending";
  } else if (boardSimulationReady) {
    summaryBadge = "Full Board Simulation Ready";
    statusDetail = `Verified curriculum (${curriculum.syllabusPolicy === "full_syllabus_no_alp" ? "Full Syllabus" : curriculum.system === "fbise" ? "SLO Scheme" : "Active ALP"}) & complete ${bpStatus?.requiredQuestionsCount}-slot blueprint stocked with ${eligible.length} verified items.`;
  } else if (practiceAvailable && bpStatus) {
    summaryBadge = `Practice Ready (${eligible.length}/${bpStatus.requiredQuestionsCount} Sim)`;
    statusDetail = `Curriculum verified; ${eligible.length} verified items active for Chapter, Quick, Custom & SLO Practice. Full Board Simulation requires ${bpStatus.missingQuestionsCount} more blueprint-matched items.`;
  } else if (practiceAvailable) {
    summaryBadge = `Practice Ready (${eligible.length} Items)`;
    statusDetail = `Curriculum verified; ${eligible.length} verified items ready for targeted practice modes.`;
  } else {
    summaryBadge =
      curriculum.syllabusPolicy === "full_syllabus_no_alp"
        ? "Verified Full Syllabus · 0 Bank Items"
        : "Verified Curriculum · 0 Bank Items";
    statusDetail = `Official curriculum verified (${curriculum.textbookRef}). Verified question bank authoring is pending (0 active items) — practice & simulation are disabled until verified items exist.`;
  }

  return {
    curriculumId: curriculum.id,
    system: curriculum.system,
    grade: curriculum.grade,
    subjectId: curriculum.subjectId,
    subjectName: curriculum.subjectName,
    curriculumStatus: curriculum.curriculumStatus,
    syllabusPolicy: curriculum.syllabusPolicy,
    blueprintStatus,
    bankStatus,
    practiceAvailable,
    boardSimulationReady,
    totalRawCount: rawMatching.length,
    verifiedEligibleCount: eligible.length,
    excludedByAlpCount,
    outdatedCount,
    provisionalCount,
    needsReviewCount,
    requiredBlueprintSlots: bpStatus?.requiredQuestionsCount ?? 0,
    summaryBadge,
    statusDetail,
  };
}
