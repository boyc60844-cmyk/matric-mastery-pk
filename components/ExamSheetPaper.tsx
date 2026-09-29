"use client";

import React from "react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExamSheetPaperProps {
  subject?: string;
  board?: string;
  rollNo?: string;
  paperCode?: string;
  pageNumber?: string;
  questionNumber?: string;
  questionTitle?: string;
  givenRequired?: {
    given: string[];
    toFind: string;
  };
  steps?: Array<{
    title?: string;
    content?: string;
    formula?: string;
    result?: string;
  }>;
  annotation?: string;
  checkerMark?: {
    marks: string;
    comment?: string;
  };
  className?: string;
  compact?: boolean;
}

export default function ExamSheetPaper({
  subject = "PHYSICS",
  board = "BISE MULTAN",
  rollNo = "482910",
  paperCode = "6012",
  pageNumber = "02",
  questionNumber = "Q.5 (b)",
  questionTitle = "Numerical Problem: Energy Conversion",
  givenRequired = {
    given: ["Mass (m) = 50 kg", "Velocity (v) = 10 m s⁻¹"],
    toFind: "Kinetic Energy (K.E.) = ?",
  },
  steps = [
    {
      title: "Formula:",
      formula: "K.E. = ½ m v²",
      content: "Substitution: K.E. = ½ × (50 kg) × (10 m s⁻¹)²",
      result: "K.E. = 2500 J",
    },
  ],
  annotation = "+1 Mark for Boxed Result & SI Unit",
  checkerMark = {
    marks: "05 / 05",
    comment: "Excellent Presentation",
  },
  className = "",
  compact = false,
}: ExamSheetPaperProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/15 bg-[#0F0F12] shadow-2xl overflow-hidden preserve-3d transition-transform duration-300",
        compact ? "p-4 text-xs" : "p-5 sm:p-6 text-xs sm:text-sm",
        className
      )}
    >
      {/* Top Punch Hole visual for Board Answer Book */}
      <div className="absolute top-3 left-4 flex gap-1.5 opacity-40 pointer-events-none">
        <span className="h-2 w-2 rounded-full border border-white/40 bg-black/80" />
      </div>

      {/* Sheet Official Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 pl-5 text-[10px] sm:text-[11px] font-mono text-muted">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-bold text-white tracking-wider">{board}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>ROLL: <strong className="text-white font-mono">{rollNo}</strong></span>
          <span className="hidden sm:inline">CODE: {paperCode}</span>
          <span className="font-heading font-bold text-accent uppercase tracking-wider">{subject}</span>
        </div>
      </div>

      {/* Main Ruled Exam Sheet Body */}
      <div className="relative mt-4 pl-4 border-l-2 border-red-500/30 exam-paper-pattern rounded-r-lg p-2 sm:p-3">
        {/* Left 1.5-inch Margin Tag */}
        <div className="absolute -left-1.5 top-0 font-mono text-[8px] text-red-400/60 uppercase rotate-90 origin-top-left pointer-events-none select-none">
          1.5&quot; Margin
        </div>

        {/* Question Heading with Blue/Accent Underline */}
        <div className="inline-block border-b-2 border-accent pb-0.5">
          <span className="font-heading font-extrabold text-white text-xs sm:text-sm">
            {questionNumber}
          </span>
          <span className="ml-2 font-heading font-semibold text-muted text-xs sm:text-sm">
            {questionTitle}
          </span>
        </div>

        {/* Given and Required Data Block */}
        {givenRequired && (
          <div className="mt-3 rounded-lg bg-black/40 border border-white/5 p-2.5 sm:p-3 font-mono text-[11px] sm:text-xs text-white/80 space-y-1">
            <p className="font-heading text-accent font-bold text-[10px] tracking-wider uppercase">
              Given Data:
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/90">
              {givenRequired.given.map((g, idx) => (
                <span key={idx}>&bull; {g}</span>
              ))}
            </div>
            <p className="font-heading text-accent font-bold text-[10px] tracking-wider uppercase pt-1">
              To Calculate:
            </p>
            <p className="text-white/90">&bull; {givenRequired.toFind}</p>
          </div>
        )}

        {/* Formula and Working Steps */}
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="mt-3 rounded-lg bg-black/40 border border-white/5 p-2.5 sm:p-3 font-mono text-[11px] sm:text-xs text-white/80 space-y-1.5"
          >
            {step.title && (
              <p className="font-heading text-accent font-bold text-[10px] tracking-wider uppercase">
                {step.title}
              </p>
            )}
            {step.formula && (
              <p className="font-mono text-white font-bold text-xs sm:text-sm bg-white/5 px-2 py-0.5 rounded inline-block">
                {step.formula}
              </p>
            )}
            {step.content && (
              <p className="text-muted text-[10px] sm:text-[11px] pt-0.5">
                {step.content}
              </p>
            )}
            {step.result && (
              <div className="pt-2 flex items-center justify-between">
                <span className="font-heading text-white text-[11px] font-semibold">Final Result:</span>
                <span className="rounded border-2 border-accent bg-accent/15 px-2.5 py-0.5 font-mono font-bold text-accent shadow-sm">
                  {step.result}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Annotation Tag */}
        {annotation && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-mono text-accent">
            <AlertCircle size={10} />
            <span>{annotation}</span>
          </div>
        )}
      </div>

      {/* Sheet Footer with Checker Signature & Marks */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Check size={13} strokeWidth={3} />
          <span>{checkerMark.comment || "Checker Verified"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted/70">PAGE {pageNumber} OF 14</span>
          <span className="rounded bg-accent px-2 py-0.5 font-heading font-black text-black text-[11px]">
            {checkerMark.marks}
          </span>
        </div>
      </div>
    </div>
  );
}
