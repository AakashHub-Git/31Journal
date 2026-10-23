"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { DraftsList } from "@/components/features/journal/drafts-list";

export default function DraftsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background">
      <header className="px-4 pt-12 pb-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <IconButton variant="ghost" onClick={() => router.back()} className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Your Drafts</h1>
            <p className="text-xs text-muted-foreground">Unfinished thoughts & memories</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/journal/new")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>
      </header>

      <main className="px-6 py-6 flex-1">
        <DraftsList />
      </main>
    </div>
  );
}
