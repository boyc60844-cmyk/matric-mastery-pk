/* ==========================================================================
   MATRIC MASTERY - COMPREHENSIVE LEGAL & POLICIES CENTER (/legal)
   Title: Legal & Policies Center
   Complete 15-Section Comprehensive Architecture:
   01. Preserved Foundational Legal Notices & Disclaimers (Verbatim Original Text)
   02. Terms of Service
   03. Privacy Policy
   04. Cookie Policy
   05. Educational Information Disclaimer
   06. Independent Platform & Non-Affiliation Disclaimer
   07. Copyright & Intellectual Property
   08. Third-Party Content & External Links
   09. Acceptable Use Policy
   10. Content Accuracy, Updates & Corrections
   11. User Contributions & Feedback
   12. Security & Data Protection
   13. Copyright Complaints & Takedown Requests
   14. Accessibility Statement
   15. Policy Updates, Effective Dates & Contact
   ========================================================================== */

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Building2,
  Copyright,
  AlertTriangle,
  GraduationCap,
  MessageCircle,
  ExternalLink,
  Search,
  Check,
  Copy,
  Printer,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  Cookie,
  UserCheck,
  Ban,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  History,
  Info,
  ArrowRight,
  ArrowUp,
  Bookmark,
  CheckCircle2,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// DATA STRUCTURES
// ============================================================================

export type PolicyCategory =
  | "all"
  | "preserved-original"
  | "terms"
  | "privacy-cookies"
  | "disclaimers"
  | "ip-copyright"
  | "safety-accessibility";

export interface LegalSubSection {
  subtitle: string;
  paragraphs: string[];
}

export interface LegalCenterSection {
  id: string;
  category: PolicyCategory;
  number: string;
  title: string;
  shortSummary: string;
  badges: string[];
  subsections?: LegalSubSection[];
  paragraphs?: string[]; // for flat legacy compatibility
  lastUpdated: string;
  isOriginalPreserved?: boolean;
}

// ----------------------------------------------------------------------------
// 01. PRESERVED ORIGINAL SECTIONS (VERBATIM - 100% PRESERVED WITHOUT MODIFICATION)
// ----------------------------------------------------------------------------
const PRESERVED_ORIGINAL_ITEMS: Array<{
  id: string;
  number: string;
  title: string;
  shortSummary: string;
  badges: string[];
  paragraphs: string[];
  lastUpdated: string;
}> = [
  {
    id: "ownership-governance",
    number: "01.1",
    title: "Platform Ownership & Governance",
    shortSummary:
      "Matric Mastery is an independent educational initiative based in Multan, Punjab, Pakistan.",
    badges: ["Multan, Pakistan", "Independent IP", "Non-Governmental"],
    paragraphs: [
      "Matric Mastery (hereinafter referred to as 'the Platform', 'we', 'us', or 'our') is independently architected, authored, and administered by Hamza, an independent educational creator based in Multan, Punjab, Pakistan.",
      "All proprietary educational blueprints, paper pattern analysis matrices, 605/604 cut-marker presentation layouts, step-by-step mathematical algorithms, past paper index systems, and software codebases accessible on matricmastery.pk constitute original intellectual property.",
      "The Platform operates exclusively as a supplemental educational resource dedicated to advancing secondary school comprehension, presentation aesthetics, and study discipline across Pakistan.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "terms-of-service-legacy",
    number: "01.2",
    title: "Terms of Service & Permitted Use",
    shortSummary:
      "Binding conditions governing student account access, mock test utilization, and intellectual resources.",
    badges: ["Binding Agreement", "Student License", "Non-Commercial"],
    paragraphs: [
      "By accessing, browsing, registering via Google Cloud Login, or utilizing the interactive tools on Matric Mastery (including timed mock tests, AI strategy summaries, past paper libraries, and leaderboard rankings), you unconditionally accept and agree to be legally bound by these Terms of Service.",
      "We grant registered candidates a limited, non-exclusive, revocable, and non-transferable license to access our materials strictly for personal, non-commercial secondary education revision.",
      "You are expressly prohibited from: (a) sublicensing, selling, leasing, or commercially redistributing our strategy guides or question banks; (b) deploying automated bots, spiders, or scrapers to extract platform data; (c) attempting to reverse-engineer our frontend code, database rules, or scoring algorithms; and (d) creating derivative products or academies built upon our copyrighted presentation layouts.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "privacy-student-data-legacy",
    number: "01.3",
    title: "Privacy Policy & Student Data Protection",
    shortSummary:
      "How we handle Google authentication profiles, gamification progress, and protect minor students.",
    badges: ["Zero Ad-Tracking", "No Data Brokering", "Encrypted Cloud"],
    paragraphs: [
      "Student privacy is sacred. Matric Mastery does not sell, rent, monetize, or trade student personal records, email addresses, phone numbers, or academic performance metrics with any commercial advertising brokers, academies, or third-party marketing entities.",
      "Data Collected: When you authenticate via Google Cloud Login, we receive your public display name, email address, profile avatar, and unique Firebase UID. When you interact with our tools, we store your XP points, completed mock test results, study streaks, and board preferences in secure Google Cloud Firestore with 256-bit SSL encryption.",
      "Minor Safety Standards: Recognizing that a significant proportion of matric candidates are under 18 years of age, our database records contain zero behavioral profiling, zero targeted advertising pixels, and zero location tracking beyond standard server security telemetry.",
      "Right to Erasure (Account Deletion): Any registered candidate or their legal guardian may request the complete, permanent deletion of their account profile, mock test logs, and leaderboard standing at any time by contacting our verified WhatsApp desk or submitting an erasure request.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "peca-compliance-legacy",
    number: "01.4",
    title: "PECA 2016 Pakistan Cybercrime Compliance",
    shortSummary:
      "Statutory compliance under the Prevention of Electronic Crimes Act (PECA) enforced with the FIA.",
    badges: ["PECA Act 2016", "FIA Cybercrime", "Zero Tolerance"],
    paragraphs: [
      "Matric Mastery operates in strict accordance with the laws of the Islamic Republic of Pakistan, including the Prevention of Electronic Crimes Act, 2016 (PECA).",
      "Any malicious attempts to compromise platform infrastructure, conduct denial-of-service (DDoS) assaults, bypass Firebase security rules, inject malicious SQL/script vectors, impersonate platform leadership, or deface student leaderboards constitute criminal offenses punishable under PECA Sections 3, 4, 6, 7, and 14.",
      "All unauthorized access attempts, server logs, IP addresses, and digital footprints will be immediately compiled and referred to the Federal Investigation Agency (FIA) Cyber Crime Wing for formal investigation and prosecution under Pakistani cyber law.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "gdpr-compliance-legacy",
    number: "01.5",
    title: "GDPR & International Student Privacy Rights",
    shortSummary:
      "Global data protection standards for overseas Pakistani candidates taking Federal Board exams.",
    badges: ["GDPR Compliant", "Overseas FBISE", "Data Portability"],
    paragraphs: [
      "For students taking Pakistani board examinations from overseas centers (including UAE, Saudi Arabia, Qatar, Oman, Kuwait, and the European Union), we adhere to the European General Data Protection Regulation (GDPR) data protection principles.",
      "Overseas candidates enjoy: (1) The Right to Access stored academic telemetry; (2) The Right to Rectification of inaccurate leaderboard profiles; (3) The Right to Restrict Processing; (4) The Right to Data Portability (exporting your test progress as JSON); and (5) The Right to Object to automated leaderboard score aggregation.",
      "Our backend data handling operates on legitimate educational interest and explicit candidate consent provided at Google Authentication.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "cookies-localstorage-legacy",
    number: "01.6",
    title: "Cookies & Local Storage Architecture",
    shortSummary:
      "Transparent disclosure of browser client storage used for study streak and offline capabilities.",
    badges: ["Essential Only", "Zero Third-Party Ads", "Transparent Storage"],
    paragraphs: [
      "Matric Mastery employs strictly essential client-side storage technologies to ensure seamless educational continuity across mobile and desktop devices.",
      "LocalStorage Keys Employed: (a) 'matric_mastery_read_slugs': Tracks which subject strategy guides you have completed; (b) 'mm_exam_checklist_v1': Saves your packed items for exam morning; (c) 'mm_user_board' and 'mm_user_class': Remembers your target board (e.g. BISE Lahore) for localized test curation; and (d) 'matric_mastery_saved_slugs': Bookmarked articles for revision.",
      "Zero Commercial Tracking Cookies: We deploy zero third-party advertising cookies, zero Meta tracking pixels, and zero cross-site affiliate beacons.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "bise-non-affiliation-legacy",
    number: "01.7",
    title: "Government & BISE Board Non-Affiliation",
    shortSummary:
      "Formal declaration of non-governmental status regarding BISE Punjab and Federal Boards.",
    badges: ["Non-Governmental", "Independent Guide", "Verify at bise.edu.pk"],
    paragraphs: [
      "Matric Mastery is an independent educational publisher and revision platform. It is NOT affiliated with, sponsored by, endorsed by, certified by, or officially associated with any government education department or examination board.",
      "Specifically, we maintain no formal institutional relationship with: the Board of Intermediate and Secondary Education (BISE) Lahore, BISE Multan, BISE Rawalpindi, BISE Faisalabad, BISE Gujranwala, BISE Sahiwal, BISE Sargodha, BISE Bahawalpur, BISE D.G. Khan, or the Federal Board of Intermediate and Secondary Education (FBISE) Islamabad.",
      "Our 'Exam Day Guidebook' and timing calculators provide student survival tips compiled from publicly disseminated board notices. They do not constitute official administrative orders. Candidates must always verify their personal datesheets, center codes, and entry rules on their official board portal (e.g. biselahore.com or fbise.edu.pk).",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "anti-cheating-leak-policy-legacy",
    number: "01.8",
    title: "Zero-Tolerance Anti-Cheating & Zero-Leak Policy",
    shortSummary:
      "Absolute prohibition of exam paper leaks, unfair means (UMC), and commercial cheating scams.",
    badges: ["Zero Leaks", "Strict Anti-UMC", "Merit First"],
    paragraphs: [
      "Matric Mastery stands uncompromisingly for academic integrity and meritocratic achievement in Pakistani education.",
      "Zero Leak Guarantee: We do NOT possess, predict, distribute, buy, or sell leaked board question papers. Any third-party WhatsApp group, Telegram channel, Facebook page, or TikTok account claiming to provide 'Matric Mastery leaked 2026 papers' or 'board paper guarantees' is operating an extortion scam and should be reported to the police immediately.",
      "Unfair Means (UMC) Warning: Our platform strictly educates students against carrying unauthorized materials into the examination hall. We endorse and uphold BISE Section 144 regulations, biometric roll slip verification, and mobile phone confiscation policies.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "ai-disclosure-policy-legacy",
    number: "01.9",
    title: "AI Content, Voice Player & Algorithmic Tool Disclosure",
    shortSummary:
      "Ethical transparency regarding artificial intelligence summarizers and speech generation (2026 Standards).",
    badges: ["AI Ethics 2026", "Human Verified", "Algorithmic Advisory"],
    paragraphs: [
      "In compliance with modern 2026 digital transparency and AI disclosure frameworks, we provide clear notice regarding the assistive generative tools deployed on this website.",
      "AI Strategy Summarizer & Mind Maps: Our interactive article summarizer utilizes generative artificial intelligence to synthesize high-level conceptual bullet points from our human-authored curriculum playbooks. These summaries are designed for rapid revision and do not replace primary textbook study.",
      "Voice Learning Player: Text-to-speech audio narration utilizes speech synthesis models. While engineered for academic clarity, pronunciations of specific Urdu terminology or scientific nomenclature may occasionally vary.",
      "Human Editorial Oversight: Every foundational strategy, 605 marker presentation technique, and mock test answer key is authored and verified by human position holders before publication.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "copyright-dmca-legacy",
    number: "01.10",
    title: "Intellectual Property, DMCA & Piracy Takedowns",
    shortSummary:
      "Legal recourse against unauthorized PDF compilations, WhatsApp academy bundles, and scraping.",
    badges: ["© 2026 Copyright", "DMCA Enforcement", "Commercial Ban"],
    paragraphs: [
      "© 2026 Matric Mastery. All Rights Reserved. The editorial text, custom vector diagrams, examination hack playbooks, paper presentation blueprints, CSS visual designs, and brand trademarks are protected under international copyright treaties and Pakistani intellectual property statutes.",
      "Academy Reselling Prohibited: Packaging our free online guides into paid PDF bundles, printing our guides for private commercial tuition centers, or watermarking our materials under competitor branding is unlawful copyright infringement.",
      "DMCA Enforcement: We actively monitor online repositories. Infringing content hosted on Google Drive, Scribd, Mega, or social media will be subjected to expedited DMCA Takedown Notices to web hosts, registrar locks, and domain de-indexing via Google Search Console.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "liability-warranty-legacy",
    number: "01.11",
    title: "Limitation of Liability & Warranty Disclaimer",
    shortSummary:
      "Educational guidance provided 'as-is' without guarantee of specific numerical mark outcomes.",
    badges: ["As-Is Service", "No Grade Guarantee", "Liability Cap"],
    paragraphs: [
      "Matric Mastery and its authors provide study blueprints, mock exams, and presentation hacks on an 'AS-IS' and 'AS-AVAILABLE' basis without warranties of any kind, either express or implied.",
      "While our techniques reflect proven methods that yielded 1050+ marks for position holders, academic outcomes depend entirely on individual student preparation, memory retention, handwriting discipline, examiner subjectivity, and real-time hall execution. We cannot and do not guarantee specific grade thresholds or board positions.",
      "To the fullest extent permissible by applicable law, Matric Mastery shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from platform downtime during exam season, device incompatibility, or local board marking discrepancies.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "external-links-integrations-legacy",
    number: "01.12",
    title: "External Links & Third-Party Cloud Integrations",
    shortSummary:
      "Policies regarding Google Firebase authentication, cloud services, and external educational portals.",
    badges: ["Google Cloud", "Third-Party Outbound", "Safe Browsing"],
    paragraphs: [
      "Our website contains hyperlinks directing students to official government websites (e.g. bise.edu.pk), academic resources, and Google services. These external sites operate under independent terms and privacy protocols.",
      "Matric Mastery does not govern, endorse, or assume responsibility for the uptime, content, security protocols, or privacy practices of external web properties.",
      "Authentication Infrastructure: Our user login infrastructure is powered by Google Firebase Auth. By signing in, you also acknowledge Google's Terms of Service and Privacy Policy regarding credential tokenization.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "testimonials-scorecards-legacy",
    number: "01.13",
    title: "User Testimonials & Scorecard Proof Masking",
    shortSummary:
      "How student achievement proofs are verified and masked for complete dignity and safety.",
    badges: ["Identity Masking", "Voluntary Consent", "Minor Protection"],
    paragraphs: [
      "Students voluntarily share their board examination result cards, marksheets, and feedback with Matric Mastery as proof of our presentation methodology.",
      "Identity Masking: To safeguard student dignity and prevent academic harassment, all student roll numbers, permanent registration numbers, and school names are masked or redacted by default prior to public display, unless explicit consent is provided.",
      "Revocation of Showcase: Any candidate whose result or review appears on the platform may request its immediate modification or removal by contacting our official support desk.",
    ],
    lastUpdated: "October 2026",
  },
  {
    id: "disputes-jurisdiction-legacy",
    number: "01.14",
    title: "Dispute Resolution & Legal Jurisdiction",
    shortSummary:
      "Governing law under the Islamic Republic of Pakistan with exclusive jurisdiction in Punjab courts.",
    badges: ["Punjab Courts", "Pakistani Law", "Arbitration First"],
    paragraphs: [
      "These legal notices, terms of service, and privacy policies shall be governed by, interpreted, and construed in accordance with the substantive laws of the Islamic Republic of Pakistan.",
      "Informal Resolution: Before initiating any formal legal dispute, the parties agree to engage in good-faith informal negotiations via our verified legal desk to achieve an amicable resolution.",
      "Exclusive Jurisdiction: In the event of unresolved disputes or copyright litigation, the competent courts located in Multan or Lahore, Punjab, Pakistan, shall exercise exclusive territorial jurisdiction.",
    ],
    lastUpdated: "October 2026",
  },
];

// ----------------------------------------------------------------------------
// FULL 15-SECTION COMPREHENSIVE LEGAL & POLICIES CENTER
// ----------------------------------------------------------------------------
const LEGAL_CENTER_SECTIONS: LegalCenterSection[] = [
  // SECTION 01: Preserved Original Content
  {
    id: "preserved-original-content",
    category: "preserved-original",
    number: "01",
    title: "Foundational Legal Notices & Original Statements (Preserved Verbatim)",
    shortSummary:
      "Complete, verbatim preservation of Matric Mastery's foundational legal declarations, governance rules, and operational terms.",
    badges: ["Verbatim Original", "14 Sub-Clauses", "Historical Foundation"],
    lastUpdated: "October 2026",
    isOriginalPreserved: true,
    paragraphs: [
      "In strict accordance with our Absolute Content Preservation Charter, all fourteen original legal clauses, disclaimers, and regulatory statements first published for Matric Mastery are preserved below without alteration, deletion, paraphrasing, or omission.",
      "These original declarations remain active, legally binding, and formally integrated as the foundational charter of this Legal & Policies Center.",
    ],
  },

  // SECTION 02: Terms of Service
  {
    id: "terms-of-service",
    category: "terms",
    number: "02",
    title: "Terms of Service & User Access Agreement",
    shortSummary:
      "Comprehensive contractual terms governing access, permissible usage, candidate responsibilities, and service availability.",
    badges: ["Binding Contract", "Contract Act 1872", "Student User License"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "2.1 Acceptance of Terms & Legal Capacity",
        paragraphs: [
          "By accessing, visiting, browsing, registering an account via Google Firebase Cloud authentication, or utilizing any educational tool, mock test simulator, past paper archive, or Board Watch tracker on Matric Mastery ('matricmastery.pk'), you enter into a legally binding agreement with Matric Mastery under the Contract Act, 1872 of Pakistan.",
          "If you are under 18 years of age (a minor under Pakistani law), you represent and warrant that you access this website with the knowledge, guidance, and consent of your parent or legal guardian, who agrees to these Terms of Service on your behalf.",
        ],
      },
      {
        subtitle: "2.2 Permitted Use & Revocable Educational License",
        paragraphs: [
          "We grant each student a non-exclusive, personal, non-transferable, revocable, and royalty-free license to view, bookmark, and review our study playbooks, paper presentation templates, and examination hack guides strictly for private secondary school revision.",
          "No commercial license is granted. Any institutional, academy, tuition center, or commercial usage requires explicit written permission from our Multan administration desk.",
        ],
      },
      {
        subtitle: "2.3 Student Account Responsibilities & Security",
        paragraphs: [
          "When you create an account via Google Authentication, your account credentials remain managed through Google's secure OAuth flow. You are responsible for safeguarding your personal device, Google account access, and authentication tokens.",
          "You agree to notify us immediately via our verified WhatsApp desk (+92 308 4703973) if you suspect unauthorized access or compromise of your academic progress profile.",
        ],
      },
      {
        subtitle: "2.4 Service Availability, Maintenance & Modifications",
        paragraphs: [
          "Matric Mastery is provided on an 'as-available' basis. While we strive for 99.9% uptime during peak Punjab Board examination months (March to June), we do not guarantee uninterrupted, bug-free, or error-free platform availability.",
          "We reserve the right to modify, upgrade, refactor, or discontinue any feature, guide, subject playbook, or interactive test simulator at our editorial discretion without prior liability.",
        ],
      },
      {
        subtitle: "2.5 Severability & Entire Agreement",
        paragraphs: [
          "If any provision of these Terms is deemed unlawful, void, or unenforceable by a court of competent jurisdiction in Punjab, Pakistan, that provision shall be severable and shall not impair the validity or enforceability of any remaining provisions.",
        ],
      },
    ],
  },

  // SECTION 03: Privacy Policy
  {
    id: "privacy-policy",
    category: "privacy-cookies",
    number: "03",
    title: "Privacy Policy & Student Data Protection Charter",
    shortSummary:
      "Verified disclosures detailing data collection, Firebase Google Auth, client-side storage, and zero-monetization standards.",
    badges: ["Zero Ad-Tracking", "No Data Brokering", "Student Protection"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "3.1 Data Controller Identification",
        paragraphs: [
          "The data controller responsible for personal information processed on this platform is Hamza, founder and sole administrator of Matric Mastery, operating from Multan, Punjab, Pakistan.",
        ],
      },
      {
        subtitle: "3.2 Information Voluntarily Submitted by Visitors",
        paragraphs: [
          "Google Authentication Profile: When signing in via our Google Cloud Login, we receive your public display name, email address, profile avatar URL, and unique Firebase UID.",
          "Contact Form & WhatsApp Inquiries: When sending questions via the contact form or WhatsApp button, you provide your name, class level (9th or 10th), and query text. This information is transmitted directly to our official WhatsApp chat for academic assistance.",
          "Interactive Doubt Solver Inputs: Text queries or math equations entered into the Doubt Solver modal are processed in real time to generate educational explanations.",
        ],
      },
      {
        subtitle: "3.3 Automatically Collected Technical Telemetry",
        paragraphs: [
          "When you browse Matric Mastery, standard web server telemetry is logged, including your IP address, browser user-agent, operating system, referring URL, and visit timestamp. This data is collected solely for security defense, rate-limiting, and preventing malicious automated DDoS activity under PECA 2016.",
        ],
      },
      {
        subtitle: "3.4 Third-Party Services & Technical Integrations",
        paragraphs: [
          "Google Firebase Authentication: Provides tokenized login without Matric Mastery ever seeing or storing your Google password.",
          "Google Cloud Firestore: Securely stores user profile metadata, earned XP points, study streak tallies, and weekly leaderboard standings under encrypted database security rules.",
          "Google Analytics: Configured with measurement ID 'G-WFW2NN13E7' for aggregated, non-personalized traffic analytics (e.g. counting total page views per guide). No individual student identity is linked to analytics logs.",
        ],
      },
      {
        subtitle: "3.5 Absolute Prohibition on Commercial Data Brokering",
        paragraphs: [
          "Matric Mastery maintains an uncompromised zero-commercial-brokerage guarantee. We do not sell, rent, lease, monetize, share, or trade student profiles, emails, phone numbers, or test marks with tuition academies, test-prep publishers, commercial advertisers, or data brokers.",
        ],
      },
      {
        subtitle: "3.6 Student Minor Data Safety (Under-18 Protections)",
        paragraphs: [
          "Because the vast majority of matric candidates are adolescents aged 14 to 17, we implement heightened child data protection safeguards: zero commercial behavioral advertising, zero algorithmic profiling for commercial gain, and zero cross-site retargeting pixels.",
        ],
      },
      {
        subtitle: "3.7 Data Retention, Account Deletion & Right to Erasure",
        paragraphs: [
          "Students may permanently delete their account profile, mock test scores, streak counters, and leaderboard entry at any time. Simply send a message to our WhatsApp Verification Line (+92 308 4703973) or clear your browser's local storage.",
          "Upon receiving an account erasure request, your Firebase authentication record and Firestore database documents are purged within 48 business hours.",
        ],
      },
    ],
  },

  // SECTION 04: Cookie Policy
  {
    id: "cookie-policy",
    category: "privacy-cookies",
    number: "04",
    title: "Cookie & Client-Side Storage Policy",
    shortSummary:
      "Clear, verified audit of all cookies, localStorage keys, session tokens, and browser-level controls.",
    badges: ["Transparent Audit", "Essential Only", "LocalStorage Architecture"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "4.1 What Are Cookies and Client-Side Storage?",
        paragraphs: [
          "Cookies are small text files placed on your device by websites you visit. Client-side storage (such as HTML5 LocalStorage) allows modern web applications to save user preferences directly in your browser without transmitting them across the network on every click.",
        ],
      },
      {
        subtitle: "4.2 Essential Authentication Cookies & Tokens",
        paragraphs: [
          "When you sign in via Google Firebase, Firebase utilizes essential session storage tokens to maintain your logged-in state as you navigate between pages. These tokens are strictly necessary for the technical functionality of your student dashboard and cannot be turned off without disabling login.",
        ],
      },
      {
        subtitle: "4.3 Verified LocalStorage Key Audit",
        paragraphs: [
          "Based on our active codebase implementation, Matric Mastery utilizes the following strictly functional LocalStorage keys:",
          "• 'matric_mastery_read_slugs': Remembers which strategy guides you have completed so you can track your study coverage.",
          "• 'matric_mastery_saved_slugs': Stores your bookmarked guides for rapid one-click revision.",
          "• 'mm_exam_checklist_v1': Saves your packed items for exam morning (e.g. 605 marker, transparent clipboard, roll slip printout).",
          "• 'mm_user_board' & 'mm_user_class': Remembers your selected Punjab Board (e.g. BISE Lahore, BISE Multan) and target grade (9th or 10th).",
          "• 'totalXP' & 'matric_streak': Stores your earned gamification study points and daily login streaks.",
          "• 'matric_ai_history': Stores your recent Doubt Solver Q&A history locally on your device for offline review.",
          "• 'mm_mistakes': Stores question items flagged in mock exams inside your personal mistake notebook.",
          "• 'mm_lang': Remembers your preferred interface language ('en' for English or 'ur' for Urdu).",
        ],
      },
      {
        subtitle: "4.4 Analytics Cookies",
        paragraphs: [
          "We use Google Analytics cookies (such as '_ga' and '_ga_*') associated with measurement ID 'G-WFW2NN13E7'. These cookies gather anonymous, aggregate metrics (such as aggregate daily visitors and most read articles) to help us improve study content. They do not store personal student names or phone numbers.",
        ],
      },
      {
        subtitle: "4.5 Complete Absence of Commercial Advertising Cookies",
        paragraphs: [
          "Matric Mastery does NOT deploy any third-party advertising cookies, Meta Pixel trackers, Google AdSense cookies, TikTok conversion pixels, or affiliate tracking beacons. We do not track you across other websites.",
        ],
      },
      {
        subtitle: "4.6 Browser-Level Cookie & Storage Management",
        paragraphs: [
          "You can manage, restrict, or delete cookies and LocalStorage items through your browser settings:",
          "• Google Chrome / Android: Settings → Privacy and security → Third-party cookies / Site data.",
          "• Apple Safari / iOS: Settings → Safari → Advanced → Website Data.",
          "• Mozilla Firefox: Settings → Privacy & Security → Cookies and Site Data.",
          "Note: Clearing your browser's site data will reset your study checklist, bookmarked guides, and saved offline AI history.",
        ],
      },
    ],
  },

  // SECTION 05: Educational Information Disclaimer
  {
    id: "educational-disclaimer",
    category: "disclaimers",
    number: "05",
    title: "Educational Information & Academic Disclaimers",
    shortSummary:
      "Clarification that study blueprints, marker presentation techniques, and predictions do not guarantee specific exam outcomes.",
    badges: ["Educational Commentary", "No Grade Guarantee", "Student Responsibility"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "5.1 Nature of Study Blueprints & Presentation Hacks",
        paragraphs: [
          "All study guides, 605/604 cut-marker presentation layouts, time-management algorithms, numerical problem methods, and paper hacks published on Matric Mastery represent supplemental educational commentary and personal study methodologies.",
          "They are authored based on Hamza's verified experience achieving 1050+ marks in the Punjab Board examination and analyzing topper paper presentation habits across Multan and Lahore centers.",
        ],
      },
      {
        subtitle: "5.2 No Guarantee of Specific Numerical Marks or Board Positions",
        paragraphs: [
          "While our methodologies reflect proven best practices, individual academic performance depends on a wide range of factors, including personal preparation depth, conceptual clarity, memorization discipline, handwriting clarity under timed pressure, health on exam morning, and examiner subjectivity.",
          "Matric Mastery does NOT guarantee that adopting our strategies will result in specific numerical scores, grade thresholds (e.g. A+ or 90%+), or board position rankings. No educational guidance can substitute for diligent, personal textbook study.",
        ],
      },
      {
        subtitle: "5.3 Past Paper Patterns & Historical Recurrence Limits",
        paragraphs: [
          "Past paper frequency analyses, chapter pairing schemes, and 'important questions' highlights reflect historical examination trends across previous BISE cycles.",
          "Examination paper setting committees operate independently and hold the statutory authority to alter question distributions, introduce new conceptual derivations, or deviate from past pairing schemes. Past frequency is never a guarantee of future examination questions.",
        ],
      },
      {
        subtitle: "5.4 Board Watch Forecasts & Unofficial Estimates",
        paragraphs: [
          "Information displayed in our 'Board Watch' section—including expected examination dates, date sheet publication windows, and result declaration timelines—consists of unofficial editorial estimates derived from historical cyclical trends and credible news reporting.",
          "They do not constitute official board schedules until formally gazetted by the relevant BISE chairman.",
        ],
      },
      {
        subtitle: "5.5 Syllabus & Official Scheme Verification",
        paragraphs: [
          "Students must always cross-reference our guidance against the official textbooks issued by the Punjab Curriculum and Textbook Board (PCTB) and current circulars published by their designated board.",
        ],
      },
    ],
  },

  // SECTION 06: Independent Platform & Non-Affiliation Disclaimer
  {
    id: "board-non-affiliation",
    category: "disclaimers",
    number: "06",
    title: "Independent Platform & Government Non-Affiliation",
    shortSummary:
      "Explicit declaration of autonomy from all nine Punjab BISE boards, FBISE Islamabad, PBCC, and education ministries.",
    badges: ["100% Independent", "Nominative Fair Use", "Verify at Official Portals"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "6.1 Full Declaration of Non-Governmental Status",
        paragraphs: [
          "Matric Mastery is an independent, non-governmental, privately operated student informational platform founded and maintained by Hamza in Multan, Punjab, Pakistan.",
          "It is NOT an official board, NOT a government agency, NOT a subordinate office of any Board of Intermediate and Secondary Education (BISE), NOT affiliated with the Punjab Boards Committee of Chairmen (PBCC), and NOT an arm of the School Education Department or Higher Education Department of Punjab.",
        ],
      },
      {
        subtitle: "6.2 Complete List of Disclaimed Examination Bodies",
        paragraphs: [
          "Specifically, Matric Mastery maintains no formal sponsorship, institutional partnership, official representation, or joint venture with any of the following examination authorities:",
          "1. Board of Intermediate and Secondary Education (BISE) Lahore",
          "2. Board of Intermediate and Secondary Education (BISE) Gujranwala",
          "3. Board of Intermediate and Secondary Education (BISE) Faisalabad",
          "4. Board of Intermediate and Secondary Education (BISE) Rawalpindi",
          "5. Board of Intermediate and Secondary Education (BISE) Multan",
          "6. Board of Intermediate and Secondary Education (BISE) Sargodha",
          "7. Board of Intermediate and Secondary Education (BISE) Bahawalpur",
          "8. Board of Intermediate and Secondary Education (BISE) Dera Ghazi Khan",
          "9. Board of Intermediate and Secondary Education (BISE) Sahiwal",
          "10. Federal Board of Intermediate and Secondary Education (FBISE) Islamabad",
          "11. Punjab Boards Committee of Chairmen (PBCC)",
          "12. Punjab Curriculum and Textbook Board (PCTB) Lahore",
        ],
      },
      {
        subtitle: "6.3 Nominative Fair Use of Board Names & Designations",
        paragraphs: [
          "Any reference to board names (such as 'BISE Lahore', 'BISE Multan', 'FBISE') or curriculum titles is made strictly for purposes of identification, geographical classification, and nominative fair use to help students find information relevant to their specific jurisdiction.",
          "Such references do not imply endorsement, affiliation, sponsorship, or certification by any of those statutory boards.",
        ],
      },
      {
        subtitle: "6.4 Imperative to Verify Authoritative Notifications",
        paragraphs: [
          "For authoritative date sheets, roll number slips, admission fee schedules, examination center allotments, rechecking forms, and official gazetted results, candidates must always consult the original circulars published on their own board's official web portal (e.g. biselahore.com, bisemultan.edu.pk, fbise.edu.pk).",
        ],
      },
    ],
  },

  // SECTION 07: Copyright & Intellectual Property
  {
    id: "copyright-intellectual-property",
    category: "ip-copyright",
    number: "07",
    title: "Copyright & Intellectual Property Rights",
    shortSummary:
      "Protection of original editorial playbooks, 3D branding, software source code, and commercial reselling bans.",
    badges: ["Copyright Ordinance 1962", "Original Blueprints", "Commercial Ban"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "7.1 Matric Mastery Proprietary Intellectual Property",
        paragraphs: [
          "The 'Matric Mastery' brand name, 3D isometric block logo, design system, typography styling, software source code (React, TypeScript, CSS architecture), interactive tools (Mock Test Timer, Mistake Notebook, Doubt Solver UI), and all human-authored curriculum playbooks constitute original intellectual property protected under the Copyright Ordinance, 1962 of Pakistan and international copyright conventions.",
        ],
      },
      {
        subtitle: "7.2 Permitted Personal & Classroom Use",
        paragraphs: [
          "Students, parents, and secondary school teachers are encouraged to read, practice, and share links to our guides for individual learning and non-commercial classroom instruction.",
          "Printing single copies of our guides or checklists for your own private study is permitted under the fair dealing provisions of Section 57 of the Copyright Ordinance, 1962.",
        ],
      },
      {
        subtitle: "7.3 Strictly Prohibited Commercial Exploitation",
        paragraphs: [
          "You may NOT under any circumstances:",
          "(a) Compile our free online articles into paid PDF bundles, booklets, or printed notes for sale;",
          "(b) Distribute our presentation templates or guides within private commercial tuition academies without written licensing;",
          "(c) Watermark, crop, or republish our original visual layouts, marker guides, or diagrams under competitor branding;",
          "(d) Scrape, ingest, or mirror our content to train competing commercial websites or AI models without authorization.",
        ],
      },
      {
        subtitle: "7.4 Clear Distinction from Third-Party Public Materials",
        paragraphs: [
          "Matric Mastery does NOT claim copyright over public board examination past paper questions, official government circulars, statutory syllabuses, or textbook excerpts authored by the Punjab Curriculum and Textbook Board (PCTB).",
          "Our copyright applies strictly to our original explanatory commentary, presentation structuring, step-by-step solutions, algorithmic tools, and distinctive visual designs.",
        ],
      },
    ],
  },

  // SECTION 08: Third-Party Content & External Links
  {
    id: "third-party-links",
    category: "terms",
    number: "08",
    title: "Third-Party Content & External Hyperlinks Policy",
    shortSummary:
      "Clarification on external board portals, Google infrastructure, and lack of control over third-party domains.",
    badges: ["Outbound Links", "Independent Domains", "Safe Navigation"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "8.1 Outbound Links to Government & Board Portals",
        paragraphs: [
          "To assist students in verifying official examination updates, Matric Mastery provides direct outbound hyperlinks to external web properties, including official BISE board portals, government education departments, and educational resources.",
        ],
      },
      {
        subtitle: "8.2 Independent Operation of External Websites",
        paragraphs: [
          "These external domains are completely independent and are not owned, operated, maintained, or monitored by Matric Mastery. We do not endorse, guarantee, or assume liability for the uptime, content accuracy, server stability, security practices, or privacy policies of any external website.",
          "When you follow an outbound link, you are subject to the terms and privacy conditions of that third-party web property.",
        ],
      },
      {
        subtitle: "8.3 Cloud Infrastructure Partners",
        paragraphs: [
          "Our authentication and cloud database services are hosted on Google Cloud Firebase. By creating an account or logging in, you acknowledge that Google processes authentication credentials in accordance with Google's Cloud Terms of Service and Privacy Policy.",
        ],
      },
    ],
  },

  // SECTION 09: Acceptable Use Policy
  {
    id: "acceptable-use-policy",
    category: "safety-accessibility",
    number: "09",
    title: "Acceptable Use Policy (AUP) & Platform Integrity",
    shortSummary:
      "Prohibitions against impersonation, automated scraping, cybersecurity attacks, and false leak claims.",
    badges: ["PECA 2016 Compliant", "FIA Cybercrime", "Zero Abuse"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "9.1 Prohibition of Impersonation & Fraud",
        paragraphs: [
          "You are strictly prohibited from impersonating Matric Mastery, its founder Hamza, or its administrators on social media, WhatsApp, Telegram, YouTube, or TikTok.",
          "You may not create groups or channels claiming to represent official Matric Mastery staff or claiming to possess 'official board inside contacts'.",
        ],
      },
      {
        subtitle: "9.2 Prohibition of Automated Scraping & Bot Traffic",
        paragraphs: [
          "Deploying automated web scraping tools, spiders, offline downloaders, or bots to harvest guides, question banks, or student leaderboard records without prior written consent is strictly prohibited.",
          "High-frequency automated requests that impair server responsiveness for legitimate students will result in immediate IP banning.",
        ],
      },
      {
        subtitle: "9.3 Cybersecurity Violations & PECA Enforcement",
        paragraphs: [
          "Under the Prevention of Electronic Crimes Act, 2016 (PECA), any intentional attempt to breach platform defenses, conduct denial-of-service (DDoS) assaults, bypass Firebase database security rules, inject malicious scripts, or tamper with leaderboard XP tallies constitutes a criminal offense.",
          "We actively monitor security telemetry and will refer cyber attack logs, IP origins, and digital evidence directly to the Federal Investigation Agency (FIA) Cyber Crime Wing under PECA Sections 3, 4, 6, 7, and 14.",
        ],
      },
      {
        subtitle: "9.4 Zero Tolerance for 'Paper Leak' Misrepresentation",
        paragraphs: [
          "You may not copy our educational predictions or model questions and distribute them as 'confirmed leaked board papers'. Exploiting anxious students through fraudulent 'paper leak' claims is an egregious violation of academic integrity and criminal fraud under Pakistani law.",
        ],
      },
    ],
  },

  // SECTION 10: Content Accuracy, Updates & Corrections
  {
    id: "content-accuracy-corrections",
    category: "disclaimers",
    number: "10",
    title: "Content Accuracy, Updates & Error Correction Protocol",
    shortSummary:
      "Transparent workflow for correcting outdated schemes, mathematical solutions, and dynamic date sheet updates.",
    badges: ["Editorial Integrity", "Error Reporting", "Dynamic Updates"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "10.1 Editorial Commitment to Academic Rigor",
        paragraphs: [
          "We take rigorous care to ensure our strategy guides, mathematical step-by-step derivations, paper pattern diagrams, and exam survival tips accurately reflect current Punjab Board curriculum standards.",
          "Content is reviewed by high-achieving matric position holders prior to publication.",
        ],
      },
      {
        subtitle: "10.2 Dynamic Examination Cycle Updates",
        paragraphs: [
          "Because education boards frequently update date sheets, registration deadlines, and assessment policies, information on our Board Watch tracker is updated as soon as verified public circulars are identified.",
          "However, administrative notices can change rapidly; we do not warrant that all content is at every moment instantaneous or infallible.",
        ],
      },
      {
        subtitle: "10.3 How to Report Errors or Request Corrections",
        paragraphs: [
          "We welcome constructive feedback from students, senior school teachers, and board examiners. If you identify a typo, an outdated pairing scheme reference, or a mathematical error in any of our guides:",
          "1. Message our verified WhatsApp desk at +92 308 4703973;",
          "2. Provide the specific article URL and paragraph location;",
          "3. Include a reference to the official textbook or board circular if applicable.",
          "Our editorial desk reviews reports within 24 to 48 hours and publishes verified corrections promptly.",
        ],
      },
    ],
  },

  // SECTION 11: User Contributions & Feedback
  {
    id: "user-contributions-feedback",
    category: "terms",
    number: "11",
    title: "User Contributions, AI Queries & Feedback Policy",
    shortSummary:
      "Rules governing student feedback, Doubt Solver inputs, scorecard submissions, and privacy masking.",
    badges: ["Feedback Rights", "Identity Protection", "Academic Focus"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "11.1 Permitted Student Contributions",
        paragraphs: [
          "Students may submit academic questions into our interactive Doubt Solver, send study queries via WhatsApp, and share exam result cards to celebrate their achievements with our community.",
        ],
      },
      {
        subtitle: "11.2 Prohibited Submissions",
        paragraphs: [
          "You agree not to submit any input, prompt, or message that is defamatory, abusive, obscene, sexually explicit, politically charged, or violates the intellectual property of any third party.",
        ],
      },
      {
        subtitle: "11.3 Voluntary Result Showcase & Redaction Guarantee",
        paragraphs: [
          "When students share marksheet photographs to demonstrate the efficacy of our 605 marker presentation techniques, we redact all permanent roll numbers, registration IDs, father names, and institution names by default to safeguard minor dignity.",
          "Any student may request the immediate removal or modification of their showcased testimonial at any time by messaging our desk.",
        ],
      },
      {
        subtitle: "11.4 License to Educational Feedback",
        paragraphs: [
          "Any feedback, feature suggestions, or strategy ideas submitted to Matric Mastery may be utilized to improve our free educational tools without obligation or financial compensation.",
        ],
      },
    ],
  },

  // SECTION 12: Security & Data Protection
  {
    id: "security-data-protection",
    category: "safety-accessibility",
    number: "12",
    title: "Cybersecurity & Data Protection Standards",
    shortSummary:
      "Overview of technical security controls, 256-bit encryption, tokenized authentication, and reporting limitations.",
    badges: ["256-Bit SSL/TLS", "Firebase Auth Tokens", "Security Telemetry"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "12.1 Technical Security Architecture",
        paragraphs: [
          "Matric Mastery implements industry-standard technical safeguards to protect student data against accidental loss, unauthorized access, and alteration:",
          "• Transport Layer Security: All traffic between your browser and our servers is encrypted using 256-bit SSL/TLS.",
          "• Tokenized Authentication: User sign-in relies on Google Firebase OAuth, ensuring passwords are never seen or stored on our servers.",
          "• Cloud Security Rules: Google Cloud Firestore security rules prevent unauthorized candidates from reading or overwriting other users' study data.",
        ],
      },
      {
        subtitle: "12.2 Practical Realities & Limitations",
        paragraphs: [
          "No internet-connected system is completely immune from cyber threats. We do not make unfounded claims of military-grade certifications, ISO accreditations, or absolute invulnerability.",
          "We encourage students to access the platform using updated modern browsers and secure personal networks.",
        ],
      },
      {
        subtitle: "12.3 Responsible Vulnerability Disclosure",
        paragraphs: [
          "If you are a security researcher and discover a potential vulnerability in our frontend or database rules, please report it responsibly to our verified desk (+92 308 4703973) so we can address it promptly before public disclosure.",
        ],
      },
    ],
  },

  // SECTION 13: Copyright Complaints & Takedown Requests
  {
    id: "copyright-complaints-dmca",
    category: "ip-copyright",
    number: "13",
    title: "Copyright Complaints & DMCA Takedown Procedure",
    shortSummary:
      "Formal, transparent process for copyright holders and publishers to submit takedown notices.",
    badges: ["Notice & Takedown", "Expedited Review", "24-48h Remediation"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "13.1 Commitment to Intellectual Property Respect",
        paragraphs: [
          "Matric Mastery respects the intellectual property rights of authors, educators, and publishers. In accordance with Pakistani copyright law and international DMCA standards, we maintain a prompt notice-and-takedown procedure.",
        ],
      },
      {
        subtitle: "13.2 Required Information for a Formal Takedown Notice",
        paragraphs: [
          "If you believe your copyrighted material is displayed on matricmastery.pk without authorization, please submit a formal notice containing:",
          "1. Identification of the copyrighted work claimed to have been infringed;",
          "2. Exact URL and page section on matricmastery.pk where the material is located;",
          "3. Your full name, organization (if applicable), and contact information (phone number and email);",
          "4. A statement of good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;",
          "5. A statement made under penalty of perjury that the information provided is accurate and that you are authorized to act on behalf of the copyright owner.",
        ],
      },
      {
        subtitle: "13.3 Submission Channel & Remediation Window",
        paragraphs: [
          "Submit your notice directly to our Official Verification & DMCA Desk via WhatsApp at +92 308 4703973 or through the contact form on our About page (/about).",
          "Upon receipt of a substantiated notice, we will investigate and, if verified, remove or disable access to the infringing material within 24 to 48 hours.",
        ],
      },
    ],
  },

  // SECTION 14: Accessibility Statement
  {
    id: "accessibility-statement",
    category: "safety-accessibility",
    number: "14",
    title: "Accessibility Statement & Inclusive Design",
    shortSummary:
      "Our architectural commitment to readable typography, high-contrast dark theme, and mobile-friendly accessibility.",
    badges: ["WCAG 2.1 AA Contrast", "Keyboard Navigable", "Responsive Mobile"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "14.1 Philosophy of Educational Inclusivity",
        paragraphs: [
          "Quality secondary education must be universally accessible to every Pakistani student, regardless of physical ability, device limitations, or internet connection speed.",
        ],
      },
      {
        subtitle: "14.2 Implemented Accessibility Measures",
        paragraphs: [
          "• High-Contrast Palette: Built on an obsidian black canvas (#0A0A0A) paired with high-visibility kinetic yellow (#FFD60A) and pure white typography, providing contrast ratios meeting or exceeding WCAG 2.1 AA criteria.",
          "• Semantic HTML Structure: All pages use proper semantic landmarks (<header>, <main>, <aside>, <nav>, <h1>–<h6>) to enable smooth screen reader traversal.",
          "• Keyboard Accessibility: Full keyboard navigability with prominent :focus-visible yellow outline rings for all buttons, inputs, and navigational tabs.",
          "• Motion Sensitivity: Full respect for user prefers-reduced-motion preferences; all transforms, rises, and stagger effects collapse to simple flat opacity transitions when enabled.",
          "• Urdu Typography & RTL: Proper font rendering via 'Noto Nastaliq Urdu' and responsive layout mirroring for right-to-left readers.",
        ],
      },
      {
        subtitle: "14.3 Reporting Accessibility Barriers",
        paragraphs: [
          "If you experience difficulty accessing any strategy guide, calculator, or tool on our website using assistive technologies, please contact our desk (+92 308 4703973). We value your feedback and prioritize accessibility enhancements.",
        ],
      },
    ],
  },

  // SECTION 15: Policy Updates, Effective Dates & Contact
  {
    id: "policy-updates-contact",
    category: "terms",
    number: "15",
    title: "Policy Updates, Effective Dates & Administrative Contact",
    shortSummary:
      "Formal publication metadata, effective dates, revision history, and verified contact directory.",
    badges: ["Version v3.5.0", "Effective Nov 2026", "Multan Headquarters"],
    lastUpdated: "November 2026",
    subsections: [
      {
        subtitle: "15.1 Publication Metadata & Effective Dates",
        paragraphs: [
          "• Original Charter Published: August 2026",
          "• Last Substantive Revision: November 2026",
          "• Active Edition: Version v3.5.0 (Comprehensive Legal & Policies Center)",
          "• Effective Status: Binding upon all visitors across all 11 synchronized platform routes.",
        ],
      },
      {
        subtitle: "15.2 Notice of Material Policy Revisions",
        paragraphs: [
          "We may periodically update these policies to reflect changes in platform features, cloud integrations, or statutory Pakistani legal requirements. Material updates will be highlighted in the Revision Changelog at the top of this Legal Center.",
        ],
      },
      {
        subtitle: "15.3 Official Administrative & Legal Contact Directory",
        paragraphs: [
          "For legal notices, privacy erasure requests, DMCA submissions, or academic inquiries, contact our official administration desk:",
          "• Platform: Matric Mastery (matricmastery.pk)",
          "• Founder & Administrator: Hamza",
          "• Geographical Jurisdiction: Multan, Punjab, Pakistan",
          "• Verified WhatsApp Line: +92 308 4703973",
          "• Direct Web Contact: Available via /about",
          "• Operating Response Target: Monday through Saturday, within 24–48 hours.",
        ],
      },
    ],
  },
];

// Regulatory Revision Changelog
const COMPREHENSIVE_CHANGELOG = [
  {
    version: "v3.5.0 (Legal & Policies Center)",
    date: "November 2026",
    changes: [
      "Transformed standalone Legal page into full 15-Section Legal & Policies Center.",
      "Preserved all 14 original foundational legal clauses verbatim in Section 01.",
      "Added dedicated sections for Terms of Service, Privacy Policy, and Cookie Policy.",
      "Detailed LocalStorage key audit and Google Analytics (G-WFW2NN13E7) disclosures.",
      "Codified comprehensive Acceptable Use Policy and PECA 2016 statutory enforcement.",
      "Integrated formal DMCA takedown notice protocol and Accessibility Statement.",
    ],
  },
  {
    version: "v3.4.0 (2026 Edition)",
    date: "October 2026",
    changes: [
      "Added complete AI content & generative voice player disclosure.",
      "Added legal protections and disclaimers for Exam Day Guidebook & center simulators.",
      "Expanded GDPR compliance for overseas Pakistani candidates taking FBISE exams.",
    ],
  },
  {
    version: "v3.3.0",
    date: "September 2026",
    changes: [
      "Incorporated Google Firebase Cloud progress sync and tokenized authentication privacy.",
      "Formalized PECA 2016 cybercrime protocols and FIA reporting mechanisms.",
      "Upgraded student scorecard masking standards for minor privacy.",
    ],
  },
  {
    version: "v3.1.0",
    date: "August 2026",
    changes: [
      "Codified Zero-Leak Policy and commercial academy reselling prohibitions.",
      "Defined Multan, Punjab, Pakistan intellectual property ownership structure.",
    ],
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LegalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory>("all");
  const [activeTOC, setActiveTOC] = useState<string>("preserved-original-content");
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentDateFormatted, setCurrentDateFormatted] = useState("November 2026");

  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Set formatted date on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const now = new Date();
      setCurrentDateFormatted(
        now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      );
    }
  }, []);

  // Calculate total words and reading time
  const { totalWords, readingTimeMinutes } = useMemo(() => {
    let allText: string[] = [];

    PRESERVED_ORIGINAL_ITEMS.forEach((item) => {
      allText.push(item.title, item.shortSummary, ...item.paragraphs);
    });

    LEGAL_CENTER_SECTIONS.forEach((sec) => {
      allText.push(sec.title, sec.shortSummary);
      if (sec.paragraphs) allText.push(...sec.paragraphs);
      if (sec.subsections) {
        sec.subsections.forEach((sub) => {
          allText.push(sub.subtitle, ...sub.paragraphs);
        });
      }
    });

    const words = allText.join(" ").split(/\s+/).filter(Boolean).length;
    return {
      totalWords: words,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 220)),
    };
  }, []);

  // Search match detection and indexing
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const matches: { id: string; title: string; number: string }[] = [];

    LEGAL_CENTER_SECTIONS.forEach((sec) => {
      let isMatch =
        sec.title.toLowerCase().includes(q) ||
        sec.shortSummary.toLowerCase().includes(q) ||
        sec.badges.some((b) => b.toLowerCase().includes(q));

      if (!isMatch && sec.paragraphs) {
        isMatch = sec.paragraphs.some((p) => p.toLowerCase().includes(q));
      }
      if (!isMatch && sec.subsections) {
        isMatch = sec.subsections.some(
          (sub) =>
            sub.subtitle.toLowerCase().includes(q) ||
            sub.paragraphs.some((p) => p.toLowerCase().includes(q))
        );
      }
      if (!isMatch && sec.isOriginalPreserved) {
        isMatch = PRESERVED_ORIGINAL_ITEMS.some(
          (orig) =>
            orig.title.toLowerCase().includes(q) ||
            orig.shortSummary.toLowerCase().includes(q) ||
            orig.paragraphs.some((p) => p.toLowerCase().includes(q))
        );
      }

      if (isMatch) {
        matches.push({ id: sec.id, title: sec.title, number: sec.number });
      }
    });

    return matches;
  }, [searchQuery]);

  // Reset match index when query changes
  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [searchQuery]);

  // Smooth scroll helper with header clearance (88px offset)
  const scrollToElement = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 88;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
    setActiveTOC(id);
  };

  // Search Prev/Next navigation
  const goToNextMatch = () => {
    if (searchMatches.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIdx);
    scrollToElement(searchMatches[nextIdx].id);
  };

  const goToPrevMatch = () => {
    if (searchMatches.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIndex(prevIdx);
    scrollToElement(searchMatches[prevIdx].id);
  };

  // Scroll listener for reading progress and sticky TOC spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, Math.round((scrollY / totalHeight) * 100))));
      }

      const sectionIds = LEGAL_CENTER_SECTIONS.map((s) => s.id);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveTOC(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile Drawer accessibility: body scroll lock and escape listener
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsMobileDrawerOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileDrawerOpen]);

  // Copy section permalink to clipboard with toast checkmark
  const copySectionLink = (id: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/legal#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedSectionId(id);
      setTimeout(() => setCopiedSectionId(null), 2200);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Category selection handler: selects tab and smoothly scrolls to first matching chapter
  const handleCategorySelect = (catId: PolicyCategory) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      scrollToElement("preserved-original-content");
      return;
    }
    const matchingSection = LEGAL_CENTER_SECTIONS.find((s) => s.category === catId);
    if (matchingSection) {
      scrollToElement(matchingSection.id);
    }
  };

  // Text highlighting helper for search terms
  const highlightQuery = (text: string) => {
    if (!searchQuery.trim()) return text;
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark
          key={i}
          className="bg-[#FFD600]/30 text-[#FFD600] font-bold px-1 py-0.5 rounded transition-colors"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Statutory classification metadata helper
  const getStatutoryBadge = (secNumber: string) => {
    switch (secNumber) {
      case "01":
        return { tag: "VERBATIM ARCHIVE", scope: "Original Foundational Legal Clauses" };
      case "02":
        return { tag: "STATUTORY OBLIGATION", scope: "Contract Act 1872 & Majority Act 1875" };
      case "03":
        return { tag: "STATUTORY & REGULATORY", scope: "Student Privacy & PECA 2016" };
      case "04":
        return { tag: "TECHNICAL STANDARDS", scope: "Cookie & Session Storage Architecture" };
      case "05":
        return { tag: "EDUCATIONAL DISCLAIMER", scope: "Revision & Study Aid Limitations" };
      case "06":
        return { tag: "OFFICIAL DISCLOSURE", scope: "BISE & FBISE Independence Declaration" };
      case "07":
        return { tag: "INTELLECTUAL PROPERTY", scope: "Multan, Punjab Platform Ownership" };
      case "08":
        return { tag: "EXTERNAL PROTOCOLS", scope: "Third-Party Resources & Links" };
      case "09":
        return { tag: "CRIMINAL DIRECTIVE", scope: "PECA 2016 Zero-Tolerance Anti-Cheating" };
      case "10":
        return { tag: "EDITORIAL STANDARDS", scope: "Curriculum Accuracy & Corrections" };
      case "11":
        return { tag: "COMMUNITY STANDARDS", scope: "Voluntary User Contributions" };
      case "12":
        return { tag: "CYBERSECURITY PROTOCOL", scope: "Data Encryption & FIA Cooperation" };
      case "13":
        return { tag: "STATUTORY & INTERNATIONAL", scope: "PECA Complaints & DMCA 1998 Takedown" };
      case "14":
        return { tag: "CIVIC STANDARD", scope: "WCAG 2.1 AA Platform Accessibility" };
      case "15":
        return { tag: "ADMINISTRATIVE CLAUSE", scope: "Effective Dates & Multan Jurisdiction" };
      default:
        return { tag: "POLICY PROVISION", scope: "Official Governance Framework" };
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08080A] text-white selection:bg-[#FFD600] selection:text-black py-8 sm:py-14 print:bg-white print:text-black">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 h-[450px] w-[450px] rounded-full bg-[#FFD600]/[0.025] blur-[150px] pointer-events-none print:hidden" />
      <div className="absolute top-80 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.018] blur-[180px] pointer-events-none print:hidden" />

      {/* Main Container - strictly constrained to max-w-site (1200px) */}
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. FOLIO MASTHEAD & HERO
            ========================================================================= */}
        <header className="border-b border-white/[0.12] pb-8 sm:pb-12 print:border-black">
          {/* Folio Stamp & Official Regulatory Seal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="inline-flex items-center gap-2.5 font-mono text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#FFD600]/40 bg-[#FFD600]/10 px-2.5 py-1 text-[11px] font-bold text-[#FFD600] uppercase tracking-wider">
                <Scale size={13} className="text-[#FFD600]" />
                ARCHIVE CODEX // MM-LEG-v3.5.0
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="hidden sm:inline text-[11px] text-white/60 uppercase tracking-widest font-mono">
                Multan Jurisdiction · Punjab, Pakistan
              </span>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <button
                type="button"
                onClick={() => setShowChangelog(!showChangelog)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-heading font-medium text-white/80 hover:text-white hover:border-[#FFD600]/40 transition-colors cursor-pointer"
              >
                <History size={13} className="text-[#FFD600]" />
                <span>Revision Changelog</span>
                <span className="rounded bg-white/10 px-1.5 py-0.2 text-[10px] font-mono text-white/90">
                  4
                </span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-heading font-medium text-white/80 hover:text-white hover:border-[#FFD600]/40 transition-colors cursor-pointer"
              >
                <Printer size={13} className="text-[#FFD600]" />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={() => copySectionLink("preserved-original-content")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-heading font-medium text-white/80 hover:text-white hover:border-[#FFD600]/40 transition-colors cursor-pointer"
              >
                <Bookmark size={13} className="text-[#FFD600]" />
                <span>Jump to Preserved Clauses</span>
              </button>
            </div>
          </div>

          {/* Display Heading */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            Legal &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD600] via-amber-300 to-emerald-400">
              Policies Center
            </span>
          </h1>

          {/* Editorial Lead Paragraph */}
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-3xl leading-relaxed font-normal">
            Official institutional repository and operational frameworks governing Matric Mastery. Encompassing our preserved foundational declarations, Terms of Service, Student Privacy, Cookie Architecture, Educational Disclaimers, Government Non-Affiliation, Intellectual Property, PECA 2016 Cybercrime Adherence, and Zero-Tolerance Anti-Cheating Directives.
          </p>

          {/* Typographic Metrics Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/90">
              <Layers size={13} className="text-[#FFD600]" />
              <span>15 Codified Chapters</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/90">
              <FileText size={13} className="text-[#FFD600]" />
              <span>{totalWords.toLocaleString()} Exact Words</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/90">
              <Clock size={13} className="text-[#FFD600]" />
              <span>{readingTimeMinutes} Min Read</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-400 font-bold">
              <ShieldCheck size={13} />
              <span>100% Verbatim Preserved</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/70">
              <Calendar size={13} className="text-[#FFD600]" />
              <span>Updated: {currentDateFormatted}</span>
            </div>
          </div>

          {/* Collapsible Revision Changelog Panel */}
          <AnimatePresence>
            {showChangelog && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-[#0E0E12] p-5 shadow-2xl print:hidden"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-heading text-xs font-black uppercase tracking-wider text-[#FFD600] flex items-center gap-2">
                    <History size={14} />
                    <span>Regulatory Revision Changelog (4 Formal Ratifications)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowChangelog(false)}
                    className="text-xs text-white/60 hover:text-white cursor-pointer px-2 py-1 rounded"
                  >
                    Close &times;
                  </button>
                </div>

                <div className="space-y-4">
                  {COMPREHENSIVE_CHANGELOG.map((log) => (
                    <div key={log.version} className="border-l-2 border-[#FFD600]/40 pl-4 py-1">
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-black text-white text-xs">
                          {log.version}
                        </span>
                        <span className="font-mono text-[10px] text-white/60">{log.date}</span>
                      </div>
                      <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs text-white/70 leading-relaxed">
                        {log.changes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =======================================================================
              SEARCH & FILTER CONTROL TOOLBAR
              ======================================================================= */}
          <div className="mt-7 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden">
            {/* Search Input with Match Counter and Prev/Next buttons */}
            <div className="relative flex-1 max-w-lg">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (e.shiftKey) goToPrevMatch();
                    else goToNextMatch();
                  }
                }}
                placeholder="Search all 15 chapters (e.g. PECA, cookies, Firebase, parental consent)..."
                className="w-full rounded-xl border border-white/15 bg-[#121216] pl-10 pr-28 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/40 focus:border-[#FFD600] focus:outline-none transition-colors"
              />

              {searchQuery && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="font-mono text-[10px] text-[#FFD600] bg-[#FFD600]/10 px-1.5 py-0.5 rounded">
                    {searchMatches.length > 0
                      ? `${currentMatchIndex + 1}/${searchMatches.length}`
                      : "0"}
                  </span>
                  <button
                    type="button"
                    onClick={goToPrevMatch}
                    disabled={searchMatches.length === 0}
                    title="Previous match (Shift+Enter)"
                    className="h-6 w-6 flex items-center justify-center rounded bg-white/5 text-white/70 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextMatch}
                    disabled={searchMatches.length === 0}
                    title="Next match (Enter)"
                    className="h-6 w-6 flex items-center justify-center rounded bg-white/5 text-white/70 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    title="Clear search"
                    className="h-6 w-6 flex items-center justify-center rounded text-white/50 hover:text-white cursor-pointer ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Directory / Stats readout */}
            <div className="flex items-center gap-3 text-xs font-mono text-white/60">
              {searchQuery ? (
                <span className="text-[#FFD600]">
                  Found {searchMatches.length} matching chapter{searchMatches.length === 1 ? "" : "s"}
                </span>
              ) : (
                <span>All 15 chapters active &amp; binding</span>
              )}
            </div>
          </div>

          {/* Category Filter Tabs with Soft Highlighting */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none print:hidden">
            {[
              { id: "all", label: "All 15 Chapters" },
              { id: "preserved-original", label: "01. Preserved Foundations" },
              { id: "terms", label: "Terms & Access" },
              { id: "privacy-cookies", label: "Privacy & Cookies" },
              { id: "disclaimers", label: "Disclaimers & Guidance" },
              { id: "ip-copyright", label: "Copyright & DMCA" },
              { id: "safety-accessibility", label: "Safety & Standards" },
            ].map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategorySelect(tab.id as PolicyCategory)}
                  className={`relative shrink-0 rounded-lg px-3 py-1.5 text-xs font-heading font-bold cursor-pointer transition-colors select-none ${
                    isActive
                      ? "bg-[#FFD600] text-black shadow-glow"
                      : "border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* =========================================================================
            2. TWO-COLUMN RESPONSIVE LAYOUT (Desktop Ledger + Fluid Prose)
            ========================================================================= */}
        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] gap-8 xl:gap-12 items-start">
          {/* -----------------------------------------------------------------------
              LEFT COLUMN: STICKY READING LEDGER (DESKTOP)
              ----------------------------------------------------------------------- */}
          <aside className="hidden lg:block lg:sticky lg:top-[88px] space-y-4 print:hidden">
            <div className="rounded-2xl border border-white/[0.1] bg-[#0E0E12]/95 p-4 backdrop-blur-xl shadow-2xl">
              {/* Reading Progress indicator */}
              <div className="border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-white/60 font-bold uppercase tracking-wider">
                    Reading Progress
                  </span>
                  <span className="text-[#FFD600] font-bold">{scrollProgress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FFD600] to-emerald-400 transition-all duration-150"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
              </div>

              {/* Ledger Directory Header */}
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-mono text-[11px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers size={12} className="text-[#FFD600]" />
                  <span>Archive Ledger</span>
                </span>
                <span className="text-[10px] font-mono text-white/40">15 Chapters</span>
              </div>

              {/* Navigation Index */}
              <nav className="space-y-1 max-h-[calc(100vh-270px)] overflow-y-auto pr-1 scrollbar-none">
                {LEGAL_CENTER_SECTIONS.map((sec) => {
                  const isActive = activeTOC === sec.id;
                  const stat = getStatutoryBadge(sec.number);
                  const isHighlightedByCategory =
                    selectedCategory === "all" || sec.category === selectedCategory;

                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToElement(sec.id);
                      }}
                      className={`group relative flex flex-col rounded-lg px-2.5 py-2 text-xs transition-all ${
                        isActive
                          ? "bg-[#FFD600]/15 text-white font-bold border-l-2 border-[#FFD600]"
                          : isHighlightedByCategory
                          ? "text-white/80 hover:text-white hover:bg-white/[0.04]"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="truncate font-heading text-xs">
                          <span className="font-mono text-[11px] text-[#FFD600] mr-1">
                            §{sec.number}
                          </span>
                          {sec.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-white/40 group-hover:text-white/60 truncate mt-0.5">
                        {stat.tag}
                      </span>
                    </a>
                  );
                })}
              </nav>

              {/* Institutional Support Verification Desk Mini Widget */}
              <div className="mt-4 border-t border-white/10 pt-3 text-[11px] font-mono">
                <div className="text-white/80 font-bold flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#FFD600]" />
                  <span>Institutional Desk:</span>
                </div>
                <p className="text-white/50 text-[10px] mt-0.5">Multan, Punjab, Pakistan</p>
                <a
                  href="https://wa.me/923084703973?text=Hi%2C%20I%20have%20a%20formal%20legal%2C%20privacy%2C%20or%20DMCA%20inquiry%20regarding%20Matric%20Mastery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#FFD600] hover:underline"
                >
                  <MessageCircle size={11} />
                  <span>WhatsApp Line &rarr;</span>
                </a>
              </div>
            </div>
          </aside>

          {/* -----------------------------------------------------------------------
              RIGHT COLUMN: PROSE READING COLUMN (FLUID UP TO 760px)
              ----------------------------------------------------------------------- */}
          <main className="max-w-[760px] w-full min-w-0 space-y-16 print:max-w-none print:space-y-8">
            {LEGAL_CENTER_SECTIONS.map((sec, secIdx) => {
              const stat = getStatutoryBadge(sec.number);
              const prevSec = secIdx > 0 ? LEGAL_CENTER_SECTIONS[secIdx - 1] : null;
              const nextSec =
                secIdx < LEGAL_CENTER_SECTIONS.length - 1
                  ? LEGAL_CENTER_SECTIONS[secIdx + 1]
                  : null;

              return (
                <article
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-[90px] pt-4 border-t border-white/[0.1] first:border-t-0 first:pt-0 print:border-black"
                >
                  {/* Chapter Header Bar */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Chapter Numeral & Statutory Badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-black text-[#FFD600] tracking-wider uppercase">
                          CHAPTER {sec.number}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80 uppercase">
                          {stat.tag}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="font-mono text-[10px] text-white/50">
                          Updated {sec.lastUpdated}
                        </span>
                      </div>

                      {/* Chapter Title */}
                      <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                        {highlightQuery(sec.title)}
                      </h2>

                      {/* Editorial Short Summary Blockquote */}
                      <div className="mt-3 border-l-2 border-[#FFD600]/60 pl-3.5 py-1 text-sm text-white/80 font-medium italic leading-relaxed bg-[#FFD600]/[0.02]">
                        {highlightQuery(sec.shortSummary)}
                      </div>
                    </div>

                    {/* Chapter Utilities: Copy Permalink */}
                    <div className="shrink-0 pt-1 print:hidden">
                      <button
                        type="button"
                        onClick={() => copySectionLink(sec.id)}
                        title="Copy direct permalink to this chapter"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-[#FFD600]/50 transition-colors cursor-pointer"
                      >
                        {copiedSectionId === sec.id ? (
                          <Check size={14} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Chapter Badges */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {sec.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono text-white/70"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Chapter Body Content */}
                  <div className="mt-6 space-y-6 text-sm sm:text-base text-white/85 leading-[1.85] font-normal">
                    {/* Flat Paragraphs (if any) */}
                    {sec.paragraphs && sec.paragraphs.length > 0 && (
                      <div className="space-y-4">
                        {sec.paragraphs.map((para, pIdx) => (
                          <p key={pIdx}>{highlightQuery(para)}</p>
                        ))}
                      </div>
                    )}

                    {/* ===================================================================
                        SPECIAL CASE: SECTION 01 - VERBATIM PRESERVED ORIGINAL ARCHIVE
                        =================================================================== */}
                    {sec.isOriginalPreserved && (
                      <div className="mt-8 space-y-6 pt-2">
                        {/* Verbatim Preservation Archival Seal Banner */}
                        <div className="rounded-xl border border-[#FFD600]/40 bg-[#FFD600]/[0.06] p-4 text-xs text-[#FFD600] font-heading font-medium leading-relaxed">
                          <strong className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                            <ShieldCheck size={16} />
                            Archival Verbatim Preservation Seal:
                          </strong>
                          The fourteen foundational clauses below contain every heading, paragraph, statutory disclaimer, and badge of Matric Mastery's original legal documentation, preserved 100% word-for-word without omission, summarization, or paraphrasing.
                        </div>

                        {/* All 14 original foundation clauses */}
                        <div className="space-y-6">
                          {PRESERVED_ORIGINAL_ITEMS.map((orig) => (
                            <section
                              key={orig.id}
                              id={orig.id}
                              className="scroll-mt-[90px] rounded-xl border border-white/[0.08] bg-[#0E0E12]/80 p-5 sm:p-6 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.06]">
                                <div>
                                  <span className="font-mono text-[10px] text-[#FFD600] uppercase font-bold tracking-wider">
                                    FOUNDATION CLAUSE {orig.number}
                                  </span>
                                  <h3 className="font-heading text-lg sm:text-xl font-bold text-white mt-0.5">
                                    {highlightQuery(orig.title)}
                                  </h3>
                                  <p className="text-xs text-white/60 mt-1 italic">
                                    {highlightQuery(orig.shortSummary)}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => copySectionLink(orig.id)}
                                  title="Copy permalink to this foundational clause"
                                  className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-[#FFD600]/40 transition-colors print:hidden"
                                >
                                  {copiedSectionId === orig.id ? (
                                    <Check size={12} className="text-emerald-400" />
                                  ) : (
                                    <Copy size={12} />
                                  )}
                                </button>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-1">
                                {orig.badges.map((b) => (
                                  <span
                                    key={b}
                                    className="rounded px-2 py-0.5 text-[9px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/70"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-4 space-y-3 text-xs sm:text-sm text-white/85 leading-[1.8]">
                                {orig.paragraphs.map((p, pIdx) => (
                                  <p key={pIdx}>{highlightQuery(p)}</p>
                                ))}
                              </div>
                            </section>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subsections with subtitles (for Sections 02 through 15) */}
                    {sec.subsections && sec.subsections.length > 0 && (
                      <div className="space-y-6 pt-3">
                        {sec.subsections.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6"
                          >
                            <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-2.5 flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600] shrink-0" />
                              <span>{highlightQuery(sub.subtitle)}</span>
                            </h3>
                            <div className="space-y-3 text-xs sm:text-sm text-white/85 leading-[1.85]">
                              {sub.paragraphs.map((p, pIdx) => (
                                <p key={pIdx}>{highlightQuery(p)}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chapter Pagination Navigation */}
                  <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-heading print:hidden">
                    {prevSec ? (
                      <button
                        type="button"
                        onClick={() => scrollToElement(prevSec.id)}
                        className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer py-1.5"
                      >
                        <ChevronLeft size={14} className="text-[#FFD600]" />
                        <span>
                          Prev: §{prevSec.number} {prevSec.title}
                        </span>
                      </button>
                    ) : (
                      <span />
                    )}

                    {nextSec ? (
                      <button
                        type="button"
                        onClick={() => scrollToElement(nextSec.id)}
                        className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer py-1.5 text-right"
                      >
                        <span>
                          Next: §{nextSec.number} {nextSec.title}
                        </span>
                        <ChevronRight size={14} className="text-[#FFD600]" />
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>
                </article>
              );
            })}

            {/* ===================================================================
                OFFICIAL INSTITUTIONAL CONTACT & WHATSAPP VERIFICATION DESK
                =================================================================== */}
            <div className="rounded-2xl border border-[#FFD600]/40 bg-gradient-to-br from-[#0E0E12] via-[#14141A] to-[#0E0E12] p-6 sm:p-8 shadow-[0_0_40px_rgba(255,214,0,0.06)] print:border-black">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FFD600]">
                <ShieldCheck size={16} />
                <span>OFFICIAL VERIFICATION &amp; LEGAL DESK</span>
              </div>

              <h2 className="mt-2 font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
                Institutional Inquiries &amp; Legal Verification
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
                For PECA 2016 statutory notices, DMCA takedown submissions, student privacy masking requests, or to verify any official communication, connect directly with our legal desk in Multan, Punjab.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 print:hidden">
                <a
                  href="https://wa.me/923084703973?text=Hi%2C%20I%20have%20a%20formal%20legal%2C%20copyright%2C%20or%20privacy%20inquiry%20regarding%20Matric%20Mastery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-5 py-3 font-heading text-xs sm:text-sm font-black text-black hover:bg-amber-300 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Connect via WhatsApp Legal Desk</span>
                </a>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 font-heading text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <span>About Our Platform</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-5 border-t border-white/10 pt-3 text-[11px] font-mono text-white/60 flex flex-wrap items-center justify-between gap-2">
                <span>Verified Line: +92 308 4703973</span>
                <span>Jurisdiction: Multan, Punjab, Pakistan</span>
                <span>Response Target: Within 24–48 Hours</span>
              </div>
            </div>

            {/* Back to top helper */}
            <div className="flex justify-center pt-2 print:hidden">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#121216] px-4 py-2.5 text-xs font-heading font-semibold text-white/60 hover:text-white hover:border-[#FFD600]/40 transition-colors cursor-pointer"
              >
                <ArrowUp size={13} className="text-[#FFD600]" />
                <span>Return to Top of Legal Center</span>
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* =========================================================================
          3. MOBILE CHAPTER DRAWER (Viewport < 1024px)
          ========================================================================= */}
      {/* Floating Action Pill on Mobile Screens */}
      <div className="lg:hidden print:hidden">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full border border-[#FFD600]/40 bg-[#0E0E12]/95 backdrop-blur-xl px-4 py-3 text-xs font-heading font-black text-[#FFD600] shadow-[0_8px_30px_rgba(0,0,0,0.8)] active:scale-95 cursor-pointer min-h-[44px]"
          aria-label="Open Archive Chapters Directory"
        >
          <Layers size={15} />
          <span>Chapters (15)</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600] animate-pulse" />
        </button>
      </div>

      {/* Modal Drawer with Focus Trap, Background Scroll Lock & Escape key listener */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Drawer Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-[#0E0E12] border-l border-white/10 p-5 flex flex-col shadow-2xl overflow-hidden pb-safe"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Scale size={14} className="text-[#FFD600]" />
                  <span className="font-heading text-sm font-black text-white">
                    Archive Directory
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-white/60 hover:text-white cursor-pointer"
                  aria-label="Close Chapters Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress reading readout */}
              <div className="mb-3 px-1 text-[11px] font-mono flex items-center justify-between text-white/60">
                <span>Reading Progress:</span>
                <span className="text-[#FFD600] font-bold">{scrollProgress}%</span>
              </div>

              {/* Drawer Chapter List */}
              <nav className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-none">
                {LEGAL_CENTER_SECTIONS.map((sec) => {
                  const isActive = activeTOC === sec.id;
                  const stat = getStatutoryBadge(sec.number);

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        setTimeout(() => scrollToElement(sec.id), 120);
                      }}
                      className={`w-full text-left rounded-lg p-2.5 transition-all min-h-[44px] flex flex-col justify-center cursor-pointer ${
                        isActive
                          ? "bg-[#FFD600]/15 text-white font-bold border-l-2 border-[#FFD600]"
                          : "text-white/80 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#FFD600] font-bold">
                          §{sec.number}
                        </span>
                        <span className="font-heading text-xs truncate">{sec.title}</span>
                      </div>
                      <span className="text-[9px] font-mono text-white/50 truncate mt-0.5">
                        {stat.tag}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Drawer Bottom Support Link */}
              <div className="mt-3 border-t border-white/10 pt-3">
                <a
                  href="https://wa.me/923084703973?text=Hi%2C%20I%20have%20a%20formal%20legal%2C%20privacy%2C%20or%20DMCA%20inquiry%20regarding%20Matric%20Mastery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#FFD600] py-2.5 text-xs font-heading font-black text-black min-h-[44px]"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Legal Channel</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
