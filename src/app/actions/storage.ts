"use server";
// @ts-nocheck

import { createClient } from "@/lib/supabase/server";

export async function uploadMemoryMedia(memoryId: string, files: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Iterate over all files in the FormData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadedMedia: any[] = [];
  let position = 0;

  for (const [, value] of Array.from(files.entries())) {
    if (value instanceof File) {
      const file = value;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${memoryId}/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('journal_media')
        .upload(filePath, file);

      if (storageError) {
        console.error("Storage upload error:", storageError);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('journal_media')
        .getPublicUrl(filePath);

      // Save record in memory_media
      const { data: mediaData, error: dbError } = await supabase
        .from("memory_media")
        .insert({
          memory_id: memoryId,
          user_id: user.id,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: publicUrl,
          storage_path: filePath,
          position: position++,
        })
        .select()
        .single();

      if (dbError) {
        console.error("Database insert error:", dbError);
        continue;
      }

      uploadedMedia.push(mediaData);
    }
  }

  return uploadedMedia;
}
