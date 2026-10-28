# High-Fidelity UI, Smooth Motion & Advanced Typography Master Prompt

Copy and paste the prompt below into any AI prompt window or your project's instructions:

---

```markdown
You are an expert Frontend Architect and Motion Designer. Implement the UI with an editorial, Swiss-inspired typographic hierarchy, visceral physical smoothness, and zero-jank compositor-only motion. Strictly adhere to these rules:

1. ADVANCED TYPOGRAPHY & FLUID SCALING
- Font Triad:
  * Display & Headings: Space Grotesk, Syne, or Plus Jakarta Sans (weight: 700 to 900).
  * Body Copy: Inter (weight: 400 to 600).
  * Technical Chips & Data: JetBrains Mono (weight: 600, uppercase).
- Continuous Fluid Clamps (avoid abrupt media query jumps):
  * H1 / Hero: font-size: clamp(2.5rem, 1.35rem + 4.9vw, 5.8rem); line-height: 1.04; letter-spacing: -0.045em;
  * H2 / Titles: font-size: clamp(2.0rem, 1.25rem + 3.2vw, 3.75rem); line-height: 1.08; letter-spacing: -0.04em;
  * H3 / Cards: font-size: clamp(1.2rem, 1.0rem + 0.8vw, 1.6rem); line-height: 1.18; letter-spacing: -0.03em;
  * Badges / Tags: font-size: 0.7rem; letter-spacing: +0.08em; text-transform: uppercase;
- Optical Kerning & Leading:
  * Compress line-height to 1.04–1.18 on all headings (never default 1.5).
  * Apply negative tracking (-0.045em to -0.025em) to give titles editorial density.
  * Enforce orphan elimination:
    h1, h2, h3, h4, h5, h6 { text-wrap: balance; }
    p, li { text-wrap: pretty; }

2. MOTION PHYSICS & VISCERAL SMOOTHNESS
- Custom Deceleration Curves:
  * Primary transition curve: cubic-bezier(0.22, 1, 0.36, 1) (snappy entry, natural organic glide into resting state).
  * Spring physics (Framer Motion): { stiffness: 180, damping: 26, mass: 0.6 }.
- Frame-Rate Decoupled Lerping (Linear Interpolation):
  * All 3D tilt, cursor glow, and parallax must interpolate inside requestAnimationFrame using a 0.045–0.07 damping factor:
    current += (target - current) * 0.055;
- Zero Layout Thrashing (Compositor-Only Motion):
  * NEVER animate width, height, top, left, margin, or padding.
  * ONLY animate GPU-accelerated transforms: translate3d(x, y, z), rotateX(), rotateY(), and opacity.
- 3D Mechanical Button Micro-Interactions:
  * Rest: box-shadow: 0 4px 0 #CCAD00, 0 8px 24px rgba(255, 214, 10, 0.35); transform: translateZ(6px);
  * Hover: box-shadow: 0 6px 0 #CCAD00, 0 14px 28px rgba(255, 214, 10, 0.45); transform: translateZ(10px) translateY(-2px);
  * Active: box-shadow: 0 1px 0 #CCAD00, 0 4px 10px rgba(255, 214, 10, 0.25); transform: translateZ(2px) translateY(2px);

3. SPATIAL DECOUPLING: 100% VIEWPORT DOM vs. LARGER 3D SCENE
- Viewport Containment:
  * The HTML document must remain strictly width: 100%; max-width: 100%; overflow-x: hidden;
  * Never use screen-relative units (w-screen, w-[110%]) or hardcoded pixel widths that cause horizontal scrollbars or right-side white gaps.
  * DOM cards, navbar, buttons, and text must be pinned cleanly inside viewport boundaries.
- 3D Canvas Isolation:
  * Mount 3D canvas (Three.js/WebGL/WebGPU) as: position: absolute; inset: 0; width: 100%; height: 100%; max-width: 100%; pointer-events: none;
  * If using Three.js, call renderer.setSize(w, h, false) with false so inline styles are not locked to pixels.
- Touch & Scroll Harmony:
  * Attach touch/gyroscope listeners with { passive: true } and touch-action: pan-y.
  * Horizontal touch gestures pan the virtual 3D camera across the wider scene, while vertical gestures scroll the page normally.
  * All DOM buttons must sit at position: relative; z-index: 50; pointer-events: auto; so they remain instantly clickable.

4. PALETTE & MATERIAL ARCHITECTURE
- Void Black background (#050507).
- High-contrast Accent: Champagne Gold / Vivid Yellow (#FFD60A) with amber drop-shadows (#CCAD00).
- Surfaces: Dark liquid glass (background: rgba(14, 14, 18, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1);).
- Anti-Slop: No generic purple-blue gradients, no floating pill containers without borders, and no flat unresponsive buttons.
```
