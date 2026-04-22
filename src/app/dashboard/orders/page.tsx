import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Package, ChevronRight, Truck } from "lucide-react";
import { demoOrders } from "@/data";
import { formatPrice, formatDate } from "@/lib/utils";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your ShopVerse orders.",
};

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  pending: { color: "text-yellow-700", bg: "bg-yellow-50" },
  confirmed: { color: "text-blue-700", bg: "bg-blue-50" },
  processing: { color: "text-indigo-700", bg: "bg-indigo-50" },
  shipped: { color: "text-purple-700", bg: "bg-purple-50" },
  delivered: { color: "text-green-700", bg: "bg-green-50" },
  cancelled: { color: "text-red-700", bg: "bg-red-50" },
};

export default function OrdersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Orders" },
        ]}
      />

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-6 mb-8">
        My Orders
      </h1>

      {demoOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your order history will appear here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {demoOrders.map((order) => {
            const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="text-sm font-bold text-gray-900">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Placed on</p>
                      <p className="text-sm font-medium text-gray-700">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusStyle.bg} ${statusStyle.color} text-xs font-semibold rounded-lg capitalize`}
                  >
                    {order.status === "shipped" && (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 items-center"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-4 sm:px-6 sm:py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {order.paymentMethod}
                  </p>
                  <Link
                    href={`/dashboard/orders`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
