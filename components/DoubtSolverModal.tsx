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
  CheckCircle,
  HelpCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  solveDoubt,
  loadSavedDoubts,
  saveDoubtToHistory,
  deleteDoubt,
  clearAllDoubts,
  LanguageMode,
  DoubtSolution,
  StoredDoubt,
} from "@/lib/ai";
import { addXP } from "@/lib/progress";

interface DoubtSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

export default function DoubtSolverModal({
  isOpen,
  onClose,
  initialQuestion = "",
}: DoubtSolverModalProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [language, setLanguage] = useState<LanguageMode>("english");
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<DoubtSolution | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<"solve" | "history">("solve");
  const [history, setHistory] = useState<StoredDoubt[]>([]);
  const [speechSupported, setSpeechSupported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial question
  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
      setActiveTab("solve");
    }
  }, [initialQuestion]);

  // Load history
  const reloadHistory = () => {
    setHistory(loadSavedDoubts());
  };

  useEffect(() => {
    reloadHistory();
    // Check speech recognition support
    if (typeof window !== "undefined") {
      const hasSpeech =
        "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
      setSpeechSupported(Boolean(hasSpeech));
    }
  }, [isOpen]);

  // Voice Input Handler
  const toggleSpeechRecognition = () => {
    if (!speechSupported) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.lang =
        language === "urdu" ? "ur-PK" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error", e);
      setIsRecording(false);
    }
  };

  // Image Upload Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Solve Action
  const handleSolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await solveDoubt(question, imagePreview || undefined, language);
      setSolution(result);
      saveDoubtToHistory(question, result);
      reloadHistory();
      addXP(15, "Asked an exam doubt");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromHistory = (item: StoredDoubt) => {
    setQuestion(item.question);
    setLanguage(item.language);
    setSolution(item.solution);
    setActiveTab("solve");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121215] shadow-2xl shadow-black">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-[#16161a]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-black font-black shadow-glow">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
                Matric AI Doubt Solver
                <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                  Punjab Syllabus
                </span>
              </h3>
              <p className="text-[11px] text-muted font-sans">
                Formulas &bull; Derivations &bull; Urdu/English &bull; 100% Free
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "solve" ? "history" : "solve")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-heading font-bold transition-colors ${
                activeTab === "history"
                  ? "bg-accent text-black"
                  : "bg-white/5 text-muted hover:text-white hover:bg-white/10"
              }`}
              title="Recent Doubts History"
            >
              <History size={14} />
              <span className="hidden sm:inline">Recent</span>
              {history.length > 0 && (
                <span className="ml-1 rounded-full bg-black/30 px-1.5 py-0.2 text-[9px]">
                  {history.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab 1: Solve Question */}
        {activeTab === "solve" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Input Form */}
            <form onSubmit={handleSolve} className="space-y-3">
              <div className="relative rounded-xl border border-white/15 bg-black/40 p-3 focus-within:border-accent transition-colors">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Find roots using quadratic formula, explain Ohm's Law, or Cramer's Rule steps..."
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSolve();
                    }
                  }}
                />

                {/* Uploaded Image Preview */}
                {imagePreview && (
                  <div className="relative mt-2 inline-block">
                    <img
                      src={imagePreview}
                      alt="Uploaded problem"
                      className="h-16 w-auto rounded border border-white/20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white shadow"
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Control bar */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Language selector */}
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as LanguageMode)}
                      className="rounded border border-white/15 bg-[#18181d] px-2 py-1 text-xs text-white/90 focus:outline-none"
                    >
                      <option value="english">English</option>
                      <option value="urdu">اردو (Urdu)</option>
                      <option value="roman-urdu">Roman Urdu</option>
                    </select>

                    {/* Image Attachment Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-1 rounded border px-2 py-1 transition-colors ${
                        imagePreview
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-white/10 bg-white/5 text-muted hover:text-white"
                      }`}
                      title="Attach diagram or book photo"
                    >
                      <ImageIcon size={13} />
                      <span className="hidden sm:inline">Attach Photo</span>
                    </button>

                    {/* Voice Input Button */}
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        className={`flex items-center gap-1 rounded border px-2 py-1 transition-colors ${
                          isRecording
                            ? "animate-pulse border-red-500 bg-red-500/20 text-red-400"
                            : "border-white/10 bg-white/5 text-muted hover:text-white"
                        }`}
                        title="Voice dictation"
                      >
                        {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                        <span className="hidden sm:inline">
                          {isRecording ? "Listening..." : "Voice"}
                        </span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-1.5 font-heading text-xs font-black text-black transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 animate-ping rounded-full bg-black"></span>
                        Solving...
                      </span>
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

            {/* Quick Prompt Pills */}
            {!solution && (
              <div className="space-y-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted/70">
                  Quick High-Yield Doubts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Derive F = ma formula",
                    "How to find discriminant of quadratic equation?",
                    "Cramer's Rule steps for linear equations",
                    "State Ohm's Law and its limitations",
                    "How to calculate number of moles with Avogadro's number",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setQuestion(preset);
                        solveDoubt(preset, undefined, language).then((res) => {
                          setSolution(res);
                          saveDoubtToHistory(preset, res);
                          reloadHistory();
                          addXP(15);
                        });
                      }}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-left text-xs text-white/80 transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {preset} &rarr;
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Solution Display */}
            {solution && (
              <div className="space-y-4 rounded-xl border border-white/15 bg-white/[0.02] p-4 text-left">
                {/* Status Notice */}
                {solution.statusMessage && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-mono text-muted">
                    <Info size={13} className="text-accent shrink-0" />
                    <span>{solution.statusMessage}</span>
                  </div>
                )}

                {/* 1. Simple Explanation */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-heading font-black text-accent uppercase tracking-wider">
                    <BookOpen size={14} /> 1. Simple Explanation
                  </div>
                  <p className="mt-1 text-sm text-white/90 leading-relaxed font-sans">
                    {solution.simpleExplanation}
                  </p>
                </div>

                {/* 2. Step-by-Step */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-heading font-black text-accent uppercase tracking-wider">
                    <CheckCircle size={14} /> 2. Step-by-Step Working
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm text-white/85">
                    {solution.stepByStep.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono text-xs text-accent shrink-0 pt-0.5">
                          &bull;
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Formula */}
                {solution.formula && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-heading font-black text-accent uppercase tracking-wider">
                      <HelpCircle size={14} /> 3. Syllabus Formula
                    </div>
                    <div className="mt-1 rounded-lg border border-accent/30 bg-[#0e0e11] p-3 font-mono text-xs sm:text-sm text-accent">
                      {solution.formula}
                    </div>
                  </div>
                )}

                {/* 4. Final Answer */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-heading font-black text-accent uppercase tracking-wider">
                    <ArrowRight size={14} /> 4. Final Answer
                  </div>
                  <p className="mt-1 font-mono text-sm font-semibold text-white bg-white/5 p-2.5 rounded-lg border border-white/10">
                    {solution.finalAnswer}
                  </p>
                </div>

                {/* 5. Quick Tip */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-heading font-black text-accent uppercase tracking-wider">
                    <Lightbulb size={14} /> 5. Paper Presentation Quick Tip
                  </div>
                  <p className="mt-1 text-xs text-muted leading-relaxed italic bg-accent/[0.06] border border-accent/20 p-2.5 rounded-lg">
                    {solution.quickTip}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Recent Doubts History */}
        {activeTab === "history" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                Saved Doubts History ({history.length})
              </span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearAllDoubts();
                    setHistory([]);
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-red-400 hover:underline"
                >
                  <Trash2 size={12} /> Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center text-muted text-sm">
                No recent doubts saved yet. Ask a question to store your solutions locally!
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-accent/40"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectFromHistory(item)}
                      className="flex-1 text-left"
                    >
                      <p className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                        {item.question}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-muted">
                        <span>{item.timestamp}</span>
                        <span>&middot;</span>
                        <span className="capitalize">{item.language}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteDoubt(item.id);
                        reloadHistory();
                      }}
                      className="ml-2 p-1.5 text-muted hover:text-red-400 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Footer */}
        <div className="border-t border-white/10 px-5 py-3 bg-[#0d0d10] text-[11px] text-muted flex items-center justify-between font-mono">
          <span>Punjab Boards & FBISE Syllabi</span>
          <span>Saves +15 XP to your progress</span>
        </div>
      </div>
    </div>
  );
}
