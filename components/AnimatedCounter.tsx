"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  sublabel,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    let startTime: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(easeProgress * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-left preserve-3d">
      <div
        style={{ transform: "translateZ(20px)" }}
        className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums flex items-baseline gap-1"
      >
        {prefix && <span className="text-accent">{prefix}</span>}
        <span>{displayValue}</span>
        {suffix && <span className="text-accent font-bold">{suffix}</span>}
      </div>
      <p className="mt-2 font-heading text-sm font-bold text-white/90">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 text-xs text-muted font-mono">{sublabel}</p>
      )}
    </div>
  );
}
