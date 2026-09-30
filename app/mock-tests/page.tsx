"use client";

import { useState, useEffect, useId } from "react";
import {
  Clock,
  Award,
  AlertTriangle,
  RotateCcw,
  Printer,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  ShieldCheck,
  User,
  ArrowRight,
} from "lucide-react";
import {
  SUBJECTS_CONFIG,
  generateMockTest,
  GeneratedMockTest,
  AnyQuestion,
  MCQQuestion,
} from "@/lib/question-bank";
import { recordMockTestResult, MockTestResult, recordMistake } from "@/lib/progress";

export default function MockTestsPage() {
  const [stage, setStage] = useState<"setup" | "exam" | "results">("setup");

  // Setup state
  const [selectedClass, setSelectedClass] = useState<"Class 9" | "Class 10">("Class 10");
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [selectedChapter, setSelectedChapter] = useState<string>("All Chapters");
  const [targetMarks, setTargetMarks] = useState<25 | 50 | 75>(25);
  const [customDuration, setCustomDuration] = useState<number>(30);
  const [studentName, setStudentName] = useState<string>("");

  // Exam state
  const [currentTest, setCurrentTest] = useState<GeneratedMockTest | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string | number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1800);
  const [startTime, setStartTime] = useState<number>(0);
  const [isWarned, setIsWarned] = useState<boolean>(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState<boolean>(false);

  // Result state
  const [finalResult, setFinalResult] = useState<MockTestResult | null>(null);

  // Available chapters for selected subject & class
  const currentSubjectConfig = SUBJECTS_CONFIG.find((s) => s.name === selectedSubject);
  const availableChapters =
    currentSubjectConfig?.chapters[selectedClass] || [];

  // Update duration default when marks change
  const handleMarksChange = (marks: 25 | 50 | 75) => {
    setTargetMarks(marks);
    if (marks === 25) setCustomDuration(30);
    else if (marks === 50) setCustomDuration(60);
    else setCustomDuration(90);
  };

  // Start test
  const handleStartExam = () => {
    const test = generateMockTest(
      selectedClass,
      selectedSubject,
      selectedChapter,
      targetMarks,
      customDuration
    );
    setCurrentTest(test);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeLeftSeconds(test.durationMinutes * 60);
    setStartTime(Date.now());
    setIsWarned(false);
    setStage("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Timer countdown
  useEffect(() => {
    if (stage !== "exam") return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true);
          return 0;
        }
        if (prev <= 300 && !isWarned) {
          setIsWarned(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, isWarned]);

  // Submit test
  const handleSubmitExam = (auto = false) => {
    if (!currentTest) return;

    const totalQuestions = currentTest.questions.length;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let earnedMarks = 0;

    const topicStats: { [topic: string]: { correct: number; total: number } } = {};

    currentTest.questions.forEach((q) => {
      const topic = q.chapter || currentTest.subject;
      if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
      topicStats[topic].total += 1;

      const ans = userAnswers[q.id];
      if (ans === undefined || ans === "") {
        unansweredCount += 1;
      } else if (q.type === "mcq") {
        const isCorrect = Number(ans) === (q as MCQQuestion).correctIndex;
        if (isCorrect) {
          correctCount += 1;
          earnedMarks += q.marks;
          topicStats[topic].correct += 1;
        } else {
          incorrectCount += 1;
          const mcq = q as MCQQuestion;
          const userAnsStr = mcq.options[Number(ans)] || "Incorrect Option";
          const correctAnsStr = mcq.options[mcq.correctIndex] || "Correct Option";
          recordMistake(mcq.text, correctAnsStr, userAnsStr, topic);
        }
      } else {
        // Short / Long self-evaluated or marked as answered
        correctCount += 1;
        earnedMarks += q.marks;
        topicStats[topic].correct += 1;
      }
    });

    const elapsedSeconds = Math.max(
      1,
      Math.round((Date.now() - startTime) / 1000)
    );
    const accuracy =
      totalQuestions - unansweredCount > 0
        ? Math.round(
            (correctCount / (totalQuestions - unansweredCount)) * 100
          )
        : 0;
    const percentage = Math.round((earnedMarks / currentTest.totalMarks) * 100);

    const topicBreakdown = Object.entries(topicStats).map(([t, s]) => ({
      topic: t,
      correct: s.correct,
      total: s.total,
    }));

    const suggestions: string[] = [];
    if (accuracy < 60) {
      suggestions.push("Focus on memorizing standard board definitions and formulas first.");
      suggestions.push("Review solved textbook numericals before taking full papers.");
    } else if (accuracy < 80) {
      suggestions.push("Work on speed: try answering MCQs within 45 seconds each.");
      suggestions.push("Underline key terms with a marker to structure your long answers.");
    } else {
      suggestions.push("Outstanding preparation! Now practice paper presentation & time allocation.");
    }

    const result: MockTestResult = {
      id: `res-${Date.now()}`,
      studentName: studentName.trim() || "Student",
      className: currentTest.className,
      subject: currentTest.subject,
      chapter: currentTest.chapter,
      totalMarks: currentTest.totalMarks,
      score: earnedMarks,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      accuracy,
      timeUsedSeconds: elapsedSeconds,
      averageSecondsPerQuestion: Math.round(elapsedSeconds / totalQuestions),
      date: new Date().toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      topicBreakdown,
      improvementSuggestions: suggestions,
    };

    recordMockTestResult(result);
    setFinalResult(result);
    setStage("results");
    setConfirmSubmitModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper formatting time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // -------------------------------------------------------------
  // STAGE 1: SETUP SCREEN
  // -------------------------------------------------------------
  if (stage === "setup") {
    return (
      <div className="mx-auto max-w-site px-4 sm:px-6 py-12 md:py-16">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-heading font-black text-accent uppercase tracking-wider">
            <Award size={13} /> Punjab Board & FBISE Mock Engine
          </span>
          <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
            Smart Mock Test Engine
          </h1>
          <p className="mt-3 text-muted leading-relaxed text-sm sm:text-base">
            Realistic, timed practice designed to match official Punjab Board (BISE Multan,
            Lahore, Rawalpindi, Faisalabad) and FBISE formats. Complete tests to build exam stamina.
          </p>
        </div>

        {/* Setup Card */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 sm:p-8 shadow-soft">
            <h2 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-black text-xs font-black">
                1
              </span>
              Configure Your Paper
            </h2>

            <div className="space-y-6">
              {/* Optional Student Name */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-muted mb-2">
                  Student Name (Optional, for report sheet)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name or roll number"
                    className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Class Selection */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-muted mb-2">
                  Select Class
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Class 9", "Class 10"] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        setSelectedClass(cls);
                        setSelectedChapter("All Chapters");
                      }}
                      className={`rounded-xl border p-3 font-heading text-sm font-bold transition-all text-center ${
                        selectedClass === cls
                          ? "border-accent bg-accent/15 text-accent shadow-brutalist-yellow"
                          : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/25"
                      }`}
                    >
                      {cls} (Matric)
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-muted mb-2">
                  Select Subject
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUBJECTS_CONFIG.map((subj) => (
                    <button
                      key={subj.name}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(subj.name);
                        setSelectedChapter("All Chapters");
                      }}
                      className={`rounded-xl border p-2.5 text-xs font-heading font-bold transition-all text-center ${
                        selectedSubject === subj.name
                          ? "border-accent bg-accent/15 text-accent shadow-sm"
                          : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {subj.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter Selection */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-muted mb-2">
                  Chapter Scope
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#16161a] p-3 text-sm text-white focus:border-accent focus:outline-none"
                >
                  <option value="All Chapters">Full Subject Syllabus (All Chapters)</option>
                  {availableChapters.map((chap) => (
                    <option key={chap} value={chap}>
                      {chap}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marks Scheme */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-muted mb-2">
                  Paper Marks & Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { marks: 25 as const, duration: 30, desc: "Quick Drill" },
                    { marks: 50 as const, duration: 60, desc: "Mid-Term" },
                    { marks: 75 as const, duration: 90, desc: "Full Board" },
                  ].map((preset) => (
                    <button
                      key={preset.marks}
                      type="button"
                      onClick={() => handleMarksChange(preset.marks)}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        targetMarks === preset.marks
                          ? "border-accent bg-accent/15 text-accent shadow-sm"
                          : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20"
                      }`}
                    >
                      <div className="font-heading font-black text-lg">{preset.marks} Marks</div>
                      <div className="text-[11px] text-muted font-mono">{preset.duration} mins &middot; {preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Duration Input */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 text-xs">
                <span className="text-muted font-heading font-bold">Custom Timer (Minutes):</span>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Math.max(5, parseInt(e.target.value) || 30))}
                  className="w-20 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-center font-mono font-bold text-white focus:border-accent focus:outline-none"
                />
              </div>

              {/* Start CTA */}
              <button
                type="button"
                onClick={handleStartExam}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-heading text-sm font-black text-black transition-transform hover:scale-[1.01] active:scale-95 shadow-glow"
              >
                <span>Start Mock Test</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Sidebar Guidelines */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 text-sm">
              <h3 className="font-heading text-base font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="text-accent" size={18} />
                Honest Exam Rules
              </h3>
              <ul className="space-y-2.5 text-xs text-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-accent">&bull;</span>
                  <span>
                    <strong>Timer Auto-Submit:</strong> When the countdown reaches zero, your paper
                    will submit automatically.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">&bull;</span>
                  <span>
                    <strong>Subjective Rubrics:</strong> Review the step-by-step model keys for short
                    and long questions to verify board marking points.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">&bull;</span>
                  <span>
                    <strong>XP & Gamification:</strong> Submitting a completed test awards +50 XP and
                    counts towards your daily study streak.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-accent/20 bg-accent/[0.04] p-5 text-xs text-muted leading-relaxed">
              <p className="font-heading font-black text-accent uppercase tracking-wider mb-1">
                Notice:
              </p>
              These tests assess your syllabus preparation and paper speed. Scores reflect Mock Test
              Performance and are not an official board affiliation or prediction.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 2: ACTIVE EXAM SCREEN
  // -------------------------------------------------------------
  if (stage === "exam" && currentTest) {
    const q = currentTest.questions[currentIndex];
    const totalQ = currentTest.questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const isCurrentReviewed = Boolean(markedForReview[q.id]);

    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24">
        {/* Top Floating Exam Header Bar */}
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0E0E11]/95 backdrop-blur-md px-4 sm:px-6 py-3">
          <div className="mx-auto flex max-w-site items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-mono font-bold text-accent">
                {currentTest.className} &middot; {currentTest.subject}
              </span>
              <span className="hidden sm:inline text-xs text-muted">
                Q {currentIndex + 1} of {totalQ}
              </span>
            </div>

            {/* Timer Banner */}
            <div
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-mono font-bold transition-colors ${
                timeLeftSeconds <= 300
                  ? "border-red-500 bg-red-500/20 text-red-400 animate-pulse"
                  : "border-white/15 bg-white/5 text-white"
              }`}
            >
              <Clock size={14} className={timeLeftSeconds <= 300 ? "text-red-400" : "text-accent"} />
              <span>{formatTime(timeLeftSeconds)} left</span>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={() => setConfirmSubmitModal(true)}
              className="rounded-lg bg-accent px-4 py-1.5 font-heading text-xs font-black text-black hover:bg-accent/90 transition-colors shadow-glow"
            >
              Finish &amp; Submit
            </button>
          </div>

          {/* Progress bar */}
          <div className="mx-auto mt-2 h-1 max-w-site w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Question Workspace */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8">
          {/* Question Card */}
          <div className="rounded-2xl border border-white/15 bg-[#121215] p-6 sm:p-8 shadow-2xl">
            {/* Question Meta */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded bg-white/10 px-2 py-0.5 font-mono font-bold text-white">
                  Question {currentIndex + 1}
                </span>
                <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[11px] font-bold text-accent uppercase">
                  {q.type.toUpperCase()} &middot; {q.marks} Mark{q.marks > 1 ? "s" : ""}
                </span>
              </div>

              {/* Mark for review button */}
              <button
                type="button"
                onClick={() =>
                  setMarkedForReview((prev) => ({
                    ...prev,
                    [q.id]: !prev[q.id],
                  }))
                }
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-heading font-bold transition-colors ${
                  isCurrentReviewed
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-muted hover:text-white"
                }`}
              >
                <Bookmark size={13} />
                <span>{isCurrentReviewed ? "Marked for Review" : "Mark for Review"}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="py-6">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white leading-relaxed whitespace-pre-line">
                {q.text}
              </h2>
            </div>

            {/* Answer Controls */}
            {q.type === "mcq" ? (
              <div className="space-y-3 pt-2">
                {(q as MCQQuestion).options.map((opt, optIdx) => {
                  const isSelected = userAnswers[q.id] === optIdx;
                  const optionLetters = ["A", "B", "C", "D"];
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() =>
                        setUserAnswers((prev) => ({
                          ...prev,
                          [q.id]: optIdx,
                        }))
                      }
                      className={`flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left text-sm font-medium transition-all ${
                        isSelected
                          ? "border-accent bg-accent/15 text-white shadow-sm"
                          : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                          isSelected
                            ? "bg-accent text-black"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {optionLetters[optIdx]}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Short & Long Questions Response Workspace */
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-muted">
                  Your Answer Notes / Points:
                </label>
                <textarea
                  value={(userAnswers[q.id] as string) || ""}
                  onChange={(e) =>
                    setUserAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  placeholder="Type your working, key definitions, or formulas here..."
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
                />

                {/* Marking scheme guide preview */}
                <div className="rounded-xl border border-accent/25 bg-[#0e0e11] p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-heading font-black text-accent uppercase tracking-wider mb-2">
                    <FileText size={14} /> Punjab Board Marking Scheme Key:
                  </div>
                  <ul className="space-y-1 text-white/75 font-sans leading-relaxed">
                    {q.type === "short" &&
                      (q.keyPoints || []).map((kp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-accent">&bull;</span>
                          <span>{kp}</span>
                        </li>
                      ))}
                    {q.type === "long" &&
                      (q.keyPoints || []).map((kp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-accent">&bull;</span>
                          <span>{kp}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Bottom Question Navigation Controls */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-heading font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <span className="text-xs font-mono text-muted">
                Answered {answeredCount} of {totalQ}
              </span>

              {currentIndex < totalQ - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                  className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 font-heading text-xs font-black text-black hover:bg-accent/90 transition-transform active:scale-95 shadow-glow"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmSubmitModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-400 px-5 py-2 font-heading text-xs font-black text-black hover:bg-emerald-300 transition-transform active:scale-95 shadow-glow"
                >
                  <CheckCircle size={15} />
                  <span>Review &amp; Submit</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#121215] p-5">
            <div className="mb-3 flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-muted">
              <span>Question Palette</span>
              <div className="flex items-center gap-3 text-[10px] font-mono normal-case">
                <span className="flex items-center gap-1 text-white">
                  <span className="h-2 w-2 rounded-full bg-accent" /> Answered
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Review
                </span>
                <span className="flex items-center gap-1 text-muted">
                  <span className="h-2 w-2 rounded-full bg-white/20" /> Pending
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentTest.questions.map((item, idx) => {
                const isAnswered = userAnswers[item.id] !== undefined && userAnswers[item.id] !== "";
                const isReview = Boolean(markedForReview[item.id]);
                const isCurrent = idx === currentIndex;

                let badgeClass = "bg-white/5 text-muted border-white/10";
                if (isCurrent) {
                  badgeClass = "ring-2 ring-accent border-accent text-white";
                } else if (isReview) {
                  badgeClass = "bg-amber-400/20 text-amber-300 border-amber-400/40";
                } else if (isAnswered) {
                  badgeClass = "bg-accent/20 text-accent border-accent/40 font-bold";
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 w-9 rounded-lg border font-mono text-xs transition-transform hover:scale-105 ${badgeClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#141418] p-6 shadow-2xl">
              <h3 className="font-heading text-lg font-bold text-white">Submit Mock Test?</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                You have answered <strong>{answeredCount}</strong> out of{" "}
                <strong>{totalQ}</strong> questions.
                {totalQ - answeredCount > 0 && (
                  <span className="block mt-1 text-amber-400">
                    Warning: You still have {totalQ - answeredCount} unanswered questions!
                  </span>
                )}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmSubmitModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-heading font-bold text-white hover:bg-white/5"
                >
                  Continue Test
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitExam(false)}
                  className="rounded-xl bg-accent px-5 py-2 font-heading text-xs font-black text-black hover:bg-accent/90 shadow-glow"
                >
                  Confirm &amp; Grade Paper
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 3: RESULTS SCREEN & PRINTABLE REPORT
  // -------------------------------------------------------------
  if (stage === "results" && finalResult) {
    return (
      <div className="mx-auto max-w-site px-4 sm:px-6 py-12 md:py-16">
        {/* Printable Card Area */}
        <div
          id="printable-report"
          className="rounded-2xl border border-white/15 bg-[#121215] p-6 sm:p-10 shadow-2xl"
        >
          {/* Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="font-heading text-xs font-black text-accent uppercase tracking-wider">
                Matric Mastery Performance Report
              </span>
              <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-black text-white">
                Mock Test Performance
              </h1>
              <p className="mt-1 text-xs text-muted font-mono">
                Candidate: {finalResult.studentName} &middot; {finalResult.className} &middot;{" "}
                {finalResult.subject} &middot; {finalResult.date}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-heading font-bold text-white hover:bg-white/10 transition-colors"
                title="Print or Save PDF"
              >
                <Printer size={15} />
                <span>Print / Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setStage("setup")}
                className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 font-heading text-xs font-black text-black hover:bg-accent/90 transition-transform active:scale-95 shadow-glow"
              >
                <RotateCcw size={15} />
                <span>Take Another Test</span>
              </button>
            </div>
          </div>

          {/* Key Stat Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted">
                Total Score
              </div>
              <div className="mt-2 font-heading text-2xl sm:text-3xl font-black text-accent">
                {finalResult.score} / {finalResult.totalMarks}
              </div>
              <div className="text-[11px] text-white/60 font-mono mt-0.5">
                {finalResult.percentage}% Score
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted">
                Accuracy
              </div>
              <div className="mt-2 font-heading text-2xl sm:text-3xl font-black text-emerald-400">
                {finalResult.accuracy}%
              </div>
              <div className="text-[11px] text-white/60 font-mono mt-0.5">
                On attempted questions
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted">
                Time Taken
              </div>
              <div className="mt-2 font-heading text-2xl sm:text-3xl font-black text-white">
                {formatTime(finalResult.timeUsedSeconds)}
              </div>
              <div className="text-[11px] text-white/60 font-mono mt-0.5">
                Avg {finalResult.averageSecondsPerQuestion}s / question
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted">
                XP Earned
              </div>
              <div className="mt-2 font-heading text-2xl sm:text-3xl font-black text-accent">
                +50 XP
              </div>
              <div className="text-[11px] text-white/60 font-mono mt-0.5">
                Saved to student streak
              </div>
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Topic Breakdown */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted mb-4">
                Topic-Wise Performance Breakdown
              </h3>
              <div className="space-y-3">
                {finalResult.topicBreakdown.map((item, idx) => {
                  const pct = Math.round((item.correct / Math.max(1, item.total)) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white font-medium">{item.topic}</span>
                        <span className="font-mono text-accent">
                          {item.correct}/{item.total} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted mb-4">
                Targeted Improvement Suggestions
              </h3>
              <ul className="space-y-2.5 text-xs text-white/80">
                {finalResult.improvementSuggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent font-bold">&bull;</span>
                    <span className="leading-relaxed">{sug}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-3 text-[11px] text-muted leading-relaxed">
                <strong>Notice:</strong> These metrics reflect your mock session. For official board
                exam success, practice paper presentation and time management under exam conditions.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
