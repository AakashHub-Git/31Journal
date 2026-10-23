"use client";

import * as React from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";

interface CassettePlayerProps {
  audioUrl: string;
  title?: string;
  date?: string;
  tapeColor?: "pink" | "mint" | "lavender" | "cream";
  variant?: "full" | "compact";
  className?: string;
  onDelete?: () => void;
}

export function CassettePlayer({
  audioUrl,
  title = "Side A • Sweety's Voice",
  date,
  tapeColor = "pink",
  variant = "full",
  className = "",
  onDelete,
}: CassettePlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);

  // Sync audio duration and time
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const seekTime = Number(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Color schemes
  const colorStyles = {
    pink: {
      body: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 border-pink-300/80 shadow-pink-100/50 dark:from-pink-950/60 dark:via-rose-950/40 dark:to-pink-900/50 dark:border-pink-800/60",
      label: "bg-amber-50/90 text-rose-900 border-rose-200 dark:bg-zinc-900/90 dark:text-pink-200 dark:border-pink-900",
      accent: "text-rose-500",
      spool: "bg-white/80 border-rose-300 dark:bg-zinc-800 dark:border-pink-700",
      cog: "border-rose-400 dark:border-pink-500",
      progress: "accent-rose-500",
    },
    mint: {
      body: "bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100 border-teal-300/80 shadow-teal-100/50 dark:from-teal-950/60 dark:via-emerald-950/40 dark:to-teal-900/50 dark:border-teal-800/60",
      label: "bg-emerald-50/90 text-teal-900 border-teal-200 dark:bg-zinc-900/90 dark:text-teal-200 dark:border-teal-900",
      accent: "text-teal-600",
      spool: "bg-white/80 border-teal-300 dark:bg-zinc-800 dark:border-teal-700",
      cog: "border-teal-400 dark:border-teal-500",
      progress: "accent-teal-500",
    },
    lavender: {
      body: "bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-200 border-purple-300/80 shadow-purple-100/50 dark:from-purple-950/60 dark:via-indigo-950/40 dark:to-purple-900/50 dark:border-purple-800/60",
      label: "bg-purple-50/90 text-purple-900 border-purple-200 dark:bg-zinc-900/90 dark:text-purple-200 dark:border-purple-900",
      accent: "text-purple-600",
      spool: "bg-white/80 border-purple-300 dark:bg-zinc-800 dark:border-purple-700",
      cog: "border-purple-400 dark:border-purple-500",
      progress: "accent-purple-500",
    },
    cream: {
      body: "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-amber-200/80 shadow-amber-100/50 dark:from-amber-950/60 dark:via-stone-900/40 dark:to-amber-900/50 dark:border-amber-800/60",
      label: "bg-white/90 text-amber-900 border-amber-200 dark:bg-zinc-900/90 dark:text-amber-200 dark:border-amber-900",
      accent: "text-amber-600",
      spool: "bg-white/80 border-amber-300 dark:bg-zinc-800 dark:border-amber-700",
      cog: "border-amber-400 dark:border-amber-500",
      progress: "accent-amber-500",
    },
  }[tapeColor];

  // Spool rotation duration based on progress
  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const leftSpoolRadius = 14 - progressRatio * 6;
  const rightSpoolRadius = 8 + progressRatio * 6;

  return (
    <div
      className={`relative rounded-3xl border-2 p-4 sm:p-5 shadow-lg select-none transition-all duration-300 overflow-hidden ${colorStyles.body} ${className}`}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Retro Screws in corners */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full border border-black/20 bg-white/40 flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-black/30" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border border-black/20 bg-white/40 flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-black/30" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full border border-black/20 bg-white/40 flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-black/30" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full border border-black/20 bg-white/40 flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-black/30" />
      </div>

      {/* Delete button (if applicable, e.g. in editor) */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2.5 right-6 w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors z-20 cursor-pointer"
          title="Remove voice note"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Handwritten / Retro Label */}
      <div
        className={`mx-auto rounded-xl border px-3 py-1.5 mb-3.5 shadow-xs flex items-center justify-between gap-2 max-w-sm ${colorStyles.label}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className={`w-3.5 h-3.5 shrink-0 ${colorStyles.accent}`} />
          <span className="font-handwriting text-sm sm:text-base font-semibold tracking-wide truncate">
            {title}
          </span>
        </div>
        {date && (
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-75 shrink-0">
            {date}
          </span>
        )}
      </div>

      {/* Center Tape Window with Dual Animated Spools */}
      <div className="relative mx-auto rounded-2xl bg-black/15 dark:bg-black/40 border border-black/10 dark:border-white/10 p-2.5 mb-3 flex items-center justify-between max-w-xs shadow-inner">
        {/* Left Spool */}
        <div className="relative flex items-center justify-center">
          {/* Tape magnetic reel ring */}
          <div
            className="rounded-full bg-stone-800/80 transition-all duration-300"
            style={{ width: `${leftSpoolRadius * 2}px`, height: `${leftSpoolRadius * 2}px` }}
          />
          {/* Rotating Cog */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            className={`absolute w-7 h-7 rounded-full border-2 flex items-center justify-center ${colorStyles.spool}`}
          >
            <div className={`w-3.5 h-3.5 rounded-full border-2 ${colorStyles.cog}`} />
            <div className="absolute w-1 h-1 bg-black/40 rounded-full" />
          </motion.div>
        </div>

        {/* Center Tape Window / Equalizer Waves */}
        <div className="flex-1 flex flex-col items-center justify-center px-3">
          <div className="w-full h-1 bg-stone-700/60 rounded-full mb-1.5 overflow-hidden flex items-center">
            <div
              className="h-full bg-stone-900 transition-all duration-200"
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>

          {/* Sound waves visualization */}
          <div className="flex items-center gap-0.5 h-4">
            {[0.4, 0.8, 1, 0.6, 0.9, 0.3, 0.7, 0.5, 0.8, 0.4].map((scale, i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: isPlaying ? [scale * 0.4, scale * 1.2, scale * 0.3] : 0.3,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (i % 3) * 0.15,
                  ease: "easeInOut",
                }}
                className={`w-0.5 sm:w-1 bg-stone-700 dark:bg-stone-300 rounded-full origin-bottom`}
                style={{ height: "100%" }}
              />
            ))}
          </div>
        </div>

        {/* Right Spool */}
        <div className="relative flex items-center justify-center">
          {/* Tape magnetic reel ring */}
          <div
            className="rounded-full bg-stone-800/80 transition-all duration-300"
            style={{ width: `${rightSpoolRadius * 2}px`, height: `${rightSpoolRadius * 2}px` }}
          />
          {/* Rotating Cog */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            className={`absolute w-7 h-7 rounded-full border-2 flex items-center justify-center ${colorStyles.spool}`}
          >
            <div className={`w-3.5 h-3.5 rounded-full border-2 ${colorStyles.cog}`} />
            <div className="absolute w-1 h-1 bg-black/40 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Player Controls & Scrubber */}
      <div className="flex flex-col gap-1.5 px-1 max-w-sm mx-auto">
        {/* Scrubber Range */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className={`w-full h-1.5 bg-black/15 dark:bg-white/20 rounded-lg appearance-none cursor-pointer ${colorStyles.progress}`}
        />

        {/* Bottom Time & Buttons */}
        <div className="flex items-center justify-between text-xs font-mono font-medium text-muted-foreground pt-0.5">
          <span>{formatTime(currentTime)}</span>

          {/* Primary Play Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className={`w-9 h-9 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-black/10 dark:border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer ${colorStyles.accent}`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
