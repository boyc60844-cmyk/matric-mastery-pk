"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "@/src/context/RouterContext";
import { ArrowUpRight, BookOpen, Sparkles, MessageCircle, Tag, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { whatsappLink } from "@/lib/utils";
import Button from "./Button";
import Logo from "./Logo";

const navLinks = [
  { href: "/my-story", label: "Start Here" },
  { href: "/strategies", label: "Strategies", badge: "30+" },
  { href: "/mock-tests", label: "Mock Tests", badge: "New" },
  { href: "/past-papers", label: "Past Papers" },
  { href: "/resources", label: "Resources" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

const mobileQuickTags = [
  "Math",
  "Presentation",
  "Diagrams",
  "Numericals",
  "Exam Hacks",
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock <html> and <body> overflow while mobile menu is open
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

  // Close mobile menu on page navigation
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
        <div className="mx-auto flex h-[62px] sm:h-[66px] max-w-site items-center justify-between px-4 sm:px-6">
          {/* 3D Isometric Block Logo */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-[1.02] select-none group focus:outline-none"
            title="Matric Mastery Home"
          >
            <Logo size="nav" />
          </Link>

          {/* Desktop Nav - lg and up: Refined Floating Spatial Pill */}
          <nav
            aria-label="Desktop Navigation"
            className="hidden items-center gap-1 xl:gap-1.5 rounded-full border border-white/10 bg-[#121214]/90 px-2.5 py-1.5 backdrop-blur-md lg:flex shadow-soft"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-full px-3 xl:px-3.5 py-1.5 text-xs xl:text-[13px] font-heading font-bold transition-all duration-200 select-none ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/40 shadow-[0_0_14px_rgba(255,214,10,0.18)]"
                      : "text-muted hover:text-white hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow shrink-0 animate-pulse" />
                  )}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-black ${
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

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href={whatsappLink()}
              variant="whatsapp"
              className="text-xs !py-2 !px-4"
            >
              <MessageCircle size={14} className="text-emerald-400" />
              <span>Join WhatsApp</span>
            </Button>
          </div>

          {/* Mobile Actions: Fast Search + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/strategies"
              className="flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-[#141416] px-3 text-xs font-heading font-bold text-muted hover:text-accent hover:border-accent/40 transition-colors"
              title="Search Playbooks"
            >
              <Search size={14} className="text-accent" />
              <span className="hidden xs:inline">Search</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#141416] text-white transition-all hover:border-accent active:scale-95 cursor-pointer"
            >
              <span
                className={`h-0.5 w-5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "translate-y-2 rotate-45 bg-accent" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "-translate-y-2 -rotate-45 bg-accent" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Upgraded Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[#0A0A0A]/98 backdrop-blur-xl pt-[76px] pb-10 lg:hidden"
          >
            <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-lg flex-col justify-between px-5">
              <div>
                {/* Mobile Quick Featured Callout */}
                <div className="mb-5 rounded-2xl border border-accent/30 bg-[#121214] p-4 shadow-brutalist-yellow">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-heading font-black text-accent uppercase tracking-wider">
                      <Sparkles size={13} /> EXAM STRATEGY PLAYBOOK
                    </span>
                    <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-heading font-black text-black">
                      30+ GUIDES
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Proven Punjab Board techniques for Math, Science, and English papers.
                  </p>
                  <Link
                    href="/strategies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-3 flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-heading font-bold text-white hover:text-accent transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen size={14} className="text-accent" />
                      Browse All 30+ Guides
                    </span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>

                {/* Mobile Quick Tag Filter Strip */}
                <div className="mb-5 rounded-xl border border-white/10 bg-[#121214] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-heading font-black uppercase tracking-wider text-muted/70 mb-2">
                    <Tag size={12} className="text-accent" /> Quick Tag Filters:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mobileQuickTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/strategies?tag=${encodeURIComponent(tag)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg border border-white/10 bg-[#161619] px-2.5 py-1 text-xs font-heading font-bold text-white/90 hover:border-accent hover:text-accent transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Navigation Items */}
                <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
                  {navLinks.map((link, index) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.02 + index * 0.03,
                          duration: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 font-heading text-base font-bold tracking-tight transition-all ${
                            isActive
                              ? "border-l-4 border-l-accent bg-accent/10 text-accent shadow-sm pl-3.5"
                              : "text-white/90 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span>{link.label}</span>
                            {link.badge && (
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                                  isActive
                                    ? "bg-accent text-black font-black"
                                    : "bg-accent/20 border border-accent/30 text-accent font-bold"
                                }`}
                              >
                                {link.badge}
                              </span>
                            )}
                          </div>
                          <ArrowUpRight
                            size={16}
                            className={isActive ? "text-accent" : "text-muted/60"}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.22 }}
                className="mt-6 border-t border-white/10 pt-5 space-y-3"
              >
                <Button
                  href={whatsappLink()}
                  variant="whatsapp"
                  className="w-full !py-3.5 text-base justify-center shadow-glow"
                >
                  <MessageCircle size={18} className="text-white" />
                  <span>Join Student WhatsApp Group</span>
                </Button>
                <p className="text-center text-xs text-muted font-mono">
                  Built by a 10th Grader from Multan &bull; 100% Free
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
