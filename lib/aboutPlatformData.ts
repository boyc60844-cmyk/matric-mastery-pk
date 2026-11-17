export interface ScopePanelItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  summary: string;
  focusPoints: string[];
}

export interface PlatformOfferingItem {
  id: string;
  category: "AI & Intelligence" | "Study Tools" | "Exam Practice";
  title: string;
  routeLabel: string;
  href: string;
  summary: string;
  availabilityNote: string;
}

export interface EcosystemSummaryItem {
  name: string;
  role: string;
  detail: string;
}

export const ABOUT_PLATFORM_IDENTITY = {
  eyebrow: "ABOUT MATRIC MASTERY · INDEPENDENT ACADEMIC TECHNOLOGY PLATFORM",
  headline: "Built to Bring Clarity, Tools, and Strategy to Classes 9–12.",
  intro:
    "Matric Mastery is an independent Pakistani educational technology platform serving students across Classes 9–12 (SSC and HSSC). It brings together structured exam strategies, verified examination updates, practical daily study utilities, and AI-assisted study help in one distraction-free web workspace.",
  problemSolved:
    "Students preparing for Pakistani board examinations frequently struggle with scattered notes, unverified social-media date rumours, and unclear marking expectations. Matric Mastery replaces guesswork with organized resources, accurate board timelines, and lightweight software tools built for everyday phones and computers.",
  missionHeadline:
    "Accessible Study Tools and Reliable Exam Guidance—Without Academy Barriers.",
  missionBody:
    "Our mission is straightforward: help students in Secondary (Classes 9–10) and Higher Secondary (Classes 11–12) prepare with clearer strategy, verify examination updates directly against credible notices, and organize daily study routines using technology built for speed and focus.",
};

export const ACADEMIC_SCOPE_PANELS: ScopePanelItem[] = [
  {
    id: "ssc",
    tag: "Classes 9–10",
    title: "Secondary School Certificate (SSC)",
    subtitle: "Matriculation Foundation",
    summary:
      "Core exam presentation strategies, timed mock tests, past paper practice, and verified admission and date-sheet schedules for Class 9 and Class 10 students.",
    focusPoints: [
      "Subject playbooks and presentation techniques for structured board answers",
      "Confirmed Matric 2027 admission deadlines and Class 10 start date tracking in PKT",
      "Free-first text AI tutoring tailored to Class 9–10 textbook concepts",
    ],
  },
  {
    id: "hssc",
    tag: "Classes 11–12",
    title: "Higher Secondary School Certificate (HSSC)",
    subtitle: "Intermediate Expansion",
    summary:
      "Expanded board intelligence, passing-policy clarity, verified announcement tracking, and precision daily utilities supporting Class 11 and Class 12 candidates.",
    focusPoints: [
      "Board Watch coverage tracking official HSSC schedule announcements and policy updates",
      "Pomodoro focus timers, NTP-synced Pakistan timekeeping, and scientific calculators",
      "Clear separation of confirmed HSSC dates from schedules awaiting board confirmation",
    ],
  },
  {
    id: "punjab",
    tag: "Provincial Boards",
    title: "Punjab Boards (9 BISEs)",
    subtitle: "PBCC & PECTAA Ecosystem",
    summary:
      "Aligned with Punjab Boards Committee of Chairmen (PBCC) calendars, PECTAA syllabus notifications, and all nine BISE portals across Punjab.",
    focusPoints: [
      "Directory links to Lahore, Multan, Rawalpindi, Faisalabad, Gujranwala, Bahawalpur, Sargodha, Sahiwal, and DG Khan boards",
      "40% IBCC passing criteria and aggregate calculation tools",
      "News verification separating official BISE circulars from unverified social posts",
    ],
  },
  {
    id: "fbise",
    tag: "Federal Board",
    title: "Federal Board (FBISE)",
    subtitle: "Islamabad & Federal Curriculum",
    summary:
      "Dedicated Board Watch tracking and academic readiness coverage addressing FBISE policy updates and examination workflows.",
    focusPoints: [
      "Tracking FBISE annual examination updates and assessment structure shifts",
      "Exam-day preparation rules, checklists, and study utility tools usable nationwide",
      "Clear distinction between provincial BISE notices and Federal Board announcements",
    ],
  },
];

export const PLATFORM_OFFERINGS: PlatformOfferingItem[] = [
  {
    id: "ai-assistant",
    category: "AI & Intelligence",
    title: "AI Assistant",
    routeLabel: "/ai",
    href: "/ai",
    summary:
      "A conversation-first AI study workspace supporting text-based queries in English and Urdu, structured mathematical rendering, subject filters, and local on-device chat history.",
    availabilityNote: "Operational (Text-based tutoring via Cloudflare Workers AI; image upload remains disabled).",
  },
  {
    id: "board-watch",
    category: "AI & Intelligence",
    title: "Board Watch",
    routeLabel: "/board-watch",
    href: "/board-watch",
    summary:
      "Centralized examination reporting covering Punjab Boards and FBISE—tracking confirmed schedules, passing policies, syllabus announcements, and official board links.",
    availabilityNote: "Operational (Regularly reviewed against BISE, PECTAA, and verified reports).",
  },
  {
    id: "study-utilities",
    category: "Study Tools",
    title: "Study Utilities",
    routeLabel: "/utilities",
    href: "/utilities",
    summary:
      "Daily student productivity toolkit: PKT-locked Academic Calendar & confirmed exam countdowns, Pomodoro & stopwatch timers, 40% aggregate marks calculator, unit converter, and local JSON backup.",
    availabilityNote: "Operational (Runs locally in your browser with PKT UTC+05:00 precision).",
  },
  {
    id: "academic-resources",
    category: "Study Tools",
    title: "Academic Resources & Paper Hacks",
    routeLabel: "/resources",
    href: "/resources",
    summary:
      "Curated study materials, 30+ subject strategy playbooks, and step-by-step paper presentation rules designed to make answers clean and readable for board examiners.",
    availabilityNote: "Operational (Accessible across Resources, Strategies, and Paper Hacks).",
  },
  {
    id: "exam-info",
    category: "Exam Practice",
    title: "Examination Information & Guidebook",
    routeLabel: "/exam-day-guidebook",
    href: "/exam-day-guidebook",
    summary:
      "Practical hall checklists, exam-day preparation guidance, and a searchable Website Guide so students find every tool and verified policy without confusion.",
    availabilityNote: "Operational (Available via Exam Day Guidebook and Website Guide).",
  },
  {
    id: "mock-tests",
    category: "Exam Practice",
    title: "Mock Tests & Practice Tools",
    routeLabel: "/mock-tests",
    href: "/mock-tests",
    summary:
      "Timed online practice tests and Punjab/Federal Board past paper practice workflows engineered to build exam speed, recall accuracy, and time management.",
    availabilityNote: "Operational (Available via Mock Tests and Past Papers).",
  },
];

export const TECH_ECOSYSTEM_OVERVIEW: EcosystemSummaryItem[] = [
  {
    name: "React + Vite",
    role: "Frontend Web Platform",
    detail:
      "Verified in the repository (`package.json`, `vite.config.ts`): drives fast SPA navigation, responsive Android/desktop UI, and interactive study calculators.",
  },
  {
    name: "Google AI Studio / Gemini",
    role: "AI-Assisted Development",
    detail:
      "Used by Abdul Wahab as an engineering assistant during software development and UI iteration—separate from platform ownership or sponsorship.",
  },
  {
    name: "GitHub",
    role: "Source-Code Management",
    detail:
      "Hosts version-controlled project code and tracks updates cleanly across iterations.",
  },
  {
    name: "Vercel",
    role: "Hosting & Deployment",
    detail:
      "Verified in `vercel.json`: builds and serves the production Vite application globally with HTTPS.",
  },
  {
    name: "Cloudflare Workers",
    role: "Backend Infrastructure",
    detail:
      "Verified in `worker/index.ts`: runs serverless edge endpoints for the AI study workspace without exposing private keys in the browser.",
  },
];
