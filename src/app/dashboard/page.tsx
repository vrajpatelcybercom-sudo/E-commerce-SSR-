import Link from "next/link";
import { Package, User, Settings, ShoppingBag, Heart, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your ShopVerse account, orders, and preferences.",
};

const MENU_ITEMS = [
  {
    icon: Package,
    label: "My Orders",
    description: "Track and manage your orders",
    href: "#",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: User,
    label: "Profile",
    description: "Update your personal information",
    href: "#",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: MapPin,
    label: "Addresses",
    description: "Manage your shipping addresses",
    href: "#",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Heart,
    label: "Wishlist",
    description: "Products you've saved for later",
    href: "/products",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: ShoppingBag,
    label: "Continue Shopping",
    description: "Browse our latest products",
    href: "/products",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Settings,
    label: "Settings",
    description: "Account preferences and security",
    href: "#",
    color: "bg-gray-100 text-gray-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-black">JD</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Welcome back, John!
            </h1>
            <p className="text-sm text-white/80 mt-0.5">
              Manage your account and view your orders
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: "3" },
          { label: "Pending", value: "1" },
          { label: "Delivered", value: "1" },
          { label: "Wishlist", value: "5" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 text-center"
          >
            <p className="text-2xl font-extrabold text-gray-900">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all group"
          >
            <div
              className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {item.label}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
