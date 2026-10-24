"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DreamCategory, DreamItem } from "@/types";
import { DreamCard } from "@/components/features/dreams/dream-card";
import { CompleteDreamModal } from "@/components/features/dreams/complete-dream-modal";
import { NewDreamModal } from "@/components/features/dreams/new-dream-modal";
import { uncompleteDreamItem, deleteDreamItem } from "@/app/actions/dreams";
import { ArrowLeft, Plus, Sparkles, Trophy, Heart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { motion, AnimatePresence } from "framer-motion";

interface ClientDreamsProps {
  initialDreams: DreamItem[];
}

const CATEGORY_TABS: Array<{ id: "all" | DreamCategory; label: string; emoji: string }> = [
  { id: "all", label: "All Dreams", emoji: "✨" },
  { id: "adventures", label: "Adventures", emoji: "☕" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "food", label: "Food", emoji: "🍰" },
  { id: "goals", label: "Goals", emoji: "🌟" },
];

export function ClientDreams({ initialDreams }: ClientDreamsProps) {
  const router = useRouter();
  const [dreams, setDreams] = React.useState<DreamItem[]>(initialDreams);
  const [activeCategory, setActiveCategory] = React.useState<"all" | DreamCategory>("all");
  
  // Modals state
  const [dreamToComplete, setDreamToComplete] = React.useState<DreamItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false);

  const total = dreams.length;
  const completedCount = dreams.filter((d) => d.is_completed).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const filteredDreams = React.useMemo(() => {
    let list = dreams;
    if (activeCategory !== "all") {
      list = list.filter((d) => d.category === activeCategory);
    }
    // Sort uncompleted first, then completed by completion date or created date
    return list.slice().sort((a, b) => {
      if (a.is_completed !== b.is_completed) {
        return a.is_completed ? 1 : -1;
      }
      return 0;
    });
  }, [dreams, activeCategory]);

  const handleOpenCompleteModal = (dream: DreamItem) => {
    setDreamToComplete(dream);
  };

  const handleCompleteSuccess = (updatedDream: DreamItem) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === updatedDream.id ? updatedDream : d))
    );
  };

  const handleUncomplete = async (dream: DreamItem) => {
    try {
      setDreams((prev) =>
        prev.map((d) => (d.id === dream.id ? { ...d, is_completed: false, photo_url: undefined } : d))
      );
      await uncompleteDreamItem(dream.id);
    } catch (err) {
      console.error("Failed to uncomplete:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDreams((prev) => prev.filter((d) => d.id !== id));
      await deleteDreamItem(id);
    } catch (err) {
      console.error("Failed to delete dream:", err);
    }
  };

  const handleNewDreamSuccess = (newDream: DreamItem) => {
    setDreams((prev) => [newDream, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background">
      {/* Top Header */}
      <header className="px-4 pt-12 pb-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 flex items-center justify-between border-b border-border/30 gap-2">
        <div className="flex items-center gap-2">
          <IconButton variant="ghost" onClick={() => router.back()} className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-1.5">
              <span>Dream Board</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>
            <p className="text-xs text-muted-foreground">Our shared bucket list</p>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dream</span>
        </button>
      </header>

      <main className="px-6 py-6 flex flex-col gap-6 max-w-lg mx-auto w-full">
        {/* Progress Tracker Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50/80 via-rose-50/80 to-pink-50/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-stone-900 border border-amber-200/60 dark:border-amber-900/40 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Trophy Progress</p>
              <h3 className="font-semibold text-base text-foreground">
                {completedCount} of {total} Unlocked
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-2xl font-bold text-primary">
              {progressPercent}%
            </span>
            <p className="text-[10px] text-muted-foreground">Dreams achieved</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dreams Grid */}
        {filteredDreams.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No dreams in this category yet</h3>
            <p className="text-xs max-w-xs mb-5">
              Add your next adventure, cafe to try, or place to visit!
            </p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Add a dream</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredDreams.map((dream) => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onCheck={handleOpenCompleteModal}
                  onUncheck={handleUncomplete}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Complete Dream Polaroid Modal */}
      <CompleteDreamModal
        dream={dreamToComplete}
        onClose={() => setDreamToComplete(null)}
        onSuccess={handleCompleteSuccess}
      />

      {/* New Dream Modal */}
      <NewDreamModal
        open={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={handleNewDreamSuccess}
      />
    </div>
  );
}
