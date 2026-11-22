import { BankQuestion } from "@/lib/mock-tests/types";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";
import { resolveQuestionSyllabusEligibility } from "@/lib/mock-tests/curriculum/eligibilityResolver";

export interface QuestionValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function normalizePromptForDedup(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/[`*_~]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateQuestionIntegrity(
  question: BankQuestion,
  seenPrompts?: Set<string>
): QuestionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!question.id || !question.id.trim()) errors.push("Missing stable ID.");
  if (!question.prompt || question.prompt.trim().length < 6) errors.push("Question prompt is empty or too short.");
  if (!question.explanation || question.explanation.trim().length < 6) errors.push("Missing explanation.");
  if (!(question.marks > 0)) errors.push(`Invalid marks (${question.marks}); must be > 0.`);
  if (!question.sourceReference || !question.sourceReference.trim()) errors.push("Missing source/reference mapping.");

  // Validation state gate — strictly reject Outdated, Provisional, Needs Review, Excluded
  if (question.validationStatus !== "Verified") {
    errors.push(
      `Question validationStatus is "${question.validationStatus}" (only "Verified" questions enter live pools).`
    );
  }
  if (!question.reviewMetadata?.checklistPassed) {
    errors.push("Review metadata checklistPassed is false.");
  }

  // Board / system consistency
  if (question.system === "fbise" && question.board.toLowerCase().includes("punjab")) {
    errors.push("Board mismatch: FBISE question references Punjab board.");
  }
  if (question.system === "punjab" && question.board.toLowerCase().includes("fbise")) {
    errors.push("Board mismatch: Punjab question references FBISE.");
  }

  // Duplicate check by strongly normalized prompt within system+grade+subject
  if (seenPrompts) {
    const normalized = normalizePromptForDedup(question.prompt);
    const key = `${question.system}:${question.grade}:${question.subjectId}:${normalized}`;
    if (seenPrompts.has(key)) {
      errors.push("Duplicate or punctuation-variant duplicate question prompt detected within same system/grade/subject.");
    } else {
      seenPrompts.add(key);
    }
  }

  // Rubric marks reconciliation if rubric is present
  if (question.rubric) {
    if (question.rubric.maxMarks !== question.marks) {
      errors.push(`Rubric maxMarks (${question.rubric.maxMarks}) does not equal question.marks (${question.marks}).`);
    }
  }

  // Type-specific answer key checks
  switch (question.type) {
    case "single_mcq": {
      if (!Array.isArray(question.options) || question.options.length < 2) {
        errors.push("MCQ must provide at least 2 options.");
      } else {
        if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
          errors.push(`MCQ correctIndex ${question.correctIndex} out of bounds.`);
        }
        const normalizedOpts = question.options.map((o) => o.trim().toLowerCase());
        if (new Set(normalizedOpts).size !== normalizedOpts.length) {
          errors.push("MCQ contains duplicate or contradicting options.");
        }
      }
      break;
    }
    case "multi_select": {
      if (!Array.isArray(question.options) || question.options.length < 2) {
        errors.push("Multi-select must provide options.");
      } else if (!Array.isArray(question.correctIndices) || question.correctIndices.length === 0) {
        errors.push("Multi-select must define at least one correctIndex.");
      } else {
        for (const idx of question.correctIndices) {
          if (idx < 0 || idx >= question.options.length) {
            errors.push(`Multi-select correctIndex ${idx} out of bounds.`);
          }
        }
      }
      break;
    }
    case "true_false": {
      if (typeof question.correctBoolean !== "boolean") {
        errors.push("True/False requires boolean correctBoolean.");
      }
      break;
    }
    case "fill_blank": {
      if (!Array.isArray(question.acceptedAnswers) || question.acceptedAnswers.length === 0) {
        errors.push("Fill-blank requires at least one accepted answer.");
      }
      break;
    }
    case "matching": {
      if (!Array.isArray(question.pairs) || question.pairs.length < 2) {
        errors.push("Matching question needs at least 2 pairs.");
      }
      break;
    }
    case "classification": {
      if (!question.categories.length || !question.items.length) {
        errors.push("Classification requires categories and items.");
      }
      for (const item of question.items) {
        if (!question.categories.includes(item.correctCategory)) {
          errors.push(`Classification item "${item.label}" maps to unknown category "${item.correctCategory}".`);
        }
      }
      break;
    }
    case "short_answer":
    case "extended_response": {
      if (!question.modelAnswer?.trim() || !question.markingPoints?.length || !question.rubric) {
        errors.push(`${question.type} requires modelAnswer, markingPoints, and explicit rubric.`);
      }
      break;
    }
    case "proof_derivation": {
      if (!question.modelProofSteps?.length || !question.rubric) {
        errors.push("Proof/derivation requires modelProofSteps and explicit rubric.");
      }
      break;
    }
    case "numerical": {
      if (typeof question.numericAnswer !== "number" || !Number.isFinite(question.numericAnswer)) {
        errors.push("Numerical item requires valid finite numericAnswer.");
      }
      if (question.tolerance < 0) {
        errors.push("Numerical tolerance cannot be negative.");
      }
      break;
    }
    case "structured_multi_part": {
      if (!question.subParts?.length) {
        errors.push("Structured question requires at least one subPart.");
      }
      const partSum = question.subParts.reduce((sum, p) => sum + p.marks, 0);
      if (partSum !== question.marks) {
        errors.push(`Structured question subParts marks sum (${partSum}) != question.marks (${question.marks}).`);
      }
      break;
    }
    case "diagram_labeling": {
      if (!question.pins.length || !question.candidateLabels.length) {
        errors.push("Diagram labeling requires pins and candidateLabels.");
      }
      for (const pin of question.pins) {
        if (!question.candidateLabels.includes(pin.correctLabel)) {
          errors.push(`Diagram pin "${pin.marker}" correctLabel missing from candidateLabels.`);
        }
      }
      break;
    }
  }

  // Syllabus eligibility verification
  const syl = resolveQuestionSyllabusEligibility(question);
  if (!syl.eligible) {
    errors.push(syl.reason || "Failed syllabus eligibility.");
  }

  // FBISE SLO integrity verification
  if (question.system === "fbise") {
    if (!question.sloId) {
      warnings.push("FBISE question does not specify an sloId mapping.");
    } else {
      const curr = getCurriculumByKey(question.system, question.grade, question.subjectId, question.curriculumVersion);
      if (curr && curr.slos.length > 0) {
        const exists = curr.slos.some((s) => s.id === question.sloId || s.code === question.sloId);
        if (!exists) {
          errors.push(`FBISE sloId "${question.sloId}" does not match any registered SLO in "${curr.id}".`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
