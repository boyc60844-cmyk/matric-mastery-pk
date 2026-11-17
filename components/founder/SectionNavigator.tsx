"use client";

import React, { useEffect, useState } from "react";
import { STORY_SECTIONS } from "@/lib/founderStoryData";

export default function SectionNavigator() {
  const [activeId, setActiveId] = useState<string>(STORY_SECTIONS[0].id);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.3, 0.6],
      }
    );

    STORY_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      aria-label="Page chapters"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-1.5 rounded-2xl border border-white/10 bg-[#0D0D10]/90 p-2 backdrop-blur-md"
    >
      {STORY_SECTIONS.map((section, idx) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleJump(section.id)}
            className={`group flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-accent/15 text-accent"
                : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.04]"
            }`}
          >
            <span className="font-mono text-[10px] tabular-nums opacity-70">
              0{idx + 1}
            </span>
            <span className="text-[11px] font-medium">{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
