"use client";

import * as React from "react";
import { Sparkles, Trash2, X } from "lucide-react";

interface DraftBannerProps {
  updatedAt: number;
  onDiscard: () => void;
  onDismiss: () => void;
}

export function DraftBanner({
  updatedAt,
  onDiscard,
  onDismiss,
}: DraftBannerProps) {
  const dateStr = React.useMemo(() => {
    try {
      const date = new Date(updatedAt);
      const isToday = new Date().toDateString() === date.toDateString();
      const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      return isToday ? `Today at ${time}` : `${date.toLocaleDateString([], { month: "short", day: "numeric" })} at ${time}`;
    } catch {
      return "earlier";
    }
  }, [updatedAt]);

  return (
    <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground text-xs sm:text-sm truncate">
            Restored unfinished draft
          </p>
          <p className="text-[11px] text-muted-foreground">
            Saved {dateStr}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onDiscard}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-full transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          <span>Discard</span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
