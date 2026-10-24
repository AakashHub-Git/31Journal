"use client";

import * as React from "react";
import Link from "next/link";
import { MemoryMasonry } from "@/components/features/memory-masonry";
import { IconButton } from "@/components/ui/icon-button";
import { Settings, Plus, Mic, Trophy, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Mood, DreamItem } from "@/types";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { MemoryCard } from "@/components/features/memory/memory-card";
import { MonthlyWrappedCard } from "@/components/features/ai/monthly-wrapped-card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ClientHome({
  memories,
  userName,
  dreams = [],
}: {
  memories: any[];
  userName: string;
  dreams?: DreamItem[];
}) {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const recentMemories = memories.slice(0, 3);

  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();

  const onThisDayMemories = memories.filter((memory) => {
    if (!memory.memory_date) return false;
    const parts = memory.memory_date.split("-");
    if (parts.length !== 3) return false;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    return month === currentMonth && day === currentDay && year < currentYear;
  });

  const onThisDayMemory = onThisDayMemories.length > 0 ? onThisDayMemories[0] : undefined;

  // Count total voice tapes
  const voiceTapesCount = React.useMemo(() => {
    let count = 0;
    memories.forEach((memory) => {
      (memory.memory_media || []).forEach((m: any) => {
        if (
          m.url?.includes("audio_") ||
          m.url?.endsWith(".webm") ||
          m.url?.endsWith(".mp3") ||
          m.url?.endsWith(".m4a")
        ) {
          count++;
        }
      });
    });
    return count;
  }, [memories]);

  // Dream Board completion stats
  const completedDreamsCount = dreams.filter((d) => d.is_completed).length;

  // Helper to map DB memory to MemoryCard props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapMemory = (memory: any) => ({
    id: memory.id,
    title: memory.title || "",
    description: memory.description || "",
    date: memory.memory_date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    photos: (memory.memory_media || [])
      .filter(
        (m: any) =>
          !m.url?.includes("audio_") &&
          !m.url?.endsWith(".webm") &&
          !m.url?.endsWith(".mp3") &&
          !m.url?.endsWith(".m4a") &&
          m.type === "image"
      )
      .map((m: any) => ({
        id: m.id,
        url: m.url,
        width: 800,
        height: 800,
        dateAdded: memory.memory_date,
      })),
    videos: [],
    mood: memory.mood as Mood | undefined,
    location: memory.location,
    tags: [],
    isFavorite: memory.is_favorite,
  });

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* Top Header */}
      <header className="px-6 pt-12 pb-3 flex justify-between items-start">
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
        className="px-6 flex flex-col gap-6"
      >
        {/* 1. Greeting */}
        <motion.section variants={staggerItem} className="flex flex-col">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-0.5">
            Hiii, {userName}.
          </h1>
          <p className="font-handwriting text-2xl text-primary/80">
            {dateString}
          </p>
        </motion.section>

        {/* 2. PRIORITY: Create Journal Entry Button */}
        <motion.section variants={staggerItem}>
          <Link href="/journal/new" className="block w-full group">
            <motion.div
              whileHover={{ scale: 0.985 }}
              whileTap={{ scale: 0.96 }}
              className="w-full bg-primary text-primary-foreground rounded-3xl p-5 flex items-center justify-between shadow-md transition-all cursor-pointer border-2 border-primary/20"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 dark:bg-black/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <Plus className="w-6 h-6 text-white stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">Write in Journal</h2>
                  <p className="text-xs text-primary-foreground/80 mt-0.5">
                    Capture today&apos;s memories & voice notes ✨
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 bg-white/20 rounded-full shrink-0">
                <span>New Entry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          </Link>
        </motion.section>

        {/* 3. Compact Quick-Access Buttons: Voice Tapes & Dream Board */}
        <motion.section variants={staggerItem} className="grid grid-cols-2 gap-3">
          {/* Voice Tapes Button */}
          <Link href="/gallery?tab=tapes" className="group block">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="p-3.5 rounded-2xl bg-card border border-border/70 hover:border-rose-300 dark:hover:border-rose-800/60 shadow-xs hover:shadow-sm transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground truncate">
                    Mixtape
                  </h3>
                  {voiceTapesCount > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.2 rounded-full shrink-0">
                      {voiceTapesCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {voiceTapesCount === 1 ? "1 voice tape" : `${voiceTapesCount} voice tapes`}
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Dream Board Button */}
          <Link href="/dreams" className="group block">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="p-3.5 rounded-2xl bg-card border border-border/70 hover:border-amber-300 dark:hover:border-amber-800/60 shadow-xs hover:shadow-sm transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground truncate">
                    Dream Board
                  </h3>
                  {dreams.length > 0 && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.2 rounded-full shrink-0">
                      {completedDreamsCount}/{dreams.length}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Bucket list & goals
                </p>
              </div>
            </motion.div>
          </Link>
        </motion.section>

        {/* 4. Monthly Wrapped */}
        <motion.section variants={staggerItem}>
          <MonthlyWrappedCard />
        </motion.section>

        {/* 5. Recent Memories */}
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
            <div className="py-8 border border-border/50 rounded-2xl text-center bg-card">
              <p className="text-muted-foreground font-handwriting text-xl">
                Your diary awaits its first memory.
              </p>
            </div>
          )}
        </motion.section>

        {/* 6. On This Day */}
        <motion.section variants={staggerItem} className="flex flex-col gap-4">
          <h2 className="text-xl font-medium tracking-tight pl-1">On this day</h2>

          {onThisDayMemory ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-primary uppercase tracking-widest pl-1">
                A trip down memory lane
              </p>
              <MemoryCard memory={mapMemory(onThisDayMemory)} priority />
            </div>
          ) : (
            <div className="py-8 border border-border/50 rounded-2xl text-center bg-card">
              <p className="text-muted-foreground font-handwriting text-xl">
                No past memories for this day yet.
              </p>
            </div>
          )}
        </motion.section>
      </motion.main>
    </div>
  );
}
