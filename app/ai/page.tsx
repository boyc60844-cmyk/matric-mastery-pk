/* ==========================================================================
   MATRIC MASTERY AI — COMPLETE TUTORING DESTINATION (/ai) (v4.0.0)
   - Genuine two-region independent scrolling (outer page vs transcript log)
   - Smart transcript auto-scroll that preserves older-message reading position
   - Structured subject coverage, 7-step guide, interactive prompt templates,
     practical tips, and accurate "Free AI Access — Usage Information"
   - Routes 100% of inference through Cloudflare Workers AI (lib/aiClient.ts)
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
  ArrowDown,
  ArrowUpRight,
  RefreshCw,
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

interface SubjectInfo {
  name: string;
  selectValue: string;
  summary: string;
  topics: string[];
}

interface InteractivePromptTemplate {
  label: string;
  prompt: string;
  subject?: string;
  language?: "en" | "ur";
  helper: string;
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

const SUBJECT_GUIDES: SubjectInfo[] = [
  {
    name: "Mathematics",
    selectValue: "Math",
    summary: "Clear algebraic working, root verification, and theorem steps.",
    topics: [
      "Algebra and equations",
      "Factorization",
      "Geometry",
      "Trigonometry",
      "Step-by-step numerical solutions",
    ],
  },
  {
    name: "Physics",
    selectValue: "Physics",
    summary: "Formula selection, Given/To Find structure, and proper SI units.",
    topics: [
      "Concepts and definitions",
      "Formulas and units",
      "Numericals",
      "Laws and applications",
    ],
  },
  {
    name: "Chemistry",
    selectValue: "Chemistry",
    summary: "Balanced reactions, mole calculations, and core chemical principles.",
    topics: [
      "Chemical equations",
      "Balancing reactions",
      "Atomic structure",
      "Chemical bonding",
      "Concepts and definitions",
    ],
  },
  {
    name: "Biology",
    selectValue: "Biology",
    summary: "Structured textbook definitions, processes, and biological systems.",
    topics: [
      "Cell structure",
      "Human body systems",
      "Photosynthesis",
      "Definitions and biological processes",
    ],
  },
];

const TUTOR_CAPABILITIES = [
  "Understand difficult concepts.",
  "Solve mathematical problems step by step.",
  "Learn Physics formulas and numerical problems.",
  "Understand Chemistry reactions and concepts.",
  "Study Biology definitions and processes.",
  "Ask follow-up questions when an explanation is unclear.",
];

const HOW_TO_USE_STEPS = [
  "Select your preferred language: English or Urdu.",
  "Select the relevant subject when applicable.",
  "Write your question clearly.",
  "For numericals, include all given values and units.",
  "Ask for a step-by-step explanation if needed.",
  "Read the solution and ask follow-up questions.",
  "If something is unclear, ask the AI to explain it more simply.",
];

const INTERACTIVE_PROMPT_TEMPLATES: InteractivePromptTemplate[] = [
  {
    label: "Explain this topic in simple words.",
    prompt: "Explain this topic in simple words for Class 9/10: ",
    helper: "General concept clarification",
  },
  {
    label: "Solve this equation step by step.",
    prompt: "Solve this equation step by step: ",
    subject: "Math",
    helper: "Mathematics · Step-by-step algebra",
  },
  {
    label: "Explain this Physics numerical with formulas.",
    prompt: "Explain this Physics numerical with Given Data, Formula, Units, and Solution: ",
    subject: "Physics",
    helper: "Physics · Numericals & SI units",
  },
  {
    label: "Balance this chemical equation.",
    prompt: "Balance this chemical equation and explain each step: ",
    subject: "Chemistry",
    helper: "Chemistry · Balancing reactions",
  },
  {
    label: "Explain this in simple Pakistani Urdu.",
    prompt: "براہ کرم اس موضوع کو سادہ پاکستانی اردو میں مرحلہ وار سمجھائیں: ",
    language: "ur",
    helper: "Urdu mode · Natural academic terminology",
  },
  {
    label: "Give me a short exam-style answer.",
    prompt: "Give me a concise, board exam-style short answer for: ",
    helper: "Exam-focused revision summary",
  },
];

const BETTER_ANSWER_TIPS = [
  "Ask one clear question at a time.",
  "Mention your class and subject.",
  "Include units in numerical problems.",
  "Specify whether you want a short answer or detailed explanation.",
  "Ask follow-up questions rather than repeating the same question.",
  "Verify important textbook definitions and exam requirements against prescribed material.",
];

const FREE_ACCESS_POINTS = [
  "Matric Mastery AI currently uses a free-tier AI service.",
  "Usage is subject to provider limits and shared daily capacity.",
  "The AI may occasionally respond slowly.",
  "During heavy usage, students may temporarily encounter a usage-limit message.",
  "Availability is not guaranteed at every moment.",
  "A temporary limit does not mean the website or student's account is broken.",
  "Students should wait and try again later.",
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

  // UI interactions & independent transcript scroll tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatWorkspaceRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSubmittingRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);

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

  // Auto-resize composer textarea cleanly (up to 128px inside bounded workspace)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [inputText]);

  // Scroll strictly inside the dedicated transcript container — NEVER scroll the outer page
  const scrollTranscriptToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      const el = transcriptRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior });
    },
    []
  );

  // Track user's scroll position inside the transcript to avoid interrupting reading older messages
  const handleTranscriptScroll = useCallback(() => {
    const el = transcriptRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom <= 64;
    shouldAutoScrollRef.current = nearBottom;
    setShowScrollToLatest(!nearBottom && messages.length > 0);
  }, [messages.length]);

  // Update transcript scroll only when appropriate (student is near bottom or explicitly submitted)
  useEffect(() => {
    if (messages.length === 0) {
      setShowScrollToLatest(false);
      shouldAutoScrollRef.current = true;
      return;
    }

    if (!shouldAutoScrollRef.current) return;

    const rafId = window.requestAnimationFrame(() => {
      scrollTranscriptToBottom("auto");
      setShowScrollToLatest(false);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [messages, isGenerating, scrollTranscriptToBottom]);

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
    shouldAutoScrollRef.current = true;
    setShowScrollToLatest(false);
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
    shouldAutoScrollRef.current = targetIndex === messages.length - 1;
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
    setShowScrollToLatest(false);
    shouldAutoScrollRef.current = true;
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

  const focusWorkspaceWithTemplate = (template: {
    prompt?: string;
    subject?: string;
    language?: "en" | "ur";
    notice?: string;
  }) => {
    if (template.subject) setSelectedSubject(template.subject);
    if (template.language) setLanguageMode(template.language);
    if (template.prompt !== undefined) setInputText(template.prompt);
    if (template.notice) setComposerNotice(template.notice);

    chatWorkspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    }, 280);
  };

  const isUrduUI = languageMode === "ur";

  const statusDisplay = statusLoading
    ? {
        label: "Checking availability...",
        shortLabel: "Checking status...",
        tone: "text-neutral-400",
        detail: "Checking live backend health via /api/ai/health.",
      }
    : status.state === "ready"
      ? {
          label: "Free-Tier Service Operational",
          shortLabel: "Backend Available · Free-Tier Operational",
          tone: "text-emerald-400",
          detail:
            "Backend available and operating on shared free-tier capacity (subject to provider limits).",
        }
      : status.state === "quota_exhausted"
        ? {
            label: "Temporary Usage Limit Reached",
            shortLabel: "Temporary Usage Limit Reached",
            tone: "text-amber-300",
            detail:
              "Shared free-tier capacity has temporarily reached its limit. Please wait and try again later.",
          }
        : {
            label: "Service Temporarily Unavailable · Retry",
            shortLabel: "Service Temporarily Unavailable",
            tone: "text-red-300",
            detail:
              "Unable to reach the AI backend right now. Use Refresh Status or Retry to check again.",
          };

  return (
    <div className="w-full bg-[#0A0A0A] text-white">
      {/* =====================================================================
          1. COMPACT WORKSPACE ORIENTATION & QUICK SECTION JUMP BAR
         ===================================================================== */}
      <div className="mx-auto w-full max-w-4xl px-3 sm:px-6 pt-2.5 pb-2.5 sm:pt-4 sm:pb-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-1.5">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-neutral-200 leading-snug sm:truncate">
              Your personal AI study assistant for Punjab Board Class 9–10.
            </p>
            <p className="mt-0.5 sm:mt-0 text-[11px] text-neutral-400 leading-snug sm:truncate">
              Independent learning assistant · Not an official Punjab Board service
            </p>
          </div>

          <nav
            aria-label="AI Workspace Sections"
            className="flex w-full sm:w-auto items-center gap-2 sm:gap-1.5 overflow-x-auto no-scrollbar shrink-0"
          >
            <a
              href="#ai-chat-workspace"
              className="rounded-md border border-[#FFD60A]/40 bg-[#FFD60A]/10 px-2.5 py-1 sm:px-2 text-[11px] sm:text-xs font-semibold text-[#FFD60A] hover:bg-[#FFD60A]/15 transition-colors whitespace-nowrap shrink-0"
            >
              Chat Tutor
            </a>
            <a
              href="#ai-subjects"
              className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 sm:px-2 text-[11px] sm:text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Subjects
            </a>
            <a
              href="#ai-how-to-use"
              className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 sm:px-2 text-[11px] sm:text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              How to Use
            </a>
            <a
              href="#ai-tips"
              className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 sm:px-2 text-[11px] sm:text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Tips
            </a>
            <a
              href="#ai-free-access"
              className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 sm:px-2 text-[11px] sm:text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Free AI Access
            </a>
            <span className="w-3 shrink-0 sm:hidden" aria-hidden="true" />
          </nav>
        </div>
      </div>

      {/* =====================================================================
          2. DEDICATED INDEPENDENT-SCROLL AI WORKSPACE CONTAINER
         ===================================================================== */}
      <section
        aria-label="Matric Mastery AI Tutoring Workspace"
        className="mx-auto w-full max-w-4xl px-2.5 sm:px-6"
      >
        <div
          ref={chatWorkspaceRef}
          id="ai-chat-workspace"
          className="scroll-mt-20 flex h-[calc(100dvh-205px)] min-h-[430px] max-h-[620px] sm:h-[min(74dvh,700px)] sm:min-h-[460px] sm:max-h-[720px] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0D0D12]"
        >
          {/* A. Pinned Chat Header */}
          <header className="shrink-0 w-full border-b border-white/[0.08] bg-[#0F0F15] px-3 py-2.5 sm:px-5 sm:py-2.5">
            <div className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-2">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD60A] text-black">
                  <GraduationCap size={17} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h1 className="font-heading text-sm sm:text-base font-bold tracking-tight text-white sm:truncate">
                    Matric Mastery AI
                  </h1>
                  <div className="mt-0.5 sm:mt-0 flex items-start sm:items-center gap-1.5 text-[11px] sm:text-xs leading-snug text-neutral-400 sm:truncate">
                    <span className="hidden sm:inline shrink-0">Class 9–10 Study Tutor</span>
                    <span className="hidden sm:inline shrink-0" aria-hidden="true">·</span>
                    {statusLoading ? (
                      <span className="whitespace-normal break-words sm:truncate">{statusDisplay.label}</span>
                    ) : status.state === "ready" ? (
                      <span className="inline-flex items-start sm:items-center gap-1 text-emerald-400 sm:truncate">
                        <CheckCircle2 size={11} className="mt-0.5 sm:mt-0 shrink-0" aria-hidden="true" />
                        <span className="whitespace-normal break-words sm:truncate">{statusDisplay.label}</span>
                      </span>
                    ) : status.state === "quota_exhausted" ? (
                      <span className="inline-flex items-start sm:items-center gap-1 text-amber-300 sm:truncate">
                        <AlertCircle size={11} className="mt-0.5 sm:mt-0 shrink-0" aria-hidden="true" />
                        <span className="whitespace-normal break-words sm:truncate">{statusDisplay.label}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={refreshHealthStatus}
                        className="inline-flex items-start sm:items-center gap-1 text-left text-red-300 hover:text-red-200 underline-offset-2 hover:underline cursor-pointer sm:truncate"
                      >
                        <WifiOff size={11} className="mt-0.5 sm:mt-0 shrink-0" aria-hidden="true" />
                        <span className="whitespace-normal break-words sm:truncate">{statusDisplay.label}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Workspace Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    title="Download this study session as JSON"
                  >
                    <Download size={14} aria-hidden="true" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                )}

                {messages.length > 0 && confirmClear ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleStartNewChat}
                      className="inline-flex min-h-[34px] items-center rounded-lg bg-[#FFD60A] px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-black hover:bg-[#FFD60A]/90 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="inline-flex min-h-[34px] items-center rounded-lg border border-white/15 px-2 py-1 text-[11px] sm:text-xs font-medium text-neutral-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
                    className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-white/15 bg-white/[0.04] px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium text-white hover:border-[#FFD60A]/50 hover:text-[#FFD60A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus size={13} className="sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                    <span>New Chat</span>
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* B. Dedicated Independent Transcript Scroll Container */}
          <div
            ref={transcriptRef}
            id="ai-transcript-scroll"
            onScroll={handleTranscriptScroll}
            role="log"
            aria-live="polite"
            aria-label="AI conversation transcript"
            style={{ overscrollBehaviorY: "contain", WebkitOverflowScrolling: "touch" }}
            className="relative flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y px-3 sm:px-6"
          >
            {messages.length === 0 ? (
              /* First-Visit Welcome & Starter Prompts */
              <div className="py-4 sm:py-7 space-y-4 sm:space-y-5">
                <div className="space-y-2" dir={isUrduUI ? "rtl" : "ltr"}>
                  <h2
                    className={`font-bold text-white tracking-tight text-balance ${
                      isUrduUI
                        ? "font-urdu text-xl sm:text-2xl leading-[1.9] text-right"
                        : "font-heading text-xl sm:text-2xl"
                    }`}
                  >
                    {isUrduUI
                      ? "آج کون سا سوال یا تصور سمجھنا چاہتے ہیں؟"
                      : "What would you like to solve today?"}
                  </h2>
                  <p
                    className={`text-neutral-400 max-w-xl ${
                      isUrduUI
                        ? "font-urdu text-[14px] leading-[2] text-right"
                        : "text-xs sm:text-sm leading-relaxed"
                    }`}
                  >
                    {isUrduUI
                      ? "پنجاب بورڈ اور فیڈرل بورڈ (کلاس 9 اور 10) کے مطابق ریاضی، فزکس، کیمسٹری اور بائیولوجی کی مرحلہ وار رہنمائی حاصل کریں۔"
                      : "Ask a Class 9–10 Math, Physics, Chemistry, or Biology question for step-by-step guidance."}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-medium text-neutral-400">
                    {isUrduUI
                      ? "مثال کے سوالات (فوری حل کے لیے کلک کریں)"
                      : "Try an example question"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {STARTER_QUESTIONS.map((item) => {
                      const questionText = isUrduUI ? item.ur : item.en;
                      return (
                        <button
                          key={item.subject}
                          type="button"
                          disabled={isGenerating}
                          onClick={() => handleSendMessage(questionText, item.subject)}
                          dir={isUrduUI ? "rtl" : "ltr"}
                          className={`group flex flex-col justify-between gap-1.5 rounded-xl border border-white/10 bg-[#13131A] p-3 sm:p-3.5 transition-colors hover:border-[#FFD60A]/50 hover:bg-[#171720] disabled:opacity-50 cursor-pointer ${
                            isUrduUI ? "text-right" : "text-left"
                          }`}
                        >
                          <span className="text-xs font-semibold text-[#FFD60A]">
                            {item.subject}
                          </span>
                          <span
                            className={`text-neutral-200 group-hover:text-white ${
                              isUrduUI
                                ? "font-urdu text-[13px] leading-[1.95]"
                                : "text-xs sm:text-sm leading-snug"
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
              <div className="py-4 sm:py-5 space-y-4 sm:space-y-5">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  const urduContent = isUrduText(msg.content);
                  const isLastMessage = idx === messages.length - 1;
                  const showThinkState =
                    !isUser && !msg.content && isGenerating && isLastMessage;
                  const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  if (isUser) {
                    return (
                      <div key={msg.id} className="flex flex-col items-end gap-1">
                        <div
                          dir="auto"
                          className={`max-w-[88%] sm:max-w-[78%] rounded-2xl border border-white/10 bg-[#181820] px-3.5 sm:px-4 py-2.5 text-base sm:text-[15px] text-white ${
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
                          <span>
                            {msg.subject && msg.subject !== "General" ? msg.subject : "Student"}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{formattedTime}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <article
                      key={msg.id}
                      className="w-full border-b border-white/[0.06] pb-5 last:border-b-0 space-y-2.5"
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
                          <Loader2
                            size={15}
                            className="animate-spin text-[#FFD60A]"
                            aria-hidden="true"
                          />
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
                              <WifiOff
                                size={18}
                                className="shrink-0 mt-0.5 text-red-300"
                                aria-hidden="true"
                              />
                            ) : (
                              <AlertCircle
                                size={18}
                                className={`shrink-0 mt-0.5 ${
                                  msg.errorKind === "rate_limit"
                                    ? "text-amber-300"
                                    : "text-red-300"
                                }`}
                                aria-hidden="true"
                              />
                            )}
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  urduContent
                                    ? "font-urdu leading-[2] text-right"
                                    : "leading-relaxed"
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
                            <div className="flex flex-wrap items-center gap-2 pt-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check
                                      size={13}
                                      className="text-emerald-400"
                                      aria-hidden="true"
                                    />
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
              </div>
            )}

            {/* Floating "Latest" pill shown inside transcript ONLY when student scrolled up */}
            {showScrollToLatest && (
              <div className="sticky bottom-3 z-10 flex justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={() => {
                    shouldAutoScrollRef.current = true;
                    setShowScrollToLatest(false);
                    scrollTranscriptToBottom("smooth");
                  }}
                  className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#181820]/95 px-3 py-1.5 text-xs font-medium text-white shadow-lg hover:border-[#FFD60A]/60 transition-colors cursor-pointer"
                >
                  <ArrowDown size={13} aria-hidden="true" />
                  <span>Jump to latest</span>
                </button>
              </div>
            )}
          </div>

          {/* C. Pinned Input Composer inside Chat Workspace */}
          <div className="shrink-0 w-full border-t border-white/[0.08] bg-[#0B0B10] px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-5 sm:pt-2 sm:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {composerNotice && (
              <div
                role="status"
                className="mb-2 sm:mb-1.5 flex items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 sm:py-1 text-[11px] text-amber-200"
              >
                <span className="leading-snug sm:truncate">{composerNotice}</span>
                <button
                  type="button"
                  onClick={() => setComposerNotice(null)}
                  className="text-amber-200/80 hover:text-white p-0.5 shrink-0 cursor-pointer"
                  aria-label="Dismiss notice"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {status.visionEnabled && attachedImage && (
              <div className="mb-2 sm:mb-1.5 inline-flex items-center gap-2.5 rounded-xl border border-[#FFD60A]/40 bg-[#141418] p-1.5 pr-3">
                <img
                  src={attachedImage.previewUrl}
                  alt="Attached textbook problem"
                  className="h-10 w-10 rounded-lg object-cover"
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
              className="rounded-xl border border-white/15 bg-[#13131A] focus-within:border-[#FFD60A]/70 transition-colors"
            >
              <textarea
                ref={textareaRef}
                id="ai-prompt-input"
                aria-label="Ask a Class 9 or 10 study question"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    chatWorkspaceRef.current?.scrollIntoView({
                      block: "nearest",
                      behavior: "smooth",
                    });
                  }
                }}
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
                className={`w-full resize-none bg-transparent px-3 pt-2.5 pb-2 sm:pt-2 sm:pb-1 text-base sm:text-[15px] text-white placeholder-neutral-500 focus:outline-none disabled:opacity-60 ${
                  isUrduUI || isUrduText(inputText)
                    ? "font-urdu leading-[1.85]"
                    : "leading-snug"
                }`}
              />

              {/* Controls Bar — 2 balanced rows on phones (< sm), classic single row on tablet/desktop (sm:+) */}
              <div className="flex flex-col gap-2.5 border-t border-white/[0.06] p-2.5 sm:flex-row sm:items-center sm:gap-1.5 sm:px-2 sm:py-1.5">
                {/* Phone Row 1: Equal-width Subject dropdown + English/اردو switch */}
                <div className="grid grid-cols-2 gap-2.5 w-full sm:flex sm:w-auto sm:items-center sm:gap-1.5 sm:min-w-0">
                  <select
                    aria-label="Select subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#191922] px-2.5 text-xs font-medium text-neutral-200 focus:border-[#FFD60A] focus:outline-none cursor-pointer truncate sm:h-9 sm:w-auto sm:max-w-none sm:px-2"
                  >
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <div
                    role="group"
                    aria-label="Response language"
                    className="grid grid-cols-2 h-11 w-full rounded-lg border border-white/10 bg-[#191922] p-0.5 sm:inline-flex sm:h-auto sm:w-auto sm:shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => setLanguageMode("en")}
                      className={`min-h-[38px] sm:min-h-[32px] rounded-md px-1.5 sm:px-2 text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
                      className={`min-h-[38px] sm:min-h-[32px] rounded-md px-1.5 sm:px-2 text-[11px] sm:text-xs font-urdu transition-colors whitespace-nowrap cursor-pointer ${
                        languageMode === "ur"
                          ? "bg-white text-black font-semibold"
                          : "text-neutral-300 hover:text-white"
                      }`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Phone Row 2: Compact >=44px Mic (+ optional Image) & flex-1 >=44px Send */}
                <div className="flex items-center gap-2.5 w-full sm:flex-1 sm:w-auto sm:gap-1.5 sm:min-w-0">
                  {/* Image attachment: rendered strictly when backend reports visionEnabled === true */}
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
                        className="inline-flex h-11 min-w-[44px] items-center justify-center gap-1 rounded-lg border border-white/10 bg-[#191922] px-2.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0 sm:h-9 sm:min-w-0 sm:px-2"
                        aria-label="Attach question image"
                      >
                        <ImageIcon size={15} className="sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Image</span>
                      </button>
                    </>
                  )}

                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      aria-label={isRecording ? "Stop voice dictation" : "Start voice dictation"}
                      className={`inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border text-xs transition-colors cursor-pointer shrink-0 sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0 ${
                        isRecording
                          ? "border-red-500/60 bg-red-500/20 text-red-300"
                          : "border-white/10 bg-[#191922] text-neutral-300 hover:text-white"
                      }`}
                    >
                      {isRecording ? (
                        <MicOff size={16} className="sm:w-[15px] sm:h-[15px]" aria-hidden="true" />
                      ) : (
                        <Mic size={16} className="sm:w-[15px] sm:h-[15px]" aria-hidden="true" />
                      )}
                    </button>
                  )}

                  <div className="flex flex-1 items-center gap-2.5 min-w-0 shrink-0 sm:flex-none sm:ml-auto sm:gap-2">
                    {inputText.length > 0 && (
                      <span className="hidden sm:inline text-[11px] font-mono tabular-nums text-neutral-500">
                        {inputText.length}/2000
                      </span>
                    )}

                    {isGenerating ? (
                      <button
                        type="button"
                        onClick={handleStopGeneration}
                        aria-label="Stop generating response"
                        className="inline-flex w-full min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer sm:w-auto sm:min-h-[36px]"
                      >
                        <Square size={12} className="fill-current" aria-hidden="true" />
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!inputText.trim() && !(status.visionEnabled && attachedImage)}
                        aria-label="Send question"
                        className="inline-flex w-full min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#FFD60A] px-3 text-xs font-bold text-black hover:bg-[#FFD60A]/90 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0 cursor-pointer sm:w-auto sm:min-h-[36px]"
                      >
                        <Send size={15} className="sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                        <span>Send</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <p className="mt-2 sm:mt-1 text-center text-[11px] leading-snug text-neutral-500 sm:truncate">
              History stays on this device · Verify textbook answers · Avoid sharing personal IDs
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. TUTORING OVERVIEW, SUBJECTS, USAGE GUIDE & FREE-TIER TRANSPARENCY
             (Scrolls independently via the main page — zero nested scrollboxes)
         ===================================================================== */}
      <div className="mx-auto w-full max-w-4xl px-3 sm:px-6 py-10 sm:py-14 space-y-12">
        {/* A. Introduction & What Matric Mastery AI Helps With */}
        <section
          id="ai-subjects"
          className="scroll-mt-24 space-y-6 border-t border-white/10 pt-10"
        >
          <div className="space-y-2">
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white text-balance">
              What Matric Mastery AI Helps You Study
            </h2>
            <p className="text-sm sm:text-[15px] text-neutral-300 leading-relaxed max-w-2xl">
              Your personal AI study assistant for Punjab Board Class 9–10. Use the workspace above whenever you want clear step-by-step explanations while preparing at home.
            </p>
            <p className="text-xs text-neutral-400">
              Matric Mastery AI is an independent student learning assistant, not an official Punjab Board or BISE service.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs sm:text-sm text-neutral-300">
            {TUTOR_CAPABILITIES.map((cap) => (
              <li
                key={cap}
                className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-[#111116] px-3.5 py-3"
              >
                <CheckCircle2
                  size={15}
                  className="shrink-0 mt-0.5 text-[#FFD60A]"
                  aria-hidden="true"
                />
                <span>{cap}</span>
              </li>
            ))}
          </ul>

          {/* B. Subject Coverage Cards */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                Core Class 9–10 Subjects Supported
              </h3>
              <span className="text-xs text-neutral-400">
                Select any subject to load it in chat
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUBJECT_GUIDES.map((subj) => (
                <div
                  key={subj.name}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-[#111116] p-4 sm:p-5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-heading text-base font-bold text-white">
                        {subj.name}
                      </h4>
                      <span className="text-[11px] font-medium text-[#FFD60A]">
                        Class 9–10
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {subj.summary}
                    </p>
                    <ul className="space-y-1 pt-1 text-xs sm:text-[13px] text-neutral-200">
                      {subj.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2">
                          <span className="text-[#FFD60A] mt-0.5" aria-hidden="true">
                            ·
                          </span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      focusWorkspaceWithTemplate({
                        subject: subj.selectValue,
                        notice: `${subj.name} selected — type your Class 9–10 question below.`,
                      })
                    }
                    className="inline-flex min-h-[38px] items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-[#FFD60A]/50 hover:text-[#FFD60A] transition-colors cursor-pointer"
                  >
                    <span>Ask a {subj.name} question</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-neutral-500">
              Note: Coverage is designed for Class 9–10 revision support; not every topic has been independently verified against every edition of every Punjab Board textbook.
            </p>
          </div>
        </section>

        {/* C. How to Use & Interactive Example Prompts */}
        <section
          id="ai-how-to-use"
          className="scroll-mt-24 space-y-6 border-t border-white/10 pt-10"
        >
          <div className="space-y-1.5">
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              How to Use Matric Mastery AI
            </h2>
            <p className="text-sm text-neutral-400">
              Follow these seven simple steps, or load an example prompt straight into the composer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 7 Numbered Steps */}
            <ol className="lg:col-span-6 space-y-2.5">
              {HOW_TO_USE_STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#111116] px-3.5 py-3 text-xs sm:text-sm text-neutral-200"
                >
                  <span className="font-mono text-xs font-bold tabular-nums text-[#FFD60A] shrink-0 pt-0.5">
                    0{index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            {/* Interactive Example Prompt Templates */}
            <div className="lg:col-span-6 space-y-3 rounded-xl border border-white/10 bg-[#111116] p-4 sm:p-5">
              <div className="space-y-1">
                <h3 className="font-heading text-sm sm:text-base font-bold text-white">
                  Useful Example Prompts
                </h3>
                <p className="text-xs text-neutral-400">
                  Tap any prompt below to load it into the chat box, add your problem details, and send.
                </p>
              </div>

              <div className="space-y-2">
                {INTERACTIVE_PROMPT_TEMPLATES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      focusWorkspaceWithTemplate({
                        prompt: item.prompt,
                        subject: item.subject,
                        language: item.language,
                        notice:
                          "Prompt loaded into chat — add your specific question or values and tap Send.",
                      })
                    }
                    className="w-full flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#16161E] px-3.5 py-2.5 text-left transition-colors hover:border-[#FFD60A]/50 hover:bg-[#1B1B24] cursor-pointer min-h-[44px]"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white">
                        &ldquo;{item.label}&rdquo;
                      </p>
                      <p className="text-[11px] text-neutral-400">{item.helper}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#FFD60A] shrink-0 whitespace-nowrap">
                      Use →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* D. Tips for Better Answers + Student Reminder */}
        <section
          id="ai-tips"
          className="scroll-mt-24 space-y-5 border-t border-white/10 pt-10"
        >
          <div className="space-y-1.5">
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              Tips for Better Answers
            </h2>
            <p className="text-sm text-neutral-400">
              Clear questions produce cleaner derivations, accurate units, and fewer follow-up turns.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-neutral-200">
            {BETTER_ANSWER_TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-[#111116] px-4 py-3"
              >
                <span className="text-[#FFD60A] font-bold shrink-0" aria-hidden="true">
                  ·
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-[#FFD60A]/30 bg-[#FFD60A]/[0.05] px-4 py-3.5 text-xs sm:text-sm text-neutral-100 leading-relaxed">
            <strong className="text-[#FFD60A] font-semibold">Student reminder:</strong>{" "}
            AI can occasionally make mistakes. Always verify important answers with your textbook and teacher.
          </div>
        </section>

        {/* E. Free AI Access — Usage Information (Strict Accuracy & Live Health Distinction) */}
        <section
          id="ai-free-access"
          className="scroll-mt-24 space-y-5 border-t border-white/10 pt-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                Free AI Access — Usage Information
              </h2>
              <p className="text-sm text-neutral-400">
                Honest details about free-tier access, shared capacity, and what temporary limits mean.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshHealthStatus}
              disabled={statusLoading}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-[#FFD60A]/50 hover:text-[#FFD60A] disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RefreshCw
                size={13}
                className={statusLoading ? "animate-spin" : ""}
                aria-hidden="true"
              />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Live Health Status Card (Distinct operational vs usage-limit vs unavailable states) */}
          <div className="rounded-xl border border-white/10 bg-[#111116] p-4 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold">
              {statusLoading ? (
                <Loader2 size={15} className="animate-spin text-neutral-400" aria-hidden="true" />
              ) : status.state === "ready" ? (
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" aria-hidden="true" />
              ) : status.state === "quota_exhausted" ? (
                <AlertCircle size={15} className="text-amber-300 shrink-0" aria-hidden="true" />
              ) : (
                <WifiOff size={15} className="text-red-300 shrink-0" aria-hidden="true" />
              )}
              <span className={statusDisplay.tone}>
                Live Backend Status: {statusDisplay.shortLabel}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {statusDisplay.detail}
            </p>
          </div>

          <ul className="space-y-2 rounded-xl border border-white/10 bg-[#111116] p-4 sm:p-5 text-xs sm:text-sm text-neutral-200">
            {FREE_ACCESS_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="text-[#FFD60A] font-bold shrink-0" aria-hidden="true">
                  ·
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>

          {/* Concise & Friendly Pakistani Urdu Reminder */}
          <div
            dir="rtl"
            className="rounded-xl border border-white/10 bg-[#111116] p-4 sm:p-5 text-right space-y-1.5"
          >
            <p className="text-xs font-semibold text-[#FFD60A]">
              طلبہ کے لیے ضروری یاددہانی
            </p>
            <p className="font-urdu text-sm sm:text-[15px] text-neutral-200 leading-[2.05]">
              Matric Mastery AI اس وقت مفت سروس پر چل رہا ہے جس کی روزانہ گنجائش محدود ہے۔ اگر زیادہ استعمال کی وجہ سے عارضی حد کا پیغام نظر آئے تو اس کا مطلب یہ نہیں کہ ویب سائٹ خراب ہے — براہِ کرم تھوڑا انتظار کر کے دوبارہ کوشش کریں، اور اہم امتحانی جوابات اپنی نصابی کتاب یا استاد سے ضرور ملائیں۔
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
