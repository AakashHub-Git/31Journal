"use client";

import * as React from "react";
import Link from "next/link";
import { MemoryMasonry } from "@/components/features/memory-masonry";
import { IconButton } from "@/components/ui/icon-button";
import { Settings, Plus } from "lucide-react";
import { Mood } from "@/types";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { MemoryCard } from "@/components/features/memory/memory-card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ClientHome({ memories, userName }: { memories: any[], userName: string }) {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  const recentMemories = memories.slice(0, 3);
  
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();

  const onThisDayMemories = memories.filter(memory => {
    if (!memory.memory_date) return false;
    const parts = memory.memory_date.split('-');
    if (parts.length !== 3) return false;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    return month === currentMonth && day === currentDay && year < currentYear;
  });

  const onThisDayMemory = onThisDayMemories.length > 0 ? onThisDayMemories[0] : undefined;

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

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* Top Header */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-start">
        <div className="flex-1" />
        <Link href="/profile">
          <IconButton variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </IconButton>
        </Link>
      </header>

      <motion.main 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-6 flex flex-col gap-10"
      >
        
        {/* 1. Greeting */}
        <motion.section variants={staggerItem} className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-1">
              Hiii, {userName}.
            </h1>
            <p className="font-handwriting text-2xl text-primary/80">
              {dateString}
            </p>
          </div>
        </motion.section>

        {/* 2. Primary Action */}
        <motion.section variants={staggerItem}>
          <Link href="/journal/new" className="block w-full">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary border-2 border-primary/20 rounded-xl p-4 flex items-center justify-center gap-3 transition-colors hover:bg-primary/90 text-white shadow-paper"
            >
              <Plus className="w-6 h-6" />
              <h2 className="text-lg font-medium">Add a cute memory</h2>
            </motion.div>
          </Link>
        </motion.section>

        {/* 3. Recent Memories */}
        <motion.section variants={staggerItem} className="flex flex-col gap-4">
          <div className="flex justify-between items-end pl-1">
            <h2 className="text-xl font-medium tracking-tight">Recent Memories</h2>
            <Link href="/journal" className="text-xs text-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          
          {recentMemories.length > 0 ? (
            <MemoryMasonry memories={recentMemories.map(mapMemory)} />
          ) : (
            <div className="py-8 border border-border/50 rounded-xl text-center bg-card">
              <p className="text-muted-foreground font-handwriting text-xl">
                Your diary awaits its first memory.
              </p>
            </div>
          )}
        </motion.section>

        {/* 4. On This Day */}
        <motion.section variants={staggerItem} className="flex flex-col gap-4">
          <h2 className="text-xl font-medium tracking-tight pl-1">On this day</h2>
          
          {onThisDayMemory ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-primary uppercase tracking-widest pl-1">
                {currentYear - parseInt(onThisDayMemory.memory_date.split('-')[0], 10)} year(s) ago
              </p>
              <MemoryCard memory={mapMemory(onThisDayMemory)} priority={true} />
            </div>
          ) : (
            <div className="py-8 bg-secondary/10 rounded-xl border border-secondary/20 text-center px-4">
              <p className="text-muted-foreground font-handwriting text-xl leading-relaxed">
                This space will hold your memories from today, next year.
              </p>
            </div>
          )}
        </motion.section>

      </motion.main>
    </div>
  );
}
