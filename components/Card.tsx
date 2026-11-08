"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  shimmer?: boolean;
  tilt?: boolean;
  depth?: "none" | "yellow" | "secondary" | "hover-yellow";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  shimmer = false,
  tilt = true,
  depth = "none",
  onClick,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Only enable 3D mouse tilt on desktop (>768px) with a fine pointer and non-reduced-motion
    const mediaQuery = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)"
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateCapabilities = () => {
      setCanHover(mediaQuery.matches && !motionQuery.matches);
    };

    updateCapabilities();
    mediaQuery.addEventListener("change", updateCapabilities);
    motionQuery.addEventListener("change", updateCapabilities);
    return () => {
      mediaQuery.removeEventListener("change", updateCapabilities);
      motionQuery.removeEventListener("change", updateCapabilities);
    };
  }, []);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Critically damped harmonic spring: m=0.4, k=240, c=24 (no resonant flutter, clean settle)
  const rotateXSpring = useSpring(
    useTransform(mouseY, [0, 1], [4.5, -4.5]),
    { stiffness: 240, damping: 24, mass: 0.4 }
  );
  const rotateYSpring = useSpring(
    useTransform(mouseX, [0, 1], [-4.5, 4.5]),
    { stiffness: 240, damping: 24, mass: 0.4 }
  );

  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tilt || !canHover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    mouseX.set(xPct);
    mouseY.set(yPct);
    cardRef.current.style.setProperty("--glare-x", `${(xPct * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty("--glare-y", `${(yPct * 100).toFixed(1)}%`);
  }

  function handleMouseEnter() {
    if (!tilt || !canHover) return;
    setIsHovered(true);
  }

  function handleMouseLeave() {
    if (!tilt || !canHover) return;
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const depthStyles = {
    none: "",
    yellow: "shadow-brutalist-yellow",
    secondary: "shadow-brutalist-secondary",
    "hover-yellow": "transition-shadow duration-300 hover:shadow-brutalist-yellow",
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        rotateX: tilt && canHover ? rotateXSpring : 0,
        rotateY: tilt && canHover ? rotateYSpring : 0,
      }}
      whileTap={{
        scale: 0.985,
        transition: { type: "spring", stiffness: 480, damping: 28 },
      }}
      className={cn(
        "card-surface rounded-2xl p-6 shadow-soft transition-all duration-300 preserve-3d hover:border-border-hover relative group overflow-hidden will-change-transform",
        depthStyles[depth],
        shimmer && "shimmer-sweep",
        className
      )}
    >
      {/* Specular glare reflection highlight (Fresnel effect via CSS custom properties) */}
      {canHover && tilt && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: "radial-gradient(350px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 214, 10, 0.08), transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Background layer (Z = 0) */}
      <div
        style={{ transform: "translateZ(0px)" }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top,rgba(255,214,10,0.06)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Content wrapper with spatial elevation (Z = 15px) */}
      <div style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
