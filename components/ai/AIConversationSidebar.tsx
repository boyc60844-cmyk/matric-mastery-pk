"use client";

import React, { memo } from "react";
import { PanelLeftClose } from "lucide-react";
import AIConversationList, {
  AIConversationListProps,
} from "@/components/ai/AIConversationList";

interface AIConversationSidebarProps extends AIConversationListProps {
  isOpen: boolean;
  onCollapse: () => void;
}

const AIConversationSidebar = memo(function AIConversationSidebar({
  isOpen,
  onCollapse,
  conversations,
  activeId,
  isGenerating = false,
  onSelectConversation,
  onCreateNewChat,
  onRenameConversation,
  onTogglePinConversation,
  onDeleteConversation,
}: AIConversationSidebarProps) {
  if (!isOpen) return null;

  return (
    <aside
      aria-label="Conversation history sidebar"
      className="hidden lg:flex h-full w-[268px] xl:w-[280px] shrink-0 flex-col border-r border-white/[0.08] bg-[#0D0D11] ai-thread-fade"
    >
      {/* Sidebar Header */}
      <div className="flex h-[54px] shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] px-3.5">
        <span className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-300">
          Study Chats
        </span>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-neutral-400 hover:border-white/20 hover:text-white transition-colors cursor-pointer"
        >
          <PanelLeftClose size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Shared Conversation Navigation List */}
      <AIConversationList
        conversations={conversations}
        activeId={activeId}
        isGenerating={isGenerating}
        onSelectConversation={onSelectConversation}
        onCreateNewChat={onCreateNewChat}
        onRenameConversation={onRenameConversation}
        onTogglePinConversation={onTogglePinConversation}
        onDeleteConversation={onDeleteConversation}
      />
    </aside>
  );
});

export default AIConversationSidebar;
