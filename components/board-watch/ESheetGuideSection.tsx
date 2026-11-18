"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BW_TWEEN_INTERACTIVE,
  CollapsiblePanel,
  ScrollRevealDiv,
  ScrollRevealSection,
  TabSwitchPanel,
} from "@/components/board-watch/BoardWatchMotion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  ExternalLink,
  FileText,
  HelpCircle,
  Info,
  Layers,
  PenTool,
  QrCode,
  ScanLine,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  AVOID_MARK_LOSS_MISTAKES,
  ESHEET_FAQS,
  ESHEET_OFFICIAL_SOURCES,
  ESHEET_WORKFLOW_STEPS,
  EXAM_MODES_COMPARISON,
  FBISE_MILESTONES,
  FBISE_VERIFIED_SAMPLES,
  PUNJAB_ROLLOUT_TIMELINE,
  PUNJAB_SUBJECT_COVERAGE_ROWS,
  PUNJAB_VS_FBISE_COMPARISON,
  STATIONERY_GUIDE_ITEMS,
  STUDENT_STEP_BY_STEP_GUIDE,
  VerificationBadgeKind,
} from "@/lib/eSheetGuideData";

interface ESheetGuideSectionProps {
  onOpenNewsFilter: () => void;
}

const SECTION_NAV_LINKS = [
  { id: "esheet-news", label: "1. Latest News" },
  { id: "esheet-how-it-works", label: "2. How It Works" },
  { id: "esheet-timeline", label: "3. Punjab Timeline" },
  { id: "esheet-subjects", label: "4. Subject Coverage" },
  { id: "esheet-student-guide", label: "5. Step-by-Step Guide" },
  { id: "esheet-stationery", label: "6. Stationery" },
  { id: "esheet-mistakes", label: "7. Avoid Mark Loss (14)" },
  { id: "esheet-fbise", label: "8. FBISE (Separate)" },
  { id: "esheet-sources-faqs", label: "9. Sources & FAQs" },
];

function StatusChip({ status }: { status: VerificationBadgeKind }) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
        <CheckCircle2 size={11} />
        CONFIRMED
      </span>
    );
  }
  if (status === "OFFICIAL BOARD UPDATE") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-teal-400/35 bg-teal-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-teal-300">
        <CheckCircle2 size={11} />
        OFFICIAL BOARD UPDATE
      </span>
    );
  }
  if (status === "REPORTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-300">
        <Info size={11} />
        REPORTED
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
      <Clock size={11} />
      AWAITING OFFICIAL CONFIRMATION
    </span>
  );
}

export default function ESheetGuideSection({ onOpenNewsFilter }: ESheetGuideSectionProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>(PUNJAB_ROLLOUT_TIMELINE[0].id);
  const [visualMode, setVisualMode] = useState<"correct" | "incorrect">("correct");
  const [mistakeFilter, setMistakeFilter] = useState<"all" | "Critical" | "High" | "Medium">("all");
  const [openFaqId, setOpenFaqId] = useState<string>(ESHEET_FAQS[0].id);
  const prefersReducedMotion = useReducedMotion();

  const selectedStage =
    PUNJAB_ROLLOUT_TIMELINE.find((s) => s.id === selectedStageId) ?? PUNJAB_ROLLOUT_TIMELINE[0];

  const filteredMistakes = AVOID_MARK_LOSS_MISTAKES.filter((m) =>
    mistakeFilter === "all" ? true : m.severity === mistakeFilter
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-10">
      {/* HERO INTRO + 9-SECTION QUICK NAVIGATION */}
      <ScrollRevealDiv
        y={10}
        duration={0.44}
        className="rounded-3xl border border-accent/30 bg-[#121216] p-5 sm:p-8 space-y-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="rounded bg-accent px-2 py-0.5 font-black text-black">
                EDUCATIONAL HUB
              </span>
              <span className="text-accent font-bold">
                E-SHEETS &amp; ON-SCREEN MARKING (OSM)
              </span>
              <span aria-hidden="true" className="text-zinc-600">
                ·
              </span>
              <span className="text-zinc-400">Research Verified: 18 November 2026</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
              E-Sheet Guide — Understand the New Examination System
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Complete, source-verified guidance for Class 9–12 students covering{" "}
              <strong className="text-white">Punjab Boards</strong> (2026 Computer Science OSM
              pilots &amp; reported 2027 4-science-subject expansion) and{" "}
              <strong className="text-sky-300">FBISE</strong> (kept strictly separate below so you
              never mix rules across boards).
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewsFilter}
            className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-xs font-heading font-bold text-accent hover:bg-accent/20 active:scale-[0.98] transition-all duration-200 shrink-0 self-start lg:self-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <Layers size={14} />
            <span>Filter E-Sheet News Stories</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Section Anchor Navigation Bar */}
        <div className="pt-4 border-t border-white/10">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Quick Jump Inside E-Sheet Guide
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SECTION_NAV_LINKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] font-heading font-semibold text-zinc-200 hover:border-accent/50 hover:text-accent active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollRevealDiv>

      {/* ===================================================================
          1. LATEST E-SHEET NEWS SUMMARY
         =================================================================== */}
      <ScrollRevealSection id="esheet-news" className="scroll-mt-24 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase text-accent">
              Section 1 · Punjab Boards News Status
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Punjab Boards Move Towards E-Sheet Examinations and On-Screen Marking
            </h3>
          </div>
          <StatusChip status="REPORTED" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#141416] p-5 space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              On <strong className="text-white">11 November 2026</strong>, national education outlets
              (EduVision, ProPakistani, Pakistan Observer) reported on a joint meeting in Lahore of
              the chairpersons of Punjab&apos;s nine BISEs, chaired by BISE Lahore Chairman{" "}
              <strong className="text-white">Prof. Badrul Salam</strong> with the Deputy Secretary
              Higher Education and BISE Lahore Secretary{" "}
              <strong className="text-white">Rizwan Nazir</strong>.
            </p>
            <p>
              Participants agreed in principle to conduct examination papers for{" "}
              <strong className="text-white">four science subjects on E-Sheets</strong> and expand
              On-Screen Marking (OSM) in upcoming{" "}
              <strong className="text-white">2027 Matric and Intermediate</strong> examinations,
              forming specialized teams to standardize printing, scanning, and digital evaluation
              across all nine boards.
            </p>
            <p>
              Following up on infrastructure readiness, BISE Multan published an official update on{" "}
              <strong className="text-white">17 November 2026</strong> confirming that chairpersons
              and IT teams from all Punjab boards visited the{" "}
              <strong className="text-white">Pakistan Post Foundation, Islamabad</strong> as{" "}
              <strong className="text-teal-300">
                official implementation preparation for Annual Examinations 2027
              </strong>{" "}
              — reviewing answer-sheet printing presses, scanning mechanisms, and On-Screen Marking
              (OSM) operational arrangements (without confirming every class or subject yet).
            </p>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Key Distinction (Confirmed Board-Specific vs Reported 2027 Plan):</strong>{" "}
                Individual boards currently publish{" "}
                <strong className="text-emerald-300">board-specific Computer Science OSM resources</strong>:{" "}
                <strong className="text-white">BISE Multan only</strong> requires HSSC Second Annual
                2026 Computer Science Part-I &amp; Part-II candidates to attempt papers on E-Sheets;{" "}
                <strong className="text-white">BISE Lahore only</strong> hosts an official Computer
                Science OSM Answer Book &amp; Bubble Sheet PDF and a student/teacher OSM video
                tutorial on{" "}
                <a
                  href="https://www.biselahore.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-amber-300 hover:text-white"
                >
                  biselahore.com
                </a>{" "}
                (neither is universal Punjab-wide instruction); and{" "}
                <strong className="text-white">BISE D.G. Khan</strong> provides a 16-point 2nd
                Annual 2026 CS Candidate SOP PDF. Province-wide circulars fixing all four 2027
                science subjects for Matric &amp; Inter remain{" "}
                <strong className="text-sky-300">REPORTED / awaiting confirmation</strong>.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141416] p-5 space-y-3 text-xs">
            <h4 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={15} className="text-accent" />
              <span>Why Boards Are Introducing OSM</span>
            </h4>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-accent shrink-0 mt-0.5" />
                <span>Eliminates manual page-to-page mark totaling mistakes and unchecked pages.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-accent shrink-0 mt-0.5" />
                <span>
                  Removes physical paper-bundle transit risks; barcodes/QR codes anonymize candidate
                  identity.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-accent shrink-0 mt-0.5" />
                <span>
                  Enables examiner authentication, question-batch allocation, time tracking, and
                  electronic audit trails (reported in Express Tribune, 4 Oct 2026).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-accent shrink-0 mt-0.5" />
                <span>Reduces inter-examiner scoring inconsistency and speeds up result compilation.</span>
              </li>
            </ul>
          </div>
        </div>
      </ScrollRevealSection>

      {/* ===================================================================
          2. HOW E-SHEETS & ON-SCREEN MARKING WORK + COMPARISON TABLE
         =================================================================== */}
      <ScrollRevealSection id="esheet-how-it-works" className="scroll-mt-24 space-y-5">
        <div>
          <span className="font-mono text-[11px] font-bold uppercase text-accent">
            Section 2 · Visual Workflow &amp; System Clarification
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
            How E-Sheets and On-Screen Marking Work (7 Steps)
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Exams are still handwritten with a pen in your examination centre. Scanning and digital
            allocation happen <em>after</em> you hand over your booklet.
          </p>
        </div>

        {/* 7-Step Process Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ESHEET_WORKFLOW_STEPS.map((item, idx) => (
            <ScrollRevealDiv
              key={item.step}
              delay={Math.min(idx % 4, 3) * 0.05}
              duration={0.4}
              y={10}
              className="rounded-2xl border border-white/10 bg-[#141416] p-4 flex flex-col justify-between space-y-3 transition-colors duration-200 hover:border-white/20"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-black font-mono text-xs font-black">
                    {item.step}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-zinc-400">
                    {item.actor}
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-white">{item.title}</h4>
                <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">{item.summary}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-2.5 text-[11px] text-zinc-300">
                <strong className="text-accent">Student Note: </strong>
                {item.studentImpact}
              </div>
            </ScrollRevealDiv>
          ))}

          <ScrollRevealDiv
            delay={0.12}
            duration={0.4}
            y={10}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 flex flex-col justify-center space-y-2"
          >
            <div className="flex items-center gap-2 text-emerald-300 font-heading text-sm font-bold">
              <ScanLine size={16} />
              <span>Important Reality Check</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Students do <strong className="text-white">NOT</strong> type on laptops or take an
              online computer quiz. You write on special structured paper, and trained subject
              teachers mark your scanned writing on secure screens.
            </p>
          </ScrollRevealDiv>
        </div>

        {/* Comparison Table */}
        <ScrollRevealDiv className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5 space-y-3">
          <h4 className="font-heading text-base font-bold text-white">
            Traditional Copy vs E-Sheet vs On-Screen Marking vs Online Exam
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-mono uppercase text-zinc-400">
                  <th className="py-2.5 pr-4">System Mode</th>
                  <th className="py-2.5 pr-4">How Student Answers</th>
                  <th className="py-2.5 pr-4">Extra B-Sheets?</th>
                  <th className="py-2.5 pr-4">How Checked</th>
                  <th className="py-2.5">Board Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {EXAM_MODES_COMPARISON.map((row) => (
                  <tr key={row.mode} className="align-top">
                    <td className="py-3 pr-4">
                      <div className="font-heading font-bold text-white">{row.mode}</div>
                      <span className="font-mono text-[10px] text-accent">{row.tag}</span>
                    </td>
                    <td className="py-3 pr-4 text-zinc-300">{row.howStudentWrites}</td>
                    <td className="py-3 pr-4 text-zinc-300">{row.extraSheetsAllowed}</td>
                    <td className="py-3 pr-4 text-zinc-300">{row.howEvaluated}</td>
                    <td className="py-3 text-zinc-300">{row.punjabFbiseStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollRevealDiv>
      </ScrollRevealSection>

      {/* ===================================================================
          3. INTERACTIVE PUNJAB ROLLOUT TIMELINE (DESCRIPTIVE PHASES ONLY)
         =================================================================== */}
      <ScrollRevealSection id="esheet-timeline" className="scroll-mt-24 space-y-4">
        <div>
          <span className="font-mono text-[11px] font-bold uppercase text-accent">
            Section 3 · Punjab Implementation Plan (Strict Verification)
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
            Punjab Boards Implementation Timeline
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Select a rollout stage below to inspect verified board evidence versus details still
            awaiting official signed circulars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PUNJAB_ROLLOUT_TIMELINE.map((stage) => {
            const active = stage.id === selectedStage.id;
            return (
              <button
                key={stage.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedStageId(stage.id)}
                className={`rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
                  active
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-white/10 bg-[#141416] hover:border-white/25"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase text-accent">
                    {stage.timelineTag}
                  </span>
                  <StatusChip status={stage.statusBadge} />
                </div>
                <div className="font-heading text-sm font-bold text-white">{stage.stageLabel}</div>
                <div className="mt-1 text-[11px] font-mono text-zinc-400">{stage.timeframe}</div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Card */}
        <TabSwitchPanel panelKey={selectedStage.id}>
          <div className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h4 className="font-heading text-lg font-bold text-white">
                  {selectedStage.stageLabel}
                </h4>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  {selectedStage.authorityBasis}
                </p>
              </div>
              <StatusChip status={selectedStage.statusBadge} />
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedStage.scopeSummary}
            </p>

            <ul className="space-y-1.5 rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs text-zinc-200">
              {selectedStage.verifiedBoardsAndSubjects.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3.5">
                <strong className="block text-emerald-300 font-heading mb-1">
                  What Is Verified Now:
                </strong>
                <p className="text-zinc-300 leading-relaxed">{selectedStage.whatIsConfirmed}</p>
              </div>
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-3.5">
                <strong className="block text-amber-300 font-heading mb-1">
                  What Still Awaits Confirmation:
                </strong>
                <p className="text-zinc-300 leading-relaxed">
                  {selectedStage.whatAwaitsConfirmation}
                </p>
              </div>
            </div>
          </div>
        </TabSwitchPanel>
      </ScrollRevealSection>

      {/* ===================================================================
          4. PUNJAB SUBJECT COVERAGE TABLE
         =================================================================== */}
      <ScrollRevealSection id="esheet-subjects" className="scroll-mt-24 space-y-4">
        <div>
          <span className="font-mono text-[11px] font-bold uppercase text-accent">
            Section 4 · Which Subjects Are Covered?
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
            Punjab Boards Subject Coverage Status (As of 18 November 2026)
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-mono uppercase text-zinc-400">
                  <th className="py-2.5 pr-4">Subject / Group</th>
                  <th className="py-2.5 pr-4">Class Level</th>
                  <th className="py-2.5 pr-4">Verification Status</th>
                  <th className="py-2.5 pr-4">Verified Basis</th>
                  <th className="py-2.5">What Students Should Do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {PUNJAB_SUBJECT_COVERAGE_ROWS.map((row) => (
                  <tr key={row.subjectOrGroup} className="align-top">
                    <td className="py-3 pr-4 font-heading font-bold text-white">
                      {row.subjectOrGroup}
                    </td>
                    <td className="py-3 pr-4 font-mono text-zinc-300">{row.level}</td>
                    <td className="py-3 pr-4">
                      <StatusChip status={row.status} />
                    </td>
                    <td className="py-3 pr-4 text-zinc-300">{row.currentEvidence}</td>
                    <td className="py-3 text-zinc-200">{row.studentAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollRevealSection>

      {/* ===================================================================
          5. STEP-BY-STEP STUDENT GUIDE & INTERACTIVE SHEET PLACEMENT VISUAL
         =================================================================== */}
      <ScrollRevealSection id="esheet-student-guide" className="scroll-mt-24 space-y-5">
        <div>
          <span className="font-mono text-[11px] font-bold uppercase text-accent">
            Section 5 · Hall Execution Checklist &amp; Placement Diagram
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
            How to Attempt an E-Sheet Paper Correctly (Steps 1–8)
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Instructions below explicitly separate verified source-board rules from general practical
            hall guidance.
          </p>
        </div>

        {/* 4-Category Verification Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/10 p-3">
            <span className="block font-mono text-[10px] font-bold uppercase text-emerald-300">
              1. Officially Confirmed Instructions
            </span>
            <p className="mt-1 text-zinc-300 leading-snug">
              Rules printed directly on official board SOP PDFs or official specimen booklets (cited
              per step below).
            </p>
          </div>
          <div className="rounded-xl border border-sky-500/25 bg-sky-950/10 p-3">
            <span className="block font-mono text-[10px] font-bold uppercase text-sky-300">
              2. Board-Specific Requirements
            </span>
            <p className="mt-1 text-zinc-300 leading-snug">
              Applies only to the named board (e.g., BISE Multan CS HSSC 2nd Annual 2026; BISE Lahore
              CS PDF &amp; video; BISE D.G. Khan 16-point SOP PDF; FBISE OMR/PCBC rules).
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/[0.03] p-3">
            <span className="block font-mono text-[10px] font-bold uppercase text-zinc-200">
              3. General Practical Guidance
            </span>
            <p className="mt-1 text-zinc-300 leading-snug">
              Common-sense exam-hall habits (hand pressure, spacing, clean lines) supporting legible
              scanning—not an official rulebook clause.
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/25 bg-amber-950/10 p-3">
            <span className="block font-mono text-[10px] font-bold uppercase text-amber-300">
              4. Future Plans Awaiting Confirmation
            </span>
            <p className="mt-1 text-zinc-300 leading-snug">
              Reported 2027 4-science-subject expansion &amp; 17 Nov readiness visit—province-wide
              circulars still pending.
            </p>
          </div>
        </div>

        {/* Interactive Educational Diagram: Correct vs Incorrect Sheet Placement */}
        <div className="rounded-3xl border border-accent/25 bg-[#121216] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-block font-mono text-[10px] font-bold uppercase text-amber-300">
                Illustrative Educational Diagram — Always verify exact page numbers on your board&apos;s official specimen PDF
              </span>
              <h4 className="font-heading text-base sm:text-lg font-bold text-white mt-0.5">
                Interactive E-Sheet &amp; Bubble Placement Visualizer
              </h4>
            </div>

            <div className="inline-flex rounded-xl border border-white/15 bg-black/60 p-1 shrink-0 self-start">
              <button
                type="button"
                aria-pressed={visualMode === "correct"}
                onClick={() => setVisualMode("correct")}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-heading font-bold transition-colors duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                  visualMode === "correct"
                    ? "text-black"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {visualMode === "correct" && (
                  <motion.span
                    layoutId="esheet-visual-mode-pill"
                    transition={prefersReducedMotion ? { duration: 0 } : BW_TWEEN_INTERACTIVE}
                    className="pointer-events-none absolute inset-0 rounded-lg bg-emerald-500"
                  />
                )}
                <span className="relative z-10">Correct Attempt</span>
              </button>
              <button
                type="button"
                aria-pressed={visualMode === "incorrect"}
                onClick={() => setVisualMode("incorrect")}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-heading font-bold transition-colors duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 ${
                  visualMode === "incorrect"
                    ? "text-white"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {visualMode === "incorrect" && (
                  <motion.span
                    layoutId="esheet-visual-mode-pill"
                    transition={prefersReducedMotion ? { duration: 0 } : BW_TWEEN_INTERACTIVE}
                    className="pointer-events-none absolute inset-0 rounded-lg bg-rose-500"
                  />
                )}
                <span className="relative z-10">Common Mistakes</span>
              </button>
            </div>
          </div>

          <TabSwitchPanel panelKey={visualMode}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Mock Cover / OMR Bubble Header Visual */}
            <div
              className={`rounded-2xl border p-4 space-y-3 ${
                visualMode === "correct"
                  ? "border-emerald-500/35 bg-emerald-950/10"
                  : "border-rose-500/35 bg-rose-950/10"
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-mono text-[11px] font-bold text-white">
                  COVER / OMR STRIP &amp; BARCODE ZONE
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400">
                  <QrCode size={13} className="text-accent" />
                  <span>Keep QR / Barcode Clean</span>
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-zinc-400 mb-1">ROLL NO. BOXES (EXAMPLE)</div>
                    <div className="flex gap-1">
                      {["4", "1", "8", "0", "9", "2"].map((d, idx) => (
                        <span
                          key={idx}
                          className="inline-flex h-7 w-6 items-center justify-center rounded border border-white/20 bg-white/5 text-white font-bold"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Simulated QR / Barcode strip */}
                  <div
                    className={`relative rounded border px-2.5 py-2 text-[10px] text-center ${
                      visualMode === "correct"
                        ? "border-emerald-500/40 bg-white/5 text-emerald-300"
                        : "border-rose-500/60 bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    <div>|||| |||| ||||</div>
                    <div>
                      {visualMode === "correct" ? "Barcode Intact" : "Scratched / Ink Mark!"}
                    </div>
                  </div>
                </div>

                {/* OMR Bubble Row Comparison */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[10px] text-zinc-400 mb-1.5">
                    MCQ OMR BUBBLE EXAMPLE (Q.1 = Option B)
                  </div>
                  {visualMode === "correct" ? (
                    <div className="flex items-center gap-3 text-emerald-300">
                      <span className="h-5 w-5 rounded-full border border-zinc-500 inline-flex items-center justify-center text-[10px] text-zinc-400">
                        A
                      </span>
                      <span className="h-5 w-5 rounded-full bg-sky-400 border border-sky-300 inline-flex items-center justify-center text-[10px] font-black text-black">
                        ●
                      </span>
                      <span className="h-5 w-5 rounded-full border border-zinc-500 inline-flex items-center justify-center text-[10px] text-zinc-400">
                        C
                      </span>
                      <span className="h-5 w-5 rounded-full border border-zinc-500 inline-flex items-center justify-center text-[10px] text-zinc-400">
                        D
                      </span>
                      <span className="text-[11px] font-sans">
                        1 full dark bubble inside circle—no ticks, dots, or whitener.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3 text-rose-300">
                      <span className="h-5 w-5 rounded-full border border-rose-400 inline-flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span className="h-5 w-5 rounded-full border border-rose-400 bg-rose-500/30 inline-flex items-center justify-center text-[10px]">
                        ◐
                      </span>
                      <span className="h-5 w-5 rounded-full border border-rose-400 bg-white/80 text-black inline-flex items-center justify-center text-[10px]">
                        ✗
                      </span>
                      <span className="text-[11px] font-sans">
                        Ticked, half-filled, whitener, or 2 bubbles = <strong>0 marks</strong> for
                        that MCQ.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subjective Question Box & Margin Visual */}
            <div
              className={`rounded-2xl border p-4 space-y-3 ${
                visualMode === "correct"
                  ? "border-emerald-500/35 bg-emerald-950/10"
                  : "border-rose-500/35 bg-rose-950/10"
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-mono text-[11px] font-bold text-white">
                  QUESTION BOX &amp; SCAN CROP ZONE
                </span>
                <span className="font-mono text-[10px] text-zinc-400">
                  Header: Q. No. 2 (Part ii)
                </span>
              </div>

              <div className="relative rounded-xl border-2 border-dashed border-accent/40 bg-black/60 p-3 text-xs space-y-2">
                <div className="text-[10px] font-mono text-accent">
                  [SCANNER CROP FRAME — STAY INSIDE MARGIN LINES]
                </div>

                {visualMode === "correct" ? (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5 space-y-1 text-zinc-200">
                    <p className="font-semibold text-emerald-300">
                      ✓ Q2(ii) written neatly inside Q2(ii) box
                    </p>
                    <p className="text-[11px] text-zinc-300">
                      Mistaken word crossed with{" "}
                      <span className="line-through decoration-rose-400">one clean line</span>{" "}
                      (never whitener). Diagrams kept inside margin border.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-rose-200">
                      ✗ Wrote Q2(iii) inside Q2(ii) box or overflowed outside margin lines —
                      overflow gets sliced off during scanning!
                    </div>
                    <div className="text-[11px] text-rose-300 font-mono">
                      ✗ Applied whitener / pasted extra sheet / wrote roll number inside answer
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </TabSwitchPanel>
        </div>

        {/* 8-Step Student Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDENT_STEP_BY_STEP_GUIDE.map((step, idx) => (
            <ScrollRevealDiv
              key={step.stepNumber}
              delay={Math.min(idx % 2, 1) * 0.06}
              duration={0.4}
              y={10}
              className="rounded-2xl border border-white/10 bg-[#141416] p-5 space-y-3 transition-colors duration-200 hover:border-white/20"
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-black font-mono text-xs font-black">
                    0{step.stepNumber}
                  </span>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-white">
                    {step.title}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{step.officialRuleSummary}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 space-y-1">
                  <span className="block font-mono text-[10px] font-bold uppercase text-emerald-300">
                    Do This
                  </span>
                  {step.doThis.map((d, i) => (
                    <p key={i} className="flex items-start gap-1.5 text-zinc-200 leading-snug">
                      <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </p>
                  ))}
                </div>

                <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-3 space-y-1">
                  <span className="block font-mono text-[10px] font-bold uppercase text-rose-300">
                    Avoid This
                  </span>
                  {step.avoidThis.map((a, i) => (
                    <p key={i} className="flex items-start gap-1.5 text-zinc-300 leading-snug">
                      <XCircle size={12} className="text-rose-400 shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500">Basis: {step.sourceRef}</div>
            </ScrollRevealDiv>
          ))}
        </div>
      </ScrollRevealSection>

      {/* ===================================================================
          6. STATIONERY GUIDE (BOARD-VERIFIED, NO INVENTED UNIVERSAL RULE)
         =================================================================== */}
      <ScrollRevealSection id="esheet-stationery" className="scroll-mt-24 space-y-4">
        <div>
          <span className="font-mono text-[11px] font-bold uppercase text-accent">
            Section 6 · Verified Pen, Marker &amp; Ink Rules
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
            Permitted vs Prohibited Stationery Guide
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Stationery notes distinguish <strong className="text-white">board-specific confirmed clauses</strong>{" "}
            (attributed individually to BISE D.G. Khan&apos;s 16-point SOP PDF, BISE Lahore&apos;s CS
            OSM PDF/video, or FBISE&apos;s OMR sheets—never generalized as universal Punjab law) from{" "}
            <strong className="text-white">general practical guidance</strong>. Always obey the
            printed cover instructions on your actual exam booklet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATIONERY_GUIDE_ITEMS.map((entry, idx) => {
            const borderClass =
              entry.category === "recommended"
                ? "border-emerald-500/30 bg-emerald-950/10"
                : entry.category === "conditional"
                  ? "border-amber-500/30 bg-amber-950/10"
                  : "border-rose-500/30 bg-rose-950/10";
            const labelColor =
              entry.category === "recommended"
                ? "text-emerald-300"
                : entry.category === "conditional"
                  ? "text-amber-300"
                  : "text-rose-300";

            return (
              <ScrollRevealDiv
                key={entry.item}
                delay={Math.min(idx % 2, 1) * 0.06}
                duration={0.4}
                y={10}
                className={`rounded-2xl border p-5 space-y-2.5 transition-transform duration-200 hover:-translate-y-0.5 ${borderClass}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-mono text-[10px] font-bold uppercase ${labelColor}`}>
                    {entry.statusLabel}
                  </span>
                  <PenTool size={14} className={labelColor} />
                </div>

                <h4 className="font-heading text-base font-bold text-white">{entry.item}</h4>

                <div className="space-y-1.5 text-xs text-zinc-300 leading-relaxed">
                  <p>
                    <strong className="text-white">Punjab Evidence: </strong>
                    {entry.punjabEvidence}
                  </p>
                  <p>
                    <strong className="text-sky-300">FBISE Evidence: </strong>
                    {entry.fbiseEvidence}
                  </p>
                </div>

                <div className="rounded-xl bg-black/45 border border-white/10 p-2.5 text-[11px] text-zinc-200">
                  <strong className="text-accent">Hall Advice: </strong>
                  {entry.practicalAdvice}
                </div>
              </ScrollRevealDiv>
            );
          })}
        </div>
      </ScrollRevealSection>

      {/* ===================================================================
          7. HOW TO AVOID LOSING MARKS (14 PITFALLS — ZERO FAKE PENALTIES)
         =================================================================== */}
      <ScrollRevealSection id="esheet-mistakes" className="scroll-mt-24 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase text-accent">
              Section 7 · Scanner &amp; OSM Mark-Loss Prevention
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              14 E-Sheet Mistakes That Risk Losing Marks
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Every pitfall below cites verified scanning mechanics and printed board consequences
              (never invented fixed mark deductions).
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(["all", "Critical", "High", "Medium"] as const).map((lvl) => {
              const isSelected = mistakeFilter === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setMistakeFilter(lvl)}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-heading transition-colors duration-200 cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
                    isSelected
                      ? "text-black font-bold"
                      : "border border-white/10 bg-[#141416] font-semibold text-zinc-300 hover:text-white"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="esheet-mistake-filter-pill"
                      transition={prefersReducedMotion ? { duration: 0 } : BW_TWEEN_INTERACTIVE}
                      className="pointer-events-none absolute inset-0 rounded-lg bg-accent"
                    />
                  )}
                  <span className="relative z-10">
                    {lvl === "all" ? "All 14 Pitfalls" : `${lvl} Risk`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMistakes.map((m, idx) => (
            <ScrollRevealDiv
              key={m.id}
              delay={Math.min(idx % 2, 1) * 0.05}
              duration={0.38}
              y={10}
              className="rounded-2xl border border-white/10 bg-[#141416] p-5 space-y-2.5 transition-colors duration-200 hover:border-white/20"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-bold text-accent">
                  PITFALL #{m.number}
                </span>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                    m.severity === "Critical"
                      ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      : m.severity === "High"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                  }`}
                >
                  {m.severity} Impact
                </span>
              </div>

              <h4 className="font-heading text-sm sm:text-base font-bold text-white">
                {m.mistake}
              </h4>

              <p className="text-xs text-zinc-300 leading-relaxed">
                <strong className="text-zinc-200">Technical Reason: </strong>
                {m.whyItMattersTechnically}
              </p>

              <p className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300">Verified Rule Basis: </strong>
                {m.verifiedConsequenceBasis}
              </p>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 text-xs text-emerald-200">
                <strong>How to Prevent: </strong>
                {m.howToPrevent}
              </div>
            </ScrollRevealDiv>
          ))}
        </div>
      </ScrollRevealSection>

      {/* ===================================================================
          8. SEPARATE FBISE E-SHEET SYSTEM (FEDERAL BOARD ONLY)
         =================================================================== */}
      <ScrollRevealSection
        id="esheet-fbise"
        className="scroll-mt-24 rounded-3xl border border-sky-500/35 bg-sky-950/10 p-5 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded bg-sky-500/20 border border-sky-400/35 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-sky-300">
              <Cpu size={12} />
              Section 8 · FBISE Only — Separate from Punjab Boards
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-2">
              FBISE E-Sheet &amp; Screen Marking System
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-3xl">
              Federal Board (FBISE) operates a distinct, mature E-Sheet system established in 2018.
              Do NOT mix FBISE sample page counts, 50% MCQ model splits, or SLO rubrics with Punjab
              BISE exams.
            </p>
          </div>

          <a
            href="https://www.fbise.edu.pk/screen_marking.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/15 px-4 py-2 text-xs font-heading font-bold text-sky-200 hover:bg-sky-500/25 active:scale-[0.98] transition-all duration-200 shrink-0 self-start"
          >
            <span>FBISE E-Sheets Portal</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* FBISE Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FBISE_MILESTONES.map((item, idx) => (
            <ScrollRevealDiv
              key={item.year}
              delay={idx * 0.05}
              duration={0.38}
              y={10}
              className="rounded-2xl border border-sky-500/25 bg-black/40 p-4 space-y-1.5"
            >
              <span className="font-mono text-xs font-black text-sky-300">{item.year}</span>
              <h4 className="font-heading text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{item.detail}</p>
            </ScrollRevealDiv>
          ))}
        </div>

        {/* Official Printed Rule Callout */}
        <div className="rounded-2xl border border-sky-400/35 bg-black/55 p-4 text-xs text-zinc-200 flex items-start gap-3">
          <FileText size={18} className="text-sky-300 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-sky-500/20 border border-sky-400/35 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-sky-300">
                FBISE-Specific Rule (Separate from Punjab Boards)
              </span>
              <a
                href="https://www.fbise.edu.pk/Downloads/E-Sheets-2026/sample_esheet_for_PCBC_SSC1_2027.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[10px] text-sky-300 hover:underline"
              >
                <span>Source: FBISE SSC-I PCBC 2027 Sample PDF</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <strong className="text-white block">
              Must Answer Strictly in Specified Question Space — Otherwise Marks Will Not Be Awarded
            </strong>
            <p className="text-sky-200 leading-relaxed">
              FBISE&apos;s official 2027 PCBC sample E-Sheet states that candidates must answer each
              question or part in the space specified; otherwise,{" "}
              <strong className="text-white">marks for that answer will not be awarded</strong>{" "}
              (&ldquo;Answer the Question / (Part) at the space specified. Otherwise, the marks of
              concerned answer will not be given.&rdquo;).
            </p>
            <p className="text-zinc-400">
              Section-A OMR cover rule (FBISE-specific): &ldquo;Do not use lead pencil.
              Deleting/overwriting is not allowed.&rdquo;
            </p>
          </div>
        </div>

        {/* Verified FBISE 2027 & PBA Sample Downloads */}
        <div className="space-y-2.5">
          <h4 className="font-heading text-sm font-bold text-white">
            Verified FBISE 2027 &amp; PBA Sample E-Sheet PDFs (Live on fbise.edu.pk)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {FBISE_VERIFIED_SAMPLES.map((sample) => (
              <a
                key={sample.title}
                href={sample.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-black/45 p-3.5 hover:border-sky-400/50 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-sky-300">
                    <span>{sample.level}</span>
                    <span className="font-bold">{sample.pages}</span>
                  </div>
                  <div className="font-heading text-xs sm:text-sm font-bold text-white mt-1">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{sample.sessionNote}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-300">
                  <span>Open Official PDF</span>
                  <ExternalLink size={11} />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Side-by-Side Punjab vs FBISE Comparison Table */}
        <div className="rounded-2xl border border-white/10 bg-black/50 p-4 sm:p-5 space-y-3">
          <h4 className="font-heading text-base font-bold text-white">
            Punjab Boards vs FBISE — Keep Systems Strictly Separate
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-mono uppercase text-zinc-400">
                  <th className="py-2.5 pr-4">Comparison Area</th>
                  <th className="py-2.5 pr-4 text-accent">Punjab BISEs (9 Boards)</th>
                  <th className="py-2.5 text-sky-300">FBISE (Federal Board)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {PUNJAB_VS_FBISE_COMPARISON.map((row) => (
                  <tr key={row.dimension} className="align-top">
                    <td className="py-3 pr-4 font-heading font-bold text-white">
                      {row.dimension}
                    </td>
                    <td className="py-3 pr-4 text-zinc-300">{row.punjabBoards}</td>
                    <td className="py-3 text-zinc-300">{row.fbise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollRevealSection>

      {/* ===================================================================
          9. OFFICIAL SOURCES REGISTRY + FAQ ACCORDION + MANDATORY DISCLAIMER
         =================================================================== */}
      <ScrollRevealSection id="esheet-sources-faqs" className="scroll-mt-24 space-y-6">
        {/* Verified Sources & Links Registry */}
        <div className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6 space-y-4">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase text-accent">
              Section 9A · Direct Verified Links (Board Portals, Official PDFs, Video Tutorials &amp; News Reports)
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
              Board Portals, Official Specimen PDFs, Video Guides &amp; Media Reports
            </h3>
            <p className="mt-1 text-xs text-zinc-400">
              Official board portals and PDFs are shown in emerald; official board social/video
              resources in amber; and third-party news coverage in sky blue (never labeled as
              official notifications).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {ESHEET_OFFICIAL_SOURCES.map((src) => {
              const isMedia = src.authority.startsWith("News Report");
              const isVideoOrSocial =
                src.authority.includes("Video") || src.authority.includes("Social Media");
              const badgeColor = isMedia
                ? "text-sky-300"
                : isVideoOrSocial
                  ? "text-amber-300"
                  : "text-emerald-300";

              return (
                <a
                  key={src.url}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-black/40 p-3.5 hover:border-accent/45 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 flex flex-col justify-between gap-2"
                >
                  <div>
                    <span className={`font-mono text-[10px] font-bold uppercase ${badgeColor}`}>
                      {src.authority}
                    </span>
                    <div className="font-heading font-bold text-white mt-1 leading-snug">
                      {src.title}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">{src.scope}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-accent pt-2 border-t border-white/10">
                    <span>Verified {src.verifiedDate}</span>
                    <ExternalLink size={11} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-accent" />
            <div>
              <span className="font-mono text-[10px] uppercase text-accent font-bold block">
                Section 9B · Student Questions
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                Frequently Asked Questions on E-Sheets &amp; On-Screen Marking
              </h3>
            </div>
          </div>

          <div className="space-y-2.5">
            {ESHEET_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-white/10 bg-black/40 overflow-hidden transition-colors duration-200 hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? "" : faq.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] uppercase text-accent">
                        {faq.boardScope}
                      </span>
                      <div className="font-heading text-xs sm:text-sm font-bold text-white">
                        {faq.question}
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>
                  <CollapsiblePanel isOpen={isOpen}>
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5">
                      {faq.answer}
                    </div>
                  </CollapsiblePanel>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mandatory Official Rules Disclaimer */}
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/[0.06] p-5 flex items-start gap-3 text-xs leading-relaxed text-amber-100">
          <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-heading text-white block mb-1">
              Mandatory Examination Rules Disclaimer
            </strong>
            <p>
              E-Sheet formats, question box allocations, and stationery instructions may vary by
              examination board, class, subject, and examination session. Students must follow the
              latest official instructions issued by their respective examination board and
              invigilation staff inside the examination hall.
            </p>
          </div>
        </div>
      </ScrollRevealSection>
    </div>
  );
}
