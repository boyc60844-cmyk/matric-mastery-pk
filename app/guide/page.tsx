"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  Calculator,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  HelpCircle,
  History,
  Layers,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Download,
  AlertCircle,
  Tag,
  Award,
  Zap,
  TrendingUp,
  RotateCcw,
  Laptop,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DIRECTORY_MODULES,
  STUDENT_JOURNEYS,
  DirectoryCategory,
  DirectoryModule,
  StudentJourney,
} from "@/lib/websiteDirectory";
import {
  CURRENT_VERSION,
  CURRENT_RELEASE_DATE,
  CURRENT_RELEASE_CODENAME,
  WEEKLY_UPGRADE_POLICY,
  RELEASE_HISTORY,
} from "@/lib/releaseManifest";
import { GUIDE_FAQS, generateFaqJsonLd } from "@/lib/guideFaqData";
import { whatsappLink } from "@/lib/utils";

const CATEGORY_TABS: { id: DirectoryCategory; label: string; count: number }[] = [
  { id: "all", label: "All Modules", count: DIRECTORY_MODULES.length },
  {
    id: "strategy",
    label: "Strategy & Presentation",
    count: DIRECTORY_MODULES.filter((m) => m.category === "strategy").length,
  },
  {
    id: "practice",
    label: "Practice & Testing",
    count: DIRECTORY_MODULES.filter((m) => m.category === "practice").length,
  },
  {
    id: "intelligence",
    label: "Board Intelligence",
    count: DIRECTORY_MODULES.filter((m) => m.category === "intelligence").length,
  },
  {
    id: "utility",
    label: "Productivity & Tools",
    count: DIRECTORY_MODULES.filter((m) => m.category === "utility").length,
  },
  {
    id: "support",
    label: "Core & Supporting",
    count: DIRECTORY_MODULES.filter((m) => m.category === "support").length,
  },
];

export default function WebsiteGuidePage() {
  // Directory state
  const [selectedCategory, setSelectedCategory] = useState<DirectoryCategory>("all");
  const [directorySearch, setDirectorySearch] = useState("");
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Student Journeys state
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(
    STUDENT_JOURNEYS[0].id
  );

  // FAQ state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [faqFilter, setFaqFilter] = useState<"all" | "about" | "features" | "accuracy" | "technical">("all");

  // Version History state
  const [versionTab, setVersionTab] = useState<"all" | "major" | "recent">("all");

  // Filtered Directory
  const filteredModules = useMemo(() => {
    return DIRECTORY_MODULES.filter((mod) => {
      const matchesCategory =
        selectedCategory === "all" || mod.category === selectedCategory;
      const q = directorySearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        mod.name.toLowerCase().includes(q) ||
        mod.urduName.includes(q) ||
        mod.tagline.toLowerCase().includes(q) ||
        mod.purpose.toLowerCase().includes(q) ||
        mod.whatYouWillFind.some((item) => item.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, directorySearch]);

  const activeJourney = useMemo(() => {
    return (
      STUDENT_JOURNEYS.find((j) => j.id === selectedJourneyId) ||
      STUDENT_JOURNEYS[0]
    );
  }, [selectedJourneyId]);

  const filteredFaqs = useMemo(() => {
    return GUIDE_FAQS.filter((f) => {
      if (faqFilter === "all") return true;
      return f.category === faqFilter;
    });
  }, [faqFilter]);

  const jsonLd = useMemo(() => generateFaqJsonLd(), []);

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Inject valid Schema.org FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* Ambient Glows constrained to prevent mobile expansion */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute top-[600px] right-5 w-[450px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-[1800px] left-5 w-[500px] h-[350px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-site w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* =========================================================================
            BREADCRUMB NAVIGATION
            ========================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-white font-medium">Platform Guide &amp; Directory</span>
          <ChevronRight size={12} />
          <span className="text-accent font-semibold">{CURRENT_VERSION}</span>
        </nav>

        {/* =========================================================================
            HERO HEADER — COMPREHENSIVE ORIENTATION
            ========================================================================= */}
        <header className="border-b border-white/10 pb-8 sm:pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-mono font-bold text-accent mb-4">
                <Compass size={14} className="animate-spin-slow" />
                <span>MATRIC MASTERY DIRECTORY // COMPLETE PLATFORM GUIDE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white max-w-4xl">
                The Complete Guide to <span className="text-accent">Matric Mastery</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
                Everything you need to understand, navigate, and get the maximum
                value from Pakistan&apos;s premier free board examination platform.
                Explore our philosophy, directory of every single page and tool,
                recommended student journeys, mobile tips, and weekly release system.
              </p>

              {/* Version & Integrity Badges */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent font-bold">
                  <Tag size={12} />
                  <span>Edition: {CURRENT_VERSION}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#121216] px-2.5 py-1 text-neutral-300">
                  <Calendar size={12} className="text-neutral-400" />
                  <span>Release: {CURRENT_RELEASE_DATE}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-400 font-semibold">
                  <ShieldCheck size={12} />
                  <span>100% Free · Zero Academy Fees</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-cyan-400 font-semibold">
                  <Laptop size={12} />
                  <span>All 9 Punjab BISE Boards &amp; FBISE</span>
                </span>
              </div>
            </div>

            {/* Quick Context Card */}
            <div className="flex flex-col gap-2 shrink-0">
              <a
                href="#directory"
                className="flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-heading text-xs font-black text-black hover:bg-amber-400 active:scale-95 transition-all shadow-md"
              >
                <span>Jump to Page Directory</span>
                <ArrowRight size={14} />
              </a>
              <a
                href="#journeys"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#121216] px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white hover:border-white/20 active:scale-95 transition-all"
              >
                <span>Pick Your Student Journey</span>
              </a>
            </div>
          </div>

          {/* Quick Jump Anchors */}
          <div className="mt-8 flex overflow-x-auto gap-2 border-t border-white/10 pt-4 scrollbar-none text-xs font-medium">
            <a
              href="#welcome"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-neutral-400 hover:text-white hover:border-accent/40 whitespace-nowrap transition-colors"
            >
              1. Purpose &amp; Philosophy
            </a>
            <a
              href="#start-here"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-neutral-400 hover:text-white hover:border-accent/40 whitespace-nowrap transition-colors"
            >
              2. Start Here Guide
            </a>
            <a
              href="#directory"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-accent font-bold hover:border-accent whitespace-nowrap transition-colors"
            >
              3. Complete Directory (16 Items)
            </a>
            <a
              href="#journeys"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-neutral-400 hover:text-white hover:border-accent/40 whitespace-nowrap transition-colors"
            >
              4. Student Journeys
            </a>
            <a
              href="#advice"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-neutral-400 hover:text-white hover:border-accent/40 whitespace-nowrap transition-colors"
            >
              5. Study Wisdom
            </a>
            <a
              href="#mobile"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-neutral-400 hover:text-white hover:border-accent/40 whitespace-nowrap transition-colors"
            >
              6. Mobile Guide
            </a>
            <a
              href="#troubleshooting"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-neutral-400 hover:text-white hover:border-accent/40 whitespace-nowrap transition-colors"
            >
              7. Troubleshooting
            </a>
            <a
              href="#upgrades"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-neutral-400 hover:text-white hover:border-accent/40 whitespace-nowrap transition-colors"
            >
              8. Weekly Upgrades &amp; Changelog
            </a>
            <a
              href="#faqs"
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-1.5 text-neutral-400 hover:text-white hover:border-accent/40 whitespace-nowrap transition-colors"
            >
              9. Comprehensive FAQ
            </a>
          </div>
        </header>

        {/* =========================================================================
            SECTION A: INTRODUCTION TO MATRIC MASTERY
            ========================================================================= */}
        <section id="welcome" className="py-12 border-b border-white/10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
              <Sparkles size={14} />
              <span>Section A · Institutional Foundation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
              What is Matric Mastery?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
              Matric Mastery is an independent, non-commercial educational
              platform founded by <strong>Hamza</strong>, a 10th-grade student from
              Multan, Punjab. It is not an academy, a tutoring center, or a
              corporate test-prep franchise. It is a peer-engineered system born
              from a real student&apos;s determination to solve the structural flaws of
              the Pakistani matriculation system.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Philosophy Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-6 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/30 text-accent mb-4">
                <Award size={20} />
              </div>
              <h3 className="font-heading font-bold text-white text-base">
                The Presentation Reality
              </h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                In Punjab Board marking centers, examiners evaluate hundreds of
                scripts daily, averaging approximately <strong>2 to 3 minutes</strong>{" "}
                per paper according to senior teachers. When key answers are buried
                in dense, unformatted paragraphs, valid points can easily be overlooked.
                Clean presentation ensures your genuine preparation is recognized.
              </p>
            </div>

            {/* Philosophy Card 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-6 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-heading font-bold text-white text-base">
                Zero Academy Needed
              </h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                You do not need expensive evening coaching centers or 50,000 Rs
                tuition fees to achieve top academic marks. Every strategy, template,
                and mock drill is engineered to support self-study from home
                using your standard Punjab Textbook Board books.
              </p>
            </div>

            {/* Philosophy Card 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-6 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
                <Layers size={20} />
              </div>
              <h3 className="font-heading font-bold text-white text-base">
                The Complete Integrated Suite
              </h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                Matric Mastery connects four distinct components into one ecosystem:
                tactical strategy playbooks, timed mock exams, verified board
                intelligence, and drift-free productivity utilities. Everything
                works together seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION B: START HERE — FIRST-TIME VISITOR ON-RAMP
            ========================================================================= */}
        <section id="start-here" className="py-12 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
            <Compass size={14} />
            <span>Section B · New Student On-Ramp</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Start Here: Where a New Visitor Should Begin
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            You do not need to read the entire website today. Follow this
            recommended 4-step first-time sequence to get immediate value in under
            20 minutes.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="rounded-2xl border border-accent/30 bg-[#121216] p-5 flex flex-col justify-between shadow-soft">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-black font-mono font-black text-xs">
                    01
                  </span>
                  <span className="text-[10px] font-mono uppercase text-accent font-bold">
                    Read First
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white">
                  The 3-Hour Exam Formula
                </h3>
                <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                  Understand how to divide 180 minutes between MCQs, short answers,
                  long questions, and the critical 20-minute review buffer.
                </p>
              </div>
              <Link
                href="/strategies/3-hour-formula"
                className="mt-4 flex items-center justify-between text-xs font-heading font-bold text-accent hover:underline pt-2 border-t border-white/10"
              >
                <span>Read Strategy</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 flex flex-col justify-between shadow-soft">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white font-mono font-black text-xs">
                    02
                  </span>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                    Formatting
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white">
                  Presentation Hacks
                </h3>
                <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                  Learn the 1.5-inch margin technique and the 5-box numerical layout
                  that immediately wins the examiner&apos;s confidence.
                </p>
              </div>
              <Link
                href="/paper-hacks"
                className="mt-4 flex items-center justify-between text-xs font-heading font-bold text-neutral-300 hover:text-white pt-2 border-t border-white/10"
              >
                <span>View Hacks</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 flex flex-col justify-between shadow-soft">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white font-mono font-black text-xs">
                    03
                  </span>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                    Practice
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white">
                  Take a 25-Mark Mock Test
                </h3>
                <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                  Try a quick 30-minute timed mock test in Math or Physics to test
                  your speed under simulated board exam pressure.
                </p>
              </div>
              <Link
                href="/mock-tests"
                className="mt-4 flex items-center justify-between text-xs font-heading font-bold text-neutral-300 hover:text-white pt-2 border-t border-white/10"
              >
                <span>Start Drill</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 flex flex-col justify-between shadow-soft">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white font-mono font-black text-xs">
                    04
                  </span>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                    Daily Habit
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white">
                  Set Your Study Pomodoro
                </h3>
                <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                  Launch the 25m/5m focus timer in Study Tools to establish a
                  drift-free daily revision habit without phone distractions.
                </p>
              </div>
              <Link
                href="/utilities?tab=timers"
                className="mt-4 flex items-center justify-between text-xs font-heading font-bold text-neutral-300 hover:text-white pt-2 border-t border-white/10"
              >
                <span>Open Timers</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION C: COMPLETE PAGE-BY-PAGE DIRECTORY (16 ITEMS)
            ========================================================================= */}
        <section id="directory" className="py-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
                <Layers size={14} />
                <span>Section C · Full Platform Inventory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                Complete Page-by-Page Directory
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-2xl">
                Every existing module, interactive engine, and supporting page
                documented with its purpose, when to use it, and direct links.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                type="text"
                placeholder="Search all 16 modules..."
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#121216] pl-9 pr-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-accent focus:outline-none transition-colors"
              />
              {directorySearch && (
                <button
                  type="button"
                  onClick={() => setDirectorySearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-heading font-bold whitespace-nowrap transition-all active:scale-95 ${
                  selectedCategory === cat.id
                    ? "bg-accent text-black shadow-sm"
                    : "border border-white/10 bg-[#121216] text-neutral-300 hover:text-white hover:border-white/20"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                    selectedCategory === cat.id
                      ? "bg-black/20 text-black"
                      : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Modules List Grid */}
          <div className="mt-8 space-y-4">
            {filteredModules.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-12 text-center text-neutral-400">
                <Search size={32} className="mx-auto mb-3 text-neutral-600" />
                <p className="text-sm font-semibold text-white">
                  No modules match &quot;{directorySearch}&quot;
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Try searching for keywords like &quot;math&quot;, &quot;weather&quot;, &quot;timer&quot;, or &quot;dates&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setDirectorySearch("");
                  }}
                  className="mt-4 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredModules.map((mod: DirectoryModule) => {
                const isExpanded = expandedModuleId === mod.id;

                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 sm:p-6 shadow-md transition-all hover:border-white/20"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="font-heading font-black text-lg text-white">
                            {mod.name}
                          </h3>
                          <span className="font-urdu text-xs text-accent font-semibold">
                            {mod.urduName}
                          </span>
                          {mod.badge && (
                            <span className="rounded bg-accent/15 border border-accent/30 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                              {mod.badge}
                            </span>
                          )}
                          <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-neutral-400 capitalize">
                            {mod.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                          {mod.tagline}
                        </p>
                        <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                          {mod.purpose}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        {mod.href === "#doubt-solver" ? (
                          <button
                            type="button"
                            onClick={() => {
                              window.dispatchEvent(
                                new CustomEvent("mm:open-doubt-solver")
                              );
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 font-heading text-xs font-black text-black hover:bg-amber-400 active:scale-95 transition-all shadow-sm"
                          >
                            <span>Open Assistant</span>
                            <Sparkles size={13} />
                          </button>
                        ) : (
                          <Link
                            href={mod.href}
                            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 font-heading text-xs font-black text-black hover:bg-amber-400 active:scale-95 transition-all shadow-sm"
                          >
                            <span>Open Page</span>
                            <ArrowRight size={13} />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedModuleId(isExpanded ? null : mod.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#16161A] text-neutral-300 hover:text-white hover:border-white/20 transition-colors"
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                            {/* What You'll Find */}
                            <div className="space-y-2">
                              <span className="font-heading font-bold text-white uppercase text-[11px] tracking-wider block text-accent">
                                What Students Will Find Here:
                              </span>
                              <ul className="space-y-1.5 text-neutral-300">
                                {mod.whatYouWillFind.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2
                                      size={13}
                                      className="text-emerald-400 shrink-0 mt-0.5"
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* When to Use & Pro Tips */}
                            <div className="space-y-4">
                              <div>
                                <span className="font-heading font-bold text-white uppercase text-[11px] tracking-wider block text-accent mb-1">
                                  When To Use This Feature:
                                </span>
                                <p className="text-neutral-300 leading-relaxed bg-black/40 rounded-xl p-3 border border-white/5">
                                  {mod.whenToUse}
                                </p>
                              </div>

                              {mod.proTips.length > 0 && (
                                <div>
                                  <span className="font-heading font-bold text-white uppercase text-[11px] tracking-wider block text-accent mb-1">
                                    Examiner Pro-Tip:
                                  </span>
                                  <div className="space-y-1 text-neutral-300">
                                    {mod.proTips.map((tip, idx) => (
                                      <p
                                        key={idx}
                                        className="bg-amber-500/5 rounded-xl p-2.5 border border-amber-500/20 text-neutral-200"
                                      >
                                        💡 {tip}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Connected Pages */}
                              {mod.connectedPages.length > 0 && (
                                <div>
                                  <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold block mb-1.5">
                                    Related Platform Connections:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {mod.connectedPages.map((cp) => (
                                      <Link
                                        key={cp.href}
                                        href={cp.href}
                                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-neutral-300 hover:text-accent hover:border-accent/40 transition-colors"
                                      >
                                        {cp.name} &rarr;
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION D: RECOMMENDED STUDENT JOURNEYS
            ========================================================================= */}
        <section id="journeys" className="py-12 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
            <Compass size={14} />
            <span>Section D · Usage Paths for Every Situation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Recommended Student Journeys
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            Students face different deadlines, skill levels, and challenges.
            Choose your current situation to follow a logical, step-by-step path
            through the platform.
          </p>

          {/* Journey Selector Tabs */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STUDENT_JOURNEYS.map((j: StudentJourney) => {
              const isSelected = selectedJourneyId === j.id;
              return (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setSelectedJourneyId(j.id)}
                  className={`flex flex-col justify-between p-4 rounded-2xl text-left border transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-accent/60 bg-gradient-to-br from-[#181820] to-[#121216] shadow-brutalist-yellow"
                      : "border-white/10 bg-[#0E0E12] hover:border-white/20 hover:bg-[#121216]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span
                        className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? "bg-accent text-black font-black"
                            : "bg-white/10 text-neutral-400"
                        }`}
                      >
                        {j.estimatedTime}
                      </span>
                      {isSelected && (
                        <span className="text-accent text-[11px] font-bold font-mono">
                          ● ACTIVE PATH
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-sm text-white">
                      {j.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                      {j.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Journey Walkthrough */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0E0E12] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-mono text-accent uppercase font-bold tracking-wider">
                  Recommended Sequence For: {activeJourney.targetAudience}
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white mt-1">
                  {activeJourney.title}
                </h3>
              </div>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-neutral-300 self-start sm:self-auto">
                Estimated Pace: {activeJourney.estimatedTime}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {activeJourney.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#141418] p-4 text-xs transition-all hover:border-white/20"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-black font-mono font-black text-xs">
                      {step.stepNumber}
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-neutral-400 leading-relaxed">
                        {step.rationale}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={step.href}
                    className="flex items-center gap-1.5 self-start md:self-auto rounded-lg bg-white/10 border border-white/10 px-3 py-2 font-heading font-bold text-white hover:bg-accent hover:text-black active:scale-95 transition-all shrink-0"
                  >
                    <span>{step.actionText}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION E: HOW TO GET THE MOST OUT OF MATRIC MASTERY
            ========================================================================= */}
        <section id="advice" className="py-12 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>Section E · Practical Study Wisdom</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            How to Get the Maximum Value from Matric Mastery
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            Honest advice for turning online tools into actual board marks without
            falling into productivity traps or exaggerated promises.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Advice 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2.5">
              <span className="font-heading font-bold text-accent uppercase text-[11px] tracking-wider block">
                1. The Unified Study Loop
              </span>
              <p className="text-neutral-300 leading-relaxed">
                Do not treat sections as isolated islands. The ideal loop is:
                <strong> Read the Strategy</strong> on /strategies &rarr;
                <strong> Learn Presentation</strong> on /paper-hacks &rarr;
                <strong> Drill Timed Mock</strong> on /mock-tests &rarr;
                <strong> Solve Stuck Questions</strong> with the AI Doubt Solver &rarr;
                <strong> Log Progress</strong> in /dashboard.
              </p>
            </div>

            {/* Advice 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2.5">
              <span className="font-heading font-bold text-accent uppercase text-[11px] tracking-wider block">
                2. AI Doubt Solver Best Practices
              </span>
              <p className="text-neutral-300 leading-relaxed">
                Ask specific questions rather than vague chapter names. For math
                numerical problems, attach a clear photo of the textbook diagram.
                Always cross-check the AI&apos;s mathematical steps against your official
                Punjab Textbook Board syllabus. Use it to understand concepts, never
                to shortcut your own thinking.
              </p>
            </div>

            {/* Advice 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2.5">
              <span className="font-heading font-bold text-accent uppercase text-[11px] tracking-wider block">
                3. Beware Productivity Tool Traps
              </span>
              <p className="text-neutral-300 leading-relaxed">
                Do not spend 45 minutes tweaking timers, checking exchange rates, or
                staring at analytics. Set a 25-minute Pomodoro timer, place your
                phone across the room face down, and study your physical textbook.
                The tool serves your studying, not the other way around.
              </p>
            </div>

            {/* Advice 4 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2.5">
              <span className="font-heading font-bold text-accent uppercase text-[11px] tracking-wider block">
                4. Checking Source Dates
              </span>
              <p className="text-neutral-300 leading-relaxed">
                When reading announcements on /board-watch or legal policies on
                /legal, inspect the <strong>verification timestamp</strong>. Official
                notifications display gazette numbers, while expected dates are
                explicitly tagged as historical projections.
              </p>
            </div>

            {/* Advice 5 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2.5">
              <span className="font-heading font-bold text-accent uppercase text-[11px] tracking-wider block">
                5. Solving on Paper with Ink
              </span>
              <p className="text-neutral-300 leading-relaxed">
                While online mock tests build rapid MCQ reflexes, board exams are
                written by hand with pen and cut markers. At least twice a week,
                print an authentic past paper from /past-papers and write the answers
                by hand under strict 3-hour timing.
              </p>
            </div>

            {/* Advice 6 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2.5">
              <span className="font-heading font-bold text-accent uppercase text-[11px] tracking-wider block">
                6. Healthy Exam Sleep Habits
              </span>
              <p className="text-neutral-300 leading-relaxed">
                No exam strategy can overcome a sleep-deprived brain. During the
                final 2 weeks before annual exams, follow the schedule in our
                Exam Day Guidebook: sleep at least 7.5 hours so your memory recall
                remains sharp during the morning paper.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION F: MOBILE WEBSITE GUIDE
            ========================================================================= */}
        <section id="mobile" className="py-12 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
            <Smartphone size={14} />
            <span>Section F · Mobile Navigation Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Using Matric Mastery on Mobile Devices
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            Over 80% of Pakistani matric candidates access our platform via mobile
            smartphones. Here is how our responsive interface is engineered for you.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-6 space-y-3">
              <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <Smartphone size={16} className="text-accent" />
                Mobile Navigation &amp; Tap Ergonomics
              </h3>
              <ul className="space-y-2 text-neutral-300 leading-relaxed">
                <li>
                  <strong>• 44px Touch Target Hamburger Button:</strong> The menu
                  toggle in the top-right corner is sized for comfortable single-thumb
                  tapping. It morphs with a multi-line spring into an &apos;X&apos; when opened.
                </li>
                <li>
                  <strong>• Quick Utility Strip:</strong> On phones, a slim strip below
                  the header gives one-tap access to the Language Switcher (ENG/اردو),
                  the quick &apos;Tools&apos; launcher, Cloud Login, and WhatsApp helpline.
                </li>
                <li>
                  <strong>• Multi-Layer Drawer Reveal:</strong> The mobile navigation
                  opens in coordinated stages: backdrop blur first, followed by the
                  panel scale, and staggered 3D link cards with drawing underline accents.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-6 space-y-3">
              <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <Zap size={16} className="text-accent" />
                Performance &amp; Offline Resilience
              </h3>
              <ul className="space-y-2 text-neutral-300 leading-relaxed">
                <li>
                  <strong>• Non-Overlapping Floating Controls:</strong> The floating
                  AI Doubt Solver orb and directory controls are engineered with safe-area
                  insets so they never collide or block content on narrow screens (320px–430px).
                </li>
                <li>
                  <strong>• PWA Home Screen Installation:</strong> Open your browser
                  menu and tap &quot;Add to Home Screen&quot; to install Matric Mastery like a native app.
                </li>
                <li>
                  <strong>• 60fps GPU Performance:</strong> Background 3D animations
                  automatically pause when scrolled out of view to preserve battery life
                  and prevent lag on lower-end Android devices.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION G: TROUBLESHOOTING & HELP
            ========================================================================= */}
        <section id="troubleshooting" className="py-12 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
            <HelpCircle size={14} />
            <span>Section G · Real-World Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Troubleshooting &amp; Practical Support
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            Technically accurate solutions for common situations, network hiccups,
            or browser caching questions.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Issue 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2">
              <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5 text-amber-400">
                <AlertCircle size={14} /> Page Fails to Load or Blank Screen
              </span>
              <p className="text-neutral-400 leading-relaxed">
                Perform a hard refresh: press <strong>Ctrl + Shift + R</strong> on
                desktop, or pull down to refresh in Chrome/Safari mobile. Ensure your
                browser JavaScript is enabled.
              </p>
            </div>

            {/* Issue 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2">
              <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5 text-amber-400">
                <AlertCircle size={14} /> AI Solver Says &quot;Server Busy&quot;
              </span>
              <p className="text-neutral-400 leading-relaxed">
                The Gemini AI backend experiences occasional rate limits during peak
                evening hours. Wait 5 seconds and click the red <strong>Retry</strong>{" "}
                button. If attaching an image, ensure it is clear and under 5MB.
              </p>
            </div>

            {/* Issue 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2">
              <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5 text-amber-400">
                <AlertCircle size={14} /> Weather or Forex Not Updating
              </span>
              <p className="text-neutral-400 leading-relaxed">
                External weather data caches for 15 minutes and forex rates cache for
                1 hour to preserve API reliability. Click the <strong>Refresh</strong>{" "}
                button in /utilities to fetch fresh data if you are online.
              </p>
            </div>

            {/* Issue 4 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2">
              <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5 text-amber-400">
                <AlertCircle size={14} /> Study Logs / Deadlines Disappeared
              </span>
              <p className="text-neutral-400 leading-relaxed">
                If you cleared your browser history or switched to incognito mode,
                local data may reset. In /utilities, use <strong>Restore Backup</strong>{" "}
                to upload your exported JSON backup file, or sign in via Cloud Login.
              </p>
            </div>

            {/* Issue 5 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2">
              <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5 text-amber-400">
                <AlertCircle size={14} /> Voice Dictation Button Disabled
              </span>
              <p className="text-neutral-400 leading-relaxed">
                Voice input uses the Web Speech API, which requires permission in
                Chrome, Edge, or Safari. Check your browser address bar permissions
                and allow microphone access for this website.
              </p>
            </div>

            {/* Issue 6 */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 space-y-2">
              <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5 text-emerald-400">
                <MessageCircle size={14} /> Direct Human Student Support
              </span>
              <p className="text-neutral-400 leading-relaxed">
                Have an urgent doubt or technical bug? Message founder Hamza directly
                on the verified WhatsApp helpline (<strong>+92 308 4703973</strong>).
                He responds to all student inquiries personally.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION H: WEEKLY UPGRADE SYSTEM & VERSION HISTORY
            ========================================================================= */}
        <section id="upgrades" className="py-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
                <History size={14} />
                <span>Section H · Continuous Platform Evolution</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                Weekly Upgrade System &amp; Release History
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                Matric Mastery improves on a disciplined weekly iteration cycle.
                Every release is verified against three automated quality gates
                before public availability.
              </p>
            </div>

            {/* Active Version Callout */}
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 text-left sm:text-right shrink-0">
              <span className="text-[10px] font-mono uppercase font-bold text-accent block">
                Current Verified Production Release
              </span>
              <span className="font-mono text-2xl font-black text-white block">
                {CURRENT_VERSION}
              </span>
              <span className="text-xs text-neutral-300 font-medium">
                {CURRENT_RELEASE_CODENAME}
              </span>
            </div>
          </div>

          {/* Upgrade Policy Description */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0E0E12] p-6 text-xs">
            <h3 className="font-heading font-bold text-white text-sm mb-2">
              Our Weekly Upgrade Philosophy ({WEEKLY_UPGRADE_POLICY.cycle})
            </h3>
            <p className="text-neutral-300 leading-relaxed">
              {WEEKLY_UPGRADE_POLICY.philosophy}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              {WEEKLY_UPGRADE_POLICY.changeCategories.slice(0, 6).map((cat, i) => (
                <div key={i} className="rounded-xl bg-black/40 p-3 border border-white/5">
                  <span className="font-heading font-bold text-accent block">
                    {cat.type}
                  </span>
                  <p className="mt-1 text-[11px] text-neutral-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Authentic Release History Timeline */}
          <div className="mt-8">
            <h3 className="font-heading font-bold text-white text-base mb-4 flex items-center gap-2">
              <History size={16} className="text-accent" />
              <span>Verified Release History (Chronological)</span>
            </h3>

            <div className="space-y-4">
              {RELEASE_HISTORY.map((rel) => (
                <div
                  key={rel.version}
                  className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 sm:p-6 shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base sm:text-lg font-black text-white">
                        {rel.version}
                      </span>
                      <span className="text-sm font-heading font-bold text-accent">
                        {rel.codename}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
                        {rel.releaseDate}
                      </span>
                      <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                        {rel.status}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-neutral-300 leading-relaxed">
                    {rel.summary}
                  </p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-white/5">
                    <div>
                      <span className="font-heading font-bold text-white text-[11px] uppercase tracking-wider block mb-1 text-accent">
                        Key Features Introduced:
                      </span>
                      <ul className="space-y-1 text-neutral-400">
                        {rel.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-accent font-bold mt-0.5">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-heading font-bold text-white text-[11px] uppercase tracking-wider block mb-1 text-neutral-400">
                        Improvements &amp; Quality Hardening:
                      </span>
                      <ul className="space-y-1 text-neutral-400">
                        {rel.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold mt-0.5">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION I: COMPREHENSIVE FREQUENTLY ASKED QUESTIONS (FAQ)
            ========================================================================= */}
        <section id="faqs" className="py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-2">
                <HelpCircle size={14} />
                <span>Section I · Visitor Knowledge Base</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                Frequently Asked Questions
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                Clear, verified answers to real student questions regarding platform
                access, accuracy, features, and technical capabilities.
              </p>
            </div>

            {/* FAQ Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All Questions" },
                { id: "about", label: "About & Costs" },
                { id: "features", label: "Tools & AI" },
                { id: "accuracy", label: "Board Accuracy" },
                { id: "technical", label: "Technical & Sync" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFaqFilter(tab.id as any)}
                  className={`rounded-lg px-3 py-1 text-xs font-heading font-bold transition-all ${
                    faqFilter === tab.id
                      ? "bg-accent text-black font-black"
                      : "bg-[#141418] border border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion FAQ Items */}
          <div className="mt-8 space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isExpanded = expandedFaqIndex === index;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-[#0E0E12] overflow-hidden transition-all hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left font-heading font-bold text-sm sm:text-base text-white hover:text-accent transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-accent shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/5 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Direct Help Callout */}
          <div className="mt-12 rounded-3xl border border-accent/40 bg-gradient-to-r from-[#141418] via-[#121214] to-[#16161a] p-6 sm:p-8 shadow-brutalist-yellow text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-accent tracking-wider">
                Still have an unanswered question?
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-white mt-1">
                Connect with the Student Community
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                Matric Mastery is maintained by peer students in Pakistan.
                Send questions, feedback, or suggestions to our official WhatsApp channel.
              </p>
            </div>

            <a
              href={whatsappLink("Assalam-o-Alaikum Hamza bhai, mujhe website guide ke bare mein sawal tha")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-heading text-xs sm:text-sm font-black text-black hover:bg-amber-400 active:scale-95 transition-all shadow-md shrink-0"
            >
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
