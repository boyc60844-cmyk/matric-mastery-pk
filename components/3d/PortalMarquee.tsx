"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Flame, Star, Sparkles, Layers } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface BlueprintItem {
  number: string;
  tag: string;
  title: string;
  secret: string;
  stats: string;
  slug: string;
}

const BLUEPRINTS: BlueprintItem[] = [
  {
    number: "01",
    tag: "Time Allocation",
    title: "The 3-Hour Division Rule",
    secret: "10 mins MCQs, 60 mins Shorts, 40 mins Longs, and strictly 20 mins final cross-checking.",
    stats: "20 Min Buffer",
    slug: "3-hour-formula",
  },
  {
    number: "02",
    tag: "Checker Psychology",
    title: "The 2-Minute Checking Hack",
    secret: "Checkers scan 300 papers per day. Boxed results and 1.5\" margins win the first 10 seconds.",
    stats: "120s Scan Window",
    slug: "chemistry-diagrams",
  },
  {
    number: "03",
    tag: "MCQ Elimination",
    title: "Zero-Risk Option Stripping",
    secret: "Eliminate two impossible options instantly to double your probability from 25% to 50%.",
    stats: "100% MCQ Accuracy",
    slug: "math-mcq-elimination",
  },
  {
    number: "04",
    tag: "Language Strategy",
    title: "English & Urdu Essay Pacing",
    secret: "Quality headings, quotes with 604 cut marker, and balanced paragraph lengths beat raw word count.",
    stats: "15/15 Marks Strategy",
    slug: "english-essay-length",
  },
  {
    number: "05",
    tag: "Syllabus Pairing",
    title: "Punjab Board Chapter Pairings",
    secret: "Master high-weight chapter groups rather than burning out memorizing non-paired chapters.",
    stats: "85% High Yield",
    slug: "pak-studies-time-management",
  },
];

export default function PortalMarquee() {
  const { isRTL } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [portalWarp, setPortalWarp] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPortalWarp(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
    setPortalWarp(Math.min(12, Math.max(-12, walk * 0.08)));
  };

  return (
    <section className="relative w-full max-w-full min-w-0 overflow-hidden border-y border-white/10 bg-[#07070a] py-16 sm:py-24">
      {/* Background Cinematic Spatial Grid & Vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[700px] max-w-full rounded-full bg-[radial-gradient(ellipse,rgba(255,215,0,0.12)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] font-bold text-accent uppercase tracking-wider">
              <Compass size={13} />
              <span>3D Spatial Strategy Portal</span>
            </div>
            <h2 className="mt-3 font-heading text-2xl sm:text-4xl font-black text-white tracking-tight">
              Topper Blueprints ·{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ffe570] to-[#c9a66b]">
                Drag to Explore
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="hidden sm:inline">Hold & Drag Horizontally</span>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
              <span className="h-2 w-2 rounded-full bg-accent" />
            </div>
          </div>
        </div>

        {/* Draggable 3D Spatial Ribbon */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            perspective: 1200,
          }}
          className="relative flex gap-5 overflow-x-auto pb-6 pt-2 select-none scrollbar-none w-full max-w-full min-w-0"
        >
          {BLUEPRINTS.map((item, idx) => (
            <div
              key={item.number}
              style={{
                transform: `rotateY(${portalWarp}deg) translateZ(${isDragging ? 15 : 0}px)`,
                transition: isDragging ? "transform 0.05s ease-out" : "transform 0.4s ease-out",
              }}
              className="group relative w-[280px] sm:w-[340px] shrink-0 rounded-2xl border border-white/10 bg-[#0e0e12]/90 p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-accent/50 hover:shadow-brutalist-yellow"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-accent">
                  BLUEPRINT #{item.number}
                </span>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted">
                  {item.tag}
                </span>
              </div>

              {/* Card Body */}
              <h3 className="mt-4 font-heading text-lg font-black text-white group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                {item.secret}
              </p>

              {/* Bottom Metric & Link */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-xs font-black text-white/90">
                  {item.stats}
                </span>
                <Link
                  href={`/strategies/${item.slug}`}
                  className="inline-flex items-center gap-1 font-heading text-xs font-bold text-accent group-hover:underline"
                >
                  <span>Read Strategy</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
