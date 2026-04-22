import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/product/product-card";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = "View All",
}: ProductSectionProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} priority={idx < 2} />
        ))}
      </div>

      {viewAllHref && (
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
