import assert from "node:assert/strict";
import {
  BankQuestion,
  PaperBlueprint,
} from "@/lib/mock-tests/types";
import {
  PAPER_BLUEPRINTS,
  getBlueprintForSubject,
} from "@/lib/mock-tests/blueprint/blueprintRegistry";
import { validateBlueprintAndPool } from "@/lib/mock-tests/blueprint/blueprintValidator";
import {
  generateBoardSimulationPaper,
  generatePracticePaper,
} from "@/lib/mock-tests/blueprint/paperGenerator";
import { getCurriculumByKey } from "@/lib/mock-tests/curriculum/curriculumRegistry";
import {
  PUNJAB_AUTHORITY_REGISTRY,
  PUNJAB_CURRICULUM_VERSION_2026_27,
  PUNJAB_NOTIFICATIONS_BY_ID,
} from "@/lib/mock-tests/curriculum/punjab/session-2026-27";
import {
  FBISE_LEGACY_EXCLUDED_VERSIONS,
  FBISE_SCHEME_VERSION,
} from "@/lib/mock-tests/curriculum/fbise/scheme-2024";
import {
  getEligibleChapters,
  getEligibleTopicsForChapter,
  resolveQuestionSyllabusEligibility,
} from "@/lib/mock-tests/curriculum/eligibilityResolver";
import { getSubjectReadinessProfile } from "@/lib/mock-tests/curriculum/readinessResolver";
import { validateCurriculumCompatibility } from "@/lib/mock-tests/curriculum/syllabusVersionResolver";
import { RAW_QUESTION_BANK } from "@/lib/mock-tests/question-bank/questionRegistry";
import { PUNJAB_SSC_CS_QUESTIONS } from "@/lib/mock-tests/question-bank/bank/punjab-ssc-cs";
import { filterEligibleQuestions } from "@/lib/mock-tests/question-bank/eligibility";
import {
  normalizePromptForDedup,
  validateQuestionIntegrity,
} from "@/lib/mock-tests/question-bank/validation";
import { parseNumericInput } from "@/lib/mock-tests/scoring/answerValidator";
import {
  evaluateSingleItem,
  scoreExamAttempt,
} from "@/lib/mock-tests/scoring/scoringEngine";
import {
  applySubjectiveSelfReview,
  extractMistakesFromAttempt,
  getRemainingSeconds,
  pauseAttempt,
  resumeAttempt,
  saveAttemptResponse,
  startNewAttempt,
  submitAttempt,
} from "@/lib/mock-tests/attempts/attemptMachine";
import { parseAndMigrateStoreJson } from "@/lib/mock-tests/persistence/storage";
import { computeAnalyticsOverview } from "@/lib/mock-tests/analytics/analyticsEngine";
import { SUBJECTS_CONFIG } from "@/lib/question-bank";

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

function buildSyntheticCs10FullPool(): BankQuestion[] {
  const pool: BankQuestion[] = [];
  const baseReview = {
    reviewedBy: "Synthetic Audit",
    reviewedAt: "2026-11-19",
    checklistPassed: true,
  };
  const makeBase = (
    id: string,
    chapterId: string,
    topicId: string,
    marks: number
  ) => ({
    id,
    version: "1.0.0",
    system: "punjab" as const,
    board: "All 9 Punjab BISEs (PECTAA No. 1257)",
    grade: 10 as const,
    subjectId: "computer-science",
    subjectGroup: "science" as const,
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    chapterId,
    topicId,
    origin: "Original authored" as const,
    validationStatus: "Verified" as const,
    reviewMetadata: baseReview,
    eligibilityStatus: "eligible" as const,
    versionHistory: [{ version: "1.0.0", date: "2026-11-19", note: "Synthetic pool item" }],
    marks,
    difficulty: "Moderate" as const,
    cognitiveLevel: "Understand" as const,
    sourceReference: "PECTAA No. 1257 CS 10",
    explanation: "Synthetic blueprint slot verification item.",
  });

  // 14 MCQs distributed across u1, u3, u4, u5, u6, u7, u8 (2 per active unit)
  const units = [
    ["pb-10-cs-u1", "pb-10-cs-u1-t1"],
    ["pb-10-cs-u3", "pb-10-cs-u3-t1"],
    ["pb-10-cs-u4", "pb-10-cs-u4-t1"],
    ["pb-10-cs-u5", "pb-10-cs-u5-t1"],
    ["pb-10-cs-u6", "pb-10-cs-u6-t1"],
    ["pb-10-cs-u7", "pb-10-cs-u7-t1"],
    ["pb-10-cs-u8", "pb-10-cs-u8-t1"],
  ] as const;

  units.forEach(([chId, tId], uIdx) => {
    for (let k = 1; k <= 2; k++) {
      pool.push({
        ...makeBase(`syn-mcq-${uIdx}-${k}`, chId, tId, 1),
        type: "single_mcq",
        prompt: `Synthetic CS 10 MCQ ${uIdx}-${k} for unit ${chId}`,
        options: ["Alpha", "Beta", "Gamma", "Delta"],
        correctIndex: 0,
      });
    }
  });

  // Q2 short (u1, u3): 6 items
  for (let i = 1; i <= 6; i++) {
    const ch = i <= 3 ? "pb-10-cs-u1" : "pb-10-cs-u3";
    pool.push({
      ...makeBase(`syn-q2-${i}`, ch, `${ch}-t1`, 2),
      type: "short_answer",
      prompt: `Synthetic Q2 Short ${i} (${ch})`,
      modelAnswer: "Model short answer for Q2.",
      markingPoints: ["Point 1", "Point 2"],
      rubric: {
        maxMarks: 2,
        allowPartialMarks: true,
        criteria: [
          { id: "c1", label: "Concept", marks: 1, detail: "Core definition" },
          { id: "c2", label: "Example", marks: 1, detail: "Python/OS example" },
        ],
      },
    });
  }

  // Q3 short (u4, u5): 6 items
  for (let i = 1; i <= 6; i++) {
    const ch = i <= 3 ? "pb-10-cs-u4" : "pb-10-cs-u5";
    pool.push({
      ...makeBase(`syn-q3-${i}`, ch, `${ch}-t1`, 2),
      type: "short_answer",
      prompt: `Synthetic Q3 Short ${i} (${ch})`,
      modelAnswer: "Model short answer for Q3.",
      markingPoints: ["Point 1", "Point 2"],
      rubric: {
        maxMarks: 2,
        allowPartialMarks: true,
        criteria: [
          { id: "c1", label: "Concept", marks: 1, detail: "Core definition" },
          { id: "c2", label: "Trace", marks: 1, detail: "Valid output" },
        ],
      },
    });
  }

  // Q4 short (u6, u7, u8): 6 items
  const q4Units = ["pb-10-cs-u6", "pb-10-cs-u7", "pb-10-cs-u8"];
  for (let i = 1; i <= 6; i++) {
    const ch = q4Units[(i - 1) % 3];
    pool.push({
      ...makeBase(`syn-q4-${i}`, ch, `${ch}-t1`, 2),
      type: "short_answer",
      prompt: `Synthetic Q4 Short ${i} (${ch})`,
      modelAnswer: "Model short answer for Q4.",
      markingPoints: ["Point 1", "Point 2"],
      rubric: {
        maxMarks: 2,
        allowPartialMarks: true,
        criteria: [
          { id: "c1", label: "Concept", marks: 1, detail: "Core definition" },
          { id: "c2", label: "Application", marks: 1, detail: "Valid scenario" },
        ],
      },
    });
  }

  // Long (u1, u4, u6): 3 items x 8m
  for (const ch of ["pb-10-cs-u1", "pb-10-cs-u4", "pb-10-cs-u6"]) {
    pool.push({
      ...makeBase(`syn-long-${ch}`, ch, `${ch}-t1`, 8),
      type: "extended_response",
      prompt: `Synthetic Long 8m question for ${ch}`,
      modelAnswer: "Full structured essay/program response.",
      markingPoints: ["Overview (4 marks)", "Python / System application (4 marks)"],
      rubric: {
        maxMarks: 8,
        allowPartialMarks: true,
        criteria: [
          { id: "l1", label: "Core principles", marks: 4, detail: "Detailed explanation" },
          { id: "l2", label: "Python / System application", marks: 4, detail: "Working example" },
        ],
      },
    });
  }

  return pool;
}

console.log("=== MATRIC MASTERY FORENSIC VERIFICATION TEST SUITE ===");

// ---------------------------------------------------------------------------
// 1. PUNJAB PECTAA AUTHORITY REGISTRY & CURRICULA (2026–27)
// ---------------------------------------------------------------------------
test("1.1 Complete PECTAA authority notification map enforces No. 1256 Masihi Taleem-11 isolation", () => {
  const expectedCodes = [
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1238.code,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1255.code,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1253.code,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1254.code,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1257.code,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1239.code,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1256.code,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1258.code,
  ];
  assert.equal(PUNJAB_AUTHORITY_REGISTRY.length, 8);
  for (const code of expectedCodes) {
    assert.ok(PUNJAB_AUTHORITY_REGISTRY.some((entry) => entry.ref.code === code));
  }

  const no1256 = PUNJAB_AUTHORITY_REGISTRY.find(
    (e) => e.ref.code === PUNJAB_NOTIFICATIONS_BY_ID.NO_1256.code
  )!;
  assert.equal(no1256.stream, "masihi_only");
  assert.equal(no1256.supersedesNotificationCode, null);
  assert.deepEqual(no1256.coveredSubjects, ["Masihi Taleem-11 ONLY"]);

  const phy11 = getCurriculumByKey("punjab", 11, "physics")!;
  assert.ok(phy11);
  assert.equal(phy11.notificationRefs[0].code, PUNJAB_NOTIFICATIONS_BY_ID.NO_1239.code);
});

test("1.2 Tarjama-tul-Quran Class 9 has full syllabus (no ALP) & decoupled zero-bank readiness", () => {
  const tarjama9 = getCurriculumByKey("punjab", 9, "tarjama-tul-quran")!;
  assert.ok(tarjama9);
  assert.equal(tarjama9.syllabusPolicy, "full_syllabus_no_alp");
  assert.equal(tarjama9.alpApplied, false);
  assert.equal(tarjama9.curriculumStatus, "verified");

  const profile = getSubjectReadinessProfile(tarjama9, RAW_QUESTION_BANK);
  assert.equal(profile.curriculumStatus, "verified");
  assert.equal(profile.bankStatus, "empty");
  assert.equal(profile.practiceAvailable, false);
  assert.ok(profile.summaryBadge.includes("Full Syllabus"));
});

test("1.3 Biology Class 10 reports verified curriculum separately from empty question bank", () => {
  const bio10 = getCurriculumByKey("punjab", 10, "biology")!;
  assert.ok(bio10);
  assert.equal(bio10.curriculumStatus, "verified");
  assert.equal(bio10.syllabusPolicy, "reduced_alp_active");
  assert.equal(bio10.theoryMarks, 60);
  assert.equal(bio10.practicalMarks, 30);
  assert.equal(bio10.notificationRefs[0].code, PUNJAB_NOTIFICATIONS_BY_ID.NO_1257.code);

  const profile = getSubjectReadinessProfile(bio10, RAW_QUESTION_BANK);
  assert.equal(profile.curriculumStatus, "verified");
  assert.equal(profile.bankStatus, "empty");
  assert.equal(profile.practiceAvailable, false);
});

test("1.4 CS & Entrepreneurship Class 9 (No. 1255) excludes complete Unit 2 Number Systems", () => {
  const cs9 = getCurriculumByKey("punjab", 9, "computer-science")!;
  assert.ok(cs9);
  assert.equal(cs9.notificationRefs[0].code, PUNJAB_NOTIFICATIONS_BY_ID.NO_1255.code);
  const unit2 = cs9.chapters.find((c) => c.id === "pb-9-cs-u2")!;
  assert.equal(unit2.isFullyExcluded, true);
  assert.equal(getEligibleChapters(cs9).length, 8);

  const exclItem = RAW_QUESTION_BANK.find((q) => q.id === "pb9-cs-excl-u2-01")!;
  assert.equal(resolveQuestionSyllabusEligibility(exclItem).eligible, false);
});

test("1.5 CS & Entrepreneurship Class 10 (No. 1257) matches authentic 8-unit Python/OS/AI syllabus", () => {
  const cs10 = getCurriculumByKey("punjab", 10, "computer-science")!;
  assert.ok(cs10);
  assert.equal(cs10.chapters.length, 8);
  assert.equal(cs10.chapters[1].id, "pb-10-cs-u2");
  assert.equal(cs10.chapters[1].isFullyExcluded, true);
  assert.ok(cs10.chapters[2].title.includes("Python"));
  assert.ok(cs10.chapters[7].title.includes("Digital Entrepreneurship"));
  assert.equal(getEligibleChapters(cs10).length, 7);
});

// ---------------------------------------------------------------------------
// 2. FBISE INCLUSIVE SCHEME 2024 & BILINGUAL RULE
// ---------------------------------------------------------------------------
test("2.1 FBISE active framework uses Inclusive Scheme 2024 (1200m) and excludes legacy 2006", () => {
  assert.equal(FBISE_SCHEME_VERSION, "fbise-inclusive-2024");
  assert.ok(FBISE_LEGACY_EXCLUDED_VERSIONS.includes("fbise-scheme-2006"));
  const phy9 = getCurriculumByKey("fbise", 9, "physics")!;
  assert.ok(phy9.fbiseSchemeMeta);
  assert.equal(phy9.fbiseSchemeMeta.totalSchemeMarks, 1200);
  assert.ok(phy9.fbiseSchemeMeta.schemeName.includes("Inclusive Scheme of Studies 2024"));
});

test("2.2 FBISE Notification 1-1/FBISE/RES/2026/370 bilingual rule applies SSC only, not HSSC", () => {
  const sscPhy = getCurriculumByKey("fbise", 9, "physics")!;
  const sscMath = getCurriculumByKey("fbise", 10, "mathematics")!;
  const hsscPhy = getCurriculumByKey("fbise", 11, "physics")!;
  const hsscMath = getCurriculumByKey("fbise", 12, "mathematics")!;

  assert.equal(sscPhy.fbiseSchemeMeta?.bilingualPolicy.applies, true);
  assert.equal(sscPhy.fbiseSchemeMeta?.bilingualPolicy.notificationCode, "1-1/FBISE/RES/2026/370");
  assert.equal(sscMath.fbiseSchemeMeta?.bilingualPolicy.applies, true);
  assert.equal(hsscPhy.fbiseSchemeMeta?.bilingualPolicy.applies, false);
  assert.equal(hsscMath.fbiseSchemeMeta?.bilingualPolicy.applies, false);
});

test("2.3 Stale curriculum versions (fbise-scheme-2006, old-2023) fail compatibility strictly", () => {
  const fbOld = validateCurriculumCompatibility({
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    curriculumVersion: "fbise-scheme-2006",
  });
  assert.equal(fbOld.ok, false);

  const pbOld = validateCurriculumCompatibility({
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    curriculumVersion: "pctb-c-2020-legacy",
  });
  assert.equal(pbOld.ok, false);
});

// ---------------------------------------------------------------------------
// 3. BANK INTEGRITY, QUARANTINE & VALIDATOR GATES
// ---------------------------------------------------------------------------
test("3.1 All 40 legacy C-language items in punjab-ssc-cs.ts are Outdated & excluded from live bank", () => {
  assert.equal(PUNJAB_SSC_CS_QUESTIONS.length, 40);
  for (const legacy of PUNJAB_SSC_CS_QUESTIONS) {
    assert.equal(legacy.validationStatus, "Outdated");
    assert.equal(legacy.reviewMetadata.checklistPassed, false);
    assert.equal(resolveQuestionSyllabusEligibility(legacy).eligible, false);
  }

  const cs10Prac = generatePracticePaper({
    mode: "custom_test",
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    requestedCount: 50,
    isTimed: false,
    durationMinutes: 0,
  });
  assert.equal(cs10Prac.ok, true);
  if (cs10Prac.ok) {
    assert.equal(cs10Prac.paper.slots.length, 18); // Only 18 Python/OS/AI eligible items
    for (const slot of cs10Prac.paper.slots) {
      assert.ok(!slot.questionId.startsWith("pb10-cs-mcq-")); // No legacy C IDs
      assert.equal(cs10Prac.paper.questionsById[slot.questionId].curriculumVersion, PUNJAB_CURRICULUM_VERSION_2026_27);
    }
  }
});

test("3.2 Verified eligible bank passes integrity with zero duplicate IDs or duplicate prompts", () => {
  const seenIds = new Set<string>();
  const promptsBySubject = new Map<string, Set<string>>();

  for (const q of RAW_QUESTION_BANK) {
    assert.equal(seenIds.has(q.id), false, `Duplicate ID: ${q.id}`);
    seenIds.add(q.id);
    if (q.validationStatus === "Verified" && q.eligibilityStatus === "eligible") {
      const check = validateQuestionIntegrity(q);
      assert.equal(check.valid, true, `${q.id}: ${check.errors.join(", ")}`);
      const subjKey = `${q.system}:${q.grade}:${q.subjectId}`;
      const set = promptsBySubject.get(subjKey) ?? new Set<string>();
      const norm = normalizePromptForDedup(q.prompt);
      assert.equal(set.has(norm), false, `Duplicate normalized prompt in ${subjKey}: ${q.id}`);
      set.add(norm);
      promptsBySubject.set(subjKey, set);
    }
  }
});

test("3.3 Validator enforces strict Verified gate, finite numerics, and valid FBISE SLO ID", () => {
  const baseFb = RAW_QUESTION_BANK.find((q) => q.system === "fbise" && q.type === "single_mcq")!;
  const provisionalCheck = validateQuestionIntegrity({
    ...baseFb,
    validationStatus: "Provisional",
  });
  assert.equal(provisionalCheck.valid, false);

  const badSloCheck = validateQuestionIntegrity({
    ...baseFb,
    sloId: "non-existent-slo-id",
  });
  assert.equal(badSloCheck.valid, false);

  const baseNum = RAW_QUESTION_BANK.find((q) => q.type === "numerical")!;
  assert.ok(baseNum && baseNum.type === "numerical");
  const infNumCheck = validateQuestionIntegrity({
    ...baseNum,
    numericAnswer: Number.POSITIVE_INFINITY,
  });
  assert.equal(infNumCheck.valid, false);
});

test("3.4 Partial ALP exclusions keep Physics 9 Ch. 3 active while blocking deleted Banking of Roads & drafts", () => {
  const phy9 = getCurriculumByKey("punjab", 9, "physics")!;
  const ch3 = getEligibleChapters(phy9).find((c) => c.id === "pb-9-phy-ch3")!;
  assert.ok(ch3);
  const topics = getEligibleTopicsForChapter(ch3);
  assert.ok(topics.some((t) => t.id === "pb-9-phy-ch3-t1"));
  assert.ok(!topics.some((t) => t.id === "pb-9-phy-ch3-t3"));

  const draft = RAW_QUESTION_BANK.find((q) => q.id === "pb10-chem-draft-01")!;
  const chemEligible = filterEligibleQuestions([draft], {
    system: "punjab",
    grade: 10,
    subjectId: "chemistry",
  });
  assert.equal(chemEligible.length, 0);
});

test("3.5 lib/question-bank.ts compatibility adapter reflects 2026–27 Computer Science units", () => {
  const cs = SUBJECTS_CONFIG.find((s) => s.name === "Computer Science")!;
  assert.ok(cs);
  assert.ok(cs.chapters["Class 9"].some((c) => c.includes("Computational Thinking")));
  assert.ok(!cs.chapters["Class 10"].some((c) => c.includes("C Language")));
  assert.ok(cs.chapters["Class 10"].some((c) => c.includes("Introduction to Python")));
});

// ---------------------------------------------------------------------------
// 4. BLUEPRINTS, VALIDATION & DETERMINISTIC PAPER GENERATION
// ---------------------------------------------------------------------------
test("4.1 All registered blueprints reconcile marks and reference only active non-excluded chapters", () => {
  for (const bp of PAPER_BLUEPRINTS) {
    const status = validateBlueprintAndPool(bp, RAW_QUESTION_BANK);
    assert.equal(
      status.isValidBlueprint,
      true,
      `${bp.id}: ${status.issues.map((i) => i.message).join("; ")}`
    );
  }
});

test("4.2 Blueprint validator rejects invalid duration, mark mismatches, excluded chapters & bad quotas", () => {
  const cs10Bp = getBlueprintForSubject("punjab", 10, "computer-science")!;
  const brokenBp: PaperBlueprint = {
    ...cs10Bp,
    id: "bp-broken-audit",
    durationMinutes: 0,
    totalMarks: 99,
    sections: cs10Bp.sections.map((sec, idx) =>
      idx === 0
        ? {
            ...sec,
            choiceGroups: sec.choiceGroups.map((g) => ({
              ...g,
              allowedChapterIds: ["pb-10-cs-u2"], // Excluded Unit 2
              chapterQuotas: [{ chapterId: "pb-10-cs-u2", minCount: 2, maxCount: 2 }],
            })),
          }
        : sec
    ),
  };

  const check = validateBlueprintAndPool(brokenBp, RAW_QUESTION_BANK);
  assert.equal(check.isValidBlueprint, false);
  assert.ok(check.issues.some((i) => i.code === "INVALID_DURATION"));
  assert.ok(check.issues.some((i) => i.code === "TOTAL_MARKS_MISMATCH"));
  assert.ok(check.issues.some((i) => i.code === "INVALID_CHAPTER_FILTER"));
  assert.ok(check.issues.some((i) => i.code === "EXCLUDED_CHAPTER_QUOTA"));
});

test("4.3 Punjab CS 9 & 10 honestly refuse Board Simulation when starter pool < 31 slots", () => {
  for (const g of [9, 10] as const) {
    const bp = getBlueprintForSubject("punjab", g, "computer-science")!;
    assert.equal(bp.objectiveTimeMinutes, 15);
    assert.equal(bp.subjectiveTimeMinutes, 105);
    const res = generateBoardSimulationPaper({
      system: "punjab",
      grade: g,
      subjectId: "computer-science",
    });
    assert.equal(res.ok, false);
  }
});

test("4.4 FBISE Class 9 Physics simulation generates exact 65m, 180m, 30 unique slots deterministically", () => {
  const g1 = generateBoardSimulationPaper({
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    seed: "fb-phy-det-1",
  });
  const g2 = generateBoardSimulationPaper({
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    seed: "fb-phy-det-1",
  });
  assert.equal(g1.ok, true);
  assert.equal(g2.ok, true);
  if (g1.ok && g2.ok) {
    assert.equal(g1.paper.totalMarks, 65);
    assert.equal(g1.paper.durationMinutes, 180);
    assert.equal(g1.paper.allowPause, false);
    assert.equal(g1.paper.slots.length, 30);
    assert.equal(new Set(g1.paper.slots.map((s) => s.questionId)).size, 30);
    assert.deepEqual(
      g1.paper.slots.map((s) => s.questionId),
      g2.paper.slots.map((s) => s.questionId)
    );
  }
});

test("4.5 Full synthetic 31-slot CS 10 pool generates exact 50-mark blueprint without duplicates", () => {
  const bp10 = getBlueprintForSubject("punjab", 10, "computer-science")!;
  const syntheticBank = buildSyntheticCs10FullPool();
  const sim = generateBoardSimulationPaper({
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    blueprintOverride: bp10,
    questionBank: syntheticBank,
    seed: "syn-cs10-seed",
  });
  assert.equal(sim.ok, true);
  if (sim.ok) {
    assert.equal(sim.paper.totalMarks, 50);
    assert.equal(sim.paper.slots.length, 31);
    assert.equal(new Set(sim.paper.slots.map((s) => s.questionId)).size, 31);
  }
});

// ---------------------------------------------------------------------------
// 5. ALL 12 QUESTION TYPES & PARSER / NUMERIC TOLERANCE TESTS
// ---------------------------------------------------------------------------
test("5.1–5.7 Auto-graded objective types: single_mcq, multi_select, true_false, fill_blank, matching, classification, diagram", () => {
  const single = RAW_QUESTION_BANK.find((q) => q.type === "single_mcq")!;
  assert.ok(single && single.type === "single_mcq");
  assert.equal(
    evaluateSingleItem({
      question: single,
      response: { kind: "single_mcq", selectedCanonicalIndex: single.correctIndex },
    }).status,
    "correct"
  );

  const multi = RAW_QUESTION_BANK.find((q) => q.type === "multi_select")!;
  assert.ok(multi && multi.type === "multi_select");
  assert.equal(
    evaluateSingleItem({
      question: multi,
      response: { kind: "multi_select", selectedCanonicalIndices: multi.correctIndices },
    }).status,
    "correct"
  );

  const tf = RAW_QUESTION_BANK.find((q) => q.type === "true_false")!;
  assert.ok(tf && tf.type === "true_false");
  assert.equal(
    evaluateSingleItem({
      question: tf,
      response: { kind: "true_false", value: tf.correctBoolean },
    }).status,
    "correct"
  );

  const fillBase = RAW_QUESTION_BANK.find((q) => q.type === "fill_blank" && q.caseSensitive)!;
  assert.ok(fillBase && fillBase.type === "fill_blank");
  const fillCase = { ...fillBase, acceptedAnswers: ["Python"], caseSensitive: true };
  assert.equal(
    evaluateSingleItem({
      question: fillCase,
      response: { kind: "fill_blank", text: "python" },
    }).status,
    "incorrect"
  );
  assert.equal(
    evaluateSingleItem({
      question: fillCase,
      response: { kind: "fill_blank", text: "Python" },
    }).status,
    "correct"
  );

  const fillInsens = RAW_QUESTION_BANK.find((q) => q.type === "fill_blank" && !q.caseSensitive)!;
  assert.ok(fillInsens && fillInsens.type === "fill_blank");
  assert.equal(
    evaluateSingleItem({
      question: fillInsens,
      response: { kind: "fill_blank", text: `  ${fillInsens.acceptedAnswers[0].toUpperCase()} . ` },
    }).status,
    "correct"
  );

  const matchQ = RAW_QUESTION_BANK.find((q) => q.type === "matching")!;
  assert.ok(matchQ && matchQ.type === "matching");
  const partialMatch = evaluateSingleItem({
    question: matchQ,
    response: { kind: "matching", matches: { [matchQ.pairs[0].id]: matchQ.pairs[0].right } },
  });
  assert.equal(partialMatch.status, "partial");

  const classQ = RAW_QUESTION_BANK.find((q) => q.type === "classification")!;
  assert.ok(classQ && classQ.type === "classification");
  const fullAssign = Object.fromEntries(classQ.items.map((i) => [i.id, i.correctCategory]));
  assert.equal(
    evaluateSingleItem({
      question: classQ,
      response: { kind: "classification", assignments: fullAssign },
    }).status,
    "correct"
  );

  const diagQ = RAW_QUESTION_BANK.find((q) => q.id === "pb9-cs-diag-01")!;
  assert.ok(diagQ && diagQ.type === "diagram_labeling");
  const diagLabels = Object.fromEntries(diagQ.pins.map((p) => [p.id, p.correctLabel]));
  assert.equal(
    evaluateSingleItem({
      question: diagQ,
      response: { kind: "diagram_labeling", labelsByPinId: diagLabels },
    }).status,
    "correct"
  );
});

test("5.8 Numerical parser handles scientific notation, fractions, IEEE-754 boundaries & rejects NaN/Infinity", () => {
  const sci = parseNumericInput("1.6×10^-19");
  assert.ok(sci !== null && Math.abs(sci - 1.6e-19) < 1e-30);
  assert.equal(parseNumericInput("2 x 10^(3)"), 2000);
  assert.equal(parseNumericInput("3/4"), 0.75);
  assert.equal(parseNumericInput("NaN"), null);
  assert.equal(parseNumericInput("Infinity"), null);
  assert.equal(parseNumericInput("1/0"), null);

  // IEEE-754 boundary check: 0.2 + 0.1 = 0.30000000000000004 within tolerance + FLOAT_EPSILON
  const numQ = RAW_QUESTION_BANK.find((q) => q.type === "numerical" && q.valueMarks && q.unitMarks)!;
  assert.ok(numQ && numQ.type === "numerical");
  const ieeeTestQ: typeof numQ = {
    ...numQ,
    numericAnswer: 0.3,
    tolerance: 0,
    requiredUnit: "A",
    acceptedUnits: ["a", "ampere"],
  };
  const ieeeOk = evaluateSingleItem({
    question: ieeeTestQ,
    response: { kind: "numerical", valueText: String(0.2 + 0.1), unitText: "A" },
  });
  assert.equal(ieeeOk.status, "correct");
});

test("5.9 Structured multi-part handles pure-auto numerical parts vs subjective pending parts", () => {
  const structQ = RAW_QUESTION_BANK.find((q) => q.type === "structured_multi_part")!;
  assert.ok(structQ && structQ.type === "structured_multi_part");
  const allAutoQ: typeof structQ = {
    ...structQ,
    subParts: structQ.subParts.map((sp) =>
      sp.kind === "short_answer"
        ? { ...sp, kind: "fill_blank", acceptedAnswers: ["equilibrium"] }
        : sp
    ),
  };
  assert.equal(
    evaluateSingleItem({
      question: allAutoQ,
      response: { kind: "structured_multi_part", parts: {} },
    }).status,
    "unanswered"
  );
  const autoResp: Record<string, { text: string; unitText?: string }> = {};
  for (const sp of allAutoQ.subParts) {
    autoResp[sp.id] =
      sp.kind === "numerical"
        ? { text: String(sp.numericAnswer), unitText: sp.acceptedUnits?.[0] }
        : { text: "equilibrium" };
  }
  assert.equal(
    evaluateSingleItem({
      question: allAutoQ,
      response: { kind: "structured_multi_part", parts: autoResp },
    }).status,
    "correct"
  );
});

test("5.10 Subjective proof_derivation & extended_response stay pending_review with zero synthetic marks", () => {
  const proofQ = RAW_QUESTION_BANK.find((q) => q.type === "proof_derivation")!;
  const res = evaluateSingleItem({
    question: proofQ,
    response: { kind: "text_response", text: "v_f = v_i + at derivation steps" },
  });
  assert.equal(res.status, "pending_review");
  assert.equal(res.awardedMarks, null);
});

// ---------------------------------------------------------------------------
// 6. CHOICE OVERFLOW (PAPER ORDER) & SCORE SEPARATION
// ---------------------------------------------------------------------------
test("6.1–6.3 Paper-slot-order choice overflow & strict isolation of self-review from objective scores", () => {
  const bp10 = getBlueprintForSubject("punjab", 10, "computer-science")!;
  const syntheticBank = buildSyntheticCs10FullPool();
  const sim = generateBoardSimulationPaper({
    system: "punjab",
    grade: 10,
    subjectId: "computer-science",
    blueprintOverride: bp10,
    questionBank: syntheticBank,
    seed: "seed-overflow-isolation",
  });
  assert.equal(sim.ok, true);
  if (!sim.ok) return;

  let att = startNewAttempt(sim.paper, 1_000_000);

  // Answer first 5 MCQs accurately, 5 wrong -> 5/10 auto-verified marks (50%)
  const mcqGroup = sim.paper.sections[0].choiceGroups[0];
  mcqGroup.slotIds.forEach((sId, idx) => {
    att = saveAttemptResponse(att, sId, {
      kind: "single_mcq",
      selectedCanonicalIndex: idx < 5 ? 0 : 1,
    });
  });

  // Attempt all 6 short slots in Q2 (limit 4) -> slots 5 & 6 MUST become not_counted_choice in paper order
  const q2Group = sim.paper.sections[1].choiceGroups[0];
  q2Group.slotIds.forEach((sId) => {
    att = saveAttemptResponse(att, sId, { kind: "text_response", text: "Student response" });
  });

  const submitted = submitAttempt(att, "manual", 1_060_000);
  const sc1 = submitted.scoring!;
  assert.equal(sc1.autoVerifiedObtainedMarks, 5);
  assert.equal(sc1.autoVerifiedMaxMarks, 10);
  assert.equal(sc1.autoVerifiedAccuracy, 50);
  assert.equal(sc1.notCountedChoiceCount, 2);

  // Slots 5 & 6 in Q2 group must be the overflow ones
  const r5 = sc1.itemResults.find((r) => r.slotId === q2Group.slotIds[4])!;
  const r6 = sc1.itemResults.find((r) => r.slotId === q2Group.slotIds[5])!;
  assert.equal(r5.status, "not_counted_choice");
  assert.equal(r6.status, "not_counted_choice");

  // Apply self-review on counted short slot 1 -> updates selfAssessed & indicativeCombined, NEVER autoVerified
  const firstShortSlot = q2Group.slotIds[0];
  const reviewed = applySubjectiveSelfReview(submitted, firstShortSlot, ["c1", "c2"], 1_070_000);
  const sc2 = reviewed.scoring!;
  assert.equal(sc2.selfAssessedObtainedMarks, 2);
  assert.equal(sc2.indicativeCombinedMarks, 7);
  assert.equal(sc2.hasMixedSelfAssessment, true);

  // Auto-verified invariants strictly unchanged
  assert.equal(sc2.autoVerifiedObtainedMarks, sc1.autoVerifiedObtainedMarks);
  assert.equal(sc2.autoVerifiedMaxMarks, sc1.autoVerifiedMaxMarks);
  assert.equal(sc2.autoVerifiedAccuracy, sc1.autoVerifiedAccuracy);
  assert.deepEqual(sc2.objectiveTopicBreakdown, sc1.objectiveTopicBreakdown);
});

// ---------------------------------------------------------------------------
// 7. ATTEMPT IMMUTABILITY, MIGRATION v2->v3 & ANTI-FLUKE ANALYTICS
// ---------------------------------------------------------------------------
test("7.1–7.2 Pause rules, terminal immutability & snapshot isolation protect active & completed attempts", () => {
  const sim = generateBoardSimulationPaper({
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    seed: "seed-immut",
  });
  assert.equal(sim.ok, true);
  if (!sim.ok) return;

  let att = startNewAttempt(sim.paper, 2_000_000);
  assert.equal(pauseAttempt(att, 2_010_000).status, "in_progress");

  const firstSlot = sim.paper.slots[0];
  att = saveAttemptResponse(att, firstSlot.slotId, {
    kind: "single_mcq",
    selectedCanonicalIndex: 3,
  });

  const completed = submitAttempt(att, "manual", 2_050_000);
  assert.equal(completed.status, "completed");

  // Mutating completed attempt via save/pause/resume/resubmit must be no-op
  const afterSave = saveAttemptResponse(completed, firstSlot.slotId, {
    kind: "single_mcq",
    selectedCanonicalIndex: 0,
  });
  assert.equal(afterSave, completed);
  assert.equal(pauseAttempt(completed, 2_060_000), completed);
  assert.equal(resumeAttempt(completed, 2_060_000), completed);
  assert.equal(submitAttempt(completed, "manual", 2_070_000), completed);

  const mistakes = extractMistakesFromAttempt(completed);
  if (mistakes.length > 0) {
    assert.ok(mistakes[0].promptSnapshot && mistakes[0].promptSnapshot.length > 0);
    assert.equal(mistakes[0].curriculumVersion, FBISE_SCHEME_VERSION);
  }

  // Practice timed pause/resume clock accuracy
  const prac = generatePracticePaper({
    mode: "quick_test",
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    requestedCount: 4,
    isTimed: true,
    durationMinutes: 10,
  });
  assert.equal(prac.ok, true);
  if (prac.ok) {
    let p = startNewAttempt(prac.paper, 5_000_000);
    p = pauseAttempt(p, 5_060_000);
    assert.equal(getRemainingSeconds(p, 5_900_000), 540);
    p = resumeAttempt(p, 6_000_000);
    assert.equal(getRemainingSeconds(p, 6_000_000), 540);
  }
});

test("7.3 Storage v2->v3 non-destructive migration & corrupt JSON safe recovery", () => {
  const sim = generateBoardSimulationPaper({
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    seed: "seed-mig",
  });
  assert.equal(sim.ok, true);
  if (!sim.ok) return;

  const done = submitAttempt(startNewAttempt(sim.paper, 1000), "manual", 2000);
  // Strip v3 fields to simulate a legacy v2 record
  const legacyScoring = { ...done.scoring } as Record<string, unknown>;
  delete legacyScoring.autoVerifiedObtainedMarks;
  delete legacyScoring.objectiveTopicBreakdown;

  const legacyV2Json = JSON.stringify({
    schemaVersion: 2,
    activeAttempt: null,
    attemptHistory: [{ ...done, scoring: legacyScoring }],
    mistakeNotebook: [],
  });

  const migrated = parseAndMigrateStoreJson(legacyV2Json);
  assert.equal(migrated.migratedOrReset, true);
  assert.equal(migrated.store.schemaVersion, 3);
  assert.equal(migrated.store.attemptHistory.length, 1);
  assert.equal(typeof migrated.store.attemptHistory[0].scoring?.autoVerifiedObtainedMarks, "number");
  assert.ok(Array.isArray(migrated.store.attemptHistory[0].scoring?.objectiveTopicBreakdown));

  const corrupt = parseAndMigrateStoreJson("{broken-json!!!");
  assert.equal(corrupt.migratedOrReset, true);
  assert.equal(corrupt.store.schemaVersion, 3);
  assert.equal(corrupt.store.attemptHistory.length, 0);
});

test("7.4–7.5 Analytics enforces <3 Q anti-fluke tier & excludes self-reviewed marks from objective metrics", () => {
  const sim = generateBoardSimulationPaper({
    system: "fbise",
    grade: 9,
    subjectId: "physics",
    seed: "seed-analytics-strict",
  });
  assert.equal(sim.ok, true);
  if (!sim.ok) return;

  let att = startNewAttempt(sim.paper, 10_000_000);
  // Leave all MCQs wrong except 0 -> 0% auto-verified objective; give self-review 100% on a long question
  const mcqSlots = sim.paper.slots.filter((s) => sim.paper.questionsById[s.questionId].type === "single_mcq");
  mcqSlots.forEach((s) => {
    const q = sim.paper.questionsById[s.questionId];
    if (q.type === "single_mcq") {
      att = saveAttemptResponse(att, s.slotId, {
        kind: "single_mcq",
        selectedCanonicalIndex: (q.correctIndex + 1) % q.options.length,
      });
    }
  });
  const longSlot = sim.paper.slots.find((s) => sim.paper.questionsById[s.questionId].type === "extended_response")!;
  att = saveAttemptResponse(att, longSlot.slotId, { kind: "text_response", text: "Full derivation" });

  let done = submitAttempt(att, "manual", 10_050_000);
  const longQ = sim.paper.questionsById[longSlot.questionId];
  done = applySubjectiveSelfReview(
    done,
    longSlot.slotId,
    (longQ.rubric?.criteria ?? []).map((c) => c.id),
    10_060_000
  );

  const overview = computeAnalyticsOverview([done], []);
  assert.equal(overview.objectiveAveragePercentage, 0);
  assert.ok(overview.averagePercentage > 0);

  // Anti-fluke: weakTopics & strongTopics must ONLY contain topics with >= 3 objective items
  for (const wt of overview.weakTopics) {
    assert.ok(wt.totalQuestions >= 3);
    assert.equal(wt.confidenceTier, "Repeated difficulty observed");
  }
  for (const es of overview.earlySignalTopics) {
    assert.ok(es.totalQuestions < 3);
    assert.equal(es.confidenceTier, "Early signal — needs more data");
  }
  for (const st of overview.strongTopics) {
    assert.ok(st.totalQuestions >= 3);
    assert.equal(st.confidenceTier, "Reliable strength observed");
  }
});

console.log(`\n=== COMPLETED: ${passed} VERIFICATION TESTS PASSED ===`);
