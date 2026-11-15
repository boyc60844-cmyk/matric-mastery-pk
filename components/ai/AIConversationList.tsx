"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  MessageSquare,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AIConversation } from "@/lib/aiClient";

export interface AIConversationListProps {
  conversations: AIConversation[];
  activeId: string;
  isGenerating?: boolean;
  onSelectConversation: (id: string) => void;
  onCreateNewChat: () => void;
  onRenameConversation: (id: string, nextTitle: string) => void;
  onTogglePinConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onAfterNavigate?: () => void;
}

const HISTORY_SUBJECT_FILTERS = [
  "All",
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer",
  "English",
  "Urdu",
  "General",
];

function formatRelativeDate(ts: number): string {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

const AIConversationList = memo(function AIConversationList({
  conversations,
  activeId,
  isGenerating = false,
  onSelectConversation,
  onCreateNewChat,
  onRenameConversation,
  onTogglePinConversation,
  onDeleteConversation,
  onAfterNavigate,
}: AIConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [pendingSwitchAction, setPendingSwitchAction] = useState<
    | { type: "new" }
    | { type: "select"; id: string; title: string }
    | null
  >(null);

  useEffect(() => {
    if (!isGenerating && pendingSwitchAction) {
      setPendingSwitchAction(null);
    }
  }, [isGenerating, pendingSwitchAction]);

  const nonEmptyCount = useMemo(
    () => conversations.filter((c) => c.messages.length > 0).length,
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...conversations]
      .filter((conv) => conv.messages.length > 0 || conv.id === activeId)
      .filter((conv) => {
        if (subjectFilter !== "All" && conv.subject !== subjectFilter) {
          return false;
        }
        if (!q) return true;
        if (conv.title.toLowerCase().includes(q)) return true;
        if (conv.subject.toLowerCase().includes(q)) return true;
        return conv.messages.some((m) => m.content.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt - a.updatedAt;
      });
  }, [conversations, activeId, searchQuery, subjectFilter]);

  const commitRename = (id: string) => {
    const cleaned = draftTitle.trim();
    if (cleaned) {
      onRenameConversation(id, cleaned);
    }
    setEditingId(null);
    setDraftTitle("");
  };

  const requestNewChat = () => {
    if (isGenerating) {
      setPendingSwitchAction({ type: "new" });
      return;
    }
    onCreateNewChat();
    onAfterNavigate?.();
  };

  const requestSelectConversation = (conv: AIConversation) => {
    if (conv.id === activeId) {
      onAfterNavigate?.();
      return;
    }
    if (isGenerating) {
      setPendingSwitchAction({ type: "select", id: conv.id, title: conv.title });
      return;
    }
    onSelectConversation(conv.id);
    onAfterNavigate?.();
  };

  const confirmPendingSwitch = () => {
    if (!pendingSwitchAction) return;
    if (pendingSwitchAction.type === "new") {
      onCreateNewChat();
    } else {
      onSelectConversation(pendingSwitchAction.id);
    }
    setPendingSwitchAction(null);
    onAfterNavigate?.();
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Top Action: Primary New Chat */}
      <div className="shrink-0 px-3 pt-3 pb-2.5 border-b border-white/[0.06] space-y-2.5">
        <button
          type="button"
          onClick={requestNewChat}
          className="flex w-full min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#FFD60A] px-3.5 py-2 text-xs font-bold text-black hover:bg-[#FFD60A]/90 active:scale-[0.985] transition-[transform,background-color] duration-150 cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
          <span>New Study Chat</span>
        </button>

        {/* Search Conversations */}
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved chats..."
            aria-label="Search saved conversations"
            className="h-10 w-full rounded-xl border border-white/10 bg-[#14141B] pl-9 pr-8 text-xs text-white placeholder-neutral-500 focus:border-[#FFD60A] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white cursor-pointer"
            >
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Subject Filter Tabs */}
        <div
          className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5"
          role="group"
          aria-label="Filter chats by subject"
        >
          {HISTORY_SUBJECT_FILTERS.map((subj) => {
            const active = subjectFilter === subj;
            return (
              <button
                key={subj}
                type="button"
                onClick={() => setSubjectFilter(subj)}
                className={`min-h-[30px] rounded-lg px-2.5 py-1 text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? "bg-white text-black font-semibold"
                    : "border border-white/[0.08] bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guard banner preventing accidental interruption of active generation */}
      {pendingSwitchAction && isGenerating && (
        <div
          role="alert"
          className="mx-3 mt-2.5 shrink-0 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs space-y-2 ai-thread-fade"
        >
          <div className="flex items-start gap-2 text-amber-200">
            <AlertCircle size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-snug">
              AI is still generating an answer. Stop generation and{" "}
              {pendingSwitchAction.type === "new"
                ? "start a new chat"
                : `open "${pendingSwitchAction.title}"`}
              ?
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingSwitchAction(null)}
              className="min-h-[34px] rounded-lg border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:text-white cursor-pointer"
            >
              Keep waiting
            </button>
            <button
              type="button"
              onClick={confirmPendingSwitch}
              className="min-h-[34px] rounded-lg bg-[#FFD60A] px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-[#FFD60A]/90 cursor-pointer"
            >
              Stop & switch
            </button>
          </div>
        </div>
      )}

      {/* Independently Scrollable Conversation Thread List */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-2.5 py-2.5 space-y-1.5">
        {nonEmptyCount === 0 && !searchQuery && subjectFilter === "All" ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400">
              <MessageSquare size={18} aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold text-white">
              No saved chats yet
            </p>
            <p className="text-[11px] text-neutral-400 leading-relaxed max-w-[220px]">
              Your Class 9–10 study sessions are stored privately on this device once you ask a question.
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-2.5">
            <Search size={20} className="text-neutral-500" aria-hidden="true" />
            <p className="text-xs font-semibold text-white">
              No matching chats
            </p>
            <p className="text-[11px] text-neutral-400 leading-snug">
              Try another keyword or clear your subject filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSubjectFilter("All");
              }}
              className="min-h-[34px] rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-[#FFD60A] hover:border-[#FFD60A]/50 transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            const isEditing = editingId === conv.id;
            const isConfirmingDelete = confirmDeleteId === conv.id;

            return (
              <div
                key={conv.id}
                className={`group rounded-xl border p-2.5 transition-colors ${
                  isActive
                    ? "border-[#FFD60A]/55 bg-[#FFD60A]/[0.08]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                {isEditing ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      commitRename(conv.id);
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <input
                      type="text"
                      autoFocus
                      maxLength={80}
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setDraftTitle("");
                        }
                      }}
                      aria-label="Conversation title"
                      className="h-9 flex-1 min-w-0 rounded-lg border border-[#FFD60A]/60 bg-black/50 px-2.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Save title"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFD60A] text-black cursor-pointer"
                    >
                      <Check size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setDraftTitle("");
                      }}
                      aria-label="Cancel rename"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => requestSelectConversation(conv)}
                      aria-current={isActive ? "true" : undefined}
                      className="w-full text-left space-y-1 cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[12.5px] font-semibold line-clamp-2 leading-snug ${
                            isActive ? "text-white" : "text-neutral-200 group-hover:text-white"
                          }`}
                        >
                          {conv.title}
                        </span>
                        {conv.pinned && (
                          <Pin
                            size={12}
                            className="mt-0.5 shrink-0 text-[#FFD60A]"
                            aria-label="Pinned"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 tabular-nums">
                        <span>{conv.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span>{conv.messages.length} msgs</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatRelativeDate(conv.updatedAt)}</span>
                      </div>
                    </button>

                    {/* Conversation Actions */}
                    <div
                      className={`mt-2 flex items-center justify-between gap-1 border-t border-white/[0.06] pt-1.5 ${
                        isActive || isConfirmingDelete
                          ? "opacity-100"
                          : "opacity-100 lg:opacity-75 lg:group-hover:opacity-100 lg:focus-within:opacity-100 transition-opacity duration-150"
                      }`}
                    >
                      {isConfirmingDelete ? (
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-[11px] text-red-300">
                            Delete chat?
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteConversation(conv.id);
                                setConfirmDeleteId(null);
                              }}
                              className="min-h-[30px] rounded-lg bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-red-400 cursor-pointer"
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="min-h-[30px] rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-neutral-300 hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(conv.id);
                              setDraftTitle(conv.title);
                              setConfirmDeleteId(null);
                            }}
                            aria-label={`Rename ${conv.title}`}
                            title="Rename chat"
                            className="inline-flex min-h-[32px] items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-neutral-400 hover:bg-white/[0.06] hover:text-white cursor-pointer"
                          >
                            <Pencil size={11} aria-hidden="true" />
                            <span>Rename</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onTogglePinConversation(conv.id)}
                            aria-label={conv.pinned ? `Unpin ${conv.title}` : `Pin ${conv.title}`}
                            title={conv.pinned ? "Unpin chat" : "Pin chat"}
                            className="inline-flex min-h-[32px] items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-neutral-400 hover:bg-white/[0.06] hover:text-[#FFD60A] cursor-pointer"
                          >
                            {conv.pinned ? (
                              <>
                                <PinOff size={11} aria-hidden="true" />
                                <span>Unpin</span>
                              </>
                            ) : (
                              <>
                                <Pin size={11} aria-hidden="true" />
                                <span>Pin</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDeleteId(conv.id);
                              setEditingId(null);
                            }}
                            aria-label={`Delete ${conv.title}`}
                            title="Delete chat"
                            className="inline-flex min-h-[32px] items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-neutral-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 size={11} aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quiet Device Privacy Footer */}
      <div className="shrink-0 border-t border-white/[0.06] px-3.5 py-2.5 text-[11px] text-neutral-500 tabular-nums">
        {nonEmptyCount} saved {nonEmptyCount === 1 ? "session" : "sessions"} · Stored locally on device
      </div>
    </div>
  );
});

export default AIConversationList;
