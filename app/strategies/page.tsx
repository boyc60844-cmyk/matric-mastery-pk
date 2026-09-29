"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Tag as TagIcon,
  Sparkles,
  ArrowRight,
  Compass,
  GraduationCap,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StrategiesGrid from "@/components/StrategiesGrid";
import ProblemFinder from "@/components/ProblemFinder";
import { strategyArticles, GradeLevel } from "@/lib/content";
import { useSearchParams } from "@/src/context/RouterContext";

const filterTags = [
  "All",
  "Math",
  "Presentation",
  "Diagrams",
  "Numericals",
  "MCQs",
  "Physics",
  "Chemistry",
  "English",
  "Pak Studies",
  "Time Management",
  "Exam Hacks",
  "Mindset",
] as const;

const gradeFilters: { label: string; value: "All" | GradeLevel }[] = [
  { label: "All Grades", value: "All" },
  { label: "Class 9", value: "Class 9" },
  { label: "Class 10", value: "Class 10" },
  { label: "Universal (8th-12th)", value: "All Grades" },
];

export default function StrategiesPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number>(0);

  // Initialize from URL parameters if available (?tag=Math or ?q=... or ?category=...)
  useEffect(() => {
    const urlTag = searchParams.get("tag");
    const urlQ = searchParams.get("q") || searchParams.get("search");
    const urlCat = searchParams.get("category");
    const urlGrade = searchParams.get("grade");

    if (urlTag) {
      setSelectedTag(urlTag);
    }
    if (urlQ) {
      setSearchQuery(urlQ);
    }
    if (urlCat) {
      setSelectedCategory(urlCat);
    }
    if (urlGrade && (urlGrade === "Class 9" || urlGrade === "Class 10" || urlGrade === "All Grades")) {
      setSelectedGrade(urlGrade);
    }
  }, [searchParams]);

  // Compute tag counts for fast visual feedback
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { All: strategyArticles.length };
    filterTags.forEach((t) => {
      if (t === "All") return;
      const lower = t.toLowerCase();
      counts[t] = strategyArticles.filter(
        (a) =>
          a.tag.toLowerCase() === lower ||
          a.category.toLowerCase() === lower ||
          a.tags.some((tagItem) => tagItem.toLowerCase() === lower)
      ).length;
    });
    return counts;
  }, []);

  // Read slugs count from local storage (Progress System - Section 20)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("matric_mastery_read_slugs");
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setReadCount(parsed.length);
      }
    } catch {
      // ignore
    }
  }, []);

  // Multi-dimensional real-time filtering
  const filteredArticles = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    // Normalize query if user typed '#math' or 'tag:presentation'
    const query = rawQuery.replace(/^(#|tag:)/i, "").trim();

    return strategyArticles.filter((article) => {
      // 1. Grade filter
      if (selectedGrade !== "All") {
        if (selectedGrade === "All Grades") {
          if (article.grade !== "All Grades") return false;
        } else if (article.grade !== selectedGrade && article.grade !== "All Grades") {
          return false;
        }
      }

      // 2. Learning path filter
      if (selectedPath) {
        if (article.learningPath !== selectedPath) return false;
      }

      // 3. Category filter
      if (selectedCategory !== "All") {
        if (
          article.category !== selectedCategory &&
          !(selectedCategory === "Mathematics" && (article.category as string) === "Math")
        ) {
          return false;
        }
      }

      // 4. Tag filter
      if (selectedTag !== "All") {
        const tagLower = selectedTag.toLowerCase();
        const matchesTag =
          article.tag.toLowerCase() === tagLower ||
          article.category.toLowerCase() === tagLower ||
          article.tags.some((t) => t.toLowerCase() === tagLower);

        if (!matchesTag) return false;
      }

      // 5. Client-side search across title, description, subject, tags, bullets, quickWin
      if (!query) return true;

      const titleMatch = article.title.toLowerCase().includes(query);
      const tagMatch = article.tag.toLowerCase().includes(query);
      const subjectMatch = article.subject.toLowerCase().includes(query);
      const categoryMatch = article.category.toLowerCase().includes(query);
      const tagsListMatch = article.tags.some((t) =>
        t.toLowerCase().includes(query)
      );
      const descMatch = article.description.toLowerCase().includes(query);
      const introMatch = article.intro.toLowerCase().includes(query);
      const quickWinMatch = article.quickWin?.toLowerCase().includes(query);
      const bulletsMatch = article.bullets.some(
        (b) =>
          b.label.toLowerCase().includes(query) ||
          b.text.toLowerCase().includes(query)
      );

      return (
        titleMatch ||
        tagMatch ||
        subjectMatch ||
        categoryMatch ||
        tagsListMatch ||
        descMatch ||
        introMatch ||
        quickWinMatch ||
        bulletsMatch
      );
    });
  }, [searchQuery, selectedTag, selectedGrade, selectedCategory, selectedPath]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedTag !== "All" ||
    selectedGrade !== "All" ||
    selectedCategory !== "All" ||
    selectedPath !== null;

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedTag("All");
    setSelectedGrade("All");
    setSelectedCategory("All");
    setSelectedPath(null);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTag((prev) => {
      if (prev.toLowerCase() === tag.toLowerCase()) {
        return "All";
      }
      return tag;
    });
  }, []);

  const handlePathClick = (path: "starting-matric" | "finishing-strong" | "exam-day") => {
    if (selectedPath === path) {
      setSelectedPath(null);
    } else {
      setSelectedPath(path);
      setSelectedCategory("All");
      setSelectedTag("All");
      if (path === "starting-matric") setSelectedGrade("Class 9");
      else if (path === "finishing-strong") setSelectedGrade("Class 10");
      else setSelectedGrade("All");
    }
  };

  // Featured Strategy (Section 18 of PDF)
  const featuredArticle =
    strategyArticles.find((a) => a.slug === "3-hour-formula") ||
    strategyArticles[0];

  return (
    <section className="mx-auto max-w-site px-5 py-8 md:py-16">
      {/* =========================================================================
          0. SIGNATURE TOOL: I HAVE A PROBLEM FINDER
          ========================================================================= */}
      <Reveal>
        <ProblemFinder />
      </Reveal>

      {/* =========================================================================
          1. HEADER (Section 14 of spec)
          ========================================================================= */}
      <header className="mt-8 md:mt-12">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 font-heading text-xs font-black uppercase tracking-[0.15em] text-accent">
            <Sparkles size={13} className="text-accent" />
            THE MATRIC MASTERY PLAYBOOK
          </span>
          <h1 className="mt-3 font-heading type-title text-white">
            Board Strategies, Not Textbook Notes.
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted md:text-lg leading-relaxed">
            Practical strategies for preparing smarter, writing cleaner papers, and
            handling exam day without turning your brain into a microwave.
          </p>

          {/* Optional Progress System Indicator (Section 20 of spec) */}
          {readCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 size={14} />
              <span>
                You have completed <strong className="text-white">{readCount}</strong> of{" "}
                {strategyArticles.length} guides
              </span>
            </div>
          )}
        </Reveal>
      </header>

      {/* =========================================================================
          2. LEARNING PATHS (Section 19: 3 lightweight entry points)
          ========================================================================= */}
      <div className="mt-10">
        <Reveal delay={60}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-heading text-xs font-black uppercase tracking-wider text-muted/70 flex items-center gap-1.5">
              <Compass size={14} className="text-accent" />
              CHOOSE YOUR LEARNING PATH
            </span>
            {selectedPath && (
              <button
                type="button"
                onClick={() => setSelectedPath(null)}
                className="text-xs text-accent font-heading font-bold hover:underline cursor-pointer"
              >
                Clear Path
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Path 1: STARTING MATRIC */}
            <div
              onClick={() => handlePathClick("starting-matric")}
              className={`rounded-2xl border p-5 transition-all cursor-pointer preserve-3d ${
                selectedPath === "starting-matric"
                  ? "border-accent bg-accent/15 shadow-brutalist-yellow translate-y-[-2px]"
                  : "border-white/10 bg-[#121214] hover:border-accent/40 hover:bg-[#151518]"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-accent/20 border border-accent/40 px-2 py-0.5 font-heading font-black text-accent uppercase text-[10px]">
                  CLASS 9 PATH
                </span>
                <GraduationCap size={16} className="text-muted" />
              </div>
              <h3 className="mt-3 font-heading text-base font-extrabold text-white">
                Starting Matric
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Build the right presentation habits, diagrams, and study routines from day one.
              </p>
            </div>

            {/* Path 2: FINISHING STRONG */}
            <div
              onClick={() => handlePathClick("finishing-strong")}
              className={`rounded-2xl border p-5 transition-all cursor-pointer preserve-3d ${
                selectedPath === "finishing-strong"
                  ? "border-accent bg-accent/15 shadow-brutalist-yellow translate-y-[-2px]"
                  : "border-white/10 bg-[#121214] hover:border-accent/40 hover:bg-[#151518]"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-accent/20 border border-accent/40 px-2 py-0.5 font-heading font-black text-accent uppercase text-[10px]">
                  CLASS 10 PATH
                </span>
                <Clock size={16} className="text-muted" />
              </div>
              <h3 className="mt-3 font-heading text-base font-extrabold text-white">
                Finishing Strong
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Pacing, high-yield organic equations, C-code formatting, and 15-mark essay mastery.
              </p>
            </div>

            {/* Path 3: EXAM DAY */}
            <div
              onClick={() => handlePathClick("exam-day")}
              className={`rounded-2xl border p-5 transition-all cursor-pointer preserve-3d ${
                selectedPath === "exam-day"
                  ? "border-accent bg-accent/15 shadow-brutalist-yellow translate-y-[-2px]"
                  : "border-white/10 bg-[#121214] hover:border-accent/40 hover:bg-[#151518]"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-accent px-2 py-0.5 font-heading font-black text-black uppercase text-[10px]">
                  EXAM DAY SPRINT
                </span>
                <Sparkles size={16} className="text-accent" />
              </div>
              <h3 className="mt-3 font-heading text-base font-extrabold text-white">
                Exam Day Protocol
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                The 3-hour division, MCQ elimination, margin discipline, and 10-minute final audit.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* =========================================================================
          3. FEATURED STRATEGY (Section 18 of PDF: Subtle 3D depth, yellow glow)
          ========================================================================= */}
      {!hasActiveFilters && (
        <div className="mt-12">
          <Reveal delay={80}>
            <Card
              shimmer
              depth="yellow"
              className="p-6 md:p-10 border-accent/40 bg-[#121214]/95 shadow-brutalist-yellow"
            >
              <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-lg bg-accent px-2.5 py-1 font-heading text-xs font-black tracking-wider text-black uppercase">
                      FEATURED PLAYBOOK
                    </span>
                    <span className="text-xs font-mono text-muted">
                      {featuredArticle.grade} &bull; {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="mt-4 font-heading text-2xl sm:text-3xl font-extrabold text-white">
                    {featuredArticle.title}
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
                    {featuredArticle.description}
                  </p>

                  {featuredArticle.quickWin && (
                    <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3 text-xs sm:text-sm text-white">
                      <strong className="text-accent font-heading">⚡ Quick Takeaway:</strong>{" "}
                      {featuredArticle.quickWin}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-4 items-center">
                    <Button
                      href={`/strategies/${featuredArticle.slug}`}
                      variant="primary"
                    >
                      Read Featured Guide <ArrowRight size={16} />
                    </Button>
                    <span className="text-xs font-mono text-muted/80">
                      Punjab Board Approved Strategy
                    </span>
                  </div>
                </div>

                {/* Paper-style preview visual */}
                <div className="hidden lg:block">
                  <div className="rounded-xl border border-white/15 bg-black/60 exam-paper-pattern p-4 font-mono text-xs text-white/80 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-muted border-b border-white/10 pb-2">
                      <span>BISE TIMING MODEL</span>
                      <span className="text-accent font-bold">180 MINS TOTAL</span>
                    </div>
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <div className="flex justify-between">
                        <span>Block 1 (MCQs):</span>
                        <span className="text-accent font-bold">15 Mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Block 2 (Short Qs):</span>
                        <span className="text-accent font-bold">50 Mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Block 3 (Long Qs):</span>
                        <span className="text-accent font-bold">95 Mins</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold border-t border-white/10 pt-1">
                        <span>Block 4 (Audit Buffer):</span>
                        <span>20 Mins Buffer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      )}

      {/* =========================================================================
          4. SEARCH, GRADE FILTERS & QUICK TAG PILLS (Section 15, 16, 17)
          ========================================================================= */}
      <Reveal delay={100}>
        <div className="mt-12 space-y-5">
          {/* Top Filter Bar: Search Input & Grade Level Selector */}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 30+ strategies by title, subject, formula, or tag..."
                aria-label="Search strategies"
                className="w-full rounded-xl border border-white/10 bg-[#121214] py-3.5 pl-10 pr-10 text-sm text-white placeholder:text-muted/60 outline-none transition-all focus:border-accent focus:bg-[#161619] shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Grade Filter Tabs (Section 17) */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#121214] p-1 overflow-x-auto no-scrollbar">
              {gradeFilters.map((g) => {
                const isActive = selectedGrade === g.value;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setSelectedGrade(g.value)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-heading font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-accent text-black shadow-sm"
                        : "text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Tag Pills (Filter by tag like 'Math' or 'Presentation' easily) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-heading font-black uppercase tracking-wider text-muted/70">
                <TagIcon size={12} className="text-accent" /> Filter by Popular Tags:
              </span>
              {selectedTag !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedTag("All")}
                  className="text-[11px] font-heading font-bold text-accent hover:underline cursor-pointer"
                >
                  Clear Tag (#{selectedTag})
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {filterTags.map((tag) => {
                const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                const count = tagCounts[tag] ?? 0;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    aria-pressed={isSelected}
                    className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-heading font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-accent text-black shadow-brutalist-yellow translate-x-[-1px] translate-y-[-1px]"
                        : "border border-white/10 bg-[#141416] text-muted hover:border-accent/40 hover:text-white"
                    }`}
                  >
                    <span>{tag === "All" ? "All Tags" : `#${tag}`}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                        isSelected
                          ? "bg-black/20 text-black font-black"
                          : "bg-white/5 text-muted/70"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Chips & Reset */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs text-muted font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span>
                  Showing <strong className="text-white">{filteredArticles.length}</strong> of{" "}
                  {strategyArticles.length} playbooks
                </span>
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded bg-accent/15 border border-accent/30 px-2 py-0.5 text-accent text-[11px] font-bold">
                    Category: {selectedCategory}
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All")}
                      aria-label="Clear category"
                      className="hover:text-white cursor-pointer ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedGrade !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded bg-white/10 border border-white/15 px-2 py-0.5 text-white text-[11px]">
                    Grade: {selectedGrade}
                    <button
                      type="button"
                      onClick={() => setSelectedGrade("All")}
                      aria-label="Clear grade"
                      className="hover:text-accent cursor-pointer ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedTag !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded bg-accent/15 border border-accent/30 px-2 py-0.5 text-accent text-[11px] font-bold">
                    #{selectedTag}
                    <button
                      type="button"
                      onClick={() => setSelectedTag("All")}
                      aria-label="Clear tag"
                      className="hover:text-white cursor-pointer ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedPath && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-emerald-300 text-[11px]">
                    Path: {selectedPath}
                    <button
                      type="button"
                      onClick={() => setSelectedPath(null)}
                      aria-label="Clear path"
                      className="hover:text-white cursor-pointer ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded bg-white/10 border border-white/15 px-2 py-0.5 text-white/90 text-[11px]">
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear query"
                      className="hover:text-accent cursor-pointer ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-accent hover:underline cursor-pointer font-heading font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </Reveal>

      {/* =========================================================================
          5. STRATEGIES GRID & CATEGORIES SIDEBAR
          ========================================================================= */}
      <StrategiesGrid
        articles={filteredArticles}
        allArticles={strategyArticles}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onTagClick={handleTagToggle}
        onResetFilters={handleResetFilters}
      />
    </section>
  );
}
