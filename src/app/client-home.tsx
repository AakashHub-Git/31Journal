"use client";

import * as React from "react";
import Link from "next/link";
import { MoodSelector } from "@/components/features/mood-selector";
import { MemoryCard } from "@/components/features/memory/memory-card";
import { IconButton } from "@/components/ui/icon-button";
import { Settings, Plus } from "lucide-react";
import { Mood } from "@/types";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ClientHome({ memories, userName }: { memories: any[], userName: string }) {
  const [mood, setMood] = React.useState<Mood | undefined>(undefined);
  
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  const recentMemories = memories.slice(0, 3);
  const hasMemories = recentMemories.length > 0;
  const onThisDayMemory = undefined;

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
        className="px-8 flex flex-col gap-14"
      >
        
        {/* 1. Greeting & Mood */}
        <motion.section variants={staggerItem} className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">
              Good morning, {userName}.
            </h1>
            <p className="font-handwriting text-2xl text-primary/80">
              {dateString}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium text-muted-foreground">How are you feeling today?</h2>
            <MoodSelector value={mood} onChange={setMood} />
          </div>
        </motion.section>

        {/* 2. Primary Action */}
        <motion.section variants={staggerItem}>
          <Link href="/journal/new" className="block w-full">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary/10 border border-primary/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 transition-colors hover:bg-primary/15"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-paper">
                <Plus className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-medium text-primary">Add today&apos;s little moment</h2>
            </motion.div>
          </Link>
        </motion.section>

        {/* 3. Recent Memories */}
        <motion.section variants={staggerItem} className="flex flex-col gap-6">
          <h2 className="text-2xl font-medium tracking-tight">Your little moments</h2>
          
          {hasMemories ? (
            <div className="flex flex-col gap-10">
              {recentMemories.map((memory) => {
                // Map the DB memory to what MemoryCard expects
                const mappedMemory = {
                  id: memory.id,
                  title: memory.title || "",
                  description: memory.description || "",
                  date: memory.memory_date,
                  photos: (memory.memory_media || []).filter((m: { type: string }) => m.type === 'image').map((m: { id: string, url: string }) => ({
                    id: m.id,
                    url: m.url,
                    width: 800,
                    height: 800
                  })),
                  videos: [],
                  mood: memory.mood as Mood | undefined,
                  location: memory.location,
                  tags: [],
                  isFavorite: memory.is_favorite
                };
                return <MemoryCard key={memory.id} memory={mappedMemory} />;
              })}
            </div>
          ) : (
            <div className="py-8 border-t border-b border-border/50 text-center">
              <p className="text-muted-foreground font-handwriting text-2xl">
                Your diary awaits its first memory.
              </p>
            </div>
          )}
        </motion.section>

        {/* 4. On This Day */}
        <motion.section variants={staggerItem} className="flex flex-col gap-6">
          <h2 className="text-2xl font-medium tracking-tight">On this day</h2>
          
          {onThisDayMemory ? (
            <div>
            </div>
          ) : (
            <div className="py-10 bg-secondary/10 rounded-3xl border border-secondary/20 text-center px-6">
              <p className="text-muted-foreground font-handwriting text-2xl leading-relaxed">
                This space will hold your memories from today, next year.
              </p>
            </div>
          )}
        </motion.section>

        {/* 5. This Month */}
        <motion.section variants={staggerItem} className="flex flex-col gap-6 mb-8">
          <h2 className="text-2xl font-medium tracking-tight">This month</h2>
          <div className="p-6 border-l-2 border-primary/30">
            <p className="text-lg leading-relaxed text-foreground/80">
              You&apos;ve captured {memories.length} moments so far.
            </p>
            <Link href="/journal" className="inline-block mt-4 text-primary font-medium hover:underline decoration-primary/50 underline-offset-4">
              View your timeline
            </Link>
          </div>
        </motion.section>

      </motion.main>
    </div>
  );
}
