"use client";

import * as React from "react";
import Image from "next/image";
import { motion, HTMLMotionProps } from "framer-motion";
import { Photo } from "@/types";
import { cn } from "@/lib/utils";
import { imageReveal } from "@/lib/animations";

export interface PhotoMemoryProps extends HTMLMotionProps<"div"> {
  photo: Photo;
  aspectRatio?: "square" | "portrait" | "landscape" | "video";
  onClick?: () => void;
  priority?: boolean;
}

export function PhotoMemory({ 
  photo, 
  aspectRatio = "square", 
  onClick,
  priority = false,
  className,
  ...props
}: PhotoMemoryProps) {
  
  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[4/3]",
    video: "aspect-video"
  };

  return (
    <motion.div
      variants={imageReveal}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "relative w-full rounded-2xl overflow-hidden bg-muted/30 shadow-sm",
        aspectClasses[aspectRatio],
        onClick && "cursor-pointer group",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <Image
        src={photo.url}
        alt={photo.alt || "Memory photo"}
        fill
        className={cn(
          "object-cover transition-transform duration-700 ease-out",
          onClick && "group-hover:scale-105"
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
      {onClick && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      )}
    </motion.div>
  );
}
