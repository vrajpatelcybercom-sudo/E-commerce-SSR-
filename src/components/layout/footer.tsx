"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/lib/utils";

const FOOTER_LINKS = {
  "Get to Know Us": [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Press Releases", href: "#" },
    { label: "ShopVerse Science", href: "#" },
  ],
  "Make Money with Us": [
    { label: "Sell on ShopVerse", href: "#" },
    { label: "Become an Affiliate", href: "#" },
    { label: "Advertise Your Products", href: "#" },
    { label: "Self-Publish with Us", href: "#" },
  ],
  "Let Us Help You": [
    { label: "Your Account", href: "/dashboard" },
    { label: "Your Orders", href: "/dashboard/orders" },
    { label: "Shipping Rates & Policies", href: "#" },
    { label: "Returns & Replacements", href: "#" },
    { label: "Help", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-auto">
      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-gray-800 hover:bg-gray-700 transition-colors py-3 text-sm font-medium text-white"
      >
        Back to top ↑
      </button>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-lg font-extrabold text-white">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {SITE_CONFIG.description}
            </p>
            <div className="flex gap-3">
              {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors text-xs font-bold text-gray-400 hover:text-white"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
