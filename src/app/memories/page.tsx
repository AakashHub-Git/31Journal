import * as React from "react";
import { PageHeader } from "@/components/features/page-header";
import { Section } from "@/components/ui/section";
import { getMemories } from "@/app/actions/journal";
import { ClientTimeline } from "@/app/client-timeline";

export default async function MemoriesPage() {
  const memoriesData = await getMemories();

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background">
      <PageHeader 
        title="Journal" 
        subtitle="All your beautiful moments"
      />

      <main className="px-6 flex flex-col gap-10 mt-4">
        <Section>
          {memoriesData.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground font-handwriting text-2xl">
              No memories yet.
            </div>
          ) : (
            <ClientTimeline memories={memoriesData} />
          )}
        </Section>
      </main>
    </div>
  );
}
