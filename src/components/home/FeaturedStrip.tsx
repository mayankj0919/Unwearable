"use client";

import { motion } from "framer-motion";
import type { Product } from "@/types";
import ProductCard from "../product/ProductCard";

interface FeaturedStripProps {
  products: Product[];
}

export default function FeaturedStrip({ products }: FeaturedStripProps) {
  const featured = products.slice(0, 4);

  return (
    <section className="py-12 bg-brutal-black overflow-hidden">
      <div className="px-4 mb-6">
        <h2 className="font-mono text-3xl md:text-4xl font-bold uppercase text-cream">
          Featured — {/* */} Void Essentials
        </h2>
      </div>

      <motion.div
        className="flex gap-6 px-4 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -500, right: 0 }}
      >
        {featured.map((product, index) => (
          <motion.div
            key={product.id}
            className="flex-shrink-0 w-72"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}