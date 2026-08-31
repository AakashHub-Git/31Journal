import * as React from "react";
// @ts-nocheck
import { PageHeader } from "@/components/features/page-header";
import { MemoryCard } from "@/components/features/memory/memory-card";
import { Section } from "@/components/ui/section";
import { getMemories } from "@/app/actions/journal";

export default async function MemoriesPage() {
  const memoriesData = await getMemories();

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background">
      <PageHeader 
        title="Memories" 
        subtitle="Your timeline"
      />

      <main className="px-6 flex flex-col gap-10 mt-4">
        <Section>
          {memoriesData.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground font-handwriting text-2xl">
              No memories yet.
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {memoriesData.map((memory) => {
                const mappedMemory = {
                  id: memory.id,
                  title: memory.title || "",
                  description: memory.description || "",
                  date: memory.memory_date,
                  photos: (memory.memory_media || []).filter((m: { type: string }) => m.type === 'image').map((m: { id: string, url: string }) => ({
                    id: m.id,
                    url: m.url,
                    width: 800,
                    height: 800
                  })),
                  videos: [],
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  mood: memory.mood as any,
                  location: memory.location,
                  tags: [],
                  isFavorite: memory.is_favorite
                };

                return <MemoryCard key={memory.id} memory={mappedMemory} />;
              })}
            </div>
          )}
        </Section>
      </main>
    </div>
  );
}
