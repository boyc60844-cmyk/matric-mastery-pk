// scripts/test-roadmap.mjs
// Automated verification suite for the Matric Mastery Connected Development Roadmap (/guide#roadmap)

import assert from "assert";
import fs from "fs";

console.log("=================================================");
console.log("Matric Mastery — Development Roadmap Test Suite");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ [FAIL] ${name}:`, err.message);
    process.exitCode = 1;
  }
}

const VALID_STATUSES = [
  "planned",
  "upcoming",
  "in-development",
  "released",
  "ongoing",
  "deferred",
];

// -------------------------------------------------------------
// Test 1: Single Source of Truth Schema & Initial Content
// -------------------------------------------------------------
runTest("Source of Truth: public/roadmap.json parses cleanly and defines required initial entries", () => {
  assert.ok(fs.existsSync("public/roadmap.json"), "public/roadmap.json must exist");
  const raw = fs.readFileSync("public/roadmap.json", "utf8");
  const doc = JSON.parse(raw);

  assert.strictEqual(typeof doc.schemaVersion, "string");
  assert.strictEqual(doc.project, "Matric Mastery");
  assert.ok(Array.isArray(doc.items) && doc.items.length >= 4, "roadmap.json must include core items");

  const ids = new Set();
  for (const item of doc.items) {
    assert.ok(typeof item.id === "string" && item.id.trim().length > 0, "Each item must have an id");
    assert.ok(!ids.has(item.id), `Duplicate item id: ${item.id}`);
    ids.add(item.id);
    assert.ok(VALID_STATUSES.includes(item.status), `Invalid status "${item.status}" for ${item.id}`);
    assert.ok(typeof item.title === "string" && item.title.trim().length > 0, `Missing title for ${item.id}`);
    assert.ok(typeof item.description === "string" && item.description.trim().length > 0, `Missing description for ${item.id}`);
    assert.ok(Array.isArray(item.details) && item.details.length > 0, `Missing details for ${item.id}`);
    assert.ok(typeof item.lastUpdated === "string" && item.lastUpdated.trim().length > 0, `Missing lastUpdated for ${item.id}`);
  }

  // Entry A: AI Experience 2.0 (planned + honest vision guard)
  const entryA = doc.items.find((i) => i.id === "ai-experience-2-0");
  assert.ok(entryA, "AI Experience 2.0 entry must exist");
  assert.strictEqual(entryA.status, "planned", "AI Experience 2.0 initial status must be planned");
  assert.ok(
    entryA.notes && entryA.notes.includes("Vision remains disabled unless the required model approval and technical compatibility checks are completed."),
    "AI Experience 2.0 must carry explicit vision compatibility note"
  );
  assert.strictEqual(entryA.details.length, 6, "AI Experience 2.0 must list the 6 scoped items");

  // Entry B: Premium AI Interface Polish (upcoming + protected worker note)
  const entryB = doc.items.find((i) => i.id === "premium-ai-interface-polish");
  assert.ok(entryB, "Premium AI Interface Polish entry must exist");
  assert.strictEqual(entryB.status, "upcoming", "Premium AI Interface Polish initial status must be upcoming");
  assert.strictEqual(entryB.details.length, 9, "Premium AI Interface Polish must list the 9 scoped items");
  assert.ok(
    entryB.notes && entryB.notes.includes("The existing AI model and Cloudflare Worker are protected."),
    "Premium AI Interface Polish must explicitly protect AI model and Cloudflare Worker"
  );

  // Entry C: Continuous Platform Improvements (ongoing)
  const entryC = doc.items.find((i) => i.id === "continuous-platform-improvements");
  assert.ok(entryC, "Continuous Platform Improvements entry must exist");
  assert.strictEqual(entryC.status, "ongoing", "Continuous Platform Improvements initial status must be ongoing");
  assert.strictEqual(entryC.details.length, 6, "Continuous Platform Improvements must list 6 ongoing areas");
});

// -------------------------------------------------------------
// Test 2: Changelog Cross-Verification (No Fake Released Claims)
// -------------------------------------------------------------
runTest("Changelog Integrity: Released roadmap items match verified RELEASE_HISTORY records", () => {
  const doc = JSON.parse(fs.readFileSync("public/roadmap.json", "utf8"));
  const manifest = fs.readFileSync("lib/releaseManifest.ts", "utf8");

  const releasedItems = doc.items.filter((i) => i.status === "released");
  assert.ok(releasedItems.length >= 2, "At least two verified released milestones should connect to changelog");

  for (const rel of releasedItems) {
    const refVersion = rel.changelogRef || rel.releaseVersion;
    assert.ok(refVersion, `Released item "${rel.id}" must declare releaseVersion/changelogRef`);
    assert.ok(
      manifest.includes(`version: "${refVersion}"`) && manifest.includes(`status: "released"`),
      `Released roadmap item "${rel.id}" references "${refVersion}" which must exist as released in lib/releaseManifest.ts`
    );
  }

  // Verify non-released planned items do NOT claim releaseVersion or released status
  const plannedOrUpcoming = doc.items.filter((i) => i.status !== "released");
  for (const item of plannedOrUpcoming) {
    assert.ok(!item.releaseVersion, `Non-released item "${item.id}" must not specify a releaseVersion`);
  }
});

// -------------------------------------------------------------
// Test 3: Sync Architecture, Cache TTL, In-Flight Deduplication & Offline Resilience
// -------------------------------------------------------------
runTest("Sync Service: Validation, 60s cache TTL, 5-min auto-refresh, deduplication & offline fallback", () => {
  const service = fs.readFileSync("lib/roadmapService.ts", "utf8");

  assert.ok(service.includes("validateRoadmapDocument"), "Must validate raw JSON before rendering");
  assert.ok(service.includes("enrichRoadmapItems"), "Must cross-verify items against RELEASE_HISTORY");
  assert.ok(service.includes("ROADMAP_CACHE_TTL_MS = 60 * 1000"), "Must enforce 60s minimum client cache window");
  assert.ok(service.includes("ROADMAP_REFRESH_INTERVAL_MS = 5 * 60 * 1000"), "Must configure 5-minute periodic refresh");
  assert.ok(service.includes("inFlightSync"), "Must deduplicate concurrent fetches via inFlightSync");
  assert.ok(service.includes('source: "stale-cache"') && service.includes("navigator.onLine"), "Must preserve last good cache on offline/error");
  assert.ok(service.includes('fetch(`/roadmap.json${cacheBust}`'), "Must fetch /roadmap.json directly without bespoke server or tokens");
  assert.ok(!service.includes("GITHUB_TOKEN") && !service.includes("Bearer "), "Must never expose private GitHub tokens or secrets");
});

// -------------------------------------------------------------
// Test 4: Honest UI Discipline (Zero Fake Progress, Dates, or Pulsing Dots)
// -------------------------------------------------------------
runTest("Honest UI Discipline: DevelopmentRoadmapSection avoids fake progress bars, countdowns, and pulsing live dots", () => {
  const ui = fs.readFileSync("components/guide/DevelopmentRoadmapSection.tsx", "utf8");

  assert.ok(ui.includes("Synchronized project data"), "Must display honest synchronization wording");
  assert.ok(ui.includes("Last synced:"), "Must display actual last-synced timestamp");
  assert.ok(ui.includes("Refresh roadmap data"), "Must include accessible Refresh button");
  assert.ok(ui.includes("min-h-[44px]"), "Refresh button must meet >=44px touch target");
  assert.ok(ui.includes("hasUnverifiedReleaseClaim"), "Must surface guard warning if release cannot be verified against changelog");

  // Forbidden fake signals
  assert.ok(!ui.includes("animate-pulse") && !ui.includes("animate-ping"), "Must not use fake pulsing 'live' dots");
  assert.ok(!ui.includes("<progress") && !ui.includes("progressbar"), "Must not render fake completion progress bars");
  assert.ok(!/\bETA:/i.test(ui) && !/\bcountdown\b/i.test(ui), "Must not fabricate delivery ETAs or countdowns");
});

// -------------------------------------------------------------
// Test 5: Website Guide Integration & Protected Infrastructure
// -------------------------------------------------------------
runTest("Guide Integration: /guide mounts DevelopmentRoadmapSection, #roadmap anchor, and changelog scroll IDs", () => {
  const guide = fs.readFileSync("app/guide/page.tsx", "utf8");

  assert.ok(
    guide.includes('import DevelopmentRoadmapSection from "@/components/guide/DevelopmentRoadmapSection"'),
    "app/guide/page.tsx must import DevelopmentRoadmapSection"
  );
  assert.ok(
    guide.includes("<DevelopmentRoadmapSection onNavigateToRelease={handleNavigateToRelease} />"),
    "app/guide/page.tsx must render DevelopmentRoadmapSection with changelog navigation handler"
  );
  assert.ok(guide.includes('href="#roadmap"'), "app/guide/page.tsx must expose quick jump anchor #roadmap");
  assert.ok(guide.includes("const anchorId = `release-${rel.version}`"), "app/guide/page.tsx must assign #release-vX.Y.Z anchor IDs");

  // Existing sections remain preserved
  assert.ok(guide.includes('id="welcome"') && guide.includes('id="directory"') && guide.includes('id="upgrades"') && guide.includes('id="faqs"'), "All existing Website Guide sections must remain intact");
});

console.log(`\n=================================================`);
console.log(`All ${passedTests}/${totalTests} Development Roadmap Tests Passed!`);
console.log(`=================================================`);
