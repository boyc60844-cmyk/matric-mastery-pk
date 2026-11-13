/* ==========================================================================
   MATRIC MASTERY AI — DEDICATED STUDY WORKSPACE (/ai) (v3.9.0)
   - Linear / Modern ChatGPT inspired academic tutoring workspace
   - Routes 100% of inference through Cloudflare Workers AI (lib/aiClient.ts)
   - Bilingual English (default) & Pakistani Urdu (RTL) with accurate terms
   - Zero WebGL bloat, mobile-first sticky composer, local-only persistence
   ========================================================================== */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Square,
  Loader2,
  Image as ImageIcon,
  X,
  Copy,
  Check,
  Share2,
  Download,
  AlertCircle,
  WifiOff,
  RotateCcw,
  Mic,
  MicOff,
  Plus,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import AIMarkdownRenderer from "@/components/AIMarkdownRenderer";
import {
  AIChatMessage,
  AIErrorKind,
  AIRequestError,
  AIStatus,
  checkAIStatus,
  sendAIMessage,
  getLocalChatHistory,
  saveLocalChatHistory,
  clearLocalChatHistory,
  exportChatHistoryAsJSON,
} from "@/lib/aiClient";
import { addXP } from "@/lib/progress";

interface StarterQuestion {
  subject: string;
  en: string;
  ur: string;
}

const STARTER_QUESTIONS: StarterQuestion[] = [
  {
    subject: "Math",
    en: "Factorize x^2 - 7x + 12 = 0 step by step and verify the roots.",
    ur: "مساوات x^2 - 7x + 12 = 0 کی تجزیہ (Factorization) کریں اور حل کی تصدیق کریں۔",
  },
  {
    subject: "Physics",
    en: "Derive F = ma from Newton's Second Law of Motion and state SI units.",
    ur: "نیوٹن کے حرکت کے دوسرے قانون سے قوت کا فارمولا F = ma اخذ کریں اور SI یونٹ بیان کریں۔",
  },
  {
    subject: "Chemistry",
    en: "Balance H2 + O2 -> H2O and calculate the number of moles in 36 g of water.",
    ur: "کیمیائی مساوات H2 + O2 -> H2O کو متوازن کریں اور 36 گرام پانی میں مولز کی تعداد معلوم کریں۔",
  },
  {
    subject: "Biology",
    en: "Explain the light and dark reactions of Photosynthesis with its chemical equation.",
    ur: "ضیائی تالیف (Photosynthesis) کے روشنی اور تاریکی کے مراحل کیمیائی مساوات سمیت بیان کریں۔",
  },
];

const SUBJECT_OPTIONS = [
  { value: "General", label: "All Subjects" },
  { value: "Math", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "Computer", label: "Computer Science" },
  { value: "English", label: "English" },
  { value: "Urdu", label: "Urdu / Islamiyat" },
];

const URDU_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

function isUrduText(text: string): boolean {
  return URDU_CHAR_REGEX.test(text);
}

function getStudentFriendlyError(
  err: unknown,
  languageMode: "en" | "ur"
): { message: string; kind: AIErrorKind; resetsAt?: string } {
  if (err instanceof AIRequestError) {
    return {
      message: err.message,
      kind: err.kind,
      resetsAt: err.resetsAt,
    };
  }

  const msg = err instanceof Error ? err.message : "";
  const lower = msg.toLowerCase();

  if (lower.includes("429") || lower.includes("quota") || lower.includes("limit")) {
    return {
      kind: "rate_limit",
      message:
        languageMode === "ur"
          ? "آپ کے AI استعمال کی عارضی حد پوری ہو گئی ہے۔ تھوڑی دیر بعد دوبارہ کوشش کریں۔ آپ کا سوال محفوظ ہے تو اسے دوبارہ بھیج سکتے ہیں۔"
          : "Free AI usage limit reached for now. Your question is saved — please try again shortly.",
    };
  }

  if (
    lower.includes("network") ||
    lower.includes("failed to fetch") ||
    lower.includes("offline")
  ) {
    return {
      kind: "network",
      message:
        languageMode === "ur"
          ? "انٹرنیٹ کنکشن میں مسئلہ ہے۔ براہ کرم اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔"
          : "Connection issue while reaching Matric Mastery AI. Please check your internet connection and try again.",
    };
  }

  return {
    kind: "server",
    message:
      languageMode === "ur"
        ? "سوال کا جواب تیار کرنے میں عارضی مسئلہ آیا ہے۔ براہ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔"
        : "Something went wrong while preparing the explanation. Please try again in a moment.",
  };
}

export default function AIPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("General");
  const [languageMode, setLanguageMode] = useState<"en" | "ur">("en");
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<AIStatus>({
    state: "unconfigured",
    provider: "none",
    model: "@cf/meta/llama-3.1-8b-instruct-fast",
    message: "Checking service availability...",
    visionEnabled: false,
  });

  // Image attachment state (active only if backend genuinely reports visionEnabled === true)
  const [attachedImage, setAttachedImage] = useState<{
    previewUrl: string;
    mimeType: string;
    base64: string;
  } | null>(null);
  const [composerNotice, setComposerNotice] = useState<string | null>(null);

  // UI interactions
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSubmittingRef = useRef(false);

  const refreshHealthStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const next = await checkAIStatus();
      setStatus(next);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  // Load status, local history, and browser speech support
  useEffect(() => {
    refreshHealthStatus();

    const savedHistory = getLocalChatHistory();
    if (savedHistory.length > 0) {
      setMessages(savedHistory);
    }

    if (typeof window !== "undefined") {
      const hasSpeech =
        "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
      setSpeechSupported(Boolean(hasSpeech));
    }
  }, [refreshHealthStatus]);

  // Auto-resize composer textarea cleanly (44px min up to 160px)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [inputText]);

  // Keep latest message visible while chatting
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, isGenerating]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setComposerNotice("Please attach a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setComposerNotice("Image must be smaller than 4 MB.");
      return;
    }

    setComposerNotice(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      const match = resultStr.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        setAttachedImage({
          mimeType: match[1],
          base64: match[2],
          previewUrl: resultStr,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleVoiceInput = () => {
    if (!speechSupported) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.lang = languageMode === "ur" ? "ur-PK" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const executeGeneration = async ({
    historyForRequest,
    placeholderId,
    subjectOverride,
    imagePayload,
  }: {
    historyForRequest: AIChatMessage[];
    placeholderId: string;
    subjectOverride: string;
    imagePayload: { mimeType: string; base64: string } | null;
  }) => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const fullAnswer = await sendAIMessage({
        messages: historyForRequest,
        image: imagePayload,
        language: languageMode,
        subject: subjectOverride,
        signal: abortController.signal,
        onChunk: (partialText) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholderId
                ? { ...m, content: partialText, error: false, errorKind: undefined }
                : m
            )
          );
        },
      });

      const resolvedContent =
        fullAnswer.trim() ||
        (languageMode === "ur"
          ? "معذرت، مکمل جواب موصول نہیں ہو سکا۔ براہ کرم دوبارہ کوشش کریں۔"
          : "No response text was returned. Please try sending your question again.");

      setMessages((prev) => {
        const updated = prev.map((m) =>
          m.id === placeholderId
            ? {
                ...m,
                content: resolvedContent,
                timestamp: Date.now(),
                error: false,
                errorKind: undefined,
              }
            : m
        );
        saveLocalChatHistory(updated);
        return updated;
      });

      addXP(15, "Solved question with Matric Mastery AI");
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setMessages((prev) => prev.filter((m) => m.id !== placeholderId));
        return;
      }

      const friendly = getStudentFriendlyError(err, languageMode);
      if (friendly.kind === "rate_limit") {
        setStatus((prev) => ({ ...prev, state: "quota_exhausted" }));
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId
            ? {
                ...m,
                content: friendly.message,
                error: true,
                errorKind: friendly.kind,
                resetsAt: friendly.resetsAt,
              }
            : m
        )
      );
    } finally {
      isSubmittingRef.current = false;
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = async (
    customPrompt?: string,
    subjectOverride?: string
  ) => {
    if (isSubmittingRef.current || isGenerating) return;

    const textToSend = (customPrompt !== undefined ? customPrompt : inputText).trim();
    const activeAttachment = status.visionEnabled ? attachedImage : null;
    if (!textToSend && !activeAttachment) return;

    if (textToSend.length > 2000) {
      setComposerNotice("Keep your question under 2,000 characters.");
      return;
    }

    isSubmittingRef.current = true;
    setComposerNotice(null);
    setConfirmClear(false);

    const activeSubject = subjectOverride || selectedSubject;
    if (subjectOverride) {
      setSelectedSubject(subjectOverride);
    }

    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: textToSend || "Solve this question step by step.",
      timestamp: Date.now(),
      image: activeAttachment || undefined,
      subject: activeSubject,
    };

    const placeholderId = `msg-ai-${Date.now()}`;
    const assistantPlaceholder: AIChatMessage = {
      id: placeholderId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      subject: activeSubject,
    };

    const nextHistory = [...messages, userMessage];
    setMessages([...nextHistory, assistantPlaceholder]);
    if (customPrompt === undefined) {
      setInputText("");
    }
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsGenerating(true);

    await executeGeneration({
      historyForRequest: nextHistory,
      placeholderId,
      subjectOverride: activeSubject,
      imagePayload: activeAttachment
        ? { mimeType: activeAttachment.mimeType, base64: activeAttachment.base64 }
        : null,
    });
  };

  const handleRetryTurn = async (assistantMessageId: string) => {
    if (isSubmittingRef.current || isGenerating) return;

    const targetIndex = messages.findIndex((m) => m.id === assistantMessageId);
    if (targetIndex <= 0) return;

    const precedingMessages = messages
      .slice(0, targetIndex)
      .filter((m) => !m.error);
    if (precedingMessages.length === 0) return;

    const lastUser = precedingMessages[precedingMessages.length - 1];
    if (lastUser.role !== "user") return;

    isSubmittingRef.current = true;
    setComposerNotice(null);
    setIsGenerating(true);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantMessageId
          ? { ...m, content: "", error: false, errorKind: undefined }
          : m
      )
    );

    await executeGeneration({
      historyForRequest: precedingMessages,
      placeholderId: assistantMessageId,
      subjectOverride: lastUser.subject || selectedSubject,
      imagePayload: lastUser.image
        ? { mimeType: lastUser.image.mimeType, base64: lastUser.image.base64 }
        : null,
    });
  };

  const handleStopGeneration = () => {
    abortControllerRef.current?.abort();
  };

  const handleStartNewChat = () => {
    if (isGenerating) {
      abortControllerRef.current?.abort();
    }
    clearLocalChatHistory();
    setMessages([]);
    setConfirmClear(false);
    setComposerNotice(null);
    textareaRef.current?.focus();
  };

  const handleCopyMessage = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleShareWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(
      `*Matric Mastery AI Solution:*\n\n${text.slice(0, 800)}${text.length > 800 ? "..." : ""}\n\nStudy free at Matric Mastery PK`
    );
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  const handleExportJSON = () => {
    if (messages.length === 0) return;
    const jsonStr = exportChatHistoryAsJSON(messages);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matric-mastery-ai-session-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isUrduUI = languageMode === "ur";

  return (
    <section
      aria-label="Matric Mastery AI Tutoring Workspace"
      className="relative flex min-h-[calc(100dvh-68px)] w-full flex-col bg-[#0A0A0A] text-white"
    >
      {/* A. Compact Workspace Header */}
      <header className="w-full border-b border-white/[0.08] bg-[#0A0A0A]">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD60A] text-black">
              <GraduationCap size={19} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-base sm:text-lg font-bold tracking-tight text-white truncate">
                Matric Mastery AI
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-400">
                <span>Class 9–10 Punjab Board &amp; FBISE Tutor</span>
                <span aria-hidden="true">·</span>
                {statusLoading ? (
                  <span>Checking availability...</span>
                ) : status.state === "ready" ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 size={12} aria-hidden="true" />
                    <span>Free Tier Active</span>
                  </span>
                ) : status.state === "quota_exhausted" ? (
                  <span className="inline-flex items-center gap-1 text-amber-300">
                    <AlertCircle size={12} aria-hidden="true" />
                    <span>Usage Limit Reached</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={refreshHealthStatus}
                    className="inline-flex items-center gap-1 text-red-300 hover:text-red-200 underline-offset-2 hover:underline cursor-pointer"
                  >
                    <WifiOff size={12} aria-hidden="true" />
                    <span>Connection Check Failed · Retry</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Workspace Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Download this study session as JSON"
              >
                <Download size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {messages.length > 0 && confirmClear ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="inline-flex min-h-[40px] sm:min-h-[36px] items-center rounded-lg bg-[#FFD60A] px-3 py-1.5 text-xs font-semibold text-black hover:bg-[#FFD60A]/90 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="inline-flex min-h-[40px] sm:min-h-[36px] items-center rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (messages.length > 0) {
                    setConfirmClear(true);
                  } else {
                    textareaRef.current?.focus();
                  }
                }}
                disabled={messages.length === 0 && !isGenerating}
                className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white hover:border-[#FFD60A]/50 hover:text-[#FFD60A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus size={14} aria-hidden="true" />
                <span>New Chat</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* B. Main Conversation Center Stage */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
        {messages.length === 0 ? (
          /* First-Visit Welcome Screen */
          <div className="my-auto py-8 sm:py-12 space-y-8">
            <div className="space-y-3" dir={isUrduUI ? "rtl" : "ltr"}>
              <h2
                className={`font-bold text-white tracking-tight text-balance ${
                  isUrduUI
                    ? "font-urdu text-2xl sm:text-3xl leading-[1.9] text-right"
                    : "font-heading text-2xl sm:text-3xl"
                }`}
              >
                {isUrduUI
                  ? "آج کون سا سوال یا تصور سمجھنا چاہتے ہیں؟"
                  : "What would you like to solve today?"}
              </h2>
              <p
                className={`text-neutral-400 max-w-xl ${
                  isUrduUI
                    ? "font-urdu text-[15px] leading-[2] text-right"
                    : "text-sm sm:text-[15px] leading-relaxed"
                }`}
              >
                {isUrduUI
                  ? "پنجاب بورڈ اور فیڈرل بورڈ (کلاس 9 اور 10) کے مطابق ریاضی، فزکس، کیمسٹری اور بائیولوجی کی مرحلہ وار رہنمائی حاصل کریں۔"
                  : "Get clear, step-by-step explanations aligned with Punjab Board and FBISE Class 9–10 textbooks."}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-neutral-400">
                {isUrduUI ? "مثال کے سوالات (فوری حل کے لیے کلک کریں)" : "Try an example question"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTER_QUESTIONS.map((item) => {
                  const questionText = isUrduUI ? item.ur : item.en;
                  return (
                    <button
                      key={item.subject}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleSendMessage(questionText, item.subject)}
                      dir={isUrduUI ? "rtl" : "ltr"}
                      className={`group flex flex-col justify-between gap-2 rounded-xl border border-white/10 bg-[#121216] p-4 transition-colors hover:border-[#FFD60A]/50 hover:bg-[#16161B] disabled:opacity-50 cursor-pointer ${
                        isUrduUI ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="text-xs font-semibold text-[#FFD60A]">
                        {item.subject}
                      </span>
                      <span
                        className={`text-neutral-200 group-hover:text-white ${
                          isUrduUI
                            ? "font-urdu text-[14px] leading-[1.95]"
                            : "text-sm leading-snug"
                        }`}
                      >
                        {questionText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Active Conversation Thread */
          <div className="flex-1 py-6 space-y-6">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              const urduContent = isUrduText(msg.content);
              const isLastMessage = idx === messages.length - 1;
              const showThinkState = !isUser && !msg.content && isGenerating && isLastMessage;
              const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              if (isUser) {
                return (
                  <div key={msg.id} className="flex flex-col items-end gap-1.5">
                    <div
                      dir="auto"
                      className={`max-w-[88%] sm:max-w-[78%] rounded-2xl border border-white/10 bg-[#18181E] px-4 py-3 text-[15px] text-white ${
                        urduContent ? "font-urdu leading-[2] text-right" : "leading-relaxed"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image.previewUrl}
                          alt="Attached question"
                          className="mb-2.5 max-h-52 rounded-lg border border-white/15 object-contain bg-black"
                        />
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-2 px-1 text-[11px] text-neutral-500 tabular-nums">
                      <span>{msg.subject && msg.subject !== "General" ? msg.subject : "Student"}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                );
              }

              return (
                <article
                  key={msg.id}
                  className="w-full border-b border-white/[0.06] pb-6 last:border-b-0 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">Matric Mastery AI</span>
                      {msg.subject && msg.subject !== "General" && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#FFD60A]">{msg.subject}</span>
                        </>
                      )}
                    </div>
                    <span className="tabular-nums text-[11px] text-neutral-500">
                      {formattedTime}
                    </span>
                  </div>

                  {showThinkState ? (
                    <div className="flex items-center gap-2.5 py-2 text-sm text-neutral-300">
                      <Loader2 size={15} className="animate-spin text-[#FFD60A]" aria-hidden="true" />
                      <span className={isUrduUI ? "font-urdu" : ""}>
                        {isUrduUI
                          ? "مرحلہ وار جواب تیار کیا جا رہا ہے..."
                          : "Working through the steps..."}
                      </span>
                    </div>
                  ) : msg.error ? (
                    <div
                      dir={urduContent ? "rtl" : "ltr"}
                      className={`rounded-xl border p-4 space-y-3 ${
                        msg.errorKind === "rate_limit"
                          ? "border-amber-500/35 bg-amber-500/[0.07] text-amber-100"
                          : "border-red-500/35 bg-red-500/[0.07] text-red-100"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {msg.errorKind === "network" ? (
                          <WifiOff size={18} className="shrink-0 mt-0.5 text-red-300" aria-hidden="true" />
                        ) : (
                          <AlertCircle
                            size={18}
                            className={`shrink-0 mt-0.5 ${
                              msg.errorKind === "rate_limit" ? "text-amber-300" : "text-red-300"
                            }`}
                            aria-hidden="true"
                          />
                        )}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              urduContent ? "font-urdu leading-[2] text-right" : "leading-relaxed"
                            }`}
                          >
                            {msg.content}
                          </p>
                          {msg.errorKind === "rate_limit" && msg.resetsAt && (
                            <p className="text-xs text-amber-200/80">
                              Daily free server allocation resets at {msg.resetsAt}.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isGenerating}
                          onClick={() => handleRetryTurn(msg.id)}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-white text-black px-3 py-1.5 text-xs font-semibold hover:bg-neutral-200 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <RotateCcw size={13} aria-hidden="true" />
                          <span>Retry Question</span>
                        </button>

                        {msg.errorKind === "rate_limit" && (
                          <>
                            <Link
                              href="/strategies"
                              className="inline-flex min-h-[38px] items-center rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:border-[#FFD60A]/60 transition-colors"
                            >
                              Exam Strategies
                            </Link>
                            <Link
                              href="/past-papers"
                              className="inline-flex min-h-[38px] items-center rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:border-[#FFD60A]/60 transition-colors"
                            >
                              Past Papers
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <AIMarkdownRenderer content={msg.content} />

                      {!(isGenerating && isLastMessage) && msg.content && (
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check size={13} className="text-emerald-400" aria-hidden="true" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} aria-hidden="true" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareWhatsApp(msg.content)}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors cursor-pointer"
                          >
                            <Share2 size={13} aria-hidden="true" />
                            <span>Share</span>
                          </button>

                          {isLastMessage && (
                            <button
                              type="button"
                              disabled={isGenerating}
                              onClick={() => handleRetryTurn(msg.id)}
                              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                            >
                              <RotateCcw size={13} aria-hidden="true" />
                              <span>Regenerate</span>
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </article>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* C. Sticky Mobile-First Input Composer */}
      <div className="sticky bottom-0 z-20 w-full border-t border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {composerNotice && (
            <div
              role="status"
              className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200"
            >
              <span>{composerNotice}</span>
              <button
                type="button"
                onClick={() => setComposerNotice(null)}
                className="text-amber-200/80 hover:text-white p-0.5"
                aria-label="Dismiss notice"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {status.visionEnabled && attachedImage && (
            <div className="mb-2 inline-flex items-center gap-2.5 rounded-xl border border-[#FFD60A]/40 bg-[#141418] p-1.5 pr-3">
              <img
                src={attachedImage.previewUrl}
                alt="Attached textbook problem"
                className="h-11 w-11 rounded-lg object-cover"
              />
              <span className="text-xs text-neutral-300">Image attached</span>
              <button
                type="button"
                onClick={removeAttachedImage}
                className="ml-1 rounded-full bg-white/10 p-1 text-neutral-300 hover:text-white"
                aria-label="Remove attached image"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="rounded-2xl border border-white/15 bg-[#121216] focus-within:border-[#FFD60A]/70 transition-colors"
          >
            <textarea
              ref={textareaRef}
              id="ai-prompt-input"
              aria-label="Ask a Class 9 or 10 study question"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isUrduUI
                  ? "اپنا سوال لکھیں (ریاضی، فزکس، کیمسٹری، بائیولوجی)..."
                  : "Ask a Class 9–10 Math, Physics, Chemistry, or Biology question..."
              }
              dir={isUrduUI && !inputText ? "rtl" : "auto"}
              rows={1}
              maxLength={2000}
              disabled={isGenerating}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !(e.nativeEvent as KeyboardEvent).isComposing
                ) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className={`w-full resize-none bg-transparent px-4 pt-3 pb-2 text-base sm:text-[15px] text-white placeholder-neutral-500 focus:outline-none disabled:opacity-60 ${
                isUrduUI || isUrduText(inputText) ? "font-urdu leading-[1.9]" : "leading-relaxed"
              }`}
            />

            {/* Bottom Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-2.5 py-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Subject selector */}
                <select
                  aria-label="Select subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="min-h-[40px] sm:min-h-[36px] rounded-lg border border-white/10 bg-[#18181D] px-2.5 text-xs font-medium text-neutral-200 focus:border-[#FFD60A] focus:outline-none cursor-pointer"
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Language toggle (English default | Urdu) */}
                <div
                  role="group"
                  aria-label="Response language"
                  className="inline-flex rounded-lg border border-white/10 bg-[#18181D] p-0.5"
                >
                  <button
                    type="button"
                    onClick={() => setLanguageMode("en")}
                    className={`min-h-[36px] sm:min-h-[32px] rounded-md px-2.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      languageMode === "en"
                        ? "bg-white text-black font-semibold"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguageMode("ur")}
                    className={`min-h-[36px] sm:min-h-[32px] rounded-md px-2.5 text-xs font-urdu transition-colors whitespace-nowrap cursor-pointer ${
                      languageMode === "ur"
                        ? "bg-white text-black font-semibold"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    اردو
                  </button>
                </div>

                {/* Image attachment: strictly rendered ONLY if backend reports visionEnabled === true */}
                {status.visionEnabled && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-[#18181D] px-2.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      aria-label="Attach question image"
                    >
                      <ImageIcon size={14} aria-hidden="true" />
                      <span className="hidden sm:inline">Image</span>
                    </button>
                  </>
                )}

                {/* Voice input (only when supported by browser) */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    aria-label={isRecording ? "Stop voice dictation" : "Start voice dictation"}
                    className={`inline-flex min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] items-center justify-center rounded-lg border px-2 text-xs transition-colors cursor-pointer ${
                      isRecording
                        ? "border-red-500/60 bg-red-500/20 text-red-300"
                        : "border-white/10 bg-[#18181D] text-neutral-300 hover:text-white"
                    }`}
                  >
                    {isRecording ? (
                      <MicOff size={15} aria-hidden="true" />
                    ) : (
                      <Mic size={15} aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 ml-auto">
                {inputText.length > 0 && (
                  <span className="text-[11px] font-mono tabular-nums text-neutral-500">
                    {inputText.length}/2000
                  </span>
                )}

                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    aria-label="Stop generating response"
                    className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 text-xs font-semibold text-white hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Square size={12} className="fill-current" aria-hidden="true" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputText.trim() && !(status.visionEnabled && attachedImage)}
                    aria-label="Send question"
                    className="inline-flex min-h-[40px] min-w-[44px] sm:min-h-[36px] items-center justify-center gap-1.5 rounded-xl bg-[#FFD60A] px-3.5 text-xs font-bold text-black hover:bg-[#FFD60A]/90 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Send size={14} aria-hidden="true" />
                    <span>Send</span>
                  </button>
                )}
              </div>
            </div>
          </form>

          <p className="mt-2 text-center text-[11px] text-neutral-500">
            Chat history stays on this device · Please do not share personal IDs or phone numbers
          </p>
        </div>
      </div>
    </section>
  );
}
