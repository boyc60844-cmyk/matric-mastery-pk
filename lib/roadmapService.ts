/**
 * Matric Mastery — Live Development Roadmap Service
 *
 * Synchronizes roadmap state from `/roadmap.json` (the single version-controlled
 * roadmap data source) and cross-verifies any released items against
 * `RELEASE_HISTORY` in `lib/releaseManifest.ts`.
 *
 * Design guarantees:
 * - Strict runtime payload validation before rendering
 * - Sensible local caching (60s TTL on auto-sync; force-refresh supported)
 * - In-flight request deduplication (no overlapping fetches)
 * - Graceful offline & error handling preserving the last successful snapshot
 * - Zero fabricated live indicators, dates, or auto-promoted statuses
 */

import { RELEASE_HISTORY, ReleaseItem } from "./releaseManifest";

export type RoadmapStatus =
  | "planned"
  | "upcoming"
  | "in-development"
  | "released"
  | "ongoing"
  | "deferred";

export const VALID_ROADMAP_STATUSES: readonly RoadmapStatus[] = [
  "planned",
  "upcoming",
  "in-development",
  "released",
  "ongoing",
  "deferred",
] as const;

export interface RawRoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: RoadmapStatus;
  details: string[];
  lastUpdated: string;
  releaseVersion?: string;
  releaseDate?: string;
  changelogRef?: string;
  notes?: string;
}

export interface RoadmapDocument {
  schemaVersion: string;
  project: string;
  sourceLabel: string;
  lastUpdated: string;
  items: RawRoadmapItem[];
}

export interface VerifiedChangelogLink {
  version: string;
  codename: string;
  releaseDate: string;
  anchorId: string;
}

export interface EnrichedRoadmapItem extends RawRoadmapItem {
  verifiedChangelog: VerifiedChangelogLink | null;
  hasUnverifiedReleaseClaim: boolean;
}

export interface RoadmapSyncResult {
  document: RoadmapDocument;
  items: EnrichedRoadmapItem[];
  source: "network" | "cache" | "stale-cache";
  syncedAt: number;
  isStale: boolean;
  isOffline: boolean;
  error?: string;
}

export const ROADMAP_CACHE_KEY = "mm_cache_guide_roadmap_v1";
export const ROADMAP_CACHE_TTL_MS = 60 * 1000; // 60 seconds minimum client cache window
export const ROADMAP_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes periodic refresh while open
const ROADMAP_FETCH_TIMEOUT_MS = 8000;

interface CachedRoadmapSnapshot {
  syncedAt: number;
  document: RoadmapDocument;
}

let inFlightSync: Promise<RoadmapSyncResult> | null = null;

function isValidStatus(value: unknown): value is RoadmapStatus {
  return (
    typeof value === "string" &&
    (VALID_ROADMAP_STATUSES as readonly string[]).includes(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates raw JSON fetched from `/roadmap.json` before rendering or caching.
 * Gracefully strips invalid optional fields while rejecting malformed records.
 */
export function validateRoadmapDocument(raw: unknown): RoadmapDocument {
  if (!raw || typeof raw !== "object") {
    throw new Error("Roadmap payload is not a valid object.");
  }

  const obj = raw as Record<string, unknown>;
  if (!Array.isArray(obj.items) || obj.items.length === 0) {
    throw new Error("Roadmap payload contains no valid items.");
  }

  const seenIds = new Set<string>();
  const validatedItems: RawRoadmapItem[] = obj.items.map((entry, idx) => {
    if (!entry || typeof entry !== "object") {
      throw new Error(`Roadmap item at index ${idx} is malformed.`);
    }

    const item = entry as Record<string, unknown>;
    if (!isNonEmptyString(item.id)) {
      throw new Error(`Roadmap item at index ${idx} is missing a valid id.`);
    }
    const id = item.id.trim();
    if (seenIds.has(id)) {
      throw new Error(`Duplicate roadmap item id "${id}".`);
    }
    seenIds.add(id);

    if (!isNonEmptyString(item.title)) {
      throw new Error(`Roadmap item "${id}" is missing a title.`);
    }
    if (!isNonEmptyString(item.description)) {
      throw new Error(`Roadmap item "${id}" is missing a description.`);
    }
    if (!isNonEmptyString(item.category)) {
      throw new Error(`Roadmap item "${id}" is missing a category.`);
    }
    if (!isValidStatus(item.status)) {
      throw new Error(
        `Roadmap item "${id}" has unsupported status "${String(item.status)}".`
      );
    }

    const details = Array.isArray(item.details)
      ? item.details
          .filter((d): d is string => isNonEmptyString(d))
          .map((d) => d.trim())
      : [];

    const lastUpdated = isNonEmptyString(item.lastUpdated)
      ? item.lastUpdated.trim()
      : isNonEmptyString(obj.lastUpdated)
        ? obj.lastUpdated.trim()
        : "Unverified";

    return {
      id,
      title: item.title.trim(),
      description: item.description.trim(),
      category: item.category.trim(),
      status: item.status,
      details,
      lastUpdated,
      releaseVersion: isNonEmptyString(item.releaseVersion)
        ? item.releaseVersion.trim()
        : undefined,
      releaseDate: isNonEmptyString(item.releaseDate)
        ? item.releaseDate.trim()
        : undefined,
      changelogRef: isNonEmptyString(item.changelogRef)
        ? item.changelogRef.trim()
        : undefined,
      notes: isNonEmptyString(item.notes) ? item.notes.trim() : undefined,
    };
  });

  return {
    schemaVersion: isNonEmptyString(obj.schemaVersion)
      ? obj.schemaVersion.trim()
      : "1.0.0",
    project: isNonEmptyString(obj.project) ? obj.project.trim() : "Matric Mastery",
    sourceLabel: isNonEmptyString(obj.sourceLabel)
      ? obj.sourceLabel.trim()
      : "Matric Mastery Project Roadmap (/roadmap.json)",
    lastUpdated: isNonEmptyString(obj.lastUpdated)
      ? obj.lastUpdated.trim()
      : validatedItems[0].lastUpdated,
    items: validatedItems,
  };
}

/**
 * Connects released roadmap items strictly to verified entries in `RELEASE_HISTORY`.
 * Never auto-promotes non-released items to "released".
 */
export function enrichRoadmapItems(
  items: RawRoadmapItem[],
  history: ReleaseItem[] = RELEASE_HISTORY
): EnrichedRoadmapItem[] {
  return items.map((item) => {
    const lookupVersion = item.changelogRef || item.releaseVersion;
    const matchedRelease = lookupVersion
      ? history.find(
          (rel) =>
            rel.version.toLowerCase() === lookupVersion.toLowerCase() &&
            rel.status === "released"
        )
      : undefined;

    const verifiedChangelog: VerifiedChangelogLink | null =
      item.status === "released" && matchedRelease
        ? {
            version: matchedRelease.version,
            codename: matchedRelease.codename,
            releaseDate: matchedRelease.releaseDate,
            anchorId: `release-${matchedRelease.version}`,
          }
        : null;

    const hasUnverifiedReleaseClaim =
      item.status === "released" && !verifiedChangelog;

    return {
      ...item,
      releaseVersion: verifiedChangelog
        ? verifiedChangelog.version
        : item.status === "released"
          ? item.releaseVersion
          : undefined,
      releaseDate: verifiedChangelog
        ? item.releaseDate || verifiedChangelog.releaseDate
        : item.status === "released"
          ? item.releaseDate
          : undefined,
      verifiedChangelog,
      hasUnverifiedReleaseClaim,
    };
  });
}

export function readCachedRoadmapSnapshot(): CachedRoadmapSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ROADMAP_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedRoadmapSnapshot>;
    if (typeof parsed.syncedAt !== "number" || !parsed.document) return null;
    const validated = validateRoadmapDocument(parsed.document);
    return {
      syncedAt: parsed.syncedAt,
      document: validated,
    };
  } catch {
    return null;
  }
}

function writeCachedRoadmapSnapshot(snapshot: CachedRoadmapSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ROADMAP_CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

/**
 * Fetches and validates the latest roadmap document.
 * Deduplicates overlapping calls, enforces cache TTL when not forced,
 * and preserves last good cached data on offline or network errors.
 */
export async function syncRoadmapData(options?: {
  force?: boolean;
}): Promise<RoadmapSyncResult> {
  const force = Boolean(options?.force);

  // Deduplicate concurrent requests
  if (inFlightSync) {
    return inFlightSync;
  }

  const cached = readCachedRoadmapSnapshot();

  // Serve fresh cache within TTL unless explicitly forced by manual refresh
  if (!force && cached && Date.now() - cached.syncedAt < ROADMAP_CACHE_TTL_MS) {
    return {
      document: cached.document,
      items: enrichRoadmapItems(cached.document.items),
      source: "cache",
      syncedAt: cached.syncedAt,
      isStale: false,
      isOffline: typeof navigator !== "undefined" ? !navigator.onLine : false,
    };
  }

  // Handle offline condition gracefully before attempting fetch
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    if (cached) {
      return {
        document: cached.document,
        items: enrichRoadmapItems(cached.document.items),
        source: "stale-cache",
        syncedAt: cached.syncedAt,
        isStale: true,
        isOffline: true,
        error:
          "You are offline. Displaying the last synchronized roadmap snapshot.",
      };
    }
    throw new Error(
      "Your device is offline and no cached roadmap snapshot is available yet."
    );
  }

  const runFetch = async (): Promise<RoadmapSyncResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      ROADMAP_FETCH_TIMEOUT_MS
    );

    try {
      const cacheBust = force ? `?t=${Date.now()}` : "";
      const response = await fetch(`/roadmap.json${cacheBust}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Roadmap source returned HTTP ${response.status}.`);
      }

      const json = await response.json();
      const validated = validateRoadmapDocument(json);
      const syncedAt = Date.now();

      writeCachedRoadmapSnapshot({
        syncedAt,
        document: validated,
      });

      return {
        document: validated,
        items: enrichRoadmapItems(validated.items),
        source: "network",
        syncedAt,
        isStale: false,
        isOffline: false,
      };
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error && err.name === "AbortError"
          ? "Roadmap sync timed out before receiving a response."
          : err instanceof Error && err.message
            ? err.message
            : "Unable to synchronize roadmap data right now.";

      // Preserve last successfully retrieved data if a refresh fails
      if (cached) {
        return {
          document: cached.document,
          items: enrichRoadmapItems(cached.document.items),
          source: "stale-cache",
          syncedAt: cached.syncedAt,
          isStale: true,
          isOffline:
            typeof navigator !== "undefined" ? !navigator.onLine : false,
          error: `${errMsg} Showing last synchronized snapshot.`,
        };
      }

      throw new Error(errMsg);
    } finally {
      clearTimeout(timeoutId);
      inFlightSync = null;
    }
  };

  inFlightSync = runFetch();
  return inFlightSync;
}

export function formatSyncTimestamp(ts: number | null): string {
  if (!ts) return "Not yet synchronized";
  try {
    return new Date(ts).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return new Date(ts).toISOString();
  }
}
