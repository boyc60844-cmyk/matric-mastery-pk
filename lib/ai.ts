// lib/ai.ts
// AI Doubt Solver service abstraction with local fallback and honest status handling.

export type LanguageMode = "english" | "urdu" | "roman-urdu";

export interface DoubtSolution {
  question: string;
  language: LanguageMode;
  isRealAI: boolean;
  statusMessage?: string;
  hasImage: boolean;
  simpleExplanation: string;
  stepByStep: string[];
  formula?: string;
  finalAnswer: string;
  quickTip: string;
  createdAt: string;
}

export interface StoredDoubt {
  id: string;
  question: string;
  language: LanguageMode;
  solution: DoubtSolution;
  timestamp: string;
}

const STORAGE_KEY = "mm_recent_doubts_v1";

// Curated curriculum knowledge fallback for instant, accurate student help
const CURRICULUM_KNOWLEDGE: {
  keywords: string[];
  solution: Omit<DoubtSolution, "question" | "language" | "isRealAI" | "createdAt" | "hasImage">;
}[] = [
  {
    keywords: ["quadratic", "discriminant", "roots", "b^2 - 4ac", "b2-4ac", "disc"],
    solution: {
      simpleExplanation:
        "The discriminant (b² - 4ac) tells you the nature of roots for any quadratic equation ax² + bx + c = 0 without solving the whole formula.",
      stepByStep: [
        "Write the equation in standard form: ax² + bx + c = 0.",
        "Identify coefficients a, b, and c.",
        "Calculate Disc = b² - 4ac.",
        "If Disc > 0 and a perfect square → Roots are Real, Rational, and Unequal.",
        "If Disc > 0 and NOT a perfect square → Roots are Real, Irrational, and Unequal.",
        "If Disc = 0 → Roots are Real and Equal (Repeated).",
        "If Disc < 0 → Roots are Imaginary (Complex Conjugates).",
      ],
      formula: "Discriminant = b² - 4ac  |  x = (-b ± √(b² - 4ac)) / (2a)",
      finalAnswer: "Use b² - 4ac to classify root types instantly in Section B short questions.",
      quickTip:
        "Examiner Hack: Always write the condition (Disc > 0, etc.) in a neat boxed header with a 605 marker for full 2/2 marks.",
    },
  },
  {
    keywords: ["cramer", "cramer's rule", "matrices", "cramers"],
    solution: {
      simpleExplanation:
        "Cramer's Rule uses determinants to solve a system of 2 linear equations in 2 variables (x and y).",
      stepByStep: [
        "Write equations in matrix form: AX = B, where A = [a b; c d], X = [x; y], B = [e; f].",
        "Find |A| = ad - bc. If |A| = 0, stop! The system is singular and cannot be solved.",
        "Form matrix Ax by replacing first column of A with constants B: Ax = [e b; f d]. Calculate |Ax|.",
        "Form matrix Ay by replacing second column of A with constants B: Ay = [a e; c f]. Calculate |Ay|.",
        "Compute x = |Ax| / |A| and y = |Ay| / |A|.",
        "Write final solution set: S.S. = {(x, y)}.",
      ],
      formula: "x = |Ax| / |A|,   y = |Ay| / |A|  (provided |A| ≠ 0)",
      finalAnswer: "S.S. = {(x, y)}. Always verify answers by plugging values into equation (1).",
      quickTip:
        "Punjab Board Board Topper Secret: Never skip writing the Solution Set in curly brackets {(x, y)} at the end. That last line is worth 1 full mark!",
    },
  },
  {
    keywords: ["newton", "second law", "f=ma", "force", "acceleration"],
    solution: {
      simpleExplanation:
        "Newton's Second Law defines how force creates acceleration in a mass. Greater the force, faster the acceleration.",
      stepByStep: [
        "State definition: When a net force acts on a body, it produces acceleration in the direction of the force.",
        "Show proportionality: a ∝ F (at constant mass) and a ∝ 1/m (at constant force).",
        "Combine relationships: a ∝ F/m  =>  F ∝ ma.",
        "In SI units, constant k = 1, so F = ma.",
        "State units: Force is in Newtons (N), where 1 N = 1 kg·m/s².",
      ],
      formula: "F = ma  (SI Unit: Newton = kg·m/s²)",
      finalAnswer: "F = ma. Acceleration is directly proportional to applied net force.",
      quickTip:
        "Physics Paper Hack: Write definition, mathematical form, and SI unit with its derivation. Draw a small box around F = ma.",
    },
  },
  {
    keywords: ["ohm", "ohm's law", "resistance", "v=ir", "voltage"],
    solution: {
      simpleExplanation:
        "Ohm's Law states that current flowing through a conductor is directly proportional to the potential difference across its ends, assuming physical conditions like temperature remain constant.",
      stepByStep: [
        "Statement: I ∝ V (Current is directly proportional to Voltage).",
        "Introduce constant of proportionality R (Resistance): V = IR.",
        "Define Resistance: Opposition offered by conductor to electric charge flow (Unit: Ohm, Ω).",
        "Draw circuit diagram: Battery, Key, Ammeter in series, Voltmeter in parallel across resistor.",
        "Mention limitation: Only applies to Ohmic conductors (metals). Fails for semiconductor diodes and thermistors.",
      ],
      formula: "V = IR  =>  R = V / I  (SI Unit: Ohm [Ω] = Volt / Ampere)",
      finalAnswer: "V = IR. The V-I graph is a straight line through the origin for metallic conductors.",
      quickTip:
        "Draw the V-I straight line graph with a 604 marker in your Punjab Board answer sheet for an instant 2/2 marks.",
    },
  },
  {
    keywords: ["avogadro", "mole", "particles", "6.022"],
    solution: {
      simpleExplanation:
        "A mole is the chemist's counting unit. One mole of any substance contains exactly 6.022 × 10²³ particles (atoms, molecules, or ions).",
      stepByStep: [
        "Identify given quantity (mass in grams or number of particles).",
        "Calculate Molar Mass (sum of atomic masses from periodic table).",
        "Number of moles (n) = Mass in grams / Molar Mass.",
        "Number of particles (N) = Number of moles (n) × Avogadro's Number (NA).",
        "Substitute NA = 6.022 × 10²³.",
      ],
      formula: "n = m / M  |  N = n × NA = (m / M) × 6.022 × 10²³",
      finalAnswer: "1 mole = 6.022 × 10²³ representative particles.",
      quickTip:
        "Chemistry Numerical Tip: Always write units at every calculation step (g, g/mol, mol). Punjab Board deduction rules take 0.5 marks for missing units!",
    },
  },
];

export async function solveDoubt(
  question: string,
  imagePreviewUrl?: string,
  language: LanguageMode = "english"
): Promise<DoubtSolution> {
  const cleanQ = question.trim().toLowerCase();
  const hasImage = Boolean(imagePreviewUrl);

  // Check matching knowledge base
  const matched = CURRICULUM_KNOWLEDGE.find((item) =>
    item.keywords.some((kw) => cleanQ.includes(kw))
  );

  if (matched) {
    let explanation = matched.solution.simpleExplanation;
    let finalAns = matched.solution.finalAnswer;
    let quickTip = matched.solution.quickTip;
    let steps = [...matched.solution.stepByStep];

    if (language === "urdu") {
      explanation = `وضاحت: ${explanation}۔ پنجاب بورڈ کے امتحانی اصولوں کے مطابق جواب کو نکات اور فارمولا کے ساتھ تحریر کریں۔`;
      finalAns = `حتمی جواب: ${finalAns}`;
      quickTip = `امتحانی ٹپ: ${quickTip}`;
    } else if (language === "roman-urdu") {
      explanation = `Aasaan Wazahatan: ${explanation}. Punjab Board k paper mein hamesha heading aur steps bana ker likhein.`;
      finalAns = `Final Answer: ${finalAns}`;
      quickTip = `Topper Tip: ${quickTip}`;
    }

    return {
      question,
      language,
      isRealAI: false,
      statusMessage: hasImage
        ? "Curriculum Engine matched topic. (Note: Direct OCR vision requires active cloud AI endpoint; analyzed based on question text)."
        : "Solved using Matric Mastery Verified Curriculum Engine.",
      hasImage,
      simpleExplanation: explanation,
      stepByStep: steps,
      formula: matched.solution.formula,
      finalAnswer: finalAns,
      quickTip,
      createdAt: new Date().toISOString(),
    };
  }

  // General structured breakdown for any matric question
  const isMathOrPhysics =
    cleanQ.includes("solve") ||
    cleanQ.includes("calculate") ||
    cleanQ.includes("find") ||
    cleanQ.includes("derive") ||
    cleanQ.includes("formula");

  return {
    question,
    language,
    isRealAI: false,
    statusMessage: hasImage
      ? "Analyzed question via Local Curriculum Solver. (Vision OCR requires external AI server connection)."
      : "Processed via Local Matric Mastery Study Engine.",
    hasImage,
    simpleExplanation:
      language === "urdu"
        ? "اس سوال کو حل کرنے کے لیے متعلقہ تعریف، بنیادی کلیہ (Formula) اور دی گئی قیمتیں ترتیب سے لکھیں۔"
        : language === "roman-urdu"
          ? "Is question ko solve karnay k liye pehle Given Data likhein, phir required formula lagayein aur step-by-step calculate karein."
          : `For "${question}": In Punjab Board examination marking schemes, answer structure directly determines your score. State given data, apply the standard syllabus formula, and provide step-by-step working.`,
    stepByStep: [
      "1. Given Data: Extract all known quantities with their correct SI units.",
      "2. To Find: Clearly state the unknown variable or requirement.",
      "3. Formula Application: Quote the standard textbook formula in a highlighted box.",
      "4. Calculation: Substitute values carefully without skipping algebraic steps.",
      "5. Result with Units: State the final numerical answer with appropriate SI unit and Solution Set format.",
    ],
    formula: isMathOrPhysics ? "Identify standard textbook relation (e.g. F = ma, v = s/t, or Quadratic Formula)" : undefined,
    finalAnswer:
      language === "urdu"
        ? "حتمی جواب کو ہمیشہ مارکر سے واضح نمایاں کریں اور یونٹ لازمی لکھیں۔"
        : "Always write your final answer in a neat 2-line box with appropriate units.",
    quickTip:
      "Examiner Golden Rule: Even if your final calculation contains a minor arithmetic error, writing the correct Given Data and Formula secures 60% of the total question marks!",
    createdAt: new Date().toISOString(),
  };
}

// Local storage management for doubts
export function loadSavedDoubts(): StoredDoubt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDoubtToHistory(question: string, solution: DoubtSolution): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadSavedDoubts();
    const newEntry: StoredDoubt = {
      id: `doubt-${Date.now()}`,
      question,
      language: solution.language,
      solution,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [newEntry, ...existing.slice(0, 19)]; // Keep last 20
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("mm_doubts_updated"));
  } catch (err) {
    console.error("Failed to save doubt history", err);
  }
}

export function deleteDoubt(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadSavedDoubts().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event("mm_doubts_updated"));
  } catch (err) {
    console.error("Failed to delete doubt", err);
  }
}

export function clearAllDoubts(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("mm_doubts_updated"));
  } catch (err) {
    console.error("Failed to clear doubts", err);
  }
}
