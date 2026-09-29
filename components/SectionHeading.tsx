import React from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <Reveal>
        {eyebrow && (
          <p className="font-heading text-xs font-black uppercase tracking-[0.15em] text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-base text-muted">{description}</p>
        )}
      </Reveal>
    </div>
  );
}
