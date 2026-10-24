import { getDreamItems } from "@/app/actions/dreams";
import { ClientDreams } from "./client-dreams";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DreamsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dreams = await getDreamItems();

  return <ClientDreams initialDreams={dreams} />;
}
