"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface DoubtOrb3DProps {
  isTyping?: boolean;
  isGenerating?: boolean;
}

export default function DoubtOrb3D({ isTyping = false, isGenerating = false }: DoubtOrb3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isTyping, isGenerating });

  useEffect(() => {
    stateRef.current = { isTyping, isGenerating };
  }, [isTyping, isGenerating]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 300;
    const height = mount.clientHeight || 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // Glowing Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xffd60a, 4, 10);
    goldLight.position.set(0, 0, 2);
    scene.add(goldLight);

    // 3D Glowing Core Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.0, 3);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffd60a,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(coreMesh);

    // Inner Glowing Solid Orb
    const innerGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffe600,
      transparent: true,
      opacity: 0.25,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Orbiting Dust Ring
    const ringGeo = new THREE.TorusGeometry(1.4, 0.02, 12, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd60a,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.8;
    scene.add(ringMesh);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const { isTyping: typing, isGenerating: generating } = stateRef.current;

      const speedMultiplier = generating ? 3.0 : typing ? 2.2 : 1.0;
      const pulseAmp = generating ? 0.2 : typing ? 0.15 : 0.06;

      // Rotation
      coreMesh.rotation.y += 0.015 * speedMultiplier;
      coreMesh.rotation.x = Math.sin(elapsed * 0.8) * 0.2;
      ringMesh.rotation.z += 0.02 * speedMultiplier;

      // Pulsation scale
      const scale = 1.0 + Math.sin(elapsed * 3.0 * speedMultiplier) * pulseAmp;
      coreMesh.scale.set(scale, scale, scale);
      innerMesh.scale.set(scale * 0.9, scale * 0.9, scale * 0.9);

      // Material reactive glow
      sphereMat.opacity = generating ? 0.75 : typing ? 0.6 : 0.4;
      innerMat.opacity = generating ? 0.45 : typing ? 0.35 : 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-80"
      aria-hidden="true"
    />
  );
}
