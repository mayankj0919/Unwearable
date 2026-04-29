"use client";

import { motion } from "framer-motion";
import type { ColorOption } from "@/types";
import { useDesign } from "@/context/DesignContext";

export default function ColorPicker() {
  const { state, setColor } = useDesign();
  const colors = state.template?.colors ?? [];

  if (colors.length === 0) {
    return (
      <div className="text-center py-16 border-brutal border-3 bg-cream/50">
        <p className="font-mono text-lg uppercase">No colors defined for this template</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-mono text-xl uppercase mb-6 border-b-brutal border-b-3 pb-4">
        02 — Choose a Color
      </h2>

      <div className="flex flex-wrap gap-4">
        {colors.map((color: ColorOption, i: number) => {
          const isSelected = state.selectedColor?.id === color.id;
          return (
            <motion.button
              key={color.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setColor(color)}
              title={color.label}
              className={`
                flex flex-col items-center gap-2 p-3 border-brutal border-3 transition-all duration-100
                ${isSelected
                  ? "shadow-[4px_4px_0_#22C55E] bg-brutal-black"
                  : "bg-cream hover:shadow-[3px_3px_0_#0A0A0A]"
                }
              `}
            >
              {/* Color swatch */}
              <div
                className={`w-12 h-12 border-brutal border-2 ${isSelected ? "border-cream" : "border-brutal-black"}`}
                style={{ backgroundColor: color.hex }}
              />
              <span className={`font-mono text-xs uppercase ${isSelected ? "text-cream" : "text-brutal-black"}`}>
                {color.label}
              </span>
              {isSelected && (
                <span className="font-mono text-[10px] text-accent uppercase">✓</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {state.selectedColor && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 border-brutal border-3 bg-cream flex items-center gap-4"
        >
          <div
            className="w-8 h-8 border-brutal border-2 flex-shrink-0"
            style={{ backgroundColor: state.selectedColor.hex }}
          />
          <div>
            <p className="font-mono text-sm uppercase font-bold">{state.selectedColor.label}</p>
            <p className="font-mono text-xs text-brutal-black/60">{state.selectedColor.hex}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
