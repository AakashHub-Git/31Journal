import * as React from "react";
import { Mood } from "@/types";
import { cn } from "@/lib/utils";

const moodConfig: Record<Mood, { label: string; emoji: string; color: string }> = {
  happy: { label: "Happy", emoji: "😊", color: "bg-orange-100 text-orange-700" },
  calm: { label: "Calm", emoji: "😌", color: "bg-blue-100 text-blue-700" },
  excited: { label: "Excited", emoji: "✨", color: "bg-yellow-100 text-yellow-700" },
  reflective: { label: "Reflective", emoji: "🤔", color: "bg-purple-100 text-purple-700" },
  tired: { label: "Tired", emoji: "😴", color: "bg-slate-100 text-slate-700" },
  anxious: { label: "Anxious", emoji: "😰", color: "bg-red-100 text-red-700" },
  sad: { label: "Sad", emoji: "😢", color: "bg-indigo-100 text-indigo-700" },
};

interface MoodBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  mood: Mood;
}

export function MoodBadge({ mood, className, ...props }: MoodBadgeProps) {
  const config = moodConfig[mood];
  if (!config) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.color,
        className
      )}
      {...props}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  );
}
