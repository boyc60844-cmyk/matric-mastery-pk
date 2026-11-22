import {
  AttemptScoringSummary,
  BankQuestion,
  EvaluatedQuestionResult,
  GeneratedPaperSnapshot,
  ItemEvaluationStatus,
  SLOPerformanceMetric,
  StudentResponseValue,
  SubjectiveSelfReviewEntry,
  TopicPerformanceMetric,
} from "@/lib/mock-tests/types";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";
import {
  checkUnitMatch,
  isResponseEmpty,
  normalizeTextAnswer,
  parseNumericInput,
} from "@/lib/mock-tests/scoring/answerValidator";

export function evaluateSingleItem(params: {
  question: BankQuestion;
  response?: StudentResponseValue;
  selfReview?: SubjectiveSelfReviewEntry;
}): {
  awardedMarks: number | null;
  status: ItemEvaluationStatus;
  feedback: string;
} {
  const { question, response, selfReview } = params;
  const empty = isResponseEmpty(response);

  // Subjective self-review already recorded
  if (selfReview) {
    const capped = Math.min(question.marks, Math.max(0, selfReview.awardedMarks));
    return {
      awardedMarks: capped,
      status: empty && capped === 0 ? "unanswered" : "self_reviewed",
      feedback: `Self-reviewed against official rubric (${capped} / ${question.marks} marks).`,
    };
  }

  if (empty || !response) {
    return {
      awardedMarks: 0,
      status: "unanswered",
      feedback: "Unanswered — 0 marks awarded.",
    };
  }

  switch (question.type) {
    case "single_mcq": {
      if (response.kind !== "single_mcq") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid response payload." };
      }
      const correct = response.selectedCanonicalIndex === question.correctIndex;
      return {
        awardedMarks: correct ? question.marks : 0,
        status: correct ? "correct" : "incorrect",
        feedback: correct
          ? "Correct choice selected."
          : `Incorrect — correct option is "${question.options[question.correctIndex]}".`,
      };
    }

    case "multi_select": {
      if (response.kind !== "multi_select") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid multi-select response." };
      }
      const selectedSet = new Set(response.selectedCanonicalIndices);
      const correctSet = new Set(question.correctIndices);
      const allCorrectPicked = question.correctIndices.every((idx) => selectedSet.has(idx));
      const noWrongPicked = response.selectedCanonicalIndices.every((idx) => correctSet.has(idx));

      if (allCorrectPicked && noWrongPicked) {
        return {
          awardedMarks: question.marks,
          status: "correct",
          feedback: "All required options accurately selected.",
        };
      }

      if (question.allowPartialCredit && question.rubric?.allowPartialMarks) {
        const truePositives = response.selectedCanonicalIndices.filter((i) => correctSet.has(i)).length;
        const falsePositives = response.selectedCanonicalIndices.filter((i) => !correctSet.has(i)).length;
        const rawFraction = Math.max(0, (truePositives - falsePositives) / question.correctIndices.length);
        const partial = Math.round(rawFraction * question.marks * 2) / 2;
        if (partial > 0) {
          return {
            awardedMarks: partial,
            status: "partial",
            feedback: `Partial rubric credit: ${partial} / ${question.marks} marks.`,
          };
        }
      }

      return {
        awardedMarks: 0,
        status: "incorrect",
        feedback: "Exact required set of options not matched.",
      };
    }

    case "true_false": {
      if (response.kind !== "true_false") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid response." };
      }
      const correct = response.value === question.correctBoolean;
      return {
        awardedMarks: correct ? question.marks : 0,
        status: correct ? "correct" : "incorrect",
        feedback: correct
          ? "Correct."
          : `Incorrect — accurate statement value is ${question.correctBoolean ? "True" : "False"}.`,
      };
    }

    case "fill_blank": {
      if (response.kind !== "fill_blank") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid response." };
      }
      const normalized = normalizeTextAnswer(response.text, question.caseSensitive);
      const matched = question.acceptedAnswers.some(
        (ans) => normalizeTextAnswer(ans, question.caseSensitive) === normalized
      );
      return {
        awardedMarks: matched ? question.marks : 0,
        status: matched ? "correct" : "incorrect",
        feedback: matched
          ? "Exact normalized response accepted."
          : `Expected accepted response such as "${question.acceptedAnswers[0]}".`,
      };
    }

    case "matching": {
      if (response.kind !== "matching") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid matching response." };
      }
      const totalPairs = question.pairs.length;
      const correctPairs = question.pairs.filter(
        (p) => normalizeTextAnswer(response.matches[p.id] || "") === normalizeTextAnswer(p.right)
      ).length;

      if (correctPairs === totalPairs) {
        return {
          awardedMarks: question.marks,
          status: "correct",
          feedback: `All ${totalPairs} pairs matched correctly.`,
        };
      }

      if (question.allowPartialCredit && question.rubric?.allowPartialMarks && correctPairs > 0) {
        const partial = Number(((correctPairs / totalPairs) * question.marks).toFixed(2));
        return {
          awardedMarks: partial,
          status: "partial",
          feedback: `${correctPairs} / ${totalPairs} pairs matched (${partial} / ${question.marks} marks).`,
        };
      }

      return {
        awardedMarks: 0,
        status: "incorrect",
        feedback: `${correctPairs} / ${totalPairs} pairs matched accurately.`,
      };
    }

    case "classification": {
      if (response.kind !== "classification") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid classification response." };
      }
      const totalItems = question.items.length;
      const correctItems = question.items.filter(
        (item) => response.assignments[item.id] === item.correctCategory
      ).length;

      if (correctItems === totalItems) {
        return {
          awardedMarks: question.marks,
          status: "correct",
          feedback: `All ${totalItems} items classified accurately.`,
        };
      }

      if (question.allowPartialCredit && question.rubric?.allowPartialMarks && correctItems > 0) {
        const partial = Number(((correctItems / totalItems) * question.marks).toFixed(2));
        return {
          awardedMarks: partial,
          status: "partial",
          feedback: `${correctItems} / ${totalItems} items classified correctly (${partial} / ${question.marks} marks).`,
        };
      }

      return {
        awardedMarks: 0,
        status: "incorrect",
        feedback: `${correctItems} / ${totalItems} items correctly classified.`,
      };
    }

    case "diagram_labeling": {
      if (response.kind !== "diagram_labeling") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid diagram response." };
      }
      const totalPins = question.pins.length;
      const correctPins = question.pins.filter(
        (pin) => response.labelsByPinId[pin.id] === pin.correctLabel
      ).length;

      if (correctPins === totalPins) {
        return {
          awardedMarks: question.marks,
          status: "correct",
          feedback: `All ${totalPins} diagram pins labeled accurately.`,
        };
      }

      if (question.allowPartialCredit && question.rubric?.allowPartialMarks && correctPins > 0) {
        const partial = Number(((correctPins / totalPins) * question.marks).toFixed(2));
        return {
          awardedMarks: partial,
          status: "partial",
          feedback: `${correctPins} / ${totalPins} diagram pins labeled correctly (${partial} / ${question.marks} marks).`,
        };
      }

      return {
        awardedMarks: 0,
        status: "incorrect",
        feedback: `${correctPins} / ${totalPins} pins labeled accurately.`,
      };
    }

    case "numerical": {
      if (response.kind !== "numerical") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid numerical response." };
      }
      const numVal = parseNumericInput(response.valueText);
      const valOk =
        numVal !== null && Math.abs(numVal - question.numericAnswer) <= question.tolerance;
      const unitOk = checkUnitMatch(response.unitText, question.acceptedUnits);

      if (valOk && unitOk) {
        return {
          awardedMarks: question.marks,
          status: "correct",
          feedback: `Exact magnitude (${question.numericAnswer}) and unit (${question.requiredUnit ?? "ok"}) verified.`,
        };
      }

      // Partial marks ONLY when question defines explicit valueMarks/unitMarks + partial rubric
      if (
        question.rubric?.allowPartialMarks &&
        typeof question.valueMarks === "number" &&
        typeof question.unitMarks === "number"
      ) {
        const earned = (valOk ? question.valueMarks : 0) + (unitOk ? question.unitMarks : 0);
        if (earned > 0) {
          return {
            awardedMarks: earned,
            status: "partial",
            feedback: valOk
              ? `Magnitude ${question.numericAnswer} is right, but expected unit "${question.requiredUnit}".`
              : `Unit matches, but expected numeric answer ${question.numericAnswer} (±${question.tolerance}).`,
          };
        }
      }

      return {
        awardedMarks: 0,
        status: "incorrect",
        feedback: `Expected ${question.numericAnswer}${question.requiredUnit ? ` ${question.requiredUnit}` : ""}.`,
      };
    }

    case "structured_multi_part": {
      if (response.kind !== "structured_multi_part") {
        return { awardedMarks: 0, status: "incorrect", feedback: "Invalid multi-part response." };
      }
      let earned = 0;
      let hasManualPart = false;
      const notes: string[] = [];

      for (const part of question.subParts) {
        const ans = response.parts[part.id];
        if (!ans || !ans.text.trim()) {
          notes.push(`${part.label}: blank`);
          continue;
        }
        if (part.kind === "numerical" && typeof part.numericAnswer === "number") {
          const val = parseNumericInput(ans.text);
          const tol = part.tolerance ?? 0.05;
          const valOk = val !== null && Math.abs(val - part.numericAnswer) <= tol;
          const unitOk = !part.acceptedUnits?.length || !ans.unitText?.trim()
            ? valOk && (!part.acceptedUnits?.length || checkUnitMatch(ans.unitText || "", part.acceptedUnits))
            : checkUnitMatch(ans.unitText || "", part.acceptedUnits);

          // If student put unit inside the main numeric field or separate unit field cleanly
          if (valOk && (!part.acceptedUnits?.length || unitOk)) {
            earned += part.marks;
            notes.push(`${part.label}: ${part.marks}/${part.marks}`);
          } else if (valOk && part.acceptedUnits?.length && !unitOk && question.rubric.allowPartialMarks) {
            const partialPart = Math.max(0, part.marks - 1);
            earned += partialPart;
            notes.push(`${part.label}: ${partialPart}/${part.marks} (check unit ${part.acceptedUnits[0]})`);
          } else {
            notes.push(`${part.label}: 0/${part.marks} (expected ${part.numericAnswer} ${part.acceptedUnits?.[0] ?? ""})`);
          }
        } else if (part.kind === "fill_blank" && part.acceptedAnswers?.length) {
          const ok = part.acceptedAnswers.some(
            (a) => normalizeTextAnswer(a) === normalizeTextAnswer(ans.text)
          );
          if (ok) {
            earned += part.marks;
            notes.push(`${part.label}: ${part.marks}/${part.marks}`);
          } else {
            notes.push(`${part.label}: 0/${part.marks}`);
          }
        } else {
          hasManualPart = true;
        }
      }

      if (hasManualPart) {
        return {
          awardedMarks: null,
          status: "pending_review",
          feedback: "Contains open subjective parts — review against the marking rubric.",
        };
      }

      const status: ItemEvaluationStatus =
        earned === question.marks ? "correct" : earned > 0 ? "partial" : "incorrect";
      return {
        awardedMarks: earned,
        status,
        feedback: notes.join(" · "),
      };
    }

    case "short_answer": {
      if (response.kind !== "text_response") {
        return { awardedMarks: null, status: "pending_review", feedback: "Requires self-review." };
      }
      if (question.acceptedExactAnswers?.length) {
        const norm = normalizeTextAnswer(response.text);
        const exact = question.acceptedExactAnswers.some((a) => normalizeTextAnswer(a) === norm);
        if (exact) {
          return {
            awardedMarks: question.marks,
            status: "correct",
            feedback: "Matched verified exact response key.",
          };
        }
      }
      return {
        awardedMarks: null,
        status: "pending_review",
        feedback: "Subjective short answer — compare with Model Answer & Rubric to score.",
      };
    }

    case "proof_derivation":
    case "extended_response": {
      return {
        awardedMarks: null,
        status: "pending_review",
        feedback: "Descriptive response — pending rubric self-review (no synthetic auto-marks).",
      };
    }
  }
}

/**
 * Evaluates a completed or submitted paper deterministically:
 * - Objective / tolerance items are graded accurately.
 * - Subjective items without a selfReview remain `pending_review` (`awardedMarks: null`).
 * - Enforces choiceGroup attempt caps (`requiredAttemptCount`) so students cannot inflate scores
 *   beyond official section/group maximums by answering extra optional questions.
 */
export function scoreExamAttempt(params: {
  paper: GeneratedPaperSnapshot;
  responses: Record<string, StudentResponseValue>;
  selfReviews: Record<string, SubjectiveSelfReviewEntry>;
  timeSpentSeconds: number;
}): AttemptScoringSummary {
  const { paper, responses, selfReviews, timeSpentSeconds } = params;

  const rawItemResults: EvaluatedQuestionResult[] = paper.slots.map((slot) => {
    const question = paper.questionsById[slot.questionId];
    const response = responses[slot.slotId];
    const selfReview = selfReviews[slot.slotId];
    const evalOut = evaluateSingleItem({ question, response, selfReview });

    return {
      slotId: slot.slotId,
      questionId: question.id,
      questionVersion: question.version,
      displayNumber: slot.displayNumber,
      sectionId: slot.sectionId,
      choiceGroupId: slot.choiceGroupId,
      type: question.type,
      chapterId: question.chapterId,
      topicId: question.topicId,
      sloId: question.sloId,
      difficulty: question.difficulty,
      cognitiveLevel: question.cognitiveLevel,
      maxMarks: question.marks,
      awardedMarks: evalOut.awardedMarks,
      effectiveMarks: evalOut.awardedMarks ?? 0,
      status: evalOut.status,
      countedInChoiceGroup: true,
      feedback: evalOut.feedback,
      studentResponse: response,
      selfReview,
    };
  });

  // Apply official choice-group attempt caps where totalQuestions > requiredAttemptCount
  const resultBySlotId = new Map(rawItemResults.map((r) => [r.slotId, r]));
  let notCountedChoiceCount = 0;

  for (const sec of paper.sections) {
    for (const group of sec.choiceGroups) {
      if (group.slotIds.length <= group.requiredAttemptCount) continue;

      const groupResults = group.slotIds
        .map((id) => resultBySlotId.get(id))
        .filter((r): r is EvaluatedQuestionResult => Boolean(r));

      // Attempted items prioritized cleanly: reviewed/auto-graded highest scores first, then pending_review
      const attempted = groupResults.filter((r) => r.status !== "unanswered");
      if (attempted.length > group.requiredAttemptCount) {
        const sortedAttempted = [...attempted].sort((a, b) => {
          const scoreA = a.awardedMarks ?? -0.5;
          const scoreB = b.awardedMarks ?? -0.5;
          return scoreB - scoreA;
        });

        const countedIds = new Set(
          sortedAttempted.slice(0, group.requiredAttemptCount).map((r) => r.slotId)
        );

        for (const r of attempted) {
          if (!countedIds.has(r.slotId)) {
            r.countedInChoiceGroup = false;
            r.status = "not_counted_choice";
            r.effectiveMarks = 0;
            r.feedback = `Extra attempt beyond group limit (${group.requiredAttemptCount}/${group.totalQuestions}) — excluded from total score.`;
            notCountedChoiceCount += 1;
          }
        }
      }
    }
  }

  let obtainedMarks = 0;
  let autoGradedObtainedMarks = 0;
  let autoGradedMaxMarks = 0;
  let selfReviewedObtainedMarks = 0;
  let pendingReviewMarks = 0;
  let pendingReviewCount = 0;
  let correctCount = 0;
  let partialCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  // Track topic & SLO aggregations strictly for counted items
  const curriculum = getCurriculumByKey(paper.system, paper.grade, paper.subjectId, paper.curriculumVersion);
  const topicMap = new Map<string, TopicPerformanceMetric>();
  const sloMap = new Map<string, SLOPerformanceMetric>();

  for (const item of rawItemResults) {
    if (!item.countedInChoiceGroup) continue;

    if (item.status === "pending_review") {
      pendingReviewMarks += item.maxMarks;
      pendingReviewCount += 1;
    } else if (item.status === "self_reviewed") {
      selfReviewedObtainedMarks += item.effectiveMarks;
      obtainedMarks += item.effectiveMarks;
    } else {
      // Auto-graded (correct, partial, incorrect, or unanswered objective/subjective)
      if (item.type !== "short_answer" && item.type !== "extended_response" && item.type !== "proof_derivation") {
        autoGradedMaxMarks += item.maxMarks;
        autoGradedObtainedMarks += item.effectiveMarks;
      }
      obtainedMarks += item.effectiveMarks;
    }

    if (item.status === "correct") correctCount += 1;
    else if (item.status === "partial") partialCount += 1;
    else if (item.status === "incorrect") incorrectCount += 1;
    else if (item.status === "unanswered") unansweredCount += 1;

    // Topic breakdown
    const chap = curriculum?.chapters.find((c) => c.id === item.chapterId);
    const topic = chap?.topics.find((t) => t.id === item.topicId);
    const existingTopic = topicMap.get(item.topicId) ?? {
      topicId: item.topicId,
      topicTitle: topic?.title || item.topicId,
      chapterId: item.chapterId,
      chapterTitle: chap?.title || item.chapterId,
      questionCount: 0,
      autoGradedCount: 0,
      pendingReviewCount: 0,
      incorrectCount: 0,
      obtainedMarks: 0,
      availableMarks: 0,
      accuracyPercent: null,
    };
    existingTopic.questionCount += 1;
    existingTopic.availableMarks += item.maxMarks;
    if (item.status === "pending_review") {
      existingTopic.pendingReviewCount += 1;
    } else {
      existingTopic.autoGradedCount += 1;
      existingTopic.obtainedMarks += item.effectiveMarks;
      if (item.status === "incorrect") existingTopic.incorrectCount += 1;
    }
    topicMap.set(item.topicId, existingTopic);

    // SLO breakdown
    if (item.sloId) {
      const sloDef = curriculum?.slos.find((s) => s.id === item.sloId);
      const existingSlo = sloMap.get(item.sloId) ?? {
        sloId: item.sloId,
        sloCode: sloDef?.code || item.sloId,
        statement: sloDef?.statement || "",
        cognitiveLevel: item.cognitiveLevel,
        obtainedMarks: 0,
        availableMarks: 0,
        questionCount: 0,
      };
      existingSlo.questionCount += 1;
      existingSlo.availableMarks += item.maxMarks;
      if (item.status !== "pending_review") {
        existingSlo.obtainedMarks += item.effectiveMarks;
      }
      sloMap.set(item.sloId, existingSlo);
    }
  }

  // Finalize topic accuracy only over graded/reviewed marks (never fake accuracy for pending review)
  const topicBreakdown = Array.from(topicMap.values()).map((t) => {
    const gradedItemsMarks = rawItemResults
      .filter((r) => r.countedInChoiceGroup && r.topicId === t.topicId && r.status !== "pending_review")
      .reduce((sum, r) => sum + r.maxMarks, 0);
    return {
      ...t,
      obtainedMarks: Number(t.obtainedMarks.toFixed(2)),
      accuracyPercent:
        gradedItemsMarks > 0 ? Math.round((t.obtainedMarks / gradedItemsMarks) * 100) : null,
    };
  });

  const roundedObtained = Math.min(paper.totalMarks, Number(obtainedMarks.toFixed(2)));
  const percentage = paper.totalMarks > 0 ? Math.round((roundedObtained / paper.totalMarks) * 100) : 0;
  const autoGradedAccuracy =
    autoGradedMaxMarks > 0 ? Math.round((autoGradedObtainedMarks / autoGradedMaxMarks) * 100) : null;

  return {
    obtainedMarks: roundedObtained,
    autoGradedObtainedMarks: Number(autoGradedObtainedMarks.toFixed(2)),
    autoGradedMaxMarks,
    selfReviewedObtainedMarks: Number(selfReviewedObtainedMarks.toFixed(2)),
    pendingReviewMarks,
    pendingReviewCount,
    totalMarks: paper.totalMarks,
    percentage,
    autoGradedAccuracy,
    passedByPolicy: percentage >= paper.passingPercentage,
    passingPercentage: paper.passingPercentage,
    correctCount,
    partialCount,
    incorrectCount,
    unansweredCount,
    notCountedChoiceCount,
    timeSpentSeconds: Math.max(0, Math.round(timeSpentSeconds)),
    itemResults: rawItemResults,
    topicBreakdown,
    sloBreakdown: Array.from(sloMap.values()),
  };
}
