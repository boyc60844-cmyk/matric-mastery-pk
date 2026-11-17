"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Compass, Terminal } from "lucide-react";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import ArchitectureDiagram from "@/components/founder/ArchitectureDiagram";
import EvolutionTimeline from "@/components/founder/EvolutionTimeline";
import SectionNavigator from "@/components/founder/SectionNavigator";
import {
  FOUNDER_PROFILE,
  ORIGIN_CHAPTERS,
  PLATFORM_CREDITS,
  PLATFORM_SCOPE_TIERS,
  PLATFORM_SHOWCASE_FEATURES,
  STORY_SECTIONS,
} from "@/lib/founderStoryData";

export default function MyStoryPage() {
  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = (id: string) => {
    if (typeof window === "undefined") return;
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const humanCredits = PLATFORM_CREDITS.filter(
    (c) => c.category === "Human Leadership & Authorship"
  );
  const techCredits = PLATFORM_CREDITS.filter(
    (c) => c.category === "Technology & Development Ecosystem"
  );

  const featuredFeature = PLATFORM_SHOWCASE_FEATURES.find((f) => f.featured);
  const secondaryFeatures = PLATFORM_SHOWCASE_FEATURES.filter((f) => !f.featured);

  return (
    <div className="relative w-full overflow-x-clip">
      <SectionNavigator />

      {/* =====================================================================
          SECTION A — CINEMATIC FOUNDER HERO
         ===================================================================== */}
      <section
        id="hero"
        className="relative mx-auto max-w-site px-5 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Typographic Composition */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent"
              >
                {FOUNDER_PROFILE.eyebrow}
              </motion.p>

              <motion.h1
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.48,
                  delay: prefersReducedMotion ? 0 : 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-heading text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-[-0.04em] leading-[1.05] text-white"
              >
                Beyond the Classroom.{" "}
                <span className="text-accent">Built for What&apos;s Next.</span>
              </motion.h1>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.45,
                  delay: prefersReducedMotion ? 0 : 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base text-neutral-200 pt-1"
              >
                <span className="font-heading font-bold text-white">
                  {FOUNDER_PROFILE.name}
                </span>
                <span aria-hidden="true" className="text-neutral-600">
                  —
                </span>
                <span className="text-neutral-300">{FOUNDER_PROFILE.role}</span>
                <span aria-hidden="true" className="text-neutral-600">
                  ·
                </span>
                <span className="font-mono text-xs text-accent/90">
                  Pakistan EdTech Initiative
                </span>
              </motion.div>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.45,
                  delay: prefersReducedMotion ? 0 : 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="max-w-xl text-base sm:text-lg leading-relaxed text-neutral-300"
              >
                {FOUNDER_PROFILE.heroSummary}
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
              <Button
                variant="primary"
                onClick={() => scrollToSection("founder")}
                className="min-h-[44px]"
              >
                <span>Meet the Founder</span>
                <ArrowRight size={16} />
              </Button>
              <Button href="/" variant="secondary" className="min-h-[44px]">
                <span>Explore Matric Mastery</span>
              </Button>
            </motion.div>
          </div>

          {/* Right Abstract Geometric Architectural Composition (No invented photograph) */}
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
            <div className="relative w-full rounded-2xl border border-white/10 bg-[#0E0E11] p-6 sm:p-8 flex flex-col justify-between overflow-hidden min-h-[340px] lg:h-full">
              {/* Controlled Subtle Electric Yellow Radial Light */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
              />
              {/* Precision Geometric Grid Lines */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />

              {/* Top Architectural Coordinate Header */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-neutral-400 border-b border-white/10 pb-4">
                <span>MATRIC MASTERY</span>
                <span>FOUNDER MONOGRAPH</span>
              </div>

              {/* Center Geometric Abstract Emblem & Typographic Matrix */}
              <div className="relative z-10 my-8 flex items-center justify-center">
                <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-xl border border-white/15 bg-[#09090B]/90 p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="h-3 w-3 rounded-sm bg-accent" />
                    <span className="font-mono text-[10px] tracking-widest text-neutral-400">
                      CLASSES 9–12
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                      SSC <span className="text-accent">&amp;</span> HSSC
                    </div>
                    <div className="font-mono text-xs text-neutral-400">
                      Punjab Boards · FBISE
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400">
                    <span>Strategies</span>
                    <span className="text-center">Utilities</span>
                    <span className="text-right text-accent">AI Workspace</span>
                  </div>
                </div>
              </div>

              {/* Bottom Attribution Line */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-white/10 pt-4">
                <span>Created by {FOUNDER_PROFILE.name}</span>
                <span className="text-accent">Independent Platform</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Inline Editorial Chapter Index Bar */}
        <div className="mt-12 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {STORY_SECTIONS.slice(1).map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111114] px-3.5 py-2 text-xs font-medium text-neutral-300 hover:border-accent/50 hover:text-white transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer"
            >
              <span className="font-mono text-[11px] tabular-nums text-accent">
                0{i + 1}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION B — MEET THE FOUNDER
         ===================================================================== */}
      <section
        id="founder"
        className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10"
      >
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Typographic Identity Dossier */}
            <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0E0E12] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 font-heading text-2xl font-extrabold tracking-tight text-accent">
                  {FOUNDER_PROFILE.monogram}
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                  Student Founder
                </span>
              </div>

              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {FOUNDER_PROFILE.name}
                </h2>
                <p className="mt-1 font-mono text-xs text-accent">
                  {FOUNDER_PROFILE.role}
                </p>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-neutral-500">Platform</span>
                  <span className="text-neutral-200 font-medium">Matric Mastery</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-neutral-500">Academic Focus</span>
                  <span className="text-neutral-200 font-medium">Classes 9–12</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-neutral-500">Model</span>
                  <span className="text-neutral-200 font-medium">Independent EdTech</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Profile & Responsibilities */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  Meet the Founder
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Built by a Student, Engineered for Clarity.
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-neutral-300 max-w-2xl">
                  {FOUNDER_PROFILE.shortBio}
                </p>
              </div>

              {/* Product Vision Block (Clean All-Around Border, Zero Thick Left Stripe) */}
              <div className="rounded-2xl border border-white/10 bg-[#111115] p-6 sm:p-7">
                <div className="font-mono text-xs uppercase tracking-wider text-accent">
                  Product Vision
                </div>
                <p className="mt-2.5 text-base sm:text-lg leading-relaxed text-white font-medium">
                  {FOUNDER_PROFILE.visionStatement}
                </p>
              </div>

              {/* Core Project Responsibilities */}
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-4">
                  Core Responsibilities in the Project
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FOUNDER_PROFILE.responsibilities.map((item, idx) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-white/10 bg-[#0D0D10] p-5 space-y-2"
                    >
                      <div className="font-mono text-xs text-accent tabular-nums">
                        0{idx + 1}
                      </div>
                      <h4 className="font-heading text-base font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-neutral-400">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =====================================================================
          SECTION C — THE ORIGIN STORY
         ===================================================================== */}
      <section
        id="origin"
        className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10"
      >
        <Reveal>
          <div className="max-w-3xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              The Origin Story
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Why Matric Mastery Exists.
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
              Every tool on this platform grew out of a practical question: why do hardworking Pakistani board students still lose marks and time to avoidable confusion?
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-14 sm:space-y-20">
          {ORIGIN_CHAPTERS.map((chapter, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <Reveal key={chapter.index} delay={idx * 40}>
                <article className="border-t border-white/10 pt-10 sm:pt-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Chapter Index + Heading Column */}
                    <div
                      className={`lg:col-span-5 space-y-3 ${
                        isReversed ? "lg:order-2" : ""
                      }`}
                    >
                      <div className="font-mono text-sm font-bold tabular-nums text-accent">
                        Chapter {chapter.index}
                      </div>
                      <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {chapter.heading}
                      </h3>
                      <p className="text-sm sm:text-base font-medium text-neutral-300 leading-relaxed">
                        {chapter.lead}
                      </p>
                    </div>

                    {/* Narrative Prose + Optional Pull Quote */}
                    <div
                      className={`lg:col-span-7 space-y-6 max-w-prose ${
                        isReversed ? "lg:order-1" : ""
                      }`}
                    >
                      {chapter.paragraphs.map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-base leading-relaxed text-neutral-300"
                        >
                          {paragraph}
                        </p>
                      ))}

                      {chapter.pullQuote && (
                        <blockquote className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-6 sm:p-7 space-y-3">
                          <p className="font-heading text-lg sm:text-xl font-bold text-white leading-snug">
                            &ldquo;{chapter.pullQuote.quote}&rdquo;
                          </p>
                          <footer className="font-mono text-xs text-accent">
                            — {chapter.pullQuote.attribution}
                          </footer>
                        </blockquote>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SECTION D — THE EVOLUTION OF THE PLATFORM
         ===================================================================== */}
      <section
        id="evolution"
        className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10"
      >
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                Platform Evolution
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                How an Idea Became a Full Study System.
              </h2>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              An interactive progression through the verified stages that shaped Matric Mastery from its first concept to a Classes 9–12 workspace.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <EvolutionTimeline />
        </Reveal>
      </section>

      {/* =====================================================================
          SECTION E — THE PLATFORM TODAY
         ===================================================================== */}
      <section
        id="platform"
        className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10"
      >
        <Reveal>
          <div className="max-w-3xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              The Platform Today
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Built for Classes 9–12 Across Punjab Boards &amp; FBISE.
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              Every live module serves a concrete purpose in a student&apos;s academic routine—connecting exam intelligence, practice, daily study tools, and AI guidance in one cohesive system.
            </p>
          </div>
        </Reveal>

        {/* 4-Column Academic Scope Matrix */}
        <Reveal delay={40}>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-white/10 bg-[#0E0E12] divide-y sm:divide-y-0 sm:divide-x divide-white/10 overflow-hidden">
            {PLATFORM_SCOPE_TIERS.map((tier) => (
              <div key={tier.title} className="p-6 space-y-2">
                <div className="font-mono text-xs text-accent">{tier.label}</div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {tier.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-400">
                  {tier.detail}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Asymmetric Operational Feature Bento Showcase */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Featured Full-Span Spotlight */}
          {featuredFeature && (
            <Reveal delay={60} className="lg:col-span-12">
              <Link
                href={featuredFeature.href}
                className="group block rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.08] via-[#101014] to-[#0B0B0E] p-6 sm:p-8 hover:border-accent/60 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <div className="font-mono text-xs text-accent">
                      {featuredFeature.categoryLabel}
                    </div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white group-hover:text-accent transition-colors">
                      {featuredFeature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                      {featuredFeature.description}
                    </p>
                  </div>

                  <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-white/10 lg:pl-7">
                    <ul className="space-y-2 text-sm text-neutral-300">
                      {featuredFeature.highlights.map((hl) => (
                        <li key={hl} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0"
                          />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="inline-flex items-center gap-2 text-sm font-heading font-bold text-accent">
                      <span>Open AI Workspace</span>
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Asymmetric 2x2 Operational Feature Grid */}
          {secondaryFeatures.map((feature, index) => (
            <Reveal
              key={feature.id}
              delay={80 + index * 40}
              className={
                index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5"
              }
            >
              <Link
                href={feature.href}
                className="group h-full flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0E0E12] p-6 sm:p-7 hover:border-white/25 hover:bg-[#131318] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-neutral-400">
                      {feature.categoryLabel}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-neutral-500 group-hover:text-accent transition-colors shrink-0"
                    />
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <ul className="mt-6 pt-4 border-t border-white/10 space-y-1.5 text-xs sm:text-sm text-neutral-300">
                  {feature.highlights.map((hl) => (
                    <li key={hl} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent/80 shrink-0"
                      />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION F — THE TECHNOLOGY BEHIND IT
         ===================================================================== */}
      <section
        id="technology"
        className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10"
      >
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                <Terminal size={14} />
                <span>Engineering Stack</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Built With Ideas. Powered by Technology.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed">
              Modern web tooling lets one independent creator build fast, reliable software for students nationwide—keeping human authorship separate from AI-assisted coding tools.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <ArchitectureDiagram />
        </Reveal>
      </section>

      {/* =====================================================================
          SECTION G — FOUNDER RESPONSIBILITIES & CREDITS
         ===================================================================== */}
      <section
        id="credits"
        className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/10"
      >
        <Reveal>
          <div className="max-w-2xl space-y-3 mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Attribution &amp; Transparency
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Founder Responsibilities &amp; Platform Credits
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Clear role attribution separating independent human leadership from the software tools and infrastructure supporting Matric Mastery.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Column 1: Human Leadership & Authorship */}
          <Reveal delay={40}>
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent border-b border-white/10 pb-3">
                Human Leadership &amp; Authorship
              </h3>
              <div className="divide-y divide-white/10">
                {humanCredits.map((credit) => (
                  <div key={credit.role} className="py-5 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <span className="text-sm text-neutral-400">{credit.role}</span>
                      <span className="font-heading text-base sm:text-lg font-bold text-white">
                        {credit.entity}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {credit.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Column 2: Technology & Development Ecosystem */}
          <Reveal delay={80}>
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 border-b border-white/10 pb-3">
                Technology &amp; Infrastructure Partners
              </h3>
              <div className="divide-y divide-white/10">
                {techCredits.map((credit) => (
                  <div key={credit.role} className="py-5 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <span className="text-sm text-neutral-400">{credit.role}</span>
                      <span className="font-heading text-base sm:text-lg font-bold text-accent">
                        {credit.entity}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {credit.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Independence & Official Disclaimers */}
        <Reveal delay={100}>
          <div className="mt-10 rounded-2xl border border-white/10 bg-[#0E0E12] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="font-heading text-sm font-bold text-white">
                Independent Educational Platform Notice
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Matric Mastery is an independent student-founded project created by Abdul Wahab. It is not affiliated with, endorsed by, or an official portal of PBCC, PECTAA, FBISE, or any Punjab Board of Intermediate and Secondary Education (BISE). Likewise, Google AI Studio / Gemini is credited strictly as an AI-assisted development tool; Google does not own, sponsor, or endorse this platform.
              </p>
            </div>
            <Link
              href="/legal"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:underline whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <span>Legal &amp; Policies</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* =====================================================================
          SECTION H — MISSION / CLOSING STATEMENT
         ===================================================================== */}
      <section
        id="mission"
        className="mx-auto max-w-site px-5 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28 border-t border-white/10"
      >
        <Reveal>
          <div className="relative rounded-3xl border border-white/10 bg-[#0E0E12] px-6 py-12 sm:px-12 sm:py-16 text-center overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-96 rounded-full bg-accent/12 blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                <Compass size={14} />
                <span>Looking Ahead</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Built With Purpose. Growing With Every Idea.
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-neutral-300">
                Matric Mastery is an independent initiative built around a simple belief: students deserve better access to useful academic resources and technology. This is an ongoing journey, and the platform will continue evolving.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Button href="/" variant="primary" className="min-h-[44px]">
                  <span>Return to Platform</span>
                  <ArrowRight size={16} />
                </Button>
                <Button href="/guide" variant="secondary" className="min-h-[44px]">
                  <span>Open Website Guide</span>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
