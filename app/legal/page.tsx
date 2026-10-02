/* ==========================================================================
   MATRIC MASTERY - WORLD-CLASS LEGAL & REGULATORY CENTER (/legal)
   Stripe Legal + Apple Ultra-Premium Aesthetic (Dark #0a0a0a + Gold #FFD600)
   Comprehensive 2026 Coverage:
   - Terms of Service & Acceptable Use
   - Privacy Policy & Student Minor Data Protection
   - PECA 2016 (Pakistan Cybercrime Prevention Act) Compliance
   - GDPR & International Privacy Standards
   - Zero-Tolerance Exam Leak & Anti-Cheating Policy
   - BISE & Government Non-Affiliation Disclaimer
   - AI Content, Summarizer & Algorithmic Tool Disclosure (2026 AI Ethics)
   - Cookies & LocalStorage Transparency
   - Intellectual Property, DMCA & Copyright Enforcement
   - External Links & Third-Party Integrations (Firebase, Google Auth)
   - Limitation of Liability & Warranty Disclaimers
   - User Content, Testimonial Masking & Scorecard Rights
   - Dispute Resolution & Multan/Punjab Jurisdiction
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
  Award,
  MessageCircle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Search,
  Check,
  Copy,
  Printer,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Cpu,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CategoryFilter =
  | "all"
  | "terms"
  | "privacy"
  | "disclaimers"
  | "compliance"
  | "ai-policy";

interface LegalSectionItem {
  id: string;
  category: CategoryFilter;
  number: string;
  title: string;
  shortSummary: string;
  badges: string[];
  paragraphs: string[];
  lastUpdated: string;
}

const LEGAL_SECTIONS: LegalSectionItem[] = [
  {
    id: "ownership-governance",
    category: "terms",
    number: "01",
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
    id: "terms-of-service",
    category: "terms",
    number: "02",
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
    id: "privacy-student-data",
    category: "privacy",
    number: "03",
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
    id: "peca-compliance",
    category: "compliance",
    number: "04",
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
    id: "gdpr-compliance",
    category: "compliance",
    number: "05",
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
    id: "cookies-localstorage",
    category: "privacy",
    number: "06",
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
    id: "bise-non-affiliation",
    category: "disclaimers",
    number: "07",
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
    id: "anti-cheating-leak-policy",
    category: "disclaimers",
    number: "08",
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
    id: "ai-disclosure-policy",
    category: "ai-policy",
    number: "09",
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
    id: "copyright-dmca",
    category: "terms",
    number: "10",
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
    id: "liability-warranty",
    category: "disclaimers",
    number: "11",
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
    id: "external-links-integrations",
    category: "compliance",
    number: "12",
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
    id: "testimonials-scorecards",
    category: "privacy",
    number: "13",
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
    id: "disputes-jurisdiction",
    category: "terms",
    number: "14",
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

// Revision history / Changelog auto-compiled
const LEGAL_CHANGELOG = [
  {
    version: "v3.4.0 (2026 Edition)",
    date: "October 2026",
    changes: [
      "Added complete AI content & generative voice player disclosure (Section 09).",
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

export default function LegalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [activeTOC, setActiveTOC] = useState<string>("ownership-governance");
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [showChangelog, setShowChangelog] = useState(false);

  // Accordion collapsed state: Map of section id to boolean (false = open)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Dynamic last updated date
  const [currentDateFormatted, setCurrentDateFormatted] = useState("October 2, 2026");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const now = new Date();
      setCurrentDateFormatted(
        now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      );
    }
  }, []);

  // Filter sections by category and search
  const filteredSections = useMemo(() => {
    return LEGAL_SECTIONS.filter((sec) => {
      const matchesCategory =
        selectedCategory === "all" || sec.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleMatch = sec.title.toLowerCase().includes(q);
      const summaryMatch = sec.shortSummary.toLowerCase().includes(q);
      const textMatch = sec.paragraphs.some((p) => p.toLowerCase().includes(q));
      const badgeMatch = sec.badges.some((b) => b.toLowerCase().includes(q));

      return titleMatch || summaryMatch || textMatch || badgeMatch;
    });
  }, [selectedCategory, searchQuery]);

  // Total word count and calculated reading time
  const { totalWords, readingTimeMinutes } = useMemo(() => {
    const fullText = LEGAL_SECTIONS.flatMap((s) => [s.title, s.shortSummary, ...s.paragraphs]).join(" ");
    const words = fullText.split(/\s+/).filter(Boolean).length;
    return {
      totalWords: words,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 220)),
    };
  }, []);

  // Scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = filteredSections.map((s) => s.id);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveTOC(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredSections]);

  const toggleAccordion = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    setCollapsedSections({});
  };

  const collapseAll = () => {
    const collapsedMap: Record<string, boolean> = {};
    LEGAL_SECTIONS.forEach((s) => {
      collapsedMap[s.id] = true;
    });
    setCollapsedSections(collapsedMap);
  };

  const copySectionLink = (id: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/legal#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedSectionId(id);
      setTimeout(() => setCopiedSectionId(null), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Text highlighting helper
  const highlightQuery = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-[#FFD600]/30 text-[#FFD600] font-bold px-1 py-0.2 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFD600] selection:text-black py-10 sm:py-16">
      {/* Background Ambient Mesh */}
      <div className="absolute top-12 left-10 h-[500px] w-[500px] rounded-full bg-[#FFD600]/[0.03] blur-[160px] pointer-events-none" />
      <div className="absolute top-96 right-10 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.02] blur-[180px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            HERO HEADER - STRIPE LEGAL + APPLE HYBRID STYLE
            ========================================================================= */}
        <header className="relative border-b border-white/10 pb-10 sm:pb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD600]/40 bg-[#FFD600]/10 px-4 py-1.5 font-mono text-xs font-bold text-[#FFD600] uppercase tracking-wider shadow-sm">
              <Scale size={14} className="text-[#FFD600]" />
              <span>Legal Center · Terms & Regulatory Documentation</span>
            </div>

            {/* Quick Actions: Print, Changelog, Expand All */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowChangelog(!showChangelog)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-heading font-semibold text-muted hover:text-white hover:border-[#FFD600]/40 transition-colors"
              >
                <History size={13} className="text-[#FFD600]" />
                <span>Revision Changelog</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-heading font-semibold text-muted hover:text-white hover:border-[#FFD600]/40 transition-colors"
              >
                <Printer size={13} className="text-[#FFD600]" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Legal, Terms &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD600] via-amber-300 to-emerald-400">
              Student Privacy
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-muted max-w-3xl leading-relaxed font-normal">
            Official operational frameworks governing Matric Mastery. Encompassing Terms of Service, Student Privacy, PECA 2016 cybercrime adherence, AI disclosure standards, and our uncompromising Zero-Tolerance Anti-Cheating Policy.
          </p>

          {/* Dynamic Legal Telemetry Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/90">
              <Calendar size={13} className="text-[#FFD600]" />
              Last Updated: {currentDateFormatted}
            </span>

            <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/90">
              <Clock size={13} className="text-[#FFD600]" />
              {readingTimeMinutes} min read ({totalWords} words)
            </span>

            <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-400 font-bold">
              <ShieldCheck size={13} />
              Version: v3.4.0 (Active &amp; Binding)
            </span>

            <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-muted">
              Jurisdiction: Multan, Punjab, Pakistan
            </span>
          </div>

          {/* Collapsible Revision Changelog Modal / Drawer */}
          <AnimatePresence>
            {showChangelog && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-[#121216] p-5 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-heading text-xs font-black uppercase tracking-wider text-[#FFD600] flex items-center gap-2">
                    <History size={14} />
                    <span>Regulatory Revision Changelog</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowChangelog(false)}
                    className="text-xs text-muted hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  {LEGAL_CHANGELOG.map((log) => (
                    <div key={log.version} className="border-l-2 border-[#FFD600]/40 pl-4 py-1">
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-black text-white text-xs">
                          {log.version}
                        </span>
                        <span className="font-mono text-[10px] text-muted">{log.date}</span>
                      </div>
                      <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs text-muted leading-relaxed">
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

          {/* Search & Category Filter Bar */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search with highlight support */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search legal provisions (e.g. PECA, AI, cookies, leaks)..."
                className="w-full rounded-2xl border border-white/15 bg-[#121216] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-muted focus:border-[#FFD600] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Expand / Collapse All Toggles */}
            <div className="flex items-center gap-2 self-end md:self-auto text-xs font-mono">
              <button
                type="button"
                onClick={expandAll}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-muted hover:text-white hover:border-white/20 transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-muted hover:text-white hover:border-white/20 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Provisions (14)" },
              { id: "terms", label: "Terms & IP" },
              { id: "privacy", label: "Privacy & Data" },
              { id: "compliance", label: "PECA & GDPR" },
              { id: "disclaimers", label: "Disclaimers & Anti-Cheat" },
              { id: "ai-policy", label: "AI Content Ethics" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-heading font-bold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-[#FFD600] text-black shadow-glow font-black"
                    : "border border-white/10 bg-white/5 text-muted hover:text-white hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* =========================================================================
            MAIN BODY: 2-COLUMN LAYOUT (Sticky TOC + Legal Provisions)
            ========================================================================= */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT SIDEBAR: STICKY TABLE OF CONTENTS (DESKTOP) */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#121216]/90 p-5 backdrop-blur-xl shadow-2xl">
              <span className="font-heading text-xs font-black uppercase tracking-wider text-muted flex items-center gap-2 mb-3 border-b border-white/10 pb-3">
                <Layers size={14} className="text-[#FFD600]" />
                <span>Document Navigator</span>
              </span>

              <nav className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                {filteredSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-heading font-medium transition-all ${
                      activeTOC === sec.id
                        ? "bg-[#FFD600]/15 text-[#FFD600] font-bold border-l-2 border-[#FFD600]"
                        : "text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate pr-2">
                      {sec.number}. {sec.title}
                    </span>
                    <span className="text-[10px] font-mono opacity-50 shrink-0">
                      §{sec.number}
                    </span>
                  </a>
                ))}
              </nav>

              {/* Direct Support Desk Card in Sidebar */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="font-heading text-[11px] font-bold text-white uppercase tracking-wider">
                  Official Verification Desk:
                </p>
                <p className="text-[11px] text-muted mt-1 leading-snug">
                  WhatsApp: +92 308 4703973
                  <br />
                  Multan, Punjab, Pakistan
                </p>
                <a
                  href="https://wa.me/923084703973?text=Hi%2C%20I%20have%20a%20legal%20or%20ownership%20inquiry%20regarding%20Matric%20Mastery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#FFD600] hover:underline"
                >
                  <MessageCircle size={12} />
                  <span>Verify Line via WhatsApp &rarr;</span>
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: EXPANDABLE LEGAL CARDS */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {filteredSections.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#121216] p-12 text-center">
                <Search size={32} className="mx-auto text-muted mb-3" />
                <p className="font-heading text-lg font-bold text-white">
                  No matching legal provisions found
                </p>
                <p className="text-xs text-muted mt-1">
                  Try clearing your search term or selecting "All Provisions".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 rounded-xl bg-[#FFD600] px-4 py-2 font-heading text-xs font-black text-black"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredSections.map((sec) => {
                const isCollapsed = !!collapsedSections[sec.id];

                return (
                  <section
                    key={sec.id}
                    id={sec.id}
                    className="relative rounded-[26px] border border-white/10 bg-[#121216]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl hover:border-[#FFD600]/40 transition-all duration-300"
                  >
                    {/* Header Bar of Section */}
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-[#FFD600] uppercase tracking-wider">
                            SECTION {sec.number}
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="font-mono text-[10px] text-muted">
                            Updated {sec.lastUpdated}
                          </span>
                        </div>

                        <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
                          {highlightQuery(sec.title)}
                        </h2>

                        <p className="mt-1 text-xs sm:text-sm text-muted/90 font-medium leading-relaxed">
                          {highlightQuery(sec.shortSummary)}
                        </p>
                      </div>

                      {/* Action buttons: Copy link + Collapse toggle */}
                      <div className="flex items-center gap-1.5 shrink-0 mt-1">
                        <button
                          type="button"
                          onClick={() => copySectionLink(sec.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted hover:text-white hover:border-[#FFD600]/40 transition-colors"
                          title="Copy direct link to this section"
                        >
                          {copiedSectionId === sec.id ? (
                            <Check size={14} className="text-emerald-400" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleAccordion(sec.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted hover:text-white hover:border-[#FFD600]/40 transition-colors"
                          title={isCollapsed ? "Expand section" : "Collapse section"}
                        >
                          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Section Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {sec.badges.map((b) => (
                        <span
                          key={b}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-white/80"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Collapsible Content */}
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-white/90 leading-[1.8] font-normal border-t border-white/5 pt-4">
                            {sec.paragraphs.map((para, pIdx) => (
                              <p key={pIdx}>{highlightQuery(para)}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                );
              })
            )}

            {/* =========================================================================
                YELLOW HERO CONTACT CARD: WHATSAPP VERIFICATION DESK
                ========================================================================= */}
            <div className="relative rounded-[28px] border-2 border-[#FFD600]/50 bg-gradient-to-br from-[#FFD600] to-amber-400 p-7 sm:p-9 text-black shadow-[0_0_50px_rgba(255,214,0,0.2)] overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-black/80">
                <ShieldCheck size={16} className="text-black" />
                <span>OFFICIAL VERIFICATION &amp; DMCA DESK</span>
              </div>

              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-black text-black tracking-tight">
                Questions or Legal Verification? WhatsApp Us
              </h2>

              <p className="mt-2 text-xs sm:text-sm font-semibold leading-relaxed text-black/90 max-w-xl">
                For DMCA takedown submissions, student privacy masking requests, academy licensing inquiries, or to verify any official communication, connect directly with our legal desk.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="https://wa.me/923084703973?text=Hi%2C%20I%20have%20a%20formal%20legal%2C%20copyright%2C%20or%20privacy%20inquiry%20regarding%20Matric%20Mastery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 font-heading text-xs sm:text-sm font-black text-white hover:bg-neutral-900 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageCircle size={16} className="text-[#FFD600]" />
                  <span>WhatsApp Legal Channel</span>
                </a>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/30 bg-white/80 px-5 py-3.5 font-heading text-xs sm:text-sm font-bold text-black hover:bg-white transition-all shadow-sm cursor-pointer"
                >
                  <span>About Our Platform</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="mt-5 border-t border-black/20 pt-3 text-[11px] font-mono text-black/80 flex flex-wrap items-center justify-between gap-2">
                <span>Verified Line: +92 308 4703973</span>
                <span>Response Target: Within 24 Hours</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
