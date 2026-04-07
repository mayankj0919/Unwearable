"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BrutalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "default" | "accent" | "toxic";
  disabled?: boolean;
}

export default function BrutalButton({
  children,
  onClick,
  href,
  className,
  variant = "default",
  disabled = false,
}: BrutalButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-mono text-sm font-bold uppercase
    px-6 py-3 border-brutal border-3 border-brutal-black
    transition-all duration-100
  `;

  const variants = {
    default: "bg-cream text-brutal-black hover:bg-brutal-black hover:text-cream",
    accent: "bg-accent text-cream hover:bg-brutal-black",
    toxic: "bg-toxic text-brutal-black hover:bg-brutal-black hover:text-toxic",
  };

  const motionProps = {
    whileHover: disabled ? {} : { x: -4, y: -4, boxShadow: "8px 8px 0 #0A0A0A" },
    whileTap: disabled ? {} : { x: 0, y: 0, boxShadow: "0px 0px 0 #0A0A0A" },
  };

  const button = (
    <motion.button
      className={cn(
        baseStyles,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ boxShadow: "4px 4px 0 #0A0A0A" }}
      onClick={onClick}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </motion.button>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="inline-block">
        {button}
      </Link>
    );
  }

  return button;
}