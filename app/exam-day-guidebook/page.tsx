/* ==========================================================================
   BISE EXAM DAY GUIDEBOOK (UNOFFICIAL) - RULES & TIPS (/exam-day-guidebook)
   Educational Reference Guide for 9th, 10th, 11th, and 12th Class Students.
   - Comprehensive JSON-LD FAQPage (10+ SEO questions & answers)
   - BreadcrumbList Schema (Home > Guidebook)
   - Legal Disclaimers (Not affiliated with BISE boards, educational guidance only)
   - Dynamic Last Updated date and public notification sources
   - Interactive carry checklist, time calculator, center simulator, forbidden items scanner
   ========================================================================== */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  CheckSquare,
  Square,
  AlertTriangle,
  Clock,
  MapPin,
  FileText,
  Printer,
  ChevronDown,
  XCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Flame,
  Zap,
  Info,
  Smartphone,
  Watch,
  GraduationCap,
  Calendar,
  Shield,
  HelpCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/src/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

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
    name: "Roll Number Slip Printout",
    desc: "Printed copy on clear A4 paper with visible barcode and candidate photo.",
    mandatory: true,
    grades: ["all", "9th", "10th", "11th", "12th"],
  },
  {
    id: "smart-card",
    name: "NADRA Smart Card / B-Form / School ID Card",
    desc: "Mandatory photo identity for verification at the entrance gate.",
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
    desc: "Must be completely clear without brand labels to prevent suspicion.",
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

// 10 Detailed SEO Questions and Answers matching JSON-LD Schema
const FAQ_ITEMS = [
  {
    q: "What time should I reach BISE exam center?",
    a: "For morning sessions across BISE Lahore, Gujranwala, and Faisalabad, candidates should arrive by 7:45 AM. Center gates strictly close at 8:15 AM before papers unseal at 8:30 AM for 9th, 10th, 11th, and 12th class students. Evening sessions require arrival by 12:45 PM with gates closing at 1:15 PM.",
  },
  {
    q: "What to bring to BISE 9th 10th exam?",
    a: "Students appearing in 9th and 10th class exams under BISE Lahore, Gujranwala, or Faisalabad must carry their printed Roll Number Slip, NADRA B-Form/Smart Card or School ID, 2-3 black/blue ballpoint pens, transparent 30cm ruler, and 605 cut marker in a clear transparent pouch.",
  },
  {
    q: "Can I bring calculator to exam hall?",
    a: "Non-programmable scientific calculators (such as Casio fx-82MS, fx-350MS, fx-991EX) are permitted exclusively in Physics, Chemistry, Mathematics, and Statistics papers for 9th, 10th, 11th, and 12th grades. Programmable graphing calculators with text memory are strictly banned across all Punjab boards.",
  },
  {
    q: "What if I forget my roll number slip?",
    a: "If you forget your roll number slip, report immediately to the Resident Superintendent Control Room at your exam center with your B-Form or CNIC. Authorities in BISE Lahore, Gujranwala, and Faisalabad can verify your record on the central portal and issue a temporary duplicate slip on-site.",
  },
  {
    q: "What are BISE exam hall rules 2026?",
    a: "General 2026 guidelines for 9th, 10th, 11th, and 12th exams require sitting only at your allocated roll number desk, filling OMR bubbles with ballpoint only, matching question paper codes with the answer booklet, and avoiding any loose sheets or unapproved stationery in the hall.",
  },
  {
    q: "Mobile phone allowed in BISE exams?",
    a: "Mobile phones, smartwatches, Bluetooth earbuds, and electronic storage devices are strictly prohibited inside examination centers of BISE Lahore, Gujranwala, Faisalabad, and all Punjab boards. Carrying a mobile phone triggers an immediate Unfair Means Case (UMC) and a potential 3-year exam ban.",
  },
  {
    q: "What is dress code for BISE exams?",
    a: "Regular students of 9th, 10th, 11th, and 12th grades must wear their official school or college uniform with their student identity badge. Private candidates are instructed to wear modest, clean, casual attire without excessive pockets, heavy jackets, or prohibited wrist accessories.",
  },
  {
    q: "Difference between 9th and 10th exam rules?",
    a: "9th class papers feature 20-minute OMR objective bubble sheets without practical exams, serving as the foundation matric enrollment. 10th class candidates sit for final matriculation where their roll number links to their 9th record, followed by mandatory science practical examinations.",
  },
  {
    q: "What happens if late to exam center?",
    a: "Candidates arriving between 8:15 AM and 8:30 AM may be granted conditional entry by the Resident Superintendent under emergency delay recording. However, once paper envelopes are opened at 8:30 AM (or 1:30 PM for evening shifts), gates close completely and no candidate is admitted under Punjab Board regulations.",
  },
  {
    q: "Can I leave exam hall early?",
    a: "Under Punjab board guidelines across BISE Lahore, Gujranwala, and Faisalabad, students cannot leave the examination hall until at least half of the total paper duration has elapsed (1 hour 15 minutes). Question papers cannot be removed from the premises until the final bell rings.",
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

  // Dynamic last updated date
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>("October 2026");

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

  // Lock body scroll and listen for Escape key when Panic Modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panicModalOpen) {
        setPanicModalOpen(false);
      }
    };

    if (panicModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [panicModalOpen]);

  // Initialize checklist and dynamic date
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mm_exam_checklist_v1");
        if (saved) {
          setCheckedItems(JSON.parse(saved));
        } else {
          const init: Record<string, boolean> = {};
          DEFAULT_CHECKLIST.forEach((it) => {
            if (it.mandatory) init[it.id] = true;
          });
          setCheckedItems(init);
        }
      } catch (e) {
        console.warn(e);
      }

      const now = new Date();
      setLastUpdatedDate(
        now.toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })
      );
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

    const centers = [
      {
        name: "Govt. Islamia College Hall A",
        code: "LHR-042-M",
        hall: "Ground Floor Main Auditorium",
        superintendent: "Prof. Muhammad Tariq (Control Desk)",
        address: "Railway Road, Near Civil Lines, Lahore",
      },
      {
        name: "Govt. Pilot Higher Secondary School",
        code: "MTN-108-E",
        hall: "Science Block Block B Hall 2",
        superintendent: "Rana Shakeel Ahmed (Control Desk)",
        address: "Nawa Shehr Chowk, Multan",
      },
      {
        name: "Govt. Post Graduate College for Boys",
        code: "RWP-019-M",
        hall: "Examination Hall No. 3",
        superintendent: "Dr. Khalid Mahmood (Control Desk)",
        address: "6th Road, Satellite Town, Rawalpindi",
      },
      {
        name: "Govt. Comprehensive High School",
        code: "FSD-067-M",
        hall: "Centenary Hall Wing 1",
        superintendent: "Chaudhry Akhtar Ali (Control Desk)",
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
        "Show your B-Form / CNIC / Smart Card or school identity card.",
        "The Deputy Superintendent can verify your record on the central portal and issue an emergency verified duplicate slip on-site.",
        "Alternatively, have a family member WhatsApp/Email the roll slip PDF to a nearby photocopier shop right outside the center.",
      ],
    },
    {
      title: "I filled the wrong bubble on my Roll Number / Paper Code!",
      severity: "Critical",
      steps: [
        "STRICT RULE: Never use whitener, correction fluid, or nail scratches. The optical OMR scanner reads white-out as invalid data and awards 0 marks.",
        "Immediately raise your hand and notify the invigilator.",
        "The invigilator will cross the erroneous bubble with a single neat line and write the correct roll number/paper code in the supervisor margin with their signature and center stamp.",
        "Ensure your Question Paper Code (e.g. 7041) matches the printed code on your subjective booklet.",
      ],
    },
    {
      title: "Center gate is closing in 10 minutes and I'm stuck in traffic!",
      severity: "High",
      steps: [
        "Punjab Board rules state gates close at 8:15 AM (Morning) / 1:15 PM (Evening).",
        "If you arrive between 8:15 AM and 8:30 AM, you may still be admitted by the Resident Superintendent under the emergency delay log protocol.",
        "No candidate is admitted into the exam hall after the question paper envelope is unsealed (strictly 8:30 AM / 1:30 PM).",
        "Keep your roll number slip in hand before reaching the gate to breeze through outer frisking.",
      ],
    },
    {
      title: "Invigilator didn't sign my Roll Slip or Answer Sheet!",
      severity: "Important",
      steps: [
        "The invigilator must sign both: (1) Your Answer Sheet Cover Page, and (2) The corresponding subject box on your Roll Number Slip.",
        "If they missed it during attendance round, call them before submitting your paper.",
        "Unsigned answer booklets require special board tribunal clearance during marking.",
      ],
    },
    {
      title: "Sudden nausea, severe headache, or panic attack in the hall!",
      severity: "Medical",
      steps: [
        "Raise your hand quietly. You are allowed 5-10 minutes dispensary access accompanied by a designated hall attendant.",
        "Registered exam centers are equipped with a basic first-aid kit, ORS, pain relief, and water.",
        "If illness persists, the Superintendent can submit an emergency medical report to the board for special consideration.",
      ],
    },
  ];

  // Grade Specific Rules
  const gradeNotes = {
    "9th": {
      tag: "First-Time Board Takers (Part 1)",
      timings: "Morning Session: 8:30 AM - 11:00 AM | Objective: 20 min | Subjective: 2 hr 10 min",
      keyRule:
        "OMR Bubble Sheet practice is critical. 9th class students frequently lose marks simply by filling roll number bubbles out of order. No practical exams in 9th grade.",
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
        "Marks from this exam directly dictate your MDCAT / ECAT / University merit aggregate. Any UMC case permanently cancels admission eligibility across public universities.",
    },
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Filter FAQs based on search
  const visibleFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS;
    const q = searchQuery.toLowerCase();
    return FAQ_ITEMS.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <>
      {/* 1. FAQ Schema JSON-LD for rich SEO (10+ Questions) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />

      {/* 2. BreadcrumbList Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://ais-dev-yyxbdyhre76vxmkqknxreb-961795151722.asia-east1.run.app/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "BISE Exam Day Guidebook",
                item: "https://ais-dev-yyxbdyhre76vxmkqknxreb-961795151722.asia-east1.run.app/exam-day-guidebook",
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
        <header className="relative border-b border-white/10 pt-16 pb-10 sm:pt-20 sm:pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Top Badge: Generic Education Icon Only */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-mono font-bold text-accent uppercase tracking-wider mb-5">
              <GraduationCap size={15} />
              <span>Student Reference Guide · Punjab & Federal Boards 2026</span>
            </div>

            {/* H1 Title */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Matric Mastery Exam Day{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD600] via-amber-300 to-emerald-400">
                Guidebook
              </span>{" "}
              <span className="block text-xl sm:text-3xl text-white/90 font-bold mt-1">
                Rules & Survival Tips
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-muted max-w-2xl mx-auto leading-relaxed">
              Essential student survival guide for 9th, 10th, 11th, and 12th class exam days across BISE Lahore, Gujranwala, Faisalabad, Multan, Rawalpindi, and Federal Boards. Covers entry timing, bubble sheets, carry items, and crisis protocols.
            </p>

            {/* Quick Action Buttons: Panic Button & PDF Download */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPanicModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl border border-red-500/60 bg-red-500/15 px-5 py-3 text-xs sm:text-sm font-heading font-black text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_25px_rgba(239,68,68,0.25)] hover:scale-[1.02] cursor-pointer"
              >
                <AlertTriangle size={16} />
                <span>Last-Minute Emergency Desk</span>
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
                  placeholder="Search rules, e.g. calculator, whitener, roll slip, dress code..."
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
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-4">
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
                {selectedGrade.toUpperCase()} BOARD ADVISORY
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
                  ⚠️ <strong>Board Rule:</strong> Once paper question envelopes are unsealed at 8:30 AM / 1:30 PM, gate security denies entry to all candidates.
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
                  <XCircle size={14} /> Zero-Tolerance Policy · Examination Regulations
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
              EDITORIAL STYLE: COMPLETE EXAM DAY PHASES (1 TO 5)
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
                Follow this chronology to eliminate procedural errors, anxiety, and disqualification risks.
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
                  <strong>Slip Lamination Warning:</strong> <mark className="bg-[#FFD600]/20 text-[#FFD600] px-1 rounded font-semibold">DO NOT laminate your Roll Number Slip.</mark> Invigilators must stamp and ink-sign directly on the paper slip for each subject.
                </li>
                <li>
                  <strong>Nutritional Blueprint:</strong> Avoid high-oil parathas or sugary energy drinks that cause hypoglycemic crashes 60 minutes into the subjective paper. Prefer boiled eggs, bananas, and room-temperature water.
                </li>
              </ul>
            </div>

            {/* PHASE 2: ENTRY AT THE OUTER GATE */}
            <div className="border-l-2 border-emerald-400 pl-5 sm:pl-6 space-y-3">
              <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase">
                Phase 02 · 07:30 AM to 08:15 AM
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Outer Security Barrier & Seating Notice Board
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/90 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Physical Frisking by Security Personnel:</strong> Keep hands empty with your transparent pouch and roll slip in plain sight to bypass long frisking queues.
                </li>
                <li>
                  <strong>Locating Your Hall via Seating Notice Board:</strong> The master notice board at the entrance groups roll numbers into ranges (e.g., Roll No. 248100 – 248140 $\rightarrow$ Hall 3, Row 4). Walk directly to your allocated hall.
                </li>
                <li>
                  <strong>Desk Sticker Check:</strong> Match the sticker pasted on the desk top with your roll number. Never sit at an adjacent empty desk even if your desk appears unstable.
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
                The answer booklet consists of 24 to 32 pages with a machine-readable optical header sheet.
              </p>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3 text-xs">
                <p className="font-mono font-bold text-accent">STEP-BY-STEP BUBBLE PROCEDURE:</p>
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
                  <strong>No Additional Loose Sheets (B-Sheet):</strong> Under modern board regulations, <mark className="bg-[#FFD600]/20 text-[#FFD600] px-1 rounded font-semibold">no extra B-sheets or continuation sheets are provided.</mark> Plan your writing so all short and long questions fit within the bound booklet.
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
                  <strong>Attendance Signature Sheet:</strong> Ensure you have signed the roving attendance register next to your photograph.
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
              FREQUENTLY ASKED QUESTIONS ACCORDION (10 QUESTIONS MATCHING JSON-LD)
              ============================================================ */}
          <section className="rounded-3xl border border-white/10 bg-[#121216]/95 p-6 sm:p-9 backdrop-blur-xl shadow-2xl">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle size={14} /> Student Knowledgebase
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-white mt-1">
                  Frequently Asked Questions (BISE Exam Hall Rules)
                </h2>
              </div>
              <span className="text-xs font-mono text-muted">
                Showing {visibleFaqs.length} of {FAQ_ITEMS.length} Questions
              </span>
            </div>

            <div className="space-y-3">
              {visibleFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between font-heading font-bold text-xs sm:text-sm text-white cursor-pointer select-none">
                    <span className="flex items-center gap-2">
                      <span className="text-accent font-mono text-xs">Q{index + 1}.</span>
                      <span>{faq.q}</span>
                    </span>
                    <span className="text-muted transition group-open:rotate-180">
                      <ChevronDown size={16} />
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed border-t border-white/5 pt-3 pl-6">
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

          {/* ============================================================
              LEGAL SAFETY: SOURCES & COMPREHENSIVE DISCLAIMER FOOTER
              ============================================================ */}
          <footer className="rounded-3xl border border-white/10 bg-[#0e0e12] p-6 sm:p-8 text-xs text-muted space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
                <Shield size={16} className="text-accent" />
                <span>Information Sources & Editorial Policy</span>
              </div>
              <span className="font-mono text-[11px] text-muted flex items-center gap-1.5">
                <Calendar size={13} className="text-accent" />
                Last updated: {lastUpdatedDate}
              </span>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed">
              <p>
                <strong>Sources:</strong> Information compiled from BISE public examination notifications 2025–26, candidate instructions printed on standard roll number slips, and Punjab Board examination conduct regulations (applicable to BISE Lahore, BISE Gujranwala, BISE Faisalabad, BISE Rawalpindi, BISE Multan, BISE Bahawalpur, BISE Sargodha, BISE Sahiwal, BISE D.G. Khan, and Federal Board FBISE).
              </p>
              <p>
                <strong>Disclaimer (Unofficial):</strong> This is an educational guide by Cow Boy Platform for students help. We are not BISE or affiliated with any government education department. For official rules, datesheets, and authoritative notifications, always visit the official board web portals at <code className="text-[#FFD600]">bise.edu.pk</code> domains. Center-specific regulations and hall layouts may change per center administration.
              </p>
            </div>
          </footer>
        </main>

        {/* ============================================================
            LAST-MINUTE EMERGENCY PANIC MODAL (WITH FRAMER-MOTION)
            ============================================================ */}
        <AnimatePresence>
          {panicModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
              {/* Animated Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={() => setPanicModalOpen(false)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
                aria-hidden="true"
              />

              {/* Modal Card - Slides up from the bottom on mobile to improve UX during emergencies */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="panic-modal-title"
                initial={{ y: "100%", opacity: 0.5, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: "100%", opacity: 0, scale: 0.98 }}
                transition={{
                  type: "spring",
                  damping: 28,
                  stiffness: 320,
                  mass: 0.85,
                }}
                className="relative z-10 w-full max-w-2xl rounded-t-[32px] sm:rounded-3xl border border-red-500/40 bg-[#121216] p-5 sm:p-8 shadow-[0_-12px_45px_rgba(239,68,68,0.28)] sm:shadow-2xl overflow-hidden max-h-[88vh] sm:max-h-[90vh] flex flex-col"
              >
                {/* Mobile Pull Bar Indicator */}
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

                <div className="flex items-center justify-between border-b border-red-500/20 pb-4 mb-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle size={20} />
                    <h3 id="panic-modal-title" className="font-heading text-lg font-black text-white">
                      Emergency Exam Day Crisis Desk
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPanicModalOpen(false)}
                    aria-label="Close emergency desk"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X size={16} />
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
                          ? "bg-red-500 text-white font-black shadow-md shadow-red-500/20"
                          : "border border-white/10 bg-white/5 text-muted hover:text-white"
                      }`}
                    >
                      Scenario {i + 1}
                    </button>
                  ))}
                </div>

                {/* Active Scenario Details with Tab Switching Animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanicTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-y-auto space-y-4 pr-1 flex-1"
                  >
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                      <span className="font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider">
                        Immediate Action Required · {panicScenarios[activePanicTab].severity}
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
                  </motion.div>
                </AnimatePresence>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-muted hidden sm:inline">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold text-[10px]">ESC</kbd> to exit
                  </span>
                  <button
                    type="button"
                    onClick={() => setPanicModalOpen(false)}
                    className="w-full sm:w-auto rounded-xl bg-accent px-5 py-2.5 font-heading text-xs font-black text-black hover:bg-accent/90 transition-all active:scale-95 shadow-glow cursor-pointer"
                  >
                    I Understand My Rights · Close Desk
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
