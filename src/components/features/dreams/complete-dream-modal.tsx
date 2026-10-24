"use client";

import * as React from "react";
import { DreamItem } from "@/types";
import { completeDreamItem } from "@/app/actions/dreams";
import { Sparkles, Camera, Calendar, Check, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CompleteDreamModalProps {
  dream: DreamItem | null;
  onClose: () => void;
  onSuccess: (updatedDream: DreamItem) => void;
}

export function CompleteDreamModal({
  dream,
  onClose,
  onSuccess,
}: CompleteDreamModalProps) {
  const [completedDate, setCompletedDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Confetti particles
  const [confetti, setConfetti] = React.useState<
    Array<{ id: number; x: string; y: string; scale: number; rotate: number; color: string }>
  >([]);

  React.useEffect(() => {
    if (dream) {
      setCompletedDate(new Date().toISOString().split("T")[0]);
      setPhotoFile(null);
      setPhotoPreview(null);
      setIsSubmitting(false);

      // Trigger celebratory confetti burst
      const colors = ["#f472b6", "#fb7185", "#c084fc", "#fbbf24", "#34d399"];
      setConfetti(
        Array.from({ length: 24 }).map((_, i) => ({
          id: i,
          x: `${Math.random() * 90 + 5}vw`,
          y: `${Math.random() * 80 + 10}vh`,
          scale: Math.random() * 1.4 + 0.6,
          rotate: Math.random() * 360,
          color: colors[i % colors.length],
        }))
      );
    }
  }, [dream]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!dream) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("completed_at", completedDate);
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const updated = await completeDreamItem(dream.id, formData);
      onSuccess(updated);
      onClose();
    } catch (err) {
      console.error("Failed to complete dream:", err);
      setIsSubmitting(false);
    }
  };

  if (!dream) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Floating Celebration Confetti Particles */}
      <AnimatePresence>
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, c.scale, c.scale * 1.1, 0.2],
              y: [0, -120, -160],
              rotate: [0, c.rotate],
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="fixed pointer-events-none z-50 text-2xl select-none"
            style={{ left: c.x, top: c.y, color: c.color }}
          >
            {c.id % 2 === 0 ? "✨" : "💖"}
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        className="w-full max-w-sm rounded-3xl bg-background border border-border shadow-2xl p-6 overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-300 text-white flex items-center justify-center mb-3 shadow-lg shadow-pink-200 dark:shadow-none animate-bounce">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-primary mb-1">
            Dream Unlocked! 🎉
          </span>
          <h3 className="font-semibold text-lg text-foreground leading-snug px-2">
            {dream.title}
          </h3>
        </div>

        {/* Polaroid Memory Photo Upload */}
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground block mb-2">
            Attach a Memory Polaroid (Optional)
          </label>

          {photoPreview ? (
            <div className="relative mx-auto w-40 p-2.5 pb-5 bg-white dark:bg-stone-800 rounded-xl shadow-md border border-black/10 dark:border-white/10 flex flex-col items-center">
              <div className="w-full h-36 rounded-lg overflow-hidden bg-muted mb-2">
                <img
                  src={photoPreview}
                  alt="Polaroid preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-handwriting text-xs text-stone-600 dark:text-stone-300">
                {completedDate} ✨
              </span>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(photoPreview);
                  setPhotoPreview(null);
                  setPhotoFile(null);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground">Upload a photo</span>
              <span className="text-[11px] text-muted-foreground">Snapshot of this moment</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Date Completed */}
        <div className="mb-6">
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Date Achieved
          </label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card">
            <Calendar className="w-4 h-4 text-primary" />
            <input
              type="date"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs font-medium flex-1 text-foreground"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : "Trophy Unlocked! ✨"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
