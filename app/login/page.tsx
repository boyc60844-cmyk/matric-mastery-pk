"use client";

import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/src/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { useRouter } from "@/src/context/RouterContext";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  ArrowRight,
  LogOut,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
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
      } else {
        localStorage.removeItem("user");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setSigningIn(true);
      setErrorMsg("");

      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;

      if (loggedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: loggedUser.uid,
            displayName: loggedUser.displayName,
            email: loggedUser.email,
            photoURL: loggedUser.photoURL,
          })
        );
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.warn("Google sign-in exception:", err?.code || err?.message);

      if (err?.code === "auth/popup-closed-by-user") {
        setErrorMsg("Sign-in popup was closed before completion. Please try again.");
      } else if (err?.code === "auth/unauthorized-domain") {
        const currentHost = typeof window !== "undefined" ? window.location.hostname : "";
        setErrorMsg(
          `Domain (${currentHost}) is not authorized in Firebase. Add it to Firebase Console -> Authentication -> Settings -> Authorized domains.`
        );
      } else if (err?.code === "auth/popup-blocked") {
        setErrorMsg("Sign-in popup was blocked by the browser. Please allow popups for this site and try again.");
      } else {
        setErrorMsg(err?.message || "Failed to sign in with Google. Please try again.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.warn("Sign out exception:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-16 sm:py-24">
      {/* If already signed in */}
      {user ? (
        <div className="rounded-3xl border border-accent/40 bg-[#121216] p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "Student"}
              className="mx-auto h-20 w-20 rounded-2xl border-2 border-accent object-cover shadow-glow"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-3xl font-heading font-black text-black shadow-glow">
              {(user.displayName || "S").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="mt-4">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
              ● {t("auth.active", "Cloud Synced & Active")}
            </span>
          </div>

          <h1 className="mt-3 font-heading text-2xl font-black text-white">
            {t("auth.welcome", "Welcome back")}, {user.displayName || "Student"}!
          </h1>
          <p className="mt-1 font-mono text-xs text-muted">{user.email}</p>

          <p className="mt-4 text-xs text-muted leading-relaxed">
            {t("auth.synced", "Your progress, past papers history, and leaderboard score are secured.")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-heading text-xs font-black text-black hover:bg-accent/90 transition-transform active:scale-95 shadow-glow"
            >
              <span>{t("auth.dashboardBtn", "Go to Student Dashboard")}</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/leaderboard"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-heading text-xs font-bold text-white hover:bg-white/10 transition-colors"
            >
              <span>{t("auth.leaderboardBtn", "Weekly Leaderboard")}</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
          >
            <LogOut size={13} />
            <span>{t("auth.logout", "Sign out from this device")}</span>
          </button>
        </div>
      ) : (
        /* Sign-in Form Card */
        <div className="rounded-3xl border border-white/15 bg-[#121216] p-7 sm:p-10 shadow-2xl">
          <div className="text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-heading font-black text-accent uppercase tracking-wider mb-4">
              <Sparkles size={13} /> {t("auth.badge", "MATRIC MASTERY CLOUD")}
            </span>

            {/* Headline */}
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              {t("auth.headline", "Student Cloud Login")}
            </h1>

            {/* Subheadline */}
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              {t(
                "auth.subheadline",
                "Login with Google to save your progress, secure your preparation, and compete on the Punjab Board leaderboard."
              )}
            </p>
          </div>

          {/* Features */}
          <div className="my-8 space-y-3.5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
              <span className="text-base select-none shrink-0">🔥</span>
              <span className="leading-snug">
                {t(
                  "auth.f1",
                  "Keep your study streak safe - switch between mobile and laptop anytime"
                )}
              </span>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
              <span className="text-base select-none shrink-0">❤️</span>
              <span className="leading-snug">
                {t(
                  "auth.f2",
                  "Smart Revision for wrong answers - we remind you after 24 hours"
                )}
              </span>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
              <span className="text-base select-none shrink-0">🏆</span>
              <span className="leading-snug">
                {t(
                  "auth.f3",
                  "Live Leaderboard - Compete with Lahore, Multan & FBISE toppers"
                )}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-300 leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Button: Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={signingIn}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-accent bg-accent py-3.5 font-heading text-sm font-black text-black transition-transform hover:scale-[1.01] active:scale-95 shadow-glow disabled:opacity-50 cursor-pointer"
          >
            {signingIn ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{t("auth.connecting", "Connecting to Google...")}</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
                <span>{t("auth.button", "Continue with Google")}</span>
              </>
            )}
          </button>

          {/* Footer */}
          <p className="mt-4 text-center font-mono text-[11px] text-muted">
            {t("auth.footer", "100% Free for Matric Students • No password needed")}
          </p>
        </div>
      )}
    </div>
  );
}
