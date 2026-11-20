import { OfficialNotificationRef, SubjectCurriculum } from "@/lib/mock-tests/types";

/**
 * FEDERAL BOARD OF INTERMEDIATE & SECONDARY EDUCATION (FBISE)
 *
 * Official Sources:
 * - https://www.fbise.edu.pk/syllabus.php
 * - https://www.fbise.edu.pk/curriculum_model_paper.php
 * - https://www.fbise.edu.pk/syllabusSSC-I.php
 * - https://www.fbise.edu.pk/syllabusSSC-II.php
 * - https://www.fbise.edu.pk/syllabusHSSC-I.php
 * - https://www.fbise.edu.pk/syllabusHSSC-II.php
 *
 * Authentic Policy Architecture:
 * - Inclusive Scheme of Studies 2024 (1200-mark scheme): Phased in SSC-I & HSSC-I from 2025 onward,
 *   and SSC-II & HSSC-II from 2026 onward. Legacy Scheme of Studies 2006 (`fbise-scheme-2006`) is
 *   explicitly separated/excluded from active 2026–27 papers.
 * - Notification No. 1-1/FBISE/RES/2026/370 (16 Nov 2026): Bilingual question papers (Urdu & English)
 *   apply strictly to SSC (Classes 9 & 10) Mathematics, Physics, Chemistry, and Biology/Computer Science
 *   from First Annual Examination 2027 onward (NOT HSSC Classes 11–12).
 * - Strictly independent from Punjab Boards / PECTAA (uses SLO Assessment Frameworks, Tables of
 *   Specifications, Model Papers, and Composite PBA practical marks: 10m SSC / 15m HSSC).
 */

export const FBISE_SCHEME_VERSION = "fbise-inclusive-2024";

export const FBISE_LEGACY_EXCLUDED_VERSIONS = [
  "fbise-scheme-2006",
  "fbise-slo-2024",
] as const;

const FBISE_BOARD_SCOPE = "FBISE Islamabad (Inclusive Scheme of Studies 2024)";

const FBISE_BILINGUAL_NOTIFICATION_REF: OfficialNotificationRef = {
  code: "1-1/FBISE/RES/2026/370",
  date: "16 November 2026",
  title: "Bilingual Question Papers (Urdu & English) for SSC Science & Math from 1st Annual 2027",
  url: "https://www.fbise.edu.pk/syllabus.php",
};

export const FBISE_SCHEME_2024_POLICY_REF: OfficialNotificationRef = {
  code: "FBISE Inclusive Scheme 2024",
  date: "Phased 2025 (I) / 2026 (II)",
  title: "FBISE 1200-Mark Inclusive Scheme of Studies 2024 (Replacing Legacy Scheme 2006)",
  url: "https://www.fbise.edu.pk/syllabus.php",
};

export const FBISE_REFERENCES: Record<9 | 10 | 11 | 12, OfficialNotificationRef[]> = {
  9: [
    FBISE_SCHEME_2024_POLICY_REF,
    {
      code: "FBISE SSC-I SLO Framework",
      date: "Active 2026–27 Cycle",
      title: "FBISE SSC-I Curriculum 2022–23 Assessment Frameworks, ToS & Model Papers",
      url: "https://www.fbise.edu.pk/syllabusSSC-I.php",
    },
    FBISE_BILINGUAL_NOTIFICATION_REF,
    {
      code: "FBISE Model Papers Portal",
      date: "Active 2026–27 Cycle",
      title: "FBISE Curriculum, Assessment Frameworks & Model Papers Directory",
      url: "https://www.fbise.edu.pk/curriculum_model_paper.php",
    },
  ],
  10: [
    FBISE_SCHEME_2024_POLICY_REF,
    {
      code: "FBISE SSC-II SLO Framework",
      date: "Active 2026–27 Cycle",
      title: "FBISE SSC-II Curriculum 2022–23 Assessment Frameworks, ToS & Model Papers",
      url: "https://www.fbise.edu.pk/syllabusSSC-II.php",
    },
    FBISE_BILINGUAL_NOTIFICATION_REF,
  ],
  11: [
    FBISE_SCHEME_2024_POLICY_REF,
    {
      code: "FBISE HSSC-I SLO Framework",
      date: "Active 2026–27 Cycle",
      title: "FBISE HSSC-I Assessment Frameworks, ToS & Model Papers (Inclusive Scheme 2024)",
      url: "https://www.fbise.edu.pk/syllabusHSSC-I.php",
    },
  ],
  12: [
    FBISE_SCHEME_2024_POLICY_REF,
    {
      code: "FBISE HSSC-II SLO Framework",
      date: "Active 2026–27 Cycle",
      title: "FBISE HSSC-II Assessment Frameworks, ToS & Model Papers (Inclusive Scheme 2024)",
      url: "https://www.fbise.edu.pk/syllabusHSSC-II.php",
    },
  ],
};

function buildFbiseSchemeMeta(params: {
  grade: 9 | 10 | 11 | 12;
  subjectId: string;
}) {
  const isSscBilingualSubject =
    (params.grade === 9 || params.grade === 10) &&
    ["mathematics", "physics", "chemistry", "biology", "computer-science"].includes(params.subjectId);

  return {
    schemeName: "FBISE Inclusive Scheme of Studies 2024",
    totalSchemeMarks: 1200,
    phasedRolloutLabel:
      params.grade === 9 || params.grade === 11
        ? "SSC-I & HSSC-I phased in from Annual 2025 onward"
        : "SSC-II & HSSC-II phased in from Annual 2026 onward",
    legacyExcludedScheme: "Scheme of Studies 2006 (fbise-scheme-2006) — transitional stream excluded",
    assessmentFrameworkType:
      params.grade === 9 || params.grade === 10
        ? "SLO Assessment Framework, Table of Specifications (ToS) & Composite PBA (10m Science)"
        : "SLO Assessment Framework, Table of Specifications (ToS) & Composite PBA (15m Science)",
    bilingualPolicy: isSscBilingualSubject
      ? {
          applies: true,
          notificationCode: "1-1/FBISE/RES/2026/370",
          notificationDate: "16 November 2026",
          effectiveExam: "1st Annual Examination 2027 onward",
          note: "Bilingual question papers (Urdu & English) apply to SSC Math, Physics, Chemistry, and Biology/Computer Science from 1st Annual 2027 onward.",
        }
      : {
          applies: false,
          notificationCode: "1-1/FBISE/RES/2026/370",
          notificationDate: "16 November 2026",
          effectiveExam: "SSC Classes 9–10 Only",
          note: "FBISE Notification 1-1/FBISE/RES/2026/370 bilingual rule applies only to SSC Science & Mathematics (not HSSC Classes 11–12).",
        },
  };
}

export const FBISE_CURRICULA_2024: SubjectCurriculum[] = [
  // =========================================================================
  // SSC-I (CLASS 9) — PHYSICS (FULLY STOCKED FBISE SLO SIMULATION)
  // =========================================================================
  {
    id: "fb-9-physics-inclusive-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 9,
    classLabel: "Class 9",
    session: "FBISE Inclusive Scheme 2024 / 2026–27 Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    subjectId: "physics",
    subjectName: "Physics",
    variantLabel: "SSC-I Science (National Curriculum 2022–23)",
    groups: ["science"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 65,
    practicalMarks: 10,
    verificationStatus: "verified",
    curriculumStatus: "verified",
    syllabusPolicy: "slo_national_curriculum",
    textbookRef: "NBF / FBISE SSC-I Physics (Curriculum 2022–23 SLO Framework)",
    alpExclusionsSummary: "Not applicable — FBISE assesses full SLO Table of Specifications (no Punjab ALP exclusions).",
    fbiseSchemeMeta: buildFbiseSchemeMeta({ grade: 9, subjectId: "physics" }),
    verificationNote:
      "Verified FBISE Inclusive Scheme 2024 SSC-I Physics SLO paper scheme: 65 Theory Marks (Section A: 12 MCQs = 12m; Section B: 11/15 Short @ 3m = 33m; Section C: 2/3 Long @ 10m = 20m) + 10m Composite PBA. Bilingual SSC paper policy (No. 370) applies 1st Annual 2027+.",
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
    id: "fb-10-math-inclusive-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 10,
    classLabel: "Class 10",
    session: "FBISE Inclusive Scheme 2024 / 2026–27 Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    variantLabel: "SSC-II Science Group",
    groups: ["science"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 75,
    verificationStatus: "verified",
    curriculumStatus: "verified",
    syllabusPolicy: "slo_national_curriculum",
    textbookRef: "NBF / FBISE SSC-II Mathematics (SLO Assessment Framework)",
    alpExclusionsSummary: "Not applicable — full FBISE SLO Table of Specifications applies.",
    fbiseSchemeMeta: buildFbiseSchemeMeta({ grade: 10, subjectId: "mathematics" }),
    verificationNote:
      "FBISE SSC-II Mathematics Inclusive Scheme 2024 SLO structure (75 Marks). Bilingual SSC paper policy (No. 370) applies from 1st Annual 2027+. Partial SLO pool active.",
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
    id: "fb-11-physics-inclusive-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 11,
    classLabel: "Class 11",
    session: "FBISE Inclusive Scheme 2024 / 2026–27 Cycle",
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
    curriculumStatus: "verified",
    syllabusPolicy: "slo_national_curriculum",
    textbookRef: "NBF / FBISE HSSC-I Physics (National Curriculum 2022–23)",
    alpExclusionsSummary: "Not applicable — full FBISE SLO ToS & 15m Composite PBA apply.",
    fbiseSchemeMeta: buildFbiseSchemeMeta({ grade: 11, subjectId: "physics" }),
    verificationNote:
      "FBISE HSSC-I Physics Inclusive Scheme 2024 SLO structure (85 Theory + 15 PBA). Partial SLO pool active for Chapter, Quick & SLO Practice.",
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
    id: "fb-12-math-inclusive-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 12,
    classLabel: "Class 12",
    session: "FBISE Inclusive Scheme 2024 / 2026–27 Cycle",
    curriculumVersion: FBISE_SCHEME_VERSION,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    variantLabel: "HSSC-II Pre-Engineering / ICS",
    groups: ["pre-engineering", "ics"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 100,
    verificationStatus: "verified",
    curriculumStatus: "verified",
    syllabusPolicy: "slo_national_curriculum",
    textbookRef: "NBF / FBISE HSSC-II Mathematics (SLO Assessment Framework)",
    alpExclusionsSummary: "Not applicable — full FBISE SLO Table of Specifications applies.",
    fbiseSchemeMeta: buildFbiseSchemeMeta({ grade: 12, subjectId: "mathematics" }),
    verificationNote:
      "FBISE HSSC-II Mathematics Inclusive Scheme 2024 structure (100 Marks). Calculus practice items available; full simulation awaits complete item pool.",
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
  // HSSC-I CHEMISTRY — EXPLICIT PENDING VERIFICATION CURRICULUM + EMPTY BANK
  // =========================================================================
  {
    id: "fb-11-chemistry-inclusive-2024",
    system: "fbise",
    boardScope: FBISE_BOARD_SCOPE,
    grade: 11,
    classLabel: "Class 11",
    session: "FBISE Inclusive Scheme 2024 / 2026–27 Cycle",
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
    curriculumStatus: "pending_verification",
    syllabusPolicy: "slo_national_curriculum",
    textbookRef: "NBF HSSC-I Chemistry (Curriculum 2022–23 — SLO mapping pending verification)",
    alpExclusionsSummary: "Pending final SLO-to-chapter ToS reconciliation before item authoring.",
    fbiseSchemeMeta: buildFbiseSchemeMeta({ grade: 11, subjectId: "chemistry" }),
    verificationNote:
      "FBISE HSSC-I National Curriculum 2022/23 Chemistry unit-to-SLO mapping & verified item bank remain pending verification before release.",
    notificationRefs: FBISE_REFERENCES[11],
    alpApplied: false,
    slos: [],
    chapters: [],
  },
];
