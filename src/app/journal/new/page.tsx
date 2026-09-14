"use client";
// @ts-nocheck

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/components/features/mood-selector";
import { ArrowLeft, Image as ImageIcon, MapPin, Tag, Calendar, X } from "lucide-react";
import { Mood } from "@/types";
import { createMemory, updateMemory, getMemory } from "@/app/actions/journal";
import { uploadMemoryMedia } from "@/app/actions/storage";
import { JournalCamera } from "@/components/camera/JournalCamera";
import { Camera } from "lucide-react";
import { Suspense } from "react";

function NewJournalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [mood, setMood] = React.useState<Mood | undefined>(undefined);
  const [memoryDate, setMemoryDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = React.useState("");
  
  const [files, setFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [loadingText, setLoadingText] = React.useState("Saving memory...");
  
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);

  React.useEffect(() => {
    if (editId) {
      getMemory(editId).then(data => {
        if (data) {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setMood(data.mood || undefined);
          setMemoryDate(data.memory_date || new Date().toISOString().split('T')[0]);
          setLocation(data.location || "");
          
          if (data.memory_media) {
            setPreviews(data.memory_media.map((m: any) => m.url));
          }
        }
      });
    }
  }, [editId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    // If it's an existing image, we don't have a file, but we should handle it.
    // For simplicity, we just remove it from previews. True deletion from storage might need an extra step.
    if (index >= (previews.length - files.length)) {
      const fileIndex = index - (previews.length - files.length);
      setFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    
    setPreviews((prev) => {
      const url = prev[index];
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCapture = (file: File) => {
    setFiles((prev) => [...prev, file]);
    const src = URL.createObjectURL(file);
    setPreviews((prev) => [...prev, src]);
  };

  const handleSave = async () => {
    if (!description.trim() && !files.length && !title.trim() && !previews.length) return;
    
    setIsSubmitting(true);
    setProgress(10);
    setLoadingText(editId ? "Updating your memory..." : "Wrapping up your thoughts...");
    
    const interval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 8 : p));
    }, 400);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("memory_date", memoryDate);
      formData.append("location", location);
      if (mood) formData.append("mood", mood);

      const memory = editId 
        ? await updateMemory(editId, formData)
        : await createMemory(formData);
      
      if (files.length > 0 && memory?.id) {
        setProgress(40);
        setLoadingText("Uploading your photos...");
        const mediaFormData = new FormData();
        files.forEach((file) => {
          mediaFormData.append("files", file);
        });
        
        await uploadMemoryMedia(memory.id, mediaFormData);
      }

      clearInterval(interval);
      setProgress(100);
      setLoadingText("Safely tucked away! ✨");

      setTimeout(() => {
        router.push(editId ? `/journal/${editId}` : "/");
        router.refresh();
      }, 800);
      
    } catch (error) {
      clearInterval(interval);
      console.error("Failed to save memory:", error);
      setIsSubmitting(false);
      setProgress(0);
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
            <button 
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
              <ImageIcon className="w-4 h-4 text-primary" />
              Upload Photo
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

      {/* Cute Saving Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md px-8 animate-in fade-in duration-300">
          <div className="w-20 h-20 mb-6 bg-muted rounded-full flex items-center justify-center">
            {progress < 100 ? (
              <svg className="w-10 h-10 text-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-green-500 animate-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          
          <h2 className="text-xl font-medium mb-8 text-center">{loadingText}</h2>
          
          <div className="w-full max-w-xs h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground font-medium">{Math.floor(Math.min(progress, 100))}%</p>
        </div>
      )}

      <JournalCamera 
        open={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
}

export default function NewJournalPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <NewJournalForm />
    </Suspense>
  );
}
