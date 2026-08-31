"use client";

import * as React from "react";
import { PageHeader } from "@/components/features/page-header";
import { PhotoMemory } from "@/components/features/memory/photo-memory";
import { PhotoViewer } from "@/components/features/memory/photo-viewer";
import { Photo } from "@/types";

export function ClientGallery({ photos }: { photos: Photo[] }) {
  const [activePhoto, setActivePhoto] = React.useState<Photo | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <PageHeader title="Gallery" />

      <main className="px-6 mt-6">
        {photos.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground font-handwriting text-2xl">
            No photos yet.
          </div>
        ) : (
          <div className="columns-2 gap-4">
            {photos.map((photo, i) => {
              const isLandscape = (photo.width || 1) > (photo.height || 1);
              const aspectRatio = isLandscape ? "landscape" : "portrait";
              
              return (
                <div key={photo.id} className="mb-4 break-inside-avoid">
                  <PhotoMemory 
                    photo={photo} 
                    aspectRatio={aspectRatio}
                    priority={i < 4}
                    onClick={() => setActivePhoto(photo)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <PhotoViewer photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </div>
  );
}
