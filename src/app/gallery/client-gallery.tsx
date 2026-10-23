"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/features/page-header";
import { PhotoMemory } from "@/components/features/memory/photo-memory";
import { PhotoViewer } from "@/components/features/memory/photo-viewer";
import { CassettePlayer } from "@/components/features/audio/cassette-player";
import { Search, ExternalLink, Mic } from "lucide-react";
import { Mood, Photo } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

export interface GalleryPhoto extends Photo {
  memoryTitle?: string;
  memoryDescription?: string;
  memoryLocation?: string;
  mood?: Mood;
  memoryDate?: string;
}

export interface GalleryVoiceTape {
  id: string;
  url: string;
  memoryId: string;
  memoryTitle: string;
  memoryDate: string;
  mood?: string;
  location?: string;
}

const TAPE_COLORS: ("pink" | "mint" | "lavender" | "cream")[] = ["pink", "mint", "lavender", "cream"];

export function ClientGallery({
  photos,
  voiceTapes = [],
}: {
  photos: GalleryPhoto[];
  voiceTapes?: GalleryVoiceTape[];
}) {
  const [activeTab, setActiveTab] = React.useState<"photos" | "tapes">("photos");
  const [activePhoto, setActivePhoto] = React.useState<Photo | null>(null);
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [moodFilter, setMoodFilter] = React.useState<Mood | "all">("all");
  const [dateFilter, setDateFilter] = React.useState(""); // YYYY-MM

  const filteredPhotos = React.useMemo(() => {
    return photos.filter((p) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.memoryTitle?.toLowerCase().includes(query);
        const matchesDesc = p.memoryDescription?.toLowerCase().includes(query);
        const matchesLocation = p.memoryLocation?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLocation) return false;
      }

      if (moodFilter !== "all" && p.mood !== moodFilter) {
        return false;
      }

      if (dateFilter) {
        if (!p.memoryDate?.startsWith(dateFilter)) return false;
      }

      return true;
    });
  }, [photos, searchQuery, moodFilter, dateFilter]);

  const filteredTapes = React.useMemo(() => {
    return voiceTapes.filter((t) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.memoryTitle?.toLowerCase().includes(query);
        const matchesLocation = t.location?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation) return false;
      }
      if (dateFilter) {
        if (!t.memoryDate?.startsWith(dateFilter)) return false;
      }
      return true;
    });
  }, [voiceTapes, searchQuery, dateFilter]);

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
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <PageHeader title="Gallery" subtitle="All your captured moments & voice tapes" />

      <motion.main 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-6 flex flex-col gap-6 mt-4"
      >
        {/* Tab Switcher: Photos vs Voice Tapes */}
        <motion.div variants={staggerItem} className="flex justify-start">
          <div className="inline-flex p-1 bg-muted/70 rounded-full border border-border/50 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("photos")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "photos"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Photos ({photos.length})
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab("tapes")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "tapes"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-rose-500" />
              <span>Voice Tapes</span>
              {voiceTapes.length > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-bold">
                  {voiceTapes.length}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.section variants={staggerItem} className="flex flex-col gap-4 bg-card rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 border border-border/50 focus-within:border-primary/50 focus-within:bg-background transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={activeTab === "photos" ? "Search photos..." : "Search voice tapes..."} 
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
            
            {activeTab === "photos" && (
              <>
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
              </>
            )}
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {activeTab === "tapes" ? (
            /* Voice Tapes Section */
            <motion.section
              key="tapes-grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-4"
            >
              {filteredTapes.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-3">
                    <Mic className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">No voice tapes yet</h3>
                  <p className="text-sm max-w-xs mb-5">
                    Record a sweet voice note in your journal to start building Sweety&apos;s Mixtape.
                  </p>
                  <Link
                    href="/journal/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition-colors shadow-sm"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Record your first tape</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {filteredTapes.map((tape, idx) => {
                    const color = TAPE_COLORS[idx % TAPE_COLORS.length];
                    return (
                      <div key={tape.id} className="flex flex-col gap-2">
                        <CassettePlayer
                          audioUrl={tape.url}
                          title={tape.memoryTitle}
                          date={tape.memoryDate}
                          tapeColor={color}
                        />
                        <div className="flex justify-end px-2">
                          <Link
                            href={`/journal/${tape.memoryId}`}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <span>Open Memory</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          ) : (
            /* Photos Grid */
            <motion.section
              key="photos-grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {filteredPhotos.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground font-handwriting text-2xl">
                  No photos found.
                </div>
              ) : (
                <div className="columns-2 gap-4">
                  {filteredPhotos.map((photo, i) => {
                    const isLandscape = (photo.width || 1) > (photo.height || 1);
                    const aspectRatio = isLandscape ? "landscape" : "portrait";
                    
                    return (
                      <div key={photo.id} className="mb-4 break-inside-avoid">
                        <PhotoMemory 
                          photo={photo} 
                          aspectRatio={aspectRatio}
                          priority={i < 4}
                          onClick={() => setActivePhoto(photo)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </motion.main>

      <PhotoViewer photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </div>
  );
}
