"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Lock,
  Check,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { addressSchema, AddressFormData } from "@/schema";
import { useMounted } from "@/hooks";

export default function CheckoutPage() {
  const mounted = useMounted();
  const router = useRouter();
  const { items, getSubtotal, getTax, getShipping, getTotal, clearCart } =
    useCartStore();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [address, setAddress] = useState<AddressFormData>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
  });

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 skeleton w-48" />
          <div className="h-64 skeleton" />
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-6">Add some items to proceed to checkout.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-3xl flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 mb-2">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Order ID: ORD-{Date.now().toString(36).toUpperCase()}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl"
          >
            View Orders
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = () => {
    const result = addressSchema.safeParse(address);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setOrderComplete(true);
    setProcessing(false);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-gray-50 border ${
      errors[field] ? "border-red-300" : "border-gray-200"
    } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
        Checkout
      </h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {[
          { num: 1, label: "Shipping" },
          { num: 2, label: "Payment" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s.num
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-sm font-medium ${
                step >= s.num ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
            {s.num < 2 && (
              <div className="w-12 sm:w-20 h-0.5 bg-gray-200 mx-2">
                <div
                  className={`h-full bg-indigo-600 transition-all ${
                    step > s.num ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) =>
                      setAddress({ ...address, fullName: e.target.value })
                    }
                    className={inputClass("fullName")}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className={inputClass("street")}
                    placeholder="123 Main Street, Apt 4B"
                  />
                  {errors.street && (
                    <p className="text-xs text-red-500 mt-1">{errors.street}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className={inputClass("city")}
                    placeholder="San Francisco"
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    className={inputClass("state")}
                    placeholder="California"
                  />
                  {errors.state && (
                    <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) =>
                      setAddress({ ...address, zipCode: e.target.value })
                    }
                    className={inputClass("zipCode")}
                    placeholder="94105"
                  />
                  {errors.zipCode && (
                    <p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    className={inputClass("phone")}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddressSubmit}
                className="mt-6 w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Payment Information
              </h2>

              {/* Demo Card */}
              <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white mb-6">
                <div className="flex items-center justify-between mb-8">
                  <CreditCard className="w-8 h-8" />
                  <span className="text-xs opacity-70">VISA</span>
                </div>
                <p className="text-lg tracking-widest mb-4 font-mono">
                  •••• •••• •••• 4242
                </p>
                <div className="flex justify-between text-xs opacity-70">
                  <span>DEMO CARDHOLDER</span>
                  <span>12/28</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
                <p className="font-semibold">🔒 Demo Mode</p>
                <p className="text-xs mt-1">
                  This is a demo checkout. No real payment will be processed.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Place Order — {formatPrice(getTotal())}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-36">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(product.price)} × {quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(getTax())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {getShipping() === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    formatPrice(getShipping())
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
