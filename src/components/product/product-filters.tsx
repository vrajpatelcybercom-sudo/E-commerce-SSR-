"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Star, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Beauty",
  "Sports",
  "Books",
];

const PRICE_RANGES = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250 - $500", min: 250, max: 500 },
  { label: "$500 - $1000", min: 500, max: 1000 },
  { label: "Over $1000", min: 1000, max: undefined },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "newest", label: "Newest Arrivals" },
];

interface ProductFiltersProps {
  currentCategory?: string;
  currentSort?: string;
  currentRating?: number;
  currentMinPrice?: number;
  currentMaxPrice?: number;
}

export default function ProductFilters({
  currentCategory,
  currentSort,
  currentRating,
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateParams = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const query = searchParams?.get("query");
    if (query) params.set("query", query);
    router.push(`/products?${params.toString()}`);
  };

  const hasActiveFilters =
    currentCategory || currentRating || currentMinPrice || currentMaxPrice;

  const activeCategories = currentCategory ? currentCategory.split(',') : [];

  const toggleCategory = (cat: string) => {
    let newCats;
    if (activeCategories.includes(cat)) {
      newCats = activeCategories.filter((c) => c !== cat);
    } else {
      newCats = [...activeCategories, cat];
    }
    updateParams("category", newCats.length > 0 ? newCats.join(',') : undefined);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Active Filters</h3>
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeCategories.map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg">
                {cat}
                <button onClick={() => toggleCategory(cat)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {currentRating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg">
                {currentRating}+ Stars
                <button onClick={() => updateParams("rating", undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sort */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Sort By</h3>
        <select
          value={currentSort || "relevance"}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Categories</h3>
        <ul className="space-y-2">
          {CATEGORIES.map((cat) => (
            <li key={cat} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`cat-${cat}`}
                checked={activeCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor={`cat-${cat}`} className="text-sm text-gray-700 cursor-pointer flex-1 select-none">
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Price Range</h3>
        <ul className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive =
              currentMinPrice === range.min &&
              (range.max === undefined
                ? currentMaxPrice === undefined
                : currentMaxPrice === range.max);
            return (
              <li key={range.label}>
                <button
                  onClick={() => {
                    if (isActive) {
                      const params = new URLSearchParams(searchParams?.toString() || "");
                      params.delete("minPrice");
                      params.delete("maxPrice");
                      params.delete("page");
                      router.push(`/products?${params.toString()}`);
                    } else {
                      const params = new URLSearchParams(searchParams?.toString() || "");
                      params.set("minPrice", String(range.min));
                      if (range.max !== undefined) {
                        params.set("maxPrice", String(range.max));
                      } else {
                        params.delete("maxPrice");
                      }
                      params.delete("page");
                      router.push(`/products?${params.toString()}`);
                    }
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Customer Review</h3>
        <ul className="space-y-1">
          {[4, 3, 2, 1].map((rating) => (
            <li key={rating}>
              <button
                onClick={() =>
                  updateParams(
                    "rating",
                    currentRating === rating ? undefined : String(rating),
                  )
                }
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                  currentRating === rating
                    ? "bg-amber-50 text-amber-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3.5 h-3.5",
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200",
                      )}
                    />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-36">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
