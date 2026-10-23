"use client";

import * as React from "react";
import { DraftStatus } from "@/hooks/use-journal-draft";
import { Check, Sparkles, Loader2 } from "lucide-react";

interface DraftStatusBadgeProps {
  status: DraftStatus;
  lastSaved: Date | null;
  onSaveNow?: () => void;
  className?: string;
}

export function DraftStatusBadge({
  status,
  lastSaved,
  onSaveNow,
  className = "",
}: DraftStatusBadgeProps) {
  if (status === "idle") return null;

  const formattedTime = lastSaved
    ? lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null;

  return (
    <button
      type="button"
      onClick={onSaveNow}
      title={onSaveNow ? "Click to save draft now" : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        status === "saving"
          ? "bg-amber-100/70 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          : "bg-emerald-100/60 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100"
      } ${className}`}
    >
      {status === "saving" ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Saving draft...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span>Draft saved{formattedTime ? ` at ${formattedTime}` : ""}</span>
        </>
      )}
    </button>
  );
}
