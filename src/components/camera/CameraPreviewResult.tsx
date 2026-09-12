"use client";

import React from "react";
import { motion } from "framer-motion";
import { getRandomMessage } from "@/data/cameraMessages";
import { Button } from "@/components/ui/button";

interface CameraPreviewResultProps {
  imageSrc: string;
  onRetake: () => void;
  onUsePhoto: () => void;
}

export function CameraPreviewResult({ imageSrc, onRetake, onUsePhoto }: CameraPreviewResultProps) {
  const [message] = React.useState(() => getRandomMessage("postCapture"));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-sm flex flex-col gap-8">
        
        <div className="rounded-3xl overflow-hidden shadow-paper border border-border/50 bg-card aspect-[3/4] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageSrc} 
            alt="Captured" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="text-center px-4">
          <p className="font-handwriting text-2xl text-foreground/80 mb-6">{message}</p>
          
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 rounded-full h-12" onClick={onRetake}>
              Retake
            </Button>
            <Button className="flex-1 rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90" onClick={onUsePhoto}>
              Use Photo
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
