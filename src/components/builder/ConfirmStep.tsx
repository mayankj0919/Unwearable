"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDesign } from "@/context/DesignContext";
import { useCart } from "@/context/CartContext";
import { useUser } from "@clerk/nextjs";
import { renderDesignToBlob } from "@/lib/renderDesign";
import { uploadDesignImage, saveDesign } from "@/lib/designApi";
import BrutalButton from "@/components/ui/BrutalButton";
import PreviewCanvas from "@/components/builder/PreviewCanvas";
import type { Product } from "@/types";

interface ConfirmStepProps {
  product: Product;
  selectedSize: string;
}

export default function ConfirmStep({ product, selectedSize }: ConfirmStepProps) {
  const { state, setSaving, setSaveError, setSavedDesign, setPreviewUrl } = useDesign();
  const { addItem } = useCart();
  const { user } = useUser();
  const previewRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"idle" | "rendering" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const { template, selectedColor, selectedPlacement } = state;

  const handleConfirm = async () => {
    if (!template || !selectedColor || !selectedPlacement) return;
    if (!user) {
      setErrorMsg("You must be signed in to save a design.");
      setStatus("error");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setStatus("rendering");
    setErrorMsg(null);

    try {
      // Step 1: Render to blob
      const blob = await renderDesignToBlob(previewRef);
      if (!blob) throw new Error("Rendering failed — check image CORS settings.");

      // Step 2: Generate a local preview URL to show the user
      const localUrl = URL.createObjectURL(blob);
      setDataUrl(localUrl);
      setStatus("uploading");

      // Step 3: Upload PNG to Supabase Storage
      const imageUrl = await uploadDesignImage(blob, user.id);
      if (!imageUrl) throw new Error("Image upload to Supabase Storage failed.");

      setPreviewUrl(imageUrl);

      // Step 4: Save design record
      const design = await saveDesign({
        user_id: user.id,
        template_id: template.id,
        product_slug: product.slug,
        selected_color: selectedColor,
        selected_placement: selectedPlacement,
        design_config: {
          template_id: template.id,
          color: selectedColor,
          placement: selectedPlacement,
        },
        preview_image_url: imageUrl,
        status: "confirmed",
      });

      if (design) {
        setSavedDesign(design.id);
      }

      setStatus("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(msg);
      setSaveError(msg);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      ...product,
      selectedSize,
      selectedColorId: selectedColor?.id ?? "2",
      designId: state.savedDesignId ?? undefined,
      designImageUrl: state.previewImageUrl ?? undefined,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div>
      <h2 className="font-mono text-xl uppercase mb-6 border-b-brutal border-b-3 pb-4">
        04 — Review & Confirm
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Live preview */}
        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-xs uppercase text-brutal-black/60 self-start">Live Preview</p>

          {/* This outer div is the capture target for html2canvas */}
          <div ref={previewRef} className="shadow-[8px_8px_0_#0A0A0A]">
            <PreviewCanvas />
          </div>

          {/* Rendered PNG preview after saving */}
          {dataUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full border-brutal border-3 p-3 bg-cream"
            >
              <p className="font-mono text-xs uppercase mb-2 text-accent">Saved Design Preview</p>
              <img src={dataUrl} alt="Rendered design" className="w-full" />
            </motion.div>
          )}
        </div>

        {/* Right: Summary + Actions */}
        <div className="flex flex-col gap-6">
          {/* Design summary */}
          <div className="border-brutal border-3 bg-cream p-6 space-y-4">
            <h3 className="font-mono text-sm uppercase border-b border-brutal-black/20 pb-3 mb-3">
              Design Summary
            </h3>

            <div className="flex justify-between font-mono text-sm">
              <span className="text-brutal-black/60 uppercase">Product</span>
              <span className="font-bold">{product.name}</span>
            </div>

            <div className="flex justify-between font-mono text-sm">
              <span className="text-brutal-black/60 uppercase">Template</span>
              <span className="font-bold">{template?.name ?? "—"}</span>
            </div>

            <div className="flex justify-between font-mono text-sm items-center">
              <span className="text-brutal-black/60 uppercase">Color</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 border border-brutal-black"
                  style={{ backgroundColor: selectedColor?.hex }}
                />
                <span className="font-bold">{selectedColor?.label ?? "—"}</span>
              </div>
            </div>

            <div className="flex justify-between font-mono text-sm">
              <span className="text-brutal-black/60 uppercase">Placement</span>
              <span className="font-bold">{selectedPlacement?.label ?? "—"}</span>
            </div>

            <div className="flex justify-between font-mono text-sm">
              <span className="text-brutal-black/60 uppercase">Size</span>
              <span className="font-bold">{selectedSize}</span>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-brutal border-3 border-accent bg-accent/10 p-4"
            >
              <p className="font-mono text-sm text-accent uppercase">Error: {errorMsg}</p>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {status !== "done" ? (
              <BrutalButton
                variant="accent"
                onClick={handleConfirm}
                disabled={state.isSaving || !template || !selectedColor || !selectedPlacement}
                className="w-full"
              >
                {status === "rendering" && "Rendering design..."}
                {status === "uploading" && "Saving to cloud..."}
                {status === "idle" && "Save Design"}
                {status === "error" && "Retry Save"}
              </BrutalButton>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-3"
              >
                <div className="border-brutal border-3 bg-toxic p-4 text-center">
                  <p className="font-mono text-sm uppercase font-bold">
                    ✓ Design saved successfully
                  </p>
                </div>
                <BrutalButton
                  variant="accent"
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  {addedToCart ? "Added to Cart!" : "Add to Cart with This Design"}
                </BrutalButton>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
