import assert from "node:assert/strict";
import {
  BankQuestion,
  PaperBlueprint,
} from "@/lib/mock-tests/types";
import { PAPER_BLUEPRINTS, getBlueprintForSubject } from "@/lib/mock-tests/blueprint/blueprintRegistry";
import { validateBlueprintAndPool } from "@/lib/mock-tests/blueprint/blueprintValidator";
import {
  generateBoardSimulationPaper,
  generatePracticePaper,
} from "@/lib/mock-tests/blueprint/paperGenerator";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";
import {
  getEligibleChapters,
  getEligibleTopicsForChapter,
  resolveQuestionSyllabusEligibility,
} from "@/lib/mock-tests/curriculum/eligibilityResolver";
import { validateCurriculumCompatibility } from "@/lib/mock-tests/curriculum/syllabusVersionResolver";
import { RAW_QUESTION_BANK } from "@/lib/mock-tests/question-bank/questionRegistry";
import { validateQuestionIntegrity } from "@/lib/mock-tests/question-bank/validation";
import { evaluateSingleItem } from "@/lib/mock-tests/scoring/scoringEngine";
import {
  applySubjectiveSelfReview,
  getRemainingSeconds,
  pauseAttempt,
  resumeAttempt,
  saveAttemptResponse,
  startNewAttempt,
  submitAttempt,
} from "@/lib/mock-tests/attempts/attemptMachine";
import { computeAnalyticsOverview } from "@/lib/mock-tests/analytics/analyticsEngine";

let passed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log("=== MATRIC MASTERY ASSESSMENT ENGINE UNIT TESTS ===");

// ---------------------------------------------------------------------------
// 1. BLUEPRINT & PAPER GENERATION TESTS
// ---------------------------------------------------------------------------
test("1.1 All registered official blueprints pass mathematical section & mark reconciliation", () => {
  for (const bp of PAPER_BLUEPRINTS) {
    const status = validateBlueprintAndPool(bp, RAW_QUESTION_BANK);
    assert.equal(
      status.isValidBlueprint,
      true,
      `Blueprint ${bp.id} failed integrity: ${status.issues.map((i) => i.message).join("; ")}`
    );
  }
});

test("1.2 Broken blueprint with mismatched section marks or duration <= 0 is rejected", () => {
  const brokenBp: PaperBlueprint = {
    ...PAPER_BLUEPRINTS[0],
    id: "bp-broken",
    durationMinutes: 0,
    totalMarks: 999,
  };
  const status = validateBlueprintAndPool(brokenBp, RAW_QUESTION_BANK);
  assert.equal(status.isValidBlueprint, false);
  assert.ok(status.issues.some((i) => i.code === "INVALID_DURATION"));
  assert.ok(status.issues.some((i) => i.code === "TOTAL_MARKS_MISMATCH"));
});

test("1.3 Punjab Class 10 CS Board Simulation generates exact 50 marks, zero duplicates, seeded determinism", () => {
  const gen1 = generateBoardSimulationPaper({
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    seed: "seed-cs-10-fixed",
  });
  const gen2 = generateBoardSimulationPaper({
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    seed: "seed-cs-10-fixed",
  });

  assert.equal(gen1.ok, true);
  assert.equal(gen2.ok, true);
  if (gen1.ok && gen2.ok) {
    assert.equal(gen1.paper.totalMarks, 50);
    assert.equal(gen1.paper.durationMinutes, 120);
    assert.equal(gen1.paper.allowPause, false);
    assert.equal(gen1.paper.slots.length, 31); // 10 MCQ + 6+6+6 Short + 3 Long
    const uniqueIds = new Set(gen1.paper.slots.map((s) => s.questionId));
    assert.equal(uniqueIds.size, gen1.paper.slots.length, "No duplicate questions allowed in a single paper");
    assert.deepEqual(
      gen1.paper.slots.map((s) => s.questionId),
      gen2.paper.slots.map((s) => s.questionId),
      "Seeded generation must be deterministic"
    );
  }
});

test("1.4 FBISE Class 9 Physics Board Simulation generates exact 65 marks, 3 hours, zero duplicates", () => {
  const gen = generateBoardSimulationPaper({
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    seed: "seed-fb-phy-9",
  });
  assert.equal(gen.ok, true);
  if (gen.ok) {
    assert.equal(gen.paper.totalMarks, 65);
    assert.equal(gen.paper.durationMinutes, 180);
    assert.equal(gen.paper.slots.length, 30); // 12 + 15 + 3
    const ids = new Set(gen.paper.slots.map((s) => s.questionId));
    assert.equal(ids.size, 30);
  }
});

test("1.5 Shortfall board blueprint refuses cleanly instead of fabricating filler questions", () => {
  const res = generateBoardSimulationPaper({
    system: "punjab",
    grade: 9,
    subjectId: "physics",
  });
  assert.equal(res.ok, false);
  if (!res.ok) {
    assert.ok(res.reason.includes("Validated pool:"));
  }
});

// ---------------------------------------------------------------------------
// 2. SYLLABUS & ALP GRANULAR EXCLUSION TESTS
// ---------------------------------------------------------------------------
test("2.1 Partial ALP exclusion keeps active chapter topics and never drops the whole chapter", () => {
  const phy9 = getCurriculumByKey("punjab", 9, "physics");
  assert.ok(phy9);
  const eligibleChapters = getEligibleChapters(phy9);
  const ch3 = eligibleChapters.find((c) => c.id === "pb-9-phy-ch3");
  assert.ok(ch3, "Chapter 3 Dynamics must remain active when only Banking of Roads is deleted");

  const eligibleTopics = getEligibleTopicsForChapter(ch3);
  assert.ok(eligibleTopics.some((t) => t.id === "pb-9-phy-ch3-t1"));
  assert.ok(!eligibleTopics.some((t) => t.id === "pb-9-phy-ch3-t3"), "Excluded topic must not be eligible");
});

test("2.2 Explicit ALP-excluded questions and Draft questions are filtered out of eligible generation", () => {
  const alpExcluded = RAW_QUESTION_BANK.find((q) => q.id === "pb10-cs-excl-01");
  assert.ok(alpExcluded);
  const decision = resolveQuestionSyllabusEligibility(alpExcluded);
  assert.equal(decision.eligible, false);

  const paperRes = generatePracticePaper({
    mode: "custom_test",
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    requestedCount: 50,
    isTimed: false,
    durationMinutes: 0,
  });
  assert.equal(paperRes.ok, true);
  if (paperRes.ok) {
    assert.ok(!paperRes.paper.questionsById["pb10-cs-excl-01"]);
    assert.ok(!paperRes.paper.questionsById["pb10-chem-draft-01"]);
  }
});

test("2.3 Stale curriculum version mismatch and unavailable subjects fail compatibility checks", () => {
  const stale = validateCurriculumCompatibility({
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    curriculumVersion: "old-2023-syllabus",
  });
  assert.equal(stale.ok, false);

  const unavail = validateCurriculumCompatibility({
    system: "punjab",
    grade: 10,
    subjectId: "biology",
    curriculumVersion: "pectaa-2026-27",
  });
  assert.equal(unavail.ok, false);
});

// ---------------------------------------------------------------------------
// 3. QUESTION VALIDATOR & ALL 12 TYPES SCORING TESTS
// ---------------------------------------------------------------------------
test("3.1 Verified eligible RAW_QUESTION_BANK passes integrity checks without duplicate IDs", () => {
  const seenIds = new Set<string>();
  for (const q of RAW_QUESTION_BANK) {
    assert.equal(seenIds.has(q.id), false, `Duplicate ID found: ${q.id}`);
    seenIds.add(q.id);
    if (q.validationStatus === "Verified" && q.eligibilityStatus === "eligible") {
      const check = validateQuestionIntegrity(q);
      assert.equal(check.valid, true, `Verified question ${q.id} failed check: ${check.errors.join(", ")}`);
    }
  }
});

test("3.2 Auto-graded types: Fill-Blank normalization, Case Sensitivity, Numerical tolerance & unit deduction", () => {
  const fillCaseQ = RAW_QUESTION_BANK.find((q) => q.type === "fill_blank" && q.caseSensitive)!;
  assert.ok(fillCaseQ && fillCaseQ.type === "fill_blank");
  const fillCaseOk = evaluateSingleItem({
    question: fillCaseQ,
    response: { kind: "fill_blank", text: `  ${fillCaseQ.acceptedAnswers[0]} . ` },
  });
  assert.equal(fillCaseOk.status, "correct");

  const fillCaseWrong = evaluateSingleItem({
    question: fillCaseQ,
    response: { kind: "fill_blank", text: fillCaseQ.acceptedAnswers[0].toUpperCase() },
  });
  assert.equal(fillCaseWrong.status, "incorrect", "Case-sensitive fill_blank must reject wrong casing");

  const fillInsensQ = RAW_QUESTION_BANK.find((q) => q.type === "fill_blank" && !q.caseSensitive)!;
  assert.ok(fillInsensQ && fillInsensQ.type === "fill_blank");
  const fillInsensOk = evaluateSingleItem({
    question: fillInsensQ,
    response: { kind: "fill_blank", text: `  ${fillInsensQ.acceptedAnswers[0].toUpperCase()} . ` },
  });
  assert.equal(fillInsensOk.status, "correct");
  assert.equal(fillInsensOk.awardedMarks, fillInsensQ.marks);

  const numQ = RAW_QUESTION_BANK.find((q) => q.type === "numerical" && q.valueMarks && q.unitMarks)!;
  assert.ok(numQ && numQ.type === "numerical");
  // Right number, wrong unit -> partial credit cleanly enforced
  const partialNum = evaluateSingleItem({
    question: numQ,
    response: { kind: "numerical", valueText: String(numQ.numericAnswer), unitText: "wrongunit" },
  });
  assert.equal(partialNum.status, "partial");
  assert.equal(partialNum.awardedMarks, numQ.valueMarks);

  // Within tolerance & normalized SI unit
  const exactNum = evaluateSingleItem({
    question: numQ,
    response: {
      kind: "numerical",
      valueText: String(numQ.numericAnswer),
      unitText: numQ.requiredUnit || "",
    },
  });
  assert.equal(exactNum.status, "correct");
  assert.equal(exactNum.awardedMarks, numQ.marks);
});

test("3.3 Subjective questions honestly stay pending_review and update live upon Rubric Self-Review", () => {
  const gen = generateBoardSimulationPaper({
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    seed: "seed-self-review",
  });
  assert.equal(gen.ok, true);
  if (!gen.ok) return;

  let att = startNewAttempt(gen.paper, 1_000_000);
  const shortSlot = gen.paper.slots.find((s) => gen.paper.questionsById[s.questionId].type === "short_answer")!;
  att = saveAttemptResponse(att, shortSlot.slotId, {
    kind: "text_response",
    text: "Written student response for rubric evaluation.",
  });

  const submitted = submitAttempt(att, "manual", 1_060_000);
  assert.ok(submitted.scoring);
  const itemRes = submitted.scoring.itemResults.find((r) => r.slotId === shortSlot.slotId)!;
  assert.equal(itemRes.status, "pending_review");
  assert.equal(itemRes.awardedMarks, null);

  const q = gen.paper.questionsById[shortSlot.questionId];
  assert.ok(q.rubric);
  const firstCriterion = q.rubric.criteria[0];
  const afterReview = applySubjectiveSelfReview(submitted, shortSlot.slotId, [firstCriterion.id], 1_070_000);
  assert.ok(afterReview.scoring);
  const reviewedItem = afterReview.scoring.itemResults.find((r) => r.slotId === shortSlot.slotId)!;
  assert.equal(reviewedItem.status, "self_reviewed");
  assert.equal(reviewedItem.awardedMarks, firstCriterion.marks);
});

// ---------------------------------------------------------------------------
// 4. ATTEMPT LIFECYCLE, PAUSE, IDEMPOTENCY, CHOICE OVERFLOW & SNAPSHOT FREEZE
// ---------------------------------------------------------------------------
test("4.1 Attempt timer, pause lock, snapshot isolation, idempotent submit & choice limit cap", () => {
  const gen = generateBoardSimulationPaper({
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    seed: "seed-lifecycle",
  });
  assert.equal(gen.ok, true);
  if (!gen.ok) return;

  const startMs = 2_000_000;
  let att = startNewAttempt(gen.paper, startMs);

  // Official Board Simulation must refuse pause
  const attemptedPause = pauseAttempt(att, startMs + 5_000);
  assert.equal(attemptedPause.status, "in_progress");

  // Mutating original bank item prompt must NEVER alter active attempt snapshot
  const firstQId = att.paper.slots[0].questionId;
  const originalPrompt = att.paper.questionsById[firstQId].prompt;
  const bankItem = RAW_QUESTION_BANK.find((q) => q.id === firstQId) as BankQuestion;
  const savedBankPrompt = bankItem.prompt;
  bankItem.prompt = "MUTATED_EXTERNAL_PROMPT";
  assert.equal(att.paper.questionsById[firstQId].prompt, originalPrompt);
  bankItem.prompt = savedBankPrompt;

  // Choice overflow rule: Q2 requires 4 of 6 short questions. Attempt all 6 -> 2 marked not_counted_choice!
  const q2Group = att.paper.sections[1].choiceGroups[0];
  q2Group.slotIds.forEach((slotId) => {
    att = saveAttemptResponse(att, slotId, { kind: "text_response", text: "Student answer" });
  });

  const sub1 = submitAttempt(att, "manual", startMs + 30_000);
  const sub2 = submitAttempt(sub1, "manual", startMs + 45_000);
  assert.equal(sub1, sub2, "Duplicate submit must be strictly idempotent");
  assert.equal(sub1.scoring?.notCountedChoiceCount, 2, "2 overflow responses beyond 4/6 limit must not be counted");

  // Practice mode allows pause & extends deadline cleanly on resume
  const pracGen = generatePracticePaper({
    mode: "quick_test",
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    requestedCount: 4,
    isTimed: true,
    durationMinutes: 10,
  });
  assert.equal(pracGen.ok, true);
  if (pracGen.ok) {
    let pAtt = startNewAttempt(pracGen.paper, 5_000_000);
    pAtt = pauseAttempt(pAtt, 5_060_000); // 1 min spent -> 9 min remaining
    assert.equal(pAtt.status, "paused");
    assert.equal(getRemainingSeconds(pAtt, 5_300_000), 540, "Paused timer stays frozen");
    pAtt = resumeAttempt(pAtt, 6_000_000);
    assert.equal(getRemainingSeconds(pAtt, 6_000_000), 540, "Resumed timer continues cleanly from paused remainder");
  }
});

// ---------------------------------------------------------------------------
// 5. ANALYTICS & ANTI-FLUKE WEAK AREA TESTS
// ---------------------------------------------------------------------------
test("5.1 Analytics stays honest when empty and refuses weak-topic flag on single fluke miss", () => {
  const emptyOverview = computeAnalyticsOverview([], []);
  assert.equal(emptyOverview.hasSufficientHistory, false);
  assert.equal(emptyOverview.weakTopics.length, 0);

  const prac = generatePracticePaper({
    mode: "custom_test",
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    allowedTypes: ["single_mcq"],
    requestedCount: 4,
    isTimed: false,
    durationMinutes: 0,
    seed: "seed-analytics",
  });
  assert.equal(prac.ok, true);
  if (!prac.ok) return;

  let att = startNewAttempt(prac.paper, 10_000_000);
  // Answer only 1 wrong item and 3 correct -> topics with <2 total questions or >=65% must not trigger fluke weak tag
  prac.paper.slots.forEach((slot, idx) => {
    const q = prac.paper.questionsById[slot.questionId];
    if (q.type === "single_mcq") {
      const chosen = idx === 0 ? (q.correctIndex + 1) % q.options.length : q.correctIndex;
      att = saveAttemptResponse(att, slot.slotId, { kind: "single_mcq", selectedCanonicalIndex: chosen });
    }
  });
  const done = submitAttempt(att, "manual", 10_050_000);
  const overview = computeAnalyticsOverview([done], []);
  assert.equal(overview.hasSufficientHistory, true);
  assert.equal(overview.totalAttempts, 1);
  // Weak topics require >=2 graded items and (<65% accuracy or >=2 incorrect)
  for (const wt of overview.weakTopics) {
    assert.ok(wt.totalQuestions >= 2);
  }
});

console.log(`\n=== COMPLETED: ${passed} TESTS PASSED ===`);
