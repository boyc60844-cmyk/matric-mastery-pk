/**
 * Matric Mastery AI — Cloudflare Workers AI Backend (v3.8.0)
 *
 * Free-First, Server-Side AI Inference for Punjab Board (Class 9 & 10) Matric Students.
 * Powered by Cloudflare Workers AI native binding (`env.AI`).
 *
 * Model Strategy:
 * - Text-Only Queries: Uses `@cf/meta/llama-3.1-8b-instruct-fast` on Workers Free
 *   (4,119 input Neurons/1M tokens; 34,868 output Neurons/1M tokens -> ~563 realistic
 *   queries/day within the 10,000 daily free Neurons limit; ~6x capacity vs 70B).
 * - Multimodal Image Queries: Separated under `@cf/meta/llama-3.2-11b-vision-instruct`.
 *   Strictly gated by `ENABLE_VISION_MODEL === "true"` so image inference cannot activate
 *   until a parent/guardian has reviewed and accepted Meta's Llama 3.2 license.
 * - Fully configurable via environment variables (`TEXT_MODEL`, `VISION_MODEL`, `AI_MODEL`, `ENABLE_VISION_MODEL`).
 *
 * Privacy, Billing & Security Directives:
 * - Zero Logging of student prompt text, solutions, or uploaded image base64 data.
 * - Server-side only: Browser never touches or holds API tokens.
 * - Client `model` overrides are rejected/ignored to prevent Neuron exhaustion attacks.
 * - Strict schema validation, MIME verification, payload size limits, and CORS enforcement.
 * - Zero paid fallback: Respects Cloudflare Workers 10,000 free daily Neurons allocation
 *   with transparent HTTP 429 responses.
 * - Native SSE streaming support when requested by client.
 */

export interface Env {
  AI: any; // Cloudflare Workers AI binding: [ai] binding = "AI"
  AI_MODEL?: string; // Legacy/global text override
  TEXT_MODEL?: string; // Text model override
  VISION_MODEL?: string; // Vision model override
  ENABLE_VISION_MODEL?: string; // Must be explicitly set to "true" ONLY after adult license acceptance
  ALLOWED_ORIGINS?: string;
}

// Configurable model defaults verified against active Cloudflare Workers AI Free Catalogue
export const DEFAULT_TEXT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";
export const DEFAULT_VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";
export const DEFAULT_AI_MODEL = DEFAULT_TEXT_MODEL;

// Allowed MIME types for educational problem attachments (diagrams, textbook math)
export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Strict input limits
export const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB max request body
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB max image
export const MAX_PROMPT_LENGTH = 2000; // 2,000 characters max per text prompt
export const MAX_OUTPUT_TOKENS = 1024; // 1,024 tokens max generation
export const MAX_MESSAGES_HISTORY = 10; // Keep conversation bounded

export const SYSTEM_PROMPT = `You are Matric Mastery AI, an expert academic tutor for Class 9 and 10 students following the Punjab Curriculum and Textbook Board (PCTB) and Federal Board (FBISE) syllabus in Pakistan.
Subjects covered: Mathematics, Physics, Chemistry, Biology, Computer Science, English Grammar, Urdu, Islamiyat, and Pakistan Studies.

Core Teaching Guidelines:
1. Provide clear, step-by-step educational explanations with formulas, SI units, and worked steps.
2. If given a math equation or physics problem, solve it methodically so the student learns the concept.
3. Be encouraging, patient, and precise. Differentiate between textbook facts and uncertain points.
4. You are an educational study aid, NOT an official board examiner. Do not guarantee exam marks.
5. Never ask for, collect, or process personal student data (CNIC, B-form, phone numbers, roll numbers).
6. Support English and Roman Urdu / Urdu language queries appropriately based on the student's prompt.
7. Keep explanations concise (around 200-350 words) unless a full mathematical derivation is needed.`;

// Default permitted origins for CORS
const DEFAULT_ALLOWED_ORIGINS = [
  "https://matric-mastery-pk.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, "");
}

function getAllowedOrigins(env: Env): string[] {
  if (env.ALLOWED_ORIGINS) {
    return env.ALLOWED_ORIGINS.split(",")
      .map((o) => normalizeOrigin(o))
      .filter(Boolean);
  }
  return DEFAULT_ALLOWED_ORIGINS;
}

function isOriginAllowed(originHeader: string | null, env: Env): boolean {
  if (!originHeader) return true; // Originless requests (curl / server health probes) allowed
  const normalized = normalizeOrigin(originHeader);
  return getAllowedOrigins(env).includes(normalized);
}

function getCorsHeaders(request: Request, env: Env): HeadersInit {
  const originHeader = request.headers.get("Origin");
  const allowed = getAllowedOrigins(env);
  const normalizedOrigin = originHeader ? normalizeOrigin(originHeader) : "";
  const allowOrigin = allowed.includes(normalizedOrigin) ? normalizedOrigin : allowed[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  };
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequestBody {
  messages: ChatMessage[];
  image?: {
    mimeType: string;
    base64: string;
  };
  stream?: boolean;
}

export default {
  async fetch(request: Request, env: Env, ctx?: any): Promise<Response> {
    const originHeader = request.headers.get("Origin");
    const corsAllowed = isOriginAllowed(originHeader, env);
    const corsHeaders = getCorsHeaders(request, env);

    // Enforce CORS allowlist when an explicit browser Origin header is present
    if (!corsAllowed) {
      return new Response(
        JSON.stringify({
          error: "Origin not permitted by Matric Mastery AI CORS policy.",
          code: "CORS_FORBIDDEN",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Vary": "Origin",
            "X-Content-Type-Options": "nosniff",
          },
        }
      );
    }

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const isVisionEnabled = String(env.ENABLE_VISION_MODEL || "false").toLowerCase() === "true";

    // Health / Status check endpoint
    if (url.pathname === "/api/ai/health" || url.pathname === "/health") {
      const isBindingConfigured = Boolean(env.AI);
      const textModel = env.TEXT_MODEL || env.AI_MODEL || DEFAULT_TEXT_MODEL;
      const visionModel = env.VISION_MODEL || DEFAULT_VISION_MODEL;

      return new Response(
        JSON.stringify({
          status: "ok",
          service: "Matric Mastery AI Cloudflare Worker",
          version: "3.8.0",
          models: {
            text: textModel,
            vision: visionModel,
          },
          visionEnabled: isVisionEnabled,
          bindingConfigured: isBindingConfigured,
          freeTierOnly: true,
          freeTierDailyAllocation: "10,000 Neurons",
          streamingSupported: true,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    // Only /api/ai/chat (or /chat) allowed for inference
    if (url.pathname !== "/api/ai/chat" && url.pathname !== "/chat") {
      return new Response(
        JSON.stringify({ error: "Not Found. Use POST /api/ai/chat or GET /api/ai/health" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check Content-Length to reject oversized payloads before parsing
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({
          error: `Payload too large. Maximum allowed size is ${MAX_BODY_BYTES / (1024 * 1024)} MB.`,
          code: "PAYLOAD_TOO_LARGE",
        }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify Content-Type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({
          error: "Invalid Content-Type. Expected application/json.",
          code: "UNSUPPORTED_MEDIA_TYPE",
        }),
        { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body: ChatRequestBody;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Malformed JSON payload.", code: "INVALID_JSON" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check raw serialized length if Content-Length header was absent
    if (JSON.stringify(body).length > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({
          error: `Payload too large. Maximum allowed size is ${MAX_BODY_BYTES / (1024 * 1024)} MB.`,
          code: "PAYLOAD_TOO_LARGE",
        }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validation: Messages
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid request: 'messages' must be a non-empty array.",
          code: "INVALID_MESSAGES",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Bound conversation history length and strip any untrusted client system prompts
    const recentMessages = body.messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .slice(-MAX_MESSAGES_HISTORY);

    if (recentMessages.length === 0) {
      return new Response(
        JSON.stringify({
          error: "At least one user message is required.",
          code: "INVALID_MESSAGE_STRUCTURE",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate individual messages
    for (const msg of recentMessages) {
      if (typeof msg.content !== "string" || msg.content.trim().length === 0) {
        return new Response(
          JSON.stringify({
            error: "Each message must contain a non-empty 'content' string.",
            code: "INVALID_MESSAGE_STRUCTURE",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.content.length > MAX_PROMPT_LENGTH) {
        return new Response(
          JSON.stringify({
            error: `Message content exceeds maximum allowed length of ${MAX_PROMPT_LENGTH} characters.`,
            code: "PROMPT_TOO_LONG",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate image attachment & enforce Adult License Gate
    let rawImageBytes: Uint8Array | null = null;
    if (body.image) {
      if (!isVisionEnabled) {
        return new Response(
          JSON.stringify({
            error:
              "Image inference is currently paused until a parent/guardian reviews and accepts the Meta Llama 3.2 community license and sets ENABLE_VISION_MODEL=true.",
            code: "VISION_PENDING_APPROVAL",
            visionEnabled: false,
            visionModel: env.VISION_MODEL || DEFAULT_VISION_MODEL,
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (typeof body.image.mimeType !== "string" || !ALLOWED_IMAGE_MIME_TYPES.includes(body.image.mimeType)) {
        return new Response(
          JSON.stringify({
            error: `Invalid image type. Allowed types: ${ALLOWED_IMAGE_MIME_TYPES.join(", ")}`,
            code: "INVALID_IMAGE_MIME",
          }),
          { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (typeof body.image.base64 !== "string") {
        return new Response(
          JSON.stringify({
            error: "Image data must be provided as a base64 encoded string.",
            code: "INVALID_IMAGE_BASE64",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      try {
        const cleanBase64 = body.image.base64.replace(/^data:[^;]+;base64,/, "");
        const binaryStr = atob(cleanBase64);
        if (binaryStr.length > MAX_IMAGE_BYTES) {
          return new Response(
            JSON.stringify({
              error: `Image exceeds maximum allowed size of ${MAX_IMAGE_BYTES / (1024 * 1024)} MB.`,
              code: "IMAGE_TOO_LARGE",
            }),
            { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        rawImageBytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          rawImageBytes[i] = binaryStr.charCodeAt(i);
        }
      } catch {
        return new Response(
          JSON.stringify({
            error: "Failed to decode base64 image data.",
            code: "IMAGE_DECODE_ERROR",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Verify Cloudflare Workers AI binding
    if (!env.AI) {
      return new Response(
        JSON.stringify({
          error: "Cloudflare Workers AI binding is not configured in this runtime.",
          code: "BINDING_NOT_CONFIGURED",
          provider: "cloudflare-workers-ai",
          instructions:
            "Add '[ai] binding = \"AI\"' to your wrangler.toml and deploy with 'wrangler deploy'.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Server-controlled model selection (ignores untrusted client model overrides):
    // - Text-only uses configured TEXT_MODEL (@cf/meta/llama-3.1-8b-instruct-fast)
    // - Image queries (only reachable when ENABLE_VISION_MODEL === "true") use VISION_MODEL
    const selectedModel = rawImageBytes
      ? env.VISION_MODEL || DEFAULT_VISION_MODEL
      : env.TEXT_MODEL || env.AI_MODEL || DEFAULT_TEXT_MODEL;

    const wantsStream = Boolean(body.stream) && !rawImageBytes;

    const aiInput: Record<string, any> = rawImageBytes
      ? {
          prompt: `${SYSTEM_PROMPT}\n\n${recentMessages
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n\n")}\n\nASSISTANT:`,
          image: Array.from(rawImageBytes),
          max_tokens: MAX_OUTPUT_TOKENS,
        }
      : {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...recentMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          max_tokens: MAX_OUTPUT_TOKENS,
          ...(wantsStream ? { stream: true } : {}),
        };

    try {
      // Call Cloudflare Workers AI model inference (Free Tier capped at 10,000 Neurons/day; zero paid fallback)
      const aiResponse = await env.AI.run(selectedModel, aiInput);

      // If streaming response from Workers AI
      if (wantsStream && aiResponse instanceof ReadableStream) {
        return new Response(aiResponse, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      }

      // Standard JSON response (supports native { response } and OpenAI-style { choices })
      const responseText =
        aiResponse?.response ||
        aiResponse?.choices?.[0]?.message?.content ||
        aiResponse?.description ||
        aiResponse?.result ||
        "";

      return new Response(
        JSON.stringify({
          response: responseText,
          model: selectedModel,
          created: Date.now(),
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    } catch (err: any) {
      const errMessage = String(err?.message || err).toLowerCase();

      // Check for Cloudflare Free Tier 10,000 Neurons exhaustion / rate limit / billing gate
      if (
        errMessage.includes("429") ||
        errMessage.includes("quota") ||
        errMessage.includes("rate limit") ||
        errMessage.includes("limit exceeded") ||
        errMessage.includes("exhausted") ||
        errMessage.includes("neuron") ||
        errMessage.includes("3036") ||
        errMessage.includes("4006")
      ) {
        return new Response(
          JSON.stringify({
            error:
              "The free daily quota of 10,000 Cloudflare Neurons for Matric Mastery AI has been reached for today. No paid fallback is used.",
            code: "QUOTA_EXHAUSTED",
            quotaExhausted: true,
            resetsAt: "00:00 UTC",
            alternativeResources: [
              { name: "Exam Strategies", href: "/strategies" },
              { name: "Paper Hacks", href: "/paper-hacks" },
              { name: "Past Papers", href: "/past-papers" },
            ],
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Safe error response: never log or leak prompts, images, stack traces, or tokens
      return new Response(
        JSON.stringify({
          error: "An error occurred during model inference. Please try again shortly.",
          code: "INFERENCE_ERROR",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },
};
