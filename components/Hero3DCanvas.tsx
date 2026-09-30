"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 700;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // LIGHTS
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffd60a, 2.5); // Yellow accent light
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4080ff, 1.2); // Cool blue contrast rim
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    const atomPointLight = new THREE.PointLight(0xffd60a, 3, 8);
    scene.add(atomPointLight);

    // -------------------------------------------------------------
    // 1. FLOATING 3D BOOK
    // -------------------------------------------------------------
    const bookGroup = new THREE.Group();

    // Book Cover
    const coverGeo = new THREE.BoxGeometry(2.4, 3.2, 0.45);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      roughness: 0.3,
      metalness: 0.6,
    });
    const coverMesh = new THREE.Mesh(coverGeo, coverMat);
    bookGroup.add(coverMesh);

    // Book Pages (Cream white inside)
    const pagesGeo = new THREE.BoxGeometry(2.25, 3.05, 0.38);
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbf7,
      roughness: 0.8,
      metalness: 0.05,
    });
    const pagesMesh = new THREE.Mesh(pagesGeo, pagesMat);
    pagesMesh.position.set(0.08, 0, 0);
    bookGroup.add(pagesMesh);

    // Gold Embossed Bookmark Spine Ribbon
    const ribbonGeo = new THREE.BoxGeometry(0.12, 3.25, 0.47);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xffd60a,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x665500,
      emissiveIntensity: 0.3,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.position.set(-1.18, 0, 0);
    bookGroup.add(ribbonMesh);

    // Place book in upper-left/center area
    bookGroup.position.set(-3.8, 1.2, 0);
    bookGroup.rotation.set(0.4, 0.6, -0.2);
    scene.add(bookGroup);

    // -------------------------------------------------------------
    // 2. FLOATING 3D ATOM (Physics & Science)
    // -------------------------------------------------------------
    const atomGroup = new THREE.Group();

    // Central Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0xffd60a,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0xffd60a,
      emissiveIntensity: 0.4,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    atomGroup.add(nucleus);

    // Orbiting Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffe666,
      roughness: 0.3,
      metalness: 0.7,
      wireframe: false,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.035, 16, 64), ringMat);
    ring1.rotation.x = Math.PI / 3;
    atomGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.035, 16, 64), ringMat);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    atomGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.035, 16, 64), ringMat);
    ring3.rotation.y = Math.PI / 2.5;
    atomGroup.add(ring3);

    // Electrons on orbits
    const electronMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.8,
    });
    const electron1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), electronMat);
    const electron2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), electronMat);
    const electron3 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), electronMat);
    atomGroup.add(electron1, electron2, electron3);

    // Position atom in center-right background
    atomGroup.position.set(4.2, 0.8, -1.5);
    scene.add(atomGroup);

    // -------------------------------------------------------------
    // 3. FLOATING 3D GRADUATION CAP (Academic Mastery)
    // -------------------------------------------------------------
    const capGroup = new THREE.Group();

    // Mortarboard Flat Top
    const boardGeo = new THREE.BoxGeometry(2.0, 0.08, 2.0);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x151518,
      roughness: 0.3,
      metalness: 0.7,
    });
    const boardMesh = new THREE.Mesh(boardGeo, capMat);
    boardMesh.rotation.y = Math.PI / 4;
    capGroup.add(boardMesh);

    // Skull Base
    const skullGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.55, 32);
    const skullMesh = new THREE.Mesh(skullGeo, capMat);
    skullMesh.position.y = -0.3;
    capGroup.add(skullMesh);

    // Golden Button & Tassel
    const buttonGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd60a,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x886600,
    });
    const buttonMesh = new THREE.Mesh(buttonGeo, goldMat);
    buttonMesh.position.y = 0.06;
    capGroup.add(buttonMesh);

    const tasselGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.9, 8);
    const tasselMesh = new THREE.Mesh(tasselGeo, goldMat);
    tasselMesh.position.set(0.6, -0.35, 0.6);
    tasselMesh.rotation.z = -0.3;
    capGroup.add(tasselMesh);

    capGroup.position.set(-1.2, -2.4, 1.0);
    capGroup.rotation.set(-0.25, 0.4, 0.15);
    scene.add(capGroup);

    // -------------------------------------------------------------
    // 4. 800 GOLDEN DEPTH PARTICLES (Hero Only)
    // -------------------------------------------------------------
    const particleCount = 800;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      particleSpeeds[i] = 0.2 + Math.random() * 0.8;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffd60a,
      size: 0.075,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------
    // MOUSE PARALLAX & ANIMATION LOOP
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 2.5;
      targetMouseY = y * 2.5;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Camera parallax depth
      camera.position.x = mouseX * 1.2;
      camera.position.y = -mouseY * 0.8;
      camera.lookAt(0, 0, 0);

      // Book Floating Motion
      bookGroup.position.y = 1.2 + Math.sin(elapsedTime * 1.2) * 0.18;
      bookGroup.rotation.y = 0.6 + Math.sin(elapsedTime * 0.8) * 0.12 + mouseX * 0.2;
      bookGroup.rotation.x = 0.4 + Math.cos(elapsedTime * 1.0) * 0.08 - mouseY * 0.15;

      // Atom Rotation & Electron Orbits
      atomGroup.position.y = 0.8 + Math.cos(elapsedTime * 1.1) * 0.15;
      atomGroup.rotation.y = elapsedTime * 0.5;
      atomGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.2;

      atomPointLight.position.copy(atomGroup.position);

      const angle1 = elapsedTime * 2.2;
      electron1.position.set(Math.cos(angle1) * 1.6, Math.sin(angle1) * 1.6 * 0.5, Math.sin(angle1) * 1.6 * 0.86);

      const angle2 = elapsedTime * -2.5;
      electron2.position.set(Math.cos(angle2) * 1.6 * 0.7, Math.sin(angle2) * 1.6, Math.sin(angle2) * 1.6 * -0.7);

      const angle3 = elapsedTime * 2.8 + 1.5;
      electron3.position.set(Math.sin(angle3) * 1.6 * 0.9, Math.cos(angle3) * 1.6 * 0.4, Math.cos(angle3) * 1.6);

      // Graduation Cap Floating
      capGroup.position.y = -2.4 + Math.sin(elapsedTime * 0.9 + 2) * 0.16;
      capGroup.rotation.y = 0.4 + Math.cos(elapsedTime * 0.6) * 0.15 + mouseX * 0.15;

      // Particle subtle drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.003;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // RESIZE LISTENER & CLEANUP
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 700;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coverGeo.dispose();
      coverMat.dispose();
      pagesGeo.dispose();
      pagesMat.dispose();
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
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
      aria-hidden="true"
    />
  );
}
