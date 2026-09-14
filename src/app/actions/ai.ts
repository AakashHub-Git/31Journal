"use server";

import { createClient } from "@/lib/supabase/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { unstable_cache } from "next/cache";

const generateWrappedAiCached = unstable_cache(
  async (memoryContext: string, maxDay: number) => {
    const prompt = `You are an AI generating a "Monthly Wrapped" summary for a personal journal. 
Based on the following journal entries from this month (up to day ${maxDay}), generate a JSON response summarizing their month so far.
Do not include any markdown formatting like \`\`\`json, just return the raw JSON object.

Required JSON format:
{
  "theme": "A short 3-4 word phrase describing the overall vibe of the month",
  "dominantMood": "The most common mood (e.g. happy, calm, anxious)",
  "highlightText": "A warm, beautifully written paragraph (2-3 sentences) summarizing their core experiences and feelings this month. Speak directly to the user (e.g. 'This month you focused a lot on...')",
  "topMemoryId": "The ID of the memory that seemed most significant, emotional, or detailed"
}

JOURNAL ENTRIES:
${memoryContext}
`;

    try {
      const { text } = await generateText({
        model: google("gemini-3.6-flash"),
        prompt,
        temperature: 0.7,
      });

      let cleanText = text.trim();
      const jsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        cleanText = jsonMatch[1].trim();
      } else {
        cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Failed to generate wrapped:", error);
      return null;
    }
  },
  ["monthly-wrapped-ai"],
  { revalidate: 86400 } // Cache for 24 hours
);

export async function generateMonthlyWrapped(year: number, month: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Calculate the max day to include
  const today = new Date();
  let maxDay = new Date(year, month, 0).getDate(); // Default to last day of month

  if (today.getFullYear() === year && today.getMonth() + 1 === month) {
    // If it's the current month, summarize up to yesterday
    maxDay = Math.max(1, today.getDate() - 1);
  }

  // Fetch all memories for the given month, up to maxDay outside the cache scope
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(maxDay).padStart(2, '0')}`;

  const { data: memories } = await supabase
    .from("memories")
    .select("id, title, description, mood, memory_date")
    .gte("memory_date", startDate)
    .lte("memory_date", endDate)
    .eq("user_id", user.id);

  if (!memories || memories.length === 0) {
    return null;
  }

  const memoryContext = memories.map(m =>
    `[ID: ${m.id}] Date: ${m.memory_date} | Title: ${m.title} | Mood: ${m.mood || 'neutral'}\nDesc: ${m.description}`
  ).join("\n\n");

  // Use the cached AI function
  return await generateWrappedAiCached(memoryContext, maxDay);
}
