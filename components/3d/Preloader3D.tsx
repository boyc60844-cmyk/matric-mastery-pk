"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader3D({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user already saw the preloader in this session
    const seen = sessionStorage.getItem("mm_preloader_seen_v2026");
    if (seen) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      sessionStorage.setItem("mm_preloader_seen_v2026", "true");
      setVisible(false);
      onComplete?.();
      return;
    }

    // Three.js scene for particles converging into an "M" monogram / graduation crest
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(220, 220);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Target Monogram Points for "M" & Diamond Crest
    const count = 1200;
    const targetPositions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    const currentPositions = new Float32Array(count * 3);

    // Generate points along the "M" letterform and floating crest ring
    for (let i = 0; i < count; i++) {
      // Scatter initially in a 3D sphere
      const radius = 5.0 + Math.random() * 4.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      initialPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      initialPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      initialPositions[i * 3 + 2] = radius * Math.cos(phi);

      currentPositions[i * 3] = initialPositions[i * 3];
      currentPositions[i * 3 + 1] = initialPositions[i * 3 + 1];
      currentPositions[i * 3 + 2] = initialPositions[i * 3 + 2];

      // Form the "M" shape (left pillar, diagonal down, diagonal up, right pillar)
      const segment = i % 4;
      const t = Math.random();
      let tx = 0;
      let ty = 0;
      let tz = (Math.random() - 0.5) * 0.4;

      if (segment === 0) {
        // Left upright pillar
        tx = -1.8;
        ty = -1.8 + t * 3.6;
      } else if (segment === 1) {
        // Diagonal left down to center
        tx = -1.8 + t * 1.8;
        ty = 1.8 - t * 2.2;
      } else if (segment === 2) {
        // Diagonal center up to right
        tx = 0 + t * 1.8;
        ty = -0.4 + t * 2.2;
      } else {
        // Right upright pillar
        tx = 1.8;
        ty = 1.8 - t * 3.6;
      }

      // Add slight jitter for volume
      tx += (Math.random() - 0.5) * 0.25;
      ty += (Math.random() - 0.5) * 0.25;

      // Halo ring around the crest for remaining 20%
      if (i > count * 0.8) {
        const angle = (i / (count * 0.2)) * Math.PI * 2;
        tx = Math.cos(angle) * 2.6 + (Math.random() - 0.5) * 0.2;
        ty = Math.sin(angle) * 2.6 + (Math.random() - 0.5) * 0.2;
        tz = (Math.random() - 0.5) * 0.5;
      }

      targetPositions[i * 3] = tx;
      targetPositions[i * 3 + 1] = ty;
      targetPositions[i * 3 + 2] = tz;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.09,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Progress timer
    let progressVal = 0;
    let animId: number;
    const startTime = performance.now();
    const duration = 1050; // Total 1.05 seconds - fast, luxury, zero lag

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const factor = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - factor, 3);
      progressVal = Math.round(ease * 100);
      setProgress(progressVal);

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3] = initialPositions[i3] + (targetPositions[i3] - initialPositions[i3]) * ease;
        pos[i3 + 1] = initialPositions[i3 + 1] + (targetPositions[i3 + 1] - initialPositions[i3 + 1]) * ease;
        pos[i3 + 2] = initialPositions[i3 + 2] + (targetPositions[i3 + 2] - initialPositions[i3 + 2]) * ease;
      }
      geometry.attributes.position.needsUpdate = true;

      // Gentle rotation
      particles.rotation.y = ease * Math.PI * 0.5 + factor * 0.3;
      particles.rotation.z = Math.sin(factor * Math.PI) * 0.1;

      renderer.render(scene, camera);

      if (factor < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          sessionStorage.setItem("mm_preloader_seen_v2026", "true");
          setVisible(false);
          onComplete?.();
        }, 180);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem("mm_preloader_seen_v2026", "true");
    setVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050507] text-white selection:bg-accent selection:text-black select-none pointer-events-auto"
        >
          {/* Subtle Champagne Radial Glow behind crest */}
          <div
            className="pointer-events-none absolute h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.18)_0%,rgba(201,166,107,0.04)_45%,transparent_70%)] blur-2xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center">
            {/* 3D Particle Canvas */}
            <canvas ref={canvasRef} width={220} height={220} className="h-44 w-44 sm:h-52 sm:w-52" />

            {/* Typography */}
            <div className="mt-3 text-center">
              <span className="font-heading text-xs font-black tracking-[0.28em] text-[#C9A66B] uppercase">
                Matric Mastery · 2026
              </span>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="font-mono text-2xl font-black text-white">{progress}%</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-muted">
                Assembling Topper Intelligence...
              </p>
            </div>

            {/* Skip Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="mt-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[10px] text-muted hover:border-accent/40 hover:text-white transition-colors cursor-pointer"
            >
              Skip Intro &rarr;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
