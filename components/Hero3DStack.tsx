"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Sparkles, TrendingUp } from "lucide-react";

export default function Hero3DStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)"
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setCanHover(mediaQuery.matches && !motionQuery.matches);
    update();

    mediaQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      mediaQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Controlled tilt: max 5 degrees as specified
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), {
    stiffness: 160,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), {
    stiffness: 160,
    damping: 24,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!canHover || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    if (!canHover) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-lg perspective-1200 py-6 select-none"
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          rotateX: canHover ? rotateX : 2,
          rotateY: canHover ? rotateY : -3,
        }}
        className="relative transition-transform duration-300 ease-out"
      >
        {/* Cinematic Ambient Glow Behind Stack */}
        <div
          style={{ transform: "translateZ(-40px)" }}
          className="absolute -inset-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(255,214,10,0.22)_0%,rgba(255,214,10,0.05)_50%,transparent_70%)] blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Layer 0: Underlying Stacked Sheet 1 (Background sheet tilted -4deg) */}
        <div
          style={{ transform: "translateZ(-20px) rotate(-4deg)" }}
          className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0E0E11] p-6 shadow-xl opacity-60 pointer-events-none"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] font-mono text-muted/60">
            <span>BISE MULTAN &bull; CHEMISTRY 10TH</span>
            <span>2024 &rarr; 2025</span>
          </div>
          <div className="mt-4 space-y-2 opacity-30">
            <div className="h-2 w-32 bg-white/20 rounded" />
            <div className="h-1.5 w-full bg-white/10 rounded" />
            <div className="h-1.5 w-4/5 bg-white/10 rounded" />
          </div>
        </div>

        {/* Layer 1: Main Middle Ground Exam Sheet (0deg, translateZ 0px) */}
        <div
          style={{ transform: "translateZ(0px)" }}
          className="card-surface rounded-2xl border border-white/15 p-6 md:p-7 shadow-2xl relative overflow-hidden preserve-3d"
        >
          {/* Sheet Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono text-muted">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-glow" />
              <span className="font-heading font-bold text-white tracking-wider">BISE MULTAN</span>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
              PHYSICS &bull; 10TH BOARD
            </span>
          </div>

          {/* Ruled Pattern Working Area */}
          <div className="relative mt-4 pl-4 border-l-2 border-accent/40 exam-paper-pattern rounded-r-lg p-2.5 font-mono text-xs">
            {/* Margin label */}
            <div className="absolute -left-1 top-1 text-[8px] text-accent/60 uppercase font-mono select-none">
              1.5&quot;
            </div>

            {/* Question Heading with Underline */}
            <div>
              <div className="inline-block border-b-2 border-accent pb-0.5 text-xs font-extrabold text-white font-heading">
                Q.5 (b) Numerical Problem
              </div>
              <div className="mt-2.5 rounded-lg bg-black/45 border border-white/5 p-3 text-[11px] text-white/80 space-y-1">
                <p className="text-accent font-heading font-bold text-[10px] tracking-wider uppercase">Given:</p>
                <p>Mass (m) = 50 kg &emsp; Velocity (v) = 10 m s⁻¹</p>
                <p className="text-accent font-heading font-bold text-[10px] tracking-wider uppercase pt-1">To Find:</p>
                <p>Kinetic Energy (K.E.) = ?</p>
              </div>
            </div>

            {/* Formula & Boxed Answer */}
            <div className="mt-2.5 rounded-lg bg-black/45 border border-white/5 p-3 text-[11px] text-white/80 space-y-1.5">
              <p className="text-accent font-heading font-bold text-[10px] tracking-wider uppercase">Formula:</p>
              <p className="text-white font-bold font-mono">K.E. = ½ m v²</p>
              <p className="text-muted text-[10px] pt-0.5">
                Substitution: K.E. = ½ × (50 kg) × (10 m s⁻¹)²
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-white font-semibold font-heading text-[11px]">Final Result:</span>
                <span className="rounded border-2 border-accent bg-accent/20 px-2.5 py-0.5 font-bold font-mono text-accent shadow-sm">
                  K.E. = 2500 J
                </span>
              </div>
            </div>
          </div>

          {/* Sheet Bottom Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-muted">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check size={14} strokeWidth={3} /> Checker Verified
            </span>
            <div className="flex items-center gap-2">
              <span className="text-muted/60 text-[10px]">PAGE 02 OF 14</span>
              <span className="rounded bg-accent px-2 py-0.5 font-heading font-black text-black text-[11px]">
                05 / 05
              </span>
            </div>
          </div>
        </div>

        {/* Layer 2: Floating 3D "Pattern Analysis" Card (Foreground Z = 45px) */}
        <div
          style={{ transform: "translateZ(45px)" }}
          className="absolute -top-6 -right-4 sm:-right-8 w-60 sm:w-68 rounded-2xl border-2 border-accent/40 bg-[#121214]/95 p-4 shadow-brutalist-yellow backdrop-blur-xl preserve-3d"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-heading font-black tracking-wider text-black uppercase shadow-sm">
              PATTERN FOUND
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-accent font-heading">
              <Sparkles size={11} /> Physics
            </span>
          </div>

          <h3 className="mt-2.5 font-heading text-sm font-extrabold text-white">
            Pattern Analysis
          </h3>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Repeated concepts: <strong className="text-white/90">2024 &rarr; 2025 &rarr; 2026</strong>
          </p>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-black/60 border border-white/10 px-2.5 py-1.5 text-[11px]">
            <span className="text-muted">Formula steps:</span>
            <span className="font-bold text-accent font-mono">+3 Free Marks</span>
          </div>
        </div>

        {/* Layer 3: Floating 3D "Neatness" Badge (Foreground Z = 60px) */}
        <div
          style={{ transform: "translateZ(60px)" }}
          className="absolute -bottom-5 -left-4 sm:-left-8 rounded-xl border border-accent/50 bg-[#141416]/95 px-4 py-2.5 shadow-brutalist-yellow backdrop-blur-xl preserve-3d"
        >
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-black font-black text-[11px]">
              ✓
            </span>
            <span>
              Neatness = <strong className="text-accent font-extrabold">+10 Marks</strong>
            </span>
          </div>
        </div>

        {/* Layer 4: 3-Hour Division Rule Floating Badge */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="hidden sm:flex absolute -bottom-4 right-6 items-center gap-2 rounded-xl border border-white/15 bg-black/85 px-3 py-1.5 text-[11px] font-mono text-muted backdrop-blur-md shadow-soft"
        >
          <TrendingUp size={13} className="text-accent" />
          <span>3-Hour Division Rule</span>
        </div>
      </motion.div>
    </div>
  );
}
