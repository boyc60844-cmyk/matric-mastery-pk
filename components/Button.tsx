"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "whatsapp" | "ghost";
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  className = "",
  onClick,
  disabled = false,
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Only enable magnetic physics on desktop devices with mouse pointer
    const mediaQuery = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    setCanHover(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 350, damping: 22 });
  const y = useSpring(rawY, { stiffness: 350, damping: 22 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rawX.set((e.clientX - centerX) * 0.18);
    rawY.set((e.clientY - centerY) * 0.25);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none preserve-3d";

  const variantStyles = {
    primary:
      "bg-accent text-black btn-3d-yellow px-5 py-3 hover:bg-[#FFE033]",
    secondary:
      "card-surface text-white btn-3d-secondary px-5 py-3 hover:bg-white/[0.08] hover:border-white/20",
    whatsapp:
      "btn-gradient-border text-white px-5 py-3 shadow-soft hover:bg-white/[0.08] active:scale-95 active:translate-y-1 transition-transform",
    ghost:
      "text-muted hover:text-white hover:bg-white/[0.05] px-4 py-2.5 rounded-lg active:scale-95",
  };

  const content = (
    <motion.div
      ref={ref}
      style={{ x: canHover ? x : 0, y: canHover ? y : 0 }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </motion.div>
  );

  if (href) {
    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block preserve-3d"
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className="inline-block preserve-3d">
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-block border-none bg-transparent p-0 outline-none focus:outline-none preserve-3d"
    >
      {content}
    </button>
  );
}
