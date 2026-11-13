// scripts/test-ai-infrastructure.mjs
// Automated verification suite for Matric Mastery AI (v4.0.0) & Cloudflare Workers AI Infrastructure

import assert from "assert";
import fs from "fs";

console.log("=================================================");
console.log("Matric Mastery AI — Launch Readiness Test Suite (v4.0.0)");
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

// -------------------------------------------------------------
// Test 1: Worker Architecture & Active Free-Sustainable Model System
// -------------------------------------------------------------
runTest("Worker Architecture: Verified active text model (@cf/meta/llama-3.1-8b-instruct-fast) and separated vision model", () => {
  const workerFile = fs.readFileSync("worker/index.ts", "utf8");
  assert.ok(
    workerFile.includes('DEFAULT_TEXT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast"'),
    "Default text model must be @cf/meta/llama-3.1-8b-instruct-fast"
  );
  assert.ok(
    workerFile.includes('DEFAULT_VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct"'),
    "Default vision model must be @cf/meta/llama-3.2-11b-vision-instruct"
  );
  assert.ok(
    workerFile.includes("ENABLE_VISION_MODEL"),
    "Vision model must be explicitly gated via ENABLE_VISION_MODEL"
  );
  assert.ok(
    workerFile.includes("VISION_PENDING_APPROVAL") && workerFile.includes("status: 403"),
    "Worker must reject image requests with HTTP 403 VISION_PENDING_APPROVAL until adult license acceptance"
  );
  assert.ok(
    !workerFile.includes("body.model"),
    "Worker must NOT allow untrusted client body.model overrides"
  );
});

// -------------------------------------------------------------
// Test 1A: Real Wrangler Configuration & Standalone Worker Isolation
// -------------------------------------------------------------
runTest("Wrangler Configuration: Real worker/wrangler.toml targets worker/index.ts with AI binding", () => {
  assert.ok(fs.existsSync("worker/wrangler.toml"), "worker/wrangler.toml must exist");
  const wranglerConfig = fs.readFileSync("worker/wrangler.toml", "utf8");
  assert.ok(
    wranglerConfig.includes('name = "matric-mastery-ai-worker"'),
    "worker/wrangler.toml must define Worker name"
  );
  assert.ok(
    wranglerConfig.includes('main = "index.ts"'),
    "worker/wrangler.toml must point main to index.ts (worker/index.ts)"
  );
  assert.ok(
    wranglerConfig.includes("[ai]") && wranglerConfig.includes('binding = "AI"'),
    "worker/wrangler.toml must configure [ai] binding = \"AI\""
  );
  assert.ok(
    wranglerConfig.includes("workers_dev = true"),
    "worker/wrangler.toml must enable workers_dev = true for standalone workers.dev hosting"
  );
  assert.ok(
    wranglerConfig.includes('TEXT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast"') &&
      wranglerConfig.includes('ENABLE_VISION_MODEL = "false"'),
    "worker/wrangler.toml must configure active text model and keep vision disabled by default"
  );
  assert.ok(
    !wranglerConfig.includes("[assets]") && !wranglerConfig.includes("dist") && !wranglerConfig.includes("vite"),
    "worker/wrangler.toml must NOT configure the main website as the Worker"
  );
  assert.ok(
    !fs.existsSync("wrangler.toml"),
    "Root directory must not configure the main website as a Worker via root wrangler.toml"
  );
});

// -------------------------------------------------------------
// Test 1B: Model Audit: Deprecated models absent across all sources
// -------------------------------------------------------------
runTest("Model Audit: Deprecated models (@cf/meta/llama-3.1-8b-instruct, -fp8, llama-3.2-3b) removed", () => {
  const filesToCheck = [
    "worker/index.ts",
    "worker/wrangler.toml",
    "worker/wrangler.toml.example",
    "lib/aiClient.ts",
    "lib/ai.ts",
    "app/ai/page.tsx",
    "lib/websiteDirectory.ts",
    "lib/guideFaqData.ts",
  ];

  const deprecatedModels = [
    '"@cf/meta/llama-3.1-8b-instruct"',
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    "@cf/meta/llama-3.2-3b-instruct",
    "@cf/meta/llama-3.2-1b-instruct",
  ];

  for (const f of filesToCheck) {
    const content = fs.readFileSync(f, "utf8");
    for (const dep of deprecatedModels) {
      assert.ok(
        !content.includes(dep),
        `File ${f} must not contain deprecated model ${dep}`
      );
    }
  }
});

// -------------------------------------------------------------
// Test 1C: Legacy Engine Removal: Gemini 1.5 Flash completely scrubbed
// -------------------------------------------------------------
runTest("Legacy Engine Removal: Gemini 1.5 Flash completely scrubbed from active codebase", () => {
  const filesToCheck = [
    "worker/index.ts",
    "lib/ai.ts",
    "lib/aiClient.ts",
    "components/DoubtSolverModal.tsx",
    "app/ai/page.tsx",
    "lib/guideFaqData.ts",
    "lib/websiteDirectory.ts",
  ];

  for (const f of filesToCheck) {
    const content = fs.readFileSync(f, "utf8");
    assert.ok(
      !content.includes("gemini-1.5-flash") && !content.includes("Gemini 1.5 Flash"),
      `File ${f} must not contain gemini-1.5-flash or Gemini 1.5 Flash`
    );
  }
});

// -------------------------------------------------------------
// Test 2: Worker Input Validation & Resource Limits
// -------------------------------------------------------------
runTest("Security & Limits: Strict payload size, prompt length, and MIME type validation", () => {
  const workerFile = fs.readFileSync("worker/index.ts", "utf8");

  assert.ok(
    workerFile.includes("MAX_PROMPT_LENGTH = 2000"),
    "Prompt length limit must be defined as 2000 characters"
  );
  assert.ok(
    workerFile.includes("MAX_BODY_BYTES = 5 * 1024 * 1024"),
    "Max body size must be defined as 5 MB"
  );
  assert.ok(
    workerFile.includes("MAX_IMAGE_BYTES = 4 * 1024 * 1024"),
    "Max image size must be defined as 4 MB"
  );
  assert.ok(
    workerFile.includes('"image/jpeg"') &&
      workerFile.includes('"image/png"') &&
      workerFile.includes('"image/webp"'),
    "MIME types must be restricted to JPEG, PNG, and WebP"
  );
  assert.ok(
    workerFile.includes("MAX_OUTPUT_TOKENS = 1024"),
    "Output tokens must be capped at 1024 tokens"
  );
  assert.ok(
    workerFile.includes('m.role === "user" || m.role === "assistant"'),
    "Worker must strip untrusted client system prompts from messages array"
  );
});

// -------------------------------------------------------------
// Test 3: Zero Telemetry & Student Privacy Verification
// -------------------------------------------------------------
runTest("Student Privacy: Zero logging of student queries or image byte data", () => {
  const workerFile = fs.readFileSync("worker/index.ts", "utf8");

  assert.ok(
    !workerFile.includes("console.log(") &&
      !workerFile.includes("console.info(") &&
      !workerFile.includes("console.debug("),
    "Worker must not log student payloads or debug traces"
  );
});

// -------------------------------------------------------------
// Test 4: Free Tier Safeguards & Quota Exhaustion (10,000 Neurons / HTTP 429)
// -------------------------------------------------------------
runTest("Free-First Safeguards: 10,000 Neurons quota exhaustion (HTTP 429) & zero paid fallback", () => {
  const workerFile = fs.readFileSync("worker/index.ts", "utf8");

  assert.ok(
    workerFile.includes("QUOTA_EXHAUSTED"),
    "Worker must define QUOTA_EXHAUSTED error code"
  );
  assert.ok(
    workerFile.includes("10,000 Cloudflare Neurons"),
    "Worker must explicitly reference 10,000 Neurons free quota limit"
  );
  assert.ok(
    workerFile.includes("No paid fallback is used") && workerFile.includes("freeTierOnly: true"),
    "Worker must confirm zero paid fallback and Workers Free mode"
  );
  assert.ok(
    workerFile.includes("status: 429"),
    "Worker must return HTTP 429 status code on quota exhaustion"
  );
});

// -------------------------------------------------------------
// Test 5: Server-Sent Events (SSE) Streaming Support
// -------------------------------------------------------------
runTest("Streaming Architecture: Worker supports native SSE streaming when requested", () => {
  const workerFile = fs.readFileSync("worker/index.ts", "utf8");
  assert.ok(
    workerFile.includes('"text/event-stream"'),
    "Worker must support text/event-stream responses for streaming"
  );

  const clientFile = fs.readFileSync("lib/aiClient.ts", "utf8");
  assert.ok(
    clientFile.includes("stream: shouldStream") &&
      clientFile.includes("text/event-stream"),
    "Client must request streaming when onChunk is provided and parse SSE event streams"
  );
});

// -------------------------------------------------------------
// Test 6: CORS Restrictions & Preflight Support
// -------------------------------------------------------------
runTest("CORS Restrictions: Production origin allowlist, OPTIONS preflight & 403 enforcement", () => {
  const workerFile = fs.readFileSync("worker/index.ts", "utf8");

  assert.ok(
    workerFile.includes('request.method === "OPTIONS"'),
    "Worker must handle OPTIONS preflight requests"
  );
  assert.ok(
    workerFile.includes("CORS_FORBIDDEN") && workerFile.includes("status: 403"),
    "Worker must reject disallowed browser Origin headers with 403 CORS_FORBIDDEN"
  );
  assert.ok(
    workerFile.includes("https://matric-mastery-pk.vercel.app"),
    "Default allowed origins must include production domain"
  );
  assert.ok(
    workerFile.includes("http://localhost:3000"),
    "Default allowed origins must include local dev port 3000"
  );
});

// -------------------------------------------------------------
// Test 7: No Client-Side Credential Leaks
// -------------------------------------------------------------
runTest("Security Audit: No secret tokens or Cloudflare API keys exposed in browser code", () => {
  const clientFiles = [
    "lib/aiClient.ts",
    "lib/ai.ts",
    "app/ai/page.tsx",
    "src/App.tsx",
  ];

  for (const relPath of clientFiles) {
    const content = fs.readFileSync(relPath, "utf8");
    assert.ok(
      !content.includes("CF_API_TOKEN") &&
        !content.includes("CLOUDFLARE_API_KEY") &&
        !content.includes("VITE_GEMINI_API_KEY") &&
        !content.includes("generativelanguage.googleapis.com") &&
        !content.includes("Bearer "),
      `File ${relPath} must not contain hardcoded bearer tokens, Cloudflare secrets, or direct Gemini API keys`
    );
  }
});

// -------------------------------------------------------------
// Test 8: Worker Fallback Endpoint & Authenticity Guards
// -------------------------------------------------------------
runTest("Authenticity & Routing: Uses VITE_AI_WORKER_URL with deployed fallback and no fake answers", () => {
  const clientFile = fs.readFileSync("lib/aiClient.ts", "utf8");

  assert.ok(
    clientFile.includes("https://matric-mastery-ai-worker.boyc60844.workers.dev"),
    "Client must define fallback URL https://matric-mastery-ai-worker.boyc60844.workers.dev"
  );
  assert.ok(
    clientFile.includes("VITE_AI_WORKER_URL"),
    "Client must read VITE_AI_WORKER_URL from environment"
  );
  assert.ok(
    clientFile.includes('"UNCONFIGURED"'),
    "Client must explicitly retain UNCONFIGURED guard when endpoint is unreachable/empty"
  );
  assert.ok(
    !clientFile.includes("quadratic equation ki nature of roots"),
    "Client must not contain hardcoded fake answer strings masquerading as live AI"
  );
});

// -------------------------------------------------------------
// Test 9: Dedicated Route Registration & Navigation
// -------------------------------------------------------------
runTest("Routing & Navigation: /ai route registered in App.tsx and MAIN_NAV_ITEMS", () => {
  const appFile = fs.readFileSync("src/App.tsx", "utf8");
  assert.ok(
    appFile.includes('import AIPage from "@/app/ai/page";'),
    "AIPage must be imported in App.tsx"
  );
  assert.ok(
    appFile.includes('cleanPath === "/ai"'),
    "App.tsx must route cleanPath === '/ai' to AIPage"
  );

  const navFile = fs.readFileSync("lib/navigation.ts", "utf8");
  assert.ok(
    navFile.includes('href: "/ai"'),
    "MAIN_NAV_ITEMS must include /ai navigation item"
  );

  const dirFile = fs.readFileSync("lib/websiteDirectory.ts", "utf8");
  assert.ok(
    dirFile.includes('id: "ai"') && dirFile.includes('href: "/ai"'),
    "lib/websiteDirectory.ts must document /ai module"
  );
});

// -------------------------------------------------------------
// Test 10: Conversation Storage Bounding & Export Payload
// -------------------------------------------------------------
runTest("Client Privacy & Storage: History bounded to 50 items and JSON export payload is formatted", () => {
  const clientFile = fs.readFileSync("lib/aiClient.ts", "utf8");

  assert.ok(
    clientFile.includes("MAX_LOCAL_MESSAGES = 50"),
    "Local history must be bounded to 50 messages"
  );
  assert.ok(
    clientFile.includes("exportChatHistoryAsJSON"),
    "Client must export conversation history as JSON"
  );
});

// -------------------------------------------------------------
// Test 11: Release Version Consistency (v4.0.0 & Preserved History)
// -------------------------------------------------------------
runTest("Release Management: v4.0.0 synchronized across manifest, package, and guide without erasing history", () => {
  const manifestFile = fs.readFileSync("lib/releaseManifest.ts", "utf8");
  assert.ok(
    manifestFile.includes('CURRENT_VERSION = "v4.0.0"') &&
      manifestFile.includes('version: "v4.0.0"'),
    "lib/releaseManifest.ts must define CURRENT_VERSION and history entry for v4.0.0"
  );

  // Confirm all historical versions remain intact
  const historicalVersions = ["v3.9.0", "v3.8.0", "v3.7.0", "v3.6.0", "v3.5.0", "v3.4.0", "v3.3.0", "v3.1.0"];
  for (const v of historicalVersions) {
    assert.ok(
      manifestFile.includes(`version: "${v}"`),
      `Historical release ${v} must remain intact in RELEASE_HISTORY`
    );
  }

  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  assert.strictEqual(pkg.version, "4.0.0", "package.json version must be 4.0.0");

  const faqFile = fs.readFileSync("lib/guideFaqData.ts", "utf8");
  assert.ok(
    faqFile.includes("v4.0.0"),
    "lib/guideFaqData.ts must reflect v4.0.0"
  );

  const envExample = fs.readFileSync(".env.example", "utf8");
  assert.ok(
    envExample.includes("VITE_AI_WORKER_URL="),
    ".env.example must document VITE_AI_WORKER_URL"
  );
});

// -------------------------------------------------------------
// Test 12: Revamped /ai UI Quality, Independent Scroll & Free Access Transparency
// -------------------------------------------------------------
runTest("AI Workspace UI: Independent transcript scroll, educational guides, Free AI Access & safety guards", () => {
  const aiPage = fs.readFileSync("app/ai/page.tsx", "utf8");
  assert.ok(
    !aiPage.includes("DoubtOrb3D"),
    "app/ai/page.tsx must not render heavy WebGL DoubtOrb3D"
  );
  assert.ok(
    !aiPage.includes("window.confirm"),
    "app/ai/page.tsx must not use blocking window.confirm dialogs"
  );
  assert.ok(
    aiPage.includes("status.visionEnabled &&"),
    "app/ai/page.tsx must gate image upload controls behind backend status.visionEnabled"
  );
  assert.ok(
    aiPage.includes("آپ کے AI استعمال کی عارضی حد پوری ہو گئی ہے"),
    "app/ai/page.tsx must include student-friendly Urdu rate-limit guidance"
  );
  assert.ok(
    aiPage.includes('id="ai-transcript-scroll"') &&
      aiPage.includes("overscroll-y-contain") &&
      aiPage.includes("shouldAutoScrollRef"),
    "app/ai/page.tsx must implement dedicated independent transcript scroll with overscroll containment and scroll-position preservation"
  );
  assert.ok(
    aiPage.includes("Free AI Access — Usage Information") &&
      aiPage.includes("Your personal AI study assistant for Punjab Board Class 9–10."),
    "app/ai/page.tsx must include required introduction and Free AI Access usage section"
  );

  const floatingBtn = fs.readFileSync("components/FloatingDoubtButton.tsx", "utf8");
  assert.ok(
    floatingBtn.includes("isDedicatedAIPage"),
    "FloatingDoubtButton must hide on /ai to prevent overlapping the mobile input composer"
  );
});

console.log(`\n=================================================`);
console.log(`All ${passedTests}/${totalTests} Launch Readiness Tests Passed!`);
console.log(`=================================================`);
