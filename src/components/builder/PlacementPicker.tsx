"use client";

import { motion } from "framer-motion";
import type { PlacementSlot } from "@/types";
import { useDesign } from "@/context/DesignContext";

// Visual representation of what a placement looks like on a shirt
const SLOT_ICONS: Record<PlacementSlot["type"], string> = {
  image: "🖼",
  text: "✏️",
  logo: "⬡",
};

export default function PlacementPicker() {
  const { state, setPlacement } = useDesign();
  const placements = state.template?.placements ?? [];

  if (placements.length === 0) {
    return (
      <div className="text-center py-16 border-brutal border-3 bg-cream/50">
        <p className="font-mono text-lg uppercase">No placement slots defined</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-mono text-xl uppercase mb-6 border-b-brutal border-b-3 pb-4">
        03 — Choose Placement
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {placements.map((slot: PlacementSlot, i: number) => {
          const isSelected = state.selectedPlacement?.id === slot.id;
          return (
            <motion.button
              key={slot.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setPlacement(slot)}
              className={`
                p-5 border-brutal border-3 text-left transition-all duration-100
                ${isSelected
                  ? "bg-brutal-black text-cream shadow-[6px_6px_0_#22C55E]"
                  : "bg-cream text-brutal-black hover:shadow-[4px_4px_0_#0A0A0A]"
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl" aria-hidden="true">
                  {SLOT_ICONS[slot.type]}
                </span>
                {isSelected && (
                  <span className="font-mono text-xs text-accent uppercase border border-accent px-2 py-0.5">
                    Selected
                  </span>
                )}
              </div>

              <p className="font-mono text-base font-bold uppercase mb-1">{slot.label}</p>
              <p className={`font-mono text-xs uppercase mb-3 ${isSelected ? "text-cream/60" : "text-brutal-black/50"}`}>
                Type: {slot.type}
              </p>

              {/* Dimension badge */}
              <div className={`inline-flex gap-1 font-mono text-xs border px-2 py-1 ${isSelected ? "border-cream/30 text-cream/70" : "border-brutal-black/20 text-brutal-black/50"}`}>
                <span>{slot.width}px</span>
                <span>×</span>
                <span>{slot.height}px</span>
                <span className="ml-2 opacity-50">@ ({slot.x}, {slot.y})</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
