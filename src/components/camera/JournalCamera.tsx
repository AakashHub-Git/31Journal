"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCcw, Camera, AlertCircle } from "lucide-react";
import { CAMERA_CONFIG } from "@/config/camera";
import { CAMERA_FILTERS, CameraFilter } from "@/config/cameraFilters";
import { getRandomMessage } from "@/data/cameraMessages";
import { CameraPreviewResult } from "./CameraPreviewResult";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";

interface JournalCameraProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function JournalCamera({ open, onClose, onCapture }: JournalCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle");
  const [facingMode, setFacingMode] = useState<"user" | "environment">(CAMERA_CONFIG.defaultFacingMode);
  const [selectedFilter, setSelectedFilter] = useState<CameraFilter>(CAMERA_FILTERS[0]);
  const [capturedImage, setCapturedImage] = useState<{ src: string; file: File } | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [introMessage] = useState(() => getRandomMessage("open"));

  // Cleanup function to stop all tracks
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Initialize camera
  const startCamera = useCallback(async () => {
    setPermissionState("requesting");
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1440 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setPermissionState("granted");
    } catch (err: unknown) {
      console.error("Camera error:", err);
      if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setPermissionState("denied");
      } else {
        setPermissionState("error");
      }
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (open && !capturedImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [open, startCamera, stopCamera, capturedImage]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

    // Trigger flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video source
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Apply CSS filter to canvas context before drawing
    ctx.filter = selectedFilter.cssFilter;

    // If front camera, we might want to mirror the drawing so it matches what they see
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to file
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `journal-photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      const src = URL.createObjectURL(blob);
      setCapturedImage({ src, file });
    }, "image/jpeg", 0.85);
  };

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage.src);
    }
    setCapturedImage(null);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage.file);
      // Clean up URL object
      URL.revokeObjectURL(capturedImage.src);
      setCapturedImage(null);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
      >
        {/* Permission Denied State */}
        {permissionState === "denied" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
              <Camera className="w-10 h-10 text-white/50" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Looks like the camera is taking a little nap 😴</h2>
            <p className="text-white/60 mb-8 max-w-sm">Allow camera access in your browser settings to take a photo here.</p>
            <Button onClick={onClose} variant="secondary" className="rounded-full px-8">Close Camera</Button>
          </div>
        )}

        {/* Error State */}
        {permissionState === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h2 className="text-xl font-medium mb-6">Camera isn&apos;t available here 💭</h2>
            <Button onClick={onClose} variant="secondary" className="rounded-full px-8">Upload Instead</Button>
          </div>
        )}

        {/* Camera UI */}
        {(permissionState === "granted" || permissionState === "requesting") && !capturedImage && (
          <>
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 p-4 pt-12 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
              <IconButton onClick={onClose} className="text-white bg-black/20 hover:bg-black/40 backdrop-blur-md">
                <X className="w-6 h-6" />
              </IconButton>
              
              <p className="font-handwriting text-white/90 text-xl drop-shadow-md">
                {introMessage}
              </p>

              <IconButton onClick={toggleCamera} className="text-white bg-black/20 hover:bg-black/40 backdrop-blur-md">
                <RefreshCcw className="w-5 h-5" />
              </IconButton>
            </div>

            {/* Live Preview */}
            <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
              <video 
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover transition-all duration-300 ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                style={{ filter: selectedFilter.cssFilter }}
              />
              {/* Flash Overlay */}
              <AnimatePresence>
                {isFlashing && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-white z-30 pointer-events-none" 
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 inset-x-0 pb-safe pt-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
              
              {/* Filters Scroll */}
              <div className="flex overflow-x-auto gap-4 px-6 pb-6 hide-scrollbar snap-x">
                {CAMERA_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f)}
                    className={`flex flex-col items-center gap-2 snap-center transition-opacity ${selectedFilter.id === f.id ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl bg-white/10 backdrop-blur-sm border-2 ${selectedFilter.id === f.id ? "border-primary" : "border-transparent"}`}>
                      {f.icon}
                    </div>
                    <span className="text-white text-xs font-medium">{f.name}</span>
                  </button>
                ))}
              </div>

              {/* Shutter Button */}
              <div className="flex justify-center pb-8">
                <button 
                  onClick={takePhoto}
                  className="w-20 h-20 rounded-full border-[6px] border-white/50 flex items-center justify-center hover:border-white/80 transition-colors active:scale-95"
                >
                  <div className="w-16 h-16 bg-white rounded-full" />
                </button>
              </div>
              
            </div>
            
            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        {/* Capture Preview Result */}
        {capturedImage && (
          <CameraPreviewResult 
            imageSrc={capturedImage.src} 
            onRetake={handleRetake} 
            onUsePhoto={handleUsePhoto} 
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
