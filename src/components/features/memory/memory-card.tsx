"use client";

import * as React from "react";
import { Memory } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface MemoryCardProps {
  memory: Memory;
  priority?: boolean;
}
const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  excited: "✨",
  reflective: "🤔",
  sad: "😢",
  anxious: "😰",
  tired: "🥱",
};

export function MemoryCard({ memory, priority = false }: MemoryCardProps) {
  const coverPhoto = memory.photos && memory.photos.length > 0 ? memory.photos[0] : null;

  return (
    <Link href={`/journal/${memory.id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.02, rotate: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative flex flex-col gap-3 text-left w-full group focus-visible:outline-none app-image bg-card border border-border p-3 pb-6 shadow-paper transition-all before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-6 before:bg-white/40 before:backdrop-blur-sm before:-rotate-3 before:shadow-sm hover-animate"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <h3 className="font-medium text-foreground leading-tight line-clamp-2 hover-animate">
              {memory.title || "Untitled Memory"}
            </h3>
            <span className="text-xs text-muted-foreground font-handwriting mt-1 text-primary">
              {memory.date}
            </span>
          </div>
          {memory.mood && (
            <span className="text-xl leading-none ml-2 hover-animate" title={memory.mood}>
              {MOOD_EMOJIS[memory.mood] || "💭"}
            </span>
          )}
        </div>
        
        {coverPhoto && (
          <div className="relative w-full aspect-square app-image overflow-hidden border border-border/50">
            <Image 
              src={coverPhoto.url}
              alt="Memory preview"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              priority={priority}
            />
          </div>
        )}
      </motion.div>
    </Link>
  );
}
