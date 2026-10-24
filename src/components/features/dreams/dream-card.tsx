"use client";

import * as React from "react";
import { DreamCategory, DreamItem } from "@/types";
import { Check, Heart, Trash2, Sparkles, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface DreamCardProps {
  dream: DreamItem;
  onCheck: (dream: DreamItem) => void;
  onUncheck: (dream: DreamItem) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_STYLES: Record<DreamCategory, { badge: string; emoji: string; label: string }> = {
  travel: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900",
    emoji: "✈️",
    label: "Travel",
  },
  food: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900",
    emoji: "🍰",
    label: "Food",
  },
  adventures: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900",
    emoji: "☕",
    label: "Adventure",
  },
  goals: {
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900",
    emoji: "🌟",
    label: "Goal",
  },
};

export function DreamCard({
  dream,
  onCheck,
  onUncheck,
  onDelete,
}: DreamCardProps) {
  const cat = CATEGORY_STYLES[dream.category] || CATEGORY_STYLES.adventures;

  if (dream.is_completed) {
    /* Completed Celebratory Polaroid Card */
    return (
      <motion.div
        layout
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="group relative rounded-3xl p-4 bg-gradient-to-br from-rose-50/60 via-amber-50/30 to-pink-50/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 border border-rose-200/70 dark:border-rose-900/40 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
      >
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badge}`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Fulfilled</span>
            </span>

            <button
              type="button"
              onClick={() => onDelete(dream.id)}
              className="p-1 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer"
              title="Delete dream"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Polaroid Frame if Photo Attached */}
        {dream.photo_url ? (
          <div className="my-2 p-2.5 pb-4 bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-black/10 dark:border-white/10 flex flex-col items-center">
            <div className="w-full h-44 rounded-xl overflow-hidden bg-muted mb-2">
              <img
                src={dream.photo_url}
                alt={dream.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
            </div>
            <span className="font-handwriting text-xs text-stone-600 dark:text-stone-300">
              {dream.completed_at ? `Fulfilled on ${dream.completed_at}` : "Dream realized ✨"}
            </span>
          </div>
        ) : null}

        {/* Dream Title & Notes */}
        <div className="mt-1">
          <h4 className="font-semibold text-base text-foreground leading-snug line-through decoration-primary/50 text-muted-foreground/90">
            {dream.title}
          </h4>
          {dream.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {dream.description}
            </p>
          )}
        </div>

        {/* Bottom footer: Undo completion */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/40 text-xs text-muted-foreground">
          {dream.completed_at && (
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 opacity-60" />
              {dream.completed_at}
            </span>
          )}
          <button
            type="button"
            onClick={() => onUncheck(dream)}
            className="text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Mark uncompleted
          </button>
        </div>
      </motion.div>
    );
  }

  /* Uncompleted Dream Card */
  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="group relative rounded-3xl p-5 bg-card border border-border/80 hover:border-primary/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Category & Delete */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badge}`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </span>

          <button
            type="button"
            onClick={() => onDelete(dream.id)}
            className="p-1 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer"
            title="Delete dream"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-base tracking-tight text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {dream.title}
        </h4>

        {/* Description / Notes */}
        {dream.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
            {dream.description}
          </p>
        )}
      </div>

      {/* Check off button */}
      <div className="pt-3 border-t border-border/40 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">Waiting to happen...</span>

        <button
          type="button"
          onClick={() => onCheck(dream)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-500 hover:text-white transition-all text-xs font-medium cursor-pointer shadow-2xs group/btn"
        >
          <Heart className="w-3.5 h-3.5 group-hover/btn:fill-current transition-colors" />
          <span>Fulfill Dream</span>
        </button>
      </div>
    </motion.div>
  );
}
