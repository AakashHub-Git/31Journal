"use client";

import * as React from "react";
import { Photo } from "@/types";
import { PhotoMemory } from "./photo-memory";
import { cn } from "@/lib/utils";

interface PhotoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  photos?: Photo[];
  onPhotoClick?: (photo: Photo) => void;
}

export function PhotoGrid({ photos, onPhotoClick, className, ...props }: PhotoGridProps) {
  if (!photos || photos.length === 0) return null;

  // Single Photo
  if (photos.length === 1) {
    return (
      <div className={cn("w-full", className)} {...props}>
        <PhotoMemory 
          photo={photos[0]} 
          aspectRatio="portrait" 
          onClick={() => onPhotoClick?.(photos[0])} 
        />
      </div>
    );
  }

  // Two Photos
  if (photos.length === 2) {
    return (
      <div className={cn("grid grid-cols-2 gap-2 w-full", className)} {...props}>
        {photos.map((photo) => (
          <PhotoMemory 
            key={photo.id}
            photo={photo} 
            aspectRatio="square" 
            onClick={() => onPhotoClick?.(photo)} 
          />
        ))}
      </div>
    );
  }

  // Three or more Photos (Grid layout)
  return (
    <div className={cn("grid grid-cols-4 gap-2 w-full", className)} {...props}>
      {/* First photo takes up half the grid */}
      <div className="col-span-4 sm:col-span-2">
        <PhotoMemory 
          photo={photos[0]} 
          aspectRatio="landscape" 
          onClick={() => onPhotoClick?.(photos[0])} 
        />
      </div>
      
      {/* Second photo */}
      <div className="col-span-2 sm:col-span-1">
        <PhotoMemory 
          photo={photos[1]} 
          aspectRatio="square" 
          onClick={() => onPhotoClick?.(photos[1])} 
        />
      </div>

      {/* Third photo with possible overlay if more than 3 */}
      <div className="col-span-2 sm:col-span-1 relative">
        <PhotoMemory 
          photo={photos[2]} 
          aspectRatio="square" 
          onClick={() => onPhotoClick?.(photos[2])} 
        />
        {photos.length > 3 && (
          <div 
            className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center cursor-pointer backdrop-blur-sm"
            onClick={() => onPhotoClick?.(photos[3])}
          >
            <span className="text-white font-medium text-xl">+{photos.length - 3}</span>
          </div>
        )}
      </div>
    </div>
  );
}
