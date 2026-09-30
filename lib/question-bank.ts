// lib/question-bank.ts
// Question bank for Punjab Boards (Multan, Lahore, Rawalpindi, Faisalabad, etc.) and Federal Board (FBISE).
// High-yield syllabus items with answer schemes and marking criteria.

export type QuestionType = "mcq" | "short" | "long";

export interface MCQQuestion {
  id: string;
  type: "mcq";
  subject: string;
  grade: "Class 9" | "Class 10";
  chapter: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  marks: number;
}

export interface ShortQuestion {
  id: string;
  type: "short";
  subject: string;
  grade: "Class 9" | "Class 10";
  chapter: string;
  text: string;
  keyPoints: string[];
  markingRubric: string;
  marks: number;
}

export interface LongQuestion {
  id: string;
  type: "long";
  subject: string;
  grade: "Class 9" | "Class 10";
  chapter: string;
  text: string;
  subParts?: { label: string; text: string; marks: number }[];
  keyPoints: string[];
  marks: number;
}

export type AnyQuestion = MCQQuestion | ShortQuestion | LongQuestion;

export interface TestSyllabusSubject {
  name: string;
  classes: ("Class 9" | "Class 10")[];
  chapters: { [grade: string]: string[] };
}

export const SUBJECTS_CONFIG: TestSyllabusSubject[] = [
  {
    name: "Mathematics",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Matrices and Determinants",
        "Real and Complex Numbers",
        "Logarithms",
        "Algebraic Expressions & Formulas",
        "Linear Equations & Inequalities",
        "Triangles & Practical Geometry",
      ],
      "Class 10": [
        "Quadratic Equations",
        "Theory of Quadratic Equations",
        "Variations (Ratio & Proportion)",
        "Partial Fractions",
        "Sets and Functions",
        "Basic Statistics & Trigonometry",
      ],
    },
  },
  {
    name: "Physics",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Physical Quantities and Measurement",
        "Kinematics & Motion",
        "Dynamics & Newton's Laws",
        "Turning Effect of Forces",
        "Gravitation",
        "Work and Energy",
      ],
      "Class 10": [
        "Simple Harmonic Motion and Waves",
        "Sound & Acoustics",
        "Geometrical Optics",
        "Electrostatics & Coulomb's Law",
        "Current Electricity & Ohm's Law",
        "Electromagnetism & Nuclear Physics",
      ],
    },
  },
  {
    name: "Chemistry",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Fundamentals of Chemistry",
        "Structure of Atoms",
        "Periodic Table and Periodicity",
        "Structure of Molecules & Bonding",
        "Physical States of Matter",
        "Solutions & Solubility",
      ],
      "Class 10": [
        "Chemical Equilibrium & Law of Mass Action",
        "Acids, Bases and Salts",
        "Organic Chemistry & Functional Groups",
        "Hydrocarbons (Alkanes, Alkenes, Alkynes)",
        "Biochemistry",
        "Environmental Chemistry & Water",
      ],
    },
  },
  {
    name: "Biology",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Introduction to Biology",
        "Solving a Biological Problem",
        "Biodiversity & Classification",
        "Cells and Tissues",
        "Cell Cycle (Mitosis & Meiosis)",
        "Bioenergetics & Respiration",
      ],
      "Class 10": [
        "Gaseous Exchange",
        "Homeostasis & Osmoregulation",
        "Coordination and Control (Nervous System)",
        "Support and Movement",
        "Reproduction in Plants & Animals",
        "Inheritance & Genetics",
      ],
    },
  },
  {
    name: "Computer Science",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Problem Solving & Flowcharts",
        "Binary Computing & Number Systems",
        "Networks & Communication Protocols",
        "Data and Cyber Security",
        "Designing Website (HTML)",
      ],
      "Class 10": [
        "Introduction to Programming in C",
        "User Interaction & Input/Output",
        "Conditional Logic (if-else & switch)",
        "Data Structures and Loops",
        "Functions and Modular Programming",
      ],
    },
  },
  {
    name: "English",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Comprehension & Vocabulary",
        "Tenses and Active/Passive Voice",
        "Direct and Indirect Speech",
        "Formal Letters and Applications",
        "Summary Writing & Comprehension Passage",
      ],
      "Class 10": [
        "Essay Writing & Topics",
        "Direct and Indirect Speech Drill",
        "Pair of Words & Idioms",
        "Urdu to English Paragraph Translation",
        "Poem Comprehension & Central Idea",
      ],
    },
  },
  {
    name: "Pakistan Studies",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Ideological Basis of Pakistan",
        "Making of Pakistan (1906–1947)",
        "Land and Environment of Pakistan",
        "History of Pakistan: Initial Challenges",
      ],
      "Class 10": [
        "History of Pakistan (1971 to Present)",
        "Foreign Policy of Pakistan",
        "Economic Development & Industries",
        "Population, Society and Culture of Pakistan",
      ],
    },
  },
  {
    name: "Islamiat",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Surah Al-Anfal (Ayat & Translation)",
        "Ahadith-e-Nabawi (Selected Sayings)",
        "Touheed, Risalat and Malaika",
        "Quran Majeed: Preservation & Virtues",
      ],
      "Class 10": [
        "Surah Al-Ahzab (Key Verses & Tafseer)",
        "Ahadith Mubarak (Social Ethics & Character)",
        "Family Rights, Respect for Parents and Elders",
        "Jihad fi Sabilillah & National Defense",
      ],
    },
  },
];

// Curated question pool
export const QUESTION_POOL: AnyQuestion[] = [
  // --- Mathematics 9th & 10th ---
  {
    id: "math-01",
    type: "mcq",
    subject: "Mathematics",
    grade: "Class 9",
    chapter: "Matrices and Determinants",
    text: "If A = [2 0; 0 2], then A is called a:",
    options: ["Identity Matrix", "Scalar Matrix", "Singular Matrix", "Row Matrix"],
    correctIndex: 1,
    explanation: "A diagonal matrix whose non-zero diagonal entries are equal and not 1 is a scalar matrix.",
    marks: 1,
  },
  {
    id: "math-02",
    type: "mcq",
    subject: "Mathematics",
    grade: "Class 9",
    chapter: "Logarithms",
    text: "The characteristic of log 0.0034 is:",
    options: ["3", "-3 (3-bar)", "4", "-2"],
    correctIndex: 1,
    explanation: "There are 2 zeros after decimal before first significant digit 3, so characteristic is -(2+1) = -3 (written as 3-bar).",
    marks: 1,
  },
  {
    id: "math-03",
    type: "short",
    subject: "Mathematics",
    grade: "Class 9",
    chapter: "Matrices and Determinants",
    text: "Find the adjoint of matrix M = [1 2; 3 4] and state if M is singular or non-singular.",
    keyPoints: [
      "Interchange diagonal elements: [4 2; 3 1]",
      "Change signs of non-diagonal entries: adj(M) = [4 -2; -3 1]",
      "Calculate det(M) = (1)(4) - (2)(3) = 4 - 6 = -2 ≠ 0",
      "Conclusion: Non-singular because determinant is not equal to zero.",
    ],
    markingRubric: "1 mark for determinant check, 1 mark for correct adjoint matrix.",
    marks: 2,
  },
  {
    id: "math-04",
    type: "long",
    subject: "Mathematics",
    grade: "Class 9",
    chapter: "Matrices and Determinants",
    text: "Solve the following system of linear equations using Cramer's Rule:\n2x - 2y = 4\n3x + 2y = 6",
    keyPoints: [
      "Form matrix of coefficients: A = [2 -2; 3 2]",
      "Find det(A) = (2)(2) - (-2)(3) = 4 + 6 = 10",
      "Form Ax = [4 -2; 6 2], det(Ax) = (4)(2) - (-2)(6) = 8 + 12 = 20",
      "Form Ay = [2 4; 3 6], det(Ay) = (2)(6) - (4)(3) = 12 - 12 = 0",
      "x = det(Ax)/det(A) = 20/10 = 2",
      "y = det(Ay)/det(A) = 0/10 = 0",
      "Solution set: {(2, 0)}",
    ],
    marks: 8,
  },
  {
    id: "math-05",
    type: "mcq",
    subject: "Mathematics",
    grade: "Class 10",
    chapter: "Quadratic Equations",
    text: "Standard form of a quadratic equation in one variable x is:",
    options: ["ax + b = 0", "ax² + bx + c = 0 (a ≠ 0)", "ax³ + bx² + c = 0", "x² - 4 = 0"],
    correctIndex: 1,
    explanation: "Standard form is ax² + bx + c = 0 where a, b, c are real numbers and a ≠ 0.",
    marks: 1,
  },
  {
    id: "math-06",
    type: "short",
    subject: "Mathematics",
    grade: "Class 10",
    chapter: "Theory of Quadratic Equations",
    text: "Define discriminant of quadratic equation ax² + bx + c = 0 and find its value for 2x² - 7x + 3 = 0.",
    keyPoints: [
      "Discriminant formula: Disc = b² - 4ac",
      "Substitute: a = 2, b = -7, c = 3",
      "Disc = (-7)² - 4(2)(3) = 49 - 24 = 25",
      "Since Disc > 0 and a perfect square, roots are real, rational, and unequal.",
    ],
    markingRubric: "1 mark for formula and correct calculation, 1 mark for nature of roots.",
    marks: 2,
  },

  // --- Physics ---
  {
    id: "phy-01",
    type: "mcq",
    subject: "Physics",
    grade: "Class 9",
    chapter: "Kinematics & Motion",
    text: "Which of the following is a vector quantity?",
    options: ["Speed", "Distance", "Displacement", "Mass"],
    correctIndex: 2,
    explanation: "Displacement has both magnitude and specific direction, making it a vector quantity.",
    marks: 1,
  },
  {
    id: "phy-02",
    type: "short",
    subject: "Physics",
    grade: "Class 9",
    chapter: "Dynamics & Newton's Laws",
    text: "State Newton's Second Law of Motion and write its mathematical formula.",
    keyPoints: [
      "Statement: When a net force acts on a body, it produces an acceleration in the direction of the force.",
      "Acceleration is directly proportional to the force and inversely proportional to the mass.",
      "Formula: F = ma (Force in Newtons, mass in kg, acceleration in m/s²).",
    ],
    markingRubric: "1 mark for definition, 1 mark for formula and SI units.",
    marks: 2,
  },
  {
    id: "phy-03",
    type: "long",
    subject: "Physics",
    grade: "Class 9",
    chapter: "Kinematics & Motion",
    text: "Derive the Third Equation of Motion (2aS = vf² - vi²) using a speed-time graph.",
    keyPoints: [
      "Draw speed-time graph with initial velocity vi and final velocity vf after time t.",
      "Total area under speed-time graph represents distance S covered.",
      "Area of trapezium OABD = (Sum of parallel sides / 2) × height = ((vi + vf) / 2) × t",
      "From 1st equation of motion: a = (vf - vi) / t  =>  t = (vf - vi) / a",
      "Substitute t: S = ((vf + vi)/2) × ((vf - vi)/a) = (vf² - vi²) / 2a",
      "Hence, 2aS = vf² - vi².",
    ],
    marks: 8,
  },
  {
    id: "phy-04",
    type: "mcq",
    subject: "Physics",
    grade: "Class 10",
    chapter: "Simple Harmonic Motion and Waves",
    text: "In simple harmonic motion (SHM), the restoring force is directly proportional to:",
    options: ["Mass", "Velocity", "Displacement from mean position", "Time period"],
    correctIndex: 2,
    explanation: "According to Hooke's Law and SHM definition, F = -kx, restoring force is directly proportional to displacement.",
    marks: 1,
  },
  {
    id: "phy-05",
    type: "short",
    subject: "Physics",
    grade: "Class 10",
    chapter: "Current Electricity & Ohm's Law",
    text: "State Ohm's Law and mention its limitation.",
    keyPoints: [
      "Statement: The current passing through a conductor is directly proportional to the potential difference across its ends, provided temperature and physical state remain constant.",
      "Formula: V = IR",
      "Limitation: Holds only for ohmic conductors at constant temperature; fails for filaments and semiconductors.",
    ],
    markingRubric: "1 mark for statement and formula, 1 mark for limitation.",
    marks: 2,
  },

  // --- Chemistry ---
  {
    id: "chem-01",
    type: "mcq",
    subject: "Chemistry",
    grade: "Class 9",
    chapter: "Fundamentals of Chemistry",
    text: "The number of particles in 1 mole of any substance is equal to:",
    options: ["6.022 × 10²³", "3.011 × 10²³", "1.66 × 10⁻²⁴", "9.11 × 10⁻³¹"],
    correctIndex: 0,
    explanation: "Avogadro's number is 6.022 × 10²³ particles per mole.",
    marks: 1,
  },
  {
    id: "chem-02",
    type: "short",
    subject: "Chemistry",
    grade: "Class 9",
    chapter: "Structure of Atoms",
    text: "Differentiate between Rutherford's Atomic Model and Bohr's Atomic Model (two points).",
    keyPoints: [
      "Rutherford: Based on classical theory, suggested electrons orbit continuously emitting energy and spiral into nucleus.",
      "Bohr: Based on quantum theory, proposed electrons revolve in fixed discrete orbits of quantized energy without radiating.",
      "Rutherford predicted continuous spectrum, while Bohr proved line spectrum.",
    ],
    markingRubric: "1 mark for each valid difference point.",
    marks: 2,
  },
  {
    id: "chem-03",
    type: "long",
    subject: "Chemistry",
    grade: "Class 10",
    chapter: "Acids, Bases and Salts",
    text: "Explain the Arrhenius and Bronsted-Lowry concepts of acids and bases with suitable chemical equations.",
    keyPoints: [
      "Arrhenius Concept: Acid produces H+ ions in aqueous solution (e.g. HCl → H+ + Cl-). Base produces OH- ions in aqueous solution (e.g. NaOH → Na+ + OH-).",
      "Limitations of Arrhenius: Restricted to aqueous media; cannot explain acidity of CO2 or basicity of NH3.",
      "Bronsted-Lowry Concept: Acid is a proton (H+) donor; Base is a proton (H+) acceptor.",
      "Conjugate Acid-Base Pairs: HCl + H2O ⇌ H3O+ + Cl- (HCl is acid, Cl- is conjugate base).",
    ],
    marks: 8,
  },

  // --- Computer Science ---
  {
    id: "cs-01",
    type: "mcq",
    subject: "Computer Science",
    grade: "Class 10",
    chapter: "Introduction to Programming in C",
    text: "Which header file is required to use printf() and scanf() in C?",
    options: ["<conio.h>", "<stdio.h>", "<math.h>", "<stdlib.h>"],
    correctIndex: 1,
    explanation: "stdio.h stands for Standard Input Output header file containing definitions of printf and scanf.",
    marks: 1,
  },
  {
    id: "cs-02",
    type: "short",
    subject: "Computer Science",
    grade: "Class 10",
    chapter: "Conditional Logic (if-else & switch)",
    text: "What is the purpose of the 'break' statement in a C switch statement?",
    keyPoints: [
      "Prevents fall-through execution to subsequent case blocks.",
      "Immediately terminates the switch structure once a matching case executes.",
    ],
    markingRubric: "2 marks for clear explanation with fall-through concept.",
    marks: 2,
  },

  // --- English ---
  {
    id: "eng-01",
    type: "mcq",
    subject: "English",
    grade: "Class 9",
    chapter: "Tenses and Active/Passive Voice",
    text: "Identify the correct passive voice: 'The student wrote an essay.'",
    options: [
      "An essay was written by the student.",
      "An essay is written by the student.",
      "An essay had been written by the student.",
      "An essay has been written by the student.",
    ],
    correctIndex: 0,
    explanation: "Simple past tense converts to was/were + 3rd form of verb (past participle).",
    marks: 1,
  },
  {
    id: "eng-02",
    type: "short",
    subject: "English",
    grade: "Class 10",
    chapter: "Direct and Indirect Speech Drill",
    text: "Convert into indirect speech: She said, 'I have completed my homework.'",
    keyPoints: [
      "Reporting verb 'said' remains 'said that'.",
      "Pronoun 'I' changes to 'she' and 'my' to 'her'.",
      "Present perfect 'have completed' changes to past perfect 'had completed'.",
      "Result: She said that she had completed her homework.",
    ],
    markingRubric: "1 mark for pronoun change, 1 mark for tense conversion.",
    marks: 2,
  },

  // --- Pakistan Studies & Islamiat ---
  {
    id: "pak-01",
    type: "mcq",
    subject: "Pakistan Studies",
    grade: "Class 9",
    chapter: "Ideological Basis of Pakistan",
    text: "The Lahore Resolution was passed on:",
    options: ["23rd March 1940", "14th August 1947", "3rd June 1947", "21st April 1938"],
    correctIndex: 0,
    explanation: "The historic Pakistan Resolution was moved by A.K. Fazlul Huq and adopted on 23rd March 1940 at Minto Park, Lahore.",
    marks: 1,
  },
  {
    id: "pak-02",
    type: "short",
    subject: "Pakistan Studies",
    grade: "Class 9",
    chapter: "Ideological Basis of Pakistan",
    text: "Write two sayings of Quaid-e-Azam regarding the Ideology of Pakistan.",
    keyPoints: [
      "Speech at Muslim University Aligarh (1944): 'Pakistan was created the day the first non-Muslim became a Muslim in the Subcontinent.'",
      "Presidential Address at Lahore (1940): 'Hindus and Muslims belong to two different religious philosophies, social customs, and literatures.'",
    ],
    markingRubric: "1 mark for each quote with context.",
    marks: 2,
  },
];

export interface GeneratedMockTest {
  id: string;
  className: "Class 9" | "Class 10";
  subject: string;
  chapter: string;
  totalMarks: number;
  durationMinutes: number;
  questions: AnyQuestion[];
}

export function generateMockTest(
  className: "Class 9" | "Class 10",
  subject: string,
  chapter: string,
  targetMarks: 25 | 50 | 75,
  customDurationMinutes?: number
): GeneratedMockTest {
  // Filter available questions
  let matched = QUESTION_POOL.filter(
    (q) => q.grade === className && q.subject.toLowerCase() === subject.toLowerCase()
  );

  if (chapter && chapter !== "All Chapters") {
    const chapterMatched = matched.filter((q) => q.chapter === chapter);
    if (chapterMatched.length >= 3) {
      matched = chapterMatched;
    }
  }

  // If pool is sparse for this specific chapter, fall back to broader subject pool
  if (matched.length === 0) {
    matched = QUESTION_POOL.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
  }

  // If still empty, fall back to any grade questions
  if (matched.length === 0) {
    matched = QUESTION_POOL;
  }

  const mcqs = matched.filter((q) => q.type === "mcq") as MCQQuestion[];
  const shorts = matched.filter((q) => q.type === "short") as ShortQuestion[];
  const longs = matched.filter((q) => q.type === "long") as LongQuestion[];

  const questions: AnyQuestion[] = [];
  let duration = customDurationMinutes || 30;

  if (targetMarks === 25) {
    duration = customDurationMinutes || 30;
    // 5 MCQs (5m), 5 Short (10m), 1 Long (10m) = 25m
    questions.push(...mcqs.slice(0, 5));
    questions.push(...shorts.slice(0, 5));
    if (longs.length > 0) questions.push(longs[0]);
  } else if (targetMarks === 50) {
    duration = customDurationMinutes || 60;
    // 10 MCQs (10m), 10 Short (20m), 2 Long (20m) = 50m
    questions.push(...mcqs.slice(0, 10));
    questions.push(...shorts.slice(0, 10));
    questions.push(...longs.slice(0, 2));
  } else {
    // 75 Marks Standard Board Pattern
    duration = customDurationMinutes || 90;
    // 15 MCQs (15m), 15 Short (30m), 3 Long (30m) = 75m
    questions.push(...mcqs.slice(0, 15));
    questions.push(...shorts.slice(0, 15));
    questions.push(...longs.slice(0, 3));
  }

  // Ensure we have at least some questions
  if (questions.length === 0) {
    questions.push(...matched.slice(0, 5));
  }

  return {
    id: `mock-${Date.now()}`,
    className,
    subject,
    chapter: chapter || "Full Syllabus",
    totalMarks: targetMarks,
    durationMinutes: duration,
    questions,
  };
}
