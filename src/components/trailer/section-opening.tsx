"use client";

import { motion } from "framer-motion";
import { WALKTHROUGH_CONTENT } from "@/config/walkthrough";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export function SectionOpening() {
  const { hero, metadata } = WALKTHROUGH_CONTENT;

  const handleScrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={hero.coverPhoto} 
          alt="Cover" 
          fill 
          className="object-cover opacity-60 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
      </div>

      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-playfair text-[#FDFCF8] tracking-wide drop-shadow-lg">
            {hero.greeting}
          </h1>
          <p className="text-xl md:text-2xl font-light text-[#FDFCF8]/90 max-w-2xl mx-auto drop-shadow-md">
            {hero.subtext}
          </p>
          <div className="pt-8">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md text-white/80 text-sm tracking-[0.2em] uppercase">
              {metadata.name} &bull; {metadata.launchDate}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Interactive Scroll Indicator */}
      <motion.button
        type="button"
        onClick={handleScrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer group z-20 focus:outline-none"
        aria-label="Begin"
      >
        <span className="text-xs font-medium tracking-[0.2em] uppercase transition-transform duration-300 group-hover:translate-y-0.5">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center mt-2"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </section>
  );
}
