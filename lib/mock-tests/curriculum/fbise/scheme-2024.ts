import { OfficialNotificationRef, SubjectCurriculum } from "@/lib/mock-tests/types";

/**
 * FEDERAL BOARD OF INTERMEDIATE & SECONDARY EDUCATION (FBISE)
 *
 * Official Sources:
 * - https://www.fbise.edu.pk/curriculum_model_paper.php
 * - https://www.fbise.edu.pk/syllabusSSC-I.php
 * - https://www.fbise.edu.pk/syllabusSSC-II.php
 * - https://www.fbise.edu.pk/syllabusHSSC-I.php
 * - https://www.fbise.edu.pk/syllabusHSSC-II.php
 *
 * Strictly independent from Punjab Boards / PECTAA:
 * - No Punjab Smart Syllabus / ALP exclusions copied into FBISE.
 * - Uses SLO-based assessment frameworks and cognitive level mappings (Recall / Understand / Apply / Analyze).
 * - Versioned cleanly (`fbise-slo-2024`) so future curriculum updates can be added side by side.
 */

export const FBISE_SCHEME_VERSION = "fbise-slo-2024";

const FBISE_BOARD_SCOPE = "FBISE Islamabad (Federal & Overseas Institutions)";

export const FBISE_REFERENCES: Record<9 | 10 | 11 | 12, OfficialNotificationRef[]> = {
  9: [
    {
      code: "FBISE SSC-I SLO Framework",
      date: "Active 2026–27 Cycle",
      title: "FBISE SSC-I Syllabi, Tables of Specifications & Model Question Papers",
      url: "https://www.fbise.edu.pk/syllabusSSC-I.php",
    },
    {
      code: "FBISE Model Papers Portal",
      date: "Active 2026–27 Cycle",
      title: "FBISE Curriculum & Model Papers Directory",
      url: "https://www.fbise.edu.pk/curriculum_model_paper.php",
    },
  ],
  10: [
    {
      code: "FBISE SSC-II SLO Framework",
      date: "Active 2026–27 Cycle",
      title: "FBISE SSC-II Syllabi, SLO Assessments & Model Papers",
      url: "https://www.fbise.edu.pk/syllabusSSC-II.php",
    },
  ],
  11: [
    {
      code: "FBISE HSSC-I SLO Framework",
      date: "Active 2026–27 Cycle",
      title: "FBISE HSSC-I Syllabi & Model Question Papers",
      url: "https://www.fbise.edu.pk/syllabusHSSC-I.php",
    },
  ],
  12: [
    {
      code: "FBISE HSSC-II SLO Framework",
      date: "Active 2026–27 Cycle",
      title: "FBISE HSSC-II Syllabi & Model Question Papers",
      url: "https://www.fbise.edu.pk/syllabusHSSC-II.php",
    },
  ],
};

export const FBISE_CURRICULA_2024: SubjectCurriculum[] = [
  // =========================================================================
  // SSC-I (CLASS 9) — PHYSICS (FULLY STOCKED FBISE SLO SIMULATION)
  // =========================================================================
  {
    id: "fb-9-physics-slo-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 9,
    classLabel: "Class 9",
    session: "FBISE 2026–27 SLO Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    subjectId: "physics",
    subjectName: "Physics",
    variantLabel: "SSC-I Science (National Curriculum)",
    groups: ["science"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 65,
    practicalMarks: 10,
    verificationStatus: "verified",
    verificationNote:
      "Verified FBISE SSC-I Physics SLO paper scheme: 65 Theory Marks (Section A: 12 MCQs = 12m; Section B: 11/15 Short @ 3m = 33m; Section C: 2/3 Long @ 10m = 20m).",
    notificationRefs: FBISE_REFERENCES[9],
    alpApplied: false,
    slos: [
      {
        id: "slo-fb-p9-01",
        code: "SLO-P09-A1",
        statement: "Distinguish between base and derived physical quantities using SI base units and scientific prefixes.",
        cognitiveLevel: "Understand",
        chapterId: "fb-9-phy-u1",
        topicId: "fb-9-phy-u1-t1",
      },
      {
        id: "slo-fb-p9-02",
        code: "SLO-P09-A2",
        statement: "Determine least count, zero error, and corrected readings of Vernier Callipers and Screw Gauge.",
        cognitiveLevel: "Apply",
        chapterId: "fb-9-phy-u1",
        topicId: "fb-9-phy-u1-t2",
      },
      {
        id: "slo-fb-p9-03",
        code: "SLO-P09-B1",
        statement: "Analyze distance-time and speed-time graphs to compute instantaneous slope and total displacement.",
        cognitiveLevel: "Analyze",
        chapterId: "fb-9-phy-u2",
        topicId: "fb-9-phy-u2-t1",
      },
      {
        id: "slo-fb-p9-04",
        code: "SLO-P09-B2",
        statement: "Apply equations of uniformly accelerated motion to free-fall and linear motion numericals.",
        cognitiveLevel: "Apply",
        chapterId: "fb-9-phy-u2",
        topicId: "fb-9-phy-u2-t2",
      },
      {
        id: "slo-fb-p9-05",
        code: "SLO-P09-C1",
        statement: "Relate net force, mass, and rate of change of linear momentum using Newton's laws.",
        cognitiveLevel: "Apply",
        chapterId: "fb-9-phy-u3",
        topicId: "fb-9-phy-u3-t1",
      },
      {
        id: "slo-fb-p9-06",
        code: "SLO-P09-D1",
        statement: "Apply resolution of vectors and principle of moments to systems in mechanical equilibrium.",
        cognitiveLevel: "Analyze",
        chapterId: "fb-9-phy-u4",
        topicId: "fb-9-phy-u4-t1",
      },
    ],
    chapters: [
      {
        id: "fb-9-phy-u1",
        number: 1,
        title: "Unit 1: Physical Quantities and Measurement",
        isFullyExcluded: false,
        topics: [
          { id: "fb-9-phy-u1-t1", title: "SI Base/Derived Units & Scientific Prefixes", isExcluded: false, sloCodes: ["SLO-P09-A1"] },
          { id: "fb-9-phy-u1-t2", title: "Vernier Callipers, Screw Gauge & Significant Figures", isExcluded: false, sloCodes: ["SLO-P09-A2"] },
        ],
      },
      {
        id: "fb-9-phy-u2",
        number: 2,
        title: "Unit 2: Kinematics",
        isFullyExcluded: false,
        topics: [
          { id: "fb-9-phy-u2-t1", title: "Vectors, Motion Graphs & Area Under v-t Graph", isExcluded: false, sloCodes: ["SLO-P09-B1"] },
          { id: "fb-9-phy-u2-t2", title: "Uniformly Accelerated & Free-Fall Equations", isExcluded: false, sloCodes: ["SLO-P09-B2"] },
        ],
      },
      {
        id: "fb-9-phy-u3",
        number: 3,
        title: "Unit 3: Dynamics",
        isFullyExcluded: false,
        topics: [
          { id: "fb-9-phy-u3-t1", title: "Newton's Laws, Friction & Conservation of Momentum", isExcluded: false, sloCodes: ["SLO-P09-C1"] },
        ],
      },
      {
        id: "fb-9-phy-u4",
        number: 4,
        title: "Unit 4: Turning Effects of Force",
        isFullyExcluded: false,
        topics: [
          { id: "fb-9-phy-u4-t1", title: "Components of Force, Torque, Couple & Equilibrium", isExcluded: false, sloCodes: ["SLO-P09-D1"] },
        ],
      },
    ],
  },

  // =========================================================================
  // SSC-II (CLASS 10) — MATHEMATICS (FBISE SLO 75 MARKS)
  // =========================================================================
  {
    id: "fb-10-math-slo-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 10,
    classLabel: "Class 10",
    session: "FBISE 2026–27 SLO Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    variantLabel: "SSC-II Science Group",
    groups: ["science"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 75,
    verificationStatus: "verified",
    verificationNote:
      "FBISE SSC-II Mathematics SLO structure (75 Marks: 15 MCQs + 9/12 Short @ 4m = 36m + 3/5 Long @ 8m = 24m). Partial SLO pool active.",
    notificationRefs: FBISE_REFERENCES[10],
    alpApplied: false,
    slos: [
      {
        id: "slo-fb-m10-01",
        code: "SLO-M10-Q1",
        statement: "Solve quadratic and reducible equations and interpret root behavior via discriminant.",
        cognitiveLevel: "Apply",
        chapterId: "fb-10-math-u1",
        topicId: "fb-10-math-u1-t1",
      },
    ],
    chapters: [
      {
        id: "fb-10-math-u1",
        number: 1,
        title: "Unit 1: Quadratic Equations",
        isFullyExcluded: false,
        topics: [
          { id: "fb-10-math-u1-t1", title: "Solution Methods, Reciprocal & Exponential Types", isExcluded: false, sloCodes: ["SLO-M10-Q1"] },
        ],
      },
      {
        id: "fb-10-math-u2",
        number: 2,
        title: "Unit 2: Theory of Quadratic Equations",
        isFullyExcluded: false,
        topics: [
          { id: "fb-10-math-u2-t1", title: "Discriminant, Cube Roots of Unity & Symmetric Roots", isExcluded: false },
        ],
      },
    ],
  },

  // =========================================================================
  // HSSC-I (CLASS 11) — PHYSICS (FBISE SLO 85 MARKS)
  // =========================================================================
  {
    id: "fb-11-physics-slo-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 11,
    classLabel: "Class 11",
    session: "FBISE 2026–27 SLO Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    subjectId: "physics",
    subjectName: "Physics",
    variantLabel: "HSSC-I Pre-Engineering / Pre-Medical / ICS",
    groups: ["pre-engineering", "pre-medical", "ics"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 85,
    practicalMarks: 15,
    verificationStatus: "verified",
    verificationNote:
      "FBISE HSSC-I Physics SLO structure (85 Theory Marks). Partial SLO pool available for Chapter, Quick & SLO Practice.",
    notificationRefs: FBISE_REFERENCES[11],
    alpApplied: false,
    slos: [
      {
        id: "slo-fb-p11-01",
        code: "SLO-P11-V1",
        statement: "Evaluate dot and cross products of vectors and verify homogeneity of physical equations using dimensions.",
        cognitiveLevel: "Analyze",
        chapterId: "fb-11-phy-u1",
        topicId: "fb-11-phy-u1-t1",
      },
    ],
    chapters: [
      {
        id: "fb-11-phy-u1",
        number: 1,
        title: "Unit 1: Physical Quantities, Measurement & Vectors",
        isFullyExcluded: false,
        topics: [
          { id: "fb-11-phy-u1-t1", title: "Error Propagation, Dimensions & Vector Products", isExcluded: false, sloCodes: ["SLO-P11-V1"] },
        ],
      },
    ],
  },

  // =========================================================================
  // HSSC-II (CLASS 12) — MATHEMATICS (FBISE 100 MARKS)
  // =========================================================================
  {
    id: "fb-12-math-slo-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 12,
    classLabel: "Class 12",
    session: "FBISE 2026–27 SLO Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    variantLabel: "HSSC-II Pre-Engineering / ICS",
    groups: ["pre-engineering", "ics"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 100,
    verificationStatus: "verified",
    verificationNote:
      "FBISE HSSC-II Mathematics SLO structure (100 Marks). Calculus practice items available; full simulation awaits complete item pool.",
    notificationRefs: FBISE_REFERENCES[12],
    alpApplied: false,
    slos: [
      {
        id: "slo-fb-m12-01",
        code: "SLO-M12-C1",
        statement: "Compute derivatives using chain, product, and quotient rules and classify local extrema.",
        cognitiveLevel: "Apply",
        chapterId: "fb-12-math-u2",
        topicId: "fb-12-math-u2-t1",
      },
    ],
    chapters: [
      {
        id: "fb-12-math-u2",
        number: 2,
        title: "Unit 2: Differentiation & Applications",
        isFullyExcluded: false,
        topics: [
          { id: "fb-12-math-u2-t1", title: "Derivatives, Implicit Forms & Extrema", isExcluded: false, sloCodes: ["SLO-M12-C1"] },
        ],
      },
    ],
  },

  // =========================================================================
  // HSSC-I CHEMISTRY — EXPLICITLY UNAVAILABLE (HONEST DISCLOSURE)
  // =========================================================================
  {
    id: "fb-11-chemistry-slo-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 11,
    classLabel: "Class 11",
    session: "FBISE 2026–27 SLO Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    subjectId: "chemistry",
    subjectName: "Chemistry",
    variantLabel: "HSSC-I Pre-Medical / Pre-Engineering",
    groups: ["pre-engineering", "pre-medical"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 85,
    practicalMarks: 15,
    verificationStatus: "unavailable",
    verificationNote:
      "FBISE HSSC-I National Curriculum 2022/23 updated Chemistry units require verified SLO item authoring before release.",
    notificationRefs: FBISE_REFERENCES[11],
    alpApplied: false,
    slos: [],
    chapters: [],
  },
];
