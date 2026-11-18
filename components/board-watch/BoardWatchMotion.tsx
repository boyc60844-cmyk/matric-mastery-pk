"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Coordinated editorial motion system scoped strictly to Board Watch.
 * Uses GPU-friendly transform + opacity transitions, quintic ease-out,
 * no bounce/spring overshoot, and strict prefers-reduced-motion compliance.
 */
export const BW_EASE = [0.16, 1, 0.3, 1] as const;

export const BW_VIEWPORT = {
  once: true,
  amount: "some",
  margin: "0px 0px -32px 0px",
} as const;

export const BW_TWEEN_INTERACTIVE = {
  type: "tween",
  duration: 0.2,
  ease: BW_EASE,
} as const;

interface HeroEntranceItemProps {
  children: React.ReactNode;
  delay?: number; // seconds
  duration?: number; // seconds
  y?: number;
  className?: string;
}

export function HeroEntranceItem({
  children,
  delay = 0,
  duration = 0.5,
  y = 12,
  className,
}: HeroEntranceItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: BW_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // seconds
  duration?: number; // seconds
  y?: number;
  className?: string;
  id?: string;
}

export function ScrollRevealDiv({
  children,
  delay = 0,
  duration = 0.44,
  y = 14,
  className,
  id,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={BW_VIEWPORT}
      transition={{ duration, delay, ease: BW_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealSection({
  children,
  delay = 0,
  duration = 0.46,
  y = 14,
  className,
  id,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={BW_VIEWPORT}
      transition={{ duration, delay, ease: BW_EASE }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function ScrollRevealArticle({
  children,
  delay = 0,
  duration = 0.4,
  y = 12,
  className,
  id,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <article id={id} className={className}>
        {children}
      </article>
    );
  }

  return (
    <motion.article
      id={id}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={BW_VIEWPORT}
      transition={{ duration, delay, ease: BW_EASE }}
      className={className}
    >
      {children}
    </motion.article>
  );
}

interface TabSwitchPanelProps {
  panelKey: string;
  children: React.ReactNode;
  className?: string;
}

export function TabSwitchPanel({
  panelKey,
  children,
  className,
}: TabSwitchPanelProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={panelKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: BW_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface CollapsiblePanelProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export function CollapsiblePanel({ isOpen, children }: CollapsiblePanelProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return isOpen ? <div>{children}</div> : null;
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: BW_EASE }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
