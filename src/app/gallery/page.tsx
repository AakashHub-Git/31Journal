// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Suspense } from "react";
import { getMemories } from "@/app/actions/journal";
import { ClientGallery } from "./client-gallery";

export default async function GalleryPage() {
  const memoriesData = await getMemories();
  
  // Extract all photos from memories (excluding audio)
  const photos = memoriesData.flatMap(memory => {
    return (memory.memory_media || [])
      .filter((m: { url: string; type: string }) => {
        const isAudio = m.url.includes("audio_") || m.url.endsWith(".webm") || m.url.endsWith(".mp3") || m.url.endsWith(".m4a");
        return !isAudio && m.type === 'image';
      })
      .map((m: { id: string, url: string }) => ({
        id: m.id,
        url: m.url,
        width: 800,
        height: 800,
        memoryTitle: memory.title || "",
        memoryDescription: memory.description || "",
        memoryLocation: memory.location || "",
        mood: memory.mood,
        memoryDate: memory.memory_date
      }));
  });

  // Extract all voice notes/tapes from memories
  const voiceTapes = memoriesData.flatMap(memory => {
    return (memory.memory_media || [])
      .filter((m: { url: string }) => {
        return m.url.includes("audio_") || m.url.endsWith(".webm") || m.url.endsWith(".mp3") || m.url.endsWith(".m4a");
      })
      .map((m: { id: string, url: string }) => ({
        id: m.id,
        url: m.url,
        memoryId: memory.id,
        memoryTitle: memory.title || "Sweety's Voice Note",
        memoryDate: memory.memory_date,
        mood: memory.mood,
        location: memory.location,
      }));
  });

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading gallery...</div>}>
      <ClientGallery photos={photos} voiceTapes={voiceTapes} />
    </Suspense>
  );
}
