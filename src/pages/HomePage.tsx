import { getFeaturedProducts, getDealProducts, getCategories } from "@/services/product.service";
import { bannerSlides } from "@/data";
import HeroCarousel from "@/components/home/hero-carousel";
import CategoriesGrid from "@/components/home/categories-grid";
import ProductSection from "@/components/home/product-section";
import DealsBar from "@/components/home/deals-bar";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const TRUST_BADGES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $99",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "256-bit SSL encryption",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
  },
];

export default async function HomePage() {
  const [featuredProducts, dealProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getDealProducts(),
    getCategories(),
  ]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <HeroCarousel slides={bannerSlides} />
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all"
            >
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-900">
                  {badge.title}
                </h3>
                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoriesGrid categories={categories} />
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductSection
          title="Featured Products"
          subtitle="Handpicked favorites by our team"
          products={featuredProducts.slice(0, 8)}
          viewAllHref="/products"
          viewAllLabel="View All Products"
        />
      </div>

      {/* Deals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DealsBar products={dealProducts} />
      </div>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 p-8 sm:p-12 lg:p-16">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Join the ShopVerse Family
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Subscribe to our newsletter and get exclusive deals, early access
              to sales, and personalized recommendations delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all hover:scale-105 active:scale-95 shadow-lg text-sm whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
