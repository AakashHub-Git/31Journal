"use client";

import * as React from "react";
import Link from "next/link";
import { JournalEntry, Photo } from "@/types";
import { MoodBadge } from "./mood-badge";
import { TagList } from "./tag-list";
import { PhotoMemory } from "./photo-memory";
import { PhotoViewer } from "./photo-viewer";
import { motion } from "framer-motion";

interface MemoryTimelineItemProps {
  entry: JournalEntry;
  isLast?: boolean;
}

export function MemoryTimelineItem({ entry, isLast }: MemoryTimelineItemProps) {
  const [activePhoto, setActivePhoto] = React.useState<Photo | null>(null);

  const dateStr = new Date(entry.date).toLocaleDateString("en-US", {
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <div className="relative pl-8 pb-10 group">
        {/* Timeline line */}
        {!isLast && (
          <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border/60 group-hover:bg-primary/30 transition-colors" />
        )}
        
        {/* Timeline dot */}
        <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-primary/50 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all">
          <div className="w-2 h-2 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-baseline justify-between">
            <Link href={`/journal/${entry.id}`} className="hover:underline decoration-primary/50 underline-offset-4">
              <h3 className="font-medium text-xl text-foreground">
                {entry.title || "Untitled"}
              </h3>
            </Link>
            <span className="font-handwriting text-primary text-xl shrink-0 ml-4">{dateStr}</span>
          </div>

          <div className="flex gap-2 mb-1">
            {entry.mood && <MoodBadge mood={entry.mood} />}
          </div>

          <Link href={`/journal/${entry.id}`}>
            <p className="text-muted-foreground leading-relaxed line-clamp-3 hover:text-foreground transition-colors cursor-pointer">
              {entry.content}
            </p>
          </Link>

          {entry.photos && entry.photos.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {entry.photos.slice(0, 2).map(photo => (
                <PhotoMemory 
                  key={photo.id} 
                  photo={photo} 
                  aspectRatio="landscape"
                  onClick={() => setActivePhoto(photo)}
                />
              ))}
            </div>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-2">
              <TagList tags={entry.tags} />
            </div>
          )}
        </motion.div>
      </div>

      <PhotoViewer photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </>
  );
}
