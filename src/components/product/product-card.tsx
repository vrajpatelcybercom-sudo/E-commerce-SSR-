import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "./add-to-cart-button";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  return (
    <article className="product-card group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-gray-50"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover product-image"
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
              -{product.discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg">
              Featured
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <AddToCartButton product={product} variant="overlay" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <p className="text-xs font-medium text-indigo-600 mb-1">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors mb-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stockCount < 10 && product.inStock && (
          <p className="text-xs text-orange-600 font-medium mt-1.5">
            Only {product.stockCount} left in stock
          </p>
        )}
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton w-16" />
        <div className="h-4 skeleton w-full" />
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-24" />
        <div className="h-6 skeleton w-20 mt-2" />
      </div>
    </div>
  );
}
