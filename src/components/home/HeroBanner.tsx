"use client";

import { motion } from "framer-motion";
import BrutalButton from "../ui/BrutalButton";

export default function HeroBanner() {
  return (
    <section className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-cream px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            #0A0A0A 40px,
            #0A0A0A 41px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            #0A0A0A 40px,
            #0A0A0A 41px
          )`
        }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1
          className="font-mono text-5xl md:text-7xl lg:text-9xl font-bold uppercase leading-none mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-glitch" data-text="FASHION IS DEAD">
            FASHION IS DEAD
          </span>
        </motion.h1>

        <motion.p
          className="font-sans text-lg md:text-xl mb-8 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Raw. High-contrast. Unapologetically ugly. 
          Clothes for people who stopped caring about trends in 2024.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <BrutalButton href="/shop" variant="accent" className="text-lg px-10 py-4">
            Shop the Void
          </BrutalButton>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs uppercase animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Scroll down
      </motion.div>
    </section>
  );
}