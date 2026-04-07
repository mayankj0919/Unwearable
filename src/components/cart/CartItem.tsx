"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-4 py-4 border-b-3 border-brutal-black"
    >
      <div className="w-20 h-20 bg-brutal-black/5 border-brutal border-3 border-brutal-black flex items-center justify-center font-mono text-2xl text-brutal-black/30">
        {item.name.charAt(0)}
      </div>

      <div className="flex-1">
        <h4 className="font-mono font-bold uppercase text-sm">{item.name}</h4>
        <p className="font-sans text-xs text-brutal-black/60">{item.tagline}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 border-brutal border-3 border-brutal-black font-mono font-bold hover:bg-brutal-black hover:text-cream transition-colors"
        >
          -
        </button>
        <span className="w-8 text-center font-mono font-bold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 border-brutal border-3 border-brutal-black font-mono font-bold hover:bg-brutal-black hover:text-cream transition-colors"
        >
          +
        </button>
      </div>

      <div className="font-mono font-bold text-accent min-w-[80px] text-right">
        {formatPrice(item.price * item.quantity)}
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="w-8 h-8 border-brutal border-3 border-brutal-black font-mono hover:bg-accent hover:text-cream transition-colors"
      >
        ✕
      </button>
    </motion.div>
  );
}