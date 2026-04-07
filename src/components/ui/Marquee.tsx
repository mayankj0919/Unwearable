interface MarqueeProps {
  text?: string;
}

export default function Marquee({ text = "UNWEARABLE — " }: MarqueeProps) {
  return (
    <div className="overflow-hidden bg-brutal-black py-3">
      <div className="marquee-track flex whitespace-nowrap">
        <span className="font-mono text-sm md:text-base uppercase text-cream mx-4">
          {text}
        </span>
        <span className="font-mono text-sm md:text-base uppercase text-cream mx-4">
          {text}
        </span>
        <span className="font-mono text-sm md:text-base uppercase text-cream mx-4">
          {text}
        </span>
        <span className="font-mono text-sm md:text-base uppercase text-cream mx-4">
          {text}
        </span>
        <span className="font-mono text-sm md:text-base uppercase text-cream mx-4">
          {text}
        </span>
        <span className="font-mono text-sm md:text-base uppercase text-cream mx-4">
          {text}
        </span>
        <span className="font-mono text-sm md:text-base uppercase text-cream mx-4">
          {text}
        </span>
        <span className="font-mono text-sm md:text-base uppercase text-cream mx-4">
          {text}
        </span>
      </div>
    </div>
  );
}