"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ProblemOption {
  id: string;
  emoji: string;
  label: string;
  problemName: string;
  prescriptionLine1: string;
  prescriptionLine2: string;
  methodLink: string;
  whatsappParam: string;
}

export const problemOptions: ProblemOption[] = [
  {
    id: "forget",
    emoji: "😭",
    label: "I forget everything",
    problemName: "I Forget Everything in the Exam Hall",
    prescriptionLine1: "Use the 24-hour spaced revision cycle and trigger-word flashsheets instead of re-reading full chapters.",
    prescriptionLine2: "Jot key formulas and heading skeletons on your rough margin in the first 2 minutes of the paper.",
    methodLink: "/paper-hacks",
    whatsappParam: "I have problem with forgetting everything in exams",
  },
  {
    id: "time",
    emoji: "⏰",
    label: "I run out of time",
    problemName: "I Run Out of Time on Long Questions",
    prescriptionLine1: "Enforce the strict 1.2-minute-per-mark allocation formula on Section II long questions.",
    prescriptionLine2: "Lock Question 9 theorem in the first 45 minutes and keep a compulsory 15-minute final audit buffer.",
    methodLink: "/strategies/3-hour-formula",
    whatsappParam: "I have problem with running out of time in papers",
  },
  {
    id: "messy",
    emoji: "✍️",
    label: "My paper gets messy",
    problemName: "My Paper Presentation Gets Messy & Cut-Heavy",
    prescriptionLine1: "Rule double margins on the left edge only, use 605 cut-marker for 2-level headings with 2-finger indent.",
    prescriptionLine2: "Draw a single crisp horizontal pencil strike through blunders instead of whitener liquid scribble.",
    methodLink: "/paper-hacks",
    whatsappParam: "I have problem with messy paper presentation",
  },
  {
    id: "maths",
    emoji: "📐",
    label: "Maths questions destroy me",
    problemName: "Maths Questions & Geometry Destroy My Score",
    prescriptionLine1: "Isolate Section II into guaranteed scoring pairs: Matrices/Quadratic + Theorem 9 + Variations.",
    prescriptionLine2: "Box all intermediate values and final answers with units in blue marker for guaranteed partial credit.",
    methodLink: "/strategies/math-long-question-time",
    whatsappParam: "I have problem with Maths questions destroying me",
  },
  {
    id: "chemistry",
    emoji: "🧪",
    label: "Chemistry feels confusing",
    problemName: "Chemistry Equations & Organic Mechanisms Feel Confusing",
    prescriptionLine1: "Group organic reactions by functional group pathways and write catalyst conditions above the arrow.",
    prescriptionLine2: "Examiners grade balanced stoichiometric coefficients and physical states (s, l, g, aq) first.",
    methodLink: "/strategies/chemistry-equation-presentation",
    whatsappParam: "I have problem with Chemistry feeling confusing",
  },
  {
    id: "physics",
    emoji: "⚡",
    label: "Physics numericals",
    problemName: "Physics Numericals & Formula Selection Confuse Me",
    prescriptionLine1: "Standardize the 4-box layout: Given Data with SI units, Formula, Substitution, and Boxed Answer.",
    prescriptionLine2: "Never leave numerical working without standard units (N, J, W, m/s²) to avoid losing 1 mark per question.",
    methodLink: "/strategies/physics-numerical-layout",
    whatsappParam: "I have problem with Physics numericals",
  },
  {
    id: "english",
    emoji: "📖",
    label: "English writing",
    problemName: "English Essay Length & Translation Mistakes Cost Marks",
    prescriptionLine1: "Structure 15-mark essays into the 3-pillar method with 2 authentic quotations spaced per sheet.",
    prescriptionLine2: "Maintain tense consistency in translation without vocabulary guessing to secure full grammar marks.",
    methodLink: "/strategies/english-essay-length",
    whatsappParam: "I have problem with English writing",
  },
  {
    id: "start",
    emoji: "🧠",
    label: "I don't know where to start",
    problemName: "I Am Overwhelmed & Don't Know Where to Start",
    prescriptionLine1: "Follow the 80/20 Board Pairing Scheme: solve repeated past 5-year exercise questions first.",
    prescriptionLine2: "Lock compulsory 8-mark theorems and practical MCQs before attempting low-yield theoretical derivations.",
    methodLink: "/resources",
    whatsappParam: "I have problem with not knowing where to start",
  },
];

export default function ProblemFinder() {
  const [selectedId, setSelectedId] = useState<string>("forget");

  const selectedProblem = problemOptions.find((p) => p.id === selectedId) || problemOptions[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const whatsappUrl = `https://wa.me/923084703973?text=${encodeURIComponent(selectedProblem.whatsappParam)}`;

  return (
    <div className="mb-14 rounded-2xl border-2 border-white/10 bg-[#0E0E10] p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
      {/* Header section with Badge, Title, and Subtitle */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/15 px-2.5 py-1 text-[11px] font-heading font-black tracking-widest text-accent uppercase shadow-[0_0_12px_rgba(255,214,10,0.2)]">
          <Sparkles size={12} className="text-accent" />
          SIGNATURE TOOL
        </div>

        <h2 className="mt-3 font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          I Have a Problem?
        </h2>

        <p className="mt-1.5 text-sm sm:text-base text-muted font-medium">
          Tap your struggle, get exact solution
        </p>
      </div>

      {/* 8 Big Interactive Buttons in Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {problemOptions.map((problem) => {
          const isSelected = selectedId === problem.id;

          return (
            <motion.button
              key={problem.id}
              type="button"
              onClick={() => handleSelect(problem.id)}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              aria-pressed={isSelected}
              className={`group relative flex min-h-[80px] w-full items-center gap-3.5 rounded-[16px] border-2 p-4 text-left transition-colors duration-150 cursor-pointer select-none ${
                isSelected
                  ? "border-[#FFD60A] bg-[#FFD60A] text-black shadow-brutalist-yellow -translate-y-0.5"
                  : "border-white/15 bg-[#0A0A0A] text-white hover:border-[#FFD60A]/50 hover:bg-[#141416] shadow-soft"
              }`}
            >
              <span className="text-2xl sm:text-3xl shrink-0 transition-transform group-hover:scale-110">
                {problem.emoji}
              </span>
              <span className={`font-heading text-sm sm:text-[15px] font-bold leading-tight ${
                isSelected ? "text-black font-extrabold" : "text-white/95 group-hover:text-white"
              }`}>
                {problem.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Yellow Result Box Below */}
      <AnimatePresence mode="wait">
        {selectedProblem && (
          <motion.div
            key={selectedProblem.id}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 rounded-[16px] border-2 border-black bg-[#FFD60A] p-5 sm:p-7 text-black shadow-[6px_6px_0_#000000]"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-black/80">
              <CheckCircle2 size={15} className="text-black" />
              <span>DIAGNOSTIC PRESCRIPTION</span>
            </div>

            <h3 className="mt-2 font-heading text-xl sm:text-2xl font-black text-black tracking-tight">
              {selectedProblem.emoji} {selectedProblem.problemName}
            </h3>

            {/* 2-line solution prescription */}
            <div className="mt-3 space-y-1.5 border-l-4 border-black pl-3 text-sm sm:text-base font-semibold text-black/90 leading-relaxed">
              <p>{selectedProblem.prescriptionLine1}</p>
              <p>{selectedProblem.prescriptionLine2}</p>
            </div>

            {/* Two Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <motion.div whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 450, damping: 25 }}>
                <Link
                  href={selectedProblem.methodLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-black px-5 py-3 font-heading text-xs sm:text-sm font-black text-white hover:bg-neutral-900 transition-colors shadow-[2px_2px_0_rgba(0,0,0,0.5)] cursor-pointer"
                >
                  <span>See Method</span>
                  <ArrowRight size={15} />
                </Link>
              </motion.div>

              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#25D366] px-5 py-3 font-heading text-xs sm:text-sm font-black text-black hover:bg-[#20bd5a] transition-colors shadow-[2px_2px_0_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <MessageCircle size={16} className="text-black" />
                <span>Ask on WhatsApp</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
