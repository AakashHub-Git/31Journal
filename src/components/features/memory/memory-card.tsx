"use client";

import * as React from "react";
import { Memory, Photo } from "@/types";
import { PhotoGrid } from "./photo-grid";
import { PhotoViewer } from "./photo-viewer";
import { MemoryHeader } from "./memory-header";
import { TagList } from "./tag-list";
import { motion } from "framer-motion";

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

export function MemoryCard({ memory, onClick }: MemoryCardProps) {
  const [activePhoto, setActivePhoto] = React.useState<Photo | null>(null);

  // When clicking a photo in the grid, we don't want to trigger the card's onClick
  const handlePhotoClick = (photo: Photo) => {
    setActivePhoto(photo);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="flex flex-col gap-4 text-left w-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl bg-card border border-border/40 p-5 shadow-sm transition-shadow hover:shadow-paper"
      >
        <div onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
          <MemoryHeader memory={memory} showDate={true} />
          
          {memory.description && (
            <p className="text-foreground/90 mt-4 leading-relaxed text-sm">
              {memory.description}
            </p>
          )}
        </div>

        {memory.photos && memory.photos.length > 0 && (
          <div className="mt-2">
            <PhotoGrid photos={memory.photos} onPhotoClick={handlePhotoClick} />
          </div>
        )}

        {memory.tags && memory.tags.length > 0 && (
          <div className="mt-2">
            <TagList tags={memory.tags} />
          </div>
        )}
      </motion.div>

      <PhotoViewer photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </>
  );
}
