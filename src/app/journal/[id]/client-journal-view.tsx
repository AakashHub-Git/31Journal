"use client";

import * as React from "react";
import { PhotoGrid } from "@/components/features/memory/photo-grid";
import { PhotoViewer } from "@/components/features/memory/photo-viewer";
import { Photo } from "@/types";

export function ClientJournalView({ photos }: { photos: Photo[] }) {
  const [activePhoto, setActivePhoto] = React.useState<Photo | null>(null);

  return (
    <>
      <PhotoGrid photos={photos} onPhotoClick={setActivePhoto} priority={true} />
      <PhotoViewer photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </>
  );
}
