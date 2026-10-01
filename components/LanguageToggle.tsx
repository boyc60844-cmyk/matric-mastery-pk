"use client";

import React from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { Languages } from "lucide-react";

interface LanguageToggleProps {
  variant?: "header" | "compact" | "drawer";
}

export default function LanguageToggle({ variant = "header" }: LanguageToggleProps) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

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

        <div className="flex items-center rounded-xl border border-white/15 bg-black/40 p-1">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`rounded-lg px-2.5 py-1 text-xs font-heading font-black transition-all ${
              language === "en"
                ? "bg-accent text-black shadow-sm"
                : "text-muted hover:text-white"
            }`}
          >
            ENG
          </button>
          <button
            type="button"
            onClick={() => setLanguage("ur")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              language === "ur"
                ? "bg-accent text-black shadow-sm font-black"
                : "text-muted hover:text-white"
            }`}
          >
            اردو
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center rounded-xl border border-white/15 bg-[#141417]/80 p-0.5 backdrop-blur-md transition-colors hover:border-accent/40"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        title="Switch to English"
        className={`relative flex items-center justify-center rounded-lg px-2 py-1 text-[11px] font-heading font-black transition-all ${
          language === "en"
            ? "bg-accent text-black shadow-sm"
            : "text-muted hover:text-white"
        }`}
      >
        ENG
      </button>

      <span className="h-3 w-px bg-white/10" />

      <button
        type="button"
        onClick={() => setLanguage("ur")}
        title="اردو میں دیکھیں"
        className={`relative flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] transition-all ${
          language === "ur"
            ? "bg-accent text-black shadow-sm font-bold"
            : "text-muted hover:text-white"
        }`}
      >
        اردو
      </button>
    </div>
  );
}
