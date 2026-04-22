import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/services/product.service";
import { SearchFilters, SortOption } from "@/types";
import ProductCard, {
  ProductCardSkeleton,
} from "@/components/product/product-card";
import ProductFilters from "@/components/product/product-filters";
import Pagination from "@/components/ui/pagination";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { SITE_CONFIG } from "@/lib/utils";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    rating?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    query?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category;
  const query = params.query;

  const title = query
    ? `Search results for "${query}"`
    : category
      ? `${category} Products`
      : "All Products";

  const description = query
    ? `Browse search results for "${query}" on ${SITE_CONFIG.name}`
    : category
      ? `Shop the best ${category} products at great prices on ${SITE_CONFIG.name}`
      : `Browse all products across electronics, fashion, home & garden, beauty and more on ${SITE_CONFIG.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/products`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/products`,
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const filters: SearchFilters = {
    category: params.category,
    sort: (params.sort as SortOption) || undefined,
    rating: params.rating ? Number(params.rating) : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    page: params.page ? Number(params.page) : 1,
    query: params.query,
  };

  const result = await getProducts(filters);

  // Build base href for pagination
  const paginationParams = new URLSearchParams();
  if (params.category) paginationParams.set("category", params.category);
  if (params.sort) paginationParams.set("sort", params.sort);
  if (params.rating) paginationParams.set("rating", params.rating);
  if (params.minPrice) paginationParams.set("minPrice", params.minPrice);
  if (params.maxPrice) paginationParams.set("maxPrice", params.maxPrice);
  if (params.query) paginationParams.set("query", params.query);
  const baseHref = `/products?${paginationParams.toString()}`;

  const pageTitle = params.query
    ? `Search results for "${params.query}"`
    : params.category
      ? `${params.category}`
      : "All Products";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          ...(params.category ? [{ label: params.category }] : []),
        ]}
      />

      <div className="mt-6 flex items-start gap-8">
        {/* Filters Sidebar */}
        <Suspense fallback={null}>
          <ProductFilters
            currentCategory={params.category}
            currentSort={params.sort}
            currentRating={params.rating ? Number(params.rating) : undefined}
            currentMinPrice={
              params.minPrice ? Number(params.minPrice) : undefined
            }
            currentMaxPrice={
              params.maxPrice ? Number(params.maxPrice) : undefined
            }
          />
        </Suspense>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {pageTitle}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {result.total} {result.total === 1 ? "product" : "products"}{" "}
                found
              </p>
            </div>

            {/* Mobile Filter */}
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <ProductFilters
                  currentCategory={params.category}
                  currentSort={params.sort}
                  currentRating={
                    params.rating ? Number(params.rating) : undefined
                  }
                  currentMinPrice={
                    params.minPrice ? Number(params.minPrice) : undefined
                  }
                  currentMaxPrice={
                    params.maxPrice ? Number(params.maxPrice) : undefined
                  }
                />
              </Suspense>
            </div>
          </div>

          {/* Products Grid */}
          {result.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {result.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            baseHref={baseHref}
          />
        </div>
      </div>
    </div>
  );
}
