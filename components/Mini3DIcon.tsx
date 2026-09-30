"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Mini3DIconProps {
  type: "physics" | "chemistry" | "math" | "biology";
  className?: string;
}

export default function Mini3DIcon({ type, className = "" }: Mini3DIconProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Small fixed 60x60 canvas
    const size = 60;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Subtle lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd60a, 2.5, 10);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. PHYSICS: Small rotating 3D Atom
    if (type === "physics") {
      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffd60a,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0xffd60a,
          emissiveIntensity: 0.5,
        })
      );
      rootGroup.add(nucleus);

      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffe666,
        wireframe: true,
      });
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 8, 32), ringMat);
      ring1.rotation.x = Math.PI / 3;
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 8, 32), ringMat);
      ring2.rotation.x = -Math.PI / 3;
      ring2.rotation.y = Math.PI / 4;
      rootGroup.add(ring1, ring2);
    }

    // 2. CHEMISTRY: 3D Conical Flask with Liquid
    else if (type === "chemistry") {
      const flaskMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.65,
      });

      // Conical Body
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.2, 16, 1, true), flaskMat);
      body.position.y = -0.2;
      rootGroup.add(body);

      // Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.65, 16, 1, true), flaskMat);
      neck.position.y = 0.6;
      rootGroup.add(neck);

      // Glowing liquid inside
      const liquid = new THREE.Mesh(
        new THREE.ConeGeometry(0.65, 0.6, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffd60a,
          emissive: 0xff9900,
          emissiveIntensity: 0.7,
          roughness: 0.3,
        })
      );
      liquid.position.y = -0.45;
      rootGroup.add(liquid);
    }

    // 3. MATH: Golden 3D Mathematical Dodecahedron / Calculus Geometry
    else if (type === "math") {
      const mathGeo = new THREE.DodecahedronGeometry(0.85, 0);
      const mathMat = new THREE.MeshStandardMaterial({
        color: 0xffd60a,
        metalness: 0.85,
        roughness: 0.25,
      });
      const mesh = new THREE.Mesh(mathGeo, mathMat);
      rootGroup.add(mesh);

      // Wireframe overlay to emphasize mathematical facets
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
      const wire = new THREE.Mesh(mathGeo, wireMat);
      rootGroup.add(wire);
    }

    // 4. BIOLOGY: 3D Rotating Double Helix DNA
    else if (type === "biology") {
      const strandPoints = 12;
      const sphereMat1 = new THREE.MeshStandardMaterial({ color: 0xffd60a, metalness: 0.7 });
      const sphereMat2 = new THREE.MeshStandardMaterial({ color: 0x4ade80, metalness: 0.7 });
      const rungMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      for (let i = 0; i < strandPoints; i++) {
        const t = (i / strandPoints) * Math.PI * 2;
        const y = (i / strandPoints) * 1.8 - 0.9;
        const radius = 0.55;

        // Strand 1 node
        const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), sphereMat1);
        n1.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
        rootGroup.add(n1);

        // Strand 2 node (opposite)
        const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), sphereMat2);
        n2.position.set(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius);
        rootGroup.add(n2);

        // Connecting rung bar
        if (i % 2 === 0) {
          const rungGeo = new THREE.CylinderGeometry(0.025, 0.025, radius * 2, 6);
          const rung = new THREE.Mesh(rungGeo, rungMat);
          rung.position.set(0, y, 0);
          rung.rotation.z = Math.PI / 2;
          rung.rotation.y = -t;
          rootGroup.add(rung);
        }
      }
    }

    // Render loop
    let animId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      rootGroup.rotation.y += delta * 1.5;
      rootGroup.rotation.x = Math.sin(clock.getElapsedTime()) * 0.2;
      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type]);

  return (
    <div
      ref={mountRef}
      className={`h-[60px] w-[60px] shrink-0 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
