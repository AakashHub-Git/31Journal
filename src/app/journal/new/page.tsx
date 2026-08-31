"use client";
// @ts-nocheck

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/components/features/mood-selector";
import { ArrowLeft, Image as ImageIcon, MapPin, Tag, Calendar, X } from "lucide-react";
import { Mood } from "@/types";
import { createMemory } from "@/app/actions/journal";
import { uploadMemoryMedia } from "@/app/actions/storage";
/* eslint-disable @next/next/no-img-element */

export default function NewJournalPage() {
  const router = useRouter();
  
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [mood, setMood] = React.useState<Mood | undefined>(undefined);
  const [memoryDate, setMemoryDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = React.useState("");
  
  const [files, setFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSave = async () => {
    if (!description.trim() && !files.length && !title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("memory_date", memoryDate);
      formData.append("location", location);
      if (mood) formData.append("mood", mood);

      // Create the memory record
      const memory = await createMemory(formData);
      
      // If there are files, upload them attached to the new memory
      if (files.length > 0 && memory?.id) {
        const mediaFormData = new FormData();
        files.forEach((file) => {
          mediaFormData.append("files", file);
        });
        
        await uploadMemoryMedia(memory.id, mediaFormData);
      }

      router.push("/");
      router.refresh();
      
    } catch (error) {
      console.error("Failed to save memory:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 pt-12 pb-4 sticky top-0 bg-background z-10 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <IconButton variant="ghost" onClick={() => router.back()} className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
          
          <div className="flex items-center text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
            <Calendar className="w-4 h-4 mr-2" />
            <input 
              type="date"
              value={memoryDate}
              onChange={(e) => setMemoryDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm font-medium"
            />
          </div>
        </div>
        <Button 
          size="sm" 
          onClick={handleSave} 
          disabled={isSubmitting || (!description.trim() && !files.length && !title.trim())}
          className="rounded-full h-8 px-4 text-xs"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </header>

      <main className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
        
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a title..." 
          className="text-3xl font-medium bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/30 mb-6"
        />

        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 w-full bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/50 resize-none text-lg leading-relaxed min-h-[250px]"
        />

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-6">
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
                <img src={src} alt="Preview" className="object-cover w-full h-full" />
                <button 
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-6 pb-safe">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Mood</h3>
            <MoodSelector value={mood} onChange={setMood} />
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Location</h3>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card">
              <MapPin className="w-4 h-4 text-secondary" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you?"
                className="bg-transparent border-none focus:outline-none flex-1 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
              <ImageIcon className="w-4 h-4 text-primary" />
              Add Photo
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple 
                onChange={handleFileChange}
                className="hidden" 
              />
            </label>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
              <Tag className="w-4 h-4 opacity-70" />
              Tags
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
