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

  // Maximum rotation: 5deg as requested
  const rotateXSpring = useSpring(
    useTransform(mouseY, [0, 1], [4, -4]),
    { stiffness: 180, damping: 24, mass: 0.5 }
  );
  const rotateYSpring = useSpring(
    useTransform(mouseX, [0, 1], [-4, 4]),
    { stiffness: 180, damping: 24, mass: 0.5 }
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tilt || !canHover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    if (!tilt || !canHover) return;
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
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        rotateX: tilt && canHover ? rotateXSpring : 0,
        rotateY: tilt && canHover ? rotateYSpring : 0,
      }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "card-surface rounded-2xl p-6 shadow-soft transition-all duration-300 preserve-3d hover:border-border-hover relative group",
        depthStyles[depth],
        shimmer && "shimmer-sweep",
        className
      )}
    >
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
