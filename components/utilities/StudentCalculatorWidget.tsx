"use client";

import React, { useState } from "react";
import {
  Calculator as CalcIcon,
  Percent,
  GraduationCap,
  Calendar,
  Layers,
  RotateCcw,
  Equal,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRightLeft,
} from "lucide-react";
import {
  studentCalculations,
  DEFAULT_PUNJAB_MATRIC_SUBJECTS,
  calculatePunjabBoardGrade,
  AggregateResult,
} from "@/lib/utilities/studentCalculationToolkit";
import { SubjectMarksInput } from "@/lib/utilities/types";

type CalcTab = "aggregate" | "percentage" | "scientific" | "date" | "units";

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
}

const UNIT_CATEGORIES: { id: "pressure" | "energy" | "temperature" | "length" | "mass"; label: string; units: UnitDef[] }[] = [
  {
    id: "pressure",
    label: "Pressure (Gas Laws)",
    units: [
      { id: "atm", name: "Atmosphere", symbol: "atm" },
      { id: "Pa", name: "Pascal", symbol: "Pa" },
      { id: "kPa", name: "Kilopascal", symbol: "kPa" },
      { id: "mmHg", name: "Millimeters of Mercury", symbol: "mmHg" },
      { id: "bar", name: "Bar", symbol: "bar" },
    ],
  },
  {
    id: "energy",
    label: "Energy & Work",
    units: [
      { id: "J", name: "Joule", symbol: "J" },
      { id: "kJ", name: "Kilojoule", symbol: "kJ" },
      { id: "cal", name: "Calorie", symbol: "cal" },
      { id: "kcal", name: "Kilocalorie", symbol: "kcal" },
      { id: "eV", name: "Electronvolt", symbol: "eV" },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    units: [
      { id: "C", name: "Celsius", symbol: "°C" },
      { id: "F", name: "Fahrenheit", symbol: "°F" },
      { id: "K", name: "Kelvin", symbol: "K" },
    ],
  },
  {
    id: "length",
    label: "Length / Distance",
    units: [
      { id: "m", name: "Meter", symbol: "m" },
      { id: "cm", name: "Centimeter", symbol: "cm" },
      { id: "mm", name: "Millimeter", symbol: "mm" },
      { id: "km", name: "Kilometer", symbol: "km" },
      { id: "in", name: "Inch", symbol: "in" },
      { id: "ft", name: "Foot", symbol: "ft" },
    ],
  },
  {
    id: "mass",
    label: "Mass / Weight",
    units: [
      { id: "kg", name: "Kilogram", symbol: "kg" },
      { id: "g", name: "Gram", symbol: "g" },
      { id: "mg", name: "Milligram", symbol: "mg" },
      { id: "lb", name: "Pound", symbol: "lb" },
    ],
  },
];

export default function StudentCalculatorWidget() {
  const [activeTab, setActiveTab] = useState<CalcTab>("aggregate");

  // --- 1. Punjab Board Aggregate Calculator State ---
  const [subjects, setSubjects] = useState<SubjectMarksInput[]>(
    DEFAULT_PUNJAB_MATRIC_SUBJECTS.map((s) => ({
      name: s.name,
      maxMarks: s.maxMarks,
      obtainedMarks: 0,
    }))
  );

  const handleSubjectChange = (
    index: number,
    val: string
  ) => {
    setSubjects((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        obtainedMarks: val === "" ? 0 : Math.max(0, Number(val)),
      };
      return updated;
    });
  };

  const aggregateResult: AggregateResult = studentCalculations.calculateAggregate(subjects);

  const handleResetSubjects = () => {
    setSubjects(
      DEFAULT_PUNJAB_MATRIC_SUBJECTS.map((s) => ({
        name: s.name,
        maxMarks: s.maxMarks,
        obtainedMarks: 0,
      }))
    );
  };

  // --- 2. Percentage Calculator State ---
  const [pObtained, setPObtained] = useState<number | "">("");
  const [pTotal, setPTotal] = useState<number | "">("");

  const [pPercent, setPPercent] = useState<number | "">("");
  const [pValue, setPValue] = useState<number | "">("");

  const [pOldVal, setPOldVal] = useState<number | "">("");
  const [pNewVal, setPNewVal] = useState<number | "">("");

  // --- 3. Scientific Calculator State ---
  const [sciDisplay, setSciDisplay] = useState("0");
  const [sciFormula, setSciFormula] = useState("");
  const [sciMemory, setSciMemory] = useState<number>(0);
  const [isDegree, setIsDegree] = useState(true);

  const handleSciNum = (num: string) => {
    setSciDisplay((prev) => (prev === "0" || prev === "Error" ? num : prev + num));
  };

  const handleSciOp = (op: string) => {
    if (sciDisplay === "Error") return;
    setSciFormula(sciDisplay + " " + op + " ");
    setSciDisplay("0");
  };

  const handleSciClear = () => {
    setSciDisplay("0");
    setSciFormula("");
  };

  const handleSciEqual = () => {
    try {
      if (!sciFormula) return;
      const fullExpr = (sciFormula + sciDisplay)
        .replace(/×/g, "*")
        .replace(/÷/g, "/");
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${fullExpr})`)();
      if (!isFinite(result) || isNaN(result)) {
        setSciDisplay("Error");
      } else {
        setSciDisplay(Number(result.toFixed(8)).toString());
      }
      setSciFormula("");
    } catch {
      setSciDisplay("Error");
    }
  };

  const handleSciFunc = (fn: string) => {
    const val = parseFloat(sciDisplay);
    if (isNaN(val)) return;
    let res = 0;
    switch (fn) {
      case "sin": {
        const rad = isDegree ? (val * Math.PI) / 180 : val;
        res = Math.sin(rad);
        break;
      }
      case "cos": {
        const rad = isDegree ? (val * Math.PI) / 180 : val;
        res = Math.cos(rad);
        break;
      }
      case "tan": {
        const rad = isDegree ? (val * Math.PI) / 180 : val;
        res = Math.tan(rad);
        break;
      }
      case "sqrt":
        res = val < 0 ? NaN : Math.sqrt(val);
        break;
      case "sqr":
        res = val * val;
        break;
      case "log":
        res = val <= 0 ? NaN : Math.log10(val);
        break;
      case "ln":
        res = val <= 0 ? NaN : Math.log(val);
        break;
      case "inv":
        res = val === 0 ? NaN : 1 / val;
        break;
      case "pi":
        res = Math.PI;
        break;
      case "e":
        res = Math.E;
        break;
      default:
        return;
    }
    if (isNaN(res) || !isFinite(res)) {
      setSciDisplay("Error");
    } else {
      setSciDisplay(Number(res.toFixed(8)).toString());
    }
  };

  // --- 4. Date Difference State ---
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const dateDiffResult = studentCalculations.calculateDateDifference(startDate, endDate);

  // Time duration
  const [startTime, setStartTime] = useState("08:30");
  const [endTime, setEndTime] = useState("11:30");
  const durationResult = studentCalculations.calculateTimeDuration(startTime, endTime);

  // --- 5. Unit Converter State ---
  const [unitCategory, setUnitCategory] = useState<"pressure" | "energy" | "temperature" | "length" | "mass">("pressure");
  const activeCategoryDef = UNIT_CATEGORIES.find((c) => c.id === unitCategory) || UNIT_CATEGORIES[0];
  const availableUnits = activeCategoryDef.units;
  const [unitFrom, setUnitFrom] = useState(availableUnits[0].id);
  const [unitTo, setUnitTo] = useState(availableUnits[1]?.id || availableUnits[0].id);
  const [unitValue, setUnitValue] = useState<number | "">(1);

  const handleCategoryChange = (cat: "pressure" | "energy" | "temperature" | "length" | "mass") => {
    setUnitCategory(cat);
    const catDef = UNIT_CATEGORIES.find((c) => c.id === cat) || UNIT_CATEGORIES[0];
    setUnitFrom(catDef.units[0].id);
    setUnitTo(catDef.units[1]?.id || catDef.units[0].id);
  };

  const handleSwapUnits = () => {
    setUnitFrom(unitTo);
    setUnitTo(unitFrom);
  };

  const convertedUnitValue =
    unitValue === ""
      ? 0
      : studentCalculations.convertUnits(Number(unitValue), unitCategory, unitFrom, unitTo);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0E0E12] p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CalcIcon size={16} />
            </span>
            <h2 className="text-lg font-heading font-bold text-white tracking-wide">
              Student Calculation &amp; Aggregate Toolkit
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Official Punjab Board PBCC 40% passing benchmark, percentage,
            scientific calculator and physics/chemistry units.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#141418] p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("aggregate")}
          className={`flex flex-1 min-w-[120px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all active:scale-[0.98] ${
            activeTab === "aggregate"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <GraduationCap size={14} />
          <span>Matric Aggregate</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("percentage")}
          className={`flex flex-1 min-w-[110px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all active:scale-[0.98] ${
            activeTab === "percentage"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Percent size={14} />
          <span>Percentages</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("scientific")}
          className={`flex flex-1 min-w-[110px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all active:scale-[0.98] ${
            activeTab === "scientific"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <CalcIcon size={14} />
          <span>Scientific Calc</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("date")}
          className={`flex flex-1 min-w-[110px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all active:scale-[0.98] ${
            activeTab === "date"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Calendar size={14} />
          <span>Date &amp; Duration</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("units")}
          className={`flex flex-1 min-w-[110px] items-center justify-center gap-1.5 rounded-lg py-2 transition-all active:scale-[0.98] ${
            activeTab === "units"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Layers size={14} />
          <span>Unit Converter</span>
        </button>
      </div>

      {/* TAB 1: PUNJAB BOARD MATRIC AGGREGATE */}
      {activeTab === "aggregate" && (
        <div className="mt-6 space-y-6">
          {/* Summary Scorecard */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#141418] to-[#101014] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Calculated Result (PBCC Standard)
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-mono text-3xl sm:text-4xl font-black text-white tabular-nums">
                    {aggregateResult.totalObtained}
                    <span className="text-xl sm:text-2xl text-neutral-500 font-normal">
                      {" "}
                      / {aggregateResult.totalMax}
                    </span>
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-accent tabular-nums">
                    {aggregateResult.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Grade Badge & 40% Pass Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center rounded-xl border border-accent/30 bg-accent/10 px-4 py-2">
                  <span className="text-[10px] uppercase font-semibold text-accent">
                    Grade
                  </span>
                  <span className="font-mono text-2xl font-black text-accent">
                    {aggregateResult.grade}
                  </span>
                </div>

                <div
                  className={`flex flex-col items-center rounded-xl border px-4 py-2 ${
                    aggregateResult.allSubjectsPassed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold">
                    Status (40% rule)
                  </span>
                  <span className="font-heading font-bold text-base flex items-center gap-1">
                    {aggregateResult.allSubjectsPassed ? (
                      <>
                        <CheckCircle2 size={16} /> PASS
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} /> SUPPLY ({aggregateResult.failedSubjects.length})
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral-400 flex items-center gap-1.5">
              <HelpCircle size={13} className="text-accent shrink-0" />
              <span>
                Punjab Boards Examination Directive: 40% minimum passing mark
                in each compulsory/elective paper (previously 33%).
              </span>
            </p>
          </div>

          {/* Subjects Table */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-heading font-bold text-white">
                Enter Subject Marks (Combined 9th/10th or Part)
              </span>
              <button
                type="button"
                onClick={handleResetSubjects}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors active:scale-95"
              >
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map((sub: SubjectMarksInput, idx: number) => {
                const subPct =
                  sub.maxMarks > 0
                    ? (sub.obtainedMarks / sub.maxMarks) * 100
                    : 0;
                const isSubPassing = subPct >= 40;

                return (
                  <div
                    key={sub.name}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-black/40 p-2.5 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white truncate">
                        {sub.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono tabular-nums">
                        Max: {sub.maxMarks}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={sub.maxMarks}
                        placeholder="0"
                        value={sub.obtainedMarks || ""}
                        onChange={(e) =>
                          handleSubjectChange(idx, e.target.value)
                        }
                        className={`w-16 rounded border px-2 py-1.5 text-center font-mono text-sm text-white tabular-nums focus:outline-none transition-colors ${
                          sub.obtainedMarks > 0 && !isSubPassing
                            ? "border-red-500/50 bg-red-950/20 text-red-300"
                            : "border-white/10 bg-black/60 focus:border-accent"
                        }`}
                      />
                      <span className="text-neutral-500 font-mono tabular-nums">
                        / {sub.maxMarks}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERCENTAGE CALCULATORS */}
      {activeTab === "percentage" && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Marks to Percentage */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs space-y-3">
            <span className="font-heading font-bold text-white text-sm block">
              1. Marks to Percentage
            </span>
            <p className="text-neutral-400 text-[11px]">
              What percentage is your obtained marks out of total?
            </p>

            <div>
              <label className="block text-neutral-400 mb-1">
                Obtained Marks
              </label>
              <input
                type="number"
                placeholder="e.g. 485"
                value={pObtained}
                onChange={(e) =>
                  setPObtained(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 font-mono text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Total Marks</label>
              <input
                type="number"
                placeholder="e.g. 550"
                value={pTotal}
                onChange={(e) =>
                  setPTotal(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 font-mono text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div className="rounded-lg bg-black/40 p-3 text-center border border-white/5">
              <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                Result
              </span>
              <span className="font-mono text-2xl font-black text-accent tabular-nums">
                {typeof pObtained === "number" && typeof pTotal === "number" && pTotal > 0
                  ? `${studentCalculations.calculatePercentage(pObtained, pTotal).percentage}%`
                  : "--"}
              </span>
            </div>
          </div>

          {/* 2. Percentage of Total */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs space-y-3">
            <span className="font-heading font-bold text-white text-sm block">
              2. Percentage of Total
            </span>
            <p className="text-neutral-400 text-[11px]">
              Calculate how many marks correspond to a desired target %
            </p>

            <div>
              <label className="block text-neutral-400 mb-1">
                Percentage (%)
              </label>
              <input
                type="number"
                placeholder="e.g. 85"
                value={pPercent}
                onChange={(e) =>
                  setPPercent(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 font-mono tabular-nums text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                Total Marks Base
              </label>
              <input
                type="number"
                placeholder="e.g. 1100"
                value={pValue}
                onChange={(e) =>
                  setPValue(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 font-mono tabular-nums text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div className="rounded-lg bg-black/40 p-3 text-center border border-white/5">
              <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                Result Marks
              </span>
              <span className="font-mono text-2xl font-black text-accent tabular-nums">
                {typeof pPercent === "number" && typeof pValue === "number" && pValue > 0
                  ? studentCalculations.calculateMarksFromPercentage(pPercent, pValue).marks
                  : "--"}
              </span>
            </div>
          </div>

          {/* 3. Percentage Improvement */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs space-y-3">
            <span className="font-heading font-bold text-white text-sm block">
              3. Score Improvement %
            </span>
            <p className="text-neutral-400 text-[11px]">
              Measure test score growth between sends/terminals
            </p>

            <div>
              <label className="block text-neutral-400 mb-1">
                Previous Score
              </label>
              <input
                type="number"
                placeholder="e.g. 350"
                value={pOldVal}
                onChange={(e) =>
                  setPOldVal(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 font-mono tabular-nums text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                New / Mock Score
              </label>
              <input
                type="number"
                placeholder="e.g. 420"
                value={pNewVal}
                onChange={(e) =>
                  setPNewVal(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 font-mono tabular-nums text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div className="rounded-lg bg-black/40 p-3 text-center border border-white/5">
              <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                Growth Rate
              </span>
              <span className="font-mono text-2xl font-black text-accent tabular-nums">
                {typeof pOldVal === "number" && typeof pNewVal === "number" && pOldVal > 0
                  ? `${((pNewVal - pOldVal) / pOldVal * 100).toFixed(2)}%`
                  : "--"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCIENTIFIC CALCULATOR */}
      {activeTab === "scientific" && (
        <div className="mt-6 flex flex-col items-center">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121216] p-4 shadow-2xl">
            {/* Display */}
            <div className="rounded-xl border border-white/10 bg-black/70 p-4 text-right">
              <div className="h-5 text-xs font-mono text-neutral-400 tabular-nums">
                {sciFormula || " "}
              </div>
              <div className="overflow-x-auto text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight tabular-nums select-all">
                {sciDisplay}
              </div>
            </div>

            {/* Mode & Memory Bar */}
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setIsDegree((v) => !v)}
                className="rounded bg-white/5 px-2.5 py-1 text-accent font-bold hover:bg-white/10 active:scale-95 transition-all"
              >
                {isDegree ? "DEG" : "RAD"}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSciMemory(0)}
                  className="rounded px-1.5 py-0.5 text-neutral-400 hover:text-white active:scale-95 transition-all"
                >
                  MC
                </button>
                <button
                  type="button"
                  onClick={() => setSciDisplay(sciMemory.toString())}
                  className="rounded px-1.5 py-0.5 text-neutral-400 hover:text-white active:scale-95 transition-all"
                >
                  MR
                </button>
                <button
                  type="button"
                  onClick={() => setSciMemory(parseFloat(sciDisplay) || 0)}
                  className="rounded px-1.5 py-0.5 text-neutral-400 hover:text-white active:scale-95 transition-all"
                >
                  MS
                </button>
              </div>
            </div>

            {/* Button Grid */}
            <div className="mt-3 grid grid-cols-5 gap-1.5 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => handleSciFunc("sin")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                sin
              </button>
              <button
                type="button"
                onClick={() => handleSciFunc("cos")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                cos
              </button>
              <button
                type="button"
                onClick={() => handleSciFunc("tan")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                tan
              </button>
              <button
                type="button"
                onClick={() => handleSciFunc("pi")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                π
              </button>
              <button
                type="button"
                onClick={handleSciClear}
                className="rounded bg-red-500/20 text-red-300 py-2.5 hover:bg-red-500/30 active:scale-95 transition-all"
              >
                AC
              </button>

              <button
                type="button"
                onClick={() => handleSciFunc("log")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                log
              </button>
              <button
                type="button"
                onClick={() => handleSciFunc("ln")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                ln
              </button>
              <button
                type="button"
                onClick={() => handleSciFunc("sqrt")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                √
              </button>
              <button
                type="button"
                onClick={() => handleSciFunc("sqr")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                x²
              </button>
              <button
                type="button"
                onClick={() => handleSciOp("÷")}
                className="rounded bg-amber-500/20 text-accent py-2.5 hover:bg-amber-500/30 active:scale-95 transition-all text-sm"
              >
                ÷
              </button>

              <button
                type="button"
                onClick={() => handleSciNum("7")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => handleSciNum("8")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                8
              </button>
              <button
                type="button"
                onClick={() => handleSciNum("9")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                9
              </button>
              <button
                type="button"
                onClick={() => handleSciFunc("inv")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                1/x
              </button>
              <button
                type="button"
                onClick={() => handleSciOp("×")}
                className="rounded bg-amber-500/20 text-accent py-2.5 hover:bg-amber-500/30 active:scale-95 transition-all text-sm"
              >
                ×
              </button>

              <button
                type="button"
                onClick={() => handleSciNum("4")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                4
              </button>
              <button
                type="button"
                onClick={() => handleSciNum("5")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                5
              </button>
              <button
                type="button"
                onClick={() => handleSciNum("6")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                6
              </button>
              <button
                type="button"
                onClick={() => handleSciFunc("e")}
                className="rounded bg-white/5 py-2.5 text-neutral-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                e
              </button>
              <button
                type="button"
                onClick={() => handleSciOp("-")}
                className="rounded bg-amber-500/20 text-accent py-2.5 hover:bg-amber-500/30 active:scale-95 transition-all text-sm"
              >
                -
              </button>

              <button
                type="button"
                onClick={() => handleSciNum("1")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => handleSciNum("2")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => handleSciNum("3")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                3
              </button>
              <button
                type="button"
                onClick={() => handleSciNum(".")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                .
              </button>
              <button
                type="button"
                onClick={() => handleSciOp("+")}
                className="rounded bg-amber-500/20 text-accent py-2.5 hover:bg-amber-500/30 active:scale-95 transition-all text-sm"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => handleSciNum("0")}
                className="col-span-2 rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleSciNum("00")}
                className="rounded bg-black/40 py-2.5 text-white hover:bg-white/10 active:scale-95 transition-all text-sm"
              >
                00
              </button>
              <button
                type="button"
                onClick={handleSciEqual}
                className="col-span-2 rounded bg-accent py-2.5 text-black font-bold hover:bg-amber-400 active:scale-95 transition-all text-sm flex items-center justify-center gap-1 shadow-md"
              >
                <Equal size={16} /> =
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATE DIFFERENCE & DURATION */}
      {activeTab === "date" && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar Date Difference */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs space-y-4">
            <span className="font-heading font-bold text-white text-sm block">
              Exam Calendar Difference
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 text-white font-mono tabular-nums focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 text-white font-mono tabular-nums focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="font-mono text-2xl font-black text-accent block tabular-nums">
                    {dateDiffResult.totalDays}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    Total Days
                  </span>
                </div>
                <div>
                  <span className="font-mono text-2xl font-black text-white block tabular-nums">
                    {dateDiffResult.weeks}w {dateDiffResult.remainingDays}d
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    Weeks &amp; Days
                  </span>
                </div>
                <div>
                  <span className="font-mono text-2xl font-black text-emerald-400 block tabular-nums">
                    {dateDiffResult.calendarMonths}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    Est. Months
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Duration Planner */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs space-y-4">
            <span className="font-heading font-bold text-white text-sm block">
              Study / Paper Duration
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 text-white font-mono tabular-nums focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 text-white font-mono tabular-nums focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-around text-center">
                <div>
                  <span className="font-mono text-2xl font-black text-accent block tabular-nums">
                    {durationResult.hours}h {durationResult.minutes}m
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    Total Duration
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="font-mono text-2xl font-black text-white block tabular-nums">
                    {durationResult.totalMinutes} min
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    In Minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT UNIT CONVERTER */}
      {activeTab === "units" && (
        <div className="mt-6 space-y-5">
          {/* Category Selector */}
          <div className="flex flex-wrap gap-2">
            {UNIT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border active:scale-95 ${
                  unitCategory === cat.id
                    ? "bg-accent text-black border-accent"
                    : "bg-[#141418] border-white/10 text-neutral-300 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Converter Row */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
              {/* From */}
              <div className="md:col-span-3 space-y-2">
                <label className="block text-neutral-400 font-medium">From</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={unitValue}
                    onChange={(e) =>
                      setUnitValue(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 font-mono tabular-nums text-white text-base focus:border-accent focus:outline-none"
                  />
                  <select
                    value={unitFrom}
                    onChange={(e) => setUnitFrom(e.target.value)}
                    className="w-36 rounded border border-white/10 bg-black/60 px-2 py-2 text-white font-mono focus:border-accent focus:outline-none"
                  >
                    {availableUnits.map((u: UnitDef) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                <button
                  type="button"
                  onClick={handleSwapUnits}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 hover:text-accent hover:border-accent transition-all active:scale-90 active:rotate-180 duration-200"
                  title="Swap units"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-3 space-y-2">
                <label className="block text-neutral-400 font-medium">To</label>
                <div className="flex gap-2">
                  <div className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 font-mono tabular-nums text-white text-base overflow-x-auto select-all">
                    {convertedUnitValue.toPrecision(6).replace(/\.?0+$/, "")}
                  </div>
                  <select
                    value={unitTo}
                    onChange={(e) => setUnitTo(e.target.value)}
                    className="w-36 rounded border border-white/10 bg-black/60 px-2 py-2 text-white font-mono focus:border-accent focus:outline-none"
                  >
                    {availableUnits.map((u: UnitDef) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
