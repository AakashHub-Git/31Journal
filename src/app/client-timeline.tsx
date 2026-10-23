"use client";

import * as React from "react";
import { MemoryMasonry } from "@/components/features/memory-masonry";
import { DraftsList } from "@/components/features/journal/drafts-list";
import { Search, Sparkles } from "lucide-react";
import { Mood } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { getAllDrafts, DRAFTS_UPDATED_EVENT } from "@/lib/drafts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ClientTimeline({ memories }: { memories: any[] }) {
  const [activeView, setActiveView] = React.useState<"memories" | "drafts">("memories");
  const [draftsCount, setDraftsCount] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [moodFilter, setMoodFilter] = React.useState<Mood | "all">("all");
  const [dateFilter, setDateFilter] = React.useState(""); // YYYY-MM

  // Keep drafts count reactive to additions and deletions
  const updateDraftsCount = React.useCallback(() => {
    setDraftsCount(getAllDrafts().length);
  }, []);

  React.useEffect(() => {
    updateDraftsCount();
    window.addEventListener(DRAFTS_UPDATED_EVENT, updateDraftsCount);
    return () => window.removeEventListener(DRAFTS_UPDATED_EVENT, updateDraftsCount);
  }, [updateDraftsCount]);

  // Helper to map DB memory to MemoryCard props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapMemory = (memory: any) => ({
    id: memory.id,
    title: memory.title || "",
    description: memory.description || "",
    date: memory.memory_date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    photos: (memory.memory_media || []).filter((m: any) => m.type === 'image').map((m: any) => ({
      id: m.id,
      url: m.url,
      width: 800,
      height: 800,
      dateAdded: memory.memory_date
    })),
    videos: [],
    mood: memory.mood as Mood | undefined,
    location: memory.location,
    tags: [],
    isFavorite: memory.is_favorite
  });

  const filteredMemories = React.useMemo(() => {
    return memories
      .map(mapMemory)
      .filter((m) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = m.title.toLowerCase().includes(query);
          const matchesDesc = m.description.toLowerCase().includes(query);
          const matchesLocation = m.location?.toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc && !matchesLocation) return false;
        }

        if (moodFilter !== "all" && m.mood !== moodFilter) {
          return false;
        }

        if (dateFilter) {
          if (!m.date.startsWith(dateFilter)) return false;
        }

        return true;
      });
  }, [memories, searchQuery, moodFilter, dateFilter]);

  const MOODS: { value: Mood; emoji: string }[] = [
    { value: "happy", emoji: "😊" },
    { value: "calm", emoji: "😌" },
    { value: "excited", emoji: "✨" },
    { value: "reflective", emoji: "🤔" },
    { value: "sad", emoji: "😢" },
    { value: "anxious", emoji: "😰" },
    { value: "tired", emoji: "🥱" },
  ];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6"
    >
      {/* View Switcher: Memories vs Drafts */}
      <motion.div variants={staggerItem} className="flex justify-start">
        <div className="inline-flex p-1 bg-muted/70 rounded-full border border-border/50 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveView("memories")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeView === "memories"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Memories ({memories.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveView("drafts")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === "drafts"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Drafts</span>
            {draftsCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                {draftsCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeView === "drafts" ? (
          <motion.section
            key="drafts-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-between items-end pl-1">
              <div>
                <h2 className="text-xl font-medium tracking-tight">Saved Drafts</h2>
                <p className="text-xs text-muted-foreground">Auto-saved while you write</p>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{draftsCount} drafts</span>
            </div>

            <DraftsList />
          </motion.section>
        ) : (
          <motion.div
            key="memories-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-8"
          >
            {/* Filters & Search */}
            <motion.section variants={staggerItem} className="flex flex-col gap-4 bg-card rounded-2xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 border border-border/50 focus-within:border-primary/50 focus-within:bg-background transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search memories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-sm w-full"
                />
              </div>

              <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-none">
                <input 
                  type="month" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-xs bg-muted/50 border border-border/50 rounded-full px-3 py-1.5 focus:outline-none focus:border-primary/50 text-muted-foreground"
                />
                
                <button 
                  onClick={() => setMoodFilter("all")}
                  className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${moodFilter === "all" ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted"}`}
                >
                  All Moods
                </button>
                {MOODS.map((m) => (
                  <button 
                    key={m.value}
                    onClick={() => setMoodFilter(m.value)}
                    className={`text-sm px-2 py-1 rounded-full transition-colors ${moodFilter === m.value ? "bg-primary text-white" : "bg-muted/50 border border-border/50 hover:bg-muted"}`}
                    title={m.value}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Grid */}
            <motion.section variants={staggerItem} className="flex flex-col gap-4">
              <div className="flex justify-between items-end pl-1">
                <h2 className="text-xl font-medium tracking-tight">Your Timeline</h2>
                <span className="text-xs text-muted-foreground font-medium">{filteredMemories.length} entries</span>
              </div>
              
              <MemoryMasonry memories={filteredMemories} />
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
