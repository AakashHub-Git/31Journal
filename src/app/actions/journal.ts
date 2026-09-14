"use server";
// @ts-nocheck

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMemory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const memoryDate = formData.get("memory_date") as string;
  const location = formData.get("location") as string;
  const mood = formData.get("mood") as string;

  const { data, error } = await supabase
    .from("memories")
    .insert({
      user_id: user.id,
      title: title || null,
      description: description || null,
      memory_date: memoryDate || new Date().toISOString().split('T')[0],
      location: location || null,
      mood: mood || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/memories");
  
  return data as any;
}

export async function updateMemory(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const memoryDate = formData.get("memory_date") as string;
  const location = formData.get("location") as string;
  const mood = formData.get("mood") as string;

  const { data, error } = await supabase
    .from("memories")
    .update({
      title: title || null,
      description: description || null,
      memory_date: memoryDate || new Date().toISOString().split('T')[0],
      location: location || null,
      mood: mood || null,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/memories");
  revalidatePath(`/journal/${id}`);
  
  return data as any;
}

export async function deleteMemory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("memories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/memories");
  
  return true;
}

export async function getMemory(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memories")
    .select(`*, memory_media (*)`)
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getMemories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memories")
    .select(`*, memory_media (*)`)
    .order('memory_date', { ascending: false });

  if (error) {
    console.error("Error fetching memories:", error);
    return [];
  }

  return (data || []) as any[];
}
