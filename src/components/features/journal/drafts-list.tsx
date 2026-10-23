"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { JournalDraft } from "@/types";
import { getAllDrafts, deleteDraft, DRAFTS_UPDATED_EVENT } from "@/lib/drafts";
import { Calendar, MapPin, Trash2, Edit3, FileText, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  excited: "✨",
  reflective: "🤔",
  sad: "😢",
  anxious: "😰",
  tired: "🥱",
};

interface DraftsListProps {
  onDraftSelect?: (draft: JournalDraft) => void;
  className?: string;
}

export function DraftsList({ onDraftSelect, className = "" }: DraftsListProps) {
  const router = useRouter();
  const [drafts, setDrafts] = React.useState<JournalDraft[]>([]);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const loadDrafts = React.useCallback(() => {
    setDrafts(getAllDrafts());
  }, []);

  React.useEffect(() => {
    loadDrafts();
    window.addEventListener(DRAFTS_UPDATED_EVENT, loadDrafts);
    return () => window.removeEventListener(DRAFTS_UPDATED_EVENT, loadDrafts);
  }, [loadDrafts]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteDraft(id);
    loadDrafts();
  };

  const handleOpenDraft = (draft: JournalDraft) => {
    if (onDraftSelect) {
      onDraftSelect(draft);
    } else {
      const url = draft.editMemoryId
        ? `/journal/new?edit=${draft.editMemoryId}&draftId=${draft.id}`
        : `/journal/new?draftId=${draft.id}`;
      router.push(url);
    }
  };

  const formatSavedTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      const now = Date.now();
      const diffMinutes = Math.floor((now - timestamp) / 60000);
      
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "Saved";
    }
  };

  if (drafts.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
        <div className="w-16 h-16 rounded-full bg-muted/70 flex items-center justify-center mb-4 text-muted-foreground/60">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium tracking-tight mb-1">No drafts right now</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          When you write in your journal, unfinished entries will automatically save here every 10 seconds.
        </p>
        <button
          onClick={() => router.push("/journal/new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Start a new entry</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <AnimatePresence mode="popLayout">
        {drafts.map((draft) => {
          const moodEmoji = draft.mood ? MOOD_EMOJIS[draft.mood] : null;

          return (
            <motion.div
              key={draft.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => handleOpenDraft(draft)}
              className="group relative p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-xs cursor-pointer hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {moodEmoji && (
                    <span className="text-lg shrink-0" title={`Mood: ${draft.mood}`}>
                      {moodEmoji}
                    </span>
                  )}
                  <h4 className="font-semibold text-base tracking-tight truncate text-foreground group-hover:text-primary transition-colors">
                    {draft.title.trim() || "Untitled thought..."}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-medium text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded-full">
                    {formatSavedTime(draft.updatedAt)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, draft.id)}
                    aria-label="Delete draft"
                    className="p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {draft.description ? (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                  {draft.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/40 italic mb-3">
                  (Empty draft)
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 opacity-60" />
                    {draft.memoryDate}
                  </span>
                  {draft.location && (
                    <span className="flex items-center gap-1 truncate max-w-[130px]">
                      <MapPin className="w-3 h-3 opacity-60" />
                      {draft.location}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 font-medium text-primary text-[11px] group-hover:translate-x-0.5 transition-transform">
                  <Edit3 className="w-3 h-3" />
                  Continue writing
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
