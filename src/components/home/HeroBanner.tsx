"use client";

import BrutalButton from "../ui/BrutalButton";

export default function HeroBanner() {
  return (
    <section className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]">
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

      <div className="max-w-6xl mx-auto relative z-10 text-center pb-24">
        <div className="hero-container cursor-default mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-brutal-red mb-2 block">
            ⚠ Do not hover over this
          </span>
          <span className="fashion font-mono text-6xl md:text-8xl lg:text-[12rem] font-bold uppercase leading-[0.85] tracking-tight block">
            FASHION
          </span>
          <span className="is-dead font-mono text-6xl md:text-8xl lg:text-[12rem] font-bold uppercase leading-[0.85] tracking-tight block">
            IS DEAD
          </span>
        </div>

        <p className="font-sans text-lg md:text-xl mb-8 max-w-xl mx-auto">
          Raw. High-contrast. Unapologetically ugly. 
          Clothes for people who stopped caring about trends in 2026.
        </p>

        <BrutalButton href="/shop" variant="accent" className="text-lg px-10 py-4">
          Shop the Void
        </BrutalButton>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs uppercase animate-bounce z-20">
        Scroll down
      </div>

      <style>{`
        .hero-container:hover .fashion {
          letter-spacing: 0.25em;
          color: #FF4500;
        }
        .hero-container:hover .is-dead {
          opacity: 1;
          transform: translateY(0);
        }
        .fashion {
          color: #0A0A0A;
          letter-spacing: -0.05em;
          transition: all 0.2s cubic-bezier(0.25, 0, 0.2, 1);
        }
        .is-dead {
          opacity: 0;
          transform: translateY(-0.5em);
          transition: all 0.2s cubic-bezier(0.25, 0, 0.2, 1);
        }
      `}</style>
    </section>
  );
}