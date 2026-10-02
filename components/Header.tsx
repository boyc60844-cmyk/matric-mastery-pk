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

export default function Header() {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled && !mobileMenuOpen
            ? "bg-[#0A0A0A]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.6)] border-b border-white/10 py-1.5"
            : "bg-transparent border-b border-transparent py-2.5"
        }`}
      >
        <div className="mx-auto flex h-[62px] sm:h-[66px] max-w-site items-center justify-between px-3 sm:px-6 gap-2">
          {/* 1. 3D Isometric Block Logo */}
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

          {/* Right Header Controls: Always has ENG/اردو toggle, User XP Login/Avatar, and Hamburger Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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

            {/* 4. Hamburger Menu Button (ALWAYS PRESENT) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#141416] text-white transition-all hover:border-accent hover:text-accent active:scale-95 cursor-pointer shrink-0"
            >
              <span className="sr-only">Toggle Menu</span>
              <div className="flex flex-col items-center justify-center gap-1">
                <span
                  className={`h-0.5 w-4 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "translate-y-1.5 rotate-45 bg-accent" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-4 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-4 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "-translate-y-1.5 -rotate-45 bg-accent" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Synchronized 11-page Hamburger Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[#0A0A0A]/98 backdrop-blur-xl pt-[76px] pb-10"
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

                {/* Navigation Links - ALL 11 Pages Identical to Footer */}
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
                    {isRTL ? "تمام صفحات" : "All Pages (11)"}
                  </span>
                </div>
                <nav className="space-y-1">
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
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-heading font-bold transition-all ${
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
                      </Link>
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
              <div className="mt-6 border-t border-white/10 pt-3.5 space-y-2">
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
        )}
      </AnimatePresence>
    </>
  );
}
