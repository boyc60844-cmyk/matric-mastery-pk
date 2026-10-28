"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Zap, MessageCircle, ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import { whatsappLink } from "@/lib/utils";
import { useLanguage } from "@/src/context/LanguageContext";
import { detectDeviceQuality } from "./renderer-factory";

export default function CTABlackHoleWarp() {
  const { isRTL } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const quality = detectDeviceQuality();
    if (quality.reducedMotion) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !quality.isMobile,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.maxDPR));

    // Particle Count based on device quality
    const count = quality.isMobile ? 1800 : 6500;
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.pow(Math.random(), 1.5) * 8.0;
      radii[i] = radius;
      angles[i] = angle;
      speeds[i] = (0.2 + Math.random() * 0.6) / (radius * 0.8 + 0.4);

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4 * (10 - radius); // Tilted disk
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffd700,
      size: quality.isMobile ? 0.05 : 0.065,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.x = Math.PI / 4;
    scene.add(particles);

    // Dark core sphere
    const coreGeo = new THREE.SphereGeometry(1.0, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x050507 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.x = Math.PI / 4;
    scene.add(core);

    let animId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        angles[i] += speeds[i] * 0.02;
        // Inward gravitational pull
        radii[i] -= 0.003;
        if (radii[i] < 1.1) {
          radii[i] = 8.5 + Math.random() * 1.5;
        }

        pos[i * 3] = Math.cos(angles[i]) * radii[i];
        pos[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
      }
      geometry.attributes.position.needsUpdate = true;

      particles.rotation.z += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = Math.min(container.clientWidth || window.innerWidth, window.innerWidth);
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-full min-w-0 overflow-hidden border-t border-white/10 bg-[#050507] py-24 sm:py-36 text-center select-none"
    >
      {/* 3D Black Hole Accretion Disk Canvas */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full max-w-full overflow-hidden" aria-hidden="true">
        <canvas ref={canvasRef} className="h-full w-full max-w-full block opacity-65" style={{ maxWidth: "100%" }} />
      </div>

      {/* Wet Street Reflection Lighting on bottom third */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050507] via-[rgba(255,215,0,0.04)] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] max-w-full rounded-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,215,0,0.18)_0%,transparent_75%)] blur-3xl"
        aria-hidden="true"
      />

      {/* High-Contrast Accessible Foreground Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-1.5 font-heading text-xs font-black tracking-wider text-accent shadow-sm mb-6">
          <Zap size={14} className="text-accent" />
          <span>JOIN 500+ PUNJAB BOARD STUDENTS</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Fix the system,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ffe570] to-[#c9a66b] underline decoration-accent/40 decoration-wavy [text-shadow:0_0_35px_rgba(255,215,0,0.4)]">
            not yourself.
          </span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
          No spam. No courses. Just one high-impact board exam presentation strategy delivered to your WhatsApp every Sunday.
        </p>

        {/* Newsletter Form - Fully Clickable (z-50) */}
        <div className="relative z-50 pointer-events-auto mt-8 max-w-md mx-auto">
          <NewsletterForm />
        </div>

        {/* Direct WhatsApp link */}
        <p className="relative z-50 pointer-events-auto mt-7 text-xs text-muted font-mono">
          Have an urgent question before exams?{" "}
          <a
            href={whatsappLink("Bhai mujhe board exam preparation ke liye advice chahiye")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>Message Hamza directly on WhatsApp</span>
            <ArrowRight size={13} />
          </a>
        </p>
      </div>
    </section>
  );
}
