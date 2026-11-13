export type DirectoryCategory =
  | "all"
  | "strategy"
  | "practice"
  | "intelligence"
  | "utility"
  | "support";

export interface DirectoryModule {
  id: string;
  name: string;
  urduName: string;
  href: string;
  category: "strategy" | "practice" | "intelligence" | "utility" | "support";
  badge?: string;
  tagline: string;
  purpose: string;
  whatYouWillFind: string[];
  whenToUse: string;
  proTips: string[];
  connectedPages: { name: string; href: string }[];
  isInteractive: boolean;
}

export interface StudentJourneyStep {
  stepNumber: number;
  title: string;
  moduleId: string;
  href: string;
  actionText: string;
  rationale: string;
}

export interface StudentJourney {
  id: string;
  title: string;
  targetAudience: string;
  description: string;
  estimatedTime: string;
  iconName: string;
  steps: StudentJourneyStep[];
}

export const DIRECTORY_MODULES: DirectoryModule[] = [
  {
    id: "home",
    name: "Homepage & Platform Overview",
    urduName: "مرکزی صفحہ اور تعارف",
    href: "/",
    category: "support",
    tagline: "The high-level starting point and diagnosis of board checker realities.",
    purpose:
      "Welcomes visitors, introduces founder Hamza's peer-led philosophy, and addresses how to make answers stand out when board examiners evaluate papers under tight time constraints.",
    whatYouWillFind: [
      "Real Three.js 3D floating academic canvas & physical paper analysis stack.",
      "Live platform proof metrics (500+ WhatsApp group students, 30+ playbooks, 0 Rs tuition fees).",
      "Interactive 4-card Matric Toolkit launcher (Ask a Doubt, Mock Test, Past Papers, Dashboard).",
      "Spotlight on the new Board Watch expansion and 3D Subject Vaults (Physics, Chemistry, Math, Bio).",
      "Featured breakdown of the '3-Hour Exam Formula' that finishes papers 20 minutes early.",
      "Free weekly Sunday high-impact WhatsApp strategy newsletter subscription.",
    ],
    whenToUse:
      "When first arriving at Matric Mastery or returning to discover high-level platform updates.",
    proTips: [
      "Click on the 4 Toolkit cards for instant access to interactive engines without navigating menus.",
      "Explore the 3D Subject Cards to see high-yield topic pairings before beginning revision.",
    ],
    connectedPages: [
      { name: "Exam Strategies", href: "/strategies" },
      { name: "Mock Tests", href: "/mock-tests" },
      { name: "Board Watch", href: "/board-watch" },
      { name: "Paper Hacks", href: "/paper-hacks" },
    ],
    isInteractive: true,
  },
  {
    id: "strategies",
    name: "Exam Strategies Playbook",
    urduName: "امتحانی حکمت عملیاں",
    href: "/strategies",
    category: "strategy",
    badge: "30+ Guides",
    tagline: "Actionable, subject-specific playbooks for every tricky Punjab Board paper.",
    purpose:
      "Provides tactical, battle-tested solutions for the specific academic bottlenecks where marks get cut, from MCQ elimination to 5-box numerical structures.",
    whatYouWillFind: [
      "Over 30 comprehensive, searchable articles tailored to 9th and 10th class Punjab & Federal Boards.",
      "Math MCQ Elimination: Solving 15 objective questions in 10 minutes without blind guessing.",
      "Chemistry Diagrams & Equations: Getting full credit on industrial processes and balance equations.",
      "English Essay Length & Paragraphing: How to format 200–250 word essays to earn 13+ marks out of 15.",
      "The 3-Hour Formula: Allocating exact minutes across short questions, long questions, and final proofreading.",
      "Pakistan Studies Time Management: Preventing the notorious 'ran out of time on Q.5' disaster.",
      "What to Do If You Forget an Answer: Psychological and structural recovery techniques in the hall.",
    ],
    whenToUse:
      "During regular study periods, weekend revision, or when stuck on a specific subject's paper pattern.",
    proTips: [
      "Use the search filter at the top of /strategies to jump directly to your current difficult subject.",
      "Read the '3-Hour Formula' article before attempting any timed mock test.",
    ],
    connectedPages: [
      { name: "Paper Hacks", href: "/paper-hacks" },
      { name: "Mock Tests", href: "/mock-tests" },
      { name: "Resources & Pairing Schemes", href: "/resources" },
    ],
    isInteractive: true,
  },
  {
    id: "paper-hacks",
    name: "Paper Presentation Hacks",
    urduName: "پیپر پریزنٹیشن ہیکس",
    href: "/paper-hacks",
    category: "strategy",
    tagline: "Visual engineering and physical presentation techniques that make your answers immediately clear to examiners.",
    purpose:
      "Teaches students how to visually structure their answer sheets so board examiners marking papers under rapid evaluation conditions can locate key definitions, formula steps, and final results immediately.",
    whatYouWillFind: [
      "The 1.5-inch left and 0.5-inch right margin rule that frames answers without looking cramped.",
      "Dual 605/604 cut marker cutting techniques for main headings and sub-headings.",
      "The 5-Box Numerical Format: Given Data, To Find, Formula, Calculation, and Boxed Result with SI Units.",
      "Single-line neat strikethrough technique: never scribbling out mistakes into ink blobs.",
      "Bullet-point short answers over dense paragraph walls that checkers skip.",
      "Scientific diagram placement: centered, enclosed in neat pencil borders with right-aligned labels.",
    ],
    whenToUse:
      "Before every school exam, December send-up, and board exam to practice answer formatting.",
    proTips: [
      "Practice the boxed numerical format on rough pages until drawing it takes under 5 seconds.",
      "Never use red or green ink; stick strictly to standard blue ink and black cut markers as approved by BISE.",
    ],
    connectedPages: [
      { name: "Exam Day Guidebook", href: "/exam-day-guidebook" },
      { name: "Exam Strategies", href: "/strategies" },
      { name: "Past Papers", href: "/past-papers" },
    ],
    isInteractive: false,
  },
  {
    id: "mock-tests",
    name: "Timed Mock Testing Engine",
    urduName: "آن لائن ماک ٹیسٹ",
    href: "/mock-tests",
    category: "practice",
    badge: "Interactive",
    tagline: "Real-time board exam simulation with accurate timers and performance diagnostics.",
    purpose:
      "Allows students to practice under realistic board exam pressure with custom timers, instant scoring, and diagnostic mistake breakdowns.",
    whatYouWillFind: [
      "Customizable test builder for Class 9 and 10 across Math, Physics, Chemistry, Biology, and Computer Science.",
      "Selectable chapter-wise tests or full-syllabus comprehensive papers.",
      "Configurable mark targets: 25 Marks (Quick 30m Drill), 50 Marks (Mid-Term), or 75 Marks (Full Board).",
      "Real-time countdown timer with color warnings as minutes run down.",
      "Flag and bookmark questions for review before submitting.",
      "Instant automated scorecard with percentage, grade, and review of correct vs chosen answers.",
      "Downloadable and printable student performance certificate/report.",
      "Automatic +15 to +35 XP reward credited to your student profile upon test completion.",
    ],
    whenToUse:
      "Every weekend during exam prep, after completing a chapter, or for full-dress rehearsal 2 weeks before boards.",
    proTips: [
      "Do not pause the timer during a mock test; real board halls do not offer pause buttons.",
      "Review the question explanations immediately after submitting while your logic is still fresh.",
    ],
    connectedPages: [
      { name: "Student Dashboard", href: "/dashboard" },
      { name: "Live Leaderboard", href: "/leaderboard" },
      { name: "Past Papers", href: "/past-papers" },
    ],
    isInteractive: true,
  },
  {
    id: "past-papers",
    name: "Past Papers & Practice Sets",
    urduName: "ماضی کے پیپرز",
    href: "/past-papers",
    category: "practice",
    tagline: "Authentic board question archives and printable exam templates from 2019 to 2025.",
    purpose:
      "Equips candidates with real previous-year board questions organized by board, subject, and year, plus authentic printable answer templates.",
    whatYouWillFind: [
      "Coverage across all 9 Punjab Boards (Multan, Lahore, Rawalpindi, etc.) and FBISE Islamabad.",
      "Question sets from 2019 to 2025 across objective MCQs and subjective sections.",
      "Identification of repeated long-question pairings and frequent short questions.",
      "Printable examination paper layout matching genuine BISE font styling and spacing.",
    ],
    whenToUse:
      "Solving 5-year past papers in the final 4 weeks before annual board examinations.",
    proTips: [
      "Solve at least 3 recent past papers on actual ruled answer sheets with pen and markers.",
      "Notice how certain numericals appear every alternate year in Physics and Chemistry.",
    ],
    connectedPages: [
      { name: "Mock Tests", href: "/mock-tests" },
      { name: "Board Watch", href: "/board-watch" },
      { name: "Paper Hacks", href: "/paper-hacks" },
    ],
    isInteractive: true,
  },
  {
    id: "board-watch",
    name: "Board Watch — Punjab Exam Intelligence",
    urduName: "بورڈ واچ انٹیلیجنس",
    href: "/board-watch",
    category: "intelligence",
    badge: "Live Radar",
    tagline: "Verified announcements, date sheet tracking, rumor debunking, and SLO patterns.",
    purpose:
      "Separates verified official notifications from misleading social media rumors regarding Punjab Board exam dates, syllabus policies, and marking rules.",
    whatYouWillFind: [
      "Categorized intelligence feed: Confirmed Notifications, Reported Updates, Expected Timelines, Deadlines, and Rumor Clarifications.",
      "PBCC 40% Passing Marks Standard breakdown across compulsory and elective subjects.",
      "2027 Annual Examination Timeline roadmap (enrollment, fee submission, date sheet, roll slip, practicals, results).",
      "Subject SLO Blueprints: Knowledge (50%), Understanding (35%), and Application (15%) distribution.",
      "Direct 9-Board Directory: official website links, telephone helplines, and controller contacts for Lahore, Multan, Rawalpindi, Gujranwala, Faisalabad, Sargodha, Bahawalpur, DG Khan, and Sahiwal.",
      "Community Tip Line to submit suspicious notifications for admin verification.",
    ],
    whenToUse:
      "Whenever rumors circulate on WhatsApp or YouTube regarding paper leaks, cancellations, or policy changes.",
    proTips: [
      "Always check the 'Last Checked' timestamp to ensure you are viewing current intelligence.",
      "Filter by your specific home board (e.g., Multan or Lahore) to see only announcements that apply to your center.",
    ],
    connectedPages: [
      { name: "Academic Calendar", href: "/utilities?tab=calendar" },
      { name: "Exam Day Guidebook", href: "/exam-day-guidebook" },
      { name: "Legal & Policies Center", href: "/legal" },
    ],
    isInteractive: true,
  },
  {
    id: "ai",
    name: "Matric Mastery AI — Academic Companion",
    urduName: "میٹرک ماسٹری اے آئی",
    href: "/ai",
    category: "intelligence",
    badge: "Free-First AI",
    tagline: "Dedicated AI tutor workspace for step-by-step problem solving, derivations, and local study history.",
    purpose:
      "A dedicated, privacy-first academic workspace prepared for Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct-fast for text queries; @cf/meta/llama-3.2-11b-vision-instruct kept separate pending adult license approval) without commercial tracking or subscription fees.",
    whatYouWillFind: [
      "Text academic solver configured for Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct-fast) when connected via VITE_AI_WORKER_URL.",
      "Separated multimodal image interface (@cf/meta/llama-3.2-11b-vision-instruct) gated off by default until parent/guardian Meta license approval.",
      "Strict student privacy: zero server retention of prompts, no tracking cookies, and zero commercial telemetry.",
      "Free-First architecture: engineered for Cloudflare's 10,000 daily free Neurons allocation (~563 realistic daily queries) without credit cards or paid fallbacks.",
      "Transparent status indicators: distinguishes between connected streaming, quota exhaustion (HTTP 429), vision pending approval, and unconfigured states.",
      "Local-only session storage: save and export your study conversations as JSON without cloud leaks.",
    ],
    whenToUse:
      "When stuck on a challenging numerical, derivation, or diagram late at night while studying at home.",
    proTips: [
      "Use the Subject filter tag (Math, Physics, Chemistry) for more focused and concise board-standard steps.",
      "Never upload personal identity documents (CNIC, roll number slips) — use the tool solely for academic textbook questions.",
    ],
    connectedPages: [
      { name: "Subject Strategies", href: "/strategies" },
      { name: "Paper Hacks", href: "/paper-hacks" },
      { name: "Student Dashboard", href: "/dashboard" },
    ],
    isInteractive: true,
  },
  {
    id: "utilities",
    name: "Study Tools & Utilities Suite",
    urduName: "اسٹڈی ٹولز اور کیلکولیٹرز",
    href: "/utilities",
    category: "utility",
    badge: "6-in-1 Suite",
    tagline: "Precision timekeeping, 40% aggregate calculators, drift-free timers, and city weather.",
    purpose:
      "An integrated personal productivity toolkit engineered specifically for matric students to manage study cycles, track PBCC passing criteria, and stay organized.",
    whatYouWillFind: [
      "1. Overview Dashboard: live PKT precision clock, next academic countdown, today's focus minutes, and 100% private local JSON backup/restore.",
      "2. Pomodoro & Timers: drift-free countdown, lap-tracking stopwatch (with fastest/slowest lap highlight), 25m/5m Pomodoro cycles with sound chimes, and study session tracker.",
      "3. Student Calculators: Punjab Board PBCC 40% passing benchmark calculator, percentage converter, score improvement calculator, scientific calculator (DEG/RAD, memory), and physics/chemistry unit converter (pressure, energy, temperature, length, mass).",
      "4. Academic Calendar: PBCC verified examination schedule, monthly holiday grid, and personal deadline CRUD tracker.",
      "5. Live Clock & Timezones: digital clock with tabular-nums, SVG analog clock with continuous second-hand rotation, WorldTimeAPI NTP sync, and 5 international timezones.",
      "6. Live Information: real-time atmospheric weather for Punjab exam cities (Multan, Lahore, Rawalpindi, etc.) and educational forex estimator.",
    ],
    whenToUse:
      "Every single study session—running Pomodoro focus intervals, checking passing benchmarks, or tracking remaining days until exams.",
    proTips: [
      "Use the 'Export Backup (JSON)' feature once a week to save your study logs safely to your device.",
      "Open the quick 'Tools' button in the global header for immediate access from any page without losing your place.",
    ],
    connectedPages: [
      { name: "Student Dashboard", href: "/dashboard" },
      { name: "Board Watch", href: "/board-watch" },
      { name: "Exam Day Guidebook", href: "/exam-day-guidebook" },
    ],
    isInteractive: true,
  },
  {
    id: "dashboard",
    name: "Student Dashboard & Analytics",
    urduName: "اسٹوڈنٹ ڈیش بورڈ",
    href: "/dashboard",
    category: "practice",
    tagline: "Personal study streak tracking, daily goals, subject mastery, and diagnostic history.",
    purpose:
      "Empowers students to maintain daily momentum, monitor weekly syllabus completion, and analyze mistakes without requiring passwords or mandatory accounts.",
    whatYouWillFind: [
      "Daily study streak counter with fire milestone indicators.",
      "Cumulative XP progress level badge (earned by solving doubts and taking mock tests).",
      "Daily Goal Checklist: check off completed MCQs, formula reviews, and chapter readings.",
      "Subject Mastery progress bars across Math, Physics, Chemistry, Bio, and English.",
      "Recent Mock Test accuracy history and score breakdown.",
      "Weak area diagnostic recommendations based on previous test mistakes.",
    ],
    whenToUse:
      "Every morning to review your daily target checklist, and every evening to log completed tasks.",
    proTips: [
      "Complete at least one mock test or ask a doubt every day to keep your streak active.",
      "Click 'Cloud Login' to link your Google account so your streak isn't lost if you clear your browser cache.",
    ],
    connectedPages: [
      { name: "Mock Tests", href: "/mock-tests" },
      { name: "Live Leaderboard", href: "/leaderboard" },
      { name: "Cloud Login", href: "/login" },
    ],
    isInteractive: true,
  },
  {
    id: "leaderboard",
    name: "Live Student Leaderboard",
    urduName: "طلباء کی رینکنگ",
    href: "/leaderboard",
    category: "practice",
    badge: "Live XP",
    tagline: "Friendly academic competition and motivation among matric students across Pakistan.",
    purpose:
      "Provides healthy peer motivation by celebrating student consistency, study streaks, and high test scores across all 9 Punjab BISE regions.",
    whatYouWillFind: [
      "Real-time ranking of students based on cumulative earned XP and test accuracy.",
      "Badges for weekly top performers, streak legends, and speed solvers.",
      "Anonymized student handles to protect minor privacy in compliance with PECA 2016.",
      "Filter rankings by weekly, monthly, or all-time consistency.",
    ],
    whenToUse:
      "Checking weekly progress and seeing how your study pace compares with peers across Punjab.",
    proTips: [
      "Consistency beats cramming: maintaining a 14-day study streak awards more XP than taking 5 tests in one night.",
    ],
    connectedPages: [
      { name: "Student Dashboard", href: "/dashboard" },
      { name: "Mock Tests", href: "/mock-tests" },
      { name: "Cloud Login", href: "/login" },
    ],
    isInteractive: true,
  },
  {
    id: "login",
    name: "Student Profile Login & Identity",
    urduName: "اسٹوڈنٹ لاگ ان",
    href: "/login",
    category: "support",
    badge: "Firebase",
    tagline: "Optional 1-click Google verification with private local storage on your device.",
    purpose:
      "Provides verified Google profile authentication while keeping your XP, streaks, mistakes, and study records 100% private in local device storage.",
    whatYouWillFind: [
      "1-Click Google Sign-In powered by secure Google Firebase Authentication.",
      "Verified student profile identity badge and personal session status.",
      "Private local storage protection—no personal study records sent to third-party databases.",
      "Portable JSON backup and restoration available anytime in /utilities.",
      "100% free with zero advertisements or commercial monetization.",
    ],
    whenToUse:
      "When you want a verified student badge on the leaderboard and a personalized study session.",
    proTips: [
      "Signing in is completely optional: Matric Mastery remains 100% accessible and functional without an account.",
      "To transfer study data to another device, use the 'Export Backup (JSON)' feature in the /utilities dashboard.",
    ],
    connectedPages: [
      { name: "Student Dashboard", href: "/dashboard" },
      { name: "Legal & Privacy Policy", href: "/legal" },
    ],
    isInteractive: true,
  },
  {
    id: "exam-day-guidebook",
    name: "Exam Day Guidebook",
    urduName: "امتحانی دن کی گائیڈ",
    href: "/exam-day-guidebook",
    category: "intelligence",
    badge: "2026/2027",
    tagline: "Complete logistical checklist, center protocols, and panic recovery strategies.",
    purpose:
      "A comprehensive operational guide for the critical 24 hours before an exam: what to pack, center arrival times, hall rules, and handling anxiety.",
    whatYouWillFind: [
      "Interactive Exam Packing Checklist: roll number slip printout, smart card/B-Form, blue/black cut markers, ink pen, transparent clipboard, transparent pouch, eraser, and ruler.",
      "Night-before sleep and light revision timeline (avoiding late-night panic all-nighters).",
      "Morning arrival schedule: arriving 45 minutes before gate closure to locate your seat number peacefully.",
      "Forbidden items scanner: smartwatches, scientific calculators where prohibited, mobile devices, chits.",
      "Hall Survival Protocols: handling misprinted question papers, dealing with invigilator delays, and rapid calming exercises if your mind goes blank.",
      "Comprehensive Schema.org FAQPage structured answers covering all examination logistics.",
    ],
    whenToUse:
      "48 hours before an exam, the evening before, and on the morning of every paper.",
    proTips: [
      "Print at least two copies of your Roll Number Slip and keep one safely at home as backup.",
      "Never carry a non-transparent pencil pouch; invigilators may confiscate it at the entrance.",
    ],
    connectedPages: [
      { name: "Board Watch", href: "/board-watch" },
      { name: "Paper Hacks", href: "/paper-hacks" },
      { name: "Study Tools", href: "/utilities" },
    ],
    isInteractive: true,
  },
  {
    id: "resources",
    name: "Resources & Download Center",
    urduName: "ڈاؤنلوڈز اور وسائل",
    href: "/resources",
    category: "strategy",
    tagline: "Curated academic PDF pairing schemes, formula cheat sheets, and outlines.",
    purpose:
      "Centralized download vault providing verified Punjab Board pairing schemes, high-yield formula sheets, and subject cheat sheets.",
    whatYouWillFind: [
      "Official 2026/2027 Punjab Board Pairing Schemes for 9th and 10th Class.",
      "Physics & Mathematics high-yield formula cheat sheets with units and derivations.",
      "Urdu and English essay outlines and letter formats approved by BISE standards.",
      "Biology practical diagram guidelines and labeling requirements.",
      "Computer Science algorithm and flowchart standard reference sheets.",
    ],
    whenToUse:
      "At the beginning of each syllabus term and during intense final revision weeks.",
    proTips: [
      "Print the pairing scheme and pin it above your study desk so you know which chapters carry long question pairings.",
    ],
    connectedPages: [
      { name: "Exam Strategies", href: "/strategies" },
      { name: "Past Papers", href: "/past-papers" },
    ],
    isInteractive: false,
  },
  {
    id: "my-story",
    name: "Founder's Story: Hamza from Multan",
    urduName: "حمزہ کی کہانی",
    href: "/my-story",
    category: "support",
    tagline: "How an ordinary 10th-grade student figured out board paper checking realities.",
    purpose:
      "Builds genuine student-to-student trust by explaining how Matric Mastery began from real struggles rather than corporate academy coaching.",
    whatYouWillFind: [
      "Hamza's personal journey: failing early school tests and analyzing why hardworking students get lower marks.",
      "Comparing checked board sheets with senior examiners and top scorers in Multan.",
      "The realization: 'Your paper presentation matters more than your preparation.'",
      "Why Matric Mastery will always remain 100% free without paywalls or academy fees.",
    ],
    whenToUse:
      "When you want to understand the origin and philosophy behind the advice on this platform.",
    proTips: [
      "Notice Hamza's core lesson: exam success is a learnable presentation skill, not an innate talent.",
    ],
    connectedPages: [
      { name: "About & Brand Identity", href: "/about" },
      { name: "Exam Strategies", href: "/strategies" },
    ],
    isInteractive: false,
  },
  {
    id: "about",
    name: "About & 3D Brand Identity",
    urduName: "ہمارے بارے میں",
    href: "/about",
    category: "support",
    tagline: "Mission statement, WhatsApp community helpline, and pure CSS 3D Brand System.",
    purpose:
      "Documents the technical design system, institutional contacts, and direct student communication channels.",
    whatYouWillFind: [
      "Official 3D Brand System: pure CSS block geometry, perspective rules, and 60fps mobile GPU laws.",
      "Color Architecture tokens: Deep Canvas (#0A0A0A), Kinetic Yellow (#FFD60A), Shadow Ochre (#CCAA00).",
      "Typography hierarchy: Space Grotesk Extra-Bold 800 paired with Inter 400/600.",
      "Touchpoint applications: WhatsApp DP, Browser Favicon, Merch chest print, and YouTube thumbnails.",
      "Direct WhatsApp contact link to the Matric Mastery community channel (+92 308 4703973).",
      "Interactive 'Have a Doubt?' student contact form.",
    ],
    whenToUse:
      "When reaching out with feedback, reporting an issue, or studying the platform's visual identity.",
    proTips: [
      "Send clear, concise messages on WhatsApp. Note this is a student community channel managed by Hamza and peer contributors during study breaks.",
    ],
    connectedPages: [
      { name: "My Story", href: "/my-story" },
      { name: "Legal & Policies Center", href: "/legal" },
    ],
    isInteractive: true,
  },
  {
    id: "legal",
    name: "Legal & Policies Center",
    urduName: "قانونی معلومات اور پالیسیاں",
    href: "/legal",
    category: "support",
    badge: "MM-LEG-v3.5.0",
    tagline: "Official institutional repository, privacy framework, and PECA 2016 adherence.",
    purpose:
      "Provides transparent statutory declarations, student privacy protections, and educational disclaimers.",
    whatYouWillFind: [
      "15 Codified Legal Chapters under Archive Codex MM-LEG-v3.5.0.",
      "Chapter 01: All 14 original foundational declarations preserved verbatim.",
      "Chapter 02 & 03: Formal Terms of Service and Student Privacy Policy (zero ad tracking, no Google AdSense, no Meta Pixel).",
      "Chapter 04: Cookie Architecture & complete LocalStorage key audit.",
      "Chapter 06: Government & BISE Non-Affiliation Declaration (independent student platform).",
      "Chapter 08 & 11: PECA 2016 Cybercrime Adherence & Zero-Tolerance Anti-Cheating Directives.",
      "Chapter 15: Regulatory Revision Changelog detailing past versions v3.1.0 to v3.5.0.",
      "Printable PDF version of the complete codified archive.",
    ],
    whenToUse:
      "When reviewing how student data is handled or verifying platform independence from board bodies.",
    proTips: [
      "Use the search filter at the top of /legal to quickly jump to specific clauses like 'Privacy' or 'Cookies'.",
    ],
    connectedPages: [
      { name: "About", href: "/about" },
      { name: "Website Guide", href: "/guide" },
    ],
    isInteractive: true,
  },
  {
    id: "ai-doubt-solver",
    name: "Matric Mastery AI — Quick Solver Modal",
    urduName: "میٹرک ماسٹری اے آئی موڈل",
    href: "#doubt-solver",
    category: "practice",
    badge: "Workers AI",
    tagline: "On-demand academic doubt modal with voice input and transparent backend status.",
    purpose:
      "An on-demand study modal accessible from any page, backed by the same Free-First Cloudflare Workers AI service (@cf/meta/llama-3.1-8b-instruct-fast) as the /ai workspace.",
    whatYouWillFind: [
      "Accessible site-wide via the floating glowing orb in the bottom-right corner, with a 1-click link to /ai.",
      "Connects via VITE_AI_WORKER_URL to Cloudflare Workers AI (displays honest preview notice when unconfigured).",
      "Dual language support: English and اردو / Roman Urdu.",
      "Voice dictation via Web Speech API (speak your question naturally).",
      "Photo attachment UI prepared alongside adult-gated vision backend support.",
      "1-Click Copy, WhatsApp Share, and 'Ask Follow-up' prompts.",
      "Cross-references to related Punjab Board past paper questions.",
      "Local query history stored privately on your device.",
      "Awards +15 XP upon doubt engagement.",
    ],
    whenToUse:
      "Whenever you need a quick concept clarification without leaving your current strategy or past paper page.",
    proTips: [
      "Open the full /ai workspace for multi-turn study conversations and JSON session exports.",
      "Switch to Urdu mode if you want explanations framed in simple conversational Roman Urdu.",
    ],
    connectedPages: [
      { name: "Mock Tests", href: "/mock-tests" },
      { name: "Student Dashboard", href: "/dashboard" },
    ],
    isInteractive: true,
  },
];

export const STUDENT_JOURNEYS: StudentJourney[] = [
  {
    id: "first-time",
    title: "The First-Time Visitor Onboarding",
    targetAudience: "Students arriving at Matric Mastery for the very first time",
    description:
      "Get a clear, overwhelm-free overview of what the platform offers, how it differs from commercial academies, and which tools to use today.",
    estimatedTime: "15 Minutes",
    iconName: "Compass",
    steps: [
      {
        stepNumber: 1,
        title: "Understand the Mission & Core Philosophy",
        moduleId: "home",
        href: "/",
        actionText: "Read the Homepage Diagnosis",
        rationale:
          "Discover Hamza's diagnosis of examiner time pressure and understand how structured presentation highlights your hard work.",
      },
      {
        stepNumber: 2,
        title: "Master the 3-Hour Exam Formula",
        moduleId: "strategies",
        href: "/strategies/3-hour-formula",
        actionText: "Read the Most-Read Strategy",
        rationale:
          "Learn how allocating exact minutes for MCQs, shorts, and longs prevents the universal exam panic.",
      },
      {
        stepNumber: 3,
        title: "Learn the Essential Paper Presentation Rules",
        moduleId: "paper-hacks",
        href: "/paper-hacks",
        actionText: "Explore Paper Hacks",
        rationale:
          "See the 1.5-inch margin technique and the 5-box numerical layout that instantly builds examiner trust.",
      },
      {
        stepNumber: 4,
        title: "Test Yourself with a Quick 25-Mark Mock Test",
        moduleId: "mock-tests",
        href: "/mock-tests",
        actionText: "Start a 25-Mark Test",
        rationale:
          "Experience the timed exam simulator, get your initial score, and earn your first +25 XP.",
      },
      {
        stepNumber: 5,
        title: "Launch Your First Pomodoro Study Session",
        moduleId: "utilities",
        href: "/utilities?tab=timers",
        actionText: "Open Pomodoro Timer",
        rationale:
          "Use the 25-minute focus clock to begin your daily revision without getting distracted.",
      },
    ],
  },
  {
    id: "board-countdown",
    title: "The 30-Day Board Exam Sprint",
    targetAudience: "Candidates with 30 to 60 days remaining before annual board papers",
    description:
      "A high-intensity, structured preparation sequence designed to maximize retention, verify date sheets, and eliminate costly presentation mistakes.",
    estimatedTime: "Daily Revision Routine",
    iconName: "Flame",
    steps: [
      {
        stepNumber: 1,
        title: "Verify the Official Date Sheet & SLO Weights",
        moduleId: "board-watch",
        href: "/board-watch",
        actionText: "Check Board Watch Radar",
        rationale:
          "Confirm exact paper dates for your board and understand the 50% Knowledge / 35% Understanding / 15% Application breakdown.",
      },
      {
        stepNumber: 2,
        title: "Download Verified Pairing Schemes",
        moduleId: "resources",
        href: "/resources",
        actionText: "Get Pairing Schemes",
        rationale:
          "Pin the pairing scheme above your desk to focus on high-yield chapter pairings for long questions.",
      },
      {
        stepNumber: 3,
        title: "Solve Authentic 5-Year Past Papers",
        moduleId: "past-papers",
        href: "/past-papers",
        actionText: "Generate Past Paper Sets",
        rationale:
          "Practice repeated questions under timed conditions to identify repeated numerical trends.",
      },
      {
        stepNumber: 4,
        title: "Take Full-Length 75-Mark Timed Mock Exams",
        moduleId: "mock-tests",
        href: "/mock-tests",
        actionText: "Take 75-Mark Mock Exam",
        rationale:
          "Train your hand and mind to endure the full 3-hour duration without cramping or losing pace.",
      },
      {
        stepNumber: 5,
        title: "Review the Exam Day Hall Checklist",
        moduleId: "exam-day-guidebook",
        href: "/exam-day-guidebook",
        actionText: "Review Exam Day Guidebook",
        rationale:
          "Ensure roll number slips, stationary, transparent clipboards, and center arrival plans are set 48 hours prior.",
      },
    ],
  },
  {
    id: "improve-scores",
    title: "The Score Improvement Overhaul (Targeting A+ & High-Bracket Marks)",
    targetAudience: "Hardworking students aiming to transition from mid-tier percentages to top tier / 1050+ marks",
    description:
      "Bridge the critical gap between knowing the textbook syllabus and ensuring the examiner awards full credit through structured presentation and diagnostic revision. (Note: Individual marks depend on thorough study and board marking; presentation highlights your mastery rather than replacing it).",
    estimatedTime: "2 to 3 Weeks",
    iconName: "TrendingUp",
    steps: [
      {
        stepNumber: 1,
        title: "Analyze Checker Psychology & Rapid Evaluation Dynamics",
        moduleId: "my-story",
        href: "/my-story",
        actionText: "Read Founder Hamza's Analysis",
        rationale:
          "Understand examiner time constraints and why papers without clear visual structure risk losing marks even when the underlying answers are correct.",
      },
      {
        stepNumber: 2,
        title: "Apply the 5-Box Numerical Format in Physics & Chem",
        moduleId: "paper-hacks",
        href: "/paper-hacks",
        actionText: "Master Presentation Hacks",
        rationale:
          "Ensure no examiner cuts 1 mark for missing given data or missing SI units in numerical answers.",
      },
      {
        stepNumber: 3,
        title: "Study Subject-Specific Strategy Playbooks",
        moduleId: "strategies",
        href: "/strategies",
        actionText: "Browse Strategy Guides",
        rationale:
          "Read targeted guides on Math MCQ elimination, English essay structure, and Urdu khulasa pacing.",
      },
      {
        stepNumber: 4,
        title: "Calculate Target Aggregate with the 40% Benchmark",
        moduleId: "utilities",
        href: "/utilities?tab=calculators",
        actionText: "Open Aggregate Calculator",
        rationale:
          "Simulate your marks across all compulsory and elective papers to see exactly where you need +5 marks to reach your desired grade.",
      },
      {
        stepNumber: 5,
        title: "Track Daily Weak Areas on the Dashboard",
        moduleId: "dashboard",
        href: "/dashboard",
        actionText: "Review Student Dashboard",
        rationale:
          "Isolate specific chapters where mock test accuracy dropped below 80% and drill those questions.",
      },
    ],
  },
  {
    id: "doubt-clearing",
    title: "Instant Concept & Numerical Problem Solving",
    targetAudience: "Students stuck on a difficult textbook problem, derivation, or grammar rule",
    description:
      "Get unstuck in under 60 seconds with step-by-step textbook-compliant explanations, voice dictation, and photo upload.",
    estimatedTime: "5 Minutes",
    iconName: "Zap",
    steps: [
      {
        stepNumber: 1,
        title: "Open the Floating AI Assistant",
        moduleId: "ai-doubt-solver",
        href: "#doubt-solver",
        actionText: "Tap the Glowing Sparkle Orb",
        rationale:
          "Launch the Matric Mastery AI modal from the bottom-right corner of any page.",
      },
      {
        stepNumber: 2,
        title: "Type, Speak, or Snap a Photo of the Problem",
        moduleId: "ai-doubt-solver",
        href: "#doubt-solver",
        actionText: "Attach Question Photo",
        rationale:
          "Upload a textbook picture or speak using Web Speech voice dictation in English or Urdu.",
      },
      {
        stepNumber: 3,
        title: "Follow the Punjab Board Step-by-Step Derivation",
        moduleId: "ai-doubt-solver",
        href: "#doubt-solver",
        actionText: "Read Mathematical Steps",
        rationale:
          "Examine the standard textbook formulas, variable definitions, and intermediate arithmetic.",
      },
      {
        stepNumber: 4,
        title: "Check Related Past Paper Occurrences",
        moduleId: "ai-doubt-solver",
        href: "#doubt-solver",
        actionText: "Click 'Related Past Papers'",
        rationale:
          "See which board years (e.g. Multan 2024, Lahore 2023) tested this exact topic and how many marks it carried.",
      },
      {
        stepNumber: 5,
        title: "Copy the Solution or Share with Study Partners",
        moduleId: "ai-doubt-solver",
        href: "#doubt-solver",
        actionText: "Copy / Share WhatsApp",
        rationale:
          "Save the solution to your study notes or send it to your class study group.",
      },
    ],
  },
  {
    id: "rumor-check",
    title: "The Rumor & Announcement Verifier",
    targetAudience: "Students confused by viral TikTok/WhatsApp claims about date sheet delays or paper leaks",
    description:
      "Separate factual PBCC/BISE board notifications from dangerous fake news in less than two minutes.",
    estimatedTime: "2 Minutes",
    iconName: "ShieldAlert",
    steps: [
      {
        stepNumber: 1,
        title: "Check the Verified Board Watch Stream",
        moduleId: "board-watch",
        href: "/board-watch",
        actionText: "Open Board Watch Radar",
        rationale:
          "Filter by 'Confirmed' to see official government and PBCC notifications with official gazette reference numbers.",
      },
      {
        stepNumber: 2,
        title: "Consult the Rumor Clarifications Feed",
        moduleId: "board-watch",
        href: "/board-watch?category=rumor",
        actionText: "View Debunked Rumors",
        rationale:
          "Check whether the trending claim (e.g. 'matric exams delayed due to rain') has already been investigated and debunked.",
      },
      {
        stepNumber: 3,
        title: "Cross-Check Official Board Direct Portals",
        moduleId: "board-watch",
        href: "/board-watch#boards",
        actionText: "Access 9-Board Directory",
        rationale:
          "Directly visit your board's official portal (e.g., bisemultan.edu.pk or biselahore.com) via verified links.",
      },
      {
        stepNumber: 4,
        title: "Submit Suspicious Notices to Admin Verification",
        moduleId: "board-watch",
        href: "/board-watch",
        actionText: "Submit Tip to Team",
        rationale:
          "If an unverified notification is circulating in your school, submit it through the tip line for investigative review.",
      },
    ],
  },
  {
    id: "study-routine",
    title: "Daily Study Habit & Productivity Setup",
    targetAudience: "Students struggling with procrastination, irregular study hours, or exam anxiety",
    description:
      "Establish an organized, disciplined daily study routine using Pomodoro focus blocks, milestone countdowns, and progress tracking.",
    estimatedTime: "Daily Habit",
    iconName: "Clock",
    steps: [
      {
        stepNumber: 1,
        title: "Set Your Academic Countdown in Utilities",
        moduleId: "utilities",
        href: "/utilities?tab=calendar",
        actionText: "Set Custom Deadlines",
        rationale:
          "Add your school send-up and board exam dates to see the exact remaining days count down every morning.",
      },
      {
        stepNumber: 2,
        title: "Execute Two 25-Minute Pomodoro Focus Cycles",
        moduleId: "utilities",
        href: "/utilities?tab=timers",
        actionText: "Start 25m Focus Block",
        rationale:
          "Focus on one chapter with zero phone notifications. Take a genuine 5-minute break when the chime rings.",
      },
      {
        stepNumber: 3,
        title: "Check Off Daily Tasks on the Dashboard",
        moduleId: "dashboard",
        href: "/dashboard",
        actionText: "Complete Daily Checklist",
        rationale:
          "Log your completed numericals and reading goals to increment your study streak and earn XP.",
      },
      {
        stepNumber: 4,
        title: "Export a Safe Local JSON Backup",
        moduleId: "utilities",
        href: "/utilities?tab=dashboard",
        actionText: "Export Backup (JSON)",
        rationale:
          "Preserve all your study logs and custom deadlines safely on your device with 1 click.",
      },
    ],
  },
];
