"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Layers,
  Cpu,
  GitBranch,
  Globe,
  Server,
  UserCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { TECH_STACK_NODES, TechStackNode } from "@/lib/founderStoryData";

const NODE_ICONS: Record<string, React.ReactNode> = {
  frontend: <Layers size={18} />,
  "ai-tooling": <Cpu size={18} />,
  github: <GitBranch size={18} />,
  vercel: <Globe size={18} />,
  cloudflare: <Server size={18} />,
};

export default function ArchitectureDiagram() {
  const [selectedId, setSelectedId] = useState<string>(TECH_STACK_NODES[0].id);
  const prefersReducedMotion = useReducedMotion();

  const activeNode: TechStackNode =
    TECH_STACK_NODES.find((node) => node.id === selectedId) || TECH_STACK_NODES[0];

  return (
    <div className="space-y-8">
      {/* Architecture Blueprint Pipeline Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0F0F12] p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-mono tracking-wider text-accent uppercase">
              System Architecture Blueprint
            </p>
            <h3 className="mt-1 font-heading text-lg sm:text-xl font-bold text-white">
              Human Vision Meets Modern Edge Infrastructure
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <UserCheck size={15} className="text-accent shrink-0" />
            <span>Directed by Abdul Wahab · Select any layer to inspect</span>
          </div>
        </div>

        {/* Interactive 5-Node Stack Strip */}
        <div
          role="tablist"
          aria-label="Matric Mastery Technology Stack"
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {TECH_STACK_NODES.map((node, index) => {
            const isSelected = node.id === selectedId;
            return (
              <button
                key={node.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`tech-panel-${node.id}`}
                onClick={() => setSelectedId(node.id)}
                className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer min-h-[112px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isSelected
                    ? "border-accent bg-accent/[0.08]"
                    : "border-white/10 bg-[#141418] hover:border-white/25 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                      isSelected
                        ? "border-accent/40 bg-accent text-black"
                        : "border-white/10 bg-white/[0.04] text-neutral-300 group-hover:text-white"
                    }`}
                  >
                    {NODE_ICONS[node.id]}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-neutral-500">
                    0{index + 1}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-mono text-neutral-400 truncate">
                    {node.roleTitle}
                  </div>
                  <div
                    className={`mt-0.5 font-heading text-sm sm:text-base font-bold transition-colors ${
                      isSelected ? "text-accent" : "text-white"
                    }`}
                  >
                    {node.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Connected Flow Strip (Desktop visual bridge) */}
        <div className="mt-6 hidden lg:flex items-center justify-between px-2 py-2.5 rounded-lg border border-white/5 bg-black/30 text-[11px] font-mono text-neutral-400">
          <span>Founder Direction (Abdul Wahab)</span>
          <ArrowRight size={13} className="text-accent/70" />
          <span>AI-Assisted Coding (Google AI Studio)</span>
          <ArrowRight size={13} className="text-accent/70" />
          <span>Source Control (GitHub)</span>
          <ArrowRight size={13} className="text-accent/70" />
          <span>Web Hosting (Vercel) &amp; Edge AI (Cloudflare Workers)</span>
        </div>

        {/* Active Layer Detail Inspector */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              id={`tech-panel-${activeNode.id}`}
              role="tabpanel"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400">
                  <span className="text-accent font-semibold">{activeNode.layer}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeNode.attributionType}</span>
                </div>

                <h4 className="font-heading text-2xl font-bold text-white">
                  {activeNode.name}
                </h4>

                <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
                  {activeNode.plainExplanation}
                </p>
              </div>

              <div className="lg:col-span-5 space-y-4 rounded-xl border border-white/10 bg-[#141418] p-5">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    What It Handles
                  </div>
                  <p className="mt-1.5 text-sm text-neutral-200 leading-relaxed">
                    {activeNode.technicalRole}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-accent">
                    <ShieldCheck size={13} />
                    <span>Human &amp; Tool Boundary</span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {activeNode.humanDistinction}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
