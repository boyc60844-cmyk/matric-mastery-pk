"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/src/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Trophy, Medal, Flame, Zap, Shield, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import AuthButton from "./AuthButton";

interface LeaderboardUser {
  id: string;
  displayName: string;
  xp: number;
  photoURL?: string;
  board?: string;
}

const DEFAULT_BOARD_TOPPERS: LeaderboardUser[] = [
  { id: "seed-1", displayName: "Muhammad Hamza", xp: 2450, board: "BISE Lahore" },
  { id: "seed-2", displayName: "Ayesha Noor", xp: 2280, board: "BISE Multan" },
  { id: "seed-3", displayName: "Zubair Ahmed", xp: 2110, board: "FBISE Islamabad" },
  { id: "seed-4", displayName: "Fatima Tariq", xp: 1950, board: "BISE Faisalabad" },
  { id: "seed-5", displayName: "Bilal Hassan", xp: 1820, board: "BISE Rawalpindi" },
  { id: "seed-6", displayName: "Maryam Saeed", xp: 1740, board: "BISE Gujranwala" },
  { id: "seed-7", displayName: "Usman Ghani", xp: 1620, board: "BISE Sargodha" },
  { id: "seed-8", displayName: "Zainab Bibi", xp: 1530, board: "BISE Sahiwal" },
];

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setRefreshing(true);
      const combined = [...DEFAULT_BOARD_TOPPERS];
      if (currentUser) {
        const studentXP = parseInt(
          localStorage.getItem("totalXP") || localStorage.getItem("xp") || "120",
          10
        );
        combined.push({
          id: currentUser.uid,
          displayName: currentUser.displayName || "You",
          xp: studentXP,
          photoURL: currentUser.photoURL || "",
          board: "Your Board",
        });
      }
      combined.sort((a, b) => b.xp - a.xp);
      setLeaders(combined.slice(0, 50));
    } catch (err) {
      console.warn("Could not calculate leaderboard:", err);
      setLeaders(DEFAULT_BOARD_TOPPERS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-black font-black shadow-[0_0_15px_rgba(251,191,36,0.5)]">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-300 text-black font-black">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-700 text-white font-black">
          🥉
        </div>
      );
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 font-mono text-xs font-bold text-muted">
        #{rank}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-heading font-black text-accent uppercase tracking-wider mb-3">
            <Trophy size={13} /> Weekly Board League
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-black text-white">
            Matric Toppers Leaderboard
          </h1>
          <p className="mt-2 text-sm text-muted max-w-lg">
            Compete with students across all 9 Punjab Boards &amp; Federal Board. Earn XP by
            solving doubts, acing mock tests, and reading derivation strategies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchLeaderboard}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-heading font-bold text-muted hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh Leaderboard"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin text-accent" : ""} />
            <span>Refresh</span>
          </button>
          <AuthButton />
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {!loading && leaders.length >= 3 && (
        <div className="my-8 grid gap-4 sm:grid-cols-3">
          {/* #2 Rank */}
          <div className="order-2 sm:order-1 rounded-2xl border border-white/10 bg-[#121215] p-5 text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-2xl">🥈</div>
            <div>
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-heading font-black text-white border border-white/15">
                {leaders[1].displayName.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-heading text-sm font-extrabold text-white truncate">
                {leaders[1].displayName}
              </h4>
              <p className="text-[11px] font-mono text-muted">{leaders[1].board || "Punjab Board"}</p>
            </div>
            <div className="mt-4 rounded-xl bg-white/5 py-1.5 font-mono text-xs font-black text-accent">
              ⚡ {leaders[1].xp.toLocaleString()} XP
            </div>
          </div>

          {/* #1 Rank (Highlighted) */}
          <div className="order-1 sm:order-2 rounded-2xl border-2 border-accent bg-[#16161c] p-6 text-center relative overflow-hidden shadow-[0_0_30px_rgba(255,214,10,0.15)] flex flex-col justify-between -translate-y-2">
            <div className="absolute top-2 right-2 text-3xl">🥇</div>
            <div>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] font-heading font-black text-black uppercase tracking-wider">
                Rank #1 Champion
              </span>
              <div className="mx-auto my-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-2xl font-heading font-black text-black shadow-glow">
                {leaders[0].displayName.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-heading text-base font-black text-white truncate">
                {leaders[0].displayName}
              </h3>
              <p className="text-xs font-mono text-accent">{leaders[0].board || "BISE Lahore"}</p>
            </div>
            <div className="mt-4 rounded-xl bg-accent/20 py-2 font-mono text-sm font-black text-accent border border-accent/40">
              ⚡ {leaders[0].xp.toLocaleString()} XP
            </div>
          </div>

          {/* #3 Rank */}
          <div className="order-3 rounded-2xl border border-white/10 bg-[#121215] p-5 text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-2xl">🥉</div>
            <div>
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-900/40 text-xl font-heading font-black text-amber-200 border border-amber-700/30">
                {leaders[2].displayName.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-heading text-sm font-extrabold text-white truncate">
                {leaders[2].displayName}
              </h4>
              <p className="text-[11px] font-mono text-muted">{leaders[2].board || "Punjab Board"}</p>
            </div>
            <div className="mt-4 rounded-xl bg-white/5 py-1.5 font-mono text-xs font-black text-accent">
              ⚡ {leaders[2].xp.toLocaleString()} XP
            </div>
          </div>
        </div>
      )}

      {/* Ranks 4 to 50 Table */}
      <div className="rounded-2xl border border-white/10 bg-[#121215] overflow-hidden shadow-2xl">
        <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3 text-xs font-heading font-black text-muted flex items-center justify-between">
          <span>RANK &amp; STUDENT</span>
          <span>WEEKLY XP</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted">
            <Loader2 size={24} className="mx-auto animate-spin text-accent mb-2" />
            <p className="text-xs font-mono">Loading Board Rankings...</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {leaders.map((student, idx) => {
              const rank = idx + 1;
              const isMe = currentUser && currentUser.uid === student.id;

              return (
                <div
                  key={student.id + idx}
                  className={`flex items-center justify-between px-5 py-3.5 transition-colors ${
                    isMe
                      ? "bg-accent/10 border-l-4 border-accent"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getRankBadge(rank)}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-bold text-white truncate">
                          {student.displayName}
                        </span>
                        {isMe && (
                          <span className="rounded bg-accent px-1.5 py-0.2 text-[9px] font-heading font-black text-black">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-muted truncate">
                        {student.board || "Punjab Board Exam Candidate"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black text-accent shrink-0">
                    <Zap size={13} className="fill-accent text-accent" />
                    <span>{student.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Motivational Call to Action */}
      <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/[0.04] p-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
        <div>
          <h4 className="font-heading text-base font-black text-white">
            Want to climb to the top of the board?
          </h4>
          <p className="mt-1 text-xs text-muted">
            Take a 25-minute mock test or solve a tough derivation in the AI Doubt Solver to gain +15 to +50 XP.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2 justify-center">
          <Link
            href="/mock-tests"
            className="rounded-xl bg-accent px-4 py-2 font-heading text-xs font-black text-black hover:bg-accent/90 transition-colors shadow-glow"
          >
            Start Mock Test &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
