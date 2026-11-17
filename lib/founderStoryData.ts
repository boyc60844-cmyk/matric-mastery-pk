export interface OriginChapter {
  index: string;
  heading: string;
  lead: string;
  paragraphs: string[];
  pullQuote?: {
    quote: string;
    attribution: string;
  };
}

export interface EvolutionStage {
  id: string;
  step: string;
  label: string;
  title: string;
  phaseNote: string;
  summary: string;
  highlights: string[];
}

export interface PlatformFeatureShowcase {
  id: string;
  title: string;
  href: string;
  categoryLabel: string;
  description: string;
  highlights: string[];
  featured?: boolean;
}

export interface TechStackNode {
  id: string;
  name: string;
  layer: string;
  roleTitle: string;
  attributionType: "Frontend System" | "AI-Assisted Tooling" | "Version Control" | "Edge Hosting" | "Serverless Infrastructure";
  plainExplanation: string;
  technicalRole: string;
  humanDistinction: string;
}

export interface CreditEntry {
  role: string;
  entity: string;
  note: string;
  category: "Human Leadership & Authorship" | "Technology & Development Ecosystem";
}

export const FOUNDER_PROFILE = {
  name: "Abdul Wahab",
  role: "Founder & Product Creator",
  monogram: "AW",
  initiative: "Matric Mastery",
  eyebrow: "THE STORY BEHIND THE PLATFORM",
  heroHeadline: "Beyond the Classroom. Built for What's Next.",
  heroSummary:
    "Matric Mastery is an independent Pakistani educational technology platform built around a straightforward premise: students preparing for board examinations deserve structured tools, verified guidance, and clarity—not scattered PDFs or guesswork.",
  shortBio:
    "Abdul Wahab is a student founder and independent product creator who started Matric Mastery to organize the study methods, paper-presentation principles, and board exam tools that students across Pakistan routinely struggle to find in one reliable place.",
  visionStatement:
    "To replace last-minute exam anxiety with an accessible, distraction-free study workspace built specifically around how Pakistani board examinations actually work—from Class 9 through Class 12.",
  responsibilities: [
    {
      title: "Product Direction & Architecture",
      detail:
        "Defining what tools students genuinely need, structuring navigation, and shaping the platform from single study guides into a unified workspace.",
    },
    {
      title: "Content Writing & Editorial Standards",
      detail:
        "Writing clear subject strategies, paper presentation explanations, and student-friendly guidance tailored to Punjab Boards and FBISE.",
    },
    {
      title: "Academic Research & Verification",
      detail:
        "Cross-checking official BISE notices, PECTAA syllabus updates, and examination schedules before publishing information on Board Watch and Study Utilities.",
    },
    {
      title: "Iterative Product Refinement",
      detail:
        "Testing usability on everyday mobile devices, removing clutter, and guiding AI-assisted development cycles toward practical student outcomes.",
    },
  ],
};

export const ORIGIN_CHAPTERS: OriginChapter[] = [
  {
    index: "01",
    heading: "Seeing the Gap Between Effort and Results",
    lead: "Understanding a subject in class does not automatically translate into high marks on a board answer sheet.",
    paragraphs: [
      "Across Pakistan, thousands of capable students spend months memorizing chapters and solving exercises, only to feel disappointed when board results arrive. The issue is rarely a lack of hard work. More often, it is a disconnect between what a student knows and how an examiner evaluates hundreds of scripts under tight time constraints.",
      "Unstructured paragraphs, cramped diagrams, unclear question numbering, and poor time allocation quietly cost marks—even when a student understands the core textbook concepts.",
    ],
  },
  {
    index: "02",
    heading: "From Scattered Advice to Structured Craft",
    lead: "Good exam technique should not depend on having the right senior or an expensive tuition academy.",
    paragraphs: [
      "Useful guidance on board presentation, numerical formatting, and paper strategy usually circulates informally—through photocopied notes, brief classroom tips, or contradictory social media posts. Most students have to piece those lessons together by trial and error.",
      "Abdul Wahab began organizing these practical principles into clear, repeatable playbooks: how to pace an exam paper, how to format derivations and definitions for instant readability, and how to separate verified board updates from rumours.",
    ],
    pullQuote: {
      quote:
        "Students rarely fail for lack of potential. Far more often, they lack clear systems, trustworthy information, and tools built for how their exams actually work.",
      attribution: "Abdul Wahab — Founder & Product Creator, Matric Mastery",
    },
  },
  {
    index: "03",
    heading: "Building a Focused Technology Platform",
    lead: "Turning static advice into interactive tools that work cleanly on any student's phone.",
    paragraphs: [
      "A single article can explain a strategy, but students also need tools they can use every day—timed mock tests, a distraction-free AI study workspace, real Pakistan Standard Time exam countdowns, and a reliable place to verify board dates.",
      "Rather than copying cluttered portal layouts, Matric Mastery was designed around high-contrast obsidian surfaces, deliberate typography, and lightweight web performance so students on standard Android smartphones can open what they need without slowdowns.",
    ],
  },
  {
    index: "04",
    heading: "Growing Beyond Class 9 and 10",
    lead: "The same need for clarity continues straight through Intermediate.",
    paragraphs: [
      "What started with Matriculation strategies naturally revealed a wider reality: students stepping from Class 10 into Class 11 and 12 face the exact same pressure across Punjab Boards and FBISE.",
      "Expanding Matric Mastery across Classes 9–12 keeps the original mission intact while giving both SSC and HSSC students a shared platform for structured preparation, utilities, and verified examination intelligence.",
    ],
  },
];

export const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    id: "idea",
    step: "01",
    label: "Foundation",
    title: "The Original Idea",
    phaseNote: "Problem Discovery",
    summary:
      "Identified how presentation, time pacing, and trustworthy exam guidance shape board outcomes—and set out to make clear exam strategy freely accessible without tuition barriers.",
    highlights: [
      "Focused on examiner readability, structured answers, and practical study methods.",
      "Committed to keeping core guidance free and independent of coaching academies.",
    ],
  },
  {
    id: "initial-build",
    step: "02",
    label: "Core Web App",
    title: "Initial Website Development",
    phaseNote: "React + Vite Architecture",
    summary:
      "Built the foundational web platform with a clean dark-mode interface, responsive layouts for Android and desktop screens, and fast client-side navigation.",
    highlights: [
      "Established the obsidian-black and electric-yellow (#FFD60A) visual system.",
      "Engineered lightweight views suited for budget smartphones and everyday mobile connections.",
    ],
  },
  {
    id: "resources",
    step: "03",
    label: "Study Library",
    title: "Academic Resources & Practice",
    phaseNote: "Playbooks, Hacks & Practice",
    summary:
      "Added structured subject strategies, Paper Hacks, timed Mock Tests, Past Papers practice, and the Exam Day Guidebook to turn passive reading into active preparation.",
    highlights: [
      "Subject-specific strategy playbooks and presentation techniques.",
      "Timed mock tests and past paper preparation tools with immediate review.",
    ],
  },
  {
    id: "utilities-board",
    step: "04",
    label: "Daily Toolkit",
    title: "Study Utilities & Board Watch",
    phaseNote: "Verified Information & Precision Tools",
    summary:
      "Expanded the platform with real-world student utilities—PKT-locked exam countdowns, Pomodoro timers, aggregate calculators—alongside Board Watch for verified examination updates.",
    highlights: [
      "Board Watch separates confirmed BISE/PECTAA updates from unconfirmed rumours.",
      "Study Utilities anchor all countdowns strictly to Pakistan Standard Time (UTC+05:00).",
    ],
  },
  {
    id: "ai-workspace",
    step: "05",
    label: "AI Integration",
    title: "AI-Assisted Tutoring Workspace",
    phaseNote: "Serverless Student Help",
    summary:
      "Introduced a dedicated Matric Mastery AI workspace backed by Cloudflare Workers, later refined into a full-viewport conversational interface with local chat organization and English/Urdu math formatting.",
    highlights: [
      "Runs on free-first Cloudflare Workers serverless infrastructure without exposing API keys.",
      "Keeps student conversation history locally on-device for privacy.",
    ],
  },
  {
    id: "expansion-9-12",
    step: "06",
    label: "Classes 9–12",
    title: "Expansion Across SSC & HSSC",
    phaseNote: "Punjab Boards & FBISE",
    summary:
      "Broadened Board Watch coverage, academic guidance, and platform orientation to serve both Matric (Classes 9–10) and Intermediate (Classes 11–12) students.",
    highlights: [
      "Covers both Punjab Boards (9 BISEs) and Federal Board (FBISE) examination news.",
      "Continues evolving with verified syllabus changes and interface improvements.",
    ],
  },
];

export const PLATFORM_SCOPE_TIERS = [
  {
    label: "Classes 9–10",
    title: "SSC / Matriculation",
    detail: "Foundational subject strategies, paper presentation craft, mock practice, and board schedule tracking.",
  },
  {
    label: "Classes 11–12",
    title: "HSSC / Intermediate",
    detail: "Expanded board intelligence, passing-policy clarity, study utilities, and guided examination updates.",
  },
  {
    label: "Regional Coverage",
    title: "Punjab Boards",
    detail: "All 9 Punjab BISE jurisdictions alongside PECTAA assessment and syllabus announcements.",
  },
  {
    label: "Federal Coverage",
    title: "FBISE",
    detail: "Federal Board policy awareness, structured assessment guidance, and verified update tracking.",
  },
];

export const PLATFORM_SHOWCASE_FEATURES: PlatformFeatureShowcase[] = [
  {
    id: "ai-assistant",
    title: "Matric Mastery AI Workspace",
    href: "/ai",
    categoryLabel: "Conversational Study Aid",
    description:
      "A full-viewport, text-based AI study workspace supporting English and Urdu queries, structured mathematics rendering, subject context, and private local conversation history.",
    highlights: [
      "Step-by-step concept explanations without distracting clutter",
      "Serverless Cloudflare Workers routing with on-device chat privacy",
    ],
    featured: true,
  },
  {
    id: "board-watch",
    title: "Board Watch",
    href: "/board-watch",
    categoryLabel: "Verified Examination News",
    description:
      "Focused examination reporting for Punjab Boards and FBISE covering official schedules, passing standards, syllabus changes, and direct portal directories.",
    highlights: [
      "Explicit separation between confirmed notices and awaiting dates",
      "Clear portal links to BISE and PECTAA announcements",
    ],
  },
  {
    id: "study-utilities",
    title: "Study Utilities Hub",
    href: "/utilities",
    categoryLabel: "Precision Student Toolkit",
    description:
      "Daily preparation tools anchored to Pakistan Standard Time: Academic Calendar with verified countdowns, Pomodoro timers, NTP clock, and aggregate marks calculators.",
    highlights: [
      "Timezone-locked PKT countdown math with no device-clock drift",
      "Private local JSON backup and restore for student study logs",
    ],
  },
  {
    id: "practice-engine",
    title: "Mock Tests & Past Papers",
    href: "/mock-tests",
    categoryLabel: "Active Exam Practice",
    description:
      "Timed multiple-choice practice and past paper workflows built to train speed, accuracy, and board-pattern familiarity before exam day.",
    highlights: [
      "Interactive timed testing environment",
      "Paired with Past Papers practice at /past-papers",
    ],
  },
  {
    id: "academic-resources",
    title: "Strategies, Paper Hacks & Resources",
    href: "/strategies",
    categoryLabel: "Academic Library & Exam Craft",
    description:
      "Curated subject playbooks, answer-sheet presentation rules, downloadable study guides, and the Exam Day Guidebook for calm hall readiness.",
    highlights: [
      "Actionable presentation rules for diagrams, headings, and numericals",
      "Accessible from Strategies, Paper Hacks, Resources, and Exam Guidebook",
    ],
  },
];

export const TECH_STACK_NODES: TechStackNode[] = [
  {
    id: "frontend",
    name: "React + Vite",
    layer: "01 · Frontend Application",
    roleTitle: "Interactive Web Interface",
    attributionType: "Frontend System",
    plainExplanation:
      "Powers every screen students see and touch—instant navigation, animations, study calculators, and responsive mobile layouts.",
    technicalRole:
      "React 19 with Vite 8 bundling, TypeScript strict typing, Tailwind CSS v4 design tokens, and Framer Motion transitions.",
    humanDistinction:
      "Designed and structured around Abdul Wahab's layout priorities for clarity and fast mobile loading.",
  },
  {
    id: "ai-tooling",
    name: "Google AI Studio / Gemini",
    layer: "02 · Development Workflow",
    roleTitle: "AI-Assisted Development",
    attributionType: "AI-Assisted Tooling",
    plainExplanation:
      "Used during software engineering to accelerate UI prototyping, code refactoring, and technical problem-solving.",
    technicalRole:
      "Development acceleration and code-generation assistant used under direct human product direction and verification.",
    humanDistinction:
      "An assistive engineering tool—not the founder, owner, or sponsor. Google does not officially endorse or operate Matric Mastery.",
  },
  {
    id: "github",
    name: "GitHub",
    layer: "03 · Source Control",
    roleTitle: "Code Versioning & History",
    attributionType: "Version Control",
    plainExplanation:
      "Stores the entire project codebase safely, tracking every update, fix, and feature iteration cleanly.",
    technicalRole:
      "Central Git repository managing branch history, codebase integrity, and automated deployment triggers.",
    humanDistinction:
      "Managed under Abdul Wahab's repository governance for transparent project evolution.",
  },
  {
    id: "vercel",
    name: "Vercel",
    layer: "04 · Global Web Delivery",
    roleTitle: "Hosting & Deployment",
    attributionType: "Edge Hosting",
    plainExplanation:
      "Serves the website reliably to students across Pakistan with fast page loads and automatic HTTPS security.",
    technicalRole:
      "Static Vite SPA production builds deployed via Vercel edge network with client-side route rewrites.",
    humanDistinction:
      "Connects repository updates directly to the live student-facing web experience.",
  },
  {
    id: "cloudflare",
    name: "Cloudflare Workers",
    layer: "05 · Serverless Backend",
    roleTitle: "Backend Infrastructure",
    attributionType: "Serverless Infrastructure",
    plainExplanation:
      "Handles AI workspace requests securely on the server side so student chats remain fast without exposing private configuration in the browser.",
    technicalRole:
      "Edge serverless worker (`worker/index.ts`) providing CORS protection, input limits, streaming responses, and Workers AI routing.",
    humanDistinction:
      "Configured to respect free-tier capacity limits and zero-logging student privacy boundaries.",
  },
];

export const PLATFORM_CREDITS: CreditEntry[] = [
  {
    role: "Founder & Product Creator",
    entity: "Abdul Wahab",
    note: "Originated the platform, defines its standards, and leads its ongoing direction.",
    category: "Human Leadership & Authorship",
  },
  {
    role: "Product Direction & Planning",
    entity: "Abdul Wahab",
    note: "Determines platform scope across Classes 9–12, feature priorities, and student workflows.",
    category: "Human Leadership & Authorship",
  },
  {
    role: "Content Writing & Editorial",
    entity: "Abdul Wahab",
    note: "Authors and refines study playbooks, guidance notes, and platform copy.",
    category: "Human Leadership & Authorship",
  },
  {
    role: "Research & Academic Content Organization",
    entity: "Abdul Wahab",
    note: "Verifies board announcements, syllabus structure, and educational reference material.",
    category: "Human Leadership & Authorship",
  },
  {
    role: "AI-Assisted Development",
    entity: "Google AI Studio — Gemini",
    note: "Used as an AI development tool during engineering; Google does not own, sponsor, or endorse the platform.",
    category: "Technology & Development Ecosystem",
  },
  {
    role: "Source Code Management",
    entity: "GitHub",
    note: "Version control and codebase repository management.",
    category: "Technology & Development Ecosystem",
  },
  {
    role: "Hosting",
    entity: "Vercel",
    note: "Frontend production builds and web hosting.",
    category: "Technology & Development Ecosystem",
  },
  {
    role: "Backend Infrastructure",
    entity: "Cloudflare Workers",
    note: "Serverless edge endpoints powering the AI study workspace.",
    category: "Technology & Development Ecosystem",
  },
];

export const STORY_SECTIONS = [
  { id: "hero", label: "Overview" },
  { id: "founder", label: "Founder" },
  { id: "origin", label: "Origin" },
  { id: "evolution", label: "Evolution" },
  { id: "platform", label: "Platform" },
  { id: "technology", label: "Technology" },
  { id: "credits", label: "Credits" },
  { id: "mission", label: "Mission" },
] as const;
