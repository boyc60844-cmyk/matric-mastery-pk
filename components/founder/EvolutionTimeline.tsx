"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EVOLUTION_STAGES } from "@/lib/founderStoryData";

export default function EvolutionTimeline() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const currentStage = EVOLUTION_STAGES[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : EVOLUTION_STAGES.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < EVOLUTION_STAGES.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Stage Selector List */}
      <div className="lg:col-span-5">
        <div
          role="tablist"
          aria-label="Platform Evolution Stages"
          className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0"
        >
          {EVOLUTION_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 cursor-pointer shrink-0 min-w-[210px] lg:min-w-0 lg:w-full min-h-[52px] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "border-accent bg-accent/[0.08]"
                    : "border-white/10 bg-[#111114] hover:border-white/25 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold tabular-nums shrink-0 ${
                      isActive ? "text-accent" : "text-neutral-500"
                    }`}
                  >
                    {stage.step}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={`font-heading text-sm font-bold truncate ${
                        isActive ? "text-white" : "text-neutral-300"
                      }`}
                    >
                      {stage.title}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 truncate">
                      {stage.label}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Reading Canvas */}
      <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#101014] p-6 sm:p-8 flex flex-col justify-between min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.id}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-accent font-bold tabular-nums">
                  Stage {currentStage.step} of 0{EVOLUTION_STAGES.length}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentStage.phaseNote}</span>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {currentStage.label}
              </span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {currentStage.title}
            </h3>

            <p className="text-base leading-relaxed text-neutral-300">
              {currentStage.summary}
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Key Focus
              </div>
              <ul className="space-y-2">
                {currentStage.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-neutral-200 leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Step Controls */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-mono text-neutral-500">
            Navigate platform stages
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous evolution stage"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-300 hover:border-white/25 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next evolution stage"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-300 hover:border-accent/50 hover:text-accent transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
