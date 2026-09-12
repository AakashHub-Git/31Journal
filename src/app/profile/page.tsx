import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientProfile } from "./client-profile";

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

  // Try to get name from profile
  let displayName = "Sweetttyyy";
  const { data } = await supabase.from("profiles").select("name").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = data;
  if (profile?.name) {
    displayName = profile.name;
  }

  return (
    <ClientProfile 
      displayName={displayName}
      joinedDate={joinedDate}
      memoriesCount={memoriesCount || 0}
      mediaCount={mediaCount || 0}
    />
  );
}
