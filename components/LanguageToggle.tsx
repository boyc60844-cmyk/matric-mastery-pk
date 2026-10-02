"use client";

import React from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { Languages } from "lucide-react";
import { motion } from "framer-motion";

interface LanguageToggleProps {
  variant?: "header" | "compact" | "drawer";
}

export default function LanguageToggle({ variant = "header" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "drawer") {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Languages size={16} />
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-white">زبان / Language</p>
            <p className="text-[10px] text-muted">
              {language === "ur" ? "اردو منتخب ہے" : "English selected"}
            </p>
          </div>
        </div>

        <div className="relative flex items-center rounded-xl border border-white/15 bg-black/50 p-1">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`relative z-10 rounded-lg px-3 py-1 text-xs font-heading font-black transition-colors ${
              language === "en" ? "text-black" : "text-muted hover:text-white"
            }`}
          >
            {language === "en" && (
              <motion.span
                layoutId="drawerLangPill"
                className="absolute inset-0 rounded-lg bg-accent shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">ENG</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage("ur")}
            className={`relative z-10 rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
              language === "ur" ? "text-black font-black" : "text-muted hover:text-white"
            }`}
          >
            {language === "ur" && (
              <motion.span
                layoutId="drawerLangPill"
                className="absolute inset-0 rounded-lg bg-accent shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">اردو</span>
          </button>
        </div>
      </div>
    );
  }

  // Header / Compact Pill
  return (
    <div
      role="group"
      aria-label="Language selection"
      className="relative inline-flex items-center rounded-xl border border-white/15 bg-[#141417]/90 p-0.5 backdrop-blur-md shadow-sm transition-colors hover:border-accent/40"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        title="Switch to English"
        className={`relative z-10 flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-heading font-black transition-colors ${
          language === "en" ? "text-black" : "text-muted hover:text-white"
        }`}
      >
        {language === "en" && (
          <motion.span
            layoutId="headerLangPill"
            className="absolute inset-0 rounded-lg bg-accent shadow-sm"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <span className="relative z-10">ENG</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("ur")}
        title="اردو میں دیکھیں"
        className={`relative z-10 flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] transition-colors ${
          language === "ur" ? "text-black font-bold" : "text-muted hover:text-white"
        }`}
      >
        {language === "ur" && (
          <motion.span
            layoutId="headerLangPill"
            className="absolute inset-0 rounded-lg bg-accent shadow-sm"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <span className="relative z-10">اردو</span>
      </button>
    </div>
  );
}
