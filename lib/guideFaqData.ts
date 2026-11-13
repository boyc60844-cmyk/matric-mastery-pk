export interface GuideFaqItem {
  question: string;
  answer: string;
  category: "about" | "features" | "accuracy" | "technical";
}

export const GUIDE_FAQS: GuideFaqItem[] = [
  {
    question: "What is Matric Mastery and why was it created?",
    answer:
      "Matric Mastery is an independent, 100% free academic platform created by Hamza, an actual 10th-grade matriculation student from Multan, Pakistan. It was built to address a real problem in board examinations: hardworking students who know their syllabus frequently lose marks because their presentation looks cluttered, their time is mismanaged, or they do not understand how examiners evaluate papers under tight marking schedules. Matric Mastery shares tested paper presentation techniques, 30+ strategy playbooks, timed mock tests, and real-time board intelligence to help candidates showcase their preparation and target high-bracket marks without expensive evening academies.",
    category: "about",
  },
  {
    question: "Who is Matric Mastery designed for? Can 9th, 11th, or 12th class students use it?",
    answer:
      "Matric Mastery is primarily designed for 9th and 10th Class students sitting examinations under all 9 Punjab Boards (BISE Lahore, Multan, Rawalpindi, Gujranwala, Faisalabad, Sargodha, Bahawalpur, DG Khan, Sahiwal) as well as the Federal Board (FBISE Islamabad). However, the paper presentation rules (margin formatting, 5-box numericals, 605 cut marker headers), the 3-hour exam formula, the Exam Day Guidebook, and the Study Utilities Suite are equally valuable for 8th-grade foundational students and 11th/12th Class Intermediate (FSc Pre-Medical, Pre-Engineering, ICS) candidates.",
    category: "about",
  },
  {
    question: "Is Matric Mastery completely free? Are there any hidden academy fees or paywalls?",
    answer:
      "Yes, Matric Mastery is 100% free with zero academy fees, subscriptions, or paywalls. There are no paid tiers, locked past papers, or commercial upselling. Founder Hamza made a permanent pledge that high-impact exam guidance should remain free to every student in Pakistan regardless of family income or location. Note: Standard cellular data carrier charges from your mobile operator (Jazz, Zong, Telenor, Ufone) may apply when accessing the website over mobile internet.",
    category: "about",
  },
  {
    question: "Is Matric Mastery an official government or Punjab Board (BISE) website?",
    answer:
      "No. Matric Mastery is an independent educational initiative and is not an official government agency, government body, or affiliated subsidiary of any Board of Intermediate and Secondary Education (BISE) or the Punjab Boards Committee of Chairmen (PBCC). All official board notifications are cross-referenced directly with public gazettes and verified through the Board Watch radar, and links to the 9 official board portals are provided for direct institutional verification.",
    category: "accuracy",
  },
  {
    question: "How often is Matric Mastery updated, and what is the weekly upgrade cycle?",
    answer:
      "Matric Mastery follows targeted weekly iteration sprints during active academic cycles, with weekly strategy digests shared directly with our student community on Sundays via WhatsApp. Updates fall into distinct categories: new major modules, enhancements to existing tools, newly verified 2026/2027 pairing schemes and syllabus guidelines, mobile interface polish, performance hardening, and regulatory compliance. Not every week introduces a brand-new tool; maintenance, bug fixes, and verified syllabus accuracy take priority over unnecessary feature churn.",
    category: "technical",
  },
  {
    question: "How do website versions work, and what is the current version?",
    answer:
      "Matric Mastery tracks public releases through semantic versioning documented in a centralized release manifest (lib/releaseManifest.ts). The current active release is v3.8.0 (Matric Mastery AI & Free-First Workers Infrastructure), succeeding v3.7.0 (Platform Guide & Orientation Architecture), v3.6.0 (Real-World Utility & Intelligence System), and v3.5.0 (Legal & Policies Center). Milestone v3.2.0 was an internal staging branch for authentication testing and was not published as an independent public codex edition. Each version records verified engineering and documentation updates without altering historical release records.",
    category: "technical",
  },
  {
    question: "How does Matric Mastery AI work, and what are its capabilities and limitations?",
    answer:
      "Matric Mastery AI is an on-demand concept-clearing companion available via both the dedicated /ai workspace and the quick sparkle modal across the site, engineered for Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct-fast for text queries). It accepts typed questions, spoken voice dictation via Web Speech API (English and Urdu/Roman Urdu), and keeps conversation history strictly in browser LocalStorage. Live model inference activates when connected to the adult-deployed Worker endpoint via VITE_AI_WORKER_URL (within Cloudflare's 10,000 free daily Neurons limit, with zero paid fallback). Multimodal image/diagram inference (@cf/meta/llama-3.2-11b-vision-instruct) is kept separate and paused until parent/guardian license acceptance. When disconnected or when daily free quota is exhausted, the interface transparently directs students to verified study guides rather than showing fake AI responses.",
    category: "features",
  },
  {
    question: "How reliable are the announcements and dates published on Board Watch?",
    answer:
      "Board Watch applies a strict verification hierarchy: every announcement is clearly tagged as Confirmed (backed by an official BISE/PBCC notification number), Reported (credible educational reporting pending gazette publication), Expected (timeline projections based on historical 5-year board patterns), Deadline (official fee or enrollment cutoff), or Rumor Clarification (actively debunking false social media claims). Every entry displays an exact verification date and timestamp so candidates never confuse rumors with confirmed policy.",
    category: "accuracy",
  },
  {
    question: "Does Matric Mastery work on low-end mobile phones and offline?",
    answer:
      "Yes. The platform is engineered mobile-first with pure CSS 3D geometry that pauses when offscreen to preserve 60fps performance on budget Android devices. Core tools like the Student Dashboard, Pomodoro timers, aggregate calculators, unit converters, and local study logs run entirely in the browser using LocalStorage and remain usable even if network connectivity drops. Progressive Web App (PWA) manifest support allows you to add Matric Mastery to your mobile home screen like a native app.",
    category: "technical",
  },
  {
    question: "How can I save my study progress, streaks, and mock test scores?",
    answer:
      "Your study streaks, earned XP, daily checklists, mock test scores, and personal deadlines are automatically saved in your browser's private LocalStorage without requiring any account. You can click 'Student Login' to link your verified Google profile identity in one click via Firebase Auth. To seamlessly transfer your complete study records between devices (such as your phone and laptop), you can click 'Export Backup (JSON)' in the /utilities overview dashboard and import the file on your other device at any time.",
    category: "technical",
  },
  {
    question: "What should I do if a feature is temporarily unavailable or external data is stale?",
    answer:
      "1. For temporary network blips or stale cache, perform a hard refresh (Ctrl+F5 or pull-to-refresh on mobile). 2. If weather or forex data appears cached, click the 'Refresh' button in /utilities (data caches for 15 minutes for weather and 1 hour for forex to avoid rate limits). 3. If the AI Doubt Solver shows 'AI server busy', wait 5 seconds and click the 'Retry' button. 4. If voice dictation fails, ensure your browser has microphone permission enabled in settings. 5. If you encounter a persistent bug or have feedback, message the official Matric Mastery student WhatsApp community (+92 308 4703973).",
    category: "technical",
  },
  {
    question: "How does Matric Mastery protect student privacy and personal data?",
    answer:
      "Under our codified Legal & Policies Center (MM-LEG-v3.5.0), Matric Mastery enforces a strict zero-telemetry and anti-tracking policy. We do NOT deploy third-party advertising cookies, Meta Pixel trackers, Google AdSense cookies, or marketing beacons. All study logs, timers, mistakes, and notes remain stored 100% privately on your own local device. Student leaderboards use anonymized handles to safeguard minor privacy under PECA 2016 statutory directives.",
    category: "about",
  },
];

export function generateFaqJsonLd(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GUIDE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return JSON.stringify(schema);
}
