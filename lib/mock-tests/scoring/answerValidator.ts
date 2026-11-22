import {
  BankQuestion,
  StudentResponseValue,
} from "@/lib/mock-tests/types";

export function normalizeTextAnswer(raw: string, caseSensitive = false): string {
  let text = raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "")
    .trim();
  if (!caseSensitive) {
    text = text.toLowerCase();
  }
  return text;
}

export function normalizeUnit(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/·|\*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\^/g, "")
    .replace(/²/g, "2")
    .replace(/³/g, "3")
    .replace(/⁻/g, "-")
    .replace(/⁻¹/g, "-1")
    .replace(/⁻²/g, "-2")
    .trim();
}

export function parseNumericInput(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, "");
  if (!cleaned) return null;

  // Support simple fraction forms like "3/4" or "-5/2"
  const fracMatch = /^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/.exec(cleaned);
  if (fracMatch) {
    const num = Number(fracMatch[1]);
    const den = Number(fracMatch[2]);
    if (!Number.isNaN(num) && !Number.isNaN(den) && den !== 0) {
      return num / den;
    }
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isResponseEmpty(response?: StudentResponseValue): boolean {
  if (!response) return true;
  switch (response.kind) {
    case "single_mcq":
      return typeof response.selectedCanonicalIndex !== "number" || response.selectedCanonicalIndex < 0;
    case "multi_select":
      return !Array.isArray(response.selectedCanonicalIndices) || response.selectedCanonicalIndices.length === 0;
    case "true_false":
      return typeof response.value !== "boolean";
    case "fill_blank":
    case "text_response":
      return response.text.trim().length === 0;
    case "numerical":
      return response.valueText.trim().length === 0;
    case "matching":
      return Object.values(response.matches).every((v) => !v || !v.trim());
    case "classification":
      return Object.values(response.assignments).every((v) => !v || !v.trim());
    case "structured_multi_part":
      return Object.values(response.parts).every((p) => !p?.text || !p.text.trim());
    case "diagram_labeling":
      return Object.values(response.labelsByPinId).every((v) => !v || !v.trim());
    default:
      return true;
  }
}

export function checkUnitMatch(userUnit: string, acceptedUnits?: string[]): boolean {
  if (!acceptedUnits || acceptedUnits.length === 0) return true;
  const normUser = normalizeUnit(userUnit);
  if (!normUser) return false;
  return acceptedUnits.some((u) => normalizeUnit(u) === normUser);
}

export function formatCorrectResponseSummary(question: BankQuestion): string {
  switch (question.type) {
    case "single_mcq":
      return question.options[question.correctIndex] ?? "Option key";
    case "multi_select":
      return question.correctIndices.map((i) => question.options[i]).join("; ");
    case "true_false":
      return question.correctBoolean ? "True" : "False";
    case "fill_blank":
      return question.acceptedAnswers[0] ?? "";
    case "matching":
      return question.pairs.map((p) => `${p.left} -> ${p.right}`).join(" | ");
    case "classification":
      return question.items.map((i) => `${i.label}: ${i.correctCategory}`).join(" | ");
    case "numerical":
      return `${question.numericAnswer}${question.requiredUnit ? ` ${question.requiredUnit}` : ""}`;
    case "diagram_labeling":
      return question.pins.map((p) => `#${p.marker}: ${p.correctLabel}`).join(" | ");
    case "short_answer":
    case "extended_response":
      return question.modelAnswer;
    case "proof_derivation":
      return question.modelProofSteps.join(" -> ");
    case "structured_multi_part":
      return question.subParts
        .map((p) =>
          `${p.label} ${
            p.kind === "numerical"
              ? `${p.numericAnswer ?? ""} ${p.acceptedUnits?.[0] ?? ""}`.trim()
              : p.acceptedAnswers?.[0] ?? p.modelAnswer ?? ""
          }`
        )
        .join(" | ");
  }
}

export function formatStudentResponseSummary(
  question: BankQuestion,
  response?: StudentResponseValue
): string {
  if (!response || isResponseEmpty(response)) return "No response submitted";
  switch (response.kind) {
    case "single_mcq":
      return question.type === "single_mcq"
        ? question.options[response.selectedCanonicalIndex] ?? `Option #${response.selectedCanonicalIndex}`
        : String(response.selectedCanonicalIndex);
    case "multi_select":
      return question.type === "multi_select"
        ? response.selectedCanonicalIndices.map((i) => question.options[i]).join("; ")
        : response.selectedCanonicalIndices.join(", ");
    case "true_false":
      return response.value ? "True" : "False";
    case "fill_blank":
    case "text_response":
      return response.text.trim();
    case "numerical":
      return `${response.valueText.trim()}${response.unitText.trim() ? ` ${response.unitText.trim()}` : ""}`;
    case "matching":
      return Object.entries(response.matches)
        .map(([k, v]) => `${k} -> ${v}`)
        .join(" | ");
    case "classification":
      return Object.entries(response.assignments)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ");
    case "diagram_labeling":
      return Object.entries(response.labelsByPinId)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ");
    case "structured_multi_part":
      return Object.entries(response.parts)
        .map(([k, v]) => `${k}: ${v.text}${v.unitText ? ` ${v.unitText}` : ""}`)
        .join(" | ");
  }
}
