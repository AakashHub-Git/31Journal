"use client";

import * as React from "react";
import Link from "next/link";
import { DreamItem } from "@/types";
import { Sparkles, ArrowRight, Heart, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface DreamShowcaseCardProps {
  dreams: DreamItem[];
  className?: string;
}

export function DreamShowcaseCard({
  dreams,
  className = "",
}: DreamShowcaseCardProps) {
  const total = dreams.length;
  const completed = dreams.filter((d) => d.is_completed).length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Find latest completed dream with photo if any
  const latestCompletedWithPhoto = dreams.find(
    (d) => d.is_completed && d.photo_url
  );
  // Find next upcoming dream
  const nextDream = dreams.find((d) => !d.is_completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-5 bg-gradient-to-br from-amber-50/70 via-rose-50/50 to-pink-50/70 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-stone-900 border border-amber-200/60 dark:border-amber-900/40 shadow-xs flex flex-col gap-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-tight text-foreground">
              Sweety&apos;s Dream Board
            </h3>
            <p className="text-[11px] text-muted-foreground">Adventures & Bucket List</p>
          </div>
        </div>

        <Link
          href="/dreams"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">
            {completed} of {total} dreams achieved!
          </span>
          <span className="font-mono text-muted-foreground font-semibold">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Highlights or Preview */}
      {latestCompletedWithPhoto ? (
        <Link
          href="/dreams"
          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 border border-black/5 dark:border-white/5 hover:bg-white transition-colors"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-black/10">
            <img
              src={latestCompletedWithPhoto.photo_url!}
              alt={latestCompletedWithPhoto.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
              Latest Memory Unlocked ✨
            </span>
            <p className="font-medium text-xs text-foreground truncate">
              {latestCompletedWithPhoto.title}
            </p>
          </div>
        </Link>
      ) : nextDream ? (
        <Link
          href="/dreams"
          className="flex items-center justify-between p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 hover:bg-white transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <p className="text-xs text-foreground truncate font-medium">
              Next: {nextDream.title}
            </p>
          </div>
          <span className="text-[11px] text-primary font-medium shrink-0">Open</span>
        </Link>
      ) : null}
    </motion.div>
  );
}
