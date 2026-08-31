// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { getMemories } from "@/app/actions/journal";
import { ClientGallery } from "./client-gallery";

export default async function GalleryPage() {
  const memoriesData = await getMemories();
  
  // Extract all photos from memories
  const photos = memoriesData.flatMap(memory => {
    return (memory.memory_media || [])
      .filter((m: { type: string }) => m.type === 'image')
      .map((m: { id: string, url: string }) => ({
        id: m.id,
        url: m.url,
        width: 800, // Hardcoded for now
        height: 800
      }));
  });

  return <ClientGallery photos={photos} />;
}
