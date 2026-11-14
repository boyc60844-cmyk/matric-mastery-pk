/**
 * Matric Mastery AI — Unified Client Service (v4.1.0)
 *
 * Coordinates all AI requests through the Cloudflare Workers AI backend:
 * - Uses VITE_AI_WORKER_URL from environment when configured
 * - Automatically falls back to https://matric-mastery-ai-worker.boyc60844.workers.dev
 * - Never calls Google Gemini APIs directly
 * - Respects Cloudflare Workers Free (10,000 Neurons/day) without paid fallback
 * - Keeps conversation history & preferences strictly in browser LocalStorage
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

export type AIClassLevel = "9" | "10";
export type AIExplanationLength = "short" | "balanced" | "detailed";
export type AIPresentationStyle = "step-by-step" | "exam-style" | "conceptual";

export interface AIPreferences {
  language: "en" | "ur";
  classLevel: AIClassLevel;
  explanationLength: AIExplanationLength;
  presentationStyle: AIPresentationStyle;
}

export interface AIConversation {
  id: string;
  title: string;
  subject: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  messages: AIChatMessage[];
}

export interface AIConversationsState {
  activeId: string;
  conversations: AIConversation[];
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
const PREFERENCES_STORAGE_KEY = "mm_ai_preferences_v1";
const MAX_LOCAL_MESSAGES = 50;
const MAX_LOCAL_CONVERSATIONS = 20;
const MAX_WORKER_HISTORY = 10;
const MAX_WORKER_MESSAGE_CHARS = 2000;

export const DEFAULT_AI_PREFERENCES: AIPreferences = {
  language: "en",
  classLevel: "10",
  explanationLength: "balanced",
  presentationStyle: "step-by-step",
};

export const AI_IMAGE_INPUT_ENABLED = false;

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
        const visionEnabled = AI_IMAGE_INPUT_ENABLED && Boolean(data.visionEnabled);

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
  subject?: string,
  preferences?: AIPreferences
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
      const classLabel = preferences?.classLevel
        ? `Class ${preferences.classLevel}`
        : "Class 9-10";

      if (subject && subject !== "General") {
        directives.push(`Subject: ${subject} (Punjab Board / FBISE ${classLabel})`);
      } else if (preferences?.classLevel) {
        directives.push(`Level: Punjab Board / FBISE ${classLabel}`);
      }

      if (preferences?.explanationLength === "short") {
        directives.push("Keep explanation concise and to the point");
      } else if (preferences?.explanationLength === "detailed") {
        directives.push("Provide a thorough, detailed explanation with all intermediate steps");
      }

      if (preferences?.presentationStyle === "exam-style") {
        directives.push("Format cleanly in board exam-style headings/steps suitable for marking");
      } else if (preferences?.presentationStyle === "conceptual") {
        directives.push("Focus on clear underlying concept and intuition before formulas");
      } else if (preferences?.presentationStyle === "step-by-step") {
        directives.push("Explain clearly step by step");
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
  preferences,
  onChunk,
  signal,
}: {
  messages: AIChatMessage[];
  image?: { mimeType: string; base64: string } | null;
  language?: "en" | "ur";
  subject?: string;
  preferences?: AIPreferences;
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

  const formattedMessages = buildWorkerMessagesPayload(
    messages,
    language,
    subject,
    preferences
  );
  if (formattedMessages.length === 0) {
    throw new AIRequestError({
      message: "Please enter a question before sending.",
      code: "INVALID_MESSAGES",
      kind: "invalid",
      statusCode: 400,
    });
  }

  // Enforce text-only submission protection while image input is temporarily disabled
  const effectiveImage = AI_IMAGE_INPUT_ENABLED ? image || undefined : undefined;

  // Request streaming when onChunk is provided and no image is attached
  const shouldStream = Boolean(onChunk) && !effectiveImage;

  let response: Response;
  try {
    response = await fetch(`${workerUrl}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: formattedMessages,
        ...(effectiveImage ? { image: effectiveImage } : {}),
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
// Local-Only Conversation Storage (Privacy-Guaranteed, Backward-Compatible)
// -------------------------------------------------------------

function isValidMessageItem(m: unknown): m is AIChatMessage {
  if (!m || typeof m !== "object") return false;
  const item = m as Partial<AIChatMessage>;
  return (
    typeof item.id === "string" &&
    (item.role === "user" || item.role === "assistant") &&
    typeof item.content === "string"
  );
}

export function deriveConversationTitle(
  messages: AIChatMessage[],
  fallback = "New Study Chat"
): string {
  const firstUser = messages.find(
    (m) => m.role === "user" && m.content.trim().length > 0
  );
  if (!firstUser) return fallback;
  const normalized = firstUser.content.replace(/\s+/g, " ").trim();
  return normalized.length > 52 ? `${normalized.slice(0, 49)}...` : normalized;
}

export function deriveConversationSubject(messages: AIChatMessage[]): string {
  const tagged = [...messages]
    .reverse()
    .find((m) => m.subject && m.subject !== "General");
  return tagged?.subject || "General";
}

export function createConversationRecord(
  subject = "General",
  messages: AIChatMessage[] = []
): AIConversation {
  const now = Date.now();
  return {
    id: `conv-${now}-${Math.random().toString(36).slice(2, 7)}`,
    title: deriveConversationTitle(messages),
    subject: messages.length > 0 ? deriveConversationSubject(messages) : subject,
    pinned: false,
    createdAt: messages[0]?.timestamp || now,
    updatedAt: messages[messages.length - 1]?.timestamp || now,
    messages: messages.slice(-MAX_LOCAL_MESSAGES),
  };
}

function sanitizeConversationsState(rawConvs: unknown, preferredActiveId?: unknown): AIConversationsState {
  const validList: AIConversation[] = Array.isArray(rawConvs)
    ? rawConvs
        .filter((c): c is Partial<AIConversation> => Boolean(c && typeof c === "object"))
        .map((c) => {
          const msgs = Array.isArray(c.messages)
            ? c.messages.filter(isValidMessageItem).slice(-MAX_LOCAL_MESSAGES)
            : [];
          const now = Date.now();
          return {
            id:
              typeof c.id === "string" && c.id.trim()
                ? c.id
                : `conv-${now}-${Math.random().toString(36).slice(2, 7)}`,
            title:
              typeof c.title === "string" && c.title.trim()
                ? c.title.trim().slice(0, 80)
                : deriveConversationTitle(msgs),
            subject:
              typeof c.subject === "string" && c.subject.trim()
                ? c.subject
                : deriveConversationSubject(msgs),
            pinned: Boolean(c.pinned),
            createdAt: typeof c.createdAt === "number" ? c.createdAt : now,
            updatedAt: typeof c.updatedAt === "number" ? c.updatedAt : now,
            messages: msgs,
          };
        })
    : [];

  if (validList.length === 0) {
    const initial = createConversationRecord();
    return { activeId: initial.id, conversations: [initial] };
  }

  // Keep pinned conversations + most recently updated unpinned within cap
  const sorted = [...validList].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
  const bounded = sorted.slice(0, MAX_LOCAL_CONVERSATIONS);
  const activeId =
    typeof preferredActiveId === "string" && bounded.some((c) => c.id === preferredActiveId)
      ? preferredActiveId
      : bounded[0].id;

  return { activeId, conversations: bounded };
}

export function loadConversationsState(): AIConversationsState {
  if (typeof window === "undefined") {
    const initial = createConversationRecord();
    return { activeId: initial.id, conversations: [initial] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createConversationRecord();
      return { activeId: initial.id, conversations: [initial] };
    }

    const parsed = JSON.parse(raw);

    // Backward-compatible lossless migration from legacy v1 flat AIChatMessage[]
    if (Array.isArray(parsed)) {
      const migratedMsgs = parsed.filter(isValidMessageItem).slice(-MAX_LOCAL_MESSAGES);
      const migratedConv = createConversationRecord("General", migratedMsgs);
      if (migratedMsgs.length > 0 && migratedConv.title === "New Study Chat") {
        migratedConv.title = "Previous Study Session";
      }
      const nextState: AIConversationsState = {
        activeId: migratedConv.id,
        conversations: [migratedConv],
      };
      saveConversationsState(nextState);
      return nextState;
    }

    if (parsed && typeof parsed === "object" && Array.isArray((parsed as any).conversations)) {
      return sanitizeConversationsState(
        (parsed as any).conversations,
        (parsed as any).activeId
      );
    }

    const fallback = createConversationRecord();
    return { activeId: fallback.id, conversations: [fallback] };
  } catch {
    const fallback = createConversationRecord();
    return { activeId: fallback.id, conversations: [fallback] };
  }
}

export function saveConversationsState(state: AIConversationsState): void {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeConversationsState(state.conversations, state.activeId);

  // Strip base64 previews only if localStorage quota is tight on fallback retry
  const writePayload = (payloadState: AIConversationsState) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        activeId: payloadState.activeId,
        conversations: payloadState.conversations,
      })
    );
  };

  try {
    writePayload(sanitized);
    window.dispatchEvent(new Event("mm_ai_chat_updated"));
  } catch {
    try {
      // Bound unpinned conversations aggressively on quota error while protecting pinned + active
      const compact: AIConversationsState = {
        activeId: sanitized.activeId,
        conversations: sanitized.conversations
          .filter((c) => c.id === sanitized.activeId || c.pinned)
          .concat(
            sanitized.conversations
              .filter((c) => c.id !== sanitized.activeId && !c.pinned)
              .slice(0, 5)
          )
          .map((c) => ({
            ...c,
            messages: c.messages.slice(-MAX_LOCAL_MESSAGES).map((m) => ({
              ...m,
              image: undefined,
            })),
          })),
      };
      writePayload(compact);
      window.dispatchEvent(new Event("mm_ai_chat_updated"));
    } catch (err) {
      console.warn("Failed to persist local AI conversations:", err);
    }
  }
}

export function getLocalChatHistory(): AIChatMessage[] {
  const state = loadConversationsState();
  const active = state.conversations.find((c) => c.id === state.activeId);
  return active ? active.messages : [];
}

export function saveLocalChatHistory(messages: AIChatMessage[]): void {
  if (typeof window === "undefined") return;
  const state = loadConversationsState();
  const bounded = messages.slice(-MAX_LOCAL_MESSAGES);
  const existingIdx = state.conversations.findIndex((c) => c.id === state.activeId);

  if (existingIdx >= 0) {
    const current = state.conversations[existingIdx];
    const shouldAutoTitle =
      current.title === "New Study Chat" || current.title === "Previous Study Session";
    const updated: AIConversation = {
      ...current,
      title: shouldAutoTitle ? deriveConversationTitle(bounded, current.title) : current.title,
      subject:
        bounded.length > 0 ? deriveConversationSubject(bounded) : current.subject,
      updatedAt: Date.now(),
      messages: bounded,
    };
    const nextConversations = [...state.conversations];
    nextConversations[existingIdx] = updated;
    saveConversationsState({ activeId: state.activeId, conversations: nextConversations });
  } else {
    const created = createConversationRecord("General", bounded);
    saveConversationsState({
      activeId: created.id,
      conversations: [created, ...state.conversations],
    });
  }
}

export function clearLocalChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    const state = loadConversationsState();
    const others = state.conversations.filter((c) => c.id !== state.activeId);
    const fresh = createConversationRecord();
    if (others.length === 0) {
      saveConversationsState({ activeId: fresh.id, conversations: [fresh] });
    } else {
      saveConversationsState({
        activeId: fresh.id,
        conversations: [fresh, ...others],
      });
    }
  } catch (err) {
    console.warn("Failed to clear local chat history:", err);
  }
}

export function getAIPreferences(): AIPreferences {
  if (typeof window === "undefined") return DEFAULT_AI_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_AI_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<AIPreferences>;
    return {
      language: parsed.language === "ur" ? "ur" : "en",
      classLevel: parsed.classLevel === "9" ? "9" : "10",
      explanationLength:
        parsed.explanationLength === "short" || parsed.explanationLength === "detailed"
          ? parsed.explanationLength
          : "balanced",
      presentationStyle:
        parsed.presentationStyle === "exam-style" || parsed.presentationStyle === "conceptual"
          ? parsed.presentationStyle
          : "step-by-step",
    };
  } catch {
    return DEFAULT_AI_PREFERENCES;
  }
}

export function saveAIPreferences(prefs: AIPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.warn("Failed to persist AI preferences:", err);
  }
}

export function exportChatHistoryAsJSON(
  messages: AIChatMessage[],
  title = "Matric Mastery AI Study Session"
): string {
  const exportPayload = {
    title,
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
