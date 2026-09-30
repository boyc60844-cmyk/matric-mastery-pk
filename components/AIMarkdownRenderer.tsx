"use client";

import React from "react";

interface AIMarkdownRendererProps {
  content: string;
}

export default function AIMarkdownRenderer({ content }: AIMarkdownRendererProps) {
  if (!content) return null;

  // Split into lines/paragraphs
  const lines = content.split("\n");

  const renderFormattedText = (text: string) => {
    // Replace $math$ with math badge
    const parts = text.split(/(\$[^\$]+\$|\*\*[^\*]+\*\*|\*[^\*]+\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const mathContent = part.slice(1, -1);
        return (
          <code
            key={i}
            className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-xs sm:text-[13px] font-bold text-accent border border-accent/30 mx-0.5"
          >
            {mathContent}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={i} className="font-heading font-black text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={i} className="italic text-accent/90">
            {part.slice(1, -1)}
          </em>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-3 text-sm leading-relaxed text-white/90">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3 or 4
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={idx}
              className="font-heading font-black text-sm uppercase tracking-wider text-accent pt-2"
            >
              {renderFormattedText(trimmed.replace(/^###\s+/, ""))}
            </h4>
          );
        }

        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          return (
            <h3
              key={idx}
              className="font-heading font-black text-base text-white border-b border-white/10 pb-1 pt-2"
            >
              {renderFormattedText(trimmed.replace(/^#+\s+/, ""))}
            </h3>
          );
        }

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
          const bulletText = trimmed.replace(/^[-*•]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="font-mono text-xs text-accent pt-1 shrink-0">&bull;</span>
              <div className="flex-1">{renderFormattedText(bulletText)}</div>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent/15 font-mono text-xs font-bold text-accent">
                {numMatch[1]}
              </span>
              <div className="flex-1 pt-0.5">{renderFormattedText(numMatch[2])}</div>
            </div>
          );
        }

        // Table Row (simple check)
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
          const cells = trimmed
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());
          if (cells.every((c) => /^:?-+:?$/.test(c))) {
            return null; // separator row
          }
          return (
            <div
              key={idx}
              className="grid grid-flow-col auto-cols-fr gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2 text-xs font-mono"
            >
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="overflow-hidden truncate">
                  {renderFormattedText(cell)}
                </div>
              ))}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-white/90">
            {renderFormattedText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
