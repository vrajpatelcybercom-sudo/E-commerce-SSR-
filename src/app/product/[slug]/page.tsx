import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, Check, Truck, Shield, RotateCcw } from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  getProductReviews,
  getAllProductSlugs,
} from "@/services/product.service";
import { formatPrice, formatDate, SITE_CONFIG } from "@/lib/utils";
import ImageGallery from "@/components/product/image-gallery";
import AddToCartButton from "@/components/product/add-to-cart-button";
import ProductCard from "@/components/product/product-card";
import Breadcrumbs from "@/components/ui/breadcrumbs";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `${SITE_CONFIG.url}/product/${product.slug}`,
      images: product.images.map((img) => ({
        url: img,
        width: 800,
        height: 800,
        alt: product.name,
      })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product),
    getProductReviews(product.id),
  ]);

  // JSON-LD Product Schema
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}/product/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />

        {/* Product Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <ImageGallery images={product.images} alt={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-indigo-600 mb-1">
                {product.brand}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {product.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>
              {product.price < 99 && (
                <p className="text-xs text-gray-500 mt-1.5">
                  + $9.99 shipping (Free on orders over $99)
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    In Stock
                  </span>
                  {product.stockCount < 20 && (
                    <span className="text-sm text-orange-600">
                      — Only {product.stockCount} left!
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm font-medium text-red-600">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Features */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product} variant="detail" />

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              {[
                { icon: Truck, text: "Free Delivery" },
                { icon: Shield, text: "2-Year Warranty" },
                { icon: RotateCcw, text: "30-Day Return" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex flex-col items-center text-center gap-1.5"
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <section className="mt-16">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">
            Specifications
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {Object.entries(product.specifications).map(
              ([key, value], idx) => (
                <div
                  key={key}
                  className={`grid grid-cols-3 gap-4 px-6 py-3.5 ${
                    idx % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-500">
                    {key}
                  </span>
                  <span className="text-sm text-gray-900 col-span-2">
                    {value}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Full Description */}
        <section className="mt-16">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">
            About This Product
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">
            Customer Reviews ({reviews.length})
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-600">
                        {review.userName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {review.userName}
                        </span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                            <Check className="w-3 h-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mt-2">
                        {review.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {review.comment}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span>{formatDate(review.createdAt)}</span>
                        <span>
                          {review.helpful} people found this helpful
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-sm text-gray-500">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
