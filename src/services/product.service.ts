import { products, categories, reviews } from "@/data";
import { Product, PaginatedResult, SearchFilters, Category, Review } from "@/types";

const PAGE_SIZE = 8;

export async function getProducts(
  filters: SearchFilters = {},
): Promise<PaginatedResult<Product>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  let filtered = [...products];

  // Filter by search query
  if (filters.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  // Filter by category
  if (filters.category) {
    const cats = filters.category.split(',').map(c => c.toLowerCase());
    filtered = filtered.filter(
      (p) => cats.includes(p.category.toLowerCase())
    );
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  // Filter by rating
  if (filters.rating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= filters.rating!);
  }

  // Sort
  switch (filters.sort) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    default:
      // Relevance — featured first, then by review count
      filtered.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.reviewCount - a.reviewCount;
      });
  }

  // Paginate
  const page = filters.page || 1;
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const data = filtered.slice(start, start + PAGE_SIZE);

  return {
    data,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  return products.filter((p) => p.isFeatured);
}

export async function getDealProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  return products.filter((p) => p.isDeal).sort((a, b) => b.discount - a.discount);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.subcategory === product.subcategory),
    )
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    )
    .slice(0, 8);
}

export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 20));
  return categories;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  return reviews.filter((r) => r.productId === productId);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}
