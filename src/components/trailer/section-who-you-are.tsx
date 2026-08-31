"use client";

import { motion } from "framer-motion";
import { WALKTHROUGH_CONTENT } from "@/config/walkthrough";
import Image from "next/image";

export function SectionWhoYouAre() {
  const { personality } = WALKTHROUGH_CONTENT;

  return (
    <section className="py-32 bg-[#3F3931] min-h-screen relative overflow-hidden text-[#FDFCF8]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20%", once: true }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-playfair mb-32 text-center text-[#E6B869] italic"
        >
          {personality.title}
        </motion.h2>

        <div className="space-y-40 z-10">
          {personality.items.map((item, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}>
              
              {/* Photo */}
              {item.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, rotate: i % 2 === 0 ? -3 : 3 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ margin: "-20%", once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="w-full md:w-1/2 aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image src={item.image} alt={item.text} fill className="object-cover" />
                </motion.div>
              )}

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-20%", once: true }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={`w-full ${item.image ? 'md:w-1/2' : 'w-full text-center'}`}
              >
                <p className="text-3xl md:text-5xl font-light leading-snug">
                  {item.text}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
