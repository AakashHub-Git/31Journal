import * as React from "react";
import { Section } from "@/components/ui/section";
import { User, Bell, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { WALKTHROUGH_CONTENT } from "@/config/walkthrough";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real-time stats
  const { count: memoriesCount } = await supabase
    .from("memories")
    .select("*", { count: "exact", head: true });
    
  const { count: mediaCount } = await supabase
    .from("memory_media")
    .select("*", { count: "exact", head: true });

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Try to get name from profile, otherwise fallback to config or email
  let displayName = WALKTHROUGH_CONTENT.metadata.name;
  const { data: profile } = await supabase.from("profiles").select("name").eq("id", user.id).single();
  if (profile?.name) {
    displayName = profile.name;
  }

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background">
      <header className="px-4 pt-12 pb-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 flex items-center">
        <Link href="/">
          <IconButton variant="ghost" className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
        </Link>
      </header>

      <main className="px-6 flex flex-col gap-10 mt-4">
        
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-semibold">{displayName}</h1>
          <p className="text-muted-foreground mt-1 font-medium">{user.email}</p>
          <p className="text-muted-foreground mt-1 text-sm">Joined {joinedDate}</p>
          
          <div className="flex gap-10 mt-8">
            <div className="flex flex-col items-center">
              <span className="font-handwriting text-4xl text-primary">{memoriesCount || 0}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-2">Entries</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-handwriting text-4xl text-primary">{mediaCount || 0}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-2">Photos</span>
            </div>
          </div>
        </div>

        <Section>
          <h2 className="text-lg font-medium mb-3 pl-2">Settings</h2>
          <div className="flex flex-col rounded-2xl bg-card border border-border/50 overflow-hidden shadow-sm">
            <button className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left w-full">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Notifications</span>
            </button>
            <div className="h-px w-full bg-border/50" />
            <button className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left w-full">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Privacy & Data</span>
            </button>
            <div className="h-px w-full bg-border/50" />
            <LogoutButton />
          </div>
        </Section>

      </main>
    </div>
  );
}
