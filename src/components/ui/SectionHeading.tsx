interface SectionHeadingProps {
  children: React.ReactNode;
  rotate?: boolean;
  underline?: boolean;
  className?: string;
}

export default function SectionHeading({
  children,
  rotate = false,
  underline = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <h2
        className={`
          font-mono text-4xl md:text-6xl font-bold uppercase
          ${rotate ? "-rotate-2" : ""}
        `}
      >
        {children}
      </h2>
      {underline && (
        <div className="h-3 bg-accent w-24 mt-2" />
      )}
    </div>
  );
}