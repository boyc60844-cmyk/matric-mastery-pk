/**
 * Matric Mastery AI — Unified Client Service (v3.9.0)
 *
 * Coordinates all AI requests through the Cloudflare Workers AI backend:
 * - Uses VITE_AI_WORKER_URL from environment when configured
 * - Automatically falls back to https://matric-mastery-ai-worker.boyc60844.workers.dev
 * - Never calls Google Gemini APIs directly
 * - Respects Cloudflare Workers Free (10,000 Neurons/day) without paid fallback
 * - Keeps conversation history strictly in browser LocalStorage
 */

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  image?: {
    previewUrl: string;
    mimeType: string;
    base64: string;
  };
  subject?: string;
  error?: boolean;
  errorKind?: AIErrorKind;
  resetsAt?: string;
}

export type AIErrorKind =
  | "rate_limit"
  | "network"
  | "server"
  | "invalid"
  | "vision_paused"
  | "unconfigured";

export interface AIStatus {
  state: "ready" | "unconfigured" | "quota_exhausted" | "error";
  provider: "cloudflare-workers-ai" | "none";
  model: string;
  message: string;
  endpoint?: string;
  streamingSupported?: boolean;
  visionEnabled?: boolean;
}

export class AIRequestError extends Error {
  code: string;
  kind: AIErrorKind;
  statusCode?: number;
  resetsAt?: string;

  constructor({
    message,
    code,
    kind,
    statusCode,
    resetsAt,
  }: {
    message: string;
    code: string;
    kind: AIErrorKind;
    statusCode?: number;
    resetsAt?: string;
  }) {
    super(message);
    this.name = "AIRequestError";
    this.code = code;
    this.kind = kind;
    this.statusCode = statusCode;
    this.resetsAt = resetsAt;
  }
}

const STORAGE_KEY = "mm_dedicated_ai_chat_v1";
const MAX_LOCAL_MESSAGES = 50;
const MAX_WORKER_HISTORY = 10;
const MAX_WORKER_MESSAGE_CHARS = 2000;

export const DEFAULT_AI_WORKER_URL =
  "https://matric-mastery-ai-worker.boyc60844.workers.dev";

// Configurable endpoint (uses VITE_AI_WORKER_URL from env, falls back to deployed Worker URL)
export function getWorkerEndpoint(): string {
  const envUrl =
    typeof import.meta !== "undefined"
      ? (import.meta as any).env?.VITE_AI_WORKER_URL
      : undefined;
  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return DEFAULT_AI_WORKER_URL;
}

/**
 * Evaluates current AI runtime availability using GET /api/ai/health
 */
export async function checkAIStatus(): Promise<AIStatus> {
  const workerUrl = getWorkerEndpoint();

  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl}/api/ai/health`, {
        method: "GET",
      });

      if (res.status === 429) {
        return {
          state: "quota_exhausted",
          provider: "cloudflare-workers-ai",
          model: "@cf/meta/llama-3.1-8b-instruct-fast",
          message: "Daily free AI usage limit reached.",
          endpoint: workerUrl,
          streamingSupported: true,
          visionEnabled: false,
        };
      }

      if (res.ok) {
        const data = await res.json();
        const textM = data.models?.text || "@cf/meta/llama-3.1-8b-instruct-fast";
        const visionM = data.models?.vision || "@cf/meta/llama-3.2-11b-vision-instruct";
        const visionEnabled = Boolean(data.visionEnabled);

        return {
          state: data.bindingConfigured ? "ready" : "unconfigured",
          provider: "cloudflare-workers-ai",
          model: visionEnabled
            ? `${textM} (Text) & ${visionM} (Vision)`
            : textM,
          message: data.bindingConfigured
            ? "Connected to Matric Mastery AI (Free Tier)"
            : "AI backend reachable; Workers AI binding is pending setup.",
          endpoint: workerUrl,
          streamingSupported: Boolean(data.streamingSupported),
          visionEnabled,
        };
      }

      return {
        state: "error",
        provider: "cloudflare-workers-ai",
        model: "@cf/meta/llama-3.1-8b-instruct-fast",
        message: "Temporary issue reaching the AI service.",
        endpoint: workerUrl,
        streamingSupported: false,
        visionEnabled: false,
      };
    } catch {
      return {
        state: "error",
        provider: "cloudflare-workers-ai",
        model: "@cf/meta/llama-3.1-8b-instruct-fast",
        message: "Unable to reach the AI service right now.",
        endpoint: workerUrl,
        streamingSupported: false,
        visionEnabled: false,
      };
    }
  }

  return {
    state: "unconfigured",
    provider: "none",
    model: "@cf/meta/llama-3.1-8b-instruct-fast",
    message: "AI backend endpoint is not configured.",
    streamingSupported: false,
    visionEnabled: false,
  };
}

/**
 * Formats outgoing conversation turns so history respects Worker 10-message & 2000-char limits
 * and passes concise syllabus / Urdu academic terminology guidance when selected.
 */
function buildWorkerMessagesPayload(
  messages: AIChatMessage[],
  language: "en" | "ur",
  subject?: string
): Array<{ role: "user" | "assistant"; content: string }> {
  const validMessages = messages
    .filter((m) => !m.error && typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-MAX_WORKER_HISTORY);

  const lastUserIdx = validMessages.reduce(
    (acc, m, idx) => (m.role === "user" ? idx : acc),
    -1
  );

  return validMessages.map((m, idx) => {
    let text = m.content.trim();

    if (idx === lastUserIdx && m.role === "user") {
      const directives: string[] = [];
      if (subject && subject !== "General") {
        directives.push(`Subject: ${subject} (Punjab Board / FBISE Class 9-10)`);
      }
      if (language === "ur") {
        directives.push(
          "Respond in clear Pakistani Urdu (اردو) using accurate academic terms (مساوات, عبارت, متغیر, عددی سر, حل, تجزیہ, قوت, تعجیل, ضیائی تالیف). Keep mathematical formulas clear and short, logical steps."
        );
      }

      if (directives.length > 0) {
        const prefix = `[${directives.join(". ")}]\n`;
        if (prefix.length + text.length <= MAX_WORKER_MESSAGE_CHARS) {
          text = `${prefix}${text}`;
        }
      }
    }

    if (text.length > MAX_WORKER_MESSAGE_CHARS) {
      text = `${text.slice(0, MAX_WORKER_MESSAGE_CHARS - 3)}...`;
    }

    return {
      role: m.role,
      content: text,
    };
  });
}

/**
 * Sends a chat message to the Cloudflare Worker and streams or resolves the response
 */
export async function sendAIMessage({
  messages,
  image,
  language = "en",
  subject,
  onChunk,
  signal,
}: {
  messages: AIChatMessage[];
  image?: { mimeType: string; base64: string } | null;
  language?: "en" | "ur";
  subject?: string;
  onChunk?: (partialText: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const workerUrl = getWorkerEndpoint();

  if (!workerUrl) {
    throw new AIRequestError({
      message: "Matric Mastery AI backend is not configured.",
      code: "UNCONFIGURED",
      kind: "unconfigured",
    });
  }

  const formattedMessages = buildWorkerMessagesPayload(messages, language, subject);
  if (formattedMessages.length === 0) {
    throw new AIRequestError({
      message: "Please enter a question before sending.",
      code: "INVALID_MESSAGES",
      kind: "invalid",
      statusCode: 400,
    });
  }

  // Request streaming when onChunk is provided and no image is attached
  const shouldStream = Boolean(onChunk) && !image;

  let response: Response;
  try {
    response = await fetch(`${workerUrl}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: formattedMessages,
        image: image || undefined,
        stream: shouldStream,
      }),
      signal,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw err;
    }
    throw new AIRequestError({
      message:
        language === "ur"
          ? "انٹرنیٹ کنکشن میں مسئلہ ہے۔ براہ کرم اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔"
          : "Connection issue while reaching Matric Mastery AI. Please check your internet connection and try again.",
      code: "NETWORK_ERROR",
      kind: "network",
    });
  }

  if (response.status === 429) {
    const errData = await response.json().catch(() => ({}));
    throw new AIRequestError({
      message:
        language === "ur"
          ? "آپ کے AI استعمال کی عارضی حد پوری ہو گئی ہے۔ تھوڑی دیر بعد دوبارہ کوشش کریں۔ آپ کا سوال محفوظ ہے تو اسے دوبارہ بھیج سکتے ہیں۔"
          : "Free AI usage limit reached for now. Your question is saved — please try again shortly.",
      code: "QUOTA_EXHAUSTED",
      kind: "rate_limit",
      statusCode: 429,
      resetsAt: typeof errData.resetsAt === "string" ? errData.resetsAt : undefined,
    });
  }

  if (response.status === 403) {
    const errData = await response.json().catch(() => ({}));
    const isVisionPaused = errData.code === "VISION_PENDING_APPROVAL";
    throw new AIRequestError({
      message: isVisionPaused
        ? language === "ur"
          ? "تصویری سوالات ابھی فعال نہیں ہیں۔ براہ کرم اپنا سوال متن میں لکھ کر پوچھیں۔"
          : "Image-based questions are not active yet. Please type your question in text instead."
        : language === "ur"
          ? "یہ درخواست پراسیس نہیں ہو سکی۔ براہ کرم صفحہ ریفریش کر کے دوبارہ کوشش کریں۔"
          : "This request could not be processed from this origin.",
      code: errData.code || "FORBIDDEN",
      kind: isVisionPaused ? "vision_paused" : "invalid",
      statusCode: 403,
    });
  }

  if (response.status >= 500) {
    const errData = await response.json().catch(() => ({}));
    throw new AIRequestError({
      message:
        language === "ur"
          ? "سرور میں عارضی خرابی ہے۔ براہ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔"
          : "Matric Mastery AI is experiencing a temporary server issue. Please try again in a moment.",
      code: errData.code || "SERVER_ERROR",
      kind: "server",
      statusCode: response.status,
    });
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new AIRequestError({
      message:
        language === "ur"
          ? "آپ کا سوال پراسیس نہیں ہو سکا۔ براہ کرم سوال کو مختصر (2000 حروف سے کم) اور واضح لکھ کر دوبارہ بھیجیں۔"
          : "Your question could not be processed. Please keep your message under 2,000 characters and try again.",
      code: errData.code || "INVALID_REQUEST",
      kind: "invalid",
      statusCode: response.status,
    });
  }

  // Handle SSE streaming response if worker returned text/event-stream
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/event-stream") && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let buffer = "";

    const processLine = (rawLine: string): boolean => {
      const trimmed = rawLine.trim();
      if (!trimmed.startsWith("data: ")) return false;
      const dataStr = trimmed.slice(6).trim();
      if (!dataStr) return false;
      if (dataStr === "[DONE]") return true;

      try {
        const parsed = JSON.parse(dataStr);
        const chunk =
          parsed.response ||
          parsed.text ||
          parsed.choices?.[0]?.delta?.content ||
          "";
        if (chunk) {
          accumulated += chunk;
          if (onChunk) onChunk(accumulated);
        }
      } catch {
        accumulated += dataStr;
        if (onChunk) onChunk(accumulated);
      }
      return false;
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.trim()) {
          processLine(buffer);
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      let reachedDone = false;
      for (const line of lines) {
        if (processLine(line)) {
          reachedDone = true;
          break;
        }
      }
      if (reachedDone) break;
    }

    if (accumulated.trim()) return accumulated;
  }

  // Standard JSON response fallback
  const data = await response.json();
  const resultText =
    data.response ||
    data.choices?.[0]?.message?.content ||
    data.text ||
    "";
  if (onChunk) onChunk(resultText);
  return resultText;
}

// -------------------------------------------------------------
// Local-Only Conversation Storage (Privacy-Guaranteed)
// -------------------------------------------------------------

export function getLocalChatHistory(): AIChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        m &&
        typeof m.id === "string" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );
  } catch {
    return [];
  }
}

export function saveLocalChatHistory(messages: AIChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    const bounded = messages.slice(-MAX_LOCAL_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bounded));
    window.dispatchEvent(new Event("mm_ai_chat_updated"));
  } catch (err) {
    console.warn("Failed to persist local chat history:", err);
  }
}

export function clearLocalChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("mm_ai_chat_updated"));
  } catch (err) {
    console.warn("Failed to clear local chat history:", err);
  }
}

export function exportChatHistoryAsJSON(messages: AIChatMessage[]): string {
  const exportPayload = {
    title: "Matric Mastery AI Study Session",
    exportedAt: new Date().toISOString(),
    messageCount: messages.length,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: new Date(m.timestamp).toLocaleString(),
      subject: m.subject || "General",
    })),
  };
  return JSON.stringify(exportPayload, null, 2);
}
