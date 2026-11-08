"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Physics constants: stiffness 160, damping 28, mass 0.2 (low latency, high fidelity)
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.2,
    restDelta: 0.0001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[2.5px] origin-left bg-accent shadow-[0_0_12px_rgba(255,214,10,0.8),0_0_24px_rgba(255,214,10,0.4)]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
