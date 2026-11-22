import { ExamSystem, GradeLevel, PaperBlueprint } from "@/lib/mock-tests/types";
import { PUNJAB_CURRICULUM_VERSION_2026_27 } from "@/lib/mock-tests/curriculum/punjab/session-2026-27";
import { FBISE_SCHEME_VERSION } from "@/lib/mock-tests/curriculum/fbise/scheme-2024";

/**
 * OFFICIAL SUBJECT-BY-SUBJECT BLUEPRINT REGISTRY
 * Strictly enforces independent marks, durations, section counts, and choice groups
 * for Punjab Boards (PECTAA 2026–27) and FBISE (SLO Scheme).
 * All blueprint section attempt sums reconcile exactly to `totalMarks`.
 */
export const PAPER_BLUEPRINTS: PaperBlueprint[] = [
  // =========================================================================
  // 1. PUNJAB CLASS 10 COMPUTER SCIENCE & ENTREPRENEURSHIP (50 MARKS, 2H)
  // =========================================================================
  {
    id: "bp-pb-10-cs-2026-27",
    system: "punjab",
    boardScope: "All 9 Punjab BISEs (PECTAA No. 1257)",
    grade: 10,
    subjectId: "computer-science",
    subjectName: "Computer Science & Entrepreneurship",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    blueprintVersion: "pectaa-1257-2027.1",
    sourceDocumentRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
    durationMinutes: 120,
    totalMarks: 50,
    passingPercentage: 40,
    objectiveMarks: 10,
    subjectiveMarks: 40,
    questionOrderRule: "fixed_sections_with_group_shuffle",
    verifiedForSimulation: true,
    sections: [
      {
        id: "sec-a",
        code: "Section A (Part I)",
        title: "Objective Type — MCQs",
        category: "objective",
        instructions: "Attempt all 10 compulsory multiple-choice questions (1 mark each).",
        recommendedMinutes: 15,
        choiceGroups: [
          {
            id: "cg-q1",
            title: "Q1. Multiple Choice Questions (Attempt All 10)",
            totalQuestions: 10,
            requiredAttemptCount: 10,
            marksPerQuestion: 1,
            allowedTypes: ["single_mcq"],
            chapterQuotas: [
              { chapterId: "pb-10-cs-ch1", minCount: 2, maxCount: 3 },
              { chapterId: "pb-10-cs-ch2", minCount: 2, maxCount: 3 },
              { chapterId: "pb-10-cs-ch3", minCount: 2, maxCount: 2 },
              { chapterId: "pb-10-cs-ch4", minCount: 2, maxCount: 2 },
              { chapterId: "pb-10-cs-ch5", minCount: 2, maxCount: 2 },
            ],
          },
        ],
      },
      {
        id: "sec-b",
        code: "Section B (Part II)",
        title: "Short Questions (Q2, Q3, Q4)",
        category: "subjective_short",
        instructions: "Attempt any FOUR (4) short questions from each group Q2, Q3, and Q4 (2 marks each = 24 marks total).",
        recommendedMinutes: 55,
        choiceGroups: [
          {
            id: "cg-q2",
            title: "Q2. Chapters 1 & 2 — Attempt any 4 out of 6",
            totalQuestions: 6,
            requiredAttemptCount: 4,
            marksPerQuestion: 2,
            allowedTypes: ["short_answer"],
            allowedChapterIds: ["pb-10-cs-ch1", "pb-10-cs-ch2"],
          },
          {
            id: "cg-q3",
            title: "Q3. Chapters 3 & 4 — Attempt any 4 out of 6",
            totalQuestions: 6,
            requiredAttemptCount: 4,
            marksPerQuestion: 2,
            allowedTypes: ["short_answer"],
            allowedChapterIds: ["pb-10-cs-ch3", "pb-10-cs-ch4"],
          },
          {
            id: "cg-q4",
            title: "Q4. Chapters 4 & 5 — Attempt any 4 out of 6",
            totalQuestions: 6,
            requiredAttemptCount: 4,
            marksPerQuestion: 2,
            allowedTypes: ["short_answer"],
            allowedChapterIds: ["pb-10-cs-ch4", "pb-10-cs-ch5"],
          },
        ],
      },
      {
        id: "sec-c",
        code: "Section C (Part III)",
        title: "Extended / Long Questions",
        category: "subjective_long",
        instructions: "Attempt any TWO (2) out of THREE (3) long questions (8 marks each = 16 marks).",
        recommendedMinutes: 50,
        choiceGroups: [
          {
            id: "cg-long",
            title: "Long Questions (Q5–Q7) — Attempt any 2 out of 3",
            totalQuestions: 3,
            requiredAttemptCount: 2,
            marksPerQuestion: 8,
            allowedTypes: ["extended_response"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 2. FBISE SSC-I (CLASS 9) PHYSICS (65 MARKS, 3H — SLO SCHEME)
  // =========================================================================
  {
    id: "bp-fb-9-physics-slo-2024",
    system: "fbise",
    boardScope: "FBISE Islamabad (SSC-I SLO Model Scheme)",
    grade: 9,
    subjectId: "physics",
    subjectName: "Physics",
    session: "FBISE 2026–27 SLO Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    blueprintVersion: "fbise-ssc1-phy-2024.1",
    sourceDocumentRef: "FBISE SSC-I Physics Model Paper & SLO Table of Specifications",
    sourceUrl: "https://www.fbise.edu.pk/curriculum_model_paper.php",
    durationMinutes: 180,
    totalMarks: 65,
    passingPercentage: 40,
    objectiveMarks: 12,
    subjectiveMarks: 53,
    questionOrderRule: "fixed_sections_with_group_shuffle",
    verifiedForSimulation: true,
    sections: [
      {
        id: "sec-a",
        code: "Section A",
        title: "Objective — SLO MCQs (12 Marks)",
        category: "objective",
        instructions: "Attempt all 12 compulsory SLO-mapped MCQs (1 mark each).",
        recommendedMinutes: 20,
        choiceGroups: [
          {
            id: "cg-fb-a",
            title: "Q1. Compulsory MCQs (12 Items)",
            totalQuestions: 12,
            requiredAttemptCount: 12,
            marksPerQuestion: 1,
            allowedTypes: ["single_mcq"],
            chapterQuotas: [
              { chapterId: "fb-9-phy-u1", minCount: 3, maxCount: 4 },
              { chapterId: "fb-9-phy-u2", minCount: 3, maxCount: 4 },
              { chapterId: "fb-9-phy-u3", minCount: 2, maxCount: 3 },
              { chapterId: "fb-9-phy-u4", minCount: 2, maxCount: 3 },
            ],
          },
        ],
      },
      {
        id: "sec-b",
        code: "Section B",
        title: "Short Response Questions & Numericals (33 Marks)",
        category: "subjective_short",
        instructions: "Attempt any ELEVEN (11) parts out of FIFTEEN (15) parts (3 marks each = 33 marks).",
        recommendedMinutes: 85,
        choiceGroups: [
          {
            id: "cg-fb-b",
            title: "Q2. Short SLO Concepts & Numericals — Attempt any 11 out of 15",
            totalQuestions: 15,
            requiredAttemptCount: 11,
            marksPerQuestion: 3,
            allowedTypes: ["short_answer", "numerical"],
          },
        ],
      },
      {
        id: "sec-c",
        code: "Section C",
        title: "Extended / Structured SLO Questions (20 Marks)",
        category: "subjective_long",
        instructions: "Attempt any TWO (2) out of THREE (3) long structured questions (10 marks each = 20 marks).",
        recommendedMinutes: 75,
        choiceGroups: [
          {
            id: "cg-fb-c",
            title: "Long Structured Questions (Q3–Q5) — Attempt any 2 out of 3",
            totalQuestions: 3,
            requiredAttemptCount: 2,
            marksPerQuestion: 10,
            allowedTypes: ["proof_derivation", "extended_response", "structured_multi_part"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 3. OTHER VERIFIED BOARD BLUEPRINTS (HONESTLY CATALOGUED; PARTIAL POOL)
  // =========================================================================
  {
    id: "bp-pb-9-physics-2026-27",
    system: "punjab",
    boardScope: "All 9 Punjab BISEs (PECTAA No. 1238)",
    grade: 9,
    subjectId: "physics",
    subjectName: "Physics",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    blueprintVersion: "pectaa-1238-2027.1",
    sourceDocumentRef: "PECTAA/C&C Unit/2026/1238 (6 Nov 2026)",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
    durationMinutes: 120,
    totalMarks: 60,
    passingPercentage: 40,
    objectiveMarks: 12,
    subjectiveMarks: 48,
    questionOrderRule: "fixed_sections_with_group_shuffle",
    verifiedForSimulation: true,
    availabilityNote: "Full blueprint defined (60 theory marks); full simulation unlocks once all 39 required items are populated.",
    sections: [
      {
        id: "sec-a",
        code: "Section I",
        title: "Objective Type — 12 MCQs",
        category: "objective",
        instructions: "Attempt all 12 MCQs (1 mark each).",
        choiceGroups: [
          { id: "cg-q1", title: "Q1. MCQs (12/12)", totalQuestions: 12, requiredAttemptCount: 12, marksPerQuestion: 1, allowedTypes: ["single_mcq"] },
        ],
      },
      {
        id: "sec-b",
        code: "Section II",
        title: "Short Questions (Q2, Q3, Q4)",
        category: "subjective_short",
        instructions: "Attempt 5 out of 8 short questions in each of Q2, Q3, Q4 (2 marks each = 30 marks).",
        choiceGroups: [
          { id: "cg-q2", title: "Q2. Short Questions (5/8)", totalQuestions: 8, requiredAttemptCount: 5, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
          { id: "cg-q3", title: "Q3. Short Questions (5/8)", totalQuestions: 8, requiredAttemptCount: 5, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
          { id: "cg-q4", title: "Q4. Short Questions (5/8)", totalQuestions: 8, requiredAttemptCount: 5, marksPerQuestion: 2, allowedTypes: ["short_answer", "numerical"] },
        ],
      },
      {
        id: "sec-c",
        code: "Section III",
        title: "Long Questions (Attempt 2/3)",
        category: "subjective_long",
        instructions: "Attempt any 2 out of 3 long questions (9 marks each = 18 marks).",
        choiceGroups: [
          { id: "cg-long", title: "Long Questions (2/3)", totalQuestions: 3, requiredAttemptCount: 2, marksPerQuestion: 9, allowedTypes: ["extended_response", "proof_derivation", "structured_multi_part"] },
        ],
      },
    ],
  },
  {
    id: "bp-pb-10-math-2026-27",
    system: "punjab",
    boardScope: "All 9 Punjab BISEs (PECTAA No. 1257)",
    grade: 10,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    blueprintVersion: "pectaa-1257-math-2027.1",
    sourceDocumentRef: "PECTAA/C&C Unit/2026/1257 (14 Nov 2026)",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
    durationMinutes: 150,
    totalMarks: 75,
    passingPercentage: 40,
    objectiveMarks: 15,
    subjectiveMarks: 60,
    questionOrderRule: "fixed_sections_with_group_shuffle",
    verifiedForSimulation: true,
    availabilityNote: "75-mark blueprint (15 MCQs + 18/27 Short + Part-II 2/3 & Part-III 1/2 Long). Chapter & Quick tests open.",
    sections: [
      {
        id: "sec-a",
        code: "Section I",
        title: "Objective — 15 MCQs",
        category: "objective",
        instructions: "Attempt all 15 MCQs (1 mark each).",
        choiceGroups: [
          { id: "cg-q1", title: "Q1. MCQs (15/15)", totalQuestions: 15, requiredAttemptCount: 15, marksPerQuestion: 1, allowedTypes: ["single_mcq"] },
        ],
      },
      {
        id: "sec-b",
        code: "Section II",
        title: "Short Questions (36 Marks)",
        category: "subjective_short",
        instructions: "Attempt 6 out of 9 short questions in Q2, Q3, and Q4 (2 marks each = 36 marks).",
        choiceGroups: [
          { id: "cg-q2", title: "Q2 (6/9)", totalQuestions: 9, requiredAttemptCount: 6, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
          { id: "cg-q3", title: "Q3 (6/9)", totalQuestions: 9, requiredAttemptCount: 6, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
          { id: "cg-q4", title: "Q4 (6/9)", totalQuestions: 9, requiredAttemptCount: 6, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
        ],
      },
      {
        id: "sec-c",
        code: "Section III",
        title: "Part-II & Part-III Long Questions (24 Marks)",
        category: "subjective_long",
        instructions: "Attempt any 2/3 in Part-II (16 marks) and 1/2 in Part-III (8 marks).",
        choiceGroups: [
          { id: "cg-p2", title: "Part-II Long (2/3)", totalQuestions: 3, requiredAttemptCount: 2, marksPerQuestion: 8, allowedTypes: ["extended_response", "structured_multi_part"] },
          { id: "cg-p3", title: "Part-III Long (1/2)", totalQuestions: 2, requiredAttemptCount: 1, marksPerQuestion: 8, allowedTypes: ["proof_derivation", "extended_response"] },
        ],
      },
    ],
  },
  {
    id: "bp-pb-11-physics-2026-27",
    system: "punjab",
    boardScope: "All 9 Punjab BISEs (PECTAA No. 1239)",
    grade: 11,
    subjectId: "physics",
    subjectName: "Physics",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    blueprintVersion: "pectaa-1239-phy11-2027.1",
    sourceDocumentRef: "PECTAA/C&C Unit/2026/1239 (6 Nov 2026)",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
    durationMinutes: 180,
    totalMarks: 85,
    passingPercentage: 40,
    objectiveMarks: 17,
    subjectiveMarks: 68,
    questionOrderRule: "fixed_sections_with_group_shuffle",
    verifiedForSimulation: true,
    availabilityNote: "HSSC-I 85-mark blueprint (17 MCQs + 22/33 Short + 3/5 Long).",
    sections: [
      {
        id: "sec-a",
        code: "Section I",
        title: "Objective — 17 MCQs",
        category: "objective",
        instructions: "Attempt all 17 MCQs (17 marks).",
        choiceGroups: [
          { id: "cg-q1", title: "Q1. MCQs (17/17)", totalQuestions: 17, requiredAttemptCount: 17, marksPerQuestion: 1, allowedTypes: ["single_mcq"] },
        ],
      },
      {
        id: "sec-b",
        code: "Section II",
        title: "Short Questions (44 Marks)",
        category: "subjective_short",
        instructions: "Attempt 8/12 in Q2, 8/12 in Q3, and 6/9 in Q4 (2 marks each).",
        choiceGroups: [
          { id: "cg-q2", title: "Q2 (8/12)", totalQuestions: 12, requiredAttemptCount: 8, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
          { id: "cg-q3", title: "Q3 (8/12)", totalQuestions: 12, requiredAttemptCount: 8, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
          { id: "cg-q4", title: "Q4 (6/9)", totalQuestions: 9, requiredAttemptCount: 6, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
        ],
      },
      {
        id: "sec-c",
        code: "Section III",
        title: "Long Questions (24 Marks)",
        category: "subjective_long",
        instructions: "Attempt any 3 out of 5 long questions (8 marks each).",
        choiceGroups: [
          { id: "cg-long", title: "Long Questions (3/5)", totalQuestions: 5, requiredAttemptCount: 3, marksPerQuestion: 8, allowedTypes: ["extended_response", "proof_derivation"] },
        ],
      },
    ],
  },
  {
    id: "bp-pb-12-math-2026-27",
    system: "punjab",
    boardScope: "All 9 Punjab BISEs (PECTAA No. 1258)",
    grade: 12,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    blueprintVersion: "pectaa-1258-math12-2027.1",
    sourceDocumentRef: "PECTAA/C&C Unit/2026/1258 (14 Nov 2026)",
    sourceUrl: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
    durationMinutes: 180,
    totalMarks: 100,
    passingPercentage: 40,
    objectiveMarks: 20,
    subjectiveMarks: 80,
    questionOrderRule: "fixed_sections_with_group_shuffle",
    verifiedForSimulation: true,
    availabilityNote: "HSSC-II 100-mark blueprint (20 MCQs + 25/37 Short + 3/5 Long).",
    sections: [
      {
        id: "sec-a",
        code: "Section I",
        title: "Objective — 20 MCQs",
        category: "objective",
        instructions: "Attempt all 20 MCQs (20 marks).",
        choiceGroups: [
          { id: "cg-q1", title: "Q1. MCQs (20/20)", totalQuestions: 20, requiredAttemptCount: 20, marksPerQuestion: 1, allowedTypes: ["single_mcq"] },
        ],
      },
      {
        id: "sec-b",
        code: "Section II",
        title: "Short Questions (50 Marks)",
        category: "subjective_short",
        instructions: "Attempt 8/12 in Q2, 8/12 in Q3, and 9/13 in Q4 (2 marks each).",
        choiceGroups: [
          { id: "cg-q2", title: "Q2 (8/12)", totalQuestions: 12, requiredAttemptCount: 8, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
          { id: "cg-q3", title: "Q3 (8/12)", totalQuestions: 12, requiredAttemptCount: 8, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
          { id: "cg-q4", title: "Q4 (9/13)", totalQuestions: 13, requiredAttemptCount: 9, marksPerQuestion: 2, allowedTypes: ["short_answer"] },
        ],
      },
      {
        id: "sec-c",
        code: "Section III",
        title: "Long Questions (30 Marks)",
        category: "subjective_long",
        instructions: "Attempt any 3 out of 5 long questions (10 marks each).",
        choiceGroups: [
          { id: "cg-long", title: "Long Questions (3/5)", totalQuestions: 5, requiredAttemptCount: 3, marksPerQuestion: 10, allowedTypes: ["extended_response", "proof_derivation"] },
        ],
      },
    ],
  },
];

export function getBlueprintForSubject(
  system: ExamSystem,
  grade: GradeLevel,
  subjectId: string
): PaperBlueprint | undefined {
  return PAPER_BLUEPRINTS.find(
    (bp) => bp.system === system && bp.grade === grade && bp.subjectId === subjectId
  );
}
