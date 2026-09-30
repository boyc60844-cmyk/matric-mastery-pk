"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import DoubtSolverModal from "./DoubtSolverModal";

export default function FloatingDoubtButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside
        aria-label="Student AI Study Assistant"
        className="fixed bottom-5 right-5 z-40 flex items-center"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 rounded-full border border-accent/40 bg-[#121215]/95 px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:bg-black active:scale-95 focus:outline-none"
          title="Ask AI Doubt (Punjab Board & FBISE)"
        >
          {/* Subtle Outer Glow Ping */}
          <span className="absolute -inset-0.5 -z-10 rounded-full bg-accent/20 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Sparkle Icon */}
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-black font-black shadow-glow">
            <Sparkles size={13} className="animate-spin-slow" />
          </div>

          <div className="flex flex-col text-left">
            <span className="font-heading text-xs font-black text-white group-hover:text-accent transition-colors leading-none">
              Ask AI Doubt
            </span>
            <span className="text-[9px] font-mono text-muted leading-tight mt-0.5">
              Instant Solver
            </span>
          </div>
        </button>
      </aside>

      <DoubtSolverModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
