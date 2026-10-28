"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createAdaptiveRenderer, detectDeviceQuality } from "./renderer-factory";

export default function HeroUltraScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendererType, setRendererType] = useState<"webgpu" | "webgl">("webgl");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const quality = detectDeviceQuality();
    if (quality.reducedMotion) return;

    let isDisposed = false;
    let animId: number;
    let renderer: THREE.WebGLRenderer | any = null;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    // 2. Lighting Architecture (Champagne Warm Key + Cool Contrast Rim + Ambient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffd700, 2.8);
    goldKeyLight.position.set(6, 8, 7);
    scene.add(goldKeyLight);

    const champagneRimLight = new THREE.DirectionalLight(0xc9a66b, 1.6);
    champagneRimLight.position.set(-6, -4, -3);
    scene.add(champagneRimLight);

    const centerGlowLight = new THREE.PointLight(0xffd700, 2.5, 9);
    centerGlowLight.position.set(1.5, 0.5, 3);
    scene.add(centerGlowLight);

    // -------------------------------------------------------------
    // 3. 3D ASSETS: LOW-POLY MATRIC BOOKS, EXAM SHEET & GOLDEN PEN
    // -------------------------------------------------------------
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Book 1: SSC-II Physics Textbook (Champagne-gold edge & midnight cover)
    const book1Group = new THREE.Group();
    const book1CoverGeo = new THREE.BoxGeometry(2.3, 3.1, 0.42);
    const book1CoverMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      roughness: 0.25,
      metalness: 0.7,
    });
    const book1Cover = new THREE.Mesh(book1CoverGeo, book1CoverMat);
    book1Group.add(book1Cover);

    const book1PagesGeo = new THREE.BoxGeometry(2.18, 2.98, 0.36);
    const book1PagesMat = new THREE.MeshStandardMaterial({
      color: 0xfff5d0,
      roughness: 0.8,
      metalness: 0.1,
    });
    const book1Pages = new THREE.Mesh(book1PagesGeo, book1PagesMat);
    book1Pages.position.x = 0.08;
    book1Group.add(book1Pages);

    // Gold ribbon bookmark
    const ribbonGeo = new THREE.BoxGeometry(0.18, 1.4, 0.04);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0.4, -1.6, 0.22);
    ribbon.rotation.z = -0.15;
    book1Group.add(ribbon);

    book1Group.position.set(2.8, 0.8, 1.2);
    book1Group.rotation.set(0.3, -0.45, 0.15);
    masterGroup.add(book1Group);

    // Book 2: SSC-II Mathematics Formula Guide (Slightly smaller, angled)
    const book2Group = new THREE.Group();
    const book2CoverGeo = new THREE.BoxGeometry(2.0, 2.8, 0.38);
    const book2CoverMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      roughness: 0.35,
      metalness: 0.5,
    });
    const book2Cover = new THREE.Mesh(book2CoverGeo, book2CoverMat);
    book2Group.add(book2Cover);

    const book2PagesGeo = new THREE.BoxGeometry(1.9, 2.7, 0.32);
    const book2Pages = new THREE.Mesh(book2PagesGeo, book1PagesMat);
    book2Pages.position.x = 0.06;
    book2Group.add(book2Pages);

    book2Group.position.set(3.8, -1.2, -0.5);
    book2Group.rotation.set(-0.2, -0.6, -0.1);
    masterGroup.add(book2Group);

    // 3D Exam Answer Sheet (Floating ruled parchment with margin line)
    const sheetGroup = new THREE.Group();
    const sheetGeo = new THREE.PlaneGeometry(2.5, 3.4, 8, 8);
    const sheetMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f2,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const sheetMesh = new THREE.Mesh(sheetGeo, sheetMat);
    sheetGroup.add(sheetMesh);

    // Margin line on paper
    const marginGeo = new THREE.PlaneGeometry(0.04, 3.3);
    const marginMat = new THREE.MeshBasicMaterial({ color: 0xcc2222 });
    const marginLine = new THREE.Mesh(marginGeo, marginMat);
    marginLine.position.set(-0.9, 0, 0.01);
    sheetGroup.add(marginLine);

    sheetGroup.position.set(1.4, -1.6, 2.0);
    sheetGroup.rotation.set(0.4, 0.3, -0.2);
    masterGroup.add(sheetGroup);

    // 3D Metallic 605 Cut Marker / Pen
    const penGroup = new THREE.Group();
    const penBodyGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 16);
    const penBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f12,
      metalness: 0.85,
      roughness: 0.2,
    });
    const penBody = new THREE.Mesh(penBodyGeo, penBodyMat);
    penGroup.add(penBody);

    const penTipGeo = new THREE.ConeGeometry(0.08, 0.35, 16);
    const penTipMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.1,
    });
    const penTip = new THREE.Mesh(penTipGeo, penTipMat);
    penTip.position.y = 1.35;
    penGroup.add(penTip);

    penGroup.position.set(0.8, -0.5, 3.2);
    penGroup.rotation.set(0.6, 0.3, 0.85);
    masterGroup.add(penGroup);

    // Subtle Science Orbit Ring & Nucleus (Floating Physics Atom Symbol)
    const atomGroup = new THREE.Group();
    const nucleusGeo = new THREE.SphereGeometry(0.28, 24, 24);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.9,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    atomGroup.add(nucleus);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc9a66b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.02, 12, 48), ringMat);
    ring1.rotation.x = Math.PI / 3;
    atomGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.02, 12, 48), ringMat);
    ring2.rotation.y = Math.PI / 3;
    atomGroup.add(ring2);

    atomGroup.position.set(-3.5, 1.8, -1.0);
    atomGroup.scale.set(0.85, 0.85, 0.85);
    masterGroup.add(atomGroup);

    // -------------------------------------------------------------
    // 4. GOLD DUST DEPTH PARTICLE FIELD (ADAPTIVE GPU BUDGET)
    // -------------------------------------------------------------
    const particleCount = quality.particlesCount;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const initialZ = new Float32Array(particleCount);

    const spreadX = quality.isMobile ? 22 : 36;
    const spreadY = quality.isMobile ? 18 : 22;
    const spreadZ = 20;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * spreadX;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * spreadY;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * spreadZ;
      initialZ[i] = particlePositions[i3 + 2];
      particleSpeeds[i] = 0.2 + Math.random() * 0.8;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: quality.isMobile ? 0.065 : 0.075,
      transparent: true,
      opacity: quality.isMobile ? 0.5 : 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------
    // 5. MOUSE, TOUCH & GYROSCOPE SPATIAL CAMERA EXPLORATION
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let touchPanX = 0;
    let targetTouchPanX = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let scrollY = 0;
    let isVisible = true;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 2.2;
      targetMouseY = y * 2.2;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - touchStartX;
        const deltaY = currentY - touchStartY;

        // If predominantly horizontal gesture, pan the virtual 3D camera
        if (Math.abs(deltaX) > Math.abs(deltaY) * 0.6) {
          const dragRatio = deltaX / (window.innerWidth || 360);
          targetTouchPanX = Math.min(3.8, Math.max(-3.8, targetTouchPanX + dragRatio * 2.6));
          touchStartX = currentX;
          touchStartY = currentY;
        }
      }
    };

    // Mobile Gyroscope Parallax
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        const clampedGamma = Math.min(30, Math.max(-30, e.gamma));
        targetMouseX = (clampedGamma / 30) * 1.6;
      }
      if (e.beta !== null) {
        const clampedBeta = Math.min(65, Math.max(15, e.beta)) - 40;
        targetMouseY = (clampedBeta / 25) * 1.0;
      }
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Pause rendering when hero is scrolled completely offscreen (saves 100% GPU)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // -------------------------------------------------------------
    // 6. INITIALIZE WEBGPU-FIRST WITH WEBGL FALLBACK
    // -------------------------------------------------------------
    let clock = new THREE.Clock();

    createAdaptiveRenderer(canvas, {
      alpha: true,
      antialias: !quality.isMobile,
      powerPreference: "high-performance",
    }).then(({ renderer: initRenderer, type }) => {
      if (isDisposed) {
        initRenderer.dispose();
        return;
      }
      renderer = initRenderer;
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.maxDPR));
      setRendererType(type);

      // Animation Loop
      const animate = () => {
        if (isDisposed) return;
        animId = requestAnimationFrame(animate);

        // Skip render if off-screen
        if (!isVisible) return;

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse and touch lerp
        mouseX += (targetMouseX - mouseX) * 0.045;
        mouseY += (targetMouseY - mouseY) * 0.045;
        touchPanX += (targetTouchPanX - touchPanX) * 0.07;

        // Camera Rail & Spatial Exploration:
        // Horizontal camera travel moves through the expansive 3D world (books, atom, sheet, pen)
        const scrollProgress = Math.min(1.2, scrollY / 900);
        camera.position.x = mouseX * 1.3 + touchPanX - scrollProgress * 1.8;
        camera.position.y = -mouseY * 0.9 - scrollProgress * 2.2;
        camera.position.z = 13 - scrollProgress * 3.5;
        camera.lookAt(touchPanX * 0.35, -scrollProgress * 1.0, 0);

        // Floating Books Animation
        book1Group.position.y = 0.8 + Math.sin(elapsedTime * 1.1) * 0.16;
        book1Group.rotation.y = -0.45 + Math.sin(elapsedTime * 0.7) * 0.09 + mouseX * 0.2;
        book1Group.rotation.x = 0.3 + Math.cos(elapsedTime * 0.9) * 0.07 - mouseY * 0.15;

        book2Group.position.y = -1.2 + Math.cos(elapsedTime * 0.95 + 1.2) * 0.14;
        book2Group.rotation.y = -0.6 + Math.cos(elapsedTime * 0.6) * 0.08 + mouseX * 0.15;

        // Exam Paper sheet fluttering
        sheetGroup.position.y = -1.6 + Math.sin(elapsedTime * 1.3 + 0.8) * 0.15;
        sheetGroup.rotation.z = -0.2 + Math.sin(elapsedTime * 0.8) * 0.08;

        // Metallic pen floating alongside sheet
        penGroup.position.y = -0.5 + Math.sin(elapsedTime * 1.4 + 2) * 0.12;
        penGroup.rotation.y = 0.3 + elapsedTime * 0.4;

        // Atom orbit rotation
        atomGroup.rotation.y = elapsedTime * 0.6;
        atomGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.25;

        // Gentle particles drift in Z
        const pos = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          pos[i3 + 1] += Math.sin(elapsedTime + i) * 0.003;
          // Mouse repulsion near cursor center
          const dx = pos[i3] - mouseX * 4;
          const dy = pos[i3 + 1] - mouseY * 4;
          const distSq = dx * dx + dy * dy;
          if (distSq < 16) {
            pos[i3] += dx * 0.003;
            pos[i3 + 1] += dy * 0.003;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
        particles.rotation.y = elapsedTime * 0.015;

        renderer.render(scene, camera);
      };

      animate();
    });

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = Math.min(container.clientWidth || window.innerWidth, window.innerWidth);
      const newHeight = container.clientHeight || 750;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight, false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      if (renderer) {
        renderer.dispose();
      }
      book1CoverGeo.dispose();
      book1CoverMat.dispose();
      book1PagesGeo.dispose();
      book1PagesMat.dispose();
      book2CoverGeo.dispose();
      book2CoverMat.dispose();
      book2PagesGeo.dispose();
      sheetGeo.dispose();
      sheetMat.dispose();
      penBodyGeo.dispose();
      penBodyMat.dispose();
      penTipGeo.dispose();
      penTipMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 top-0 left-0 z-0 h-full w-full max-w-full overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full max-w-full block" style={{ maxWidth: "100%" }} />

      {/* Tech Indicator Badge (Ultra-subtle Luxury Watermark) */}
      <div className="pointer-events-none absolute top-4 right-4 z-10 hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] text-muted/70 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <span className="uppercase tracking-wider">
          {rendererType === "webgpu" ? "WebGPU Ultra Core r186" : "WebGL 2.0 ACES Tone"}
        </span>
      </div>

      {/* Mobile Spatial Interaction Indicator */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex lg:hidden items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[9px] text-[#C9A66B] backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
        <span>Swipe 3D / Tilt</span>
      </div>
    </div>
  );
}
