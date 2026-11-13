export interface ReleaseItem {
  version: string;
  codename: string;
  releaseDate: string;
  status: "released" | "in-development" | "planned";
  category: "Major System" | "Feature Expansion" | "Governance" | "Performance";
  summary: string;
  features: string[];
  improvements: string[];
  fixes?: string[];
  notes?: string;
}

export interface WeeklyUpgradePolicy {
  cycle: string;
  day: string;
  philosophy: string;
  changeCategories: {
    type: string;
    description: string;
  }[];
  verificationStandard: string;
}

export const CURRENT_VERSION = "v3.8.0";
export const CURRENT_RELEASE_DATE = "November 2026";
export const CURRENT_RELEASE_CODENAME = "Matric Mastery AI & Free-First Workers Infrastructure";

export const WEEKLY_UPGRADE_POLICY: WeeklyUpgradePolicy = {
  cycle: "Targeted Weekly Iterations During Active Academic Cycles",
  day: "Active Weekly Sprints (Weekly Strategy Digest Delivered Sundays via WhatsApp)",
  philosophy:
    "Matric Mastery evolves through disciplined, manually verified weekly updates during active exam cycles. Rather than disruptive overhauls, the platform improves steadily based on actual student feedback, board schedule announcements, and examination milestones. Not every sprint introduces a brand-new module; many cycles focus exclusively on performance hardening, bug squashing, mobile responsiveness, or verified syllabus accuracy.",
  changeCategories: [
    {
      type: "New Major Features",
      description:
        "Brand-new standalone modules such as the Study Utilities Hub, AI Doubt Solver, or Interactive Mock Engine.",
    },
    {
      type: "Feature Enhancements",
      description:
        "Upgrading existing features with new capabilities (e.g. adding fastest/slowest lap tracking to timers or voice input to the AI solver).",
    },
    {
      type: "Content & Resource Additions",
      description:
        "Publishing verified 2026/2027 pairing schemes, new past paper templates, or high-yield strategy playbooks.",
    },
    {
      type: "Interface & Usability Polish",
      description:
        "Refining visual hierarchy, typography, active tactile tap states, and zero-jitter tabular numeric displays.",
    },
    {
      type: "Mobile Experience Refinements",
      description:
        "Optimizing 44px tap targets, multi-layer drawer animations, safe-area insets, and preventing horizontal overflow.",
    },
    {
      type: "Performance & Reliability Fixes",
      description:
        "Eliminating render bottlenecks, pausing background animation loops when offscreen, and enforcing 60fps mobile execution.",
    },
    {
      type: "Technical & Legal Maintenance",
      description:
        "Keeping PBCC regulations, PECA 2016 disclosures, local storage keys, and security rules strictly accurate and compliant.",
    },
  ],
  verificationStandard:
    "Every update undergoes strict manual and automated verification gates before public deployment: (1) Full TypeScript type-checking and lint verification, (2) Legal data snapshot parity verification against baseline records, and (3) Multi-viewport responsive testing across 320px to 1440px displays.",
};

export const RELEASE_HISTORY: ReleaseItem[] = [
  {
    version: "v3.8.0",
    codename: "Matric Mastery AI & Free-First Workers Infrastructure",
    releaseDate: "November 2026",
    status: "released",
    category: "Major System",
    summary:
      "Introduced the dedicated /ai workspace and Free-First Cloudflare Workers AI backend architecture, completely removed legacy Gemini 1.5 Flash dependencies and deprecated model IDs, configured @cf/meta/llama-3.1-8b-instruct-fast for sustainable daily free Neuron capacity, and separated image inference under explicit adult license gating.",
    features: [
      "Launched dedicated standalone Matric Mastery AI workspace route (/ai) with subject tagging, Urdu/Roman Urdu mode, local-only chat history, and JSON export.",
      "Prepared Cloudflare Workers AI backend (worker/index.ts) and standalone Wrangler configuration (worker/wrangler.toml) using server-side env.AI binding with VITE_AI_WORKER_URL integration.",
      "Configured active text model @cf/meta/llama-3.1-8b-instruct-fast (~563 realistic daily queries within Cloudflare's 10,000 free Neurons/day cap) via TEXT_MODEL / AI_MODEL environment variables.",
      "Separated multimodal diagram model (@cf/meta/llama-3.2-11b-vision-instruct) behind explicit ENABLE_VISION_MODEL=false gating until parent/guardian license acceptance.",
      "Implemented HTTP 429 QUOTA_EXHAUSTED responses with zero paid fallback, CORS origin lockdown, strict input size/length limits, and zero student prompt logging.",
    ],
    improvements: [
      "Completely scrubbed all Gemini 1.5 Flash inference code, fallbacks, and UI labels across lib/ai.ts, lib/aiClient.ts, DoubtSolverModal.tsx, /guide, and /ai.",
      "Standardized product naming ('Matric Mastery AI') and backend labeling ('Cloudflare Workers AI') with transparent preview/unconfigured notices when worker deployment is pending.",
      "Prevented untrusted client-side model overrides in worker/index.ts so users cannot drain daily Neuron capacity via larger models.",
      "Added automated infrastructure & security verification suite (scripts/test-ai-infrastructure.mjs).",
    ],
    notes:
      "Prepared worker/index.ts backend requires separate adult-supervised Cloudflare Free account deployment and VITE_AI_WORKER_URL configuration for live inference; vision inference remains paused pending Meta license approval.",
  },
  {
    version: "v3.7.0",
    codename: "Platform Guide & Orientation Architecture",
    releaseDate: "November 2026",
    status: "released",
    category: "Major System",
    summary:
      "Introduced the definitive Website Guide & Platform Directory (/guide), complete first-time visitor on-ramp, 6 situation-based student journeys, centralized release manifest, mobile website manual, and verified Schema.org FAQPage structured data.",
    features: [
      "Created standalone Comprehensive Website Guide & Directory (/guide).",
      "Interactive 15-module platform directory with category filtering and live search.",
      "6 practical Student Journeys for first-timers, cramming candidates, and schedule planners.",
      "Dedicated Mobile Website Guide detailing navigation strips, drawer mechanics, and floating tools.",
      "Centralized release manifest architecture (lib/releaseManifest.ts) for transparent weekly version tracking.",
      "12-question comprehensive FAQ with valid Schema.org FAQPage JSON-LD structured data.",
    ],
    improvements: [
      "Added /guide to main site navigation and drawer directory.",
      "Integrated contextual guidance links across the platform.",
      "Enhanced breadcrumb routing and search engine discoverability.",
    ],
    notes:
      "Serves as the permanent orientation hub for all incoming matriculation candidates.",
  },
  {
    version: "v3.6.0",
    codename: "Real-World Utility & Intelligence System",
    releaseDate: "November 2026",
    status: "released",
    category: "Major System",
    summary:
      "Engineered the comprehensive /utilities suite: WorldTimeAPI synchronized precision clock, official PBCC academic calendar with holiday tracker, drift-free Pomodoro and productivity timers, Punjab Board 40% aggregate calculator, physics/chemistry unit converter, live exam city weather, and zero-telemetry local JSON backup.",
    features: [
      "Launched full-featured /utilities page and site-wide UtilityHubModal.",
      "Precision clock with NTP network sync and 5 international timezones.",
      "PBCC academic calendar with interactive monthly grid and personal deadline CRUD.",
      "Pomodoro focus engine (25m/5m cycles), countdown timer, stopwatch with laps, and session tracker.",
      "Punjab Board 40% passing benchmark calculator, scientific calculator, and multi-unit converter.",
      "Live exam city atmospheric weather (Open-Meteo) and educational foreign exchange estimator.",
      "Student Overview Dashboard with 100% private local JSON backup and restore.",
    ],
    improvements: [
      "Standardized tabular-nums across all real-time counters and clocks to eliminate layout jitter.",
      "Polished analog clock with continuous cumulative rotation to prevent 354° snap-back on minute rollover.",
      "Added tactile active:scale micro-animations across all buttons, tabs, and keypad switches.",
    ],
    notes:
      "All student study data remains strictly on the local device without server-side tracking.",
  },
  {
    version: "v3.5.0",
    codename: "Legal & Policies Center",
    releaseDate: "November 2026",
    status: "released",
    category: "Governance",
    summary:
      "Transformed standalone legal notices into the codified 15-Chapter Legal & Policies Center (MM-LEG-v3.5.0), preserving all 14 foundational clauses verbatim while establishing formal privacy, cookie, acceptable use, and cybercrime adherence standards.",
    features: [
      "Codified 15 comprehensive legal chapters (MM-LEG-v3.5.0 archive codex).",
      "Preserved 100% of original foundational legal declarations verbatim.",
      "Published dedicated Terms of Service, Student Privacy, and Cookie Architecture disclosures.",
      "Documented LocalStorage key audit and Google Analytics disclosures.",
      "Formalized PECA 2016 statutory compliance and DMCA takedown protocol.",
    ],
    improvements: [
      "Built independent automated parity verification script (scripts/verify-legal-integrity.mjs).",
      "Refined responsive two-column layout with mobile-safe floating buttons.",
      "Created printable PDF version of the complete codex.",
    ],
    notes:
      "Re-established baseline legal snapshot ensuring zero future accidental content regressions.",
  },
  {
    version: "v3.4.0",
    codename: "2026 Examination Edition",
    releaseDate: "October 2026",
    status: "released",
    category: "Feature Expansion",
    summary:
      "Expanded platform capabilities with the 2026/2027 Exam Day Guidebook, Board Watch intelligence radar for Punjab's 9 BISE boards, and Web Speech voice integration in the AI Doubt Solver.",
    features: [
      "Published 2026/2027 Exam Day Guidebook with interactive hall survival checklist.",
      "Introduced Board Watch radar tracking official PBCC date sheets, rumors, and SLO blueprints.",
      "Added Web Speech API voice input (English & Urdu) and photo upload to AI Doubt Solver.",
      "Integrated audio narration support in article views.",
    ],
    improvements: [
      "Added verified 9-board portal directory with helpline numbers and controller contacts.",
      "Strengthened exam-day packing checklist for 9th, 10th, 11th, and 12th classes.",
    ],
    notes:
      "Major expansion addressing candidate panic in the final 30 days before exams.",
  },
  {
    version: "v3.3.0",
    codename: "Student Profile Auth & Identity Integration",
    releaseDate: "September 2026",
    status: "released",
    category: "Feature Expansion",
    summary:
      "Integrated Google Firebase Authentication for 1-click verified student authentication with local privacy, enabling students to link their verified Google profile identity while keeping preparation records secure in private browser storage.",
    features: [
      "Google 1-click student profile login via Firebase Authentication.",
      "Verified student profile identity badge and personalized dashboard session.",
      "Student scorecard masking standards for minor privacy protection.",
    ],
    improvements: [
      "Seamless anonymous fallback—platform remains 100% usable without logging in.",
      "Enhanced leaderboard rankings with live streak verification.",
    ],
    notes:
      "Note: Milestone v3.2.0 was an internal staging branch for authentication testing and was not published as an independent public codex edition.",
  },
  {
    version: "v3.1.0",
    codename: "Foundational Topper Architecture",
    releaseDate: "August 2026",
    status: "released",
    category: "Major System",
    summary:
      "Initial launch of Matric Mastery by Hamza from Multan. Codified the core 30+ strategy playbooks, tested paper presentation methods, timed mock testing engine, and the Zero-Tuition pledge.",
    features: [
      "30+ subject-specific exam strategy playbooks for Punjab Boards.",
      "Tested paper presentation techniques (cut marker formatting, 5-box numericals).",
      "Interactive timed mock test engine with authentic Punjab Board question bank.",
      "Authentic past paper templates and printable answer sheets.",
      "Foundational Zero-Leak and Zero-Academy declarations.",
    ],
    improvements: [
      "Established pure CSS 3D isometric brand identity running at 60fps on mobile.",
      "Designed high-contrast dark theme with kinetic yellow (#FFD60A) accents.",
    ],
    notes:
      "Preserved as the foundational baseline in Chapter 01 of the codified Legal Center.",
  },
];
