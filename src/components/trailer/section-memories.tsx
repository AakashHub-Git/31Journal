"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WALKTHROUGH_CONTENT } from "@/config/walkthrough";
import Image from "next/image";

export function SectionMemories() {
  const { memories } = WALKTHROUGH_CONTENT;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [150, -250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [350, -350]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -150]);

  // Map transforms to array so we can map over them
  const transforms = [y1, y2, y3];
  const positions = [
    "top-10 left-[5%] md:left-[10%] rotate-[-4deg]",
    "top-1/4 right-[5%] md:right-[10%] rotate-[6deg]",
    "bottom-10 left-[20%] md:left-[30%] rotate-[-2deg]"
  ];

  return (
    <section ref={containerRef} className="py-40 bg-[#E6B869] min-h-[150vh] flex flex-col items-center relative overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-20%", once: true }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-playfair mb-32 text-center text-[#3F3931] z-20"
      >
        {memories.title}
      </motion.h2>

      <div className="relative w-full max-w-6xl mx-auto h-[100vh]">
        {memories.items.map((memory, i) => (
          <motion.div 
            key={i}
            style={{ y: transforms[i] || y1 }} 
            className={`absolute w-[70%] md:w-[35%] aspect-[3/4] p-4 bg-white shadow-2xl rounded-sm ${positions[i]} z-${10 + i}`}
          >
            <div className="relative w-full h-[85%] mb-4">
              {memory.image && (
                <Image src={memory.image} alt="Memory" fill className="object-cover rounded-sm" />
              )}
            </div>
            <div className="text-center font-handwriting text-2xl text-[#3F3931]">
              {memory.caption}
            </div>
            <div className="text-center text-xs text-muted-foreground mt-1">
              {memory.text}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
