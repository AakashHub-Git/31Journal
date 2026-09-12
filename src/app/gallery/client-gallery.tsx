"use client";

import * as React from "react";
import { PageHeader } from "@/components/features/page-header";
import { PhotoMemory } from "@/components/features/memory/photo-memory";
import { PhotoViewer } from "@/components/features/memory/photo-viewer";
import { Search } from "lucide-react";
import { Mood, Photo } from "@/types";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

export interface GalleryPhoto extends Photo {
  memoryTitle?: string;
  memoryDescription?: string;
  memoryLocation?: string;
  mood?: Mood;
  memoryDate?: string;
}

export function ClientGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [activePhoto, setActivePhoto] = React.useState<Photo | null>(null);
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [moodFilter, setMoodFilter] = React.useState<Mood | "all">("all");
  const [dateFilter, setDateFilter] = React.useState(""); // YYYY-MM

  const filteredPhotos = React.useMemo(() => {
    return photos.filter((p) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.memoryTitle?.toLowerCase().includes(query);
        const matchesDesc = p.memoryDescription?.toLowerCase().includes(query);
        const matchesLocation = p.memoryLocation?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLocation) return false;
      }

      // Mood
      if (moodFilter !== "all" && p.mood !== moodFilter) {
        return false;
      }

      // Date
      if (dateFilter) {
        if (!p.memoryDate?.startsWith(dateFilter)) return false;
      }

      return true;
    });
  }, [photos, searchQuery, moodFilter, dateFilter]);

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
      <PageHeader title="Gallery" subtitle="All your captured moments" />

      <motion.main 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-6 flex flex-col gap-8 mt-6"
      >
        {/* Filters & Search */}
        <motion.section variants={staggerItem} className="flex flex-col gap-4 bg-card rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 border border-border/50 focus-within:border-primary/50 focus-within:bg-background transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search photos..." 
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

        {/* Gallery Grid */}
        <motion.section variants={staggerItem}>
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
      </motion.main>

      <PhotoViewer photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </div>
  );
}
