import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  Box,
  Smartphone,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Copy,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import Logo from "@/components/Logo";
import { whatsappLink } from "@/lib/utils";

export const metadata = {
  title: "About & Brand Identity | Matric Mastery",
  description:
    "Learn about Hamza, the 10th-grade founder from Multan, and explore the official Matric Mastery 3D Brand Identity and pure CSS visual system.",
};

const colorSwatches = [
  {
    name: "Deep Canvas",
    hex: "#0A0A0A",
    role: "Base App Background",
    border: "border-white/20",
    textClass: "text-white",
  },
  {
    name: "Kinetic Yellow",
    hex: "#FFD60A",
    role: "Primary 3D Brand Face & Badges",
    border: "border-black",
    textClass: "text-black",
  },
  {
    name: "Tactical Surface",
    hex: "#141414",
    role: "Cards & Section Surfaces",
    border: "border-white/20",
    textClass: "text-white",
  },
  {
    name: "Shadow Ochre",
    hex: "#CCAA00",
    role: "3D Extrusion & Depth Faces",
    border: "border-black",
    textClass: "text-black",
  },
  {
    name: "Pure White",
    hex: "#FFFFFF",
    role: "Primary Headlines & Readability",
    border: "border-black",
    textClass: "text-black",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-site px-4 sm:px-6 py-12 md:py-20">
      {/* =========================================================================
          PART 2: BRAND IDENTITY KIT (At Top of About Page)
          ========================================================================= */}
      <section className="mb-24">
        <header className="mx-auto max-w-3xl text-center sm:text-left">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-1.5 font-heading text-xs font-black tracking-widest text-accent uppercase shadow-[0_0_15px_rgba(255,214,10,0.2)]">
              <Sparkles size={14} className="text-accent" />
              <span>OFFICIAL BRAND SYSTEM</span>
            </div>

            <h1 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Brand Identity &mdash; <span className="text-accent">Matric Mastery 3D</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted font-normal max-w-2xl">
              The isometric 3D visual language, pure CSS rendering physics, and high-contrast
              brutalist token system designed specifically for Punjab Board matric students.
              Engineered to run at a rock-solid 60fps on mobile.
            </p>
          </Reveal>
        </header>

        <div className="mt-12 space-y-10">
          {/* =====================================================================
              CARD A: LOGO VARIATIONS (Including the 200px Centered Showpiece)
              ===================================================================== */}
          <Reveal delay={40}>
            <Card
              tilt={false}
              depth="yellow"
              className="p-6 sm:p-8 md:p-10 border-accent/40 bg-[#121214] shadow-brutalist-yellow"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                  <Box size={20} className="text-accent" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                    MODULE A
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
                    Logo Variations &amp; Isometric Depth
                  </h2>
                </div>
              </div>

              {/* Showpiece: 200px Large Logo Centered on Black Canvas */}
              <div className="mt-8 rounded-2xl border-2 border-white/15 bg-[#0A0A0A] p-8 sm:p-14 text-center shadow-inner relative overflow-hidden">
                {/* Ambient yellow radial spotlight */}
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,214,10,0.18)_0%,transparent_65%)]"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col items-center justify-center">
                  <span className="mb-6 inline-block rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] font-bold text-accent uppercase tracking-wider">
                    Showpiece: 200px Large 3D Icon Block
                  </span>

                  {/* 200px Centered 3D Logo Block */}
                  <div className="py-6 sm:py-10 flex justify-center items-center">
                    <Logo size="200" hideText={true} />
                  </div>

                  <p className="mt-6 max-w-md font-heading text-sm sm:text-base font-bold text-white/90">
                    Pure CSS 3D Block Geometry &bull; Zero External 3D Libraries
                  </p>
                  <p className="mt-1 text-xs text-muted font-mono">
                    Perspective 1000px &bull; Shadow Ochre #CCAA00 Flank &bull; 60fps on Mobile
                  </p>
                </div>
              </div>

              {/* Sub-variations: Black Canvas & Inverted Yellow Canvas */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* On Black Background */}
                <div className="rounded-xl border border-white/15 bg-[#0A0A0A] p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-muted uppercase">
                      Primary Variant &bull; On Dark Canvas (#0A0A0A)
                    </span>
                    <div className="mt-5 py-4 flex items-center justify-center">
                      <Logo size="nav" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted/80 border-t border-white/10 pt-3">
                    Default header, cards, and primary web interfaces.
                  </p>
                </div>

                {/* On Yellow Background (Inverted) */}
                <div className="rounded-xl border-2 border-black bg-[#FFD60A] p-6 flex flex-col justify-between text-black shadow-[4px_4px_0_#000000]">
                  <div>
                    <span className="text-xs font-mono font-black text-black/80 uppercase">
                      Inverted Variant &bull; On Kinetic Yellow (#FFD60A)
                    </span>
                    <div className="mt-5 py-4 flex items-center justify-center">
                      <Logo size="nav" inverted={true} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-black/80 border-t border-black/20 pt-3">
                    Used on special marketing banners, printed stickers, and callouts.
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* =====================================================================
              CARD B: COLOR SYSTEM
              ===================================================================== */}
          <Reveal delay={80}>
            <Card tilt={false} className="p-6 sm:p-8 md:p-10 border-white/10 bg-[#121214]">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <Palette size={20} className="text-accent" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                    MODULE B
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
                    Color Architecture
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {colorSwatches.map((color) => (
                  <div
                    key={color.hex}
                    className="rounded-xl border border-white/10 bg-[#0A0A0A] p-3.5 space-y-3"
                  >
                    <div
                      className={`h-20 w-full rounded-lg border-2 ${color.border} flex items-end p-2.5 shadow-sm`}
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className={`text-[11px] font-mono font-black ${color.textClass}`}>
                        {color.hex}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading text-sm font-bold text-white">
                        {color.name}
                      </h3>
                      <p className="text-[11px] text-muted font-mono mt-0.5">
                        {color.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* =====================================================================
              CARD C: TYPOGRAPHY
              ===================================================================== */}
          <Reveal delay={120}>
            <Card tilt={false} className="p-6 sm:p-8 md:p-10 border-white/10 bg-[#121214]">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <Type size={20} className="text-accent" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                    MODULE C
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
                    Typography Hierarchy
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Space Grotesk */}
                <div className="rounded-xl border border-white/15 bg-[#0A0A0A] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-white text-base">
                      Space Grotesk
                    </span>
                    <span className="rounded bg-accent/20 border border-accent/30 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                      WEIGHT 800 (EXTRA-BOLD)
                    </span>
                  </div>

                  <p className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    Board Strategies, Not Textbook Notes.
                  </p>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 font-heading text-xs text-white/70 space-y-1">
                    <p className="font-bold">ABCDEFGHIJKLM NOPQRSTUVWXYZ</p>
                    <p className="font-bold">abcdefghijklm nopqrstuvwxyz 0123456789</p>
                  </div>

                  <p className="text-xs text-muted leading-relaxed font-sans">
                    Used for brand headers, 3D block lettering, and diagnostic punchlines.
                  </p>
                </div>

                {/* Inter */}
                <div className="rounded-xl border border-white/15 bg-[#0A0A0A] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-white text-base">
                      Inter
                    </span>
                    <span className="rounded bg-white/10 border border-white/15 px-2 py-0.5 text-[10px] font-mono text-white/90">
                      WEIGHT 400 &bull; 500 &bull; 600
                    </span>
                  </div>

                  <p className="font-sans text-sm sm:text-base text-muted/95 leading-[1.8]">
                    Practical strategies for preparing smarter, writing cleaner papers, and
                    handling exam day without turning your brain into a microwave.
                  </p>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 font-sans text-xs text-white/70 space-y-1">
                    <p>The quick brown fox jumps over the lazy dog.</p>
                    <p>Mathematical fractions, numerical units (N, J, W, m/s²), and steps.</p>
                  </div>

                  <p className="text-xs text-muted leading-relaxed font-sans">
                    Engineered for high editorial legibility and Pakistani matric exam analysis.
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* =====================================================================
              CARD D: 3D RULES & GPU PERFORMANCE
              ===================================================================== */}
          <Reveal delay={160}>
            <Card tilt={false} depth="yellow" className="p-6 sm:p-8 md:p-10 border-accent/30 bg-[#121214]">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/40 bg-accent/15">
                  <Layers size={20} className="text-accent" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                    MODULE D
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
                    3D Isometric Rules &amp; Performance Law
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4 space-y-1.5">
                  <div className="font-heading font-black text-accent text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 1. Perspective 1000px
                  </div>
                  <p className="text-muted leading-relaxed">
                    Always anchor parent containers with <code>perspective: 1000px</code> and{" "}
                    <code>transform-style: preserve-3d</code> for authentic physical camera depth.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4 space-y-1.5">
                  <div className="font-heading font-black text-accent text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 2. Hard Brutalist Shadow
                  </div>
                  <p className="text-muted leading-relaxed">
                    Use hard offsets (<code>6px 6px 0px #000000</code>) coupled with warm kinetic yellow
                    aura glows (<code>0 0 40px rgba(255,214,10,0.5)</code>).
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4 space-y-1.5">
                  <div className="font-heading font-black text-accent text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 3. Mobile-First GPU Rule
                  </div>
                  <p className="text-muted leading-relaxed">
                    Disable continuous rotation animations on mobile viewports. Retain <code>translateZ</code>{" "}
                    elevations only to guarantee 60fps on budget devices.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4 space-y-1.5">
                  <div className="font-heading font-black text-accent text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 4. Rounded 10px&ndash;16px
                  </div>
                  <p className="text-muted leading-relaxed">
                    Maintain friendly physical toy block corners (8px&ndash;10px for nav, 28px&ndash;34px
                    for large 200px displays). Never sharp 90&deg; cutouts.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4 space-y-1.5">
                  <div className="font-heading font-black text-accent text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 5. Physical Tap Response
                  </div>
                  <p className="text-muted leading-relaxed">
                    Interactive buttons and logos must depress on active (<code>active:scale-95</code> and{" "}
                    <code>translateZ(5px)</code>) simulating real mechanical switches.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4 space-y-1.5">
                  <div className="font-heading font-black text-accent text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 6. Dual-Side Extrusions
                  </div>
                  <p className="text-muted leading-relaxed">
                    Construct right side with <code>#CCAA00</code> (skewY 45&deg;) and bottom side with{" "}
                    <code>#997F00</code> (skewX 45&deg;) for consistent sunlit geometry.
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* =====================================================================
              CARD E: USAGE APPLICATIONS
              ===================================================================== */}
          <Reveal delay={200}>
            <Card tilt={false} className="p-6 sm:p-8 md:p-10 border-white/10 bg-[#121214]">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <Smartphone size={20} className="text-accent" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                    MODULE E
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
                    Touchpoint Applications
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. WhatsApp DP */}
                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-5 text-center flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full border-2 border-accent bg-[#0A0A0A] flex items-center justify-center shadow-brutalist-yellow">
                    <Logo size="sm" hideText={true} />
                  </div>
                  <h3 className="mt-4 font-heading font-bold text-white text-sm">
                    WhatsApp DP
                  </h3>
                  <p className="mt-1 text-[11px] text-muted font-mono">
                    Circular 1:1 format for student helpline
                  </p>
                </div>

                {/* 2. Favicon */}
                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-5 text-center flex flex-col items-center">
                  <div className="h-16 w-16 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-lg bg-[#FFD60A] border-2 border-black flex items-center justify-center font-heading font-black text-black text-xs shadow-sm">
                      M
                    </div>
                  </div>
                  <h3 className="mt-4 font-heading font-bold text-white text-sm">
                    Browser Favicon
                  </h3>
                  <p className="mt-1 text-[11px] text-muted font-mono">
                    32x32px high-visibility tab icon
                  </p>
                </div>

                {/* 3. Merchandise / T-Shirt */}
                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-5 text-center flex flex-col items-center">
                  <div className="h-20 w-full rounded-xl border border-white/10 bg-[#161618] flex items-center justify-center px-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-black">
                      <span className="h-3.5 w-3.5 rounded bg-[#FFD60A] border border-black flex items-center justify-center text-[8px] font-black text-black">
                        M
                      </span>
                      <span className="font-heading text-[10px] font-bold text-white tracking-wider">
                        MATRIC MASTERY
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-4 font-heading font-bold text-white text-sm">
                    Merch &amp; Apparel
                  </h3>
                  <p className="mt-1 text-[11px] text-muted font-mono">
                    Chest print for topper community wear
                  </p>
                </div>

                {/* 4. Social Thumbnail */}
                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-5 text-center flex flex-col items-center">
                  <div className="h-20 w-full rounded-xl border border-white/10 bg-gradient-to-tr from-black via-[#141416] to-[#252528] flex items-center justify-between px-3">
                    <Logo size="sm" hideText={true} />
                    <span className="text-[9px] font-mono text-accent font-bold">
                      BISE MULTAN
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading font-bold text-white text-sm">
                    Social &amp; YouTube
                  </h3>
                  <p className="mt-1 text-[11px] text-muted font-mono">
                    16:9 watermarks and stream badges
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          FOUNDER STORY: HEY, I AM HAMZA
          ========================================================================= */}
      <div className="border-t border-white/10 pt-16 md:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="font-heading text-xs font-black uppercase tracking-[0.15em] text-accent">
              THE CREATOR
            </p>
            <h2 className="mt-3 font-heading type-title text-white">
              Hey, I am Hamza.
            </h2>
            <p className="mt-6 leading-relaxed text-muted">
              I am a 10th grader from Multan, sitting the same Punjab Board
              papers you are. Not a teacher, not an academy owner, not anyone
              with a course to sell you.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Matric Mastery started because I kept noticing the same pattern:
              students who knew the content just as well as the toppers were
              still scoring lower, purely because of how their papers looked
              and how their time was managed on the day.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              My mission with this website is simple. Take everything I
              figured out the hard way, comparing checked papers, asking
              annoying questions to seniors, and messing up my own first
              attempts, and hand it to you before your paper instead of after.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-soft">
              <Image
                src="https://picsum.photos/seed/matric-about/700/800"
                alt="A student at a classroom desk in Multan"
                width={700}
                height={800}
                className="h-full w-full object-cover grayscale-[15%] contrast-[1.05]"
              />
            </div>
          </Reveal>
        </div>

        {/* Have a Doubt Contact Form */}
        <Reveal delay={80}>
          <Card shimmer tilt={false} depth="yellow" className="mt-20 p-7 md:p-12 border-accent/40 bg-[#121214] shadow-brutalist-yellow">
            <h3 className="font-heading text-2xl font-extrabold text-white md:text-3xl">Have a Doubt?</h3>
            <p className="mt-2 max-w-md text-muted">
              Send it across and it goes straight to my official WhatsApp (+92 308 4703973). I read
              everything myself.
            </p>
            <ContactForm />
          </Card>
        </Reveal>

        {/* WhatsApp Direct CTA */}
        <Reveal>
          <div className="mt-16 rounded-3xl border border-white/10 card-surface p-10 text-center shadow-soft">
            <p className="font-heading text-xl font-bold text-white md:text-2xl">
              Still stuck on something? Just message me directly.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href={whatsappLink()} variant="primary">
                Chat On WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
