"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Milestone, ArrowRight, Sparkles, BookOpen, Compass, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface Step {
  step: string;
  phase: string;
  title: string;
  focus: string;
  actionLabel: string;
  href: string;
  tip: string;
}

const ROADMAP_STEPS: Step[] = [
  {
    step: "01",
    phase: "Phase 1: Diagnostic",
    title: "Understand the Board Scheme",
    focus: "Analyze official pairing schemes, chapter weightages, and 5-year pattern frequency.",
    actionLabel: "View Pairing Schemes",
    href: "/strategies/pak-studies-time-management",
    tip: "80% of marks come from 40% of the syllabus chapters in Punjab Board pairing.",
  },
  {
    step: "02",
    phase: "Phase 2: Execution",
    title: "Master Given-ToFind Formulations",
    focus: "Derivations, units, scientific formulas, and apparatus diagrams in Physics and Chemistry.",
    actionLabel: "Physics & Chem Guides",
    href: "/strategies/chemistry-diagrams",
    tip: "Writing 'Given' and 'Formula' correctly guarantees 2 out of 5 marks even if calculations slip.",
  },
  {
    step: "03",
    phase: "Phase 3: Elimination",
    title: "Strip MCQ Traps & Speed Pacing",
    focus: "Cut MCQ answering time from 20 minutes to 10 minutes using binary elimination.",
    actionLabel: "MCQ Elimination Hack",
    href: "/strategies/math-mcq-elimination",
    tip: "Never guess blindly: eliminating two distractor options doubles your hit rate to 50%.",
  },
  {
    step: "04",
    phase: "Phase 4: Presentation",
    title: "Implement the 1.5\" Margin Rule",
    focus: "Cut marker 605/604 main headings, ruled margins, and boxed numerical answers.",
    actionLabel: "Presentation Studio",
    href: "/paper-hacks",
    tip: "Board examiners spend an average of 110 seconds checking an entire 75-mark booklet.",
  },
  {
    step: "05",
    phase: "Phase 5: Exam Ready",
    title: "Drill Timed 3-Hour Simulations",
    focus: "Complete mock tests with bubble sheet filling and strict 20-minute buffer allocation.",
    actionLabel: "Launch Mock Test",
    href: "/mock-tests",
    tip: "Always stop long questions with 20 minutes left to cross-check question numbers.",
  },
];

export default function Roadmap3D() {
  const { isRTL } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative w-full max-w-full min-w-0 border-t border-white/10 bg-[#060608] py-20 sm:py-28 overflow-hidden">
      {/* 3D Rail Background Gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.06)_0%,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] font-bold text-accent uppercase tracking-wider mb-3">
            <Milestone size={13} />
            <span>Interactive 3D Pathway</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            The 5-Step Roadmap to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ffe570] to-[#c9a66b]">
              Board Topper Status
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted">
            The exact journey followed by students jumping from 800 to 1050+ marks without enrolling in expensive academies.
          </p>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="relative grid gap-6 lg:grid-cols-5">
          {ROADMAP_STEPS.map((item, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(idx)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-accent/60 bg-[#121216] shadow-brutalist-yellow"
                    : "border-white/10 bg-[#0a0a0d]/70 hover:border-white/20"
                }`}
              >
                {/* Step Connector Line */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span
                    className={`font-mono text-xl font-black ${
                      isActive ? "text-accent" : "text-white/40"
                    }`}
                  >
                    {item.step}
                  </span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-muted">
                    {item.phase}
                  </span>
                </div>

                <div className="mt-4">
                  <h3
                    className={`font-heading text-base font-bold transition-colors ${
                      isActive ? "text-white" : "text-white/80 group-hover:text-white"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {item.focus}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="rounded-xl bg-black/40 border border-white/5 p-2.5 text-[11px] font-mono text-accent/90 mb-4">
                    💡 {item.tip}
                  </div>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 font-heading text-xs font-bold text-accent group-hover:underline"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
