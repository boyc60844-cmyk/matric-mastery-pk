"use client";

import React, { useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";

interface AIMarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

const URDU_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

function hasUrduScript(text: string): boolean {
  return URDU_CHAR_REGEX.test(text);
}

/**
 * Normalizes LaTeX operators and Greek symbols into crisp readable mathematical typography.
 */
function normalizeMathSymbols(expr: string): string {
  return expr
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\mathrm\{([^}]*)\}/g, "$1")
    .replace(/\\mathbf\{([^}]*)\}/g, "$1")
    .replace(/\\left\(/g, "(")
    .replace(/\\right\)/g, ")")
    .replace(/\\left\[/g, "[")
    .replace(/\\right\]/g, "]")
    .replace(/\\left\|/g, "|")
    .replace(/\\right\|/g, "|")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\div/g, "÷")
    .replace(/\\pm/g, "±")
    .replace(/\\mp/g, "∓")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\approx/g, "≈")
    .replace(/\\equiv/g, "≡")
    .replace(/\\propto/g, "∝")
    .replace(/\\infty/g, "∞")
    .replace(/\\circ/g, "°")
    .replace(/\\degree/g, "°")
    .replace(/\\Rightarrow/g, "⇒")
    .replace(/\\rightarrow|\\to/g, "→")
    .replace(/\\leftarrow/g, "←")
    .replace(/\\rightleftharpoons/g, "⇌")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\delta/g, "δ")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\theta/g, "θ")
    .replace(/\\pi/g, "π")
    .replace(/\\Omega/g, "Ω")
    .replace(/\\omega/g, "ω")
    .replace(/\\mu/g, "μ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\rho/g, "ρ")
    .replace(/\\sigma/g, "σ")
    .replace(/\\Sigma/g, "Σ")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .trim();
}

/**
 * Renders mathematical expressions with proper fractions, superscripts, and subscripts in React.
 */
function renderFormattedMath(expr: string, keyPrefix: string): React.ReactNode {
  const cleaned = normalizeMathSymbols(expr);
  // Split fractions (\frac{num}{den}), braced or single-char superscripts (^2 / ^{x+1}), subscripts (_2 / _{max})
  const mathTokenRegex =
    /(\\frac\{[^{}]+\}\{[^{}]+\}|\^\{[^{}]+\}|\^[A-Za-z0-9+\-°]+|_\{[^{}]+\}|_[A-Za-z0-9+\-]+)/g;
  const parts = cleaned.split(mathTokenRegex);

  return parts.map((token, idx) => {
    if (!token) return null;
    const key = `${keyPrefix}-m-${idx}`;

    const fracMatch = token.match(/^\\frac\{([^{}]+)\}\{([^{}]+)\}$/);
    if (fracMatch) {
      return (
        <span
          key={key}
          className="inline-flex flex-col items-center justify-center align-middle mx-1 leading-[1.15]"
        >
          <span className="border-b border-current px-1 pb-0.5 text-[0.86em]">
            {renderFormattedMath(fracMatch[1], `${key}-n`)}
          </span>
          <span className="px-1 pt-0.5 text-[0.86em]">
            {renderFormattedMath(fracMatch[2], `${key}-d`)}
          </span>
        </span>
      );
    }

    if (token.startsWith("^{") && token.endsWith("}")) {
      return (
        <sup key={key} className="text-[0.75em] leading-none">
          {token.slice(2, -1)}
        </sup>
      );
    }
    if (token.startsWith("^") && token.length > 1) {
      return (
        <sup key={key} className="text-[0.75em] leading-none">
          {token.slice(1)}
        </sup>
      );
    }
    if (token.startsWith("_{") && token.endsWith("}")) {
      return (
        <sub key={key} className="text-[0.75em] leading-none">
          {token.slice(2, -1)}
        </sub>
      );
    }
    if (token.startsWith("_") && token.length > 1) {
      return (
        <sub key={key} className="text-[0.75em] leading-none">
          {token.slice(1)}
        </sub>
      );
    }

    return <React.Fragment key={key}>{token}</React.Fragment>;
  });
}

const CODE_KEYWORDS = new Set([
  "int",
  "float",
  "double",
  "char",
  "void",
  "long",
  "short",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "struct",
  "const",
  "let",
  "var",
  "function",
  "def",
  "class",
  "import",
  "from",
  "export",
  "true",
  "false",
  "null",
  "None",
  "printf",
  "scanf",
  "cout",
  "cin",
  "print",
  "include",
  "define",
]);

function highlightCodeLine(line: string, lineIdx: number): React.ReactNode {
  if (/^\s*(\/\/|#|\/\*)/.test(line)) {
    return <span className="text-neutral-500 italic">{line}</span>;
  }

  const tokenRegex =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/.*$|#include\s*<[^>]+>|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  const pieces = line.split(tokenRegex);

  return pieces.map((piece, i) => {
    if (!piece) return null;
    const key = `c-${lineIdx}-${i}`;
    if (piece.startsWith("//")) {
      return (
        <span key={key} className="text-neutral-500 italic">
          {piece}
        </span>
      );
    }
    if (
      (piece.startsWith('"') && piece.endsWith('"')) ||
      (piece.startsWith("'") && piece.endsWith("'")) ||
      piece.startsWith("#include")
    ) {
      return (
        <span key={key} className="text-emerald-300">
          {piece}
        </span>
      );
    }
    if (/^\d+(?:\.\d+)?$/.test(piece)) {
      return (
        <span key={key} className="text-amber-300">
          {piece}
        </span>
      );
    }
    if (CODE_KEYWORDS.has(piece)) {
      return (
        <span key={key} className="text-[#FFD60A] font-medium">
          {piece}
        </span>
      );
    }
    return <React.Fragment key={key}>{piece}</React.Fragment>;
  });
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div
      dir="ltr"
      className="my-2.5 overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0E]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopyCode}
          aria-label={copied ? "Code copied" : "Copy code"}
          className="inline-flex min-h-[28px] items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:border-[#FFD60A]/40 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" aria-hidden="true" />
              <span className="text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} aria-hidden="true" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 text-xs sm:text-[13px] font-mono leading-relaxed text-neutral-100 overflow-x-auto">
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className="whitespace-pre">
              {highlightCodeLine(line, idx)}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/**
 * Renders inline Markdown tokens + LaTeX math + isolates equations inside Urdu RTL sentences.
 */
function renderInline(text: string, keyBase = "in"): React.ReactNode {
  const tokenRegex =
    /(\$\$[^\$]+\$\$|\$[^\$]+\$|\\\([^)]+\\\)|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|[A-Za-z0-9()]+(?:\^[A-Za-z0-9+\-]+|_[A-Za-z0-9]+)?(?:\s*[+\-*/×·]\s*[A-Za-z0-9()]+(?:\^[A-Za-z0-9+\-]+|_[A-Za-z0-9]+)?)*\s*(?:=|→|⇌|≤|≥|≠)\s*[A-Za-z0-9()^_.\-]+(?:\s*[+\-*/×·]\s*[A-Za-z0-9()^_.\-]+)*(?:\s*(?:=|→|⇌|≤|≥|≠)\s*[A-Za-z0-9()^_.\-]+(?:\s*[+\-*/×·]\s*[A-Za-z0-9()^_.\-]+)*)?)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;
    const key = `${keyBase}-${i}`;

    if (
      (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) ||
      (part.startsWith("$") && part.endsWith("$") && part.length > 2)
    ) {
      const inner = part.startsWith("$$") ? part.slice(2, -2) : part.slice(1, -1);
      return (
        <code
          key={key}
          dir="ltr"
          className="inline-block rounded bg-[#FFD60A]/10 px-1.5 py-0.5 font-mono text-[13px] font-medium text-[#FFD60A] border border-[#FFD60A]/25 mx-0.5 [unicode-bidi:isolate]"
        >
          {renderFormattedMath(inner, key)}
        </code>
      );
    }

    if (part.startsWith("\\(") && part.endsWith("\\)") && part.length > 4) {
      return (
        <code
          key={key}
          dir="ltr"
          className="inline-block rounded bg-[#FFD60A]/10 px-1.5 py-0.5 font-mono text-[13px] font-medium text-[#FFD60A] border border-[#FFD60A]/25 mx-0.5 [unicode-bidi:isolate]"
        >
          {renderFormattedMath(part.slice(2, -2), key)}
        </code>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          dir="ltr"
          className="inline-block rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[13px] text-neutral-100 mx-0.5 [unicode-bidi:isolate]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const href = linkMatch[2].trim();
      const isSafe =
        href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://");
      if (isSafe) {
        return (
          <a
            key={key}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-[#FFD60A] underline underline-offset-2 hover:text-amber-300"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    if (part.startsWith("***") && part.endsWith("***") && part.length > 6) {
      return (
        <strong key={key} className="font-semibold italic text-white">
          {renderInline(part.slice(3, -3), `${key}-bi`)}
        </strong>
      );
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-white">
          {renderInline(part.slice(2, -2), `${key}-b`)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={key} className="italic text-neutral-200">
          {renderInline(part.slice(1, -1), `${key}-i`)}
        </em>
      );
    }

    // Isolate un-fenced inline equations like F = ma or x^2 - 7x = 0 inside mixed Urdu text
    if (/[=→⇌≤≥≠]/.test(part) && /[A-Za-z0-9]/.test(part) && !hasUrduScript(part)) {
      return (
        <span
          key={key}
          dir="ltr"
          className="inline-block font-mono text-[0.92em] text-[#FFD60A] mx-0.5 [unicode-bidi:isolate]"
        >
          {renderFormattedMath(part.trim(), key)}
        </span>
      );
    }

    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function renderMarkdownBlocks(content: string, keyPrefix = "blk"): React.ReactNode[] {
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

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(<hr key={`${keyPrefix}-hr-${i}`} className="border-white/10 my-2" />);
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
      i++;
      elements.push(
        <CodeBlock
          key={`${keyPrefix}-code-${i}`}
          lang={lang}
          code={codeLines.join("\n")}
        />
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
          key={`${keyPrefix}-math-${i}`}
          dir="ltr"
          className="my-2.5 overflow-x-auto rounded-xl border border-[#FFD60A]/25 bg-[#FFD60A]/[0.06] px-4 py-3 text-center font-mono text-sm sm:text-[15px] text-[#FFD60A] [unicode-bidi:isolate]"
        >
          {renderFormattedMath(formula, `${keyPrefix}-mf-${i}`)}
        </div>
      );
      i++;
      continue;
    }

    // Multi-line $$ or \[ math block
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
          key={`${keyPrefix}-mathml-${i}`}
          dir="ltr"
          className="my-2.5 overflow-x-auto rounded-xl border border-[#FFD60A]/25 bg-[#FFD60A]/[0.06] px-4 py-3 text-center font-mono text-sm sm:text-[15px] text-[#FFD60A] [unicode-bidi:isolate]"
        >
          {renderFormattedMath(mathLines.join(" "), `${keyPrefix}-mml-${i}`)}
        </div>
      );
      continue;
    }

    // 3. Markdown Table
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
            key={`${keyPrefix}-tbl-${i}`}
            dir={tableUrdu ? "rtl" : "ltr"}
            className="my-2.5 overflow-x-auto rounded-xl border border-white/10 bg-[#121216]"
          >
            <table
              className={`w-full border-collapse text-xs sm:text-sm ${
                tableUrdu ? "text-right font-urdu" : "text-left"
              }`}
            >
              {headerRow && (
                <thead>
                  <tr className="border-b border-white/15 bg-white/[0.05]">
                    {headerRow.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        className="px-3.5 py-2.5 font-semibold text-white whitespace-nowrap"
                      >
                        {renderInline(cell, `${keyPrefix}-th-${i}-${cIdx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-white/[0.06]">
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={rIdx % 2 === 1 ? "bg-white/[0.015]" : undefined}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2.5 text-neutral-200 align-top">
                        {renderInline(cell, `${keyPrefix}-td-${i}-${rIdx}-${cIdx}`)}
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

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const quoteText = quoteLines.join(" ");
      const quoteUrdu = hasUrduScript(quoteText);
      elements.push(
        <blockquote
          key={`${keyPrefix}-bq-${i}`}
          dir={quoteUrdu ? "rtl" : "ltr"}
          className={`my-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-neutral-200 ${
            quoteUrdu ? "font-urdu text-[15px] leading-[2] text-right" : "text-sm sm:text-[15px]"
          }`}
        >
          {renderInline(quoteText, `${keyPrefix}-bqi-${i}`)}
        </blockquote>
      );
      continue;
    }

    // 4. Headings
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4
          key={`${keyPrefix}-h4-${i}`}
          dir={isUrduLine ? "rtl" : "ltr"}
          className={`pt-2 font-semibold ${
            isUrduLine
              ? "font-urdu text-base leading-[2] text-right text-[#FFD60A]"
              : "font-heading text-sm text-[#FFD60A]"
          }`}
        >
          {renderInline(trimmed.replace(/^###\s+/, ""), `${keyPrefix}-h4i-${i}`)}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      elements.push(
        <h3
          key={`${keyPrefix}-h3-${i}`}
          dir={isUrduLine ? "rtl" : "ltr"}
          className={`pt-2 pb-1 border-b border-white/[0.08] font-bold text-white ${
            isUrduLine
              ? "font-urdu text-lg leading-[2] text-right"
              : "font-heading text-base"
          }`}
        >
          {renderInline(trimmed.replace(/^#+\s+/, ""), `${keyPrefix}-h3i-${i}`)}
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
          key={`${keyPrefix}-ul-${i}`}
          dir={isUrduLine ? "rtl" : "ltr"}
          className={`flex items-start gap-2.5 ${
            isUrduLine
              ? "font-urdu text-[16px] sm:text-[17px] leading-[2.0] text-right"
              : ""
          }`}
        >
          <span className="text-[#FFD60A] pt-1 text-xs shrink-0" aria-hidden="true">
            •
          </span>
          <div className="flex-1 min-w-0">
            {renderInline(bulletText, `${keyPrefix}-uli-${i}`)}
          </div>
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
          key={`${keyPrefix}-ol-${i}`}
          dir={isUrduLine ? "rtl" : "ltr"}
          className={`flex items-start gap-2.5 ${
            isUrduLine
              ? "font-urdu text-[16px] sm:text-[17px] leading-[2.0] text-right"
              : ""
          }`}
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.08] font-mono text-xs font-semibold tabular-nums text-[#FFD60A]">
            {numMatch[1]}
          </span>
          <div className="flex-1 min-w-0">
            {renderInline(numMatch[2], `${keyPrefix}-oli-${i}`)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // 7. Standard Paragraph
    elements.push(
      <p
        key={`${keyPrefix}-p-${i}`}
        dir={isUrduLine ? "rtl" : "ltr"}
        className={
          isUrduLine
            ? "font-urdu text-[16px] sm:text-[17px] leading-[2.0] text-right text-neutral-100"
            : "text-neutral-200 leading-[1.65]"
        }
      >
        {renderInline(trimmed, `${keyPrefix}-pi-${i}`)}
      </p>
    );
    i++;
  }

  return elements;
}

interface ParsedSection {
  heading: string | null;
  rawText: string;
}

function splitIntoSections(content: string): ParsedSection[] {
  const lines = content.split("\n");
  const sections: ParsedSection[] = [];
  let currentHeading: string | null = null;
  let currentLines: string[] = [];
  let inCodeFence = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence;
      currentLines.push(line);
      continue;
    }

    if (!inCodeFence && /^#{1,3}\s+/.test(line.trim())) {
      if (currentHeading !== null || currentLines.join("\n").trim().length > 0) {
        sections.push({
          heading: currentHeading,
          rawText: currentLines.join("\n").trim(),
        });
      }
      currentHeading = line.trim().replace(/^#{1,3}\s+/, "");
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentHeading !== null || currentLines.join("\n").trim().length > 0) {
    sections.push({
      heading: currentHeading,
      rawText: currentLines.join("\n").trim(),
    });
  }

  return sections;
}

function AnswerSectionBlock({
  section,
  index,
  defaultCollapsed,
}: {
  section: ParsedSection;
  index: number;
  defaultCollapsed: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [copiedSection, setCopiedSection] = useState(false);

  const heading = section.heading;
  if (!heading) {
    return (
      <div className="space-y-2.5">{renderMarkdownBlocks(section.rawText, `sec-${index}`)}</div>
    );
  }

  const isUrduHeading = hasUrduScript(heading);
  const fullSectionText = `${heading}\n${section.rawText}`.trim();

  const handleCopySection = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullSectionText);
      setCopiedSection(true);
      window.setTimeout(() => setCopiedSection(false), 1800);
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 sm:p-4 space-y-2.5">
      <div
        dir={isUrduHeading ? "rtl" : "ltr"}
        className="flex items-center justify-between gap-2 border-b border-white/[0.07] pb-2"
      >
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
          className={`flex flex-1 min-w-0 items-center gap-2 text-left font-semibold text-white hover:text-[#FFD60A] transition-colors cursor-pointer ${
            isUrduHeading ? "font-urdu text-base text-right" : "font-heading text-sm sm:text-[15px]"
          }`}
        >
          {collapsed ? (
            <ChevronDown size={15} className="shrink-0 text-[#FFD60A]" aria-hidden="true" />
          ) : (
            <ChevronUp size={15} className="shrink-0 text-neutral-400" aria-hidden="true" />
          )}
          <span className="truncate">{renderInline(heading, `sh-${index}`)}</span>
        </button>

        <button
          type="button"
          onClick={handleCopySection}
          aria-label={copiedSection ? "Section copied" : `Copy ${heading}`}
          title="Copy this section"
          className="inline-flex min-h-[28px] shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors cursor-pointer"
        >
          {copiedSection ? (
            <>
              <Check size={11} className="text-emerald-400" aria-hidden="true" />
              <span className="text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} aria-hidden="true" />
              <span className="hidden sm:inline">Copy section</span>
            </>
          )}
        </button>
      </div>

      {!collapsed && section.rawText && (
        <div className="space-y-2.5">{renderMarkdownBlocks(section.rawText, `secb-${index}`)}</div>
      )}
    </div>
  );
}

export default function AIMarkdownRenderer({
  content,
  isStreaming = false,
}: AIMarkdownRendererProps) {
  const [expandedLong, setExpandedLong] = useState(false);

  if (!content) return null;

  const sections = splitIntoSections(content);
  const headedSections = sections.filter((s) => s.heading !== null);
  const useStructuredSections = !isStreaming && headedSections.length >= 2;

  if (useStructuredSections) {
    return (
      <div className="space-y-3 text-[16px] sm:text-[17px] leading-[1.65] text-neutral-200 break-words min-w-0 max-w-full">
        {sections.map((section, idx) => (
          <AnswerSectionBlock
            key={`${idx}-${section.heading || "intro"}`}
            section={section}
            index={idx}
            defaultCollapsed={false}
          />
        ))}
      </div>
    );
  }

  // Long single-block explanation collapsible preview (only when finished streaming & > 1300 chars)
  const isLongSingleBlock = !isStreaming && content.length > 1300;
  const visibleContent =
    isLongSingleBlock && !expandedLong
      ? `${content.slice(0, 920).trimEnd()}...`
      : content;

  return (
    <div className="space-y-3 text-[16px] sm:text-[17px] leading-[1.65] text-neutral-200 break-words min-w-0 max-w-full">
      {renderMarkdownBlocks(visibleContent)}
      {isLongSingleBlock && (
        <button
          type="button"
          onClick={() => setExpandedLong((prev) => !prev)}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[#FFD60A] hover:border-[#FFD60A]/50 transition-colors cursor-pointer"
        >
          {expandedLong ? (
            <>
              <ChevronUp size={14} aria-hidden="true" />
              <span>Collapse long explanation</span>
            </>
          ) : (
            <>
              <ChevronDown size={14} aria-hidden="true" />
              <span>Show full explanation ({content.length} chars)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
