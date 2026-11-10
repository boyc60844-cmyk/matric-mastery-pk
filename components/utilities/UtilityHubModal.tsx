"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Clock,
  Calendar,
  Flame,
  Calculator,
  CloudSun,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LiveClockWidget from "./LiveClockWidget";
import AcademicCalendarWidget from "./AcademicCalendarWidget";
import ProductivityTimerWidget from "./ProductivityTimerWidget";
import StudentCalculatorWidget from "./StudentCalculatorWidget";
import LiveInformationWidget from "./LiveInformationWidget";
import StudentDashboardWidget from "./StudentDashboardWidget";

interface UtilityHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "dashboard" | "clock" | "calendar" | "timers" | "calculators" | "liveinfo";
}

export default function UtilityHubModal({
  isOpen,
  onClose,
  initialTab = "dashboard",
}: UtilityHubModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Student Utilities Hub"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative z-10 flex flex-col w-full max-w-5xl h-[92vh] max-h-[900px] rounded-2xl border border-white/10 bg-[#0A0A0E] shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden"
          >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0F0F14] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-black font-black text-sm shadow-md">
              <Sparkles size={16} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-white text-base tracking-wide">
                  Study Utilities & Intelligence Hub
                </h2>
                <span className="rounded-full bg-accent/15 border border-accent/30 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Precision academic tools for Punjab matriculation candidates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/utilities"
              onClick={onClose}
              className="hidden sm:flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span>Full Page</span>
              <ExternalLink size={12} />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Utilities Hub"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-[#0C0C10] px-4 py-2 gap-1.5 scrollbar-none text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "dashboard"
                ? "bg-accent text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timers")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "timers"
                ? "bg-accent text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Flame size={14} />
            <span>Timers & Pomodoro</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calculators")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "calculators"
                ? "bg-accent text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Calculator size={14} />
            <span>Calculators & 40% Rule</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "calendar"
                ? "bg-accent text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar size={14} />
            <span>Exam Calendar & Countdowns</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("clock")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "clock"
                ? "bg-accent text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Clock size={14} />
            <span>Live Clock & Timezones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("liveinfo")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-all active:scale-[0.98] ${
              activeTab === "liveinfo"
                ? "bg-accent text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CloudSun size={14} />
            <span>Weather & Forex</span>
          </button>
        </div>

        {/* Scrollable Widget Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#08080B]">
          {activeTab === "dashboard" && (
            <StudentDashboardWidget onSwitchTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === "timers" && <ProductivityTimerWidget />}
          {activeTab === "calculators" && <StudentCalculatorWidget />}
          {activeTab === "calendar" && <AcademicCalendarWidget />}
          {activeTab === "clock" && <LiveClockWidget />}
          {activeTab === "liveinfo" && <LiveInformationWidget />}
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
}
