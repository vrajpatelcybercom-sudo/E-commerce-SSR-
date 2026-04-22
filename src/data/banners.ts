import { BannerSlide, Order } from "@/types";

export const bannerSlides: BannerSlide[] = [
  {
    id: "1",
    title: "Summer Tech Sale",
    subtitle: "Up to 50% Off",
    description:
      "Discover incredible deals on the latest electronics, gadgets, and smart devices. Limited time offer!",
    ctaText: "Shop Electronics",
    ctaLink: "/products?category=Electronics",
    bgGradient: "from-violet-900 via-purple-800 to-indigo-900",
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&q=80",
  },
  {
    id: "2",
    title: "New Fashion Arrivals",
    subtitle: "Style Redefined",
    description:
      "Explore the latest trends in fashion. Premium clothing, footwear, and accessories for every occasion.",
    ctaText: "Explore Fashion",
    ctaLink: "/products?category=Fashion",
    bgGradient: "from-rose-900 via-pink-800 to-fuchsia-900",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  },
  {
    id: "3",
    title: "Home Essentials",
    subtitle: "Transform Your Space",
    description:
      "Premium furniture, décor, and kitchen essentials to make your house a home. Free shipping on orders over $99.",
    ctaText: "Shop Home",
    ctaLink: "/products?category=Home+%26+Garden",
    bgGradient: "from-emerald-900 via-teal-800 to-cyan-900",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
  },
];

export const demoOrders: Order[] = [
  {
    id: "ORD-2024-001",
    userId: "demo-user",
    items: [
      {
        productId: "1",
        productName: "Premium Wireless Headphones Pro",
        productImage:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
        price: 199.99,
        quantity: 1,
      },
      {
        productId: "11",
        productName: "Wireless Gaming Mouse Viper X",
        productImage:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80",
        price: 79.99,
        quantity: 1,
      },
    ],
    subtotal: 279.98,
    tax: 22.4,
    shipping: 0,
    total: 302.38,
    status: "delivered",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Visa ending in 4242",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-20T14:30:00Z",
  },
  {
    id: "ORD-2024-002",
    userId: "demo-user",
    items: [
      {
        productId: "7",
        productName: "Premium Running Shoes AirStride",
        productImage:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
        price: 159.99,
        quantity: 2,
      },
    ],
    subtotal: 319.98,
    tax: 25.6,
    shipping: 9.99,
    total: 355.57,
    status: "shipped",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Mastercard ending in 8888",
    createdAt: "2024-03-22T10:00:00Z",
    updatedAt: "2024-03-24T09:00:00Z",
  },
  {
    id: "ORD-2024-003",
    userId: "demo-user",
    items: [
      {
        productId: "12",
        productName: "Natural Skincare Collection - Complete Set",
        productImage:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80",
        price: 89.99,
        quantity: 1,
      },
    ],
    subtotal: 89.99,
    tax: 7.2,
    shipping: 5.99,
    total: 103.18,
    status: "processing",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Visa ending in 4242",
    createdAt: "2024-03-25T10:00:00Z",
    updatedAt: "2024-03-25T10:00:00Z",
  },
];
