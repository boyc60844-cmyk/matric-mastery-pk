"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Award,
  Zap,
  Target,
  Clock,
  BookOpen,
  CheckCircle,
  FileCheck,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  loadProgress,
  getAvailableBadges,
  StudentProgress,
  Badge,
} from "@/lib/progress";
import { auth } from "@/src/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import AuthButton from "@/components/AuthButton";
import { Cloud, Heart, Shield } from "lucide-react";

export default function DashboardPage() {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cloudStats, setCloudStats] = useState<{ hearts: number; league: string } | null>(null);

  const refreshData = () => {
    const data = loadProgress();
    setProgress(data);
    setBadges(getAvailableBadges());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener("mm_progress_updated", refreshData);

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setCloudStats({
          hearts: 5,
          league: "Bronze",
        });
      } else {
        setCloudStats(null);
      }
    });

    return () => {
      window.removeEventListener("mm_progress_updated", refreshData);
      unsub();
    };
  }, []);

  if (!progress) return null;

  // Level calculation: Every 100 XP = 1 Level
  const currentLevel = Math.floor(progress.xp / 100) + 1;
  const currentLevelProgress = progress.xp % 100;

  // Test stats calculation
  const totalTests = progress.mockTestResults.length;
  const avgAccuracy =
    totalTests > 0
      ? Math.round(
          progress.mockTestResults.reduce((acc, t) => acc + (t.accuracy || 0), 0) /
            totalTests
        )
      : 0;

  // Weak topics calculation from actual student test performance
  const weakTopicCounts: { [topic: string]: { correct: number; total: number } } = {};
  progress.mockTestResults.forEach((test) => {
    test.topicBreakdown?.forEach((t) => {
      if (!weakTopicCounts[t.topic]) {
        weakTopicCounts[t.topic] = { correct: 0, total: 0 };
      }
      weakTopicCounts[t.topic].correct += t.correct;
      weakTopicCounts[t.topic].total += t.total;
    });
  });

  const weakTopics = Object.entries(weakTopicCounts)
    .map(([topic, stat]) => ({
      topic,
      accuracy: Math.round((stat.correct / Math.max(1, stat.total)) * 100),
      total: stat.total,
    }))
    .filter((t) => t.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  const completedGoalsCount = progress.dailyGoals.filter((g) => g.completed).length;

  return (
    <div className="mx-auto max-w-site px-4 sm:px-6 py-12 md:py-16">
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-heading font-black text-accent uppercase tracking-wider">
            <Flame size={13} className="text-amber-400" /> Student Analytics
          </span>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
            Study Analytics &amp; Progress
          </h1>
          <p className="mt-2 text-sm text-muted">
            All your local exam prep activity, syllabus retention, and mock test scores in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AuthButton />
          <Link
            href="/mock-tests"
            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-heading font-black text-black hover:bg-accent/90 transition-transform active:scale-95 shadow-glow"
          >
            <Sparkles size={14} />
            <span>Take New Mock Test</span>
          </Link>
        </div>
      </div>

      {/* Cloud Sync & Login Status Banner */}
      <div className="mt-6">
        {user ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="h-10 w-10 rounded-xl object-cover border border-emerald-400/40"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-black font-black">
                  <Cloud size={20} />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-bold text-white">
                    Cloud Synced with Firebase
                  </h3>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                    Active
                  </span>
                </div>
                <p className="text-xs text-muted">
                  Logged in as <span className="text-white font-medium">{user.displayName || user.email}</span> &bull; XP and mistakes are automatically synced to the cloud.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1 rounded-lg bg-black/40 px-2.5 py-1 text-red-400 border border-white/10">
                <Heart size={13} className="fill-red-400" />
                <span>{cloudStats?.hearts ?? 5}/5 Hearts</span>
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-black/40 px-2.5 py-1 text-accent border border-white/10">
                <Shield size={13} />
                <span>{cloudStats?.league ?? "Bronze"}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-black font-black shadow-glow">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-white">
                  You are viewing Guest / Local Mode
                </h3>
                <p className="text-xs text-muted">
                  Your data is currently only on this browser. Sign in with Google to save your XP, streaks, and mistake reviews to the cloud!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="rounded-xl border border-accent/60 bg-accent/15 px-3.5 py-2 text-xs font-heading font-black text-accent hover:bg-accent hover:text-black transition-colors"
              >
                Go to Login Page &rarr;
              </Link>
              <AuthButton />
            </div>
          </div>
        )}
      </div>

      {/* Top Gamification Bar (Level, Streak, XP, Daily Goal) */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-5 shadow-soft">
          <div className="flex items-center justify-between text-muted text-xs font-heading font-bold uppercase tracking-wider">
            <span>Study Streak</span>
            <Flame className="text-amber-400" size={16} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black text-white">{progress.streak}</span>
            <span className="text-xs text-muted font-mono">Day{progress.streak > 1 ? "s" : ""}</span>
          </div>
          <div className="mt-2 text-[11px] text-muted font-mono">
            Active streak by date
          </div>
        </div>

        {/* XP & Level */}
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-5 shadow-soft">
          <div className="flex items-center justify-between text-muted text-xs font-heading font-bold uppercase tracking-wider">
            <span>Level {currentLevel}</span>
            <Zap className="text-accent" size={16} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black text-accent">{progress.xp}</span>
            <span className="text-xs text-muted font-mono">Total XP</span>
          </div>
          {/* Level Progress */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
          <div className="mt-1 text-[10px] text-muted font-mono">
            {100 - currentLevelProgress} XP to Level {currentLevel + 1}
          </div>
        </div>

        {/* Accuracy */}
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-5 shadow-soft">
          <div className="flex items-center justify-between text-muted text-xs font-heading font-bold uppercase tracking-wider">
            <span>Avg Test Accuracy</span>
            <TrendingUp className="text-emerald-400" size={16} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black text-emerald-400">
              {totalTests > 0 ? `${avgAccuracy}%` : "--"}
            </span>
            <span className="text-xs text-muted font-mono">From tests</span>
          </div>
          <div className="mt-2 text-[11px] text-muted font-mono">
            {totalTests} test{totalTests === 1 ? "" : "s"} submitted
          </div>
        </div>

        {/* Daily Goal */}
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-5 shadow-soft">
          <div className="flex items-center justify-between text-muted text-xs font-heading font-bold uppercase tracking-wider">
            <span>Today's Goal</span>
            <Target className="text-accent" size={16} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black text-white">
              {completedGoalsCount} / {progress.dailyGoals.length}
            </span>
            <span className="text-xs text-muted font-mono">Done</span>
          </div>
          <div className="mt-2 text-[11px] text-muted font-mono">
            Resets daily for consistent study
          </div>
        </div>
      </div>

      {/* Main Grid: Daily Goals + Weak Topics */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1.8fr]">
        {/* Left Column: Daily Goal Checklist */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 shadow-soft">
            <h3 className="font-heading text-base font-bold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target size={18} className="text-accent" /> Daily Study Checklist
              </span>
              <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                +{progress.dailyGoals.reduce((sum, g) => sum + g.xpReward, 0)} XP Total
              </span>
            </h3>

            <div className="space-y-3">
              {progress.dailyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-colors ${
                    goal.completed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-white/[0.02] text-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                        goal.completed
                          ? "border-emerald-400 bg-emerald-400 text-black"
                          : "border-white/20 text-transparent"
                      }`}
                    >
                      &check;
                    </span>
                    <span className="text-xs sm:text-sm font-medium">{goal.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-accent">+{goal.xpReward} XP</span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11px] text-muted font-mono">
              Earn XP automatically by reading playbooks, asking doubts, or testing.
            </p>
          </div>

          {/* Badges Earned */}
          <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 shadow-soft">
            <h3 className="font-heading text-base font-bold text-white mb-4 flex items-center gap-2">
              <Award size={18} className="text-accent" /> Achievement Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((badge) => {
                const isUnlocked = progress.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`rounded-xl border p-3 transition-colors ${
                      isUnlocked
                        ? "border-accent/40 bg-accent/[0.08]"
                        : "border-white/5 bg-white/[0.01] opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="font-heading text-xs font-bold text-white">
                          {badge.title}
                        </div>
                        <div className="text-[10px] text-muted leading-tight mt-0.5">
                          {badge.description}
                        </div>
                      </div>
                    </div>
                    {isUnlocked && (
                      <span className="mt-2 inline-block rounded bg-accent/20 px-1.5 py-0.2 text-[9px] font-mono text-accent">
                        Unlocked &bull; Verified
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Weak Topics & Recent Mock Tests */}
        <div className="space-y-6">
          {/* Weak Topics Analysis */}
          <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 shadow-soft">
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp size={18} className="text-amber-400" /> Focus Areas &amp; Weak Topics
            </h3>
            <p className="text-xs text-muted mb-4">
              Calculated automatically from incorrect questions in your mock test sessions.
            </p>

            {weakTopics.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
                <FileCheck size={28} className="mx-auto text-accent opacity-60 mb-2" />
                <p className="text-xs font-heading font-bold text-white">
                  No critical weak topics detected!
                </p>
                <p className="text-[11px] text-muted mt-1">
                  Take a 50 or 75 marks mock test to identify high-yield chapters that need review.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {weakTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs"
                  >
                    <span className="font-medium text-white">{item.topic}</span>
                    <span className="rounded bg-red-500/20 px-2 py-0.5 font-mono text-red-300 font-bold">
                      {item.accuracy}% Accuracy ({item.total} Qs)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stored Mock Test History */}
          <div className="rounded-2xl border border-white/10 bg-[#121215] p-6 shadow-soft">
            <h3 className="font-heading text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>Mock Test History</span>
              <span className="text-xs font-mono text-muted">{totalTests} recorded</span>
            </h3>

            {totalTests === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
                <Clock size={32} className="mx-auto text-muted mb-3 opacity-60" />
                <h4 className="font-heading text-sm font-bold text-white">
                  Your dashboard will come alive after your first mock test.
                </h4>
                <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                  Attempt a timed test to track score percentages, time per question, and accuracy
                  across subjects.
                </p>
                <div className="mt-5">
                  <Link
                    href="/mock-tests"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 font-heading text-xs font-black text-black hover:bg-accent/90 transition-transform active:scale-95 shadow-glow"
                  >
                    <span>Take Your First Test</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {progress.mockTestResults.slice(0, 5).map((test) => (
                  <div
                    key={test.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20"
                  >
                    <div>
                      <div className="font-heading text-sm font-bold text-white">
                        {test.subject} &middot; {test.className}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-muted">
                        <span>{test.chapter}</span>
                        <span>&middot;</span>
                        <span>{test.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-heading font-black text-sm text-accent">
                          {test.score} / {test.totalMarks} ({test.percentage}%)
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400">
                          {test.accuracy}% Accuracy
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
