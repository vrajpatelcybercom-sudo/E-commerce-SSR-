import Link from "next/link";
import Image from "next/image";
import { Timer, ArrowRight, Zap } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface DealsBarProps {
  products: Product[];
}

export default function DealsBar({ products }: DealsBarProps) {
  return (
    <section className="py-12">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Today&apos;s Deals
              </h2>
              <p className="text-sm text-white/80 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                Ends in 23:45:12
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            See All Deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="bg-white rounded-xl overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-md">
                    -{product.discount}%
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
