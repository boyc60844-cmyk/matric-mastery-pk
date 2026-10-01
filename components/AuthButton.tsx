"use client";

import React, { useEffect, useState, useRef } from "react";
import { auth, googleProvider } from "@/src/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { Zap, Heart, Flame, Trophy, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "@/src/context/RouterContext";

interface UserProfileData {
  displayName: string;
  email: string;
  xp: number;
  streak: number;
  hearts: number;
  league: string;
}

export default function AuthButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          })
        );

        const currentXP = parseInt(
          localStorage.getItem("totalXP") || localStorage.getItem("xp") || "120",
          10
        );
        const currentStreak = parseInt(
          localStorage.getItem("matric_streak") || localStorage.getItem("streak") || "1",
          10
        );

        setProfile({
          displayName: currentUser.displayName || "Student",
          email: currentUser.email || "",
          xp: currentXP,
          streak: currentStreak,
          hearts: 5,
          league: "Bronze",
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: res.user.uid,
            displayName: res.user.displayName,
            email: res.user.email,
            photoURL: res.user.photoURL,
          })
        );
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.warn("Login cancelled or failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      localStorage.removeItem("user");
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-muted">
        <Loader2 size={13} className="animate-spin text-accent" />
        <span className="hidden sm:inline">Connecting...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={handleLogin}
        className="flex h-9 items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3.5 text-xs font-heading font-black text-accent transition-all hover:bg-accent hover:text-black shadow-sm active:scale-95"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
        </svg>
        <span>Sign in with Google</span>
      </button>
    );
  }

  const xpValue = profile?.xp ?? 0;
  const streakValue = profile?.streak ?? 1;
  const heartsValue = profile?.hearts ?? 5;
  const leagueName = profile?.league ?? "Bronze";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex h-9 items-center gap-2 rounded-xl border border-white/15 bg-[#141417] p-1.5 pr-3 text-xs font-heading font-bold text-white transition-all hover:border-accent hover:bg-white/[0.05]"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="h-6 w-6 rounded-lg object-cover border border-accent/40"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-[11px] font-black text-black">
            {(user.displayName || "S").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <span className="max-w-[80px] truncate text-[11px] hidden sm:inline">
            {user.displayName?.split(" ")[0] || "Student"}
          </span>
          <span className="flex items-center gap-0.5 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-mono font-black text-accent">
            <Zap size={10} className="fill-accent text-accent" />
            {xpValue} XP
          </span>
        </div>
      </button>

      {/* Dropdown Menu with Logout Button */}
      {menuOpen && (
        <div className="absolute right-0 top-11 z-50 w-64 rounded-2xl border border-white/15 bg-[#141418] p-4 shadow-2xl shadow-black backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="border-b border-white/10 pb-3">
            <p className="text-xs font-heading font-extrabold text-white truncate">
              {user.displayName || "Student"}
            </p>
            <p className="text-[10px] text-muted truncate font-mono">{user.email}</p>
          </div>

          {/* Gamification Stats: Hearts, Streak, League */}
          <div className="my-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
              <div className="flex items-center justify-center text-red-400 mb-0.5">
                <Heart size={14} className="fill-red-400" />
              </div>
              <p className="text-[11px] font-mono font-black text-white">{heartsValue}/5</p>
              <p className="text-[9px] text-muted">Hearts</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
              <div className="flex items-center justify-center text-amber-400 mb-0.5">
                <Flame size={14} className="fill-amber-400" />
              </div>
              <p className="text-[11px] font-mono font-black text-white">{streakValue}d</p>
              <p className="text-[9px] text-muted">Streak</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
              <div className="flex items-center justify-center text-accent mb-0.5">
                <Trophy size={14} className="fill-accent" />
              </div>
              <p className="text-[11px] font-mono font-black text-white">{leagueName}</p>
              <p className="text-[9px] text-muted">League</p>
            </div>
          </div>

          {/* Navigation Links & Logout */}
          <div className="space-y-1 text-xs font-heading">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-white/90 hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <UserIcon size={14} className="text-accent" />
              <span>Student Dashboard</span>
            </Link>

            <Link
              href="/leaderboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-white/90 hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <Trophy size={14} className="text-accent" />
              <span>Weekly Leaderboard</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-left"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
