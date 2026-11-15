"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Share2,
  Calendar,
  Building2,
  BookOpen,
  Info,
  ChevronRight,
  Layers,
  ArrowRight,
  Check,
  RotateCcw,
  Compass,
  FileCheck2,
  HelpCircle as QuestionIcon,
  X,
  Phone,
  MapPin,
  CalendarDays,
  Target,
  FileSignature,
  Sparkles,
} from "lucide-react";
import {
  PUNJAB_BOARDS,
  PBCC_INFO,
  FBISE_PORTAL_INFO,
  EXPECTED_TIMELINE_2027,
  INITIAL_BOARD_WATCH_ENTRIES,
  SUBJECT_PATTERNS,
  BOARD_WATCH_TOPIC_FILTERS,
  BoardWatchEntry,
  BoardWatchCategory,
  BoardWatchTopic,
  BoardId,
  ExamClass,
} from "@/lib/boardWatchData";

export default function BoardWatchPage() {
  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState<
    "stream" | "timeline" | "patterns" | "boards" | "rumors" | "workflow"
  >("stream");
  const [selectedTopic, setSelectedTopic] = useState<BoardWatchTopic | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<BoardWatchCategory | "all">("all");
  const [selectedBoard, setSelectedBoard] = useState<BoardId>("all");
  const [selectedClass, setSelectedClass] = useState<ExamClass | "all">("all");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Find Your Class and Subject state (Tab 3)
  const [patternClass, setPatternClass] = useState<ExamClass>("9th");
  const [selectedPatternId, setSelectedPatternId] = useState<string>("g9-english");

  // Interactive UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [userSubmissionText, setUserSubmissionText] = useState("");
  const [userSubmissionSubmitted, setUserSubmissionSubmitted] = useState(false);

  const lastCheckedTimestamp = "15 November 2026";

  // Patterns filtered cleanly by selected class (never mixing grades)
  const classFilteredPatterns = useMemo(
    () => SUBJECT_PATTERNS.filter((p) => p.grade === patternClass),
    [patternClass]
  );

  const selectedPatternSubject = useMemo(() => {
    return (
      classFilteredPatterns.find((p) => p.id === selectedPatternId) ??
      classFilteredPatterns[0] ??
      SUBJECT_PATTERNS[0]
    );
  }, [classFilteredPatterns, selectedPatternId]);

  const handlePatternClassChange = (grade: ExamClass) => {
    setPatternClass(grade);
    const firstForClass = SUBJECT_PATTERNS.find((p) => p.grade === grade);
    if (firstForClass) {
      setSelectedPatternId(firstForClass.id);
    }
  };

  // Summary counts calculated directly from verified records
  const summaryCounts = useMemo(() => {
    const entries = INITIAL_BOARD_WATCH_ENTRIES;
    return {
      total: entries.length,
      confirmed: entries.filter((e) => e.category === "confirmed").length,
      awaiting: entries.filter((e) => e.category === "awaiting").length,
      plannedOrReported: entries.filter(
        (e) => e.category === "planned" || e.category === "reported"
      ).length,
      historical: entries.filter((e) => Boolean(e.isHistorical) || e.category === "historical")
        .length,
      rumor: entries.filter((e) => e.category === "rumor").length,
      pattern: SUBJECT_PATTERNS.length,
    };
  }, []);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return INITIAL_BOARD_WATCH_ENTRIES.filter((entry) => {
      if (selectedTopic !== "all" && !entry.topics.includes(selectedTopic)) {
        return false;
      }

      if (selectedCategory !== "all" && entry.category !== selectedCategory) {
        return false;
      }

      if (selectedBoard !== "all") {
        if (selectedBoard === "fbise") {
          if (!entry.affectedBoards.includes("fbise")) return false;
        } else if (
          !entry.affectedBoards.includes("all") &&
          !entry.affectedBoards.includes(selectedBoard)
        ) {
          return false;
        }
      }

      if (selectedClass !== "all" && !entry.affectedClasses.includes(selectedClass)) {
        return false;
      }

      if (selectedSession !== "all") {
        if (selectedSession === "historical") {
          if (!entry.isHistorical) return false;
        } else if (!entry.session.toLowerCase().includes(selectedSession.toLowerCase())) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesHeadline = entry.headline.toLowerCase().includes(query);
        const matchesSummary = entry.summary.toLowerCase().includes(query);
        const matchesAuthority = entry.issuingAuthority.toLowerCase().includes(query);
        const matchesTags = entry.tags.some((t) => t.toLowerCase().includes(query));
        const matchesWhat = entry.whatItMeans.toLowerCase().includes(query);
        const matchesEvidence = entry.evidenceNotes.toLowerCase().includes(query);
        const matchesFacts = entry.keyFacts?.some((f) => f.toLowerCase().includes(query)) ?? false;
        const matchesLimitation = entry.limitationNote?.toLowerCase().includes(query) ?? false;
        if (
          !matchesHeadline &&
          !matchesSummary &&
          !matchesAuthority &&
          !matchesTags &&
          !matchesWhat &&
          !matchesEvidence &&
          !matchesFacts &&
          !matchesLimitation
        ) {
          return false;
        }
      }

      return true;
    });
  }, [selectedTopic, selectedCategory, selectedBoard, selectedClass, selectedSession, searchQuery]);

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
    setSelectedTopic("all");
    setSelectedCategory("all");
    setSelectedBoard("all");
    setSelectedClass("all");
    setSelectedSession("all");
    setSearchQuery("");
  };

  // Consistent 6-status badge styling
  const getCategoryBadge = (entry: BoardWatchEntry) => {
    switch (entry.statusDisplayLabel) {
      case "CONFIRMED":
        return {
          label: "CONFIRMED",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          icon: <CheckCircle2 size={13} className="text-emerald-400" />,
        };
      case "REPORTED":
        return {
          label: "REPORTED",
          color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
          icon: <Info size={13} className="text-sky-400" />,
        };
      case "AWAITING OFFICIAL CONFIRMATION":
        return {
          label: "AWAITING OFFICIAL CONFIRMATION",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          icon: <Clock size={13} className="text-amber-400" />,
        };
      case "PLANNED / APPROVED INITIATIVE":
        return {
          label: "PLANNED / APPROVED INITIATIVE",
          color: "text-purple-300 bg-purple-500/10 border-purple-500/30",
          icon: <Sparkles size={13} className="text-purple-400" />,
        };
      case "HISTORICAL":
        return {
          label: "HISTORICAL",
          color: "text-zinc-300 bg-zinc-800/80 border-zinc-600/60",
          icon: <Clock size={13} className="text-zinc-400" />,
        };
      case "UNVERIFIED":
        return {
          label: "UNVERIFIED",
          color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
          icon: <AlertTriangle size={13} className="text-rose-400" />,
        };
      default:
        return {
          label: entry.statusDisplayLabel || "NOTICE",
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
                name: "When do Punjab Board Annual 2027 Matric examinations start?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Under PBCC notification dated 10 November 2026, SSC Part-II (Class 10) First Annual Examination 2027 starts on 16 March 2027 with results scheduled for 20 July 2027. A confirmed Class 9 (SSC Part-I) 2027 exam start date is still awaited.",
                },
              },
              {
                "@type": "Question",
                name: "What are the passing marks and grading rules for 2027 board exams?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Under IBCC's phased grading policy, minimum subject passing marks are 40% (replacing 33%) alongside a 10-point grading system (A++ to U). Phase 1 applied to Grades 9 & 11 in Annual 2026; Phase 2 expands to Grades 10 & 12 in Annual 2027, with full adoption planned by 2028.",
                },
              },
              {
                "@type": "Question",
                name: "Did PECTAA release 2027 paper patterns, pairing schemes, and Smart Syllabus / ALP?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. PECTAA issued Grade 9 (No. 1238 & 1255), Grade 10 (No. 1257), Grade 11 (No. 1239 & 1256 for Masihi Taleem), and Grade 12 (No. 1258) ALP documents with subject-specific pairing schemes, deleted topics, and model papers. No Smart Syllabus / ALP exists for Tarjama-tul-Quran or Ethics.",
                },
              },
              {
                "@type": "Question",
                name: "Where can students verify official BISE and FBISE notifications?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Verify Punjab notices on your own BISE portal (biselahore.com, bisegrw.edu.pk, bisefsd.edu.pk, biserawalpindi.edu.pk, web.bisemultan.edu.pk, bisesargodha.edu.pk, bisebwp.edu.pk, bisedgkhan.edu.pk, bisesahiwal.edu.pk) and Federal Board notices strictly on fbise.edu.pk.",
                },
              },
            ],
          }),
        }}
      />

      <div className="relative min-h-screen bg-[#0A0A0A] text-white">
        {/* MANDATORY INDEPENDENT PLATFORM DISCLAIMER BAR */}
        <section
          aria-label="Independent Platform Legal Disclaimer"
          className="border-b border-white/10 bg-[#121214] px-4 py-3"
        >
          <div className="mx-auto flex max-w-site items-start gap-3 text-[11px] sm:text-xs leading-relaxed text-zinc-300">
            <ShieldAlert size={16} className="text-accent shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-white font-heading font-bold">
                Independent Student Resource:{" "}
              </strong>
              <span>
                Matric Mastery is an independent student information centre and is not affiliated with
                or operated by any BISE, PBCC, PECTAA, IBCC, or FBISE authority. Always verify
                admissions, date sheets, and exam rules directly on your own official board portal.
              </span>
            </div>
          </div>
        </section>

        {/* HERO HEADER */}
        <header className="border-b border-white/10 pt-10 pb-8 px-4 sm:px-6">
          <div className="mx-auto max-w-site">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-2 font-mono">
                  <span className="text-accent font-bold">BOARD WATCH 2026–2027</span>
                  <span aria-hidden="true">·</span>
                  <span>Punjab BISE, PECTAA, IBCC &amp; FBISE Updates</span>
                  <span aria-hidden="true">·</span>
                  <span>Classes 9, 10, 11 &amp; 12</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-400">Research cutoff: {lastCheckedTimestamp}</span>
                </div>

                <h1 className="type-title text-white tracking-tight">
                  Board Watch —{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-yellow-200">
                    2026–2027 Hub
                  </span>
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-muted max-w-3xl leading-relaxed">
                  Verified examination schedules, 2027 PECTAA paper patterns and pairing schemes,
                  IBCC 40% passing &amp; 10-point grading policy, admission portals, board reforms,
                  and FBISE updates for Class 9–12 students.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("patterns")}
                  className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-heading font-bold text-accent hover:bg-accent/20 transition-all cursor-pointer"
                >
                  <BookOpen size={14} />
                  <span>Find Your Class &amp; Subject</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("boards")}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-heading font-medium text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <Building2 size={14} className="text-muted" />
                  <span>Board Portals</span>
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

            {/* SUMMARY STATS STRIP */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#141416] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-muted uppercase">Verified Updates</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-white tabular-nums">
                    {summaryCounts.total}
                  </span>
                  <span className="text-[10px] text-zinc-400">stories</span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-emerald-400 uppercase">Confirmed</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-emerald-300 tabular-nums">
                    {summaryCounts.confirmed}
                  </span>
                  <span className="text-[10px] text-emerald-400/80">verified</span>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-amber-400 uppercase">Awaiting Date</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-amber-300 tabular-nums">
                    {summaryCounts.awaiting}
                  </span>
                  <span className="text-[10px] text-amber-400/80">pending</span>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-purple-300 uppercase">Reforms / Reported</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-purple-200 tabular-nums">
                    {summaryCounts.plannedOrReported}
                  </span>
                  <span className="text-[10px] text-purple-300/80">initiatives</span>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-500/25 bg-zinc-500/[0.06] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-zinc-300 uppercase">Historical 2026</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-zinc-200 tabular-nums">
                    {summaryCounts.historical}
                  </span>
                  <span className="text-[10px] text-zinc-400">past cycle</span>
                </div>
              </div>

              <div className="rounded-2xl border border-accent/25 bg-accent/[0.05] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-accent uppercase">Subject Blueprints</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-black text-accent tabular-nums">
                    {summaryCounts.pattern}
                  </span>
                  <span className="text-[10px] text-amber-200/80">grades 9–12</span>
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
                <span>All Updates &amp; News ({filteredEntries.length})</span>
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
                <span>Find Your Class &amp; Subject ({SUBJECT_PATTERNS.length})</span>
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
                <span>2027 Milestones ({EXPECTED_TIMELINE_2027.length})</span>
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
                <span>Punjab BISE &amp; FBISE Portals</span>
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
                <span>Clarifications ({summaryCounts.rumor})</span>
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
                <span>Verification Standards</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="mx-auto max-w-site px-4 sm:px-6 py-8">
          {/* ============================================================
              TAB 1: UPDATES & NEWS STREAM
              ============================================================ */}
          {activeTab === "stream" && (
            <div className="space-y-6">
              {/* TOPIC CATEGORY BAR */}
              <div className="flex flex-wrap items-center gap-2">
                {BOARD_WATCH_TOPIC_FILTERS.map((topic) => {
                  const isActive = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-heading font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-accent text-black font-bold"
                          : "border border-white/10 bg-[#141416] text-zinc-300 hover:text-white hover:border-white/25"
                      }`}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>

              {/* FILTERING & SEARCH CONTROLS BAR */}
              <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 16 March 2027, PECTAA No. 1257, 40% passing marks, IBCC, BISE Multan, FBISE..."
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

                  {(selectedTopic !== "all" ||
                    selectedCategory !== "all" ||
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

                {/* Dropdown Filters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-muted mb-1 uppercase">
                      Verification Status
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value as BoardWatchCategory | "all")
                      }
                      className="w-full rounded-lg border border-white/15 bg-[#18181c] px-2.5 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="awaiting">AWAITING OFFICIAL CONFIRMATION</option>
                      <option value="planned">PLANNED / APPROVED INITIATIVE</option>
                      <option value="reported">REPORTED</option>
                      <option value="historical">HISTORICAL (2026)</option>
                      <option value="rumor">UNVERIFIED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-muted mb-1 uppercase">
                      Board / Jurisdiction
                    </label>
                    <select
                      value={selectedBoard}
                      onChange={(e) => setSelectedBoard(e.target.value as BoardId)}
                      className="w-full rounded-lg border border-white/15 bg-[#18181c] px-2.5 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                    >
                      <option value="all">All Punjab Boards + Federal</option>
                      {PUNJAB_BOARDS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.shortName}
                        </option>
                      ))}
                      <option value="fbise">FBISE (Federal Board Only)</option>
                    </select>
                  </div>

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

                  <div>
                    <label className="block text-[10px] font-mono text-muted mb-1 uppercase">
                      Session Window
                    </label>
                    <select
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-[#18181c] px-2.5 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                    >
                      <option value="all">All Sessions</option>
                      <option value="2027">2026–27 &amp; Annual 2027</option>
                      <option value="historical">Historical 2026 Cycles</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Showing {filteredEntries.length} verified stories</span>
                  {selectedTopic !== "all" && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-accent font-semibold">
                        {BOARD_WATCH_TOPIC_FILTERS.find((t) => t.id === selectedTopic)?.label}
                      </span>
                    </>
                  )}
                  {selectedClass !== "all" && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-white">Class {selectedClass}</span>
                    </>
                  )}
                </div>
              </div>

              {/* LIST OF UPDATE CARDS */}
              {filteredEntries.length > 0 ? (
                <div className="space-y-8">
                  {[
                    {
                      sectionKey: "current",
                      heading: "Current 2026–2027 Examination Updates, Policies & Syllabi",
                      subheading:
                        "Verified schedules, PECTAA ALP & pairing schemes, IBCC 40% passing & grading rules, admissions, reforms, and FBISE notices as of 15 November 2026.",
                      items: filteredEntries.filter((e) => !e.isHistorical),
                    },
                    {
                      sectionKey: "historical",
                      heading: "Historical 2026 Examination Records (Completed / Commenced)",
                      subheading:
                        "Past 2026 Intermediate cycles retained solely so students never mistake May/Nov 2026 schedules for 2027 dates.",
                      items: filteredEntries.filter((e) => Boolean(e.isHistorical)),
                    },
                  ]
                    .filter((group) => group.items.length > 0)
                    .map((group) => (
                      <section key={group.sectionKey} className="space-y-4">
                        <div
                          className={`rounded-xl border px-4 py-3 ${
                            group.sectionKey === "historical"
                              ? "border-zinc-700/60 bg-zinc-900/60"
                              : "border-accent/25 bg-accent/[0.04]"
                          }`}
                        >
                          <h2
                            className={`font-heading text-sm sm:text-base font-bold ${
                              group.sectionKey === "historical" ? "text-zinc-200" : "text-accent"
                            }`}
                          >
                            {group.heading}
                          </h2>
                          <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                            {group.subheading}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {group.items.map((entry) => {
                            const badge = getCategoryBadge(entry);
                            const isExpanded = expandedEntryId === entry.id;

                            return (
                              <article
                                key={entry.id}
                                id={entry.id}
                                className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-soft ${
                                  entry.isHistorical
                                    ? "border-zinc-700/60 bg-[#101013] hover:border-zinc-600/80"
                                    : "border-white/10 bg-[#141416] hover:border-white/20"
                                }`}
                              >
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

                                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono">
                                    {entry.originalDate && (
                                      <>
                                        <span>Date: {entry.originalDate}</span>
                                        <span aria-hidden="true">·</span>
                                      </>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleCopyLink(entry.id)}
                                      className="text-muted hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
                                      title="Copy permalink"
                                    >
                                      {copiedId === entry.id ? (
                                        <span className="text-emerald-400 font-bold">Copied!</span>
                                      ) : (
                                        <>
                                          <Share2 size={13} />
                                          <span>Share</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                                  {entry.headline}
                                </h3>

                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-400">
                                  <span className="text-zinc-300">
                                    Classes: {entry.affectedClasses.join(", ")}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>Scope: {entry.affectedBoardNames.join(", ")}</span>
                                </div>

                                <p className="mt-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                                  {entry.summary}
                                </p>

                                {entry.keyFacts && entry.keyFacts.length > 0 && (
                                  <ul className="mt-4 space-y-1.5 rounded-xl border border-white/10 bg-black/35 p-3.5 text-xs text-zinc-200">
                                    {entry.keyFacts.map((fact, idx) => (
                                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                        <Check size={14} className="text-accent shrink-0 mt-0.5" />
                                        <span>{fact}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {entry.limitationNote && (
                                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3.5 text-xs leading-relaxed text-amber-200 flex items-start gap-2.5">
                                    <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                    <p>{entry.limitationNote}</p>
                                  </div>
                                )}

                                {entry.whatItMeans && (
                                  <div className="mt-4 rounded-xl border border-accent/25 bg-accent/[0.04] p-3.5 text-xs leading-relaxed text-zinc-200">
                                    <p className="font-heading font-bold text-accent text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                      <Target size={13} />
                                      <span>Student Takeaway:</span>
                                    </p>
                                    <p>{entry.whatItMeans}</p>
                                  </div>
                                )}

                                <div className="mt-4">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedEntryId(isExpanded ? null : entry.id)
                                    }
                                    className="text-xs font-mono text-muted hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <span>
                                      {isExpanded ? "Hide verification details" : "View verification details"}
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
                                      <p>
                                        <strong className="text-white">Evidence Notes:</strong>{" "}
                                        {entry.evidenceNotes}
                                      </p>
                                      <p>
                                        <strong className="text-white">Last Verified:</strong>{" "}
                                        {entry.lastVerifiedDate}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-xs">
                                  <div className="flex flex-wrap items-center justify-between gap-2 text-muted">
                                    <span className="text-zinc-400 font-medium">
                                      Authority: {entry.issuingAuthority}
                                    </span>
                                    <span className="font-mono text-[11px] text-zinc-500">
                                      Verified {entry.lastVerifiedDate}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {entry.sources.map((src) => (
                                      <a
                                        key={src.url}
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-heading font-semibold transition-colors ${
                                          src.sourceKind === "official"
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                            : src.sourceKind === "reproduced-copy"
                                              ? "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                                              : "border-white/15 bg-white/5 text-accent hover:bg-white/10"
                                        }`}
                                      >
                                        <span>{src.label}</span>
                                        <ExternalLink size={11} />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#141416] p-12 text-center">
                  <QuestionIcon size={32} className="mx-auto text-muted mb-3" />
                  <h3 className="font-heading text-base font-bold text-white">
                    No updates match your active filters
                  </h3>
                  <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                    Clear your search text or switch back to &quot;Latest Updates&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-4 rounded-xl bg-accent px-4 py-2 text-xs font-heading font-bold text-black cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 2: EXPECTED / CONFIRMED 2027 MILESTONES
              ============================================================ */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.05] p-5">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">
                      2027 Examination Schedule &amp; Milestones (As of 15 November 2026)
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Confirmed PBCC Class 10 Matric 2027 dates (16 March 2027 exam start, 20 July
                      2027 result, 10 Nov–11 Jan registration) paired transparently with milestones
                      still awaiting confirmation (Class 9 start date and 2027 Intermediate schedule).
                    </p>
                    <div className="mt-3">
                      <Link
                        href="/utilities?tab=calendar"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                      >
                        <CalendarDays size={13} />
                        <span>Open Live Countdown &amp; Study Calendar Tool</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative border-l-2 border-white/15 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
                {EXPECTED_TIMELINE_2027.map((stage, idx) => (
                  <div key={stage.id} className="relative group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#18181c] border-2 border-accent text-accent font-mono text-[10px] font-bold">
                      {idx + 1}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6 transition-all hover:border-white/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                        <div>
                          <span className="font-mono text-[11px] font-bold text-accent uppercase">
                            Stage {idx + 1} · {stage.targetGroup}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                            {stage.phase}
                          </h3>
                        </div>

                        <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs text-amber-300 shrink-0">
                          {stage.expectedWindow}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {stage.description}
                      </p>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-3 border-t border-white/10">
                        <div className="rounded-xl bg-black/40 border border-white/5 p-3">
                          <strong className="block text-accent font-heading mb-1 text-[11px] uppercase">
                            Student Action:
                          </strong>
                          <p className="text-zinc-300">{stage.studentAction}</p>
                        </div>

                        <div className="rounded-xl bg-black/40 border border-white/5 p-3">
                          <strong className="block text-zinc-400 font-heading mb-1 text-[11px] uppercase">
                            Verification Basis &amp; Source:
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
              TAB 3: FIND YOUR CLASS & SUBJECT (PECTAA ALP 2026-27 SPECS)
              ============================================================ */}
          {activeTab === "patterns" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/15 p-5">
                <div className="flex items-start gap-3">
                  <FileSignature size={20} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">
                      Find Your Class &amp; Subject — Official 2027 PECTAA Patterns &amp; ALP
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Extracted subject-by-subject from official November 2026 PECTAA PDFs
                      (No. 1238, 1255, 1257, 1239, 1256, 1258). Marks, timings, choices, and
                      excluded chapters apply strictly to each individual subject—never across an
                      entire grade.{" "}
                      <strong className="text-amber-300">
                        Note: PECTAA has NOT notified any Smart Syllabus / ALP for Tarjama-tul-Quran
                        or Ethics (Grades 9–12); prepare the complete syllabus for those two
                        subjects.
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 1: Class Switcher */}
              <div className="space-y-2">
                <span className="block text-[11px] font-mono text-muted uppercase">
                  Step 1 — Select Your Class
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { id: "9th", label: "Class 9 (SSC-I)", sub: "No. 1238 & 1255" },
                      { id: "10th", label: "Class 10 (SSC-II)", sub: "No. 1257" },
                      { id: "11th", label: "Class 11 (HSSC-I)", sub: "No. 1239 & 1256" },
                      { id: "12th", label: "Class 12 (HSSC-II)", sub: "No. 1258" },
                    ] as { id: ExamClass; label: string; sub: string }[]
                  ).map((cls) => {
                    const active = patternClass === cls.id;
                    return (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => handlePatternClassChange(cls.id)}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          active
                            ? "border-accent bg-accent text-black font-bold"
                            : "border-white/10 bg-[#141416] text-white hover:border-white/25"
                        }`}
                      >
                        <div className="font-heading text-xs sm:text-sm font-bold">{cls.label}</div>
                        <div
                          className={`font-mono text-[10px] mt-0.5 ${
                            active ? "text-black/75" : "text-zinc-400"
                          }`}
                        >
                          {cls.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Subject Selector for Chosen Class */}
              <div className="space-y-2">
                <span className="block text-[11px] font-mono text-muted uppercase">
                  Step 2 — Select Subject ({classFilteredPatterns.length} available for Class{" "}
                  {patternClass})
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {classFilteredPatterns.map((p) => {
                    const isSelected = selectedPatternSubject?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPatternId(p.id)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? "bg-accent text-black font-black shadow-glow"
                            : "border border-white/10 bg-[#141416] text-zinc-300 hover:text-white hover:border-white/25"
                        }`}
                      >
                        {p.subject}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Subject Blueprint Card */}
              {selectedPatternSubject && (
                <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <span className="font-mono text-xs text-accent uppercase font-bold">
                        {selectedPatternSubject.notificationRef}
                      </span>
                      <h3 className="font-heading text-2xl font-black text-white mt-0.5">
                        {selectedPatternSubject.subject} (Class {selectedPatternSubject.grade})
                      </h3>
                      <p className="text-xs text-zinc-300 mt-1">
                        Total Duration:{" "}
                        <strong className="text-white">{selectedPatternSubject.totalDuration}</strong>{" "}
                        · Objective: {selectedPatternSubject.objectiveDuration} · Subjective:{" "}
                        {selectedPatternSubject.subjectiveDuration}
                      </p>
                    </div>

                    <a
                      href={selectedPatternSubject.officialModelPaperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-heading font-bold text-accent hover:bg-accent/20 transition-all shrink-0"
                    >
                      <BookOpen size={14} />
                      <span>Official PECTAA PDF &amp; Model Paper</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Marks KPI Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                      <span className="text-[10px] font-mono text-muted uppercase">
                        Total Theory Marks
                      </span>
                      <p className="font-heading text-2xl font-bold text-white mt-1 tabular-nums">
                        {selectedPatternSubject.totalTheoryMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                      <span className="text-[10px] font-mono text-muted uppercase">
                        Objective Marks
                      </span>
                      <p className="font-heading text-2xl font-bold text-amber-300 mt-1 tabular-nums">
                        {selectedPatternSubject.objectiveMarks}
                      </p>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        {selectedPatternSubject.mcqCount}
                      </span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                      <span className="text-[10px] font-mono text-muted uppercase">
                        Subjective Marks
                      </span>
                      <p className="font-heading text-2xl font-bold text-white mt-1 tabular-nums">
                        {selectedPatternSubject.subjectiveMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                      <span className="text-[10px] font-mono text-muted uppercase">
                        Practical Component
                      </span>
                      <p className="text-xs font-heading font-semibold text-zinc-200 mt-2 leading-snug">
                        {selectedPatternSubject.practicalMarks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-center">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">
                        40% Passing Policy
                      </span>
                      <p className="text-xs font-heading font-bold text-emerald-300 mt-2 leading-snug">
                        {selectedPatternSubject.passingRequirement}
                      </p>
                    </div>
                  </div>

                  {/* Question-Wise Distribution & Attempt Rules */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-4 space-y-2.5">
                      <h4 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                        <Target size={15} className="text-accent" />
                        <span>Question-Wise Marks Distribution</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-zinc-300">
                        {selectedPatternSubject.questionDistribution.map((qd, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                            <span>{qd}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 border-t border-white/10 text-xs space-y-1 text-zinc-300">
                        <p>
                          <strong className="text-white">Attempt Rules:</strong>{" "}
                          {selectedPatternSubject.attemptRules}
                        </p>
                        <p>
                          <strong className="text-white">Internal Choices:</strong>{" "}
                          {selectedPatternSubject.internalChoices}
                        </p>
                      </div>
                    </div>

                    {/* Pairing Scheme & Deleted Content */}
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-black/35 p-4 space-y-2">
                        <h4 className="font-heading text-sm font-bold text-white">
                          2027 Pairing Scheme Highlights
                        </h4>
                        <ul className="space-y-1.5 text-xs text-zinc-300">
                          {selectedPatternSubject.pairingScheme.map((ps, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                              <span>{ps}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-rose-500/25 bg-rose-950/10 p-4 space-y-1.5 text-xs">
                        <h4 className="font-heading font-bold text-rose-300">
                          Deleted Chapters, Topics &amp; Practicals (ALP 2026–27)
                        </h4>
                        <p className="text-zinc-200 leading-relaxed">
                          {selectedPatternSubject.deletedContent}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Model Paper & Paper Setter Instructions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5">
                      <strong className="block text-emerald-300 font-heading mb-1">
                        Model Paper Availability
                      </strong>
                      <p className="text-zinc-300">{selectedPatternSubject.modelPaperAvailable}</p>
                    </div>

                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-3.5">
                      <strong className="block text-amber-300 font-heading mb-1">
                        Instructions for Paper Setters
                      </strong>
                      <p className="text-zinc-300">
                        {selectedPatternSubject.paperSetterInstructions}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 4: PUNJAB BOARDS DIRECTORY & FBISE PORTAL
              ============================================================ */}
          {activeTab === "boards" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">
                      Verified Directory: All Nine Punjab BISEs &amp; PBCC
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Direct official links for Punjab board admissions, notifications, date sheets,
                      and roll number slips. Check your own district board directly.
                    </p>
                  </div>

                  <a
                    href={PBCC_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-heading font-bold text-accent hover:bg-accent/20 transition-all shrink-0"
                  >
                    <Building2 size={14} />
                    <span>Open PBCC Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

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
                          <span>Verified Board Domain</span>
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

                      {board.portalObservation && (
                        <div className="mt-2.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.05] p-2.5 text-[11px] text-amber-200 leading-relaxed">
                          {board.portalObservation}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={board.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-accent hover:underline"
                      >
                        <span>Website</span>
                        <ExternalLink size={12} />
                      </a>

                      <a
                        href={board.admissionPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-300 hover:text-white inline-flex items-center gap-1"
                      >
                        <span>Admissions / Notices</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Separate Federal Board (FBISE) Reference Card */}
              <div className="rounded-2xl border border-sky-500/30 bg-sky-950/15 p-5 sm:p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-sky-400 uppercase">
                      Federal Board Only — Separate from Punjab BISEs
                    </span>
                    <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                      {FBISE_PORTAL_INFO.name}
                    </h3>
                  </div>

                  <a
                    href={FBISE_PORTAL_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/10 px-3.5 py-2 text-xs font-heading font-bold text-sky-300 hover:bg-sky-500/20"
                  >
                    <span>Open fbise.edu.pk</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {FBISE_PORTAL_INFO.scopeNote}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={FBISE_PORTAL_INFO.modelPapersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white hover:border-sky-400/50"
                  >
                    <span>FBISE SLO Model Papers</span>
                    <ExternalLink size={11} />
                  </a>
                  <a
                    href={FBISE_PORTAL_INFO.eSheetsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white hover:border-sky-400/50"
                  >
                    <span>FBISE 2027 Sample E-Sheets &amp; OMR</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 5: CLARIFICATIONS & UNCONFIRMED ITEMS SUMMARY
              ============================================================ */}
          {activeTab === "rumors" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">
                      Clarifications &amp; Unconfirmed Items Watch (15 November 2026)
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      All stale rumour cards from past cycles have been removed. Below are the exact
                      key distinctions students must keep clear so viral social media posts do not
                      mislead exam preparation:
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl border border-amber-500/25 bg-[#141416] p-5 space-y-2">
                  <span className="inline-block font-mono text-[10px] font-bold text-amber-300 uppercase">
                    Awaiting Confirmation · Class 9 (SSC-I)
                  </span>
                  <h3 className="font-heading text-base font-bold text-white">
                    16 March 2027 Applies to Class 10 — NOT Confirmed for Class 9
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    PBCC&apos;s 10 Nov 2026 announcement confirms Class 10 starts 16 March 2027. Do
                    not rely on unverified viral claims stating Class 9 starts on 16 March 2027;
                    await official PBCC / BISE SSC Part-I notification.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/25 bg-[#141416] p-5 space-y-2">
                  <span className="inline-block font-mono text-[10px] font-bold text-amber-300 uppercase">
                    Awaiting Confirmation · Intermediate 2027
                  </span>
                  <h3 className="font-heading text-base font-bold text-white">
                    20 May Was the Historical 2026 Inter Date — 2027 Dates Are Still Awaited
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Neither 2027 Intermediate exam commencement dates nor 2027 HSSC exam admission
                    fee dates have been notified yet as of 15 November 2026.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/25 bg-[#141416] p-5 space-y-2">
                  <span className="inline-block font-mono text-[10px] font-bold text-emerald-300 uppercase">
                    Syllabus Clarification · PECTAA ALP
                  </span>
                  <h3 className="font-heading text-base font-bold text-white">
                    Tarjama-tul-Quran &amp; Ethics Have NO Smart Syllabus / ALP
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Missing ALP entries for Tarjama-tul-Quran and Ethics do NOT mean those papers
                    are removed. PECTAA explicitly clarified no Smart Syllabus was notified for
                    Grades 9–12 in those subjects—prepare full books. Also do not confuse Grade 11
                    notice No. 1256 (Masihi Taleem only) with main Grade 11 notice No. 1239.
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-500/25 bg-[#141416] p-5 space-y-2">
                  <span className="inline-block font-mono text-[10px] font-bold text-sky-300 uppercase">
                    Passing Marks &amp; E-Marking Clarification
                  </span>
                  <h3 className="font-heading text-base font-bold text-white">
                    33% No Longer Applies; E-Marking Is Not Uniform Across All Punjab Subjects
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Annual 2027 exams require 40% per subject under IBCC&apos;s phased policy.
                    Meanwhile, IBCC Forum discussions endorsing e-marking do not mean every Punjab
                    BISE paper is already graded digitally—follow your own board&apos;s OSM notices
                    (like BISE Lahore Computer Science).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 6: VERIFICATION & CLASSIFICATION STANDARDS
              ============================================================ */}
          {activeTab === "workflow" && (
            <div className="rounded-3xl border border-white/10 bg-[#141416] p-6 sm:p-10 space-y-8">
              <div>
                <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                  Editorial Verification Standard
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                  How Board Watch Classifies Updates (Cutoff: 15 November 2026)
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
                  Every update is assigned one of six transparent verification labels based directly
                  on whether primary PDFs, board portals, or corroborated press reports establish it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-2">
                  <h3 className="font-heading font-bold text-emerald-300 text-sm">1. CONFIRMED</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Directly backed by official PECTAA/BISE/IBCC/FBISE documents or multiple
                    corroborated reports citing a dated official circular (e.g., PBCC 10 Nov 2026).
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-500/30 bg-sky-950/10 p-5 space-y-2">
                  <h3 className="font-heading font-bold text-sky-300 text-sm">2. REPORTED</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Reported in credible national media regarding official board forums without a
                    signed province-wide circular yet issued.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-2">
                  <h3 className="font-heading font-bold text-amber-300 text-sm">
                    3. AWAITING OFFICIAL CONFIRMATION
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Schedules not yet established for 2027 (such as Class 9 exam date, 2027
                    Intermediate dates, and 2027 Intermediate admission schedules).
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-5 space-y-2">
                  <h3 className="font-heading font-bold text-purple-300 text-sm">
                    4. PLANNED / APPROVED INITIATIVE
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Policy directions approved at forums such as the 184th IBCC Forum (e.g.,
                    uniform calendar, common practical procedures, topper support) where execution
                    timelines are still rolling out.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-600/40 bg-zinc-900/40 p-5 space-y-2">
                  <h3 className="font-heading font-bold text-zinc-200 text-sm">5. HISTORICAL</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Completed or previously commenced 2026 sessions kept strictly for timeline
                    clarity so old dates are never mistaken for 2027.
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5 space-y-2">
                  <h3 className="font-heading font-bold text-rose-300 text-sm">6. UNVERIFIED</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    Rumours or claims lacking official notification backing—never presented as
                    confirmed student guidance.
                  </p>
                </div>
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
                className="absolute top-5 right-5 text-muted hover:text-white cursor-pointer"
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
                    Thank you. Remember to also check your own BISE official website before acting on
                    any forwarded circular.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyModalOpen(false);
                      setUserSubmissionSubmitted(false);
                    }}
                    className="mt-2 rounded-xl bg-accent px-4 py-2 text-xs font-heading font-bold text-black cursor-pointer"
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
                    Seen a viral date sheet, pairing scheme, or fee notification? Paste its details
                    below so it can be audited against official PBCC, BISE, PECTAA, IBCC, and FBISE
                    sources.
                  </p>

                  <textarea
                    rows={4}
                    value={userSubmissionText}
                    onChange={(e) => setUserSubmissionText(e.target.value)}
                    required
                    placeholder="Paste circular title, notification number, date, or link..."
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-xs text-white placeholder-muted focus:border-accent focus:outline-none"
                  />

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setVerifyModalOpen(false)}
                      className="rounded-xl px-4 py-2 text-xs text-muted hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-accent px-5 py-2 text-xs font-heading font-bold text-black hover:bg-accent/90 transition-colors cursor-pointer"
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
