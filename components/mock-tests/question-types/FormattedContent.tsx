"use client";

import React from "react";

/**
 * Safe structured educational content renderer.
 * Avoids raw HTML injection while formatting fenced code blocks, inline code,
 * subscripts (e.g. v_i, F_x), and superscripts (e.g. x^2, 10^{-3}) cleanly.
 */

function renderInlineTokens(text: string): React.ReactNode[] {
  // Split first by inline code backticks `...`
  const segments = text.split(/(`[^`]+`)/g);
  return segments.map((seg, idx) => {
    if (seg.startsWith("`") && seg.endsWith("`") && seg.length > 2) {
      const inner = seg.slice(1, -1);
      return (
        <code
          key={idx}
          className="rounded bg-white/[0.08] border border-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[#FFD60A]"
        >
          {inner}
        </code>
      );
    }
    return <React.Fragment key={idx}>{renderMathScripts(seg)}</React.Fragment>;
  });
}

function renderMathScripts(text: string): React.ReactNode[] {
  // Match braced super/subscript like ^{23}, ^{-3}, _{max} OR short letter subscripts like v_i, v_f, F_x, a_1
  const pattern = /(\^\{[^}]+\}|_\{[^}]+\}|_[a-zA-Z0-9]+|\^[0-9-]+)/g;
  const parts = text.split(pattern);

  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("^{") && part.endsWith("}")) {
      return <sup key={idx} className="text-[0.75em] leading-none">{part.slice(2, -1)}</sup>;
    }
    if (part.startsWith("_{") && part.endsWith("}")) {
      return <sub key={idx} className="text-[0.75em] leading-none">{part.slice(2, -1)}</sub>;
    }
    if (part.startsWith("^") && part.length > 1) {
      return <sup key={idx} className="text-[0.75em] leading-none">{part.slice(1)}</sup>;
    }
    if (part.startsWith("_") && part.length > 1 && part.length <= 5) {
      return <sub key={idx} className="text-[0.75em] leading-none">{part.slice(1)}</sub>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function FormattedContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  if (!content) return null;

  // Split out fenced code blocks ```lang ... ```
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.startsWith("```") && block.endsWith("```")) {
          const lines = block.slice(3, -3).split("\n");
          const firstLine = lines[0]?.trim();
          const hasLang = firstLine && /^[a-zA-Z0-9#+_-]+$/.test(firstLine);
          const codeBody = (hasLang ? lines.slice(1) : lines).join("\n").trim();
          return (
            <pre
              key={bIdx}
              className="overflow-x-auto rounded-xl border border-white/10 bg-[#09090B] p-3.5 font-mono text-xs leading-relaxed text-zinc-200"
            >
              <code>{codeBody}</code>
            </pre>
          );
        }

        const trimmed = block.trim();
        if (!trimmed) return null;

        return (
          <div key={bIdx} className="space-y-1.5 whitespace-pre-line">
            {trimmed.split("\n").map((line, lIdx) => (
              <p key={lIdx} className="leading-relaxed">
                {renderInlineTokens(line)}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
