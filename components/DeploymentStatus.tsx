import { useState, useEffect } from "react";
import { GitBranch, CheckCircle2, Radio, ExternalLink, Zap } from "lucide-react";

export default function DeploymentStatus() {
  const [hostname, setHostname] = useState<string>("");
  const [isVercel, setIsVercel] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      setHostname(host);
      setIsVercel(host.includes("vercel.app"));
    }
  }, []);

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-mono backdrop-blur-sm transition-colors hover:border-white/20">
      {/* Live Pulse Dot */}
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </span>

      {/* GitHub Commit Status */}
      <span className="inline-flex items-center gap-1 text-white/90">
        <GitBranch className="h-3 w-3 text-accent" />
        <span className="font-semibold text-white">main</span>
        <span className="text-white/40">&middot;</span>
        <span className="text-emerald-400 font-medium">latest commit</span>
      </span>

      <span className="text-white/30 hidden sm:inline">|</span>

      {/* Vercel Status */}
      <span className="inline-flex items-center gap-1 text-white/70">
        <svg
          viewBox="0 0 76 65"
          className="h-2.5 w-2.5 fill-current text-white"
          aria-hidden="true"
        >
          <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
        </svg>
        <span>
          {mounted && isVercel ? "Vercel: Production Live" : "Vercel: Synced"}
        </span>
      </span>

      {/* Verified check */}
      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
    </div>
  );
}
