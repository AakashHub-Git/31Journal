"use client";

import * as React from "react";
import { DreamCategory, DreamItem } from "@/types";
import { createDreamItem } from "@/app/actions/dreams";
import { Sparkles, X, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface NewDreamModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newDream: DreamItem) => void;
}

const CATEGORIES: Array<{ id: DreamCategory; label: string; emoji: string }> = [
  { id: "adventures", label: "Cozy Adventures", emoji: "☕" },
  { id: "travel", label: "Travel & Places", emoji: "✈️" },
  { id: "food", label: "Food & Treats", emoji: "🍰" },
  { id: "goals", label: "Life Goals", emoji: "🌟" },
];

export function NewDreamModal({
  open,
  onClose,
  onSuccess,
}: NewDreamModalProps) {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<DreamCategory>("adventures");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle("");
      setCategory("adventures");
      setDescription("");
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("category", category);
      if (description.trim()) {
        formData.append("description", description.trim());
      }

      const created = await createDreamItem(formData);
      onSuccess(created);
      onClose();
    } catch (err) {
      console.error("Failed to add dream:", err);
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 12 }}
        className="w-full max-w-sm rounded-3xl bg-background border border-border shadow-2xl p-6 overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-base tracking-tight text-foreground">
              Add to Dream Board
            </h3>
            <p className="text-xs text-muted-foreground">What adventure awaits us?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                    category === cat.id
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Dream Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stargaze in the mountains 🏔️"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Notes or Location (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any details, ideas, or cozy notes..."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-card text-xs focus:outline-none focus:border-primary transition-colors resize-none text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Adding..." : "Add to Board"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
