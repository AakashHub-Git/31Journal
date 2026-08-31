"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WALKTHROUGH_CONTENT } from "@/config/walkthrough";
import Image from "next/image";

export function SectionJournalReveal() {
  const { closing } = WALKTHROUGH_CONTENT;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-black relative overflow-hidden text-[#FDFCF8]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={closing.finalPhoto} 
          alt="Final" 
          fill 
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="max-w-2xl w-full mx-auto text-center z-10 flex flex-col items-center mt-32">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20%", once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-16 space-y-8"
        >
          <p className="text-2xl md:text-4xl font-light leading-relaxed drop-shadow-md">
            {closing.message}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "-20%", once: true }}
          transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
        >
          <Link href="/login" className="group relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-[#E6B869] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
            <button className="relative px-8 py-4 bg-[#FDFCF8] text-[#3F3931] rounded-full font-medium text-lg tracking-wide hover:bg-white transition-colors flex items-center gap-3 overflow-hidden">
              <span className="relative z-10">{closing.buttonText}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
