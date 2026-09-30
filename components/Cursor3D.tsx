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
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

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
    };

    // Smooth lerp render loop
    const loop = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      if (sphereRef.current) {
        sphereRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
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
      {/* Surrounding Ambient 3D Depth Glow */}
      <div
        ref={glowRef}
        className={`absolute top-0 left-0 rounded-full bg-[radial-gradient(circle,rgba(255,214,10,0.35)_0%,rgba(255,214,10,0.08)_50%,transparent_75%)] blur-md transition-all duration-300 ${
          isHoveringInteractive ? "h-16 w-16 opacity-100" : "h-10 w-10 opacity-70"
        }`}
      />

      {/* 3D-Shaded Yellow Sphere with Specular Highlight & Depth */}
      <div
        ref={sphereRef}
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #FFFFB3 0%, #FFD60A 40%, #D4AF00 75%, #594500 100%)",
          boxShadow:
            "inset -2px -2px 6px rgba(0, 0, 0, 0.6), inset 2px 2px 4px rgba(255, 255, 255, 0.8), 0 0 14px rgba(255, 214, 10, 0.85), 0 4px 8px rgba(0, 0, 0, 0.4)",
        }}
        className={`absolute top-0 left-0 rounded-full border border-white/40 transition-transform duration-200 ${
          isHoveringInteractive ? "h-6 w-6 scale-125" : "h-3.5 w-3.5 scale-100"
        }`}
      />
    </div>
  );
}
