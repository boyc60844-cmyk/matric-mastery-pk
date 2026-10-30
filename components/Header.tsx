/* ==========================================================================
   PROTECTED HEADER COMPONENT - DO NOT OVERWRITE OR REMOVE
   Requirements:
   1. Logo (left)
   2. ENG/اردو Language toggle
   3. User XP Login / Avatar button (Firebase Auth)
   4. Hamburger menu toggle (ALWAYS visible)
   ========================================================================== */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "@/src/context/RouterContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { ArrowUpRight, BookOpen, Sparkles, MessageCircle, Tag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { whatsappLink } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";
import Button from "./Button";
import Logo from "./Logo";
import AuthButton from "./AuthButton";
import LanguageToggle from "./LanguageToggle";

// Easing curve: consistent spring-style overshoot easing across all open layers
const SPRING_EASE = [0.34, 1.56, 0.64, 1] as const;
// Fast and smooth exit curve for close
const EXIT_EASE = [0.22, 1, 0.36, 1] as const;

export default function Header() {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supportsBackdrop, setSupportsBackdrop] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Check backdrop-filter support
  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported =
      typeof CSS !== "undefined" &&
      CSS.supports &&
      (CSS.supports("backdrop-filter", "blur(1px)") ||
        CSS.supports("-webkit-backdrop-filter", "blur(1px)"));
    setSupportsBackdrop(Boolean(supported));
  }, []);

  const mobileQuickTags = [
    "Math",
    "Presentation",
    "Diagrams",
    "Numericals",
    "Exam Hacks",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock <html> and <body> overflow while mobile/drawer menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-mobile-menu", "open");
      window.dispatchEvent(new CustomEvent("mm:menu-toggle", { detail: { open: true } }));
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.removeAttribute("data-mobile-menu");
      window.dispatchEvent(new CustomEvent("mm:menu-toggle", { detail: { open: false } }));
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.removeAttribute("data-mobile-menu");
      window.dispatchEvent(new CustomEvent("mm:menu-toggle", { detail: { open: false } }));
    };
  }, [mobileMenuOpen]);

  // Close menu on page navigation or Escape key
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
          scrolled || mobileMenuOpen
            ? "bg-[#0A0A0A]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.6)] border-white/10"
            : "bg-[#0A0A0A]/85 backdrop-blur-sm border-white/5"
        }`}
      >
        <div className="mx-auto flex h-[58px] sm:h-[66px] max-w-site items-center justify-between px-4 sm:px-6">
          {/* 1. 3D Isometric Block Logo with full text on all screen sizes */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-[1.02] select-none group focus:outline-none shrink-0"
            title="Matric Mastery Home"
          >
            <Logo size="nav" />
          </Link>

          {/* Desktop Nav - Synchronized 11-page Navigation (visible on large screens) */}
          <nav
            aria-label="Desktop Navigation"
            className="hidden xl:flex items-center gap-0.5 2xl:gap-1 rounded-full border border-white/10 bg-[#121214]/90 px-2 py-1 backdrop-blur-md shadow-soft"
          >
            {MAIN_NAV_ITEMS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const label = t(link.labelKey, link.defaultLabel);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1 rounded-full px-2 2xl:px-2.5 py-1 text-[11px] 2xl:text-xs font-heading font-bold transition-all duration-150 select-none whitespace-nowrap ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/40 shadow-[0_0_12px_rgba(255,214,10,0.18)]"
                      : "text-muted hover:text-white hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow shrink-0 animate-pulse" />
                  )}
                  <span>{label}</span>
                  {link.badge && (
                    <span
                      className={`rounded px-1 py-0.2 text-[8px] 2xl:text-[9px] font-mono font-black ${
                        isActive
                          ? "bg-accent text-black"
                          : "bg-accent/20 text-accent border border-accent/30"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Desktop & Tablet items: Language toggle, User XP Login, WhatsApp (hidden on mobile phones to keep header clean) */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
              {/* 2. ENG/اردو Language Toggle */}
              <LanguageToggle variant="compact" />

              {/* 3. User XP Login / Avatar Button (Google Firebase Auth) */}
              <AuthButton />

              {/* WhatsApp Community Button (on medium+ screens) */}
              <div className="hidden md:flex">
                <Button
                  href={whatsappLink()}
                  variant="whatsapp"
                  className="text-xs !py-1.5 !px-2.5"
                >
                  <MessageCircle size={13} className="text-emerald-400" />
                  <span className="hidden xl:inline">WhatsApp</span>
                </Button>
              </div>
            </div>

            {/* 4. Hamburger Menu Button with Multi-Line Spring Morph into X (Comfortable 44px tap target on mobile) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0 items-center justify-center rounded-xl border border-white/10 bg-[#141416] text-white transition-colors hover:border-accent hover:text-accent active:scale-95 cursor-pointer shrink-0"
            >
              <span className="sr-only">Toggle Menu</span>
              <div className="relative flex h-4 w-4 items-center justify-center pointer-events-none">
                {/* Top Line */}
                <motion.span
                  className="absolute h-0.5 w-4 rounded-full"
                  initial={false}
                  animate={
                    prefersReducedMotion
                      ? {
                          y: mobileMenuOpen ? 0 : -5,
                          rotate: 0,
                          opacity: 1,
                          backgroundColor: mobileMenuOpen ? "#FFD60A" : "#FFFFFF",
                        }
                      : {
                          y: mobileMenuOpen ? 0 : -5,
                          rotate: mobileMenuOpen ? 45 : 0,
                          opacity: 1,
                          backgroundColor: mobileMenuOpen ? "#FFD60A" : "#FFFFFF",
                        }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.2 : 0.3,
                    ease: prefersReducedMotion ? "linear" : SPRING_EASE,
                  }}
                />
                {/* Middle Line */}
                <motion.span
                  className="absolute h-0.5 w-4 rounded-full bg-white"
                  initial={false}
                  animate={
                    prefersReducedMotion
                      ? {
                          opacity: mobileMenuOpen ? 0 : 1,
                          scaleX: 1,
                        }
                      : {
                          opacity: mobileMenuOpen ? 0 : 1,
                          scaleX: mobileMenuOpen ? 0 : 1,
                        }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.2 : 0.3,
                    ease: prefersReducedMotion ? "linear" : SPRING_EASE,
                  }}
                />
                {/* Bottom Line */}
                <motion.span
                  className="absolute h-0.5 w-4 rounded-full"
                  initial={false}
                  animate={
                    prefersReducedMotion
                      ? {
                          y: mobileMenuOpen ? 0 : 5,
                          rotate: 0,
                          opacity: 1,
                          backgroundColor: mobileMenuOpen ? "#FFD60A" : "#FFFFFF",
                        }
                      : {
                          y: mobileMenuOpen ? 0 : 5,
                          rotate: mobileMenuOpen ? -45 : 0,
                          opacity: 1,
                          backgroundColor: mobileMenuOpen ? "#FFD60A" : "#FFFFFF",
                        }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.2 : 0.3,
                    ease: prefersReducedMotion ? "linear" : SPRING_EASE,
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Slim Mobile Utility Strip (Phones only, non-sticky, scrolls away with page) */}
      <div
        className="sm:hidden w-full border-b border-white/10 bg-[#0C0C0E]/95 py-1.5 px-4"
        aria-label="Mobile Quick Utilities"
      >
        <div className="mx-auto flex items-center justify-between gap-2 max-w-site">
          {/* Language Toggle: ENG / اردو */}
          <div className="shrink-0">
            <LanguageToggle variant="compact" />
          </div>

          {/* User XP Login & WhatsApp */}
          <div className="flex items-center gap-2 shrink-0">
            <AuthButton />
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Community"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#141416] text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-colors shrink-0"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Synchronized Multi-Layer Drawer Menu with Coordinated Staged Sequence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-root"
            className="fixed inset-0 z-40 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.35 }}
          >
            {/* Layer 1 — Backdrop Overlay (starts immediately, fades + gains 12px blur, closes last) */}
            <motion.div
              key="backdrop-overlay"
              initial={{
                opacity: 0,
                backdropFilter: "blur(0px)",
              }}
              animate={{
                opacity: 1,
                backdropFilter: supportsBackdrop && !prefersReducedMotion ? "blur(12px)" : "blur(0px)",
                transition: prefersReducedMotion
                  ? { duration: 0.2, ease: "linear" }
                  : { duration: 0.3, ease: SPRING_EASE },
              }}
              exit={{
                opacity: 0,
                backdropFilter: "blur(0px)",
                transition: prefersReducedMotion
                  ? { duration: 0.2, ease: "linear" }
                  : { duration: 0.25, delay: 0.1, ease: EXIT_EASE },
              }}
              onClick={() => setMobileMenuOpen(false)}
              className={`absolute inset-0 cursor-pointer ${
                supportsBackdrop && !prefersReducedMotion
                  ? "bg-[#0A0A0A]/85"
                  : "bg-[#0A0A0A]/96"
              }`}
            />

            {/* Layer 2 — Menu panel (starts ~50ms after backdrop, scales 96% to 100% with spring overshoot) */}
            <motion.div
              key="menu-panel-container"
              initial={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: prefersReducedMotion
                  ? { duration: 0.2, ease: "linear" }
                  : {
                      duration: 0.35,
                      delay: 0.05,
                      ease: SPRING_EASE,
                    },
              }}
              exit={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.96,
                transition: prefersReducedMotion
                  ? { duration: 0.2, ease: "linear" }
                  : {
                      duration: 0.2,
                      delay: 0.05,
                      ease: EXIT_EASE,
                    },
              }}
              style={{ transformOrigin: "top center" }}
              className="relative z-10 h-full w-full overflow-y-auto pt-[64px] sm:pt-[76px] pb-[calc(env(safe-area-inset-bottom,24px)+100px)] pointer-events-auto overscroll-contain"
            >
              <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-lg flex-col justify-between px-5">
                <div>
                  {/* Language Switcher in Drawer */}
                  <div className="mb-3">
                    <LanguageToggle variant="drawer" />
                  </div>

                  {/* Cloud Sync & Auth Banner */}
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/15 bg-[#141418] p-3.5 shadow-md">
                    <div>
                      <p className="text-xs font-heading font-black text-white">
                        {t("auth.badge", "Student Cloud Sync")}
                      </p>
                      <p className="text-[11px] text-muted">
                        {isRTL ? "ایکس پی اور اسٹریکس محفوظ کریں" : "Save XP, Streaks & Mistakes"}
                      </p>
                    </div>
                    <AuthButton />
                  </div>

                  {/* Mobile Quick Featured Callout */}
                  <div className="mb-4 rounded-2xl border border-accent/30 bg-[#121214] p-3.5 shadow-brutalist-yellow">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-heading font-black text-accent uppercase tracking-wider text-[11px]">
                        <Sparkles size={12} /> {t("nav.strategies", "EXAM STRATEGY PLAYBOOK")}
                      </span>
                      <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-heading font-black text-black">
                        30+ GUIDES
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted leading-relaxed">
                      {isRTL
                        ? "ریاضی، سائنس اور انگلش پرچوں کے لیے پنجاب بورڈ ٹاپرز کی آزمودہ تکنیکس۔"
                        : "Proven Punjab Board techniques for Math, Science, and English papers."}
                    </p>
                    <Link
                      href="/strategies"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-2.5 flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-heading font-bold text-white hover:text-accent transition-colors"
                    >
                      <span className="flex items-center gap-2 text-[11px]">
                        <BookOpen size={13} className="text-accent" />
                        {isRTL ? "تمام 30+ رہنما اصول دیکھیں" : "Browse All 30+ Guides"}
                      </span>
                      <ArrowUpRight size={13} className="text-muted" />
                    </Link>
                  </div>

                  {/* Navigation Links - Synchronized with Header & Footer */}
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
                      {isRTL ? "تمام صفحات" : `All Pages (${MAIN_NAV_ITEMS.length})`}
                    </span>
                  </div>

                  {/* Layer 3 & Layer 4: Links with 3D Flip Stagger and Drawing Accent Underlines */}
                  <nav
                    className="space-y-1"
                    style={{ perspective: "1000px" }}
                  >
                    {MAIN_NAV_ITEMS.map((link, index) => {
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href);
                      const label = t(link.labelKey, link.defaultLabel);

                      // Open: starts ~150ms after panel begins (0.05 + 0.15 = 0.20s), staggered by ~75ms
                      const linkOpenDelay = 0.20 + index * 0.075;
                      // Underline draws right as each link finishes animating in (~0.30s later)
                      const underlineOpenDelay = linkOpenDelay + 0.28;

                      return (
                        <motion.div
                          key={link.href}
                          initial={{
                            opacity: 0,
                            y: prefersReducedMotion ? 0 : 20,
                            rotateX: prefersReducedMotion ? 0 : 15,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            transition: prefersReducedMotion
                              ? { duration: 0.2, ease: "linear" }
                              : {
                                  duration: 0.35,
                                  delay: linkOpenDelay,
                                  ease: SPRING_EASE,
                                },
                          }}
                          exit={{
                            opacity: 0,
                            y: prefersReducedMotion ? 0 : -6,
                            transition: prefersReducedMotion
                              ? { duration: 0.2, ease: "linear" }
                              : {
                                  duration: 0.15,
                                  delay: 0,
                                  ease: EXIT_EASE,
                                },
                          }}
                          style={{
                            transformStyle: "preserve-3d",
                            transformOrigin: "center top",
                          }}
                          className="relative"
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-heading font-bold overflow-hidden transition-colors ${
                              isActive
                                ? "bg-accent text-black shadow-glow"
                                : "bg-[#141416] text-white hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {isActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                              )}
                              <span>{label}</span>
                            </div>
                            {link.badge && (
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-black ${
                                  isActive
                                    ? "bg-black text-accent"
                                    : "bg-accent/20 text-accent"
                                }`}
                              >
                                {link.badge}
                              </span>
                            )}

                            {/* Layer 4 — Accent Underline per link: draws 0% to 100% over ~200ms in accent color */}
                            {!prefersReducedMotion && (
                              <motion.span
                                initial={{ scaleX: 0, opacity: 1 }}
                                animate={{
                                  scaleX: 1,
                                  opacity: 1,
                                  transition: {
                                    duration: 0.2,
                                    delay: underlineOpenDelay,
                                    ease: SPRING_EASE,
                                  },
                                }}
                                exit={{
                                  opacity: 0,
                                  transition: {
                                    duration: 0.1,
                                    delay: 0,
                                  },
                                }}
                                style={{
                                  originX: isRTL ? 1 : 0,
                                }}
                                className={`absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none ${
                                  isActive ? "bg-black/75" : "bg-accent"
                                }`}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Quick Topic Chips */}
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                      <Tag size={11} className="text-accent" />
                      <span>{isRTL ? "مقبول مضامین" : "Popular Topics"}</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {mobileQuickTags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/strategies?q=${encodeURIComponent(tag.toLowerCase())}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-lg border border-white/10 bg-[#16161a] px-2 py-0.5 text-[10px] font-heading font-medium text-white/80 hover:border-accent hover:text-accent transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Drawer Footer CTAs */}
                <div className="mt-8 border-t border-white/10 pt-4 pb-10 space-y-2.5">
                  <Button
                    href={whatsappLink()}
                    variant="whatsapp"
                    className="w-full !py-2.5 text-xs font-heading font-black shadow-md justify-center"
                  >
                    <MessageCircle size={15} className="text-emerald-400" />
                    <span>{isRTL ? "واٹس ایپ گروپ میں شامل ہوں" : "Join Free WhatsApp Group"}</span>
                  </Button>
                  <p className="text-center font-mono text-[9px] text-muted">
                    {t("common.boardNotice")}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
