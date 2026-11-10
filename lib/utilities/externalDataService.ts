/**
 * MATRIC MASTERY - REAL-WORLD UTILITY & INTELLIGENCE SYSTEM
 * Genuine External Information Providers (Weather & Currency Exchange)
 */

import { WeatherData, CurrencyRateData } from "./types";

export interface EducationalCity {
  id: string;
  name: string;
  urduName: string;
  boardName: string;
  lat: number;
  lon: number;
}

export const PUNJAB_EXAM_CITIES: EducationalCity[] = [
  { id: "multan", name: "Multan", urduName: "ملتان", boardName: "BISE Multan", lat: 30.1575, lon: 71.5249 },
  { id: "lahore", name: "Lahore", urduName: "لاہور", boardName: "BISE Lahore / PBCC HQ", lat: 31.5204, lon: 74.3587 },
  { id: "faisalabad", name: "Faisalabad", urduName: "فیصل آباد", boardName: "BISE Faisalabad", lat: 31.4504, lon: 73.135 },
  { id: "rawalpindi", name: "Rawalpindi / Islamabad", urduName: "راولپنڈی", boardName: "BISE Rawalpindi / FBISE", lat: 33.5973, lon: 73.0479 },
  { id: "gujranwala", name: "Gujranwala", urduName: "گوجرانوالہ", boardName: "BISE Gujranwala", lat: 32.1877, lon: 74.1945 },
  { id: "sargodha", name: "Sargodha", urduName: "سرگودھا", boardName: "BISE Sargodha", lat: 32.0836, lon: 72.6711 },
  { id: "bahawalpur", name: "Bahawalpur", urduName: "بہاولپور", boardName: "BISE Bahawalpur", lat: 29.3544, lon: 71.6911 },
  { id: "dgkhan", name: "D.G. Khan", urduName: "ڈی جی خان", boardName: "BISE D.G. Khan", lat: 30.0561, lon: 70.6403 },
  { id: "sahiwal", name: "Sahiwal", urduName: "ساہیوال", boardName: "BISE Sahiwal", lat: 30.6682, lon: 73.1114 },
  { id: "karachi", name: "Karachi", urduName: "کراچی", boardName: "BIEK / BSEK Sindh", lat: 24.8607, lon: 67.0011 },
];

/**
 * WMO Weather Interpretation Codes (Open-Meteo Standard)
 */
function decodeWmoWeatherCode(code: number): string {
  switch (code) {
    case 0:
      return "Clear Sky";
    case 1:
      return "Mainly Clear";
    case 2:
      return "Partly Cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Fog / Haze";
    case 51:
    case 53:
    case 55:
      return "Light Drizzle";
    case 61:
    case 63:
    case 65:
      return "Rain Showers";
    case 71:
    case 73:
    case 75:
      return "Snow Flurries";
    case 80:
    case 81:
    case 82:
      return "Heavy Rain Showers";
    case 95:
    case 96:
    case 99:
      return "Thunderstorm";
    default:
      return "Variable Conditions";
  }
}

const STORAGE_KEYS = {
  WEATHER_CACHE: "mm_cache_weather_",
  CURRENCY_CACHE: "mm_cache_currency_rates",
  SELECTED_CITY: "mm_pref_weather_city",
};

class ExternalDataService {
  /**
   * Fetch live weather from Open-Meteo
   * Cache duration: 15 minutes to respect provider limits.
   */
  public async getCityWeather(city: EducationalCity): Promise<{
    data: WeatherData | null;
    source: "network" | "cache" | "offline-cache";
    error?: string;
  }> {
    const cacheKey = `${STORAGE_KEYS.WEATHER_CACHE}${city.id}`;

    // 1. Check local cache
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const ageMs = Date.now() - parsed.timestamp;
          if (ageMs < 15 * 60 * 1000) {
            return { data: parsed.weather, source: "cache" };
          }
        }
      } catch {
        // Continue to network
      }
    }

    // 2. Fetch live data from Open-Meteo
    if (typeof window !== "undefined" && !navigator.onLine) {
      // Fallback to stale cache if offline
      const stale = this.getStaleWeatherCache(cacheKey);
      if (stale) return { data: { ...stale, isStale: true }, source: "offline-cache" };
      return { data: null, source: "offline-cache", error: "Device is currently offline." };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=Asia%2FKarachi`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open-Meteo HTTP error: ${response.status}`);
      }

      const json = await response.json();
      const current = json.current;

      if (!current || typeof current.temperature_2m !== "number") {
        throw new Error("Malformed weather payload received");
      }

      const weather: WeatherData = {
        city: `${city.name} (${city.boardName})`,
        temperatureC: Math.round(current.temperature_2m * 10) / 10,
        feelsLikeC: Math.round(current.apparent_temperature * 10) / 10,
        humidityPercent: current.relative_humidity_2m,
        windSpeedKmH: Math.round(current.wind_speed_10m * 10) / 10,
        weatherCode: current.weather_code,
        conditionText: decodeWmoWeatherCode(current.weather_code),
        isDay: current.is_day === 1,
        lastUpdated: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        provider: "Open-Meteo Atmospheric Archive",
      };

      // Cache valid result
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), weather }));
      } catch {
        // Ignore storage errors
      }

      return { data: weather, source: "network" };
    } catch (err: any) {
      // Return stale cache if network failed
      const stale = this.getStaleWeatherCache(cacheKey);
      if (stale) {
        return { data: { ...stale, isStale: true }, source: "offline-cache", error: err?.message };
      }
      return { data: null, source: "network", error: err?.message || "Failed to load weather data" };
    }
  }

  private getStaleWeatherCache(cacheKey: string): WeatherData | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached).weather;
    } catch {
      // Ignore
    }
    return null;
  }

  /**
   * Fetch live currency rates with PKR base or USD reference
   * Provider: open.er-api.com / Frankfurter Open Exchange Feeds (Free, no client secret required)
   * Cache duration: 1 hour
   */
  public async getCurrencyRates(): Promise<{
    data: CurrencyRateData | null;
    source: "network" | "cache" | "offline-cache";
    error?: string;
  }> {
    const cacheKey = STORAGE_KEYS.CURRENCY_CACHE;

    // 1. Check local cache
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const ageMs = Date.now() - parsed.timestamp;
          if (ageMs < 60 * 60 * 1000) {
            return { data: parsed.data, source: "cache" };
          }
        }
      } catch {
        // Continue to network
      }
    }

    if (typeof window !== "undefined" && !navigator.onLine) {
      const stale = this.getStaleCurrencyCache(cacheKey);
      if (stale) return { data: { ...stale, isStale: true }, source: "offline-cache" };
      return { data: null, source: "offline-cache", error: "Device is currently offline." };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Open Exchange Rate Public API (no credentials required, free open feed)
      const res = await fetch("https://open.er-api.com/v6/latest/USD", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Currency API HTTP error: ${res.status}`);
      }

      const json = await res.json();
      if (!json.rates || !json.rates.PKR) {
        throw new Error("Exchange rate data missing required PKR baseline");
      }

      const usdToPkr = json.rates.PKR;

      // Calculate rates relative to 1 PKR for student budgeting
      const pkrRates: Record<string, number> = {
        USD: Math.round((1 / usdToPkr) * 10000) / 10000,
        GBP: Math.round(((json.rates.GBP || 0.78) / usdToPkr) * 10000) / 10000,
        EUR: Math.round(((json.rates.EUR || 0.92) / usdToPkr) * 10000) / 10000,
        SAR: Math.round(((json.rates.SAR || 3.75) / usdToPkr) * 10000) / 10000,
        AED: Math.round(((json.rates.AED || 3.67) / usdToPkr) * 10000) / 10000,
        CAD: Math.round(((json.rates.CAD || 1.39) / usdToPkr) * 10000) / 10000,
        CNY: Math.round(((json.rates.CNY || 7.23) / usdToPkr) * 10000) / 10000,
        AUD: Math.round(((json.rates.AUD || 1.52) / usdToPkr) * 10000) / 10000,
        // Inverse: 1 Foreign Unit to PKR
        _PKR_PER_USD: Math.round(usdToPkr * 100) / 100,
        _PKR_PER_GBP: Math.round((usdToPkr / (json.rates.GBP || 0.78)) * 100) / 100,
        _PKR_PER_EUR: Math.round((usdToPkr / (json.rates.EUR || 0.92)) * 100) / 100,
        _PKR_PER_SAR: Math.round((usdToPkr / (json.rates.SAR || 3.75)) * 100) / 100,
        _PKR_PER_AED: Math.round((usdToPkr / (json.rates.AED || 3.67)) * 100) / 100,
      };

      const result: CurrencyRateData = {
        base: "PKR",
        date: json.time_last_update_utc ? new Date(json.time_last_update_utc).toLocaleDateString() : new Date().toLocaleDateString(),
        timestamp: Date.now(),
        rates: pkrRates,
        provider: "Open Exchange Rates (Public Global Feed)",
        disclaimer: "Reference rates for student academic planning and foreign fee estimates. Official interbank transaction rates may vary.",
      };

      try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: result }));
      } catch {
        // Ignore
      }

      return { data: result, source: "network" };
    } catch (err: any) {
      const stale = this.getStaleCurrencyCache(cacheKey);
      if (stale) {
        return { data: { ...stale, isStale: true }, source: "offline-cache", error: err?.message };
      }
      return { data: null, source: "network", error: err?.message || "Failed to load exchange rates" };
    }
  }

  private getStaleCurrencyCache(cacheKey: string): CurrencyRateData | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached).data;
    } catch {
      // Ignore
    }
    return null;
  }
}

export const externalDataService = new ExternalDataService();
