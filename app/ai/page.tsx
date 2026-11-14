/* ==========================================================================
   MATRIC MASTERY AI — AI EXPERIENCE 2.0 (/ai) (v4.1.0)
   - Preserves Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct-fast)
   - Independent outer-page & transcript scrolling (#ai-transcript-scroll)
   - Local multi-conversation manager (search, filter, rename, pin, delete)
   - Personalization settings (language, class 9/10, length, answer style)
   - Browser STT with cancel/review + optional Read-Aloud TTS
   - Unified composer attachment menu with honest disabled-vision preview
   ========================================================================== */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Square,
  Loader2,
  Image as ImageIcon,
  Camera,
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
  History,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import AIMarkdownRenderer from "@/components/AIMarkdownRenderer";
import AIChatHistoryDrawer from "@/components/ai/AIChatHistoryDrawer";
import AIPreferencesPopover from "@/components/ai/AIPreferencesPopover";
import {
  AI_IMAGE_INPUT_ENABLED,
  AIChatMessage,
  AIConversation,
  AIErrorKind,
  AIPreferences,
  AIRequestError,
  AIStatus,
  DEFAULT_AI_PREFERENCES,
  checkAIStatus,
  createConversationRecord,
  deriveConversationSubject,
  deriveConversationTitle,
  exportChatHistoryAsJSON,
  getAIPreferences,
  loadConversationsState,
  saveAIPreferences,
  saveConversationsState,
  sendAIMessage,
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

type VoiceState = "idle" | "listening" | "processing" | "error";

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
  "Usage is subject to shared provider capacity and applicable free-tier limits.",
  "The AI may occasionally respond slowly during busy hours.",
  "During heavy demand, students may temporarily see a usage-limit message.",
  "A healthy backend status does not always guarantee instant inference capacity.",
  "A temporary limit does not mean the website or student's account is broken.",
  "Students should wait and try again shortly.",
];

const URDU_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

function isUrduText(text: string): boolean {
  return URDU_CHAR_REGEX.test(text);
}

function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " Code example included on screen. ")
    .replace(/\$\$([^$]+)\$\$/g, "$1")
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/[#*_`>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
  // Conversation collection & active conversation state
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [messages, setMessages] = useState<AIChatMessage[]>([]);

  // Composer & preferences
  const [inputText, setInputText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("General");
  const [preferences, setPreferences] = useState<AIPreferences>(DEFAULT_AI_PREFERENCES);
  const languageMode = preferences.language;

  // Network / Worker state
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<AIStatus>({
    state: "unconfigured",
    provider: "none",
    model: "@cf/meta/llama-3.1-8b-instruct-fast",
    message: "Checking service availability...",
    visionEnabled: false,
  });

  // Attachment state (preview supported locally; image payload sent ONLY if status.visionEnabled === true)
  const [attachedImage, setAttachedImage] = useState<{
    previewUrl: string;
    mimeType: string;
    base64: string;
    fileName: string;
    fileSize: number;
  } | null>(null);
  const [composerNotice, setComposerNotice] = useState<string | null>(null);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Voice STT & TTS states
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // UI interactions & independent transcript scroll tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatWorkspaceRef = useRef<HTMLDivElement>(null);
  const composerDockRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const voiceBaseTextRef = useRef<string>("");
  const voiceCancelledRef = useRef<boolean>(false);
  const voiceErrorRef = useRef<boolean>(false);
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

  // Clear any stale image selection when image input is temporarily disabled
  useEffect(() => {
    if (!AI_IMAGE_INPUT_ENABLED) {
      setAttachedImage(null);
      setToolsMenuOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  }, []);

  // Load status, saved multi-conversation history (migrating v1 if present), preferences & Web Speech APIs
  useEffect(() => {
    refreshHealthStatus();

    const loadedPrefs = getAIPreferences();
    setPreferences(loadedPrefs);

    const loadedState = loadConversationsState();
    setConversations(loadedState.conversations);
    setActiveConversationId(loadedState.activeId);
    const activeConv = loadedState.conversations.find(
      (c) => c.id === loadedState.activeId
    );
    setMessages(activeConv?.messages || []);
    if (activeConv?.subject) {
      setSelectedSubject(activeConv.subject);
    }

    if (typeof window !== "undefined") {
      const hasSpeech =
        "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
      setSpeechSupported(Boolean(hasSpeech));
      setTtsSupported("speechSynthesis" in window);
    }

    return () => {
      try {
        recognitionRef.current?.abort?.();
      } catch {
        // ignore cleanup error
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [refreshHealthStatus]);

  // Close unified tools menu on outside click / Escape
  useEffect(() => {
    if (!toolsMenuOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (
        toolsMenuRef.current &&
        !toolsMenuRef.current.contains(event.target as Node)
      ) {
        setToolsMenuOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setToolsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [toolsMenuOpen]);

  // Persist helper keeping state & LocalStorage synchronized
  const commitConversations = useCallback(
    (nextConversations: AIConversation[], nextActiveId: string) => {
      setConversations(nextConversations);
      setActiveConversationId(nextActiveId);
      saveConversationsState({
        activeId: nextActiveId,
        conversations: nextConversations,
      });
    },
    []
  );

  const updatePreferences = useCallback((next: AIPreferences) => {
    setPreferences(next);
    saveAIPreferences(next);
  }, []);

  const setLanguageMode = useCallback(
    (lang: "en" | "ur") => {
      updatePreferences({ ...preferences, language: lang });
    },
    [preferences, updatePreferences]
  );

  // Auto-resize composer textarea cleanly
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 156;
    const nextHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [inputText]);

  // Keep floating composer visible when mobile on-screen keyboard opens
  useEffect(() => {
    if (typeof window === "undefined") return;
    const alignComposerForKeyboard = () => {
      if (
        window.innerWidth < 768 &&
        document.activeElement === textareaRef.current
      ) {
        composerDockRef.current?.scrollIntoView({
          block: "end",
          behavior: "auto",
        });
      }
    };
    const vv = window.visualViewport;
    vv?.addEventListener("resize", alignComposerForKeyboard);
    window.addEventListener("resize", alignComposerForKeyboard);
    return () => {
      vv?.removeEventListener("resize", alignComposerForKeyboard);
      window.removeEventListener("resize", alignComposerForKeyboard);
    };
  }, []);

  // Scroll strictly inside the dedicated transcript container — NEVER scroll the outer page
  const scrollTranscriptToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      const el = transcriptRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior });
    },
    []
  );

  // Preserve reading position when scrolling through older messages
  const handleTranscriptScroll = useCallback(() => {
    const el = transcriptRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom <= 64;
    shouldAutoScrollRef.current = nearBottom;
    setShowScrollToLatest(!nearBottom && messages.length > 0);
  }, [messages.length]);

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

  // Attachment validation & preview
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToolsMenuOpen(false);
    if (!AI_IMAGE_INPUT_ENABLED) {
      e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setComposerNotice(
        `Unsupported format (${file.type || "unknown"}). Please select a JPEG, PNG, or WebP image.`
      );
      e.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setComposerNotice(
        `Selected image is ${formatFileSize(file.size)}. Maximum allowed size is 4 MB.`
      );
      e.target.value = "";
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
          fileName: file.name,
          fileSize: file.size,
        });
      }
    };
    reader.onerror = () => {
      setComposerNotice("Could not read the selected image file. Please try another photo.");
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  // Speech-to-Text with clear states & cancellation
  const cancelVoiceInput = useCallback(() => {
    voiceCancelledRef.current = true;
    try {
      recognitionRef.current?.abort?.();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
    setInputText(voiceBaseTextRef.current);
    setVoiceState("idle");
    setVoiceFeedback(null);
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      setVoiceState("error");
      setVoiceFeedback(
        languageMode === "ur"
          ? "اس براؤزر میں وائس ٹائپنگ دستیاب نہیں ہے۔ براہ کرم اپنا سوال لکھیں۔"
          : "Speech-to-text is not supported in this browser. Please type your question."
      );
      return;
    }

    if (voiceState === "listening" || voiceState === "processing") {
      setVoiceState("processing");
      try {
        recognitionRef.current?.stop?.();
      } catch {
        setVoiceState("idle");
      }
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setVoiceState("error");
        setVoiceFeedback("Speech recognition is unavailable in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = languageMode === "ur" ? "ur-PK" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      voiceCancelledRef.current = false;
      voiceErrorRef.current = false;
      voiceBaseTextRef.current = inputText.trim();
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setVoiceState("listening");
        setVoiceFeedback(
          languageMode === "ur"
            ? "آواز سنی جا رہی ہے... بولنے کے بعد متن میں تبدیلی کر سکتے ہیں۔"
            : "Listening... speak clearly, then review or edit before sending."
        );
      };

      recognition.onresult = (event: any) => {
        if (voiceCancelledRef.current) return;
        let combined = "";
        for (let i = 0; i < event.results.length; i++) {
          combined += event.results[i][0]?.transcript || "";
        }
        const cleaned = combined.trim();
        const base = voiceBaseTextRef.current;
        if (cleaned) {
          setInputText(base ? `${base} ${cleaned}` : cleaned);
        }
      };

      recognition.onerror = (event: any) => {
        if (voiceCancelledRef.current) return;
        const code = event?.error;
        voiceErrorRef.current = true;
        setVoiceState("error");
        if (code === "not-allowed" || code === "service-not-allowed") {
          setVoiceFeedback(
            languageMode === "ur"
              ? "مائیکروفون کی اجازت نہیں ملی۔ براؤزر سیٹنگز سے اجازت دیں یا سوال ٹائپ کریں۔"
              : "Microphone permission was denied. Allow microphone access in browser settings or type your question."
          );
        } else if (code === "no-speech") {
          setVoiceFeedback(
            languageMode === "ur"
              ? "کوئی آواز سنائی نہیں دی۔ دوبارہ کوشش کریں۔"
              : "No speech detected. Try again closer to the microphone."
          );
        } else {
          setVoiceFeedback("Voice recognition stopped unexpectedly. You can type or retry.");
        }
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        if (!voiceCancelledRef.current) {
          if (voiceErrorRef.current) {
            setVoiceState("error");
          } else {
            setVoiceState("idle");
            setVoiceFeedback(null);
          }
          textareaRef.current?.focus();
        }
      };

      recognition.start();
    } catch {
      setVoiceState("error");
      setVoiceFeedback("Could not start microphone dictation on this device.");
    }
  };

  // Optional Read-Aloud Text-to-Speech (never auto-plays)
  const stopReadAloud = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  }, []);

  const handleToggleReadAloud = (msgId: string, rawText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !ttsSupported) {
      setComposerNotice("Read-aloud speech synthesis is unavailable in this browser.");
      return;
    }

    if (speakingMessageId === msgId) {
      stopReadAloud();
      return;
    }

    window.speechSynthesis.cancel();
    const spokenText = stripMarkdownForSpeech(rawText);
    if (!spokenText) return;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = isUrduText(spokenText) ? "ur-PK" : "en-US";
    utterance.rate = 0.98;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Persist messages cleanly into active conversation record
  const syncActiveMessages = useCallback(
    (updatedMessages: AIChatMessage[], subjectForConv?: string) => {
      setConversations((prevConvs) => {
        const idx = prevConvs.findIndex((c) => c.id === activeConversationId);
        const now = Date.now();
        let nextConvs: AIConversation[];

        if (idx >= 0) {
          const current = prevConvs[idx];
          const shouldAutoTitle =
            current.title === "New Study Chat" ||
            current.title === "Previous Study Session";
          const nextTitle = shouldAutoTitle
            ? deriveConversationTitle(updatedMessages, current.title)
            : current.title;
          const nextSubject =
            updatedMessages.length > 0
              ? deriveConversationSubject(updatedMessages)
              : subjectForConv || current.subject;

          const updatedConv: AIConversation = {
            ...current,
            title: nextTitle,
            subject: nextSubject,
            updatedAt: now,
            messages: updatedMessages,
          };
          nextConvs = [...prevConvs];
          nextConvs[idx] = updatedConv;
        } else {
          const created = createConversationRecord(
            subjectForConv || "General",
            updatedMessages
          );
          nextConvs = [created, ...prevConvs];
        }

        saveConversationsState({
          activeId: activeConversationId,
          conversations: nextConvs,
        });
        return nextConvs;
      });
    },
    [activeConversationId]
  );

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
        preferences,
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
        syncActiveMessages(updated, subjectOverride);
        return updated;
      });

      addXP(15, "Solved question with Matric Mastery AI");
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== placeholderId);
          syncActiveMessages(filtered, subjectOverride);
          return filtered;
        });
        return;
      }

      const friendly = getStudentFriendlyError(err, languageMode);
      if (friendly.kind === "rate_limit") {
        setStatus((prev) => ({ ...prev, state: "quota_exhausted" }));
      }

      setMessages((prev) => {
        const updated = prev.map((m) =>
          m.id === placeholderId
            ? {
                ...m,
                content: friendly.message,
                error: true,
                errorKind: friendly.kind,
                resetsAt: friendly.resetsAt,
              }
            : m
        );
        syncActiveMessages(updated, subjectOverride);
        return updated;
      });
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
    const activeAttachment =
      AI_IMAGE_INPUT_ENABLED && status.visionEnabled ? attachedImage : null;

    if (!AI_IMAGE_INPUT_ENABLED && attachedImage) {
      setAttachedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }

    if (AI_IMAGE_INPUT_ENABLED && !textToSend && attachedImage && !status.visionEnabled) {
      setComposerNotice(
        "Image analysis is currently paused pending guardian Meta license approval. Please type your question in text or remove the photo preview."
      );
      return;
    }

    if (!textToSend && !activeAttachment) return;

    if (textToSend.length > 2000) {
      setComposerNotice("Keep your question under 2,000 characters.");
      return;
    }

    stopReadAloud();
    isSubmittingRef.current = true;
    shouldAutoScrollRef.current = true;
    setShowScrollToLatest(false);
    setComposerNotice(null);
    setToolsMenuOpen(false);
    setVoiceFeedback(null);

    const activeSubject = subjectOverride || selectedSubject;
    if (subjectOverride) {
      setSelectedSubject(subjectOverride);
    }

    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: textToSend || "Solve this question step by step.",
      timestamp: Date.now(),
      image: activeAttachment
        ? {
            previewUrl: activeAttachment.previewUrl,
            mimeType: activeAttachment.mimeType,
            base64: activeAttachment.base64,
          }
        : undefined,
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
    const nextWithPlaceholder = [...nextHistory, assistantPlaceholder];
    setMessages(nextWithPlaceholder);
    syncActiveMessages(nextHistory, activeSubject);

    if (customPrompt === undefined) {
      setInputText("");
    }
    if (AI_IMAGE_INPUT_ENABLED && status.visionEnabled) {
      setAttachedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
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

    stopReadAloud();
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
      imagePayload:
        AI_IMAGE_INPUT_ENABLED && status.visionEnabled && lastUser.image
          ? { mimeType: lastUser.image.mimeType, base64: lastUser.image.base64 }
          : null,
    });
  };

  const handleStopGeneration = () => {
    abortControllerRef.current?.abort();
  };

  // Multi-conversation handlers
  const handleStartNewChat = () => {
    if (isGenerating) {
      abortControllerRef.current?.abort();
    }
    stopReadAloud();

    // If current chat is already empty, just focus composer
    if (messages.length === 0) {
      textareaRef.current?.focus();
      return;
    }

    const fresh = createConversationRecord(selectedSubject);
    const nonEmptyOthers = conversations.filter((c) => c.messages.length > 0);
    const nextList = [fresh, ...nonEmptyOthers];
    commitConversations(nextList, fresh.id);
    setMessages([]);
    setComposerNotice(null);
    setShowScrollToLatest(false);
    shouldAutoScrollRef.current = true;
    textareaRef.current?.focus();
  };

  const handleSelectConversation = (id: string) => {
    if (isGenerating) {
      abortControllerRef.current?.abort();
    }
    stopReadAloud();

    const target = conversations.find((c) => c.id === id);
    if (!target) return;

    // Drop stale completely empty unsaved placeholder threads except selected
    const cleaned = conversations.filter((c) => c.id === id || c.messages.length > 0);
    commitConversations(cleaned, id);
    setMessages(target.messages);
    if (target.subject) setSelectedSubject(target.subject);
    setComposerNotice(null);
    setShowScrollToLatest(false);
    shouldAutoScrollRef.current = true;
  };

  const handleRenameConversation = (id: string, nextTitle: string) => {
    const next = conversations.map((c) =>
      c.id === id ? { ...c, title: nextTitle } : c
    );
    commitConversations(next, activeConversationId);
  };

  const handleTogglePinConversation = (id: string) => {
    const next = conversations.map((c) =>
      c.id === id ? { ...c, pinned: !c.pinned } : c
    );
    commitConversations(next, activeConversationId);
  };

  const handleDeleteConversation = (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id);
    if (id === activeConversationId) {
      stopReadAloud();
      if (remaining.length === 0) {
        const fresh = createConversationRecord();
        commitConversations([fresh], fresh.id);
        setMessages([]);
      } else {
        const nextActive = remaining[0];
        commitConversations(remaining, nextActive.id);
        setMessages(nextActive.messages);
      }
      shouldAutoScrollRef.current = true;
      setShowScrollToLatest(false);
    } else {
      commitConversations(remaining, activeConversationId);
    }
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
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    const jsonStr = exportChatHistoryAsJSON(
      messages,
      activeConv?.title || "Matric Mastery AI Study Session"
    );
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
  const savedNonEmptyCount = conversations.filter((c) => c.messages.length > 0).length;

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
            "Backend reachable on shared free-tier capacity (availability depends on provider capacity).",
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

  const prefSummaryLabel = `Class ${preferences.classLevel} · ${
    preferences.explanationLength.charAt(0).toUpperCase() +
    preferences.explanationLength.slice(1)
  } · ${
    preferences.presentationStyle === "step-by-step"
      ? "Step-by-step"
      : preferences.presentationStyle === "exam-style"
        ? "Exam-style"
        : "Conceptual"
  }`;

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
          2. DEDICATED FULL-HEIGHT CHAT WORKSPACE (~90dvh, centered 760px)
         ===================================================================== */}
      <section
        aria-label="Matric Mastery AI Tutoring Workspace"
        className="w-full border-t border-white/[0.06] bg-[#0A0A0A]"
      >
        <div
          ref={chatWorkspaceRef}
          id="ai-chat-workspace"
          className="scroll-mt-20 mx-auto flex h-[90dvh] min-h-[420px] w-full max-w-[760px] flex-col overflow-hidden bg-[#0A0A0A]"
        >
          {/* A. Clean Chat Top Bar */}
          <header className="shrink-0 w-full border-b border-white/[0.06] bg-[#0A0A0A] px-3 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD60A] text-black">
                  <GraduationCap size={18} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-heading text-[15px] sm:text-base font-bold tracking-tight text-white leading-tight">
                    Matric Mastery AI
                  </h1>
                  <div className="mt-0.5 flex flex-wrap items-start gap-x-1.5 text-xs leading-snug text-neutral-400">
                    {statusLoading ? (
                      <span className="whitespace-normal break-words">{statusDisplay.label}</span>
                    ) : status.state === "ready" ? (
                      <span className="inline-flex items-start gap-1 text-emerald-400">
                        <CheckCircle2 size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="whitespace-normal break-words">{statusDisplay.label}</span>
                      </span>
                    ) : status.state === "quota_exhausted" ? (
                      <span className="inline-flex items-start gap-1 text-amber-300">
                        <AlertCircle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="whitespace-normal break-words">{statusDisplay.label}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={refreshHealthStatus}
                        className="inline-flex items-start gap-1 text-left text-red-300 hover:text-red-200 underline-offset-2 hover:underline cursor-pointer"
                      >
                        <WifiOff size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="whitespace-normal break-words">{statusDisplay.label}</span>
                      </button>
                    )}
                    <span className="hidden sm:inline text-neutral-600" aria-hidden="true">
                      ·
                    </span>
                    <span className="hidden sm:inline text-neutral-400">{prefSummaryLabel}</span>
                  </div>
                </div>
              </div>

              {/* Workspace Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setHistoryDrawerOpen(true)}
                  aria-label="Open saved chat history"
                  title="Saved study chats"
                  className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-neutral-200 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <History size={15} aria-hidden="true" />
                  <span className="hidden sm:inline">Chats</span>
                  {savedNonEmptyCount > 0 && (
                    <span className="font-mono text-[11px] tabular-nums text-[#FFD60A]">
                      {savedNonEmptyCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPreferencesOpen(true)}
                  aria-label="Open tutor preferences"
                  title="Tutor personalization settings"
                  className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-neutral-200 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal size={15} aria-hidden="true" />
                  <span className="hidden md:inline">Preferences</span>
                </button>

                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    aria-label="Download study session JSON"
                    title="Download this study session as JSON"
                    className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Download size={15} aria-hidden="true" />
                    <span className="hidden md:inline">Download</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStartNewChat}
                  disabled={messages.length === 0 && !isGenerating}
                  aria-label="New Chat"
                  title="Start a new conversation"
                  className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 sm:px-3 text-xs font-medium text-white hover:border-[#FFD60A]/50 hover:text-[#FFD60A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus size={15} aria-hidden="true" />
                  <span className="min-[390px]:hidden">New</span>
                  <span className="hidden min-[390px]:inline">New Chat</span>
                </button>
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
            className="relative flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y px-3.5 sm:px-6"
          >
            {messages.length === 0 ? (
              /* First-Visit Spacious Empty State & Big Tappable Suggestion Cards */
              <div className="py-5 sm:py-9 pb-10 space-y-6">
                <div className="space-y-2.5" dir={isUrduUI ? "rtl" : "ltr"}>
                  <div className={`flex ${isUrduUI ? "justify-end" : "justify-start"}`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD60A] text-black shadow-[0_6px_24px_rgba(255,214,10,0.2)]">
                      <GraduationCap size={22} strokeWidth={2.2} />
                    </div>
                  </div>
                  <h2
                    className={`font-bold text-white tracking-tight text-balance ${
                      isUrduUI
                        ? "font-urdu text-2xl sm:text-[28px] leading-[1.9] text-right"
                        : "font-heading text-2xl sm:text-[28px] leading-tight"
                    }`}
                  >
                    {isUrduUI
                      ? "آج کون سا سوال یا تصور سمجھنا چاہتے ہیں؟"
                      : "What would you like to solve today?"}
                  </h2>
                  <p
                    className={`text-neutral-400 max-w-2xl ${
                      isUrduUI
                        ? "font-urdu text-[15px] leading-[2] text-right"
                        : "text-[15px] sm:text-base leading-[1.6]"
                    }`}
                  >
                    {isUrduUI
                      ? "پنجاب بورڈ اور فیڈرل بورڈ (کلاس 9 اور 10) کے مطابق ریاضی، فزکس، کیمسٹری اور بائیولوجی کی مرحلہ وار رہنمائی حاصل کریں۔"
                      : "Ask a Class 9–10 Math, Physics, Chemistry, or Biology question for step-by-step guidance."}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-neutral-400">
                    {isUrduUI
                      ? "مثال کے سوالات (فوری حل کے لیے کلک کریں)"
                      : "Try an example question"}
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
                          className={`group flex min-h-[96px] sm:min-h-[112px] flex-col justify-between gap-2.5 rounded-2xl border border-white/10 bg-[#141419] p-4 sm:p-5 transition-[transform,border-color,background-color] duration-150 hover:border-[#FFD60A]/50 hover:bg-[#191920] active:scale-[0.99] disabled:opacity-50 cursor-pointer ${
                            isUrduUI ? "text-right" : "text-left"
                          }`}
                        >
                          <span className="text-xs font-semibold text-[#FFD60A]">
                            {item.subject}
                          </span>
                          <span
                            className={`text-neutral-100 group-hover:text-white ${
                              isUrduUI
                                ? "font-urdu text-[15px] leading-[1.95]"
                                : "text-[15px] leading-relaxed"
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
              <div className="pt-5 pb-10 sm:pt-6 sm:pb-12 space-y-5 sm:space-y-6">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  const urduContent = isUrduText(msg.content);
                  const isLastMessage = idx === messages.length - 1;
                  const isStreamingMsg = !isUser && isGenerating && isLastMessage;
                  const showThinkState = isStreamingMsg && !msg.content;
                  const isSpeakingThis = speakingMessageId === msg.id;
                  const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  if (isUser) {
                    return (
                      <div key={msg.id} className="flex flex-col items-end gap-1.5 ai-msg-enter">
                        <div
                          dir="auto"
                          className={`max-w-[88%] sm:max-w-[78%] rounded-2xl border border-[#FFD60A]/30 bg-[#FFD60A]/[0.13] px-4 py-3 sm:px-5 sm:py-3.5 text-[16px] sm:text-[17px] text-white ${
                            urduContent
                              ? "font-urdu leading-[2.0] text-right"
                              : "leading-[1.65]"
                          }`}
                        >
                          {AI_IMAGE_INPUT_ENABLED && msg.image && (
                            <img
                              src={msg.image.previewUrl}
                              alt="Attached question"
                              className="mb-3 max-h-56 rounded-xl border border-white/15 object-contain bg-black"
                            />
                          )}
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-2 px-1 text-xs text-neutral-500 tabular-nums">
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
                      className="w-full space-y-3 py-1 ai-msg-enter"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-neutral-400">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FFD60A] text-black">
                            <GraduationCap size={13} strokeWidth={2.2} aria-hidden="true" />
                          </span>
                          <span className="font-semibold text-white">Matric Mastery AI</span>
                          {msg.subject && msg.subject !== "General" && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#FFD60A]">{msg.subject}</span>
                            </>
                          )}
                        </div>
                        <span className="tabular-nums text-xs text-neutral-500 shrink-0">
                          {formattedTime}
                        </span>
                      </div>

                      {showThinkState ? (
                        <div className="flex items-center gap-2.5 py-2 text-[16px] text-neutral-300">
                          <Loader2
                            size={16}
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
                          className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${
                            msg.errorKind === "rate_limit"
                              ? "border-amber-500/35 bg-amber-500/[0.07] text-amber-100"
                              : "border-red-500/35 bg-red-500/[0.07] text-red-100"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {msg.errorKind === "network" ? (
                              <WifiOff
                                size={18}
                                className="shrink-0 mt-1 text-red-300"
                                aria-hidden="true"
                              />
                            ) : (
                              <AlertCircle
                                size={18}
                                className={`shrink-0 mt-1 ${
                                  msg.errorKind === "rate_limit"
                                    ? "text-amber-300"
                                    : "text-red-300"
                                }`}
                                aria-hidden="true"
                              />
                            )}
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <p
                                className={`text-[16px] font-medium ${
                                  urduContent
                                    ? "font-urdu leading-[2] text-right"
                                    : "leading-[1.65]"
                                }`}
                              >
                                {msg.content}
                              </p>
                              {msg.errorKind === "rate_limit" && msg.resetsAt && (
                                <p className="text-xs text-amber-200/80">
                                  Shared daily allocation resets around {msg.resetsAt}.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              type="button"
                              disabled={isGenerating}
                              onClick={() => handleRetryTurn(msg.id)}
                              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-white text-black px-3.5 py-2 text-xs font-semibold hover:bg-neutral-200 disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              <RotateCcw size={14} aria-hidden="true" />
                              <span>Retry Question</span>
                            </button>

                            {msg.errorKind === "rate_limit" && (
                              <>
                                <Link
                                  href="/strategies"
                                  className="inline-flex min-h-[40px] items-center rounded-xl border border-white/20 px-3.5 py-2 text-xs font-medium text-white hover:border-[#FFD60A]/60 transition-colors"
                                >
                                  Exam Strategies
                                </Link>
                                <Link
                                  href="/past-papers"
                                  className="inline-flex min-h-[40px] items-center rounded-xl border border-white/20 px-3.5 py-2 text-xs font-medium text-white hover:border-[#FFD60A]/60 transition-colors"
                                >
                                  Past Papers
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-full min-w-0">
                            <AIMarkdownRenderer
                              content={msg.content}
                              isStreaming={isStreamingMsg}
                            />
                          </div>

                          {!isStreamingMsg && msg.content && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                aria-label={copiedId === msg.id ? "Copied" : "Copy"}
                                title={copiedId === msg.id ? "Copied" : "Copy"}
                                className="inline-flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white active:scale-[0.97] transition-[transform,color,border-color] duration-150 cursor-pointer"
                              >
                                {copiedId === msg.id ? (
                                  <Check
                                    size={16}
                                    className="text-emerald-400"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Copy size={16} aria-hidden="true" />
                                )}
                                <span className="sr-only">
                                  {copiedId === msg.id ? "Copied" : "Copy"}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleReadAloud(msg.id, msg.content)}
                                aria-label={isSpeakingThis ? "Stop reading aloud" : "Read aloud"}
                                title={isSpeakingThis ? "Stop reading" : "Read answer aloud"}
                                className={`inline-flex h-10 min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium active:scale-[0.97] transition-[transform,color,border-color] duration-150 cursor-pointer ${
                                  isSpeakingThis
                                    ? "border-[#FFD60A]/60 bg-[#FFD60A]/15 text-[#FFD60A]"
                                    : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white"
                                }`}
                              >
                                {isSpeakingThis ? (
                                  <>
                                    <VolumeX size={16} aria-hidden="true" />
                                    <span>Stop</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 size={16} aria-hidden="true" />
                                    <span className="hidden sm:inline">Listen</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleShareWhatsApp(msg.content)}
                                aria-label="Share"
                                title="Share"
                                className="inline-flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white active:scale-[0.97] transition-[transform,color,border-color] duration-150 cursor-pointer"
                              >
                                <Share2 size={16} aria-hidden="true" />
                                <span className="sr-only">Share</span>
                              </button>

                              {isLastMessage && (
                                <button
                                  type="button"
                                  disabled={isGenerating}
                                  onClick={() => handleRetryTurn(msg.id)}
                                  aria-label="Regenerate"
                                  title="Regenerate"
                                  className="inline-flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white disabled:opacity-40 active:scale-[0.97] transition-[transform,color,border-color] duration-150 cursor-pointer"
                                >
                                  <RotateCcw size={16} aria-hidden="true" />
                                  <span className="sr-only">Regenerate</span>
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

            {/* Floating "Jump to latest" inside transcript ONLY when student scrolled up */}
            {showScrollToLatest && (
              <div className="sticky bottom-4 z-10 flex justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={() => {
                    shouldAutoScrollRef.current = true;
                    setShowScrollToLatest(false);
                    scrollTranscriptToBottom("smooth");
                  }}
                  className="pointer-events-auto inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/20 bg-[#181822]/95 px-3.5 py-2 text-xs font-medium text-white shadow-lg hover:border-[#FFD60A]/60 transition-colors cursor-pointer"
                >
                  <ArrowDown size={14} aria-hidden="true" />
                  <span>Jump to latest</span>
                </button>
              </div>
            )}
          </div>

          {/* C. Bottom Pinned Dock with Soft Fade + Subject/Language Row + Unified Composer */}
          <div
            ref={composerDockRef}
            className="relative shrink-0 w-full bg-[#0A0A0A] px-3 sm:px-6 pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            {/* Soft fade above composer so scrolling messages glide underneath */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-9 h-9 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"
            />

            {composerNotice && (
              <div
                role="status"
                className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200"
              >
                <span className="leading-snug">{composerNotice}</span>
                <button
                  type="button"
                  onClick={() => setComposerNotice(null)}
                  className="text-amber-200/80 hover:text-white p-1 shrink-0 cursor-pointer"
                  aria-label="Dismiss notice"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Voice listening / processing / error inline status bar with Cancel button */}
            {(voiceState !== "idle" || voiceFeedback) && (
              <div
                role="status"
                className={`mb-2 flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs ${
                  voiceState === "error"
                    ? "border-red-500/35 bg-red-500/10 text-red-200"
                    : "border-[#FFD60A]/40 bg-[#FFD60A]/10 text-[#FFD60A]"
                }`}
              >
                <span className="leading-snug flex-1 min-w-0">
                  {voiceFeedback ||
                    (voiceState === "processing"
                      ? "Processing speech..."
                      : "Listening...")}
                </span>
                {voiceState === "listening" || voiceState === "processing" ? (
                  <button
                    type="button"
                    onClick={cancelVoiceInput}
                    className="min-h-[30px] rounded-lg border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-black/60 shrink-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceState("idle");
                      setVoiceFeedback(null);
                    }}
                    aria-label="Dismiss voice notice"
                    className="p-1 text-current opacity-80 hover:opacity-100 shrink-0 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Attached Image Preview Card (gated behind AI_IMAGE_INPUT_ENABLED) */}
            {AI_IMAGE_INPUT_ENABLED && attachedImage && (
              <div className="mb-2 rounded-xl border border-white/15 bg-[#14141B] p-2.5 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={attachedImage.previewUrl}
                      alt="Selected textbook problem preview"
                      className="h-12 w-12 shrink-0 rounded-lg border border-white/10 object-cover bg-black"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-white">
                        {attachedImage.fileName}
                      </p>
                      <p className="text-[11px] text-neutral-400 tabular-nums">
                        {formatFileSize(attachedImage.fileSize)} ·{" "}
                        {status.visionEnabled
                          ? "Ready for analysis"
                          : "Preview only · Vision unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[34px] rounded-lg border border-white/15 bg-white/[0.04] px-2.5 text-[11px] font-medium text-neutral-200 hover:text-white cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={removeAttachedImage}
                      aria-label="Remove attached image"
                      className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-red-400/50 hover:text-red-300 cursor-pointer"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {!status.visionEnabled && (
                  <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1.5 text-[11px] leading-snug text-amber-200">
                    Image understanding is paused until a parent/guardian accepts the Meta vision license. Your photo is previewed locally only and will not be sent — please type your question in text.
                  </p>
                )}
              </div>
            )}

            {/* Slim row above floating input: Subject dropdown & English/اردو toggle */}
            <div className="mb-2 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2">
              <div className="contents sm:flex sm:items-center sm:gap-2">
                <select
                  aria-label="Select subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="h-10 w-full sm:w-auto sm:min-w-[175px] rounded-xl border border-white/12 bg-[#14141A] px-3 text-[13px] font-medium text-neutral-100 focus:border-[#FFD60A] focus:outline-none cursor-pointer"
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
                  className="grid grid-cols-2 h-10 w-full sm:w-auto sm:min-w-[164px] rounded-xl border border-white/12 bg-[#14141A] p-1 shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => setLanguageMode("en")}
                    className={`h-full rounded-lg px-2 text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
                    className={`h-full rounded-lg px-2 text-[13px] font-urdu transition-colors whitespace-nowrap cursor-pointer ${
                      languageMode === "ur"
                        ? "bg-white text-black font-semibold"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    اردو
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreferencesOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-[#FFD60A] transition-colors cursor-pointer"
              >
                <span>{prefSummaryLabel}</span>
              </button>
            </div>

            {/* Hidden File & Camera Inputs (gated behind AI_IMAGE_INPUT_ENABLED) */}
            {AI_IMAGE_INPUT_ENABLED && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  aria-label="Upload image from gallery"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  onChange={handleImageSelect}
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  className="hidden"
                  aria-label="Take photo with camera"
                />
              </>
            )}

            {/* Floating 24px Rounded Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative rounded-[24px] border border-white/15 bg-[#14141A] px-3.5 pt-3 pb-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.7)] focus-within:border-[#FFD60A]/75 focus-within:shadow-[0_12px_36px_rgba(0,0,0,0.75),0_0_24px_rgba(255,214,10,0.22)] transition-[border-color,box-shadow] duration-200"
            >
              <textarea
                ref={textareaRef}
                id="ai-prompt-input"
                aria-label="Ask a Class 9 or 10 study question"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    window.setTimeout(() => {
                      composerDockRef.current?.scrollIntoView({
                        block: "end",
                        behavior: "smooth",
                      });
                    }, 120);
                  }
                }}
                placeholder="Ask a text-based Class 9-10 question..."
                dir={isUrduUI && !inputText ? "rtl" : "auto"}
                rows={2}
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
                className={`w-full resize-none bg-transparent px-1 pb-1.5 text-[16px] text-white placeholder-neutral-500 focus:outline-none disabled:opacity-60 ${
                  isUrduUI || isUrduText(inputText)
                    ? "font-urdu leading-[1.85]"
                    : "leading-[1.5]"
                }`}
              />

              {/* Bottom Action Row: Unified Attachment/Tools Menu + Mic on left, Send/Stop on right */}
              <div className="mt-1 flex items-center justify-between gap-2.5 border-t border-white/[0.06] pt-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Unified Attachment & Tools Menu (gated behind AI_IMAGE_INPUT_ENABLED) */}
                  {AI_IMAGE_INPUT_ENABLED && (
                    <div ref={toolsMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setToolsMenuOpen((prev) => !prev)}
                        aria-expanded={toolsMenuOpen}
                        aria-label="Attachments and tutor tools"
                        title="Attach photo or adjust preferences"
                        className={`inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-2xl border px-3 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                          toolsMenuOpen || attachedImage
                            ? "border-[#FFD60A]/55 bg-[#FFD60A]/12 text-[#FFD60A]"
                            : "border-white/12 bg-white/[0.04] text-neutral-200 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        <ImageIcon size={17} aria-hidden="true" />
                        <span className="hidden sm:inline">Tools</span>
                      </button>

                      {toolsMenuOpen && (
                        <div
                          role="menu"
                          aria-label="Attachment and tool options"
                          className="absolute bottom-13 left-0 z-30 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-[#14141B] p-2.5 shadow-2xl space-y-1.5"
                        >
                          <div className="px-2 py-1.5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                            <p className="text-[11px] font-semibold text-white">
                              {status.visionEnabled
                                ? "Image Understanding Active"
                                : "Vision Analysis Unavailable"}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-snug text-neutral-400">
                              {status.visionEnabled
                                ? "Attach a textbook photo (JPEG, PNG, WebP · max 4 MB)."
                                : "Image analysis is paused pending guardian Meta license approval. You can preview photos locally, while live solving stays text-only."}
                            </p>
                          </div>

                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setToolsMenuOpen(false);
                              fileInputRef.current?.click();
                            }}
                            className="flex w-full min-h-[42px] items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-neutral-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
                          >
                            <ImageIcon size={16} className="text-[#FFD60A] shrink-0" aria-hidden="true" />
                            <span>
                              {attachedImage ? "Replace Photo (Gallery)" : "Choose Photo (Gallery)"}
                            </span>
                          </button>

                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setToolsMenuOpen(false);
                              cameraInputRef.current?.click();
                            }}
                            className="flex w-full min-h-[42px] items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-neutral-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
                          >
                            <Camera size={16} className="text-[#FFD60A] shrink-0" aria-hidden="true" />
                            <span>Take Photo (Camera)</span>
                          </button>

                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setToolsMenuOpen(false);
                              setPreferencesOpen(true);
                            }}
                            className="flex w-full min-h-[42px] items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-neutral-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
                          >
                            <SlidersHorizontal size={16} className="text-[#FFD60A] shrink-0" aria-hidden="true" />
                            <span>Tutor Preferences ({preferences.classLevel} · {preferences.explanationLength})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Microphone Speech-to-Text */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    aria-label={
                      voiceState === "listening"
                        ? "Stop voice dictation"
                        : "Start voice dictation"
                    }
                    title={
                      speechSupported
                        ? voiceState === "listening"
                          ? "Finish voice dictation"
                          : "Speak your question"
                        : "Voice dictation unavailable in this browser"
                    }
                    className={`inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border transition-colors cursor-pointer shrink-0 ${
                      voiceState === "listening" || voiceState === "processing"
                        ? "border-red-500/60 bg-red-500/20 text-red-300"
                        : !speechSupported
                          ? "border-white/10 bg-white/[0.02] text-neutral-500 hover:text-neutral-300"
                          : "border-white/12 bg-white/[0.04] text-neutral-200 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {voiceState === "listening" || voiceState === "processing" ? (
                      <MicOff size={18} aria-hidden="true" />
                    ) : (
                      <Mic size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
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
                      title="Stop"
                      className="inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-semibold text-white hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Square size={14} className="fill-current" aria-hidden="true" />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={
                        !inputText.trim() &&
                        !(AI_IMAGE_INPUT_ENABLED && status.visionEnabled && attachedImage)
                      }
                      aria-label="Send question"
                      title="Send"
                      className={`inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-2xl bg-[#FFD60A] px-4 text-xs font-bold text-black whitespace-nowrap shrink-0 transition-[transform,opacity,box-shadow] duration-150 cursor-pointer ${
                        !inputText.trim() &&
                        !(AI_IMAGE_INPUT_ENABLED && status.visionEnabled && attachedImage)
                          ? "opacity-35 cursor-not-allowed"
                          : "opacity-100 shadow-[0_0_16px_rgba(255,214,10,0.3)] hover:bg-[#FFD60A]/90 active:scale-[0.98]"
                      }`}
                    >
                      <Send size={16} aria-hidden="true" />
                      <span>Send</span>
                    </button>
                  )}
                </div>
              </div>
            </form>

            <p className="mt-2 text-center text-[11px] leading-snug text-neutral-500">
              History stays on this device · Verify textbook answers · Avoid sharing personal IDs
            </p>
          </div>
        </div>
      </section>

      {/* Saved Conversations Drawer & Tutor Personalization Dialog */}
      <AIChatHistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        conversations={conversations}
        activeId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateNewChat={handleStartNewChat}
        onRenameConversation={handleRenameConversation}
        onTogglePinConversation={handleTogglePinConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <AIPreferencesPopover
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
      />

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
