"use client";

import React from "react";

interface AIMarkdownRendererProps {
  content: string;
}

const URDU_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

function hasUrduScript(text: string): boolean {
  return URDU_CHAR_REGEX.test(text);
}

/**
 * Formats common LaTeX inline symbols into crisp Unicode/plain readable math when displayed in monospace
 */
function formatReadableMath(expr: string): string {
  return expr
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\div/g, "÷")
    .replace(/\\pm/g, "±")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\approx/g, "≈")
    .replace(/\\rightarrow|\\to/g, "→")
    .replace(/\\rightleftharpoons/g, "⇌")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1) / ($2)")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .trim();
}

export default function AIMarkdownRenderer({ content }: AIMarkdownRendererProps) {
  if (!content) return null;

  const renderInline = (text: string) => {
    const tokenRegex =
      /(\$\$[^\$]+\$\$|\$[^\$]+\$|\\\([^)]+\\\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, i) => {
      if (!part) return null;

      if (
        (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) ||
        (part.startsWith("$") && part.endsWith("$") && part.length > 2)
      ) {
        const inner = part.startsWith("$$") ? part.slice(2, -2) : part.slice(1, -1);
        return (
          <code
            key={i}
            dir="ltr"
            className="inline-block rounded bg-[#FFD60A]/10 px-1.5 py-0.5 font-mono text-[13px] font-medium text-[#FFD60A] border border-[#FFD60A]/25 mx-0.5 [unicode-bidi:isolate]"
          >
            {formatReadableMath(inner)}
          </code>
        );
      }

      if (part.startsWith("\\(") && part.endsWith("\\)") && part.length > 4) {
        return (
          <code
            key={i}
            dir="ltr"
            className="inline-block rounded bg-[#FFD60A]/10 px-1.5 py-0.5 font-mono text-[13px] font-medium text-[#FFD60A] border border-[#FFD60A]/25 mx-0.5 [unicode-bidi:isolate]"
          >
            {formatReadableMath(part.slice(2, -2))}
          </code>
        );
      }

      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={i}
            dir="ltr"
            className="inline-block rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[13px] text-neutral-100 mx-0.5 [unicode-bidi:isolate]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={i} className="italic text-neutral-200">
            {part.slice(1, -1)}
          </em>
        );
      }

      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  // Pre-parse lines into structured blocks (fenced code, block math, tables, lists, headings, paragraphs)
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Fenced Code Block
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      elements.push(
        <div
          key={`code-${i}`}
          dir="ltr"
          className="my-2 overflow-x-auto rounded-xl border border-white/10 bg-[#0A0A0D]"
        >
          {lang && (
            <div className="border-b border-white/[0.08] px-3 py-1.5 text-[11px] font-mono text-neutral-400">
              {lang}
            </div>
          )}
          <pre className="p-3.5 text-xs sm:text-[13px] font-mono leading-relaxed text-neutral-100 overflow-x-auto">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Display Math Block ($$ ... $$ or \[ ... \])
    if (
      (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length > 4) ||
      (trimmed.startsWith("\\[") && trimmed.endsWith("\\]") && trimmed.length > 4)
    ) {
      const formula = trimmed.slice(2, -2);
      elements.push(
        <div
          key={`math-${i}`}
          dir="ltr"
          className="my-2 overflow-x-auto rounded-xl border border-[#FFD60A]/20 bg-[#FFD60A]/[0.05] px-4 py-2.5 text-center font-mono text-sm sm:text-[15px] text-[#FFD60A]"
        >
          {formatReadableMath(formula)}
        </div>
      );
      i++;
      continue;
    }

    // Multi-line $$ math block
    if (trimmed === "$$" || trimmed === "\\[") {
      const closingToken = trimmed === "$$" ? "$$" : "\\]";
      const mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== closingToken) {
        mathLines.push(lines[i].trim());
        i++;
      }
      i++;
      elements.push(
        <div
          key={`mathml-${i}`}
          dir="ltr"
          className="my-2 overflow-x-auto rounded-xl border border-[#FFD60A]/20 bg-[#FFD60A]/[0.05] px-4 py-2.5 text-center font-mono text-sm sm:text-[15px] text-[#FFD60A]"
        >
          {formatReadableMath(mathLines.join(" "))}
        </div>
      );
      continue;
    }

    // 3. Markdown Table (collect contiguous | ... | rows)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableRows: string[][] = [];
      let hasHeaderSeparator = false;
      while (
        i < lines.length &&
        lines[i].trim().startsWith("|") &&
        lines[i].trim().endsWith("|")
      ) {
        const rowCells = lines[i]
          .trim()
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        if (rowCells.every((c) => /^:?-+:?$/.test(c))) {
          hasHeaderSeparator = true;
        } else {
          tableRows.push(rowCells);
        }
        i++;
      }

      if (tableRows.length > 0) {
        const headerRow = hasHeaderSeparator ? tableRows[0] : null;
        const bodyRows = hasHeaderSeparator ? tableRows.slice(1) : tableRows;
        const tableUrdu = hasUrduScript(tableRows.flat().join(" "));

        elements.push(
          <div
            key={`tbl-${i}`}
            dir={tableUrdu ? "rtl" : "ltr"}
            className="my-2 overflow-x-auto rounded-xl border border-white/10 bg-[#121216]"
          >
            <table className={`w-full border-collapse text-xs sm:text-sm ${tableUrdu ? "text-right font-urdu" : "text-left"}`}>
              {headerRow && (
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    {headerRow.map((cell, cIdx) => (
                      <th key={cIdx} className="px-3 py-2 font-semibold text-white whitespace-nowrap">
                        {renderInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-white/[0.06]">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-neutral-200 align-top">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    const isUrduLine = hasUrduScript(trimmed);

    // 4. Headings
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4
          key={`h4-${i}`}
          dir={isUrduLine ? "rtl" : "ltr"}
          className={`pt-2 font-semibold text-white ${
            isUrduLine
              ? "font-urdu text-base leading-[2] text-right"
              : "font-heading text-sm text-[#FFD60A]"
          }`}
        >
          {renderInline(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          dir={isUrduLine ? "rtl" : "ltr"}
          className={`pt-2 pb-1 border-b border-white/[0.08] font-bold text-white ${
            isUrduLine
              ? "font-urdu text-lg leading-[2] text-right"
              : "font-heading text-base"
          }`}
        >
          {renderInline(trimmed.replace(/^#+\s+/, ""))}
        </h3>
      );
      i++;
      continue;
    }

    // 5. Bulleted Lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const bulletText = trimmed.replace(/^[-*•]\s+/, "");
      elements.push(
        <div
          key={`ul-${i}`}
          dir={isUrduLine ? "rtl" : "ltr"}
          className={`flex items-start gap-2.5 ${
            isUrduLine ? "font-urdu text-base sm:text-[15px] leading-[2.05] text-right" : ""
          }`}
        >
          <span className="text-[#FFD60A] pt-1 text-xs shrink-0" aria-hidden="true">
            •
          </span>
          <div className="flex-1 min-w-0">{renderInline(bulletText)}</div>
        </div>
      );
      i++;
      continue;
    }

    // 6. Numbered Steps
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numMatch) {
      elements.push(
        <div
          key={`ol-${i}`}
          dir={isUrduLine ? "rtl" : "ltr"}
          className={`flex items-start gap-2.5 ${
            isUrduLine ? "font-urdu text-base sm:text-[15px] leading-[2.05] text-right" : ""
          }`}
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.08] font-mono text-xs font-semibold tabular-nums text-[#FFD60A]">
            {numMatch[1]}
          </span>
          <div className="flex-1 min-w-0">{renderInline(numMatch[2])}</div>
        </div>
      );
      i++;
      continue;
    }

    // 7. Standard Paragraph
    elements.push(
      <p
        key={`p-${i}`}
        dir={isUrduLine ? "rtl" : "ltr"}
        className={
          isUrduLine
            ? "font-urdu text-base leading-[2.1] text-right text-neutral-100"
            : "text-neutral-200 leading-relaxed"
        }
      >
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return (
    <div className="space-y-3 text-base sm:text-[15px] leading-relaxed text-neutral-200 break-words">
      {elements}
    </div>
  );
}
