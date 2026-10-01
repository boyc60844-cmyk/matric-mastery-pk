"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Eye, MapPin, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ArticleCard from "@/components/ArticleCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import NewsletterForm from "@/components/NewsletterForm";
import Hero3DStack from "@/components/Hero3DStack";
import Hero3DCanvas from "@/components/Hero3DCanvas";
import Subject3DCards from "@/components/Subject3DCards";
import Features3DParticles from "@/components/Features3DParticles";
import { strategyArticles, paperHacks } from "@/lib/content";
import { whatsappLink } from "@/lib/utils";
import { useLanguage } from "@/src/context/LanguageContext";

const homeGridSlugs = [
  "math-mcq-elimination",
  "chemistry-diagrams",
  "english-essay-length",
  "3-hour-formula",
  "pak-studies-time-management",
  "forgot-an-answer",
];

export default function HomePage() {
  const { t, isRTL } = useLanguage();
  const gridArticles = homeGridSlugs.map(
    (slug) => strategyArticles.find((a) => a.slug === slug)!
  );

  return (
    <div className="relative overflow-x-clip">
      {/* =========================================================================
          1. HERO — THE SHOWPIECE (What is Matric Mastery?)
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Real 3D Three.js Canvas: Floating Book, Atom, Graduation Cap & 800 Particles */}
        <Hero3DCanvas />

        {/* Subtle cinematic spotlight glow behind headline */}
        <div
          className="pointer-events-none absolute top-10 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,214,10,0.14)_0%,rgba(255,214,10,0.02)_50%,transparent_75%)] blur-3xl opacity-80"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-site px-5">
          <div className="grid items-center gap-12 lg:grid-cols-[55%_45%]">
            {/* Left: Headline, Badge, Copy, 3D Physical Buttons */}
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-heading font-black tracking-wider text-accent shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-glow" />
                  {isRTL ? "تمام پنجاب بورڈ طلباء کے لیے 100٪ مفت" : "FREE FOR ALL PUNJAB BOARD STUDENTS"}
                </div>
              </Reveal>

              <Reveal delay={80}>
                {isRTL ? (
                  <h1 className="mt-6 font-heading type-display text-white">
                    پنجاب بورڈ میں{" "}
                    <span className="relative inline-block text-accent underline decoration-accent/40 decoration-wavy [text-shadow:0_0_40px_rgba(255,214,10,0.45)]">
                      1050+ نمبر حاصل کریں
                    </span>
                    ، ٹاپرز کی آزمودہ حکمت عملی سے۔
                  </h1>
                ) : (
                  <h1 className="mt-6 font-heading type-display text-white">
                    Your Paper Presentation Matters{" "}
                    <span className="relative inline-block text-accent underline decoration-accent/40 decoration-wavy [text-shadow:0_0_40px_rgba(255,214,10,0.45)]">
                      More Than Your Preparation.
                    </span>
                  </h1>
                )}
              </Reveal>

              <Reveal delay={160}>
                {isRTL ? (
                  <>
                    <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
                      میں ملتان سے دسویں جماعت کا طالب علم ہوں۔ میں کوئی استاد نہیں ہوں اور نہ یہ کوئی اکیڈمی ہے۔ میں نے بورڈ پیپر چیکنگ کے خفیہ اصول سمجھے ہیں اور ہر حکمت عملی مفت فراہم کر رہا ہوں۔
                    </p>
                    <p className="mt-3 text-sm font-semibold text-white/80 font-mono">
                      نویں اور دسویں کے لیے خاص، 8ویں سے 12ویں تک سب کے لیے مفید۔
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
                      I am a 10th grader from Multan. I am not a teacher, and this is
                      not an academy. I just figured out how board checking really works &mdash;
                      and I am sharing every single game plan for free.
                    </p>
                    <p className="mt-3 text-sm font-semibold text-white/80 font-mono">
                      Built for Matric, useful for all &mdash; 8th to 12th.
                    </p>
                  </>
                )}
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Button href="/strategies" variant="primary">
                    {isRTL ? "حکمت عملیاں دیکھیں" : "Explore Strategies"} <ArrowRight size={16} />
                  </Button>
                  <Button href="/mock-tests" variant="secondary">
                    {isRTL ? "ماک ٹیسٹ شروع کریں" : "Start Mock Test"}
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Right: Spatial Paper Analysis Object */}
            <div className="relative">
              <Reveal delay={180} y={20}>
                <Hero3DStack />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PROOF SECTION (Genuine Data Cards with 3D Protruding Numbers)
          ========================================================================= */}
      <section className="relative border-y border-white/10 bg-[#0C0C0E]/70 py-12 backdrop-blur-md">
        <div className="mx-auto grid max-w-site grid-cols-2 gap-6 px-5 md:grid-cols-4">
          <Reveal delay={0}>
            <div className="card-surface rounded-2xl p-6 border border-white/10 shadow-soft transition-all duration-300 hover:border-accent/40 hover:shadow-brutalist-yellow">
              <AnimatedCounter
                value={500}
                suffix="+"
                label={isRTL ? "واٹس ایپ گروپ کے طلباء" : "Students in Group"}
                sublabel={isRTL ? "ہفتہ وار اتوار گائیڈ" : "Weekly Sunday breakdown"}
              />
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="card-surface rounded-2xl p-6 border border-white/10 shadow-soft transition-all duration-300 hover:border-accent/40 hover:shadow-brutalist-yellow">
              <AnimatedCounter
                value={strategyArticles.length}
                label={isRTL ? "امتحانی حکمت عملیاں" : "Game Plan Strategies"}
                sublabel={isRTL ? "ہر مضمون کے خاص فارمولے" : "Subject-specific formulas"}
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card-surface rounded-2xl p-6 border border-white/10 shadow-soft transition-all duration-300 hover:border-accent/40 hover:shadow-brutalist-yellow">
              <AnimatedCounter
                value={paperHacks.length}
                label={isRTL ? "پیپر پریزنٹیشن ہیکس" : "Paper Presentation Hacks"}
                sublabel={isRTL ? "ملتان اور پنجاب بورڈز پر آزمودہ" : "Tested on Punjab Boards"}
              />
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="card-surface rounded-2xl p-6 border border-white/10 shadow-soft transition-all duration-300 hover:border-accent/40 hover:shadow-brutalist-yellow">
              <AnimatedCounter
                value={0}
                prefix={isRTL ? "روپے " : "Rs. "}
                label={isRTL ? "اکیڈمی اور ٹیوشن فیس" : "Tuition Fees"}
                sublabel={isRTL ? "ہمیشہ 100٪ مفت" : "100% Free Forever"}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          YOUR MATRIC TOOLKIT (Interactive Exam-Prep Engine)
          ========================================================================= */}
      <section className="relative mx-auto max-w-site px-5 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-heading font-black text-accent uppercase tracking-wider">
              <Zap size={13} /> {isRTL ? "انٹرایکٹو اسٹڈی پلیٹ فارم" : "Interactive Study Platform"}
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-black text-white">
              {isRTL ? "بورڈ ٹاپرز کا امتحانی ٹول کٹ" : "Your Matric Toolkit"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {isRTL
                ? "نویں اور دسویں جماعت پنجاب اور فیڈرل بورڈ کے طلباء کے لیے انٹرایکٹو تیاری، ماضی کے پرچے اور ماک ٹیسٹ۔"
                : "Built directly for Punjab Boards & Federal Board: solve doubts, drill timed mock tests, generate past paper templates, and monitor syllabus retention."}
            </p>
          </div>
          <Button href="/mock-tests" variant="secondary" className="text-xs">
            {isRTL ? "تمام ٹولز کھولیں" : "Open All Tools"} <ArrowRight size={14} />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tool 1: Ask a Doubt */}
          <Reveal delay={0}>
            <Link href="/mock-tests" className="block group">
              <Card tilt={true} depth="hover-yellow" className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-black font-black shadow-glow mb-4">
                    <span className="text-xl">💡</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-accent transition-colors">
                    Ask a Doubt
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Instant step-by-step solutions for Math, Physics, and Chemistry questions with Punjab Board formulas and Urdu support.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-heading font-black text-accent">
                  <span>Ask in Floating Assistant</span> &rarr;
                </div>
              </Card>
            </Link>
          </Reveal>

          {/* Tool 2: Take a Mock Test */}
          <Reveal delay={60}>
            <Link href="/mock-tests" className="block group">
              <Card tilt={true} depth="hover-yellow" className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-black font-black shadow-glow mb-4">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-accent transition-colors">
                    Take a Mock Test
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Timed 25, 50, or 75 marks exam sessions with accurate countdown timers, auto-submit, and downloadable performance reports.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-heading font-black text-accent">
                  <span>Start Mock Test</span> &rarr;
                </div>
              </Card>
            </Link>
          </Reveal>

          {/* Tool 3: Practice Papers */}
          <Reveal delay={120}>
            <Link href="/past-papers" className="block group">
              <Card tilt={true} depth="hover-yellow" className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-black font-black shadow-glow mb-4">
                    <span className="text-xl">📜</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-accent transition-colors">
                    Practice Papers
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Authentic Board paper templates across Multan, Lahore, Rawalpindi, and FBISE from 2019 to 2025 with printable sheets.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-heading font-black text-accent">
                  <span>Generate Paper Set</span> &rarr;
                </div>
              </Card>
            </Link>
          </Reveal>

          {/* Tool 4: Track Progress */}
          <Reveal delay={180}>
            <Link href="/dashboard" className="block group">
              <Card tilt={true} depth="hover-yellow" className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-black font-black shadow-glow mb-4">
                    <span className="text-xl">📈</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-accent transition-colors">
                    Track Progress
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Monitor your study streak, XP levels, daily goal checklists, test accuracy, and focus areas without signing up.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-heading font-black text-accent">
                  <span>Open Student Dashboard</span> &rarr;
                </div>
              </Card>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          REAL 3D SUBJECT VAULT (Physics, Chemistry, Math, Biology 3D Tilt Cards)
          ========================================================================= */}
      <Subject3DCards />

      {/* =========================================================================
          3. PROBLEM & FEATURE SECTION (4 Distinctive CSS-Crafted Visuals with 3D Depth)
          ========================================================================= */}
      <section className="relative mx-auto max-w-site px-5 py-20 md:py-28 overflow-hidden">
        {/* 3D Subtle Particle Field (300 particles, low opacity 0.3) */}
        <Features3DParticles />

        <div className="relative z-10 max-w-2xl">
          <SectionHeading
            eyebrow="The Core Problem"
            title="Why Hardworking Students Lose Marks in Board Exams"
            description="Board checkers evaluate an entire 3-hour paper in under 2 minutes. When pages are cramped and answers are buried in paragraphs, marks get cut regardless of your preparation."
          />
        </div>

        {/* 4 Feature Cards with Distinctive CSS/Div Visuals */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1: Paper Pattern Analysis (Paper Stack Visual) */}
          <Reveal delay={0}>
            <Card tilt={true} depth="hover-yellow" className="flex h-full flex-col justify-between p-6">
              <div>
                {/* CSS Paper Stack Visual */}
                <div className="relative mb-6 h-28 w-full rounded-xl bg-black/40 border border-white/10 p-3 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-x-5 top-2 h-16 rounded-lg bg-white/5 border border-white/10 -rotate-3" />
                  <div className="relative z-10 w-full rounded-lg bg-[#141416] border border-accent/40 p-2.5 shadow-md">
                    <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                      <span>PHYSICS 10TH</span>
                      <span className="font-bold">PATTERN MATCH</span>
                    </div>
                    <div className="mt-1.5 flex gap-1">
                      <span className="h-1.5 w-1/3 bg-accent rounded" />
                      <span className="h-1.5 w-1/4 bg-white/20 rounded" />
                      <span className="h-1.5 w-1/4 bg-white/20 rounded" />
                    </div>
                    <p className="mt-1 text-[9px] text-muted font-mono">Repeated 4 out of 5 years</p>
                  </div>
                </div>

                <span className="font-heading text-xs font-black uppercase tracking-wider text-accent">
                  Intelligence
                </span>
                <h3 className="mt-2 font-heading text-lg font-bold text-white">
                  Paper Pattern Analysis
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Spot repeated chapter pairings and numerical trends before you even sit in the hall.
                </p>
              </div>
            </Card>
          </Reveal>

          {/* Feature 2: Past Paper Strategy (Layered Question-Sheet Visual) */}
          <Reveal delay={80}>
            <Card tilt={true} depth="hover-yellow" className="flex h-full flex-col justify-between p-6">
              <div>
                {/* CSS Question-Sheet Timing Visual */}
                <div className="relative mb-6 h-28 w-full rounded-xl bg-black/40 border border-white/10 p-3 overflow-hidden flex flex-col justify-center font-mono text-[10px]">
                  <div className="flex items-center justify-between text-white/80 pb-1 border-b border-white/10">
                    <span>Q.1 MCQs</span>
                    <span className="text-accent font-bold">10 min</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80 py-1 border-b border-white/10">
                    <span>Q.2-4 Shorts</span>
                    <span className="text-accent font-bold">60 min</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80 pt-1">
                    <span>Long &amp; Review</span>
                    <span className="text-emerald-400 font-bold">40 min buffer</span>
                  </div>
                </div>

                <span className="font-heading text-xs font-black uppercase tracking-wider text-accent">
                  Pacing
                </span>
                <h3 className="mt-2 font-heading text-lg font-bold text-white">
                  Past Paper Strategy
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  The exact 3-hour formula that prevents exam panic and leaves 20 minutes for final review.
                </p>
              </div>
            </Card>
          </Reveal>

          {/* Feature 3: Presentation Hacks (Stylized Answer-Sheet Visual) */}
          <Reveal delay={160}>
            <Card tilt={true} depth="hover-yellow" className="flex h-full flex-col justify-between p-6">
              <div>
                {/* CSS Stylized Answer-Sheet Visual */}
                <div className="relative mb-6 h-28 w-full rounded-xl bg-[#111113] border border-white/10 p-2.5 overflow-hidden flex flex-col justify-center">
                  <div className="border-l-2 border-accent pl-2 space-y-1">
                    <div className="inline-block border-b border-accent text-[9px] font-heading font-bold text-white">
                      Q.3 Electric Potential
                    </div>
                    <div className="h-1 w-full bg-white/20 rounded" />
                    <div className="flex items-center justify-between pt-1">
                      <span className="rounded border border-accent/60 bg-accent/15 px-1.5 py-0.5 text-[8px] font-mono text-accent">
                        V = W / q
                      </span>
                      <span className="text-emerald-400 font-bold text-[9px] flex items-center gap-0.5">
                        &check; +10 Marks
                      </span>
                    </div>
                  </div>
                </div>

                <span className="font-heading text-xs font-black uppercase tracking-wider text-accent">
                  Visuals
                </span>
                <h3 className="mt-2 font-heading text-lg font-bold text-white">
                  Presentation Hacks
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  How 1.5-inch margins, boxed numericals, and single-line cuts instantly win checker trust.
                </p>
              </div>
            </Card>
          </Reveal>

          {/* Feature 4: Preparation Intel (Radar/Grid-Inspired CSS Visual) */}
          <Reveal delay={240}>
            <Card tilt={true} depth="hover-yellow" className="flex h-full flex-col justify-between p-6">
              <div>
                {/* CSS Radar / Frequency Visual */}
                <div className="relative mb-6 h-28 w-full rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,214,10,0.15)_0%,transparent_65%)]" />
                  <div className="relative h-20 w-20 rounded-full border border-accent/30 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full border border-dashed border-accent/50 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                    </div>
                    <span className="absolute top-2 right-4 h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="absolute bottom-3 left-4 h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <span className="absolute bottom-1 right-2 text-[8px] font-mono text-muted">BISE MULTAN GRID</span>
                </div>

                <span className="font-heading text-xs font-black uppercase tracking-wider text-accent">
                  Targeted
                </span>
                <h3 className="mt-2 font-heading text-lg font-bold text-white">
                  Preparation Intel
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Focus on high-yield questions rather than exhausting yourself memorizing low-weight pages.
                </p>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          4. METHOD (Zero Academy & Multan Board Tested)
          ========================================================================= */}
      <section className="relative mx-auto max-w-site px-5 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Zero Academy Needed",
              desc: "Every strategy is designed to work completely from self-study at home without expensive evening coaching.",
            },
            {
              icon: Eye,
              title: "The Checker Mindset",
              desc: "Learn to read your own paper like an exhausted board teacher with 300 answer books on their desk.",
            },
            {
              icon: MapPin,
              title: "Multan Board Tested",
              desc: "Built and verified strictly for Punjab Boards (BISE Multan, Lahore, Rawalpindi, Faisalabad, Gujranwala).",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <Card depth="hover-yellow" className="h-full preserve-3d">
                <div className="inline-flex rounded-xl border border-white/10 bg-black/60 p-3 shadow-inner">
                  <item.icon size={22} strokeWidth={2} className="text-accent" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{item.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED STORY (Deep Breakdown)
          ========================================================================= */}
      <section className="relative mx-auto max-w-site px-5 py-16 md:py-24">
        <Reveal>
          <Card
            shimmer
            depth="yellow"
            className="p-7 md:p-12 border-accent/40 bg-[#121214]/95 shadow-brutalist-yellow"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-accent px-3 py-1 font-heading text-xs font-black tracking-wider text-black uppercase">
                MOST READ STRATEGY
              </span>
              <span className="text-xs font-mono text-muted">10TH CLASS MATHEMATICS</span>
            </div>

            <h2 className="mt-4 font-heading text-2xl font-extrabold text-white md:text-3xl max-w-3xl">
              How I Finished My Math Paper 20 Minutes Early (And Still Got Full Marks)
            </h2>

            <div className="mt-5 max-w-2xl space-y-3.5 text-muted leading-relaxed">
              <p>
                Everyone in the exam hall thinks finishing early means you rushed it or you&apos;re some kind of genius.
                I am not a genius. I just stopped treating every single short question like it deserved 15 minutes of long essay working.
              </p>
              <p>
                The trick was simple: execute MCQs by elimination, write concise Given-ToFind blocks for numericals,
                and leave exactly 20 minutes to cross-verify every question number against the paper sheet.
              </p>
              <p className="text-white/90 font-semibold">
                Ratta won&apos;t save you if your time management doesn&apos;t exist.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Button href="/strategies/3-hour-formula" variant="primary">
                Read Full Game Plan
              </Button>
              <Button href="/paper-hacks" variant="secondary">
                View Presentation Hacks
              </Button>
            </div>
          </Card>
        </Reveal>
      </section>

      {/* =========================================================================
          6. TOOLS & STRATEGIES (Articles Grid)
          ========================================================================= */}
      <section className="relative mx-auto max-w-site px-5 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Game Plans"
            title="Latest Board Strategies"
            description="Specific, actionable playbooks for every tricky subject on the Punjab Board syllabus."
          />
          <Button href="/strategies" variant="secondary" className="text-xs">
            View All Strategies &rarr;
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article, i) => (
            <Reveal key={article.slug} delay={(i % 3) * 80}>
              <ArticleCard
                article={article}
                href={`/strategies/${article.slug}`}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. ARCHITECTURAL FINAL CTA (Fix the system, not yourself)
          ========================================================================= */}
      <section className="relative border-t border-white/10 bg-[#080809] py-20 md:py-32 overflow-hidden">
        {/* Cinematic bottom glow */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[450px] w-[750px] rounded-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,214,10,0.18)_0%,rgba(255,214,10,0.03)_50%,transparent_75%)] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            {/* Illuminated Platform Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-1.5 font-heading text-xs font-black tracking-wider text-accent shadow-sm">
              <Zap size={14} className="text-accent" />
              JOIN 500+ PUNJAB BOARD STUDENTS
            </div>

            {/* Architecture Headline */}
            <h2 className="mt-6 font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Fix the system,{" "}
              <span className="text-accent underline decoration-accent/40 decoration-wavy [text-shadow:0_0_35px_rgba(255,214,10,0.45)]">
                not yourself.
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
              No spam. No courses. Just one high-impact board exam strategy
              delivered to your WhatsApp every Sunday.
            </p>

            {/* Newsletter input with Physical 3D Button */}
            <div className="mt-8">
              <NewsletterForm />
            </div>

            {/* Direct WhatsApp link */}
            <p className="mt-6 text-xs text-muted font-mono">
              Have an urgent question before exams?{" "}
              <a
                href={whatsappLink("Bhai mujhe board exam preparation ke liye advice chahiye")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-bold"
              >
                Message Hamza directly on WhatsApp &rarr;
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
