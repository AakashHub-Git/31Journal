"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, ChevronRight, X } from "lucide-react";
import { generateMonthlyWrapped } from "@/app/actions/ai";
import Link from "next/link";
import { IconButton } from "@/components/ui/icon-button";

interface WrappedData {
  theme: string;
  dominantMood: string;
  highlightText: string;
  topMemoryId: string;
}

export function MonthlyWrappedCard() {
  const [data, setData] = React.useState<WrappedData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasAttempted, setHasAttempted] = React.useState(false);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const currentDate = new Date();
  const displayMonth = monthNames[currentDate.getMonth()];

  const handleGenerate = async () => {
    setLoading(true);
    setHasAttempted(true);
    try {
      const result = await generateMonthlyWrapped(currentDate.getFullYear(), currentDate.getMonth() + 1);
      if (result) {
        setData(result);
        setIsOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!data && hasAttempted && !loading) {
    return null; // Not enough data or failed
  }

  return (
    <>
      {/* Trigger Card on Home Feed */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        className="relative overflow-hidden app-image bg-gradient-to-br from-primary via-primary/80 to-secondary text-primary-foreground p-5 shadow-md cursor-pointer group hover-animate mb-6 mx-1"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Sparkles className="w-24 h-24" />
        </div>
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{displayMonth} Wrapped</span>
          </div>
          <h3 className="text-2xl font-bold font-serif leading-tight">
            {loading ? "Analyzing your month..." : "Your Monthly Insights are ready"}
          </h3>
          <p className="text-primary-foreground/90 text-sm mt-1">
            {loading ? "Reading through your memories using AI ✨" : "Tap to reveal your personal summary"}
          </p>
          
          {!loading && (
            <div className="mt-4 flex items-center gap-1 text-sm font-bold bg-white/20 self-start px-3 py-1.5 rounded-full">
              View Story <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Full Screen Story Modal */}
      <AnimatePresence>
        {isOpen && data && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
            
            <header className="px-4 py-6 flex items-center justify-between z-10">
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-2">
                {displayMonth} Wrapped
              </span>
              <IconButton variant="ghost" onClick={() => setIsOpen(false)} className="rounded-full bg-muted/50 hover:bg-muted">
                <X className="w-5 h-5" />
              </IconButton>
            </header>

            <main className="flex-1 flex flex-col justify-center px-8 pb-20 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h2 className="text-primary text-lg font-handwriting mb-2">The vibe was</h2>
                <h1 className="text-4xl font-bold text-foreground leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
                  "{data.theme}"
                </h1>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="app-image bg-card border border-border/50 p-6 shadow-xl relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-lg leading-relaxed text-foreground font-serif">
                  {data.highlightText}
                </p>
                <div className="mt-6 flex items-center gap-2 border-t border-border/50 pt-4">
                  <span className="text-sm text-muted-foreground">Dominant Mood:</span>
                  <span className="px-3 py-1 bg-secondary/30 text-secondary-foreground text-sm font-bold rounded-full capitalize">
                    {data.dominantMood}
                  </span>
                </div>
              </motion.div>

              {data.topMemoryId && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="flex flex-col items-center mt-4"
                >
                  <p className="text-sm text-muted-foreground mb-3">Your most significant memory</p>
                  <Link href={`/journal/${data.topMemoryId}`} onClick={() => setIsOpen(false)}>
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-md hover-animate">
                      Revisit Memory
                    </button>
                  </Link>
                </motion.div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
