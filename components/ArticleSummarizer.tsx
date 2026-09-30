"use client";

import { useState } from "react";
import { Sparkles, CheckSquare, Zap, Network, ChevronDown, ChevronUp } from "lucide-react";
import { StrategyArticle } from "@/lib/content";

interface ArticleSummarizerProps {
  article: StrategyArticle;
}

export default function ArticleSummarizer({ article }: ArticleSummarizerProps) {
  const [activeView, setActiveView] = useState<"points" | "revision" | "mindmap">("points");
  const [expanded, setExpanded] = useState(true);

  // Extract 5 high-yield points deterministically
  const keyPoints = [
    article.quickWin || article.intro.slice(0, 140) + "...",
    article.bullets[0] ? `${article.bullets[0].label}: ${article.bullets[0].text}` : "Master core definitions first.",
    article.bullets[1] ? `${article.bullets[1].label}: ${article.bullets[1].text}` : "Highlight steps with a 605/604 marker.",
    article.mistakes && article.mistakes[0]
      ? `Avoid Trap: ${article.mistakes[0]}`
      : "Manage your time: allocate max 1.5 min per short question mark.",
    article.finalTip || "Write clean Solution Sets and draw neat pencil margins.",
  ];

  const quickRevisionItems = [
    { label: "Core Concept", text: article.description },
    { label: "Quick Win Rule", text: article.quickWin || "Focus on high-frequency questions first." },
    { label: "Board Trap", text: (article.mistakes && article.mistakes[0]) || "Don't spend over 20 minutes on MCQs." },
    { label: "Golden Rule", text: article.finalTip },
  ];

  return (
    <div className="my-8 rounded-2xl border border-accent/25 bg-[#121215] p-5 sm:p-6 shadow-soft">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-black font-black">
            <Sparkles size={14} />
          </div>
          <div>
            <h3 className="font-heading text-sm font-black text-white flex items-center gap-2">
              AI Strategy Summarizer &amp; Mind Map
              <span className="rounded bg-accent/20 px-1.5 py-0.2 text-[9px] font-mono text-accent">
                Quick Revision
              </span>
            </h3>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveView("points")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-heading font-bold transition-colors ${
              activeView === "points"
                ? "bg-accent text-black"
                : "text-muted hover:text-white"
            }`}
          >
            <CheckSquare size={12} />
            <span>5 Key Points</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("revision")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-heading font-bold transition-colors ${
              activeView === "revision"
                ? "bg-accent text-black"
                : "text-muted hover:text-white"
            }`}
          >
            <Zap size={12} />
            <span>Quick Revision</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("mindmap")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-heading font-bold transition-colors ${
              activeView === "mindmap"
                ? "bg-accent text-black"
                : "text-muted hover:text-white"
            }`}
          >
            <Network size={12} />
            <span>Mind Map</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-4">
        {/* VIEW 1: 5 Key Points */}
        {activeView === "points" && (
          <div className="space-y-2.5">
            {keyPoints.map((pt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/90"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/15 font-mono text-xs font-bold text-accent">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-sans">{pt}</span>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: Quick Revision */}
        {activeView === "revision" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {quickRevisionItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs"
              >
                <div className="font-heading font-black text-accent uppercase tracking-wider text-[11px] mb-1">
                  {item.label}
                </div>
                <p className="text-white/85 leading-relaxed font-sans">{item.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 3: Lightweight HTML/CSS Mind Map */}
        {activeView === "mindmap" && (
          <div className="overflow-x-auto py-2">
            <div className="min-w-[500px] flex items-center justify-between gap-6 p-4">
              {/* Central Core Concept Node */}
              <div className="flex-1 max-w-[180px] rounded-2xl border-2 border-accent bg-accent/15 p-4 text-center shadow-brutalist-yellow">
                <span className="block font-heading text-xs font-black uppercase text-accent">
                  {article.category}
                </span>
                <span className="mt-1 block font-heading text-sm font-bold text-white line-clamp-2">
                  {article.title}
                </span>
              </div>

              {/* Connecting branches */}
              <div className="flex-1 space-y-3">
                {article.bullets.slice(0, 3).map((b, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl border border-white/15 bg-white/[0.03] p-3 text-xs text-left"
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-accent uppercase text-[10px]">
                      <span>Branch {idx + 1}:</span>
                      <span>{b.label}</span>
                    </div>
                    <p className="mt-1 text-white/80 line-clamp-2">{b.text}</p>
                  </div>
                ))}
              </div>

              {/* Final Outcome Node */}
              <div className="flex-1 max-w-[160px] rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
                <span className="block font-heading text-[10px] font-black uppercase text-emerald-400">
                  Target Outcome
                </span>
                <span className="mt-1 block font-heading text-xs font-bold text-white">
                  Full Board Marks (No Red-Pen Deductions)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
