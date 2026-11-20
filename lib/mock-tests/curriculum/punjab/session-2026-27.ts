import { OfficialNotificationRef, SubjectCurriculum } from "@/lib/mock-tests/types";

/**
 * PUNJAB BOARDS (PECTAA) — ACADEMIC SESSION 2026–27 / ANNUAL EXAM 2027
 *
 * Authority: Punjab Education, Curriculum, Training and Assessment Authority (PECTAA)
 * Official Source: https://pectaa.edu.pk/curriculum-compliance/
 *
 * Complete Official Notification Scope Map:
 * - No. 1238 (6 Nov 2026): Grade 9 Main subjects
 * - No. 1255 (14 Nov 2026): Grade 9 Further subjects (CS & Entrepreneurship, General Science, Masihi Taleem)
 * - No. 1253 (14 Nov 2026): Matric-Tech Grade 9
 * - No. 1254 (14 Nov 2026): Matric-Tech Grade 10
 * - No. 1257 (14 Nov 2026): Grade 10 Main & Science/CS subjects
 * - No. 1239 (6 Nov 2026): Grade 11 Main subjects
 * - No. 1256 (14 Nov 2026): Grade 11 Masihi Taleem ONLY (does NOT supersede No. 1239)
 * - No. 1258 (14 Nov 2026): Grade 12 Main subjects
 */

export const PUNJAB_CURRICULUM_VERSION_2026_27 = "pectaa-2026-27";

export const PUNJAB_NOTIFICATIONS_BY_ID = {
  NO_1238: {
    code: "PECTAA/C&C Unit/2026/1238",
    date: "6 November 2026",
    title: "Grade 9 Main Smart Syllabus (ALP), Pairing Schemes & Model Papers",
    url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-9-Notification-06.11.2026-F_Redacted.pdf",
  },
  NO_1255: {
    code: "PECTAA/C&C Unit/2026/1255",
    date: "14 November 2026",
    title: "Grade 9 Further ALP (Computer Science & Entrepreneurship, General Science, Masihi Taleem)",
    url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1255-1.pdf",
  },
  NO_1253: {
    code: "PECTAA/C&C Unit/2026/1253",
    date: "14 November 2026",
    title: "Matric-Tech Grade 9 Smart Syllabus (ALP) & Vocational Assessment Specifications",
    url: "https://pectaa.edu.pk/curriculum-compliance/",
  },
  NO_1254: {
    code: "PECTAA/C&C Unit/2026/1254",
    date: "14 November 2026",
    title: "Matric-Tech Grade 10 Smart Syllabus (ALP) & Vocational Assessment Specifications",
    url: "https://pectaa.edu.pk/curriculum-compliance/",
  },
  NO_1257: {
    code: "PECTAA/C&C Unit/2026/1257",
    date: "14 November 2026",
    title: "Grade 10 Smart Syllabus (ALP), Pairing Schemes, Practical Exclusions & Model Papers",
    url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1257.pdf",
  },
  NO_1239: {
    code: "PECTAA/C&C Unit/2026/1239",
    date: "6 November 2026",
    title: "Grade 11 Main Smart Syllabus (ALP), Pairing Schemes & Model Papers",
    url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-Grade-11_Redacted_Redacted.pdf",
  },
  NO_1256: {
    code: "PECTAA/C&C Unit/2026/1256",
    date: "14 November 2026",
    title: "Grade 11 Masihi Taleem-11 ONLY (Does NOT supersede Grade 11 Main No. 1239)",
    url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALP-Notification-14.11.2026-1256.pdf",
  },
  NO_1258: {
    code: "PECTAA/C&C Unit/2026/1258",
    date: "14 November 2026",
    title: "Grade 12 Smart Syllabus (ALP), Pairing Schemes, Practical Exclusions & Model Papers",
    url: "https://pectaa.edu.pk/wp-content/uploads/2026/11/ALPs-Notification-14.11.2026-1258-2.pdf",
  },
} as const satisfies Record<string, OfficialNotificationRef>;

export interface PunjabNotificationScopeEntry {
  ref: OfficialNotificationRef;
  grade: 9 | 10 | 11 | 12;
  stream: "main" | "further" | "matric_tech" | "masihi_only";
  coveredSubjects: string[];
  supersedesNotificationCode: string | null;
  scopeNote: string;
}

export const PUNJAB_AUTHORITY_REGISTRY: PunjabNotificationScopeEntry[] = [
  {
    ref: PUNJAB_NOTIFICATIONS_BY_ID.NO_1238,
    grade: 9,
    stream: "main",
    coveredSubjects: ["English-9", "Urdu-9", "Islamiat-9", "Ethics-9", "Pakistan Studies-9", "Mathematics-9", "Physics-9", "Chemistry-9", "Biology-9"],
    supersedesNotificationCode: null,
    scopeNote: "Main Grade 9 Smart Syllabus; Tarjama-tul-Quran-9 carries full syllabus with zero ALP deletions.",
  },
  {
    ref: PUNJAB_NOTIFICATIONS_BY_ID.NO_1255,
    grade: 9,
    stream: "further",
    coveredSubjects: ["Computer Science & Entrepreneurship-9", "General Science-9", "Masihi Taleem-9"],
    supersedesNotificationCode: null,
    scopeNote: "Supplements No. 1238 specifically for Computer Science & Entrepreneurship-9, General Science-9, and Masihi Taleem-9.",
  },
  {
    ref: PUNJAB_NOTIFICATIONS_BY_ID.NO_1253,
    grade: 9,
    stream: "matric_tech",
    coveredSubjects: ["Matric-Tech Grade 9 Vocational & Technical Trades"],
    supersedesNotificationCode: null,
    scopeNote: "Dedicated Matric-Tech Grade 9 notification.",
  },
  {
    ref: PUNJAB_NOTIFICATIONS_BY_ID.NO_1254,
    grade: 10,
    stream: "matric_tech",
    coveredSubjects: ["Matric-Tech Grade 10 Vocational & Technical Trades"],
    supersedesNotificationCode: null,
    scopeNote: "Dedicated Matric-Tech Grade 10 notification.",
  },
  {
    ref: PUNJAB_NOTIFICATIONS_BY_ID.NO_1257,
    grade: 10,
    stream: "main",
    coveredSubjects: [
      "English-10",
      "Urdu-10",
      "Pakistan Studies-10",
      "Mathematics-10",
      "Physics-10",
      "Chemistry-10",
      "Biology-10",
      "Computer Science & Entrepreneurship-10",
      "General Science-10",
    ],
    supersedesNotificationCode: null,
    scopeNote: "Covers all mainstream Grade 10 subjects including new 8-unit Computer Science & Entrepreneurship-10.",
  },
  {
    ref: PUNJAB_NOTIFICATIONS_BY_ID.NO_1239,
    grade: 11,
    stream: "main",
    coveredSubjects: ["English-11", "Urdu-11", "Physics-11", "Chemistry-11", "Biology-11", "Mathematics-11", "Computer Science & Entrepreneurship-11"],
    supersedesNotificationCode: null,
    scopeNote: "Primary Grade 11 notification; remains active and is NOT superseded by No. 1256.",
  },
  {
    ref: PUNJAB_NOTIFICATIONS_BY_ID.NO_1256,
    grade: 11,
    stream: "masihi_only",
    coveredSubjects: ["Masihi Taleem-11 ONLY"],
    supersedesNotificationCode: null,
    scopeNote: "Applies solely to Masihi Taleem-11. Explicitly does NOT replace or alter Grade 11 Main No. 1239.",
  },
  {
    ref: PUNJAB_NOTIFICATIONS_BY_ID.NO_1258,
    grade: 12,
    stream: "main",
    coveredSubjects: ["English-12", "Urdu-12", "Pakistan Studies-12", "Mathematics-12", "Physics-12", "Chemistry-12", "Biology-12", "Computer Science & Entrepreneurship-12"],
    supersedesNotificationCode: null,
    scopeNote: "Main Grade 12 Smart Syllabus & Practical Exclusions (with No. 1239 practical appendices).",
  },
];

export const PUNJAB_NOTIFICATIONS: Record<9 | 10 | 11 | 12, OfficialNotificationRef[]> = {
  9: [
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1238,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1255,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1253,
  ],
  10: [
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1257,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1254,
  ],
  11: [
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1239,
    PUNJAB_NOTIFICATIONS_BY_ID.NO_1256,
  ],
  12: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1258],
};

const PUNJAB_BOARD_SCOPE = "All 9 Punjab BISEs (PECTAA Curriculum)";

export const PUNJAB_CURRICULA_2026_27: SubjectCurriculum[] = [
  // =========================================================================
  // CLASS 9 — COMPUTER SCIENCE & ENTREPRENEURSHIP (PECTAA No. 1255 — NEW 2026–27)
  // =========================================================================
  {
    id: "pb-9-cs-2026-27",
    system: "punjab",
    boardScope: PUNJAB_BOARD_SCOPE,
    grade: 9,
    classLabel: "Class 9",
    session: "Academic Session 2026–27 / Annual 2027",
    curriculumVersion: PUNJAB_CURRICULUM_VERSION_2026_27,
    subjectId: "computer-science",
    subjectName: "Computer Science & Entrepreneurship",
    variantLabel: "Science / CS Group (No. 1255)",
    groups: ["science", "ics"],
    assessmentTrack: "theory",
    hasPracticalComponent: true,
    theoryMarks: 50,
    practicalMarks: 50,
    verificationStatus: "verified",
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Computer Science & Entrepreneurship-9 (2026–27 Curriculum · Units 1–9)",
    alpExclusionsSummary: "Unit 2 (Number Systems) completely excluded; selective subtopics excluded in Units 1, 4, 5 & 8 per No. 1255.",
    verificationNote:
      "Verified against PECTAA Further Notification No. 1255 (14 Nov 2026): 50 theory marks (10 MCQs + 12/18 Short + 2/3 Long). Combined 50m practical examined in Class 10. Verified starter bank active for practice modes.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1255],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-9-cs-u1",
        number: 1,
        title: "Unit 1: Introduction to Systems",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-cs-u1-t1",
            title: "Natural, Artificial & Computer Systems Overview",
            isExcluded: false,
          },
          {
            id: "pb-9-cs-u1-t2",
            title: "Von Neumann Architecture, System Components & Bus Cycle",
            isExcluded: false,
          },
          {
            id: "pb-9-cs-u1-t3",
            title: "Selected Subtopic Exclusions Listed in No. 1255",
            isExcluded: true,
            exclusionReason: "Deleted selective subtopic per PECTAA No. 1255 (14 Nov 2026)",
            exclusionReference: "PECTAA/C&C Unit/2026/1255",
          },
        ],
      },
      {
        id: "pb-9-cs-u2",
        number: 2,
        title: "Unit 2: Number Systems (COMPLETELY EXCLUDED)",
        isFullyExcluded: true,
        exclusionReason: "Complete Unit 2 (Number Systems) excluded from Academic Session 2026–27 under PECTAA/C&C Unit/2026/1255.",
        topics: [
          {
            id: "pb-9-cs-u2-t1",
            title: "Binary, Octal, Hexadecimal Conversions & Arithmetic",
            isExcluded: true,
            exclusionReason: "Complete Unit 2 excluded under PECTAA No. 1255",
            exclusionReference: "PECTAA/C&C Unit/2026/1255",
          },
        ],
      },
      {
        id: "pb-9-cs-u3",
        number: 3,
        title: "Unit 3: Digital Systems and Logic Design",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-cs-u3-t1",
            title: "Basic Logic Gates (AND, OR, NOT), Truth Tables & Boolean Expressions",
            isExcluded: false,
          },
          {
            id: "pb-9-cs-u3-t2",
            title: "NAND, NOR, XOR Gates & Combinational Logic Circuits",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-cs-u4",
        number: 4,
        title: "Unit 4: System Troubleshooting",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-cs-u4-t1",
            title: "Systematic Troubleshooting Steps & Hardware/Software Fault Isolation",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-cs-u5",
        number: 5,
        title: "Unit 5: Software System",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-cs-u5-t1",
            title: "System Software vs Application Software & Operating System Basics",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-cs-u6",
        number: 6,
        title: "Unit 6: Introduction to Computer Networks",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-cs-u6-t1",
            title: "Network Topologies, Transmission Media & Client-Server Architecture",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-cs-u7",
        number: 7,
        title: "Unit 7: Computational Thinking",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-cs-u7-t1",
            title: "Decomposition, Pattern Recognition, Abstraction & Algorithms",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-cs-u8",
        number: 8,
        title: "Unit 8: Web Development with HTML, CSS and JavaScript",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-cs-u8-t1",
            title: "HTML5 Structure, CSS Styling Selectors & Basic JavaScript Interactivity",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-9-cs-u9",
        number: 9,
        title: "Unit 9: Data Science and Data Gathering",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-cs-u9-t1",
            title: "Qualitative vs Quantitative Data, Collection Methods & Ethical Data Handling",
            isExcluded: false,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 10 — COMPUTER SCIENCE & ENTREPRENEURSHIP (PECTAA No. 1257 — AUTHENTIC 8 UNITS)
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
    variantLabel: "Science / CS Group (No. 1257 · Python / OS / AI)",
    groups: ["science", "ics"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 50,
    practicalMarks: 50,
    verificationStatus: "verified",
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Computer Science & Entrepreneurship-10 (2026–27 Edition · Units 1–8)",
    alpExclusionsSummary: "Unit 2 (System Recovery & Advanced Maintenance) completely excluded; selective practicals excluded per No. 1257.",
    verificationNote:
      "Verified against PECTAA No. 1257 (14 Nov 2026): 50 theory marks (10 MCQs + 12/18 Short + 2/3 Long) across 7 active units (Unit 2 excluded). Legacy 2020 C-language bank quarantined as Outdated; new 2026–27 Python/OS/AI starter bank active for practice.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1257],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-10-cs-u1",
        number: 1,
        title: "Unit 1: Operating Systems: Structure and Services",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-u1-t1",
            title: "OS Architecture, Kernel, Process Scheduling & Memory Management",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-u1-t2",
            title: "File Systems, Device Drivers & User Interfaces (CLI / GUI)",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-u2",
        number: 2,
        title: "Unit 2: System Recovery and Advanced Maintenance (COMPLETELY EXCLUDED)",
        isFullyExcluded: true,
        exclusionReason: "Complete Unit 2 (System Recovery and Advanced Maintenance) excluded under PECTAA/C&C Unit/2026/1257 (14 Nov 2026).",
        topics: [
          {
            id: "pb-10-cs-u2-t1",
            title: "System Restore Points, Recovery Partitions & Maintenance Tools",
            isExcluded: true,
            exclusionReason: "Complete Unit 2 excluded under PECTAA No. 1257",
            exclusionReference: "PECTAA/C&C Unit/2026/1257",
          },
        ],
      },
      {
        id: "pb-10-cs-u3",
        number: 3,
        title: "Unit 3: Introduction to Python Programming",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-u3-t1",
            title: "Python Syntax, Variables, Data Types, Input/Output & Operators",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-u3-t2",
            title: "Strings, Lists, Tuples, Dictionaries & Built-In Methods",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-u4",
        number: 4,
        title: "Unit 4: Control Structures in Python",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-u4-t1",
            title: "Conditional Branching: if, elif, else & Indentation Rules",
            isExcluded: false,
          },
          {
            id: "pb-10-cs-u4-t2",
            title: "Iteration: for, while Loops, range(), break/continue & Functions",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-u5",
        number: 5,
        title: "Unit 5: Data Science",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-u5-t1",
            title: "Data Lifecycle: Acquisition, Cleaning, Analysis & Visualization",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-u6",
        number: 6,
        title: "Unit 6: Introduction to Artificial Intelligence (AI) and Machine Learning (ML)",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-u6-t1",
            title: "AI Foundations, Supervised vs Unsupervised Learning & Training Data",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-u7",
        number: 7,
        title: "Unit 7: Applications of AI",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-u7-t1",
            title: "NLP, Computer Vision, Healthcare/Agriculture AI & AI Ethics",
            isExcluded: false,
          },
        ],
      },
      {
        id: "pb-10-cs-u8",
        number: 8,
        title: "Unit 8: Digital Entrepreneurship",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-10-cs-u8-t1",
            title: "Digital Business Models, Value Proposition, MVP & E-Commerce Marketing",
            isExcluded: false,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 9 — PHYSICS (PUNJAB PECTAA No. 1238 ONLY)
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Physics-9 (2026–27 Edition)",
    alpExclusionsSummary: "Selected subtopics/sketches excluded across Units 1–9 per PECTAA No. 1238.",
    verificationNote:
      "Verified against PECTAA No. 1238 (6 Nov 2026): 60 theory marks (12 MCQs + 15/24 Short + 2/3 Long). Partial topic/subtopic exclusions applied.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1238],
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
  // CLASS 9 — MATHEMATICS (PUNJAB PECTAA No. 1238 ONLY)
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Mathematics-9 (2026–27 Edition)",
    alpExclusionsSummary: "Selective exercises/questions excluded per PECTAA No. 1238.",
    verificationNote:
      "Verified against PECTAA No. 1238 (6 Nov 2026): 75 Marks (15 MCQs + 18/27 Short + Part-II 2/3 & Part-III 1/2 Long). Topic/exercise deletions enforced.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1238],
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
  // CLASS 10 — MATHEMATICS (PUNJAB PECTAA No. 1257 ONLY)
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Mathematics-10 (2026–27 Edition)",
    alpExclusionsSummary: "Selective exercises/extensions excluded per PECTAA No. 1257.",
    verificationNote:
      "Verified against PECTAA No. 1257 (14 Nov 2026): 75 Marks (15 MCQs + 18/27 Short + Part-II 2/3 & Part-III 1/2 Long).",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1257],
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
  // CLASS 10 — PHYSICS & CHEMISTRY (PUNJAB PECTAA No. 1257 ONLY)
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Physics-10 (2026–27 Edition)",
    alpExclusionsSummary: "Selected theory topics & 8 Physics-10 practicals excluded per No. 1257.",
    verificationNote:
      "Verified PECTAA No. 1257 structure (60 theory + 30 practical). Verified question pool is partial—Chapter & Practice modes active.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1257],
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Chemistry-10 (2026–27 Edition)",
    alpExclusionsSummary: "Selected topics & 4 Chemistry-10 practicals excluded per No. 1257.",
    verificationNote:
      "Verified PECTAA No. 1257 structure (60 theory + 30 practical). Verified question pool is partial—Chapter & Practice modes active.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1257],
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Physics-11 (2026–27 Edition)",
    alpExclusionsSummary: "Per-chapter topic/numerical exclusions per No. 1239 (No. 1256 applies to Masihi Taleem-11 only).",
    verificationNote:
      "Verified against PECTAA No. 1239 (6 Nov 2026): 85 theory marks (17 MCQs + 22/33 Short + 3/5 Long). Partial pool populated for Chapter & Practice modes.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1239],
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Mathematics-11 (2026–27 Edition)",
    alpExclusionsSummary: "Selective exercises/theorems excluded per No. 1239.",
    verificationNote:
      "Verified against PECTAA No. 1239 (6 Nov 2026): 100 Marks (20 MCQs + 25/37 Short + 3/5 Long). Partial pool active for Chapter & Practice tests.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1239],
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Physics-12 (2026–27 Edition)",
    alpExclusionsSummary: "Deleted chapter subtopics & Grade 11–12 excluded practicals per No. 1258.",
    verificationNote:
      "Verified against PECTAA No. 1258 (14 Nov 2026): 85 theory marks (17 MCQs + 22/33 Short + 3/5 Long). Partial pool active.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1258],
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
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Mathematics-12 (2026–27 Edition)",
    alpExclusionsSummary: "Per-unit excluded exercises & examples tabulated in No. 1258.",
    verificationNote:
      "Verified against PECTAA No. 1258 (14 Nov 2026): 100 Marks (20 MCQs + 25/37 Short + 3/5 Long). Partial pool active.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1258],
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
  // VERIFIED CURRICULA WITH EMPTY QUESTION BANK (DECOUPLED HONEST DISCLOSURE)
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
    variantLabel: "Compulsory — Full Syllabus (Zero ALP Deletions)",
    groups: ["compulsory"],
    assessmentTrack: "theory",
    hasPracticalComponent: false,
    theoryMarks: 50,
    verificationStatus: "verified",
    curriculumStatus: "verified",
    syllabusPolicy: "full_syllabus_no_alp",
    textbookRef: "PCTB Tarjama-tul-Quran-ul-Majeed-9 (Full Syllabus)",
    alpExclusionsSummary: "None — full textbook syllabus active (PECTAA confirmed zero ALP deletions for Tarjama-tul-Quran Grades 9–12).",
    verificationNote:
      "Verified Full Syllabus Policy: PECTAA explicitly confirmed ZERO ALP / Smart Syllabus deletions exist for Tarjama-tul-Quran (Grades 9–12). Question bank authoring is currently at 0 verified items.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1238],
    alpApplied: false,
    slos: [],
    chapters: [
      {
        id: "pb-9-tarjama-s1",
        number: 1,
        title: "Full Textbook Surah Scope (No ALP Deletions)",
        isFullyExcluded: false,
        topics: [
          {
            id: "pb-9-tarjama-s1-t1",
            title: "All prescribed Makki & Madani Surahs in Class 9 textbook remain examinable",
            isExcluded: false,
          },
        ],
      },
    ],
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
    variantLabel: "Science Group (No. 1257)",
    groups: ["science"],
    assessmentTrack: "combined",
    hasPracticalComponent: true,
    theoryMarks: 60,
    practicalMarks: 30,
    verificationStatus: "verified",
    curriculumStatus: "verified",
    syllabusPolicy: "reduced_alp_active",
    textbookRef: "PCTB Biology-10 (2026–27 Edition · Chapters 1–10)",
    alpExclusionsSummary: "Selected topics & side boxes across Ch. 1–10 + 4 Biology-10 practicals excluded per PECTAA No. 1257.",
    verificationNote:
      "Curriculum Verified against PECTAA No. 1257 (60 theory + 30 practical; Ch. 1–10 ALP). Question bank contains 0 verified items yet — Practice & Simulation remain disabled until verified Biology-10 items are authored.",
    notificationRefs: [PUNJAB_NOTIFICATIONS_BY_ID.NO_1257],
    alpApplied: true,
    slos: [],
    chapters: [
      {
        id: "pb-10-bio-ch1",
        number: 1,
        title: "Ch 1: Gaseous Exchange",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-bio-ch1-t1", title: "Gaseous Exchange in Plants, Humans & Respiratory Disorders", isExcluded: false },
        ],
      },
      {
        id: "pb-10-bio-ch2",
        number: 2,
        title: "Ch 2: Homeostasis",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-bio-ch2-t1", title: "Osmoregulation, Thermoregulation & Human Urinary System", isExcluded: false },
        ],
      },
      {
        id: "pb-10-bio-ch3",
        number: 3,
        title: "Ch 3: Coordination and Control",
        isFullyExcluded: false,
        topics: [
          { id: "pb-10-bio-ch3-t1", title: "Nervous Coordination, Brain Structure, Receptors & Endocrine System", isExcluded: false },
        ],
      },
    ],
  },
];
