"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Compass,
  ArrowRightLeft,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { timeService, WORLD_TIMEZONES, formatTimezoneOffsetBadge } from "@/lib/utilities/timeService";
import { TimeFormat, TimeZoneOption } from "@/lib/utilities/types";

export default function LiveClockWidget() {
  const [format, setFormat] = useState<TimeFormat>("12h");
  const [selectedZone, setSelectedZone] = useState<string>("Asia/Karachi");
  const [showAnalog, setShowAnalog] = useState<boolean>(true);
  const [clockData, setClockData] = useState(timeService.formatTimeForZone("Asia/Karachi", "12h"));
  const [syncState, setSyncState] = useState(timeService.getSyncState());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Time converter states
  const [convertTimeInput, setConvertTimeInput] = useState<string>("14:30");
  const [convertFromZone, setConvertFromZone] = useState<string>("Asia/Karachi");
  const [convertToZone, setConvertToZone] = useState<string>("Europe/London");
  const [convertedResult, setConvertedResult] = useState(
    timeService.convertTime("14:30", "Asia/Karachi", "Europe/London")
  );

  // Subscribe to timeService clock ticks (reuses existing single 1s interval; pauses while tab hidden)
  useEffect(() => {
    const update = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      setClockData(timeService.formatTimeForZone(selectedZone, format));
      setSyncState(timeService.getSyncState());
    };

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && !document.hidden) {
        update();
      }
    };

    update();
    const unsubscribe = timeService.subscribe(update);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedZone, format, showAnalog]);

  // Recalculate converter when inputs change
  useEffect(() => {
    setConvertedResult(timeService.convertTime(convertTimeInput, convertFromZone, convertToZone));
  }, [convertTimeInput, convertFromZone, convertToZone]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await timeService.syncWithNetworkTime();
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Live Clock Panel */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#FFD60A]/5 blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#FFD60A] uppercase tracking-wider">
                Live Precision Clock
              </span>
              <span className="text-white/20">·</span>
              <span className="font-mono text-xs text-white/60">
                {WORLD_TIMEZONES.find((z) => z.iana === selectedZone)?.label || selectedZone}
              </span>
            </div>
            <h2 className="mt-1 font-heading text-xl sm:text-2xl font-black text-white">
              Academic &amp; Standard Time Intelligence
            </h2>
          </div>

          {/* Clock controls: 12h/24h & Analog Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setFormat("12h")}
                className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                  format === "12h" ? "bg-[#FFD60A] text-black font-bold" : "text-white/70 hover:text-white"
                }`}
              >
                12h
              </button>
              <button
                type="button"
                onClick={() => setFormat("24h")}
                className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                  format === "24h" ? "bg-[#FFD60A] text-black font-bold" : "text-white/70 hover:text-white"
                }`}
              >
                24h
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAnalog(!showAnalog)}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-white/70 hover:text-white hover:border-[#FFD60A]/40 transition-colors cursor-pointer"
            >
              {showAnalog ? "Hide Analog" : "Show Analog"}
            </button>
          </div>
        </div>

        {/* Display Center: Digital Readout & Optional Analog Clock */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Digital Time Large Display */}
          <div className={`${showAnalog ? "md:col-span-8" : "md:col-span-12"} space-y-2`}>
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="font-mono text-3xl min-[380px]:text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight tabular-nums">
                {clockData.timeString}
              </span>
              {clockData.period && (
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#FFD60A]">
                  {clockData.period}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-mono text-white/80">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Calendar size={14} className="text-[#FFD60A]" />
                {clockData.dayName}, {clockData.dateString}
              </span>
              <span className="text-white/20">|</span>
              <span className="text-white/60">Asia/Karachi (UTC+05:00)</span>
            </div>

            {/* Network Time Synchronization Badge */}
            <div className="pt-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-mono">
                {syncState.isSynchronized ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold">NTP Synchronized</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/60 text-[11px] truncate">
                      {syncState.provider} (Offset: {syncState.offsetMs > 0 ? `+${syncState.offsetMs}` : syncState.offsetMs}ms)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={13} className="text-amber-400" />
                    <span className="text-amber-400 font-bold">Device Local Clock</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/60 text-[11px]">Unsynchronized</span>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  title="Resync with WorldTimeAPI"
                  className="ml-1 text-white/50 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <RefreshCw size={12} className={isSyncing ? "animate-spin text-[#FFD60A]" : ""} />
                </button>
              </div>
            </div>
          </div>

          {/* Scalable SVG Analog Clock */}
          {showAnalog && (
            <div className="md:col-span-4 flex items-center justify-center py-2">
              <PrecisionAnalogClock
                hours={clockData.hours}
                minutes={clockData.minutes}
                seconds={clockData.seconds}
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. World Clock & International Location Grid */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-[#FFD60A]" />
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              International Student Centers &amp; Examination Timezones
            </h3>
          </div>
          <span className="font-mono text-[11px] text-white/50">7 Coordinated Zones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {WORLD_TIMEZONES.map((zone) => {
            const zData = timeService.formatTimeForZone(zone.iana, format, false);
            const isSelected = selectedZone === zone.iana;

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZone(zone.iana)}
                className={`p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? "border-[#FFD60A] bg-[#FFD60A]/10 shadow-[0_0_15px_rgba(255,214,10,0.15)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{zone.flag}</span>
                    <span className="font-heading text-xs font-bold text-white">{zone.label}</span>
                  </div>
                  {isSelected && (
                    <span className="rounded bg-[#FFD60A] px-1.5 py-0.2 text-[9px] font-mono font-bold text-black uppercase">
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-mono text-xl font-black text-white">{zData.timeString}</span>
                  {zData.period && (
                    <span className="font-mono text-xs font-bold text-[#FFD60A]">{zData.period}</span>
                  )}
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-white/50">
                  <span className="truncate">{zData.dayName} · {zone.iana}</span>
                  <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.2 text-[9px] font-semibold text-white/70 shrink-0 ml-1">
                    {formatTimezoneOffsetBadge(zone.iana, timeService.getNow())}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Timezone Converter Tool */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E12] p-5 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
          <ArrowRightLeft size={15} className="text-[#FFD60A]" />
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Timezone Shift Converter (Study &amp; FBISE Overseas Coordination)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Input Time */}
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-mono text-white/60 mb-1">Time (24h or HH:mm)</label>
            <input
              type="time"
              value={convertTimeInput}
              onChange={(e) => setConvertTimeInput(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-mono text-white focus:border-[#FFD60A] focus:outline-none"
            />
          </div>

          {/* From Zone */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-mono text-white/60 mb-1">From Timezone</label>
            <select
              value={convertFromZone}
              onChange={(e) => setConvertFromZone(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#121216] px-3 py-2 text-xs font-mono text-white focus:border-[#FFD60A] focus:outline-none"
            >
              {WORLD_TIMEZONES.map((z) => (
                <option key={z.iana} value={z.iana}>
                  {z.flag} {z.label} ({formatTimezoneOffsetBadge(z.iana, timeService.getNow())})
                </option>
              ))}
            </select>
          </div>

          {/* Arrow Indicator */}
          <div className="sm:col-span-1 flex justify-center items-center text-white/40 pt-1 sm:pt-4">
            <ArrowRight size={16} className="text-[#FFD60A] shrink-0 rotate-90 sm:rotate-0" />
          </div>

          {/* To Zone */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-mono text-white/60 mb-1">Target Converted Time</label>
            <select
              value={convertToZone}
              onChange={(e) => setConvertToZone(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#121216] px-3 py-2 text-xs font-mono text-white focus:border-[#FFD60A] focus:outline-none"
            >
              {WORLD_TIMEZONES.map((z) => (
                <option key={z.iana} value={z.iana}>
                  {z.flag} {z.label} ({formatTimezoneOffsetBadge(z.iana, timeService.getNow())})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Converted Output Card */}
        <div className="mt-4 rounded-xl border border-[#FFD60A]/30 bg-[#FFD60A]/5 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-[#FFD60A] font-bold uppercase">Converted Local Time:</span>
            <div className="font-mono text-lg font-black text-white mt-0.5">
              {convertedResult.targetTimeString}
            </div>
          </div>
          <span className="rounded-lg bg-white/10 px-2 py-1 text-xs font-mono text-white/80">
            {convertedResult.targetDateOffset}
          </span>
        </div>
      </div>
    </div>
  );
}

const MINUTE_TICKS = Array.from({ length: 60 }, (_, i) => i);

export function PrecisionAnalogClock({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const prevAnglesRef = useRef<{
    hour: number;
    minute: number;
    second: number;
  } | null>(null);

  const prev = prevAnglesRef.current;
  const skipHourTransition =
    !prev || hourAngle < prev.hour || Math.abs(hourAngle - prev.hour) > 20;
  const skipMinuteTransition =
    !prev || minuteAngle < prev.minute || Math.abs(minuteAngle - prev.minute) > 20;
  const skipSecondTransition =
    !prev || secondAngle < prev.second || Math.abs(secondAngle - prev.second) > 20;

  useEffect(() => {
    prevAnglesRef.current = {
      hour: hourAngle,
      minute: minuteAngle,
      second: secondAngle,
    };
  }, [hourAngle, minuteAngle, secondAngle]);

  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[300px] aspect-square flex items-center justify-center rounded-full overflow-hidden"
    >
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        focusable="false"
        className="w-full h-full block select-none"
      >
        <defs>
          <radialGradient id="mmAnalogDialGrad" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#1A1A21" />
            <stop offset="65%" stopColor="#111116" />
            <stop offset="100%" stopColor="#09090C" />
          </radialGradient>
        </defs>

        {/* Dial Face & Thin Yellow Outer Ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#mmAnalogDialGrad)"
          stroke="#FFD60A"
          strokeOpacity="0.72"
          strokeWidth="1.5"
        />
        <circle
          cx="100"
          cy="100"
          r="91.5"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.75"
        />

        {/* 60 Minute Ticks (every 5th tick longer and thicker) */}
        {MINUTE_TICKS.map((tick) => {
          const isHourMark = tick % 5 === 0;
          return (
            <line
              key={tick}
              x1="100"
              y1="10"
              x2="100"
              y2={isHourMark ? "20" : "14.5"}
              stroke={isHourMark ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.24)"}
              strokeWidth={isHourMark ? "2.2" : "1"}
              strokeLinecap="round"
              transform={`rotate(${tick * 6} 100 100)`}
            />
          );
        })}

        {/* Cardinal Numerals (12, 3, 6, 9) in heading font */}
        <g
          fill="rgba(255,255,255,0.9)"
          fontSize="14"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <text x="100" y="34">12</text>
          <text x="166" y="100">3</text>
          <text x="100" y="166">6</text>
          <text x="34" y="100">9</text>
        </g>

        {/* Hour Hand (short ~50 units, thick, rounded, white, rotating around (100,100)) */}
        <g
          data-hand="hour"
          data-angle={hourAngle}
          className={
            skipHourTransition
              ? "motion-reduce:transition-none"
              : "transition-transform duration-150 ease-out motion-reduce:transition-none"
          }
          style={{
            transform: `rotate(${hourAngle}deg)`,
            transformOrigin: "100px 100px",
            transformBox: "view-box",
          }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="50"
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        </g>

        {/* Minute Hand (longer ~72 units, slimmer, white, rotating around (100,100)) */}
        <g
          data-hand="minute"
          data-angle={minuteAngle}
          className={
            skipMinuteTransition
              ? "motion-reduce:transition-none"
              : "transition-transform duration-150 ease-out motion-reduce:transition-none"
          }
          style={{
            transform: `rotate(${minuteAngle}deg)`,
            transformOrigin: "100px 100px",
            transformBox: "view-box",
          }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="28"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Second Hand (thinnest, yellow, ~80 units forward + 14-unit tail, rotating around (100,100)) */}
        <g
          data-hand="second"
          data-angle={secondAngle}
          className={
            skipSecondTransition
              ? "motion-reduce:transition-none"
              : "transition-transform duration-100 ease-out motion-reduce:transition-none"
          }
          style={{
            transform: `rotate(${secondAngle}deg)`,
            transformOrigin: "100px 100px",
            transformBox: "view-box",
          }}
        >
          <line
            x1="100"
            y1="114"
            x2="100"
            y2="20"
            stroke="#FFD60A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>

        {/* Layered Center Cap hiding pivot: white ring with yellow center dot */}
        <circle
          cx="100"
          cy="100"
          r="6"
          fill="#0E0E12"
          stroke="#FFFFFF"
          strokeWidth="2.2"
        />
        <circle cx="100" cy="100" r="2.8" fill="#FFD60A" />
      </svg>
    </div>
  );
}
