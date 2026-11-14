"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  AIClassLevel,
  AIExplanationLength,
  AIPreferences,
  AIPresentationStyle,
} from "@/lib/aiClient";

interface AIPreferencesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AIPreferences;
  onUpdatePreferences: (next: AIPreferences) => void;
}

const LENGTH_OPTIONS: { value: AIExplanationLength; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
];

const CLASS_OPTIONS: { value: AIClassLevel; label: string }[] = [
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
];

const STYLE_OPTIONS: { value: AIPresentationStyle; label: string }[] = [
  { value: "step-by-step", label: "Step-by-step" },
  { value: "exam-style", label: "Exam-style" },
  { value: "conceptual", label: "Conceptual" },
];

export default function AIPreferencesPopover({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}: AIPreferencesPopoverProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Tutor Personalization Settings"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/12 bg-[#111116] p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#FFD60A]" aria-hidden="true" />
            <h2 className="font-heading text-sm font-bold text-white">
              Tutor Preferences
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preferences"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-300 hover:text-white cursor-pointer"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-neutral-300">
            Response Language
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdatePreferences({ ...preferences, language: "en" })}
              className={`min-h-[40px] rounded-xl border px-3 text-xs font-medium transition-colors cursor-pointer ${
                preferences.language === "en"
                  ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                  : "border-white/12 bg-white/[0.03] text-neutral-300 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ ...preferences, language: "ur" })}
              className={`min-h-[40px] rounded-xl border px-3 text-xs font-urdu transition-colors cursor-pointer ${
                preferences.language === "ur"
                  ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                  : "border-white/12 bg-white/[0.03] text-neutral-300 hover:text-white"
              }`}
            >
              اردو (Urdu)
            </button>
          </div>
        </div>

        {/* Class Level */}
        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-neutral-300">
            Class Level
          </span>
          <div className="grid grid-cols-2 gap-2">
            {CLASS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  onUpdatePreferences({ ...preferences, classLevel: opt.value })
                }
                className={`min-h-[40px] rounded-xl border px-3 text-xs font-medium transition-colors cursor-pointer ${
                  preferences.classLevel === opt.value
                    ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                    : "border-white/12 bg-white/[0.03] text-neutral-300 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation Length */}
        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-neutral-300">
            Explanation Length
          </span>
          <div className="grid grid-cols-3 gap-2">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  onUpdatePreferences({ ...preferences, explanationLength: opt.value })
                }
                className={`min-h-[40px] rounded-xl border px-2 text-xs font-medium transition-colors cursor-pointer ${
                  preferences.explanationLength === opt.value
                    ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                    : "border-white/12 bg-white/[0.03] text-neutral-300 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Presentation Style */}
        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-neutral-300">
            Answer Presentation
          </span>
          <div className="grid grid-cols-3 gap-2">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  onUpdatePreferences({ ...preferences, presentationStyle: opt.value })
                }
                className={`min-h-[40px] rounded-xl border px-2 text-xs font-medium transition-colors cursor-pointer ${
                  preferences.presentationStyle === opt.value
                    ? "border-[#FFD60A] bg-[#FFD60A] text-black font-semibold"
                    : "border-white/12 bg-white/[0.03] text-neutral-300 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <p className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[11px] leading-relaxed text-neutral-400">
          Saved on this device for Punjab Board Class 9–10 guidance. Preferences shape explanation formatting rather than guaranteeing exact textbook wording.
        </p>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] rounded-xl bg-[#FFD60A] px-4 py-2 text-xs font-semibold text-black hover:bg-[#FFD60A]/90 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
