"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <SectionHeading className="mb-8">Shop — All Void</SectionHeading>
        <p className="font-mono text-center">Loading...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <SectionHeading className="mb-8">Shop — All Void</SectionHeading>
        <p className="font-mono text-center">No products found.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <SectionHeading className="mb-8">Shop — All Void</SectionHeading>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <motion.button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              font-mono text-sm uppercase px-4 py-2 border-brutal border-3
              transition-all duration-100
              ${activeCategory === category 
                ? "bg-brutal-black text-cream" 
                : "bg-cream text-brutal-black hover:bg-brutal-black hover:text-cream"
              }
            `}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
}