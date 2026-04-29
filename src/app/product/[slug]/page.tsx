"use client";

import { motion } from "framer-motion";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BrutalButton from "@/components/ui/BrutalButton";
import { getProductBySlug } from "@/lib/api";
import { getTemplatesByProduct } from "@/lib/designApi";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import type { Product, Template } from "@/types";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const COLORS = [
  { id: "1", name: "White" },
  { id: "2", name: "Black" },
  { id: "8", name: "Navy" },
  { id: "41", name: "Grey" },
];
const VIEWS = ["Front", "Back"] as const;

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColorId, setSelectedColorId] = useState("2");
  const [view, setView] = useState<"Front" | "Back">("Front");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        if (p) {
          getTemplatesByProduct(p.slug).then(setTemplates).catch(() => setTemplates([]));
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="px-4 py-8 max-w-6xl mx-auto">
        <p className="font-mono text-center">Loading...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const imagePath = `/images/${view}_${view === "Front" ? "1" : "2"}_c_${selectedColorId}.jpg`;

  const handleAdd = () => {
    addItem({
      ...product,
      selectedSize,
      selectedColorId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16"
      >
        <div className="aspect-square bg-brutal-black/5 border-brutal border-3 border-brutal-black flex items-center justify-center overflow-hidden">
          <img 
            src={imagePath}
            alt={`${product.name} - ${view} view`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="font-mono text-9xl text-brutal-black/20 absolute">
            {product.name.charAt(0)}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <span className="font-mono text-sm uppercase text-accent mb-2">
            {product.category}
          </span>
          
          <h1 className="font-mono text-3xl md:text-4xl font-bold uppercase mb-2">
            {product.name}
          </h1>
          
          <p className="font-sans text-brutal-black/60 mb-4">
            {product.tagline}
          </p>

          <p className="font-mono text-4xl font-bold text-accent mb-6">
            {formatPrice(product.price)}
          </p>

          <div className="w-full h-px bg-brutal-black mb-6" />

          <div className="mb-6">
            <label className="font-mono text-sm uppercase mb-2 block">
              Size
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`
                    font-mono text-sm font-bold uppercase w-12 h-12 border-brutal border-3
                    transition-all duration-100
                    ${selectedSize === size
                      ? "bg-brutal-black text-cream"
                      : "bg-cream text-brutal-black hover:bg-brutal-black hover:text-cream"
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="font-mono text-sm uppercase mb-2 block">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorId(color.id)}
                  className={`
                    font-mono text-xs uppercase px-3 py-2 border-brutal border-3
                    transition-all duration-100
                    ${selectedColorId === color.id
                      ? "bg-brutal-black text-cream"
                      : "bg-cream text-brutal-black hover:bg-brutal-black hover:text-cream"
                    }
                  `}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="font-mono text-sm uppercase mb-2 block">
              View
            </label>
            <div className="flex gap-2">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`
                    font-mono text-sm uppercase px-4 py-2 border-brutal border-3
                    transition-all duration-100
                    ${view === v
                      ? "bg-brutal-black text-cream"
                      : "bg-cream text-brutal-black hover:bg-brutal-black hover:text-cream"
                    }
                  `}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <p className="font-sans text-base leading-relaxed mb-8">
            {product.description}
          </p>

          <BrutalButton 
            onClick={handleAdd}
            variant={added ? "toxic" : "accent"}
            className="w-full md:w-auto"
          >
            {added ? "Added!" : "Add to Cart"}
          </BrutalButton>

          {templates.length > 0 && (
            <BrutalButton
              variant="default"
              onClick={() => router.push(`/customize/${templates[0].id}?product=${product!.slug}&size=${selectedSize}`)}
              className="w-full md:w-auto"
            >
              ✦ Customize
            </BrutalButton>
          )}
        </div>
      </motion.div>
    </div>
  );
}