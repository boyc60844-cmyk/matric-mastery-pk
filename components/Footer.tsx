"use client";

import Link from "next/link";
import { whatsappLink } from "@/lib/utils";
import { useLanguage } from "@/src/context/LanguageContext";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";

export default function Footer() {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="relative border-t border-white/10 bg-[#09090A]">
      <div className="mx-auto grid max-w-site gap-10 px-5 py-14 sm:py-16 md:grid-cols-[1.2fr_1.4fr_1fr] md:py-20">
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

        {/* Synchronized 11-page Navigation */}
        <div>
          <p className="font-heading text-xs font-black uppercase tracking-wider text-muted">
            {isRTL ? "فہرست صفحات (11)" : "Navigation (11 Pages)"}
          </p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {MAIN_NAV_ITEMS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted transition-colors hover:text-white hover:underline underline-offset-4 flex items-center gap-1.5"
                >
                  <span>{t(l.labelKey, l.defaultLabel)}</span>
                  {l.badge && (
                    <span className="rounded px-1.5 py-0.2 text-[9px] font-mono font-bold bg-accent/15 text-accent border border-accent/25">
                      {l.badge}
                    </span>
                  )}
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
                className="text-muted transition-colors hover:text-accent font-semibold flex items-center gap-1"
              >
                <span>{isRTL ? "واٹس ایپ پر رابطہ کریں ←" : "Message on WhatsApp →"}</span>
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
