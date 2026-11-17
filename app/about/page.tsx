"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import {
  ABOUT_PLATFORM_IDENTITY,
  ACADEMIC_SCOPE_PANELS,
  PLATFORM_OFFERINGS,
  TECH_ECOSYSTEM_OVERVIEW,
} from "@/lib/aboutPlatformData";
import { FOUNDER_PROFILE } from "@/lib/founderStoryData";

type OfferingFilter = "All" | "AI & Intelligence" | "Study Tools" | "Exam Practice";

const OFFERING_FILTERS: OfferingFilter[] = [
  "All",
  "AI & Intelligence",
  "Study Tools",
  "Exam Practice",
];

export default function AboutPage() {
  const [activeScopeId, setActiveScopeId] = useState<string>(
    ACADEMIC_SCOPE_PANELS[0].id
  );
  const [offeringFilter, setOfferingFilter] = useState<OfferingFilter>("All");
  const prefersReducedMotion = useReducedMotion();

  const activeScope =
    ACADEMIC_SCOPE_PANELS.find((s) => s.id === activeScopeId) ||
    ACADEMIC_SCOPE_PANELS[0];

  const visibleOfferings =
    offeringFilter === "All"
      ? PLATFORM_OFFERINGS
      : PLATFORM_OFFERINGS.filter((item) => item.category === offeringFilter);

  return (
    <div className="w-full overflow-x-clip">
      {/* =====================================================================
          1. INTRODUCTION & PLATFORM HERO
         ===================================================================== */}
      <section className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Typographic Introduction */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent"
              >
                {ABOUT_PLATFORM_IDENTITY.eyebrow}
              </motion.p>

              <motion.h1
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.48,
                  delay: prefersReducedMotion ? 0 : 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.04em] leading-[1.06] text-white"
              >
                Built to Bring Clarity, Tools, and Strategy to{" "}
                <span className="text-accent">Classes 9–12.</span>
              </motion.h1>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.45,
                  delay: prefersReducedMotion ? 0 : 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-300"
              >
                {ABOUT_PLATFORM_IDENTITY.intro}
              </motion.p>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.45,
                  delay: prefersReducedMotion ? 0 : 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-400"
              >
                {ABOUT_PLATFORM_IDENTITY.problemSolved}
              </motion.p>
            </div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.45,
                delay: prefersReducedMotion ? 0 : 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              <Button href="/my-story" variant="primary" className="min-h-[44px]">
                <span>Read Behind the Platform</span>
                <ArrowRight size={16} />
              </Button>
              <Button href="/guide" variant="secondary" className="min-h-[44px]">
                <span>Explore Website Guide</span>
              </Button>
            </motion.div>
          </div>

          {/* Right Platform Specification Plate */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.55,
              delay: prefersReducedMotion ? 0 : 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-5 flex"
          >
            <div className="relative w-full rounded-2xl border border-white/10 bg-[#0E0E12] p-6 sm:p-8 flex flex-col justify-between overflow-hidden lg:h-full">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-accent/12 blur-3xl"
              />

              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 text-[11px] font-mono text-neutral-400">
                <span>PLATFORM IDENTITY</span>
                <span className="text-accent">INDEPENDENT EDTECH</span>
              </div>

              <div className="relative z-10 my-6 space-y-4">
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3.5">
                  <span className="text-xs font-mono text-neutral-500">Platform</span>
                  <span className="font-heading text-base font-bold text-white">
                    Matric Mastery
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3.5">
                  <span className="text-xs font-mono text-neutral-500">Founder</span>
                  <span className="font-heading text-base font-bold text-accent">
                    {FOUNDER_PROFILE.name}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3.5">
                  <span className="text-xs font-mono text-neutral-500">Audience</span>
                  <span className="font-heading text-sm sm:text-base font-bold text-white">
                    Students in Classes 9–12
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3.5">
                  <span className="text-xs font-mono text-neutral-500">Qualifications</span>
                  <span className="font-mono text-xs sm:text-sm text-neutral-200">
                    SSC (9–10) · HSSC (11–12)
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-mono text-neutral-500">Boards Covered</span>
                  <span className="font-mono text-xs sm:text-sm text-neutral-200">
                    Punjab Boards &amp; FBISE
                  </span>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-4 text-xs font-mono text-neutral-400">
                Independent student platform · Not an official board portal
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          2. OUR MISSION & ACADEMIC SCOPE EXPLORER
         ===================================================================== */}
      <section className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                <Compass size={14} />
                <span>Our Mission</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {ABOUT_PLATFORM_IDENTITY.missionHeadline}
              </h2>
              <p className="text-base leading-relaxed text-neutral-300">
                {ABOUT_PLATFORM_IDENTITY.missionBody}
              </p>
            </div>

            {/* Interactive Academic Scope Switcher */}
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0E0E12] p-5 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                    Academic Scope
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Who Matric Mastery Serves
                  </h3>
                </div>
                <span className="font-mono text-xs text-accent">
                  Select a track
                </span>
              </div>

              {/* Segmented Track Selector */}
              <div
                role="tablist"
                aria-label="Academic Scope Tracks"
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              >
                {ACADEMIC_SCOPE_PANELS.map((panel) => {
                  const isActive = panel.id === activeScopeId;
                  return (
                    <button
                      key={panel.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveScopeId(panel.id)}
                      className={`rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer min-h-[52px] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        isActive
                          ? "border-accent bg-accent/10 text-white"
                          : "border-white/10 bg-[#141418] text-neutral-400 hover:border-white/25 hover:text-neutral-200"
                      }`}
                    >
                      <div
                        className={`font-mono text-[10px] ${
                          isActive ? "text-accent" : "text-neutral-500"
                        }`}
                      >
                        {panel.tag}
                      </div>
                      <div className="font-heading text-xs sm:text-sm font-bold truncate mt-0.5">
                        {panel.id.toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Scope Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScope.id}
                  role="tabpanel"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.18,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="space-y-4 pt-1"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400">
                    <span className="text-accent font-semibold">
                      {activeScope.tag}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeScope.subtitle}</span>
                  </div>

                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    {activeScope.title}
                  </h4>

                  <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
                    {activeScope.summary}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-white/10">
                    {activeScope.focusPoints.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2.5 text-sm text-neutral-300"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0"
                        />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =====================================================================
          3. WHAT THE PLATFORM OFFERS
         ===================================================================== */}
      <section className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                <BookOpen size={14} />
                <span>What the Platform Offers</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Live Modules Engineered for Real Preparation.
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                Every feature below is currently active on Matric Mastery and designed to work smoothly across mobile phones and desktop screens.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div
              role="group"
              aria-label="Filter platform offerings"
              className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#0E0E12] p-1 self-start"
            >
              {OFFERING_FILTERS.map((cat) => {
                const isSelected = offeringFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setOfferingFilter(cat)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
                      isSelected
                        ? "bg-accent text-black font-bold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleOfferings.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 35}>
              <Link
                href={item.href}
                className="group h-full flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0E0E12] p-6 hover:border-accent/45 hover:bg-[#131318] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-accent">{item.category}</span>
                    <span className="inline-flex items-center gap-1 text-neutral-500 group-hover:text-accent transition-colors">
                      <span>{item.routeLabel}</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-neutral-400 leading-relaxed">
                  {item.availabilityNote}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. WHO IS BEHIND IT? (Brief Spotlight Linking to /my-story)
         ===================================================================== */}
      <section className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10">
        <Reveal>
          <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.06] via-[#0E0E12] to-[#0A0A0D] p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  <UserCheck size={14} />
                  <span>Who Is Behind It?</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Founded and Directed by{" "}
                  <span className="text-accent">{FOUNDER_PROFILE.name}</span>.
                </h2>

                <p className="text-base leading-relaxed text-neutral-300 max-w-2xl">
                  Matric Mastery was created by {FOUNDER_PROFILE.name}, a student founder and independent product creator focused on building honest, practical academic technology for Pakistani board students—directing product planning, content writing, and syllabus organization across Classes 9–12.
                </p>

                <div className="pt-2">
                  <Button href="/my-story" variant="primary" className="min-h-[44px]">
                    <span>Read Full Story on Behind the Platform</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-xl border border-white/10 bg-[#0B0B0E] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 font-heading text-lg font-extrabold text-accent shrink-0">
                    {FOUNDER_PROFILE.monogram}
                  </div>
                  <div>
                    <div className="font-heading text-base font-bold text-white">
                      {FOUNDER_PROFILE.name}
                    </div>
                    <div className="font-mono text-xs text-neutral-400">
                      {FOUNDER_PROFILE.role}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-white/10 pt-3">
                  Explore the complete founder narrative, platform evolution stages, system blueprint, and full credits on the dedicated Behind the Platform experience.
                </p>
                <Link
                  href="/my-story"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:underline"
                >
                  <span>Go to Behind the Platform (/my-story)</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =====================================================================
          5. TECHNOLOGY & DEVELOPMENT OVERVIEW
         ===================================================================== */}
      <section className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                <Layers size={14} />
                <span>Technology &amp; Development</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Modern Web &amp; Serverless Stack.
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                Built using lightweight modern web software and free-first edge infrastructure, keeping human product authorship distinct from AI-assisted coding tools.
              </p>
            </div>

            <Link
              href="/my-story"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:underline whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <span>Inspect Interactive Stack Blueprint</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>

        <div className="rounded-2xl border border-white/10 bg-[#0E0E12] divide-y divide-white/10 overflow-hidden">
          {TECH_ECOSYSTEM_OVERVIEW.map((item, idx) => (
            <Reveal key={item.name} delay={idx * 30}>
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-start">
                <div className="md:col-span-4 flex items-center gap-3">
                  <span className="font-mono text-xs text-accent tabular-nums">
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="font-heading text-base font-bold text-white">
                      {item.name}
                    </div>
                    <div className="font-mono text-xs text-neutral-400">
                      {item.role}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-8 text-sm text-neutral-300 leading-relaxed">
                  {item.detail}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. INDEPENDENCE & TRANSPARENCY
         ===================================================================== */}
      <section className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 pt-10 pb-20 sm:pt-14 sm:pb-28 border-t border-white/10">
        <Reveal>
          <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-accent shrink-0" />
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Independence &amp; Transparency
                </h2>
              </div>
              <span className="font-mono text-xs text-neutral-400">
                Public Verification Standard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base text-neutral-300 leading-relaxed">
              <p>
                Matric Mastery is an <strong className="text-white">independent student-focused educational technology platform</strong> founded by Abdul Wahab. It is not affiliated with, operated by, or endorsed by the Government of Pakistan, PECTAA, PBCC, FBISE, or any Punjab Board of Intermediate and Secondary Education (BISE).
              </p>
              <p>
                Examination dates, paper patterns, and board advisories are cross-checked against public official board announcements before publication, and unconfirmed schedules are explicitly marked as awaiting confirmation. Google AI Studio / Gemini serves strictly as an AI-assisted development tool; Google does not own, sponsor, or endorse Matric Mastery.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono">
              <Link
                href="/my-story"
                className="inline-flex items-center gap-1.5 text-accent font-semibold hover:underline min-h-[44px]"
              >
                <Cpu size={14} />
                <span>Behind the Platform &amp; Full Credits</span>
              </Link>
              <span aria-hidden="true" className="text-neutral-700">
                ·
              </span>
              <Link
                href="/legal"
                className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white hover:underline min-h-[44px]"
              >
                <span>Legal &amp; Policies Center</span>
                <ArrowUpRight size={13} />
              </Link>
              <span aria-hidden="true" className="text-neutral-700">
                ·
              </span>
              <Link
                href="/board-watch"
                className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white hover:underline min-h-[44px]"
              >
                <span>Official Board Portals Directory</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
