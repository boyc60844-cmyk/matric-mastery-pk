"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Printer,
  Download,
  Play,
  Filter,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { QUESTION_POOL, SUBJECTS_CONFIG } from "@/lib/question-bank";

const BOARDS = [
  "BISE Multan",
  "BISE Lahore",
  "BISE Faisalabad",
  "BISE Rawalpindi",
  "BISE Sargodha",
  "BISE Bahawalpur",
  "BISE DG Khan",
  "BISE Gujranwala",
  "Federal / FBISE Islamabad",
];

const YEARS = ["2025 (Model)", "2024", "2023", "2022", "2021", "2020", "2019"];
const GROUPS = ["Group I (Morning)", "Group II (Evening)"];

export default function PastPapersPage() {
  const [selectedBoard, setSelectedBoard] = useState<string>("BISE Multan");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedClass, setSelectedClass] = useState<"Class 9" | "Class 10">("Class 10");
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [selectedGroup, setSelectedGroup] = useState<string>("Group I (Morning)");

  // Questions for this paper template
  const matched = QUESTION_POOL.filter(
    (q) => q.grade === selectedClass && q.subject.toLowerCase() === selectedSubject.toLowerCase()
  );
  const fallback = matched.length > 0 ? matched : QUESTION_POOL.filter((q) => q.subject.toLowerCase() === selectedSubject.toLowerCase());

  const mcqs = (fallback.filter((q) => q.type === "mcq")).slice(0, 10);
  const shorts = (fallback.filter((q) => q.type === "short")).slice(0, 8);
  const longs = (fallback.filter((q) => q.type === "long")).slice(0, 2);

  return (
    <div className="mx-auto max-w-site px-4 sm:px-6 py-12 md:py-16">
      {/* Page Header */}
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-heading font-black text-accent uppercase tracking-wider">
          <FileText size={13} /> Punjab &amp; Federal Board Archives
        </span>
        <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
          Board Past Paper Practice Sets
        </h1>
        <p className="mt-3 text-muted leading-relaxed text-sm sm:text-base">
          Authentic board-pattern practice sets for Punjab Boards and FBISE. Filter by board, year,
          and session to practice exact time limits and question pairings.
        </p>
      </div>

      {/* Honest Disclaimer Banner */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-[#141418] p-4 text-xs text-muted">
        <ShieldAlert size={16} className="text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Honest Notice:</strong> These papers are structured as{" "}
          <strong>Paper templates and practice sets</strong> conforming strictly to Punjab Board
          schemes and past exam distributions. We never claim leaked or unauthorized official papers.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#121215] p-5 shadow-soft">
        <div className="flex items-center gap-2 font-heading text-xs font-black uppercase tracking-wider text-muted mb-4">
          <Filter size={14} className="text-accent" /> Paper Generator Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Board */}
          <div>
            <label className="block text-[11px] font-heading font-bold text-muted mb-1 uppercase">
              Board
            </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#18181c] p-2.5 text-xs text-white focus:border-accent focus:outline-none"
            >
              {BOARDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-[11px] font-heading font-bold text-muted mb-1 uppercase">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as "Class 9" | "Class 10")}
              className="w-full rounded-xl border border-white/10 bg-[#18181c] p-2.5 text-xs text-white focus:border-accent focus:outline-none"
            >
              <option value="Class 9">9th Class (SSC Part-I)</option>
              <option value="Class 10">10th Class (SSC Part-II)</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-heading font-bold text-muted mb-1 uppercase">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#18181c] p-2.5 text-xs text-white focus:border-accent focus:outline-none"
            >
              {SUBJECTS_CONFIG.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-heading font-bold text-muted mb-1 uppercase">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#18181c] p-2.5 text-xs text-white focus:border-accent focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Group / Session */}
          <div>
            <label className="block text-[11px] font-heading font-bold text-muted mb-1 uppercase">
              Session
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#18181c] p-2.5 text-xs text-white focus:border-accent focus:outline-none"
            >
              {GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-muted font-mono">
          Showing: <span className="text-white font-bold">{selectedBoard}</span> &middot;{" "}
          <span className="text-accent font-bold">{selectedSubject}</span> ({selectedClass},{" "}
          {selectedYear})
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-heading font-bold text-white hover:bg-white/10 transition-colors"
          >
            <Printer size={15} />
            <span>Print Paper</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-heading font-bold text-white hover:bg-white/10 transition-colors"
          >
            <Download size={15} />
            <span>Download</span>
          </button>

          <Link
            href="/mock-tests"
            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 font-heading text-xs font-black text-black hover:bg-accent/90 transition-transform active:scale-95 shadow-glow"
          >
            <Play size={14} className="fill-black" />
            <span>Start Timed Practice</span>
          </Link>
        </div>
      </div>

      {/* Printable Board Paper Sheet Layout */}
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/15 bg-[#121215] p-6 sm:p-12 shadow-2xl text-white">
        {/* Subtle Diagonal Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
          <span className="font-heading text-5xl sm:text-7xl font-black uppercase tracking-widest -rotate-12 text-white">
            MATRIC MASTERY — PRACTICE
          </span>
        </div>

        {/* Paper Header */}
        <div className="relative z-10 border-b-2 border-white/20 pb-6 text-center">
          <h2 className="font-heading text-lg sm:text-xl font-black tracking-tight text-white uppercase">
            {selectedBoard}
          </h2>
          <div className="mt-1 font-heading text-sm sm:text-base font-bold text-accent">
            Secondary School Certificate (SSC) Annual Examination &bull; {selectedYear}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-muted">
            <span>Subject: <strong className="text-white">{selectedSubject}</strong></span>
            <span>&bull;</span>
            <span>Grade: <strong className="text-white">{selectedClass}</strong></span>
            <span>&bull;</span>
            <span>Session: <strong className="text-white">{selectedGroup}</strong></span>
            <span>&bull;</span>
            <span>Total Marks: <strong className="text-white">75</strong></span>
            <span>&bull;</span>
            <span>Time Allowed: <strong className="text-white">2 Hours 30 Mins</strong></span>
          </div>
        </div>

        {/* General Instructions */}
        <div className="relative z-10 mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-muted leading-relaxed">
          <strong className="text-white">General Instructions:</strong> You have 20 minutes for
          Section-A (Objective/MCQs) and 2 hours 10 minutes for Section-B &amp; C (Subjective).
          Overwriting, cutting, erasing, or using lead pencil on the bubble sheet will result in zero
          marks for that question.
        </div>

        {/* PART I: OBJECTIVE TYPE (MCQs) */}
        <div className="relative z-10 mt-8">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <h3 className="font-heading text-sm font-black uppercase tracking-wider text-accent">
              Section A &mdash; Objective Type (15 Marks)
            </h3>
            <span className="font-mono text-xs text-muted">Time: 20 Mins</span>
          </div>
          <p className="mt-2 text-xs text-muted italic">
            Note: Four possible answers A, B, C, and D are given. Encircle the correct one on your answer sheet.
          </p>

          <div className="mt-4 space-y-4">
            {mcqs.map((q, idx) => (
              <div key={q.id} className="rounded-lg border border-white/5 bg-white/[0.01] p-3 text-xs">
                <div className="font-medium text-white/95">
                  <span className="font-mono font-bold text-accent mr-2">Q{idx + 1}.</span>
                  {q.text}
                </div>
                <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-white/75 font-sans">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-muted">
                        ({["A", "B", "C", "D"][oIdx]})
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART II: SUBJECTIVE (SHORT QUESTIONS) */}
        <div className="relative z-10 mt-10">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <h3 className="font-heading text-sm font-black uppercase tracking-wider text-accent">
              Section B &mdash; Subjective Type (Short Questions &bull; 36 Marks)
            </h3>
            <span className="font-mono text-xs text-muted">Time: 2 Hours 10 Mins</span>
          </div>

          <div className="mt-4 space-y-6">
            <div>
              <h4 className="font-heading text-xs font-bold text-white mb-2">
                Q2. Write short answers to any SIX (6) of the following questions: (6 &times; 2 = 12 Marks)
              </h4>
              <div className="grid gap-2.5 sm:grid-cols-2 text-xs">
                {shorts.slice(0, 4).map((sq, sIdx) => (
                  <div key={sq.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <span className="font-mono font-bold text-accent mr-1.5">({sIdx + 1})</span>
                    <span className="text-white/90">{sq.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-xs font-bold text-white mb-2">
                Q3. Write short answers to any SIX (6) of the following questions: (6 &times; 2 = 12 Marks)
              </h4>
              <div className="grid gap-2.5 sm:grid-cols-2 text-xs">
                {shorts.slice(4, 8).map((sq, sIdx) => (
                  <div key={sq.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <span className="font-mono font-bold text-accent mr-1.5">({sIdx + 1})</span>
                    <span className="text-white/90">{sq.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PART III: LONG QUESTIONS */}
        <div className="relative z-10 mt-10">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <h3 className="font-heading text-sm font-black uppercase tracking-wider text-accent">
              Section C &mdash; Long Questions (Attempt Any THREE &bull; 24 Marks)
            </h3>
          </div>
          <div className="mt-4 space-y-4">
            {longs.map((lq, lIdx) => (
              <div key={lq.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                <div className="font-heading font-bold text-white text-sm">
                  Q{lIdx + 5}. {lq.text}
                </div>
                <div className="mt-2 text-muted leading-relaxed">
                  (a) Comprehensive derivation and definitions (4 Marks)
                  <br />
                  (b) Numerical problem solving or practical application (4 Marks)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info in paper */}
        <div className="relative z-10 mt-8 border-t border-white/15 pt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-muted">
          <span>MATRIC MASTERY &bull; PRACTICE SET</span>
          <span>End of Question Paper</span>
        </div>
      </div>
    </div>
  );
}
