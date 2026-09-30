"use client";

import { useRef, useState, useEffect } from "react";
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
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Card from "@/components/Card";
import ArticleCard from "@/components/ArticleCard";
import CircularReadingProgress from "@/components/CircularReadingProgress";
import VoicePlayer from "@/components/VoicePlayer";
import ArticleSummarizer from "@/components/ArticleSummarizer";
import { getArticle, strategyArticles, StrategyArticle } from "@/lib/content";
import { recordStrategyView, markStrategyCompleted } from "@/lib/progress";

interface StrategyDetailPageProps {
  slug: string;
}

export default function StrategyDetailPage({ slug }: StrategyDetailPageProps) {
  const article = getArticle(slug) || strategyArticles[0];
  const articleRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Local storage reading tracking + Gamification progress
  useEffect(() => {
    try {
      recordStrategyView(article.slug);
      const stored = localStorage.getItem("matric_mastery_read_slugs");
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setIsCompleted(parsed.includes(article.slug));
      }
    } catch {
      // ignore storage errors
    }
  }, [article.slug]);

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Up to 3 related articles (Section 13 of spec)
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
    <article ref={articleRef} className="mx-auto max-w-site px-5 py-12 md:py-20">
      {/* Top Bar with Navigation and Reading Progress */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link
            href="/strategies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-white group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Back to Strategy Playbook</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleCompleted}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-heading font-bold transition-all cursor-pointer ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-white/5 text-muted hover:text-white border border-white/10"
              }`}
            >
              {isCompleted ? (
                <>
                  <Check size={14} /> Completed
                </>
              ) : (
                <>
                  <Bookmark size={14} /> Mark as Read
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-heading font-semibold text-muted hover:text-white transition-colors cursor-pointer"
            >
              <Share2 size={13} />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>

            <CircularReadingProgress articleRef={articleRef} />
          </div>
        </div>
      </Reveal>

      {/* Main Article Body */}
      <div className="mx-auto mt-10 max-w-prose">
        <Reveal delay={60}>
          {/* Metadata badges: Category, Grade, Read Time */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="rounded-lg bg-accent px-3 py-1 font-heading text-xs font-black tracking-wider text-black uppercase shadow-sm">
              {article.category}
            </span>
            <span className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-heading text-xs font-bold text-white/90">
              {article.grade}
            </span>
            <span className="rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent">
              {article.subject}
            </span>
            <span className="text-muted font-mono ml-auto">
              {article.readTime}
            </span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="mt-6 font-heading type-article text-white">
            {article.title}
          </h1>

          <p className="mt-3 text-base text-muted/90 leading-relaxed font-medium">
            {article.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted/70 border-t border-white/10 pt-3">
            <span>By {article.author} (10th Grader, Multan) &bull; {article.date}</span>
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.tags.slice(0, 4).map((t) => (
                  <Link
                    key={t}
                    href={`/strategies?tag=${encodeURIComponent(t)}`}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-muted hover:border-accent hover:text-accent transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Hero Cover Image */}
        <Reveal delay={100} className="mt-8">
          <div className="relative h-[300px] sm:h-[380px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-soft">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              className="object-cover grayscale-[15%] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 font-mono">
              <span>Punjab Board Tested</span>
              <span className="text-accent font-bold">BISE MULTAN / LAHORE</span>
            </div>
          </div>
        </Reveal>

        {/* 🎙️ Voice Learning Audio Player */}
        <Reveal delay={120} className="mt-6">
          <VoicePlayer
            title={article.title}
            textToRead={`${article.description}. ${article.intro}. ${article.quickWin || ""}`}
          />
        </Reveal>

        {/* ⚡ Section 10: QUICK WIN BOX */}
        {article.quickWin && (
          <Reveal delay={140} className="mt-8">
            <div className="rounded-2xl border-2 border-accent/40 bg-accent/10 p-5 shadow-brutalist-yellow">
              <div className="flex items-center gap-2 text-accent font-heading font-black text-xs tracking-wider uppercase">
                <Zap size={16} className="fill-accent text-accent" />
                <span>⚡ Quick Win</span>
              </div>
              <p className="mt-2 text-sm sm:text-base font-semibold leading-relaxed text-white">
                {article.quickWin}
              </p>
            </div>
          </Reveal>
        )}

        {/* 🧠 AI Strategy Summarizer & Mind Map */}
        <Reveal delay={150}>
          <ArticleSummarizer article={article} />
        </Reveal>

        {/* Intro Paragraph */}
        <Reveal delay={160} className="mt-8">
          <p className="text-base sm:text-lg leading-relaxed text-white/95 font-medium border-l-2 border-accent pl-4">
            {article.intro}
          </p>
        </Reveal>

        {/* Numbered Steps (if available) */}
        {article.steps && article.steps.length > 0 && (
          <div className="mt-10 space-y-3">
            <h2 className="font-heading text-lg font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-accent" />
              <span>Step-by-Step Game Plan:</span>
            </h2>
            <div className="space-y-2.5 pt-1">
              {article.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#121214] p-3.5 text-sm text-white/90"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-heading font-black text-black">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Bullets / Insights */}
        <div className="mt-12 space-y-7">
          {article.bullets.map((bullet, i) => (
            <Reveal key={bullet.label} delay={180 + i * 40}>
              <div className="border-l-2 border-white/20 hover:border-accent pl-5 py-1 transition-colors">
                <h3 className="font-heading text-lg font-bold text-white">
                  {bullet.label}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted">
                  {bullet.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Concrete Example / Box (if present) */}
        {article.example && (
          <Reveal delay={280} className="mt-10">
            <div className="rounded-2xl border border-white/15 bg-black/60 p-5 font-mono text-xs text-white/90 shadow-inner">
              <p className="font-heading text-[11px] font-black uppercase tracking-wider text-accent mb-2">
                PRACTICAL EXAM SHEET EXAMPLE:
              </p>
              <pre className="whitespace-pre-wrap font-mono text-[11px] sm:text-xs leading-relaxed text-white/80 bg-white/5 p-3 rounded-xl border border-white/5">
                {article.example}
              </pre>
            </div>
          </Reveal>
        )}

        {/* ⚠️ Section 11: COMMON MISTAKE BOX (DON'T DO THIS) */}
        {article.mistakes && article.mistakes.length > 0 && (
          <Reveal delay={300} className="mt-10">
            <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5">
              <div className="flex items-center gap-2 text-red-400 font-heading font-black text-xs tracking-wider uppercase">
                <AlertTriangle size={16} />
                <span>⚠️ DON&apos;T DO THIS (Common Mistakes)</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-red-200/90 leading-relaxed">
                {article.mistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">&times;</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {/* 💡 Section 12: FINAL TIP BOX */}
        <Reveal delay={340} className="mt-12">
          <Card
            tilt={false}
            depth="yellow"
            className="border-2 border-accent/40 bg-[#121214] p-6 sm:p-8"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex rounded-lg bg-accent p-1.5 text-black">
                <Lightbulb size={18} strokeWidth={2.5} />
              </span>
              <span className="font-heading text-xs font-black uppercase tracking-wider text-accent">
                FINAL TIP
              </span>
            </div>
            <p className="mt-3 text-base sm:text-lg font-bold leading-relaxed text-white">
              {article.finalTip}
            </p>
          </Card>
        </Reveal>

        {/* Tags bar at end of article */}
        <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <span className="text-xs font-mono text-muted/70 py-1">Tags:</span>
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/strategies?tag=${encodeURIComponent(tag)}`}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-muted hover:border-accent hover:text-accent transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* 📚 Section 13: RELATED STRATEGIES (3 Articles) */}
      {relatedArticles.length > 0 && (
        <div className="mx-auto mt-20 max-w-site border-t border-white/10 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-heading text-xs font-black uppercase tracking-wider text-accent">
                Next In Playbook
              </span>
              <h2 className="mt-1 font-heading text-2xl font-extrabold text-white">
                Related Exam Strategies
              </h2>
            </div>
            <Link
              href="/strategies"
              className="text-xs font-heading font-bold text-accent hover:underline hidden sm:inline-block"
            >
              View Full Library (30+) &rarr;
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((rel, i) => (
              <Reveal key={rel.slug} delay={i * 60}>
                <ArticleCard
                  article={rel}
                  href={`/strategies/${rel.slug}`}
                />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
