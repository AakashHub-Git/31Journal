"use server";
// @ts-nocheck

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { DreamCategory, DreamItem } from "@/types";

const DEFAULT_STARTER_DREAMS: Array<{ title: string; category: DreamCategory; description: string }> = [
  {
    title: "Watch a sunrise together wrapped in blankets",
    category: "adventures",
    description: "Hot chocolate in hand before the world wakes up 🌅",
  },
  {
    title: "Plan a dream getaway to Paris or Disneyland",
    category: "travel",
    description: "Take goofy photos in front of the castle and eat warm croissants 🏰",
  },
  {
    title: "Picnic in the park with fresh strawberries & treats",
    category: "food",
    description: "A cute checkered blanket, sunshine, and sweet snacks 🍓",
  },
  {
    title: "Stargaze on a clear rooftop night",
    category: "adventures",
    description: "Spot shooting stars and whisper about the universe ✨",
  },
  {
    title: "Bake warm chocolate chip cookies from scratch",
    category: "food",
    description: "Flour on our noses and eating dough right from the bowl 🍪",
  },
  {
    title: "Take a spontaneous road trip with windows down",
    category: "travel",
    description: "Singing loudly to our favorite nostalgic playlist 🚗",
  },
  {
    title: "Achieve a big personal dream milestone",
    category: "goals",
    description: "Celebrate our hard work and be so incredibly proud 🌟",
  },
];

export async function getDreamItems(): Promise<DreamItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("dream_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Dream items table not found or query error:", error.message);
      // Return default starter dreams as virtual items if table is not yet created
      return DEFAULT_STARTER_DREAMS.map((item, idx) => ({
        id: `starter_${idx}`,
        title: item.title,
        category: item.category,
        description: item.description,
        is_completed: false,
        created_at: new Date().toISOString(),
      }));
    }

    // If user has 0 dream items, automatically seed initial starter ideas
    if (!data || data.length === 0) {
      const seedPayload = DEFAULT_STARTER_DREAMS.map((item) => ({
        user_id: user.id,
        title: item.title,
        category: item.category,
        description: item.description,
        is_completed: false,
      }));

      const { data: seededData } = await supabase
        .from("dream_items")
        .insert(seedPayload)
        .select();

      return (seededData || []) as DreamItem[];
    }

    return (data || []) as DreamItem[];
  } catch (err) {
    console.error("Error in getDreamItems:", err);
    return [];
  }
}

export async function createDreamItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as DreamCategory) || "adventures";
  const description = (formData.get("description") as string)?.trim() || null;

  if (!title) {
    throw new Error("Title is required");
  }

  const { data, error } = await supabase
    .from("dream_items")
    .insert({
      user_id: user.id,
      title,
      category,
      description,
      is_completed: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create dream item:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dreams");
  revalidatePath("/");
  return data as DreamItem;
}

export async function completeDreamItem(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const completedAt = (formData.get("completed_at") as string) || new Date().toISOString().split("T")[0];
  const photoFile = formData.get("photo") as File | null;
  let photoUrl: string | null = null;

  // Upload polaroid memory photo if provided
  if (photoFile && photoFile instanceof File && photoFile.size > 0) {
    const fileExt = photoFile.name.split(".").pop() || "jpg";
    const filePath = `${user.id}/dreams/${id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("journal_media")
      .upload(filePath, photoFile);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from("journal_media")
        .getPublicUrl(filePath);
      photoUrl = publicUrl;
    } else {
      console.error("Failed to upload dream polaroid photo:", uploadError);
    }
  }

  const { data, error } = await supabase
    .from("dream_items")
    .update({
      is_completed: true,
      completed_at: completedAt,
      photo_url: photoUrl,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to complete dream item:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dreams");
  revalidatePath("/");
  return data as DreamItem;
}

export async function uncompleteDreamItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("dream_items")
    .update({
      is_completed: false,
      completed_at: null,
      photo_url: null,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to uncomplete dream item:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dreams");
  revalidatePath("/");
  return data as DreamItem;
}

export async function deleteDreamItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("dream_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete dream item:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dreams");
  revalidatePath("/");
  return true;
}
