"use client";

import React from "react";
import { BankQuestion, PaperItemSlot, StudentResponseValue } from "@/lib/mock-tests/types";
import { FormattedContent } from "@/components/mock-tests/question-types/FormattedContent";
import { DiagramViewer } from "@/components/mock-tests/question-types/DiagramViewer";

interface QuestionInputRendererProps {
  question: BankQuestion;
  slot: PaperItemSlot;
  value?: StudentResponseValue;
  onChange: (next: StudentResponseValue) => void;
  disabled?: boolean;
}

const MATH_SYMBOLS = ["²", "³", "√", "×", "÷", "±", "Δ", "θ", "°", "→", "⇌", "≤", "≥", "≠"];

export function QuestionInputRenderer({
  question,
  slot,
  value,
  onChange,
  disabled = false,
}: QuestionInputRendererProps) {
  // Helper to append symbol into text editor
  const appendSymbolToText = (sym: string, currentText: string) => {
    onChange({ kind: "text_response", text: currentText + sym });
  };

  return (
    <div className="space-y-4">
      {/* Stimulus Table if provided */}
      {question.stimulusTable && (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
          <table className="w-full text-left text-xs font-mono">
            {question.stimulusTable.caption && (
              <caption className="px-3 py-2 text-left text-[11px] text-zinc-400 border-b border-white/10">
                {question.stimulusTable.caption}
              </caption>
            )}
            <thead className="bg-white/[0.04] text-zinc-300">
              <tr>
                {question.stimulusTable.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-semibold border-b border-white/10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-zinc-200 tabular-nums">
              {question.stimulusTable.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 1. SINGLE-ANSWER MCQ */}
      {question.type === "single_mcq" && (() => {
        const orderMap = slot.optionOrderMap ?? question.options.map((_, i) => i);
        const selectedCanonical = value?.kind === "single_mcq" ? value.selectedCanonicalIndex : -1;
        const letters = ["A", "B", "C", "D", "E", "F"];
        return (
          <div className="space-y-2.5" role="radiogroup" aria-label="Multiple choice options">
            {orderMap.map((canonicalIdx, displayIdx) => {
              const optionText = question.options[canonicalIdx];
              const isSelected = selectedCanonical === canonicalIdx;
              return (
                <button
                  key={canonicalIdx}
                  type="button"
                  disabled={disabled}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() =>
                    onChange({ kind: "single_mcq", selectedCanonicalIndex: canonicalIdx })
                  }
                  className={`flex w-full min-h-[46px] items-center gap-3.5 rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
                    isSelected
                      ? "border-[#FFD60A] bg-[#FFD60A]/12 text-white"
                      : "border-white/10 bg-white/[0.02] text-zinc-200 hover:border-white/25 hover:bg-white/[0.04]"
                  } disabled:opacity-60`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                      isSelected ? "bg-[#FFD60A] text-black" : "bg-white/10 text-zinc-300"
                    }`}
                  >
                    {letters[displayIdx] ?? displayIdx + 1}
                  </span>
                  <span className="leading-snug flex-1">
                    <FormattedContent content={optionText} />
                  </span>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* 2. MULTIPLE-SELECT */}
      {question.type === "multi_select" && (() => {
        const orderMap = slot.optionOrderMap ?? question.options.map((_, i) => i);
        const selected = value?.kind === "multi_select" ? value.selectedCanonicalIndices : [];
        return (
          <div className="space-y-2.5" role="group" aria-label="Select all correct options">
            <p className="text-xs font-mono text-zinc-400">
              Select all matching choices (multiple answers required):
            </p>
            {orderMap.map((canonicalIdx) => {
              const optionText = question.options[canonicalIdx];
              const isChecked = selected.includes(canonicalIdx);
              return (
                <button
                  key={canonicalIdx}
                  type="button"
                  disabled={disabled}
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => {
                    const next = isChecked
                      ? selected.filter((i) => i !== canonicalIdx)
                      : [...selected, canonicalIdx];
                    onChange({ kind: "multi_select", selectedCanonicalIndices: next });
                  }}
                  className={`flex w-full min-h-[46px] items-center gap-3.5 rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
                    isChecked
                      ? "border-[#FFD60A] bg-[#FFD60A]/12 text-white"
                      : "border-white/10 bg-white/[0.02] text-zinc-200 hover:border-white/25"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-xs ${
                      isChecked
                        ? "border-[#FFD60A] bg-[#FFD60A] text-black font-bold"
                        : "border-white/25 bg-black/40 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="leading-snug flex-1">
                    <FormattedContent content={optionText} />
                  </span>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* 3. TRUE / FALSE */}
      {question.type === "true_false" && (() => {
        const selectedVal = value?.kind === "true_false" ? value.value : undefined;
        return (
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="True or False">
            {[
              { val: true, label: "True" },
              { val: false, label: "False" },
            ].map((opt) => {
              const active = selectedVal === opt.val;
              return (
                <button
                  key={opt.label}
                  type="button"
                  disabled={disabled}
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ kind: "true_false", value: opt.val })}
                  className={`min-h-[48px] rounded-xl border px-4 py-3 font-heading text-sm font-bold transition-colors ${
                    active
                      ? "border-[#FFD60A] bg-[#FFD60A]/15 text-[#FFD60A]"
                      : "border-white/10 bg-white/[0.02] text-zinc-200 hover:border-white/25"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* 4. FILL IN THE BLANK */}
      {question.type === "fill_blank" && (() => {
        const text = value?.kind === "fill_blank" ? value.text : "";
        return (
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-400">
              Exact Missing Value {question.hint ? `(${question.hint})` : ""}:
            </label>
            <input
              type="text"
              disabled={disabled}
              value={text}
              onChange={(e) => onChange({ kind: "fill_blank", text: e.target.value })}
              placeholder="Type your answer..."
              className="w-full min-h-[46px] rounded-xl border border-white/15 bg-black/50 px-4 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:border-[#FFD60A] focus:outline-none"
            />
          </div>
        );
      })()}

      {/* 5. MATCHING */}
      {question.type === "matching" && (() => {
        const matches = value?.kind === "matching" ? value.matches : {};
        const allChoices = Array.from(
          new Set([
            ...question.pairs.map((p) => p.right),
            ...(question.distractorRightOptions || []),
          ])
        ).sort();

        return (
          <div className="space-y-2.5">
            <p className="text-xs font-mono text-zinc-400">
              Pair each item on the left with its matching option:
            </p>
            {question.pairs.map((pair) => (
              <div
                key={pair.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-black/35 p-3"
              >
                <span className="font-mono text-sm font-semibold text-white">{pair.left}</span>
                <select
                  disabled={disabled}
                  aria-label={`Match for ${pair.left}`}
                  value={matches[pair.id] || ""}
                  onChange={(e) =>
                    onChange({
                      kind: "matching",
                      matches: { ...matches, [pair.id]: e.target.value },
                    })
                  }
                  className="min-h-[42px] sm:min-w-[240px] rounded-lg border border-white/15 bg-[#16161A] px-3 py-2 text-xs text-white focus:border-[#FFD60A] focus:outline-none"
                >
                  <option value="">-- Select matching answer --</option>
                  {allChoices.map((choice) => (
                    <option key={choice} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );
      })()}

      {/* 6. CLASSIFICATION / CATEGORIZATION */}
      {question.type === "classification" && (() => {
        const assignments = value?.kind === "classification" ? value.assignments : {};
        return (
          <div className="space-y-3">
            <p className="text-xs font-mono text-zinc-400">
              Assign each item to its accurate category:
            </p>
            <div className="space-y-2">
              {question.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-black/35 p-3"
                >
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {question.categories.map((cat) => {
                      const active = assignments[item.id] === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            onChange({
                              kind: "classification",
                              assignments: { ...assignments, [item.id]: cat },
                            })
                          }
                          className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                            active
                              ? "border-[#FFD60A] bg-[#FFD60A]/15 text-[#FFD60A]"
                              : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 7. NUMERICAL / CALCULATION */}
      {question.type === "numerical" && (() => {
        const cur = value?.kind === "numerical" ? value : { kind: "numerical" as const, valueText: "", unitText: "" };
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Numeric Answer {question.tolerance > 0 ? `(±${question.tolerance} accepted)` : ""}
                </label>
                <input
                  type="text"
                  inputMode="text"
                  disabled={disabled}
                  value={cur.valueText}
                  onChange={(e) => onChange({ ...cur, valueText: e.target.value })}
                  placeholder="e.g. 1.6, 3/4, or 1.6×10^-19"
                  className="w-full min-h-[46px] rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 font-mono text-sm text-white placeholder-zinc-500 focus:border-[#FFD60A] focus:outline-none"
                />
              </div>
              {question.requiredUnit && (
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    SI / Physical Unit
                  </label>
                  <input
                    type="text"
                    disabled={disabled}
                    value={cur.unitText}
                    onChange={(e) => onChange({ ...cur, unitText: e.target.value })}
                    placeholder={`e.g. ${question.requiredUnit}`}
                    className="w-full min-h-[46px] rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 font-mono text-sm text-white placeholder-zinc-500 focus:border-[#FFD60A] focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 8. STRUCTURED MULTI-PART QUESTION */}
      {question.type === "structured_multi_part" && (() => {
        const curParts = value?.kind === "structured_multi_part" ? value.parts : {};
        return (
          <div className="space-y-3">
            {question.subParts.map((part) => {
              const partAns = curParts[part.id] || { text: "", unitText: "" };
              return (
                <div
                  key={part.id}
                  className="rounded-xl border border-white/10 bg-black/35 p-3.5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2 text-xs">
                    <div className="text-zinc-100 leading-relaxed flex-1">
                      <span className="font-mono font-bold text-[#FFD60A] mr-1.5">{part.label}</span>
                      <FormattedContent content={part.prompt} className="inline" />
                    </div>
                    <span className="font-mono text-zinc-400 whitespace-nowrap shrink-0 tabular-nums">
                      {part.marks} Marks
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-2.5">
                    <input
                      type="text"
                      disabled={disabled}
                      value={partAns.text}
                      onChange={(e) =>
                        onChange({
                          kind: "structured_multi_part",
                          parts: {
                            ...curParts,
                            [part.id]: { ...partAns, text: e.target.value },
                          },
                        })
                      }
                      placeholder={part.kind === "numerical" ? "Numeric value..." : "Enter response..."}
                      className="w-full min-h-[42px] rounded-lg border border-white/15 bg-[#121215] px-3 py-2 font-mono text-sm text-white focus:border-[#FFD60A] focus:outline-none"
                    />
                    {part.acceptedUnits && part.acceptedUnits.length > 0 && (
                      <input
                        type="text"
                        disabled={disabled}
                        value={partAns.unitText || ""}
                        onChange={(e) =>
                          onChange({
                            kind: "structured_multi_part",
                            parts: {
                              ...curParts,
                              [part.id]: { ...partAns, unitText: e.target.value },
                            },
                          })
                        }
                        placeholder={`Unit (${part.acceptedUnits[0]})`}
                        className="w-full min-h-[42px] rounded-lg border border-white/15 bg-[#121215] px-3 py-2 font-mono text-sm text-white focus:border-[#FFD60A] focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* 9. DIAGRAM LABELING */}
      {question.type === "diagram_labeling" && (() => {
        const labelsByPinId = value?.kind === "diagram_labeling" ? value.labelsByPinId : {};
        return (
          <div className="space-y-3">
            <DiagramViewer
              diagramId={question.diagramId}
              caption={question.diagramCaption}
              pins={question.pins}
              selectedLabels={labelsByPinId}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {question.pins.map((pin) => (
                <div
                  key={pin.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/35 p-2.5"
                >
                  <span className="font-mono text-xs font-bold text-[#FFD60A] whitespace-nowrap">
                    Marker #{pin.marker}
                  </span>
                  <select
                    disabled={disabled}
                    aria-label={`Label for marker ${pin.marker}`}
                    value={labelsByPinId[pin.id] || ""}
                    onChange={(e) =>
                      onChange({
                        kind: "diagram_labeling",
                        labelsByPinId: { ...labelsByPinId, [pin.id]: e.target.value },
                      })
                    }
                    className="flex-1 min-h-[40px] rounded-lg border border-white/15 bg-[#16161A] px-2.5 py-1.5 text-xs text-white focus:border-[#FFD60A] focus:outline-none"
                  >
                    <option value="">-- Select label --</option>
                    {question.candidateLabels.map((lbl) => (
                      <option key={lbl} value={lbl}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 10, 11, 12. SHORT ANSWER / PROOF & DERIVATION / EXTENDED RESPONSE */}
      {(question.type === "short_answer" ||
        question.type === "proof_derivation" ||
        question.type === "extended_response") && (() => {
        const currentText = value?.kind === "text_response" ? value.text : "";
        const rows = question.type === "short_answer" ? 4 : 7;
        return (
          <div className="space-y-2.5">
            {question.type === "proof_derivation" && (
              <div className="rounded-xl border border-white/10 bg-black/35 p-3 text-xs text-zinc-300 space-y-1">
                {question.givenStatement && (
                  <p>
                    <span className="font-mono text-zinc-400">Given: </span>
                    {question.givenStatement}
                  </p>
                )}
                {question.toProve && (
                  <p>
                    <span className="font-mono text-[#FFD60A]">To Prove / Derive: </span>
                    {question.toProve}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono text-zinc-400">
                {question.type === "short_answer"
                  ? "Brief Answer / Working:"
                  : question.type === "proof_derivation"
                    ? "Step-by-Step Derivation:"
                    : "Structured Extended Response / Program:"}
              </span>
              <div className="flex flex-wrap gap-1" aria-label="Insert mathematical symbols">
                {MATH_SYMBOLS.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    disabled={disabled}
                    onClick={() => appendSymbolToText(sym, currentText)}
                    className="min-w-[28px] h-7 rounded border border-white/10 bg-white/[0.03] px-1.5 font-mono text-xs text-zinc-300 hover:border-[#FFD60A]/50 hover:text-white"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              disabled={disabled}
              rows={rows}
              value={currentText}
              onChange={(e) => onChange({ kind: "text_response", text: e.target.value })}
              placeholder={
                question.type === "short_answer"
                  ? "Write concise key points, formula, or working (self-checked against official rubric after submit)..."
                  : "Write structured headings, derivations, or Python / source code cleanly (scored via rubric verification after submit)..."
              }
              className="w-full rounded-xl border border-white/15 bg-black/50 p-3.5 text-sm text-white placeholder-zinc-500 focus:border-[#FFD60A] focus:outline-none leading-relaxed font-sans"
            />

            <p className="text-[11px] font-mono text-zinc-400">
              Honest marking rule: Descriptive answers stay &ldquo;Pending Self-Review&rdquo; on submit until you verify each rubric criterion against the official model key.
            </p>
          </div>
        );
      })()}
    </div>
  );
}
