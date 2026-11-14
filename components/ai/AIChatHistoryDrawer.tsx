"use client";

import React, { useMemo, useState } from "react";
import {
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

interface AIChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: AIConversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  onCreateNewChat: () => void;
  onRenameConversation: (id: string, nextTitle: string) => void;
  onTogglePinConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
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

export default function AIChatHistoryDrawer({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelectConversation,
  onCreateNewChat,
  onRenameConversation,
  onTogglePinConversation,
  onDeleteConversation,
}: AIChatHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  if (!isOpen) return null;

  const commitRename = (id: string) => {
    const cleaned = draftTitle.trim();
    if (cleaned) {
      onRenameConversation(id, cleaned);
    }
    setEditingId(null);
    setDraftTitle("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Saved AI conversations"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside className="flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#0F0F14] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] px-4 py-3.5">
          <div>
            <h2 className="font-heading text-sm font-bold text-white">
              Saved Study Chats
            </h2>
            <p className="text-[11px] text-neutral-400 tabular-nums">
              {nonEmptyCount} saved on this device
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onCreateNewChat();
                onClose();
              }}
              className="inline-flex min-h-[38px] items-center gap-1 rounded-xl bg-[#FFD60A] px-3 py-1.5 text-xs font-semibold text-black hover:bg-[#FFD60A]/90 transition-colors cursor-pointer"
            >
              <Plus size={14} aria-hidden="true" />
              <span>New Chat</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat history"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Search & Subject Filter */}
        <div className="space-y-2.5 border-b border-white/[0.06] px-4 py-3">
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
              placeholder="Search titles or messages..."
              aria-label="Search saved conversations"
              className="h-10 w-full rounded-xl border border-white/12 bg-[#16161D] pl-9 pr-8 text-xs text-white placeholder-neutral-500 focus:border-[#FFD60A] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>

          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
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
                      ? "bg-[#FFD60A] text-black font-semibold"
                      : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:text-white"
                  }`}
                >
                  {subj}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain px-3 py-3 space-y-2">
          {nonEmptyCount === 0 && !searchQuery && subjectFilter === "All" ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center space-y-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-neutral-400">
                <MessageSquare size={20} aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-white">
                No saved conversations yet
              </p>
              <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                Ask your first Class 9–10 question in the tutor and your threads will appear here for easy review, pinning, and renaming.
              </p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center space-y-2.5">
              <Search size={24} className="text-neutral-500" aria-hidden="true" />
              <p className="text-sm font-semibold text-white">
                No matching conversations
              </p>
              <p className="text-xs text-neutral-400">
                No chats matched your current search or subject filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSubjectFilter("All");
                }}
                className="min-h-[36px] rounded-xl border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-[#FFD60A] hover:border-[#FFD60A]/50 transition-colors cursor-pointer"
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
                  className={`rounded-xl border p-3 transition-colors ${
                    isActive
                      ? "border-[#FFD60A]/60 bg-[#FFD60A]/[0.08]"
                      : "border-white/10 bg-[#14141B] hover:border-white/20"
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
                        onClick={() => {
                          onSelectConversation(conv.id);
                          onClose();
                        }}
                        className="w-full text-left space-y-1 cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[13px] font-semibold text-white line-clamp-2 leading-snug">
                            {conv.title}
                          </span>
                          {conv.pinned && (
                            <Pin
                              size={13}
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

                      {/* Action bar */}
                      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2">
                        {isConfirmingDelete ? (
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="text-[11px] text-red-300">
                              Delete this chat?
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteConversation(conv.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="min-h-[32px] rounded-lg bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-red-400 cursor-pointer"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="min-h-[32px] rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-neutral-300 hover:text-white cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(conv.id);
                                setDraftTitle(conv.title);
                                setConfirmDeleteId(null);
                              }}
                              aria-label={`Rename ${conv.title}`}
                              title="Rename chat"
                              className="inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-neutral-300 hover:bg-white/[0.06] hover:text-white cursor-pointer"
                            >
                              <Pencil size={12} aria-hidden="true" />
                              <span>Rename</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onTogglePinConversation(conv.id)}
                              aria-label={conv.pinned ? `Unpin ${conv.title}` : `Pin ${conv.title}`}
                              title={conv.pinned ? "Unpin chat" : "Pin chat"}
                              className="inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-neutral-300 hover:bg-white/[0.06] hover:text-[#FFD60A] cursor-pointer"
                            >
                              {conv.pinned ? (
                                <>
                                  <PinOff size={12} aria-hidden="true" />
                                  <span>Unpin</span>
                                </>
                              ) : (
                                <>
                                  <Pin size={12} aria-hidden="true" />
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
                              className="inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-neutral-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 size={12} aria-hidden="true" />
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
      </aside>
    </div>
  );
}
