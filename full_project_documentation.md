# ShopVerse Code Architecture Handbook

This document provides a highly granular, code-level breakdown of the ShopVerse Web Application. It is designed so that you can trace exactly how data flows across the system, how state is preserved, and how server components interface with client interactivity, enabling you to answer highly technical questions about the architecture.

---

## Part 1: Global State Management (Zustand)

ShopVerse manages financial checkout and cart interactivity via **Zustand**, located in `src/store/cart-store.ts`.

### 1. The Store Foundation
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
```
Because the cart lives in `src/store/cart-store.ts`, a file marked `"use client"`, it leverages `window.localStorage` by wrapping the store logic in `persist`. This guarantees that if a user closes their browser and returns tomorrow, their items will still be saved inside the browser cache under the `name: "shopverse-cart"` key.

### 2. State Actions: Line-by-Line Logic
```typescript
addItem: (product: Product, quantity = 1) => {
  // `set` allows you to inject state modifications.
  set((state) => {
    // 1. Array scanning: Does this exact ID already exist in the user's cart array?
    const existingItem = state.items.find(
      (item) => item.product.id === product.id,
    );
    if (existingItem) {
      // 2. Map through the old array. If the ID matches, overwrite the quantity value
      // by adding the new amount onto the old amount (+1 by default).
      return {
        items: state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      };
    }
    // 3. Fallback: If it's totally new, copy the old array [...state.items] 
    // and push the new object on the end.
    return { items: [...state.items, { product, quantity }] };
  });
},
```
You can be asked: *"What happens if you click add to cart on negative quantity?"* -> The file protects itself in `updateQuantity` by forcefully calling `removeItem(productId)` if the quantity dips to `< 1`.

### 3. Financial Reducers
ShopVerse calculates costs in real-time derived from state functions:
```typescript
getSubtotal: () => {
  // `reduce` works over the array starting at (0). It adds the item price 
  // multiplied by how many are in the cart to an accumulator (acc).
  return get().items.reduce(
    (acc, item) => acc + item.product.price * item.quantity, 0,
  );
},
```
- **Tax Model:** Hardcoded as `getSubtotal() * 0.08` (an 8% global tax applied at checkout).
- **Shipping Threshold:** Hardcoded. It calls `getSubtotal()`; if the total is `>= 99`, it returns `0` (Free Shipping). Otherwise, it charges `9.99`.

---

## Part 2: Product UI Architecture (`src/components/product/product-card.tsx`)

This component visually parses `Product` Types. 

### 1. Responsive Visual Framing
```typescript
<Link
  href={`/product/${product.slug}`}
  className="relative aspect-square overflow-hidden bg-gray-50"
>
```
Everything hinges on `aspect-square`, forcing uniform box-sizes globally whether you're viewing a TV or a shirt. 

### 2. Image Loading Heuristics
```tsx
<Image
  src={product.images[0]}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  priority={priority} // true/false toggle for Above-The-Fold fetching
/>
```
Using the Next.js `<Image>` component, it prevents layout shift. `sizes=` creates aggressive breakpoints: if you are on mobile (`max-width: 640px`), it downloads the huge `100vw` image. If you're on desktop, it serves a compressed `25vw` asset to save bandwidth.

### 3. Price & Discount Calculus
The UI dynamically conditionally checks for active sales:
```tsx
{product.originalPrice > product.price && (
  <span className="text-sm text-gray-400 line-through">
    {formatPrice(product.originalPrice)}
  </span>
)}
```
Only if `originalPrice` exceeds `price` will the gray, strikethrough price render natively. A badge also conditionally spawns top-left `-{product.discount}%` using early-exit boolean logic. 

---

## Part 3: Navigation Architecture (`src/components/layout/header.tsx`)

The Header relies intimately on `useCartStore` to reflect notifications.

### Search Functionality (Client Side Filter)
```tsx
useEffect(() => {
  if (!debouncedQuery.trim()) { ... }
  const q = debouncedQuery.toLowerCase();
  
  // Directly loops the static `products` array previously fetched
  const results = products
    .filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
    .slice(0, 5) // Restricts the dropdown visual limit to exactly 5 matches to prevent scroll-blocking
    ...
}, [debouncedQuery]);
```
- *"How is search optimized?"* -> It uses a custom `useDebounce` hook holding `searchQuery` inside of `header.tsx` with a `300ms` delay. This prevents filtering loop lag matching against the array while the user is rapidly typing mid-word.

### Account State Logic
```tsx
<div className="p-3 border-b border-gray-100">
  <p className="text-xs text-gray-500">Welcome</p>
  <p className="text-sm font-semibold text-gray-900">
    John Doe (Demo)
  </p>
</div>
```
When hovering over the profile icon, `userMenuOpen` triggers conditionally to block out the "Sign In" pathing entirely per the recent modifications. Interaction points strictly navigate to `href="/dashboard"` statically. 

---

## Part 4: View Layers & The Server Component Lifecycle

### `src/pages/HomePage.tsx` (Top level orchestration)
This file represents the absolute layout block returned by `app/page.tsx`.

```tsx
const [featuredProducts, dealProducts, categories] = await Promise.all([
  getFeaturedProducts(),
  getDealProducts(),
  getCategories(),
]);
```
- **Performance Key**: Often called *"Waterfalling"*, running `await getFeatured()` then `await getDealProducts()` would take $50ms + 50ms = 100ms$. Instead, the `Promise.all` fires all 3 requests to memory concurrently, bringing total execution time down to $max(50ms)$ total. 

It then manually slices elements out contextually before providing them to dumb components (components that only render what they are handed, without side effects):
```tsx
<ProductSection
  products={featuredProducts.slice(0, 8)} // Chops off any featured array > 8
/>
```

### Next JS Overrides & Configs (`src/app/layout.tsx`)
This file intercepts the `DOM` completely replacing standardized React configurations.
```tsx
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
```
- **Typography Engine:** Rather than downloading fonts from Google (blocking paint cycles), Next.js internally fetches `Inter`, embeds it into the compiled build during runtime, and maps it via `--font-inter` using the `variable` flag, preventing any FOUT (Flash Of Unstyled Text).

## Summary To Aid Documentation Queries
* If asked **"Where is backend data fetched?"** -> `src/services/product.service.ts` parses local static dictionaries to mock an async architecture.
* If asked **"How does the shop preserve state across refreshes?"** -> `Zustand (persist)` local storage bindings inside `src/store/cart-store.ts`.
* If asked **"How is performance preserved for imagery?"** -> `next/image` handles size scaling logic strictly inside `product-card.tsx` dependent on viewport break constraints natively.
* If asked **"Why are API route files gone?"** -> The web demo operates as a Server Rendered Static View; eliminating sub-routing like `/auth` entirely.
