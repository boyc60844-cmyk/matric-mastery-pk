"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import DoubtSolverModal from "./DoubtSolverModal";

export default function FloatingDoubtButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHiddenByOverlay, setIsHiddenByOverlay] = useState(false);

  useEffect(() => {
    const checkOverlay = () => {
      const isLocked =
        document.body.style.overflow === "hidden" ||
        document.documentElement.style.overflow === "hidden" ||
        document.body.getAttribute("data-mobile-menu") === "open";
      setIsHiddenByOverlay(Boolean(isLocked));
    };

    // Check periodically or via mutation observer
    const observer = new MutationObserver(checkOverlay);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style", "data-mobile-menu"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    const handleMenuToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.open === "boolean") {
        setIsHiddenByOverlay(customEvent.detail.open);
      } else {
        checkOverlay();
      }
    };

    window.addEventListener("mm:menu-toggle", handleMenuToggle);
    checkOverlay();

    return () => {
      observer.disconnect();
      window.removeEventListener("mm:menu-toggle", handleMenuToggle);
    };
  }, []);

  return (
    <>
      <aside
        aria-label="Student AI Study Assistant"
        className={`fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex items-center transition-opacity duration-200 ${
          isHiddenByOverlay ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 rounded-full border border-accent/40 bg-[#121215]/95 p-2.5 sm:px-4 sm:py-2.5 shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:bg-black active:scale-95 focus:outline-none"
          title="Ask AI Doubt (Punjab Board & FBISE)"
          aria-label="Ask AI Doubt"
        >
          {/* Subtle Outer Glow Ping */}
          <span className="absolute -inset-0.5 -z-10 rounded-full bg-accent/20 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Sparkle Icon */}
          <div className="flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent text-black font-black shadow-glow shrink-0">
            <Sparkles size={14} className="animate-spin-slow" />
          </div>

          {/* Compact on Phones: Text is only visible on tablet & desktop */}
          <div className="hidden sm:flex flex-col text-left">
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
