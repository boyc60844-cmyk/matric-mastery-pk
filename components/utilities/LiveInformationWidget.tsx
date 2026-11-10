"use client";

import React, { useState, useEffect } from "react";
import {
  CloudSun,
  Coins,
  Wifi,
  WifiOff,
  RefreshCw,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  Clock,
  ArrowRightLeft,
  AlertCircle,
  Sun,
  CloudRain,
  Cloud,
} from "lucide-react";
import {
  externalDataService,
  PUNJAB_EXAM_CITIES,
  EducationalCity,
} from "@/lib/utilities/externalDataService";
import { WeatherData, CurrencyRateData } from "@/lib/utilities/types";

const CURRENCIES = [
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "GBP", name: "British Pound" },
  { code: "EUR", name: "Euro" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "AED", name: "UAE Dirham" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
];

export default function LiveInformationWidget() {
  const [activeTab, setActiveTab] = useState<"weather" | "currency">("weather");
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Weather state
  const [selectedCity, setSelectedCity] = useState<EducationalCity>(
    PUNJAB_EXAM_CITIES[0] // Multan
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Currency state
  const [currencyData, setCurrencyData] = useState<CurrencyRateData | null>(null);
  const [currencyAmount, setCurrencyAmount] = useState<number | "">(1000);
  const [currencyFrom, setCurrencyFrom] = useState<string>("PKR");
  const [currencyTo, setCurrencyTo] = useState<string>("USD");

  // Track online status
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch weather
  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      try {
        const res = await externalDataService.getCityWeather(selectedCity);
        if (isMounted) {
          if (res.data) {
            setWeather(res.data);
          } else {
            setWeatherError(res.error || "Failed to load weather data.");
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setWeatherError(
            err instanceof Error ? err.message : "Failed to load weather"
          );
        }
      } finally {
        if (isMounted) setWeatherLoading(false);
      }
    };

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Fetch currency rates
  useEffect(() => {
    let isMounted = true;
    const loadRates = async () => {
      try {
        const res = await externalDataService.getCurrencyRates();
        if (isMounted && res.data) {
          setCurrencyData(res.data);
        }
      } catch {
        // Fallback handled in service
      }
    };

    loadRates();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefreshWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await externalDataService.getCityWeather(selectedCity);
      if (res.data) {
        setWeather(res.data);
      } else {
        setWeatherError(res.error || "Failed to refresh weather.");
      }
    } catch (err: unknown) {
      setWeatherError(
        err instanceof Error ? err.message : "Failed to refresh weather"
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setCurrencyFrom(currencyTo);
    setCurrencyTo(currencyFrom);
  };

  // Convert currency based on rates (relative to PKR)
  const calculateConversion = (): number => {
    if (!currencyData || typeof currencyAmount !== "number" || currencyAmount <= 0) {
      return 0;
    }
    const rates = currencyData.rates;
    if (currencyFrom === currencyTo) return currencyAmount;

    // Convert from currencyFrom to PKR
    let inPkr = currencyAmount;
    if (currencyFrom !== "PKR") {
      const pkrPerForeign = rates[`_PKR_PER_${currencyFrom}`] || (1 / (rates[currencyFrom] || 1));
      inPkr = currencyAmount * pkrPerForeign;
    }

    // Convert from PKR to currencyTo
    if (currencyTo === "PKR") {
      return inPkr;
    }
    const rateTo = rates[currencyTo] || 0.0035;
    return inPkr * rateTo;
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0E0E12] p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* Top Banner & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <CloudSun size={16} />
            </span>
            <h2 className="text-lg font-heading font-bold text-white tracking-wide">
              Live Examination City &amp; Forex Intelligence
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Real-time atmospheric conditions across Punjab BISE board centers
            and educational foreign exchange estimators.
          </p>
        </div>

        {/* Network Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono font-bold border ${
              isOnline
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi size={12} /> Online Live
              </>
            ) : (
              <>
                <WifiOff size={12} /> Offline (Cached)
              </>
            )}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1.5 rounded-xl border border-white/10 bg-[#141418] p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("weather")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
            activeTab === "weather"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <CloudSun size={14} />
          <span>Punjab Exam Cities Weather</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("currency")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
            activeTab === "currency"
              ? "bg-accent text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Coins size={14} />
          <span>Student Forex &amp; Currency Rates</span>
        </button>
      </div>

      {/* TAB 1: PUNJAB EXAM CITIES WEATHER */}
      {activeTab === "weather" && (
        <div className="mt-6 space-y-5">
          {/* City Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">
              Select Punjab Examination Board City:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PUNJAB_EXAM_CITIES.map((c: EducationalCity) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCity(c)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95 border ${
                    selectedCity.id === c.id
                      ? "bg-accent text-black font-bold border-accent shadow-sm"
                      : "bg-[#141418] border-white/10 text-neutral-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <MapPin size={11} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weather Card */}
          {weather && (
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#141418] to-[#101014] p-5 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xl text-white">
                      {weather.city}
                    </span>
                    <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-mono text-accent font-bold">
                      {selectedCity.boardName}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                    <Clock size={12} />
                    <span>
                      Observation: {weather.lastUpdated}
                    </span>
                    {weather.isStale && (
                      <span className="ml-2 text-amber-400 font-semibold">
                        (Cached 15m)
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshWeather}
                  disabled={weatherLoading}
                  className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white disabled:opacity-40 transition-all active:scale-95"
                >
                  <RefreshCw
                    size={13}
                    className={weatherLoading ? "animate-spin" : ""}
                  />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Main Weather Metrics */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Temp */}
                <div className="flex items-center gap-3 rounded-lg bg-black/40 p-3 border border-white/5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-accent">
                    <Thermometer size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Temperature
                    </span>
                    <div className="font-mono text-2xl font-black text-white tabular-nums">
                      {weather.temperatureC}°C
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono tabular-nums">
                      Feels like {weather.feelsLikeC}°C
                    </span>
                  </div>
                </div>

                {/* Condition */}
                <div className="flex items-center gap-3 rounded-lg bg-black/40 p-3 border border-white/5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    {weather.weatherCode >= 51 ? (
                      <CloudRain size={24} />
                    ) : weather.weatherCode >= 1 ? (
                      <Cloud size={24} />
                    ) : (
                      <Sun size={24} />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Sky Condition
                    </span>
                    <div className="font-medium text-sm text-white truncate max-w-[120px]">
                      {weather.conditionText}
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono tabular-nums">
                      WMO Code {weather.weatherCode}
                    </span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="flex items-center gap-3 rounded-lg bg-black/40 p-3 border border-white/5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Droplets size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Humidity
                    </span>
                    <div className="font-mono text-2xl font-black text-white tabular-nums">
                      {weather.humidityPercent}%
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      Relative level
                    </span>
                  </div>
                </div>

                {/* Wind */}
                <div className="flex items-center gap-3 rounded-lg bg-black/40 p-3 border border-white/5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wind size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Wind Velocity
                    </span>
                    <div className="font-mono text-2xl font-black text-white tabular-nums">
                      {weather.windSpeedKmH}{" "}
                      <span className="text-xs font-normal text-neutral-400">
                        km/h
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      Surface level
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-neutral-500">
                <AlertCircle size={12} className="shrink-0" />
                <span>
                  Exam Day Tip: Extreme heat or morning fog can delay transit to
                  BISE centers. Leave 30 minutes earlier during adverse weather.
                </span>
              </div>
            </div>
          )}

          {weatherError && (
            <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-300">
              {weatherError}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDENT FOREX & CURRENCY */}
      {activeTab === "currency" && (
        <div className="mt-6 space-y-6">
          {/* Two-Way Converter */}
          <div className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs">
            <span className="font-heading font-bold text-white text-sm block mb-3">
              Currency Converter (PKR Benchmark)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
              {/* From */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="block text-neutral-400 font-medium">Amount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={currencyAmount}
                    onChange={(e) =>
                      setCurrencyAmount(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full rounded border border-white/10 bg-black/60 px-3 py-2 font-mono tabular-nums text-white text-base focus:border-accent focus:outline-none"
                  />
                  <select
                    value={currencyFrom}
                    onChange={(e) => setCurrencyFrom(e.target.value)}
                    className="w-28 rounded border border-white/10 bg-black/60 px-2 py-2 text-white font-mono font-bold focus:border-accent focus:outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap */}
              <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 hover:text-accent hover:border-accent transition-all active:scale-90 active:rotate-180 duration-200"
                  title="Swap currencies"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="block text-neutral-400 font-medium">
                  Converted Output
                </label>
                <div className="flex gap-2">
                  <div className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 font-mono tabular-nums text-white text-base overflow-x-auto select-all">
                    {calculateConversion().toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <select
                    value={currencyTo}
                    onChange={(e) => setCurrencyTo(e.target.value)}
                    className="w-28 rounded border border-white/10 bg-black/60 px-2 py-2 text-white font-mono font-bold focus:border-accent focus:outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Rates Table */}
          {currencyData && (
            <div className="rounded-xl border border-white/10 bg-[#121216] p-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="font-heading font-bold text-white">
                  Exchange Rates Baseline
                </span>
                <span className="text-[10px] font-mono tabular-nums text-neutral-400">
                  Last Updated: {currencyData.date}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                {CURRENCIES.filter((c) => c.code !== "PKR").map((c) => {
                  const rateToPKR =
                    currencyData.rates[`_PKR_PER_${c.code}`] ||
                    (1 / (currencyData.rates[c.code] || 1)).toFixed(2);

                  return (
                    <div
                      key={c.code}
                      className="rounded-lg border border-white/5 bg-black/40 p-2.5 transition-all hover:border-white/20 active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{c.code}</span>
                        <span className="text-[10px] text-neutral-500 font-sans">
                          {c.name}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-accent tabular-nums">
                        1 {c.code} ≈ {rateToPKR} PKR
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] text-neutral-500">
                {currencyData.disclaimer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
