"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor3D() {
  const [enabled, setEnabled] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sphereRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check desktop pointer capability
    const mediaQuery = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const check = () => {
      setEnabled(mediaQuery.matches && !motionQuery.matches);
    };

    check();
    mediaQuery.addEventListener("change", check);
    motionQuery.addEventListener("change", check);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId: number | null = null;
    let isRunning = false;

    const loop = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      
      // Critically damped lerp step
      currentX += dx * 0.22;
      currentY += dy * 0.22;

      if (sphereRef.current) {
        sphereRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) translate(-50%, -50%)`;
      }

      // Sleep loop when resting within sub-pixel threshold (< 0.1px)
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        isRunning = false;
        animId = null;
      } else {
        animId = requestAnimationFrame(loop);
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
      startLoop();

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest("a, button, [role='button'], input, textarea, select, .cursor-pointer")
        );
        setIsHoveringInteractive(interactive);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      isRunning = false;
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      mediaQuery.removeEventListener("change", check);
      motionQuery.removeEventListener("change", check);
    };
  }, [isVisible]);

  if (!enabled) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Surrounding Ambient 3D Depth Glow (Refined & Non-Intrusive) */}
      <div
        ref={glowRef}
        className={`absolute top-0 left-0 rounded-full bg-[radial-gradient(circle,rgba(255,214,10,0.18)_0%,rgba(255,214,10,0.04)_50%,transparent_70%)] blur-md transition-all duration-300 ${
          isHoveringInteractive ? "h-12 w-12 opacity-90" : "h-8 w-8 opacity-50"
        }`}
      />

      {/* 3D-Shaded Yellow Sphere with Specular Highlight & Depth */}
      <div
        ref={sphereRef}
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #FFFFB3 0%, #FFD60A 40%, #D4AF00 75%, #594500 100%)",
          boxShadow:
            "inset -1.5px -1.5px 4px rgba(0, 0, 0, 0.5), inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 214, 10, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4)",
        }}
        className={`absolute top-0 left-0 rounded-full border border-white/30 transition-transform duration-200 ${
          isHoveringInteractive ? "h-5 w-5 scale-115" : "h-3 w-3 scale-100"
        }`}
      />
    </div>
  );
}
