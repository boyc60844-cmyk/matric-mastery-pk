"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  History,
  Trash2,
  Copy,
  Check,
  Share2,
  MessageCircle,
  FileText,
  RotateCcw,
  Zap,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  streamSolveWithAI,
  getHistory,
  saveHistory,
  clearHistory,
  LanguageMode,
  AIHistoryEntry,
  UploadedImageData,
} from "@/lib/ai";
import { addXP } from "@/lib/progress";
import AIMarkdownRenderer from "./AIMarkdownRenderer";
import DoubtOrb3D from "./DoubtOrb3D";

interface DoubtSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

const PRESET_PILLS = [
  "Derive F = ma formula step by step",
  "How to find discriminant of quadratic equation?",
  "Cramer's Rule steps for linear equations",
  "State Ohm's Law and its limitations",
  "How to calculate number of moles with Avogadro's number",
  "Differentiate between Mitosis and Meiosis",
];

export default function DoubtSolverModal({
  isOpen,
  onClose,
  initialQuestion = "",
}: DoubtSolverModalProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [language, setLanguage] = useState<LanguageMode>("english");
  const [uploadedImage, setUploadedImage] = useState<UploadedImageData | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<AIHistoryEntry[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [showXpToast, setShowXpToast] = useState<boolean>(false);
  const [showRelatedModal, setShowRelatedModal] = useState<boolean>(false);
  const [inputShaking, setInputShaking] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const doubtInputRef = useRef<HTMLTextAreaElement>(null);
  const answerContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial question
  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  // Load history from localStorage (key: matric_ai_history)
  const refreshHistoryList = () => {
    setHistoryList(getHistory());
  };

  useEffect(() => {
    if (isOpen) {
      refreshHistoryList();
      if (typeof window !== "undefined") {
        const hasSpeech =
          "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
        setSpeechSupported(Boolean(hasSpeech));
      }
    }
  }, [isOpen]);

  // Auto-scroll as streaming content arrives
  useEffect(() => {
    if (isGenerating && answerContainerRef.current) {
      answerContainerRef.current.scrollTop = answerContainerRef.current.scrollHeight;
    }
  }, [answer, isGenerating]);

  // Get Solution logic
  const handleGetSolution = async (explicitText?: string) => {
    // 1. Get text from input field with id doubtInput
    const inputElement = document.getElementById("doubtInput") as HTMLTextAreaElement | null;
    const userText = (explicitText !== undefined ? explicitText : (inputElement?.value || question)).trim();

    // 2. If empty and no image, shake input and return
    if (!userText && !uploadedImage) {
      setInputShaking(true);
      setTimeout(() => setInputShaking(false), 500);
      if (doubtInputRef.current) doubtInputRef.current.focus();
      return;
    }

    // 3. Change button text to Generating... with spinner, disable button, clear previous answer
    setIsGenerating(true);
    setErrorMessage(null);
    setAnswer("");
    setShowXpToast(false);

    try {
      // 4. Call streaming / generation
      const fullAnswer = await streamSolveWithAI({
        question: userText,
        language,
        uploadedImage,
        onChunk: (chunk) => {
          setAnswer(chunk);
        },
      });

      // 5. After stream ends: save to localStorage history, trigger +15 XP
      saveHistory(userText || "Image Problem Analysis", fullAnswer);
      refreshHistoryList();

      // Update totalXP in localStorage
      if (typeof window !== "undefined") {
        try {
          const currentTotalXP = parseInt(localStorage.getItem("totalXP") || "0", 10);
          localStorage.setItem("totalXP", String(currentTotalXP + 15));
        } catch (e) {
          console.warn("Failed to set totalXP", e);
        }
      }
      addXP(15, "Solved AI study doubt");

      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3500);
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setErrorMessage(err?.message || "AI server busy, retry in 5 sec");
    } finally {
      setIsGenerating(false);
    }
  };

  // Preset pills auto-trigger
  const handlePillClick = (text: string) => {
    setQuestion(text);
    if (doubtInputRef.current) {
      doubtInputRef.current.value = text;
    }
    handleGetSolution(text);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        const match = resultStr.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          setUploadedImage({
            mimeType: match[1],
            base64: match[2],
            previewUrl: resultStr,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Web Speech API Voice input
  const toggleVoiceInput = () => {
    if (!speechSupported) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.lang = language === "urdu" ? "ur-PK" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        if (doubtInputRef.current) {
          doubtInputRef.current.value = transcript;
        }
        setIsRecording(false);
        handleGetSolution(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      console.warn("Speech error", e);
      setIsRecording(false);
    }
  };

  // 4 Action Buttons
  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!answer) return;
    const shareText = encodeURIComponent(
      `*Matric Mastery AI Solution:*\n\n*Question:* ${question}\n\n${answer}\n\n👉 Practice free at Matric Mastery!`
    );
    window.open(`https://wa.me/?text=${shareText}`, "_blank");
  };

  const handleAskFollowUp = () => {
    setQuestion("");
    setUploadedImage(null);
    if (doubtInputRef.current) {
      doubtInputRef.current.value = "";
      doubtInputRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md">
      <div className="relative flex h-[92vh] max-h-[850px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121215] shadow-2xl shadow-black">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#16161a]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-black font-black shadow-glow">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
                Matric Mastery AI
                <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                  Gemini 1.5 Flash
                </span>
              </h3>
              <p className="text-[11px] text-muted font-sans">
                Answers Literally Everything &bull; Streaming &bull; 100% Free
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* +15 XP Floating Toast Notification */}
            {showXpToast && (
              <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-heading font-black text-black animate-bounce shadow-glow">
                <Zap size={13} className="fill-black" />
                <span>+15 XP Earned!</span>
              </div>
            )}

            {/* History Toggle Button */}
            <button
              type="button"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-heading font-bold transition-colors ${
                showHistoryDrawer
                  ? "bg-accent text-black"
                  : "bg-white/5 text-muted hover:text-white hover:bg-white/10"
              }`}
              title="Recent Q&A History"
            >
              <History size={14} />
              <span className="hidden sm:inline">History</span>
              {historyList.length > 0 && (
                <span className="ml-1 rounded-full bg-black/30 px-1.5 py-0.2 text-[9px]">
                  {historyList.length}
                </span>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Body Area */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Answer Workspace Area (Scrollable) */}
          <div
            ref={answerContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
          >
            {/* Empty State when no question asked yet */}
            {!answer && !isGenerating && !errorMessage && (
              <div className="py-6 sm:py-8 text-left space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-center gap-2 text-accent font-heading font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles size={14} />
                    <span>Matric Mastery AI &mdash; Senior Bhai</span>
                  </div>
                  <h4 className="font-heading text-base sm:text-lg font-black text-white">
                    Ask literally anything &mdash; Math, Physics, Bio, Past Papers, Jokes, or Motivation
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                    Personalized for Class 9 &amp; 10 Punjab Boards (BISE Multan, Lahore, Gujranwala,
                    Faisalabad, Rawalpindi) &amp; FBISE.
                  </p>
                </div>

                {/* Quick High-Yield Doubts Pills */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted/70">
                    Quick High-Yield Doubts (1-Click Solve):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_PILLS.map((pill) => (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => handlePillClick(pill)}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/85 transition-all hover:border-accent hover:text-accent hover:bg-accent/5 text-left"
                      >
                        {pill} &rarr;
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error State with Retry Button */}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleGetSolution()}
                  className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 font-heading font-black text-black hover:bg-red-400 transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Active Loading Shimmer with 3 Dots */}
            {isGenerating && !answer && (
              <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-heading font-black text-accent uppercase tracking-wider">
                  <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>Matric Mastery AI is thinking...</span>
                </div>
                <div className="flex items-center gap-1.5 py-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-accent animate-bounce" />
                </div>
                <p className="text-xs text-muted font-mono">
                  Checking Punjab Board syllabus and preparing direct answer...
                </p>
              </div>
            )}

            {/* Streaming Answer Output Container */}
            {answer && (
              <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-5 sm:p-6 shadow-soft text-left space-y-4">
                {/* Question Badge Banner */}
                <div className="border-b border-white/10 pb-3 flex items-center justify-between text-xs text-muted font-mono">
                  <span className="font-heading font-bold text-white line-clamp-1">
                    Q: {question || "Attached Problem"}
                  </span>
                  <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] text-accent font-bold uppercase">
                    {language} Mode
                  </span>
                </div>

                {/* Render Markdown / Formula response */}
                <AIMarkdownRenderer content={answer} />

                {/* Streaming Indicator */}
                {isGenerating && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-accent font-mono animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>Streaming response...</span>
                  </div>
                )}

                {/* 4 Bottom Action Buttons */}
                {!isGenerating && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                    {/* 1. Copy */}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-heading font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>

                    {/* 2. Share WhatsApp */}
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-heading font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <MessageCircle size={13} />
                      <span>Share WhatsApp</span>
                    </button>

                    {/* 3. Ask Follow-up */}
                    <button
                      type="button"
                      onClick={handleAskFollowUp}
                      className="flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-heading font-bold text-accent hover:bg-accent/20 transition-colors"
                    >
                      <Sparkles size={13} />
                      <span>Ask Follow-up</span>
                    </button>

                    {/* 4. Related Past Papers */}
                    <button
                      type="button"
                      onClick={() => setShowRelatedModal(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-heading font-bold text-muted hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <FileText size={13} />
                      <span>Related Past Papers</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Input Workspace */}
          <div className="border-t border-white/10 bg-[#0E0E12] p-3 sm:p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGetSolution();
              }}
              className="space-y-2.5"
            >
              {/* Image Preview Thumbnail */}
              {uploadedImage && (
                <div className="relative inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-black/60 p-1.5">
                  <img
                    src={uploadedImage.previewUrl}
                    alt="Problem attachment"
                    className="h-12 w-12 rounded object-cover"
                  />
                  <span className="text-[11px] font-mono text-muted pr-6">
                    Image ready for OCR analysis
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-1.5 top-1.5 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                    title="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Main Input Textarea with id doubtInput and 3D Glowing Reactive Orb */}
              <div
                className={`relative overflow-hidden rounded-xl border bg-black/50 p-2.5 transition-all ${
                  inputShaking
                    ? "border-red-500 animate-shake shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "border-white/15 focus-within:border-accent"
                }`}
              >
                {/* 3D Glowing Reactive Orb behind input */}
                <DoubtOrb3D isTyping={Boolean(question)} isGenerating={isGenerating} />

                <textarea
                  id="doubtInput"
                  ref={doubtInputRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask any doubt... (Math, Physics, Bio, English, Past Papers)"
                  rows={2}
                  className="relative z-10 w-full resize-none bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGetSolution();
                    }
                  }}
                />

                {/* Sub-toolbar */}
                <div className="relative z-10 mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Language dropdown */}
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as LanguageMode)}
                      className="rounded-lg border border-white/15 bg-[#18181d] px-2 py-1 text-xs text-white/90 focus:outline-none"
                    >
                      <option value="english">English</option>
                      <option value="urdu">اردو / Roman Urdu</option>
                    </select>

                    {/* Image Upload Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-1 rounded-lg border px-2 py-1 transition-colors ${
                        uploadedImage
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-white/10 bg-white/5 text-muted hover:text-white"
                      }`}
                      title="Attach photo of question or textbook diagram"
                    >
                      <ImageIcon size={13} />
                      <span className="hidden sm:inline">Attach Photo</span>
                    </button>

                    {/* Voice Input Button */}
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className={`flex items-center gap-1 rounded-lg border px-2 py-1 transition-colors ${
                          isRecording
                            ? "animate-pulse border-red-500 bg-red-500/20 text-red-400 font-bold"
                            : "border-white/10 bg-white/5 text-muted hover:text-white"
                        }`}
                        title="Voice dictation (Web Speech API)"
                      >
                        {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                        <span className="hidden sm:inline">
                          {isRecording ? "Listening..." : "Voice"}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Get Solution Submit CTA */}
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-1.5 font-heading text-xs font-black text-black transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-black" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Solution</span>
                        <Send size={12} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* History Drawer from Right */}
          {showHistoryDrawer && (
            <div className="absolute inset-y-0 right-0 z-30 w-full max-w-sm border-l border-white/15 bg-[#141418] shadow-2xl flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#18181d]">
                <div className="flex items-center gap-1.5 font-heading text-xs font-bold text-white uppercase tracking-wider">
                  <History size={14} className="text-accent" />
                  <span>Recent Q&amp;A History ({historyList.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  {historyList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        clearHistory();
                        refreshHistoryList();
                      }}
                      className="flex items-center gap-1 text-[11px] font-mono text-red-400 hover:underline"
                    >
                      <Trash2 size={12} /> Clear History
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowHistoryDrawer(false)}
                    className="text-muted hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {historyList.length === 0 ? (
                  <div className="py-16 text-center text-muted text-xs">
                    No doubts saved yet. Ask a question to build your offline study history!
                  </div>
                ) : (
                  historyList.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuestion(item.q);
                        if (doubtInputRef.current) {
                          doubtInputRef.current.value = item.q;
                        }
                        setAnswer(item.a);
                        setShowHistoryDrawer(false);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left transition-colors hover:border-accent hover:bg-white/[0.04]"
                    >
                      <p className="text-xs font-medium text-white line-clamp-2">
                        {item.q}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-muted">
                        <span>{new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="text-accent">Reopen</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Related Past Papers Modal */}
          {showRelatedModal && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 p-4">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#141418] p-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                    <FileText size={16} className="text-accent" />
                    Related Past Paper Questions
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowRelatedModal(false)}
                    className="text-muted hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <p className="text-muted">
                    This topic frequently appears in Punjab Board SSC-II examinations:
                  </p>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-white/90">
                    <strong>BISE Multan (2024 Group-I):</strong> State definition and write
                    mathematical derivation (4 Marks).
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-white/90">
                    <strong>BISE Lahore (2023 Group-II):</strong> Short question in Section-B (2
                    Marks).
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-white/90">
                    <strong>FBISE Islamabad (2023):</strong> Section-C Part (a) numerical
                    application (5 Marks).
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRelatedModal(false)}
                    className="rounded-xl bg-accent px-4 py-1.5 font-heading text-xs font-black text-black"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
