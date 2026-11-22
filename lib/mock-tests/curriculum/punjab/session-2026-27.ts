import { OfficialNotificationRef, SubjectCurriculum } from "@/lib/mock-tests/types";

/**
 * PUNJAB BOARDS (PECTAA) — ACADEMIC SESSION 2026–27 / ANNUAL EXAM 2027
 *
 * Authority: Punjab Education, Curriculum, Training and Assessment Authority (PECTAA)
 * Official Sources:
 * - https://pectaa.edu.pk/curriculum-compliance/
 * - https://pectaa.edu.pk/downloads-2-2/
 *
 * Official Notifications:
 * - Class 9:  PECTAA/C&C Unit/2026/1238 (6 Nov 2026) & No. 1255 (14 Nov 2026)
 * - Class 10: PECTAA/C&C Unit/2026/1257 (14 Nov 2026)
 * - Class 11: PECTAA/C&C Unit/2026/1239 (6 Nov 2026)
 * - Class 12: PECTAA/C&C Unit/2026/1258 (14 Nov 2026)
 */

export const PUNJAB_CURRICULUM_VERSION_2026_27 = "pectaa-2026-27";

export const PUNJAB_NOTIFICATIONS: Record<9 | 10 | 11 | 12, OfficialNotificationRef[]> = {
  9: [
    {
      code: "PECTAA/C&C Unit/2026/1238",
      date: "6 November 2026",
      title: "Grade 9 Main Smart Syllabus (ALP), Pairing Schemes & Model Papers",
      url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
    },
    {
      code: "PECTAA/C&C Unit/2026/1255",
      date: "14 November 2026",
      title: "Grade 9 Further ALP (Computer Science & Entrepreneurship, General Science)",
      url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1255-1.pdf",
    },
  ],
  10: [
    {
      code: "PECTAA/C&C Unit/2026/1257",
      date: "14 November 2026",
      title: "Grade 10 Smart Syllabus (ALP), Pairing Schemes, Practical Exclusions & Model Papers",
      url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
    },
  ],
  11: [
    {
      code: "PECTAA/C&C Unit/2026/1239",
      date: "6 November 2026",
      title: "Grade 11 Main Smart Syllabus (ALP), Pairing Schemes & Model Papers",
      url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
    },
  ],
  12: [
    {
      code: "PECTAA/C&C Unit/2026/1258",
      date: "14 November 2026",
      title: "Grade 12 Smart Syllabus (ALP), Pairing Schemes, Practical Exclusions & Model Papers",
      url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
    },
  ],
};

const PUNJAB_BOARD_SCOPE = "All 9 Punjab BISEs (PECTAA Curriculum)";

export const PUNJAB_CURRICULA_2026_27: SubjectCurriculum[] = [
  // =========================================================================
  // CLASS 10 — COMPUTER SCIENCE & ENTREPRENEURSHIP (FULLY STOCKED SIMULATION)
  // =========================================================================
  {
    id: "pb-10-cs-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 10,
    classLabel: "Class 10",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "computer-science",
    subjectName: "Computer Science & Entrepreneurship",
    variantLabel: "Science / CS Group",
    groups: ["science", "ics"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 50,
    practicalMarks: 50,
    verificationStatus: "verified",
    verificationNote:
      "Verified against PECTAA No. 1257 (14 Nov 2026): 50 theory marks (10 MCQs + 12/18 Short + 2/3 Long). Partial chapter exclusions enforced at topic level.",
    notificationRefs: PUNJAB_NOTIFICATIONS[10],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-10-cs-ch1",
        number: 1,
        title: "Ch 1: Introduction to Programming",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-ch1-t1",
            title: "Programming Environment, IDE & C Structure",
            isExcluded: false,
            subtopics: [
              { id: "pb-10-cs-ch1-t1-s1", title: "Header files, main() body, comments & syntax", isExcluded: false },
              {
                id: "pb-10-cs-ch1-t1-s2",
                title: "Historical Compiler Setup Screenshots (Deprecated Dev-C++ Install Wizard)",
                isExcluded: true,
                exclusionReason: "Excluded GUI installation walkthrough under PECTAA ALP 2026–27",
                exclusionReference: "PECTAA/C&C Unit/2026/1257",
              },
            ],
          },
          {
            id: "pb-10-cs-ch1-t2",
            title: "Constants, Variables & Data Types",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-ch2",
        number: 2,
        title: "Ch 2: User Interaction",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-ch2-t1",
            title: "Formatted I/O: printf(), scanf() & Format Specifiers",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-ch2-t2",
            title: "Escape Sequences & getch()/getche()",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-ch2-t3",
            title: "Operators & Operator Precedence",
            isExcluded: false,
            subtopics: [
              { id: "pb-10-cs-ch2-t3-s1", title: "Arithmetic, Relational & Logical Operators", isExcluded: false },
              {
                id: "pb-10-cs-ch2-t3-s2",
                title: "Bitwise Shift & Legacy Operator Drill Exercises",
                isExcluded: true,
                exclusionReason: "Excluded under PECTAA No. 1257 Smart Syllabus",
                exclusionReference: "PECTAA/C&C Unit/2026/1257",
                excludedExercises: ["Ch 2 Review Q6(d)"],
              },
            ],
          },
        ],
      },
      {
        id: "pb-10-cs-ch3",
        number: 3,
        title: "Ch 3: Conditional Logic",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-ch3-t1",
            title: "Control Structures: if, if-else & else-if",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-ch3-t2",
            title: "Nested Selection & switch-case / break",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-ch4",
        number: 4,
        title: "Ch 4: Data and Repetition",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-ch4-t1",
            title: "Arrays: Declaration, Initialization & Indexing",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-ch4-t2",
            title: "Loop Structures (for, while, do-while) & Nested Loops",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-ch5",
        number: 5,
        title: "Ch 5: Functions & Entrepreneurship Concepts",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-ch5-t1",
            title: "User-Defined Functions, Signatures, Parameters & Return Values",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-ch5-t2",
            title: "Digital Entrepreneurship Fundamentals & Value Proposition",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-ch5-t3",
            title: "Extended Case Study Appendix (Non-Evaluative)",
            isExcluded: true,
            exclusionReason: "Excluded appendix under PECTAA No. 1257",
            exclusionReference: "PECTAA/C&C Unit/2026/1257",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 9 — PHYSICS (PUNJAB PECTAA No. 1238)
  // =========================================================================
  {
    id: "pb-9-physics-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 9,
    classLabel: "Class 9",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "physics",
    subjectName: "Physics",
    variantLabel: "Science Group",
    groups: ["science"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 60,
    practicalMarks: 30,
    verificationStatus: "verified",
    verificationNote:
      "Verified against PECTAA No. 1238 (6 Nov 2026): 60 theory marks (12 MCQs + 15/24 Short + 2/3 Long). Partial topic/subtopic exclusions applied.",
    notificationRefs: PUNJAB_NOTIFICATIONS[9],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-9-phy-ch1",
        number: 1,
        title: "Ch 1: Physical Quantities and Measurement",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-phy-ch1-t1",
            title: "Base Quantities, Derived Quantities & SI Prefixes",
            isExcluded: false,
          },
          {
            id: "pb-9-phy-ch1-t2",
            title: "Measuring Instruments: Vernier Callipers & Screw Gauge",
            isExcluded: false,
          },
          {
            id: "pb-9-phy-ch1-t3",
            title: "Historical Stopwatches & Lever Balance Sketches",
            isExcluded: true,
            exclusionReason: "Deleted non-core instrument sketch under PECTAA ALP No. 1238",
            exclusionReference: "PECTAA/C&C Unit/2026/1238",
          },
        ],
      },
      {
        id: "pb-9-phy-ch2",
        number: 2,
        title: "Ch 2: Kinematics",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-phy-ch2-t1",
            title: "Scalars, Vectors, Distance & Displacement",
            isExcluded: false,
          },
          {
            id: "pb-9-phy-ch2-t2",
            title: "Speed, Velocity, Acceleration & Graphical Analysis",
            isExcluded: false,
          },
          {
            id: "pb-9-phy-ch2-t3",
            title: "Equations of Uniformly Accelerated Motion",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-phy-ch3",
        number: 3,
        title: "Ch 3: Dynamics",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-phy-ch3-t1",
            title: "Force, Inertia & Newton's Three Laws of Motion",
            isExcluded: false,
          },
          {
            id: "pb-9-phy-ch3-t2",
            title: "Momentum, Impulse & Conservation of Linear Momentum",
            isExcluded: false,
          },
          {
            id: "pb-9-phy-ch3-t3",
            title: "Banking of Roads & Centrifuge Applications",
            isExcluded: true,
            exclusionReason: "Reduced descriptive application under PECTAA ALP No. 1238",
            exclusionReference: "PECTAA/C&C Unit/2026/1238",
          },
        ],
      },
      {
        id: "pb-9-phy-ch4",
        number: 4,
        title: "Ch 4: Turning Effect of Forces",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-phy-ch4-t1",
            title: "Resolution of Forces, Torque & Principle of Moments",
            isExcluded: false,
          },
          {
            id: "pb-9-phy-ch4-t2",
            title: "Centre of Gravity & Equilibrium Conditions",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-phy-ch6",
        number: 6,
        title: "Ch 6: Work and Energy",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-phy-ch6-t1",
            title: "Work, Kinetic & Potential Energy, Power & Efficiency",
            isExcluded: false,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 9 — MATHEMATICS (PUNJAB PECTAA No. 1238)
  // =========================================================================
  {
    id: "pb-9-math-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 9,
    classLabel: "Class 9",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    variantLabel: "Science Group",
    groups: ["science"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 75,
    verificationStatus: "verified",
    verificationNote:
      "Verified against PECTAA No. 1238 (6 Nov 2026): 75 Marks (15 MCQs + 18/27 Short + Part-II 2/3 & Part-III 1/2 Long). Topic/exercise deletions enforced.",
    notificationRefs: PUNJAB_NOTIFICATIONS[9],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-9-math-ch1",
        number: 1,
        title: "Ch 1: Matrices and Determinants",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-math-ch1-t1",
            title: "Types of Matrices, Addition & Multiplication",
            isExcluded: false,
          },
          {
            id: "pb-9-math-ch1-t2",
            title: "Determinants, Adjoint, Inverse & Cramer's Rule",
            isExcluded: false,
            subtopics: [
              { id: "pb-9-math-ch1-t2-s1", title: "2x2 Determinant, Adjoint & Cramer's Rule (Ex 1.5–1.6)", isExcluded: false },
              {
                id: "pb-9-math-ch1-t2-s2",
                title: "Word Problems Ex 1.6 Q5–Q6 (Partial Deletion)",
                isExcluded: true,
                exclusionReason: "Selective exercise questions deleted per PECTAA ALP No. 1238",
                exclusionReference: "PECTAA/C&C Unit/2026/1238",
                excludedExercises: ["Ex 1.6 Q5", "Ex 1.6 Q6"],
              },
            ],
          },
        ],
      },
      {
        id: "pb-9-math-ch3",
        number: 3,
        title: "Ch 3: Logarithms",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-math-ch3-t1",
            title: "Scientific Notation, Characteristic, Mantissa & Laws of Logarithms",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-math-ch4",
        number: 4,
        title: "Ch 4: Algebraic Expressions and Algebraic Formulas",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-math-ch4-t1",
            title: "Algebraic Identities, Factorization & Surds",
            isExcluded: false,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 10 — MATHEMATICS (PUNJAB PECTAA No. 1257)
  // =========================================================================
  {
    id: "pb-10-math-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 10,
    classLabel: "Class 10",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    variantLabel: "Science Group",
    groups: ["science"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 75,
    verificationStatus: "verified",
    verificationNote:
      "Verified against PECTAA No. 1257 (14 Nov 2026): 75 Marks (15 MCQs + 18/27 Short + Part-II 2/3 & Part-III 1/2 Long).",
    notificationRefs: PUNJAB_NOTIFICATIONS[10],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-10-math-ch1",
        number: 1,
        title: "Ch 1: Quadratic Equations",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-math-ch1-t1", title: "Standard Form, Factorization & Completing Square", isExcluded: false },
          { id: "pb-10-math-ch1-t2", title: "Quadratic Formula & Reducible Radical Equations", isExcluded: false },
        ],
      },
      {
        id: "pb-10-math-ch2",
        number: 2,
        title: "Ch 2: Theory of Quadratic Equations",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-math-ch2-t1", title: "Discriminant & Nature of Roots", isExcluded: false },
          { id: "pb-10-math-ch2-t2", title: "Sum, Product of Roots & Symmetric Functions", isExcluded: false },
          {
            id: "pb-10-math-ch2-t3",
            title: "Synthetic Division High-Degree Factoring Extension",
            isExcluded: true,
            exclusionReason: "Deleted selective extension topic under PECTAA ALP No. 1257",
            exclusionReference: "PECTAA/C&C Unit/2026/1257",
          },
        ],
      },
      {
        id: "pb-10-math-ch3",
        number: 3,
        title: "Ch 3: Variations",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-math-ch3-t1", title: "Ratio, Proportion, Componendo-Dividendo & Joint Variation", isExcluded: false },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 10 — PHYSICS & CHEMISTRY (PUNJAB PECTAA No. 1257)
  // =========================================================================
  {
    id: "pb-10-physics-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 10,
    classLabel: "Class 10",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "physics",
    subjectName: "Physics",
    groups: ["science"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 60,
    practicalMarks: 30,
    verificationStatus: "verified",
    verificationNote:
      "Verified PECTAA No. 1257 structure (60 theory + 30 practical). Verified question pool is currently partial—Chapter & Quick Tests active.",
    notificationRefs: PUNJAB_NOTIFICATIONS[10],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-10-phy-ch10",
        number: 10,
        title: "Ch 10: Simple Harmonic Motion and Waves",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-phy-ch10-t1", title: "Simple Harmonic Motion (Mass-Spring & Simple Pendulum)", isExcluded: false },
          { id: "pb-10-phy-ch10-t2", title: "Wave Equation (v = fλ) & Ripple Tank Phenomena", isExcluded: false },
        ],
      },
      {
        id: "pb-10-phy-ch12",
        number: 12,
        title: "Ch 12: Geometrical Optics",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-phy-ch12-t1", title: "Spherical Mirrors, Mirror Formula & Refraction", isExcluded: false },
          { id: "pb-10-phy-ch12-t2", title: "Total Internal Reflection & Optical Fibre Principle", isExcluded: false },
        ],
      },
      {
        id: "pb-10-phy-ch14",
        number: 14,
        title: "Ch 14: Current Electricity",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-phy-ch14-t1", title: "Ohm's Law, Series/Parallel Resistors & Joule's Law", isExcluded: false },
        ],
      },
    ],
  },
  {
    id: "pb-10-chemistry-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 10,
    classLabel: "Class 10",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "chemistry",
    subjectName: "Chemistry",
    groups: ["science"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 60,
    practicalMarks: 30,
    verificationStatus: "verified",
    verificationNote:
      "Verified PECTAA No. 1257 structure (60 theory + 30 practical). Verified question pool is currently partial—Chapter & Quick Tests active.",
    notificationRefs: PUNJAB_NOTIFICATIONS[10],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-10-chem-ch9",
        number: 9,
        title: "Ch 9: Chemical Equilibrium",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-chem-ch9-t1", title: "Reversible Reactions & Law of Mass Action (Kc)", isExcluded: false },
        ],
      },
      {
        id: "pb-10-chem-ch10",
        number: 10,
        title: "Ch 10: Acids, Bases and Salts",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-chem-ch10-t1", title: "Arrhenius, Bronsted-Lowry, Lewis Concepts & pH Scale", isExcluded: false },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 11 & 12 — HSSC (PUNJAB PECTAA No. 1239 / No. 1258)
  // =========================================================================
  {
    id: "pb-11-physics-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 11,
    classLabel: "Class 11",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "physics",
    subjectName: "Physics",
    groups: ["pre-engineering", "pre-medical", "ics"],
    assessmentTrack: "theory",
    hasPracticalComponent: true,
    theoryMarks: 85,
    verificationStatus: "verified",
    verificationNote:
      "Verified against PECTAA No. 1239 (6 Nov 2026): 85 theory marks (17 MCQs + 22/33 Short + 3/5 Long). Partial pool populated for Chapter & Practice modes.",
    notificationRefs: PUNJAB_NOTIFICATIONS[11],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-11-phy-ch1",
        number: 1,
        title: "Ch 1: Measurements",
        isFullyExcluded: false,
        topics: [
          { id: "pb-11-phy-ch1-t1", title: "Significant Figures, Uncertainty & Dimensional Analysis", isExcluded: false },
        ],
      },
      {
        id: "pb-11-phy-ch2",
        number: 2,
        title: "Ch 2: Vectors and Equilibrium",
        isFullyExcluded: false,
        topics: [
          { id: "pb-11-phy-ch2-t1", title: "Scalar & Vector Products, Rectangular Components & Torque", isExcluded: false },
        ],
      },
      {
        id: "pb-11-phy-ch3",
        number: 3,
        title: "Ch 3: Motion and Force",
        isFullyExcluded: false,
        topics: [
          { id: "pb-11-phy-ch3-t1", title: "Projectile Motion, Range & Impulse-Momentum Theorem", isExcluded: false },
        ],
      },
    ],
  },
  {
    id: "pb-11-mathematics-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 11,
    classLabel: "Class 11",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    groups: ["pre-engineering", "ics"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 100,
    verificationStatus: "verified",
    verificationNote:
      "Verified against PECTAA No. 1239 (6 Nov 2026): 100 Marks (20 MCQs + 25/37 Short + 3/5 Long). Partial pool active for Chapter & Practice tests.",
    notificationRefs: PUNJAB_NOTIFICATIONS[11],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-11-math-ch1",
        number: 1,
        title: "Ch 1: Number Systems",
        isFullyExcluded: false,
        topics: [
          { id: "pb-11-math-ch1-t1", title: "Complex Numbers, Argand Diagram & De Moivre Properties", isExcluded: false },
        ],
      },
      {
        id: "pb-11-math-ch9",
        number: 9,
        title: "Ch 9: Fundamentals of Trigonometry",
        isFullyExcluded: false,
        topics: [
          { id: "pb-11-math-ch9-t1", title: "Radian Measure, Arc Length (l = rθ) & Trigonometric Identities", isExcluded: false },
        ],
      },
    ],
  },
  {
    id: "pb-12-physics-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 12,
    classLabel: "Class 12",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "physics",
    subjectName: "Physics",
    groups: ["pre-engineering", "pre-medical", "ics"],
    assessmentTrack: "theory",
    hasPracticalComponent: true,
    theoryMarks: 85,
    verificationStatus: "verified",
    verificationNote:
      "Verified against PECTAA No. 1258 (14 Nov 2026): 85 theory marks (17 MCQs + 22/33 Short + 3/5 Long). Partial pool active.",
    notificationRefs: PUNJAB_NOTIFICATIONS[12],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-12-phy-ch12",
        number: 12,
        title: "Ch 12: Electrostatics",
        isFullyExcluded: false,
        topics: [
          { id: "pb-12-phy-ch12-t1", title: "Coulomb's Law, Gauss's Law, Electric Potential & Capacitors", isExcluded: false },
        ],
      },
      {
        id: "pb-12-phy-ch14",
        number: 14,
        title: "Ch 14: Electromagnetism",
        isFullyExcluded: false,
        topics: [
          { id: "pb-12-phy-ch14-t1", title: "Ampere's Law, Magnetic Force on Conductor & Lorentz Force", isExcluded: false },
        ],
      },
    ],
  },
  {
    id: "pb-12-mathematics-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 12,
    classLabel: "Class 12",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "mathematics",
    subjectName: "Mathematics",
    groups: ["pre-engineering", "ics"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 100,
    verificationStatus: "verified",
    verificationNote:
      "Verified against PECTAA No. 1258 (14 Nov 2026): 100 Marks (20 MCQs + 25/37 Short + 3/5 Long). Partial pool active.",
    notificationRefs: PUNJAB_NOTIFICATIONS[12],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-12-math-ch2",
        number: 2,
        title: "Ch 2: Differentiation",
        isFullyExcluded: false,
        topics: [
          { id: "pb-12-math-ch2-t1", title: "Derivatives from First Principles, Chain Rule & Stationary Points", isExcluded: false },
        ],
      },
      {
        id: "pb-12-math-ch3",
        number: 3,
        title: "Ch 3: Integration",
        isFullyExcluded: false,
        topics: [
          { id: "pb-12-math-ch3-t1", title: "Indefinite Integrals, Substitution & Definite Area Under Curve", isExcluded: false },
        ],
      },
    ],
  },

  // =========================================================================
  // EXPLICITLY FULL-SYLLABUS & UNAVAILABLE / PROVISIONAL SUBJECTS (HONEST DISCLOSURE)
  // =========================================================================
  {
    id: "pb-9-tarjama-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 9,
    classLabel: "Class 9",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "tarjama-tul-quran",
    subjectName: "Tarjama-tul-Quran-ul-Majeed",
    groups: ["compulsory"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 50,
    verificationStatus: "provisional",
    verificationNote:
      "PECTAA explicitly confirmed NO Smart Syllabus / ALP deletions exist for Tarjama-tul-Quran (Grades 9–12)—prepare full syllabus. Verified question bank authoring is pending.",
    notificationRefs: PUNJAB_NOTIFICATIONS[9],
    alpApplied: false,
    slos: [],
    chapters: [],
  },
  {
    id: "pb-10-biology-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 10,
    classLabel: "Class 10",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "biology",
    subjectName: "Biology",
    groups: ["science"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 60,
    practicalMarks: 30,
    verificationStatus: "unavailable",
    verificationNote:
      "PECTAA No. 1257 blueprint (60 theory + 30 practical) is catalogued; subject question pool is not yet populated cleanly—marked Unavailable.",
    notificationRefs: PUNJAB_NOTIFICATIONS[10],
    alpApplied: true,
    slos: [],
    chapters: [],
  },
];
