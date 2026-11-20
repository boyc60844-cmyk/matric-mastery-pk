// lib/question-bank.ts
// Legacy read-only compatibility adapter preserved exclusively for untouched /app/past-papers/page.tsx.
// All flawed random/placeholder Mock Test generation (`generateMockTest`) has been permanently removed.
// Active Mock Tests platform & exam engine now live under `/lib/mock-tests/`.

import { RAW_QUESTION_BANK } from "@/lib/mock-tests/question-bank/questionRegistry";

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
      "Class 9": ["Ch 1: Matrices and Determinants", "Ch 3: Logarithms", "Ch 4: Algebraic Expressions"],
      "Class 10": ["Ch 1: Quadratic Equations", "Ch 2: Theory of Quadratic Equations", "Ch 3: Variations"],
    },
  },
  {
    name: "Physics",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": ["Ch 1: Physical Quantities & Measurement", "Ch 2: Kinematics", "Ch 3: Dynamics", "Ch 4: Turning Effect of Forces"],
      "Class 10": ["Ch 10: SHM & Waves", "Ch 12: Geometrical Optics", "Ch 14: Current Electricity"],
    },
  },
  {
    name: "Chemistry",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": ["Fundamentals of Chemistry", "Structure of Atoms"],
      "Class 10": ["Ch 9: Chemical Equilibrium", "Ch 10: Acids, Bases and Salts"],
    },
  },
  {
    name: "Computer Science",
    classes: ["Class 9", "Class 10"],
    chapters: {
      "Class 9": [
        "Unit 1: Introduction to Systems",
        "Unit 3: Digital Systems and Logic Design",
        "Unit 4: System Troubleshooting",
        "Unit 5: Software System",
        "Unit 6: Introduction to Computer Networks",
        "Unit 7: Computational Thinking",
        "Unit 8: Web Development with HTML, CSS and JS",
        "Unit 9: Data Science and Data Gathering",
      ],
      "Class 10": [
        "Unit 1: Operating Systems: Structure & Services",
        "Unit 3: Introduction to Python Programming",
        "Unit 4: Control Structures in Python",
        "Unit 5: Data Science",
        "Unit 6: Introduction to AI and Machine Learning",
        "Unit 7: Applications of AI",
        "Unit 8: Digital Entrepreneurship",
      ],
    },
  },
];

const SUBJECT_NAME_MAP: Record<string, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  "computer-science": "Computer Science",
};

export const QUESTION_POOL: AnyQuestion[] = RAW_QUESTION_BANK.filter(
  (q) =>
    (q.grade === 9 || q.grade === 10) &&
    q.validationStatus === "Verified" &&
    q.eligibilityStatus === "eligible" &&
    (q.type === "single_mcq" || q.type === "short_answer" || q.type === "extended_response")
).map((q): AnyQuestion => {
  const grade = q.grade === 9 ? "Class 9" : "Class 10";
  const subject = SUBJECT_NAME_MAP[q.subjectId] || q.subjectId;
  if (q.type === "single_mcq") {
    return {
      id: q.id,
      type: "mcq",
      subject,
      grade,
      chapter: q.chapterId,
      text: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      marks: q.marks,
    };
  }
  if (q.type === "short_answer") {
    return {
      id: q.id,
      type: "short",
      subject,
      grade,
      chapter: q.chapterId,
      text: q.prompt,
      keyPoints: q.markingPoints,
      markingRubric: q.modelAnswer,
      marks: q.marks,
    };
  }
  return {
    id: q.id,
    type: "long",
    subject,
    grade,
    chapter: q.chapterId,
    text: q.prompt,
    keyPoints: q.type === "extended_response" ? q.markingPoints : [],
    marks: q.marks,
  };
});
