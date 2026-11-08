"use client";

import React from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // in ms
  y?: number;
  className?: string;
  id?: string;
}

export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className = "",
  id,
}: RevealProps) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px", amount: "some" }}
      transition={{
        duration: 0.38,
        delay: Math.min(delay / 1000, 0.25),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
