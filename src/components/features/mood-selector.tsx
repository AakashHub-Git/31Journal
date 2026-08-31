"use client";

import * as React from "react";
import { Mood } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MoodSelectorProps {
  value?: Mood;
  onChange?: (mood: Mood) => void;
}

const moods: { id: Mood; label: string; emoji: string; color: string }[] = [
  { id: "happy", label: "Happy", emoji: "😊", color: "bg-orange-100 text-orange-700" },
  { id: "calm", label: "Calm", emoji: "😌", color: "bg-blue-100 text-blue-700" },
  { id: "excited", label: "Excited", emoji: "✨", color: "bg-yellow-100 text-yellow-700" },
  { id: "reflective", label: "Reflective", emoji: "🤔", color: "bg-purple-100 text-purple-700" },
  { id: "tired", label: "Tired", emoji: "😴", color: "bg-slate-100 text-slate-700" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "bg-red-100 text-red-700" },
  { id: "sad", label: "Sad", emoji: "😢", color: "bg-indigo-100 text-indigo-700" },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => {
        const isSelected = value === mood.id;
        
        return (
          <motion.button
            key={mood.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange?.(mood.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border border-transparent",
              isSelected 
                ? cn(mood.color, "shadow-sm border-black/5 scale-105")
                : "bg-muted text-muted-foreground hover:bg-muted/80 grayscale hover:grayscale-0"
            )}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
