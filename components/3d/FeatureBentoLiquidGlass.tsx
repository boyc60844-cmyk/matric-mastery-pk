"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  FileCheck,
  Timer,
  FileText,
  ShieldAlert,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface BentoItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  href: string;
  actionText: string;
  span?: string;
  accentMetric?: string;
}

const BENTO_CARDS: BentoItem[] = [
  {
    id: "strategies",
    badge: "Subject Playbooks",
    title: "Tested Board Strategies",
    desc: "30+ subject-specific formulas for Physics, Chemistry, Math, and Biology with high-yield chapter pairings.",
    icon: <BookOpen className="text-accent" size={22} />,
    href: "/strategies",
    actionText: "Browse All Guides",
    span: "sm:col-span-2 lg:col-span-2",
    accentMetric: "30+ Subject Guides",
  },
  {
    id: "presentation",
    badge: "Presentation Studio",
    title: "1.5\" Margin & 605 Cut Marker Hacks",
    desc: "Transform your sheet layout to win maximum marks from examiners reviewing in under 2 minutes.",
    icon: <Sparkles className="text-accent" size={22} />,
    href: "/paper-hacks",
    actionText: "View Paper Hacks",
    span: "sm:col-span-1 lg:col-span-1",
    accentMetric: "+15 Marks Avg",
  },
  {
    id: "ai-doubt",
    badge: "Instant Assistance",
    title: "AI Exam Doubt Solver",
    desc: "Solve tricky formulas, chemical balancing equations, and Urdu grammar questions with 24/7 step-by-step guidance.",
    icon: <Zap className="text-accent" size={22} />,
    href: "/mock-tests",
    actionText: "Ask a Doubt Now",
    span: "sm:col-span-1 lg:col-span-1",
    accentMetric: "Instant BISE Solves",
  },
  {
    id: "mock-tests",
    badge: "Exam Simulation",
    title: "Timed 3-Hour Mock Tests",
    desc: "Strict countdowns, OMR bubble sheet practice, and immediate performance analytics for 9th and 10th class.",
    icon: <Timer className="text-accent" size={22} />,
    href: "/mock-tests",
    actionText: "Take Practice Test",
    span: "sm:col-span-2 lg:col-span-2",
    accentMetric: "Full BISE Timing",
  },
  {
    id: "past-papers",
    badge: "Archive 2019–2025",
    title: "Past Paper Vault & Templates",
    desc: "Original BISE Multan, Lahore, Faisalabad, and Federal Board past papers with printable templates.",
    icon: <FileText className="text-accent" size={22} />,
    href: "/past-papers",
    actionText: "Generate Paper Set",
    span: "sm:col-span-1 lg:col-span-1",
    accentMetric: "5+ Years Solved",
  },
  {
    id: "guidebook",
    badge: "Crisis Protocol",
    title: "Exam Day Survival Guidebook",
    desc: "Center rules, carry checklist, barcode protocols, and emergency crisis desk for forgotten roll slips.",
    icon: <ShieldAlert className="text-accent" size={22} />,
    href: "/exam-day-guidebook",
    actionText: "Open Survival Guide",
    span: "sm:col-span-2 lg:col-span-2",
    accentMetric: "Zero Panic",
  },
];

function LiquidGlassCard({ item }: { item: BentoItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (hover: hover)");
    setCanHover(mq.matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0c0c10]/85 p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 hover:border-accent/40 hover:shadow-2xl overflow-hidden ${
        item.span || ""
      }`}
    >
      {/* Liquid Glass Refraction Specular Gradient */}
      <div
        style={{
          background: isHovered
            ? `radial-gradient(circle 240px at ${mouse.x}% ${mouse.y}%, rgba(255, 215, 0, 0.16) 0%, rgba(201, 166, 107, 0.05) 50%, transparent 80%)`
            : "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)",
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] font-bold text-accent uppercase tracking-wider">
            {item.badge}
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-inner group-hover:scale-105 transition-transform">
            {item.icon}
          </div>
        </div>

        <h3 className="mt-5 font-heading text-xl font-black text-white group-hover:text-accent transition-colors">
          {item.title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
          {item.desc}
        </p>
      </div>

      {/* Bottom Footer & CTA Link */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-white/80">
          {item.accentMetric}
        </span>
        <Link
          href={item.href}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 font-heading text-xs font-bold text-white group-hover:border-accent/40 group-hover:bg-accent group-hover:text-black transition-all active:scale-95"
        >
          <span>{item.actionText}</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default function FeatureBentoLiquidGlass() {
  const { isRTL } = useLanguage();

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 py-20 sm:py-28 overflow-hidden min-w-0">
      {/* Subtle Background Glow */}
      <div
        className="pointer-events-none absolute top-1/3 right-1/4 -z-10 h-[450px] w-[450px] max-w-full rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.08)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] font-bold text-accent uppercase tracking-wider mb-3">
          <Sparkles size={13} />
          <span>Matric Mastery Engine</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Everything You Need to Score{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ffe570] to-[#c9a66b]">
            1050+
          </span>
        </h2>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Six foundational exam-prep pillars designed specifically for Punjab Board examiners' checking style.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENTO_CARDS.map((card) => (
          <LiquidGlassCard key={card.id} item={card} />
        ))}
      </div>
    </section>
  );
}
