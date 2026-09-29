"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CursorGlow({ className = "" }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);

  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);

  // Smooth, subtle spring movement
  const x = useSpring(rawX, { stiffness: 180, damping: 28, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 180, damping: 28, mass: 0.6 });

  useEffect(() => {
    // Only active on desktop devices with a precise pointer and non-reduced-motion
    const mediaQuery = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const checkCapabilities = () => {
      setEnabled(mediaQuery.matches && !motionQuery.matches);
    };

    checkCapabilities();
    mediaQuery.addEventListener("change", checkCapabilities);
    motionQuery.addEventListener("change", checkCapabilities);

    const handleMouseMove = (e: MouseEvent) => {
      // 180px tiny radius centered around pointer
      rawX.set(e.clientX - 90);
      rawY.set(e.clientY - 90);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      mediaQuery.removeEventListener("change", checkCapabilities);
      motionQuery.removeEventListener("change", checkCapabilities);
    };
  }, [rawX, rawY]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x, y }}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-10 h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,214,10,0.12)_0%,rgba(255,214,10,0.03)_40%,transparent_70%)] blur-2xl opacity-70 transition-opacity duration-300",
        className
      )}
      aria-hidden="true"
    />
  );
}
