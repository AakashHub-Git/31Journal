"use client";

import * as React from "react";
import { Mic, Square, RotateCcw, Check, X, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CassettePlayer } from "./cassette-player";

interface VoiceRecorderModalProps {
  open: boolean;
  onClose: () => void;
  onSaveAudio: (file: File) => void;
  titleHint?: string;
}

export function VoiceRecorderModal({
  open,
  onClose,
  onSaveAudio,
  titleHint = "Side A • Sweety's Voice",
}: VoiceRecorderModalProps) {
  const [recorderState, setRecorderState] = React.useState<"idle" | "recording" | "preview">("idle");
  const [recordSeconds, setRecordSeconds] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const recordedBlobRef = React.useRef<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  // Web Audio Analyser for live frequency visualization
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const [volumeLevels, setVolumeLevels] = React.useState<number[]>([10, 10, 10, 10, 10, 10, 10, 10]);

  // Clean up on close/unmount
  const stopAll = React.useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach((t) => t.stop());
    }
  }, []);

  React.useEffect(() => {
    if (!open) {
      stopAll();
      setRecorderState("idle");
      setRecordSeconds(0);
      setErrorMsg(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [open, stopAll, previewUrl]);

  // Timer while recording
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (recorderState === "recording") {
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [recorderState]);

  const startLiveVisualizer = (stream: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 32;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolumes = () => {
        analyser.getByteFrequencyData(dataArray);
        // sample 8 frequency bands
        const sampled: number[] = [];
        const step = Math.floor(dataArray.length / 8);
        for (let i = 0; i < 8; i++) {
          const val = dataArray[i * step] || 0;
          sampled.push(Math.max(12, (val / 255) * 60));
        }
        setVolumeLevels(sampled);
        animationFrameRef.current = requestAnimationFrame(updateVolumes);
      };

      updateVolumes();
    } catch {
      // Audio visualizer fallback
    }
  };

  const handleStartRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startLiveVisualizer(stream);

      // Determine supported mimeType
      const mimeTypes = ["audio/webm", "audio/mp4", "audio/ogg", ""];
      let selectedMime = "";
      for (const m of mimeTypes) {
        if (!m || MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, selectedMime ? { mimeType: selectedMime } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const mime = recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mime });
        recordedBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setRecorderState("preview");
      };

      recorder.start(200);
      setRecordSeconds(0);
      setRecorderState("recording");
    } catch (err: unknown) {
      console.error("Microphone access error:", err);
      const isDenied = err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      setErrorMsg(isDenied ? "Microphone permission was denied. Please allow mic access in your browser." : "Unable to access microphone. Please check your audio settings.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRerecord = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    recordedBlobRef.current = null;
    audioChunksRef.current = [];
    setRecordSeconds(0);
    handleStartRecording();
  };

  const handleConfirmSave = () => {
    if (!recordedBlobRef.current) return;
    const mime = recordedBlobRef.current.type || "audio/webm";
    const ext = mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : "webm";
    const file = new File([recordedBlobRef.current], `audio_${Date.now()}.${ext}`, { type: mime });
    onSaveAudio(file);
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 12 }}
        className="w-full max-w-sm rounded-3xl bg-background border border-border/80 shadow-2xl p-6 overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base tracking-tight text-foreground">Voice Note</h3>
              <p className="text-xs text-muted-foreground">Record a sweet audio memory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg ? (
          <div className="py-6 px-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-xs sm:text-sm">{errorMsg}</p>
              <button
                onClick={handleStartRecording}
                className="mt-3 px-3 py-1 bg-destructive text-white rounded-full text-xs font-medium cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : recorderState === "idle" ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mb-5 shadow-inner">
              <Mic className="w-9 h-9 text-rose-500" />
            </div>
            <p className="text-sm font-medium mb-1">Ready to record</p>
            <p className="text-xs text-muted-foreground max-w-xs mb-6">
              Speak your thoughts, sing a song, or record a sweet message for today.
            </p>
            <button
              onClick={handleStartRecording}
              className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm shadow-md shadow-rose-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Start Recording</span>
            </button>
          </div>
        ) : recorderState === "recording" ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            {/* Live Animated Frequency Wave Bars */}
            <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-xs px-4 mb-4">
              {volumeLevels.map((height, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${height}px` }}
                  transition={{ ease: "easeOut", duration: 0.08 }}
                  className="w-2.5 rounded-full bg-gradient-to-t from-rose-500 to-pink-300"
                />
              ))}
            </div>

            {/* Recording timer & pulsing heart */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="font-mono text-xl font-bold tracking-wider text-rose-500">
                {formatTime(recordSeconds)}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-6">Recording your voice note...</p>

            <button
              onClick={handleStopRecording}
              className="px-6 py-3 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-medium text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Recording</span>
            </button>
          </div>
        ) : (
          /* Preview state with Cassette Player */
          <div className="py-2 flex flex-col items-center">
            {previewUrl && (
              <CassettePlayer
                audioUrl={previewUrl}
                title={titleHint}
                date="Today"
                tapeColor="pink"
                className="w-full mb-5"
              />
            )}

            <div className="flex items-center justify-between w-full gap-3 pt-2">
              <button
                type="button"
                onClick={handleRerecord}
                className="flex-1 py-2.5 px-3 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-record</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 px-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Attach Tape</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
