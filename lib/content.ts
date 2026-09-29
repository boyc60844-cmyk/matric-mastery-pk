export type StrategyCategory =
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "English"
  | "Pakistan Studies"
  | "Islamiat"
  | "Computer Science"
  | "Exam Hacks"
  | "Time Management"
  | "Mindset";

export type GradeLevel = "Class 9" | "Class 10" | "All Grades";

export type StrategyArticle = {
  slug: string;
  category: StrategyCategory;
  subject: string;
  grade: GradeLevel;
  tag: string;
  tags: string[];
  title: string;
  readTime: string;
  image: string;
  author: string;
  date: string;
  description: string;
  intro: string;
  quickWin?: string;
  mistakes?: string[];
  steps?: string[];
  bullets: { label: string; text: string }[];
  example?: string;
  finalTip: string;
  learningPath?: "starting-matric" | "finishing-strong" | "exam-day";
};

export const strategyArticles: StrategyArticle[] = [
  // -------------------------------------------------------------
  // 1. MATHEMATICS
  // -------------------------------------------------------------
  {
    slug: "math-mcq-elimination",
    category: "Mathematics",
    subject: "Mathematics",
    grade: "All Grades",
    tag: "MATH",
    tags: ["Math", "MCQs", "Elimination", "Time Management", "Paper Strategy"],
    title: "Math MCQs: The Elimination Game",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-math-strategy/1200/700",
    author: "Hamza",
    date: "Aug 14",
    description:
      "You don't need to solve every MCQ properly. You need to get rid of the wrong ones fast.",
    intro:
      "Let's be honest, in the exam hall you don't have time to solve all 15 MCQs with full working like a topper's notebook. You have four minutes, maybe less. So stop solving from scratch. Start eliminating.",
    quickWin:
      "Cross out opposite signs (+/-) and impossible orders of magnitude before picking up your pencil. Usually two options vanish instantly.",
    mistakes: [
      "Spending 5 minutes solving one 1-mark quadratic equation step-by-step.",
      "Changing your first intuitive MCQ bubble at the last minute without solid algebraic proof.",
    ],
    steps: [
      "Scan the question and identify impossible values (negative lengths, angles over 180° in triangles).",
      "Substitute options back into the equation instead of factoring from zero.",
      "Use rough decimal rounding for complex square roots or fractions.",
      "Bubble immediately on the sheet — never leave bubbles for the final bell.",
    ],
    bullets: [
      {
        label: "Kill the obvious traps first",
        text: "Every MCQ has one option that's just there to waste your time. Wrong sign, wrong unit, wrong power of ten. Cross it before you calculate anything.",
      },
      {
        label: "Plug numbers back in",
        text: "For algebra and linear equations, don't solve, substitute. Put each option back into the question. It's faster and skips silly factoring mistakes.",
      },
      {
        label: "Use rough estimation",
        text: "If the question asks for something close to 45 and one option says 450, that option is gone. Rough estimate first, real calculation second.",
      },
      {
        label: "Never leave an MCQ blank",
        text: "There's no negative marking on Punjab board papers. A blank bubble and a wrong bubble get you the exact same zero. A guess after elimination is free probability.",
      },
    ],
    example:
      "If 2x² - 8 = 0, don't write quadratic formula steps. Notice immediately that 2(2)² = 8, so x = ±2. Eliminate options A (4) and C (16) instantly.",
    finalTip:
      "Elimination isn't cheating, it's time management. The checker doesn't see your rough margin anyway, they just see the bubble. Save your mental stamina for long questions.",
    learningPath: "exam-day",
  },
  {
    slug: "math-long-question-time",
    category: "Mathematics",
    subject: "Mathematics",
    grade: "Class 10",
    tag: "MATH",
    tags: ["Math", "Long Questions", "Time Management", "Class 10", "Pacing"],
    title: "The Long-Question Time Strategy",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/matric-math-long/1200/700",
    author: "Hamza",
    date: "Aug 18",
    description:
      "Allocating time by marks, identifying lengthy theorem traps, and keeping 15 minutes of buffer.",
    intro:
      "Most students don't lose marks in Math because they don't know the chapter. They lose marks because Section II long questions swallow 75% of their total exam time before they reach Question 9 theorems.",
    quickWin:
      "Calculate your maximum allowed minutes per question right on your rough page: exactly 1.2 minutes per mark. An 8-mark question gets 10 minutes max.",
    mistakes: [
      "Restarting a 4-mark part from scratch on a brand new page after making one arithmetic blunder.",
      "Attempting an unfamiliar geometry construction when clean algebra long questions are available in the choice.",
    ],
    steps: [
      "Select your 3 pairs of long questions during the initial 5-minute reading period.",
      "Start with the theorem (Q.9 is compulsory) while your diagram hand is steady and unhurried.",
      "Execute algebraic long questions (Matrices, Quadratic, Variations) with boxed step titles.",
      "Cap each question part at 8 minutes. If stuck, leave half a page and advance.",
    ],
    bullets: [
      {
        label: "Lock Theorem (Q9) First",
        text: "Theorem is 8 guaranteed marks. Do it right after short questions while your memory of the given, to prove, and construction figures is fresh.",
      },
      {
        label: "Respect the Pair Rule",
        text: "Remember Punjab board pairs questions strictly: (a) and (b) must belong to the exact same main question number. Never mix Q5(a) with Q6(b).",
      },
      {
        label: "Pre-screen length traps",
        text: "Partial fractions and synthetic division look deceptively short but take 3 pages of fraction arithmetic. Pick Cramer's Rule or Matrix Inversion if available.",
      },
      {
        label: "Keep 15 minutes for sign audit",
        text: "Math marks bleed at negative signs (- × - = +). Reserve 15 minutes to re-audit signs without re-solving entire equations.",
      },
    ],
    example:
      "Question budget split: Section I Short Questions = 45 mins. Q9 Theorem = 15 mins. Long Pair 1 = 18 mins. Long Pair 2 = 18 mins. Checking buffer = 14 mins.",
    finalTip:
      "A long question is just two short questions joined together with an (a) and (b). Treat each part like an isolated 4-mark sprint.",
    learningPath: "finishing-strong",
  },
  {
    slug: "math-show-your-working",
    category: "Mathematics",
    subject: "Mathematics",
    grade: "All Grades",
    tag: "MATH",
    tags: ["Math", "Presentation", "Working Steps", "Board Checker"],
    title: "Show Your Working: How Board Checkers Award Step Marks",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-math-working/1200/700",
    author: "Hamza",
    date: "Aug 24",
    description:
      "Readable intermediate steps, avoiding unexplained jumps, and separating working from the final answer.",
    intro:
      "Checkers in BISE Multan and Lahore have a key sheet with mark distributions: 1 mark for formula, 1 mark for substitution, 1 mark for simplification, 1 mark for final result. Skipping straight to the answer risks losing 3 out of 4 marks.",
    quickWin:
      "Write the general formula on its own line before substituting numbers. Even if your arithmetic breaks down later, the formula line banks an automatic mark.",
    mistakes: [
      "Doing mental math and writing 'Hence x = 3' without showing the intermediate factored brackets.",
      "Scribbling rough work right in the middle of your main answer column instead of in a designated right margin.",
    ],
    steps: [
      "Rule a 1.5-inch rough margin on the right edge labeled 'Rough Work'.",
      "Write formula with standard symbols (e.g., x = [-b ± √(b² - 4ac)] / 2a).",
      "Substitute values explicitly on line 2.",
      "Show at least two reduction lines before boxing the final solution set.",
    ],
    bullets: [
      {
        label: "Explicit Factor Steps",
        text: "When factoring x² - 5x + 6 = 0, write x² - 2x - 3x + 6 = 0, then x(x - 2) - 3(x - 2) = 0. Never skip the middle group line.",
      },
      {
        label: "Solution Sets Need Brackets",
        text: "For equations, always write: Solution Set = { ... }. Punjab board marking keys explicitly dock half a mark if solution sets lack curly braces.",
      },
      {
        label: "Align Equals Signs Vertically",
        text: "Keep the '=' signs stacked vertically down the page. It takes zero extra effort and makes your paper look like a printed solution manual.",
      },
    ],
    example:
      "Correct format:\n  Given: 3x + 4 = 19\n  Step 1: 3x = 19 - 4\n  Step 2: 3x = 15\n  Step 3: x = 15/3\n  Result: x = 5  => Solution Set = { 5 }",
    finalTip:
      "Presentation cannot fix incorrect math, but clear steps make sure you get 3 out of 4 marks even when a small calculation slips at the finish line.",
  },
  {
    slug: "math-stuck-recovery",
    category: "Mathematics",
    subject: "Mathematics",
    grade: "All Grades",
    tag: "MATH",
    tags: ["Math", "Mindset", "Problem Solving", "Exam Hall", "Panic Control"],
    title: "The Stuck-On-A-Question Recovery Plan",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-math-stuck/1200/700",
    author: "Hamza",
    date: "Aug 29",
    description:
      "What to do when the method is forgotten, calculations get messy, or the next step is completely unclear.",
    intro:
      "You're in the middle of Question 4, your pencil stops, and the quadratic equation is refusing to factor into integers. Your heart starts pounding. Here is the exact 4-step protocol I use when an answer collapses.",
    quickWin:
      "Drop the pencil, take two deep breaths, and check if you copied the original question signs correctly from the paper. In 60% of stuck questions, a minus became a plus during copying.",
    mistakes: [
      "Staring at the frozen line for 8 consecutive minutes waiting for inspiration to strike.",
      "Scribbling massive angry black ink spirals over half the sheet.",
    ],
    steps: [
      "Verify the copied numbers and signs against the official question paper.",
      "Check if another method applies (e.g. if factoring fails, switch to the quadratic formula).",
      "Draw one single clean horizontal line through the flawed step.",
      "Leave 10 lines of space, write the next question number, and move on immediately.",
    ],
    bullets: [
      {
        label: "The Sign Audit",
        text: "Compare line 1 with the printed paper word-for-word. Check powers, square roots, and parentheses. A copied minus sign is the #1 culprit.",
      },
      {
        label: "Switch Methods",
        text: "If factoring isn't revealing integer roots within 90 seconds, use the formula x = (-b ± √D) / 2a. The formula is mechanical and bypasses creative guessing.",
      },
      {
        label: "Bank Partial Steps",
        text: "Never cross out what you've done until you've rewritten the correct version. A partially correct attempt still scores partial marks if time runs out.",
      },
    ],
    finalTip:
      "Being stuck is normal. Staying stuck is a choice. Move to an easy question, rebuild your momentum, and return in the final 15 minutes.",
    learningPath: "exam-day",
  },

  // -------------------------------------------------------------
  // 2. PHYSICS
  // -------------------------------------------------------------
  {
    slug: "physics-strategy",
    category: "Physics",
    subject: "Physics",
    grade: "Class 10",
    tag: "PHYSICS",
    tags: ["Physics", "Numericals", "Presentation", "Science", "Formulas"],
    title: "The Physics Numerical Formula: 5 Out of 5 Marks",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/matric-physics-strategy/1200/700",
    author: "Hamza",
    date: "Aug 28",
    description:
      "Most physics marks aren't lost on the formula. They're lost on the steps around the formula.",
    intro:
      "Here's the real scene with physics numericals: you calculate the number 2500 correctly on your calculator, but only get 2 out of 5 marks on the sheet. Why? Because board checkers follow an explicit 5-step marking rubric.",
    quickWin:
      "Use the magic 5-block structure on every numerical: Given Data → To Find → Formula → Calculation → Final Result with Box.",
    mistakes: [
      "Writing 'F = ma = 10 * 2 = 20' on a single squished horizontal line.",
      "Forgetting SI unit conversion in given data (e.g. leaving mass in grams instead of kg).",
    ],
    steps: [
      "Write 'Given Data:' and list all symbols with their SI converted units.",
      "Write 'To Find:' and name the unknown variable with a question mark.",
      "Write 'Formula:' centered on its own line with no numbers plugged in yet.",
      "Write 'Calculation:' showing clear step-by-step substitution and arithmetic.",
      "Box the final number and attach the correct bold SI unit (e.g. [ 2500 J ]).",
    ],
    bullets: [
      {
        label: "Write 'Given' and 'To Find' Every Time",
        text: "This alone carries 1 to 1.5 marks on the Punjab board key. Even if your calculation goes wild, this mark is yours forever.",
      },
      {
        label: "State the Formula Separately",
        text: "Don't jump straight into numbers. A checker scans specifically for the formula line to tick the marking grid.",
      },
      {
        label: "Carry Units Through Steps",
        text: "Writing units through calculations proves dimensional consistency and prevents confusing cm with meters.",
      },
      {
        label: "Box the Result",
        text: "Make the final value impossible to miss for an examiner grading 200 sheets a day.",
      },
    ],
    example:
      "Given Data:\n• Mass (m) = 50 kg\n• Velocity (v) = 10 m s⁻¹\n\nTo Find:\n• Kinetic Energy (K.E.) = ?\n\nFormula:\n  K.E. = ½ m v²\n\nCalculation:\n  K.E. = ½ × (50 kg) × (10 m s⁻¹)²\n  K.E. = 25 × 100\n\nResult:\n  [ K.E. = 2500 J ]",
    finalTip:
      "Treat every numerical like a 5-mark treasure hunt: Given (1), Formula (1), Substitution (1), Calculation (1), Unit (1). Don't leave any behind.",
    learningPath: "starting-matric",
  },
  {
    slug: "physics-units-mistakes",
    category: "Physics",
    subject: "Physics",
    grade: "All Grades",
    tag: "PHYSICS",
    tags: ["Physics", "Units", "SI Units", "Careless Errors"],
    title: "Units Can Save You From Silly Mistakes",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-physics-units/1200/700",
    author: "Hamza",
    date: "Sep 01",
    description:
      "Covering units, conversions, final-answer sanity checks, and common careless errors.",
    intro:
      "A car moving at 72 km/h does NOT mean v = 72 in your equation. If you plug 72 into v = d/t, your entire answer is wrong by a factor of 3.6. Unit conversions are the silent mark killer in Physics.",
    quickWin:
      "Convert every km/h to m/s immediately in the Given Data by multiplying by 1000/3600 (or dividing by 3.6).",
    mistakes: [
      "Writing Force = 50 without 'N' or energy = 300 without 'J'. A number without a unit is meaningless in Physics.",
      "Leaving time in minutes instead of converting to seconds (1 min = 60 s).",
    ],
    steps: [
      "Check Mass: Convert grams (g) to kilograms (kg) by dividing by 1000.",
      "Check Distance: Convert cm or mm to meters (m).",
      "Check Time: Convert minutes or hours to seconds (s).",
      "Check Temperature: In thermodynamics, convert Celsius (°C) to Kelvin (K) by adding 273.",
    ],
    bullets: [
      {
        label: "The Conversion Table in Your Head",
        text: "1 km = 1000 m | 1 cm = 10⁻² m | 1 mm = 10⁻³ m | 1 hour = 3600 s | 1 g = 10⁻³ kg.",
      },
      {
        label: "Sanity Check the Final Value",
        text: "If you calculate the speed of a pedestrian as 450 m/s (faster than sound), stop. Check your units.",
      },
      {
        label: "Power of Ten Caution",
        text: "When dealing with micro (µ = 10⁻⁶) or milli (m = 10⁻³), write the scientific notation directly in Given Data.",
      },
    ],
    finalTip:
      "Never leave a final numerical answer bare. If you completely blank on the unit, write the formula symbols (e.g. kg·m/s² for Force). Checkers frequently give benefit of doubt.",
  },
  {
    slug: "physics-diagrams-guide",
    category: "Physics",
    subject: "Physics",
    grade: "Class 10",
    tag: "PHYSICS",
    tags: ["Physics", "Diagrams", "Ray Diagrams", "Circuits", "Presentation"],
    title: "Physics Diagrams That Actually Help (Without Being Art)",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-physics-diagrams/1200/700",
    author: "Hamza",
    date: "Sep 04",
    description:
      "Clean diagrams, arrows, appropriate scale, and avoiding unnecessary artistic detail.",
    intro:
      "A physics diagram is not a portrait. The checker doesn't care if your battery looks 3D with shading. They care if the arrows show conventional current flowing from positive to negative and if optical ray diagrams have arrows indicating direction.",
    quickWin:
      "Always put directional arrows on ray diagrams and electric circuits. A ray without an arrow is considered a static geometric line and loses full marks.",
    mistakes: [
      "Drawing light rays with wavy freehand lines instead of using a plastic ruler.",
      "Using colored markers or highlighters inside the diagram. Stick strictly to sharp HB pencil and blue pointer.",
    ],
    steps: [
      "Dedicate at least 6 to 8 lines of height for any optical or circuit diagram.",
      "Draw the principal axis, lenses, or circuit components using a straight ruler.",
      "Mark focal points (F) and center of curvature (2F) at equal measured distances.",
      "Label all key terminals (+/-, F, 2F, Object, Image) horizontally in clear print letters.",
    ],
    bullets: [
      {
        label: "Rays Need Arrows",
        text: "In reflection and refraction, every single light ray must have a direction arrow. No arrow = zero diagram marks.",
      },
      {
        label: "Circuits Need Polarities",
        text: "Mark long line as positive (+) and short thick line as negative (-) on DC sources. Show ammeters in series, voltmeters in parallel.",
      },
      {
        label: "Labels Belong on One Side",
        text: "Align labels on the right-hand side using clean horizontal leader lines rather than crisscrossing arrows.",
      },
    ],
    finalTip:
      "Draw diagrams before writing long theoretical paragraphs. When the diagram is clean, the checker knows you understand the concept and skims the paragraph generously.",
  },
  {
    slug: "physics-forgot-formula",
    category: "Physics",
    subject: "Physics",
    grade: "All Grades",
    tag: "PHYSICS",
    tags: ["Physics", "Formulas", "Recall", "Dimensional Analysis"],
    title: "When You Forget the Exact Physics Formula",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-physics-recall/1200/700",
    author: "Hamza",
    date: "Sep 07",
    description:
      "Legitimate recovery methods using units and dimensional logic without pretending fake work.",
    intro:
      "You remember that Pressure, Force, and Area are related, but is it P = F/A or P = F × A? Don't flip a mental coin. Use the unit of Pressure to rebuild the formula with 100% certainty.",
    quickWin:
      "Look at the unit! Pressure is measured in N/m² (Newtons per square meter). Newton is Force, m² is Area. Therefore, P = Force / Area. Units literally tell you the formula.",
    mistakes: [
      "Inventing a formula that makes zero dimensional sense just to write something.",
      "Skipping the numerical completely instead of writing the Given Data and definitions.",
    ],
    steps: [
      "Write down the SI unit of the quantity you are calculating.",
      "Break down the unit into basic components (e.g., Watt = Joule / second = Energy / time).",
      "Set up the symbols according to the division/multiplication in the unit.",
      "Cross-check with a known baseline (e.g., more area should mean less pressure under a shoe).",
    ],
    bullets: [
      {
        label: "Dimensional Clues",
        text: "Speed = m/s -> Distance / Time. Density = kg/m³ -> Mass / Volume. Resistance = V/I (Ohm = Volt / Ampere).",
      },
      {
        label: "Common Sense Boundary Test",
        text: "If Area increases, should pressure decrease? Yes. So Area must be in the denominator (P = F/A).",
      },
      {
        label: "Bank the Definition Marks",
        text: "If formula recovery completely fails, write the verbal definition: 'Pressure is defined as force acting per unit area.' Checkers award partial marks for accurate definitions.",
      },
    ],
    finalTip:
      "Physics units are formula cheat-sheets hiding in plain sight. Master reading units, and you'll never forget a fundamental formula again.",
  },

  // -------------------------------------------------------------
  // 3. CHEMISTRY
  // -------------------------------------------------------------
  {
    slug: "chemistry-equation-presentation",
    category: "Chemistry",
    subject: "Chemistry",
    grade: "Class 10",
    tag: "CHEMISTRY",
    tags: ["Chemistry", "Equations", "Balancing", "Presentation"],
    title: "The Chemistry Equation Presentation System",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-chemistry-eq/1200/700",
    author: "Hamza",
    date: "Sep 10",
    description:
      "Reactants, products, reaction arrows, catalysts, balancing, and readable formatting.",
    intro:
      "A chemical equation written inside a continuous sentence like 'when zinc reacts with HCl it gives ZnCl2 + H2' gets ignored by checkers. Chemistry equations must stand out like math proofs.",
    quickWin:
      "Always center chemical equations on their own dedicated line, underline catalyst/temperature conditions above the reaction arrow, and balance atom counts.",
    mistakes: [
      "Writing an arrow without checking if atoms balance on both sides.",
      "Forgetting state symbols (s, l, g, aq) in crucial chapters like Acids, Bases, and Salts.",
    ],
    steps: [
      "Leave a blank line above and below every chemical reaction.",
      "Write Reactants on left, Products on right with a distinct reaction arrow (→ or ⇌).",
      "Indicate temperature or catalyst conditions directly above the arrow (e.g. 'Pt / 450°C').",
      "Write compound names in neat blue pointer below formulas (e.g. 'Methane' below CH₄).",
    ],
    bullets: [
      {
        label: "Reversible Reactions Need Double Half-Arrows",
        text: "In chemical equilibrium (e.g., N₂ + 3H₂ ⇌ 2NH₃), never use a single arrow. Always use opposing half-arrows (⇌).",
      },
      {
        label: "State Symbols Earn Respect",
        text: "Adding (g) for gases like CO₂ or (ppt) / (↓) for precipitates proves you understand the laboratory reality of the reaction.",
      },
      {
        label: "Balance with Small Integers",
        text: "Count metal atoms first, non-metals second, hydrogen third, oxygen last. It balances in 15 seconds.",
      },
    ],
    example:
      "Balanced presentation:\n       Pt / 450°C\n2SO₂(g) + O₂(g) ⇌ 2SO₃(g)   (ΔH = -196 kJ/mol)",
    finalTip:
      "If a chemistry question asks for a definition, ALWAYS follow it with a balanced chemical equation. An equation is the ultimate proof of chemistry knowledge.",
  },
  {
    slug: "chemistry-reactions-patterns",
    category: "Chemistry",
    subject: "Chemistry",
    grade: "Class 10",
    tag: "CHEMISTRY",
    tags: ["Chemistry", "Reactions", "Organic Chemistry", "Patterns"],
    title: "Chemistry Reactions: Stop Memorising Randomly",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/matric-chemistry-patterns/1200/700",
    author: "Hamza",
    date: "Sep 12",
    description:
      "Grouping reactions by type, reactants, products, conditions, and logical patterns.",
    intro:
      "Students try to memorize 80 individual reactions for Organic Chemistry and Acids/Bases. By exam day, they mix up hydrogenation with halogenation. Group reactions by families, not single lines.",
    quickWin:
      "Group reactions by pattern: Acid + Base → Salt + Water. Acid + Metal → Salt + H₂. Acid + Carbonate → Salt + H₂O + CO₂. Memorize 3 rules instead of 30 reactions.",
    mistakes: [
      "Memorizing reactions as meaningless letters without recognizing general functional groups.",
      "Forgetting the difference between addition reactions (alkenes) and substitution reactions (alkanes).",
    ],
    steps: [
      "Master the 4 Universal Inorganic Reaction Patterns.",
      "For Organic: Alkanes only undergo Substitution (require Sunlight).",
      "Alkenes and Alkynes undergo Addition (double bond breaks into single bond).",
      "Combustion always yields CO₂ + H₂O + Heat.",
    ],
    bullets: [
      {
        label: "The Acid Matrix",
        text: "Every single reaction in Chapter 10 (Acids & Bases) follows one of five general templates. Once you know the template, you can complete any unknown reaction.",
      },
      {
        label: "Catalyst Cards",
        text: "Nickel (Ni at 250-300°C) is always for Hydrogenation. Fe catalyst at 450°C is Haber process. V₂O₅ is Contact process.",
      },
      {
        label: "Make a 1-Page Reaction Map",
        text: "Map Ethene → Ethanol → Ethanoic Acid on a single poster sheet rather than 15 scattered textbook pages.",
      },
    ],
    finalTip:
      "In Punjab Board exams, 70% of reaction questions are 'Complete and Balance the Equation'. When you know the pattern, you only need to look at the reactants.",
    learningPath: "finishing-strong",
  },
  {
    slug: "chemistry-diagrams",
    category: "Chemistry",
    subject: "Chemistry",
    grade: "Class 9",
    tag: "CHEMISTRY",
    tags: ["Chemistry", "Diagrams", "Presentation", "Science", "Paper Hacks"],
    title: "Chemistry Diagrams Are Free Marks",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/matric-chemistry-strategy/1200/700",
    author: "Hamza",
    date: "Aug 21",
    description:
      "A checker spends more time looking at your diagram than reading your paragraph. Use that.",
    intro:
      "This mistake cost me marks in my 9th class prep test and I still remember it: I wrote a perfect 12-line definition of electrolysis and skipped the diagram because I was running low on time. Guess what got the marks: not the definition.",
    quickWin:
      "Always draw electrochemical cells (Nelson's Cell, Down's Cell, Electrolytic Cell) with bold labels for Anode (+), Cathode (-), and Electrolyte solution.",
    mistakes: [
      "Drawing tiny 2-inch postage-stamp sized cells squeezed in the corner of a sheet.",
      "Using pen for drawing apparatus lines. Pen cannot be erased when glassware proportions skew.",
    ],
    steps: [
      "Use pencil to sketch clean apparatus outlines (beaker, U-tube, electrodes).",
      "Draw solution level line with a light horizontal ruler stroke.",
      "Label Anode, Cathode, Battery terminals, and Ion migrations with horizontal ruler pointers.",
      "Write balanced half-reactions directly under the respective electrode labels.",
    ],
    bullets: [
      {
        label: "Always use pencil first",
        text: "Apparatus lines in pencil, labels in neat dark ink. A clean pencil drawing reads as deliberate and scientific.",
      },
      {
        label: "Label ion flow directions",
        text: "Show Na⁺ moving toward cathode and Cl⁻ toward anode with small arrows. That demonstrates actual conceptual mastery.",
      },
      {
        label: "Draw apparatus even if not explicitly demanded",
        text: "If a long question discusses extraction of sodium or water purification, an accurate diagram guarantees top-band marks.",
      },
    ],
    finalTip:
      "A checker who has evaluated 90 papers today is exhausted by paragraphs. Your clean diagram is the visual hook that proves you know your syllabus.",
    learningPath: "starting-matric",
  },
  {
    slug: "chemistry-definitions-guide",
    category: "Chemistry",
    subject: "Chemistry",
    grade: "All Grades",
    tag: "CHEMISTRY",
    tags: ["Chemistry", "Definitions", "Keywords", "Short Questions"],
    title: "Definitions Without Writing a Whole Novel",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-chemistry-defs/1200/700",
    author: "Hamza",
    date: "Sep 15",
    description:
      "How to hit the exact scientific keywords without wasting 10 lines of fluff on a 2-mark question.",
    intro:
      "A short question in chemistry is worth exactly 2 marks. Writing a full 10-line story will still only earn 2 marks, but it steals 5 minutes you desperately need for long numericals.",
    quickWin:
      "Structure every 2-mark definition into 3 crisp components: Definition (1-2 lines) + Formula/Unit (1 line) + One Example (1 line).",
    mistakes: [
      "Writing a paragraph of introductory history before defining the term.",
      "Defining a quantity like Molarity or Electronegativity without providing its mathematical formula or periodic trend.",
    ],
    steps: [
      "Write bold underlined heading: Definition of [Term].",
      "Provide precise textbook statement containing core scientific keywords.",
      "Provide standard mathematical formula or symbolic representation.",
      "State one clear example (e.g. 1 M solution of NaOH in 1 dm³ of water).",
    ],
    bullets: [
      {
        label: "Highlight Key Phrases",
        text: "Underline core terms like 'one mole', 'dm³ of solution', 'tendency of an atom', 'shared pair of electrons'.",
      },
      {
        label: "Stop at 4 Lines",
        text: "A 2-mark answer should rarely exceed 4 to 5 lines total. Keep it punchy and move forward.",
      },
      {
        label: "Unit is Mandatory",
        text: "If defining Molarity, state unit: mol dm⁻³. If defining Electronegativity, note it is dimensionless (Pauling scale).",
      },
    ],
    finalTip:
      "Board keys award 1 mark for the core definition statement and 1 mark for formula/example. If you write 8 lines of text without an example, you leave half the marks on the table.",
  },

  // -------------------------------------------------------------
  // 4. ENGLISH
  // -------------------------------------------------------------
  {
    slug: "english-essay-structure",
    category: "English",
    subject: "English",
    grade: "Class 10",
    tag: "ENGLISH",
    tags: ["English", "Essays", "Structure", "Paragraphs", "Class 10"],
    title: "How to Structure an English Essay for 15 Full Marks",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/matric-english-essay/1200/700",
    author: "Hamza",
    date: "Sep 18",
    description:
      "Covering introduction, 4-body paragraphs, transitions, quotations, and conclusive finish.",
    intro:
      "English essays in Matric (like 'A True Muslim', 'My Hobby', 'Quaid-e-Azam', 'Sports and Games') are often scored purely by visual architecture. Checkers look at paragraph balance and relevant quotations first.",
    quickWin:
      "Include exactly 3 centered, quoted lines with quotation marks (e.g., 'Work, work and work' - Quaid-e-Azam). A visually quoted essay instantly looks premium.",
    mistakes: [
      "Writing 4 pages as one solid wall of text without a single paragraph break.",
      "Using overly archaic Shakespearean words that break grammatical agreement.",
    ],
    steps: [
      "Paragraph 1: Introduction, background context, and thesis statement (4-5 lines).",
      "Paragraph 2: Historical context or spiritual significance (include Quote 1).",
      "Paragraph 3: Practical daily benefits or impact on character and society.",
      "Paragraph 4: Challenges, counter-arguments, or national relevance (include Quote 2).",
      "Paragraph 5: Final forward-looking conclusion with closing quote.",
    ],
    bullets: [
      {
        label: "Center Your Quotations",
        text: "Leave a line, center the quotation, write in clean dark ink between inverted commas. It catches the checker's eye immediately.",
      },
      {
        label: "Transitions Between Paragraphs",
        text: "Start body paragraphs with connective phrases: 'Furthermore,', 'In addition to this,', 'On the other hand,', 'Consequently,'.",
      },
      {
        label: "Target 250-300 Words",
        text: "Two to two-and-a-half ruled pages is the optimal sweet spot for 10th class Punjab board. Anything longer increases grammar errors.",
      },
    ],
    finalTip:
      "Grammatical accuracy beats fancy vocabulary every single time. Simple, flawless subject-verb agreement scores higher than mangled complex sentences.",
    learningPath: "finishing-strong",
  },
  {
    slug: "english-essay-length",
    category: "English",
    subject: "English",
    grade: "Class 10",
    tag: "ENGLISH",
    tags: ["English", "Essays", "Presentation", "Languages", "Length"],
    title: "How To Increase Length In English Without Extra Ratta",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-english-strategy/1200/700",
    author: "Hamza",
    date: "Sep 03",
    description:
      "You don't need to memorise more content. You need to stretch what you already know, properly.",
    intro:
      "Here's the real scene with English essays and letters: most students don't lack ideas, they lack structural breadth. And a 1-page essay looks visibly incomplete to an examiner expecting a 15-mark answer.",
    quickWin:
      "Add one cause-and-effect sentence after every main point: state what happens, why it happens, and what would happen if it were absent.",
    mistakes: [
      "Repeating the exact same sentence in different words 3 times in a row.",
      "Increasing word spacing to 2 inches to cheat margins — checkers notice and penalize immediately.",
    ],
    steps: [
      "State the primary point clearly in sentence 1.",
      "Add an illustrative example: 'For instance, in our daily lives...'.",
      "Discuss the broader impact on youth or nation: 'This builds discipline and collective progress...'.",
      "Conclude the paragraph with a mini-summary sentence.",
    ],
    bullets: [
      {
        label: "The Rule of Three Examples",
        text: "Whenever you make a statement about virtues, provide three concrete instances (e.g. at school, at home, and in public life).",
      },
      {
        label: "Break One Huge Block into Three",
        text: "Same content, better optical presentation. Three medium paragraphs are readable and look like a well-planned thesis.",
      },
      {
        label: "End with a Memorable Wrap",
        text: "Never let your essay end abruptly. A 2-line conclusion makes the piece feel finished rather than cut off by the exam clock.",
      },
    ],
    finalTip:
      "Length without structure is rambling; length with logical progression is high-scoring writing. Keep paragraphs balanced in size.",
  },
  {
    slug: "english-application-letter",
    category: "English",
    subject: "English",
    grade: "All Grades",
    tag: "ENGLISH",
    tags: ["English", "Applications", "Letters", "Formatting", "Free Marks"],
    title: "Application & Letter Presentation: 8 Free Formatting Marks",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-english-letter/1200/700",
    author: "Hamza",
    date: "Sep 20",
    description:
      "Covering layout, spacing, salutation commas, body structure, and proofreading.",
    intro:
      "In Punjab Board English, letters and applications are worth 8-10 marks. Up to 4 of those marks are awarded exclusively for proper header, salutation, date placement, and subscription formatting.",
    quickWin:
      "Memorize the punctuation: 'Examination Hall,' (comma), 'City A.B.C.' (full stops), 'March 29, 2026.' (comma after month/day, full stop after year).",
    mistakes: [
      "Writing your real name or real school name! Always use 'X.Y.Z.' or 'A.B.C.' to avoid board unfair-means flags.",
      "Putting an apostrophe in 'Yours obediently' (never write 'Your's').",
    ],
    steps: [
      "Header at top left or top right following strict board guidelines.",
      "Salutation: 'Sir,' or 'Dear Friend,' flush with margin.",
      "Body: Exactly 3 paragraphs (Introduction, Purpose/Request, Gratitude).",
      "Subscription: 'Yours obediently,' or 'Yours sincerely,' aligned with signature 'X.Y.Z.'.",
    ],
    bullets: [
      {
        label: "The Three Body Paragraphs",
        text: "Para 1: State the reason for writing. Para 2: Detail the facts/dates clearly. Para 3: State the requested action politely ('I shall be highly obliged...').",
      },
      {
        label: "No Punctuation Slip-Ups",
        text: "Check commas after 'The Headmaster,', 'Govt. High School,', 'City A.B.C.'. Missing commas are the #1 deducted formatting mark.",
      },
      {
        label: "Keep It to One Single Page",
        text: "An application should NEVER spill onto a second sheet. Fit it cleanly on one crisp full page.",
      },
    ],
    finalTip:
      "Spend 5 minutes memorizing the layout punctuation cold. You can score 4 out of 4 on formatting before the examiner even reads your English body sentences.",
  },
  {
    slug: "english-translation-guide",
    category: "English",
    subject: "English",
    grade: "Class 9",
    tag: "ENGLISH",
    tags: ["English", "Translation", "Urdu to English", "Tenses"],
    title: "Translation Without Panic: Urdu to English Mastery",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-english-trans/1200/700",
    author: "Hamza",
    date: "Sep 22",
    description:
      "Reading whole sentences, identifying tense, preserving meaning, and avoiding word-for-word nonsense.",
    intro:
      "Students often translate Urdu sentences word-for-word in sequence, resulting in awkward sentences like 'The rain was coming.' English requires Subject + Verb + Object structure regardless of Urdu word order.",
    quickWin:
      "Identify the tense from the Urdu ending first (e.g., 'رہا تھا' = Past Continuous -> was/were + ing). Lock the auxiliary verb before writing words.",
    mistakes: [
      "Translating idioms literally word-by-word.",
      "Confusing 'has been raining' (Present Perfect Continuous) with simple 'is raining'.",
    ],
    steps: [
      "Read the full Urdu sentence to the end — don't begin translating after the first two words.",
      "Find the Subject (who is acting) and place it first in the English sentence.",
      "Determine the Tense from the verb ending (Present, Past, Future, Continuous, Perfect).",
      "Check singular/plural agreement: 'He does' vs 'They do'.",
    ],
    bullets: [
      {
        label: "SVO Sentence Structure",
        text: "Urdu order is Subject-Object-Verb (وہ سکول جاتا ہے). English order is Subject-Verb-Object (He goes to school). Never copy Urdu sequence.",
      },
      {
        label: "Since vs For Rule",
        text: "Use 'Since' for point in time (Since morning, Since 1947, Since Monday). Use 'For' for duration (For two hours, For five days).",
      },
      {
        label: "Unfamiliar Word Strategy",
        text: "If you don't know the exact English word for a specific noun, use an accurate synonym rather than leaving a blank space.",
      },
    ],
    finalTip:
      "Reread your English translation as an independent sentence. If it sounds unnatural to read aloud, your tense or word order is misplaced.",
    learningPath: "starting-matric",
  },
  {
    slug: "english-grammar-time",
    category: "English",
    subject: "English",
    grade: "All Grades",
    tag: "ENGLISH",
    tags: ["English", "Grammar", "Time Management", "Objective"],
    title: "English Grammar Time Management in Objective Papers",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-english-grammar/1200/700",
    author: "Hamza",
    date: "Sep 24",
    description:
      "Moving through grammar sections efficiently, direct/indirect, active/passive, and pair of words.",
    intro:
      "The English objective paper carries 19 marks in 20 minutes: correct form of verbs, spelling, meanings, and grammar. Hesitating on one verb question ruins your timing for the entire paper.",
    quickWin:
      "Look for time indicator keywords: 'yesterday' = Past Indefinite (V2). 'always/daily' = Present Indefinite (s/es). 'tomorrow' = Future (will/shall).",
    mistakes: [
      "Second-guessing spelling options by staring at 4 misspelled words until your brain gets confused.",
      "Spending 4 minutes on 1 pair-of-words sentence while leaving 10 marks of comprehension rushed.",
    ],
    steps: [
      "Scan Question 1 Verb forms using conditional and time indicator rules.",
      "For Spellings: cover the options, visualize or write the word yourself first, then match.",
      "For Direct/Indirect: check reporting verb tense (Past outside changes tenses inside).",
      "Pair of Words: write simple, unambiguous sentences that clearly define the word's meaning.",
    ],
    bullets: [
      {
        label: "Conditional Sentence Rules",
        text: "If + Present Indefinite -> Future Indefinite (If it rains, we will stay home). If + Past Indefinite -> would + V1.",
      },
      {
        label: "Pair of Words Clarity",
        text: "Don't write 'This is an altar.' Write 'He sacrificed the lamb on the holy altar.' Checkers must see you understand the distinction.",
      },
      {
        label: "Pacing the 20 Minutes",
        text: "Verbs (4 mins) + Spellings (3 mins) + Synonyms (4 mins) + Grammar (4 mins) + Bubble Review (5 mins).",
      },
    ],
    finalTip:
      "Grammar questions are black-and-white: either 1 mark or 0 marks. Master the 5 standard verb rules and bank 5 marks in 3 minutes flat.",
  },

  // -------------------------------------------------------------
  // 5. PAKISTAN STUDIES
  // -------------------------------------------------------------
  {
    slug: "pak-studies-structured-answer",
    category: "Pakistan Studies",
    subject: "Pakistan Studies",
    grade: "Class 10",
    tag: "PAK STUDIES",
    tags: ["Pak Studies", "Long Questions", "Headings", "Presentation"],
    title: "The Structured Long Answer: Heading Strategy",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/matric-pakstudies-long/1200/700",
    author: "Hamza",
    date: "Sep 26",
    description:
      "Opening sentences, bold sub-headings, bullet examples, and strong conclusions.",
    intro:
      "Checkers grading Pakistan Studies long questions have 90 seconds per sheet. If your 8-mark question on the Lahore Resolution or 1973 Constitution is an unbroken 2-page essay, you get 4/8. If it has 8 distinct bold headings, you get 7 or 8/8.",
    quickWin:
      "Aim for exactly one bold heading per mark: an 8-mark long question must have an Introduction, 6 distinct sub-headings, and a Conclusion.",
    mistakes: [
      "Writing a continuous 50-line paragraph without a single underlined heading.",
      "Using headings that repeat the exact same point with different wording.",
    ],
    steps: [
      "Heading 1: Introduction / Historical Background (3-4 lines).",
      "Headings 2 to 7: Specific core dimensions (Economic, Political, Foreign Policy, Educational).",
      "Heading 8: Conclusion / National Impact.",
      "Underline every heading using a 605 cut marker or dark blue pointer.",
    ],
    bullets: [
      {
        label: "The Cut Marker Advantage",
        text: "A 604 or 605 marker creates crisp calligraphy headings that jump out at an exhausted board examiner immediately.",
      },
      {
        label: "Bullet Points Within Headings",
        text: "Under each main heading, write 2 to 3 concise bullet sentences rather than dense paragraphs.",
      },
      {
        label: "Quotes and Constitutional Clauses",
        text: "Quote Article numbers where relevant (e.g., 'Article 25-A: Right to Education') to show rigorous preparation.",
      },
    ],
    example:
      "Structure for 'Features of 1973 Constitution':\n1. Written Constitution\n2. Islamic Provisions\n3. Federal Structure\n4. Fundamental Rights\n5. Independent Judiciary\n6. Bicameral Legislature\n7. Conclusion",
    finalTip:
      "Pakistan Studies is an information hierarchy game. Structure your answer so clearly that the checker can give you full marks by only reading your headings.",
    learningPath: "finishing-strong",
  },
  {
    slug: "pak-studies-dates-facts",
    category: "Pakistan Studies",
    subject: "Pakistan Studies",
    grade: "Class 9",
    tag: "PAK STUDIES",
    tags: ["Pak Studies", "Dates", "Memory", "History", "Timelines"],
    title: "Dates, Names & Facts Without Ratta Overload",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-pakstudies-dates/1200/700",
    author: "Hamza",
    date: "Sep 28",
    description:
      "Practical chronological grouping, association anchors, and timeline charts.",
    intro:
      "1906 Muslim League, 1909 Minto-Morley, 1913 Quaid joins ML, 1916 Lucknow Pact... Trying to memorize dates randomly will scramble your memory by exam morning. Learn history as a continuous story timeline.",
    quickWin:
      "Draw a vertical timeline line in your notebook with dates on the left and 3-word event summaries on the right. Review the timeline, not whole chapters.",
    mistakes: [
      "Inventing fake historical dates during the exam. If unsure of the exact day, write the year accurately.",
      "Confusing governor-generals with prime ministers in early constitutional crises.",
    ],
    steps: [
      "Build the Master Decade Timeline: 1900-1920, 1920-1935, 1935-1947.",
      "Anchor key milestone years: 1930 (Allahabad), 1940 (Lahore Resolution), 1947 (Independence).",
      "Associate events: Lucknow Pact (1916) happened because Jinnah was the ambassador of Hindu-Muslim unity.",
      "Test yourself with flashcards: year on front, event on back.",
    ],
    bullets: [
      {
        label: "Timeline Anchoring",
        text: "Connect cause and effect: Simon Commission (1927) led to Nehru Report (1928), which caused Jinnah's 14 Points (1929).",
      },
      {
        label: "Approximate When Uncertain",
        text: "If you remember it was March 1940 but forget the 23rd, write 'In March 1940...' rather than guessing March 15 and being wrong.",
      },
      {
        label: "Round Geography Numbers",
        text: "Area of Pakistan: 796,096 sq km. Write 'Approximately 796,096 square kilometers' to show exact mastery.",
      },
    ],
    finalTip:
      "History is not random numbers; it is cause and consequence. Remember why something happened, and the date naturally locks into place.",
    learningPath: "starting-matric",
  },
  {
    slug: "pak-studies-maps-visuals",
    category: "Pakistan Studies",
    subject: "Pakistan Studies",
    grade: "All Grades",
    tag: "PAK STUDIES",
    tags: ["Pak Studies", "Maps", "Geography", "Visuals", "Presentation"],
    title: "Maps & Visual Information for Geography Long Questions",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-pakstudies-maps/1200/700",
    author: "Hamza",
    date: "Oct 01",
    description:
      "Labels, neatness, correct geographic placement of rivers/mountains, and avoiding clutter.",
    intro:
      "In questions about Pakistan's Climate, Natural Resources, Rivers, or Industrial zones, 95% of students write pure text. The 5% who draw a simple outline map with labeled Indus rivers automatically pull 8/8 marks.",
    quickWin:
      "Practice drawing Pakistan's rough boundary outline in 30 seconds. You don't need cartographic perfection; you need accurate relative locations of provinces and Arabian Sea.",
    mistakes: [
      "Spending 15 minutes shading detailed mountain ridges with artistic pencil hatching.",
      "Placing the Indus river east of Chenab or misplacing major provincial capitals.",
    ],
    steps: [
      "Draw outline using light pencil strokes (roughly 8-10 lines high on right side of sheet).",
      "Sketch the River Indus spine flowing from North to the Arabian Sea at Karachi.",
      "Branch out the 4 Punjab tributaries: Jhelum, Chenab, Ravi, Sutlej.",
      "Mark major mountain ranges (Karakoram, Himalayas, Hindu Kush) with simple inverted 'V' peaks.",
    ],
    bullets: [
      {
        label: "Compass Rose in Top Corner",
        text: "Always draw a small North arrow (N ↑) in the top-right corner of your map. It proves geographic literacy.",
      },
      {
        label: "A Legend / Key Box",
        text: "Create a 1-inch box at the bottom: ▲ = Mountains, ~~~ = Rivers, ■ = Major Industrial Cities.",
      },
      {
        label: "Label Horizontally",
        text: "Never write labels sideways. Keep all province and capital names horizontal and readable.",
      },
    ],
    finalTip:
      "A 40-second sketch of Pakistan with Indus and its tributaries turns an average geography answer into the highest-marked paper in the checker's stack.",
  },
  {
    slug: "pak-studies-time-management",
    category: "Time Management",
    subject: "Pakistan Studies",
    grade: "All Grades",
    tag: "TIME",
    tags: ["Time Management", "Pak Studies", "Exam Hall", "Presentation", "Pacing"],
    title: "Pak Studies Time Management: Finish Without Panicking",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-pakstudies-time/1200/700",
    author: "Hamza",
    date: "Sep 09",
    description:
      "Pak Studies papers aren't hard, they're long. The panic comes from bad time division, not bad prep.",
    intro:
      "This is the paper where students who studied for 6 months still leave the last long question half-written. The issue isn't syllabus difficulty; it's that every short question feels like it deserves an entire page.",
    quickWin:
      "Cap every short question at strictly 3 minutes. Two marks = two clear bullet points. Write, draw an end line, and move to the next.",
    mistakes: [
      "Writing a full page on a 2-mark short question about the Khilafat Movement.",
      "Taking 40 minutes on Long Question 1, leaving only 15 minutes for Long Question 2.",
    ],
    steps: [
      "First 15 minutes: MCQs (10 marks) completed and bubbled cleanly.",
      "Next 45 minutes: Short Questions (6 from Part I, 6 from Part II = 12 total questions @ 3.5 mins each).",
      "Next 45 minutes: Long Question 1 (22 mins) and Long Question 2 (23 mins).",
      "Final 15 minutes: Review question numbering, margin consistency, and underlined headings.",
    ],
    bullets: [
      {
        label: "Short questions get short answers",
        text: "A two mark question does not need eight lines. Two clear points, done. Writing more doesn't add marks; it eats time you'll need later.",
      },
      {
        label: "Attempt your strongest long question first",
        text: "Momentum matters. Starting with your best question builds confidence and warms up your writing speed.",
      },
      {
        label: "Leave 10 minutes at the end, always",
        text: "Checkers deduct marks when sub-part numbers (i, ii, iii) are scrambled. Use your buffer to cross-verify numbers.",
      },
    ],
    finalTip:
      "You are not fighting the syllabus in Pakistan Studies; you are fighting the clock. Respect the clock, and the marks follow.",
    learningPath: "exam-day",
  },

  // -------------------------------------------------------------
  // 6. ISLAMIAT
  // -------------------------------------------------------------
  {
    slug: "islamiat-strong-answer",
    category: "Islamiat",
    subject: "Islamiat",
    grade: "Class 9",
    tag: "ISLAMIAT",
    tags: ["Islamiat", "Quran", "Hadith", "References", "Presentation"],
    title: "Building a Strong Islamiat Answer: Arabic & Translation Reference",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-islamiat-strong/1200/700",
    author: "Hamza",
    date: "Oct 03",
    description:
      "Clear openings, relevant Ayat/Hadith references, logical structure, and dignified formatting.",
    intro:
      "In Islamiat papers (compulsory and elective), examiners look for authentic references. An answer discussing 'Zakat' or 'Honesty' that contains zero Quranic verses or Ahadith is capped at average marks.",
    quickWin:
      "Center Quranic Ayat translations between quotes, preceded by a neat marker heading: فرمانِ باری تعالیٰ (Translation) or ارشادِ نبویﷺ.",
    mistakes: [
      "Writing Arabic text with missing or guessed diacritics (A'raab). If uncertain about Arabic, write the verified Urdu/English translation accurately.",
      "Misattributing a quote to the Holy Prophet ﷺ when it is a quote of a companion.",
    ],
    steps: [
      "Introduction: Define the core concept in light of Islamic worldview.",
      "Primary Reference: Quote Quranic Ayah with chapter/Surah context if remembered.",
      "Prophetic Tradition: Quote relevant Hadith demonstrating practical application.",
      "Societal Dimensions: Discuss how the principle transforms society, economy, and character.",
      "Concluding prayer or wrap-up statement.",
    ],
    bullets: [
      {
        label: "Dignified Visual Formatting",
        text: "Always write the Holy Prophet's name with full reverence (ﷺ). Give references their own dedicated centered lines.",
      },
      {
        label: "Translation Accuracy Over Shaky Arabic",
        text: "Writing incorrect Arabic text with spelling errors is severely penalized. A flawless translation with correct attribution scores full marks.",
      },
      {
        label: "Subheadings for Every Dimension",
        text: "Divide long topics (like Jihad, Akhlaq, Zakat) into: Individual Benefits, Family Life, Community Harmony, Economic Impact.",
      },
    ],
    finalTip:
      "A single verified Quranic verse and one authentic Hadith will elevate an Islamiat long answer above 90% of competing papers.",
    learningPath: "starting-matric",
  },
  {
    slug: "islamiat-memorisation-recall",
    category: "Islamiat",
    subject: "Islamiat",
    grade: "All Grades",
    tag: "ISLAMIAT",
    tags: ["Islamiat", "Memorisation", "Active Recall", "Surah Review"],
    title: "Memorisation That Doesn't Collapse in the Exam Hall",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-islamiat-memo/1200/700",
    author: "Hamza",
    date: "Oct 05",
    description:
      "Active recall, spaced revision, short sessions, and self-testing for Surah Anfal and Ahzab.",
    intro:
      "Students sit for 4 hours reading Surah translations over and over. By the next day, they can't remember which verse addressed the Battle of Badr vs the Battle of Ahzab. Passive reading causes memory illusions.",
    quickWin:
      "Use the 'Cover and Speak' technique: read one Ayah translation, look away at the wall, and recite the meaning in your own words. If you can't say it aloud, you don't know it yet.",
    mistakes: [
      "Highlighting entire textbook pages in neon yellow — highlighting is passive and creates false confidence.",
      "Cramming 50 short questions the night before the exam without self-testing.",
    ],
    steps: [
      "Chunk verses into thematic groups (e.g. Verses 1-10 of Surah Anfal: Spoils of war & believer qualities).",
      "Write out translations from memory on blank paper — writing locks motor memory.",
      "Review on Day 1, Day 3, and Day 7 (Spaced Repetition).",
      "Test yourself using previous 5 years' board papers.",
    ],
    bullets: [
      {
        label: "Thematic Anchors",
        text: "Know the core theme of each Surah section so you immediately recognize which context a short verse belongs to.",
      },
      {
        label: "15-Minute Daily Habit",
        text: "15 minutes of daily translation recall beats a frantic 6-hour cramming session every single time.",
      },
      {
        label: "Pair with a Study Friend",
        text: "Have a classmate read the first 3 words of an Ayah and recite the completion. Rapid verbal testing cements recall.",
      },
    ],
    finalTip:
      "Don't practice until you get it right; practice until you cannot get it wrong under pressure.",
  },

  // -------------------------------------------------------------
  // 7. COMPUTER SCIENCE
  // -------------------------------------------------------------
  {
    slug: "computer-science-programming",
    category: "Computer Science",
    subject: "Computer Science",
    grade: "Class 10",
    tag: "COMPUTER",
    tags: ["Computer Science", "Programming", "C Language", "Syntax", "Class 10"],
    title: "How to Present Programming Answers (C Language / QBasic)",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/matric-computer-prog/1200/700",
    author: "Hamza",
    date: "Oct 08",
    description:
      "Readable code, indentation, variable clarity, comment lines, and syntax checking.",
    intro:
      "When a board examiner grades your C-program on paper, there is no compiler to run it. They evaluate code purely visually. If your code is unindented, lacks semicolons, or misses `#include <stdio.h>`, they mark it as buggy.",
    quickWin:
      "Indent the code inside main() by exactly one finger-width. A neatly indented C program instantly looks written by a real programmer.",
    mistakes: [
      "Forgetting the semicolon (;) at the end of statements in C language.",
      "Writing `scanf(\"%d\", n)` without the ampersand `&` before the variable name.",
    ],
    steps: [
      "Write standard preprocessor directives: `#include <stdio.h>` and `#include <conio.h>`.",
      "Declare `void main()` or `int main()` with matching curly braces `{ }`.",
      "Declare and initialize variables at the top of the function with meaningful names.",
      "Indent inner loops and conditional blocks cleanly.",
      "Provide a small boxed 'Expected Output' section below the code.",
    ],
    bullets: [
      {
        label: "Box Your Code",
        text: "Draw a clean rectangular border around your program code. It visually separates source code from surrounding theoretical text.",
      },
      {
        label: "Add Brief Comments",
        text: "Add two short comments like `// Input number from user` and `// Loop to calculate factorial`.",
      },
      {
        label: "Always Provide Sample Output",
        text: "Draw a mini black-box labeled 'Output' showing sample console interaction: 'Enter number: 5' -> 'Factorial: 120'.",
      },
    ],
    example:
      "#include <stdio.h>\nvoid main() {\n    int num, i, fact = 1;\n    printf(\"Enter number: \");\n    scanf(\"%d\", &num);\n    for(i = 1; i <= num; i++) {\n        fact *= i;\n    }\n    printf(\"Factorial = %d\", fact);\n}",
    finalTip:
      "Check semicolons on every executable line before turning in your paper. A missing semicolon is the most common reason for lost coding marks.",
    learningPath: "finishing-strong",
  },
  {
    slug: "computer-science-flowcharts",
    category: "Computer Science",
    subject: "Computer Science",
    grade: "Class 9",
    tag: "COMPUTER",
    tags: ["Computer Science", "Flowcharts", "Algorithms", "Symbols"],
    title: "Flowcharts & Algorithms: The Geometric Discipline",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-computer-flow/1200/700",
    author: "Hamza",
    date: "Oct 10",
    description:
      "Symbols, logical order, directional flow arrows, decision diamonds, and step sequences.",
    intro:
      "Drawing an oval when you need a rectangle, or drawing an arrow that terminates in empty space, immediately fails the flowchart question. Computer science examiners mark symbols with zero tolerance.",
    quickWin:
      "Always label the two branches exiting a decision diamond explicitly with 'Yes' and 'No' (or 'True' and 'False'). An unlabelled diamond branch is invalid logic.",
    mistakes: [
      "Using a rectangle for Input/Output instead of a Parallelogram.",
      "Writing algorithm steps with vague essays instead of standardized numbered steps (Step 1: Start, Step 2: Input N...).",
    ],
    steps: [
      "Terminal Symbol: Rounded Oval for START and STOP.",
      "Input/Output: Parallelogram for READ and PRINT.",
      "Processing: Sharp Rectangle for calculations and variable assignments.",
      "Decision: Diamond with exactly one input line and two output branches (True / False).",
      "Connector: Small circle with letter code if connecting broken paths.",
    ],
    bullets: [
      {
        label: "Ruler-Straight Flow Lines",
        text: "Use a plastic ruler to draw directional arrows. Flow must go strictly top-to-bottom or left-to-right.",
      },
      {
        label: "Step-by-Step Algorithm Pairing",
        text: "If asked for a flowchart, write the companion 5-step numbered algorithm right beside or above it.",
      },
      {
        label: "Ensure Termination",
        text: "Make sure every logical loop has a clear exit path that eventually leads to the STOP terminal.",
      },
    ],
    finalTip:
      "Memorize the 5 basic symbols on a 3x5 card. Never freehand symbols; use a ruler or plastic stencil for crisp geometry.",
    learningPath: "starting-matric",
  },
  {
    slug: "computer-science-theory",
    category: "Computer Science",
    subject: "Computer Science",
    grade: "All Grades",
    tag: "COMPUTER",
    tags: ["Computer Science", "Theory", "Hardware", "Networking", "Definitions"],
    title: "Computer Science Theory: Definitions, Differences & Real Examples",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-computer-theory/1200/700",
    author: "Hamza",
    date: "Oct 12",
    description:
      "Covering concise definitions, comparison tables, hardware architectures, and real-world examples.",
    intro:
      "Questions like 'Difference between RAM and ROM' or 'Define Network Topologies' are standard scoring goldmines. But writing them as comparative paragraphs costs marks. Always use side-by-side comparison tables.",
    quickWin:
      "For every 'Difference between X and Y' question, rule a clean 2-column table with a central vertical divider and at least 4 parallel comparison points.",
    mistakes: [
      "Writing a paragraph for RAM, then a separate paragraph for ROM below it. Examiners hate searching for parallel points.",
      "Giving theoretical definitions without naming real hardware devices (e.g. DDR4 RAM, BIOS chip).",
    ],
    steps: [
      "Draw comparison table with columns: 'Feature / Basis', 'Concept A', 'Concept B'.",
      "Point 1: Nature / Stand-for (Full acronym expanded).",
      "Point 2: Volatility (Volatile vs Non-Volatile).",
      "Point 3: Speed & Capacity comparisons.",
      "Point 4: Concrete practical examples.",
    ],
    bullets: [
      {
        label: "Acronym Expansions First",
        text: "Always provide the full name first: RAM (Random Access Memory), ROM (Read Only Memory), TCP/IP, LAN, WAN.",
      },
      {
        label: "Draw Topology Diagrams",
        text: "For Star, Ring, Bus topologies, a 2-minute diagram showing computers linked to a central Hub or backbone bus earns 100% marks.",
      },
      {
        label: "Precise Technical Terms",
        text: "Use accurate terminology: 'volatile memory', 'serial transmission', 'bandwidth', 'packet switching'. Avoid generic conversational words.",
      },
    ],
    finalTip:
      "Tabular presentation is the fastest way to write and the easiest way for an examiner to award full marks. Whenever you see the word 'Differentiate', draw a table immediately.",
  },

  // -------------------------------------------------------------
  // 8. UNIVERSAL EXAM HACKS, TIME & MINDSET
  // -------------------------------------------------------------
  {
    slug: "exam-hack-first-page",
    category: "Exam Hacks",
    subject: "General Exam Hacks",
    grade: "All Grades",
    tag: "EXAM HACKS",
    tags: ["Exam Hacks", "First Page", "Handwriting", "Margins", "Presentation"],
    title: "The First-Page Effect: Winning Examiner Trust in 10 Seconds",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-first-page/1200/700",
    author: "Hamza",
    date: "Oct 15",
    description:
      "Clean handwriting, spacing, headings, roll-number accuracy, and avoiding edge clutter.",
    intro:
      "Examiners grade between 150 and 300 answer sheets every single day. Within 10 seconds of opening your booklet, before reading a single sentence, they have formed a subconscious expectation: 'Is this an 80% student or a 50% student?'",
    quickWin:
      "Leave a generous 1.5-inch margin on the left, start Q.2 with your cleanest possible handwriting, and underline with a cut marker.",
    mistakes: [
      "Scribbling or scratching out your very first answer on Page 1.",
      "Crowding text right up to the ragged perforations of the answer book.",
    ],
    steps: [
      "Fill your roll number, paper code, and bubbles with obsessive precision.",
      "Rule clean margins with a 30cm plastic ruler.",
      "Attempt your most confident, perfectly remembered short question as Question 1.",
      "Keep line spacing even and handwriting legible without artistic curls.",
    ],
    bullets: [
      {
        label: "Do not claim neatness guarantees marks",
        text: "Neatness doesn't replace correct content. But clean presentation makes sure every correct fact you wrote is instantly recognized and rewarded.",
      },
      {
        label: "Start with a 10/10 Answer",
        text: "Never begin with a question where you are uncertain. Put your strongest knowledge on pages 1 to 3 to establish authority.",
      },
      {
        label: "Dignified Roll Number Area",
        text: "Check that bubbles are filled completely with black/blue ink without ink smudges across barcode areas.",
      },
    ],
    finalTip:
      "First impressions set the grading baseline. If Page 1 looks like a topper's sheet, the examiner gives you the benefit of the doubt on borderline questions later on.",
    learningPath: "exam-day",
  },
  {
    slug: "exam-hack-smart-cutting",
    category: "Exam Hacks",
    subject: "General Exam Hacks",
    grade: "All Grades",
    tag: "EXAM HACKS",
    tags: ["Exam Hacks", "Mistakes", "Corrections", "Whitener", "Presentation"],
    title: "The Smart Cutting Rule: How to Fix Errors Without Panicking",
    readTime: "3 min read",
    image: "https://picsum.photos/seed/matric-cutting-rule/1200/700",
    author: "Hamza",
    date: "Oct 18",
    description:
      "Single-line correction, sheet dignity, avoiding frantic scribbling, and whitener rules.",
    intro:
      "You make an arithmetic error in line 4. What do most students do? They scribble furious circular black ink spirals over the entire paragraph until the paper almost tears. To an examiner, that scream of ink looks like sheer panic.",
    quickWin:
      "Draw one single, clean, horizontal line through the error with a ruler. Then continue writing on the very next line.",
    mistakes: [
      "Using correction fluid (whitener) heavily — it creates thick chalky bumps, smudges ink, and is officially discouraged by BISE boards.",
      "Scribbling massive 'X' marks across whole pages with multiple exclamation points.",
    ],
    steps: [
      "Identify the incorrect word or formula line.",
      "Place your ruler over the word and draw ONE straight horizontal line through it.",
      "Write the correct word directly above it or on the following line.",
      "If canceling a whole question part, draw one diagonal slash across it with 'Cancelled' in neat print.",
    ],
    bullets: [
      {
        label: "The Psychology of a Clean Cut",
        text: "A single horizontal line signals confidence, control, and composure. It reads: 'I noticed a small slip, corrected it calmly, and kept moving.'",
      },
      {
        label: "Preserve Paper Dignity",
        text: "The answer sheet is an official legal record. Treat it with visual dignity and respect.",
      },
      {
        label: "Never Scribble Over Bubbles",
        text: "On MCQ optical mark reader sheets, never scratch or cut. If bubbled incorrectly, ask the invigilator immediately.",
      },
    ],
    finalTip:
      "Mistakes happen to toppers in every single exam. How you correct the mistake is what separates a mature student from an anxious amateur.",
    learningPath: "exam-day",
  },
  {
    slug: "exam-hack-final-check",
    category: "Exam Hacks",
    subject: "General Exam Hacks",
    grade: "All Grades",
    tag: "EXAM HACKS",
    tags: ["Exam Hacks", "Final Check", "Checklist", "Review", "Silly Mistakes"],
    title: "The Final 10-Minute Check: A Step-by-Step Audit Checklist",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-final-check/1200/700",
    author: "Hamza",
    date: "Oct 20",
    description:
      "Checklist: question numbers, MCQs, units, diagrams, unanswered parts, and roll-number verification.",
    intro:
      "When the 10-minute warning bell rings, put your new writing down. Continuing to write a new answer in a rush will gain you 1 mark while you lose 6 marks to silly unchecked errors elsewhere on your paper.",
    quickWin:
      "Cross-check your written question numbers against the printed question paper. Mismatched numbers (e.g. writing Q.3 (ii) when you answered Q.3 (iv)) are the easiest lost marks in board history.",
    mistakes: [
      "Writing until the invigilator physically pulls the pen from your fingers.",
      "Using review time to re-solve math calculations from scratch rather than auditing steps and units.",
    ],
    steps: [
      "Check 1: Roll number, center code, and signature on title page.",
      "Check 2: Question numbering match against official paper.",
      "Check 3: Units on all physics/math numerical answers.",
      "Check 4: Labels on all chemistry/biology diagrams.",
      "Check 5: Confirm required question count (e.g. 5 out of 8 short questions attempted).",
    ],
    bullets: [
      {
        label: "The Sub-Part Number Audit",
        text: "Make sure every roman numeral matches the paper exactly. If the board paper says (v), your sheet must say (v), never 5 or (e).",
      },
      {
        label: "Tie Extra Sheets Securely",
        text: "If using supplementary answer sheets (B-sheet), tie the thread firmly with a square knot and record B-sheet serial number on Page 1.",
      },
      {
        label: "Cancel Extra Unneeded Rough Work",
        text: "Draw a single diagonal line through your rough work margins labeled 'R.W.'.",
      },
    ],
    finalTip:
      "The last 10 minutes are worth 5 to 10 net marks. Every error you catch and correct in this window is pure bonus added to your transcript.",
    learningPath: "exam-day",
  },
  {
    slug: "3-hour-formula",
    category: "Time Management",
    subject: "General Time Management",
    grade: "All Grades",
    tag: "TIME",
    tags: ["Time Management", "3-Hour Formula", "Exam Strategy", "Pacing"],
    title: "My 3-Hour Paper Division Formula (Flexible Timing Strategy)",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/matric-3hour-formula/1200/700",
    author: "Hamza",
    date: "Sep 16",
    description:
      "The exact way I split three hours so I am never the last one still writing when time is called.",
    intro:
      "I used to be that person still furiously scribbling when the invigilator called 'pens down'. Not because I was slow, but because I had no flexible plan for the three hours. Here's what actually fixed it.",
    quickWin:
      "Divide your total time into 4 clear blocks: 15m Objective + 50m Short Questions + 95m Long Questions + 20m Final Audit.",
    mistakes: [
      "Treating a 2-hour paper (like Pak Studies or Islamiat) with the same pacing as a 3-hour science exam.",
      "Spending 45 minutes on the first question because your handwriting feels pretty.",
    ],
    steps: [
      "Block 1 (0 to 15m): Objective MCQs and initial question selection.",
      "Block 2 (15m to 65m): Section I Short Questions sprint.",
      "Block 3 (65m to 160m): Section II Long Questions with diagrams.",
      "Block 4 (160m to 180m): The crucial 20-minute checking and correction window.",
    ],
    bullets: [
      {
        label: "Adapt to 2-Hour Papers",
        text: "For 2-hour exams (50-mark subjects), scale down: 15m MCQs, 45m Shorts, 45m Longs, 15m buffer.",
      },
      {
        label: "Proportional Time Allotment",
        text: "Always allocate time proportional to marks, never based on how much you personally enjoy a chapter.",
      },
      {
        label: "Wear an Analog Watch",
        text: "Smart watches are strictly banned in examination halls. Wear a simple, reliable analog wristwatch to monitor your 15-minute milestones.",
      },
    ],
    finalTip:
      "This formula isn't about rushing your handwriting; it's about eliminating blind panic. Practice this division on past papers at home before exam week.",
    learningPath: "exam-day",
  },
  {
    slug: "forgot-an-answer",
    category: "Mindset",
    subject: "Exam Mindset",
    grade: "All Grades",
    tag: "MINDSET",
    tags: ["Mindset", "Memory", "Confidence", "Exam Hall", "Panic Control"],
    title: "What To Do When You Forget An Answer",
    readTime: "3 min read",
    image: "https://picsum.photos/seed/matric-forgot-answer/1200/700",
    author: "Hamza",
    date: "Sep 21",
    description:
      "Pause, identify what you remember, move on if necessary, return later, and avoid inventing facts.",
    intro:
      "It happens to literally everyone, toppers included. You revised it at 6:00 AM, you know you know it, and in the exam hall your mind goes blank. Here's what you do instead of staring at the ceiling in terror.",
    quickWin:
      "Circle the question number, turn the page, and answer an easy question immediately. In 80% of cases, your brain retrieves the forgotten fact in the background once pressure drops.",
    mistakes: [
      "Sitting for 12 straight minutes straining your forehead trying to force the memory.",
      "Writing made-up historical dates or fake scientific terms hoping the examiner won't notice.",
    ],
    steps: [
      "Pause and take two slow breaths. Your nervous system is in temporary cortisol fight-or-flight.",
      "Write any fragments you remember on your rough margin (keywords, units, diagrams).",
      "Skip to the next question without guilt. Your subconscious mind will keep working.",
      "Return in your 15-minute final review window to reassemble the answer.",
    ],
    bullets: [
      {
        label: "Move on immediately",
        text: "Fighting your memory under pressure creates cognitive interference. Move your pencil on a question you know well to rebuild dopamine and calm.",
      },
      {
        label: "Write partial keywords",
        text: "A half definition, one equation, or a labeled sketch still wins partial credit. Partial marks are infinitely better than zero.",
      },
      {
        label: "Never leave it completely blank",
        text: "Even two relevant sentences give an examiner an excuse to award 1 mark. A blank space guarantees zero.",
      },
    ],
    finalTip:
      "One forgotten answer is not a failed paper. It's one question out of dozens. Keep your momentum, bank the marks in front of you, and trust your preparation.",
    learningPath: "exam-day",
  },
  {
    slug: "exam-hack-spacing-answers",
    category: "Exam Hacks",
    subject: "General Exam Hacks",
    grade: "All Grades",
    tag: "EXAM HACKS",
    tags: ["Exam Hacks", "Spacing", "Presentation", "Readability", "Margins"],
    title: "How To Leave Space Between Answers: The Optical Breathing Room",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/matric-spacing-answers/1200/700",
    author: "Hamza",
    date: "Oct 25",
    description:
      "Covering readability, headings, paragraph spacing, diagram placement, and avoiding giant empty gaps.",
    intro:
      "Some students leave 8 blank lines between questions to artificially consume pages, which irritates examiners. Other students start Q.3 on the exact same line where Q.2 ended, making questions bleed together. Here is the golden spacing rule.",
    quickWin:
      "Draw a neat 2-inch horizontal ending line with a marker between questions, leave exactly 2 blank lines, and write the next bold question heading.",
    mistakes: [
      "Leaving half an empty page at the bottom just to start a minor short question on a fresh page.",
      "Cramming answers so tightly that the checker cannot see where one answer ends and the next begins.",
    ],
    steps: [
      "End of Answer: Draw a clean horizontal separator line (e.g. `--- • ---`).",
      "Leave 2 blank ruled lines of breathing room.",
      "Write next Heading centered or flush left: `Q.2 (Part iii): Boyle's Law`.",
      "If less than 4 lines remain at the bottom of a page, write 'P.T.O.' and start the next question on the fresh page.",
    ],
    bullets: [
      {
        label: "The 4-Line Threshold Rule",
        text: "If you finish an answer and only 3 or 4 lines remain on the sheet, don't squish a new question heading into that cramped footer. Turn the page.",
      },
      {
        label: "Never Leave Huge Suspicious Voids",
        text: "Leaving 10 to 15 blank lines in the middle of a sheet raises examiner suspicion of missed pages or exam malpractice.",
      },
      {
        label: "Integrate Diagrams into Text",
        text: "Leave 6 to 8 lines for diagrams with text wrapping or place the diagram centered immediately after its introductory paragraph.",
      },
    ],
    finalTip:
      "Make your paper look like a published textbook: clear separation, consistent margins, and optical breathing room that invites reading.",
    learningPath: "starting-matric",
  },
];

export function getArticle(slug: string) {
  return strategyArticles.find((a) => a.slug === slug);
}

export const paperHacks = [
  {
    number: "01",
    slug: "first-page-impression",
    title: "The First Page Impression",
    description:
      "Checkers form an opinion of your paper in the first ten seconds, before they've read a single answer. Your first page decides whether they start out generous or start out strict.",
    tips: [
      "Leave a clean margin on all four sides, don't crowd the edges.",
      "Write your name and roll number section neatly, it's the very first thing they see.",
      "Start Q1 with extra spacing, don't cram it right under the header.",
    ],
  },
  {
    number: "02",
    slug: "heading-game",
    title: "The Heading Game",
    description:
      "A pointer or a blue pen underline on every heading does something psychological to a checker. It signals structure before they've read the structure.",
    tips: [
      "Underline every question number and heading with a pointer or blue pen.",
      "Keep the underline consistent in thickness across the whole paper.",
      "Never underline mid-paragraph text, it should only mark structure, not content.",
    ],
  },
  {
    number: "03",
    slug: "smart-cutting",
    title: "The Smart Cutting",
    description:
      "Whitener is a visual red flag on a board paper. A single neat line through a mistake reads as confident and controlled. A white patch reads as panic.",
    tips: [
      "One single horizontal line through the mistake, nothing more.",
      "Never scribble over a mistake in circles, it looks messier than the original error.",
      "Continue the correct answer right after the cut, don't leave an awkward gap.",
    ],
  },
  {
    number: "04",
    slug: "what-checkers-read",
    title: "What Checkers Skip And What They Read",
    description:
      "With limited time per paper, checkers develop a scanning pattern. Knowing that pattern tells you exactly where to put your best work.",
    tips: [
      "Headings and question numbers get read first, always make them visible.",
      "Diagrams and labelled figures get real attention, dense paragraphs get skimmed.",
      "The first and last lines of a long answer get read closely, the middle gets scanned.",
    ],
  },
  {
    number: "05",
    slug: "five-mistakes",
    title: "5 Mistakes That Instantly Cut 10 Marks",
    description:
      "These aren't preparation mistakes. These are presentation mistakes that cost marks regardless of how well you actually know the content.",
    tips: [
      "Mismatched question numbers between your answer and the actual question paper.",
      "No margin, text running edge to edge like a diary entry.",
      "Diagrams with no labels, or labels in the wrong pen colour.",
      "Whitener patches instead of a single clean cut line.",
      "Answers with no visible structure, one giant unbroken paragraph.",
    ],
  },
];

export const youtubeChannels = [
  {
    name: "Study With Yaseen",
    why: "Straight to the point past-paper walkthroughs without the twenty minute intro.",
  },
  {
    name: "Learn With Sana",
    why: "Best for last-minute Pak Studies and Islamiat short question revision.",
  },
  {
    name: "Physics Wallah PK Style Explainers",
    why: "Numerical breakdowns explained the way a senior would, not a textbook.",
  },
];
