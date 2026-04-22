import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";
import { ArrowRight } from "lucide-react";

interface CategoriesGridProps {
  categories: Category[];
}

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Shop by Category
          </h2>
          <p className="text-gray-500 mt-1">
            Browse our curated collections
          </p>
        </div>
        <Link
          href="/products"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-2xl mb-1 block">{cat.icon}</span>
              <h3 className="text-sm font-bold text-white">{cat.name}</h3>
              <p className="text-xs text-white/70 mt-0.5">
                {cat.productCount} products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
