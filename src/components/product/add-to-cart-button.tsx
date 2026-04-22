"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "overlay" | "detail";
  quantity?: number;
}

export default function AddToCartButton({
  product,
  variant = "default",
  quantity = 1,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(quantity);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50";

  const variants = {
    default:
      "px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300",
    overlay:
      "w-full py-2.5 text-sm bg-white hover:bg-indigo-50 text-gray-900 rounded-xl shadow-xl",
    detail:
      "w-full py-3.5 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98]",
  };

  const button = (
    <button
      onClick={handleAdd}
      disabled={!product.inStock}
      className={cn(baseClasses, variants[variant])}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          Added {qty} to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </>
      )}
    </button>
  );

  if (variant === "detail") {
    return (
      <div className="flex gap-4">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2">
          <button 
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="text-gray-500 hover:text-indigo-600 font-bold text-lg"
          >
            -
          </button>
          <span className="w-6 text-center font-semibold text-gray-900">{qty}</span>
          <button 
            onClick={() => setQty(qty + 1)}
            className="text-gray-500 hover:text-indigo-600 font-bold text-lg"
          >
            +
          </button>
        </div>
        <div className="flex-1">
          {button}
        </div>
      </div>
    );
  }

  return button;
}
