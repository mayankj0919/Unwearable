"use client";

import { motion } from "framer-motion";
import BrutalButton from "../ui/BrutalButton";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function CartSummary() {
  const { totalPrice, items } = useCart();

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream border-brutal border-3 border-brutal-black p-6"
      style={{ boxShadow: "4px 4px 0 #0A0A0A" }}
    >
      <h3 className="font-mono text-xl font-bold uppercase mb-4">Order Summary</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between font-sans">
          <span>Subtotal</span>
          <span className="font-mono font-bold">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between font-sans">
          <span>Shipping</span>
          <span className="font-mono font-bold text-brutal-black/50">Calculated at checkout</span>
        </div>
      </div>

      <div className="border-t-3 border-brutal-black pt-4 mb-6">
        <div className="flex justify-between font-mono text-xl font-bold">
          <span>Total</span>
          <span className="text-accent">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <BrutalButton href="/checkout" variant="accent" className="w-full">
        Proceed to Checkout
      </BrutalButton>
    </motion.div>
  );
}