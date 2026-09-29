import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Copyright,
  AlertTriangle,
  GraduationCap,
  Award,
  MessageCircle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Scale,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Legal - Matric Mastery",
  description:
    "Official legal notice, copyright ownership, terms of use, and educational disclaimers for Matric Mastery — an independent educational platform based in Multan, Punjab, Pakistan.",
};

interface LegalSection {
  id: string;
  number: string;
  icon: LucideIcon;
  title: string;
  highlight?: boolean;
  content: string[];
  badges?: string[];
}

const legalSections: LegalSection[] = [
  {
    id: "ownership-structure",
    number: "01",
    icon: Building2,
    title: "OWNERSHIP STRUCTURE",
    highlight: true,
    badges: ["Multan, Pakistan", "Original IP", "Independent"],
    content: [
      "Matric Mastery is independently owned, designed, and operated by Hamza, an independent student creator based in Multan, Punjab, Pakistan.",
      "All curriculum strategies, paper pattern analysis models, answer-sheet presentation architectures, 3D diagrams, editorial frameworks, and digital templates available on this platform represent original intellectual property (IP).",
      "Matric Mastery was created to solve authentic examination presentation challenges for Punjab Board matric students through practical, student-tested methods rather than generic commercial rote learning.",
    ],
  },
  {
    id: "copyright-notice",
    number: "02",
    icon: Copyright,
    title: "COPYRIGHT NOTICE",
    highlight: true,
    badges: ["© 2026 All Rights Reserved", "DMCA Protected", "FIA Cybercrime"],
    content: [
      "© 2026 Matric Mastery. All Rights Reserved. No part of this website — including editorial guides, layout architectures, visual presentation rules, exam hacks, mathematical breakdowns, or design assets — may be copied, reproduced, repackaged, resold, or publicly redistributed without prior written authorization.",
      "Posting screenshots, full text, or compiled PDF packs of our guides on Facebook groups, WhatsApp communities, Telegram channels, or private commercial academy bundles is strictly prohibited.",
      "Unauthorized reproduction or commercial exploitation will result in immediate DMCA takedown requests to web hosts and domain registrars, followed by formal complaints lodged with the Federal Investigation Agency (FIA) Cyber Crime Wing under the Prevention of Electronic Crimes Act (PECA).",
    ],
  },
  {
    id: "educational-disclaimer",
    number: "03",
    icon: AlertTriangle,
    title: "EDUCATIONAL DISCLAIMER",
    badges: ["Zero Leak Policy", "Strategy Based", "Merit Driven"],
    content: [
      "Matric Mastery provides high-yield study strategies, time-management protocols, and paper presentation systems derived from meticulous analysis of publicly available past board papers and examiner marking guidelines.",
      "We do NOT possess, distribute, predict, or guarantee examination paper leaks. Any external individual or social media group claiming to sell 'Matric Mastery leaked board papers' is committing fraud and should be reported immediately.",
      "Academic results and final board marks depend entirely on each student's personal preparation, comprehension, handwriting discipline, and exam hall execution. Our techniques provide tactical guidance, not automated grade guarantees.",
    ],
  },
  {
    id: "no-affiliation",
    number: "04",
    icon: GraduationCap,
    title: "NO AFFILIATION",
    badges: ["Independent Initiative", "Non-Governmental"],
    content: [
      "Matric Mastery is an independent educational platform. It is NOT affiliated with, sponsored by, endorsed by, certified by, or officially connected to the Board of Intermediate and Secondary Education (BISE) Multan, BISE Lahore, BISE Rawalpindi, BISE Faisalabad, the Federal Board of Intermediate and Secondary Education (FBISE), or any other provincial or federal education board in Pakistan.",
      "This website is not an official government conduit for examination dates, roll number slips, board center changes, rechecking protocols, or official scorecards.",
      "Students must always cross-reference official board circulars and verify critical exam schedules on their respective official BISE portal.",
    ],
  },
  {
    id: "user-content",
    number: "05",
    icon: Award,
    title: "USER CONTENT & TESTIMONIALS",
    badges: ["Privacy Protected", "Name Masking"],
    content: [
      "When students voluntarily submit their examination marks, answer sheets, scorecard screenshots, or written feedback to Matric Mastery via WhatsApp or our contact forms, you grant Matric Mastery the non-exclusive right to showcase these outcomes as proof of methodology.",
      "Student dignity and privacy are protected at all times: upon request, or by default for minor safety, student roll numbers, school names, registration codes, and personal identifiers will be securely masked or hidden before publication.",
      "You retain full personal ownership of your submitted work and can request its removal from our public showcase at any time by messaging our official support channel.",
    ],
  },
  {
    id: "whatsapp-contact",
    number: "06",
    icon: MessageCircle,
    title: "WHATSAPP & OFFICIAL CONTACT",
    highlight: true,
    badges: ["Official Channel: +92 308 4703973", "Verify Contact"],
    content: [
      "All legitimate inquiries, student doubt clearing, and community communications take place exclusively through our verified official WhatsApp line: https://wa.me/923084703973 (+92 308 4703973).",
      "Matric Mastery maintains zero secondary numbers, unauthorized paid coordinators, or separate regional hotlines. We bear no liability for transactions, advice, or claims made by unauthorized parties operating fake social media handles or spoofed numbers.",
      "Always confirm that the phone number you are communicating with exactly matches +92 308 4703973 before sharing academic details.",
    ],
  },
  {
    id: "changes-to-legal",
    number: "07",
    icon: RefreshCw,
    title: "CHANGES TO LEGAL TERMS",
    badges: ["Continuous Review", "Updated Sept 2026"],
    content: [
      "Matric Mastery reserves the right to amend, update, or revise these legal terms, copyright provisions, and educational disclaimers at any time to maintain alignment with operational and regulatory requirements.",
      "Any revisions will be posted directly to this URL with a refreshed date stamp. Continued utilization of Matric Mastery subsequent to any posted changes signifies your full acknowledgment and acceptance of the revised policies.",
      "Last reviewed and effective as of: September 2026.",
    ],
  },
];

export default function LegalPage() {
  const officialWhatsApp = "https://wa.me/923084703973?text=Hi%2C%20I%20have%20a%20legal%20or%20ownership%20question%20regarding%20Matric%20Mastery";

  return (
    <div className="mx-auto max-w-site px-4 sm:px-6 py-12 md:py-20">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <header className="mx-auto max-w-3xl text-center sm:text-left">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-1.5 font-heading text-xs font-black tracking-widest text-accent uppercase shadow-[0_0_15px_rgba(255,214,10,0.2)]">
            <Scale size={14} className="text-accent" aria-hidden="true" />
            <span>OFFICIAL LEGAL NOTICE &bull; TERMS OF USE</span>
          </div>

          <h1 className="mt-5 font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
            Legal, Copyright &amp; Ownership &mdash;{" "}
            <span className="text-accent">Matric Mastery</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed font-normal">
            This document outlines the intellectual property rights, educational disclaimers,
            copyright protection, and official communication channels governing Matric Mastery.
            Written in direct, binding language for complete transparency.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono text-muted/80">
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1">
              Location: Multan, Punjab, Pakistan
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1">
              Effective Date: September 2026
            </span>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-1 text-emerald-400 font-bold">
              Status: Active &bull; Legally Enforced
            </span>
          </div>
        </Reveal>
      </header>

      {/* =========================================================================
          7 BIG 3D LEGAL SECTIONS (Cards with 32px padding, line-height 1.8)
          ========================================================================= */}
      <div className="mx-auto mt-12 max-w-3xl space-y-8">
        {legalSections.map((sec, i) => {
          const Icon = sec.icon;

          return (
            <Reveal key={sec.id} delay={i * 35}>
              <section aria-labelledby={sec.id}>
                <Card
                  tilt={true}
                  depth={sec.highlight ? "yellow" : "hover-yellow"}
                  className={`relative p-7 sm:p-8 md:p-9 transition-all preserve-3d overflow-hidden ${
                    sec.highlight
                      ? "!border-accent/50 !bg-[#121214] shadow-brutalist-yellow"
                      : "border-white/10 bg-[#0E0E10] hover:border-accent/40"
                  }`}
                >
                  {/* Subtle corner badge for numbering */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/60 shadow-inner">
                        <Icon size={22} className="text-accent" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-black text-accent tracking-widest uppercase">
                          SECTION {sec.number}
                        </span>
                        <h2
                          id={sec.id}
                          className="font-heading text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight"
                        >
                          {sec.title}
                        </h2>
                      </div>
                    </div>

                    <span className="font-mono text-2xl font-black text-white/20 hidden sm:block">
                      {sec.number}
                    </span>
                  </div>

                  {/* Badges strip */}
                  {sec.badges && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {sec.badges.map((b) => (
                        <span
                          key={b}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-white/90 font-semibold"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Large, highly readable text with line-height 1.8 */}
                  <div className="mt-5 space-y-3.5 text-[15px] sm:text-base leading-[1.8] text-muted font-normal [&_strong]:text-white [&_strong]:font-bold">
                    {sec.content.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                </Card>
              </section>
            </Reveal>
          );
        })}

        {/* =========================================================================
            YELLOW CTA BOX: "Have legal question? WhatsApp us"
            ========================================================================= */}
        <Reveal delay={280}>
          <section aria-labelledby="legal-cta" className="pt-4">
            <div className="relative rounded-[20px] border-2 border-black bg-[#FFD60A] p-7 sm:p-9 text-black shadow-[8px_8px_0_#000000] preserve-3d">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-black/80">
                <ShieldCheck size={16} className="text-black" />
                <span>OFFICIAL VERIFICATION DESK</span>
              </div>

              <h2
                id="legal-cta"
                className="mt-2 font-heading text-2xl sm:text-3xl font-black text-black tracking-tight"
              >
                Have a legal question? WhatsApp us
              </h2>

              <p className="mt-3 text-sm sm:text-base font-semibold leading-[1.7] text-black/90 max-w-xl">
                For copyright licensing, DMCA queries, student content privacy requests, or to
                verify an official communication from Multan, reach out directly to our verified founder WhatsApp.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <a
                  href={officialWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-black px-6 py-3.5 font-heading text-sm font-black text-white hover:bg-neutral-900 transition-transform active:scale-95 shadow-[3px_3px_0_rgba(0,0,0,0.6)] cursor-pointer"
                >
                  <MessageCircle size={18} className="text-accent" />
                  <span>WhatsApp Legal Desk</span>
                </a>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white/90 px-5 py-3.5 font-heading text-sm font-bold text-black hover:bg-white transition-transform active:scale-95 shadow-[3px_3px_0_rgba(0,0,0,0.4)] cursor-pointer"
                >
                  <span>About Matric Mastery</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-5 border-t border-black/20 pt-3 text-xs font-mono text-black/70 flex flex-wrap items-center justify-between gap-2">
                <span>Official Line: +92 308 4703973</span>
                <span>Response Time: Within 24 Hours</span>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
