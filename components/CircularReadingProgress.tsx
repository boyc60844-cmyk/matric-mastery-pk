"use client";

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CircularReadingProgressProps {
  articleRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  variant?: "badge" | "compact";
}

export default function CircularReadingProgress({
  articleRef,
  className = "",
  variant = "badge",
}: CircularReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle floating indicator when scrolled past the top header
      setShowFloating(window.scrollY > 220);

      if (!articleRef?.current) {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const current = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
          setProgress(Math.round(current * 100));
        }
        return;
      }

      const rect = articleRef.current.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Start calculation as user reads through article
      const startOffset = articleTop - 120;
      // Complete when approaching the end of the article text
      const endOffset = articleTop + articleHeight - windowHeight * 0.75;
      const totalScrollable = endOffset - startOffset;

      if (totalScrollable <= 0) {
        setProgress(100);
        return;
      }

      const currentScroll = window.scrollY - startOffset;
      const ratio = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setProgress(Math.round(ratio * 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [articleRef]);

  const radius = 13;
  const circumference = 2 * Math.PI * radius; // ~81.68
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const percentLeft = Math.max(0, 100 - progress);

  return (
    <>
      {/* Top Header Circular Progress Indicator */}
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 backdrop-blur-md transition-colors hover:border-border-hover ${className}`}
        title={`${percentLeft}% left to read (${progress}% completed)`}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Article reading progress"
      >
        {/* Circular SVG Ring */}
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
          <svg className="h-7 w-7 -rotate-90 transform" viewBox="0 0 32 32">
            {/* Background track circle */}
            <circle
              cx="16"
              cy="16"
              r={radius}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="16"
              cy="16"
              r={radius}
              stroke="#FFD60A"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-[stroke-dashoffset] duration-150 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums text-white">
            {progress >= 99 ? (
              <Check size={11} className="text-accent" strokeWidth={3} />
            ) : (
              `${progress}%`
            )}
          </div>
        </div>

        {/* Text description */}
        <div className="text-left text-xs">
          {progress >= 99 ? (
            <span className="font-semibold text-accent">Finished reading</span>
          ) : (
            <span className="text-muted">
              <strong className="font-semibold text-white tabular-nums">{percentLeft}%</strong> left to read
            </span>
          )}
        </div>
      </div>

      {/* Floating Sticky Indicator while reading down the article */}
      <AnimatePresence>
        {showFloating && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 sm:right-6 z-40 flex items-center gap-2 rounded-full border border-border/80 bg-[#09090B]/90 px-3 py-1.5 shadow-soft backdrop-blur-xl"
            aria-hidden="true"
          >
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
              <svg className="h-6 w-6 -rotate-90 transform" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  stroke="#FFD60A"
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-[stroke-dashoffset] duration-150 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold tabular-nums text-white">
                {progress >= 99 ? (
                  <Check size={10} className="text-accent" strokeWidth={3} />
                ) : (
                  `${progress}%`
                )}
              </div>
            </div>

            <div className="text-[11px] font-medium text-muted pr-0.5">
              {progress >= 99 ? (
                <span className="font-semibold text-accent">Finished</span>
              ) : (
                <span>
                  <strong className="font-semibold text-white tabular-nums">{percentLeft}%</strong> left
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
