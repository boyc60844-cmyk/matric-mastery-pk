/* ==========================================================================
   MATRIC MASTERY AI — DEDICATED STANDALONE PAGE (/ai) (v3.8.0)
   - Free-First AI Architecture with Cloudflare Workers AI
     Text: @cf/meta/llama-3.1-8b-instruct-fast | Vision: @cf/meta/llama-3.2-11b-vision-instruct (Gated)
   - Zero-Telemetry & Strict Student Privacy: No server retention of prompts
   - Transparent States: Ready, Unconfigured, Quota Exhausted, Thinking, Error
   - 100% Free: Respects 10,000 Daily Neurons Allocation without paid upselling
   ========================================================================== */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
  Copy,
  Check,
  Share2,
  Trash2,
  Download,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
  Mic,
  MicOff,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/src/context/LanguageContext";
import AIMarkdownRenderer from "@/components/AIMarkdownRenderer";
import DoubtOrb3D from "@/components/DoubtOrb3D";
import {
  AIChatMessage,
  AIStatus,
  checkAIStatus,
  sendAIMessage,
  getLocalChatHistory,
  saveLocalChatHistory,
  clearLocalChatHistory,
  exportChatHistoryAsJSON,
} from "@/lib/aiClient";
import { addXP } from "@/lib/progress";

const HIGH_YIELD_PROMPTS = [
  {
    topic: "Physics",
    query: "Derive F = ma formula step by step with Punjab Board marking scheme",
  },
  {
    topic: "Math",
    query: "How to find discriminant and nature of roots of 2x^2 - 7x + 3 = 0?",
  },
  {
    topic: "Physics",
    query: "State Ohm's Law and explain its temperature limitations with V-I graph",
  },
  {
    topic: "Chemistry",
    query: "Explain oxidation states and how to balance redox equations by ion-electron method",
  },
  {
    topic: "Biology",
    query: "Differentiate between Mitosis and Meiosis in a clear exam comparison table",
  },
  {
    topic: "Computer",
    query: "Explain the difference between compiler and interpreter with examples in C language",
  },
];

export default function AIPage() {
  const { t, isRTL } = useLanguage();

  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("General");
  const [languageMode, setLanguageMode] = useState<"en" | "ur">("en");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<AIStatus>({
    state: "unconfigured",
    provider: "none",
    model: "@cf/meta/llama-3.1-8b-instruct-fast (Text) · @cf/meta/llama-3.2-11b-vision-instruct (Vision Gated)",
    message: "Checking AI service status...",
    visionEnabled: false,
  });

  // Image attachment state
  const [attachedImage, setAttachedImage] = useState<{
    previewUrl: string;
    mimeType: string;
    base64: string;
  } | null>(null);

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize status & chat history
  useEffect(() => {
    checkAIStatus().then((s) => {
      setStatus(s);
      if (s.state === "quota_exhausted") setIsQuotaExhausted(true);
    });

    const savedHistory = getLocalChatHistory();
    if (savedHistory.length > 0) {
      setMessages(savedHistory);
    }

    if (typeof window !== "undefined") {
      const hasSpeech = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
      setSpeechSupported(Boolean(hasSpeech));
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Handle Image Upload & Validation (<4MB, JPEG/PNG/WebP)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, or WebP).");
      return;
    }

    const maxBytes = 4 * 1024 * 1024; // 4MB
    if (file.size > maxBytes) {
      setErrorMessage("Image is larger than 4 MB. Please upload a smaller crop.");
      return;
    }

    setErrorMessage(null);
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

  // Voice dictation toggle
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
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Submit message
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt !== undefined ? customPrompt : inputText).trim();

    if (!textToSend && !attachedImage) return;
    if (isGenerating) return;

    setErrorMessage(null);

    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: textToSend || "Please solve the question in this textbook diagram step-by-step.",
      timestamp: Date.now(),
      image: attachedImage || undefined,
      subject: selectedSubject,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    const currentAttachment = attachedImage;
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Create placeholder for assistant response
    const assistantPlaceholderId = `msg-ai-${Date.now()}`;
    const assistantPlaceholder: AIChatMessage = {
      id: assistantPlaceholderId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      subject: selectedSubject,
    };

    setMessages([...newMessages, assistantPlaceholder]);
    setIsGenerating(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const fullAnswer = await sendAIMessage({
        messages: newMessages,
        image: currentAttachment
          ? { mimeType: currentAttachment.mimeType, base64: currentAttachment.base64 }
          : null,
        language: languageMode,
        signal: abortController.signal,
        onChunk: (partialText) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantPlaceholderId ? { ...m, content: partialText } : m
            )
          );
        },
      });

      // Update final message and persist to local storage
      const finalMessages = newMessages.concat({
        ...assistantPlaceholder,
        content: fullAnswer,
      });

      setMessages(finalMessages);
      saveLocalChatHistory(finalMessages);

      // Award study XP
      addXP(15, "Engaged with Matric Mastery AI");
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages((prev) => prev.filter((m) => m.id !== assistantPlaceholderId));
        return;
      }

      const isQuota = (err as any)?.code === "QUOTA_EXHAUSTED" || err.message?.includes("10,000");
      if (isQuota) {
        setIsQuotaExhausted(true);
      }

      // Handle unconfigured or live error state honestly
      const isUnconfigured = (err as any)?.code === "UNCONFIGURED";
      const displayError = isUnconfigured
        ? "Matric Mastery AI is currently in Preview Mode. The Cloudflare Workers AI backend is prepared in worker/index.ts with @cf/meta/llama-3.1-8b-instruct-fast (~563 daily free queries). Vision inference (@cf/meta/llama-3.2-11b-vision-instruct) remains separated and paused until parent/guardian Meta license approval. Connecting the live service requires separate adult-supervised Cloudflare account deployment and VITE_AI_WORKER_URL. In the meantime, explore our verified study playbooks, paper presentation hacks, and past papers below."
        : err?.message || "Failed to complete AI response. Please try again.";

      setErrorMessage(displayError);

      // Mark the placeholder with honest explanation
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantPlaceholderId
            ? {
                ...m,
                content: `⚠️ **Notice:** ${displayError}`,
                error: true,
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(
      `*Matric Mastery AI Solution:*\n\n${text.slice(0, 800)}...\n\n👉 Study free at Matric Mastery!`
    );
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    const confirmed = window.confirm("Clear all messages from this session? Your local chat history will be emptied.");
    if (confirmed) {
      clearLocalChatHistory();
      setMessages([]);
      setErrorMessage(null);
    }
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

  return (
    <div className="relative min-h-[calc(100dvh-66px)] w-full bg-[#0A0A0A] text-white py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="absolute top-10 left-1/4 h-[420px] w-[420px] rounded-full bg-[#FFD60A]/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 h-[420px] w-[420px] rounded-full bg-blue-500/[0.02] blur-[160px] pointer-events-none" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* Top Header Card */}
        <div className="rounded-[24px] border border-white/10 bg-[#121216]/90 p-5 sm:p-7 backdrop-blur-xl shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-accent text-black font-black shadow-glow shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading text-xl sm:text-2xl font-black text-white">
                    Matric Mastery AI
                  </h1>
                  <span className="rounded-lg border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                    Dedicated Workspace
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  Academic problem solver &amp; conceptual tutor for Punjab Boards (BISE Lahore, Multan, Faisalabad, Rawalpindi) &amp; FBISE.
                </p>
              </div>
            </div>

            {/* Provider & Quota Status Badge */}
            <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-mono">
                <span
                  className={`h-2 w-2 rounded-full ${
                    status.state === "ready"
                      ? "bg-emerald-400 animate-pulse"
                      : status.state === "quota_exhausted"
                      ? "bg-red-400"
                      : "bg-amber-400"
                  }`}
                />
                <span className="text-white/90">
                  {status.state === "ready"
                    ? `Live: ${status.model}`
                    : status.state === "quota_exhausted"
                    ? "Quota Exhausted (429)"
                    : `Backend: ${status.model}`}
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted">
                Cloudflare Free Tier · 10,000 Neurons/Day · 0 Tracking
              </span>
            </div>
          </div>

          {/* Student Privacy & Ethics Banner */}
          {showPrivacyBanner && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-3.5 sm:p-4 text-xs text-muted flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-heading font-bold text-white text-xs">
                    Student Privacy Notice &amp; Zero-Telemetry Directive
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Student queries and textbook diagram attachments are processed in-flight and are <strong>never stored on remote servers, logged to analytics, or shared with commercial entities</strong>.
                    Please do not upload personal documents (CNIC, B-form, phone numbers, or roll number slips). Matric Mastery AI is a study aid, not an official board examiner.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyBanner(false)}
                className="text-muted hover:text-white p-1"
                title="Dismiss notice"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Quota Exhausted Warning State */}
        {isQuotaExhausted && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-xs text-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-heading font-black text-sm text-white">
                  Daily Free Allocation of 10,000 Cloudflare Neurons Reached
                </h3>
                <p className="leading-relaxed">
                  To protect our zero-cost access policy and prevent student credit-card charges or hidden fees, automated AI inference is paused until the next daily reset at <strong>00:00 UTC</strong>.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/strategies"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 font-heading text-xs font-black text-black hover:bg-accent/90"
                  >
                    <BookOpen size={13} />
                    <span>Browse 30+ Exam Strategies</span>
                  </Link>
                  <Link
                    href="/paper-hacks"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-heading text-xs font-bold text-white hover:bg-white/10"
                  >
                    <span>Paper Presentation Hacks &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unconfigured / Preview Notice Card */}
        {status.state === "unconfigured" && !isQuotaExhausted && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4 sm:p-5 text-xs text-amber-100">
            <div className="flex items-start gap-3">
              <Cpu size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-heading font-black text-xs sm:text-sm text-white">
                    Cloudflare Workers AI Infrastructure Prepared
                  </h4>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] text-amber-300 font-bold">
                    worker/index.ts Ready · Pending Adult Approval
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  The standalone Cloudflare Workers AI backend is configured with <code>@cf/meta/llama-3.1-8b-instruct-fast</code> for sustainable text problem solving (~563 queries/day within the 10,000 daily free Neurons limit). Image analysis (<code>@cf/meta/llama-3.2-11b-vision-instruct</code>) is kept separate and disabled until a parent/guardian reviews and accepts Meta&apos;s license terms. Connecting the live service requires adult-supervised Wrangler deployment and setting <code>VITE_AI_WORKER_URL</code>. No paid billing or credit card is required.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="rounded border border-amber-500/30 bg-black/40 px-2 py-1 text-amber-300">
                    Text: @cf/meta/llama-3.1-8b-instruct-fast
                  </span>
                  <span className="rounded border border-white/15 bg-black/40 px-2 py-1 text-neutral-300">
                    Vision: @cf/meta/llama-3.2-11b-vision-instruct (Paused · License Pending)
                  </span>
                  <span className="rounded border border-white/10 bg-black/40 px-2 py-1 text-muted">
                    Allocation: 10,000 Neurons / Day Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area (Conversation Container) */}
        <div className="relative flex flex-col rounded-[24px] border border-white/10 bg-[#0E0E12] shadow-2xl overflow-hidden min-h-[500px]">
          {/* Workspace Top Toolbar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#141418] px-4 sm:px-6 py-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                Conversation
              </span>
              {messages.length > 0 && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-muted">
                  {messages.length} {messages.length === 1 ? "message" : "messages"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-muted hover:text-white hover:bg-white/10 transition-colors"
                    title="Export study session as JSON"
                  >
                    <Download size={12} />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Clear local session"
                  >
                    <Trash2 size={12} />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </>
              )}

              {/* Language Mode Selector */}
              <select
                value={languageMode}
                onChange={(e) => setLanguageMode(e.target.value as "en" | "ur")}
                className="rounded-lg border border-white/15 bg-black/60 px-2.5 py-1 text-xs text-white/90 font-mono focus:border-accent focus:outline-none"
              >
                <option value="en">English Mode</option>
                <option value="ur">اردو / Roman Urdu</option>
              </select>
            </div>
          </div>

          {/* Chat Messages Scrollable Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[580px]">
            {/* Empty State Welcome Arena */}
            {messages.length === 0 && (
              <div className="relative py-8 sm:py-12 text-center max-w-xl mx-auto space-y-6">
                <div className="relative h-28 w-full flex items-center justify-center overflow-hidden">
                  <DoubtOrb3D isTyping={Boolean(inputText)} isGenerating={isGenerating} />
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-lg sm:text-xl font-black text-white">
                    What concept or question can we solve today?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    Ask any question across Math, Physics, Chemistry, Biology, or English. You can also upload a clear photo of your textbook numerical or diagram.
                  </p>
                </div>

                {/* High-Yield Question Starters */}
                <div className="space-y-2.5 text-left pt-2">
                  <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-muted">
                    High-Yield Punjab Board Starters (1-Click Solve):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {HIGH_YIELD_PROMPTS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(item.query)}
                        className="flex flex-col text-left rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-accent hover:bg-white/[0.04] transition-all group"
                      >
                        <span className="font-mono text-[10px] font-bold text-accent uppercase">
                          {item.topic}
                        </span>
                        <span className="mt-1 text-xs text-white/85 group-hover:text-white line-clamp-2">
                          {item.query}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rendered Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Message Container */}
                <div
                  className={`relative max-w-full sm:max-w-2xl rounded-2xl p-4 sm:p-5 shadow-sm text-left ${
                    msg.role === "user"
                      ? "bg-accent/15 border border-accent/30 text-white rounded-br-xs"
                      : "bg-[#16161C] border border-white/15 text-white/95 rounded-bl-xs"
                  }`}
                >
                  {/* Top Message Meta */}
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 mb-3 text-[11px] font-mono text-muted">
                    <span className="font-heading font-black text-white flex items-center gap-1.5">
                      {msg.role === "user" ? (
                        <>
                          <span>You (Student)</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} className="text-accent" />
                          <span>Matric Mastery AI</span>
                        </>
                      )}
                    </span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Attached Image Preview if User Uploaded */}
                  {msg.image && (
                    <div className="mb-3">
                      <img
                        src={msg.image.previewUrl}
                        alt="Attached problem diagram"
                        className="max-h-60 rounded-xl border border-white/20 object-contain bg-black/60"
                      />
                    </div>
                  )}

                  {/* Message Content */}
                  {msg.role === "assistant" && !msg.content && isGenerating ? (
                    <div className="flex items-center gap-2 py-3 text-xs text-accent font-mono animate-pulse">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Thinking and preparing step-by-step solution...</span>
                    </div>
                  ) : (
                    <AIMarkdownRenderer content={msg.content} />
                  )}

                  {/* Assistant Action Buttons */}
                  {msg.role === "assistant" && msg.content && !isGenerating && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-muted hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(msg.content)}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-mono text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <Share2 size={12} />
                        <span>Share</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Question Input Area */}
          <div className="border-t border-white/10 bg-[#121216] p-3 sm:p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="space-y-3"
            >
              {/* Attached Image Thumbnail Bar */}
              {attachedImage && (
                <div className="relative inline-flex items-center gap-2.5 rounded-xl border border-accent/40 bg-black/80 p-1.5 pr-8">
                  <img
                    src={attachedImage.previewUrl}
                    alt="Problem attachment"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="text-[11px] font-mono text-muted">
                    <p className="text-white font-medium">Textbook Problem Attached</p>
                    <p className="text-[10px] text-accent">
                      {status.visionEnabled
                        ? "Ready for multimodal analysis"
                        : "Vision paused pending adult Meta license review"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachedImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500/80 p-0.5 text-white hover:bg-red-500"
                    title="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Textarea Input with Character Counter */}
              <div className="relative rounded-2xl border border-white/15 bg-black/50 p-3 focus-within:border-accent transition-colors">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a Punjab Board math problem, physics derivation, or chemistry concept..."
                  rows={2}
                  maxLength={2000}
                  className="w-full resize-none bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                {/* Sub-toolbar Controls */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Attach Photo Button */}
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
                      className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs transition-colors ${
                        attachedImage
                          ? "border-accent bg-accent/15 text-accent font-bold"
                          : "border-white/10 bg-white/5 text-muted hover:text-white"
                      }`}
                      title="Attach diagram or textbook photo (JPEG, PNG, WebP < 4MB)"
                    >
                      <ImageIcon size={14} />
                      <span className="hidden sm:inline">Attach Problem</span>
                    </button>

                    {/* Voice Dictation Button */}
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs transition-colors ${
                          isRecording
                            ? "border-red-500 bg-red-500/20 text-red-400 animate-pulse font-bold"
                            : "border-white/10 bg-white/5 text-muted hover:text-white"
                        }`}
                        title="Voice dictation (Web Speech API)"
                      >
                        {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                        <span className="hidden sm:inline">
                          {isRecording ? "Listening..." : "Voice"}
                        </span>
                      </button>
                    )}

                    {/* Subject Filter Tag */}
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="rounded-xl border border-white/10 bg-black/60 px-2 py-1 text-xs text-muted hover:text-white focus:outline-none"
                    >
                      <option value="General">All Subjects</option>
                      <option value="Math">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer">Computer Science</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted">
                      {inputText.length}/2000
                    </span>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isGenerating || (!inputText.trim() && !attachedImage)}
                      className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 font-heading text-xs font-black text-black shadow-glow transition-all hover:bg-accent/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-black" />
                          <span>Solving...</span>
                        </>
                      ) : (
                        <>
                          <span>Ask AI</span>
                          <Send size={12} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Educational Resources & Alternatives Footer */}
        <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-5 sm:p-6 text-xs text-muted">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-white text-sm">
                Need Topper-Verified Answers While You Study?
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                Explore our manually written, examiner-checked subject blueprints, 605 marker presentation hacks, and solved past papers.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link
                href="/strategies"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white font-heading font-bold hover:border-accent hover:text-accent transition-colors"
              >
                Subject Strategies &rarr;
              </Link>
              <Link
                href="/paper-hacks"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white font-heading font-bold hover:border-accent hover:text-accent transition-colors"
              >
                Paper Hacks &rarr;
              </Link>
              <Link
                href="/past-papers"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white font-heading font-bold hover:border-accent hover:text-accent transition-colors"
              >
                Past Papers &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
