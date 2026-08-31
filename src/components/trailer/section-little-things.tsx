"use client";

import { motion } from "framer-motion";
import { WALKTHROUGH_CONTENT } from "@/config/walkthrough";
import Image from "next/image";

export function SectionLittleThings() {
  const { littleThings } = WALKTHROUGH_CONTENT;

  return (
    <section className="py-32 bg-[#F5F2ED] min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20%", once: true }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-playfair mb-24 text-center text-[#5B6B5D]"
        >
          {littleThings.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10">
          {littleThings.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-10%", once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className="group relative flex flex-col gap-4"
            >
              {item.image && (
                <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden shadow-lg">
                  <Image 
                    src={item.image} 
                    alt={item.text} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              )}
              <div className="px-2">
                <p className="text-xl text-[#3F3931] font-handwriting leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
