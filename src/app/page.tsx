import { getMemories } from "./actions/journal";
import { ClientHome } from "./client-home";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const memories = await getMemories();
  
  // Try to get name from profile
  let userName = "Sweetttyyy";
  const { data } = await supabase.from("profiles").select("name").eq("id", user.id).single();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = data;
  if (profile?.name) {
    userName = profile.name;
  }
  
  return <ClientHome memories={memories} userName={userName} />;
}
