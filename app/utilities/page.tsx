"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Calendar,
  Flame,
  Calculator,
  CloudSun,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Zap,
} from "lucide-react";
import LiveClockWidget from "@/components/utilities/LiveClockWidget";
import AcademicCalendarWidget from "@/components/utilities/AcademicCalendarWidget";
import ProductivityTimerWidget from "@/components/utilities/ProductivityTimerWidget";
import StudentCalculatorWidget from "@/components/utilities/StudentCalculatorWidget";
import LiveInformationWidget from "@/components/utilities/LiveInformationWidget";
import StudentDashboardWidget from "@/components/utilities/StudentDashboardWidget";
import { motion, AnimatePresence } from "framer-motion";

type TabId =
  | "dashboard"
  | "timers"
  | "calculators"
  | "calendar"
  | "clock"
  | "liveinfo";

export default function UtilitiesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  // Read initial tab from URL hash/query if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab") as TabId | null;
    if (
      tabParam &&
      ["dashboard", "timers", "calculators", "calendar", "clock", "liveinfo"].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Ambient Glows strictly constrained inside overflow-hidden to prevent mobile width expansion */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/5 rounded-full blur-[140px]" />
        <div className="absolute top-72 right-10 w-[400px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-site w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-white font-medium">Study Tools &amp; Utilities</span>
          <ChevronRight size={12} />
          <span className="text-accent font-semibold capitalize">
            {activeTab}
          </span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-accent mb-3">
              <Sparkles size={13} />
              <span>ACADEMIC UTILITY &amp; INTELLIGENCE SUITE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white">
              Student Utilities <span className="text-accent">&amp;</span> Tools
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              Precision timekeeping, official PBCC examination milestones,
              drift-free Pomodoro engines, Punjab Board 40% aggregate
              calculators, and live exam city weather.
            </p>
          </div>

          {/* Quick Context Link to Board Watch */}
          <Link
            href="/board-watch"
            className="flex items-center gap-2 self-start md:self-auto rounded-xl border border-white/10 bg-[#121216] px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white hover:border-accent active:scale-95 transition-all shadow-md shrink-0"
          >
            <span>PBCC Board Watch Intelligence</span>
            <ArrowRight size={14} className="text-accent" />
          </Link>
        </div>

        {/* Master Tab Bar */}
        <div className="mt-8 flex overflow-x-auto gap-2 border-b border-white/10 pb-3 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-heading font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "dashboard"
                ? "bg-accent text-black shadow-lg shadow-accent/20"
                : "border border-white/10 bg-[#101014] text-neutral-300 hover:text-white hover:border-white/20"
            }`}
          >
            <LayoutDashboard size={15} />
            <span>Overview Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timers")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-heading font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "timers"
                ? "bg-accent text-black shadow-lg shadow-accent/20"
                : "border border-white/10 bg-[#101014] text-neutral-300 hover:text-white hover:border-white/20"
            }`}
          >
            <Flame size={15} />
            <span>Pomodoro &amp; Study Timers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calculators")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-heading font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "calculators"
                ? "bg-accent text-black shadow-lg shadow-accent/20"
                : "border border-white/10 bg-[#101014] text-neutral-300 hover:text-white hover:border-white/20"
            }`}
          >
            <Calculator size={15} />
            <span>Aggregate &amp; Calculators</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-heading font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "calendar"
                ? "bg-accent text-black shadow-lg shadow-accent/20"
                : "border border-white/10 bg-[#101014] text-neutral-300 hover:text-white hover:border-white/20"
            }`}
          >
            <Calendar size={15} />
            <span>Exam Calendar &amp; Deadlines</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("clock")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-heading font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "clock"
                ? "bg-accent text-black shadow-lg shadow-accent/20"
                : "border border-white/10 bg-[#101014] text-neutral-300 hover:text-white hover:border-white/20"
            }`}
          >
            <Clock size={15} />
            <span>Clock &amp; NTP Sync</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("liveinfo")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-heading font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "liveinfo"
                ? "bg-accent text-black shadow-lg shadow-accent/20"
                : "border border-white/10 bg-[#101014] text-neutral-300 hover:text-white hover:border-white/20"
            }`}
          >
            <CloudSun size={15} />
            <span>City Weather &amp; Forex</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === "dashboard" && (
                <StudentDashboardWidget onSwitchTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === "timers" && <ProductivityTimerWidget />}
              {activeTab === "calculators" && <StudentCalculatorWidget />}
              {activeTab === "calendar" && <AcademicCalendarWidget />}
              {activeTab === "clock" && <LiveClockWidget />}
              {activeTab === "liveinfo" && <LiveInformationWidget />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
