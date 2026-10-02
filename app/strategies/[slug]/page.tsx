/* ==========================================================================
   ULTRA-PREMIUM EDITORIAL STRATEGY DETAIL PAGE (/strategies/[slug] & /strategy/[slug])
   - 100% EXACT SAME TEXT AND CONTENT PRESERVED (NO REWRITING/SUMMARIZING)
   - $500 Luxury Notion + Apple Hybrid Visuals
   - Glassmorphism cards with backdrop-blur-xl + gold #FFD600 hover glow
   - Sticky Table of Contents on left (desktop) with active scroll spy
   - Top reading progress bar in gold #FFD600
   - Timeline presentation with icons for steps & bullets
   - Framer-motion entrance reveals (fade y:20)
   - Collapsible section wrappers (default open)
   - Top action bar: Copy strategy + Share + Save/Bookmark
   - Floating "Focus Mode" action that dims non-active content
   - Dynamic time-to-read & word count display
   - Preserves VoicePlayer, ArticleSummarizer, and Related Strategies
   ========================================================================== */

"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Lightbulb,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Share2,
  Check,
  Copy,
  Clock,
  BookOpen,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Award,
  Layers,
  FileText,
  Sliders,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import ArticleCard from "@/components/ArticleCard";
import VoicePlayer from "@/components/VoicePlayer";
import ArticleSummarizer from "@/components/ArticleSummarizer";
import { getArticle, strategyArticles, StrategyArticle } from "@/lib/content";
import { recordStrategyView, markStrategyCompleted } from "@/lib/progress";

interface StrategyDetailPageProps {
  slug: string;
}

export default function StrategyDetailPage({ slug }: StrategyDetailPageProps) {
  // Find article by slug or fallback to first
  const article = useMemo(() => {
    return getArticle(slug) || strategyArticles[0];
  }, [slug]);

  const articleRef = useRef<HTMLElement>(null);

  // Interaction states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("sec-overview");
  const [readingProgress, setReadingProgress] = useState(0);

  // Collapsible section toggles (all true by default so content is immediately readable)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    overview: false,
    quickwin: false,
    gameplan: false,
    techniques: false,
    example: false,
    mistakes: false,
    finaltip: false,
  });

  const toggleSection = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Word count and calculated reading time for existing content
  const { totalWords, calcReadingMinutes } = useMemo(() => {
    const fullText = [
      article.title,
      article.description,
      article.intro,
      article.quickWin || "",
      ...(article.steps || []),
      ...(article.bullets.map((b) => `${b.label} ${b.text}`) || []),
      article.example || "",
      ...(article.mistakes || []),
      article.finalTip,
    ].join(" ");
    const words = fullText.split(/\s+/).filter(Boolean).length;
    return {
      totalWords: words,
      calcReadingMinutes: Math.max(1, Math.ceil(words / 200)),
    };
  }, [article]);

  // Reading progress and active TOC section tracking
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const current = (window.scrollY / totalScroll) * 100;
        setReadingProgress(Math.min(100, Math.max(0, current)));
      }

      // Scroll spy for TOC
      const sections = [
        "sec-overview",
        "sec-quickwin",
        "sec-gameplan",
        "sec-techniques",
        "sec-example",
        "sec-mistakes",
        "sec-finaltip",
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track strategy view & local bookmark status
  useEffect(() => {
    try {
      recordStrategyView(article.slug);

      const storedRead = localStorage.getItem("matric_mastery_read_slugs");
      if (storedRead) {
        const parsed = JSON.parse(storedRead) as string[];
        setIsCompleted(parsed.includes(article.slug));
      }

      const storedSaved = localStorage.getItem("matric_mastery_saved_slugs");
      if (storedSaved) {
        const parsed = JSON.parse(storedSaved) as string[];
        setIsBookmarked(parsed.includes(article.slug));
      }
    } catch {
      // ignore storage errors
    }
  }, [article.slug]);

  // Keyboard shortcut: ESC to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode]);

  const toggleCompleted = () => {
    try {
      const stored = localStorage.getItem("matric_mastery_read_slugs");
      let list: string[] = stored ? JSON.parse(stored) : [];
      if (list.includes(article.slug)) {
        list = list.filter((s) => s !== article.slug);
        setIsCompleted(false);
      } else {
        list.push(article.slug);
        setIsCompleted(true);
        markStrategyCompleted(article.slug);
      }
      localStorage.setItem("matric_mastery_read_slugs", JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const toggleBookmark = () => {
    try {
      const stored = localStorage.getItem("matric_mastery_saved_slugs");
      let list: string[] = stored ? JSON.parse(stored) : [];
      if (list.includes(article.slug)) {
        list = list.filter((s) => s !== article.slug);
        setIsBookmarked(false);
      } else {
        list.push(article.slug);
        setIsBookmarked(true);
      }
      localStorage.setItem("matric_mastery_saved_slugs", JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // Copy full strategy content as clean structured text
  const handleCopyStrategy = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const fullContentText = [
        `# ${article.title}`,
        `${article.description}`,
        "",
        `Grade: ${article.grade} | Subject: ${article.subject} | Author: ${article.author}`,
        "",
        `## Overview`,
        article.intro,
        "",
        article.quickWin ? `## Quick Win\n${article.quickWin}\n` : "",
        article.steps && article.steps.length > 0
          ? `## Step-by-Step Game Plan\n` +
            article.steps.map((st, i) => `${i + 1}. ${st}`).join("\n") +
            "\n"
          : "",
        `## Core Techniques\n` +
          article.bullets.map((b) => `### ${b.label}\n${b.text}`).join("\n\n") +
          "\n",
        article.example ? `## Practical Exam Sheet Example\n${article.example}\n` : "",
        article.mistakes && article.mistakes.length > 0
          ? `## Common Mistakes to Avoid\n` +
            article.mistakes.map((m) => `- ${m}`).join("\n") +
            "\n"
          : "",
        `## Final Tip\n${article.finalTip}`,
      ]
        .filter(Boolean)
        .join("\n");

      navigator.clipboard.writeText(fullContentText);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2400);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Related articles (Section 13 of spec)
  const sameCategory = strategyArticles.filter(
    (a) => a.category === article.category && a.slug !== article.slug
  );
  const sameSubject = strategyArticles.filter(
    (a) => a.subject === article.subject && a.slug !== article.slug
  );
  const otherArticles = strategyArticles.filter((a) => a.slug !== article.slug);

  const relatedArticles: StrategyArticle[] = Array.from(
    new Set([...sameCategory, ...sameSubject, ...otherArticles])
  ).slice(0, 3);

  return (
    <>
      {/* Top Gold #FFD600 Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#FFD600] via-amber-400 to-[#FFD600] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article
        ref={articleRef}
        className={`relative min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFD600] selection:text-black py-8 sm:py-12 transition-all ${
          focusMode ? "focus-mode-active" : ""
        }`}
      >
        {/* Ambient Glows */}
        <div className="absolute top-12 left-10 h-96 w-96 rounded-full bg-[#FFD600]/[0.04] blur-[150px] pointer-events-none" />
        <div className="absolute bottom-12 right-10 h-96 w-96 rounded-full bg-amber-500/[0.03] blur-[170px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Header Navigation & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-8">
            <Link
              href="/strategies"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-muted transition-colors hover:text-white group"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1 text-[#FFD600]"
              />
              <span>Back to Strategy Playbook</span>
            </Link>

            {/* Advanced Action Bar: Copy Strategy + Share + Save + Focus Mode */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Copy Strategy Button */}
              <button
                type="button"
                onClick={handleCopyStrategy}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-heading font-bold text-white/90 hover:bg-white/10 hover:border-[#FFD600]/40 transition-all cursor-pointer"
                title="Copy entire strategy text to clipboard"
              >
                {copiedContent ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-[#FFD600]" />
                    <span>Copy Strategy</span>
                  </>
                )}
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-heading font-bold text-white/90 hover:bg-white/10 hover:border-[#FFD600]/40 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={13} className="text-[#FFD600]" />
                    <span>Share</span>
                  </>
                )}
              </button>

              {/* Save / Bookmark Button */}
              <button
                type="button"
                onClick={toggleBookmark}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-heading font-bold transition-all cursor-pointer ${
                  isBookmarked
                    ? "border-[#FFD600]/40 bg-[#FFD600]/15 text-[#FFD600]"
                    : "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <Bookmark
                  size={13}
                  className={isBookmarked ? "fill-[#FFD600] text-[#FFD600]" : ""}
                />
                <span>{isBookmarked ? "Saved" : "Save"}</span>
              </button>

              {/* Focus Mode Toggle */}
              <button
                type="button"
                onClick={() => setFocusMode(!focusMode)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-heading font-bold transition-all cursor-pointer ${
                  focusMode
                    ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400 shadow-glow"
                    : "border-white/10 bg-white/5 text-white/90 hover:border-emerald-500/30"
                }`}
                title="Focus Mode dims distractions while reading"
              >
                <Eye size={13} className={focusMode ? "text-emerald-400" : "text-muted"} />
                <span>{focusMode ? "Focus Active" : "Focus Mode"}</span>
              </button>

              {/* Mark Completed Button */}
              <button
                type="button"
                onClick={toggleCompleted}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-heading font-bold transition-all cursor-pointer ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-white/5 text-muted hover:text-white border-white/10"
                }`}
              >
                <CheckCircle2
                  size={14}
                  className={isCompleted ? "text-emerald-400" : "text-muted"}
                />
                <span>{isCompleted ? "Read" : "Mark as Read"}</span>
              </button>
            </div>
          </div>

          {/* Luxury 2-Column Split: Sticky TOC Sidebar (Left) + Editorial Content (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ============================================================
                LEFT SIDE: STICKY TABLE OF CONTENTS (DESKTOP)
                ============================================================ */}
            <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 space-y-5">
              <div className="rounded-3xl border border-white/10 bg-[#121216]/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-heading text-xs font-black uppercase tracking-wider text-muted flex items-center gap-2">
                    <Layers size={14} className="text-[#FFD600]" />
                    <span>Table of Contents</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#FFD600]">
                    {Math.round(readingProgress)}% Read
                  </span>
                </div>

                {/* TOC Navigation Links */}
                <nav className="space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => scrollToSection("sec-overview")}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-heading font-medium transition-all ${
                      activeSection === "sec-overview"
                        ? "bg-[#FFD600]/15 text-[#FFD600] font-bold border-l-2 border-[#FFD600]"
                        : "text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>Overview & Blueprint</span>
                    <ChevronRight size={13} className="opacity-60" />
                  </button>

                  {article.quickWin && (
                    <button
                      type="button"
                      onClick={() => scrollToSection("sec-quickwin")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-heading font-medium transition-all ${
                        activeSection === "sec-quickwin"
                          ? "bg-[#FFD600]/15 text-[#FFD600] font-bold border-l-2 border-[#FFD600]"
                          : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap size={12} className="text-[#FFD600]" /> Quick Win
                      </span>
                      <ChevronRight size={13} className="opacity-60" />
                    </button>
                  )}

                  {article.steps && article.steps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => scrollToSection("sec-gameplan")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-heading font-medium transition-all ${
                        activeSection === "sec-gameplan"
                          ? "bg-[#FFD600]/15 text-[#FFD600] font-bold border-l-2 border-[#FFD600]"
                          : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>Game Plan ({article.steps.length} Steps)</span>
                      <ChevronRight size={13} className="opacity-60" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => scrollToSection("sec-techniques")}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-heading font-medium transition-all ${
                      activeSection === "sec-techniques"
                        ? "bg-[#FFD600]/15 text-[#FFD600] font-bold border-l-2 border-[#FFD600]"
                        : "text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>Core Techniques ({article.bullets.length})</span>
                    <ChevronRight size={13} className="opacity-60" />
                  </button>

                  {article.example && (
                    <button
                      type="button"
                      onClick={() => scrollToSection("sec-example")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-heading font-medium transition-all ${
                        activeSection === "sec-example"
                          ? "bg-[#FFD600]/15 text-[#FFD600] font-bold border-l-2 border-[#FFD600]"
                          : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>Exam Sheet Example</span>
                      <ChevronRight size={13} className="opacity-60" />
                    </button>
                  )}

                  {article.mistakes && article.mistakes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => scrollToSection("sec-mistakes")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-heading font-medium transition-all ${
                        activeSection === "sec-mistakes"
                          ? "bg-[#FFD600]/15 text-[#FFD600] font-bold border-l-2 border-[#FFD600]"
                          : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-red-400">
                        <AlertTriangle size={12} /> Common Mistakes
                      </span>
                      <ChevronRight size={13} className="opacity-60" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => scrollToSection("sec-finaltip")}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-heading font-medium transition-all ${
                      activeSection === "sec-finaltip"
                        ? "bg-[#FFD600]/15 text-[#FFD600] font-bold border-l-2 border-[#FFD600]"
                        : "text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Lightbulb size={12} className="text-[#FFD600]" /> Final Tip
                    </span>
                    <ChevronRight size={13} className="opacity-60" />
                  </button>
                </nav>

                {/* Strategy Quick Telemetry Box */}
                <div className="mt-5 border-t border-white/10 pt-4 space-y-2.5 text-[11px] font-mono text-muted">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-[#FFD600]" /> Read Time
                    </span>
                    <span className="text-white font-bold">{article.readTime} ({calcReadingMinutes}m)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText size={12} className="text-[#FFD600]" /> Word Count
                    </span>
                    <span className="text-white font-bold">{totalWords} Words</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Target size={12} className="text-[#FFD600]" /> Target
                    </span>
                    <span className="text-emerald-400 font-bold">1050+ Marks</span>
                  </div>
                </div>
              </div>

              {/* Jump to Another Strategy Dropdown */}
              <div className="rounded-2xl border border-white/10 bg-[#121216]/70 p-4 backdrop-blur-md">
                <span className="block font-heading text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                  Browse Other Playbooks:
                </span>
                <select
                  value={article.slug}
                  onChange={(e) => {
                    if (typeof window !== "undefined") {
                      window.location.href = `/strategies/${e.target.value}`;
                    }
                  }}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white font-heading font-medium focus:border-[#FFD600] focus:outline-none"
                >
                  {strategyArticles.map((strat) => (
                    <option key={strat.slug} value={strat.slug}>
                      {strat.subject}: {strat.title.slice(0, 32)}...
                    </option>
                  ))}
                </select>
              </div>
            </aside>

            {/* ============================================================
                RIGHT SIDE: MAIN EDITORIAL STRATEGY BODY
                Wrapped in Luxury Glassmorphism & Micro-Interactions
                ============================================================ */}
            <main className="lg:col-span-8 xl:col-span-9 space-y-8">
              {/* TOP HERO METADATA CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative rounded-[28px] border border-white/10 bg-[#121216]/90 p-6 sm:p-9 backdrop-blur-xl shadow-2xl hover:border-[#FFD600]/30 transition-all overflow-hidden"
              >
                {/* Top Subtle Amber Ambient Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFD600] to-transparent" />

                {/* Metadata Badges: Category, Grade, Subject, Read Time */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-lg bg-[#FFD600] px-3 py-1 font-heading text-xs font-black tracking-wider text-black uppercase shadow-glow">
                    {article.category}
                  </span>
                  <span className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-heading text-xs font-bold text-white/90">
                    {article.grade}
                  </span>
                  <span className="rounded-lg border border-[#FFD600]/30 bg-[#FFD600]/10 px-2.5 py-1 font-mono text-[11px] text-[#FFD600]">
                    {article.subject}
                  </span>
                  <span className="ml-auto text-muted font-mono flex items-center gap-1.5 text-xs">
                    <Clock size={12} className="text-[#FFD600]" />
                    {article.readTime}
                  </span>
                </div>

                {/* Large Editorial Headline */}
                <h1 className="mt-6 font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {article.title}
                </h1>

                {/* Description Paragraph */}
                <p className="mt-4 text-base sm:text-lg text-muted/95 leading-relaxed font-normal">
                  {article.description}
                </p>

                {/* Author & Tags Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted/80 border-t border-white/10 pt-4">
                  <span>By {article.author} (10th Grader, Multan) &bull; {article.date}</span>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.slice(0, 4).map((t) => (
                        <Link
                          key={t}
                          href={`/strategies?tag=${encodeURIComponent(t)}`}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-muted hover:border-[#FFD600] hover:text-[#FFD600] transition-colors"
                        >
                          #{t}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* HERO COVER IMAGE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="relative h-[280px] sm:h-[380px] w-full overflow-hidden rounded-[26px] border border-white/10 shadow-2xl"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-white/90 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Punjab Board Tested Strategy
                  </span>
                  <span className="text-[#FFD600] font-bold">BISE MULTAN · LAHORE · ALL BOARDS</span>
                </div>
              </motion.div>

              {/* VOICE LEARNING AUDIO PLAYER */}
              <div className="rounded-2xl border border-white/10 bg-[#121216]/90 p-1">
                <VoicePlayer
                  title={article.title}
                  textToRead={`${article.description}. ${article.intro}. ${article.quickWin || ""}`}
                />
              </div>

              {/* AI STRATEGY SUMMARIZER & MIND MAP */}
              <ArticleSummarizer article={article} />

              {/* ============================================================
                  SECTION 1: OVERVIEW & INTRO (COLLAPSIBLE GLASS CARD)
                  ============================================================ */}
              <motion.section
                id="sec-overview"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`rounded-[26px] border border-white/10 bg-[#121216]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl hover:border-[#FFD600]/40 transition-all ${
                  focusMode ? "hover:opacity-100 opacity-60" : ""
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={18} className="text-[#FFD600]" />
                    <h2 className="font-heading text-lg sm:text-xl font-black text-white">
                      Overview & Foundation
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSection("overview")}
                    className="rounded-lg p-1 text-muted hover:text-white transition-colors"
                  >
                    {collapsed.overview ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>
                </div>

                {!collapsed.overview && (
                  <div className="border-l-3 border-[#FFD600] pl-5 py-1">
                    <p className="text-base sm:text-lg leading-relaxed text-white/95 font-medium">
                      {article.intro}
                    </p>
                  </div>
                )}
              </motion.section>

              {/* ============================================================
                  SECTION 2: QUICK WIN (COLLAPSIBLE GLASS CARD WITH GOLD BORDER)
                  ============================================================ */}
              {article.quickWin && (
                <motion.section
                  id="sec-quickwin"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-[26px] border-2 border-[#FFD600]/40 bg-gradient-to-r from-[#FFD600]/15 via-[#FFD600]/5 to-transparent backdrop-blur-xl p-6 sm:p-7 shadow-[0_0_30px_rgba(255,214,0,0.12)] ${
                    focusMode ? "hover:opacity-100 opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#FFD600]/20 pb-3 mb-3">
                    <div className="flex items-center gap-2 text-[#FFD600] font-heading font-black text-xs sm:text-sm tracking-wider uppercase">
                      <Zap size={18} className="fill-[#FFD600] text-[#FFD600]" />
                      <span>⚡ Quick Win</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSection("quickwin")}
                      className="rounded-lg p-1 text-[#FFD600] hover:text-white transition-colors"
                    >
                      {collapsed.quickwin ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                  </div>

                  {!collapsed.quickwin && (
                    <p className="mt-2 text-base sm:text-lg font-bold leading-relaxed text-white">
                      {article.quickWin}
                    </p>
                  )}
                </motion.section>
              )}

              {/* ============================================================
                  SECTION 3: STEP-BY-STEP GAME PLAN (TIMELINE WRAPPER)
                  ============================================================ */}
              {article.steps && article.steps.length > 0 && (
                <motion.section
                  id="sec-gameplan"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-[26px] border border-white/10 bg-[#121216]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl hover:border-[#FFD600]/40 transition-all ${
                    focusMode ? "hover:opacity-100 opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                    <h2 className="font-heading text-lg sm:text-xl font-black text-white flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-[#FFD600]" />
                      <span>Step-by-Step Game Plan:</span>
                    </h2>
                    <button
                      type="button"
                      onClick={() => toggleSection("gameplan")}
                      className="rounded-lg p-1 text-muted hover:text-white transition-colors"
                    >
                      {collapsed.gameplan ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                  </div>

                  {!collapsed.gameplan && (
                    <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#FFD600]/30">
                      {article.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="relative flex items-start gap-3.5 rounded-2xl border border-white/10 bg-[#16161b] p-4 text-sm sm:text-base text-white/95 shadow-sm hover:border-[#FFD600]/30 transition-colors"
                        >
                          {/* Timeline Step Node Circle */}
                          <span className="absolute -left-[30px] sm:-left-[38px] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD600] text-[11px] font-heading font-black text-black shadow-glow ring-4 ring-[#121216]">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.section>
              )}

              {/* ============================================================
                  SECTION 4: CORE BULLETS / TECHNIQUES (TIMELINE WITH ICONS)
                  ============================================================ */}
              <motion.section
                id="sec-techniques"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`rounded-[26px] border border-white/10 bg-[#121216]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl hover:border-[#FFD600]/40 transition-all ${
                  focusMode ? "hover:opacity-100 opacity-60" : ""
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-[#FFD600]" />
                    <h2 className="font-heading text-lg sm:text-xl font-black text-white">
                      Core Strategic Techniques
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSection("techniques")}
                    className="rounded-lg p-1 text-muted hover:text-white transition-colors"
                  >
                    {collapsed.techniques ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>
                </div>

                {!collapsed.techniques && (
                  <div className="space-y-6">
                    {article.bullets.map((bullet, i) => (
                      <div
                        key={bullet.label}
                        className="rounded-2xl border border-white/10 bg-[#15151a] p-5 sm:p-6 hover:border-[#FFD600]/40 transition-all"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FFD600]/15 text-[#FFD600] font-heading font-black text-xs">
                            {i + 1}
                          </span>
                          <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                            {bullet.label}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted/90 pl-9 font-normal">
                          {bullet.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* ============================================================
                  SECTION 5: CONCRETE EXAMPLE / SHEET CODE
                  ============================================================ */}
              {article.example && (
                <motion.section
                  id="sec-example"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-[26px] border border-white/15 bg-black/70 backdrop-blur-xl p-6 sm:p-7 shadow-2xl hover:border-[#FFD600]/40 transition-all ${
                    focusMode ? "hover:opacity-100 opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <p className="font-heading text-xs font-black uppercase tracking-wider text-[#FFD600] flex items-center gap-2">
                      <Target size={15} />
                      <span>PRACTICAL EXAM SHEET EXAMPLE:</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleSection("example")}
                      className="rounded-lg p-1 text-muted hover:text-white transition-colors"
                    >
                      {collapsed.example ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                  </div>

                  {!collapsed.example && (
                    <pre className="mt-3 whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed text-white/90 bg-[#121216] p-4 rounded-2xl border border-white/10 overflow-x-auto shadow-inner">
                      {article.example}
                    </pre>
                  )}
                </motion.section>
              )}

              {/* ============================================================
                  SECTION 6: COMMON MISTAKE BOX (DON'T DO THIS)
                  ============================================================ */}
              {article.mistakes && article.mistakes.length > 0 && (
                <motion.section
                  id="sec-mistakes"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-[26px] border border-red-500/35 bg-red-950/20 backdrop-blur-xl p-6 sm:p-8 shadow-2xl hover:border-red-500/60 transition-all ${
                    focusMode ? "hover:opacity-100 opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-red-500/20 pb-3 mb-3">
                    <div className="flex items-center gap-2 text-red-400 font-heading font-black text-xs sm:text-sm tracking-wider uppercase">
                      <AlertTriangle size={18} />
                      <span>⚠️ DON&apos;T DO THIS (Common Mistakes)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSection("mistakes")}
                      className="rounded-lg p-1 text-red-400 hover:text-white transition-colors"
                    >
                      {collapsed.mistakes ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                  </div>

                  {!collapsed.mistakes && (
                    <ul className="mt-4 space-y-3 text-sm sm:text-base text-red-200/90 leading-relaxed">
                      {article.mistakes.map((mistake, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-bold text-xs mt-0.5">
                            &times;
                          </span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.section>
              )}

              {/* ============================================================
                  SECTION 7: FINAL TIP BOX (LUXURY GOLDEN HERO CARD)
                  ============================================================ */}
              <motion.section
                id="sec-finaltip"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`rounded-[28px] border-2 border-[#FFD600]/40 bg-gradient-to-b from-[#16161c] to-[#111116] p-7 sm:p-9 shadow-2xl hover:border-[#FFD600] transition-all relative overflow-hidden ${
                  focusMode ? "hover:opacity-100 opacity-60" : ""
                }`}
              >
                <div className="absolute top-0 right-0 h-40 w-40 bg-[#FFD600]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex rounded-xl bg-[#FFD600] p-2 text-black shadow-glow">
                      <Lightbulb size={20} strokeWidth={2.5} />
                    </span>
                    <span className="font-heading text-sm font-black uppercase tracking-wider text-[#FFD600]">
                      FINAL TIP
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSection("finaltip")}
                    className="rounded-lg p-1 text-muted hover:text-white transition-colors"
                  >
                    {collapsed.finaltip ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>
                </div>

                {!collapsed.finaltip && (
                  <p className="mt-3 text-base sm:text-xl font-bold leading-relaxed text-white">
                    {article.finalTip}
                  </p>
                )}
              </motion.section>

              {/* Tags bar at end of article */}
              <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
                <span className="text-xs font-mono text-muted py-1">Tags:</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/strategies?tag=${encodeURIComponent(tag)}`}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-muted hover:border-[#FFD600] hover:text-[#FFD600] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </main>
          </div>

          {/* ============================================================
              SECTION 13: RELATED STRATEGIES (3 ARTICLES)
              ============================================================ */}
          {relatedArticles.length > 0 && (
            <div className="mt-20 border-t border-white/10 pt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="font-heading text-xs font-black uppercase tracking-wider text-[#FFD600]">
                    Next In Playbook
                  </span>
                  <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-black text-white">
                    Related Exam Strategies
                  </h2>
                </div>
                <Link
                  href="/strategies"
                  className="text-xs font-heading font-bold text-[#FFD600] hover:underline hidden sm:inline-block"
                >
                  View Full Library (30+) &rarr;
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((rel) => (
                  <ArticleCard
                    key={rel.slug}
                    article={rel}
                    href={`/strategies/${rel.slug}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Focus Mode Banner (Shown when Focus Mode is active) */}
        {focusMode && (
          <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4">
            <div className="flex items-center gap-3 rounded-full border border-emerald-500/50 bg-[#121216]/95 px-5 py-2.5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-xs text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-heading font-bold">Focus Mode Active</span>
              <span className="text-muted">· Hover over sections to illuminate · Press [ESC] to exit</span>
              <button
                type="button"
                onClick={() => setFocusMode(false)}
                className="ml-2 rounded-lg bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white hover:bg-white/20"
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
