import * as THREE from "three";

export type RendererType = "webgpu" | "webgl";

export interface AdaptiveRendererResult {
  renderer: THREE.WebGLRenderer | any;
  type: RendererType;
}

export async function createAdaptiveRenderer(
  canvas: HTMLCanvasElement,
  options: {
    alpha?: boolean;
    antialias?: boolean;
    powerPreference?: "high-performance" | "low-power";
  } = {}
): Promise<AdaptiveRendererResult> {
  const { alpha = true, antialias = true, powerPreference = "high-performance" } = options;

  // 1. Try WebGPU first if supported by browser
  if (typeof navigator !== "undefined" && "gpu" in navigator) {
    try {
      const { WebGPURenderer } = await import("three/webgpu");
      const gpuRenderer = new WebGPURenderer({
        canvas,
        alpha,
        antialias,
        powerPreference,
      });
      await gpuRenderer.init();
      return { renderer: gpuRenderer, type: "webgpu" };
    } catch (e) {
      console.warn("WebGPU initialization fell back to WebGL:", e);
    }
  }

  // 2. High performance WebGL fallback
  const webglRenderer = new THREE.WebGLRenderer({
    canvas,
    alpha,
    antialias,
    powerPreference,
  });
  webglRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  webglRenderer.toneMappingExposure = 1.08;

  return { renderer: webglRenderer, type: "webgl" };
}

export interface DeviceQuality {
  tier: "high" | "medium" | "low";
  maxDPR: number;
  particlesCount: number;
  enablePostprocessing: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
}

export function detectDeviceQuality(): DeviceQuality {
  if (typeof window === "undefined") {
    return {
      tier: "high",
      maxDPR: 1.5,
      particlesCount: 35000,
      enablePostprocessing: true,
      isMobile: false,
      reducedMotion: false,
    };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const memory = (navigator as any).deviceMemory || 8;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  if (reducedMotion) {
    return {
      tier: "low",
      maxDPR: 1,
      particlesCount: 1200,
      enablePostprocessing: false,
      isMobile,
      reducedMotion: true,
    };
  }

  if (isMobile || memory < 4 || hardwareConcurrency < 4) {
    return {
      tier: "low",
      maxDPR: 1.25,
      particlesCount: isMobile ? 3800 : 7000,
      enablePostprocessing: false,
      isMobile,
      reducedMotion: false,
    };
  }

  if (isTablet || memory < 8 || hardwareConcurrency < 8) {
    return {
      tier: "medium",
      maxDPR: 1.5,
      particlesCount: 18000,
      enablePostprocessing: true,
      isMobile: false,
      reducedMotion: false,
    };
  }

  return {
    tier: "high",
    maxDPR: 2,
    particlesCount: 45000,
    enablePostprocessing: true,
    isMobile: false,
    reducedMotion: false,
  };
}
