"use client";

import * as React from "react";
import { BaseMemory } from "@/types";
import { MoodBadge } from "./mood-badge";
import { MapPin, Heart } from "lucide-react";

interface MemoryHeaderProps {
  memory: BaseMemory;
  showDate?: boolean;
}

export function MemoryHeader({ memory, showDate = true }: MemoryHeaderProps) {
  const dateStr = new Date(memory.date).toLocaleDateString("en-US", {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          {memory.title || "Untitled"}
        </h2>
        {memory.isFavorite && (
          <Heart className="w-5 h-5 text-red-500 fill-red-500 flex-shrink-0 mt-1" />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1">
        {showDate && (
          <span className="font-handwriting text-primary text-xl -my-1">
            {dateStr}
          </span>
        )}
        
        {memory.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{memory.location.name}</span>
          </div>
        )}

        {memory.mood && <MoodBadge mood={memory.mood} />}
      </div>
    </div>
  );
}
