"use client";

import React, { useState, useEffect } from "react";
import { MemoryCard } from "./memory/memory-card";
import { Memory } from "@/types";
import { staggerContainer } from "@/lib/animations";
import { motion } from "framer-motion";

export function MemoryMasonry({ memories }: { memories: Memory[] }) {
  const [columns, setColumns] = useState(2);

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 768) {
        setColumns(3); // Desktop/Tablet
      } else {
        setColumns(2); // Mobile
      }
    };
    
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Split memories into columns
  const columnData = Array.from({ length: columns }, () => [] as Memory[]);
  
  memories.forEach((memory, index) => {
    columnData[index % columns].push(memory);
  });

  if (memories.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-handwriting text-3xl opacity-60">
          Your diary is empty.
        </p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Add your first cute memory above!
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex gap-4 items-start w-full"
    >
      {columnData.map((col, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4 flex-1">
          {col.map((memory, memIndex) => (
            <MemoryCard 
              key={memory.id} 
              memory={memory} 
              priority={colIndex === 0 && memIndex === 0} 
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
}
