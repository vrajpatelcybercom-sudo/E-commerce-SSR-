# In-Depth Guide: Product Filtering Architecture Explained

This document provides a line-by-line, file-by-file breakdown of how the product filtering system operates in your application. Your application utilizes Next.js App Router (Wait, technically `src/pages` indicates Pages Router or a custom structure, but here we see `use client` and Server Component patterns indicative of the App Router's `page.tsx` approach or a modernized setup).

At a high level, the filtering system avoids storing filter states (like "Selected Category") in standard React states (`useState`). Instead, **URL Query Parameters** (e.g., `?category=Fashion&minPrice=50`) serve as the absolute source of truth. 

When a user clicks a filter:
1. The Client Component updates the URL.
2. The Server Component re-renders and reads the new URL parameters.
3. The Server Component calls the mock "Database/Network" function, which filters the items and yields the correct result.

---

## 1. The Client: `product-filters.tsx`

This file is responsible for the Interactive UI. Since it has `"use client";` at the top, it runs in the user's browser. It uses `useSearchParams` and `useRouter` from `next/navigation` to read and push URL updates.

### Key Mechanism: `updateParams`
```tsx
const updateParams = (key: string, value: string | undefined) => {
  const params = new URLSearchParams(searchParams?.toString() || "");
  if (value) {
    params.set(key, value); // E.g., sets "category" to "Electronics"
  } else {
    params.delete(key); // Removes the filter if undefined is passed
  }
  params.delete("page"); // Resets pagination to page 1 whenever a filter changes
  router.push(`/products?${params.toString()}`); // Triggers a network navigation to the new URL
};
```
> [!NOTE]
> Why use URL parameters instead of Local React State?
> 1. **Shareable URLs:** A user can copy `products?category=Fashion` and send it to a friend, and the friend sees exactly what the user saw.
> 2. **SEO Friendly:** Search engines can crawl parameterized links.
> 3. **Server Rendering:** The server can immediately read the expected values and render the page fully populated, skipping the "loading spinner" phase.

### Category Toggling
```tsx
const toggleCategory = (cat: string) => {
  let newCats;
  if (activeCategories.includes(cat)) {
    // If the category is already active, remove it
    newCats = activeCategories.filter((c) => c !== cat);
  } else {
    // If it's not active, append it to the array
    newCats = [...activeCategories, cat];
  }
  // Convert the array to a comma-separated string: "Fashion,Beauty"
  updateParams("category", newCats.length > 0 ? newCats.join(',') : undefined);
};
```

### Price Filtering
In the `PRICE_RANGES.map` block, we manually construct the logic:
```tsx
  if (isActive) {
    // If the clicked range is already active, we delete the bounds to toggle it off
    params.delete("minPrice");
    params.delete("maxPrice");
...
```

---

## 2. The Server/Page Controller: `ProductsPage.tsx`

Because `ProductsPage` lacks `"use client"`, it is a **Server Component**. When `router.push()` alters the URL, Next.js shoots a sub-network request to the server, which re-evaluates this file.

### Reading the URL Params
```tsx
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Awaits the searchParams promise (a standard required by modern NextJS versions)
  const params = (await searchParams) || {};
```

### Constructing the Filter Object
It takes the raw string values from the URL query and maps them into a strictly typed `SearchFilters` object. Missing variables become `undefined`.
```tsx
  const filters: SearchFilters = {
    category: params.category, // e.g., "Fashion,Beauty"
    sort: (params.sort as SortOption) || undefined,
    rating: params.rating ? Number(params.rating) : undefined, // Casts string to numbers
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    page: params.page ? Number(params.page) : 1, // Defaults to page 1
    query: params.query,
  };
```

### Fetching Data (The "Network" Call)
```tsx
  // This executes on the server!
  const result = await getProducts(filters);
```

### Prop Drilling to Client
```tsx
  // We feed the URL-derived values back down to the Client Component
  // so the checkboxes and highlights show the correctly 'Saved' states.
  <ProductFilters
    currentCategory={params.category}
    currentSort={params.sort}
    currentRating={params.rating ? Number(params.rating) : undefined}
    ...
  />
```

---

## 3. The Backend Mock Layer: `product.service.ts`

This behaves exactly like a Real Database/SQL query would behind the scenes, parsing operations memory-first.

```tsx
export async function getProducts(
  filters: SearchFilters = {},
): Promise<PaginatedResult<Product>> {
  // 1. SIMULATED NETWORK DELAY
  // This artificially pauses the thread for 50ms to mimic an authentic database 
  // or third-party API request, making loading states realistic.
  await new Promise((resolve) => setTimeout(resolve, 50));

  // 2. DATA SOURCE
  // Copies the static JSON imports into a fresh array
  let filtered = [...products];

  // 3. CATEGORY REDUCTION
  if (filters.category) {
    // Splits the comma-separated string back into an array 
    const cats = filters.category.split(',').map(c => c.toLowerCase());
    filtered = filtered.filter(
      (p) => cats.includes(p.category.toLowerCase())
    );
  }

  // 4. PRICE & RATING REDUCTION
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }

  // 5. SORTING APPLICATION
  switch (filters.sort) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    ...
  }

  // 6. PAGINATION
  const page = filters.page || 1;
  const total = filtered.length; // Counts matching results
  const PAGE_SIZE = 8;
  const start = (page - 1) * PAGE_SIZE;
  // Slices 8 precise items based on the page number
  const data = filtered.slice(start, start + PAGE_SIZE);

  // Returns identical structure to an Express/Backend API Response
  return { data, total, page, pageSize: PAGE_SIZE, totalPages };
}
```

## Summary
1. User interacts with UI (`product-filters.tsx`).
2. Event pushes query variables to the URL String (`?category=Fashion`).
3. The Server reads the string inside the `ProductsPage` Server Component.
4. Server translates string into backend instruction arguments.
5. The memory "Database" (`product.service.ts`) slices, slices, and sorts array targets.
6. The Server hands the final visual results to HTML and refreshes the browser without the page blinking.
