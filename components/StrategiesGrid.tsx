"use client";

import { useState } from "react";
import { StrategyArticle, StrategyCategory } from "@/lib/content";
import ArticleCard from "./ArticleCard";
import Reveal from "./Reveal";

interface StrategiesGridProps {
  articles: StrategyArticle[];
  allArticles?: StrategyArticle[];
  selectedCategory?: string;
  selectedTag?: string;
  onSelectCategory?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  onResetFilters?: () => void;
}

export const strategyCategories = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Pakistan Studies",
  "Islamiat",
  "Computer Science",
  "Exam Hacks",
  "Time Management",
  "Mindset",
] as const;

export default function StrategiesGrid({
  articles,
  allArticles,
  selectedCategory,
  selectedTag,
  onSelectCategory,
  onTagClick,
  onResetFilters,
}: StrategiesGridProps) {
  const [internalCategory, setInternalCategory] = useState<string>("All");

  const activeCategory = selectedCategory !== undefined ? selectedCategory : internalCategory;

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const pool = allArticles || articles;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr]">
      {/* Category filters */}
      <div>
        {/* Mobile: horizontal scroll pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar lg:hidden">
          {strategyCategories.map((cat) => {
            const count =
              cat === "All"
                ? pool.length
                : pool.filter(
                    (a) =>
                      a.category === cat ||
                      (cat === "Mathematics" && a.category === ("Math" as StrategyCategory))
                  ).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-heading font-bold transition-all cursor-pointer select-none ${
                  isActive
                    ? "bg-accent text-black shadow-brutalist-yellow translate-x-[-1px] translate-y-[-1px]"
                    : "border border-white/10 bg-[#141416] text-muted hover:border-white/20 hover:text-white"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Desktop: vertical sidebar */}
        <div className="hidden lg:block sticky top-24 space-y-1 rounded-2xl border border-white/10 card-surface p-3 shadow-soft">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-1">
            <span className="font-heading text-xs font-black uppercase tracking-wider text-muted/70">
              Categories
            </span>
            <span className="text-[10px] font-mono text-accent">
              {pool.length} Guides
            </span>
          </div>
          {strategyCategories.map((cat) => {
            const count =
              cat === "All"
                ? pool.length
                : pool.filter(
                    (a) =>
                      a.category === cat ||
                      (cat === "Mathematics" && a.category === ("Math" as StrategyCategory))
                  ).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer select-none ${
                  isActive
                    ? "bg-accent text-black font-bold shadow-brutalist-yellow translate-x-[-2px] translate-y-[-2px]"
                    : "text-muted hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="font-heading truncate text-left mr-2">{cat}</span>
                <span
                  className={`text-[11px] font-mono shrink-0 ${
                    isActive ? "text-black font-extrabold" : "text-muted/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      <div>
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-white/10 card-surface p-12 text-center text-muted">
            <p className="font-heading text-base text-white/90 font-bold">
              No strategies found
            </p>
            <p className="mt-1.5 text-sm text-muted max-w-md mx-auto">
              No strategies matched your query or active filters. Try searching for &lsquo;MCQ&rsquo;, &lsquo;Diagrams&rsquo;, or &lsquo;Presentation&rsquo;.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {activeCategory !== "All" && (
                <button
                  type="button"
                  onClick={() => handleCategoryClick("All")}
                  className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-heading font-bold text-accent hover:border-accent transition-colors cursor-pointer"
                >
                  Switch to All Categories ({pool.length})
                </button>
              )}
              {selectedTag && selectedTag !== "All" && onTagClick && (
                <button
                  type="button"
                  onClick={() => onTagClick("All")}
                  className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-heading font-bold text-accent hover:border-accent transition-colors cursor-pointer"
                >
                  Clear Tag Filter (#{selectedTag})
                </button>
              )}
              {onResetFilters && (
                <button
                  type="button"
                  onClick={() => {
                    handleCategoryClick("All");
                    onResetFilters();
                  }}
                  className="rounded-xl border border-white/20 bg-[#161618] px-4 py-2 text-xs font-heading font-bold text-white hover:border-accent hover:text-accent transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article, i) => (
              <Reveal key={article.slug} delay={(i % 2) * 60}>
                <ArticleCard
                  article={article}
                  href={`/strategies/${article.slug}`}
                  onTagClick={onTagClick}
                  activeTag={selectedTag}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
