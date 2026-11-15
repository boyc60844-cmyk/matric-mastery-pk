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

import {
  memo,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  PanelLeftOpen,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import AIMarkdownRenderer from "@/components/AIMarkdownRenderer";
import AIChatHistoryDrawer from "@/components/ai/AIChatHistoryDrawer";
import AIConversationSidebar from "@/components/ai/AIConversationSidebar";
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

interface AIMessageRowProps {
  msg: AIChatMessage;
  isLastMessage: boolean;
  isGenerating: boolean;
  isUrduUI: boolean;
  isSpeakingThis: boolean;
  onRetry: (id: string) => void;
  onToggleReadAloud: (id: string, text: string) => void;
  onShareWhatsApp: (text: string) => void;
}

const AIMessageRow = memo(function AIMessageRow({
  msg,
  isLastMessage,
  isGenerating,
  isUrduUI,
  isSpeakingThis,
  onRetry,
  onToggleReadAloud,
  onShareWhatsApp,
}: AIMessageRowProps) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(() => {
    const markCopied = () => {
      setCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 1800);
    };

    const fallbackCopy = () => {
      if (typeof document === "undefined") return;
      try {
        const el = document.createElement("textarea");
        el.value = msg.content;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        if (ok) markCopied();
      } catch {
        // Ignore clipboard denial on restricted WebViews
      }
    };

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(msg.content)
        .then(markCopied)
        .catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }, [msg.content]);

  const formattedTime = useMemo(
    () =>
      new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [msg.timestamp]
  );

  const isUser = msg.role === "user";
  const urduContent = useMemo(() => isUrduText(msg.content), [msg.content]);
  const isStreamingMsg = !isUser && isGenerating && isLastMessage;
  const showThinkState = isStreamingMsg && !msg.content;

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1.5 ai-msg-enter">
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
          <p className="whitespace-pre-wrap break-words select-text">{msg.content}</p>
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
      aria-busy={isStreamingMsg ? "true" : undefined}
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
        <div className="flex min-h-[32px] items-center gap-2.5 py-2 text-[16px] text-neutral-300">
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
          className={`rounded-2xl border p-4 sm:p-5 space-y-3 ai-thread-fade ${
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
                className={`text-[16px] font-medium select-text ${
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
              onClick={() => onRetry(msg.id)}
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
          <div className="w-full min-w-0 select-text">
            <AIMarkdownRenderer
              content={msg.content}
              isStreaming={isStreamingMsg}
            />
          </div>

          {isStreamingMsg ? (
            <div className="flex min-h-[40px] items-center gap-2 pt-1 text-xs text-neutral-400">
              <Loader2
                size={13}
                className="animate-spin text-[#FFD60A]"
                aria-hidden="true"
              />
              <span>
                {isUrduUI ? "جواب لکھا جا رہا ہے..." : "Streaming response..."}
              </span>
            </div>
          ) : (
            msg.content && (
              <div className="flex min-h-[40px] flex-wrap items-center gap-2 pt-1 ai-thread-fade">
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={copied ? "Copied" : "Copy"}
                  title={copied ? "Copied" : "Copy"}
                  className="inline-flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white active:scale-[0.97] transition-[transform,color,border-color] duration-150 cursor-pointer"
                >
                  {copied ? (
                    <Check
                      size={16}
                      className="text-emerald-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <Copy size={16} aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {copied ? "Copied" : "Copy"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleReadAloud(msg.id, msg.content)}
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
                  onClick={() => onShareWhatsApp(msg.content)}
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
                    onClick={() => onRetry(msg.id)}
                    aria-label="Regenerate"
                    title="Regenerate"
                    className="inline-flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white disabled:opacity-40 active:scale-[0.97] transition-[transform,color,border-color] duration-150 cursor-pointer"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    <span className="sr-only">Regenerate</span>
                  </button>
                )}
              </div>
            )
          )}
        </>
      )}
    </article>
  );
});

interface AIComposerHandle {
  setDraft: (text: string, shouldFocus?: boolean) => void;
  focus: () => void;
  clearNotices: () => void;
}

interface AIComposerDockProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  languageMode: "en" | "ur";
  onLanguageChange: (lang: "en" | "ur") => void;
  prefSummaryLabel: string;
  onOpenPreferences: () => void;
  isGenerating: boolean;
  onStopGeneration: () => void;
  onSubmitDraft: (draftText: string) => boolean;
  speechSupported: boolean;
  status: AIStatus;
  attachedImage: {
    previewUrl: string;
    mimeType: string;
    base64: string;
    fileName: string;
    fileSize: number;
  } | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachedImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  composerNotice: string | null;
  onDismissNotice: () => void;
  preferencesSummaryMeta: { classLevel: string; explanationLength: string };
}

const AIComposerDock = memo(
  forwardRef<AIComposerHandle, AIComposerDockProps>(function AIComposerDock(
    {
      selectedSubject,
      onSubjectChange,
      languageMode,
      onLanguageChange,
      prefSummaryLabel,
      onOpenPreferences,
      isGenerating,
      onStopGeneration,
      onSubmitDraft,
      speechSupported,
      status,
      attachedImage,
      onImageSelect,
      onRemoveAttachedImage,
      fileInputRef,
      cameraInputRef,
      composerNotice,
      onDismissNotice,
      preferencesSummaryMeta,
    },
    ref
  ) {
    const [inputText, setInputText] = useState("");
    const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
    const [voiceState, setVoiceState] = useState<VoiceState>("idle");
    const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const toolsMenuRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const voiceBaseTextRef = useRef<string>("");
    const voiceCancelledRef = useRef<boolean>(false);
    const voiceErrorRef = useRef<boolean>(false);

    const isUrduUI = languageMode === "ur";

    useImperativeHandle(
      ref,
      () => ({
        setDraft: (text: string, shouldFocus = false) => {
          setInputText(text);
          if (shouldFocus) {
            window.setTimeout(() => {
              const el = textareaRef.current;
              if (el) {
                el.focus();
                const len = el.value.length;
                el.setSelectionRange(len, len);
              }
            }, 240);
          }
        },
        focus: () => {
          textareaRef.current?.focus();
        },
        clearNotices: () => {
          setToolsMenuOpen(false);
          setVoiceFeedback(null);
        },
      }),
      []
    );

    // Clean up speech recognition on unmount
    useEffect(() => {
      return () => {
        try {
          recognitionRef.current?.abort?.();
        } catch {
          // ignore cleanup error
        }
      };
    }, []);

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

    // Smoothly auto-resize textarea without triggering outer-page jumps
    useLayoutEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      if (!inputText) {
        el.style.height = "";
        el.style.overflowY = "hidden";
        return;
      }
      el.style.height = "auto";
      const maxHeight = 180;
      const nextHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${nextHeight}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [inputText]);

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

    const toggleVoiceInput = useCallback(() => {
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
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
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
            setVoiceFeedback(
              "Voice recognition stopped unexpectedly. You can type or retry."
            );
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
    }, [speechSupported, languageMode, voiceState, inputText]);

    const submitCurrentDraft = () => {
      if (isGenerating) return;
      const accepted = onSubmitDraft(inputText);
      if (accepted) {
        setInputText("");
        setToolsMenuOpen(false);
        setVoiceFeedback(null);
      }
    };

    const canSubmit =
      !isGenerating &&
      (Boolean(inputText.trim()) ||
        Boolean(AI_IMAGE_INPUT_ENABLED && status.visionEnabled && attachedImage));

    return (
      <div className="relative shrink-0 w-full bg-[#0A0A0A] px-3 sm:px-6 lg:px-8 pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Soft fade above composer so scrolling messages glide underneath */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-9 h-9 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"
        />
        <div className="mx-auto w-full max-w-[940px]">

        {composerNotice && (
          <div
            role="status"
            className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 ai-thread-fade"
          >
            <span className="leading-snug">{composerNotice}</span>
            <button
              type="button"
              onClick={onDismissNotice}
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
            className={`mb-2 flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs ai-thread-fade ${
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
                  onClick={onRemoveAttachedImage}
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
              onChange={(e) => onSubjectChange(e.target.value)}
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
                onClick={() => onLanguageChange("en")}
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
                onClick={() => onLanguageChange("ur")}
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
            onClick={onOpenPreferences}
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
              onChange={onImageSelect}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              aria-label="Upload image from gallery"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={onImageSelect}
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
            submitCurrentDraft();
          }}
          className="relative rounded-[24px] border border-white/15 bg-[#14141A] px-3.5 pt-3 pb-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.7)] focus-within:border-[#FFD60A]/75 focus-within:shadow-[0_12px_36px_rgba(0,0,0,0.75),0_0_24px_rgba(255,214,10,0.22)] transition-[border-color,box-shadow] duration-200"
        >
          <textarea
            ref={textareaRef}
            id="ai-prompt-input"
            aria-label="Ask a Class 9 or 10 study question"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a text-based Class 9-10 question..."
            dir={isUrduUI && !inputText ? "rtl" : "auto"}
            rows={2}
            enterKeyHint="send"
            maxLength={2000}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !(e.nativeEvent as KeyboardEvent).isComposing
              ) {
                e.preventDefault();
                submitCurrentDraft();
              }
            }}
            className={`w-full resize-none bg-transparent px-1 pb-1.5 text-[16px] text-white placeholder-neutral-500 focus:outline-none ${
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
                          onOpenPreferences();
                        }}
                        className="flex w-full min-h-[42px] items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-neutral-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal size={16} className="text-[#FFD60A] shrink-0" aria-hidden="true" />
                        <span>
                          Tutor Preferences ({preferencesSummaryMeta.classLevel} ·{" "}
                          {preferencesSummaryMeta.explanationLength})
                        </span>
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
                  onClick={onStopGeneration}
                  aria-label="Stop generating response"
                  title="Stop"
                  className="inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-semibold text-white hover:bg-white/15 active:scale-[0.98] transition-[transform,background-color] duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Square size={14} className="fill-current" aria-hidden="true" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  aria-label="Send question"
                  title="Send"
                  className={`inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-2xl bg-[#FFD60A] px-4 text-xs font-bold text-black whitespace-nowrap shrink-0 transition-[transform,opacity,box-shadow] duration-150 cursor-pointer ${
                    !canSubmit
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
    );
  })
);

interface AIEducationalSectionsProps {
  onFocusTemplate: (template: {
    prompt?: string;
    subject?: string;
    language?: "en" | "ur";
    notice?: string;
  }) => void;
  statusLoading: boolean;
  statusState: AIStatus["state"];
  statusDisplay: {
    label: string;
    shortLabel: string;
    tone: string;
    detail: string;
  };
  onRefreshHealthStatus: () => void;
}

const AIEducationalSections = memo(function AIEducationalSections({
  onFocusTemplate,
  statusLoading,
  statusState,
  statusDisplay,
  onRefreshHealthStatus,
}: AIEducationalSectionsProps) {
  return (
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
                    onFocusTemplate({
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
                    onFocusTemplate({
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
            onClick={onRefreshHealthStatus}
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
            ) : statusState === "ready" ? (
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" aria-hidden="true" />
            ) : statusState === "quota_exhausted" ? (
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
  );
});

export default function AIPage() {
  // Conversation collection & active conversation state
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [messages, setMessages] = useState<AIChatMessage[]>([]);

  // Composer settings & preferences
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
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("mm_ai_sidebar_open_v1");
      if (saved === "false") return false;
      if (saved === "true") return true;
    } catch {
      // ignore storage failure
    }
    return true;
  });
  const [confirmHeaderNewChat, setConfirmHeaderNewChat] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Voice & TTS states
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Scroll & mobile viewport tracking
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const [mobileKeyboardHeight, setMobileKeyboardHeight] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<AIComposerHandle>(null);
  const chatWorkspaceRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const transcriptContentRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ref mirrors & scheduling refs to keep handlers stable and avoid race conditions
  const activeConversationIdRef = useRef<string>("");
  const conversationsRef = useRef<AIConversation[]>([]);
  const messagesRef = useRef<AIChatMessage[]>([]);
  const isGeneratingRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const generationEpochRef = useRef(0);
  const streamPendingTextRef = useRef<string | null>(null);
  const streamRafRef = useRef<number | null>(null);

  const shouldAutoScrollRef = useRef(true);
  const isProgrammaticScrollRef = useRef(false);
  const scrollEventRafRef = useRef<number | null>(null);
  const prevShowScrollRef = useRef(false);
  const scrollPositionsRef = useRef<Map<string, { top: number; atBottom: boolean }>>(
    new Map()
  );

  activeConversationIdRef.current = activeConversationId;
  conversationsRef.current = conversations;
  messagesRef.current = messages;
  isGeneratingRef.current = isGenerating;

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
      if (streamRafRef.current !== null) {
        window.cancelAnimationFrame(streamRafRef.current);
      }
      if (scrollEventRafRef.current !== null) {
        window.cancelAnimationFrame(scrollEventRafRef.current);
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [refreshHealthStatus]);

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
      setPreferences((prev) => {
        const next = { ...prev, language: lang };
        saveAIPreferences(next);
        return next;
      });
    },
    []
  );

  // Adapt workspace container smoothly when mobile soft keyboard opens — without scrolling the outer page
  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewportChange = () => {
      if (window.innerWidth >= 768) {
        setMobileKeyboardHeight(null);
        return;
      }
      const keyboardLikelyOpen = window.innerHeight - vv.height > 120;
      const focusedInsideWorkspace = Boolean(
        chatWorkspaceRef.current &&
          document.activeElement &&
          chatWorkspaceRef.current.contains(document.activeElement)
      );

      if (keyboardLikelyOpen && focusedInsideWorkspace) {
        const nextH = Math.max(340, Math.round(vv.height - 56));
        setMobileKeyboardHeight(nextH);
      } else {
        setMobileKeyboardHeight(null);
      }
    };

    vv.addEventListener("resize", handleViewportChange);
    return () => {
      vv.removeEventListener("resize", handleViewportChange);
    };
  }, []);

  // Scroll strictly inside the dedicated transcript container — NEVER scroll the outer page
  const scrollTranscriptToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = transcriptRef.current;
    if (!el) return;
    isProgrammaticScrollRef.current = true;
    if (behavior === "smooth") {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 280);
    } else {
      el.scrollTop = el.scrollHeight;
      window.requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    }
  }, []);

  // Save current scroll offset cleanly before leaving a conversation
  const saveScrollSnapshotFor = useCallback((convId: string) => {
    const el = transcriptRef.current;
    if (!el || !convId) return;
    scrollPositionsRef.current.set(convId, {
      top: el.scrollTop,
      atBottom: shouldAutoScrollRef.current,
    });
  }, []);

  // Restore scroll position synchronously on conversation switch to prevent old scroll carryover or flicker
  useLayoutEffect(() => {
    const el = transcriptRef.current;
    if (!el || !activeConversationId) return;

    const saved = scrollPositionsRef.current.get(activeConversationId);
    const hasMsgs = messagesRef.current.length > 0;

    if (!hasMsgs) {
      shouldAutoScrollRef.current = true;
      prevShowScrollRef.current = false;
      setShowScrollToLatest(false);
      el.scrollTop = 0;
      return;
    }

    if (saved && !saved.atBottom) {
      isProgrammaticScrollRef.current = true;
      shouldAutoScrollRef.current = false;
      el.scrollTop = Math.min(saved.top, Math.max(0, el.scrollHeight - el.clientHeight));
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      const showBtn = distance > 64;
      prevShowScrollRef.current = showBtn;
      setShowScrollToLatest(showBtn);
      window.requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    } else {
      shouldAutoScrollRef.current = true;
      prevShowScrollRef.current = false;
      setShowScrollToLatest(false);
      isProgrammaticScrollRef.current = true;
      el.scrollTop = el.scrollHeight;
      window.requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    }
  }, [activeConversationId]);

  // Preserve reading position during user scroll without thrashing React state
  const handleTranscriptScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    if (scrollEventRafRef.current !== null) return;

    scrollEventRafRef.current = window.requestAnimationFrame(() => {
      scrollEventRafRef.current = null;
      const el = transcriptRef.current;
      if (!el) return;
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const nearBottom = distanceFromBottom <= 64;
      shouldAutoScrollRef.current = nearBottom;
      const nextShow = !nearBottom && messagesRef.current.length > 0;
      if (prevShowScrollRef.current !== nextShow) {
        prevShowScrollRef.current = nextShow;
        setShowScrollToLatest(nextShow);
      }
    });
  }, []);

  // Automatically follow growing content & container resizes ONLY when user is near the bottom
  useEffect(() => {
    const contentEl = transcriptContentRef.current;
    const containerEl = transcriptRef.current;
    if (!containerEl || typeof ResizeObserver === "undefined") return;

    const handleResize = () => {
      if (shouldAutoScrollRef.current && messagesRef.current.length > 0) {
        scrollTranscriptToBottom("auto");
      }
    };

    const observer = new ResizeObserver(handleResize);
    if (contentEl) observer.observe(contentEl);
    observer.observe(containerEl);

    return () => observer.disconnect();
  }, [activeConversationId, scrollTranscriptToBottom]);

  // Ensure new user submissions smoothly snap to bottom
  useEffect(() => {
    if (messages.length === 0) {
      if (prevShowScrollRef.current) {
        prevShowScrollRef.current = false;
        setShowScrollToLatest(false);
      }
      shouldAutoScrollRef.current = true;
      return;
    }

    if (!shouldAutoScrollRef.current) return;
    const rafId = window.requestAnimationFrame(() => {
      scrollTranscriptToBottom("auto");
      if (prevShowScrollRef.current) {
        prevShowScrollRef.current = false;
        setShowScrollToLatest(false);
      }
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [messages.length, scrollTranscriptToBottom]);

  // Attachment validation & preview
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const removeAttachedImage = useCallback(() => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }, []);

  // Optional Read-Aloud Text-to-Speech (never auto-plays)
  const stopReadAloud = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  }, []);

  const handleToggleReadAloud = useCallback(
    (msgId: string, rawText: string) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        !ttsSupported
      ) {
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
    },
    [ttsSupported, speakingMessageId, stopReadAloud]
  );

  // Persist messages cleanly into target conversation record
  const syncConversationMessages = useCallback(
    (targetConvId: string, updatedMessages: AIChatMessage[], subjectForConv?: string) => {
      setConversations((prevConvs) => {
        const idx = prevConvs.findIndex((c) => c.id === targetConvId);
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
          activeId: activeConversationIdRef.current || targetConvId,
          conversations: nextConvs,
        });
        return nextConvs;
      });
    },
    []
  );

  const cancelPendingStreamFrame = useCallback(() => {
    if (streamRafRef.current !== null) {
      window.cancelAnimationFrame(streamRafRef.current);
      streamRafRef.current = null;
    }
    streamPendingTextRef.current = null;
  }, []);

  const executeGeneration = useCallback(
    async ({
      conversationId,
      historyForRequest,
      placeholderId,
      subjectOverride,
      imagePayload,
      lang,
      prefsSnapshot,
    }: {
      conversationId: string;
      historyForRequest: AIChatMessage[];
      placeholderId: string;
      subjectOverride: string;
      imagePayload: { mimeType: string; base64: string } | null;
      lang: "en" | "ur";
      prefsSnapshot: AIPreferences;
    }) => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const myEpoch = ++generationEpochRef.current;
      streamPendingTextRef.current = null;

      try {
        const fullAnswer = await sendAIMessage({
          messages: historyForRequest,
          image: imagePayload,
          language: lang,
          subject: subjectOverride,
          preferences: prefsSnapshot,
          signal: abortController.signal,
          onChunk: (partialText) => {
            if (generationEpochRef.current !== myEpoch) return;
            streamPendingTextRef.current = partialText;
            if (streamRafRef.current !== null) return;

            streamRafRef.current = window.requestAnimationFrame(() => {
              streamRafRef.current = null;
              if (generationEpochRef.current !== myEpoch) return;
              const latest = streamPendingTextRef.current;
              if (latest === null) return;

              setMessages((prev) => {
                const idx = prev.findIndex((m) => m.id === placeholderId);
                if (idx === -1 || prev[idx].content === latest) return prev;
                const next = [...prev];
                next[idx] = {
                  ...next[idx],
                  content: latest,
                  error: false,
                  errorKind: undefined,
                };
                return next;
              });
            });
          },
        });

        cancelPendingStreamFrame();
        if (generationEpochRef.current !== myEpoch) return;

        const resolvedContent =
          fullAnswer.trim() ||
          (lang === "ur"
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
          syncConversationMessages(conversationId, updated, subjectOverride);
          return updated;
        });

        addXP(15, "Solved question with Matric Mastery AI");
      } catch (err: any) {
        const latestPartial = streamPendingTextRef.current;
        cancelPendingStreamFrame();

        // If user switched to another chat or started New Chat, never mutate the new conversation
        if (generationEpochRef.current !== myEpoch) {
          return;
        }

        if (err?.name === "AbortError") {
          setMessages((prev) => {
            const existingPlaceholder = prev.find((m) => m.id === placeholderId);
            const partialContent = (
              latestPartial ||
              existingPlaceholder?.content ||
              ""
            ).trim();

            const nextMessages = partialContent
              ? prev.map((m) =>
                  m.id === placeholderId
                    ? {
                        ...m,
                        content: partialContent,
                        timestamp: Date.now(),
                        error: false,
                        errorKind: undefined,
                      }
                    : m
                )
              : prev.filter((m) => m.id !== placeholderId);

            syncConversationMessages(conversationId, nextMessages, subjectOverride);
            return nextMessages;
          });
          return;
        }

        const friendly = getStudentFriendlyError(err, lang);
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
          syncConversationMessages(conversationId, updated, subjectOverride);
          return updated;
        });
      } finally {
        if (generationEpochRef.current === myEpoch) {
          isSubmittingRef.current = false;
          setIsGenerating(false);
          abortControllerRef.current = null;
        }
      }
    },
    [cancelPendingStreamFrame, syncConversationMessages]
  );

  const submitQuestion = useCallback(
    (promptText: string, subjectOverride?: string): boolean => {
      if (isSubmittingRef.current || isGeneratingRef.current) return false;

      const textToSend = promptText.trim();
      const activeAttachment =
        AI_IMAGE_INPUT_ENABLED && status.visionEnabled ? attachedImage : null;

      if (!AI_IMAGE_INPUT_ENABLED && attachedImage) {
        setAttachedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
      }

      if (
        AI_IMAGE_INPUT_ENABLED &&
        !textToSend &&
        attachedImage &&
        !status.visionEnabled
      ) {
        setComposerNotice(
          "Image analysis is currently paused pending guardian Meta license approval. Please type your question in text or remove the photo preview."
        );
        return false;
      }

      if (!textToSend && !activeAttachment) return false;

      if (textToSend.length > 2000) {
        setComposerNotice("Keep your question under 2,000 characters.");
        return false;
      }

      stopReadAloud();
      isSubmittingRef.current = true;
      shouldAutoScrollRef.current = true;
      if (prevShowScrollRef.current) {
        prevShowScrollRef.current = false;
        setShowScrollToLatest(false);
      }
      setComposerNotice(null);

      const activeSubject = subjectOverride || selectedSubject;
      if (subjectOverride) {
        setSelectedSubject(subjectOverride);
      }

      const convId = activeConversationIdRef.current;
      const currentMsgs = messagesRef.current;

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

      const nextHistory = [...currentMsgs, userMessage];
      const nextWithPlaceholder = [...nextHistory, assistantPlaceholder];
      setMessages(nextWithPlaceholder);
      syncConversationMessages(convId, nextHistory, activeSubject);

      if (AI_IMAGE_INPUT_ENABLED && status.visionEnabled) {
        setAttachedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
      }
      setIsGenerating(true);

      void executeGeneration({
        conversationId: convId,
        historyForRequest: nextHistory,
        placeholderId,
        subjectOverride: activeSubject,
        imagePayload: activeAttachment
          ? { mimeType: activeAttachment.mimeType, base64: activeAttachment.base64 }
          : null,
        lang: languageMode,
        prefsSnapshot: preferences,
      });

      return true;
    },
    [
      attachedImage,
      executeGeneration,
      languageMode,
      preferences,
      selectedSubject,
      status.visionEnabled,
      stopReadAloud,
      syncConversationMessages,
    ]
  );

  const handleSubmitFromComposer = useCallback(
    (draftText: string) => submitQuestion(draftText),
    [submitQuestion]
  );

  const handleRetryTurn = useCallback(
    async (assistantMessageId: string) => {
      if (isSubmittingRef.current || isGeneratingRef.current) return;

      const currentMsgs = messagesRef.current;
      const targetIndex = currentMsgs.findIndex((m) => m.id === assistantMessageId);
      if (targetIndex <= 0) return;

      const precedingMessages = currentMsgs
        .slice(0, targetIndex)
        .filter((m) => !m.error);
      if (precedingMessages.length === 0) return;

      const lastUser = precedingMessages[precedingMessages.length - 1];
      if (lastUser.role !== "user") return;

      stopReadAloud();
      isSubmittingRef.current = true;
      shouldAutoScrollRef.current = targetIndex === currentMsgs.length - 1;
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
        conversationId: activeConversationIdRef.current,
        historyForRequest: precedingMessages,
        placeholderId: assistantMessageId,
        subjectOverride: lastUser.subject || selectedSubject,
        imagePayload:
          AI_IMAGE_INPUT_ENABLED && status.visionEnabled && lastUser.image
            ? { mimeType: lastUser.image.mimeType, base64: lastUser.image.base64 }
            : null,
        lang: languageMode,
        prefsSnapshot: preferences,
      });
    },
    [
      executeGeneration,
      languageMode,
      preferences,
      selectedSubject,
      status.visionEnabled,
      stopReadAloud,
    ]
  );

  const handleStopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  // Multi-conversation handlers (with instant state reset and epoch invalidation)
  const handleStartNewChat = useCallback(() => {
    const prevId = activeConversationIdRef.current;
    saveScrollSnapshotFor(prevId);

    if (isGeneratingRef.current) {
      generationEpochRef.current += 1;
      cancelPendingStreamFrame();
      abortControllerRef.current?.abort();
      isSubmittingRef.current = false;
      setIsGenerating(false);
    }
    stopReadAloud();

    if (messagesRef.current.length === 0) {
      composerRef.current?.focus();
      return;
    }

    const fresh = createConversationRecord(selectedSubject);
    const nonEmptyOthers = conversationsRef.current.filter(
      (c) => c.messages.length > 0
    );
    const nextList = [fresh, ...nonEmptyOthers];
    commitConversations(nextList, fresh.id);
    setMessages([]);
    setComposerNotice(null);
    composerRef.current?.clearNotices();
    composerRef.current?.focus();
  }, [
    cancelPendingStreamFrame,
    commitConversations,
    saveScrollSnapshotFor,
    selectedSubject,
    stopReadAloud,
  ]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      if (id === activeConversationIdRef.current) return;
      saveScrollSnapshotFor(activeConversationIdRef.current);

      if (isGeneratingRef.current) {
        generationEpochRef.current += 1;
        cancelPendingStreamFrame();
        abortControllerRef.current?.abort();
        isSubmittingRef.current = false;
        setIsGenerating(false);
      }
      stopReadAloud();

      const target = conversationsRef.current.find((c) => c.id === id);
      if (!target) return;

      const cleaned = conversationsRef.current.filter(
        (c) => c.id === id || c.messages.length > 0
      );
      commitConversations(cleaned, id);
      setMessages(target.messages);
      if (target.subject) setSelectedSubject(target.subject);
      setComposerNotice(null);
      composerRef.current?.clearNotices();
    },
    [
      cancelPendingStreamFrame,
      commitConversations,
      saveScrollSnapshotFor,
      stopReadAloud,
    ]
  );

  const handleRenameConversation = useCallback(
    (id: string, nextTitle: string) => {
      const next = conversationsRef.current.map((c) =>
        c.id === id ? { ...c, title: nextTitle } : c
      );
      commitConversations(next, activeConversationIdRef.current);
    },
    [commitConversations]
  );

  const handleTogglePinConversation = useCallback(
    (id: string) => {
      const next = conversationsRef.current.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      );
      commitConversations(next, activeConversationIdRef.current);
    },
    [commitConversations]
  );

  const handleDeleteConversation = useCallback(
    (id: string) => {
      const remaining = conversationsRef.current.filter((c) => c.id !== id);
      scrollPositionsRef.current.delete(id);

      if (id === activeConversationIdRef.current) {
        if (isGeneratingRef.current) {
          generationEpochRef.current += 1;
          cancelPendingStreamFrame();
          abortControllerRef.current?.abort();
          isSubmittingRef.current = false;
          setIsGenerating(false);
        }
        stopReadAloud();
        if (remaining.length === 0) {
          const fresh = createConversationRecord();
          commitConversations([fresh], fresh.id);
          setMessages([]);
        } else {
          const nextActive = remaining[0];
          commitConversations(remaining, nextActive.id);
          setMessages(nextActive.messages);
          if (nextActive.subject) setSelectedSubject(nextActive.subject);
        }
      } else {
        commitConversations(remaining, activeConversationIdRef.current);
      }
    },
    [cancelPendingStreamFrame, commitConversations, stopReadAloud]
  );

  const handleShareWhatsApp = useCallback((text: string) => {
    const encoded = encodeURIComponent(
      `*Matric Mastery AI Solution:*\n\n${text.slice(0, 800)}${
        text.length > 800 ? "..." : ""
      }\n\nStudy free at Matric Mastery PK`
    );
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  }, []);

  const handleExportJSON = useCallback(() => {
    const currentMsgs = messagesRef.current;
    if (currentMsgs.length === 0) return;
    const activeConv = conversationsRef.current.find(
      (c) => c.id === activeConversationIdRef.current
    );
    const jsonStr = exportChatHistoryAsJSON(
      currentMsgs,
      activeConv?.title || "Matric Mastery AI Study Session"
    );
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matric-mastery-ai-session-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const focusWorkspaceWithTemplate = useCallback(
    (template: {
      prompt?: string;
      subject?: string;
      language?: "en" | "ur";
      notice?: string;
    }) => {
      if (template.subject) setSelectedSubject(template.subject);
      if (template.language) setLanguageMode(template.language);
      if (template.notice) setComposerNotice(template.notice);

      chatWorkspaceRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (template.prompt !== undefined) {
        composerRef.current?.setDraft(template.prompt, true);
      } else {
        window.setTimeout(() => composerRef.current?.focus(), 240);
      }
    },
    [setLanguageMode]
  );

  const isUrduUI = languageMode === "ur";
  const savedNonEmptyCount = useMemo(
    () => conversations.filter((c) => c.messages.length > 0).length,
    [conversations]
  );

  const statusDisplay = useMemo(
    () =>
      statusLoading
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
              },
    [statusLoading, status.state]
  );

  const prefSummaryLabel = useMemo(
    () =>
      `Class ${preferences.classLevel} · ${
        preferences.explanationLength.charAt(0).toUpperCase() +
        preferences.explanationLength.slice(1)
      } · ${
        preferences.presentationStyle === "step-by-step"
          ? "Step-by-step"
          : preferences.presentationStyle === "exam-style"
            ? "Exam-style"
            : "Conceptual"
      }`,
    [
      preferences.classLevel,
      preferences.explanationLength,
      preferences.presentationStyle,
    ]
  );

  const preferencesSummaryMeta = useMemo(
    () => ({
      classLevel: preferences.classLevel,
      explanationLength: preferences.explanationLength,
    }),
    [preferences.classLevel, preferences.explanationLength]
  );

  const handleOpenHistory = useCallback(() => setHistoryDrawerOpen(true), []);
  const handleCloseHistory = useCallback(() => setHistoryDrawerOpen(false), []);
  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("mm_ai_sidebar_open_v1", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);
  const handleCollapseSidebar = useCallback(() => {
    setSidebarOpen(false);
    try {
      localStorage.setItem("mm_ai_sidebar_open_v1", "false");
    } catch {
      // ignore
    }
  }, []);
  const handleHeaderNewChatClick = useCallback(() => {
    if (isGeneratingRef.current) {
      setConfirmHeaderNewChat(true);
      return;
    }
    setConfirmHeaderNewChat(false);
    handleStartNewChat();
  }, [handleStartNewChat]);

  useEffect(() => {
    if (!isGenerating && confirmHeaderNewChat) {
      setConfirmHeaderNewChat(false);
    }
  }, [isGenerating, confirmHeaderNewChat]);

  const handleOpenPreferences = useCallback(() => setPreferencesOpen(true), []);
  const handleClosePreferences = useCallback(() => setPreferencesOpen(false), []);
  const handleDismissNotice = useCallback(() => setComposerNotice(null), []);

  return (
    <div className="w-full bg-[#0A0A0A] text-white">
      {/* =====================================================================
          1. FULL-HEIGHT AI WORKSPACE ARCHITECTURE (Desktop Sidebar + 940px Canvas)
         ===================================================================== */}
      <section
        aria-label="Matric Mastery AI Tutoring Workspace"
        className="w-full border-t border-white/[0.06] bg-[#0A0A0A]"
      >
        <div
          ref={chatWorkspaceRef}
          id="ai-chat-workspace"
          style={
            mobileKeyboardHeight
              ? { height: `${mobileKeyboardHeight}px`, minHeight: `${mobileKeyboardHeight}px` }
              : undefined
          }
          className="scroll-mt-20 flex h-[calc(100dvh-110px)] sm:h-[calc(100dvh-67px)] min-h-[340px] w-full overflow-hidden bg-[#0A0A0A]"
        >
          {/* Desktop Collapsible Sidebar (268px–280px on lg+, hidden on mobile) */}
          <AIConversationSidebar
            isOpen={sidebarOpen}
            onCollapse={handleCollapseSidebar}
            conversations={conversations}
            activeId={activeConversationId}
            isGenerating={isGenerating}
            onSelectConversation={handleSelectConversation}
            onCreateNewChat={handleStartNewChat}
            onRenameConversation={handleRenameConversation}
            onTogglePinConversation={handleTogglePinConversation}
            onDeleteConversation={handleDeleteConversation}
          />

          {/* Main Spacious Conversation & Composer Column */}
          <div className="flex flex-1 min-w-0 flex-col overflow-hidden bg-[#0A0A0A]">
            {/* A. Compact Workspace Header */}
            <header className="shrink-0 w-full border-b border-white/[0.06] bg-[#0A0A0A] px-3 sm:px-5 py-2.5">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  {/* Mobile / Tablet Drawer Trigger (< lg) */}
                  <button
                    type="button"
                    onClick={handleOpenHistory}
                    aria-label="Open saved chat history"
                    title="Saved study chats"
                    className="lg:hidden inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-neutral-200 hover:border-white/25 hover:text-white active:scale-[0.98] transition-[transform,color,border-color] duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <History size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Chats</span>
                    {savedNonEmptyCount > 0 && (
                      <span className="font-mono text-[11px] tabular-nums text-[#FFD60A]">
                        {savedNonEmptyCount}
                      </span>
                    )}
                  </button>

                  {/* Desktop Sidebar Expand Button (shown when sidebar is collapsed) */}
                  {!sidebarOpen && (
                    <button
                      type="button"
                      onClick={handleToggleSidebar}
                      aria-label="Expand sidebar"
                      title="Show saved chats sidebar"
                      className="hidden lg:inline-flex h-10 min-h-[40px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-neutral-200 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <PanelLeftOpen size={16} aria-hidden="true" />
                      <span>Chats</span>
                      {savedNonEmptyCount > 0 && (
                        <span className="font-mono text-[11px] tabular-nums text-[#FFD60A]">
                          {savedNonEmptyCount}
                        </span>
                      )}
                    </button>
                  )}

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD60A] text-black">
                    <GraduationCap size={18} strokeWidth={2.2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="font-heading text-[15px] sm:text-base font-bold tracking-tight text-white leading-tight truncate">
                      Matric Mastery AI
                    </h1>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-snug text-neutral-400">
                      {statusLoading ? (
                        <span className="whitespace-normal break-words">{statusDisplay.label}</span>
                      ) : status.state === "ready" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 size={12} className="shrink-0" aria-hidden="true" />
                          <span className="whitespace-normal break-words">{statusDisplay.label}</span>
                        </span>
                      ) : status.state === "quota_exhausted" ? (
                        <span className="inline-flex items-center gap-1 text-amber-300">
                          <AlertCircle size={12} className="shrink-0" aria-hidden="true" />
                          <span className="whitespace-normal break-words">{statusDisplay.label}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={refreshHealthStatus}
                          className="inline-flex items-center gap-1 text-left text-red-300 hover:text-red-200 underline-offset-2 hover:underline cursor-pointer"
                        >
                          <WifiOff size={12} className="shrink-0" aria-hidden="true" />
                          <span className="whitespace-normal break-words">{statusDisplay.label}</span>
                        </button>
                      )}
                      <span className="hidden md:inline text-neutral-600" aria-hidden="true">
                        ·
                      </span>
                      <span className="hidden md:inline text-neutral-400 truncate">
                        {prefSummaryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Workspace Header Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <a
                    href="#ai-subjects"
                    title="Jump to Subjects, Usage Guide & Free Access Info"
                    className="hidden md:inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-2.5 text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <BookOpen size={14} aria-hidden="true" />
                    <span>Guide</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleOpenPreferences}
                    aria-label="Open tutor preferences"
                    title="Tutor personalization settings"
                    className="inline-flex h-11 min-h-[44px] min-w-[44px] sm:h-10 sm:min-h-[40px] sm:min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-neutral-200 hover:border-white/25 hover:text-white active:scale-[0.98] transition-[transform,color,border-color] duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <SlidersHorizontal size={15} aria-hidden="true" />
                    <span className="hidden xl:inline">Preferences</span>
                  </button>

                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      aria-label="Download study session JSON"
                      title="Download this study session as JSON"
                      className="inline-flex h-11 min-h-[44px] min-w-[44px] sm:h-10 sm:min-h-[40px] sm:min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-neutral-300 hover:border-white/25 hover:text-white active:scale-[0.98] transition-[transform,color,border-color] duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download size={15} aria-hidden="true" />
                      <span className="hidden xl:inline">Download</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleHeaderNewChatClick}
                    disabled={messages.length === 0 && !isGenerating}
                    aria-label="New Chat"
                    title="Start a new conversation"
                    className="inline-flex h-11 min-h-[44px] min-w-[44px] sm:h-10 sm:min-h-[40px] sm:min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 sm:px-3 text-xs font-medium text-white hover:border-[#FFD60A]/50 hover:text-[#FFD60A] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-[transform,color,border-color] duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus size={15} aria-hidden="true" />
                    <span className="min-[390px]:hidden">New</span>
                    <span className="hidden min-[390px]:inline">New Chat</span>
                  </button>
                </div>
              </div>

              {/* Guard prompt when clicking header New Chat during active streaming */}
              {confirmHeaderNewChat && isGenerating && (
                <div
                  role="alert"
                  className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 ai-thread-fade"
                >
                  <span>AI is still responding. Stop generation and start a new chat?</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmHeaderNewChat(false)}
                      className="min-h-[34px] rounded-lg border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:text-white cursor-pointer"
                    >
                      Keep waiting
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmHeaderNewChat(false);
                        handleStartNewChat();
                      }}
                      className="min-h-[34px] rounded-lg bg-[#FFD60A] px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-[#FFD60A]/90 cursor-pointer"
                    >
                      Stop & New Chat
                    </button>
                  </div>
                </div>
              )}
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
              className="relative flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y"
            >
              <div
                key={activeConversationId || "default"}
                ref={transcriptContentRef}
                className="mx-auto w-full max-w-[940px] px-3.5 sm:px-6 lg:px-8 ai-thread-fade"
              >
                {messages.length === 0 ? (
                  /* First-Visit Spacious Empty State & Tappable Class 9-10 Starter Cards */
                  <div className="py-6 sm:py-10 pb-10 space-y-7">
                    <div className="space-y-3" dir={isUrduUI ? "rtl" : "ltr"}>
                      <div className={`flex ${isUrduUI ? "justify-end" : "justify-start"}`}>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD60A] text-black">
                          <GraduationCap size={22} strokeWidth={2.2} />
                        </div>
                      </div>
                      <h2
                        className={`font-bold text-white tracking-tight text-balance ${
                          isUrduUI
                            ? "font-urdu text-2xl sm:text-[30px] leading-[1.9] text-right"
                            : "font-heading text-2xl sm:text-[32px] leading-tight"
                        }`}
                      >
                        {isUrduUI
                          ? "آج کون سا سوال یا تصور سمجھنا چاہتے ہیں؟"
                          : "What would you like to solve today?"}
                      </h2>
                      <p
                        className={`text-neutral-300 max-w-2xl ${
                          isUrduUI
                            ? "font-urdu text-[15px] leading-[2] text-right"
                            : "text-[15px] sm:text-base leading-[1.6]"
                        }`}
                      >
                        {isUrduUI
                          ? "پنجاب بورڈ اور فیڈرل بورڈ (کلاس 9 اور 10) کے مطابق ریاضی، فزکس، کیمسٹری اور بائیولوجی کی مرحلہ وار رہنمائی حاصل کریں۔"
                          : "Ask a Class 9–10 Math, Physics, Chemistry, or Biology question for step-by-step guidance."}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Your personal AI study assistant for Punjab Board Class 9–10 · Independent learning assistant
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-medium text-neutral-400">
                        {isUrduUI
                          ? "مثال کے سوالات (فوری حل کے لیے کلک کریں)"
                          : "Try an example question"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {STARTER_QUESTIONS.map((item) => {
                          const questionText = isUrduUI ? item.ur : item.en;
                          return (
                            <button
                              key={item.subject}
                              type="button"
                              disabled={isGenerating}
                              onClick={() => submitQuestion(questionText, item.subject)}
                              dir={isUrduUI ? "rtl" : "ltr"}
                              className={`group flex min-h-[104px] sm:min-h-[118px] flex-col justify-between gap-2.5 rounded-2xl border border-white/10 bg-[#121217] p-4 sm:p-5 transition-[transform,border-color,background-color] duration-150 hover:border-[#FFD60A]/50 hover:bg-[#17171E] active:scale-[0.99] disabled:opacity-50 cursor-pointer ${
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

                    {/* Clean Uncluttered Section Links Below Starters */}
                    <nav
                      aria-label="AI Workspace Sections"
                      className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 text-xs text-neutral-400"
                    >
                      <a href="#ai-subjects" className="hover:text-[#FFD60A] transition-colors">
                        Supported Subjects
                      </a>
                      <a href="#ai-how-to-use" className="hover:text-[#FFD60A] transition-colors">
                        How to Use & Templates
                      </a>
                      <a href="#ai-tips" className="hover:text-[#FFD60A] transition-colors">
                        Better Answer Tips
                      </a>
                      <a href="#ai-free-access" className="hover:text-[#FFD60A] transition-colors">
                        Free AI Access Info
                      </a>
                    </nav>
                  </div>
                ) : (
                  /* Active Spacious Conversation Thread */
                  <div className="pt-5 pb-12 sm:pt-7 sm:pb-14 space-y-6 sm:space-y-7">
                    {messages.map((msg, idx) => (
                      <AIMessageRow
                        key={msg.id}
                        msg={msg}
                        isLastMessage={idx === messages.length - 1}
                        isGenerating={isGenerating}
                        isUrduUI={isUrduUI}
                        isSpeakingThis={speakingMessageId === msg.id}
                        onRetry={handleRetryTurn}
                        onToggleReadAloud={handleToggleReadAloud}
                        onShareWhatsApp={handleShareWhatsApp}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Floating "Jump to latest" inside transcript ONLY when student scrolled up */}
              {showScrollToLatest && (
                <div className="sticky bottom-4 z-10 flex justify-center pointer-events-none ai-thread-fade">
                  <button
                    type="button"
                    onClick={() => {
                      shouldAutoScrollRef.current = true;
                      if (prevShowScrollRef.current) {
                        prevShowScrollRef.current = false;
                        setShowScrollToLatest(false);
                      }
                      scrollTranscriptToBottom("smooth");
                    }}
                    className="pointer-events-auto inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-white/20 bg-[#181822]/95 px-4 py-2 text-xs font-medium text-white shadow-lg hover:border-[#FFD60A]/60 active:scale-[0.98] transition-[transform,border-color] duration-150 cursor-pointer"
                  >
                    <ArrowDown size={14} aria-hidden="true" />
                    <span>Jump to latest</span>
                  </button>
                </div>
              )}
            </div>

            {/* C. Bottom Pinned Spacious Dock with Subject/Language Controls + Composer */}
            <AIComposerDock
              ref={composerRef}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              languageMode={languageMode}
              onLanguageChange={setLanguageMode}
              prefSummaryLabel={prefSummaryLabel}
              onOpenPreferences={handleOpenPreferences}
              isGenerating={isGenerating}
              onStopGeneration={handleStopGeneration}
              onSubmitDraft={handleSubmitFromComposer}
              speechSupported={speechSupported}
              status={status}
              attachedImage={attachedImage}
              onImageSelect={handleImageSelect}
              onRemoveAttachedImage={removeAttachedImage}
              fileInputRef={fileInputRef}
              cameraInputRef={cameraInputRef}
              composerNotice={composerNotice}
              onDismissNotice={handleDismissNotice}
              preferencesSummaryMeta={preferencesSummaryMeta}
            />
          </div>
        </div>
      </section>

      {/* Mobile & Tablet Slide-Over Conversations Drawer & Tutor Personalization Dialog */}
      <AIChatHistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={handleCloseHistory}
        conversations={conversations}
        activeId={activeConversationId}
        isGenerating={isGenerating}
        onSelectConversation={handleSelectConversation}
        onCreateNewChat={handleStartNewChat}
        onRenameConversation={handleRenameConversation}
        onTogglePinConversation={handleTogglePinConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <AIPreferencesPopover
        isOpen={preferencesOpen}
        onClose={handleClosePreferences}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
      />

      {/* =====================================================================
          3. TUTORING OVERVIEW, SUBJECTS, USAGE GUIDE & FREE-TIER TRANSPARENCY
             (Scrolls independently via the main page — zero nested scrollboxes)
         ===================================================================== */}
      <AIEducationalSections
        onFocusTemplate={focusWorkspaceWithTemplate}
        statusLoading={statusLoading}
        statusState={status.state}
        statusDisplay={statusDisplay}
        onRefreshHealthStatus={refreshHealthStatus}
      />
    </div>
  );
}
