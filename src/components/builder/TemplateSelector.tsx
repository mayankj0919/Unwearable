"use client";

import { motion } from "framer-motion";
import type { Template } from "@/types";
import { useDesign } from "@/context/DesignContext";

interface TemplateSelectorProps {
  templates: Template[];
}

export default function TemplateSelector({ templates }: TemplateSelectorProps) {
  const { state, setTemplate } = useDesign();

  if (templates.length === 0) {
    return (
      <div className="text-center py-16 border-brutal border-3 bg-cream/50">
        <p className="font-mono text-2xl uppercase mb-2">No Templates Yet</p>
        <p className="font-sans text-brutal-black/60">
          Admin hasn&apos;t configured any customization templates for this product.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-mono text-xl uppercase mb-6 border-b-brutal border-b-3 pb-4">
        01 — Choose a Template
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((template, i) => {
          const isSelected = state.template?.id === template.id;
          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setTemplate(template)}
              className={`
                relative overflow-hidden border-brutal border-3 text-left transition-all duration-100
                ${isSelected
                  ? "bg-brutal-black text-cream shadow-[6px_6px_0_#22C55E]"
                  : "bg-cream text-brutal-black hover:shadow-[4px_4px_0_#0A0A0A]"
                }
              `}
            >
              {/* Template preview image */}
              <div className="aspect-square w-full overflow-hidden bg-brutal-black/5">
                <img
                  src={template.base_image_url}
                  alt={template.name}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0";
                  }}
                />
              </div>

              {/* Info bar */}
              <div className="p-4 border-t-brutal border-t-3">
                <p className="font-mono text-sm font-bold uppercase">{template.name}</p>
                <p className="font-sans text-xs mt-1 opacity-60">
                  {template.placements.length} placement slot
                  {template.placements.length !== 1 ? "s" : ""} ·{" "}
                  {template.colors.length} color
                  {template.colors.length !== 1 ? "s" : ""}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 bg-accent text-cream font-mono text-xs px-2 py-1 uppercase">
                  Selected
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
