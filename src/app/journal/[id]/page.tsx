import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IconButton } from "@/components/ui/icon-button";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { Mood } from "@/types";
import { ClientJournalView } from "./client-journal-view";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  excited: "✨",
  reflective: "🤔",
  sad: "😢",
  anxious: "😰",
  tired: "🥱",
};

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memory } = await supabase
    .from("memories")
    .select(`
      *,
      memory_media (
        id,
        url,
        type
      )
    `)
    .eq("id", id)
    .single();

  if (!memory) {
    redirect("/journal");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const photos = (memory.memory_media || []).filter((m: any) => m.type === 'image').map((m: any) => ({
    id: m.id,
    url: m.url,
    width: 800,
    height: 800,
    dateAdded: memory.memory_date
  }));

  const memoryData = {
    id: memory.id,
    title: memory.title || "",
    description: memory.description || "",
    date: memory.memory_date,
    photos,
    videos: [],
    mood: memory.mood as Mood | undefined,
    location: memory.location,
    tags: [],
    isFavorite: memory.is_favorite
  };

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background">
      <header className="px-4 pt-12 pb-4 sticky top-0 bg-background/90 backdrop-blur-md z-10 flex items-center justify-between border-b border-border/30">
        <Link href="/journal">
          <IconButton variant="ghost" className="-ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
        </Link>
        <span className="font-handwriting text-xl text-primary">{memoryData.date}</span>
        <div className="w-10"></div> {/* Placeholder for balance */}
      </header>

      <main className="px-6 py-8 flex flex-col gap-6 max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-foreground leading-tight">
              {memoryData.title || "Untitled Memory"}
            </h1>
            {memoryData.mood && (
              <span className="text-4xl" title={memoryData.mood}>
                {MOOD_EMOJIS[memoryData.mood] || "💭"}
              </span>
            )}
          </div>
          
          {memoryData.location && (
            <div className="flex items-center text-muted-foreground text-sm font-medium">
              <MapPin className="w-4 h-4 mr-1.5 text-primary/70" />
              {memoryData.location}
            </div>
          )}
        </div>

        {memoryData.description && (
          <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {memoryData.description}
          </p>
        )}

        {memoryData.photos.length > 0 && (
          <div className="mt-4">
            <ClientJournalView photos={memoryData.photos} />
          </div>
        )}
      </main>
    </div>
  );
}
