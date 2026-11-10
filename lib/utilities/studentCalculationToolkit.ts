/**
 * MATRIC MASTERY - REAL-WORLD UTILITY & INTELLIGENCE SYSTEM
 * Student Calculation Toolkit (Marks, Percentages, Aggregate, Units, Scientific)
 */

import { SubjectMarksInput } from "./types";

export interface AggregateResult {
  totalMax: number;
  totalObtained: number;
  percentage: number;
  grade: string;
  remarks: string;
  allSubjectsPassed: boolean;
  failedSubjects: string[];
}

export const DEFAULT_PUNJAB_MATRIC_SUBJECTS: SubjectMarksInput[] = [
  { name: "English (Compulsory)", maxMarks: 75, obtainedMarks: 0 },
  { name: "Urdu (Compulsory)", maxMarks: 75, obtainedMarks: 0 },
  { name: "Islamiyat / Ethics", maxMarks: 50, obtainedMarks: 0 },
  { name: "Pakistan Studies", maxMarks: 50, obtainedMarks: 0 },
  { name: "Mathematics (Science/Arts)", maxMarks: 75, obtainedMarks: 0 },
  { name: "Physics (Theory 60 + Practical 15)", maxMarks: 75, obtainedMarks: 0 },
  { name: "Chemistry (Theory 60 + Practical 15)", maxMarks: 75, obtainedMarks: 0 },
  { name: "Biology / Computer Science", maxMarks: 75, obtainedMarks: 0 },
];

/**
 * IBCC / PBCC Standard Grading Scale with 40% Minimum Passing Criteria
 */
export function calculatePunjabBoardGrade(percentage: number): { grade: string; remarks: string } {
  if (percentage >= 80) return { grade: "A+", remarks: "Exceptional / Outstanding" };
  if (percentage >= 70) return { grade: "A", remarks: "Excellent Performance" };
  if (percentage >= 60) return { grade: "B", remarks: "Very Good" };
  if (percentage >= 50) return { grade: "C", remarks: "Good Standard" };
  if (percentage >= 40) return { grade: "D", remarks: "Fair / Satisfactory (Passing Benchmark)" };
  return { grade: "U", remarks: "Unsatisfactory (Below PBCC 40% Passing Standard - Second Annual Window)" };
}

export class StudentCalculationToolkit {
  /**
   * 1. Percentage Calculator with mathematical transparency
   */
  public calculatePercentage(obtained: number, total: number): {
    percentage: number;
    formulaText: string;
    isValid: boolean;
    error?: string;
  } {
    if (isNaN(obtained) || isNaN(total)) {
      return { percentage: 0, formulaText: "--", isValid: false, error: "Please enter numeric marks." };
    }
    if (total <= 0) {
      return { percentage: 0, formulaText: "--", isValid: false, error: "Total marks must be greater than zero." };
    }
    if (obtained < 0) {
      return { percentage: 0, formulaText: "--", isValid: false, error: "Obtained marks cannot be negative." };
    }

    const pct = (obtained / total) * 100;
    // Format to 2 decimal places without loss of precision
    const rounded = Math.round(pct * 100) / 100;

    return {
      percentage: rounded,
      formulaText: `(${obtained} ÷ ${total}) × 100 = ${rounded}%`,
      isValid: true,
    };
  }

  /**
   * 2. Marks from Percentage Calculator
   */
  public calculateMarksFromPercentage(percentage: number, total: number): {
    marks: number;
    formulaText: string;
    isValid: boolean;
    error?: string;
  } {
    if (isNaN(percentage) || isNaN(total)) {
      return { marks: 0, formulaText: "--", isValid: false, error: "Please enter valid numeric values." };
    }
    if (total <= 0) {
      return { marks: 0, formulaText: "--", isValid: false, error: "Total marks must be greater than zero." };
    }

    const marks = (percentage / 100) * total;
    const rounded = Math.round(marks * 100) / 100;

    return {
      marks: rounded,
      formulaText: `(${percentage}% ÷ 100) × ${total} = ${rounded} marks`,
      isValid: true,
    };
  }

  /**
   * 3. Punjab Board Aggregate Calculator
   * Strictly enforces the PBCC 40% passing benchmark per subject and overall.
   */
  public calculateAggregate(subjects: SubjectMarksInput[]): AggregateResult {
    let totalMax = 0;
    let totalObtained = 0;
    const failedSubjects: string[] = [];

    subjects.forEach((sub) => {
      const max = Math.max(1, sub.maxMarks || 0);
      const obt = Math.max(0, sub.obtainedMarks || 0);
      totalMax += max;
      totalObtained += obt;

      const subPercentage = (obt / max) * 100;
      // PBCC 40% benchmark
      if (subPercentage < 40) {
        failedSubjects.push(sub.name);
      }
    });

    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 10000) / 100 : 0;
    const { grade, remarks } = calculatePunjabBoardGrade(percentage);

    return {
      totalMax,
      totalObtained,
      percentage,
      grade,
      remarks,
      allSubjectsPassed: failedSubjects.length === 0,
      failedSubjects,
    };
  }

  /**
   * 4. Date Difference Calculator
   */
  public calculateDateDifference(startDateStr: string, endDateStr: string): {
    totalDays: number;
    weeks: number;
    remainingDays: number;
    calendarMonths: number;
    isValid: boolean;
    error?: string;
  } {
    const d1 = new Date(startDateStr);
    const d2 = new Date(endDateStr);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return { totalDays: 0, weeks: 0, remainingDays: 0, calendarMonths: 0, isValid: false, error: "Invalid date format." };
    }

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const calendarMonths = Math.round((totalDays / 30.4375) * 10) / 10;

    return {
      totalDays,
      weeks,
      remainingDays,
      calendarMonths,
      isValid: true,
    };
  }

  /**
   * 5. Time Duration Calculator (e.g. 08:30 to 11:30 exam paper)
   */
  public calculateTimeDuration(startTimeStr: string, endTimeStr: string): {
    totalMinutes: number;
    hours: number;
    minutes: number;
    formatted: string;
    isValid: boolean;
  } {
    try {
      const [sh, sm] = startTimeStr.split(":").map((v) => parseInt(v, 10));
      const [eh, em] = endTimeStr.split(":").map((v) => parseInt(v, 10));

      let startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;

      if (endMin < startMin) {
        // Rollover past midnight
        endMin += 24 * 60;
      }

      const diffMin = endMin - startMin;
      const hours = Math.floor(diffMin / 60);
      const minutes = diffMin % 60;

      return {
        totalMinutes: diffMin,
        hours,
        minutes,
        formatted: `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min${minutes === 1 ? "" : "s"}`,
        isValid: true,
      };
    } catch {
      return {
        totalMinutes: 0,
        hours: 0,
        minutes: 0,
        formatted: "--",
        isValid: false,
      };
    }
  }

  /**
   * 6. Student Unit Conversions (Physics & Chemistry)
   */
  public convertUnits(value: number, category: "temperature" | "length" | "mass" | "energy" | "pressure", fromUnit: string, toUnit: string): number {
    if (isNaN(value)) return 0;
    if (fromUnit === toUnit) return value;

    // Temperature
    if (category === "temperature") {
      let celsius = value;
      if (fromUnit === "F") celsius = ((value - 32) * 5) / 9;
      if (fromUnit === "K") celsius = value - 273.15;

      if (toUnit === "C") return Math.round(celsius * 100) / 100;
      if (toUnit === "F") return Math.round(((celsius * 9) / 5 + 32) * 100) / 100;
      if (toUnit === "K") return Math.round((celsius + 273.15) * 100) / 100;
    }

    // Length (Base: meters)
    const lengthFactors: Record<string, number> = {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
    };
    if (category === "length" && lengthFactors[fromUnit] && lengthFactors[toUnit]) {
      const inMeters = value * lengthFactors[fromUnit];
      return Math.round((inMeters / lengthFactors[toUnit]) * 100000) / 100000;
    }

    // Mass (Base: kilograms)
    const massFactors: Record<string, number> = {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.453592,
    };
    if (category === "mass" && massFactors[fromUnit] && massFactors[toUnit]) {
      const inKg = value * massFactors[fromUnit];
      return Math.round((inKg / massFactors[toUnit]) * 100000) / 100000;
    }

    // Energy (Base: Joules)
    const energyFactors: Record<string, number> = {
      J: 1,
      kJ: 1000,
      cal: 4.184,
      kcal: 4184,
      eV: 1.602176634e-19,
    };
    if (category === "energy" && energyFactors[fromUnit] && energyFactors[toUnit]) {
      const inJoules = value * energyFactors[fromUnit];
      return inJoules / energyFactors[toUnit];
    }

    // Pressure (Base: Pascals)
    const pressureFactors: Record<string, number> = {
      Pa: 1,
      kPa: 1000,
      atm: 101325,
      mmHg: 133.322,
      bar: 100000,
    };
    if (category === "pressure" && pressureFactors[fromUnit] && pressureFactors[toUnit]) {
      const inPa = value * pressureFactors[fromUnit];
      return Math.round((inPa / pressureFactors[toUnit]) * 10000) / 10000;
    }

    return value;
  }
}

export const studentCalculations = new StudentCalculationToolkit();
