"use client";

import * as React from "react";
import { JournalEntry, Photo } from "@/types";
import { MemoryHeader } from "./memory-header";
import { TagList } from "./tag-list";
import { PhotoGrid } from "./photo-grid";
import { PhotoViewer } from "./photo-viewer";

interface MemoryDetailProps {
  entry: JournalEntry;
}

export function MemoryDetail({ entry }: MemoryDetailProps) {
  const [activePhoto, setActivePhoto] = React.useState<Photo | null>(null);

  return (
    <>
      <article className="flex flex-col w-full">
        <MemoryHeader memory={entry} showDate={true} />
        
        {entry.photos && entry.photos.length > 0 && (
          <div className="mt-8 mb-6">
            <PhotoGrid photos={entry.photos} onPhotoClick={setActivePhoto} />
          </div>
        )}

        <div className="mt-6 text-lg leading-relaxed text-foreground whitespace-pre-wrap font-medium text-foreground/90">
          {entry.content}
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border/50">
            <TagList tags={entry.tags} />
          </div>
        )}
      </article>

      <PhotoViewer photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </>
  );
}
