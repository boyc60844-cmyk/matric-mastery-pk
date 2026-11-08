import fs from "fs";

export function extractData(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const start = content.indexOf("const PRESERVED_ORIGINAL_ITEMS");
  const end = content.indexOf("export default function");
  if (start === -1 || end === -1) {
    throw new Error(`Could not find data boundaries in ${filePath}`);
  }
  const js = content.slice(start, end)
    .replace(/: Array<[\s\S]*?>/g, "")
    .replace(/: LegalCenterSection\[\]/g, "")
    .replace(/: PolicyCategory/g, "")
    .replace(/: Record<string, boolean>/g, "")
    .replace(/: string\[\]/g, "")
    .replace(/: string/g, "")
    .replace(/: boolean/g, "")
    .replace(/: number/g, "");

  const fn = new Function(js + "; return { PRESERVED_ORIGINAL_ITEMS, LEGAL_CENTER_SECTIONS, COMPREHENSIVE_CHANGELOG };");
  return fn();
}

export function compareCorpus(baseline, current) {
  const errors = [];

  // 1. Foundational Items
  if (baseline.PRESERVED_ORIGINAL_ITEMS.length !== current.PRESERVED_ORIGINAL_ITEMS.length) {
    errors.push(`PRESERVED_ORIGINAL_ITEMS count mismatch: expected ${baseline.PRESERVED_ORIGINAL_ITEMS.length}, got ${current.PRESERVED_ORIGINAL_ITEMS.length}`);
  } else {
    baseline.PRESERVED_ORIGINAL_ITEMS.forEach((bItem, idx) => {
      const cItem = current.PRESERVED_ORIGINAL_ITEMS[idx];
      if (bItem.id !== cItem.id) errors.push(`Original Item [${idx}] id mismatch: "${bItem.id}" vs "${cItem.id}"`);
      if (bItem.number !== cItem.number) errors.push(`Original Item [${bItem.id}] number mismatch: "${bItem.number}" vs "${cItem.number}"`);
      if (bItem.title !== cItem.title) errors.push(`Original Item [${bItem.id}] title mismatch`);
      if (bItem.shortSummary !== cItem.shortSummary) errors.push(`Original Item [${bItem.id}] shortSummary mismatch`);
      if (bItem.lastUpdated !== cItem.lastUpdated) errors.push(`Original Item [${bItem.id}] lastUpdated mismatch`);
      
      if (bItem.paragraphs.length !== cItem.paragraphs.length) {
        errors.push(`Original Item [${bItem.id}] paragraphs count mismatch: ${bItem.paragraphs.length} vs ${cItem.paragraphs.length}`);
      } else {
        bItem.paragraphs.forEach((p, pIdx) => {
          if (p !== cItem.paragraphs[pIdx]) {
            errors.push(`Original Item [${bItem.id}] paragraph ${pIdx} mismatch:\n  EXPECTED: ${p}\n  RECEIVED: ${cItem.paragraphs[pIdx]}`);
          }
        });
      }
    });
  }

  // 2. Comprehensive Sections
  if (baseline.LEGAL_CENTER_SECTIONS.length !== current.LEGAL_CENTER_SECTIONS.length) {
    errors.push(`LEGAL_CENTER_SECTIONS count mismatch: expected ${baseline.LEGAL_CENTER_SECTIONS.length}, got ${current.LEGAL_CENTER_SECTIONS.length}`);
  } else {
    baseline.LEGAL_CENTER_SECTIONS.forEach((bSec, idx) => {
      const cSec = current.LEGAL_CENTER_SECTIONS[idx];
      if (bSec.id !== cSec.id) errors.push(`Section [${idx}] id mismatch: "${bSec.id}" vs "${cSec.id}"`);
      if (bSec.number !== cSec.number) errors.push(`Section [${bSec.id}] number mismatch`);
      if (bSec.title !== cSec.title) errors.push(`Section [${bSec.id}] title mismatch`);
      if (bSec.shortSummary !== cSec.shortSummary) errors.push(`Section [${bSec.id}] shortSummary mismatch`);
      if (bSec.lastUpdated !== cSec.lastUpdated) errors.push(`Section [${bSec.id}] lastUpdated mismatch`);

      // Compare flat paragraphs
      const bParas = bSec.paragraphs || [];
      const cParas = cSec.paragraphs || [];
      if (bParas.length !== cParas.length) {
        errors.push(`Section [${bSec.id}] flat paragraphs length mismatch: ${bParas.length} vs ${cParas.length}`);
      } else {
        bParas.forEach((p, pIdx) => {
          if (p !== cParas[pIdx]) errors.push(`Section [${bSec.id}] flat paragraph ${pIdx} mismatch`);
        });
      }

      // Compare subsections
      const bSubs = bSec.subsections || [];
      const cSubs = cSec.subsections || [];
      if (bSubs.length !== cSubs.length) {
        errors.push(`Section [${bSec.id}] subsections count mismatch: ${bSubs.length} vs ${cSubs.length}`);
      } else {
        bSubs.forEach((sub, sIdx) => {
          const cSub = cSubs[sIdx];
          if (sub.subtitle !== cSub.subtitle) {
            errors.push(`Section [${bSec.id}] Sub [${sIdx}] subtitle mismatch:\n  EXPECTED: ${sub.subtitle}\n  RECEIVED: ${cSub.subtitle}`);
          }
          if (sub.paragraphs.length !== cSub.paragraphs.length) {
            errors.push(`Section [${bSec.id}] Sub [${sub.subtitle}] paragraphs count mismatch: ${sub.paragraphs.length} vs ${cSub.paragraphs.length}`);
          } else {
            sub.paragraphs.forEach((p, pIdx) => {
              if (p !== cSub.paragraphs[pIdx]) {
                errors.push(`Section [${bSec.id}] Sub [${sub.subtitle}] paragraph ${pIdx} mismatch:\n  EXPECTED: ${p}\n  RECEIVED: ${cSub.paragraphs[pIdx]}`);
              }
            });
          }
        });
      }
    });
  }

  // 3. Changelog
  if (baseline.COMPREHENSIVE_CHANGELOG.length !== current.COMPREHENSIVE_CHANGELOG.length) {
    errors.push(`COMPREHENSIVE_CHANGELOG length mismatch`);
  }

  return errors;
}

// Self-test
const base = extractData("app/legal/baseline.snapshot.tsx");
const cur = extractData("app/legal/page.tsx");
const errs = compareCorpus(base, cur);
if (errs.length === 0) {
  console.log("✓ Baseline snapshot self-test passed: 100% identical data integrity.");
} else {
  console.error("Discrepancies found:", errs);
  process.exit(1);
}
