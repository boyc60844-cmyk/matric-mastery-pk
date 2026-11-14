"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  CircleDashed,
  Compass,
  Wrench,
  PauseCircle,
  ArrowUpRight,
  WifiOff,
  AlertCircle,
  GitCommitHorizontal,
} from "lucide-react";
import {
  EnrichedRoadmapItem,
  ROADMAP_REFRESH_INTERVAL_MS,
  RoadmapStatus,
  RoadmapSyncResult,
  formatSyncTimestamp,
  readCachedRoadmapSnapshot,
  enrichRoadmapItems,
  syncRoadmapData,
} from "@/lib/roadmapService";

type FilterGroup = "all" | "active-pipeline" | "ongoing" | "released";

const STATUS_META: Record<
  RoadmapStatus,
  {
    label: string;
    toneClass: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  planned: {
    label: "Planned",
    toneClass: "text-[#FFD60A]",
    Icon: Compass,
  },
  upcoming: {
    label: "Upcoming",
    toneClass: "text-amber-300",
    Icon: Clock,
  },
  "in-development": {
    label: "In Development",
    toneClass: "text-sky-300",
    Icon: Wrench,
  },
  ongoing: {
    label: "Ongoing Maintenance",
    toneClass: "text-neutral-200",
    Icon: CircleDashed,
  },
  released: {
    label: "Released",
    toneClass: "text-emerald-400",
    Icon: CheckCircle2,
  },
  deferred: {
    label: "Deferred",
    toneClass: "text-neutral-400",
    Icon: PauseCircle,
  },
};

interface DevelopmentRoadmapSectionProps {
  onNavigateToRelease?: (anchorId: string) => void;
}

export default function DevelopmentRoadmapSection({
  onNavigateToRelease,
}: DevelopmentRoadmapSectionProps) {
  const [items, setItems] = useState<EnrichedRoadmapItem[]>([]);
  const [sourceLabel, setSourceLabel] = useState<string>(
    "Matric Mastery Project Roadmap (/roadmap.json)"
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [syncSource, setSyncSource] = useState<
    RoadmapSyncResult["source"] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [filterGroup, setFilterGroup] = useState<FilterGroup>("all");

  const mountedRef = useRef<boolean>(true);
  const isSyncingRef = useRef<boolean>(false);

  const applySyncResult = useCallback((result: RoadmapSyncResult) => {
    setItems(result.items);
    setSourceLabel(result.document.sourceLabel);
    setLastSyncedAt(result.syncedAt);
    setSyncSource(result.source);
    setIsOffline(result.isOffline);
    setSyncError(result.error || null);
  }, []);

  const performSync = useCallback(
    async (options?: { force?: boolean; silent?: boolean }) => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;

      const force = Boolean(options?.force);
      const silent = Boolean(options?.silent);

      if (!silent) {
        setIsRefreshing(true);
      }

      try {
        const result = await syncRoadmapData({ force });
        if (!mountedRef.current) return;
        applySyncResult(result);
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        const msg =
          err instanceof Error && err.message
            ? err.message
            : "Unable to synchronize roadmap data.";
        setSyncError(msg);
        setIsOffline(
          typeof navigator !== "undefined" ? !navigator.onLine : false
        );
      } finally {
        isSyncingRef.current = false;
        if (mountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [applySyncResult]
  );

  useEffect(() => {
    mountedRef.current = true;

    // Immediately hydrate any validated local cache so UI is never blank during sync
    const cached = readCachedRoadmapSnapshot();
    if (cached) {
      setItems(enrichRoadmapItems(cached.document.items));
      setSourceLabel(cached.document.sourceLabel);
      setLastSyncedAt(cached.syncedAt);
      setSyncSource("cache");
      setIsLoading(false);
    }

    // Initial fetch when Guide opens
    performSync({ force: false });

    // Periodic synchronization while page remains open and visible
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        performSync({ force: true, silent: true });
      }
    }, ROADMAP_REFRESH_INTERVAL_MS);

    const handleOnline = () => {
      setIsOffline(false);
      performSync({ force: true });
    };

    const handleOffline = () => {
      setIsOffline(true);
      setSyncError(
        "Device is offline. Preserving the last synchronized roadmap snapshot."
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [performSync]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      activePipeline: items.filter(
        (i) =>
          i.status === "planned" ||
          i.status === "upcoming" ||
          i.status === "in-development"
      ).length,
      ongoing: items.filter((i) => i.status === "ongoing").length,
      released: items.filter((i) => i.status === "released").length,
    };
  }, [items]);

  const visibleItems = useMemo(() => {
    if (filterGroup === "active-pipeline") {
      return items.filter(
        (i) =>
          i.status === "planned" ||
          i.status === "upcoming" ||
          i.status === "in-development"
      );
    }
    if (filterGroup === "ongoing") {
      return items.filter((i) => i.status === "ongoing");
    }
    if (filterGroup === "released") {
      return items.filter((i) => i.status === "released");
    }
    return items;
  }, [items, filterGroup]);

  const handleJumpToChangelog = (
    e: React.MouseEvent<HTMLAnchorElement>,
    anchorId: string
  ) => {
    if (onNavigateToRelease) {
      e.preventDefault();
      onNavigateToRelease(anchorId);
    }
  };

  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-heading"
      className="py-12 border-b border-white/10 scroll-mt-24"
    >
      {/* Header + Sync Control */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="max-w-2xl">
          <p className="text-xs font-mono font-semibold text-[#FFD60A] mb-2">
            Section I · Development Roadmap
          </p>
          <h2
            id="roadmap-heading"
            className="text-2xl sm:text-3xl font-heading font-black text-white text-balance"
          >
            What&apos;s Coming Next
          </h2>
          <p className="mt-2 text-sm sm:text-[15px] text-neutral-300 leading-relaxed">
            An honest record of planned work, upcoming interface refinements,
            ongoing platform maintenance, and verified releases connected to
            our changelog. Statuses change only when an authorized project update
            or verified release is recorded.
          </p>
        </div>

        {/* Honest Synchronization Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <div className="text-xs text-neutral-400 space-y-0.5 sm:text-right">
            <p className="font-medium text-neutral-200">
              Synchronized project data
            </p>
            <p className="font-mono tabular-nums text-[11px] text-neutral-400">
              Last synced: {formatSyncTimestamp(lastSyncedAt)}
              {syncSource === "stale-cache" ? " (cached)" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => performSync({ force: true })}
            disabled={isRefreshing || isLoading}
            aria-label="Refresh roadmap data"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#121216] px-4 py-2 text-xs font-heading font-bold text-white hover:border-[#FFD60A]/60 hover:text-[#FFD60A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw
              size={14}
              className={isRefreshing || isLoading ? "animate-spin text-[#FFD60A]" : ""}
              aria-hidden="true"
            />
            <span>{isRefreshing || isLoading ? "Syncing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Sync Error / Offline Banner (preserves last successful cached items below) */}
      {(syncError || isOffline) && (
        <div
          role="status"
          className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/35 bg-amber-500/[0.07] px-4 py-3 text-xs text-amber-100"
        >
          <div className="flex items-start gap-2.5">
            {isOffline ? (
              <WifiOff
                size={15}
                className="text-amber-300 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            ) : (
              <AlertCircle
                size={15}
                className="text-amber-300 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            )}
            <p className="leading-relaxed">
              {syncError ||
                "Connection unavailable. Showing last synchronized roadmap snapshot."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => performSync({ force: true })}
            disabled={isRefreshing}
            className="self-start sm:self-auto min-h-[36px] rounded-lg border border-amber-400/40 bg-black/40 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-black/70 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Interactive Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter roadmap items by status"
          className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-[#0E0E12] p-1"
        >
          {(
            [
              { id: "all", label: `All (${counts.all})` },
              {
                id: "active-pipeline",
                label: `Planned & Upcoming (${counts.activePipeline})`,
              },
              { id: "ongoing", label: `Ongoing (${counts.ongoing})` },
              { id: "released", label: `Released (${counts.released})` },
            ] as const
          ).map((tab) => {
            const active = filterGroup === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilterGroup(tab.id)}
                className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-heading font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-[#FFD60A] text-black font-bold"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] font-mono text-neutral-500">
          Source: {sourceLabel} · Auto-check every 5 min
        </p>
      </div>

      {/* Content Area */}
      {isLoading && items.length === 0 ? (
        <div
          aria-busy="true"
          className="mt-6 rounded-2xl border border-white/10 bg-[#0E0E12] p-8 text-center text-xs text-neutral-400"
        >
          <RefreshCw
            size={20}
            className="mx-auto mb-3 animate-spin text-[#FFD60A]"
            aria-hidden="true"
          />
          <p className="font-medium text-neutral-200">
            Loading synchronized roadmap data...
          </p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0E0E12] p-8 text-center text-xs text-neutral-400">
          <p className="text-sm font-semibold text-white">
            No roadmap items in this view
          </p>
          <p className="mt-1">
            Switch filters or click Refresh to synchronize the latest project data.
          </p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0E0E12] overflow-hidden">
          {visibleItems.map((item) => {
            const statusMeta = STATUS_META[item.status];
            const StatusIcon = statusMeta.Icon;

            return (
              <article
                key={item.id}
                id={`roadmap-item-${item.id}`}
                className="p-5 sm:p-7 transition-colors hover:bg-white/[0.015]"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl min-w-0">
                    {/* Clean unboxed metadata row */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${statusMeta.toneClass}`}
                      >
                        <StatusIcon size={14} aria-hidden="true" />
                        <span>{statusMeta.label}</span>
                      </span>
                      <span className="text-neutral-600" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-neutral-400">{item.category}</span>
                      <span className="text-neutral-600" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-mono tabular-nums text-[11px] text-neutral-500">
                        Updated {item.lastUpdated}
                      </span>
                      {item.verifiedChangelog && (
                        <>
                          <span className="text-neutral-600" aria-hidden="true">
                            ·
                          </span>
                          <span className="font-mono tabular-nums text-[11px] font-semibold text-emerald-400">
                            {item.verifiedChangelog.version} ({item.releaseDate})
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Verified Release Link (only rendered when actually verified in RELEASE_HISTORY) */}
                  {item.verifiedChangelog && (
                    <a
                      href={`#${item.verifiedChangelog.anchorId}`}
                      onClick={(e) =>
                        handleJumpToChangelog(
                          e,
                          item.verifiedChangelog!.anchorId
                        )
                      }
                      className="inline-flex min-h-[40px] items-center gap-1.5 self-start rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:border-emerald-400/60 hover:text-emerald-200 transition-colors whitespace-nowrap shrink-0"
                    >
                      <GitCommitHorizontal size={14} aria-hidden="true" />
                      <span>
                        Changelog {item.verifiedChangelog.version}
                      </span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  )}
                </div>

                {/* Scope / Details list */}
                {item.details.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <p className="text-xs font-mono text-neutral-400 mb-2.5">
                      {item.status === "released"
                        ? "Verified Delivered Scope"
                        : item.status === "ongoing"
                          ? "Active Focus Areas"
                          : "Planned Scope"}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-[13px] text-neutral-300">
                      {item.details.map((detail, dIdx) => (
                        <li
                          key={dIdx}
                          className="flex items-start gap-2 leading-relaxed"
                        >
                          <span
                            className={`mt-0.5 shrink-0 font-bold ${
                              item.status === "released"
                                ? "text-emerald-400"
                                : "text-[#FFD60A]"
                            }`}
                            aria-hidden="true"
                          >
                            ·
                          </span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Honest guard note when present */}
                {item.notes && (
                  <p className="mt-4 rounded-xl border border-white/[0.08] bg-black/35 px-3.5 py-2.5 text-xs text-neutral-300 leading-relaxed">
                    {item.notes}
                  </p>
                )}

                {item.hasUnverifiedReleaseClaim && (
                  <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200 leading-relaxed">
                    Release metadata could not be cross-verified against the
                    local Release History record.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
