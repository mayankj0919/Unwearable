"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDesign, DesignProvider } from "@/context/DesignContext";
import StepSelector from "./StepSelector";
import TemplateSelector from "./TemplateSelector";
import ColorPicker from "./ColorPicker";
import PlacementPicker from "./PlacementPicker";
import ConfirmStep from "./ConfirmStep";
import PreviewCanvas from "./PreviewCanvas";
import type { Template, Product } from "@/types";

interface DesignBuilderInnerProps {
  templates: Template[];
  product: Product;
  selectedSize: string;
}

function DesignBuilderInner({ templates, product, selectedSize }: DesignBuilderInnerProps) {
  const { state } = useDesign();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="font-mono text-sm uppercase text-accent">Design Builder</span>
        <h1 className="font-mono text-3xl md:text-4xl font-bold uppercase mt-1">
          Customize {product.name}
        </h1>
      </div>

      {/* Step progress + nav */}
      <div className="mb-8">
        <StepSelector />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10">
        {/* Left: Step content */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {state.step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <TemplateSelector templates={templates} />
              </motion.div>
            )}
            {state.step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <ColorPicker />
              </motion.div>
            )}
            {state.step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <PlacementPicker />
              </motion.div>
            )}
            {state.step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <ConfirmStep product={product} selectedSize={selectedSize} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Sticky live preview (hidden on step 4 since ConfirmStep has its own) */}
        {state.step < 4 && (
          <div className="hidden lg:flex flex-col gap-4 items-center">
            <p className="font-mono text-xs uppercase text-brutal-black/50 self-start">Live Preview</p>
            <div className="sticky top-24 shadow-[8px_8px_0_#0A0A0A]">
              <PreviewCanvas />
            </div>
            {/* Mini summary under preview */}
            {(state.selectedColor || state.selectedPlacement) && (
              <div className="w-full border-brutal border-3 p-3 bg-cream space-y-1">
                {state.selectedColor && (
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <div className="w-3 h-3 border border-brutal-black" style={{ backgroundColor: state.selectedColor.hex }} />
                    <span className="uppercase">{state.selectedColor.label}</span>
                  </div>
                )}
                {state.selectedPlacement && (
                  <p className="font-mono text-xs uppercase text-brutal-black/60">
                    📍 {state.selectedPlacement.label}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Exported component wraps with DesignProvider so context is scoped to the builder
export default function DesignBuilder({ templates, product, selectedSize }: DesignBuilderInnerProps) {
  return (
    <DesignProvider>
      <DesignBuilderInner templates={templates} product={product} selectedSize={selectedSize} />
    </DesignProvider>
  );
}
