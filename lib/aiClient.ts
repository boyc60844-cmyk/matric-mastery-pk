/**
 * Matric Mastery AI — Unified Client Service (v3.8.0)
 *
 * Coordinates between:
 * 1. Cloudflare Workers AI backend (when VITE_AI_WORKER_URL is configured)
 * 2. Transparent Unconfigured State (when awaiting adult-supervised deployment)
 *
 * Free-First Principles:
 * - Text Model: @cf/meta/llama-3.1-8b-instruct-fast (Workers Free sustainable capacity)
 * - Vision Model: @cf/meta/llama-3.2-11b-vision-instruct (kept separate until parent/guardian license acceptance)
 * - Never presents scripted answers as real AI.
 * - Respects the 10,000 Neurons/day free quota.
 * - Zero client-side API keys or token leaks.
 * - Keeps conversation history 100% private in browser LocalStorage.
 */

import { SYSTEM_PROMPT } from "./ai";

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
}

export interface AIStatus {
  state: "ready" | "unconfigured" | "quota_exhausted" | "error";
  provider: "cloudflare-workers-ai" | "none";
  model: string;
  message: string;
  endpoint?: string;
  streamingSupported?: boolean;
  visionEnabled?: boolean;
}

const STORAGE_KEY = "mm_dedicated_ai_chat_v1";
const MAX_LOCAL_MESSAGES = 50;

// Configurable endpoint
export function getWorkerEndpoint(): string | null {
  if (typeof window === "undefined") return null;
  const envUrl = (import.meta as any).env?.VITE_AI_WORKER_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return null;
}

/**
 * Evaluates current AI runtime availability without masking unconfigured or license-gated states
 */
export async function checkAIStatus(): Promise<AIStatus> {
  const workerUrl = getWorkerEndpoint();

  // 1. Check if Cloudflare Worker backend is configured
  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl}/api/ai/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
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
            : `${textM} (Text Active · Vision Pending License Review)`,
          message: data.bindingConfigured
            ? visionEnabled
              ? "Cloudflare Workers AI (Text & Vision, 10,000 Free Daily Neurons) is connected."
              : "Cloudflare Workers AI Text Solver is active (10,000 Free Daily Neurons). Image inference remains paused until adult license review."
            : "Cloudflare Worker endpoint is reachable, but native [ai] binding requires adult-supervised deployment.",
          endpoint: workerUrl,
          streamingSupported: Boolean(data.streamingSupported),
          visionEnabled,
        };
      }
    } catch {
      // Endpoint unreachable
    }
  }

  // 2. Transparent Unconfigured State (No legacy Gemini fallbacks)
  return {
    state: "unconfigured",
    provider: "none",
    model: "@cf/meta/llama-3.1-8b-instruct-fast (Text) · @cf/meta/llama-3.2-11b-vision-instruct (Vision Gated)",
    message:
      "Free-First AI Infrastructure is prepared in worker/index.ts. Live inference requires adult-supervised Cloudflare deployment with VITE_AI_WORKER_URL.",
    streamingSupported: false,
    visionEnabled: false,
  };
}

/**
 * Sends a chat message and streams or resolves the response
 */
export async function sendAIMessage({
  messages,
  image,
  language = "en",
  onChunk,
  signal,
}: {
  messages: AIChatMessage[];
  image?: { mimeType: string; base64: string } | null;
  language?: "en" | "ur";
  onChunk?: (partialText: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const workerUrl = getWorkerEndpoint();

  // 1. If Cloudflare Worker is connected, invoke server-side endpoint
  if (workerUrl) {
    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Request streaming if onChunk is provided and no image is attached
    const shouldStream = Boolean(onChunk) && !image;

    const response = await fetch(`${workerUrl}/api/ai/chat`, {
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

    if (response.status === 429) {
      const errData = await response.json().catch(() => ({}));
      const quotaErr = new Error(
        errData.error || "Cloudflare Free daily limit of 10,000 Neurons has been reached."
      );
      (quotaErr as any).code = "QUOTA_EXHAUSTED";
      throw quotaErr;
    }

    if (response.status === 403) {
      const errData = await response.json().catch(() => ({}));
      const forbiddenErr = new Error(
        errData.error ||
          "Image inference is paused until a parent/guardian reviews and accepts the Meta Llama 3.2 license."
      );
      (forbiddenErr as any).code = errData.code || "FORBIDDEN";
      throw forbiddenErr;
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `AI server returned error ${response.status}`);
    }

    // Handle SSE streaming response if worker returned text/event-stream
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/event-stream") && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              const chunk =
                parsed.response ||
                parsed.text ||
                parsed.choices?.[0]?.delta?.content ||
                "";
              accumulated += chunk;
              if (onChunk) onChunk(accumulated);
            } catch {
              accumulated += dataStr;
              if (onChunk) onChunk(accumulated);
            }
          }
        }
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

  // 2. Unconfigured State: Throw unconfigured error with explicit guidance (No legacy Gemini fallback)
  const unconfiguredError = new Error(
    "Matric Mastery AI backend is prepared in worker/index.ts. Live inference requires adult-supervised Cloudflare deployment with VITE_AI_WORKER_URL."
  );
  (unconfiguredError as any).code = "UNCONFIGURED";
  throw unconfiguredError;
}

// -------------------------------------------------------------
// Local-Only Conversation Storage (Privacy-Guaranteed)
// -------------------------------------------------------------

export function getLocalChatHistory(): AIChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
