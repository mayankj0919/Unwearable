"use client";

import { forwardRef } from "react";
import { useDesign } from "@/context/DesignContext";

// The preview canvas dimensions — must match the admin's coordinate system
export const PREVIEW_SIZE = 480;

interface PreviewCanvasProps {
  className?: string;
}

/**
 * Layered CSS preview component.
 * Layer 1: Base product image (transparent PNG from admin-uploaded template)
 * Layer 2: Colored tint overlay at the selected placement slot
 * The outer div with `ref` is what html2canvas will capture.
 */
const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(
  ({ className = "" }, ref) => {
    const { state } = useDesign();
    const { template, selectedColor, selectedPlacement } = state;

    return (
      <div
        className={`relative border-brutal border-3 border-brutal-black bg-white overflow-hidden ${className}`}
        style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
      >
        {/* Layer 1: Base product image */}
        {template ? (
          <img
            src={template.base_image_url}
            alt={template.name}
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-brutal-black/20 text-xl uppercase">
              No template selected
            </span>
          </div>
        )}

        {/* Layer 2: Placement slot highlight with color tint */}
        {selectedPlacement && (
          <div
            className="absolute transition-all duration-300"
            style={{
              left: selectedPlacement.x,
              top: selectedPlacement.y,
              width: selectedPlacement.width,
              height: selectedPlacement.height,
            }}
          >
            {/* Color tint fill */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: selectedColor
                  ? `${selectedColor.hex}55` // 33% opacity
                  : "rgba(34,197,94,0.2)",
                border: `2px dashed ${selectedColor?.hex ?? "#22C55E"}`,
              }}
            />

            {/* Placement label */}
            <div
              className="absolute bottom-0 left-0 right-0 text-center font-mono text-[10px] uppercase py-0.5"
              style={{
                backgroundColor: selectedColor?.hex ?? "#22C55E",
                color: "#fff",
                opacity: 0.85,
              }}
            >
              {selectedPlacement.label}
            </div>
          </div>
        )}

        {/* Layer 3: "Capture area" ref — this entire div is what html2canvas renders */}
        {/* We attach the ref to the outer container for a full preview capture */}
        <div ref={ref} className="absolute inset-0 pointer-events-none" />

        {/* UI overlay: step hint when nothing is selected */}
        {!selectedPlacement && template && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
            <span className="font-mono text-xs uppercase bg-brutal-black/70 text-cream px-3 py-1">
              Select a placement to preview
            </span>
          </div>
        )}
      </div>
    );
  }
);

PreviewCanvas.displayName = "PreviewCanvas";
export default PreviewCanvas;
