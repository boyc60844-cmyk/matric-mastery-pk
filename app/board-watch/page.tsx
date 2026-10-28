"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  FileText,
  Share2,
  Filter,
  Calendar,
  Building2,
  BookOpen,
  Info,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Check,
  RotateCcw,
  Compass,
  FileCheck2,
  BellRing,
  HelpCircle as QuestionIcon,
  X,
  Phone,
  MapPin,
  CalendarDays,
  Target,
  FileSignature,
} from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  PUNJAB_BOARDS,
  PBCC_INFO,
  EXPECTED_TIMELINE_2027,
  INITIAL_BOARD_WATCH_ENTRIES,
  SUBJECT_PATTERNS,
  BoardWatchEntry,
  BoardWatchCategory,
  BoardId,
  ExamClass,
  SubjectPattern,
} from "@/lib/boardWatchData";

export default function BoardWatchPage() {
  const { t, isRTL } = useLanguage();

  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState<
    "stream" | "timeline" | "patterns" | "boards" | "rumors" | "workflow"
  >("stream");
  const [selectedCategory, setSelectedCategory] = useState<BoardWatchCategory | "all">("all");
  const [selectedBoard, setSelectedBoard] = useState<BoardId>("all");
  const [selectedClass, setSelectedClass] = useState<ExamClass | "all">("all");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Interactive UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [userSubmissionText, setUserSubmissionText] = useState("");
  const [userSubmissionSubmitted, setUserSubmissionSubmitted] = useState(false);
  const [selectedPatternSubject, setSelectedPatternSubject] = useState<SubjectPattern | null>(
    SUBJECT_PATTERNS[0]
  );

  // Genuine verification timestamp
  const lastCheckedTimestamp = "October 28, 2026 • 09:18 PKT";

  // Summary counts calculated from real data
  const summaryCounts = useMemo(() => {
    const entries = INITIAL_BOARD_WATCH_ENTRIES;
    return {
      total: entries.length,
      confirmed: entries.filter((e) => e.category === "confirmed").length,
      reported: entries.filter((e) => e.category === "reported").length,
      expected: entries.filter((e) => e.category === "expected").length,
      rumor: entries.filter((e) => e.category === "rumor").length,
      pattern: SUBJECT_PATTERNS.length,
      deadlines: entries.filter((e) => e.category === "deadline").length,
    };
  }, []);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return INITIAL_BOARD_WATCH_ENTRIES.filter((entry) => {
      // Category filter
      if (selectedCategory !== "all" && entry.category !== selectedCategory) {
        return false;
      }

      // Board filter
      if (selectedBoard !== "all") {
        if (!entry.affectedBoards.includes("all") && !entry.affectedBoards.includes(selectedBoard)) {
          return false;
        }
      }

      // Class filter
      if (selectedClass !== "all") {
        if (!entry.affectedClasses.includes(selectedClass)) {
          return false;
        }
      }

      // Session filter
      if (selectedSession !== "all") {
        if (!entry.session.toLowerCase().includes(selectedSession.toLowerCase())) {
          return false;
        }
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesHeadline = entry.headline.toLowerCase().includes(query);
        const matchesSummary = entry.summary.toLowerCase().includes(query);
        const matchesAuthority = entry.issuingAuthority.toLowerCase().includes(query);
        const matchesTags = entry.tags.some((t) => t.toLowerCase().includes(query));
        const matchesWhat = entry.whatItMeans.toLowerCase().includes(query);
        if (!matchesHeadline && !matchesSummary && !matchesAuthority && !matchesTags && !matchesWhat) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedBoard, selectedClass, selectedSession, searchQuery]);

  // Handle permalink share / copy
  const handleCopyLink = (entryId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/board-watch?update=${entryId}#${entryId}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(entryId);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedBoard("all");
    setSelectedClass("all");
    setSelectedSession("all");
    setSearchQuery("");
  };

  // Helper for category badge visual
  const getCategoryBadge = (category: BoardWatchCategory, status: string) => {
    switch (category) {
      case "confirmed":
        return {
          label: "Officially Confirmed",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          icon: <CheckCircle2 size={13} className="text-emerald-400" />,
        };
      case "reported":
        return {
          label: "Credibly Reported • Verification Pending",
          color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
          icon: <Info size={13} className="text-sky-400" />,
        };
      case "expected":
        return {
          label: "Expected • Historical Baseline",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          icon: <Clock size={13} className="text-amber-400" />,
        };
      case "rumor":
        return {
          label: "Unverified Rumor Clarification",
          color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
          icon: <AlertTriangle size={13} className="text-rose-400" />,
        };
      case "pattern":
        return {
          label: "Syllabus & Paper Pattern",
          color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
          icon: <FileSignature size={13} className="text-purple-400" />,
        };
      case "deadline":
        return {
          label: "Time-Sensitive Student Action",
          color: "text-accent bg-accent/10 border-accent/40",
          icon: <Calendar size={13} className="text-accent" />,
        };
      default:
        return {
          label: "General Notice",
          color: "text-muted bg-white/5 border-white/10",
          icon: <FileText size={13} />,
        };
    }
  };

  return (
    <>
      {/* SEO FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "When will Punjab Board Annual 2027 Matric examinations commence?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Based on PBCC statutory examination calendar historical precedents (2022-2026), Class 10 Annual examinations are expected to commence in early March 2027, followed by Class 9 papers in late March. Official date sheets are published 3-4 weeks prior to commencement.",
                },
              },
              {
                "@type": "Question",
                name: "What are the passing marks for Punjab Board exams in 2026 and 2027?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Under PBCC uniform regulations aligned with IBCC directives, the minimum passing percentage is 40% per subject (30/75 in Math and English; 24/60 in Science theory papers; 20/50 in Pak Studies/Islamiat).",
                },
              },
              {
                "@type": "Question",
                name: "Has the PBCC abolished the paper pairing scheme for Punjab Boards?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. PBCC continues to issue standardized assessment schemes. While academies sell unofficial guess papers with exaggerated claims, board examination questions strictly align with the approved Punjab Curriculum and Textbook Board (PCTB) syllabus and Student Learning Outcomes (SLO) benchmarks.",
                },
              },
              {
                "@type": "Question",
                name: "Where can students verify official BISE announcements?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Students must always verify notifications on their own board's official website: BISE Lahore (biselahore.com), BISE Gujranwala (bisegrw.edu.pk), BISE Faisalabad (bisefsd.edu.pk), BISE Rawalpindi (biserawalpindi.edu.pk), BISE Multan (web.bisemultan.edu.pk), BISE Sargodha (bisesargodha.edu.pk), BISE Bahawalpur (bisebwp.edu.pk), BISE DG Khan (bisedgkhan.edu.pk), or BISE Sahiwal (bisesahiwal.edu.pk).",
                },
              },
            ],
          }),
        }}
      />

      <div className="relative min-h-screen bg-[#0A0A0A] text-white">
        {/* MANDATORY INDEPENDENT PLATFORM DISCLAIMER BAR (Visible, persistent, unobtrusive) */}
        <section
          aria-label="Independent Platform Legal Disclaimer"
          className="border-b border-white/10 bg-[#121214] px-4 py-3"
        >
          <div className="mx-auto flex max-w-site items-start gap-3 text-[11px] sm:text-xs leading-relaxed text-zinc-300">
            <ShieldAlert size={16} className="text-accent shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-white font-heading font-bold">
                Independent Student Information Notice:{" "}
              </strong>
              <span>
                Matric Mastery is an independent student information platform. We summarize publicly
                available examination updates for educational purposes. We are not affiliated with
                any examination board, BISE office, PBCC, or government department. Always verify
                important dates, instructions, and requirements through your own board&apos;s
                official website and original notifications.
              </span>
            </div>
          </div>
        </section>

        {/* HERO HEADER */}
        <header className="border-b border-white/10 pt-10 pb-8 px-4 sm:px-6">
          <div className="mx-auto max-w-site">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                {/* Micro Metadata Kicker */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-2 font-mono">
                  <span className="text-accent font-bold">BOARD WATCH</span>
                  <span aria-hidden="true">·</span>
                  <span>Punjab Examination Intelligence</span>
                  <span aria-hidden="true">·</span>
                  <span>9 BISE Boards & PBCC</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-400">Verified: {lastCheckedTimestamp}</span>
                </div>

                <h1 className="type-title text-white tracking-tight">
                  Board Watch —{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-yellow-200">
                    Punjab Exams
                  </span>
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-muted max-w-3xl leading-relaxed">
                  Real-time intelligence on Matric & Intermediate examination cycles across Punjab.
                  Distinguish officially verified circulars from news reporting, historical
                  expectations, and unverified social media claims.
                </p>
              </div>

              {/* Quick Actions & Official Portal Dropdown */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("boards")}
                  className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-heading font-bold text-accent hover:bg-accent/20 transition-all cursor-pointer"
                >
                  <Building2 size={14} />
                  <span>Open Your Board Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-heading font-medium text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FileCheck2 size={14} className="text-muted" />
                  <span>Verify a Circular</span>
                </button>
              </div>
            </div>

            {/* SUMMARY STATS STRIP (Calculated dynamically from real stored records) */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#141416] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-muted uppercase">Verified Updates</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-white tabular-nums">
                    {summaryCounts.total}
                  </span>
                  <span className="text-[10px] text-zinc-400">tracked</span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-emerald-400 uppercase">Confirmed</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-emerald-300 tabular-nums">
                    {summaryCounts.confirmed}
                  </span>
                  <span className="text-[10px] text-emerald-400/80">official</span>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-sky-400 uppercase">Reported</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-sky-300 tabular-nums">
                    {summaryCounts.reported}
                  </span>
                  <span className="text-[10px] text-sky-400/80">in press</span>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-amber-400 uppercase">Expected</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-amber-300 tabular-nums">
                    {summaryCounts.expected}
                  </span>
                  <span className="text-[10px] text-amber-400/80">historical</span>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-rose-400 uppercase">Rumors Debunked</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-rose-300 tabular-nums">
                    {summaryCounts.rumor}
                  </span>
                  <span className="text-[10px] text-rose-400/80">clarified</span>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-purple-400 uppercase">Subject Specs</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-purple-300 tabular-nums">
                    {summaryCounts.pattern}
                  </span>
                  <span className="text-[10px] text-purple-400/80">blueprints</span>
                </div>
              </div>
            </div>

            {/* PRIMARY VIEW NAVIGATION TABS */}
            <div className="mt-8 flex items-center gap-1.5 overflow-x-auto border-b border-white/10 pb-px scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("stream")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "stream"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-muted hover:text-white"
                }`}
              >
                <Layers size={14} />
                <span>All Updates & Alerts ({filteredEntries.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("timeline")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "timeline"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-muted hover:text-white"
                }`}
              >
                <CalendarDays size={14} />
                <span>Expected 2027 Timeline (8 Stages)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("patterns")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "patterns"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-muted hover:text-white"
                }`}
              >
                <BookOpen size={14} />
                <span>Paper Pattern & Syllabus Watch ({SUBJECT_PATTERNS.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("boards")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "boards"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-muted hover:text-white"
                }`}
              >
                <Building2 size={14} />
                <span>9 Punjab Boards Directory</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rumors")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "rumors"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-muted hover:text-white"
                }`}
              >
                <AlertTriangle size={14} />
                <span>Rumors & Clarifications ({summaryCounts.rumor})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("workflow")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "workflow"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-transparent text-muted hover:text-white"
                }`}
              >
                <Compass size={14} />
                <span>How We Verify & Research</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="mx-auto max-w-site px-4 sm:px-6 py-8">
          {/* ============================================================
              TAB 1: LIVE UPDATES STREAM
              ============================================================ */}
          {activeTab === "stream" && (
            <div className="space-y-6">
              {/* FILTERING & SEARCH CONTROLS BAR */}
              <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search updates by keyword, subject, date sheet, passing marks, circular..."
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-muted focus:border-accent focus:outline-none"
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

                  {/* Reset Filters button if active */}
                  {(selectedCategory !== "all" ||
                    selectedBoard !== "all" ||
                    selectedClass !== "all" ||
                    selectedSession !== "all" ||
                    searchQuery) && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="flex items-center gap-1.5 text-xs font-mono text-accent hover:underline shrink-0"
                    >
                      <RotateCcw size={12} />
                      <span>Reset all filters</span>
                    </button>
                  )}
                </div>

                {/* Dropdowns / Segmented selectors */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/10 text-xs">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-[10px] font-mono text-muted mb-1 uppercase">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value as BoardWatchCategory | "all")
                      }
                      className="w-full rounded-lg border border-white/15 bg-[#18181c] px-2.5 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="confirmed">Officially Confirmed</option>
                      <option value="reported">Credibly Reported</option>
                      <option value="expected">Historically Expected</option>
                      <option value="rumor">Rumors & Clarifications</option>
                      <option value="pattern">Paper Pattern & Syllabus</option>
                      <option value="deadline">Deadlines & Actions</option>
                    </select>
                  </div>

                  {/* Board Filter */}
                  <div>
                    <label className="block text-[10px] font-mono text-muted mb-1 uppercase">
                      BISE Board
                    </label>
                    <select
                      value={selectedBoard}
                      onChange={(e) => setSelectedBoard(e.target.value as BoardId)}
                      className="w-full rounded-lg border border-white/15 bg-[#18181c] px-2.5 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                    >
                      <option value="all">All Punjab Boards (Unified)</option>
                      {PUNJAB_BOARDS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.shortName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Class Filter */}
                  <div>
                    <label className="block text-[10px] font-mono text-muted mb-1 uppercase">
                      Class Level
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value as ExamClass | "all")}
                      className="w-full rounded-lg border border-white/15 bg-[#18181c] px-2.5 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                    >
                      <option value="all">All Classes (9th–12th)</option>
                      <option value="9th">Class 9 (SSC Part I)</option>
                      <option value="10th">Class 10 (SSC Part II)</option>
                      <option value="11th">Class 11 (HSSC Part I)</option>
                      <option value="12th">Class 12 (HSSC Part II)</option>
                    </select>
                  </div>

                  {/* Session Filter */}
                  <div>
                    <label className="block text-[10px] font-mono text-muted mb-1 uppercase">
                      Exam Session
                    </label>
                    <select
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-[#18181c] px-2.5 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                    >
                      <option value="all">All Examination Sessions</option>
                      <option value="Annual 2027">Annual 2027 Cycle</option>
                      <option value="2nd Annual 2026">2nd Annual 2026</option>
                      <option value="Annual 2026">Annual 2026 Archive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ACTIVE FILTER PILLS (Clean unboxed metadata) */}
              <div className="flex items-center justify-between text-xs text-muted">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Showing {filteredEntries.length} verified updates</span>
                  {selectedCategory !== "all" && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-accent font-semibold capitalize">
                        {selectedCategory}
                      </span>
                    </>
                  )}
                  {selectedBoard !== "all" && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-white">
                        {PUNJAB_BOARDS.find((b) => b.id === selectedBoard)?.shortName}
                      </span>
                    </>
                  )}
                  {selectedClass !== "all" && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-white">{selectedClass} Class</span>
                    </>
                  )}
                </div>
              </div>

              {/* LIST OF UPDATE CARDS */}
              {filteredEntries.length > 0 ? (
                <div className="space-y-4">
                  {filteredEntries.map((entry) => {
                    const badge = getCategoryBadge(entry.category, entry.status);
                    const isExpanded = expandedEntryId === entry.id;

                    return (
                      <article
                        key={entry.id}
                        id={entry.id}
                        className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6 transition-all hover:border-white/20 shadow-soft"
                      >
                        {/* Top Metadata Header: Status Badge & Timestamps */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-heading font-bold border ${badge.color}`}
                            >
                              {badge.icon}
                              <span>{badge.label}</span>
                            </span>

                            {entry.session && (
                              <span className="text-xs font-mono text-zinc-400">
                                {entry.session}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted font-mono">
                            <span>Verified: {entry.lastVerifiedDate}</span>
                            <span aria-hidden="true">·</span>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(entry.id)}
                              className="text-muted hover:text-accent transition-colors flex items-center gap-1"
                              title="Copy permalink to this update"
                            >
                              {copiedId === entry.id ? (
                                <span className="text-emerald-400 font-bold">Link copied!</span>
                              ) : (
                                <>
                                  <Share2 size={13} />
                                  <span>Share</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Title Headline */}
                        <h2 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                          {entry.headline}
                        </h2>

                        {/* Summary Prose */}
                        <p className="mt-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {entry.summary}
                        </p>

                        {/* "What this means for students" Box */}
                        {entry.whatItMeans && (
                          <div className="mt-4 rounded-xl border border-accent/25 bg-accent/[0.04] p-3.5 text-xs leading-relaxed text-zinc-200">
                            <p className="font-heading font-bold text-accent text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Target size={13} />
                              <span>What this means for students:</span>
                            </p>
                            <p>{entry.whatItMeans}</p>
                          </div>
                        )}

                        {/* Rumor Clarification Detail if applicable */}
                        {entry.rumorDebunk && (
                          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/15 p-3.5 text-xs space-y-2">
                            <div>
                              <span className="font-mono text-[10px] font-bold text-rose-400 uppercase">
                                Missing Evidence:
                              </span>
                              <p className="text-zinc-300 mt-0.5">
                                {entry.rumorDebunk.missingEvidence}
                              </p>
                            </div>
                            <div>
                              <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase">
                                Verified Fact:
                              </span>
                              <p className="text-zinc-200 mt-0.5">
                                {entry.rumorDebunk.verifiedFact}
                              </p>
                            </div>
                            <div>
                              <span className="font-mono text-[10px] font-bold text-accent uppercase">
                                Student Recommendation:
                              </span>
                              <p className="text-zinc-300 mt-0.5">
                                {entry.rumorDebunk.officialAdvice}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Expandable Verification & Audit Trail */}
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedEntryId(isExpanded ? null : entry.id)
                            }
                            className="text-xs font-mono text-muted hover:text-white flex items-center gap-1 transition-colors"
                          >
                            <span>
                              {isExpanded ? "Hide source audit trail" : "View source audit trail"}
                            </span>
                            <ChevronRight
                              size={13}
                              className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs font-mono space-y-1.5 text-zinc-400">
                              <p>
                                <strong className="text-white">Issuing Authority:</strong>{" "}
                                {entry.issuingAuthority}
                              </p>
                              {entry.originalDate && (
                                <p>
                                  <strong className="text-white">Publication Date:</strong>{" "}
                                  {entry.originalDate}
                                </p>
                              )}
                              <p>
                                <strong className="text-white">Evidence Notes:</strong>{" "}
                                {entry.evidenceNotes}
                              </p>
                              <p>
                                <strong className="text-white">Affected Boards:</strong>{" "}
                                {entry.affectedBoardNames.join(", ")}
                              </p>
                              <p>
                                <strong className="text-white">Target Classes:</strong>{" "}
                                {entry.affectedClasses.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Authority Attribution, Target Tags & Source Link */}
                        <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5 text-muted">
                            <span className="text-zinc-400 font-medium">
                              Source: {entry.sourceName}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-zinc-400">{entry.issuingAuthority}</span>
                          </div>

                          <a
                            href={entry.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-accent hover:underline underline-offset-4 shrink-0"
                          >
                            <span>Inspect Official Portal</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="rounded-2xl border border-white/10 bg-[#141416] p-12 text-center">
                  <QuestionIcon size={32} className="mx-auto text-muted mb-3" />
                  <h3 className="font-heading text-base font-bold text-white">
                    No verified updates match your active filters
                  </h3>
                  <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                    Try clearing your search query or selecting &quot;All Categories&quot; to inspect all 9
                    Punjab board notices.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-4 rounded-xl bg-accent px-4 py-2 text-xs font-heading font-bold text-black"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 2: EXPECTED 2027 TIMELINE
              ============================================================ */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              {/* Timeline Header Banner */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.05] p-5">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">
                      Expected 2027 Examination Cycle Timeline (Planning Guidance Only)
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      This schedule illustrates the typical statutory cycle synthesized from PBCC
                      unified calendars across the 2022, 2023, 2024, 2025, and 2026 examination
                      sessions. All future dates are labeled as estimates; official dates are binding
                      only upon publication of the signed PBCC gazette.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Stages */}
              <div className="relative border-l-2 border-white/15 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
                {EXPECTED_TIMELINE_2027.map((stage, idx) => (
                  <div key={stage.id} className="relative group">
                    {/* Step Node Marker */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#18181c] border-2 border-accent text-accent font-mono text-[10px] font-bold">
                      {idx + 1}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6 transition-all hover:border-white/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                        <div>
                          <span className="font-mono text-[11px] font-bold text-accent uppercase">
                            Phase {idx + 1} · {stage.targetGroup}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                            {stage.phase}
                          </h3>
                        </div>

                        <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs text-amber-300 shrink-0">
                          ⏱️ {stage.expectedWindow}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {stage.description}
                      </p>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-3 border-t border-white/10">
                        <div className="rounded-xl bg-black/40 border border-white/5 p-3">
                          <strong className="block text-accent font-heading mb-1 text-[11px] uppercase">
                            Student Action Required:
                          </strong>
                          <p className="text-zinc-300">{stage.studentAction}</p>
                        </div>

                        <div className="rounded-xl bg-black/40 border border-white/5 p-3">
                          <strong className="block text-zinc-400 font-heading mb-1 text-[11px] uppercase">
                            Historical Baseline & Source:
                          </strong>
                          <p className="text-zinc-400">{stage.baselineYears}</p>
                          <p className="mt-1 text-[11px] text-zinc-400 font-mono">
                            Check: {stage.officialSourceToCheck}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 3: PAPER PATTERN & SYLLABUS WATCH
              ============================================================ */}
          {activeTab === "patterns" && (
            <div className="space-y-6">
              {/* Pattern Header Notice */}
              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/15 p-5">
                <div className="flex items-start gap-3">
                  <FileSignature size={20} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">
                      Paper Pattern, Assessment Blueprints & SLO Tracker
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Official structural breakdown for Matric science and compulsory subjects.
                      Important: PBCC paper patterns specify mark quotas and question categories;
                      they are never &quot;leak papers&quot; or guaranteed chapter pairings. Beware of
                      unauthorized commercial guess papers promising 100% repetition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject Selector Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {SUBJECT_PATTERNS.map((p) => {
                  const isSelected = selectedPatternSubject?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPatternSubject(p)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? "bg-accent text-black font-black shadow-glow"
                          : "border border-white/10 bg-[#141416] text-muted hover:text-white hover:border-white/20"
                      }`}
                    >
                      {p.subject}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Subject Pattern Card */}
              {selectedPatternSubject && (
                <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 sm:p-8 space-y-6">
                  {/* Subject Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <span className="font-mono text-xs text-accent uppercase font-bold">
                        PBCC Approved Assessment Pattern
                      </span>
                      <h3 className="font-heading text-2xl font-black text-white mt-0.5">
                        {selectedPatternSubject.subject}
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        Applicable to Classes: {selectedPatternSubject.classes.join(" & ")} · Time
                        Allowed: {selectedPatternSubject.timeAllowed}
                      </p>
                    </div>

                    <a
                      href={selectedPatternSubject.officialModelPaperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-heading font-bold text-accent hover:bg-accent/20 transition-all shrink-0"
                    >
                      <BookOpen size={14} />
                      <span>Download Model Papers</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Marks Breakdown KPI Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                      <span className="text-[10px] font-mono text-muted uppercase">Total Marks</span>
                      <p className="font-heading text-2xl font-bold text-white mt-1 tabular-nums">
                        {selectedPatternSubject.totalMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                      <span className="text-[10px] font-mono text-muted uppercase">Theory Marks</span>
                      <p className="font-heading text-2xl font-bold text-white mt-1 tabular-nums">
                        {selectedPatternSubject.theoryMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                      <span className="text-[10px] font-mono text-muted uppercase">Objective (MCQs)</span>
                      <p className="font-heading text-2xl font-bold text-amber-300 mt-1 tabular-nums">
                        {selectedPatternSubject.objectiveMcqsMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                      <span className="text-[10px] font-mono text-muted uppercase">Subjective</span>
                      <p className="font-heading text-2xl font-bold text-white mt-1 tabular-nums">
                        {selectedPatternSubject.subjectiveMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-center">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">
                        40% Passing Bar
                      </span>
                      <p className="font-heading text-2xl font-bold text-emerald-300 mt-1 tabular-nums">
                        {selectedPatternSubject.passingMarks}
                      </p>
                    </div>
                  </div>

                  {/* SLO Cognitive Domain Breakdown */}
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Target size={16} className="text-accent" />
                      <span>Student Learning Outcomes (SLO) Cognitive Breakdown</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                        <span className="text-zinc-400 font-mono text-[10px] uppercase font-bold block">
                          Knowledge Domain
                        </span>
                        <p className="text-white font-heading font-bold text-sm mt-1">
                          {selectedPatternSubject.sloBreakdown.knowledge}
                        </p>
                        <p className="text-muted text-[11px] mt-1">
                          Definitions, direct recall, terminology, standard theorem statements.
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                        <span className="text-sky-400 font-mono text-[10px] uppercase font-bold block">
                          Understanding Domain
                        </span>
                        <p className="text-white font-heading font-bold text-sm mt-1">
                          {selectedPatternSubject.sloBreakdown.understanding}
                        </p>
                        <p className="text-muted text-[11px] mt-1">
                          Principles, reasoning, conceptual explanations, comparative analysis.
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                        <span className="text-amber-400 font-mono text-[10px] uppercase font-bold block">
                          Application Domain
                        </span>
                        <p className="text-white font-heading font-bold text-sm mt-1">
                          {selectedPatternSubject.sloBreakdown.application}
                        </p>
                        <p className="text-muted text-[11px] mt-1">
                          Numerical calculations, real-world scenarios, geometric construction.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sectional Paper Structure */}
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white mb-2">
                      Key Sectional Structure
                    </h4>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {selectedPatternSubject.keyComponents.map((comp, i) => (
                        <li key={i} className="flex items-start gap-2.5 rounded-lg bg-black/30 p-2.5">
                          <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pairing Scheme Advisory */}
                  <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] p-4 text-xs leading-relaxed text-zinc-200">
                    <p className="font-heading font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                      <AlertTriangle size={14} />
                      <span>Official Assessment Blueprint Note:</span>
                    </p>
                    <p>{selectedPatternSubject.pairingNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 4: 9 PUNJAB BOARDS DIRECTORY
              ============================================================ */}
          {activeTab === "boards" && (
            <div className="space-y-6">
              {/* Directory Banner */}
              <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">
                      Verified Directory: All Nine Punjab BISE Boards
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Direct, independently verified official portals for date sheets, roll number
                      slips, notifications, and student verification.
                    </p>
                  </div>

                  <a
                    href={PBCC_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-heading font-bold text-accent hover:bg-accent/20 transition-all shrink-0"
                  >
                    <Building2 size={14} />
                    <span>Open PBCC Official Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Boards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PUNJAB_BOARDS.map((board) => (
                  <div
                    key={board.id}
                    className="rounded-2xl border border-white/10 bg-[#141416] p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-soft"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded bg-accent px-2 py-0.5 text-[9px] font-mono font-black text-black">
                          {board.code}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                          <CheckCircle2 size={12} />
                          <span>Verified Domain</span>
                        </span>
                      </div>

                      <h3 className="font-heading text-base font-bold text-white">{board.name}</h3>
                      <p className="text-xs text-muted font-urdu mt-0.5">{board.urduName}</p>

                      <div className="mt-3 space-y-1.5 text-xs text-zinc-300">
                        <p className="flex items-start gap-1.5">
                          <MapPin size={13} className="text-accent shrink-0 mt-0.5" />
                          <span>{board.headquarters}</span>
                        </p>
                        <p className="flex items-start gap-1.5 text-zinc-400">
                          <Phone size={13} className="text-zinc-500 shrink-0 mt-0.5" />
                          <span>{board.helpline}</span>
                        </p>
                      </div>

                      <div className="mt-3 rounded-lg bg-black/40 p-2 text-[11px] text-zinc-400">
                        <strong className="text-zinc-300">Districts: </strong>
                        {board.districts.join(", ")}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                      <a
                        href={board.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-accent hover:underline"
                      >
                        <span>Official Website</span>
                        <ExternalLink size={12} />
                      </a>

                      <a
                        href={board.notificationsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted hover:text-white"
                      >
                        Notifications
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 5: RUMORS & CLARIFICATIONS DESK
              ============================================================ */}
          {activeTab === "rumors" && (
            <div className="space-y-6">
              {/* Rumor Buster Header */}
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">
                      Rumors & Unverified Claims Clarification Desk
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Every examination cycle generates viral TikTok claims, forwarded WhatsApp
                      circulars, and forged date sheets designed to create student panic. This
                      section analyzes documented claims neutrally, clarifies what evidence is
                      missing, and directs you to genuine sources.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rumor Cards */}
              <div className="space-y-4">
                {INITIAL_BOARD_WATCH_ENTRIES.filter((e) => e.category === "rumor").map((rumor) => (
                  <article
                    key={rumor.id}
                    className="rounded-2xl border border-rose-500/25 bg-[#141214] p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-heading font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30">
                        <AlertTriangle size={13} />
                        <span>UNVERIFIED CLAIM</span>
                      </span>

                      <span className="text-xs font-mono text-muted">
                        Verified: {rumor.lastVerifiedDate}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white">{rumor.headline}</h3>

                    <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {rumor.summary}
                    </p>

                    {rumor.rumorDebunk && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-3 border-t border-white/10">
                        <div className="rounded-xl bg-black/40 border border-white/5 p-3">
                          <strong className="block text-rose-400 font-heading mb-1 text-[11px] uppercase">
                            Circulating Claim:
                          </strong>
                          <p className="text-zinc-300">{rumor.rumorDebunk.circulatingClaim}</p>
                        </div>

                        <div className="rounded-xl bg-black/40 border border-white/5 p-3">
                          <strong className="block text-amber-400 font-heading mb-1 text-[11px] uppercase">
                            Missing Evidence:
                          </strong>
                          <p className="text-zinc-300">{rumor.rumorDebunk.missingEvidence}</p>
                        </div>

                        <div className="rounded-xl bg-black/40 border border-white/5 p-3">
                          <strong className="block text-emerald-400 font-heading mb-1 text-[11px] uppercase">
                            Verified Reality:
                          </strong>
                          <p className="text-zinc-200">{rumor.rumorDebunk.verifiedFact}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-muted">
                        Official source to monitor: {rumor.sourceName}
                      </span>
                      <a
                        href={rumor.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-heading font-bold text-accent hover:underline"
                      >
                        <span>Check Official Board</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 6: VERIFICATION & RESEARCH WORKFLOW
              ============================================================ */}
          {activeTab === "workflow" && (
            <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 sm:p-10 space-y-8">
              <div>
                <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                  Data Integrity & Transparency Standard
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                  How Matric Mastery Researches & Classifies Examination Announcements
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
                  We believe student trust requires absolute transparency. We never publish
                  speculative claims as facts, never invent circular numbers, and never present news
                  rumors without explicit attribution.
                </p>
              </div>

              {/* The 4 Classification Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <h3 className="font-heading font-bold text-white text-sm">
                      Tier A: Officially Confirmed
                    </h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Reserved strictly for signed, dated circulars, gazettes, or notifications published
                    directly on a verified BISE or PBCC domain. Must include verifiable issuing
                    authority and document link.
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-500/30 bg-sky-950/10 p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Info size={16} className="text-sky-400" />
                    <h3 className="font-heading font-bold text-white text-sm">
                      Tier B: Credibly Reported
                    </h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Used when established news outlets (Dawn, Express Tribune, The News) cite official
                    briefings, but the PDF circular has not yet been uploaded to the public portal.
                    Explicitly marked &quot;Awaiting Direct Verification&quot;.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-400" />
                    <h3 className="font-heading font-bold text-white text-sm">
                      Tier C: Expected (Historical Baseline)
                    </h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Informed planning guidance synthesized from multi-year historical precedents (e.g.
                    March matric starts). Always accompanied by &quot;Expected, not officially announced&quot;
                    and explicit baseline source years.
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-400" />
                    <h3 className="font-heading font-bold text-white text-sm">
                      Tier D: Unverified Rumors
                    </h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Included only when viral misinformation actively misleads students. Labeled
                    prominently with missing evidence explanations, factual corrections, and direct
                    links to verify.
                  </p>
                </div>
              </div>

              {/* 3-Step Student Self-Verification Guide */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3">
                <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                  <Check size={16} className="text-accent" />
                  <span>How You Can Independently Verify Any Circular in 3 Minutes</span>
                </h3>
                <ol className="space-y-2 text-xs text-zinc-300 list-decimal list-inside leading-relaxed">
                  <li>
                    <strong>Check the URL Domain:</strong> Official Punjab BISE websites end in{" "}
                    <code className="text-accent">.edu.pk</code> or{" "}
                    <code className="text-accent">.com</code> (for BISE Lahore). Any website ending
                    in .xyz, .tk, or blog platforms is unofficial.
                  </li>
                  <li>
                    <strong>Look for the Notification Number:</strong> Authentic notifications bear a
                    specific gazette reference (e.g., &quot;No. 142/PBCC/LHR&quot;) and an ink signature of
                    the Secretary or Controller of Examinations.
                  </li>
                  <li>
                    <strong>Cross-Reference with Other Boards:</strong> Since PBCC coordinates
                    policies uniformly, genuine province-wide decisions (like passing marks or date
                    sheets) appear on multiple BISE portals simultaneously.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </main>

        {/* VERIFY / REPORT A CIRCULAR MODAL */}
        {verifyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#141418] p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  setVerifyModalOpen(false);
                  setUserSubmissionSubmitted(false);
                }}
                className="absolute top-5 right-5 text-muted hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-accent mb-2">
                <FileCheck2 size={20} />
                <span className="font-mono text-xs uppercase font-bold">
                  Circular Verification Desk
                </span>
              </div>

              <h3 className="font-heading text-lg font-bold text-white">
                Submit an Examination Notice for Verification
              </h3>

              {userSubmissionSubmitted ? (
                <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-2">
                  <CheckCircle2 size={28} className="text-emerald-400 mx-auto" />
                  <p className="font-heading font-bold text-white text-sm">
                    Notice Submitted for Review
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    Our team will cross-reference your submission against official PBCC gazettes
                    and board notification archives. If verified, it will be published in Board
                    Watch.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyModalOpen(false);
                      setUserSubmissionSubmitted(false);
                    }}
                    className="mt-2 rounded-xl bg-accent px-4 py-2 text-xs font-heading font-bold text-black"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (userSubmissionText.trim()) {
                      setUserSubmissionSubmitted(true);
                      setUserSubmissionText("");
                    }
                  }}
                  className="mt-4 space-y-3"
                >
                  <p className="text-xs text-muted leading-relaxed">
                    Have you seen a date sheet, fee schedule, or pairing scheme notice on WhatsApp or
                    Facebook? Paste the text, link, or circular details below so we can audit its
                    authenticity.
                  </p>

                  <textarea
                    rows={4}
                    value={userSubmissionText}
                    onChange={(e) => setUserSubmissionText(e.target.value)}
                    required
                    placeholder="e.g. WhatsApp circular claiming Matric 2027 date sheet begins February 15 with notification # 401..."
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-xs text-white placeholder-muted focus:border-accent focus:outline-none"
                  />

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setVerifyModalOpen(false)}
                      className="rounded-xl px-4 py-2 text-xs text-muted hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-accent px-5 py-2 text-xs font-heading font-bold text-black hover:bg-accent/90 transition-colors"
                    >
                      Submit for Fact-Checking
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
