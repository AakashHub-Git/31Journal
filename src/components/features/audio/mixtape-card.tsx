"use client";

import * as React from "react";
import Link from "next/link";
import { CassettePlayer } from "./cassette-player";
import { Mic, ArrowRight, Disc } from "lucide-react";
import { motion } from "framer-motion";

export interface MixtapeItem {
  id: string;
  url: string;
  memoryId: string;
  title: string;
  date: string;
}

interface MixtapeCardProps {
  tapes: MixtapeItem[];
  className?: string;
}

export function MixtapeCard({ tapes, className = "" }: MixtapeCardProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (tapes.length === 0) {
    return (
      <div
        className={`p-5 rounded-3xl bg-gradient-to-br from-rose-50/70 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between gap-4 shadow-xs ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-500 flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">Voice Memories</h4>
            <p className="text-xs text-muted-foreground">Record sweet voice notes on your journal</p>
          </div>
        </div>

        <Link
          href="/journal/new"
          className="px-3.5 py-1.5 rounded-full bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition-colors shrink-0 shadow-xs"
        >
          Record
        </Link>
      </div>
    );
  }

  const currentTape = tapes[currentIndex] || tapes[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-3 ${className}`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Disc className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: "6s" }} />
          <h3 className="font-semibold text-sm tracking-tight text-foreground">
            Sweety&apos;s Mixtape
          </h3>
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.2 rounded-full">
            {tapes.length} {tapes.length === 1 ? "tape" : "tapes"}
          </span>
        </div>

        <Link
          href="/gallery"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
        >
          <span>All Tapes</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <CassettePlayer
        audioUrl={currentTape.url}
        title={currentTape.title || "Side A • Sweety's Voice"}
        date={currentTape.date}
        tapeColor="pink"
      />

      {tapes.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {tapes.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to tape ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? "w-6 bg-rose-500" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
