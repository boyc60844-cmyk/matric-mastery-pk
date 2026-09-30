"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Mini3DIcon from "./Mini3DIcon";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

interface SubjectItem {
  id: "physics" | "chemistry" | "math" | "biology";
  name: string;
  code: string;
  strategiesCount: string;
  tagline: string;
  highYield: string;
  href: string;
}

const SUBJECTS: SubjectItem[] = [
  {
    id: "physics",
    name: "Physics",
    code: "SSC-II 10TH",
    strategiesCount: "8 Guides",
    tagline: "Numericals & Diagram Derivations",
    highYield: "Ohm's Law, Wave Equation, Coulomb's Law",
    href: "/strategies?subject=Physics",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    code: "SSC-II 10TH",
    strategiesCount: "7 Guides",
    tagline: "Reaction Equations & Apparatus",
    highYield: "Equilibrium, Arrhenius, Organic Chemistry",
    href: "/strategies?subject=Chemistry",
  },
  {
    id: "math",
    name: "Mathematics",
    code: "SSC-II 10TH",
    strategiesCount: "10 Guides",
    tagline: "Elimination & 20-Min Pacing",
    highYield: "Cramer's Rule, Quadratic Nature, Variations",
    href: "/strategies?subject=Mathematics",
  },
  {
    id: "biology",
    name: "Biology",
    code: "SSC-II 10TH",
    strategiesCount: "6 Guides",
    tagline: "Clean Cell Diagrams & Flowcharts",
    highYield: "Gaseous Exchange, Nephron, Reflex Arc",
    href: "/strategies?subject=Biology",
  },
];

function TiltCard({ subject, index }: { subject: SubjectItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinates normalized (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for 15deg 3D tilt
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Glare position
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normalizedX = mouseX / rect.width - 0.5;
    const normalizedY = mouseY / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);

    setGlarePos({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{
        repeat: Infinity,
        duration: 4.5 + index * 0.5,
        ease: "easeInOut",
        delay: index * 0.3,
      }}
      className="perspective-1000"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#121215] p-6 shadow-2xl transition-shadow duration-300 hover:border-accent/40 hover:shadow-brutalist-yellow"
      >
        {/* Dynamic Glare Reflection Effect */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 214, 10, 0.12), transparent 75%)`,
          }}
          aria-hidden="true"
        />

        {/* Card Header with Real 3D Canvas Icon in Corner */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider">
              {subject.code}
            </span>
            <h3 className="mt-1 font-heading text-xl font-black text-white group-hover:text-accent transition-colors">
              {subject.name}
            </h3>
          </div>

          {/* Tiny Real 3D WebGL Canvas Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black/50 border border-white/10 shadow-inner group-hover:border-accent/40 transition-colors">
            <Mini3DIcon type={subject.id} />
          </div>
        </div>

        {/* Body Content */}
        <div className="relative z-10 mt-6 space-y-2">
          <p className="text-xs font-semibold text-white/90">
            {subject.tagline}
          </p>
          <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
            High-yield focus: {subject.highYield}
          </p>
        </div>

        {/* Footer Link */}
        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
            {subject.strategiesCount}
          </span>
          <Link
            href={subject.href}
            className="flex items-center gap-1 text-xs font-heading font-black text-white group-hover:text-accent transition-colors"
          >
            <span>View Playbook</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Subject3DCards() {
  return (
    <section className="relative mx-auto max-w-site px-5 py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-heading font-black text-accent uppercase tracking-wider">
            <Sparkles size={13} /> Real 3D Subject Vault
          </span>
          <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-black text-white">
            Core Matric Subject Strategies
          </h2>
          <p className="mt-2 text-sm text-muted max-w-xl">
            Real 3D interactive subject cards: hover to inspect each topic with responsive 3D tilt
            perspective and live rotating WebGL icons.
          </p>
        </div>

        <Link
          href="/strategies"
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-heading font-bold text-white hover:bg-white/10 transition-colors"
        >
          <BookOpen size={14} className="text-accent" />
          <span>All 30+ Subject Playbooks</span>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SUBJECTS.map((subject, index) => (
          <TiltCard key={subject.id} subject={subject} index={index} />
        ))}
      </div>
    </section>
  );
}
