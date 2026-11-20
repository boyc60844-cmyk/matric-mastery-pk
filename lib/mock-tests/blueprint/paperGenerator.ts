import {
  BankQuestion,
  DifficultyLevel,
  ExamSystem,
  GeneratedPaperSnapshot,
  GradeLevel,
  PaperBlueprint,
  PaperItemSlot,
  PaperSectionSnapshot,
  QuestionType,
  TestMode,
} from "@/lib/mock-tests/types";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";
import { validateCurriculumCompatibility } from "@/lib/mock-tests/curriculum/syllabusVersionResolver";
import { getBlueprintForSubject } from "@/lib/mock-tests/blueprint/blueprintRegistry";
import { validateBlueprintAndPool } from "@/lib/mock-tests/blueprint/blueprintValidator";
import { createSeededRng, deterministicShuffle } from "@/lib/mock-tests/blueprint/randomization";
import { filterEligibleQuestions } from "@/lib/mock-tests/question-bank/eligibility";
import { RAW_QUESTION_BANK } from "@/lib/mock-tests/question-bank/questionRegistry";

export interface PaperGenerationSuccess {
  ok: true;
  paper: GeneratedPaperSnapshot;
}

export interface PaperGenerationFailure {
  ok: false;
  reason: string;
  details: string[];
}

export type PaperGenerationResult = PaperGenerationSuccess | PaperGenerationFailure;

function cloneQuestion(q: BankQuestion): BankQuestion {
  return JSON.parse(JSON.stringify(q)) as BankQuestion;
}

function buildOptionOrderMap(question: BankQuestion, rng: () => number): number[] | undefined {
  if (question.type === "single_mcq") {
    if (question.preserveOptionOrder) {
      return question.options.map((_, idx) => idx);
    }
    return deterministicShuffle(
      question.options.map((_, idx) => idx),
      rng
    );
  }
  if (question.type === "multi_select") {
    return deterministicShuffle(
      question.options.map((_, idx) => idx),
      rng
    );
  }
  return undefined;
}

/**
 * Generates an official Board Simulation snapshot strictly from a validated PaperBlueprint.
 * Refuses to start with clear error details if any validation or pool check fails.
 */
export function generateBoardSimulationPaper(params: {
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  blueprintOverride?: PaperBlueprint;
  questionBank?: BankQuestion[];
  seed?: string;
}): PaperGenerationResult {
  const bank = params.questionBank ?? RAW_QUESTION_BANK;
  const blueprint =
    params.blueprintOverride ??
    getBlueprintForSubject(params.system, params.grade, params.subjectId);

  if (!blueprint) {
    return {
      ok: false,
      reason: "Official paper blueprint unavailable",
      details: [
        `No verified ${params.system.toUpperCase()} Class ${params.grade} blueprint exists for subject "${params.subjectId}".`,
      ],
    };
  }

  const poolCheck = validateBlueprintAndPool(blueprint, bank);
  if (!poolCheck.isValidBlueprint) {
    return {
      ok: false,
      reason: "Blueprint validation failed",
      details: poolCheck.issues.map((i) => i.message),
    };
  }

  if (!poolCheck.isSimulationReady) {
    return {
      ok: false,
      reason: `Validated pool: ${poolCheck.availableVerifiedCount} / ${poolCheck.requiredQuestionsCount} required questions`,
      details:
        poolCheck.shortfallDetails.length > 0
          ? poolCheck.shortfallDetails
          : ["Insufficient verified questions to populate the full board blueprint without inventing items."],
    };
  }

  const seed = params.seed || `board-${blueprint.id}-${Date.now()}`;
  const rng = createSeededRng(seed);
  const eligibleBank = filterEligibleQuestions(bank, {
    system: blueprint.system,
    grade: blueprint.grade,
    subjectId: blueprint.subjectId,
  });

  const usedQuestionIds = new Set<string>();
  const slots: PaperItemSlot[] = [];
  const sectionSnapshots: PaperSectionSnapshot[] = [];
  const questionsById: Record<string, BankQuestion> = {};

  let globalQuestionCounter = 1;

  for (const section of blueprint.sections) {
    const groupSnapshots: PaperSectionSnapshot["choiceGroups"] = [];
    let sectionMaxMarks = 0;

    for (const group of section.choiceGroups) {
      const candidates = eligibleBank.filter((q) => {
        if (usedQuestionIds.has(q.id)) return false;
        if (q.marks !== group.marksPerQuestion) return false;
        if (!group.allowedTypes.includes(q.type)) return false;
        if (group.allowedChapterIds?.length && !group.allowedChapterIds.includes(q.chapterId)) {
          return false;
        }
        return true;
      });

      const selectedForGroup: BankQuestion[] = [];
      const shuffledCandidates = deterministicShuffle(candidates, rng);

      if (group.chapterQuotas?.length) {
        for (const quota of group.chapterQuotas) {
          const chPool = shuffledCandidates.filter(
            (q) => q.chapterId === quota.chapterId && !usedQuestionIds.has(q.id)
          );
          for (let i = 0; i < Math.min(quota.minCount, chPool.length); i++) {
            selectedForGroup.push(chPool[i]);
            usedQuestionIds.add(chPool[i].id);
          }
        }
        for (const cand of shuffledCandidates) {
          if (selectedForGroup.length >= group.totalQuestions) break;
          if (!usedQuestionIds.has(cand.id)) {
            const chapterCount = selectedForGroup.filter((s) => s.chapterId === cand.chapterId).length;
            const quota = group.chapterQuotas.find((q) => q.chapterId === cand.chapterId);
            if (quota && chapterCount >= quota.maxCount) continue;
            selectedForGroup.push(cand);
            usedQuestionIds.add(cand.id);
          }
        }
      }

      // Top up without violating usedQuestionIds if chapter max quota left room
      for (const cand of shuffledCandidates) {
        if (selectedForGroup.length >= group.totalQuestions) break;
        if (!usedQuestionIds.has(cand.id)) {
          selectedForGroup.push(cand);
          usedQuestionIds.add(cand.id);
        }
      }

      if (selectedForGroup.length !== group.totalQuestions) {
        return {
          ok: false,
          reason: "Constrained selection failed to satisfy group count",
          details: [`Expected ${group.totalQuestions} questions in "${group.title}", selected ${selectedForGroup.length}.`],
        };
      }

      const slotIds: string[] = [];
      selectedForGroup.forEach((question, localIdx) => {
        const slotId = `slot-${section.id}-${group.id}-${localIdx + 1}`;
        const displayNumber =
          section.category === "objective"
            ? `Q1 (${localIdx + 1})`
            : `Q${globalQuestionCounter++}`;
        slots.push({
          slotId,
          displayNumber,
          sectionId: section.id,
          choiceGroupId: group.id,
          questionId: question.id,
          questionVersion: question.version,
          optionOrderMap: buildOptionOrderMap(question, rng),
          marks: question.marks,
        });
        questionsById[question.id] = cloneQuestion(question);
        slotIds.push(slotId);
      });

      const maxGroupMarks = group.requiredAttemptCount * group.marksPerQuestion;
      sectionMaxMarks += maxGroupMarks;
      groupSnapshots.push({
        id: group.id,
        title: group.title,
        totalQuestions: group.totalQuestions,
        requiredAttemptCount: group.requiredAttemptCount,
        marksPerQuestion: group.marksPerQuestion,
        maxGroupMarks,
        slotIds,
      });
    }

    sectionSnapshots.push({
      id: section.id,
      code: section.code,
      title: section.title,
      category: section.category,
      instructions: section.instructions,
      maxSectionMarks: sectionMaxMarks,
      choiceGroups: groupSnapshots,
    });
  }

  return {
    ok: true,
    paper: {
      paperId: `paper-${seed}`,
      seed,
      mode: "board_simulation",
      title: `${blueprint.subjectName} — Official Board Simulation`,
      system: blueprint.system,
      boardLabel: blueprint.boardScope,
      grade: blueprint.grade,
      subjectId: blueprint.subjectId,
      subjectName: blueprint.subjectName,
      session: blueprint.session,
      curriculumVersion: blueprint.curriculumVersion,
      blueprintId: blueprint.id,
      blueprintVersion: blueprint.blueprintVersion,
      durationMinutes: blueprint.durationMinutes,
      isTimed: true,
      allowPause: false,
      totalMarks: blueprint.totalMarks,
      passingPercentage: blueprint.passingPercentage,
      createdAtMs: Date.now(),
      sections: sectionSnapshots,
      slots,
      questionsById,
      selectionNotes: [
        `Blueprint: ${blueprint.sourceDocumentRef}`,
        `Sections reconciled to exact ${blueprint.totalMarks} marks (${blueprint.durationMinutes} min, no pause).`,
      ],
    },
  };
}

export interface PracticePaperConfig {
  mode: Exclude<TestMode, "board_simulation">;
  system: ExamSystem;
  grade: GradeLevel;
  subjectId: string;
  chapterIds?: string[];
  topicIds?: string[];
  sloId?: string;
  prioritizedQuestionIds?: string[];
  allowedTypes?: QuestionType[];
  difficulty?: DifficultyLevel | "All";
  requestedCount: number;
  isTimed: boolean;
  durationMinutes: number;
  seed?: string;
  questionBank?: BankQuestion[];
}

/**
 * Generates Chapter Test, Quick Test, Weak Areas, Custom Test, or SLO Practice papers
 * strictly from verified & syllabus-eligible bank items using their real fixed marks.
 */
export function generatePracticePaper(config: PracticePaperConfig): PaperGenerationResult {
  const bank = config.questionBank ?? RAW_QUESTION_BANK;
  const curriculum = getCurriculumByKey(config.system, config.grade, config.subjectId);
  if (!curriculum) {
    return {
      ok: false,
      reason: "Subject curriculum unavailable",
      details: [`No curriculum found for ${config.system.toUpperCase()} Class ${config.grade} ${config.subjectId}.`],
    };
  }

  const versionCheck = validateCurriculumCompatibility({
    system: config.system,
    grade: config.grade,
    subjectId: config.subjectId,
    curriculumVersion: curriculum.curriculumVersion,
  });

  if (!versionCheck.ok) {
    return {
      ok: false,
      reason: "Curriculum unavailable",
      details: [versionCheck.reason || "Curriculum check failed."],
    };
  }

  let pool = filterEligibleQuestions(bank, {
    system: config.system,
    grade: config.grade,
    subjectId: config.subjectId,
    chapterIds: config.chapterIds,
    topicIds: config.topicIds,
    sloId: config.sloId,
    allowedTypes: config.allowedTypes,
    difficulty: config.difficulty,
  });

  if (config.mode === "slo_practice" && !config.sloId) {
    pool = pool.filter((q) => Boolean(q.sloId));
  }

  if (pool.length === 0) {
    return {
      ok: false,
      reason: "No verified eligible questions match your selected filters",
      details: [
        "Verify selected chapters/topics are not empty or excluded under current ALP rules, or broaden question type / difficulty filters.",
      ],
    };
  }

  const seed = config.seed || `${config.mode}-${config.system}-${config.grade}-${config.subjectId}-${Date.now()}`;
  const rng = createSeededRng(seed);

  let ordered: BankQuestion[] = [];
  if (config.prioritizedQuestionIds?.length) {
    const prioritySet = new Set(config.prioritizedQuestionIds);
    const prioritized = deterministicShuffle(
      pool.filter((q) => prioritySet.has(q.id)),
      rng
    );
    const others = deterministicShuffle(
      pool.filter((q) => !prioritySet.has(q.id)),
      rng
    );
    ordered = [...prioritized, ...others];
  } else {
    ordered = deterministicShuffle(pool, rng);
  }

  const count = Math.min(Math.max(1, config.requestedCount), ordered.length);
  const selected = ordered.slice(0, count);

  // Order smoothly: objective/interactive quick types first, subjective/extended later
  const typeWeight = (t: QuestionType) =>
    t === "extended_response" || t === "proof_derivation" || t === "structured_multi_part" ? 2 : t === "short_answer" || t === "numerical" ? 1 : 0;
  selected.sort((a, b) => typeWeight(a.type) - typeWeight(b.type));

  const totalMarks = selected.reduce((sum, q) => sum + q.marks, 0);
  const slots: PaperItemSlot[] = [];
  const questionsById: Record<string, BankQuestion> = {};
  const slotIds: string[] = [];

  selected.forEach((question, idx) => {
    const slotId = `slot-practice-${idx + 1}`;
    slots.push({
      slotId,
      displayNumber: `Q${idx + 1}`,
      sectionId: "sec-practice",
      choiceGroupId: "cg-practice",
      questionId: question.id,
      questionVersion: question.version,
      optionOrderMap: buildOptionOrderMap(question, rng),
      marks: question.marks,
    });
    questionsById[question.id] = cloneQuestion(question);
    slotIds.push(slotId);
  });

  const modeLabels: Record<PracticePaperConfig["mode"], string> = {
    chapter_test: "Chapter Practice Test",
    quick_test: "Quick Timed Drill (Practice)",
    weak_areas: "Weak-Area Targeted Drill",
    custom_test: "Custom Configured Practice",
    slo_practice: "SLO / Concept Practice",
  };

  return {
    ok: true,
    paper: {
      paperId: `paper-${seed}`,
      seed,
      mode: config.mode,
      title: `${curriculum.subjectName} — ${modeLabels[config.mode]}`,
      system: curriculum.system,
      boardLabel: curriculum.boardScope,
      grade: curriculum.grade,
      subjectId: curriculum.subjectId,
      subjectName: curriculum.subjectName,
      session: curriculum.session,
      curriculumVersion: curriculum.curriculumVersion,
      durationMinutes: config.isTimed ? Math.max(1, config.durationMinutes) : 0,
      isTimed: config.isTimed,
      allowPause: true,
      totalMarks,
      passingPercentage: 40,
      createdAtMs: Date.now(),
      sections: [
        {
          id: "sec-practice",
          code: modeLabels[config.mode],
          title: `${selected.length} Verified Questions · ${totalMarks} Total Marks`,
          category: "objective",
          instructions: "Attempt all selected practice questions. Each item carries its real validated board mark weight.",
          maxSectionMarks: totalMarks,
          choiceGroups: [
            {
              id: "cg-practice",
              title: "Practice Items (Attempt All)",
              totalQuestions: selected.length,
              requiredAttemptCount: selected.length,
              marksPerQuestion: 0,
              maxGroupMarks: totalMarks,
              slotIds,
            },
          ],
        },
      ],
      slots,
      questionsById,
      selectionNotes: [
        `Mode: ${modeLabels[config.mode]} (${config.isTimed ? `${config.durationMinutes} min timed` : "untimed practice"}, pause permitted).`,
        `Selected ${selected.length} eligible items from verified pool of ${pool.length}; total marks = ${totalMarks}.`,
      ],
    },
  };
}
