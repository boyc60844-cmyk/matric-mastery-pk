"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Sparkles, Timer, CheckCircle, Zap } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface GlassCardProps {
  title: string;
  badge: string;
  desc: string;
  actionText: string;
  href: string;
  icon: React.ReactNode;
  highlightColor?: string;
  stat: string;
  statLabel: string;
}

function GlassFeatureCard({
  title,
  badge,
  desc,
  actionText,
  href,
  icon,
  stat,
  statLabel,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
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
    setMousePos({ x, y });
  };

  // 3D Tilt calculation
  const tiltX = isHovered && canHover ? (mousePos.y - 50) * -0.16 : 0;
  const tiltY = isHovered && canHover ? (mousePos.x - 50) * 0.16 : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${isHovered ? 12 : 0}px)`,
        transition: isHovered
          ? "transform 0.12s cubic-bezier(0.2, 0, 0, 1)"
          : "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0e0e12]/80 p-5 sm:p-6 backdrop-blur-xl shadow-2xl overflow-hidden transition-colors hover:border-accent/40 z-20 pointer-events-auto w-full max-w-full min-w-0"
    >
      <Link href={href} className="absolute inset-0 z-30 pointer-events-auto" aria-label={title}>
        <span className="sr-only">{title}</span>
      </Link>
      {/* Dynamic Cursor Spotlight Border Glow */}
      <div
        style={{
          background: isHovered
            ? `radial-gradient(circle 180px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 215, 0, 0.18), transparent 70%)`
            : "transparent",
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-100"
        aria-hidden="true"
      />

      {/* Top Header Badge & Icon */}
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent uppercase tracking-wider">
            {badge}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent transition-transform group-hover:scale-110 group-hover:text-white">
            {icon}
          </div>
        </div>

        <h3 className="mt-4 font-heading text-lg font-black text-white group-hover:text-accent transition-colors flex items-center justify-between">
          <span>{title}</span>
          <ArrowUpRight size={16} className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Bottom Proof Metric & CTA */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="block font-mono text-base font-black text-white">{stat}</span>
          <span className="block font-mono text-[10px] text-muted uppercase tracking-wider">{statLabel}</span>
        </div>
        <span className="rounded-lg bg-white/5 px-3 py-1 font-heading text-xs font-bold text-accent border border-white/10 group-hover:bg-accent group-hover:text-black transition-colors">
          {actionText}
        </span>
      </div>
    </div>
  );
}

export default function Hero3DGlassCards() {
  const { isRTL } = useLanguage();

  return (
    <div className="w-full max-w-full min-w-0 relative z-20 pointer-events-auto mt-10">
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
        {/* Card 1: Paper Perfect */}
        <GlassFeatureCard
          title={isRTL ? "پیپر پریزنٹیشن ہیکس" : "Paper Perfect"}
          badge={isRTL ? "بورڈ چیکر سائیکالوجی" : "Presentation Science"}
          desc={
            isRTL
              ? "1.5 انچ حاشیہ، کٹ مارکر 605 کا استعمال اور بکسڈ فارمولے جو ممتحن کا اعتماد جیتتے ہیں۔"
              : "1.5-inch margins, 605 cut marker hierarchy, and boxed formulas that win examiner trust in 2 minutes."
          }
          actionText={isRTL ? "ہیکس دیکھیں" : "Explore Hacks"}
          href="/paper-hacks"
          icon={<Sparkles size={18} />}
          stat="+10 to 15"
          statLabel={isRTL ? "اضافی مفت نمبر" : "Average Marks Gained"}
        />

        {/* Card 2: Ask AI Doubt */}
        <GlassFeatureCard
          title={isRTL ? "اے آئی ڈاؤٹ حل" : "Ask AI Doubt"}
          badge={isRTL ? "پنجاب بورڈ نصاب" : "Instant Topper AI"}
          desc={
            isRTL
              ? "ریاضی، فزکس اور کیمسٹری کے سوالات کے مرحلہ وار حل مع بورڈ پیئرنگ اصول اور اردو رہنمائی۔"
              : "Instant step-by-step solutions for Math, Physics, and Chem numericals with official BISE formulas."
          }
          actionText={isRTL ? "سوال پوچھیں" : "Ask Solution"}
          href="/mock-tests"
          icon={<Zap size={18} />}
          stat="24/7 Free"
          statLabel={isRTL ? "فوراً جوابی مدد" : "No Academy Fee"}
        />

        {/* Card 3: Mock Test Simulator */}
        <GlassFeatureCard
          title={isRTL ? "ٹائمڈ ماک ٹیسٹ" : "Mock Test Engine"}
          badge={isRTL ? "حقیقی بورڈ پیٹرن" : "Timer & Bubble Sheet"}
          desc={
            isRTL
              ? "25، 50 اور 75 نمبروں کے مکمل امتحانی پرچے حقیقی کاؤنٹ ڈاؤن ٹائمر اور او ایم آر شیٹ کے ساتھ۔"
              : "Full chapter-wise and full-book timed exam drills with accurate countdown timers and OMR bubble sheets."
          }
          actionText={isRTL ? "ٹیسٹ شروع کریں" : "Start Test"}
          href="/mock-tests"
          icon={<Timer size={18} />}
          stat="1050+ Club"
          statLabel={isRTL ? "ٹاپرز کی تیاری" : "Tested Strategy"}
        />
      </div>
    </div>
  );
}
