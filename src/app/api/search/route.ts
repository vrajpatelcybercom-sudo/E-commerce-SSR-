import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/services/product.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const products = await searchProducts(query);
  const results = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.images[0],
  }));

  return NextResponse.json({ results });
}
