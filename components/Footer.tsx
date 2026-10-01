"use client";

import Link from "next/link";
import { whatsappLink } from "@/lib/utils";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Footer() {
  const { t, isRTL } = useLanguage();

  const links = [
    { href: "/", label: t("nav.home", "Home") },
    { href: "/my-story", label: t("nav.myStory", "Start Here") },
    { href: "/strategies", label: t("nav.strategies", "Strategies") },
    { href: "/mock-tests", label: t("nav.mockTests", "Mock Tests") },
    { href: "/past-papers", label: t("nav.pastPapers", "Past Papers") },
    { href: "/dashboard", label: t("nav.dashboard", "Dashboard") },
    { href: "/leaderboard", label: t("nav.leaderboard", "Leaderboard") },
    { href: "/paper-hacks", label: t("nav.paperHacks", "Paper Hacks") },
    { href: "/resources", label: t("nav.resources", "Resources") },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#09090A]">
      <div className="mx-auto grid max-w-site gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div>
          <div className="flex items-center gap-1.5 font-heading text-xl font-extrabold tracking-tight text-white">
            Matric Mastery
            <span className="mb-4 h-2 w-2 rounded-full bg-accent shadow-glow" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {isRTL
              ? "میٹرک کے لیے خاص طور پر تیار کردہ، تمام پاکستانی طلباء کے لیے مفید۔ ایک طالب علم کی طرف سے اصلی گائیڈ جو خود بورڈ امتحانات دے رہا ہے۔"
              : "Built for Matric, useful for all. Real strategies from a student who is actually sitting these papers — not an academy, just someone one paper ahead of you."}
          </p>
        </div>

        <div>
          <p className="font-heading text-xs font-black uppercase tracking-wider text-muted">
            {isRTL ? "فہرست صفحات" : "Navigation"}
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted transition-colors hover:text-white hover:underline underline-offset-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-xs font-black uppercase tracking-wider text-muted">
            {isRTL ? "رابطہ اور کمیونٹی" : "Community & Support"}
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="text-muted font-medium">{isRTL ? "ملتان، پنجاب" : "Multan, Punjab"}</li>
            <li>
              <a
                href={whatsappLink()}
                className="text-muted transition-colors hover:text-accent font-semibold"
              >
                {isRTL ? "واٹس ایپ پر رابطہ کریں ←" : "Message on WhatsApp →"}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6">
        <div className="mx-auto flex max-w-site flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-xs text-muted">
            {t("common.copyright", "© 2026 Matric Mastery Pakistan. Built for Pakistani Students.")}
          </p>
          <p className="font-mono text-xs text-muted">
            {isRTL
              ? "تمام 9 پنجاب بورڈز اور فیڈرل بورڈ کے لیے رہنمائی"
              : "All 9 Punjab Boards & Federal Board Guidance"}
          </p>
        </div>
      </div>
    </footer>
  );
}
