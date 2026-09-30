"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Play, Pause, Square, FastForward, AlertCircle } from "lucide-react";

interface VoicePlayerProps {
  title: string;
  textToRead: string;
}

export default function VoicePlayer({ title, textToRead }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean plain text
    const cleanText = textToRead.replace(/<[^>]*>?/gm, "").slice(0, 3000);
    const utterance = new SpeechSynthesisUtterance(`${title}. ${cleanText}`);
    utterance.rate = rate;

    // Pick best English voice if available
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleSpeedChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying && utteranceRef.current) {
      // Re-trigger with new speed
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-muted">
        <AlertCircle size={14} className="text-amber-400 shrink-0" />
        <span>Audio narration is not supported in this browser version.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#121215] p-3.5 sm:p-4 shadow-soft">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent font-black">
          <Volume2 size={16} />
        </div>
        <div>
          <span className="font-heading text-xs font-bold text-white block">
            Voice Learning Audio
          </span>
          <span className="text-[10px] text-muted font-mono">
            Listen to this strategy on the go
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <button
            type="button"
            onClick={handlePause}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-heading font-bold text-white hover:bg-white/20 transition-colors"
          >
            <Pause size={13} />
            <span>Pause</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 font-heading text-xs font-black text-black hover:bg-accent/90 transition-transform active:scale-95 shadow-glow"
          >
            <Play size={13} className="fill-black" />
            <span>{isPaused ? "Resume" : "Listen Now"}</span>
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            type="button"
            onClick={handleStop}
            className="rounded-lg bg-white/5 p-1.5 text-muted hover:text-white hover:bg-white/10 transition-colors"
            title="Stop playback"
          >
            <Square size={13} />
          </button>
        )}

        {/* Speed Selector */}
        <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-0.5 text-[11px] font-mono">
          {[0.75, 1, 1.25, 1.5].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => handleSpeedChange(speed)}
              className={`rounded px-1.5 py-0.5 transition-colors ${
                rate === speed
                  ? "bg-accent text-black font-bold"
                  : "text-muted hover:text-white"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
