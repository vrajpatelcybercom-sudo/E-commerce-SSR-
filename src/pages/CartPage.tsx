"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { useMounted } from "@/hooks";

export default function CartPage() {
  const mounted = useMounted();
  const { items, removeItem, updateQuantity, getSubtotal, getTax, getShipping, getTotal } =
    useCartStore();

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 skeleton w-48" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added any products yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
        Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex gap-4 sm:gap-6"
            >
              {/* Image */}
              <Link
                href={`/product/${product.slug}`}
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${product.slug}`}
                  className="text-sm sm:text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-0.5 bg-gray-100 rounded-xl">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, quantity - 1)
                      }
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, quantity + 1)
                      }
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-36">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax</span>
                <span>{formatPrice(getTax())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {getShipping() === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    formatPrice(getShipping())
                  )}
                </span>
              </div>
              {getShipping() > 0 && (
                <p className="text-xs text-gray-400">
                  Free shipping on orders over $99
                </p>
              )}
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="font-bold text-gray-900 text-base">Total</span>
                <span className="font-bold text-gray-900 text-base">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 text-sm text-gray-600 font-medium hover:text-indigo-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
