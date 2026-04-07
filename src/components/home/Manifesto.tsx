"use client";

import { motion } from "framer-motion";

export default function Manifesto() {
  return (
    <section className="py-16 px-4 bg-cream">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-mono text-6xl md:text-8xl font-bold uppercase text-brutal-black/10 -rotate-90 origin-center md:origin-left md:-translate-x-8">
            Manifesto
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="font-mono text-3xl md:text-4xl font-bold uppercase mb-6 text-accent">
            We make clothes for people who&apos;d rather not exist.
          </h3>
          
          <div className="w-16 h-3 bg-brutal-black mb-6" />

          <p className="font-sans text-base leading-relaxed mb-4">
            Fashion is dead. Trends are a lie. Everything is meaningless.
            So why not dress like it?
          </p>
          <p className="font-sans text-base leading-relaxed mb-4">
            Our pieces are built for people who wake up and choose nothing.
            Zero aesthetic. Maximum comfort with zero effort. Clothes that say
            &quot;I tried nothing and I&apos;m out of ideas.&quot;
          </p>
          <p className="font-sans text-base leading-relaxed">
            0% sustainable. 100% regret. Welcome to the void.
          </p>
        </motion.div>
      </div>
    </section>
  );
}