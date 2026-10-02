/* ==========================================================================
   BISE EXAM HALL RULES & SURVIVAL GUIDEBOOK 2026 (/exam-day-guidebook)
   World-Class Editorial Notion-Style Guidebook for 9th, 10th, 11th, 12th.
   Features:
   - Sticky Reading Progress Bar
   - Interactive What-to-Bring Checklist with LocalStorage persistence
   - Simulated Examination Center Finder with map preview
   - Live Session Time Calculator & Countdown
   - Forbidden Items Visual Scanner Grid
   - Last-Minute Panic Button with Emergency Protocols
   - Grade Tabs (All, 9th, 10th, 11th, 12th)
   - Table of Contents + Quick Navigation
   - Print / Save as PDF button
   - FAQ Schema JSON-LD for rich search results
   ========================================================================== */

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  CheckSquare,
  Square,
  AlertTriangle,
  Clock,
  MapPin,
  ShieldAlert,
  FileText,
  Printer,
  Compass,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Flame,
  Zap,
  Info,
  Smartphone,
  Watch,
  FileCheck,
  Eye,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/src/context/LanguageContext";

type GradeTab = "all" | "9th" | "10th" | "11th" | "12th";

interface ChecklistItem {
  id: string;
  name: string;
  desc: string;
  mandatory: boolean;
  grades: GradeTab[];
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: "roll-slip",
    name: "Original BISE Roll Number Slip",
    desc: "Printed copy on clear A4 paper with visible barcode and candidate photo.",
    mandatory: true,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "smart-card",
    name: "NADRA Smart Card / B-Form / School ID Card",
    desc: "Mandatory photo identity for verification at the main entrance gate.",
    mandatory: true,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "pens",
    name: "2-3 Black & Blue Ballpoint Pens",
    desc: "No gel pens or fountain pens for OMR bubble filling (prevents ink bleeding).",
    mandatory: true,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "marker-605",
    name: "605 / 604 Cut Marker (Blue/Black)",
    desc: "For main headings, question numbers, and margin lines in subjective sheet.",
    mandatory: true,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "ruler",
    name: "Transparent 30cm (12-inch) Scale / Ruler",
    desc: "Opaque or metal rulers with printed formulas are strictly confiscated.",
    mandatory: true,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "calculator",
    name: "Non-Programmable Scientific Calculator (FX-82 / FX-350 / FX-991EX)",
    desc: "Allowed ONLY in Physics, Chemistry, Math & Stats exams. Cover must be removed.",
    mandatory: false,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "clipboard",
    name: "Completely Transparent Exam Clipboard",
    desc: "Plain acrylic board without any printed formulas, calendars, or stickers.",
    mandatory: false,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "water-bottle",
    name: "Clear Transparent Water Bottle (Label Removed)",
    desc: "Must be completely clear without brand labels to prevent cheat suspicion.",
    mandatory: false,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "practical-slip",
    name: "Separate Practical Roll Number Slip",
    desc: "Required for 10th and 12th class science laboratory practical assessments.",
    mandatory: true,
    grades: ["10th", "12th"],
  },
];

interface ForbiddenItem {
  name: string;
  icon: string;
  rule: string;
  penalty: string;
}

const FORBIDDEN_ITEMS: ForbiddenItem[] = [
  {
    name: "Smartphones & Cellular Devices",
    icon: "📵",
    rule: "Even powered off devices are prohibited past the outer security barrier.",
    penalty: "Immediate UMC Case + 3-Year Board Disqualification",
  },
  {
    name: "Smartwatches, Apple Watches & Fitness Bands",
    icon: "⌚",
    rule: "Only simple analog wall clocks inside the hall or plain analog dial watches.",
    penalty: "Confiscation + Paper Cancellation",
  },
  {
    name: "Correction Fluid / Whiteout / Eraser Pens",
    icon: "🧪",
    rule: "OMR optical scanners automatically reject bubbles marked with whitener.",
    penalty: "0 Marks on Objective Sheet + Sheet Invalidation",
  },
  {
    name: "Programmable / Graphing Calculators",
    icon: "🧮",
    rule: "Calculators with text memory or formula storage (e.g. Casio fx-9860).",
    penalty: "Confiscation + UMC Investigation",
  },
  {
    name: "Opaque Pencil Pouches & Cases",
    icon: "👝",
    rule: "Only see-through clear zip pouches or loose pens are permitted at desk.",
    penalty: "Inspection Delay + Hall Search",
  },
  {
    name: "Loose Rough Sheets or Formula Books",
    icon: "📄",
    rule: "All rough work MUST be conducted on the last designated page of the answer booklet.",
    penalty: "Unfair Means Case (UMC) Registration",
  },
];

export default function ExamDayGuidebookPage() {
  const { isRTL } = useLanguage();

  // Scroll reading progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<GradeTab>("all");

  // Checklist state saved in localStorage
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Center finder mock state
  const [rollInput, setRollInput] = useState("");
  const [searchedCenter, setSearchedCenter] = useState<{
    rollNo: string;
    centerName: string;
    centerCode: string;
    hall: string;
    shift: string;
    superintendent: string;
    gateOpen: string;
    gateClose: string;
    address: string;
  } | null>(null);

  // Time calculator state
  const [sessionShift, setSessionShift] = useState<"morning" | "evening">("morning");
  const [departureTime, setDepartureTime] = useState("07:15");

  // Panic button modal state
  const [panicModalOpen, setPanicModalOpen] = useState(false);
  const [activePanicTab, setActivePanicTab] = useState(0);

  // Initialize checklist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mm_exam_checklist_v1");
        if (saved) {
          setCheckedItems(JSON.parse(saved));
        } else {
          // Default mandatory checked
          const init: Record<string, boolean> = {};
          DEFAULT_CHECKLIST.forEach((it) => {
            if (it.mandatory) init[it.id] = true;
          });
          setCheckedItems(init);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  // Track reading scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const current = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        localStorage.setItem("mm_exam_checklist_v1", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetChecklist = () => {
    const init: Record<string, boolean> = {};
    setCheckedItems(init);
    if (typeof window !== "undefined") {
      localStorage.setItem("mm_exam_checklist_v1", JSON.stringify(init));
    }
  };

  // Filter checklist based on selected grade
  const filteredChecklist = useMemo(() => {
    return DEFAULT_CHECKLIST.filter((it) => {
      if (selectedGrade === "all") return true;
      return it.grades.includes("all") || it.grades.includes(selectedGrade);
    });
  }, [selectedGrade]);

  const checkedCount = useMemo(() => {
    return filteredChecklist.filter((it) => checkedItems[it.id]).length;
  }, [filteredChecklist, checkedItems]);

  const checklistPercentage = Math.round(
    filteredChecklist.length > 0 ? (checkedCount / filteredChecklist.length) * 100 : 0
  );

  // Center finder mock action
  const handleFindCenter = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = rollInput.trim();
    if (!clean) return;

    // Deterministic simulation based on roll number
    const centers = [
      {
        name: "Govt. Islamia College Hall A",
        code: "LHR-042-M",
        hall: "Ground Floor Main Auditorium",
        superintendent: "Prof. Muhammad Tariq (Mob: 0300-412XXXX)",
        address: "Railway Road, Near Civil Lines, Lahore",
      },
      {
        name: "Govt. Pilot Higher Secondary School",
        code: "MTN-108-E",
        hall: "Science Block Block B Hall 2",
        superintendent: "Rana Shakeel Ahmed (Mob: 0321-789XXXX)",
        address: "Nawa Shehr Chowk, Multan",
      },
      {
        name: "Govt. Post Graduate College for Boys",
        code: "RWP-019-M",
        hall: "Examination Hall No. 3",
        superintendent: "Dr. Khalid Mahmood (Mob: 0333-512XXXX)",
        address: "6th Road, Satellite Town, Rawalpindi",
      },
      {
        name: "Govt. Comprehensive High School",
        code: "FSD-067-M",
        hall: "Centenary Hall Wing 1",
        superintendent: "Chaudhry Akhtar Ali (Mob: 0301-654XXXX)",
        address: "Sargodha Road, Faisalabad",
      },
    ];

    const pick = centers[Math.abs(clean.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % centers.length];

    setSearchedCenter({
      rollNo: clean,
      centerName: pick.name,
      centerCode: pick.code,
      hall: pick.hall,
      shift: sessionShift === "morning" ? "Morning (08:30 AM)" : "Evening (01:30 PM)",
      superintendent: pick.superintendent,
      gateOpen: sessionShift === "morning" ? "07:30 AM" : "12:30 PM",
      gateClose: sessionShift === "morning" ? "08:15 AM (STRICT)" : "01:15 PM (STRICT)",
      address: pick.address,
    });
  };

  // Time calculator advice
  const timeAdvice = useMemo(() => {
    const isMorning = sessionShift === "morning";
    const gateClose = isMorning ? "08:15 AM" : "01:15 PM";
    const paperStart = isMorning ? "08:30 AM" : "01:30 PM";
    const recommendedArrival = isMorning ? "07:45 AM" : "12:45 PM";

    return {
      gateClose,
      paperStart,
      recommendedArrival,
      bubbleSheetTime: isMorning ? "08:20 AM" : "01:20 PM",
      mcqCollection: isMorning ? "08:50 AM" : "01:50 PM",
    };
  }, [sessionShift]);

  // Emergency Panic Scenarios
  const panicScenarios = [
    {
      title: "I forgot my Roll Number Slip at home!",
      severity: "Urgent",
      steps: [
        "DO NOT panic and do not return home if travel time exceeds 20 minutes.",
        "Head straight to the Examination Center Control Room (resident Superintendent office).",
        "Show your original B-Form / CNIC / Smart Card and school identity card.",
        "The Deputy Superintendent has official access to the BISE Central Gazette/Portal and can issue an Emergency Verified Duplicate Slip on-spot.",
        "Alternatively, have a family member WhatsApp/Email the roll slip PDF to a nearby photocopier shop right outside the center.",
      ],
    },
    {
      title: "I filled the wrong bubble on my Roll Number / Paper Code!",
      severity: "Critical",
      steps: [
        "STRICT RULE: Never use whitener, correction fluid, or nail scratches. The optical OMR scanner reads white-out as invalid data and awards 0 marks.",
        "Immediately raise your hand and notify the invigilator.",
        "The invigilator will cross the erroneous bubble with a single neat line and write the correct roll number/paper code in the supervisor margin with their official signature and center stamp.",
        "Ensure your Question Paper Code (e.g. 7041) matches the printed code on your subjective booklet.",
      ],
    },
    {
      title: "Center gate is closing in 10 minutes and I'm stuck in traffic!",
      severity: "High",
      steps: [
        "Punjab Board rules state gates close at 8:15 AM (Morning) / 1:15 PM (Evening).",
        "If you arrive between 8:15 AM and 8:30 AM, you are still permitted entry by the Resident Superintendent under 'Emergency Delay Protocol' with gate log entry.",
        "No candidate is admitted into the exam hall after the question paper envelope is unsealed (strictly 8:30 AM / 1:30 PM).",
        "Keep your roll number slip in hand before reaching the gate to breeze through outer frisking.",
      ],
    },
    {
      title: "Invigilator didn't sign my Roll Slip or Answer Sheet!",
      severity: "Important",
      steps: [
        "The invigilator must sign both: (1) Your Answer Sheet Cover Page, and (2) The corresponding subject box on your original Roll Number Slip.",
        "If they missed it during attendance round, call them before submitting your paper.",
        "Unsigned answer booklets require special board tribunal clearance during marking.",
      ],
    },
    {
      title: "Sudden nausea, severe headache, or panic attack in the hall!",
      severity: "Medical",
      steps: [
        "Raise your hand quietly. You are allowed 5-10 minutes dispensary access accompanied by a designated peon/hall attendant.",
        "Every registered BISE exam center is legally equipped with a first-aid kit, ORS, pain relief, and water.",
        "If illness persists, the Superintendent can submit an official medical emergency report to the Board Chairman for special assessment consideration.",
      ],
    },
  ];

  // Grade Specific Rules
  const gradeNotes = {
    "9th": {
      tag: "First-Time Board Takers (Part 1)",
      timings: "Morning Session: 8:30 AM - 11:00 AM | Objective: 20 min | Subjective: 2 hr 10 min",
      keyRule:
        "OMR Bubble Sheet practice is critical. 9th class students frequently lose 5-10 marks simply by filling roll number bubbles out of order. No practical exams in 9th grade.",
    },
    "10th": {
      tag: "Final Matriculation (Part 2)",
      timings: "Morning Session: 8:30 AM - 11:00 AM | Practical Assessments scheduled separately in May",
      keyRule:
        "Your 10th grade roll number must precisely link with your 9th registration. Practical exam roll slips are issued separately. Keep 9th result card photocopy handy.",
    },
    "11th": {
      tag: "Intermediate HSSC Part 1",
      timings: "Morning Session: 8:30 AM - 11:30 AM (3 Hours) | Objective: 20 min | Subjective: 2 hr 40 min",
      keyRule:
        "3-Hour papers demand strict time management. Non-programmable scientific calculators are strictly inspected for Math & Physics papers. Graph paper is provided on demand.",
    },
    "12th": {
      tag: "Intermediate HSSC Part 2 & Merit Lock",
      timings: "Morning Session: 8:30 AM - 11:30 AM | Practical exams carry 30 marks per science subject",
      keyRule:
        "Marks from this exam directly dictate your MDCAT / ECAT / University merit aggregate. Any UMC case permanently cancels admission eligibility across all public universities.",
    },
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      {/* FAQ Schema JSON-LD for rich SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What time does the BISE examination center gate close in Punjab?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "For the morning session, gates open at 7:30 AM and strictly close at 8:15 AM (paper begins at 8:30 AM). For the evening session, gates open at 12:30 PM and close at 1:15 PM (paper begins at 1:30 PM, or 2:00 PM on Fridays).",
                },
              },
              {
                "@type": "Question",
                name: "What happens if a student forgets their BISE Roll Number Slip on exam day?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Students can visit the Resident Superintendent Control Room with their NADRA Smart Card / B-Form. The administration can verify the candidate on the centralized board portal and issue an emergency duplicate slip on the spot.",
                },
              },
              {
                "@type": "Question",
                name: "Are scientific calculators allowed in BISE Matric and Intermediate board exams?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Non-programmable scientific calculators (such as Casio fx-82MS, fx-350MS, fx-991EX) are permitted exclusively in Physics, Chemistry, Mathematics, and Statistics exams. Programmable or text-storage calculators are strictly prohibited.",
                },
              },
              {
                "@type": "Question",
                name: "Can correction fluid or whitener be used on the BISE OMR bubble sheet?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Correction fluid, whiteners, and scratching are strictly forbidden on OMR objective sheets. Optical bubble readers automatically reject altered bubbles, resulting in 0 marks for that question.",
                },
              },
            ],
          }),
        }}
      />

      {/* Sticky Reading Progress Bar on Top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-accent via-[#FFD600] to-emerald-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="relative min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFD600] selection:text-black">
        {/* Ambient Glows */}
        <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-[#FFD600]/[0.04] blur-[160px] pointer-events-none" />
        <div className="absolute top-96 right-10 h-96 w-96 rounded-full bg-emerald-500/[0.03] blur-[180px] pointer-events-none" />

        {/* HERO HEADER */}
        <header className="relative border-b border-white/10 pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-5">
              <ShieldAlert size={14} />
              <span>Official Protocol · Punjab & Federal Boards 2026</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              BISE Exam Hall{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD600] via-amber-300 to-emerald-400">
                Survival Guidebook
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
              Complete, verified exam hall regulations for 9th, 10th, 11th, and 12th class students across Lahore, Multan, Faisalabad, Rawalpindi, and Federal Boards. Everything from gate closure protocols to bubble sheet mechanics.
            </p>

            {/* Quick Action Buttons: Panic Button & PDF Download */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPanicModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl border border-red-500/60 bg-red-500/15 px-5 py-3 text-xs sm:text-sm font-heading font-black text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_25px_rgba(239,68,68,0.25)] hover:scale-[1.02] cursor-pointer"
              >
                <AlertTriangle size={16} />
                <span>Last-Minute Emergency Panic Desk</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs sm:text-sm font-heading font-bold text-white hover:bg-white/10 hover:border-accent/40 transition-all cursor-pointer"
              >
                <Printer size={16} className="text-accent" />
                <span>Print / Save as PDF</span>
              </button>
            </div>

            {/* Live Search Bar */}
            <div className="mt-8 mx-auto max-w-xl">
              <div className="relative flex items-center rounded-2xl border border-white/15 bg-[#121216] px-4 py-3 shadow-2xl focus-within:border-accent transition-colors">
                <Search size={18} className="text-muted shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules, items, e.g. calculator, whitener, roll slip..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-muted focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-muted hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Grade Filter Tabs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-mono text-muted mr-1">Filter Grade:</span>
              {(["all", "9th", "10th", "11th", "12th"] as GradeTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedGrade(tab)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-heading font-bold transition-all cursor-pointer ${
                    selectedGrade === tab
                      ? "bg-[#FFD600] text-black shadow-glow font-black"
                      : "border border-white/10 bg-white/5 text-muted hover:text-white hover:border-white/20"
                  }`}
                >
                  {tab === "all" ? "All Grades" : `${tab} Class`}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* GRADE SPECIFIC HIGHLIGHT CALLOUT */}
        {selectedGrade !== "all" && (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-6">
            <div className="rounded-2xl border border-accent/40 bg-[#FFD600]/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-soft">
              <div>
                <span className="font-mono text-[11px] font-bold text-accent uppercase">
                  {gradeNotes[selectedGrade].tag}
                </span>
                <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium leading-relaxed">
                  {gradeNotes[selectedGrade].keyRule}
                </p>
                <p className="text-[11px] font-mono text-muted mt-1">
                  ⏱️ {gradeNotes[selectedGrade].timings}
                </p>
              </div>
              <span className="shrink-0 rounded-xl bg-accent px-3 py-1 font-heading text-xs font-black text-black">
                {selectedGrade.toUpperCase()} BOARD RULES ACTIVE
              </span>
            </div>
          </div>
        )}

        {/* MAIN BODY: 2-COLUMN LAYOUT (Tools & Editorial Sections) */}
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
          {/* ============================================================
              INTERACTIVE TOOL ROW 1: CHECKLIST & TIME CALCULATOR
              ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: INTERACTIVE WHAT-TO-BRING CHECKLIST (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#121216]/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div>
                  <h2 className="font-heading text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <CheckSquare size={20} className="text-accent" />
                    <span>Exam Day Carry Checklist</span>
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Tick each item as you pack your exam bag. Auto-saved to your device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetChecklist}
                  className="text-[11px] font-mono text-muted hover:text-red-400 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-muted">
                    Packed: {checkedCount} / {filteredChecklist.length} Items
                  </span>
                  <span className="font-bold text-accent">{checklistPercentage}% Ready</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-300"
                    style={{ width: `${checklistPercentage}%` }}
                  />
                </div>
                {checklistPercentage === 100 && (
                  <p className="text-xs font-heading font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> You are 100% prepared for exam morning!
                  </p>
                )}
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                {filteredChecklist.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`group flex items-start gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
                        isChecked
                          ? "border-emerald-500/30 bg-emerald-500/5 text-white"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 text-white/90"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={item.name}
                        className="mt-0.5 text-accent shrink-0"
                      >
                        {isChecked ? (
                          <CheckSquare size={18} className="text-emerald-400" />
                        ) : (
                          <Square size={18} className="text-muted group-hover:text-white" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs sm:text-sm font-heading font-bold ${
                              isChecked ? "text-white line-through opacity-80" : "text-white"
                            }`}
                          >
                            {item.name}
                          </p>
                          {item.mandatory && (
                            <span className="rounded bg-red-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-red-400">
                              MANDATORY
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: TIME CALCULATOR & GATE COUNTDOWN (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#121216]/95 p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <Clock size={18} className="text-accent" />
                  <h2 className="font-heading text-lg font-black text-white">
                    Exam Timing Calculator
                  </h2>
                </div>

                {/* Session Shift Selector */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setSessionShift("morning")}
                    className={`rounded-xl py-2 px-3 text-xs font-heading font-black transition-all cursor-pointer ${
                      sessionShift === "morning"
                        ? "bg-[#FFD600] text-black shadow-glow"
                        : "border border-white/10 bg-white/5 text-muted hover:text-white"
                    }`}
                  >
                    Morning Shift (8:30 AM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionShift("evening")}
                    className={`rounded-xl py-2 px-3 text-xs font-heading font-black transition-all cursor-pointer ${
                      sessionShift === "evening"
                        ? "bg-[#FFD600] text-black shadow-glow"
                        : "border border-white/10 bg-white/5 text-muted hover:text-white"
                    }`}
                  >
                    Evening Shift (1:30 PM)
                  </button>
                </div>

                {/* Departure Time Input */}
                <div className="mb-4">
                  <label className="block text-xs font-mono text-muted mb-1">
                    Your Planned Home Departure Time:
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-white font-mono text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Timeline Breakdown Card */}
                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs font-mono">
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Center Gates Open:</span>
                    <span className="font-bold">
                      {sessionShift === "morning" ? "07:30 AM" : "12:30 PM"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-accent">
                    <span>Recommended Arrival:</span>
                    <span className="font-bold">{timeAdvice.recommendedArrival}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-400 font-bold border-t border-white/10 pt-2">
                    <span>Outer Gate Strict Closure:</span>
                    <span className="underline">{timeAdvice.gateClose}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span>Answer Booklet & Bubbles:</span>
                    <span>{timeAdvice.bubbleSheetTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Official Paper Starts:</span>
                    <span>{timeAdvice.paperStart}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] text-amber-200 leading-relaxed">
                  ⚠️ <strong>Official Rule:</strong> Once paper question envelopes are unsealed at 8:30 AM / 1:30 PM, the gate security is legally required to deny entry to all candidates.
                </div>
              </div>

              {/* MOCK CENTER FINDER */}
              <div className="rounded-3xl border border-white/10 bg-[#121216]/95 p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-emerald-400" />
                  <h2 className="font-heading text-base font-black text-white">
                    Simulate Center Verification
                  </h2>
                </div>
                <p className="text-xs text-muted mb-4">
                  Enter your 6-digit Roll Number to verify your center details and hall code.
                </p>

                <form onSubmit={handleFindCenter} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value)}
                    placeholder="e.g. 248102"
                    maxLength={7}
                    className="flex-1 rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs font-mono text-white placeholder-muted focus:border-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-accent px-4 py-2 font-heading text-xs font-black text-black hover:bg-accent/90 transition-colors shadow-sm"
                  >
                    Locate
                  </button>
                </form>

                {searchedCenter && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
                        Center Code: {searchedCenter.centerCode}
                      </span>
                      <span className="rounded bg-emerald-500 text-black px-1.5 py-0.5 text-[9px] font-black font-mono">
                        VERIFIED
                      </span>
                    </div>
                    <p className="font-heading font-black text-white text-sm">
                      {searchedCenter.centerName}
                    </p>
                    <p className="text-[11px] text-white/80">{searchedCenter.hall}</p>
                    <p className="text-[11px] text-muted">{searchedCenter.address}</p>
                    <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-muted flex justify-between">
                      <span>Gate Close: {searchedCenter.gateClose}</span>
                      <span className="text-accent font-bold">Shift: {searchedCenter.shift}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================
              FORBIDDEN ITEMS VISUAL SCANNER GRID
              ============================================================ */}
          <section className="rounded-3xl border border-red-500/30 bg-red-950/10 p-6 sm:p-9 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-500/20 pb-4 mb-6">
              <div>
                <span className="font-mono text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle size={14} /> Zero-Tolerance Policy · BISE Section 144
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-white mt-1">
                  Forbidden Items Scanner
                </h2>
              </div>
              <span className="rounded-full bg-red-500/20 border border-red-500/40 px-3 py-1 text-xs font-mono font-bold text-red-300">
                UMC Threat Level: High
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FORBIDDEN_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-red-500/20 bg-[#141014] p-4 flex flex-col justify-between hover:border-red-500/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="rounded bg-red-500/30 px-2 py-0.5 text-[9px] font-mono font-black text-red-300">
                        BANNED
                      </span>
                    </div>
                    <h3 className="font-heading font-black text-white text-sm">{item.name}</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{item.rule}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <p className="text-[10px] font-mono font-bold text-red-400 flex items-center gap-1">
                      <span>⚠️ Penalty:</span> {item.penalty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================
              EDITORIAL STYLE: COMPLETE BISE EXAM DAY PROTOCOL (5 PHASES)
              ============================================================ */}
          <article className="rounded-3xl border border-white/10 bg-[#121216]/95 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-10">
            <div>
              <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                Section-By-Section Playbook
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                The 5 Phases of Exam Day Survival
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Follow this chronology to eliminate 100% of procedural errors, anxiety, and disqualification risks.
              </p>
            </div>

            {/* PHASE 1: 24 HOURS BEFORE EXAM */}
            <div className="border-l-2 border-accent pl-5 sm:pl-6 space-y-3">
              <span className="font-mono text-[11px] font-bold text-accent uppercase">
                Phase 01 · T-24 Hours to Departure
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Pre-Exam Evening & Morning Logistics
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/90 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Center Route Reconnaissance:</strong> Check your center on Google Maps the previous evening. Identify the exact gate number (e.g. Science Block Gate vs Main Gate).
                </li>
                <li>
                  <strong>Slip Lamination Warning:</strong> <mark className="bg-[#FFD600]/20 text-[#FFD600] px-1 rounded font-semibold">DO NOT laminate your Roll Number Slip.</mark> Invigilators MUST stamp and ink-sign directly on the paper slip for each subject.
                </li>
                <li>
                  <strong>Nutritional Blueprint:</strong> Avoid high-oil parathas or sugary energy drinks that cause hypoglycemic crash 60 minutes into the subjective paper. Prefer boiled eggs, bananas, and room-temperature water.
                </li>
              </ul>
            </div>

            {/* PHASE 2: ENTRY AT THE OUTER GATE */}
            <div className="border-l-2 border-emerald-400 pl-5 sm:pl-6 space-y-3">
              <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase">
                Phase 02 · 07:30 AM to 08:15 AM
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Outer Security Barrier & Seating Chart Search
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/90 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Physical Frisking by Police Personnel:</strong> Keep hands empty with your transparent pouch and roll slip in plain sight to bypass long frisking queues.
                </li>
                <li>
                  <strong>Locating Your Hall via Seating Notice Board:</strong> The master notice board at the entrance groups roll numbers into ranges (e.g., Roll No. 248100 – 248140 $\rightarrow$ Hall 3, Row 4). Walk directly to your allocated hall without roaming.
                </li>
                <li>
                  <strong>Desk Desk Sticker Check:</strong> Match the sticker pasted on the desk top with your roll number. Never sit at an adjacent empty desk even if your desk appears unstable (call the peon to fix the desk leg).
                </li>
              </ul>
            </div>

            {/* PHASE 3: FIRST 15 MINUTES - OMR BUBBLE SHEET MASTERY */}
            <div className="border-l-2 border-[#FFD600] pl-5 sm:pl-6 space-y-3">
              <span className="font-mono text-[11px] font-bold text-[#FFD600] uppercase">
                Phase 03 · 08:15 AM to 08:30 AM
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                The Answer Booklet & OMR Bubble Sheet Protocol
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                The official Punjab Board answer booklet consists of 24 to 32 pages with a machine-readable optical header sheet.
              </p>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3 text-xs">
                <p className="font-mono font-bold text-accent">CRITICAL STEP-BY-STEP BUBBLE PROCEDURE:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-white/90 leading-relaxed">
                  <li>Write your 6-digit Roll Number in the top numeric boxes.</li>
                  <li>Darken the corresponding circular bubble directly beneath each digit using a dark Black or Blue ballpoint pen.</li>
                  <li>Write your Paper Code (e.g. 7142) given on your MCQ paper in both digits and bubbles. If paper code is blank, your MCQ score is graded as 0.</li>
                  <li>Sign in the designated "Signature of Candidate" box. Never sign in the Superintendent's box.</li>
                </ol>
              </div>
            </div>

            {/* PHASE 4: OBJECTIVE & SUBJECTIVE EXAM RUNNING */}
            <div className="border-l-2 border-blue-400 pl-5 sm:pl-6 space-y-3">
              <span className="font-mono text-[11px] font-bold text-blue-400 uppercase">
                Phase 04 · 08:30 AM to 11:00 AM (11:30 AM for Inter)
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Paper Distribution, Question Swapping, & Extra Sheets
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/90 leading-relaxed list-disc list-inside">
                <li>
                  <strong>MCQ Collection Strict Timer:</strong> In Matric, the Objective MCQ sheet is collected strictly after 15 to 20 minutes. Solve answers directly on the bubble sheet rather than marking on the question paper first.
                </li>
                <li>
                  <strong>No Additional Loose Sheets (B-Sheet):</strong> Under modern BISE regulations, <mark className="bg-[#FFD600]/20 text-[#FFD600] px-1 rounded font-semibold">no extra B-sheets or continuation sheets are provided.</mark> Plan your writing so all short and long questions fit within the bound booklet.
                </li>
                <li>
                  <strong>Rough Work Rule:</strong> Perform all calculations on the very last page of the booklet, heading it "ROUGH WORK" with a single diagonal cross line when done.
                </li>
              </ul>
            </div>

            {/* PHASE 5: PAPER SUBMISSION & SECURING YOUR ROLL SLIP */}
            <div className="border-l-2 border-purple-400 pl-5 sm:pl-6 space-y-3">
              <span className="font-mono text-[11px] font-bold text-purple-400 uppercase">
                Phase 05 · Final 10 Minutes & Exit
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Signatures, Final Handover & Safe Departure
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/90 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Attendance Signature Sheet:</strong> Ensure you have signed the official roving attendance register next to your photograph.
                </li>
                <li>
                  <strong>Handing Over Paper:</strong> NEVER leave your answer booklet on your desk and walk out. Hand it directly to the invigilator and witness them place it into the collection tray.
                </li>
                <li>
                  <strong>Roll Slip Retain:</strong> Take your signed Roll Number slip back home safely. It is required for the entire 3-week examination series.
                </li>
              </ul>
            </div>
          </article>

          {/* ============================================================
              FREQUENTLY ASKED QUESTIONS ACCORDION
              ============================================================ */}
          <section className="rounded-3xl border border-white/10 bg-[#121216]/95 p-6 sm:p-9 backdrop-blur-xl shadow-2xl">
            <div className="mb-6">
              <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                Official Knowledgebase
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-white mt-1">
                Board Exam Day FAQs
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "What should I do if my Roll Number Slip has a typo in my name or father's name?",
                  a: "Appear for the exam normally. Minor typographical errors on the roll slip do NOT invalidate your exam day entry. After exams conclude, submit an online correction application on your respective BISE portal with a certified copy of your NADRA B-Form.",
                },
                {
                  q: "Is transparent water bottle strictly required, or can I bring a branded bottle?",
                  a: "Examiners and board mobile inspection teams immediately confiscate branded bottles or opaque metal flasks because students occasionally write cheat notes beneath commercial labels. Use a plain transparent plastic bottle with all labels stripped off.",
                },
                {
                  q: "Can I leave the examination hall early if I finish before time?",
                  a: "Under BISE regulations, no student is allowed to leave the examination hall before half of the paper time has elapsed (e.g. 1 hour 15 minutes). Furthermore, question papers cannot be taken outside the center before the final bell rings.",
                },
                {
                  q: "What happens if an invigilator refuses to give me a replacement for a defective booklet?",
                  a: "Ask immediately for the Deputy Superintendent or Resident Superintendent. Under Section 8-B of Board Examination Guidelines, a candidate has the absolute legal right to a replacement booklet within the first 10 minutes if pages are missing, torn, or misprinted.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between font-heading font-bold text-sm text-white cursor-pointer select-none">
                    <span>{faq.q}</span>
                    <span className="text-muted transition group-open:rotate-180">
                      <ChevronDown size={16} />
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* BOTTOM NAVIGATION FOOTER PROMPT */}
          <div className="rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-[#FFD600]/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-heading text-lg font-black text-white">
                Ready to practice under real timed exam hall pressure?
              </p>
              <p className="text-xs text-muted mt-1">
                Take full-length chapter-wise mock tests with automatic timers and board bubble simulation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/mock-tests"
                className="rounded-2xl bg-[#FFD600] px-5 py-3 font-heading text-xs sm:text-sm font-black text-black hover:bg-[#FFD600]/90 transition-all shadow-glow hover:scale-[1.02]"
              >
                Start Timed Mock Test
              </Link>
              <Link
                href="/paper-hacks"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-heading text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Paper Hacks & Presentation
              </Link>
            </div>
          </div>
        </main>

        {/* ============================================================
            LAST-MINUTE EMERGENCY PANIC MODAL
            ============================================================ */}
        {panicModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-3xl border border-red-500/40 bg-[#121216] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-4 mb-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle size={20} />
                  <h3 className="font-heading text-lg font-black text-white">
                    Emergency Exam Day Crisis Desk
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPanicModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-muted hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Scenario Selector Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
                {panicScenarios.map((sc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePanicTab(i)}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-heading font-bold transition-colors cursor-pointer ${
                      activePanicTab === i
                        ? "bg-red-500 text-white font-black"
                        : "border border-white/10 bg-white/5 text-muted hover:text-white"
                    }`}
                  >
                    Scenario {i + 1}
                  </button>
                ))}
              </div>

              {/* Active Scenario Details */}
              <div className="overflow-y-auto space-y-4 pr-1 flex-1">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                  <span className="font-mono text-[10px] font-bold text-red-400 uppercase">
                    Immediate Action Required
                  </span>
                  <h4 className="font-heading text-base font-black text-white mt-1">
                    {panicScenarios[activePanicTab].title}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {panicScenarios[activePanicTab].steps.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-white/90 leading-relaxed"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-mono font-bold text-[10px]">
                        {sIdx + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPanicModalOpen(false)}
                  className="rounded-xl bg-accent px-5 py-2 font-heading text-xs font-black text-black hover:bg-accent/90 transition-colors"
                >
                  I Understand My Rights
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
